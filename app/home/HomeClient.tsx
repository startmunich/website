'use client';

/**
 * HomeClient — Client Component
 *
 * Renders the full home page UI. Partner and startup data are received as
 * `initialPartners` / `initialStartups` props that are pre-fetched and cached
 * server-side by the parent `page.tsx` (ISR, 1-hour revalidation). This means
 * no client-side data fetching is needed and logos appear instantly on load.
 */
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { useAnimatedNumber, useInView } from '@/lib/hooks';
import type { NewsItem, Partner, Startup } from '@/lib/types';

// ── Images ──────────────────────────────────────────────────────────────────────

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

// ── Data ────────────────────────────────────────────────────────────────────────

const facts = [
  { label: 'Members', value: 300, suffix: '+' },
  { label: 'Diversity (MINT)', value: 65, suffix: '%' },
  { label: 'Capital Raised', value: 500, suffix: 'M+', prefix: '€' },
  { label: 'Members in YC & other top programs', value: 8, suffix: '+' },
];

// Munich-time cutoffs for the 2026 summer application window
const APPLICATIONS_OPENED_AT = new Date('2026-04-10T00:00:00+02:00').getTime();
const APPLICATIONS_CLOSED_AT = new Date('2026-04-27T00:00:00+02:00').getTime();

// ── Component ───────────────────────────────────────────────────────────────────

interface HomeClientProps {
  initialPartners: Partner[];
  initialStartups: Startup[];
  startupCount: number;
  initialNews: NewsItem[];
}

