'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import { rtssConfig } from './rtss-data';
import { SplitCta } from './rtss-ui';

/** Closing ticket artwork follows the scroll; reduced motion keeps it static. */
export default function RtssTickets() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section
      ref={ref}
      id="tickets"
      aria-labelledby="tickets-heading"
      className="relative isolate overflow-hidden bg-primary px-5 pt-24 text-center text-primary-foreground sm:px-8 sm:pt-32 lg:px-10"
    >
      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="mb-6 text-sm tracking-widest uppercase">9 December 2026 · Munich</p>
        <h2
          id="tickets-heading"
          className="text-[80px] leading-[1.05] font-medium tracking-[-0.055em] max-sm:text-[48px]"
        >
          Get your a seat
          <br />
          or apply as a startup
        </h2>
        <div className="mt-9 flex justify-center">
          <SplitCta />
        </div>
      </div>
      {/* Runtime MotionValues bind the artwork to this section’s scroll progress. */}
      <motion.div
        aria-hidden="true"
        style={{ y: reducedMotion ? 0 : y, rotate: reducedMotion ? 0 : rotate }}
        className="relative mx-auto mt-24 h-72 w-full max-w-5xl sm:mt-28 sm:h-[480px]"
      >
        {/* A close, gently rocking stub matches the reference’s floating ticket. */}
        <div
          data-ticket-stub
          className="absolute top-4 right-[4%] flex h-64 w-[24%] origin-center animate-[rtss-ticket-rock_6s_ease-in-out_infinite] flex-col items-center justify-between rounded-2xl border-l border-dashed border-foreground/30 bg-brand-navy p-4 text-white shadow-card motion-reduce:-rotate-26 motion-reduce:animate-none sm:h-96 sm:p-7"
        >
          <div>
            <p className="text-xl font-semibold sm:text-3xl">RTSS</p>
            <p className="mt-2 text-[10px] sm:text-xs">
              09.12.2026
              <br />
              FREIHEITSHALLE
              <br />
              MUNICH
            </p>
          </div>
          <div className="space-y-3 text-xs sm:text-sm">
            <p>
              DOORS
              <br />
              <b className="text-xl sm:text-3xl">17:00</b>
            </p>
            <p>
              BUILD
              <br />
              <b className="text-xl sm:text-3xl">WHAT’S NEXT</b>
            </p>
          </div>
          <span className="text-[10px] tracking-widest">START MUNICH</span>
        </div>
        <div className="absolute top-14 left-[3%] h-64 w-[76%] -rotate-18 overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card sm:top-24 sm:h-96 sm:p-12">
          <span className="absolute -bottom-16 -left-10 size-64 rounded-full border-[28px] border-primary/10 sm:size-96 sm:border-[40px]" />
          <div className="relative flex items-center gap-4 border-b border-background/20 pb-5 text-left sm:pb-8">
            <strong className="text-3xl font-medium tracking-[-0.06em] sm:text-6xl">
              ROAD TO
              <br />
              START SUMMIT
            </strong>
            <span className="ml-auto text-xs sm:text-sm">
              {rtssConfig.longDate}
              <br />
              Freiheitshalle · Munich
            </span>
          </div>
          <div className="relative mt-6 flex items-end justify-between text-left sm:mt-10">
            <div>
              <p className="text-xs tracking-widest">YOUR NEXT OPPORTUNITY</p>
              <p className="mt-2 text-2xl tracking-tight sm:text-4xl">Pitch. Learn. Connect.</p>
            </div>
            <span className="text-xs font-semibold sm:text-xl">
              START
              <br />
              MUNICH ↗
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
