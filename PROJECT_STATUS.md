# Colevitate — Project Status

_Last updated: 2026-08-17_

## Product

Next.js 16 / React 19 / TypeScript app at **colevitate.com** ("Personality Studio"). Combines four personality assessments — 16 Personalities-style MBTI, Big Five, Human Design, 4 Color Types — into one combined profile scored across four axes (Energy, Structure, People, Novelty) via a weighted scoring matrix (`src/components/personality/combined/scoringMatrix.ts`).

A full business analysis (monetization options, competitive landscape, value-package ideas) has already been produced — see the delivered Word doc for details. Key takeaway: the multi-framework synthesis is the core differentiator; no direct consumer competitor combines this many frameworks into one profile.

## Brand

Logo direction chosen: **fingerprint spiral** concept — a flowing spiral of concentric arcs in a teal-to-violet gradient, converging to a glowing center point, on a dark navy rounded-square tile. Chosen over an infinity-loop mark and an overlapping-circles mark (the latter rejected for palette inconsistency and being a more generic/overused "convergence" trope).

## Feature roadmap (prioritized by impact vs. build effort)

**Tier 1 — shipped/in progress, no backend required:**
- Archetype label + one-line description for the combined profile
- Framework agreement/disagreement view per axis
- Shareable export card (image export of the result)
- Methodology / "how this is calculated" page

Check current status — this was being built via concurrent Claude Code sessions ("personality-qu...", "Add archetypes...") that had merged into `main` as of the last production deploy (commit `299dbd9`).

**Tier 2 — drafted prompt, not yet run, no backend required:**
- "Why this score" breakdown per axis (traces back through each framework's own `scoring.ts`)
- Growth prompts / career-fit suggestions (content mapped to axis ranges)
- Retake & trend history (via `storage.ts`, so it works whether or not a backend exists yet)

**Tier 3 — backend foundation, ready to execute:**
- Full auth + database prompt written (Google SSO primary, email magic-link fallback, `profiles` table with RLS, wired through `storage.ts`). See "Next step" below.

**Tier 4 — longer-horizon:**
- Compatibility/relationship matching between two profiles (highest-leverage differentiated feature, needs shareable persisted profiles)
- Team/workplace product, API licensing

## Backend & infrastructure state

- **Supabase** project: ref `nmvhxehkqdgyegjgxhoc` (project name `colevitate-v1`), free tier.
- **Auth providers enabled**: Google OAuth (client created in Google Cloud, published to production — not stuck in Testing mode) and email magic link (OTP, passwordless) as fallback.
- **Redirect URLs**: configured in Supabase with a wildcard for localhost (`http://localhost:*/**`) to handle Next.js dev server port changes; production domain set as an exact entry.
- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in `.env.local` and pushed to Vercel across Production, Preview, and Development.
- **Domain/DNS**: registrar is Namecheap, DNS managed via Cloudflare. Stale registrar-default MX/SPF records (`eforward*.registrar-servers.com`) were removed from the root domain — they were unrelated default "Email Forwarding" plumbing that conflicted with Cloudflare Email Routing's MX records.
- **Email receiving**: Cloudflare Email Routing configured — `hello@colevitate.com` forwards to `colevitate@gmail.com`.
- **Email sending (SMTP for magic links)**: Resend account, domain verified on the `send.colevitate.com` subdomain (DKIM + SPF verified there, isolated from the root domain so no conflicts). Wired into Supabase Authentication → Email → SMTP Settings (`smtp.resend.com`, port 465, username `resend`, password = Resend API key).
- **Current gap**: env vars and infra are fully wired, but the app itself has no `@supabase/supabase-js` dependency and no client code yet — nothing in the codebase talks to Supabase. This is intentional; it's the next step.

## Next step

Run this prompt in a fresh Claude Code session to build the actual integration:

> I'm adding Supabase (Postgres + Auth) to Colevitate... [full prompt already drafted — covers: installing `@supabase/ssr`/`@supabase/supabase-js`, App Router SSR client helpers, a sign-in UI with Google as the primary action and email magic link as a secondary fallback, a `profiles` table migration with RLS, and wiring `storage.ts` to read/write Supabase for signed-in users while leaving signed-out users on localStorage as today. Explicitly scoped to stop before compatibility-matching, shareable links, or retake/trend history.]

(Full prompt text is long — pull it from chat history if starting a new conversation, or ask for it to be regenerated with this file as context.)
