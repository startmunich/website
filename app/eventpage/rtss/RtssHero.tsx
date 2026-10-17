'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { navItems, rtssConfig } from './rtss-data';
import { usePrefersReducedMotion } from './rtss-motion';
import { rtssImage, SplitCta } from './rtss-ui';

/**
 * Opening composition: the pink stage, the brand bar, and the supplied RTSS
 * artwork. The lettering is baked into the artwork, so the only real headline
 * here is the visually hidden one.
 *
 * The artwork is landscape (1600x899) and is placed in a box of the same shape
 * so nothing letterboxes. Its width is the smaller of the stage width and the
 * width the leftover height can carry, which keeps the composition whole on any
 * display: short viewports fill edge to edge, tall ones leave the surplus pink
 * below the artwork rather than stranding a gap above it.
 */
export default function RtssHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <header
      ref={ref}
      id="top"
      className="relative isolate flex h-svh min-h-[720px] flex-col overflow-hidden bg-brand-pink text-brand-navy max-[900px]:min-h-[700px]"
    >
      <nav
        aria-label="Main navigation"
        className="relative z-10 flex h-[54px] shrink-0 items-center justify-between gap-10 bg-brand-pink px-7 py-1.5 text-white max-sm:h-auto max-sm:min-h-11 max-sm:flex-col max-sm:flex-nowrap max-sm:gap-1 max-sm:px-3 max-sm:py-1"
      >
        <Link
          href="/"
          aria-label="START Munich home"
          className="shrink-0 leading-none max-sm:hidden"
        >
          <Image
            src={rtssImage('start-munich-white.png')}
            alt="START Munich"
            width={104}
            height={48}
            className="h-auto w-[104px] max-sm:w-[84px]"
          />
        </Link>
        <div className="flex flex-1 items-center justify-around gap-6 max-sm:w-full max-sm:flex-wrap max-sm:justify-center max-sm:gap-x-[18px]">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[17px] font-bold underline-offset-4 hover:underline max-sm:py-1.5 max-sm:text-sm"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="relative z-10 flex shrink-0 items-center justify-end p-6 max-sm:justify-between max-sm:gap-2.5 max-sm:p-4">
        <Link
          href="/"
          aria-label="START Munich home"
          className="hidden shrink-0 leading-none max-sm:block"
        >
          <Image
            src={rtssImage('start-munich-white.png')}
            alt="START Munich"
            width={70}
            height={32}
            className="h-auto w-[70px]"
          />
        </Link>
        <SplitCta />
      </div>

      {/* Fills the stage under the navigation and the calls to action. 10.5rem
          is what the bar and the CTA row consume, so the artwork is never
          taller than the space it is given. */}
      <div className="relative z-1 flex min-h-0 flex-1 items-start justify-center max-sm:hidden">
        <div className="relative aspect-[1600/899] w-[min(100%,calc((100svh_-_10.5rem)_*_1.78))]">
          <motion.div className="absolute inset-0" style={{ y: reduce ? 0 : y }}>
            <Image
              src={rtssImage('hero-desktop.png')}
              alt="White RTSS lettering layered through a robotic hand on midnight blue"
              fill
              sizes="(max-width: 1600px) 100vw, 1600px"
              priority
              className="object-contain"
            />
          </motion.div>

          {/* Kept inside the artwork so it always sits on the navy, never on
              the pink below it. */}
          <div className="absolute inset-x-10 bottom-[38px] z-4 flex items-center justify-between gap-[34px] text-[80px] leading-[1.1] tracking-[-0.055em] whitespace-nowrap text-foreground max-[1100px]:gap-6 max-[1100px]:text-[60px] max-[900px]:inset-x-[30px] max-[900px]:text-[48px]">
            <span>{rtssConfig.dateParts[0]}</span>
            <i className="h-px min-w-5 flex-1 bg-foreground/20 max-[900px]:hidden" />
            <span className="ml-2.5">{rtssConfig.dateParts[1]}</span>
            <i className="h-px min-w-5 flex-1 bg-foreground/20 max-[900px]:hidden" />
            <span>{rtssConfig.city}</span>
          </div>
        </div>
      </div>

      <Image
        src={rtssImage('hero-mobile.png')}
        alt="White RTSS lettering layered through a robotic hand on midnight blue"
        fill
        sizes="100vw"
        loading="eager"
        className="absolute inset-0 z-1 hidden h-full w-full object-contain object-bottom max-sm:block"
      />

      <h1 className="sr-only">{rtssConfig.title}</h1>

      <div className="absolute inset-x-5 bottom-7 z-4 hidden items-center justify-center gap-[clamp(16px,5vw,28px)] text-[clamp(24px,7vw,32px)] leading-[1.15] font-bold tracking-[-0.035em] whitespace-nowrap text-foreground max-sm:flex">
        <span>{rtssConfig.dateParts.join('.')}</span>
        <span>{rtssConfig.city}</span>
      </div>
    </header>
  );
}
