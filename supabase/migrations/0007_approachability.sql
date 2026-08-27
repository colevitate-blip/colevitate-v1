-- Opt-in discovery & approachability (Tier 5). Lets a user become visible
-- in a browsable pool and receive lightweight, context-carrying "approach"
-- requests from strangers — entirely separate from `pairings`: an accepted
-- approach never creates a pairings row and never touches the paid
-- Compatibility Report/Stripe flow (see src/lib/stripe/).
--
-- `approachable`/`approachable_scope`/`approachable_intents` are a distinct
-- opt-in from `is_public`/`share_slug` (0002_profile_and_sharing.sql):
-- is_public exposes the FULL combined profile to anyone holding the share
-- link; approachable exposes only a slim derived snapshot to any browsing
-- user, which is a much bigger exposure surface and needs the same
-- minimization principle pairings.sql already established — never the raw
-- `results` jsonb, only a denormalized axes/archetype snapshot.
--
-- Postgres RLS is row-level, not column-level: a `using (approachable =
-- true)` select policy directly on `profiles` would expose the entire row
-- (including raw `results`) to any browsing user, and column-level grants
-- can't fix that because grants are per-role, not per-row. So the on/off
-- *state* lives on `profiles`, but the *browsable payload* lives in the
-- separate `approachable_snapshots` table below — the same
-- denormalize-instead-of-expose move `team_members` already makes for
-- team rosters (0003_teams.sql).

alter table public.profiles
  add column approachable boolean not null default false,
  add column approachable_scope text not null default 'paused'
    check (approachable_scope in ('everyone', 'intents', 'paused')),
  add column approachable_intents text[]
    check (approachable_intents is null or approachable_intents <@ array['friend', 'romantic', 'professional']);

-- Slim, denormalized snapshot of an approachable user — the only thing a
-- browsing stranger can ever see. Row only exists while approachable is
-- on; set_approachable() below deletes it the instant a user pauses, so
-- there's never a stale exposed snapshot after opt-out.
create table public.approachable_snapshots (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  axes jsonb not null,
  archetype_name text,
  updated_at timestamptz not null default now()
);

alter table public.approachable_snapshots enable row level security;

-- Blocks: a user manages only their own block list directly. Checking "did
-- the OTHER party block me" needs to read rows the caller doesn't own, so
-- that check goes through the security-definer is_blocked() helper below —
-- same recursion-avoidance shape as is_team_member() (0003_teams.sql).
create table public.blocks (
  blocker_id uuid not null references auth.users (id) on delete cascade,
  blocked_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

alter table public.blocks enable row level security;

create policy "Users can select their own blocks"
  on public.blocks for select
  using (auth.uid() = blocker_id);

create policy "Users can insert their own blocks"
  on public.blocks for insert
  with check (auth.uid() = blocker_id);

create policy "Users can delete their own blocks (unblock)"
  on public.blocks for delete
  using (auth.uid() = blocker_id);

create or replace function public.is_blocked(a uuid, b uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.blocks
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

-- Only approachable, non-paused, non-blocked snapshots are ever selectable.
-- No direct client insert/update policy exists on this table at all —
-- set_approachable() (security definer, below) is the only writer.
create policy "Anyone can select non-blocked approachable snapshots"
  on public.approachable_snapshots for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = user_id and p.approachable = true and p.approachable_scope <> 'paused'
    )
    and not public.is_blocked(user_id, auth.uid())
    and not public.is_blocked(auth.uid(), user_id)
  );

