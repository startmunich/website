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
 */
import type { Gpu } from 'vgpu';

import { rasterizeLogo } from './logo-raster';
import {
  backingDimensions,
  canvasRaster,
  FlarePipeline,
  type FlarePlacement,
  followLight,
  LOGO_CENTER,
  logoPixelSize,
  mapAutonomousLight,
  type Point,
  runCleanups,
} from './pipeline';

type RenderSize = Readonly<{ width: number; height: number; dpr: number }>;

const FRAME_INTERVAL_MS = 33;
const PULSE_HOLD_SECONDS = 0.35;

export interface FlareRendererOptions {
  readonly canvas: HTMLCanvasElement;
  readonly onStatus?: (status: 'ready' | 'unsupported' | 'error') => void;
}

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
  let pendingSize: RenderSize | undefined;
  let resizeTask: Promise<void> | undefined;
  let resizeGeneration = 0;
  let rasterAbort: AbortController | undefined;
  let appliedBacking: Point = [0, 0];
  let appliedSupersample = 0;

  const applySize = async (size: RenderSize, generation: number) => {
    if (!pipeline) return;
    const backing = backingDimensions(size.width, size.height, size.dpr);
    const supersample = size.dpr < 1.5 ? 2 : 1;
    if (
      backing[0] === appliedBacking[0] &&
      backing[1] === appliedBacking[1] &&
      supersample === appliedSupersample
    ) {
      return;
    }

    const controller = new AbortController();
    rasterAbort = controller;
    const [logoWidth, logoHeight] = logoPixelSize(
      backing[0] * supersample,
      backing[1] * supersample,
    );
    let logo: HTMLCanvasElement;
    try {
      logo = await rasterizeLogo(logoWidth, logoHeight, controller.signal);
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
      canvasRaster(logo),
      () => disposed || generation !== resizeGeneration,
    );
    if (!nextPlacement) return;
    placement = nextPlacement;
    appliedBacking = backing;
    appliedSupersample = supersample;
    staticDirty = true;
  };

  const drainResizes = async () => {
    while (pendingSize && !disposed) {
      const size = pendingSize;
      pendingSize = undefined;
      await applySize(size, resizeGeneration);
    }
  };

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

  const measure = () =>
    guard(() => {
      const rect = canvas.getBoundingClientRect();
      void resize({
        width: rect.width,
        height: rect.height,
        dpr: window.devicePixelRatio || 1,
      });
    });

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

  const handlePointerLeave = () => {
    pointer = undefined;
  };

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
        // Fully lit, still frame — the flare at rest.
        activePipeline.setFrameUniforms(placement, LOGO_CENTER, 0, 0, 1);
        activePipeline.draw(staticDirty);
        staticDirty = false;
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
      () => canvas.removeEventListener('pointermove', handlePointerMove),
      () => canvas.removeEventListener('pointerleave', handlePointerLeave),
      () => canvas.removeEventListener('pointercancel', handlePointerLeave),
      () => gpu?.dispose(),
    ]);
  };

  function handleMotionChange(event: MediaQueryListEvent) {
    reduceMotion = event.matches;
    // Repaint the held frame under the new setting.
    lastRender = -Infinity;
    staticDirty = true;
  }

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

  function guard<T>(work: () => T): T {
    try {
      return work();
    } catch (error) {
      return fail(error);
    }
  }

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
