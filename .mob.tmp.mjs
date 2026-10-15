import { chromium } from '@playwright/test';
const [, , route, out] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
await page.goto('http://localhost:3000' + route, { waitUntil: 'load' });
await page.waitForTimeout(1200);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(800);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
const W = await page.evaluate(() => document.documentElement.scrollWidth);
console.log('scrollWidth', W, 'height', H);
// 3 columns of 1600px strips side by side would need compositing; just take first strips
for (let i = 0, y = 0; y < H && i < 4; i++, y += 1600) {
  await page.screenshot({
    path: `${out}_${i}.png`,
    clip: { x: 0, y, width: 390, height: Math.min(1600, H - y) },
    fullPage: true,
  });
}
await browser.close();
