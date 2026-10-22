/**
 * Scaffolding shared by every vgpu renderer in the site.
 *
 * The flare (`components/flare`) and the aura (`components/aura`) are separate
 * features with separate lazy chunks, so neither may import from the other — that
 * would drag one feature's shaders into the other's bundle. Everything they
 * genuinely have in common lives here instead: the blue-noise texture and the
 * cleanup discipline used when handing back GPU resources. The fullscreen vertex
 * stage is shared as WGSL (`fullscreen.wgsl`), not as a string, so each shader
 * stays a static import the vgpu loader can prepare at build time.
 *
 * This module must stay free of `import ... from 'vgpu'` *values* so that
 * importing it never forces the runtime into a bundle eagerly. The one `vgpu`
 * reference is a type-only import, which TypeScript erases.
 */
import type { Gpu } from 'vgpu';

import { BLUE_NOISE_SIZE, blueNoiseBytes } from './blue-noise-128';

export type Point = readonly [number, number];

/**
 * Uploads the shared 128x128 blue-noise texture, used for film grain, ray jitter,
 * and gradient dithering.
 *
 * `writeTexture` requires rows to be a multiple of 256 bytes, and the asset is
 * stored packed at 128 bytes per row, so the rows are repacked on the way in.
 * The texture is destroyed if the upload throws, so a failed allocation cannot
 * leak.
 */
export function createBlueNoiseTexture(gpu: Gpu, label: string): GPUTexture {
  const texture = gpu.gpu.createTexture({
    label,
    size: [BLUE_NOISE_SIZE, BLUE_NOISE_SIZE],
    format: 'r8unorm',
    usage: 0x02 | 0x04,
  });
  try {
    const bytesPerRow = 256;
    gpu.gpu.queue.writeTexture(
      { texture },
      padTextureRows(blueNoiseBytes(), BLUE_NOISE_SIZE, bytesPerRow, BLUE_NOISE_SIZE),
      { bytesPerRow, rowsPerImage: BLUE_NOISE_SIZE },
      [BLUE_NOISE_SIZE, BLUE_NOISE_SIZE],
    );
    return texture;
  } catch (error) {
    bestEffort(() => texture.destroy());
    throw error;
  }
}

/** Copies packed texture rows into a zero-filled buffer with the requested destination stride. */
function padTextureRows(
  data: Uint8Array<ArrayBuffer>,
  sourceBytesPerRow: number,
  destinationBytesPerRow: number,
  height: number,
): Uint8Array<ArrayBuffer> {
  const padded = new Uint8Array(destinationBytesPerRow * height);
  for (let row = 0; row < height; row += 1) {
    const sourceOffset = row * sourceBytesPerRow;
    padded.set(
      data.subarray(sourceOffset, sourceOffset + sourceBytesPerRow),
      row * destinationBytesPerRow,
    );
  }
  return padded;
}

/** Runs every cleanup callback, then rethrows the first error if any callback failed. */
export function runCleanups(cleanups: readonly (() => void)[]): void {
  let primary: unknown;
  let failed = false;
  for (const cleanup of cleanups) {
    try {
      cleanup();
    } catch (error) {
      if (!failed) primary = error;
      failed = true;
    }
  }
  if (failed) throw primary;
}

/** Attempts cleanup while suppressing errors so an existing failure is preserved. */
export function bestEffort(cleanup: () => void): void {
  try {
    cleanup();
  } catch {
    // Cleanup must not replace the active construction or render failure.
  }
}
