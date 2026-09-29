/**
 * Which mark the flare draws, and how it is sized inside the canvas.
 *
 * This lives apart from `pipeline.ts` on purpose. It is the only flare module
 * `index.tsx` needs for the static fallback, and it must stay free of `vgpu` and
 * the `.wgsl` imports: the React wrapper imports it directly, so a re-export
 * through `pipeline.ts` would drag the whole GPU bundle and all four shader
 * chunks into the homepage's critical bundle and defeat the lazy
 * `import('./renderer')`.
 */

/**
 * Phones get the round icon and everything from tablet width up gets the
 * wordmark. The cut-over is *not* the same breakpoint as the panel's shape: the
 * panel is a 1:1 square all the way to `lg` and only becomes a tall rectangle
 * above it, so between `sm` and `lg` the wordmark sits in a large square, where
 * it has room, rather than in a phone-sized one, where it would be a sliver.
 * `FlareRenderer` picks the variant from the `sm` query so the GPU texture and
 * the CSS fallback can never show different marks.
 */
export interface LogoVariant {
  /** Public path of the SVG, used as the GPU source and as the fallback. */
  readonly src: string;
  /** `viewBox` aspect (width / height) of the asset. */
  readonly aspect: number;
  /** Share of the canvas width the mark spans before the height cap applies. */
  readonly widthRatio: number;
  /** The mark never grows past this share of the canvas height. */
  readonly maxHeightRatio: number;
}

/** Tablet width and up: the wordmark, `public/startlogo.svg` (`viewBox="0 0 80 36"`). */
export const WORDMARK_LOGO: LogoVariant = {
  src: '/startlogo.svg',
  aspect: 80 / 36,
  widthRatio: 0.62,
  maxHeightRatio: 0.4,
};

/** Phones: the round icon, `public/start-munich-icon.svg` (`viewBox="0 0 61 61"`). */
export const ICON_LOGO: LogoVariant = {
  src: '/start-munich-icon.svg',
  aspect: 1,
  widthRatio: 0.5,
  maxHeightRatio: 0.5,
};

/** Transparent margin baked into the raster so edge sampling never clamps. */
export const LOGO_PAD = 3;

export const LOGO_CENTER = [0.5, 0.5] as const;
