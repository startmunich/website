'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import React, { useEffect, useRef, useState } from 'react';

import { EventCard, ScrollIndicator, TimelineMarker } from '@/components/EventComponents';
import Hero from '@/components/Hero';
import HeroCard from '@/components/HeroCard';
import { useAnimatedNumber } from '@/lib/useAnimatedNumber';

import PastEventsGrid from './PastEventsGrid';
import UpcomingEventsGrid from './UpcomingEventsGrid';

export const dynamic = 'force-dynamic';

interface RecurringEvent {
  id: string;
  name: string;
  description: string;
  month: string;
  frequency: string;
  image: string;
  category: string;
}

const recurringEvents: RecurringEvent[] = [
  {
    id: 'rtss',
    name: 'Road to START Summit (RTSS)',
    description:
      'Our flagship pitch event where aspiring founders present their startup ideas to a panel of investors, entrepreneurs, and industry experts.',
    month: 'December',
    frequency: 'Once per year',
    image: '/events/eventCards/summit-opt.jpg',
    category: 'Pitch Event',
  },
  {
    id: 'rtsh',
    name: 'Road to START Hack (RTSH)',
    description:
      'An intensive hackathon bringing together developers, designers, and entrepreneurs to build innovative solutions in 24-48 hours.',
    month: 'November',
    frequency: 'Once per year',
    image: '/events/eventCards/hack-opt.jpg',
    category: 'Hackathon',
  },
  {
    id: 'legal-hack',
    name: 'Munich Hacking Legal',
    description:
      'A unique hackathon focused on building legal tech solutions that address real challenges in the legal industry, combining technology with regulatory expertise.',
    month: 'April',
    frequency: 'Once per year',
    image: '/events/eventCards/legal-opt.jpg',
    category: 'Hackathon',
  },
  {
    id: 'start-labs',
    name: 'START Labs',
    description:
      'A hands-on program where students work on real-world challenges from industry partners, developing prototypes and solutions across various tech verticals like GovTech, MedTech, and more.',
    month: 'May',
    frequency: 'Once per year',
    image: '/events/eventCards/labs-opt.jpg',
    category: 'Incubator',
  },
  {
    id: 'info-event',
    name: 'Info Event',
    description:
      'Join us at the start of each semester to learn about START Munich, meet our community, and discover how you can get involved.',
    month: 'October & April',
    frequency: 'Once per semester',
    image: '/events/eventCards/info-opt.jpg',
    category: 'Talk',
  },
  {
    id: 'fail-tales',
    name: 'Founder Fail Tales',
    description:
      'Real stories from real founders about their biggest failures and lessons learned.',
    month: 'October & April',
    frequency: 'Once per semester',
    image: '/events/eventCards/fail-opt.jpg',
    category: 'Talk',
  },
  {
    id: 'pitch-network',
    name: 'PITCH & NETWORK',
    description:
      'Practice your pitch, get feedback from experienced entrepreneurs, and network with fellow founders in an intimate setting.',
    month: 'January & June',
    frequency: 'Once per semester',
    image: '/events/eventCards/pitch-opt.jpg',
    category: 'Pitch Event',
  },
];

