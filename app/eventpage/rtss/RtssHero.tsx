'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { navItems, rtssConfig } from './rtss-data';
import { usePrefersReducedMotion } from './rtss-motion';
import { rtssImage, SplitCta } from './rtss-ui';

const HERO_ALT = 'White RTSS lettering layered through a robotic hand on midnight blue';

const heroBase = { alt: HERO_ALT, fill: true, sizes: '100vw' } as const;

/** The wide crop, for anything 640px and up. */
const { props: desktopHero } = getImageProps({
  ...heroBase,
  src: rtssImage('hero-desktop.png'),
});

/** The portrait crop of the same composition, for phones. */
const { props: mobileHero } = getImageProps({
  ...heroBase,
  src: rtssImage('hero-mobile.png'),
});

/**
 * Opening composition: the midnight stage, the pink brand bar, and the supplied
 * RTSS artwork filling the frame. The artwork carries its own navy background
 * and is set to cover, so it bleeds to every edge and the stage reads as one
 * continuous surface — the only pink is the bar above it. The lettering is baked
 * into the artwork, so the only real headline here is the visually hidden one.
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
      className="relative isolate h-svh max-h-[1100px] min-h-[720px] overflow-hidden bg-brand-navy text-white max-[900px]:min-h-[700px]"
    >
      <nav
        aria-label="Main navigation"
        // On phones the five links need ~376px but only ~296px is available at
        // 320px, so let them wrap to a second row and let the bar grow with
        // them. The old `flex-nowrap` + `overflow-hidden` pair silently clipped
        // "FAQ" off the end instead of showing it.
        className="relative z-10 flex h-[54px] items-center justify-between gap-10 bg-brand-pink px-7 py-1.5 max-sm:h-auto max-sm:min-h-11 max-sm:flex-wrap max-sm:justify-center max-sm:gap-x-[18px] max-sm:gap-y-1 max-sm:px-3 max-sm:py-2"
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
        <div className="flex flex-1 items-center justify-around gap-6 max-sm:w-full max-sm:min-w-0 max-sm:flex-wrap max-sm:justify-center max-sm:gap-x-[18px] max-sm:gap-y-1">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[17px] font-bold whitespace-nowrap underline-offset-4 hover:underline max-sm:py-0 max-sm:text-sm"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="relative z-10 flex items-center justify-end p-6 max-sm:justify-between max-sm:gap-2.5 max-sm:p-4">
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
          <source media="(max-width: 639px)" srcSet={mobileHero.srcSet} />
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
