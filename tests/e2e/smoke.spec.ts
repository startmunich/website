import { expect, test } from '@playwright/test';

// Smoke tests — for each key route, confirm the page returns 2xx and the main
// landmark renders. Intentionally narrow: a dep upgrade that breaks server-side
// rendering, the build, or top-level routing will fail here. Page-content
// changes won't.
//
// Anything more specific (e.g. asserting a particular hero string) lives in
// per-page specs added as needed.

const routes = [
  { path: '/', name: 'home' },
  { path: '/members', name: 'members' },
  { path: '/partners', name: 'partners' },
  { path: '/startups', name: 'startups' },
  { path: '/events', name: 'events' },
  { path: '/about-us', name: 'about us' },
  { path: '/join-start/2026', name: 'join-start 2026' },
  { path: '/for-partners', name: 'for-partners' },
];

for (const { path, name } of routes) {
  test(`${name} page renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response, `no response for ${path}`).not.toBeNull();
    expect(response!.status(), `${path} returned ${response!.status()}`).toBeLessThan(400);
    await expect(page.locator('main, [role="main"], body').first()).toBeVisible();
  });
}
