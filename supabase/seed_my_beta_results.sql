-- Unblocks the "Complete at least 2 assessments" gate on /discover for a
-- single real account during beta, by seeding two framework results
-- directly (mirrors PersonalityResults from src/lib/personality/types.ts).
-- generateCombinedProfile() requires >= 2 completed frameworks before it
-- will build a combined profile — see
-- src/components/personality/combined/generateCombinedProfile.ts:123.
--
-- Not a schema migration — data only, and NOT wired into anything automatic.
-- Run it by hand in the Supabase SQL Editor (same reason as
-- seed_dummy_discovery.sql: this repo has no local service-role key).
--
-- Merges into any existing `results` rather than overwriting them (so a
-- real quiz you've already taken, e.g. colors, is preserved), and is safe
-- to re-run.
--
-- Replace the email below if seeding a different account. To remove this
-- mock data later, run the DELETE-style update at the bottom instead.

insert into public.profiles (id, results)
select
  u.id,
  jsonb_build_object(
    'mbti', jsonb_build_object(
      'type', 'INFJ',
      'scores', jsonb_build_object(
        'EI', jsonb_build_object('pole', 'I', 'confidence', 78),
        'SN', jsonb_build_object('pole', 'N', 'confidence', 74),
        'TF', jsonb_build_object('pole', 'F', 'confidence', 69),
        'JP', jsonb_build_object('pole', 'J', 'confidence', 63)
      ),
      'completedAt', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
    ),
    'bigfive', jsonb_build_object(
      'scores', jsonb_build_object(
        'openness', 72,
        'conscientiousness', 65,
        'extraversion', 40,
        'agreeableness', 68,
        'neuroticism', 35
      ),
      'completedAt', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
    )
  )
from auth.users u
where u.email = 'unit.cloud.team@gmail.com'
on conflict (id) do update
  set results = public.profiles.results || excluded.results;

-- To remove just the mock frameworks added above later (keeps any other
-- real results already on the row):
--
-- update public.profiles
-- set results = results - 'mbti' - 'bigfive'
-- where id = (select id from auth.users where email = 'unit.cloud.team@gmail.com');
