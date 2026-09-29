'use client';

/**
 * LogoFlare — the START Munich wordmark rendered through the vgpu flare example.
 *
 * Adapted from the vgpu `nextjs-flare` example, which drew the Next.js mark on a
 * black canvas. The differences are all about dropping into this site:
 *  - the canvas is a decorative panel in the "About START" section rather than a
 *    full-viewport hero, so it sizes from its container;
 *  - the vignette blends into `brand-dark-blue` (the page background) instead of
 *    black, so the panel has no hard edge;
 *  - `renderer.ts` is imported lazily from the effect, which keeps `vgpu` and the
 *    four WGSL shader chunks out of the homepage's critical path.
 *
 * The renderer owns the canvas and its GPU resources; this component only decides
 * whether the flare is visible or the plain wordmark is. `renderer.ts` already
 * pauses the frame loop when the canvas scrolls out of view and holds a static
 * frame for `prefers-reduced-motion`, so neither is duplicated here.
 */
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

/** Must match `LOGO_SRC` in `logo-raster.ts` — the same asset the GPU pipeline uploads. */
const LOGO_SRC = '/startlogo.svg';

/**
 * The static wordmark is sized with the same ratios the pipeline uses for the GPU
 * placement (`LOGO_WIDTH_RATIO` / `LOGO_MAX_HEIGHT_RATIO` in `pipeline.ts`) so the
 * hand-off from fallback to flare does not jump. Tailwind cannot build class names
 * from variables, so the numbers are duplicated here — change both together.
 */
const FALLBACK_LOGO_CLASSES = 'aspect-[80/36] w-[62%] max-h-[40%]';

/** Subset of the renderer handle that the component lifecycle actually uses. */
interface FlareHandle {
  readonly ready: Promise<void>;
  readonly dispose: () => void;
}

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
        <div className={cn('relative', FALLBACK_LOGO_CLASSES)}>
          <Image
            src={LOGO_SRC}
            alt="START Munich"
            fill
            loading="lazy"
            className="object-contain"
            sizes="(max-width: 1024px) 62vw, 31vw"
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
