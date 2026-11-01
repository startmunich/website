import { expect, test } from '@playwright/test';

// The RTSS microsite was rebuilt without any e2e coverage. These are the two
// things it must not get wrong: it announces the event to assistive tech, and
// both actions point at the right Tally form. Both come from `rtss-data.ts`
// rather than the CMS, so unlike the other specs this one has no data-dependent
// branch to accept.

// `SplitCta` is rendered twice (hero and schedule), so match the first of each.
test('rtss announces the event and links tickets and startup applications', async ({ page }) => {
  const response = await page.goto('/eventpage/rtss');
  expect(response?.status()).toBeLessThan(400);

  // The hero's lettering is baked into the artwork, so the only real heading is
  // the visually hidden one — it is the page's accessible name.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Road to START Summit/i);

  const tickets = page.locator('a[href="https://luma.com/road-to-start-summit"]');
  const application = page.locator('a[href="https://tally.so/r/5BW1Wv"]');
  await expect(tickets.first()).toBeVisible();
  await expect(application.first()).toBeVisible();
});

// Attendees book tickets and startups apply separately; swapping the two
// links would still pass the href assertions above, so name them too. Exact
// names, because the hero nav has its own "For Attendees" anchor.
test('rtss points attendees at ticket booking and start-ups at the application form', async ({
  page,
}) => {
  await page.goto('/eventpage/rtss');

  await expect(page.getByRole('link', { name: 'Tickets', exact: true }).first()).toHaveAttribute(
    'href',
    'https://luma.com/road-to-start-summit',
  );
  await expect(page.getByRole('link', { name: 'Start-Ups', exact: true }).first()).toHaveAttribute(
    'href',
    'https://tally.so/r/5BW1Wv',
  );
});
