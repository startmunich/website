'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/section';
import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const heroImages = [
  '/home/heroBackground/sprint-opt.jpg',
  '/home/heroBackground/isar-opt.jpg',
  '/home/heroBackground/legal-opt.jpg',
  '/home/heroBackground/background2-opt.jpg',
  '/home/heroBackground/background-opt.jpg',
  '/home/heroBackground/background1-opt.jpeg',
  '/home/heroBackground/rtsh-opt.jpeg',
  '/home/heroBackground/background4-opt.png',
];

// Munich-time cutoffs for the 2026 winter application window (now closed)
const APPLICATIONS_OPENED_AT = new Date('2026-10-01T00:00:00+02:00').getTime();
const APPLICATIONS_CLOSED_AT = new Date('2026-10-26T00:00:00+01:00').getTime();

/** Pink ticker above the hero, linking to the application page. */
export function ApplicationBanner() {
  return (
    <Link
      href="/apply"
      className="block overflow-hidden bg-primary py-1.5 transition hover:brightness-110"
    >
      <div className="flex w-max animate-marquee whitespace-nowrap [--marquee-duration:60s]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="mx-8 text-xs tracking-wide text-primary-foreground sm:text-sm">
            Applications for the Winter Semester are now closed. Summer Semester applications open
            in April 2027.
          </span>
        ))}
      </div>
    </Link>
  );
}

/** Full-viewport hero with a crossfading photo background. */
export function HomeHero() {
  const [loaded, setLoaded] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const applicationsOpen = now >= APPLICATIONS_OPENED_AT && now < APPLICATIONS_CLOSED_AT;

  useEffect(() => setLoaded(true), []);

  // Re-check the application window every 30s so the CTA flips live
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  const enter = (delay: string) =>
    cn(
      'transition-all duration-1000',
      delay,
      loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
    );

  return (
    <section className="relative flex h-[calc(100svh-5rem)] w-full items-center overflow-hidden">
      {/* Only render prev/current/next so all eight photos aren't loaded at once */}
      {heroImages.map((src, i) => {
        const isCurrent = heroIdx === i;
        const isNext = (heroIdx + 1) % heroImages.length === i;
        const isPrev = (heroIdx - 1 + heroImages.length) % heroImages.length === i;
        if (!isCurrent && !isNext && !isPrev) return null;
        return (
          <div
            key={src}
            className={cn(
              'absolute inset-0 transition-opacity duration-2000 ease-in-out',
              isCurrent ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="scale-105 object-cover"
            />
          </div>
        );
      })}
      <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

      <div
        aria-hidden
        className="absolute top-20 right-[15%] size-[500px] animate-blob rounded-full bg-primary/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute bottom-20 left-[5%] size-[400px] animate-blob rounded-full bg-primary/10 blur-[100px] animation-delay-2000"
      />
      <div
        aria-hidden
        className="absolute top-[40%] right-[5%] size-[300px] animate-blob rounded-full bg-secondary/40 blur-[80px] animation-delay-4000"
      />

      <Container className="relative">
        <div className="flex max-w-2xl flex-col items-start gap-6">
          <h1
            className={cn(
              'mb-2 text-7xl leading-[0.9] font-black tracking-tight uppercase drop-shadow-lg sm:text-8xl lg:text-9xl',
              enter('delay-200'),
            )}
          >
            <span>Dare.</span>
            <br />
            <span className="text-primary">Build.</span>
            <br />
            <span className="text-outline">Belong.</span>
          </h1>
          <Text variant="lead" className={cn('max-w-lg text-foreground/85', enter('delay-400'))}>
            START Munich is the largest student-run entrepreneurship community in Munich. We empower
            the next generation of founders to dare, build, and belong.
          </Text>
          {applicationsOpen && (
            <ButtonLink href="/join-start/2026" size="lg" className={enter('delay-500')}>
              Apply Now
            </ButtonLink>
          )}
        </div>
      </Container>

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 h-12 w-px -translate-x-1/2 bg-linear-to-b from-foreground/50 to-transparent opacity-50"
      />
    </section>
  );
}
