import { expect, test } from '@playwright/test';

// The events page is generated from the synced event calendar, so the smoke spec's "2xx + main
// landmark" check cannot catch a regression that empties it. These assertions target the things that
// broke before: the page falling back to its loading state, the series being lost, or the grids
// rendering an error instead of events.
//
// Runs against whatever event source is configured. With none, the curated fallback series must
// still render — so these assertions hold in a bare preview build too.

test.describe('/events', () => {
  test('renders the programme server-side, not a loading placeholder', async ({ page }) => {
    await page.goto('/events');

    // The page used to hold a client-side `loading` gate that flashed before any data arrived.
    await expect(page.getByText('Loading events...')).toHaveCount(0);

    // Series cards are the timeline/slider cards; each carries a data-event-id hook.
    await expect(page.locator('[data-event-id]').first()).toBeVisible();
  });

  test('shows the annual timeline with a month label and a legend', async ({ page }) => {
    await page.goto('/events');

    // The twelve month headers above the timeline strip.
    await expect(page.getByText('Jan', { exact: true }).first()).toBeVisible();

    // The legend is generated from the categories actually present in the feed.
    const legend = page.locator('span.text-xs.font-medium.text-gray-300');
    expect(await legend.count()).toBeGreaterThan(0);
  });

  test('does not show an event-fetch error state', async ({ page }) => {
    await page.goto('/events');

    await expect(page.getByText(/Unable to load (upcoming|past) events/)).toHaveCount(0);
    await expect(page.getByText(/Make sure LUMA_API_KEY is configured/)).toHaveCount(0);
  });

  test('every event card links to a registration page', async ({ page }) => {
    await page.goto('/events');

    // A tile with no href is inert, which would look like a dead card.
    const tiles = page.locator('a.group.relative.bg-white\\/5');
    const count = await tiles.count();
    for (let i = 0; i < count; i++) {
      await expect(tiles.nth(i)).toHaveAttribute('href', /^(https?:|#)/);
    }
  });
});
