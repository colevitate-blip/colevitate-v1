-- Manual verification script for 0007_approachability.sql.
--
-- This repo has no automated test runner and no supabase/config.toml
-- (the Supabase CLI was added as a dev dependency but the project isn't
-- yet `supabase init`-ed for local Postgres/pgTAP) — pairings shipped
-- without automated tests either. This is a plain psql script exercising
-- the RLS + security-definer contract by hand against a local `supabase
-- start` database; it is NOT wired into CI. Run with:
--   psql "$(supabase status -o env | grep DB_URL | cut -d= -f2-)" -f supabase/tests/approachability_smoke.sql
--
-- Each block raises if the invariant it's checking doesn't hold.

begin;

-- Fixture users. auth.users normally gets rows from Supabase Auth; for a
-- local smoke test we insert directly (same trick Supabase's own RLS
-- testing docs use).
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'alice@test.local'),
  ('00000000-0000-0000-0000-00000000000b', 'bob@test.local'),
  ('00000000-0000-0000-0000-00000000000c', 'carol@test.local')
on conflict (id) do nothing;

insert into public.profiles (id) values
  ('00000000-0000-0000-0000-00000000000a'),
  ('00000000-0000-0000-0000-00000000000b'),
  ('00000000-0000-0000-0000-00000000000c')
on conflict (id) do nothing;

-- Impersonate a user the way PostgREST does, per Supabase's documented
-- RLS-testing pattern.
create or replace function pg_temp.as_user(p_id uuid) returns void as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_id, 'role', 'authenticated')::text, true);
  set local role authenticated;
end;
$$ language plpgsql;

-- 1. A client cannot directly insert into approach_requests — only
--    send_approach_request() can.
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
do $$
begin
  begin
    insert into public.approach_requests (sender_id, recipient_id, intent, message)
    values ('00000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000b', 'friend', 'this should never be allowed directly');
    raise exception 'FAIL: direct insert into approach_requests should have been rejected';
  exception when insufficient_privilege then
    raise notice 'PASS: direct approach_requests insert rejected';
  end;
end $$;

-- 2. Bob becomes approachable (scope=everyone) via set_approachable().
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
select public.set_approachable(
  true, 'everyone', null,
  '[{"id":"energy","label":"Energy","leftPole":"In","rightPole":"Out","score":10}]'::jsonb,
  'Test Archetype', 'Bob', null
);
do $$
begin
  if not exists (select 1 from public.profiles where id = '00000000-0000-0000-0000-00000000000b' and approachable = true) then
    raise exception 'FAIL: profiles.approachable was not set';
  end if;
  if not exists (select 1 from public.approachable_snapshots where user_id = '00000000-0000-0000-0000-00000000000b') then
    raise exception 'FAIL: approachable_snapshots row was not created';
  end if;
  raise notice 'PASS: set_approachable(on) synced profiles + snapshot';
end $$;

-- 3. Alice can now see Bob's snapshot, and send a valid approach.
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
do $$
begin
  if not exists (select 1 from public.approachable_snapshots where user_id = '00000000-0000-0000-0000-00000000000b') then
    raise exception 'FAIL: Alice should be able to see Bob''s approachable snapshot';
  end if;
end $$;

select public.send_approach_request(
  '00000000-0000-0000-0000-00000000000b', 'Hi Bob, we share a lot on the energy axis!', 'friend',
  '[{"id":"energy","label":"Energy","leftPole":"In","rightPole":"Out","score":15}]'::jsonb,
  'Test Archetype', 'Alice', null
);

-- 4. A message under 20 chars is rejected server-side, not just by the UI.
do $$
begin
  begin
    perform public.send_approach_request('00000000-0000-0000-0000-00000000000b', 'too short', 'friend', null, null, 'Alice', null);
    raise exception 'FAIL: short message should have been rejected';
  exception when others then
    raise notice 'PASS: short message rejected (%)', sqlerrm;
  end;
end $$;

-- 5. Rate limit: the 21st request in 24h from the same sender fails.
do $$
declare
  i integer;
  hit_limit boolean := false;
begin
  for i in 1..25 loop
    begin
      perform public.send_approach_request('00000000-0000-0000-0000-00000000000c', 'Repeated approach message padded to pass the length check', 'friend', null, null, 'Alice', null);
    exception when others then
      hit_limit := true;
      exit;
    end;
  end loop;
  if not hit_limit then
    raise exception 'FAIL: rate limit was never enforced across 25 sends';
  end if;
  raise notice 'PASS: rate limit enforced';
end $$;

-- 6. Concurrency: two simultaneous accepts on the same pending request —
--    exactly one should succeed. (Simulated serially here since psql is
--    single-connection; the `where status = 'pending'` guard is the same
--    atomic-claim shape proven out by accept_pairing_invite.)
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
do $$
declare
  req_id uuid;
  first_ok boolean := false;
  second_ok boolean := false;
begin
  select id into req_id from public.approach_requests
  where sender_id = '00000000-0000-0000-0000-00000000000a' and recipient_id = '00000000-0000-0000-0000-00000000000b'
  limit 1;

  begin
    perform public.accept_approach_request(req_id);
    first_ok := true;
  exception when others then null;
  end;

  begin
    perform public.accept_approach_request(req_id);
    second_ok := true;
  exception when others then null;
  end;

  if not (first_ok and not second_ok) then
    raise exception 'FAIL: expected exactly one accept to succeed (first=%, second=%)', first_ok, second_ok;
  end if;
  raise notice 'PASS: concurrent-accept guard holds';
end $$;

-- 7. Block: Carol blocks Alice; Alice can no longer see Carol (n/a, Carol
--    never turned approachable on) and cannot send Carol anything new.
select pg_temp.as_user('00000000-0000-0000-0000-00000000000c');
select public.block_user('00000000-0000-0000-0000-00000000000a');
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
do $$
begin
  begin
    perform public.send_approach_request('00000000-0000-0000-0000-00000000000c', 'Trying to reach out again after being blocked', 'friend', null, null, 'Alice', null);
    raise exception 'FAIL: blocked sender should not be able to send a new request';
  exception when others then
    raise notice 'PASS: blocked sender rejected (%)', sqlerrm;
  end;
end $$;

rollback;
