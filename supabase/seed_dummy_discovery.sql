-- Dummy approachable profiles for exercising /discover and /discover/requests
-- without needing real signed-up users yet.
--
-- Not a schema migration — data only, and NOT wired into anything automatic.
-- Run it by hand in the Supabase SQL Editor (this repo has no local
-- `supabase start`/service-role key on this machine, so it can't be applied
-- from here — see supabase/tests/approachability_smoke.sql for the same
-- "insert directly into auth.users" trick, used there for RLS testing).
--
-- Idempotent: safe to re-run, `on conflict` upserts rather than duplicates.
-- Fixed UUIDs use a `d1000000-...` prefix so they never collide with the
-- `00000000-...` fixtures the smoke test uses.
--
-- These accounts have no password and can never log in — they're read-only
-- browse fixtures. You can send an approach TO one (the RPC only checks
-- profiles.approachable, which is set below), but nothing will ever accept
-- or decline it back, since there's no one to sign in as. To test the
-- accept/decline side of the flow you need a second real account.
--
-- To remove all of this later, see the DELETE block commented out at the
-- bottom of this file.

insert into auth.users (id, email) values
  ('d1000000-0000-0000-0000-000000000001', 'maya.chen@colevitate.dummy'),
  ('d1000000-0000-0000-0000-000000000002', 'jordan.reyes@colevitate.dummy'),
  ('d1000000-0000-0000-0000-000000000003', 'priya.nair@colevitate.dummy'),
  ('d1000000-0000-0000-0000-000000000004', 'sam.okafor@colevitate.dummy'),
  ('d1000000-0000-0000-0000-000000000005', 'elena.petrova@colevitate.dummy'),
  ('d1000000-0000-0000-0000-000000000006', 'theo.lindqvist@colevitate.dummy'),
  ('d1000000-0000-0000-0000-000000000007', 'ava.brennan@colevitate.dummy'),
  ('d1000000-0000-0000-0000-000000000008', 'kai.tanaka@colevitate.dummy')
on conflict (id) do nothing;

insert into public.profiles (id, display_name, approachable, approachable_scope, approachable_intents)
values
  ('d1000000-0000-0000-0000-000000000001', 'Maya Chen',       true, 'everyone', null),
  ('d1000000-0000-0000-0000-000000000002', 'Jordan Reyes',    true, 'intents',  array['romantic', 'friend']),
  ('d1000000-0000-0000-0000-000000000003', 'Priya Nair',      true, 'everyone', null),
  ('d1000000-0000-0000-0000-000000000004', 'Sam Okafor',      true, 'intents',  array['professional']),
  ('d1000000-0000-0000-0000-000000000005', 'Elena Petrova',   true, 'everyone', null),
  ('d1000000-0000-0000-0000-000000000006', 'Theo Lindqvist',  true, 'intents',  array['friend', 'professional']),
  ('d1000000-0000-0000-0000-000000000007', 'Ava Brennan',     true, 'everyone', null),
  ('d1000000-0000-0000-0000-000000000008', 'Kai Tanaka',      true, 'intents',  array['romantic'])
on conflict (id) do update
  set display_name = excluded.display_name,
      approachable = excluded.approachable,
      approachable_scope = excluded.approachable_scope,
      approachable_intents = excluded.approachable_intents;

-- axes: energy, structure, people, novelty — each -100..100 (see AXES in
-- src/components/personality/combined/scoringMatrix.ts).
--
-- anon_label is a generated pseudonym, same adjective+animal style as
-- src/lib/discovery/anonLabel.ts produces for real users (see
-- supabase/migrations/0008_anonymous_discovery.sql, which dropped this
-- table's old display_name/avatar_url columns in favor of anon_label —
-- these fixed values are just hand-picked so the demo stays stable/idempotent
-- rather than re-rolling a random one on every run).
insert into public.approachable_snapshots (user_id, anon_label, axes, archetype_name, scope, intents, updated_at)
values
  ('d1000000-0000-0000-0000-000000000001', 'Sharp Falcon',
   '[{"id":"energy","score":40},{"id":"structure","score":60},{"id":"people","score":55},{"id":"novelty","score":20}]'::jsonb,
   'The Grounded Connector', 'everyone', null, now()),

  ('d1000000-0000-0000-0000-000000000002', 'Swift Dolphin',
   '[{"id":"energy","score":-50},{"id":"structure","score":-30},{"id":"people","score":10},{"id":"novelty","score":70}]'::jsonb,
   'The Curious Wanderer', 'intents', array['romantic', 'friend'], now()),

  ('d1000000-0000-0000-0000-000000000003', 'Wise Owl',
   '[{"id":"energy","score":65},{"id":"structure","score":45},{"id":"people","score":-20},{"id":"novelty","score":50}]'::jsonb,
   'The Driven Visionary', 'everyone', null, now()),

  ('d1000000-0000-0000-0000-000000000004', 'Clever Fox',
   '[{"id":"energy","score":-35},{"id":"structure","score":70},{"id":"people","score":30},{"id":"novelty","score":-40}]'::jsonb,
   'The Steady Architect', 'intents', array['professional'], now()),

  ('d1000000-0000-0000-0000-000000000005', 'Agile Otter',
   '[{"id":"energy","score":20},{"id":"structure","score":-60},{"id":"people","score":65},{"id":"novelty","score":55}]'::jsonb,
   'The Warm Improviser', 'everyone', null, now()),

  ('d1000000-0000-0000-0000-000000000006', 'Stellar Lynx',
   '[{"id":"energy","score":-60},{"id":"structure","score":20},{"id":"people","score":-45},{"id":"novelty","score":30}]'::jsonb,
   'The Quiet Analyst', 'intents', array['friend', 'professional'], now()),

  ('d1000000-0000-0000-0000-000000000007', 'Radiant Beaver',
   '[{"id":"energy","score":55},{"id":"structure","score":10},{"id":"people","score":70},{"id":"novelty","score":-25}]'::jsonb,
   'The Social Anchor', 'everyone', null, now()),

  ('d1000000-0000-0000-0000-000000000008', 'Keen Hummingbird',
   '[{"id":"energy","score":-15},{"id":"structure","score":50},{"id":"people","score":40},{"id":"novelty","score":65}]'::jsonb,
   'The Thoughtful Explorer', 'intents', array['romantic'], now())
on conflict (user_id) do update
  set anon_label = excluded.anon_label,
      axes = excluded.axes,
      archetype_name = excluded.archetype_name,
      scope = excluded.scope,
      intents = excluded.intents,
      updated_at = now();

-- To remove every dummy fixture this script created (cascades to
-- approachable_snapshots/profiles/approach_requests/blocks/reports via FK):
--
-- delete from auth.users where email like '%@colevitate.dummy';
