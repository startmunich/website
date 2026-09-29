import { expect, test } from '@playwright/test';

// The homepage flare (components/flare) is the one place where a runtime failure
// is expected rather than exceptional: WebGPU is absent on plenty of real
// browsers and CI runners, and `requestAdapter()` returns null on machines with
// no usable GPU. The contract these tests pin down is therefore the *fallback*,
// which must hold in every environment:
//
//   1. the mark is server-rendered, so the panel is never blank or shifted;
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

/**
 * Below Tailwind's `lg` the panel is a 1:1 square and shows the round icon; from
 * `lg` up it is a tall panel and shows the wordmark. The breakpoint is duplicated
 * in CSS (HomeClient), in the renderer (WORDMARK_QUERY) and here, so this test
 * is what keeps the three from drifting apart.
 */
test('flare panel is square with the icon on mobile, and the wordmark from lg up', async ({
  page,
}) => {
  await page.goto('/');
  const panel = page.locator('[data-flare-panel]');
  await panel.scrollIntoViewIfNeeded();

  // `naturalWidth > 0` asserts the mark actually decoded, not merely that the
  // element is in the tree: a renamed or 404ing asset still leaves an attached
  // <img> with the right alt text, and `toBeVisible()` would not notice.
  const markState = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('[data-flare-mark]')].map((img) => {
        const rect = img.getBoundingClientRect();
        return {
          mark: img.getAttribute('data-flare-mark'),
          src: img.getAttribute('src'),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          loaded: (img as HTMLImageElement).naturalWidth > 0,
        };
      }),
    );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  // The panel has a 2px border, so measure the inner box: that is the containing
  // block the mark is sized against, and `boundingBox()` would report the border
  // box and put the "half the panel" assertion out by 2px a side.
  const innerBox = () =>
    page.locator('[data-flare-panel]').evaluate((node) => ({
      width: node.clientWidth,
      height: node.clientHeight,
    }));

  const mobileBox = await innerBox();
  // 1:1 to within a subpixel of rounding.
  expect(mobileBox.width / mobileBox.height).toBeCloseTo(1, 2);

  const mobile = await markState();
  expect(mobile.find((m) => m.mark === 'icon')).toMatchObject({
    src: '/start-munich-icon.svg',
    loaded: true,
  });
  // Half the panel, and square, since the icon's viewBox is 61:61.
  const icon = mobile.find((m) => m.mark === 'icon')!;
  expect(icon.width).toBe(Math.round(mobileBox.width / 2));
  expect(icon.height).toBe(icon.width);
  // Hidden rather than merely smaller.
  expect(mobile.find((m) => m.mark === 'wordmark')!.width).toBe(0);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);

  const desktopBox = await innerBox();
  expect(desktopBox.height).toBeGreaterThan(mobileBox.width);

  const desktop = await markState();
  expect(desktop.find((m) => m.mark === 'wordmark')).toMatchObject({
    src: '/startlogo.svg',
    loaded: true,
  });
  expect(desktop.find((m) => m.mark === 'icon')!.width).toBe(0);
});
