'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import { rtssConfig } from './rtss-data';
import { usePrefersReducedMotion } from './rtss-motion';
import { TicketCta } from './rtss-ui';

/** Closing ticket artwork follows the scroll; reduced motion keeps it static. */
export default function RtssTickets() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section
      ref={ref}
      id="tickets"
      aria-labelledby="tickets-heading"
      className="relative isolate overflow-hidden bg-primary px-5 pt-12 text-center text-primary-foreground sm:px-8 sm:pt-16 lg:px-10"
    >
      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="mb-3 text-sm tracking-widest uppercase">
          {rtssConfig.longDate} · {rtssConfig.city}
        </p>
        <h2
          id="tickets-heading"
          className="text-[80px] leading-[1.05] font-medium tracking-[-0.055em] max-sm:text-[48px]"
        >
          Get your seat
        </h2>
        <div className="mt-5 flex justify-center">
          <TicketCta location="finale" />
        </div>
      </div>
      {/* At full width, 1em in the artwork is 16px. Its geometry and type scale together. */}
      <div className="@container mx-auto mt-5 w-full max-w-5xl pb-4 sm:mt-7">
        <motion.div
          aria-hidden="true"
          style={{ y: reducedMotion ? 0 : y, rotate: reducedMotion ? 0 : rotate }}
          className="relative aspect-[1024/632] w-full text-[1.5625cqw] leading-normal"
        >
          {/* A close, gently rocking stub matches the reference’s floating ticket. */}
          <div
            data-ticket-stub
            className="absolute top-[3em] right-[7%] flex h-[24em] w-[24%] origin-center animate-[rtss-ticket-rock_6s_ease-in-out_infinite] flex-col items-center justify-between rounded-[1em] border-l border-dashed border-foreground/30 bg-brand-navy p-[1.75em] text-white shadow-card motion-reduce:-rotate-26 motion-reduce:animate-none"
          >
            <div>
              <p className="text-[1.875em] leading-tight font-semibold">RTSS</p>
              <p className="mt-[0.65em] text-[0.75em]">
                09.12.2026
                <br />
                FREIHEITSHALLE
                <br />
                MUNICH
              </p>
            </div>
            <div className="space-y-[0.75em]">
              <p>
                DOORS
                <br />
                <b className="text-[1.875em] leading-tight">17:00</b>
              </p>
              <p>
                BUILD
                <br />
                <b className="text-[1.875em] leading-tight">WHAT’S NEXT</b>
              </p>
            </div>
            <span className="text-[0.625em] tracking-widest">START MUNICH</span>
          </div>
          <div className="absolute top-[8em] left-[5%] h-[24em] w-[74%] -rotate-18 overflow-hidden rounded-[1em] bg-foreground p-[3em] text-background shadow-card">
            <span className="absolute -bottom-[4em] -left-[2.5em] size-[24em] rounded-full border-[2.5em] border-primary/10" />
            <div className="relative flex items-center gap-[1em] border-b border-background/20 pb-[2em] text-left">
              <strong className="text-[3.75em] leading-none font-medium tracking-[-0.06em] whitespace-nowrap">
                ROAD TO
                <br />
                START SUMMIT
              </strong>
              <span className="ml-auto text-[0.875em]">
                {rtssConfig.longDate}
                <br />
                Freiheitshalle · Munich
              </span>
            </div>
            <div className="relative mt-[2.5em] flex items-end justify-between text-left">
              <div>
                <p className="text-[0.75em] tracking-widest">YOUR NEXT OPPORTUNITY</p>
                <p className="mt-[0.2em] text-[2.25em] leading-tight tracking-tight">
                  Pitch. Learn. Connect.
                </p>
              </div>
              <span className="text-[1.25em] font-semibold">
                START
                <br />
                MUNICH ↗
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
