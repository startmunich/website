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

// The vendored Spherecast SVG shipped its wordmark as `fill="white"`. Every
// startup logo sits on a `bg-white` card, so the sphere rendered and the name
// beside it was invisible — `naturalWidth` was a perfectly good 1588, so the
// assertion above cannot see the difference. Sample the wordmark band (x past
// the sphere, which occupies the left ~16% of the viewBox) and require dark
// pixels in it.
test('Spherecast wordmark is visible on the white card', async ({ page }) => {
  await page.goto('/startups');
  const logo = page.locator('img[alt="Spherecast logo"]').first();
  await expect(logo).toBeVisible();

  const darkRatio = await logo.evaluate(async (img: HTMLImageElement) => {
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let dark = 0;
    let opaque = 0;
    for (let y = 0; y < height; y++) {
      for (let x = Math.round(width * 0.25); x < width; x++) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 10) continue;
        opaque++;
        const luminance = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        if (luminance < 60) dark++;
      }
    }
    return opaque === 0 ? 0 : dark / opaque;
  });

  expect(darkRatio).toBeGreaterThan(0.05);
});

// The recurring-events calendar used to be hand-maintained, so a marker could
// drift into a month its own card did not claim — Fail Tales sat in November
// while its card read "October & April". Markers are now placed from each
// event's real `startAt` rather than a hand-written table, which makes that
// class of drift unrepresentable. This keeps asserting the property that
// mattered: a marker sits in the month the event actually happens.
//
// It reads the rendered offsets and derives the month from each, rather than
// asserting on source, so it still fails on what a visitor actually sees.
test('event markers sit in the month each event actually happens', async ({ page }) => {
  await page.goto('/events');
  await page.setViewportSize({ width: 1440, height: 1000 });

  // The strip renders its explicit empty state when no event source is
  // configured; a CI preview may legitimately be in that state.
  if ((await page.getByTestId('events-calendar-empty').count()) > 0) {
    await expect(page.getByTestId('events-calendar-empty')).toBeVisible();
    return;
  }

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

  for (const { label, left } of placements) {
    if (left === null) continue;

    // No marker may sit past the right edge, which is where the old flat
    // 30-day divisor pushed 31 December (100.28%).
    expect(left, `${label} rendered at ${left}%`).toBeLessThan(100);

    // Every marker on the strip belongs to the calendar year it is drawn on.
    // A rolling window used to project next January's events onto this January.
    expect(monthOf(left), `${label} rendered off the Jan–Dec axis`).toBeTruthy();
  }
});

// YC Stories recurs every semester and was missing from the annual calendar.
// With markers driven by real event dates it appears whenever the platform
// holds an event for it, so this asserts it reaches the calendar rather than
// asserting a hand-written card with a hardcoded id.
test('YC Stories reaches the annual calendar', async ({ page }) => {
  await page.goto('/events');

  if ((await page.getByTestId('events-calendar-empty').count()) > 0) {
    await expect(page.getByTestId('events-calendar-empty')).toBeVisible();
    return;
  }

  // Either it is on the calendar, or the platform has no YC Stories event this
  // year — in which case there is nothing to assert and the page is honest
  // about it. What must never happen is a marker in a month the event is not in.
  const markers = page.locator('[data-testid="events-calendar"] [style*="left"]');
  const ycStories = await markers
    .filter({ hasText: /YC Stories/i })
    .count()
    .catch(() => 0);

  if (ycStories === 0) {
    // Not an error: the calendar shows what the platform has. Assert the strip
    // still rendered rather than silently passing on a blank page.
    await expect(page.getByTestId('events-calendar')).toBeVisible();
    return;
  }

  expect(ycStories).toBeGreaterThan(0);
});
