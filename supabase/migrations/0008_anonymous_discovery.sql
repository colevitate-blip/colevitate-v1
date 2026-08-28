-- Anonymous discovery: a user's real name/photo must never be visible to
-- another user until a connection between the two of them is mutually
-- accepted — sending an approach is the sender's declaration, accepting it
-- is the recipient's, and only then should either side see who the other
-- actually is (see docs/plan for the product decision this implements).
--
-- 0007_approachability.sql stored real display_name/avatar_url directly on
-- both approachable_snapshots (exposed via RLS to any non-blocked browsing
-- user, regardless of accept state) and approach_requests (exposed to the
-- recipient the instant a request is sent, before they've done anything).
-- That defeats the "anonymous until declared" requirement entirely — there
-- was nothing left to reveal by the time acceptance happened. This
-- migration removes raw identity from both tables outright and replaces it
-- with a generated pseudonym; real identity is computed live, on demand,
-- only by get_connection_identity() below, and only for an accepted
-- request's two parties.

alter table public.approachable_snapshots
  drop column display_name,
  drop column avatar_url,
  add column anon_label text not null default 'Anonymous';

alter table public.approach_requests
  drop column sender_display_name,
  drop column sender_avatar_url,
  drop column recipient_display_name,
  drop column recipient_avatar_url,
  add column sender_anon_label text,
  add column recipient_anon_label text;

-- Signature changed (display_name/avatar_url params replaced by anon_label),
-- so the old 7-arg overload must be dropped explicitly — create-or-replace
-- with a different parameter list creates a second overload instead of
-- replacing the original.
drop function if exists public.set_approachable(boolean, text, text[], jsonb, text, text, text);

-- anon_label is generated client-side (settings/actions.ts, same
-- adjective+animal petname style as profiles.share_slug) and passed in
-- rather than generated here, so the word lists live in one place. On
-- conflict it's deliberately NOT overwritten — an existing pseudonym stays
-- stable across settings edits (scope/intent changes, etc.) and only
-- changes if the user fully opts out and back in.
create or replace function public.set_approachable(
  p_on boolean,
  p_scope text,
  p_intents text[],
  p_axes jsonb,
  p_archetype_name text,
  p_anon_label text
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
    insert into public.approachable_snapshots (user_id, anon_label, axes, archetype_name, scope, intents, updated_at)
    values (auth.uid(), coalesce(p_anon_label, 'Anonymous'), p_axes, p_archetype_name, p_scope, p_intents, now())
    on conflict (user_id) do update
      set axes = excluded.axes,
          archetype_name = excluded.archetype_name,
          scope = excluded.scope,
          intents = excluded.intents,
          updated_at = now();
  else
    delete from public.approachable_snapshots where user_id = auth.uid();
  end if;
end;
$$;

grant execute on function public.set_approachable(boolean, text, text[], jsonb, text, text) to authenticated;

drop function if exists public.send_approach_request(uuid, text, text, jsonb, text, text, text);

-- sender_anon_label is generated client-side and frozen onto the row at
-- send time (same reasoning as sender_axes already was); recipient_anon_label
-- is looked up here from approachable_snapshots (security definer, so this
-- bypasses the sender's own lack of read access to a stranger's snapshot
-- row) purely so the sender's own "Sent" list has something to display —
-- neither column is ever real identity.
create or replace function public.send_approach_request(
  p_recipient_id uuid,
  p_message text,
  p_intent text,
  p_sender_axes jsonb,
  p_sender_archetype_name text,
  p_sender_anon_label text
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
  recipient_anon_label text;
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

  select approachable_scope, approachable_intents
  into recipient_scope, recipient_intents
  from public.profiles
  where id = p_recipient_id and approachable = true;

  if recipient_scope is null or recipient_scope = 'paused' then
    raise exception 'This person is not currently approachable';
  end if;
  if recipient_scope = 'intents' and not (p_intent = any(recipient_intents)) then
    raise exception 'This person is not open to that kind of approach';
  end if;

  select anon_label into recipient_anon_label
  from public.approachable_snapshots
  where user_id = p_recipient_id;

  select count(*) into recent_count
  from public.approach_requests
  where sender_id = auth.uid() and created_at > now() - interval '24 hours';
  if recent_count >= 20 then
    raise exception 'You have reached the daily limit for approach requests';
  end if;

  insert into public.approach_requests (
    sender_id, recipient_id, intent, message,
    sender_anon_label, sender_axes, sender_archetype_name,
    recipient_anon_label
  )
  values (
    auth.uid(), p_recipient_id, p_intent, btrim(p_message),
    p_sender_anon_label, p_sender_axes, p_sender_archetype_name,
    recipient_anon_label
  )
  returning * into result;

  insert into public.approach_events (approach_request_id, event_type, user_id)
  values (result.id, 'approach_sent', auth.uid());

  return result;
end;
$$;

grant execute on function public.send_approach_request(uuid, text, text, jsonb, text, text) to authenticated;

-- The only path through which a user's real display_name/avatar_url is ever
-- exposed to another user. Computed live from profiles (never stored on a
-- browsable/inbox row), and only returns anything when the caller is a
-- party to this specific request AND it's accepted — an empty result set
-- otherwise (not an error), so callers can just fall back to the anon label.
create or replace function public.get_connection_identity(p_request_id uuid)
returns table (display_name text, avatar_url text)
language plpgsql
security definer
set search_path = public
as $$
declare
  req public.approach_requests;
  counterpart_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into req from public.approach_requests where id = p_request_id;

  if req.id is null or req.status <> 'accepted' then
    return;
  end if;
  if auth.uid() <> req.sender_id and auth.uid() <> req.recipient_id then
    return;
  end if;

  counterpart_id := case when auth.uid() = req.sender_id then req.recipient_id else req.sender_id end;

  return query
    select p.display_name, p.avatar_url
    from public.profiles p
    where p.id = counterpart_id;
end;
$$;

grant execute on function public.get_connection_identity(uuid) to authenticated;