-- Toggles a user's own approachability state and keeps the profiles flags
-- and the browsable snapshot row in sync in one transaction. This is the
-- only path that ever writes profiles.approachable/approachable_scope/
-- approachable_intents or approachable_snapshots — turning off deletes the
-- snapshot outright rather than leaving a stale row with approachable=false
-- sitting around.
create or replace function public.set_approachable(
  p_on boolean,
  p_scope text,
  p_intents text[],
  p_axes jsonb,
  p_archetype_name text,
  p_display_name text,
  p_avatar_url text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_scope not in ('everyone', 'intents', 'paused') then
    raise exception 'Invalid scope';
  end if;

  update public.profiles
  set approachable = p_on and p_scope <> 'paused',
      approachable_scope = p_scope,
      approachable_intents = p_intents
  where id = auth.uid();

  if p_on and p_scope <> 'paused' then
    if p_axes is null then
      raise exception 'Complete at least 2 assessments before becoming approachable';
    end if;
    insert into public.approachable_snapshots (user_id, display_name, avatar_url, axes, archetype_name, updated_at)
    values (auth.uid(), p_display_name, p_avatar_url, p_axes, p_archetype_name, now())
    on conflict (user_id) do update
      set display_name = excluded.display_name,
          avatar_url = excluded.avatar_url,
          axes = excluded.axes,
          archetype_name = excluded.archetype_name,
          updated_at = now();
  else
    delete from public.approachable_snapshots where user_id = auth.uid();
  end if;
end;
$$;

grant execute on function public.set_approachable(boolean, text, text[], jsonb, text, text, text) to authenticated;

-- A context-carrying request from a stranger, entirely separate from
-- pairings. Unlike pairings (which allows a direct client insert of the
-- inviter's own columns — see 0004_pairings.sql), sending an approach
-- needs cross-user validation up front (is the recipient actually
-- approachable? scope/intent match? blocked? rate limit?) that a plain
-- RLS with_check can't express, so there is no direct client insert or
-- update policy on this table at all — every write goes through the
-- security-definer functions below.
create table public.approach_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users (id) on delete cascade,
  recipient_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired', 'withdrawn')),
  intent text not null check (intent in ('friend', 'romantic', 'professional')),
  -- Enforceable floor only — genuine "not generic" is a UX nudge (the
  -- compose UI's placeholder encourages referencing something specific on
  -- the recipient's profile), not something a length check can verify.
  message text not null check (char_length(btrim(message)) >= 20),
  sender_display_name text,
  sender_avatar_url text,
  sender_axes jsonb,
  sender_archetype_name text,
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  expires_at timestamptz not null default (now() + interval '30 days')
);

alter table public.approach_requests enable row level security;

create policy "Parties can select their approach request"
  on public.approach_requests for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

-- Mirrors pairing_events' shape, but every row here is written by the
-- security-definer functions themselves (never a direct client insert,
-- unlike pairing_events) — possible because sends here are already
-- funneled through send_approach_request, so there's no separate,
-- spoofable client-insert path to guard against.
create table public.approach_events (
  id uuid primary key default gen_random_uuid(),
  approach_request_id uuid references public.approach_requests (id) on delete cascade,
  event_type text not null check (event_type in (
    'approach_sent', 'approach_accepted', 'approach_declined',
    'approach_withdrawn', 'approach_expired', 'user_blocked', 'user_reported'
  )),
  user_id uuid references auth.users (id) on delete set null,
  occurred_at timestamptz not null default now(),
  metadata jsonb
);

alter table public.approach_events enable row level security;

create policy "Parties can select events on their approach requests"
  on public.approach_events for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.approach_requests r
      where r.id = approach_request_id and (r.sender_id = auth.uid() or r.recipient_id = auth.uid())
    )
  );

-- No rate limit exists on pairings because an invite code must already be
-- known — it's not a cold-outreach surface. Approach requests are, so the
-- send path enforces a server-side cap (not just a UI hint) on top of the
-- blocked/approachable/intent checks.
create or replace function public.send_approach_request(
  p_recipient_id uuid,
  p_message text,
  p_intent text,
  p_sender_axes jsonb,
  p_sender_archetype_name text,
  p_sender_display_name text,
  p_sender_avatar_url text
)
returns public.approach_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.approach_requests;
  recipient_scope text;
  recipient_intents text[];
  recent_count integer;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if auth.uid() = p_recipient_id then
    raise exception 'Cannot approach yourself';
  end if;
  if p_intent not in ('friend', 'romantic', 'professional') then
    raise exception 'Invalid intent';
  end if;
  if char_length(btrim(p_message)) < 20 then
    raise exception 'Message is too short';
  end if;
  if public.is_blocked(auth.uid(), p_recipient_id) then
    raise exception 'Unable to send this request';
  end if;

  select approachable_scope, approachable_intents into recipient_scope, recipient_intents
  from public.profiles
  where id = p_recipient_id and approachable = true;

  if recipient_scope is null or recipient_scope = 'paused' then
    raise exception 'This person is not currently approachable';
  end if;
  if recipient_scope = 'intents' and not (p_intent = any(recipient_intents)) then
    raise exception 'This person is not open to that kind of approach';
  end if;

  select count(*) into recent_count
  from public.approach_requests
  where sender_id = auth.uid() and created_at > now() - interval '24 hours';
  if recent_count >= 20 then
    raise exception 'You have reached the daily limit for approach requests';
  end if;

  insert into public.approach_requests (
    sender_id, recipient_id, intent, message,
    sender_display_name, sender_avatar_url, sender_axes, sender_archetype_name
  )
  values (
    auth.uid(), p_recipient_id, p_intent, btrim(p_message),
    p_sender_display_name, p_sender_avatar_url, p_sender_axes, p_sender_archetype_name
  )
  returning * into result;

  insert into public.approach_events (approach_request_id, event_type, user_id)
  values (result.id, 'approach_sent', auth.uid());

  return result;
end;
$$;

grant execute on function public.send_approach_request(uuid, text, text, jsonb, text, text, text) to authenticated;

create or replace function public.accept_approach_request(p_id uuid)
returns public.approach_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.approach_requests;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.approach_requests
  set status = 'accepted', responded_at = now()
  where id = p_id
    and recipient_id = auth.uid()
    and status = 'pending'
    and expires_at > now()
  returning * into result;

  if result.id is null then
    raise exception 'This request is no longer available';
  end if;

  insert into public.approach_events (approach_request_id, event_type, user_id)
  values (result.id, 'approach_accepted', auth.uid());

  return result;
end;
$$;

grant execute on function public.accept_approach_request(uuid) to authenticated;

