-- Pairings: a consent-based invite/comparison between two users, plus the
-- payment ledger and lightweight funnel log for the Compatibility Report.
--
-- Like team_members' axes/archetype_name, this only ever stores slim
-- derived axis snapshots (never raw PersonalityResults jsonb) — captured
-- at invite/accept time so a later edit to either person's own profile
-- doesn't retroactively change a report the other party already
-- consented to.
create table public.pairings (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references auth.users (id) on delete cascade,
  invitee_id uuid references auth.users (id) on delete cascade,
  invite_code text not null unique,
  relationship_type text not null check (relationship_type in ('romantic', 'friend', 'coworker', 'manager')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'revoked')),
  -- Set by the invitee at accept time: 'axes' shares full derived axis
  -- positions back to the inviter, 'summary_only' shares only the
  -- descriptive comparison sentence, never a numeric score.
  consent_share_level text check (consent_share_level in ('summary_only', 'axes')),
  inviter_display_name text,
  invitee_display_name text,
  inviter_axes jsonb,
  invitee_axes jsonb,
  inviter_archetype_name text,
  invitee_archetype_name text,
  -- Set only by the Stripe webhook (service role) once the report is paid for.
  unlocked_at timestamptz,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  revoked_at timestamptz
);

alter table public.pairings enable row level security;

create policy "Parties can select their pairing"
  on public.pairings for select
  using (auth.uid() = inviter_id or auth.uid() = invitee_id);

create policy "Inviter can insert their own pairing"
  on public.pairings for insert
  with check (auth.uid() = inviter_id);

-- RLS row policies can't restrict which COLUMNS an insert/update touches —
-- only which rows. Without a matching column grant, a client satisfying
-- the insert policy above could set invitee_id/status/unlocked_at
-- directly in the same call, skipping consent (and payment) entirely.
-- This grant limits a client-side insert to exactly what
-- createPairingInvite legitimately sets; invitee_id/status/unlocked_at
-- etc. are left at their column defaults (null/'pending') and can only
-- ever be changed by the security-definer RPCs below or the Stripe
-- webhook's service-role client.
revoke insert on public.pairings from authenticated;
grant insert (inviter_id, invite_code, relationship_type, inviter_display_name, inviter_axes, inviter_archetype_name)
  on public.pairings to authenticated;

-- The only update a client can make directly is the inviter revoking
-- their own still-pending invite — with_check pins the only value this
-- policy can ever write for status, closing off using this same grant to
-- smuggle in an invitee_id/consent_share_level/axes change.
create policy "Inviter can revoke their pairing"
  on public.pairings for update
  using (auth.uid() = inviter_id)
  with check (auth.uid() = inviter_id and status = 'revoked');

revoke update on public.pairings from authenticated;
grant update (status) on public.pairings to authenticated;

-- Lets the branded invite landing page show "{inviter} wants to compare
-- with you" before the visitor has any relationship to this row (no
-- select policy grants that pre-claim) — same trust model as
-- join_team_by_code: harmless to expose, but only reachable by knowing
-- the unguessable invite_code, and deliberately never returns axes.
create or replace function public.get_pairing_invite_preview(code text)
returns table (
  id uuid,
  inviter_display_name text,
  relationship_type text,
  status text
)
language sql
security definer
set search_path = public
stable
as $$
  select id, inviter_display_name, relationship_type, status
  from public.pairings
  where invite_code = code;
$$;

grant execute on function public.get_pairing_invite_preview(text) to authenticated, anon;

-- Atomically claims a pending, unclaimed invite for the calling user and
-- records their own axes snapshot + consent choice in one step. Security
-- definer (like join_team_by_code) so it can set invitee_id/status/
-- consent_share_level/invitee_axes regardless of the client's own column
-- grants above — those grants intentionally don't cover this path, so
-- this function is the *only* way those columns ever change. The
-- `where status = 'pending' and invitee_id is null` guard makes
-- concurrent claims on the same code safe: Postgres serializes the
-- competing updates, so the loser's guard simply fails to match once the
-- winner has committed.
create or replace function public.accept_pairing_invite(
  p_code text,
  p_share_level text,
  p_display_name text,
  p_axes jsonb,
  p_archetype_name text
)
returns public.pairings
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.pairings;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_share_level not in ('summary_only', 'axes') then
    raise exception 'Invalid share level';
  end if;

  update public.pairings
  set invitee_id = auth.uid(),
      status = 'accepted',
      consent_share_level = p_share_level,
      invitee_display_name = p_display_name,
      invitee_axes = p_axes,
      invitee_archetype_name = p_archetype_name,
      accepted_at = now()
  where invite_code = p_code
    and status = 'pending'
    and invitee_id is null
  returning * into result;

  if result.id is null then
    raise exception 'This invite is no longer available';
  end if;

  return result;
end;
$$;

grant execute on function public.accept_pairing_invite(text, text, text, jsonb, text) to authenticated;

create or replace function public.decline_pairing_invite(p_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.pairings
  set status = 'declined'
  where invite_code = p_code
    and status = 'pending'
    and invitee_id is null;
end;
$$;

grant execute on function public.decline_pairing_invite(text) to authenticated;

-- Payment ledger for Compatibility Report unlocks. One paid row per
-- pairing unlocks the report for both parties (it's a report about the
-- pair, not a per-user purchase). status only ever moves pending -> paid
-- from the Stripe webhook via the service-role client, never from a
-- client update — no update policy (and so no update grant) exists for
-- `authenticated` on this table at all.
create table public.pairing_purchases (
  id uuid primary key default gen_random_uuid(),
  pairing_id uuid not null references public.pairings (id) on delete cascade,
  purchaser_id uuid not null references auth.users (id) on delete cascade,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.pairing_purchases enable row level security;

create policy "Purchaser can select their purchases"
  on public.pairing_purchases for select
  using (auth.uid() = purchaser_id);

create policy "Purchaser can insert a pending purchase"
  on public.pairing_purchases for insert
  with check (auth.uid() = purchaser_id);

-- Excludes status/paid_at/stripe_payment_intent_id — a client can create
-- the pending row that a Checkout Session gets built from, but can never
-- mark itself paid.
revoke insert on public.pairing_purchases from authenticated;
grant insert (pairing_id, purchaser_id, stripe_checkout_session_id, amount_cents, currency)
  on public.pairing_purchases to authenticated;

-- Minimal funnel log answering the spec's growth-mechanics metrics via
-- SQL (no analytics vendor exists in this repo). Insert-only from the
-- acting user's own session for the three user-initiated events; the
-- service-role webhook inserts 'report_unlocked' directly, bypassing RLS.
create table public.pairing_events (
  id uuid primary key default gen_random_uuid(),
  pairing_id uuid references public.pairings (id) on delete cascade,
  event_type text not null check (event_type in ('invite_created', 'invite_accepted', 'invite_declined', 'report_unlocked')),
  user_id uuid references auth.users (id) on delete set null,
  occurred_at timestamptz not null default now(),
  metadata jsonb
);

alter table public.pairing_events enable row level security;

create policy "Users can log their own pairing events"
  on public.pairing_events for insert
  with check (user_id = auth.uid());
