-- Discovery feed scaling (Tier 5.6): a lightweight, reversible "not
-- interested" signal distinct from `blocks` (0007_approachability.sql).
-- Blocking is for bad actors — it's silent, unilateral, and mutual (neither
-- party can see the other again). Skipping is for "not a fit, but not a
-- problem": it only ever affects what the skipping user sees, never
-- notifies or restricts the skipped party, and is undoable at any time —
-- so unlike blocks it needs no security-definer function, since there's no
-- cross-user validation to perform, only "does this row belong to me."
create table public.discovery_skips (
  user_id uuid not null references auth.users (id) on delete cascade,
  skipped_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, skipped_user_id),
  check (user_id <> skipped_user_id)
);

alter table public.discovery_skips enable row level security;

create policy "Users can select their own skips"
  on public.discovery_skips for select
  using (auth.uid() = user_id);

create policy "Users can insert their own skips"
  on public.discovery_skips for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own skips (undo)"
  on public.discovery_skips for delete
  using (auth.uid() = user_id);

-- Supports both "my skip list" (settings/skipped page) and the discover
-- feed's per-viewer exclusion lookup — both filter on user_id, which is
-- already the leading column of the primary key, so no extra index is
-- needed here.

-- The discover feed (src/app/[locale]/(personality)/discover/discoveryQuery.ts)
-- now excludes discovery_skips and declined-against candidates at the query
-- level, ranks the remaining pool by compatibility score computed in
-- application code (never persisted — same never-store-a-per-pair-score
-- principle as the rest of this feature), and paginates over a bounded
-- pool. None of that changes what approachable_snapshots stores, but the
-- query shape changes from "order by updated_at, limit 60" to something
-- that reads the whole eligible pool up to a safety cap and filters/joins
-- against approach_requests(sender_id, status) — neither of which had a
-- supporting index before.
create index approachable_snapshots_updated_at_idx on public.approachable_snapshots (updated_at desc);
create index approachable_snapshots_scope_idx on public.approachable_snapshots (scope);
create index approachable_snapshots_intents_gin_idx on public.approachable_snapshots using gin (intents);
create index approach_requests_sender_status_idx on public.approach_requests (sender_id, status);
