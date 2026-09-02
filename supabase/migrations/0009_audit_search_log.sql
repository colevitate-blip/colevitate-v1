-- Tier 1.1 (see prompt.md): every successful, recognized AI audit
-- (POST /api/audit-person) for a name not already in FAMOUS_PEOPLE is
-- logged here. This is the growth backlog — the highest-frequency
-- canonical_name values are exactly who visitors want typed next, so they
-- become the prioritized queue for the editorial roster
-- (src/lib/seo/famousPeopleContent.ts). Unrecognized/rejected searches are
-- never logged; they're noise, not signal for what to add.
--
-- Server-only: written exclusively via the service-role client
-- (src/lib/supabase/serviceRole.ts) from the audit-person route, which
-- bypasses RLS. No policies are defined, so RLS with no policies denies
-- all access through the anon/authenticated roles — there is no
-- user-facing surface for this table, only the backlog script
-- (scripts/audit-search-backlog.mjs).
create table public.audit_search_log (
  id uuid primary key default gen_random_uuid(),
  -- The raw string the visitor typed, kept alongside the AI's canonical
  -- name so near-duplicate/misspelled searches for the same person are
  -- still visible to whoever triages the backlog, without forcing an
  -- immediate canonicalization decision here.
  name text not null,
  canonical_name text not null,
  searched_at timestamptz not null default now()
);

alter table public.audit_search_log enable row level security;

create index audit_search_log_canonical_name_idx on public.audit_search_log (canonical_name);
