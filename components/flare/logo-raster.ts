/**
 * Rasterises a START Munich mark into a canvas for upload as a GPU texture.
 *
 * Adapted from the vgpu `nextjs-flare` example, which inlined the Next.js mark as
 * a `data:` URI. We point the same `Image` load at the public asset named by the
 * `LogoVariant` instead, so the mark keeps a single source of truth shared with
 * the CSS fallback, and size the canvas from that asset's own viewBox rather than
 * the example's 514:624 mark.
 *
 * The abort protocol is unchanged: an in-flight decode is cancellable and never
 * resolves after the caller has moved on.
 */
import { LOGO_PAD, type LogoVariant } from './pipeline';

export async function rasterizeLogo(
  width: number,
  height: number,
  logo: LogoVariant,
  signal?: AbortSignal,
): Promise<HTMLCanvasElement> {
  if (signal?.aborted) throw new DOMException('Logo rasterization aborted.', 'AbortError');
  const canvas = document.createElement('canvas');
  canvas.width = width + LOGO_PAD * 2;
  canvas.height = height + LOGO_PAD * 2;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create the logo raster canvas.');
  const image = new Image();
  let abort: (() => void) | undefined;
  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Could not decode ${logo.src}.`));
    abort = () => {
      image.onload = null;
      image.onerror = null;
      image.src = '';
      reject(new DOMException('Logo rasterization aborted.', 'AbortError'));
    };
    signal?.addEventListener('abort', abort, { once: true });
  });
  if (signal?.aborted) abort?.();
  else image.src = logo.src;
  try {
    await loaded;
  } finally {
    image.onload = null;
    image.onerror = null;
    if (abort) signal?.removeEventListener('abort', abort);
  }
  if (signal?.aborted) throw new DOMException('Logo rasterization aborted.', 'AbortError');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, LOGO_PAD, LOGO_PAD, width, height);
  return canvas;
}
