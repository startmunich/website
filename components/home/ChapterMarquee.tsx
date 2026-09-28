'use client';

/**
 * ChapterMarquee — the endlessly rolling list of START chapters on the home page.
 *
 * Every chapter scrolls past in a single uniform list, with a rotating colour
 * pattern for rhythm. The home chapter (Munich) is the exception: it is a real
 * button, and it only comes to life while it crosses the spotlight beam down
 * the middle of the frame — Bavarian lozenges behind it, a beacon ring, and a
 * `PROST!` tag. Click it (or press Enter) to cheers.
 */
import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '@/lib/hooks';
import {
  HOME_CHAPTER,
  HOME_CHAPTER_LABEL,
  START_CHAPTER_CITIES,
  START_CHAPTER_COUNT,
} from '@/lib/startNetwork';
import { cn } from '@/lib/utils';

/** Where the spotlight beam sits in the viewport, as a fraction of its height. */
const BEAM_POSITION = 0.5;

/**
 * Half the height of the beam band, in pixels.
 *
 * This is the dwell time knob, not a styling one. The marquee rolls one row
 * (72px) per ~870ms, so a hairline beam would only hold the home chapter for
 * less time than its ignition transition takes and the effect would never
 * reach full brightness. A 90px band buys roughly two seconds of "lit".
 */
const BEAM_HALF_HEIGHT = 45;

/** How often the beam position is re-checked. The marquee is slow, so 16fps is plenty. */
const BEAM_SAMPLE_MS = 60;

/** Shared row typography — the home chapter button must match its neighbours exactly. */
const ROW_CLASS = 'text-5xl font-black leading-[1.2] sm:text-6xl lg:text-7xl';

export interface CheerOrigin {
  /** Viewport X of the clicked chapter. */
  x: number;
  /** Viewport Y of the clicked chapter. */
  y: number;
}

interface ChapterMarqueeProps {
  /** Fired when the home chapter is activated. */
  onCheer?: (origin: CheerOrigin) => void;
}

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

export default function ChapterMarquee({ onCheer }: ChapterMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const handleCheer = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      onCheer?.({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    },
    [onCheer],
  );

  // Track the home chapter across the beam.
  useEffect(() => {
    // Nothing is moving, so there is nothing to time — keep it lit permanently.
    if (reducedMotion) {
      setLit(true);
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;

    let frame = 0;
    let lastSample = 0;
    let onScreen = true;

    // Sampling stops entirely once the section scrolls away.
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(viewport);

    const tick = (time: number) => {
      frame = window.requestAnimationFrame(tick);
      if (!onScreen || time - lastSample < BEAM_SAMPLE_MS) return;
      lastSample = time;

      const box = viewport.getBoundingClientRect();
      const beamY = box.top + box.height * BEAM_POSITION;

      // Either copy of the list may be the one on screen at any given moment.
      const inBeam = Array.from(viewport.querySelectorAll<HTMLElement>('[data-home-chapter]')).some(
        (node) => {
          const rect = node.getBoundingClientRect();
          return Math.abs(rect.top + rect.height / 2 - beamY) <= BEAM_HALF_HEIGHT;
        },
      );

      setLit((previous) => (previous === inBeam ? previous : inBeam));
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div ref={viewportRef} className="relative h-[400px] overflow-hidden">
      {/* Fade overlays */}
      <div className="absolute left-0 right-0 top-0 z-10 h-20 bg-gradient-to-b from-brand-dark-blue to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-10 h-20 bg-gradient-to-t from-brand-dark-blue to-transparent" />

      {/* The spotlight beam — Munich ignites as it crosses this band */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex h-[90px] -translate-y-1/2 items-center gap-3 px-2"
      >
        <span
          className={cn(
            'absolute inset-x-0 top-1/2 h-[90px] -translate-y-1/2 bg-gradient-to-b from-transparent via-brand-pink/10 to-transparent transition-opacity duration-500',
            lit ? 'opacity-100' : 'opacity-0',
          )}
        />
        <span
          className={cn(
            'relative text-[9px] font-black leading-none tracking-[0.3em] transition-opacity duration-500',
            lit ? 'text-brand-pink opacity-90' : 'text-brand-pink opacity-40',
          )}
        >
          Home
        </span>
        <span
          className={cn(
            'relative h-px flex-1 bg-gradient-to-r from-brand-pink via-brand-pink/40 to-transparent transition-opacity duration-500',
            lit ? 'munich-line-glow opacity-100' : 'opacity-30',
          )}
        />
      </div>

      <div className="animate-scroll-vertical mt-12 text-right">
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
                data-home-chapter=""
                aria-hidden={isDuplicate || undefined}
                tabIndex={isDuplicate ? -1 : 0}
                onClick={handleCheer}
                aria-label={`${HOME_CHAPTER} — our home chapter. Activate to say Prost!`}
                className={cn(
                  'group relative block w-full cursor-pointer text-right outline-none transition-[transform,filter,opacity,color] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-4 focus-visible:ring-offset-brand-dark-blue',
                  ROW_CLASS,
                  lit
                    ? 'munich-glow z-10 scale-[1.07] text-brand-pink'
                    : 'text-brand-pink/45 hover:text-brand-pink/80',
                )}
              >
                {/* Beacon ring, expanding out of the word */}
                <span
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute inset-x-0 top-1/2 h-[260%] w-full rounded-[999px] border border-brand-pink/50 opacity-0',
                    lit && 'munich-beacon',
                  )}
                />

                {/* Bavarian lozenges */}
                <span
                  aria-hidden
                  className={cn(
                    'munich-lozenges pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500',
                    lit && 'munich-lozenges-lit opacity-60',
                  )}
                />

                {/*
                  Outlined echo. This only lines up because it shares the button's
                  line box: Avenir's ascent+descent (105px) overflows the 72px
                  line-height, so the two spans overflow symmetrically.
                */}
                <span aria-hidden className="munich-ghost pointer-events-none absolute inset-0">
                  {city}
                </span>

                <span>{city}</span>

                {/* The hint, revealed as it crosses the beam or on hover */}
                <span
                  aria-hidden
                  className={cn(
                    'munich-tag pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-brand-pink/60 px-3 py-1 text-[10px] leading-none tracking-[0.25em] text-brand-pink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100',
                    lit && 'opacity-100',
                  )}
                >
                  Prost! 🍺
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
