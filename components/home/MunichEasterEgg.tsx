'use client';

/**
 * MunichEasterEgg — the bit of the home page that is only ours.
 *
 * Three layers, from subtle to absurd:
 *
 *  1. `ChapterMarquee` lights the home chapter up every time it crosses the
 *     spotlight beam (Bavarian lozenges, a beacon ring, a `PROST!` tag).
 *  2. Clicking it — or pressing Enter on it — throws a confetti burst and a
 *     `PROST!` toast, and counts your steins.
 *  3. The Konami code anywhere on the page is Oktoberfest mode: beer and
 *     pretzels rain down the viewport.
 *
 * Everything decorative is skipped when the visitor prefers reduced motion; the
 * toast still appears, because it is text and the point of the easter egg.
 */
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

import ChapterMarquee, { type CheerOrigin } from '@/components/home/ChapterMarquee';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { useKonamiCode } from '@/lib/useKonamiCode';

type CheerKind = 'prost' | 'oktoberfest';

/** React's CSSProperties has no room for custom properties; declare the ones we use. */
interface SparkStyle extends CSSProperties {
  '--spark-drift-x': string;
  '--spark-drift-y': string;
  '--spark-spin': string;
}

interface RainStyle extends CSSProperties {
  '--rain-drift': string;
  '--rain-tumble': string;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  size: number;
  colour: string;
  spin: number;
  delay: number;
}

interface Drop {
  id: number;
  glyph: string;
  /** Horizontal position as a percentage of the viewport. */
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  tumble: number;
}

const SPARK_COUNT = 28;
const SPARK_COLOURS = ['#d0006f', '#ffffff', '#ff7ac2', '#011152'];
const SPARK_MS = 950;

const RAIN_COUNT = 34;
const RAIN_GLYPHS = ['🍺', '🥨', '🍻'];
const RAIN_MS = 6_500;

const TOAST_MS = 4_500;

const TOAST_COPY: Record<CheerKind, { title: string; body: string }> = {
  prost: {
    title: 'Prost! 🍺',
    body: 'München, Hauptstadt von Bayern — and the chapter that holds down the fort for the rest of us.',
  },
  oktoberfest: {
    title: "O'zapft is! 🥨",
    body: 'Oktoberfest mode unlocked. Even the global network is raising a stein with you.',
  },
};

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

function spawnSparks({ x, y }: CheerOrigin): Spark[] {
  return Array.from({ length: SPARK_COUNT }, (_, index) => {
    const angle = (index / SPARK_COUNT) * Math.PI * 2 + randomBetween(-0.25, 0.25);
    const distance = randomBetween(70, 210);

    return {
      id: index,
      x,
      y,
      driftX: Math.cos(angle) * distance,
      // Bias upwards so the burst reads as a fountain rather than an explosion.
      driftY: Math.sin(angle) * distance - 55,
      size: randomBetween(5, 13),
      colour: SPARK_COLOURS[index % SPARK_COLOURS.length],
      spin: randomBetween(-540, 540),
      delay: randomBetween(0, 90),
    };
  });
}

function spawnRain(): Drop[] {
  return Array.from({ length: RAIN_COUNT }, (_, index) => ({
    id: index,
    glyph: RAIN_GLYPHS[index % RAIN_GLYPHS.length],
    left: randomBetween(0, 100),
    delay: randomBetween(0, 2_400),
    duration: randomBetween(3.4, 5.8),
    size: randomBetween(18, 36),
    drift: randomBetween(-80, 80),
    tumble: randomBetween(-340, 340),
  }));
}

export default function MunichEasterEgg() {
  const reducedMotion = usePrefersReducedMotion();
  const [toast, setToast] = useState<{ kind: CheerKind; steins: number } | null>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [rain, setRain] = useState<Drop[] | null>(null);

  // Refs, not state: the counters only ever need to be read at trigger time.
  const steins = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const later = useCallback((callback: () => void, delay: number) => {
    timers.current.push(setTimeout(callback, delay));
  }, []);

  const cheer = useCallback(
    (kind: CheerKind) => {
      steins.current += 1;
      setToast({ kind, steins: steins.current });
      later(() => setToast(null), TOAST_MS);
    },
    [later],
  );

  const handleCheer = useCallback(
    (origin: CheerOrigin) => {
      if (reducedMotion) {
        cheer('prost');
        return;
      }
      setSparks(spawnSparks(origin));
      later(() => setSparks([]), SPARK_MS);
      cheer('prost');
    },
    [cheer, later, reducedMotion],
  );

  const handleOktoberfest = useCallback(() => {
    cheer('oktoberfest');
    if (reducedMotion) return;
    setRain(spawnRain());
    later(() => setRain(null), RAIN_MS);
  }, [cheer, later, reducedMotion]);

  useKonamiCode(handleOktoberfest);

  return (
    <>
      <ChapterMarquee onCheer={handleCheer} />

      {/* Confetti burst — viewport coordinates, straight from the click */}
      {sparks.length > 0 && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
          {sparks.map((spark) => {
            const style: SparkStyle = {
              left: spark.x,
              top: spark.y,
              width: spark.size,
              height: spark.size,
              backgroundColor: spark.colour,
              animationDelay: `${spark.delay}ms`,
              '--spark-drift-x': `${spark.driftX}px`,
              '--spark-drift-y': `${spark.driftY}px`,
              '--spark-spin': `${spark.spin}deg`,
            };

            return (
              <span key={spark.id} className="munich-spark absolute rounded-[1px]" style={style} />
            );
          })}
        </div>
      )}

      {/* Oktoberfest mode */}
      {rain && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
          {rain.map((drop) => {
            const style: RainStyle = {
              left: `${drop.left}%`,
              fontSize: `${drop.size}px`,
              animationDelay: `${drop.delay}ms`,
              animationDuration: `${drop.duration}s`,
              '--rain-drift': `${drop.drift}px`,
              '--rain-tumble': `${drop.tumble}deg`,
            };

            return (
              <span
                key={drop.id}
                className="munich-rain-item absolute top-0 select-none leading-none"
                style={style}
              >
                {drop.glyph}
              </span>
            );
          })}
        </div>
      )}

      {/* Cheers */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4 sm:bottom-10">
          <div
            role="status"
            aria-live="polite"
            className="munich-toast max-w-sm rounded-2xl border border-brand-pink/60 bg-brand-dark-blue/95 px-6 py-5 text-center shadow-[0_0_60px_rgba(208,0,111,0.4)] backdrop-blur"
          >
            <p className="text-2xl font-black text-brand-pink">{TOAST_COPY[toast.kind].title}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              {TOAST_COPY[toast.kind].body}
            </p>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
              Steins raised · {toast.steins}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
