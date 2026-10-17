/**
 * Renders the Road to START Summit Open Graph image.
 *
 *     pnpm generate:og:rtss
 *
 * Social platforms show the image next to a title and description they may
 * truncate, so the card has to carry the event on its own: what it is, when it
 * is, and where. The artwork is the same `hero-desktop.png` the page opens on,
 * with a scrim so the type stays readable over the lettering.
 *
 * The copy is read from `app/eventpage/rtss/rtss-data.ts` rather than repeated
 * here, so the card cannot disagree with the page for any reason other than
 * forgetting to re-run this. Nothing in CI regenerates or diffs
 * `og-image.png`, so that step is manual — run it after editing the data file
 * and commit the result.
 */

import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import { readFile } from 'fs/promises';

// fileURLToPath, not `new URL(..).pathname`: the latter percent-encodes, so a
// checkout under a path containing a space (or any other reserved character)
// resolved to a directory that doesn't exist.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DATA_FILE = `${ROOT}app/eventpage/rtss/rtss-data.ts`;

/** 1.91:1 — the aspect ratio Facebook, LinkedIn, Slack and X all crop to. */
const WIDTH = 1200;
const HEIGHT = 630;

const read = (relative) => readFile(`${ROOT}${relative}`);

const dataUri = async (relative, mime) =>
  `data:${mime};base64,${(await read(relative)).toString('base64')}`;

/** Pulls one `key: 'value'` string literal out of the RTSS data module. */
async function configValue(key) {
  const source = await readFile(DATA_FILE, 'utf8');
  // Both quote styles: Prettier switches to double quotes as soon as a value
  // contains an apostrophe, and the old single-quote-only pattern then threw.
  const match = source.match(new RegExp(`\\b${key}:\\s*(?:"([^"]+)"|'([^']+)')`));
  if (!match) throw new Error(`Could not find \`${key}\` in ${DATA_FILE}`);
  return match[1] ?? match[2];
}

const [title, longDate, venue, artwork, logo, font] = await Promise.all([
  configValue('title'),
  configValue('longDate'),
  configValue('venue'),
  dataUri('public/eventpage/rtss/hero-desktop.png', 'image/png'),
  dataUri('public/eventpage/rtss/start-munich-white.png', 'image/png'),
  dataUri('public/fonts/Figtree-Variable.ttf', 'font/ttf'),
]);

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: Figtree;
        src: url("${font}") format("truetype");
        font-weight: 300 900;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        overflow: hidden;
        background: #00002c;
        color: #fff;
        font-family: Figtree, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .art {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 68% 46%;
      }
      /* Holds the left half near-solid so the type never fights the lettering,
         and lets the artwork carry the right third. */
      .scrim {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(
            92deg,
            rgb(0 0 44 / 0.97) 0%,
            rgb(0 0 44 / 0.95) 40%,
            rgb(0 0 44 / 0.8) 56%,
            rgb(0 0 44 / 0.3) 74%,
            rgb(0 0 44 / 0) 100%
          ),
          linear-gradient(rgb(0 0 44 / 0.3), rgb(0 0 44 / 0.3));
      }
      .content {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 30px;
        padding: 0 72px;
      }
      .logo { width: 104px; height: auto; }
      h1 {
        max-width: 600px;
        font-size: 74px;
        font-weight: 600;
        line-height: 0.98;
        letter-spacing: -0.045em;
      }
      .rule { width: 76px; height: 5px; background: #d0006f; border-radius: 3px; }
      .meta {
        display: flex;
        align-items: center;
        gap: 18px;
        font-size: 27px;
        font-weight: 500;
        letter-spacing: -0.02em;
        color: rgb(255 255 255 / 0.82);
      }
      .meta b { font-weight: 600; color: #fff; }
      .dot { width: 6px; height: 6px; border-radius: 50%; background: #d0006f; }
    </style>
  </head>
  <body>
    <img class="art" src="${artwork}" alt="" />
    <div class="scrim"></div>
    <div class="content">
      <img class="logo" src="${logo}" alt="" />
      <h1>${title}</h1>
      <div class="rule"></div>
      <div class="meta">
        <b>${longDate}</b>
        <span class="dot"></span>
        <span>${venue}</span>
      </div>
    </div>
  </body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});

// Inline the document so the font and artwork resolve without a file server.
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

const out = `${ROOT}public/eventpage/rtss/og-image.png`;
await page.screenshot({ path: out });
await browser.close();

console.log(`✓ ${out.slice(ROOT.length)}  ${WIDTH}×${HEIGHT}`);
