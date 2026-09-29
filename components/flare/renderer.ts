/**
 * Frame loop and resource ownership for the START Munich logo flare.
 *
 * Adapted from the vgpu `nextjs-flare` example. The resize coalescing, stale
 * generation guard, and single `dispose()` teardown are kept exactly as they
 * were; the additions are:
 *  - `onStatus` reports readiness so the React wrapper can swap in a static
 *    fallback instead of leaving an empty canvas when WebGPU is missing.
 *  - Rendering pauses while the canvas is off screen, so the 30fps loop does not
 *    burn battery for a section most visitors never scroll to.
 *  - `prefers-reduced-motion` is honoured by holding a static, fully lit frame.
 *  - The mark is chosen from Tailwind's `sm` breakpoint: the round icon on
 *    phones, the wordmark from tablet width up.
 */
import type { Gpu } from 'vgpu';

import { rasterizeLogo } from './logo-raster';
import { ICON_LOGO, LOGO_CENTER, type LogoVariant, WORDMARK_LOGO } from './logo-variants';
import {
  backingDimensions,
  canvasRaster,
  FlarePipeline,
  type FlarePlacement,
  followLight,
  logoPixelSize,
  mapAutonomousLight,
  type Point,
  runCleanups,
} from './pipeline';

type RenderSize = Readonly<{ width: number; height: number; dpr: number }>;

const FRAME_INTERVAL_MS = 33;
const PULSE_HOLD_SECONDS = 0.35;

/**
 * Tailwind's `sm`: below it the panel shows the round icon, at and above it the
 * wordmark. This is deliberately *earlier* than the `lg` at which the panel
 * stops being a 1:1 square, so a tablet gets a large square panel with the
 * wordmark in it rather than a phone-sized one with the icon.
 */
const WORDMARK_QUERY = '(min-width: 640px)';

/** Selects the wordmark when the media query matches, otherwise defaulting to the icon. */
function logoVariantFor(query: MediaQueryList | undefined): LogoVariant {
  return query?.matches ? WORDMARK_LOGO : ICON_LOGO;
}

export interface FlareRendererOptions {
  readonly canvas: HTMLCanvasElement;
  readonly onStatus?: (status: 'ready' | 'unsupported' | 'error') => void;
}

/**
 * Starts asynchronous GPU initialization and returns readiness, resize, and disposal controls.
 * Reports unsupported environments or failures through onStatus; initialization failures reject ready.
 */
