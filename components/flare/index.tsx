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
 *  - the mark constants come from `./logo-variants`, which imports neither `vgpu`
 *    nor the shaders, so the lazy `./renderer` import really does keep the GPU
 *    bundle out of the homepage's critical path. Importing them from `./pipeline`
 *    instead would pull `vgpu` and all four WGSL chunks into the page bundle.
 *
 * The renderer owns the canvas and its GPU resources; this component only decides
 * which of the three stacked layers is opaque. `renderer.ts` already pauses the
 * frame loop when the canvas scrolls out of view and holds a static frame for
 * `prefers-reduced-motion`, so neither is duplicated here.
 *
 * ## The three layers
 *
 * | status     | shown                      | who                                     |
 * | ---------- | -------------------------- | --------------------------------------- |
 * | `pending`  | the static mark            | everyone, first paint and without JS    |
 * | `ready`    | the flare canvas           | browsers with a working WebGPU adapter  |
 * | `fallback` | the pre-flare event photo  | browsers that cannot run WebGPU at all  |
 *
 * `pending` is deliberately the *mark* and not the photo, even though the photo
 * is the better fit for the visitors who end up in `fallback`: whether a browser
 * has WebGPU is only knowable in the browser, so the photo cannot be the
 * server-rendered first paint without also flashing past every visitor who does
 * have a GPU. The mark is tiny and shares the flare's colours, so it is the
 * least jarring placeholder for the second group while the renderer chunk loads.
 */
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { ICON_LOGO, WORDMARK_LOGO } from './logo-variants';

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

/** The crossfade window, matching the one the canvas uses. */
const FADE_CLASSES = 'transition-opacity duration-700 motion-reduce:transition-none';

/**
 * The photograph that sat in this panel before the flare landed, restored for
 * browsers that cannot render the flare. It is a real photograph of a START
 * Munich event, so unlike the mark it needs a real `alt` — and it is deliberately
 * the *same asset* the panel used to show, so a visitor without WebGPU sees the
 * panel they would have seen before `729c567` rather than a plain logo.
 */
const PANEL_PHOTO = {
  src: '/home/good-opt.png',
  alt: 'Students at a START Munich event',
  sizes: '(max-width: 1024px) 100vw, 50vw',
} as const;

/**
 * Which layer the panel is currently showing. `'pending'` is the initial state
 * and the server-rendered one; the renderer moves it exactly once, to either
 * `'ready'` or `'fallback'`.
 */
type FlareStatus = 'pending' | 'ready' | 'fallback';

/** Subset of the renderer handle that the component lifecycle actually uses. */
interface FlareHandle {
  readonly ready: Promise<void>;
  readonly dispose: () => void;
}

/** Renders responsive static marks and reveals the decorative canvas when the renderer is ready. */
export function LogoFlare() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<FlareStatus>('pending');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let renderer: FlareHandle | undefined;

    // Cheap gate before the dynamic import. `renderer.ts` runs this same check
    // internally, but only once its own chunk has downloaded and parsed, so a
    // browser without WebGPU would wait on a ~50 kB GPU bundle before being told
    // what it already knows. Screening here swaps those visitors to the photo
    // almost immediately and skips the download entirely. It cannot catch a
    // browser that exposes `navigator.gpu` but yields no adapter — the renderer
    // still reports `unsupported` for that, and it lands in the same `fallback`.
    if (!('gpu' in navigator)) {
      setStatus('fallback');
      return;
    }

    void import('./renderer').then(({ createRenderer }) => {
      // The effect can tear down while the chunk is still in flight.
      if (disposed) return;
      renderer = createRenderer({
        canvas,
        onStatus: (next) => {
          if (disposed) return;
          // Both a missing adapter and a failed init mean the flare will never
          // paint, so both land on the photo rather than leaving a bare mark.
          setStatus(next === 'ready' ? 'ready' : 'fallback');
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

  // `opacity-0` still leaves an element in the accessibility tree, so the two
  // hidden layers are hidden from it explicitly rather than by opacity alone.
  // Without this the panel would announce the mark *and* the photograph at once
  // for every visitor without WebGPU.
  const showMark = status === 'pending';
  const showPhoto = status === 'fallback';

  return (
    // The parent supplies the rounded frame and `overflow-hidden`; only the
    // surface colour belongs here, so the panel edge is not drawn twice.
    <div className="relative h-full w-full bg-brand-dark-blue">
      {/* First paint, and the whole render until WebGPU is ruled either way. */}
      <div
        aria-hidden={!showMark}
        data-flare-mark-layer=""
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          FADE_CLASSES,
          showMark ? 'opacity-100' : 'opacity-0',
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

      {/* The event photo, for browsers with no usable WebGPU. Kept mounted at
          `opacity-0` rather than conditionally rendered so the swap is a
          crossfade with no decode stall — `loading="lazy"` still keeps it off
          the critical path, and it is below the fold for most visitors. */}
      <div
        aria-hidden={!showPhoto}
        data-flare-photo=""
        className={cn('absolute inset-0', FADE_CLASSES, showPhoto ? 'opacity-100' : 'opacity-0')}
      >
        <Image
          src={PANEL_PHOTO.src}
          alt={PANEL_PHOTO.alt}
          fill
          loading="lazy"
          className="object-cover object-right"
          sizes={PANEL_PHOTO.sizes}
        />
        {/* The flare blends into the page through a vignette; the photograph gets
            the same hand-off at the bottom edge so the panel does not end in a
            hard line against the dark background. */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/50 via-transparent to-transparent" />
      </div>

      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          // No `touch-none` here: the canvas covers the whole panel, and
          // `touch-action: none` would stop a finger drag from scrolling the page
          // across the whole square. The renderer ignores touch pointers anyway.
          'block h-full w-full',
          FADE_CLASSES,
          status === 'ready' ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
    </div>
  );
}

export default LogoFlare;
