# QA setup script — tiered

Same script as before, as Markdown instead of `.sh` for easier download/viewing.
Save the code block below as `qa-setup.sh` in your project root (next to `package.json`), then:

```bash
chmod +x qa-setup.sh
./qa-setup.sh          # run every tier
./qa-setup.sh 1 2 6    # or just the ones you want
./qa-setup.sh --list   # see what each tier does
```

## Tiers

| Tier | What it does |
|---|---|
| 0 | Setup — installs Playwright, linkinator, lighthouse, wait-on; scaffolds `qa/`; adds `package.json` scripts. Run first. |
| 1 | Broken link / 404 crawler (`qa/link-crawler.sh`, via linkinator) |
| 2 | Runtime console-error sweep (`qa/console-sweep.mjs`) |
| 3 | Lighthouse CI with score thresholds (`qa/lighthouse-check.mjs`) |
| 4 | Visual regression testing (`qa/visual/visual.spec.mjs`) |
| 5 | E2E flow tests, template (`qa/e2e/basic-flows.spec.mjs`) |
| 6 | Mobile viewport sweep + root-cause grep (`qa/mobile-viewport-sweep.mjs`, `qa/mobile-root-cause-grep.sh`) |
| 7 | Monitoring scaffold — mostly manual notes (`qa/monitoring-setup-notes.md`) |
| 8 | GitHub Action wiring (`.github/workflows/qa.yml`) |

## Script

