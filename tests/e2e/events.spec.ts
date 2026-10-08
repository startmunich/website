import { expect, type Page, test } from '@playwright/test';

/**
 * `/events` behaviour against a real feed.
 *
 * Every assertion here is one that can fail: counts greater than zero, URLs matching `^https?:`,
 * and `data-testid` hooks rather than Tailwind class chains that change whenever someone restyles.
 * The previous version of this spec asserted on strings that no longer existed in the codebase and
 * accepted `href="#"`, so it passed with zero tiles on the page.
 *
 * CI runs against a Vercel preview, which may be built without `STARTMUNICH_API_KEY` — a preview
 * must still render. So the data-dependent tests assert the *correct* behaviour for whichever state
 * the page is in: populated cards with real links, or an explicit empty state. Neither branch is a
 * no-op, so a page that silently renders nothing still fails.
 */

/** True when a section rendered its explicit empty state rather than a populated grid. */
async function sectionIsEmpty(page: Page, section: 'upcoming' | 'past'): Promise<boolean> {
  return (await page.getByTestId(`${section}-events-empty`).count()) > 0;
}

test.describe('events page', () => {
  test('renders the page with every section present', async ({ page }) => {
    const response = await page.goto('/events');
    expect(response?.status()).toBe(200);
    // The layout has its own <main>, so the page's is the one with the events background.
    await expect(page.locator('main.min-h-screen')).toBeVisible();
    await expect(page.getByRole('heading', { name: /upcoming events/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /past events/i })).toBeVisible();
  });

  test('renders upcoming events, or an explicit empty state', async ({ page }) => {
    await page.goto('/events');

    if (await sectionIsEmpty(page, 'upcoming')) {
      // A misconfigured preview degrades here, and says so.
      await expect(page.getByTestId('upcoming-events-empty')).toContainText(/check back soon/i);
      return;
    }

    const cards = page.getByTestId('upcoming-event');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('every upcoming event links to a real registration URL', async ({ page }) => {
    await page.goto('/events');
    if (await sectionIsEmpty(page, 'upcoming')) return;

    const cards = page.getByTestId('upcoming-event');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const link = cards.nth(i).getByRole('link').first();
      await expect(link).toHaveAttribute('href', /^https?:\/\/.+/);
    }
  });

  test('renders the past-events archive, or an explicit empty state', async ({ page }) => {
    await page.goto('/events');

    if (await sectionIsEmpty(page, 'past')) {
      await expect(page.getByTestId('past-events-empty')).toBeVisible();
      return;
    }

    await expect(page.getByTestId('past-events')).toBeVisible();
  });

  test('renders either the annual calendar or its explicit empty state', async ({ page }) => {
    await page.goto('/events');
    const calendar = page.getByTestId('events-calendar');
    const empty = page.getByTestId('events-calendar-empty');

    // Exactly one of the two — never a blank box because a fetch failed.
    await expect(calendar.or(empty).first()).toBeVisible();
    if ((await calendar.count()) > 0) {
      await expect(empty).toHaveCount(0);
    }
  });

  test('renders either the featured strip or its explicit empty state', async ({ page }) => {
    await page.goto('/events');
    const featured = page.getByTestId('events-featured');
    const empty = page.getByTestId('events-featured-empty');
    await expect(featured.or(empty).first()).toBeVisible();
    if ((await empty.count()) > 0) {
      // Nothing curated yet — the strip says so rather than inventing a programme.
      await expect(empty).toContainText(/check back soon/i);
    }
  });

  test('never shows a dead "#" link on a card', async ({ page }) => {
    await page.goto('/events');
    // A card with no registration URL must render a plain card, not an anchor to nowhere.
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
  });

  test('hero statistics render', async ({ page }) => {
    await page.goto('/events');
    // Counted from this year's real events via `yearlyStats`. Asserting specific values would
    // break every time the calendar changes; asserting presence catches a broken section.
    await expect(page.getByText(/hackathons yearly/i).first()).toBeVisible();
    await expect(page.getByText(/public events yearly/i).first()).toBeVisible();
  });
});
