import { expect, test } from '@playwright/test';

// The homepage flare (components/flare) is the one place where a runtime failure
// is expected rather than exceptional: WebGPU is absent on plenty of real
// browsers and CI runners, and `requestAdapter()` returns null on machines with
// no usable GPU. The contract these tests pin down is therefore the *fallback*,
// which must hold in every environment:
//
//   1. the mark is server-rendered, so the panel is never blank or shifted;
//   2. the canvas is present and stays out of the way until the GPU is ready;
//   3. a failed GPU init never reaches the visitor as an unhandled error;
//   4. once WebGPU has been ruled out, the panel shows the event photo that
//      preceded the flare, and hides the mark from the accessibility tree.
//
// Whether the flare itself paints depends on the machine, so that is deliberately
// not asserted here — including which fallback layer wins, since CI has no
// adapter and so always lands on the photo.

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
 * The panel stacks three layers (mark, photo, canvas) and shows exactly one. With
 * no usable WebGPU the mark is not an acceptable end state — the visitor should
 * get the event photo that sat here before the flare landed. CI has no adapter,
 * so this drives the `fallback` branch on every run; a machine that does have a
 * GPU takes the `ready` branch, where the photo must stay mounted but hidden, so
 * both outcomes are asserted rather than assuming one.
 *
 * `aria-hidden` is asserted alongside opacity because opacity alone leaves a layer
 * fully in the accessibility tree — a browser without WebGPU would otherwise
 * announce the logo and the photograph at once.
 */
