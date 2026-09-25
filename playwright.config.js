import {defineConfig} from 'playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 90000,
  expect: {timeout: 15000},
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:9012',
    viewport: {width: 1280, height: 800},
  },
  webServer: {
    command: 'node scripts/serve.mjs 9012 dist',
    url: 'http://127.0.0.1:9012',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