export default function HomeClient({
  initialPartners,
  initialStartups,
  startupCount,
  initialNews,
}: HomeClientProps) {
  const [loaded, setLoaded] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [brandPartners] = useState<Partner[]>(initialPartners);
  const [featuredStartups] = useState<Startup[]>(initialStartups);
  const [failedPartnerLogos, setFailedPartnerLogos] = useState<Set<string>>(new Set());
  const [failedStartupLogos, setFailedStartupLogos] = useState<Set<string>>(new Set());
  const [newsScrollX, setNewsScrollX] = useState(0);
  const [newsSectionHeight, setNewsSectionHeight] = useState(0);
  const [showAllNews, setShowAllNews] = useState(false);
  const newsSectionRef = useRef<HTMLElement>(null);
  const newsStickyRef = useRef<HTMLDivElement>(null);
  const newsTrackRef = useRef<HTMLDivElement>(null);
  const newsContainerRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => Date.now());
  const applicationsClosed = now >= APPLICATIONS_CLOSED_AT;
  const applicationsOpen = now >= APPLICATIONS_OPENED_AT && !applicationsClosed;
  const factsView = useInView(0.25);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Re-check the application window every 30s so the banner / CTA flip live
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Hero image crossfade
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Desktop news cards: link horizontal movement to natural page scroll.
  // This keeps the interaction while avoiding Safari's page-locking wheel behavior.
  useEffect(() => {
    const section = newsSectionRef.current;
    const sticky = newsStickyRef.current;
    const track = newsTrackRef.current;
    const container = newsContainerRef.current;
    if (!section || !sticky || !track || !container) return;

    let frame = 0;

    const getOverflow = () => Math.max(0, track.scrollWidth - container.clientWidth);

    const updatePosition = () => {
      if (window.innerWidth < 768) {
        setNewsScrollX(0);
        return;
      }

      const overflow = getOverflow();
      if (overflow <= 0) {
        setNewsScrollX(0);
        return;
      }

      const stickyTop = 80;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const start = sectionTop - stickyTop;
      const progress = (window.scrollY - start) / overflow;
      const next = Math.min(overflow, Math.max(0, progress * overflow));

      setNewsScrollX(next);
    };

    const updateMeasurements = () => {
      setNewsSectionHeight(sticky.offsetHeight + getOverflow());
      updatePosition();
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updatePosition();
      });
    };

    const resizeObserver = new ResizeObserver(updateMeasurements);
    resizeObserver.observe(sticky);
    resizeObserver.observe(track);
    resizeObserver.observe(container);

    updateMeasurements();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateMeasurements);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateMeasurements);
    };
  }, [initialNews.length]);

  const animatedValues = [
    useAnimatedNumber(facts[0].value, !factsView.visible, 1800),
    useAnimatedNumber(facts[1].value, !factsView.visible, 1800),
    useAnimatedNumber(facts[2].value, !factsView.visible, 1800),
    useAnimatedNumber(facts[3].value, !factsView.visible, 1800),
  ];
  const animatedCapital = useAnimatedNumber(3, !factsView.visible, 1800);
  const animatedStartups = useAnimatedNumber(startupCount + 30, !factsView.visible, 1800);
  const animatedUnicorn = useAnimatedNumber(1, !factsView.visible, 1200);

  return (
    <>
      <Script id="iframe-height-sender" strategy="afterInteractive">
        {`
          function sendHeight() {
            const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            parent.postMessage({ type: "EMBED_HEIGHT", height: h }, "*");
          }
          window.addEventListener("load", sendHeight);
          const ro = new ResizeObserver(sendHeight);
          ro.observe(document.documentElement);
          document.addEventListener("DOMContentLoaded", sendHeight);
        `}
      </Script>

      <main className="min-h-screen overflow-x-clip bg-brand-dark-blue text-white">
        {/* ═══════════════════════════ APPLICATION BANNER ═══════════════════════════ */}
        <Link
          href="/apply"
          className="block cursor-pointer overflow-hidden bg-brand-pink py-1.5 transition-all hover:brightness-110"
        >
          <div className="animate-scroll-slow whitespace-nowrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="mx-8 text-xs tracking-wide text-white sm:text-sm">
                {applicationsClosed
                  ? 'Summer Applications are now closed. Winter applications will open in October'
                  : 'Summer Applications are open from 10 of April to 26 of April'}
              </span>
            ))}
          </div>
        </Link>

        {/* ═══════════════════════════ HERO — FULLSCREEN CROSSFADE ═══════════════════════════ */}
        <section className="relative flex h-[calc(100vh-5rem)] w-full items-center overflow-hidden">
          {/* Crossfading backgrounds — only render prev/current/next to avoid loading all 8 at once */}
          {heroImages.map((src, i) => {
            const isCurrent = heroIdx === i;
            const isNext = (heroIdx + 1) % heroImages.length === i;
            const isPrev = (heroIdx - 1 + heroImages.length) % heroImages.length === i;
            if (!isCurrent && !isNext && !isPrev) return null;
            return (
              <div
                key={src}
                className="absolute inset-0 transition-opacity ease-in-out"
                style={{ opacity: isCurrent ? 1 : 0, transitionDuration: '2000ms' }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={i === 0}
                  className="scale-[1.05] object-cover"
                />
              </div>
            );
          })}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-blue/90 via-brand-dark-blue/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-transparent to-transparent" />

          {/* Animated decorative blobs */}
          <div className="animate-blob absolute right-[15%] top-20 h-[500px] w-[500px] rounded-full bg-brand-pink/15 blur-[120px]" />
          <div className="animate-blob animation-delay-2000 absolute bottom-20 left-[5%] h-[400px] w-[400px] rounded-full bg-brand-pink/10 blur-[100px]" />
          <div className="animate-blob animation-delay-4000 absolute right-[5%] top-[40%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[80px]" />

          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1
                className={`mb-8 text-7xl font-black leading-[0.9] tracking-tight transition-all delay-200 duration-1000 sm:text-8xl lg:text-9xl ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <span className="text-white drop-shadow-lg">DARE.</span>
                <br />
                <span className="outline-text drop-shadow-lg">BUILD.</span>
                <br />
                <span className="text-white drop-shadow-lg">BELONG.</span>
              </h1>

              <p
                className={`delay-400 mb-6 max-w-lg text-lg leading-relaxed text-gray-200 transition-all duration-1000 sm:text-xl ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                START Munich is the largest student-run entrepreneurship community in Munich. We
                empower the next generation of founders to dare, build, and belong.
              </p>
              {applicationsOpen && (
                <Link
                  href="/join-start/2026"
                  className={`inline-flex items-center justify-center rounded-xl bg-brand-pink px-8 py-3 font-bold text-white transition-all delay-500 duration-1000 hover:shadow-[0_0_30px_rgba(208,0,111,0.4)] ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                  Apply Now
                </Link>
              )}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-50">
            <div className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </section>

        {/* ═══════════════════════════ BACKED BY BRANDS ═══════════════════════════ */}
        <Link href="/partners" className="group block cursor-pointer overflow-hidden">
          <p className="mb-10 text-center text-sm uppercase tracking-[0.2em] text-gray-500 transition-colors group-hover:text-brand-pink">
            Backed by brands like:
          </p>
          <div className="relative">
            <div className="absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-brand-dark-blue to-transparent" />
            <div className="absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-brand-dark-blue to-transparent" />
            <div className="animate-scroll">
              {[...brandPartners, ...brandPartners].map((partner, i) => (
                <div
                  key={`${partner.id}-${i}`}
                  className="mx-9 inline-flex h-[54px] items-center justify-center opacity-80 transition-all duration-200 hover:-translate-y-px hover:opacity-100"
                >
                  {failedPartnerLogos.has(partner.id) ? (
                    <span className="text-base font-bold tracking-tight text-white/70 sm:text-lg">
                      {partner.name}
                    </span>
                  ) : (
                    // Marquee partner logo; variable aspect ratio with auto width.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-[48px] w-auto max-w-[200px] object-contain grayscale"
                      onError={() => {
                        setFailedPartnerLogos((prev) => {
                          if (prev.has(partner.id)) return prev;
                          const next = new Set(prev);
                          next.add(partner.id);
                          return next;
                        });
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* ═══════════════════════════ WHAT IS START? ═══════════════════════════ */}
        <section className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Group Photo */}
            <div className="relative mb-16 h-[300px] overflow-hidden rounded-3xl sm:h-[400px] lg:h-[500px]">
              <Image
                src="/home/Landing_Team_1-opt.jpeg"
                alt="START Munich Community"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/60 via-transparent to-transparent" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Left - Text Content */}
              <div>
                <h2 className="mb-6 text-4xl font-black text-white sm:text-5xl">
                  What is <span className="outline-text">START Munich</span>
                </h2>
                <p className="mb-4 text-lg leading-relaxed text-gray-300">
                  With over 70 active members and 600+ alumni, START Munich is one of Germany’s
                  leading student-run entrepreneurship initiatives. Founded in 2003, our mission is
                  to build
                  <span className="font-semibold">
                    {' '}
                    a community of students who dare to build, innovate, and lead.
                  </span>
                </p>
                <p className="mb-6 text-lg leading-relaxed text-gray-300">
                  At START Munich,{' '}
                  <span className="font-semibold">
                    {' '}
                    aspiring and active entrepreneurs come together{' '}
                  </span>{' '}
                  to connect, collaborate, and grow. Together with our talented members, we host
                  events such as pitch nights and founder talks, connect with industry partners and
                  investors, or run hands-on programs that bridge academia with entrepreneurship.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/about-us"
                    className="rounded-xl bg-brand-pink px-8 py-3 font-bold text-white transition-all hover:shadow-[0_0_30px_rgba(208,0,111,0.4)]"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/events"
                    className="rounded-xl bg-brand-pink px-8 py-3 font-bold text-white transition-all hover:shadow-[0_0_30px_rgba(208,0,111,0.4)]"
                  >
                    See our Events
                  </Link>
                </div>
              </div>

              {/* Right - Stats Grid */}
              <div className="flex flex-col gap-6">
                {/* Academic Excellence Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-brand-pink/30">
                  <div className="mb-3 flex items-center justify-center gap-8">
                    <Image
                      src="/forPartners/Logo_of_the_Technical_University_of_Munich.svg"
                      alt="TUM"
                      width={120}
                      height={40}
                      className="h-10 w-auto opacity-80"
                      unoptimized
                    />
                    <span className="text-2xl font-light text-white/30">×</span>
                    <Image
                      src="/home/LMU_Muenchen_Logo.svg"
                      alt="LMU"
                      width={120}
                      height={40}
                      className="h-10 w-auto opacity-80"
                      unoptimized
                    />
                  </div>
                  <div className="text-center text-sm uppercase tracking-wider text-gray-400">
                    Academic Excellence
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-brand-pink/30">
                    <div className="mb-2 text-4xl font-black text-white sm:text-5xl">
                      70<span className="text-brand-pink">+</span>
                    </div>
                    <div className="text-sm uppercase tracking-wider text-gray-400">
                      Active Members
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-brand-pink/30">
                    <div className="mb-2 text-4xl font-black text-white sm:text-5xl">2003</div>
                    <div className="text-sm uppercase tracking-wider text-gray-400">
                      Founding Year
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-brand-pink/30">
                    <div className="mb-2 text-4xl font-black text-white sm:text-5xl">
                      600<span className="text-brand-pink">+</span>
                    </div>
                    <div className="text-sm uppercase tracking-wider text-gray-400">Alumni</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-brand-pink/30">
                    <div className="mb-2 text-4xl font-black text-white sm:text-5xl">
                      65<span className="text-brand-pink">%</span>
                    </div>
                    <div className="text-sm uppercase tracking-wider text-gray-400">STEM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ FACTS & STARTUPS ═══════════════════════════ */}
        <section
          ref={factsView.ref}
          className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8"
        >
          <div className="relative mx-auto max-w-7xl">
            {/* Section header */}
            <div
              className={`mb-10 transition-all duration-700 ${factsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">
                Our Startups
              </span>
              <h2 className="mt-3 text-5xl font-black text-white sm:text-6xl">THE FACTS</h2>
            </div>

            {/* Facts - Modern asymmetric grid */}
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-12">
              {/* Big featured stat - Capital Raised */}
              <div
                className={`group relative transition-all delay-100 duration-700 md:col-span-7 ${factsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-brand-pink/20 bg-gradient-to-br from-brand-pink/20 via-brand-pink/10 to-transparent p-10 sm:p-14">
                  {/* Decorative corner accent */}
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[80px] bg-brand-pink/10" />
                  <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full border-2 border-brand-pink/20" />

                  <div className="relative">
                    <div className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
                      Capital Raised
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-7xl font-black tabular-nums leading-none text-white sm:text-8xl lg:text-[120px]">
                        €{Math.round(animatedCapital)}
                        <span className="text-brand-pink">B+</span>
                      </span>
                    </div>
                    <p className="mt-6 max-w-sm text-gray-400">
                      Raised by our alumni founders and community startups.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stacked stats */}
              <div className="flex flex-col gap-6 md:col-span-5">
                {/* Startups */}
                <div
                  className={`group relative flex-1 transition-all delay-200 duration-700 ${factsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                  <div className="relative h-full rounded-[1.5rem] border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-brand-pink/30 hover:bg-white/[0.07]">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                          Startups
                        </div>
                        <div className="text-5xl font-black tabular-nums text-white sm:text-6xl">
                          {Math.round(animatedStartups)}
                          <span className="text-brand-pink">+</span>
                        </div>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-pink/10">
                        <svg
                          className="h-7 w-7 text-brand-pink"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two side-by-side stats */}
                <div className="flex gap-6">
                  {/* YC & Top Programs */}
                  <div
                    className={`flex-1 transition-all delay-300 duration-700 ${factsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  >
                    <div className="relative h-full rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-brand-pink/30 hover:bg-white/[0.07]">
                      <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                        YC & other programs
                      </div>
                      <div className="text-4xl font-black tabular-nums text-white sm:text-5xl">
                        {Math.round(animatedValues[3])}
                        <span className="text-brand-pink">+</span>
                      </div>
                      <div className="mt-3 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${i < 4 ? 'bg-brand-pink' : 'bg-white/10'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Unicorn */}
                  <div
                    className={`delay-400 flex-1 transition-all duration-700 ${factsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  >
                    <div className="relative h-full rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-brand-pink/30 hover:bg-white/[0.07]">
                      <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                        Unicorn
                      </div>
                      <div className="text-4xl font-black tabular-nums text-white sm:text-5xl">
                        {Math.round(animatedUnicorn)}
                      </div>
                      <div className="mt-2 flex gap-1">
                        <div className="h-1.5 w-full rounded-full bg-brand-pink" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Startup logos */}
            <div className="relative overflow-hidden">
              <div className="absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-brand-dark-blue to-transparent" />
              <div className="absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-brand-dark-blue to-transparent" />
              <div className="animate-scroll-nonstop">
                {[...featuredStartups, ...featuredStartups].map((startup, i) => (
                  <Link
                    key={`${startup.id}-${i}`}
                    href="/startups"
                    className="mx-6 inline-flex flex-shrink-0 items-center justify-center"
                  >
                    <div className="flex h-20 w-36 items-center justify-center rounded-xl bg-white p-4 transition-all duration-300 hover:scale-105 hover:border-brand-pink/30">
                      {failedStartupLogos.has(startup.id) ? (
                        <span className="text-center text-sm font-bold text-brand-dark-blue">
                          {startup.name}
                        </span>
                      ) : (
                        // Marquee startup logo; variable aspect with max-w/max-h auto sizing.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={startup.logoUrl}
                          alt={startup.name}
                          loading="lazy"
                          className="max-h-10 max-w-[100px] object-contain"
                          onError={() => {
                            setFailedStartupLogos((prev) => {
                              if (prev.has(startup.id)) return prev;
                              const next = new Set(prev);
                              next.add(startup.id);
                              return next;
                            });
                          }}
                        />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/startups"
                className="group inline-flex items-center gap-2 font-medium text-white/70 transition-colors hover:text-brand-pink"
              >
                View all our startups{' '}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ LATEST NEWS ═══════════════════════════ */}
        {/* Desktop: scroll-linked horizontal cards */}
        {/* Mobile: simple stacked cards */}

        {/* ── Desktop: vertical scroll drives the horizontal news strip ── */}
        <section
          ref={newsSectionRef}
          className="relative hidden px-4 sm:px-6 md:block lg:px-8"
          style={newsSectionHeight > 0 ? { height: `${newsSectionHeight}px` } : undefined}
        >
          <div ref={newsStickyRef} className="sticky top-20 mx-auto w-full max-w-7xl py-28">
            {/* Header */}
            <div className="mb-12 flex items-end justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">
                    Stay Updated
                  </span>
                  <h2 className="mt-3 text-5xl font-black text-white sm:text-6xl">LATEST NEWS</h2>
                </div>
                <div className="mb-1 flex items-center gap-3 self-end">
                  <Link
                    href="https://www.linkedin.com/company/start-munich/"
                    target="_blank"
                    rel="noopener"
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 transition-all duration-300 hover:border-brand-pink/50 hover:bg-brand-pink/10"
                  >
                    <svg
                      className="h-4 w-4 text-white transition-colors group-hover:text-brand-pink"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-sm font-medium text-white transition-colors group-hover:text-brand-pink">
                      LinkedIn
                    </span>
                  </Link>
                  <Link
                    href="https://www.instagram.com/start.munich/"
                    target="_blank"
                    rel="noopener"
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 transition-all duration-300 hover:border-brand-pink/50 hover:bg-brand-pink/10"
                  >
                    <svg
                      className="h-4 w-4 text-white transition-colors group-hover:text-brand-pink"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    <span className="text-sm font-medium text-white transition-colors group-hover:text-brand-pink">
                      Instagram
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Horizontally scrolling cards — stays inside max-w-7xl */}
            <div ref={newsContainerRef} className="overflow-hidden">
              <div
                ref={newsTrackRef}
                className="flex w-max gap-6 will-change-transform"
                style={{ transform: `translateX(-${newsScrollX}px)` }}
              >
                {initialNews.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener"
                    className="group relative w-[380px] flex-shrink-0 snap-start"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          sizes="380px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/30 to-purple-900/50" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="mb-1 text-xl font-bold text-white">{item.title}</div>
                        <p className="text-sm text-white/70">{item.description}</p>
                      </div>
                      <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Mobile: simple stacked cards ── */}
        <section className="relative overflow-hidden px-4 py-28 sm:px-6 md:hidden">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">
                    Stay Updated
                  </span>
                  <h2 className="mt-3 text-5xl font-black text-white">LATEST NEWS</h2>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="https://www.linkedin.com/company/start-munich/"
                  target="_blank"
                  rel="noopener"
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 transition-all duration-300 hover:border-brand-pink/50 hover:bg-brand-pink/10"
                >
                  <svg
                    className="h-4 w-4 text-white transition-colors group-hover:text-brand-pink"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-sm font-medium text-white transition-colors group-hover:text-brand-pink">
                    LinkedIn
                  </span>
                </Link>
                <Link
                  href="https://www.instagram.com/start.munich/"
                  target="_blank"
                  rel="noopener"
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 transition-all duration-300 hover:border-brand-pink/50 hover:bg-brand-pink/10"
                >
                  <svg
                    className="h-4 w-4 text-white transition-colors group-hover:text-brand-pink"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span className="text-sm font-medium text-white transition-colors group-hover:text-brand-pink">
                    Instagram
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {(showAllNews ? initialNews : initialNews.slice(0, 3)).map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener"
                  className="group relative"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        unoptimized
                        referrerPolicy="no-referrer"
                        sizes="(max-width: 768px) 86vw, 380px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/30 to-purple-900/50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="mb-1 text-xl font-bold text-white">{item.title}</div>
                      <p className="text-sm text-white/70">{item.description}</p>
                    </div>
                    <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
              {!showAllNews && initialNews.length > 3 && (
                <button
                  onClick={() => setShowAllNews(true)}
                  className="w-full rounded-2xl border border-white/20 py-4 font-medium text-white/70 transition-all duration-300 hover:border-brand-pink/50 hover:text-white"
                >
                  Show more
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ START NETWORK ═══════════════════════════ */}
        <section className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Section header */}
            <div className="mb-10">
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">
                Global Community
              </span>
              <h2 className="mt-3 text-5xl font-black text-white sm:text-6xl">START NETWORK</h2>
            </div>

            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* Left side - Text & Stats */}
              <div className="relative">
                <p className="mb-16 max-w-md text-lg leading-relaxed text-gray-300">
                  We&apos;re a part of the sprawling START Network. This interconnection multiplies
                  our potential across the world, allowing us to draw inspiration from diverse
                  cultures, share insights, and create an ecosystem that nurtures collective
                  progress.
                </p>

                {/* Globe illustration */}
                <div className="absolute -bottom-10 -left-10 h-72 w-72 opacity-15">
                  <svg viewBox="0 0 200 200" className="h-full w-full text-white">
                    {/* Outer circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    {/* Horizontal lines */}
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="80"
                      ry="30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="80"
                      ry="55"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.75"
                    />
                    <line
                      x1="20"
                      y1="100"
                      x2="180"
                      y2="100"
                      stroke="currentColor"
                      strokeWidth="0.75"
                    />
                    {/* Vertical lines */}
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="30"
                      ry="80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="55"
                      ry="80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.75"
                    />
                    <line
                      x1="100"
                      y1="20"
                      x2="100"
                      y2="180"
                      stroke="currentColor"
                      strokeWidth="0.75"
                    />
                  </svg>
                </div>

                {/* Stats */}
                <div className="relative z-10 flex gap-8 sm:gap-16">
                  <div>
                    <div className="text-5xl font-black text-white sm:text-6xl">22</div>
                    <div className="text-sm text-gray-400">Cities</div>
                  </div>
                  <div>
                    <div className="text-5xl font-black text-white sm:text-6xl">17</div>
                    <div className="text-sm text-gray-400">Countries</div>
                  </div>
                  <div>
                    <div className="text-5xl font-black text-white sm:text-6xl">+1800</div>
                    <div className="text-sm text-gray-400">Members</div>
                  </div>
                </div>
              </div>

              {/* Right side - City names rolling */}
              <div className="relative h-[400px] overflow-hidden">
                {/* Fade overlays */}
                <div className="absolute left-0 right-0 top-0 z-10 h-20 bg-gradient-to-b from-brand-dark-blue to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 z-10 h-20 bg-gradient-to-t from-brand-dark-blue to-transparent" />

                <div className="animate-scroll-vertical mt-12 text-right">
                  {[
                    'BERLIN',
                    'BARCELONA',
                    'HAMBURG',
                    'HELSINKI',
                    'LAUSANNE',
                    'LONDON',
                    'LIMA',
                    'LISBON',
                    'MAASTRICHT',
                    'MEXICO CITY',
                    'MILANO',
                    'MUNICH',
                    'PARIS',
                    'NUREMBERG',
                    'QUITO',
                    'SÃO PAULO',
                    'STUTTGART',
                    'VADUZ',
                    'VIENNA',
                    'WARSAW',
                    'ST. GALLEN',
                    'BERLIN',
                    'BARCELONA',
                    'HAMBURG',
                    'HELSINKI',
                    'LAUSANNE',
                    'LONDON',
                    'LIMA',
                    'LISBON',
                    'MAASTRICHT',
                    'MEXICO CITY',
                    'MILANO',
                    'MUNICH',
                    'PARIS',
                    'NUREMBERG',
                    'QUITO',
                    'SÃO PAULO',
                    'STUTTGART',
                    'VADUZ',
                    'VIENNA',
                    'WARSAW',
                    'ST. GALLEN',
                  ].map((city, i) => (
                    <div
                      key={`${city}-${i}`}
                      className={`text-5xl font-black leading-[1.2] sm:text-6xl lg:text-7xl ${
                        city === 'MUNICH' || (i % 21) % 4 === 3
                          ? 'text-brand-pink'
                          : (i % 21) % 4 === 0
                            ? 'bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent'
                            : (i % 21) % 4 === 1
                              ? 'text-white'
                              : 'bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent'
                      }`}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ ABOUT START ═══════════════════════════ */}
        <section className="px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* Left side - Content */}
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">
                  About START Munich
                </span>
                <h2 className="mb-8 mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                  Driven by passion. <span className="outline-text">Built by students.</span>
                </h2>

                <p className="mb-6 text-lg leading-relaxed text-gray-300">
                  START Munich is the largest student-run entrepreneurship initiative in Munich,
                  empowering the next generation of founders through education, networking, and
                  hands-on experience.
                </p>
                <p className="mb-8 text-lg leading-relaxed text-gray-300">
                  We believe in the power of student-driven innovation and provide a platform where
                  bold ideas can become reality.
                </p>

                {/* Tags */}
                <div className="mb-10 flex flex-wrap gap-3">
                  {['Education', 'Community', 'Hands-on experience'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-brand-pink/30 px-5 py-2 text-sm text-white transition-colors hover:bg-brand-pink/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/member-journey"
                  className="group mb-10 inline-flex items-center gap-3 rounded-xl bg-brand-pink px-8 py-4 text-lg font-bold text-white transition-all hover:shadow-[0_0_40px_rgba(208,0,111,0.4)]"
                >
                  <span>Discover How Our Community Is Run</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>

              {/* Right side - Image */}
              <div className="relative">
                <div className="relative h-[500px] overflow-hidden rounded-3xl border-2 border-white/10 lg:h-[600px]">
                  <Image
                    src="/home/good-opt.png"
                    alt="START Munich Event"
                    fill
                    loading="lazy"
                    className="object-cover object-right"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/50 via-transparent to-transparent"></div>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-brand-pink/20 blur-[60px]" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </>
  );
}