```bash
#!/usr/bin/env bash
# ==============================================================================
# qa-setup.sh — Tiered QA scaffolding for an Astro + pnpm + Vercel site
#
# Drop this file in your project root (next to package.json) and run it there:
#   chmod +x qa-setup.sh
#   ./qa-setup.sh              # run every tier, in order
#   ./qa-setup.sh 1 2 6        # run only the tiers you name
#   ./qa-setup.sh --list       # show what each tier does, then exit
#
# Each tier is self-contained and idempotent — re-running one just overwrites
# the files it owns, so you can tweak a generated script and re-run just that
# tier without redoing the others. Tier 0 must run at least once before the
# others (it installs the shared dependencies).
#
# Override the URL the scripts point at with QA_BASE_URL, e.g.:
#   QA_BASE_URL=http://localhost:4321 ./qa-setup.sh
# ==============================================================================

set -euo pipefail

ALL_TIERS=(0 1 2 3 4 5 6 7 8)
QA_BASE_URL_DEFAULT="http://localhost:4321"

# ---- helpers ----------------------------------------------------------------

require_project_root() {
  if [[ ! -f package.json ]]; then
    echo "✗ No package.json here — run this from the project root." >&2
    exit 1
  fi
}

pkg_mgr() {
  if [[ -f pnpm-lock.yaml ]] || command -v pnpm >/dev/null 2>&1; then
    echo "pnpm"
  else
    echo "npm"
  fi
}

add_pkg_script() {
  # usage: add_pkg_script <script-name> <command>
  NAME="$1" CMD="$2" node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts[process.env.NAME] = process.env.CMD;
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
  '
}

ensure_gitignore() {
  touch .gitignore
  grep -qxF 'qa/reports/' .gitignore 2>/dev/null || echo 'qa/reports/' >> .gitignore
  grep -qxF 'test-results/' .gitignore 2>/dev/null || echo 'test-results/' >> .gitignore
}

# ---- Tier 0 — setup ----------------------------------------------------------

tier0_setup() {
  echo "── Tier 0: setup ──────────────────────────────────────────"
  require_project_root
  mkdir -p qa/e2e qa/visual qa/lib qa/reports .github/workflows
  ensure_gitignore

  local mgr; mgr=$(pkg_mgr)
  echo "Installing QA dependencies with $mgr..."
  if [[ "$mgr" == "pnpm" ]]; then
    pnpm add -D @playwright/test playwright linkinator lighthouse wait-on
    pnpm exec playwright install --with-deps chromium
  else
    npm install -D @playwright/test playwright linkinator lighthouse wait-on
    npx playwright install --with-deps chromium
  fi

  add_pkg_script "qa:links"      "QA_BASE_URL=\${QA_BASE_URL:-$QA_BASE_URL_DEFAULT} bash qa/link-crawler.sh"
  add_pkg_script "qa:console"    "node qa/console-sweep.mjs"
  add_pkg_script "qa:lighthouse" "node qa/lighthouse-check.mjs"
  add_pkg_script "qa:mobile"     "node qa/mobile-viewport-sweep.mjs"
  add_pkg_script "qa:visual"     "playwright test -c qa/playwright.config.mjs qa/visual"
  add_pkg_script "qa:e2e"        "playwright test -c qa/playwright.config.mjs qa/e2e"
  add_pkg_script "qa:all"        "pnpm qa:links && pnpm qa:console && pnpm qa:mobile && pnpm qa:lighthouse"

  cat > qa/lib/get-routes.mjs <<'FILEEOF'
// Discovers the site's routes: tries the sitemap first, falls back to a
// shallow crawl of internal links from the homepage.
export async function getRoutes(baseUrl) {
  for (const path of ['/sitemap-index.xml', '/sitemap.xml']) {
    try {
      const res = await fetch(baseUrl + path);
      if (!res.ok) continue;
      const xml = await res.text();
      const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
      if (!locs.length) continue;

      if (path === '/sitemap-index.xml') {
        const all = [];
        for (const sub of locs) {
          const subRes = await fetch(sub);
          if (subRes.ok) {
            const subXml = await subRes.text();
            all.push(...[...subXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
          }
        }
        if (all.length) return [...new Set(all)];
      } else {
        return [...new Set(locs)];
      }
    } catch {
      // try the next strategy
    }
  }

  // Fallback: shallow crawl from the homepage
  const res = await fetch(baseUrl);
  const html = await res.text();
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => baseUrl + m[1]);
  return [...new Set([baseUrl, ...hrefs])];
}
FILEEOF

  echo "✓ qa/ scaffolded, dependencies installed, package.json scripts added."
}

# ---- Tier 1 — broken link / 404 crawler --------------------------------------

tier1_link_crawler() {
  echo "── Tier 1: broken link / 404 crawler ──────────────────────"
  mkdir -p qa
  cat > qa/link-crawler.sh <<'FILEEOF'
#!/usr/bin/env bash
# Crawls the site from QA_BASE_URL, flags 404s, redirect loops, and broken
# external links. Needs the site running first (`pnpm dev` or `pnpm preview`).
set -euo pipefail
BASE_URL="${QA_BASE_URL:-http://localhost:4321}"
mkdir -p qa/reports
echo "Crawling $BASE_URL ..."
npx linkinator "$BASE_URL" --recurse | tee qa/reports/link-report.txt
FILEEOF
  chmod +x qa/link-crawler.sh
  echo "✓ qa/link-crawler.sh"
}

# ---- Tier 2 — runtime console-error sweep ------------------------------------

tier2_console_sweep() {
  echo "── Tier 2: console-error sweep ────────────────────────────"
  mkdir -p qa
  cat > qa/console-sweep.mjs <<'FILEEOF'
// Visits every discovered route in a headless browser and reports any
// console.error output or uncaught exceptions — the silent JS failures
// that don't show up just by looking at the page.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { getRoutes } from './lib/get-routes.mjs';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:4321';
const routes = await getRoutes(BASE_URL);
console.log(`Sweeping ${routes.length} route(s) for console errors...`);

const browser = await chromium.launch();
const results = [];

for (const url of routes) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(`Uncaught: ${err.message}`));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    errors.push(`Navigation failed: ${e.message}`);
  }
  if (errors.length) results.push({ url, errors });
  await page.close();
}

await browser.close();
mkdirSync('qa/reports', { recursive: true });
writeFileSync('qa/reports/console-errors.json', JSON.stringify(results, null, 2));

if (results.length) {
  console.log(`✗ ${results.length} page(s) threw console errors:`);
  for (const r of results) {
    console.log(`  ${r.url}`);
    r.errors.forEach((e) => console.log(`    - ${e}`));
  }
  process.exit(1);
} else {
  console.log('✓ No console errors on any page.');
}
FILEEOF
  echo "✓ qa/console-sweep.mjs"
}

# ---- Tier 3 — Lighthouse CI ---------------------------------------------------

tier3_lighthouse() {
  echo "── Tier 3: Lighthouse CI ──────────────────────────────────"
  mkdir -p qa
  cat > qa/lighthouse-check.mjs <<'FILEEOF'
// Runs a Lighthouse audit against every discovered route and fails if any
// page drops below the score thresholds below — the same idea as
// Lighthouse CI, without needing the separate @lhci/cli setup.
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { getRoutes } from './lib/get-routes.mjs';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:4321';
const THRESHOLDS = { performance: 0.8, accessibility: 0.9, 'best-practices': 0.9, seo: 0.9 };

mkdirSync('qa/reports/lighthouse', { recursive: true });
const routes = await getRoutes(BASE_URL);
let failed = false;

for (const url of routes) {
  const slug = url.replace(BASE_URL, '').replace(/[\/?#]/g, '_') || 'home';
  const outPath = `qa/reports/lighthouse/${slug}.json`;
  console.log(`Auditing ${url} ...`);
  execSync(
    `npx lighthouse "${url}" --output=json --output-path="${outPath}" --chrome-flags="--headless=new" --quiet`,
    { stdio: 'inherit' }
  );
  const { categories } = JSON.parse(readFileSync(outPath, 'utf8'));
  for (const [key, min] of Object.entries(THRESHOLDS)) {
    const score = categories[key]?.score ?? 0;
    if (score < min) {
      failed = true;
      console.log(`  ✗ ${key}: ${Math.round(score * 100)} (threshold ${min * 100})`);
    } else {
      console.log(`  ✓ ${key}: ${Math.round(score * 100)}`);
    }
  }
}

if (failed) {
  console.log('\nOne or more pages fell below a Lighthouse threshold.');
  process.exit(1);
}
console.log('\n✓ All pages passed Lighthouse thresholds.');
FILEEOF
  echo "✓ qa/lighthouse-check.mjs"
}

# ---- Tier 4 — visual regression testing --------------------------------------

tier4_visual_regression() {
  echo "── Tier 4: visual regression testing ──────────────────────"
  mkdir -p qa/visual
  cat > qa/playwright.config.mjs <<'FILEEOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  use: {
    baseURL: process.env.QA_BASE_URL || 'http://localhost:4321',
  },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    { name: 'tablet', use: { ...devices['iPad Mini'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  reporter: [['list'], ['html', { outputFolder: 'qa/reports/playwright-report', open: 'never' }]],
});
FILEEOF

  cat > qa/visual/visual.spec.mjs <<'FILEEOF'
// Screenshots every discovered route at three breakpoints and diffs
// against committed baselines. First run establishes the baselines:
//   playwright test -c qa/playwright.config.mjs qa/visual --update-snapshots
import { test, expect } from '@playwright/test';
import { getRoutes } from '../lib/get-routes.mjs';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:4321';
const routes = await getRoutes(BASE_URL);

for (const url of routes) {
  const name = url.replace(BASE_URL, '') || '/';
  test(`visual: ${name}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot(`${name.replace(/\//g, '_') || 'home'}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
}
FILEEOF
  echo "✓ qa/playwright.config.mjs, qa/visual/visual.spec.mjs"
  echo "  (run with --update-snapshots once to create baselines, then commit qa/visual/*-snapshots/)"
}

# ---- Tier 5 — E2E flow tests --------------------------------------------------

tier5_e2e() {
  echo "── Tier 5: E2E flow tests ─────────────────────────────────"
  mkdir -p qa/e2e
  cat > qa/e2e/basic-flows.spec.mjs <<'FILEEOF'
// Template — the two checks below run as-is against any site. Fill in the
// commented contact-form test with your real field names/selectors.
import { test, expect } from '@playwright/test';

test('homepage loads with a real title, not a 404', async ({ page }) => {
  await page.goto('/');
  await expect(page).not.toHaveTitle(/^$/);
  await expect(page.locator('body')).not.toContainText('404');
});

test('primary nav links are all reachable', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('nav a[href^="/"]').all();
  for (const link of links) {
    const href = await link.getAttribute('href');
    const resp = await page.request.get(href);
    expect(resp.status(), `nav link ${href}`).toBeLessThan(400);
  }
});

// test('contact form submits successfully', async ({ page }) => {
//   await page.goto('/contact');
//   await page.fill('input[name="name"]', 'QA Test');
//   await page.fill('input[name="email"]', 'qa@example.com');
//   await page.fill('textarea[name="message"]', 'Automated QA test message.');
//   await page.click('button[type="submit"]');
//   await expect(page.locator('.success-message')).toBeVisible();
// });
FILEEOF
  echo "✓ qa/e2e/basic-flows.spec.mjs (customize the contact-form block for your markup)"
}

# ---- Tier 6 — mobile viewport sweep -------------------------------------------

tier6_mobile_viewport() {
  echo "── Tier 6: mobile viewport sweep ──────────────────────────"
  mkdir -p qa
  cat > qa/mobile-viewport-sweep.mjs <<'FILEEOF'
// Resizes to narrow widths and flags horizontal overflow (the classic
// "zoomed out on mobile" symptom) on every discovered route.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { getRoutes } from './lib/get-routes.mjs';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:4321';
const WIDTHS = [320, 375, 390];

const routes = await getRoutes(BASE_URL);
const browser = await chromium.launch();
const flagged = [];

for (const url of routes) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(url, { waitUntil: 'networkidle' });
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    if (overflow) {
      flagged.push({ url, width, scrollWidth });
      mkdirSync('qa/reports/mobile-screenshots', { recursive: true });
      const slug = url.replace(BASE_URL, '').replace(/[\/?#]/g, '_') || 'home';
      await page.screenshot({ path: `qa/reports/mobile-screenshots/${slug}_${width}.png`, fullPage: true });
    }
    await page.close();
  }
}

await browser.close();
mkdirSync('qa/reports', { recursive: true });
writeFileSync('qa/reports/mobile-viewport-report.json', JSON.stringify(flagged, null, 2));

if (flagged.length) {
  console.log(`✗ Horizontal overflow on ${flagged.length} page/width combo(s):`);
  flagged.forEach((f) => console.log(`  ${f.url} @ ${f.width}px — scrollWidth ${f.scrollWidth}`));
  console.log('\nRun `bash qa/mobile-root-cause-grep.sh` against your src/ to find why.');
  process.exit(1);
} else {
  console.log(`✓ No horizontal overflow at ${WIDTHS.join(', ')}px on any page.`);
}
FILEEOF

  cat > qa/mobile-root-cause-grep.sh <<'FILEEOF'
#!/usr/bin/env bash
# Greps src/ for the usual causes of mobile horizontal-overflow bugs.
# Doesn't replace the runtime sweep — run this once it flags a page and
# you need to find *why*. Usage: bash qa/mobile-root-cause-grep.sh [src]
set -euo pipefail
SRC="${1:-src}"

echo "── Duplicate class= attributes (second one silently wins) ──"
grep -rnoE '<[a-zA-Z]+[^>]*class="[^"]*"[^>]*class="[^"]*"' "$SRC" || echo "  none found"

echo
echo "── Inline style= with grid/flex properties (media queries can't override) ──"
grep -rnoE 'style="[^"]*(grid-template-columns|display:\s*flex|display:\s*grid)[^"]*"' "$SRC" || echo "  none found"

echo
echo "── grid-template-columns: 1fr without minmax(0, ...) ──"
grep -rnoE 'grid-template-columns:\s*[^;]*[^m]1fr[^;]*' "$SRC" | grep -v 'minmax' || echo "  none found"

echo
echo "── Negative inset/offset on positioned elements ──"
grep -rnoE '(inset|top|left|right|bottom):\s*-[0-9]+(px|%|rem)' "$SRC" || echo "  none found"

echo
echo "── iframe embeds (check for a static, non-animated variant) ──"
grep -rnoE '<iframe[^>]*src="[^"]*"' "$SRC" || echo "  none found"
FILEEOF
  chmod +x qa/mobile-root-cause-grep.sh
  echo "✓ qa/mobile-viewport-sweep.mjs, qa/mobile-root-cause-grep.sh"
}

# ---- Tier 7 — monitoring scaffold ---------------------------------------------

tier7_monitoring() {
  echo "── Tier 7: monitoring scaffold ────────────────────────────"
  mkdir -p qa
  cat > qa/monitoring-setup-notes.md <<'FILEEOF'
# Ongoing monitoring — manual steps

The scripted tiers cover pre-deploy checks. Live monitoring runs on the
third-party services' own servers, not in this repo, so these steps are
manual (each is a few minutes, one-time):

## Error tracking (Sentry)
1. Create a project at https://sentry.io (choose "Astro" as the platform).
2. `pnpm add @sentry/astro`
3. In `astro.config.mjs`, add the Sentry integration with your DSN
   (Sentry's setup wizard, `npx @sentry/wizard@latest -i sourcemaps`,
   will do this for you and wire up source maps).
4. Add `SENTRY_DSN` to `.env` locally and to your hosting provider's env
   vars (e.g. `vercel env add SENTRY_DSN production`).

## Uptime monitoring
1. Create a free monitor at https://betteruptime.com or
   https://uptimerobot.com pointed at your production URL.
2. Set the check interval (1–5 min) and an alert channel (email/Slack/SMS).

Neither of these needs anything else in this repo — once the DSN/monitor
exists, they run independently of any CI pipeline.
FILEEOF
  echo "✓ qa/monitoring-setup-notes.md (Sentry/uptime setup is manual — see the file)"
}

# ---- Tier 8 — GitHub Action wiring ---------------------------------------------

tier8_github_action() {
  echo "── Tier 8: GitHub Action wiring ───────────────────────────"
  mkdir -p .github/workflows
  cat > .github/workflows/qa.yml <<'FILEEOF'
name: QA

on:
  push:
    branches: [main]
  pull_request:

jobs:
  qa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm build

      - name: Start preview server
        run: pnpm preview &

      - name: Wait for server
        run: npx wait-on http://localhost:4321

      - run: pnpm qa:links
      - run: pnpm qa:console
      - run: pnpm qa:mobile
      - run: pnpm qa:lighthouse
      # Uncomment once you've committed baseline screenshots (see Tier 4):
      # - run: pnpm qa:visual
      # Uncomment once qa/e2e selectors match your real markup (see Tier 5):
      # - run: pnpm qa:e2e

      - name: Upload QA reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: qa-reports
          path: qa/reports
FILEEOF
  echo "✓ .github/workflows/qa.yml (runs links/console/mobile/lighthouse on every push and PR)"
}

# ---- dispatcher ---------------------------------------------------------------

print_list() {
  cat <<'LISTEOF'
Tier 0 — setup: installs Playwright, linkinator, lighthouse, wait-on;
         scaffolds qa/, adds package.json scripts. Run this first.
Tier 1 — broken link / 404 crawler (qa/link-crawler.sh, via linkinator)
Tier 2 — runtime console-error sweep (qa/console-sweep.mjs)
Tier 3 — Lighthouse CI with score thresholds (qa/lighthouse-check.mjs)
Tier 4 — visual regression testing (qa/visual/visual.spec.mjs)
Tier 5 — E2E flow tests, template (qa/e2e/basic-flows.spec.mjs)
Tier 6 — mobile viewport sweep + root-cause grep (qa/mobile-viewport-sweep.mjs,
         qa/mobile-root-cause-grep.sh)
Tier 7 — monitoring scaffold, mostly manual notes (qa/monitoring-setup-notes.md)
Tier 8 — GitHub Action wiring (.github/workflows/qa.yml)
LISTEOF
}

if [[ "${1:-}" == "--list" || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  print_list
  exit 0
fi

if [[ $# -eq 0 ]]; then
  REQUESTED=("${ALL_TIERS[@]}")
else
  REQUESTED=("$@")
fi

for t in "${REQUESTED[@]}"; do
  case "$t" in
    0) tier0_setup ;;
    1) tier1_link_crawler ;;
    2) tier2_console_sweep ;;
    3) tier3_lighthouse ;;
    4) tier4_visual_regression ;;
    5) tier5_e2e ;;
    6) tier6_mobile_viewport ;;
    7) tier7_monitoring ;;
    8) tier8_github_action ;;
    *) echo "✗ Unknown tier: $t (use --list to see valid tiers)" >&2; exit 1 ;;
  esac
done

echo
echo "Done. Start the site (\`pnpm dev\` or \`pnpm build && pnpm preview\`), then e.g.:"
echo "  pnpm qa:links && pnpm qa:console && pnpm qa:mobile"
```
