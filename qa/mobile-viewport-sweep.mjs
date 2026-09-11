// Autonomous mobile-bug finder: discovers every route on the site, then
// loads a representative sample under REAL device profiles (real engine,
// touch/UA flags — not a resized desktop window) and reports genuine
// horizontal overflow with the actual offending element(s).
//
// Two engines on purpose: Android devices run under Chromium; iPhone
// devices run under Playwright's real WEBKIT build, since Apple requires
// every iOS browser to use WebKit under the hood. Chromium's mobile
// emulation cannot reproduce WebKit-specific rendering bugs.
//
// Detection compares document width against the DEVICE's declared CSS
// width, not `window.innerWidth` — a page with genuine overflow and a
// `width=device-width` meta tag gets its layout viewport silently widened
// by the browser to fit the overflow (then zoomed down to compensate,
// which IS the "renders zoomed out on mobile" bug). Comparing scrollWidth
// against innerWidth misses this because both sides inflate together.
//
// Env vars:
//   QA_BASE_URL        default http://localhost:3000
//   MOBILE_ALL_LOCALES=1   test every locale instead of just the default one
//   MOBILE_FULL=1          test every discovered route instead of one
//                          representative per route "shape" (fast default)
import { chromium, webkit, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { getRoutes } from './lib/get-routes.mjs';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';
const ALL_LOCALES = process.env.MOBILE_ALL_LOCALES === '1';
const FULL = process.env.MOBILE_FULL === '1';
const DEFAULT_LOCALE = 'en';
const SCREENSHOT_DIR = 'qa/reports/mobile-screenshots';
const REPORT_PATH = 'qa/reports/mobile-viewport-report.json';

function profile(name, browserTypeName) {
  const { defaultBrowserType, ...contextOpts } = devices[name];
  return { name, browserTypeName, ...contextOpts };
}
const DEVICE_PROFILES = [
  profile('Galaxy S24', 'chromium'), // 360px
  profile('Pixel 7', 'chromium'),    // 412px
  profile('iPhone SE', 'webkit'),    // 320px, real WebKit
  profile('iPhone 13', 'webkit'),    // 390px, real WebKit
];

// One representative route per "shape" — e.g. every /types/mbti/<slug> page
// collapses to one, since a layout bug on that template shows up on all of
// them. Short/static paths (locale root, /types, /people, ...) pass through
// untouched since they only have 0-2 segments.
function shapeKey(pathname) {
  const segs = pathname.split('/').filter(Boolean);
  return segs.length <= 2 ? pathname : segs.slice(0, -1).join('/');
}

function dedupeByShape(pathnames) {
  const seen = new Set();
  const kept = [];
  for (const p of pathnames) {
    const key = shapeKey(p);
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(p);
  }
  return kept;
}

/** Runs inside the page. See file header for why targetWidth (the device's
 * declared width) is the comparison basis, not window.innerWidth. */
function findOverflowOffenders(targetWidth) {
  const layoutViewportWidth = window.innerWidth;
  const docWidth = document.documentElement.scrollWidth;
  const hasOverflow = docWidth > targetWidth + 1;
  const layoutViewportBallooned = layoutViewportWidth > targetWidth + 1;

  if (!hasOverflow) {
    return { hasOverflow: false, layoutViewportBallooned, docWidth, layoutViewportWidth, targetWidth, offenders: [] };
  }

  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    const overflowAmount = rect.right - targetWidth;
    if (overflowAmount > 1) {
      const classes = el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).join('.')
        : '';
      const id = el.id ? '#' + el.id : '';
      offenders.push({
        tag: el.tagName.toLowerCase(),
        id,
        classes,
        overflowPx: Math.round(overflowAmount),
        rectWidth: Math.round(rect.width),
        inlineStyle: el.getAttribute('style') || null,
      });
    }
  }
  offenders.sort((a, b) => b.overflowPx - a.overflowPx);
  return { hasOverflow: true, layoutViewportBallooned, docWidth, layoutViewportWidth, targetWidth, offenders: offenders.slice(0, 8) };
}

