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
