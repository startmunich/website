/**
 * Frame loop and resource ownership for the hero aura.
 *
 * The lifecycle, teardown order and `onStatus` contract are the ones the flare
 * renderer already established in this repo, deliberately kept identical so the
 * two features can be reasoned about together. What the aura does not need is
 * most of what the flare carries: no logo to rasterize (so resizes are
 * synchronous and need no generation counter or `AbortController`), no pointer
 * input, and no ping-pong targets.
 *
 * Two decisions carry the performance story:
 *  - The field is rasterized at a fraction of the canvas's pixel size and left
 *    to be interpolated up by the compositor. See `fieldDimensions`.
 *  - Elapsed time accumulates only by the clamped per-frame delta, so the drift
 *    stays continuous across a backgrounded tab or a dropped frame instead of
 *    jumping to wherever the wall clock now is.
 */
import type { Gpu } from 'vgpu';

import { runCleanups } from '@/lib/gpu/runtime';

import { AuraPipeline } from './pipeline';

/**
 * Roughly 30fps. The field evolves over tens of seconds, so a higher rate would
 * cost power without adding anything anyone could see.
 */
const FRAME_INTERVAL_MS = 33;

/**
 * Target size of the field's long edge in pixels.
 *
 * The field is smooth by construction, and the compositor upscales it with
 * bilinear filtering, so this bounds the fragment cost without a visible
 * difference. It is deliberately *not* derived from the device pixel ratio: the
 * aura carries no detail that a retina panel could resolve.
 */
const FIELD_LONG_EDGE = 380;

/** Floor that keeps a very small hero from producing a degenerate texture. */
const MIN_FIELD_EDGE = 24;

export interface AuraRendererOptions {
  readonly canvas: HTMLCanvasElement;
  readonly onStatus?: (status: 'ready' | 'unsupported' | 'error') => void;
}

export interface AuraHandle {
  readonly ready: Promise<void>;
  readonly dispose: () => void;
}

/**
 * Converts a CSS box to the field's raster size, preserving aspect ratio and
 * never scaling up. Exported for tests.
 */
export function fieldDimensions(width: number, height: number): [number, number] {
  const longest = Math.max(width, height, 1);
  const scale = Math.min(1, FIELD_LONG_EDGE / longest);
  return [
    Math.max(MIN_FIELD_EDGE, Math.round(width * scale)),
    Math.max(MIN_FIELD_EDGE, Math.round(height * scale)),
  ];
}

