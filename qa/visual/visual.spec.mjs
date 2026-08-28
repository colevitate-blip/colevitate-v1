// Screenshots every discovered route at three breakpoints and diffs
// against committed baselines. First run establishes the baselines:
//   playwright test -c qa/playwright.config.mjs qa/visual --update-snapshots
import { test, expect } from '@playwright/test';
import { getRoutes } from '../lib/get-routes.mjs';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';
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
