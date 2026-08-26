# Colevitate — Improvement Prompts for Claude Code

Companion to `PROJECT_STATUS.md`. Each prompt below is self-contained — paste it into a Claude Code session in this repo and it has enough context to run without you filling in blanks.

Before running any of these, tell Claude Code to read `AGENTS.md`, `CLAUDE.md`, and this repo's existing patterns in the relevant directory first — every prompt below assumes that happens.

## How to run these

Not as one giant unattended prompt — several of these are deliberately built
with a stop-and-review point mid-chain, because the failure mode there isn't
a bug you fix later, it's "shipped a wrong claim about a real named person"
or "shipped 80 SEO pages nobody searches for."

**Sequential chains — run each in a single continued Claude Code session**
(so the reviewed roster/list is still in context; don't split these across
fresh sessions or you'll have to re-paste the approved output):
- Tier 0: run 0.1 → read the roster it returns → tell it to proceed → it
  does 0.2 then 0.3 in the same conversation.
- Tier 3: run 3.1a → review the combination list → tell it to proceed to
  3.1b.
- Tier 4.1: run it → review the plan it hands back → tell it to build.
- Tier 5: run 5.1 → review the discovery/approachability plan it hands
  back → tell it to build → it does 5.2, 5.3, 5.4, 5.5 in that order in
  the same conversation. Don't parallelize this tier — each stage builds
  directly on the previous stage's schema/UI.
- Ordering constraint across tiers: run 1.1 before 4.2 (4.2's nav link
  assumes 1.1's homepage link already exists).

**Everything else is independent and can run in parallel** — separate
`git worktree` + separate `claude` session per item, each on its own
branch, so they can't collide on the same files:

```
git worktree add ../colevitate-1.2 -b feature/share-card
cd ../colevitate-1.2 && claude   # paste the prompt here
```

Parallelizable set: 1.2, 1.3 (careers/relationships only — leave
famousExamples, that's Tier 0's job), 2.1, 2.2, 2.3, 4.3. Review and merge
each branch separately rather than reviewing one combined diff.

**Option B — one session, sequential, if you'd rather not manage
worktrees.** Slower wall-clock (no parallelism) and a single very long
session can degrade in quality after 10+ features — watch for that and
split into fresh sessions per remaining tier if it starts getting sloppy.
Kick it off with:

```
Read AGENTS.md, CLAUDE.md, PROJECT_STATUS.md, and IMPROVEMENT_PROMPTS.md in
full before doing anything else.

Work through IMPROVEMENT_PROMPTS.md end to end, in order: Tier 0, then
Tier 1, Tier 2, Tier 3, Tier 4, Tier 5. Treat each numbered prompt (0.1, 0.2, 0.3,
1.1, 1.2, ...) as its own task with its own "Done when" criteria — commit
your work separately per task, not one combined commit per tier, so each
change stays independently reviewable and revertable.

Three tasks have an explicit review checkpoint written into them — 0.1
(the famous-person roster), 3.1a (the combination keyword list), and 5.1
(the discovery/approachability architecture plan). When you reach one,
stop, show me exactly what you're proposing, and wait for my explicit
go-ahead before continuing to the next task in that chain (0.2/0.3, or
3.1b, or 5.2 onward). Don't treat silence or me changing topic as
approval.

4.1 (multi-person compatibility) also asks for an implementation plan
before writing code — same rule applies there too, and to 5.1 above.

If a later task's "Done when" criteria conflicts with something an
earlier task already built, stop and tell me rather than silently
reworking the earlier task's output.
```

---

## Tier 0 — Famous-person profiles (do this first)

Personality-typing well-known figures is one of the highest-traffic content
categories in this space (it's most of Personality Database's growth, and
"famous [type]" / "what personality type is [name]" queries get real search
volume) — and it directly fills the `famousExamples` gap flagged in Tier
1.3 below. Work these three in order; each depends on the last.

### 0.1 Research: curate and source the initial famous-person roster

```
Build a sourced, defensible initial roster of well-known figures across
four categories: scientists, Nobel laureates (science, literature, AND
peace — not just science, treat this as its own bucket even though it
overlaps with "scientists"), Hollywood/entertainment celebrities, and
politicians. This is a research/planning task — do not write full profile
pages yet (that's 0.2).

For each person, propose a type across the relevant frameworks (MBTI, Big
Five, Colors, and Human Design only where birth data allows — see below)
with a short, sourced rationale.

Hard requirements:
1. Every entry must be framed as speculative/editorial typing, never as
   fact or as the person's own quiz result — this needs to be explicit in
   the data itself (e.g. a `rationale` field grounded in specific,
   citable public behavior/interviews/biography), not just in page copy
   added later.
2. Base rationale only on well-documented public behavior, interviews, or
   biography — not invented psychoanalysis, and not private or health
   information about the person.
3. Human Design requires exact birth date, time, and location. Only assign
   a Human Design type where that birth data is reliably publicly
   documented; leave it blank otherwise rather than guessing a time of
   birth.
4. For politicians specifically: keep the roster balanced across political
   parties/viewpoints/eras, use neutral descriptive language throughout,
   and avoid recently-controversial living figures where typing could read
   as taking a political stance — if unsure about a specific name, flag it
   to the user rather than deciding alone.
5. For every person, also note whether a properly licensed photo is
   realistically available (see 0.2 for what "properly licensed" means) —
   this affects whether they're a good fit for the initial batch.
6. Aim for ~25-40 names total for this first pass, roughly balanced across
   the four categories, not exhaustive.

Produce this as a reviewed table (name, category, proposed types per
framework, one-line sourced rationale each, birth-data availability,
photo-availability) and hand it to the user for sign-off before 0.2 runs.

Done when: the user has approved a roster to build real pages for.
```

### 0.2 Build: individual famous-person profile pages, with photos

```
Using the approved roster from 0.1 (ask the user for it if this is a fresh
session), build real profile pages following the existing
programmatic-page pattern already used for type pages and combination
pages (src/lib/seo/typeContent.ts, src/lib/seo/combinationContent.ts) — a
new content file (e.g. src/lib/seo/famousPeopleContent.ts) that
routing/sitemap generation reads from automatically, same as those two.

1. Route: check whether /celebrities/[slug] or /people/[slug] (or another
   segment) fits better alongside the existing /types/... convention, and
   confirm with the user if it's ambiguous.
2. Each page needs: name, category, a photo, per-framework proposed
   type(s) with the rationale from 0.1, and a prominent, unambiguous
   disclaimer that this is Colevitate's editorial assessment based on
   public information — not the person's own result and not a factual
   claim. Also add a CTA back into the quiz ("see how you compare to
   [name]") — this is the actual growth hook for this feature.
3. Photos — do not scrape arbitrary images off the web. For each person,
   source a photo you can confirm is public domain or properly
   Creative-Commons-licensed for this use (Wikimedia Commons is the most
   reliable source for this — many politicians' official portraits,
   Nobel Foundation photos, and older/historical scientist photos are
   public domain there; recent Hollywood-celebrity photos are the hardest
   category to clear and may need to be skipped or substituted with an
   event/press photo that's actually licensed for reuse, not a studio
   headshot). Store the image URL, source, and required attribution
   text per license (not just the image itself) in the content file, and
   render attribution on the page wherever the license requires it. If
   you can't confirm a photo is properly licensed for a given person,
   ship that page without a photo rather than guessing.
4. Add these pages to sitemap.ts following the same localizedEntries
   pattern already used for type/combination pages.
5. English-only for this pass — localization is a separate task (see Tier
   4.3).

Done when: every person in the approved roster has a live profile page
with a properly licensed (or attributed, or absent) photo, real per-
framework typing with sourced rationale, and a clear editorial disclaimer.
```

### 0.3 Build: "Famous [Type]" pages + wire into the existing famousExamples field

```
This supersedes the fallback guidance for the `famousExamples` field in
src/lib/seo/typeContent.ts (Tier 1.3 below originally said to skip that
field or caveat it manually — don't do that anymore now this exists).

1. Populate `famousExamples` on typeContent.ts entries by pulling matching
   people from famousPeopleContent.ts (the file built in 0.2), keeping the
   "commonly typed as" / editorial framing, and linking each name to their
   profile page from 0.2.
2. Build aggregation pages — "Famous INTJs," "Famous ENFPs," "Famous
   Generators," etc. — one per type, listing every matching person from
   the roster with a photo thumbnail and a link to their full profile.
   Nest these under the existing /types/[framework]/[slug]/ structure
   (check what reads best, e.g. a /famous sub-route) rather than inventing
   a parallel URL scheme.
3. Add these to sitemap.ts with proper metadata/structured data, following
   the pattern in src/lib/seo/structuredData.ts — these aggregation pages
   are likely the highest search-volume payoff in this whole tier.

Done when: typeContent.ts's famousExamples field is populated from real
data instead of blank, and every type has a working "Famous [Type]"
listing page.
```

---

## Tier 1 — Quick wins (existing features, no new infra)

### 1.1 Surface pairing and teams in the main nav/homepage

```
The pairing/compatibility feature (src/components/pairing/, routes under
src/app/[locale]/(personality)/pair/) and the team/workplace product
(src/components/teams/, routes under src/app/[locale]/(personality)/teams/)
are both fully built and shipped, but neither is discoverable from the
homepage or main navigation — the public site currently only surfaces the
four individual quizzes.

Find the homepage/landing component (src/components/personality/landing/)
and whatever header/nav component links the site together, and:

1. Add a clear path from the homepage to "compare with someone" (the
   pairing flow) — this should read as a headline feature, not a footnote,
   since it's the site's actual differentiator.
2. Add a discoverable link to the team/workplace product, but keep it
   visually distinct from the consumer flow (different audience, different
   intent) — a secondary nav item or a dedicated section is fine, don't
   blend it into the quiz CTAs.
3. Don't invent new copy tone — match the "warmth" rewrite already done on
   the landing/assessment copy (see recent git log: "Rewrite landing page
   and assessment copy for warmth").
4. Check both changes render correctly across all 5 locales (en/de/es/fr/zh)
   — check messages/ for any new strings that need translation keys, and
   add them for all locales, not just English.

Done when: a first-time visitor on the homepage can find both the pairing
flow and the teams product without already knowing they exist, in all 5
locales.
```

### 1.2 Native shareable image card for pairing/compatibility results

```
The pairing/compatibility report (src/app/[locale]/(personality)/pair/[id]/report)
currently exports as PDF/JSON (see recent commit "Rework combined-profile PDF
export and polish the relationship graph"). It has no image export suited
for social sharing (Instagram Stories / TikTok-style vertical card).

Add a shareable image export for the compatibility result:
1. Check what's already used for image export elsewhere in the app (the
   combined-profile export card mentioned in PROJECT_STATUS.md Tier 1 —
   look for existing image-export utilities before adding a new dependency;
   html2canvas is already in package.json).
2. Design a vertical (9:16) card variant suitable for Stories/Reels: the two
   people's types, the headline compatibility takeaway, and the relationship
   graph or a simplified version of it. Keep Colevitate's brand mark on it —
   this card is the growth loop, it needs to be identifiable when it's
   re-shared outside the app.
3. Add a "Share" button next to the existing PDF/JSON export options on the
   report page, generating and downloading (or native-sharing via the Web
   Share API where supported) this image.
4. Keep this on-brand with whatever came out of the brand experiment
   (src/app/experiments/brand/) if that's been finalized — check with the
   user if it's ambiguous which direction won.

Done when: a user viewing a pairing report can generate a single-image,
story-ratio card with one tap/click, without needing the existing
multi-page PDF flow.
```

### 1.3 Write the missing careers/relationships/famousExamples content

```
src/lib/seo/typeContent.ts adapts existing quiz-result content into
standalone SEO pages, but explicitly leaves `careers`, `relationships`, and
`famousExamples` as empty placeholders — the file's own header comment says
nothing in the codebase has this content yet and it "shouldn't be
fabricated," so pages currently render an honest "coming soon" for those
sections.

Your job is to write that content for real, for every type across all four
frameworks (MBTI via src/components/personality/mbti/content, Human Design
via .../humandesign/content, Colors via .../colors/content, Big Five via
.../bigfive/content):

1. `careers`: 4-6 career directions per type, grounded in the type's actual
   described traits/strengths in the existing content files — don't
   generate generic filler that could apply to any type.
2. `relationships`: a short (2-4 sentence) honest description of relational
   tendencies for that type, consistent in tone with the existing
   description/strengths/challenges copy.
3. `famousExamples`: leave this field alone entirely — it's handled by
   Tier 0 above, which builds a proper sourced roster of famous people and
   wires it into this exact field (Tier 0.3). Don't fill it in here with
   ad hoc guesses; that would just get overwritten.
4. Keep the tone consistent with the "warmth" rewrite already applied to
   landing/assessment copy.
5. This is English-only content generation — do NOT touch the i18n message
   files or attempt translation; that's a separate pass (see Tier 4.3
   below) and machine-translating this by hand would be worse than doing it
   properly later.

Done when: every type page under /types/[framework]/[slug] renders real
content in all three sections instead of "coming soon," for English only.
```

---

## Tier 2 — Medium effort (drafted-but-not-shipped, per PROJECT_STATUS.md Tier 2)

### 2.1 "Why this score" per-axis breakdown

```
The combined personality profile is scored across four axes (Energy,
Structure, People, Novelty) via a weighted scoring matrix in
src/components/personality/combined/scoringMatrix.ts. PROJECT_STATUS.md
notes a "why this score" breakdown was drafted as a prompt but never run:
a view that traces an axis score back through each individual framework's
own scoring.ts to show which quiz answers/framework results contributed
how much.

Build this:
1. Read scoringMatrix.ts to understand exactly how the four axes are
   currently computed from each framework's result.
2. Add a breakdown view (either inline on the combined-results screen or a
   drill-in per axis) that shows, per axis, each framework's contribution
   and a plain-language explanation of why — not just raw weight numbers.
3. This should not require a new scoring model — you're building a view
   into the existing math, not changing the math itself. If exposing the
   real weights would need scoringMatrix.ts refactored to expose
   intermediate values (rather than just a final score), do that
   refactor but preserve the existing final output exactly.

Done when: from the combined result screen, a user can see why each axis
landed where it did, broken down by contributing framework.
```

### 2.2 Growth prompts / career-fit suggestions by axis range

```
PROJECT_STATUS.md Tier 2 describes this as "content mapped to axis ranges"
for the four combined-profile axes (Energy, Structure, People, Novelty) —
not yet built.

1. Look at scoringMatrix.ts for the axis definitions/ranges.
2. Write a set of growth prompts and career-fit suggestions keyed to
   axis-range bands (e.g. high/mid/low on each axis, or however the
   existing UI already buckets scores for display — check the combined
   results screen for whether banding logic already exists before adding
   a new one).
3. Surface this as a new section on the combined-profile result screen.
4. Keep suggestions general enough to be honest (this is not a licensed
   career-counseling tool) — frame as directional prompts for reflection,
   not prescriptive claims ("people with your profile succeed at X").

Done when: the combined result screen shows growth/career-fit content
that changes based on the user's actual axis scores, not static filler.
```

### 2.3 Retake & trend history

```
PROJECT_STATUS.md Tier 2 notes this was scoped to work "via storage.ts, so
it works whether or not a backend exists yet" — meaning it should work for
both signed-out (localStorage) and signed-in (Supabase) users using
whatever storage abstraction is already in src/lib/supabase/ and wherever
storage.ts actually lives.

1. Find storage.ts and confirm it already abstracts local vs. Supabase
   persistence (per the status doc, it should).
2. Add retake tracking: when a user retakes any of the four quizzes,
   store the new result alongside prior ones rather than overwriting.
3. Build a simple trend view — how axis scores or type results have
   shifted across retakes over time — accessible from the profile/settings
   area (src/components/settings/, src/app/[locale]/(personality)/settings).
4. Respect existing sign-in/guest handling — check the recent commit
   "Preserve return path on sign-in and prompt guests to save results" for
   how guest vs. signed-in state is currently handled, and follow the same
   pattern rather than inventing a new one.

Done when: a signed-in user who retakes a quiz can see how their results
have changed over time; a guest sees the same within one browser's
localStorage.
```

---

## Tier 3 — Needs real data first

### 3.1a Research: pick the real top 50-100 type combinations

```
src/lib/seo/combinationContent.ts currently seeds only 6 combination pages
as a pipeline proof-of-concept. Its own header comment says: "The brief
calls for the top 50-100 combinations by search volume; picking those
requires real keyword research (Search Console / a keyword tool) that
isn't available in this environment, so this list is illustrative, not
the final prioritized set."

Do NOT just invent 50-100 combinations. Instead:
1. If you have web search available, use it to research which type-pairing
   / combination queries plausibly get real search volume (e.g. by looking
   at what competitor sites like 16Personalities, Truity, and Personality
   Database rank for around type combinations, "INFJ compatibility," etc.)
   and note this is directional, not verified search-volume data.
2. If the user has since connected Google Search Console or an SEO tool
   (Ahrefs, etc.) with working API access, ask them for it and use real
   query/volume data instead.
3. Produce a prioritized list of 50-100 candidate combinations (framework +
   code pairs, matching the `TypeRef` shape already in
   combinationContent.ts) ranked by your best estimate of demand, and hand
   this list back to the user for a sanity check BEFORE writing full page
   copy for all of them (that's prompt 3.1b) — this is a research/planning
   task, not a content-writing task yet.

Done when: the user has a reviewed, prioritized list of real candidate
combinations to expand into.
```

### 3.1b Build: expand combinationContent.ts to the prioritized list

```
Using the prioritized combination list from prompt 3.1a (get it from the
user if this is a fresh session), expand the `COMBINATIONS` array in
src/lib/seo/combinationContent.ts from its current 6 seed entries to the
full reviewed list.

1. Match the existing shape exactly: slug, a/b TypeRef, headline, summary,
   reinforcements[], contrasts[] — look at the existing 6 entries (e.g.
   "infj-and-high-openness") closely for tone and depth before writing
   more; don't drop the quality bar as the volume goes up.
2. Everything downstream — routes, sitemap.ts, generateStaticParams — reads
   from this array automatically per the file's own header comment, so you
   should NOT need to touch routing/sitemap code, only this content file.
   If you find you do need to touch generated routes, stop and explain why
   before proceeding.
3. Work in batches (e.g. 10-15 combinations at a time) and check a sample
   renders correctly at /types/combinations/[slug] before continuing to the
   next batch, rather than writing all of them blind.

Done when: sitemap.ts picks up the full expanded set of combination pages
automatically and a sample of them render correctly.
```

---

## Tier 4 — Bigger bets

### 4.1 Multi-person / group compatibility

```
The pairing feature (src/components/pairing/, PairingInviteRow.tsx,
pairingTypes.ts) currently supports two people. The team product
(src/components/teams/TeamCompositionView.tsx, teamInsights.ts) already has
a composition/insights view across multiple people's results, built for a
workplace context.

Explore extending compatibility beyond pairs — e.g. friend groups or
families getting a shared multi-person compatibility view, not just a
2-person report:
1. Read both pairingTypes.ts and teamInsights.ts first — the team product's
   composition logic may already generalize to N people; check whether this
   is a matter of reusing/extracting that logic for a consumer-facing
   (non-workplace) flow rather than building new group logic from scratch.
2. This likely needs its own paid tier decision (the existing pairing
   report is monetized via Stripe per src/lib/stripe/ and the "Add Stripe
   checkout for unlocking paid compatibility reports" commit) — check with
   the user on pricing/tier for a group report before wiring checkout,
   don't assume the 2-person price point.
3. Scope this as a plan first (which existing components/logic can be
   reused vs. what's genuinely new) before writing implementation code, and
   share that plan with the user.

Done when: the user has a concrete, reviewed implementation plan (and,
once approved, a working group-compatibility flow reusing as much of the
existing pairing/teams code as possible).
```

### 4.2 Dedicated team/workplace landing page and funnel

```
The team/workplace product (src/components/teams/, routes under
src/app/[locale]/(personality)/teams/) is a distinct audience from the
consumer quiz-taker — HR/people-ops buyers, not individuals — but currently
has no dedicated entry point; it's reached only from within the
already-signed-in consumer app (per Tier 1.1 above, not even linked from
the homepage).

Build a standalone landing page for the team product:
1. Own URL (e.g. /teams or /for-teams), own messaging speaking to a
   workplace/HR buyer rather than an individual — different value prop
   framing (team composition insights, not personal self-discovery).
2. Own CTA path into team creation (CreateTeamForm.tsx) that doesn't
   require going through the individual-quiz-taker funnel first.
3. Keep this in all 5 locales, consistent with the rest of the site's i18n
   setup (check src/i18n/ and messages/ for the pattern).
4. Do not touch the existing consumer landing page beyond whatever nav
   link Tier 1.1 already added pointing here.

Done when: a workplace buyer can land directly on a teams-specific page,
understand the pitch, and get into team creation without ever seeing the
individual quiz flow first.
```

### 4.3 Localized content expansion (beyond UI strings)

```
The site is already localized at the UI-string level (next-intl, 5
locales: en/de/es/fr/zh — see messages/[locale]/), but the SEO content
(src/lib/seo/typeContent.ts, combinationContent.ts, and whatever real
content Tier 1.3 and Tier 3 add) is authored in English only and likely
just falls back to English or goes untranslated on non-English routes.

1. First confirm what actually happens today: do non-English /types/...
   routes show English content, or nothing? Check how content resolution
   works for these pages vs. the UI-string i18n system.
2. This is a translation/localization task, not a "generate 5x the content"
   task — get real translations for the type/combination page content
   (careers, relationships, descriptions, headlines, etc.), not
   machine-translated placeholders, for at least the highest-traffic type
   pages first rather than attempting full parity across all pages and
   locales in one pass.
3. Flag to the user which locales/pages you're prioritizing and why before
   doing the full set — this is a large content task, sequence it.

Done when: at minimum, the top-traffic type pages render real (not
English-fallback, not machine-translated-and-unreviewed) content in all 5
locales, with a clear list of what's still outstanding.
```
---

## Tier 5 — Opt-in discovery & approachability

### 5.1 Plan: discovery/approach architecture (review checkpoint)

```
Colevitate has two existing ways personality data connects people: the
`profiles` table's `is_public`/`share_slug` (a read-only, share-link-based
view of one person's result) and `pairings` (src/components/pairing/,
supabase/migrations/0004_pairings.sql) — a consent-based, invite-code
comparison between two people who already know each other's link.

Neither lets a stranger discover a person's profile and reach out cold.
That's the new feature: users who opt in become visible in a browsable
pool, and other users can send them a lightweight, context-carrying
"approach" — accepted or declined, entirely separate from pairing (an
accepted approach should NOT create a pairings row or touch the paid
Compatibility Report/Stripe flow; keep this a distinct, unpaid path).

Before writing any code:
1. Read profiles' migrations (0001, 0002), pairings' migration (0004,
   0005), src/components/pairing/pairingTypes.ts, and
   src/components/personality/compatibility/ (the existing axis-comparison
   logic used for pairing reports) — this feature should reuse the
   existing combined-axes/archetype data already on `profiles.results`
   and the existing compatibility-scoring logic for "what you have in
   common" surfacing, not invent a second personality data model.
2. Note the RLS pattern pairings.sql uses throughout: RLS row policies
   plus explicit column-level grants (`revoke ... grant (col1, col2, ...)`)
   so a client can never write columns like `status`/`unlocked_at`
   directly, and security-definer RPCs (`accept_pairing_invite`,
   `decline_pairing_invite`) as the only path that can. The new
   approach-request flow needs the same shape: accept/decline/block must
   go through security-definer functions, not raw client updates.
3. Note the privacy principle already stated in pairings.sql's own
   comments: store only slim derived axis/archetype snapshots, never the
   raw `PersonalityResults` jsonb. Apply that same minimization to
   whatever gets shown to an approaching stranger.
4. Write a short implementation plan covering: the new tables/columns,
   how "approachable" differs from `is_public` in the UI copy (so users
   don't confuse "share my result via link" with "let strangers approach
   me"), the approach lifecycle, and where the browse/discovery view lives
   in the route structure. Share the plan and stop.

Done when: you've shared a concrete plan reusing as much of the existing
profiles/compatibility code as fits, and gotten explicit go-ahead before
writing any schema or UI.
```

### 5.2 Data model: approachability state, approach requests, blocks, reports

```
Implement the schema from the approved 5.1 plan, following the RLS +
security-definer pattern from supabase/migrations/0004_pairings.sql
exactly (column-level grants after a blanket revoke, security-definer
functions for every state transition a client shouldn't be trusted to do
directly, an atomic `where status = ...` guard for concurrent claims).

Build, as a new migration:
1. Add an `approachable` state to `profiles`, separate from the existing
   `is_public`/`share_slug` columns — don't repurpose those. Include a
   scope (e.g. everyone / filtered / paused) and make "off"/"paused" the
   default for every existing and new row.
2. An `approach_requests` table: sender, recipient, status
   (pending/accepted/declined/expired/withdrawn), a required message, and
   — mirroring pairings' slim-snapshot principle — a small derived
   axis/archetype snapshot of each party captured at send time, never the
   raw `results` jsonb.
3. `blocks` and `reports` tables now, even before Tier 5.4/5.5 build their
   UI — don't leave safety data structures for later.
4. A minimal `approach_events` log (mirroring `pairing_events`) for
   invite_sent/accepted/declined/blocked/reported — this repo has no
   analytics vendor, this is how the other features answer funnel
   questions.
5. Server-side rate-limit accounting (e.g. a count/window on the sender)
   enforced in the security-definer send function, not just in the UI.

Done when: migrations apply cleanly, RLS prevents a client from directly
setting status/timestamps on any of these tables (only the security-definer
functions can), and there's test coverage for the accept/decline/block
transitions and the rate limit.
```

### 5.3 Profile visibility & approach-readiness controls (UI)

```
Add the user-facing controls for the state built in 5.2, most likely
alongside src/components/settings/ (check what's already there for the
is_public/share_slug toggle, if anything exists, and match its pattern).

1. An "approachable" toggle with scope selection and a pause option,
   written in plain language distinct from the existing "share my result"
   controls — these are two different privacy decisions and the copy must
   not conflate them.
2. A preview of exactly what an approaching stranger would see before the
   user turns this on — reuse whatever slim summary/archetype card
   component already exists rather than building a new one.
3. Keep every state reversible from this same screen at any time.
4. Cover all 5 locales (en/de/es/fr/zh per src/i18n/ and messages/) —
   check for any new translation keys and add them for every locale, not
   English only.

Done when: a signed-in user can turn approachability on/off/scoped, see
an accurate preview of their exposure before opting in, and change it back
at any time, in all 5 locales.
```

### 5.4 Discovery browse view & the approach flow

```
Build the actual discovery and approach experience on top of 5.2/5.3.

1. A browse view scoped strictly to `approachable = true` and each
   viewer's own scope rules from 5.3 — no profile outside a user's current
   visibility scope should ever be fetchable, not just hidden client-side.
2. Surface shared-trait/compatibility context on each browsable profile
   using the existing compatibility logic in
   src/components/personality/compatibility/ (the same axis-comparison
   this app already does for pairing reports) — this is what should make
   an approach feel informed rather than cold, and it's already built,
   don't reimplement it.
3. The approach action itself: enforce the required, profile-referencing
   message from 5.2's schema (reject empty/generic messages at write
   time, not just via a UI hint) and the server-side rate limit.
4. Accept/decline: declining costs the recipient nothing and needs no
   justification; accepting should NOT create a pairings row or touch
   Stripe — this stays a separate, unpaid path per the 5.1 plan. What
   "connected" unlocks next (messaging, etc.) can be scoped down to "mark
   accepted" for now if there's no existing messaging surface to hook
   into — flag that gap rather than building a new inbox system
   speculatively.
5. Notifications for received/accepted/declined approaches can reuse
   whatever notification mechanism (if any) exists elsewhere in the app;
   if none exists, treat this as explicitly out of scope for this tier
   rather than building one from scratch.

Done when: an approachable user can be discovered only within their own
scope, receive a context-carrying approach with visible compatibility
signal, and accept/decline it, without touching the pairing/Stripe code
paths at all.
```

### 5.5 Safety hardening & privacy pass

```
Close the loop on the blocks/reports tables from 5.2.

1. Block: instantly and silently removes the blocked user's ability to
   view the profile or send further approaches; no notification to the
   blocked party; check this is enforced at the query/RLS level, not only
   hidden in the UI.
2. Report: a simple flow from a profile or an approach message; land it
   wherever an admin/moderation surface already exists in this app, or
   note there isn't one yet rather than building a full admin panel
   speculatively.
3. Full deletion: a user can delete their approachability data and
   profile outright (not just toggle it off), cascading to any pending
   approach_requests involving them.
4. Audit Tiers 5.2-5.4's code for anything that could leak a full
   `results` jsonb, a raw message, or approach history into logs,
   analytics events, or error reports — this repo's stated principle
   (see pairings.sql's comments) is derived-axis-snapshots-only, never
   raw personality data, and that needs to hold here too.

Done when: block and report are enforced server-side and tested, full
deletion cascades correctly, and a specific pass has confirmed no
sensitive field from this feature can leak into logs/analytics.
```