export function createRenderer({ canvas, onStatus }: AuraRendererOptions): AuraHandle {
  let disposed = false;
  let failed = false;
  let primed = false;
  let gpu: Gpu | undefined;
  let pipeline: AuraPipeline | undefined;
  let observer: ResizeObserver | undefined;
  let visibility: IntersectionObserver | undefined;
  let motionQuery: MediaQueryList | undefined;
  let reduceMotion = false;
  let visible = true;
  let elapsed = 0;
  let previousTime = 0;
  let lastRender = -Infinity;
  let frameIndex = 0;
  let staticDrawn = false;
  let animationFrame = 0;
  let pendingSize: [number, number] | undefined;
  let resizeTask: Promise<void> | undefined;

  /** Applies a size, compiling the pass the first time and resizing thereafter. */
  const applySize = async (size: [number, number]) => {
    if (!pipeline || disposed) return;
    if (primed) {
      pipeline.resize(size);
      return;
    }
    await pipeline.prime(size);
    if (disposed) return;
    primed = true;
  };

  /** Applies queued sizes serially, always consuming the most recent one. */
  const drainResizes = async () => {
    while (pendingSize) {
      const size = pendingSize;
      pendingSize = undefined;
      await applySize(size);
    }
  };

  /** Queues a raster size for the field, sharing any in-flight resize. */
  const resize = (width: number, height: number) => {
    if (disposed || width <= 0 || height <= 0) return undefined;
    pendingSize = fieldDimensions(width, height);
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

  /** Measures the canvas CSS box and queues a resize at the current pixel ratio. */
  const measure = () =>
    guard(() => {
      const rect = canvas.getBoundingClientRect();
      void resize(rect.width, rect.height);
    });

  /** Draws throttled frames, skipping anything off screen or under reduced motion. */
  const frameLoop = (now: number) => {
    if (disposed) return;
    guard(() => {
      animationFrame = requestAnimationFrame(frameLoop);
      const activePipeline = pipeline;
      if (!activePipeline || !primed) return;
      if (now - lastRender < FRAME_INTERVAL_MS) return;
      if (!visible) return;

      // Clamped so a long stall — a backgrounded tab, a long task — advances the
      // drift by a step rather than teleporting it.
      const delta = Math.min(Math.max(now - previousTime, 0), FRAME_INTERVAL_MS * 4);
      previousTime = now;

      if (reduceMotion) {
        // One still frame at t=0. The uniforms are then constant, so re-running
        // the pass every tick would burn GPU forever to produce an identical
        // image. A resize is the only thing that invalidates it.
        if (staticDrawn) return;
        activePipeline.draw({ timeSeconds: 0, frameSeed: 0 });
        staticDrawn = true;
        lastRender = now;
        return;
      }

      elapsed += delta;
      lastRender = now;
      activePipeline.draw({ timeSeconds: elapsed / 1000, frameSeed: frameIndex });
      frameIndex += 1;
      staticDrawn = false;
    });
  };

  /** Redraws the held frame after a motion-preference or size change. */
  function invalidate() {
    lastRender = -Infinity;
    staticDrawn = false;
  }

  /** Updates the motion preference and refreshes the held frame. */
  function handleMotionChange(event: MediaQueryListEvent) {
    reduceMotion = event.matches;
    invalidate();
  }

  /** Stops rendering and releases observers and GPU resources exactly once. */
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    pendingSize = undefined;
    runCleanups([
      () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      },
      () => observer?.disconnect(),
      () => visibility?.disconnect(),
      () => motionQuery?.removeEventListener('change', handleMotionChange),
      // Before `gpu.dispose()`: the pipeline frees its own texture here, and
      // `gpu.dispose()` is the backstop for anything the runtime registered.
      () => pipeline?.dispose(),
      () => gpu?.dispose(),
    ]);
  };

  /** Disposes the renderer, reports an error status, and rethrows the cause. */
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

  /** Creates GPU resources, applies the initial size, then attaches observers and starts frames. */
  const initialize = async () => {
    if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
      onStatus?.('unsupported');
      return;
    }
    const { init, surface } = await import('vgpu');
    if (disposed) return;
    const nextGpu = await init({ label: 'start-munich-aura' });
    if (disposed) {
      try {
        nextGpu.dispose();
      } catch {
        // Intentional stale initialization is quiet.
      }
      return;
    }
    gpu = nextGpu;
    // `premultiplied` matches the pass, which returns colour already scaled by
    // alpha. A premultiplied surface lets the compositor skip the divide that
    // `straight` alpha would need on every blend.
    const output = surface(gpu, canvas, {
      autoResize: false,
      alphaMode: 'premultiplied',
      format: 'bgra8unorm',
    });
    pipeline = new AuraPipeline(gpu, output);

    const rect = canvas.getBoundingClientRect();
    await resize(Math.max(1, rect.width), Math.max(1, rect.height));
    if (disposed) return;

    motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    reduceMotion = motionQuery?.matches ?? false;
    motionQuery?.addEventListener('change', handleMotionChange);

    observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => {
            measure();
            invalidate();
          });
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
            // Start slightly before the layer scrolls in, so the first visible
            // frame is already warm rather than fading up from blank.
            { rootMargin: '128px' },
          );
    visibility?.observe(canvas);

    previousTime = performance.now();
    animationFrame = requestAnimationFrame(frameLoop);
    onStatus?.('ready');
  };

  const ready = initialize().catch((error: unknown) => {
    if (disposed && !failed) return;
    fail(error);
  });

  return { ready, dispose };
}
