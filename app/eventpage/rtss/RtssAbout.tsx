'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import { aboutCopy } from './rtss-data';
import { ParallaxPhoto, Reveal, usePrefersReducedMotion } from './rtss-motion';
import { Pill } from './rtss-ui';

/**
 * Editorial opener. The heading sticks while the copy scrolls past it, then the
 * Freiheitshalle photograph widens from a column to the full gutter as it comes
 * into view.
 */
export default function RtssAbout() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const width = useTransform(scrollYProgress, [0, 0.8, 1], ['30%', '100%', '100%']);

  return (
    <section id="about" className="scroll-mt-8 px-5 pt-[140px] max-sm:pt-[60px] sm:px-8 lg:px-10">
      <div className="contents min-[901px]:mb-40 min-[901px]:grid min-[901px]:grid-cols-[44%_46%] min-[901px]:items-start min-[901px]:gap-[10%]">
        <div className="min-[901px]:sticky min-[901px]:top-10 min-[901px]:self-start">
          <div className="mb-[30px] w-fit max-sm:mb-6">
            <Pill>About</Pill>
          </div>
          <h2 className="text-[88px] leading-[1.03] font-medium tracking-[-0.055em] max-[1100px]:text-[76px] max-sm:text-[clamp(43px,11vw,66px)] max-sm:tracking-[-0.06em]">
            Pitch.
            <br />
            <span className="text-brand-pink">Learn.</span>
            <br />
            Connect.
          </h2>
        </div>

        <Reveal className="mt-[55px] mb-[100px] max-[1100px]:mb-[140px] min-[901px]:mt-0 min-[901px]:mb-0 min-[901px]:w-auto min-[901px]:pt-[416px]">
          {aboutCopy.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[32px] leading-[1.38] tracking-[-0.045em] text-muted-foreground max-[1100px]:text-[26px] max-sm:text-[23px]"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>

      <div ref={ref} className="h-[850px] max-sm:h-[420px]">
        <motion.div style={{ width: reduce ? '100%' : width }}>
          <ParallaxPhoto
            file="rtss-about-hall.jpg"
            alt="The audience gathered inside Freiheitshalle at START Munich RTSS 2025"
            sizes="(max-width: 640px) 100vw, 1800px"
            frameClassName="h-[780px] max-sm:h-[380px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
