import { defineConfig, devices } from '@playwright/test';

// Web end-to-end tests. Start the API first (../scripts/start-api-for-e2e.sh).
// Each browser is its own project so each CI workflow can pick one:
//   macOS workflow -> webkit (Safari's engine)
//   web workflow (later) -> chromium, firefox
export default defineConfig({
  testDir: './e2e/web',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Build the static web app once, then serve it. Faster and closer to production than
    // the dev server.
    command: 'npx expo export --platform web && python3 -m http.server 8081 --directory dist',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
