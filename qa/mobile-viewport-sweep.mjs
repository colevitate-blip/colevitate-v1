// Resizes to narrow widths and flags horizontal overflow (the classic
// "zoomed out on mobile" symptom) on every discovered route.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { getRoutes } from './lib/get-routes.mjs';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';
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
