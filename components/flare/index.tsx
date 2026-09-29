'use client';

/**
 * LogoFlare — the START Munich mark rendered through the vgpu flare example.
 *
 * Adapted from the vgpu `nextjs-flare` example, which drew the Next.js mark on a
 * black canvas. The differences are all about dropping into this site:
 *  - the canvas is a decorative panel in the "About START" section rather than a
 *    full-viewport hero, so it sizes from its container;
 *  - the vignette blends into `brand-dark-blue` (the page background) instead of
 *    black, so the panel has no hard edge;
 *  - the mark is the round icon below the `sm` breakpoint and the wordmark from
 *    tablet width up, because the panel is still a 1:1 square there and the 80:36
 *    wordmark reads as a sliver in a phone-sized one;
 *  - `renderer.ts` is imported lazily from the effect, which keeps `vgpu` and the
 *    four WGSL shader chunks out of the homepage's critical path.
 *
 * The renderer owns the canvas and its GPU resources; this component only decides
 * whether the flare is visible or the static mark is. `renderer.ts` already
 * pauses the frame loop when the canvas scrolls out of view and holds a static
 * frame for `prefers-reduced-motion`, so neither is duplicated here.
 */
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { ICON_LOGO, WORDMARK_LOGO } from './pipeline';

/**
 * The static marks are sized with the same ratios the pipeline uses for the GPU
 * placement (`widthRatio` / `maxHeightRatio` in `pipeline.ts`) so the hand-off
 * from fallback to flare does not jump. Tailwind cannot build class names from
 * the variant table, so the numbers are duplicated here — change both together.
 *
 * Both are rendered at all times and swapped on the `sm` breakpoint rather than
 * picked in JS, so the correct mark is in the server HTML and needs no effect.
 * Only the visible one reaches the accessibility tree; the canvas is decorative.
 */
const FALLBACK_WORDMARK_CLASSES = 'relative hidden aspect-[80/36] w-[62%] max-h-[40%] sm:block';
const FALLBACK_ICON_CLASSES = 'relative aspect-square w-1/2 max-h-1/2 sm:hidden';

/** Subset of the renderer handle that the component lifecycle actually uses. */
interface FlareHandle {
  readonly ready: Promise<void>;
  readonly dispose: () => void;
}

/** Renders responsive static marks and reveals the decorative canvas when the renderer is ready. */
export function LogoFlare() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let renderer: FlareHandle | undefined;

    void import('./renderer').then(({ createRenderer }) => {
      // The effect can tear down while the chunk is still in flight.
      if (disposed) return;
      renderer = createRenderer({
        canvas,
        onStatus: (status) => {
          if (!disposed) setLive(status === 'ready');
        },
      });
      // The renderer rethrows init failures after it has already disposed itself
      // and reported `error` through `onStatus`. This is the only caller and we
      // do not want to act on it, but the promise is deliberately discarded, so
      // it needs a terminal handler or the rejection surfaces as an unhandled
      // error. A missing GPU adapter is routine, not exceptional.
      renderer.ready.catch(() => undefined);
    });

    return () => {
      disposed = true;
      renderer?.dispose();
    };
  }, []);

  return (
    // The parent supplies the rounded frame and `overflow-hidden`; only the
    // surface colour belongs here, so the panel edge is not drawn twice.
    <div className="relative h-full w-full bg-brand-dark-blue">
      {/* Fallback: also the first paint, and the whole render without WebGPU. */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-opacity duration-700 motion-reduce:transition-none',
          live ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div className={FALLBACK_ICON_CLASSES}>
          <Image
            src={ICON_LOGO.src}
            alt="START Munich"
            data-flare-mark="icon"
            fill
            loading="lazy"
            className="object-contain"
            sizes="(max-width: 640px) 50vw, 0px"
          />
        </div>
        <div className={FALLBACK_WORDMARK_CLASSES}>
          <Image
            src={WORDMARK_LOGO.src}
            alt="START Munich"
            data-flare-mark="wordmark"
            fill
            loading="lazy"
            className="object-contain"
            sizes="(max-width: 640px) 0px, 31vw"
          />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          'block h-full w-full touch-none transition-opacity duration-700 motion-reduce:transition-none',
          live ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
    </div>
  );
}

export default LogoFlare;
