/**
 * Rasterises the START Munich wordmark into a canvas for upload as a GPU texture.
 *
 * Adapted from the vgpu `nextjs-flare` example, which inlined the Next.js mark as
 * a `data:` URI. We point the same `Image` load at `public/startlogo.svg` instead
 * so the logo keeps a single source of truth, and size the canvas from the real
 * 80:36 viewBox rather than the example's 514:624 mark.
 *
 * The abort protocol is unchanged: an in-flight decode is cancellable and never
 * resolves after the caller has moved on.
 */
import { LOGO_PAD } from './pipeline';

const LOGO_SRC = '/startlogo.svg';

export async function rasterizeLogo(
  width: number,
  height: number,
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
    image.onerror = () => reject(new Error(`Could not decode ${LOGO_SRC}.`));
    abort = () => {
      image.onload = null;
      image.onerror = null;
      image.src = '';
      reject(new DOMException('Logo rasterization aborted.', 'AbortError'));
    };
    signal?.addEventListener('abort', abort, { once: true });
  });
  if (signal?.aborted) abort?.();
  else image.src = LOGO_SRC;
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
