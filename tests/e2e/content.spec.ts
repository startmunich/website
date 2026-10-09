import { expect, test } from '@playwright/test';

// Content regressions reported from the live site. These assert real content
// rather than a 2xx, so a data or layout regression fails here instead of
// reaching production.
//
// Both checks were added alongside fixes for the same report; each one is
// narrow enough to say which thing broke.

// The Spherecast logo in NocoDB is a valid SVG stored under a `.svg+xml`
// filename, which NocoDB serves as `application/octet-stream` +
// `Content-Disposition: attachment`. Browsers refuse to render that in an
// <img>, so the logo is blank. `lib/startups.ts` overrides it with a vendored
// copy. Asserting on naturalWidth catches both a regression in the override
// and a vendored file that was deleted or emptied.
test('Spherecast logo actually renders', async ({ page }) => {
  await page.goto('/startups');
  const logo = page.locator('img[alt="Spherecast logo"]').first();
  await expect(logo).toBeVisible();

  await expect
    .poll(() => logo.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
});

// The recurring-events calendar is hand-maintained: a marker can drift into a
// month its own card does not claim. Fail Tales used to sit in November while
// its card reads "October & April". This reads the rendered marker offsets
// rather than the source, so it fails on what a visitor actually sees.
test('recurring event markers sit in the months their cards claim', async ({ page }) => {
  await page.goto('/events');
  await page.setViewportSize({ width: 1440, height: 1000 });

  const MONTH_WIDTH_PERCENT = 100 / 12;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Desktop timeline only — the mobile list is a separate DOM subtree, and the
  // month dividers carry a `left` too, so require the marker label text.
  const placements = await page.locator('[style*="left"]').evaluateAll((nodes) =>
    nodes
      .filter((node) => (node.textContent ?? '').trim().length > 0)
      .map((node) => {
        const left = /left:\s*([\d.]+)%/.exec(node.getAttribute('style') ?? '')?.[1];
        return {
          label: node.textContent?.trim() ?? '',
          left: left === undefined ? null : parseFloat(left),
        };
      }),
  );

  expect(placements.length).toBeGreaterThan(0);

  const monthOf = (left: number) => months[Math.floor(left / MONTH_WIDTH_PERCENT)];

  // The specific regression: Fail Tales is an October/April event, but its
  // autumn marker used to sit in November.
  const failTales = placements.filter((p) => p.label === 'Fail Tales');
  expect(failTales.length).toBeGreaterThan(0);
  for (const { left } of failTales) {
    if (left === null) continue;
    expect(['Oct', 'Apr'], `Fail Tales rendered in ${monthOf(left)}`).toContain(monthOf(left));
  }

  // YC Stories recurs in both terms.
  const ycStories = placements.filter((p) => p.label === 'YC Stories');
  expect(ycStories.length).toBe(2);
  for (const { left } of ycStories) {
    if (left === null) continue;
    expect(['Oct', 'Apr'], `YC Stories rendered in ${monthOf(left)}`).toContain(monthOf(left));
  }
});

// YC Stories recurs every semester, so it belongs in the annual calendar
// alongside the other recurring events rather than only in the Luma feed.
test('recurring events list includes YC Stories', async ({ page }) => {
  await page.goto('/events');

  const card = page.locator('[data-event-id="yc-stories"]');
  await expect(card).toBeVisible();
  await expect(card).toContainText('YC Stories');
});