// --- discover routes ---
const discovered = await getRoutes(BASE_URL);
let pathnames = [...new Set(discovered.map((u) => new URL(u).pathname))];

if (!ALL_LOCALES) {
  pathnames = pathnames.filter((p) => {
    const first = p.split('/').filter(Boolean)[0];
    return !first || first === DEFAULT_LOCALE || first.length !== 2;
  });
}

const routes = FULL ? pathnames : dedupeByShape(pathnames);
console.log(
  `Discovered ${pathnames.length} route(s)` +
  (FULL ? '' : `, checking ${routes.length} representative shape(s) (set MOBILE_FULL=1 to check all)`) +
  ` across ${DEVICE_PROFILES.length} device profiles...`
);

mkdirSync(SCREENSHOT_DIR, { recursive: true });

const browserInstances = {};
async function getBrowser(browserTypeName) {
  if (browserTypeName in browserInstances) return browserInstances[browserTypeName];
  const engine = { chromium, webkit }[browserTypeName];
  try {
    const instance = await engine.launch();
    browserInstances[browserTypeName] = instance;
    return instance;
  } catch (err) {
    console.error(`\nCould not launch "${browserTypeName}": ${err.message}\nRun: npx playwright install ${browserTypeName}\n`);
    browserInstances[browserTypeName] = null;
    return null;
  }
}

const flagged = [];

for (const route of routes) {
  const url = new URL(route, BASE_URL).toString();
  console.log(`\n=== ${route || '/'} ===`);

  for (const devProfile of DEVICE_PROFILES) {
    const { name, browserTypeName, ...contextOpts } = devProfile;
    const width = contextOpts.viewport.width;
    const label = `${name} (${width}px, ${browserTypeName})`;

    const browser = await getBrowser(browserTypeName);
    if (!browser) {
      console.log(`  [${label}] SKIPPED — engine not installed`);
      continue;
    }

    const context = await browser.newContext(contextOpts);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      const result = await page.evaluate(findOverflowOffenders, width);

      const slug = (route.replace(/[^a-z0-9]/gi, '_') || 'home');
      const shotPath = path.join(SCREENSHOT_DIR, `${slug}_${name.replace(/\s+/g, '-')}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      if (result.hasOverflow) {
        flagged.push({ route, device: label, ...result, screenshot: shotPath });
        console.log(`  [${label}] OVERFLOW — content is ${result.docWidth}px wide against a ${result.targetWidth}px device (screenshot: ${shotPath})`);
        if (result.layoutViewportBallooned) {
          console.log(`    -> layout viewport widened to ${result.layoutViewportWidth}px: this page WILL render zoomed out on a real ${result.targetWidth}px-wide phone`);
        }
        for (const o of result.offenders) {
          console.log(`    - <${o.tag}${o.id}${o.classes}> extends ${o.overflowPx}px past the edge (width ${o.rectWidth}px)` + (o.inlineStyle ? ` [inline style: ${o.inlineStyle}]` : ''));
        }
      } else {
        console.log(`  [${label}] OK`);
      }
    } catch (err) {
      console.log(`  [${label}] ERROR loading page: ${err.message}`);
    } finally {
      await context.close();
    }
  }
}

for (const instance of Object.values(browserInstances)) {
  if (instance) await instance.close();
}

mkdirSync('qa/reports', { recursive: true });
writeFileSync(REPORT_PATH, JSON.stringify(flagged, null, 2));

if (flagged.length) {
  console.log(`\n✗ Horizontal overflow on ${flagged.length} route/device combo(s). Full report: ${REPORT_PATH}`);
  console.log('Run `bash qa/mobile-root-cause-grep.sh` against your src/ to find why.');
  process.exit(1);
} else {
  console.log(`\n✓ No horizontal overflow on any checked route/device combo.`);
}
