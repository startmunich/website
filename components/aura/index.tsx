'use client';

/**
 * Aura — a slow, ambient light field over the hero background, rendered with
 * vgpu. Used by `components/Hero`, and therefore on every page with a hero.
 *
 * Two rules govern this file, and both exist to keep the GPU out of the critical
 * path:
 *
 *  1. Nothing here may import from `./pipeline` or `./renderer`. Those pull in
 *     `vgpu` and the WGSL chunk; the renderer is reached with a dynamic
 *     `import()` inside the effect so it arrives as its own bundle, long after
 *     first paint. This module therefore imports nothing but React and `cn`.
 *  2. The fallback is real, server-rendered DOM — not a canvas snapshot and not a
 *     `useEffect` write. A visitor on a browser without WebGPU gets the same
 *     design intent, in the initial HTML, with no layout shift and no flash.
 *
 * The canvas stays transparent and non-interactive until the renderer reports
 * readiness, then the two crossfade.
 */
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface AuraHandle {
  readonly ready: Promise<void>;
  readonly dispose: () => void;
}

/**
 * The static field, expressed in the same brand tokens and in the same
 * arrangement the shader produces: pink blooming in from the upper right, a
 * weaker lobe low on the left, and a navy base so the lower edge settles into
 * the page. Alpha values are the shader's `PEAK_ALPHA` scaled to a CSS gradient.
 *
 * Kept as a single constant rather than composed inline so there is one place to
 * retune if the palette moves.
 */
const FALLBACK_CLASSES =
  'absolute inset-0 bg-[radial-gradient(62%_70%_at_86%_16%,rgba(208,0,111,0.2),transparent_64%),radial-gradient(66%_74%_at_6%_82%,rgba(208,0,111,0.12),transparent_62%),radial-gradient(120%_60%_at_50%_108%,rgba(1,17,82,0.6),transparent_72%)]';

/** The crossfade window, long enough that the swap reads as light changing rather than a layer appearing. */
const FADE_CLASSES = 'transition-opacity duration-1000 motion-reduce:transition-none';

export function Aura({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let renderer: AuraHandle | undefined;

    void import('./renderer').then(({ createRenderer }) => {
      // The effect can tear down while the chunk is still in flight.
      if (disposed) return;
      renderer = createRenderer({
        canvas,
        onStatus: (status) => {
          if (!disposed) setLive(status === 'ready');
        },
      });
      // The renderer rethrows initialization failures after disposing itself and
      // reporting `error` through `onStatus`, so the fallback is already back in
      // place by the time this rejects. A missing GPU adapter is routine, not
      // exceptional, and must never reach the visitor as an unhandled rejection.
      renderer.ready.catch(() => undefined);
    });

    return () => {
      disposed = true;
      renderer?.dispose();
    };
  }, []);

  return (
    <div aria-hidden data-aura="" className={cn('pointer-events-none absolute inset-0', className)}>
      <div className={cn(FALLBACK_CLASSES, FADE_CLASSES, live ? 'opacity-0' : 'opacity-100')} />
      <canvas
        ref={canvasRef}
        className={cn('block h-full w-full', FADE_CLASSES, live ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  );
}

export default Aura;