test('the flare panel shows the event photo instead of the mark without WebGPU', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const response = await page.goto('/');
  expect(response!.status()).toBeLessThan(400);

  const panel = page.locator('[data-flare-panel]');
  await panel.scrollIntoViewIfNeeded();

  const canvas = panel.locator('canvas');
  const photo = panel.locator('[data-flare-photo]');
  const markLayer = panel.locator('[data-flare-mark-layer]');

  // Both fallbacks ship in the server HTML, so the panel has something to show
  // before any JavaScript has run and before WebGPU can be probed.
  const html = await page.content();
  expect(html).toContain('good-opt.png');
  expect(html).toContain('startlogo.svg');

  // Give the `navigator.gpu` gate, and failing that the renderer chunk and its
  // adapter request, time to resolve and crossfade.
  await page.waitForTimeout(3000);

  const live = (await canvas.evaluate((node) => getComputedStyle(node).opacity)) === '1';

  if (live) {
    await expect(photo).toHaveClass(/opacity-0/);
    await expect(photo).toHaveAttribute('aria-hidden', 'true');
    await expect(markLayer).toHaveClass(/opacity-0/);
    await expect(markLayer).toHaveAttribute('aria-hidden', 'true');
  } else {
    await expect(photo).toHaveClass(/opacity-100/);
    await expect(photo).toHaveAttribute('aria-hidden', 'false');
    await expect(markLayer).toHaveClass(/opacity-0/);
    await expect(markLayer).toHaveAttribute('aria-hidden', 'true');

    // `naturalWidth > 0` asserts the photo actually decoded, not merely that the
    // element is in the tree: a renamed or 404ing asset leaves an attached <img>
    // with the right alt text, and would leave the panel blank.
    await expect
      .poll(() =>
        photo.evaluate((node) => (node.querySelector('img') as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }

  // Ruling out WebGPU is routine; it must not surface as an uncaught error.
  expect(pageErrors, `uncaught errors: ${pageErrors.join('; ')}`).toEqual([]);
});

/**
 * Three tiers, from two *independent* breakpoints: the panel's shape switches at
 * `lg` (1:1 square up to it, tall 600px above) while the mark switches earlier, at
 * `sm` (round icon on phones, wordmark from tablet width up). So 640-1023px gets a
 * large square panel with the wordmark in it. Both breakpoints are duplicated in
 * CSS (HomeClient), in the renderer (WORDMARK_QUERY) and here, so this test is
 * what keeps the three from drifting apart.
 */
test('flare panel shows the icon on phones, the wordmark from tablet width up', async ({
  page,
}) => {
  await page.goto('/');
  const panel = page.locator('[data-flare-panel]');
  await panel.scrollIntoViewIfNeeded();

  // `naturalWidth > 0` asserts the mark actually decoded, not merely that the
  // element is in the tree: a renamed or 404ing asset still leaves an attached
  // <img> with the right alt text, and `toBeVisible()` would not notice.
  /** Reads each fallback mark’s source, rendered dimensions, and image decoding state. */
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

  // The panel has a 2px border, so measure the inner box: that is the containing
  // block the mark is sized against, and `boundingBox()` would report the border
  // box and put the "half the panel" assertion out by 2px a side.
  /** Measures the panel content and padding box, excluding its border. */
  const innerBox = () =>
    page.locator('[data-flare-panel]').evaluate((node) => ({
      width: node.clientWidth,
      height: node.clientHeight,
    }));

  /** Sets the viewport, allows layout to settle, and returns panel and mark measurements. */
  const at = async (width: number, height: number) => {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(500);
    return { box: await innerBox(), marks: await markState() };
  };

  // --- Phone: 1:1 panel, icon at half its width, wordmark hidden. ---
  const phone = await at(390, 844);
  expect(phone.box.width / phone.box.height).toBeCloseTo(1, 2);
  expect(phone.marks.find((m) => m.mark === 'icon')).toMatchObject({
    src: '/start-munich-icon.svg',
    loaded: true,
  });
  // Half the panel, and square, since the icon's viewBox is 61:61.
  const phoneIcon = phone.marks.find((m) => m.mark === 'icon')!;
  expect(phoneIcon.width).toBe(Math.round(phone.box.width / 2));
  expect(phoneIcon.height).toBe(phoneIcon.width);
  // Hidden rather than merely smaller.
  expect(phone.marks.find((m) => m.mark === 'wordmark')!.width).toBe(0);

  // --- Tablet: still a 1:1 panel (shape has not switched yet) but the mark has. ---
  const tablet = await at(834, 1112);
  expect(tablet.box.width / tablet.box.height).toBeCloseTo(1, 2);
  expect(tablet.marks.find((m) => m.mark === 'wordmark')).toMatchObject({
    src: '/startlogo.svg',
    loaded: true,
  });
  expect(tablet.marks.find((m) => m.mark === 'icon')!.width).toBe(0);
  // 62% of the panel width, per WORDMARK_LOGO.widthRatio.
  expect(tablet.marks.find((m) => m.mark === 'wordmark')!.width).toBe(
    Math.round(tablet.box.width * 0.62),
  );

  // --- Desktop: the panel becomes tall; the mark stays the wordmark. ---
  const desktop = await at(1440, 900);
  expect(desktop.box.height).toBeGreaterThan(phone.box.width);
  expect(desktop.marks.find((m) => m.mark === 'wordmark')).toMatchObject({
    src: '/startlogo.svg',
    loaded: true,
  });
  expect(desktop.marks.find((m) => m.mark === 'icon')!.width).toBe(0);
});

/**
 * The canvas covers the whole panel, and on phones that panel is a full-width
 * square. Any `touch-action` other than `auto`/`pan-y` therefore makes a finger
 * drag over it fail to scroll the page — a large dead zone in the middle of the
 * homepage. Nothing else in this suite would catch it: the flare is decorative,
 * so a broken canvas only ever looks like "the animation doesn't work here".
 */
test('the flare canvas does not block touch scrolling', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('[data-flare-panel] canvas');
  await page.locator('[data-flare-panel]').scrollIntoViewIfNeeded();

  // `pointer-events: none` is applied until the GPU is ready, and a disabled
  // element never swallows a gesture — so assert the post-ready state, where
  // the canvas is genuinely interactive.
  await canvas.evaluate((node) => node.classList.remove('pointer-events-none'));

  const touchAction = await canvas.evaluate((node) => getComputedStyle(node).touchAction);
  expect(['auto', 'pan-y', 'pan', 'manipulation']).toContain(touchAction);

  // And prove the page actually moves under a finger drag that starts on it.
  const start = await page.evaluate(() => window.scrollY);
  const box = (await canvas.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 8; step += 1) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y: y - step * 30 }],
    });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 2000 })
    .toBeGreaterThan(start);
});
