import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  use: {
    baseURL: process.env.QA_BASE_URL || 'http://localhost:3000',
  },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    { name: 'tablet', use: { ...devices['iPad Mini'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  reporter: [['list'], ['html', { outputFolder: 'qa/reports/playwright-report', open: 'never' }]],
});