export default function EventsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderSectionRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Use animated number hook for statistics (faster animation - 800ms)
  const animatedHackathons = useAnimatedNumber(4, loading, 800);
  const animatedPublicEvents = useAnimatedNumber(10, loading, 800);

  const handleDrag = {
    start: (e: React.MouseEvent) => {
      const slider = sliderRef.current;
      if (!slider) return;
      dragState.current = {
        isDragging: true,
        startX: e.pageX - slider.offsetLeft,
        scrollLeft: slider.scrollLeft,
      };
    },
    move: (e: React.MouseEvent) => {
      if (!dragState.current.isDragging || !sliderRef.current) return;
      e.preventDefault();
      const x = e.pageX - sliderRef.current.offsetLeft;
      sliderRef.current.scrollLeft =
        dragState.current.scrollLeft - (x - dragState.current.startX) * 2;
    },
    end: () => {
      dragState.current.isDragging = false;
    },
  };

  const scrollToEvent = (eventId: string) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector(`[data-event-id="${eventId}"]`) as HTMLElement | null;
    if (!card) return;

    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const sliderWidth = slider.offsetWidth;

    slider.scrollTo({
      left: cardLeft - sliderWidth / 2 + cardWidth / 2,
      behavior: 'smooth',
    });
  };

  const scrollToEventMobile = (eventId: string) => {
    scrollToEvent(eventId);
    sliderSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleTimelineMarkerHover = (eventId: string) => {
    setHoveredEvent(eventId);
    scrollToEvent(eventId);
  };

  const calculateTimelinePosition = (month: number, day: number = 1): string => {
    // month: 1-12, day: 1-20 (assuming 20 days per month for positioning)
    // Each month takes up 8.33% of the timeline (100% / 12)
    // Within a month, each day takes up 8.33% / 20 = 0.4165%
    const monthProgress = (month - 1) / 12; // 0 to 11/12
    const dayProgress = day / 30 / 12; // 0 to 19/20/12
    const totalProgress = (monthProgress + dayProgress) * 100;
    return `${totalProgress.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#00002c] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-2xl font-bold text-white">Loading events...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Script id="iframe-height-sender" strategy="afterInteractive">
        {`
          function sendHeight() {
            const h = Math.max(
              document.documentElement.scrollHeight,
              document.body.scrollHeight
            );
            parent.postMessage({ type: "EMBED_HEIGHT", height: h }, "*");
          }

          window.addEventListener("load", sendHeight);
          const ro = new ResizeObserver(sendHeight);
          ro.observe(document.documentElement);
          document.addEventListener("DOMContentLoaded", sendHeight);
        `}
      </Script>

      <main className="min-h-screen bg-[#00002c]">
        {/* Hero Section */}
        <Hero
          backgroundImage="/events/hero-opt.jpg"
          title={
            <>
              START MUNICH
              <br />
              <span className="outline-text">EVENTS</span>
            </>
          }
          description="Connect, learn, and grow with Munich's most vibrant student entrepreneur community through our curated events"
        >
          {/* Statistics Boxes - Matching Startup Cards Style */}
          <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-6">
            {/** Stat 1 **/}
            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent transition lg:text-6xl">
                  {Math.floor(animatedHackathons)}
                </span>
                <span className="text-xl font-bold text-[#d0006f] lg:text-3xl">+</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Hackathons Yearly
              </p>
            </HeroCard>

            {/** Stat 2 **/}
            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent transition lg:text-6xl">
                  {Math.floor(animatedPublicEvents)}
                </span>
                <span className="text-xl font-bold text-[#d0006f] lg:text-3xl">+</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Public Events Yearly
              </p>
            </HeroCard>
          </div>
        </Hero>

        {/* Content Below Hero */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-20">
          {/* Featured Event Spotlight */}
          <div className="mb-24">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#8eeeff]/30 shadow-2xl shadow-[#00d8ff]/10">
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src="/events/eventCards/europe-embodied-prism.png"
                  alt="Europe Embodied"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="saturate-125 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050814]/95 via-[#06101d]/80 to-[#050814]/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_36%,rgba(142,238,255,0.22),transparent_34%),radial-gradient(circle_at_58%_72%,rgba(255,63,208,0.16),transparent_30%)]" />
              </div>

              {/* Content */}
              <div className="relative flex flex-col items-start gap-8 p-8 md:p-12 lg:flex-row lg:items-center">
                <div className="flex-1">
                  {/* Badges */}
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8eeeff]/45 bg-[#00d8ff]/15 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#8eeeff]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8eeeff]"></span>
                      Upcoming Event
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/60">
                      Robotics Week
                    </span>
                    <span className="rounded-full border border-[#ff3fd0]/25 bg-[#ff3fd0]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#f7b8ea]">
                      22-26 June 2026
                    </span>
                  </div>

                  <h2 className="mb-4 text-3xl font-black leading-tight text-white md:text-5xl">
                    {'// Europe'}
                    <br />
                    <span className="bg-gradient-to-r from-[#8eeeff] via-white to-[#f7b8ea] bg-clip-text text-transparent">
                      Embodied
                    </span>
                  </h2>

                  <p className="mb-6 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
                    A city-wide Robotics Week in Munich bringing students, researchers, founders,
                    and the curious together for physical AI, hackathon tracks, and the ecosystem
                    summit.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href="https://europe-embodied.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-7 py-3.5 font-bold text-[#050814] transition-all duration-300 hover:scale-105 hover:bg-[#dffbff] hover:shadow-xl hover:shadow-[#00d8ff]/30"
                    >
                      <span>Pre-register</span>
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Munich · 22-26 June 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events Calendar Section */}
          <div className="mb-24">
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              {/* Title and description */}
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d0006f]">
                  What&apos;s Next
                </span>
                <h2 className="mb-3 mt-2 text-3xl font-black text-white md:text-4xl">
                  UPCOMING EVENTS
                </h2>
                <p className="max-w-lg text-lg text-gray-400">
                  Stay updated with all our latest events and register to join us.
                </p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/start-munich"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 transition-all duration-300 hover:border-[#0077b5]/50 hover:bg-[#0077b5]/15 hover:shadow-lg hover:shadow-[#0077b5]/10"
                >
                  <svg
                    className="h-[18px] w-[18px] text-[#0077b5] transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                    LinkedIn
                  </span>
                </a>
                <a
                  href="https://www.instagram.com/start_munich"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 transition-all duration-300 hover:border-[#E1306C]/50 hover:bg-[#E1306C]/15 hover:shadow-lg hover:shadow-[#E1306C]/10"
                >
                  <svg
                    className="h-[18px] w-[18px] text-[#E1306C] transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                    Instagram
                  </span>
                </a>
              </div>
            </div>

            <UpcomingEventsGrid />
          </div>

          {/* Recurring Events Section */}
          <div>
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d0006f]">
                Annual Calendar
              </span>
              <h2 className="mb-3 mt-2 text-3xl font-black text-white md:text-4xl">
                OUR <span className="outline-text">RECURRING</span> EVENTS
              </h2>
              <p className="text-lg text-gray-400">
                Mark your calendars. These flagship events happen every year.
              </p>
            </div>

            {/* Timeline Visualization */}
            <div className="relative rounded-[1.75rem] border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-sm md:p-10">
              {/* Desktop Timeline */}
              <div className="hidden md:block">
                {/* Months */}
                <div className="mb-6 grid grid-cols-12 gap-2 text-center">
                  {[
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ].map((month) => (
                    <div key={month} className="text-sm text-gray-300">
                      {month}
                    </div>
                  ))}
                </div>

                {/* Timeline Line */}
                <div className="relative mb-20 mt-16 h-3 rounded-full bg-white/[0.06]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d0006f]/30 via-pink-500/20 to-[#d0006f]/30"></div>

                  {/* Month Dividers */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 h-6 w-px -translate-y-1/2 bg-white/20"
                      style={{
                        left: `calc(${(i + 1) * 8.33}% - 0.5px)`,
                      }}
                    ></div>
                  ))}

                  {/* Event Markers - Using TimelineMarker Components */}
                  <TimelineMarker
                    eventId="pitch-network"
                    left={calculateTimelinePosition(1, 15)}
                    color="#ff1744"
                    label="Pitch & Network"
                    position="top"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />

                  <TimelineMarker
                    eventId="legal-hack"
                    left={calculateTimelinePosition(4, 5)}
                    color="#9c27b0"
                    label="Legal Hack"
                    position="bottom"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />

                  <TimelineMarker
                    eventId="info-event"
                    left={calculateTimelinePosition(4, 15)}
                    color="#4a90e2"
                    label="Info Event"
                    position="top"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />

                  <TimelineMarker
                    eventId="fail-tales"
                    left={calculateTimelinePosition(4, 25)}
                    color="#4a90e2"
                    label="Fail Tales"
                    position="bottom"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />

                  <TimelineMarker
                    eventId="start-labs"
                    left={calculateTimelinePosition(5, 1)}
                    color="#ff9800"
                    label="START Labs"
                    position="top"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />

                  <TimelineMarker
                    eventId="pitch-network"
                    left={calculateTimelinePosition(6, 15)}
                    color="#ff1744"
                    label="Pitch & Network"
                    position="bottom"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />

                  <TimelineMarker
                    eventId="info-event"
                    left={calculateTimelinePosition(10, 15)}
                    color="#4a90e2"
                    label="Info Event"
                    position="top"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />

                  <TimelineMarker
                    eventId="fail-tales"
                    left={calculateTimelinePosition(11, 15)}
                    color="#4a90e2"
                    label="Fail Tales"
                    position="bottom"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />

                  <TimelineMarker
                    eventId="rtsh"
                    left={calculateTimelinePosition(11, 29)}
                    color="#9c27b0"
                    label="RTSH 🚀"
                    position="top"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />

                  <TimelineMarker
                    eventId="rtss"
                    left={calculateTimelinePosition(12, 9)}
                    color="#ff1744"
                    label="RTSS 🚀"
                    position="bottom"
                    hoveredEvent={hoveredEvent}
                    onHover={handleTimelineMarkerHover}
                    onLeave={() => setHoveredEvent(null)}
                  />
                </div>

                {/* Desktop Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 border-t border-white/[0.06] pt-6 md:gap-5">
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff1744]"></div>
                    <span className="text-xs font-medium text-gray-300">Pitch Events</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#9c27b0]"></div>
                    <span className="text-xs font-medium text-gray-300">Hackathons</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff9800]"></div>
                    <span className="text-xs font-medium text-gray-300">Incubator</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#4a90e2]"></div>
                    <span className="text-xs font-medium text-gray-300">Talks</span>
                  </div>
                </div>
              </div>

              {/* Mobile Timeline - Simplified List View */}
              <div className="md:hidden">
                <div className="space-y-3">
                  <div className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4">
                    <div className="w-14 flex-shrink-0 text-sm font-bold text-gray-400">Jan</div>
                    <button
                      onClick={() => scrollToEventMobile('pitch-network')}
                      className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                      <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#ff1744]"></div>
                      <span className="text-sm text-white">Pitch & Network</span>
                    </button>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4">
                    <div className="w-14 flex-shrink-0 text-sm font-bold text-gray-400">Apr</div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => scrollToEventMobile('legal-hack')}
                        className="flex items-center gap-2 transition-opacity hover:opacity-80"
                      >
                        <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#9c27b0]"></div>
                        <span className="text-sm text-white">Legal Hack</span>
                      </button>
                      <button
                        onClick={() => scrollToEventMobile('info-event')}
                        className="flex items-center gap-2 transition-opacity hover:opacity-80"
                      >
                        <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#4a90e2]"></div>
                        <span className="text-sm text-white">Info Event</span>
                      </button>
                      <button
                        onClick={() => scrollToEventMobile('fail-tales')}
                        className="flex items-center gap-2 transition-opacity hover:opacity-80"
                      >
                        <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#4a90e2]"></div>
                        <span className="text-sm text-white">Fail Tales</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4">
                    <div className="w-14 flex-shrink-0 text-sm font-bold text-gray-400">May</div>
                    <button
                      onClick={() => scrollToEventMobile('start-labs')}
                      className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                      <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#ff9800]"></div>
                      <span className="text-sm text-white">START Labs</span>
                    </button>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4">
                    <div className="w-14 flex-shrink-0 text-sm font-bold text-gray-400">Jun</div>
                    <button
                      onClick={() => scrollToEventMobile('pitch-network')}
                      className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                      <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#ff1744]"></div>
                      <span className="text-sm text-white">Pitch & Network</span>
                    </button>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4">
                    <div className="w-14 flex-shrink-0 text-sm font-bold text-gray-400">Oct</div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => scrollToEventMobile('info-event')}
                        className="flex items-center gap-2 transition-opacity hover:opacity-80"
                      >
                        <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#4a90e2]"></div>
                        <span className="text-sm text-white">Info Event</span>
                      </button>
                      <button
                        onClick={() => scrollToEventMobile('fail-tales')}
                        className="flex items-center gap-2 transition-opacity hover:opacity-80"
                      >
                        <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#4a90e2]"></div>
                        <span className="text-sm text-white">Fail Tales</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4">
                    <div className="w-14 flex-shrink-0 text-sm font-bold text-gray-400">Nov</div>
                    <button
                      onClick={() => scrollToEventMobile('rtsh')}
                      className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                      <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#9c27b0]"></div>
                      <span className="text-sm text-white">Road to START Hack 🚀</span>
                    </button>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4">
                    <div className="w-14 flex-shrink-0 text-sm font-bold text-gray-400">Dec</div>
                    <button
                      onClick={() => scrollToEventMobile('rtss')}
                      className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                      <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#ff1744]"></div>
                      <span className="text-sm text-white">RTSS 🚀</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Legend */}
                <div className="mt-6 flex flex-wrap gap-3 border-t border-white/[0.06] pt-4">
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff1744]"></div>
                    <span className="text-xs font-medium text-gray-300">Pitch Events</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#9c27b0]"></div>
                    <span className="text-xs font-medium text-gray-300">Hackathons</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff9800]"></div>
                    <span className="text-xs font-medium text-gray-300">Incubator</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#4a90e2]"></div>
                    <span className="text-xs font-medium text-gray-300">Talks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Slider */}
        <div ref={sliderSectionRef} className="mx-auto mb-24 mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div
              ref={sliderRef}
              onMouseDown={handleDrag.start}
              onMouseUp={handleDrag.end}
              onMouseMove={handleDrag.move}
              onMouseLeave={handleDrag.end}
              className="scrollbar-hide flex cursor-grab select-none gap-6 overflow-x-auto px-1 py-4 active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Main Events Group */}
              <div className="flex flex-shrink-0 flex-col gap-3 self-stretch">
                <span className="px-1 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Main Events
                </span>
                <div className="flex flex-1 gap-6">
                  {recurringEvents
                    .filter((e) => ['rtss', 'rtsh', 'legal-hack', 'start-labs'].includes(e.id))
                    .map((event, index) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        index={index}
                        hoveredEvent={hoveredEvent}
                        setHoveredEvent={setHoveredEvent}
                        isFlagship={true}
                        className="h-full"
                        onClick={
                          event.id === 'legal-hack'
                            ? () => window.open('https://www.hacking-legal.org/', '_blank')
                            : event.id === 'rtsh'
                              ? () => router.push('/eventpage/rtsh')
                              : event.id === 'rtss'
                                ? () => router.push('/eventpage/rtss')
                                : event.id === 'start-labs'
                                  ? () => window.open('https://www.startmunich.de/labs', '_blank')
                                  : undefined
                        }
                      />
                    ))}
                </div>
              </div>

              {/* Divider */}
              <div className="flex flex-shrink-0 flex-col justify-end self-stretch pb-4">
                <div className="mt-7 w-px flex-1 rounded-full bg-white/10"></div>
              </div>

              {/* Side Events Group */}
              <div className="flex flex-shrink-0 flex-col gap-3 self-stretch">
                <span className="px-1 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Side Events
                </span>
                <div className="flex flex-1 gap-6">
                  {recurringEvents
                    .filter((e) => !['rtss', 'rtsh', 'legal-hack', 'start-labs'].includes(e.id))
                    .map((event, index) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        index={index}
                        hoveredEvent={hoveredEvent}
                        setHoveredEvent={setHoveredEvent}
                        isFlagship={false}
                        className="h-full"
                        onClick={undefined}
                      />
                    ))}
                </div>
              </div>
            </div>

            <ScrollIndicator sliderRef={sliderRef} />

            {/* Gradient Fade Edges */}
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-16 rounded-r-[1.75rem] bg-gradient-to-l from-[#00002c] to-transparent"></div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Member Exclusive Events Section */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#d0006f]/50 bg-gradient-to-br from-[#1a1a3e] via-[#00002c] to-[#0d0d1f] shadow-2xl shadow-[#d0006f]/20">
              {/* Decorative Elements */}
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d0006f]/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#d0006f]/5 blur-3xl"></div>

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col items-center gap-8 lg:flex-row">
                  {/* Left Side - Content */}
                  <div className="flex-1">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d0006f]/40 bg-[#d0006f]/20 px-3 py-1.5">
                      <svg
                        className="h-4 w-4 text-[#d0006f]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#d0006f]">
                        Members Only
                      </span>
                    </div>

                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                      HUNGRY FOR MORE?
                      {/* Exclusive Member Events */}
                    </h2>

                    <p className="mb-6 leading-relaxed text-gray-300">
                      As a START Munich member, you get access to exclusive events including private
                      dinners with successful founders, closed-door workshops with industry experts,
                      peer feedback sessions, and intimate networking gatherings. These events are
                      designed to provide maximum value and foster deep connections within our
                      community.
                    </p>
                  </div>

                  {/* Right Side - CTA */}
                  <div className="flex-shrink-0 text-center lg:text-left">
                    <Link
                      href="/members"
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#d0006f] to-pink-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:from-[#d0006f] hover:to-[#d0006f] hover:shadow-2xl hover:shadow-[#d0006f]/50"
                    >
                      <span className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[200%]"></span>
                      <span className="relative">Our Members Journey</span>
                      <svg
                        className="relative h-5 w-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Past Events Calendar Section */}
          <div className="pb-24">
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d0006f]">
                Looking Back
              </span>
              <h2 className="mb-1 mt-2 text-3xl font-black text-white md:text-4xl">PAST EVENTS</h2>
              <p className="max-w-lg text-lg text-gray-400">
                Check out the amazing events we&apos;ve hosted in the past.
              </p>
            </div>

            <PastEventsGrid />
          </div>
        </div>
      </main>
    </>
  );
}
