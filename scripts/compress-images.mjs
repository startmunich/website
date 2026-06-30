/**
 * Compress all JPG/PNG images in public/ using sharp.
 * - JPEGs/JPGs: resize to max 1920px wide, quality 82
 * - PNGs: resize to max 1920px wide, compressionLevel 9
 * - Skips files already under 100 KB
 */

import { readdir, stat } from 'fs/promises';
import { extname, join } from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;
const SKIP_BELOW_KB = 100;
const SUFFIX = '-opt';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let saved = 0;
let count = 0;

for await (const file of walk(PUBLIC_DIR)) {
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

  const { size } = await stat(file);
  if (size < SKIP_BELOW_KB * 1024) continue;

  const before = size;
  const base = file.slice(0, file.length - ext.length);
  const outExt = ext === '.png' ? '.png' : ext;
  const outFile = base + SUFFIX + outExt;

  try {
    const pipeline = sharp(file).resize({ width: MAX_WIDTH, withoutEnlargement: true });

    if (ext === '.png') {
      await pipeline.png({ compressionLevel: 9, effort: 10 }).toFile(outFile);
    } else {
      await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(outFile);
    }

    const { size: after } = await stat(outFile);
    saved += before - after;
    count++;
    console.log(
      `✓ ${file.replace(PUBLIC_DIR, '')}  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`,
    );
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
    const { unlink } = await import('fs/promises');
    await unlink(outFile).catch(() => {});
  }
}

console.log(
  `\nDone. Compressed ${count} images, saved ${(saved / 1024 / 1024).toFixed(0)} MB total.`,
);
