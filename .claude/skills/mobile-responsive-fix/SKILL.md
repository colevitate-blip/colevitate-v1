---
name: mobile-responsive-fix
description: Diagnose and fix mobile/responsive layout bugs — "mobile view is zoomed out", "doesn't fit the screen", panning sideways, a card/grid overflowing or not collapsing to one column — using a Capture→Diagnose→Fix→Verify loop backed by a real-device Playwright script (Android via Chromium, iPhone via real WebKit). Use whenever a mobile/responsive bug is reported, or when asked to verify a CSS fix actually looks right on mobile before declaring it done. Root-cause diagnostics for WHY these bugs happen live in the web-project-setup skill (references/responsive-fixes.md) — this skill is the verification loop and tooling that makes a fix reliable instead of a guess.
---

# Mobile/Responsive Fix — Verification Loop & Tooling

## Why a one-shot "fix the mobile view" prompt fails

It has no forced checkpoint, so it tends to guess at a cause, touch several
unrelated things in one pass, and declare victory after reading the CSS
instead of rendering it — one bug turns into a scattered mess across the
page. The five recurring root causes themselves (duplicate `class`
attributes, inline styles beating media queries, bare `1fr` grid tracks,
bleeding absolutely-positioned elements, third-party iframe embeds) are
documented in the `web-project-setup` skill's `references/responsive-fixes.md`
— read that when you need the "why" and the exact fix for a given cause.
This skill is the loop that makes sure a fix actually gets verified instead
of assumed.

## The loop

0. **Capture** — before editing anything, run `scripts/verify-mobile.mjs`
   (bundled with this skill) against the dev server. Its output is your
   list of concrete bugs, not a vague impression.
1. **Diagnose with grep, not judgment** — run these against the files the
   page touches, before any edit:
   ```bash
   rg -n 'class="[^"]*"[^>]*class="[^"]*"' src/                          # cause 1: duplicate class attrs
   rg -n 'style="[^"]*(display:\s*(grid|flex)|grid-template-columns)' src/ # cause 2: inline layout styles
   rg -n 'grid-template-columns:\s*repeat\([^,]+,\s*1fr\)' src/            # cause 3: bare 1fr tracks
   rg -n '(inset|top|left|right|bottom):\s*-' src/styles src/components 2>/dev/null  # cause 4: bleeding absolutes
   rg -n '<iframe' src/                                                    # cause 5: third-party embeds
   ```
2. **Fix ONE root cause, one commit** — pick the single element the script
   flagged, cross-referenced against the grep hit that explains it. Fix
   only that. Commit message names the cause, e.g. `fix: grid-template-columns
   1fr -> minmax(0,1fr) (cause 3)`.
3. **Verify — re-run the script**, don't re-read the CSS. Confirm zero
   overflow AND that this specific element is gone from the offender list
   before touching anything else.
4. **Repeat from step 0** until the script is clean at every breakpoint.

## Prompt template

Use this instead of "fix the mobile view on X":
```
Mobile overflow on <page/route>. Do NOT edit anything yet.
1. Run scripts/verify-mobile.mjs against <url> <route> and show me the output.
2. Run the 5 grep checks above against the files touched by this page/route
   and show me the hits.
3. Cross-reference: which single element did the script flag, and which
   grep hit explains it? That's root cause #1 — nothing else.
4. Make ONLY that fix. Re-run the verify script. Confirm zero overflow for
   that element before touching anything else.
5. If overflow remains, stop and report what's still flagged — don't guess
   a second fix in the same pass.
```

**Never declare a mobile fix done without pasting both the before and after
output of `scripts/verify-mobile.mjs`.** Reading the stylesheet and
reasoning about it has produced confidently-wrong conclusions before (e.g.
`1fr` looking correct at a glance when the real bug was min-content width).

## The verify script

`scripts/verify-mobile.mjs` loads a URL under REAL device profiles —
Android via Chromium, iPhone via Playwright's actual WebKit engine (Apple
requires every iOS browser to use WebKit under the hood, so this one engine
covers effectively all iOS traffic, not just Safari) — and reports the
actual offending element(s), not just yes/no overflow.

It also catches the classic "renders zoomed out" bug at its source: under
real device emulation, an overflowing page with a proper
`width=device-width` meta tag doesn't get clipped — the browser silently
widens `window.innerWidth` to fit the overflow and zooms the whole page
down to compensate. A naive check comparing `scrollWidth` to
`window.innerWidth` misses this because both sides inflate together, so the
script compares against the device's true declared width instead.

### One-time setup

Installed once here, in this skill's own `scripts/` folder — reused by
every project, not a per-project devDependency:
```bash
cd "C:\Users\Edgar\Projects\skills\mobile-responsive-fix\scripts"
npm install
npx playwright install chromium webkit
```

### Usage (dev server already running)

```bash
node "C:\Users\Edgar\Projects\skills\mobile-responsive-fix\scripts\verify-mobile.mjs" http://localhost:4321 /
node "C:\Users\Edgar\Projects\skills\mobile-responsive-fix\scripts\verify-mobile.mjs" http://localhost:4321 /pricing /about
```

If WebKit isn't installed yet it won't crash — it skips the iPhone profiles
with a clear message and still runs the Android/Chromium ones.
