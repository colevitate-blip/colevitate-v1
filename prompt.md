# Product value expansion — staged implementation prompt

## Status (as of this pass)
All tiers implemented. 1.2 and 3.1 turned out to already exist in the
codebase (celebrity "vs=me" compare flow; AxisTrend history charts) and
needed no new work. Everything else is new: 1.1 (backlog logging), 2.1/4.2
(shared `PairwiseCompatibilityGrid`, used by both circle and team pages),
2.2 ("type a friend" mode on `/api/audit-person`), 3.2 (`DailyTypeInsight`
+ `/api/daily-type-content`), 4.1 (`/deep-dive` + Stripe + Gemini report).
Typecheck and lint pass clean. Verified live in-browser as a logged-in user
with a completed Combined Profile; found and fixed a real bug along the
way (service-role client threw synchronously when
`SUPABASE_SERVICE_ROLE_KEY` is unset, which could 500 a whole request from
inside a "best-effort" logging/caching call — now guarded in all three
call sites). Not yet done: migrations 0009-0011 aren't applied to Supabase
(`npm run db:push`), and nothing here has been committed/pushed.


Context: Colevitate is a personality-typing product (MBTI, Colors, Big Five,
Human Design) with celebrity typing/audits
(`src/lib/seo/famousPeopleContent.ts`, `src/app/api/audit-person/route.ts`,
`src/components/seo/PersonAuditSearch.tsx`), pairwise compatibility
(`(personality)/pair`, `combined/scoringMatrix.ts`), anonymous discovery
matching (`(personality)/discover`, `approachable_snapshots` table), friend
groups (`(personality)/circle`), teams (`(personality)/teams`, `for-teams`),
and Stripe billing (`src/app/api/stripe`).

Work through the tiers **in order, one item at a time**. Finish and verify
(typecheck + lint) an item before starting the next. Do not commit/push
without explicit go-ahead between items — pause after each for a check-in
unless told otherwise. Match existing code conventions and the editorial,
non-hedging copy tone already in the codebase.

---

## Tier 1 — Quick wins (extend what's already shipped, no new surface area)

### 1.1 Cache missing-audit searches into a growth backlog
When `POST /api/audit-person` succeeds (`recognized=true`) for a name not
already in `FAMOUS_PEOPLE`, log `{ name, canonicalName, searchedAt }` to a
new Supabase table (e.g. `audit_search_log`). Add a small admin view or
script to surface the highest-frequency missing names — that becomes the
prioritized backlog for the editorial roster. Only log successful,
recognized responses; skip failed/unrecognized ones.

### 1.2 "Compatibility with a celebrity" mashup
Reuse the existing pairwise scoring in `combined/scoringMatrix.ts` and the
match-gauge UI (already built for celebrity match/versus) to let a
logged-in user see their compatibility against any person in
`FAMOUS_PEOPLE`. Surface as a "See your compatibility" CTA on the person's
profile page. Logged-out visitors get a sign-in prompt, not a computed
result.

---

## Tier 2 — Social & relationship expansion (builds on Tier 1's scoring reuse)

### 2.1 Group ("circle") compatibility grid
Inside `(personality)/circle`, add a view showing pairwise compatibility for
every pair in a friend group, not just 1:1. Include a summary line calling
out the "anchor" (highest average compatibility) and "wildcard" (highest
score variance) of the group. Reuse existing pair-scoring logic — do not
duplicate it.

### 2.2 "Type a friend" audit mode
Auth-gated variant of the Tier-1.1 audit endpoint, pointed at a private
individual instead of a public figure. Produces the same typing shape but
clearly labeled as about a non-public person, made for sharing (e.g. with
the friend being typed). Reuse `audit-person`'s schema/prompt scaffolding
rather than forking it.

---

## Tier 3 — Retention loops

### 3.1 Re-typing over time / trend line
Let users retake an assessment and see a "you then vs. now" comparison
(especially for Big Five and the custom axes in `discover`). Needs
historical snapshot storage per user per assessment — check existing
result-storage tables before adding new ones.

### 3.2 Daily/weekly micro-content tied to type
Short, type-specific content ("how your type handles [scenario]") generated
via the same Gemini pipeline as `audit-person`, surfaced on a dashboard or
sent as an email nudge. Start with on-page surfacing before wiring any
email/notification infra.

---

## Tier 4 — Monetization & B2B (largest scope; sequence last so it builds on validated engagement from Tiers 1-3)

### 4.1 Paid deep-dive report (Stripe)
After completing any assessment, offer a one-time-purchase "deep dive"
report (career fit, relationship patterns, growth edges) via the existing
Stripe integration in `src/app/api/stripe`. Gate long-form content behind
successful payment; leave the free result page unchanged.

### 4.2 Teams tier expansion
Building on `for-teams`/`(personality)/teams`: team compatibility heatmaps,
hiring-panel fit previews, and/or a Slack/Teams bot that posts a channel's
collective archetype. Scope down to one sub-feature first rather than all
three at once.

---

## Before starting each item
- Check for an existing Supabase migrations convention
  (`supabase/migrations/`) before adding any new table.
- Run typecheck + lint on touched files before considering an item done.
- Do not commit/push without explicit go-ahead.
