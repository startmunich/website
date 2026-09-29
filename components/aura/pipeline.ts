/**
 * Aura pipeline — one fullscreen fragment pass over the hero.
 *
 * Simpler than the flare pipeline by design. There is no scene texture, no
 * target ping-pong and no logo to rasterize, so the whole pass is a single
 * `frame().pass()` with the shared blue-noise texture and a 64-byte uniform
 * block. The colour and drift values are the `brand-pink` and
 * `brand-secondary-blue` tokens from `tailwind.config.ts`.
 */
import { type Effect, effect, frame, type Gpu, type Target } from 'vgpu';

import {
  bestEffort,
  createBlueNoiseTexture,
  type Point,
  runCleanups,
  withFullscreenVertex,
} from '@/lib/gpu/runtime';

import fieldWgsl from './field.wgsl';

/** `brand-pink` (`#d0006f`). */
const PINK = [208 / 255, 0, 111 / 255] as const;
/** `brand-secondary-blue` (`#011152`). */
const BLUE = [1 / 255, 17 / 255, 82 / 255] as const;

/**
 * Peak alpha of the brightest part of the field.
 *
 * The hero already sits under a 70% `brand-dark-blue` scrim, so this is a veil
 * over an already dark image rather than a light source in its own right. The
 * first pass used 0.34 and read as a barely-there tint rather than as light, so
 * it sits higher now; past roughly 0.7 the `outline-text` headlines start to
 * lose contrast against the brightest lobes and the calm ellipse wants
 * widening rather than the alpha coming back down.
 */
const PEAK_ALPHA = 0.55;

/**
 * Field units travelled per second. The field is authored over roughly one unit,
 * so this is a little under one full traverse per 30 seconds — slow enough to
 * read as atmosphere rather than motion.
 */
const DRIFT_SPEED = 0.035;

/**
 * `fbm` of three octaves sums to at most 0.875 and sits near 0.44.
 *
 * The window is deliberately narrow. A wide one lights most of the field and
 * the result reads as a flat colour wash over the photograph; a narrow one
 * leaves real dark space, which is what makes the lit parts read as light
 * rather than as tint.
 */
const DENSITY_FLOOR = 0.34;
const DENSITY_RANGE = 0.3;

/** Strength of the cell-boundary filaments, as a fraction of `PEAK_ALPHA`. */
const NETWORK_STRENGTH = 0.5;
/** Half-width of a filament, in cell units. Larger means softer, fewer lines. */
const NETWORK_WIDTH = 0.075;
/**
 * Cell density. Applied to the warped field, not to raw centred coordinates, so
 * the cells are stretched by the flow rather than tiling evenly. Too low and the
 * web reads as a low-poly wireframe; this lands on roughly six cells across the
 * hero, which is fine enough to look like a network and coarse enough to survive
 * the compositor's upscaling.
 */
const NETWORK_SCALE = 5.5;
/** Radius of a lit node, in cell units. Kept well under the filament width. */
const NODE_WIDTH = 0.04;

/**
 * Radius, in aspect-corrected UV, over which the light falls off. Keeping it
 * here rather than in the shader means the light stays circular on a wide hero
 * instead of stretching with the canvas. The light's *strength* is not a
 * constant: the renderer eases it from 0 up to whatever the pointer warrants.
 */
const LIGHT_REACH = 0.42;

export interface AuraUniforms {
  /** Seconds since the renderer started, driving the drift and the luminance breath. */
  readonly timeSeconds: number;
  /** Integer frame counter, used only to decorrelate the blue-noise dither. */
  readonly frameSeed: number;
  /** Pointer or orbiting light position, in the canvas's 0-1 UV space. */
  readonly light: Point;
  /** How strongly that light is currently applied, 0-1. */
  readonly lightStrength: number;
}

export class AuraPipeline {
  private readonly blueNoise: GPUTexture;
  private readonly field: Effect;
  private size: Point = [0, 0];
  private primed = false;
  private disposed = false;

  /** Creates the shared blue-noise texture and the single field pass. */
  constructor(
    private readonly gpu: Gpu,
    private readonly output: Target,
  ) {
    this.blueNoise = createBlueNoiseTexture(gpu, 'start-aura-blue-noise-128');
    try {
      this.field = effect(gpu, withFullscreenVertex(fieldWgsl), { label: 'start-aura-field' });
    } catch (error) {
      bestEffort(() => this.blueNoise.destroy());
      throw error;
    }
    this.field.set({ blueNoiseTexture: this.blueNoise });
  }

  /**
   * Sizes the surface and compiles the pass.
   *
   * Compiling up front moves shader-module creation off the first visible
   * frame, which is the difference between a layer that fades in smoothly and
   * one that stutters on arrival.
   */
  async prime(size: Point): Promise<void> {
    if (this.disposed) return;
    this.applySize(size);
    await this.field.compile({
      colors: [this.output.format],
      sampleCount: this.output.sampleCount,
    });
    if (this.disposed) return;
    this.primed = true;
  }

  /** Resizes the surface, ignoring a no-op so repeated observer callbacks stay cheap. */
  resize(size: Point): void {
    if (this.disposed) return;
    this.applySize(size);
  }

  /** Uploads the frame uniforms and draws the field into the surface. */
  draw(uniforms: AuraUniforms): void {
    if (!this.primed || this.disposed) return;
    const [width, height] = this.size;
    const reference = Math.max(1, Math.min(width, height));
    this.field.set({
      params: {
        pink: [PINK[0], PINK[1], PINK[2], PEAK_ALPHA],
        blue: [BLUE[0], BLUE[1], BLUE[2], DRIFT_SPEED],
        field: [uniforms.timeSeconds, uniforms.frameSeed, DENSITY_FLOOR, DENSITY_RANGE],
        shape: [width / reference, height / reference, 0, 0],
        light: [uniforms.light[0], uniforms.light[1], LIGHT_REACH, uniforms.lightStrength],
        net: [NETWORK_STRENGTH, NETWORK_WIDTH, NETWORK_SCALE, NODE_WIDTH],
      },
    });
    frame(this.gpu, (currentFrame) => {
      currentFrame.pass(this.output, this.field);
    });
  }

  /** Releases the blue-noise texture once, attempting the cleanup. */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.primed = false;
    runCleanups([() => this.blueNoise.destroy()]);
  }

  private applySize(size: Point): void {
    const next: [number, number] = [
      Math.max(1, Math.floor(size[0])),
      Math.max(1, Math.floor(size[1])),
    ];
    if (next[0] === this.size[0] && next[1] === this.size[1]) return;
    this.output.resize(next);
    this.size = next;
  }
}
