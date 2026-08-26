-- Distinguishes workplace teams from personal "circles" (Tier 4.1 of
-- IMPROVEMENT_PROMPTS.md) — both reuse the same teams/team_members tables
-- and RLS policies from 0003_teams.sql; this column is purely a query
-- filter so /teams and /circle each only ever list their own kind.
alter table public.teams
  add column kind text not null default 'workplace' check (kind in ('workplace', 'personal'));
