// Regenerate the artwork-only share image with pnpm generate:og:rtss.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';

const directory = new URL('../public/eventpage/rtss/', import.meta.url);
const artwork = await readFile(new URL('hero-desktop.png', directory));
const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(`
    <style>
      body { margin: 0; }
      img { display: block; width: 100vw; height: 100vh; object-fit: cover; }
    </style>
    <img alt="" src="data:image/png;base64,${artwork.toString('base64')}" />
  `);
  await page.locator('img').evaluate((image) => image.decode());
  await page.screenshot({ path: fileURLToPath(new URL('og-image.png', directory)) });
} finally {
  await browser.close();
}
