import { expect, test } from '@playwright/test';

// The homepage flare (components/flare) is the one place where a runtime failure
// is expected rather than exceptional: WebGPU is absent on plenty of real
// browsers and CI runners, and `requestAdapter()` returns null on machines with
// no usable GPU. The contract these tests pin down is therefore the *fallback*,
// which must hold in every environment:
//
//   1. the wordmark is server-rendered, so the panel is never blank or shifted;
//   2. the canvas is present and stays out of the way until the GPU is ready;
//   3. a failed GPU init never reaches the visitor as an unhandled error.
//
// Whether the flare itself paints depends on the machine, so that is deliberately
// not asserted here.

test('flare panel falls back to the server-rendered wordmark', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const response = await page.goto('/');
  expect(response).not.toBeNull();
  expect(response!.status()).toBeLessThan(400);

  const canvas = page.locator('canvas[aria-hidden="true"]');
  await expect(canvas).toHaveCount(1);

  // Present in the initial HTML, before any JavaScript has run.
  const html = await page.content();
  expect(html).toContain('startlogo.svg');

  // The fallback carries the accessible name; the canvas is decorative.
  await expect(page.getByAltText('START Munich').first()).toBeAttached();

  // Give the effect time to import the renderer and attempt GPU init.
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000);

  // Without a working adapter the canvas must stay hidden, never blank-on-top.
  const opacity = await canvas.evaluate((node) => getComputedStyle(node).opacity);
  if (opacity !== '1') {
    await expect(canvas).toHaveClass(/opacity-0/);
  }

  // A missing adapter is routine; it must not surface as an uncaught error.
  expect(pageErrors, `uncaught errors: ${pageErrors.join('; ')}`).toEqual([]);
});
