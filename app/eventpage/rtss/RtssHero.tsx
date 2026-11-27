'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { Fragment, useRef } from 'react';

import { rtssConfig } from './rtss-data';
import { usePrefersReducedMotion } from './rtss-motion';
import { rtssImage, TicketCta } from './rtss-ui';

const tickerVenue = rtssConfig.venue.replace(' · ', ' ');

const HERO_ALT = 'White RTSS lettering layered through a robotic hand on midnight blue';

const heroBase = {
  alt: HERO_ALT,
  fill: true,
  quality: 100,
  loading: 'eager',
  fetchPriority: 'high',
} as const;

/** The wide crop, for anything 640px and up. */
const { props: desktopHero } = getImageProps({
  ...heroBase,
  src: rtssImage('hero-desktop.png'),
  // Cover can scale the wide artwork beyond the viewport on tall screens.
  sizes: 'max(100vw, 178vh)',
});

/** The portrait crop of the same composition, for phones. */
const { props: mobileHero } = getImageProps({
  ...heroBase,
  src: rtssImage('hero-mobile.png'),
  sizes: '100vw',
});

export default function RtssHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <header
      ref={ref}
      id="top"
      className="relative isolate h-svh max-h-[1100px] min-h-[720px] overflow-hidden bg-brand-navy text-white max-[900px]:min-h-[700px]"
    >
      <div className="relative z-10 overflow-hidden bg-background text-white">
        <span className="sr-only">
          {rtssConfig.title} · {rtssConfig.longDate} · {tickerVenue}
        </span>
        <div
          aria-hidden="true"
          className="flex w-max animate-marquee text-sm font-medium [--marquee-duration:40s] hover:[animation-play-state:paused]"
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex min-w-[100vw] shrink-0 items-center justify-around">
              {[
                rtssConfig.title,
                'Deep Tech Edition',
                rtssConfig.longDate,
                tickerVenue,
                'Pitches, keynotes & panels',
              ].map((text) => (
                <Fragment key={text}>
                  <span className="inline-flex h-8 items-center px-4 whitespace-nowrap">
                    {text}
                  </span>
                  <span className="px-4 text-brand-pink">✦</span>
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-between px-7 py-4 max-sm:px-5">
        <Link href="/" aria-label="START Munich home" className="shrink-0 leading-none">
          <Image
            src={rtssImage('start-munich-white.png')}
            alt="START Munich"
            width={104}
            height={48}
            sizes="104px"
            className="h-auto w-[104px] max-sm:w-[84px]"
          />
        </Link>
        <TicketCta location="header" />
      </div>

      {/* One <picture>, not two <Image>s. With both mounted, every viewport
          downloaded both files: `priority` preloaded the desktop crop on phones
          even though it was `max-sm: hidden`, and the 1.2MB mobile crop was
          fetched on desktops while `display: none`. A <picture> lets the
          browser resolve exactly one source before it requests anything. */}
      <link
        rel="preload"
        as="image"
        href={mobileHero.src}
        imageSrcSet={mobileHero.srcSet}
        imageSizes="100vw"
        media="(max-width: 639px)"
      />
      <motion.div className="absolute inset-0 z-1" style={{ y: reduce ? 0 : y }}>
        <picture>
          <source media="(max-width: 639px)" srcSet={mobileHero.srcSet} sizes="100vw" />
          <img
            {...desktopHero}
            // Restated after the spread so the a11y linter can see it.
            alt={HERO_ALT}
            className="object-contain object-bottom min-[640px]:object-cover"
          />
        </picture>
      </motion.div>

      <h1 className="sr-only">{rtssConfig.title}</h1>

      <div className="absolute inset-x-10 bottom-[38px] z-4 flex items-center justify-between gap-[34px] text-[58px] leading-[1.1] tracking-[-0.055em] whitespace-nowrap text-foreground max-[1100px]:gap-6 max-[1100px]:text-[48px] max-[900px]:inset-x-[30px] max-[900px]:text-[42px] max-sm:hidden">
        <span>{rtssConfig.dateParts[0]}</span>
        <i className="h-px min-w-5 flex-1 bg-foreground/20 max-[900px]:hidden" />
        <span className="ml-2.5">{rtssConfig.dateParts[1]}</span>
        <i className="h-px min-w-5 flex-1 bg-foreground/20 max-[900px]:hidden" />
        <span>{rtssConfig.city}</span>
      </div>

      <div className="absolute inset-x-5 bottom-7 z-4 hidden items-center justify-center gap-[clamp(16px,5vw,28px)] text-[clamp(24px,7vw,32px)] leading-[1.15] font-bold tracking-[-0.035em] whitespace-nowrap text-foreground max-sm:flex">
        <span>{rtssConfig.dateParts.join('.')}</span>
        <span>{rtssConfig.city}</span>
      </div>
    </header>
  );
}
