import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Avenir Next is the brand typeface. Only the weights the type scale uses are
 * registered, so the browser never synthesises a bold: 500 is body copy, 600
 * and 700 are UI emphasis, 900 is display headings.
 */
export const avenir = localFont({
  src: [
    { path: '../public/fonts/AvenirNext-Regular-08.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/AvenirNext-Medium-06.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/AvenirNext-DemiBold-03.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/AvenirNext-Bold-01.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/AvenirNext-Heavy-09.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-avenir',
  display: 'swap',
});

/** Monospace face for the START Labs sub-brand (`.theme-labs`). */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

/**
 * Geometric sans for the Road to START Summit microsite (`.theme-rtss`), which
 * sets its own display face. It is only applied inside that theme, so loading it
 * here keeps every other route on Avenir Next.
 *
 * Self-hosted like Avenir (SIL Open Font License, see `Figtree-OFL.txt`) so
 * builds do not depend on fetching from Google, and so
 * `scripts/generate-rtss-og.mjs` can render the share image with the same face.
 */
export const figtree = localFont({
  src: [{ path: '../public/fonts/Figtree-Variable.ttf', weight: '300 900', style: 'normal' }],
  variable: '--font-figtree',
  display: 'swap',
});
