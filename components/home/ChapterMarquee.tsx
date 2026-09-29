'use client';

/**
 * ChapterMarquee — the endlessly rolling list of START chapters on the home page.
 *
 * Every chapter scrolls past in a single uniform list, with a rotating colour
 * pattern for rhythm. The home chapter (Munich) is the exception: it is pink and
 * carries a `Prost 🍺` chip. Click it — or press Enter on it — and confetti
 * sprays out of the word.
 */
import { type MouseEvent, useCallback } from 'react';

import {
  HOME_CHAPTER,
  HOME_CHAPTER_LABEL,
  START_CHAPTER_CITIES,
  START_CHAPTER_COUNT,
} from '@/lib/startNetwork';
import { cn } from '@/lib/utils';

/** Shared row typography — the home chapter button must match its neighbours exactly. */
const ROW_CLASS = 'text-5xl font-black leading-[1.2] sm:text-6xl lg:text-7xl';

/** Brand colours only, so the burst reads as ours rather than a party cannon. */
const CONFETTI_COLOURS = ['#d0006f', '#ffffff', '#ff7ac2', '#011152'];

/** The four-way colour rotation that gives the other chapters their rhythm. */
function chapterColour(index: number) {
  switch ((index % START_CHAPTER_COUNT) % 4) {
    case 3:
      return 'text-brand-pink';
    case 0:
      return 'bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent';
    case 1:
      return 'text-white';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent';
  }
}

export default function ChapterMarquee() {
  const handleCheer = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    // Read the geometry synchronously. React nulls out `currentTarget` the moment this
    // handler yields, so anything read after the await below is already gone.
    const rect = event.currentTarget.getBoundingClientRect();

    // canvas-confetti takes a normalised origin, so the burst leaves the word itself
    // rather than the middle of the viewport.
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };

    // Imported on click so the confetti canvas is never in the initial home bundle.
    const { default: confetti } = await import('canvas-confetti');
    confetti({ origin, colors: CONFETTI_COLOURS, disableForReducedMotion: true });
  }, []);

  return (
    <div className="relative h-[400px] overflow-hidden">
      {/* Fade overlays */}
      <div className="absolute left-0 right-0 top-0 z-10 h-20 bg-gradient-to-b from-brand-dark-blue to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-10 h-20 bg-gradient-to-t from-brand-dark-blue to-transparent" />

      <div className="motion-safe:animate-scroll-vertical mt-12 text-right">
        {[...START_CHAPTER_CITIES, ...START_CHAPTER_CITIES].map((city, index) => {
          const isDuplicate = index >= START_CHAPTER_COUNT;

          if (city === HOME_CHAPTER_LABEL) {
            return (
              // The list is rendered twice for a seamless loop. The second copy stays
              // clickable for the mouse but is pulled out of the tab order and the
              // accessibility tree, so there is exactly one Munich to focus or announce.
              <button
                key={`${city}-${index}`}
                type="button"
                aria-hidden={isDuplicate || undefined}
                tabIndex={isDuplicate ? -1 : 0}
                onClick={handleCheer}
                aria-label={`${HOME_CHAPTER} — our home chapter. Activate to say Prost!`}
                className={cn(
                  'group relative block w-full cursor-pointer text-right text-brand-pink outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-4 focus-visible:ring-offset-brand-dark-blue',
                  ROW_CLASS,
                )}
              >
                <span>{city}</span>

                {/* Absolutely positioned so the chip can never change the row height —
                    the marquee loops on translateY(-50%) and any height drift between
                    the two halves shows up as a visible jump.

                    Below `sm` the row is only ~290px wide, and MUNICH itself eats 213px
                    of it — too little left for a bordered, wide-tracked pill without it
                    colliding with the wordmark. So the chip drops to bare text there and
                    picks up its pill from `sm` up, where there is room. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] leading-none text-brand-pink transition-colors duration-300 group-hover:text-white group-focus-visible:text-white sm:rounded-full sm:border sm:border-brand-pink/60 sm:px-3 sm:py-1 sm:tracking-[0.25em] sm:group-hover:bg-brand-pink/10 sm:group-focus-visible:bg-brand-pink/10"
                >
                  Prost 🍺
                </span>
              </button>
            );
          }

          return (
            <div key={`${city}-${index}`} className={cn(ROW_CLASS, chapterColour(index))}>
              {city}
            </div>
          );
        })}
      </div>
    </div>
  );
}
