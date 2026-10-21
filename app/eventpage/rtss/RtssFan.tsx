'use client';

import { motion, type MotionValue, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import { fanImages } from './rtss-data';
import { usePrefersReducedMotion } from './rtss-motion';
import { RtssPhoto } from './rtss-ui';

/** One card of the fan. Cards 0 and 6 are the outer pair, card 3 the anchor. */
function FanCard({
  index,
  progress,
  reduce,
}: {
  index: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const offset = index - 3;

  const x = useTransform(
    progress,
    [0, 0.48, 0.8, 1],
    [0, offset * 105, offset * 105, offset * 112],
  );
  const y = useTransform(
    progress,
    [0, 0.48, 0.8, 1],
    [15, offset * offset * 8, offset * offset * 8, offset * offset * 8 - 25],
  );
  const rotate = useTransform(progress, [0, 0.48], [offset * 2, offset * 5.5]);
  const opacity = useTransform(progress, [0, 0.08, 0.82, 1], [index === 3 ? 1 : 0, 1, 1, 0.3]);

  return (
    <motion.div
      className="absolute top-0 left-1/2 -ml-[76px] h-[200px] w-[152px] origin-[center_120%] overflow-hidden rounded-[20px] bg-card"
      style={{
        x: reduce ? offset * 105 : x,
        y: reduce ? offset * offset * 8 : y,
        rotate: reduce ? offset * 5.5 : rotate,
        opacity: reduce ? 1 : opacity,
        zIndex: 10 - Math.abs(offset),
      }}
    >
      <RtssPhoto
        file={fanImages[index].src}
        alt={fanImages[index].alt}
        sizes="152px"
        frameClassName="h-full w-full rounded-[20px]"
      />
    </motion.div>
  );
}

/**
 * Seven technology photographs that fan out as the section scrolls past. The
 * section is deliberately taller than the viewport so the sticky stage has
 * scroll distance to play with.
 */
export default function RtssFan() {
  const ref = useRef<HTMLElement>(null);
  // Read once here rather than once per card: each of the seven cards was
  // attaching its own matchMedia listener for the same query.
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section
      ref={ref}
      aria-labelledby="fan-heading"
      data-rtss-fan=""
      className="relative h-[1500px] max-sm:h-[1100px]"
    >
      <div
        data-rtss-fan-sticky=""
        className="sticky top-0 flex h-svh min-h-[720px] flex-col items-center justify-center pb-7 max-sm:min-h-[650px] max-sm:pb-0"
      >
        <h2
          id="fan-heading"
          className="relative z-20 text-[80px] leading-none font-medium tracking-[-0.055em] max-sm:mx-auto max-sm:max-w-[330px] max-sm:text-center max-sm:text-[46px] max-sm:leading-[1.05]"
        >
          Dive into the world of <span className="text-brand-pink">Deep Tech.</span>
        </h2>

        <div className="relative mt-[85px] h-[340px] w-full max-sm:mt-[70px] max-sm:h-[240px]">
          <div className="relative h-full w-full max-[1100px]:scale-[0.9] max-sm:origin-top max-sm:scale-[0.38]">
            {fanImages.map((image, index) => (
              <FanCard key={image.src} index={index} progress={scrollYProgress} reduce={reduce} />
            ))}
          </div>
        </div>

        <p className="mt-[-58px] text-center text-[24px] leading-[1.4] text-foreground max-sm:mt-[-85px] max-sm:px-5">
          Founders, investors, students
          <br />
          to build what comes <span className="text-brand-pink">next.</span>
        </p>
      </div>
    </section>
  );
}