export function createRenderer({ canvas, onStatus }: FlareRendererOptions) {
  let disposed = false;
  let failed = false;
  let gpu: Gpu | undefined;
  let pipeline: FlarePipeline | undefined;
  let placement: FlarePlacement | undefined;
  let light: Point = LOGO_CENTER;
  let pointer: Point | undefined;
  let pulseHold = 0;
  let frameIndex = 0;
  let staticDirty = true;
  let lastTime = 0;
  let lastRender = -Infinity;
  let animationFrame = 0;
  let observer: ResizeObserver | undefined;
  let visibility: IntersectionObserver | undefined;
  let visible = true;
  let reduceMotion = false;
  let motionQuery: MediaQueryList | undefined;
  let variantQuery: MediaQueryList | undefined;
  let variant: LogoVariant = ICON_LOGO;
  let appliedVariant: LogoVariant | undefined;
  let pendingSize: RenderSize | undefined;
  let resizeTask: Promise<void> | undefined;
  let resizeGeneration = 0;
  let rasterAbort: AbortController | undefined;
  let appliedBacking: Point = [0, 0];
  let appliedSupersample = 0;

  /** Rasterizes and installs the requested size and logo variant unless the resize becomes stale. */
  const applySize = async (size: RenderSize, generation: number) => {
    if (!pipeline) return;
    const backing = backingDimensions(size.width, size.height, size.dpr);
    const supersample = size.dpr < 1.5 ? 2 : 1;
    if (
      backing[0] === appliedBacking[0] &&
      backing[1] === appliedBacking[1] &&
      supersample === appliedSupersample &&
      variant === appliedVariant
    ) {
      return;
    }

    const controller = new AbortController();
    rasterAbort = controller;
    const [logoWidth, logoHeight] = logoPixelSize(
      backing[0] * supersample,
      backing[1] * supersample,
      variant,
    );
    let logo: HTMLCanvasElement;
    try {
      logo = await rasterizeLogo(logoWidth, logoHeight, variant, controller.signal);
    } catch (error) {
      if (controller.signal.aborted) return;
      throw error;
    } finally {
      if (rasterAbort === controller) rasterAbort = undefined;
    }
    if (disposed || generation !== resizeGeneration) return;

    const nextPlacement = await pipeline.replace(
      backing,
      supersample,
      variant,
      canvasRaster(logo),
      () => disposed || generation !== resizeGeneration,
    );
    if (!nextPlacement) return;
    placement = nextPlacement;
    appliedBacking = backing;
    appliedSupersample = supersample;
    appliedVariant = variant;
    staticDirty = true;
  };

  /** Applies queued sizes serially, consuming the latest pending size on each iteration. */
  const drainResizes = async () => {
    while (pendingSize && !disposed) {
      const size = pendingSize;
      pendingSize = undefined;
      await applySize(size, resizeGeneration);
    }
  };

  /** Queues a valid size, aborts stale rasterization, and shares the active resize task. */
  const resize = (size: RenderSize): Promise<void> => {
    if (disposed || size.width <= 0 || size.height <= 0) return Promise.resolve();
    pendingSize = size;
    resizeGeneration += 1;
    rasterAbort?.abort();
    resizeTask ??= drainResizes()
      .catch((error: unknown) => {
        if (disposed && !failed) return;
        fail(error);
      })
      .finally(() => {
        resizeTask = undefined;
      });
    return resizeTask;
  };

  /** Measures the canvas CSS box and queues a resize using the current device pixel ratio. */
  const measure = () =>
    guard(() => {
      const rect = canvas.getBoundingClientRect();
      // The observer has nowhere to await, and `fail` rethrows so that callers
      // awaiting `ready` see the rejection. Without a terminal handler here a
      // resize failure would surface as an unhandled rejection; the status has
      // already been reported through `onStatus` by then.
      void resize({
        width: rect.width,
        height: rect.height,
        dpr: window.devicePixelRatio || 1,
      }).catch(() => undefined);
    });

  /** Tracks non-touch pointers as clamped, normalized positions inside the canvas. */
  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    guard(() => {
      const rect = canvas.getBoundingClientRect();
      pointer = [
        Math.min(1, Math.max(0, (event.clientX - rect.left) / Math.max(1, rect.width))),
        Math.min(1, Math.max(0, (event.clientY - rect.top) / Math.max(1, rect.height))),
      ];
    });
  };

  /** Clears the pointer target so the light resumes its autonomous orbit. */
  const handlePointerLeave = () => {
    pointer = undefined;
  };

  /** Schedules frames and renders visible canvases with throttled timing and reduced-motion lighting. */
  const frameLoop = (now: number) => {
    if (disposed) return;
    guard(() => {
      animationFrame = requestAnimationFrame(frameLoop);
      const activePipeline = pipeline;
      if (now - lastRender < FRAME_INTERVAL_MS || !placement || !activePipeline) return;
      // Off screen, or motion is reduced: hold the last frame instead of drawing.
      if (!visible) return;
      lastRender = now;
      const time = now / 1000;
      const dt = Math.min(Math.max(time - lastTime, 0), 0.05);
      lastTime = time;
      if (reduceMotion) {
        // Fully lit, still frame — the flare at rest. Redraw only when the scene
        // itself changed: the uniforms are constant here, so re-running the four
        // full-screen passes on every tick would burn GPU forever to reproduce an
        // identical image.
        if (staticDirty) {
          activePipeline.setFrameUniforms(placement, LOGO_CENTER, 0, 0, 1);
          activePipeline.draw(true);
          staticDirty = false;
        }
        return;
      }
      const target = pointer ?? mapAutonomousLight(time, placement);
      light = followLight(light, target, dt);
      pulseHold += ((pointer ? 1 : 0) - pulseHold) * (1 - Math.exp(-dt / PULSE_HOLD_SECONDS));
      activePipeline.setFrameUniforms(placement, light, frameIndex, time, pulseHold);
      activePipeline.draw(staticDirty);
      staticDirty = false;
      frameIndex += 1;
    });
  };

  /** Stops rendering, aborts pending rasterization, and releases observers, listeners, and GPU resources once. */
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    resizeGeneration += 1;
    runCleanups([
      () => rasterAbort?.abort(),
      () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      },
      () => observer?.disconnect(),
      () => visibility?.disconnect(),
      () => motionQuery?.removeEventListener('change', handleMotionChange),
      () => variantQuery?.removeEventListener('change', handleVariantChange),
      () => canvas.removeEventListener('pointermove', handlePointerMove),
      () => canvas.removeEventListener('pointerleave', handlePointerLeave),
      () => canvas.removeEventListener('pointercancel', handlePointerLeave),
      // Before `gpu.dispose()`: the pipeline's own textures are freed here, and
      // `gpu.dispose()` is the backstop for anything the kernel registered.
      () => pipeline?.dispose(),
      () => gpu?.dispose(),
    ]);
  };

  /** Updates the motion preference and requests a refreshed static scene. */
  function handleMotionChange(event: MediaQueryListEvent) {
    reduceMotion = event.matches;
    // Repaint the held frame under the new setting.
    lastRender = -Infinity;
    staticDirty = true;
  }

  /** Selects the responsive logo variant and remeasures the canvas to refresh its texture. */
  function handleVariantChange(event: MediaQueryListEvent) {
    variant = event.matches ? WORDMARK_LOGO : ICON_LOGO;
    // The panel also changes shape across this breakpoint, so the
    // ResizeObserver usually fires on its own — but re-measuring keeps the
    // texture correct even when the backing store happens not to change.
    // `getBoundingClientRect` forces layout, so this reads the new box size.
    measure();
  }

  /** Disposes the renderer, reports an error status, and rethrows the rendering or initialization error. */
  function fail(error: unknown): never {
    failed = true;
    try {
      dispose();
    } catch {
      // Teardown must not replace the live or initialization failure.
    }
    onStatus?.('error');
    throw error;
  }

  /** Runs synchronous work and routes any thrown error through renderer failure cleanup. */
  function guard<T>(work: () => T): T {
    try {
      return work();
    } catch (error) {
      return fail(error);
    }
  }

  /** Creates GPU resources, applies the initial size, and attaches observers before starting frames. */
  const initialize = async () => {
    if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
      onStatus?.('unsupported');
      return;
    }
    const { init, surface } = await import('vgpu');
    if (disposed) return;
    const nextGpu = await init({ label: 'start-munich-flare' });
    if (disposed) {
      try {
        nextGpu.dispose();
      } catch {
        // Intentional stale initialization is quiet.
      }
      return;
    }
    gpu = nextGpu;
    const output = surface(gpu, canvas, {
      autoResize: false,
      alphaMode: 'opaque',
      format: 'bgra8unorm',
    });
    pipeline = new FlarePipeline(gpu, output);
    variantQuery = window.matchMedia?.(WORDMARK_QUERY);
    variant = logoVariantFor(variantQuery);
    variantQuery?.addEventListener('change', handleVariantChange);
    const rect = canvas.getBoundingClientRect();
    await resize({
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height),
      dpr: window.devicePixelRatio || 1,
    });
    if (disposed) return;
    light = placement?.logoCenter ?? LOGO_CENTER;
    motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    reduceMotion = motionQuery?.matches ?? false;
    motionQuery?.addEventListener('change', handleMotionChange);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('pointercancel', handlePointerLeave);
    observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(canvas);
    visibility =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                visible = entry.isIntersecting;
                if (visible) lastRender = -Infinity;
              }
            },
            { rootMargin: '128px' },
          );
    visibility?.observe(canvas);
    animationFrame = requestAnimationFrame(frameLoop);
    onStatus?.('ready');
  };

  const ready = initialize().catch((error: unknown) => {
    if (disposed && !failed) return;
    fail(error);
  });

  return { ready, resize, dispose };
}
