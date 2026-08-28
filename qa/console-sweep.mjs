// Visits every discovered route in a headless browser and reports any
// console.error output or uncaught exceptions — the silent JS failures
// that don't show up just by looking at the page.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { getRoutes } from './lib/get-routes.mjs';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';
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
