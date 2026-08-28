// Runs a Lighthouse audit against every discovered route and fails if any
// page drops below the score thresholds below — the same idea as
// Lighthouse CI, without needing the separate @lhci/cli setup.
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { getRoutes } from './lib/get-routes.mjs';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';
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