create or replace function public.decline_approach_request(p_id uuid)
returns public.approach_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.approach_requests;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.approach_requests
  set status = 'declined', responded_at = now()
  where id = p_id
    and recipient_id = auth.uid()
    and status = 'pending'
    and expires_at > now()
  returning * into result;

  if result.id is null then
    raise exception 'This request is no longer available';
  end if;

  insert into public.approach_events (approach_request_id, event_type, user_id)
  values (result.id, 'approach_declined', auth.uid());

  return result;
end;
$$;

grant execute on function public.decline_approach_request(uuid) to authenticated;

create or replace function public.withdraw_approach_request(p_id uuid)
returns public.approach_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.approach_requests;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.approach_requests
  set status = 'withdrawn', responded_at = now()
  where id = p_id
    and sender_id = auth.uid()
    and status = 'pending'
  returning * into result;

  if result.id is null then
    raise exception 'This request is no longer available';
  end if;

  insert into public.approach_events (approach_request_id, event_type, user_id)
  values (result.id, 'approach_withdrawn', auth.uid());

  return result;
end;
$$;

grant execute on function public.withdraw_approach_request(uuid) to authenticated;

-- No cron/job runner exists in this repo (no supabase/config.toml, no
-- scheduled functions elsewhere), so expiry is lazy rather than swept in
-- the background: accept/decline already reject a past-expiry row via the
-- `expires_at > now()` guard above, and this function flips the caller's
-- own past-expiry pending *received* requests to 'expired' — called
-- opportunistically when the recipient's inbox loads.
create or replace function public.expire_stale_approach_requests()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  expired_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  for expired_id in
    update public.approach_requests
    set status = 'expired'
    where recipient_id = auth.uid()
      and status = 'pending'
      and expires_at <= now()
    returning id
  loop
    insert into public.approach_events (approach_request_id, event_type, user_id)
    values (expired_id, 'approach_expired', auth.uid());
  end loop;
end;
$$;

grant execute on function public.expire_stale_approach_requests() to authenticated;

-- Blocking removes visibility both ways (enforced by is_blocked() in the
-- approachable_snapshots policy and send_approach_request above) and
-- auto-declines any pending request between the pair so it doesn't linger
-- actionable after the block.
create or replace function public.block_user(p_blocked_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if auth.uid() = p_blocked_id then
    raise exception 'Cannot block yourself';
  end if;

  insert into public.blocks (blocker_id, blocked_id)
  values (auth.uid(), p_blocked_id)
  on conflict (blocker_id, blocked_id) do nothing;

  update public.approach_requests
  set status = 'declined', responded_at = now()
  where status = 'pending'
    and ((sender_id = auth.uid() and recipient_id = p_blocked_id)
      or (sender_id = p_blocked_id and recipient_id = auth.uid()));

  insert into public.approach_events (event_type, user_id, metadata)
  values ('user_blocked', auth.uid(), jsonb_build_object('blocked_id', p_blocked_id));
end;
$$;

grant execute on function public.block_user(uuid) to authenticated;

-- No admin/moderation surface exists anywhere in this codebase — reports
-- land here for a future tier to review rather than a speculative admin
-- panel being built now. A user can see their own submitted reports only.
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reported_user_id uuid not null references auth.users (id) on delete cascade,
  reported_approach_request_id uuid references public.approach_requests (id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Reporters can select their own reports"
  on public.reports for select
  using (auth.uid() = reporter_id);

create policy "Reporters can insert their own reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create or replace function public.submit_report(
  p_reported_user_id uuid,
  p_reported_approach_request_id uuid,
  p_reason text,
  p_details text
)
returns public.reports
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.reports;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_reason is null or btrim(p_reason) = '' then
    raise exception 'A reason is required';
  end if;

  insert into public.reports (reporter_id, reported_user_id, reported_approach_request_id, reason, details)
  values (auth.uid(), p_reported_user_id, p_reported_approach_request_id, btrim(p_reason), p_details)
  returning * into result;

  insert into public.approach_events (approach_request_id, event_type, user_id, metadata)
  values (p_reported_approach_request_id, 'user_reported', auth.uid(), jsonb_build_object('reported_user_id', p_reported_user_id));

  return result;
end;
$$;

grant execute on function public.submit_report(uuid, uuid, text, text) to authenticated;

-- Full deletion of a user's approachability footprint (5.5): the profile
-- flags reset, the snapshot goes away, and any of the user's own pending
-- approach requests (sent or received) resolve rather than linger
-- unreachable. Historical accepted/declined/expired rows are left as an
-- audit trail (mirrors pairings never deleting rows on revoke), but hold
-- no raw personality data — only the same slim snapshot already governed
-- by the minimization principle above.
create or replace function public.delete_approachability_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.profiles
  set approachable = false, approachable_scope = 'paused', approachable_intents = null
  where id = auth.uid();

  delete from public.approachable_snapshots where user_id = auth.uid();

  update public.approach_requests
  set status = 'withdrawn', responded_at = now()
  where sender_id = auth.uid() and status = 'pending';

  update public.approach_requests
  set status = 'declined', responded_at = now()
  where recipient_id = auth.uid() and status = 'pending';
end;
$$;

grant execute on function public.delete_approachability_data() to authenticated;
