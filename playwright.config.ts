import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

// In CI: PLAYWRIGHT_TEST_BASE_URL is the Vercel preview URL, set by the
// workflow from the deployment_status event payload.
// Locally: defaults to a dev server you started yourself with `pnpm dev`.
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? 'http://localhost:3000';

// Vercel preview deployments are protected by default. The bypass secret is
// generated in Vercel (Project Settings → Deployment Protection → Protection
// Bypass for Automation) and stored in the GitHub repo's Actions secrets.
// The set-bypass-cookie header makes the cookie stick for the whole session
// so in-page navigations and fetches also bypass — without it, only the
// initial goto() works.
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const extraHTTPHeaders = bypassSecret
  ? {
      'x-vercel-protection-bypass': bypassSecret,
      'x-vercel-set-bypass-cookie': 'samesitenone',
    }
  : undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: isCI ? 2 : undefined,
  retries: isCI ? 2 : 0,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  forbidOnly: isCI,
  use: {
    baseURL,
    extraHTTPHeaders,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
