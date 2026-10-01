import { expect, test } from '@playwright/test';

// The hero aura (components/aura) is decorative WebGPU, and it sits on every page
// that renders `components/Hero` — which is most of the site. So a runtime
// failure here is not cosmetic: it is the top of the page going blank, on a lot
// of URLs at once.
//
// As with the flare, WebGPU is simply absent on plenty of real browsers and on CI
// runners, so the contract these tests pin is the *fallback*, which has to hold
// everywhere:
//
//   1. the field is server-rendered, so the hero never shows a bare photo and
//      never shifts once the canvas arrives;
//   2. the canvas stays transparent until the GPU is ready, and stays
//      non-interactive always;
//   3. a failed GPU init never reaches the visitor as an unhandled error.
//
// Whether the GPU field itself paints depends on the machine, so that is
// deliberately not asserted here.

const HERO_PAGE = '/about-us';

test('hero falls back to the server-rendered field', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const response = await page.goto(HERO_PAGE);
  expect(response).not.toBeNull();
  expect(response!.status()).toBeLessThan(400);

  const host = page.locator('[data-aura]');
  await expect(host).toHaveCount(1);
  const canvas = host.locator('canvas');
  await expect(canvas).toHaveCount(1);

  // Present before any JavaScript has run: the wrapper, the CSS field, and the
  // (still transparent) canvas are all in the initial HTML.
  const html = await page.content();
  expect(html).toContain('data-aura');
  expect(html).toContain('radial-gradient');

  // The field is a real painted background, not an empty transparent div that
  // happens to sit in the right place.
  const fallback = host.locator('div').first();
  await expect
    .poll(() => fallback.evaluate((node) => getComputedStyle(node).backgroundImage))
    .not.toBe('none');

  // Give the effect time to import the renderer and attempt GPU init.
  await page.waitForTimeout(3000);

  // Without a working adapter the canvas must stay hidden, never blank-on-top,
  // and the fallback must still be carrying the design.
  const opacity = await canvas.evaluate((node) => getComputedStyle(node).opacity);
  if (opacity !== '1') {
    await expect(canvas).toHaveClass(/opacity-0/);
    await expect(fallback).toHaveClass(/opacity-100/);
  }

  // A missing adapter is routine; it must not surface as an uncaught error.
  expect(pageErrors, `uncaught errors: ${pageErrors.join('; ')}`).toEqual([]);
});

/**
 * The aura covers the whole hero box, and the hero's `children` render *inside*
 * that box on desktop — the stat cards, and on some pages any links or buttons
 * passed to `Hero`. A decorative layer that swallowed clicks would break them
 * without breaking anything visible, so this asserts the pass-through directly
 * rather than inferring it from a screenshot.
 */
test('the hero aura never intercepts pointer events', async ({ page }) => {
  await page.goto(HERO_PAGE);
  const host = page.locator('[data-aura]');
  await expect(host).toHaveCount(1);

  // The hero streams in behind a `display: none` Suspense boundary, so for the
  // first few hundred milliseconds the aura is a real element with a 0x0 box.
  // Its "centre" then resolves to the top-left of the viewport — the sticky nav —
  // which is genuinely not inside the hero, so the assertion below fails for a
  // reason that has nothing to do with pointer events. Wait for a real box
  // before hit-testing; a zero-height element has no centre to test.
  await expect
    .poll(() => host.evaluate((node) => node.getBoundingClientRect().height))
    .toBeGreaterThan(0);

  // Must be unconditional: the flare only disables pointer events until its GPU
  // is ready because it reacts to the pointer, but the aura never does.
  await expect(host).toHaveCSS('pointer-events', 'none');

  // The centre of the hero must resolve to real hero content, not to the
  // decorative layer sitting on top of it. Asserting which element that is would
  // just re-assert the hero's layout, so this only checks the two things that
  // matter: the hit is outside the aura, and it is still inside the hero.
  const hit = await host.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const top = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
    return {
      insideAura: !!top?.closest('[data-aura]'),
      insideHero: !!top && !!node.parentElement?.contains(top),
    };
  });
  expect(hit.insideAura, 'the aura swallowed the hit test at the hero centre').toBe(false);
  expect(hit.insideHero, 'nothing in the hero was hit-testable at its centre').toBe(true);
});

/**
 * The field is rasterized well below the canvas pixel size and scaled up by the
 * compositor, so the glyph edges of the network motif are at the mercy of
 * bilinear interpolation. Antialiasing the shader and lowering the frame budget
 * are opposite pulls, and this is what stops either being undone silently: the
 * bound is loose enough to leave real headroom, and tight enough that switching
 * to the device pixel ratio fails.
 */
test('the hero field renders well below the canvas pixel size', async ({ page }) => {
  await page.goto(HERO_PAGE);
  const host = page.locator('[data-aura]');
  const canvas = host.locator('canvas');
  await page.waitForTimeout(3000);

  const state = await canvas.evaluate((node) => {
    const element = node as HTMLCanvasElement;
    const box = element.getBoundingClientRect();
    return {
      backing: element.width * element.height,
      css: box.width * box.height,
    };
  });

  // Unchanged from a 300x150 default means the renderer never ran, so there is
  // nothing to assert — the fallback case is covered by the first test.
  if (state.backing === 300 * 150) return;

  // A 1440x560 hero currently rasters at 720x280, which is 0.25. Honouring the
  // device pixel ratio would put this at 1.0 or above.
  expect(state.backing / state.css).toBeLessThan(0.35);
  expect(state.backing).toBeGreaterThan(0);
});

/**
 * The renderer reads the pointer from `window`, which outlives the element it is
 * reading for. A client-side navigation therefore has to dispose the old
 * renderer and its listeners before the next one mounts, and this is the only
 * place that remount actually happens on a multi-page session. It also guards
 * against a second aura surviving the swap, which would mean two live canvases
 * stacked on the same hero.
 */
test('the aura survives a client-side navigation between hero pages', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(HERO_PAGE);
  await page.waitForTimeout(2000);

  // Same chrome on both pages, so this is a real client-side route change.
  await page.getByRole('link', { name: 'OUR STARTUPS' }).click();
  await page.waitForURL('**/startups');
  await page.waitForTimeout(2000);

  await expect(page.locator('[data-aura]')).toHaveCount(1);
  expect(pageErrors, `uncaught errors: ${pageErrors.join('; ')}`).toEqual([]);
});
