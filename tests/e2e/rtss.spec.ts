import { expect, test } from '@playwright/test';

test('rtss announces the event and offers attendee tickets after applications close', async ({
  page,
}) => {
  const response = await page.goto('/eventpage/rtss');
  expect(response?.status()).toBeLessThan(400);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Road to START Summit/i);
  for (const section of ['#top', '#schedule', '#tickets']) {
    const tickets = page.locator(section).getByRole('link', { name: 'Tickets', exact: true });
    await expect(tickets).toBeVisible();
    await expect(tickets).toHaveAttribute('href', 'https://luma.com/road-to-start-summit');
  }
  await expect(page.locator('a[href="https://tally.so/r/5BW1Wv"]')).toHaveCount(0);
});
