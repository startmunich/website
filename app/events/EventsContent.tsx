'use client';

import Link from 'next/link';
import Script from 'next/script';
import React, { useRef, useState } from 'react';

import { EventCard, ScrollIndicator, TimelineMarker } from '@/components/EventComponents';
import Hero from '@/components/Hero';
import HeroCard from '@/components/HeroCard';
import { EVENT_KIND_COLORS, groupMarkersByMonth, monthLabels } from '@/lib/eventCalendar';
import { EVENT_KIND_LABELS, type StartEvent } from '@/lib/eventTypes';
import { useAnimatedNumber } from '@/lib/useAnimatedNumber';

import PastEventsList from './PastEventsList';
import UpcomingEventsList from './UpcomingEventsList';

export const dynamic = 'force-dynamic';

export interface EventsContentProps {
  /** One marker per dated event, positioned by its real start date. */
  markers: Array<{
    eventId: string;
    title: string;
    color: string;
    month: number;
    day: number;
    left: string;
    side: 'top' | 'bottom';
  }>;
  upcomingEvents: StartEvent[];
  pastEvents: StartEvent[];
  /** Events an admin highlighted on the members platform. */
  featuredEvents: StartEvent[];
  stats: { hackathons: number; events: number };
}

/** Local art for a featured card with no cover, so the row never renders a broken image. */
const FALLBACK_COVER = '/events/eventCards/hack-opt.jpg';

export default function EventsContent({
  markers,
  upcomingEvents,
  pastEvents,
  featuredEvents,
  stats,
}: EventsContentProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  // The count-up still animates on mount; there is no loading flag to wait for because the data
  // arrives as props from the server.
  const animatedHackathons = useAnimatedNumber(stats.hackathons, false, 800);
  const animatedEvents = useAnimatedNumber(stats.events, false, 800);

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
      const x = e.currentTarget.ownerDocument.defaultView
        ? e.clientX - sliderRef.current.offsetLeft
        : 0;
      sliderRef.current.scrollLeft =
        dragState.current.scrollLeft - (x - dragState.current.startX) * 2;
    },
    end: () => {
      dragState.current.isDragging = false;
    },
  };

  const months = monthLabels();
  const monthGroups = groupMarkersByMonth(markers);
  const hasMarkers = markers.length > 0;

  /**
   * Only kinds actually present in the data get a legend entry — an "Incubator" swatch for a month
   * with no incubator event was one of the phantom entries the previous version rendered.
   */
  const legendKinds = markers.length
    ? (Object.keys(EVENT_KIND_LABELS) as Array<keyof typeof EVENT_KIND_LABELS>).filter((kind) =>
        markers.some((marker) => marker.color === EVENT_KIND_COLORS[kind]),
      )
    : [];

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
          <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-6">
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

            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent transition lg:text-6xl">
                  {Math.floor(animatedEvents)}
                </span>
                <span className="text-xl font-bold text-[#d0006f] lg:text-3xl">+</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Public Events Yearly
              </p>
            </HeroCard>
          </div>
        </Hero>

        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-20">
          {/* Upcoming Events */}
          <div className="mb-24">
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452h22.225V9H20.45zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
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
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.583-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.069-1.645-.069-4.849 0-3.204.013-3.583.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272 2.273.693 1.924 3.072.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.78 4.358 0 6.78-2.618 6.98-6.78.058-1.28.073-1.689.073-2.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.78zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                    Instagram
                  </span>
                </a>
              </div>
            </div>

            <UpcomingEventsList events={upcomingEvents} />
          </div>

          {/* Annual Calendar */}
          <div>
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d0006f]">
                Annual Calendar
              </span>
              <h2 className="mb-3 mt-2 text-3xl font-black text-white md:text-4xl">
                OUR <span className="outline-text">YEAR</span> IN EVENTS
              </h2>
              <p className="text-lg text-gray-400">
                Every event on our calendar, exactly when it happens.
              </p>
            </div>

            {hasMarkers ? (
              <div className="relative rounded-[1.75rem] border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-sm md:p-10">
                {/* Desktop Timeline */}
                <div className="hidden md:block" data-testid="events-calendar">
                  <div className="mb-6 grid grid-cols-12 gap-2 text-center">
                    {months.map((month) => (
                      <div key={month} className="text-sm text-gray-300">
                        {month}
                      </div>
                    ))}
                  </div>

                  <div className="relative mb-20 mt-16 h-3 rounded-full bg-white/[0.06]">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d0006f]/30 via-pink-500/20 to-[#d0006f]/30"></div>

                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 h-6 w-px -translate-y-1/2 bg-white/20"
                        style={{ left: `calc(${(i + 1) * 8.33}% - 0.5px)` }}
                      ></div>
                    ))}

                    {markers.map((marker) => (
                      <TimelineMarker
                        key={`${marker.eventId}-${marker.month}-${marker.day}`}
                        eventId={marker.eventId}
                        left={marker.left}
                        color={marker.color}
                        label={marker.title}
                        position={marker.side}
                        hoveredEvent={hoveredEvent}
                        onHover={setHoveredEvent}
                        onLeave={() => setHoveredEvent(null)}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 border-t border-white/[0.06] pt-6 md:gap-5">
                    {legendKinds.map((kind) => (
                      <div
                        key={kind}
                        className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5"
                      >
                        <LegendSwatch kind={kind} />
                        <span className="text-xs font-medium text-gray-300">
                          {EVENT_KIND_LABELS[kind]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Timeline */}
                <div className="md:hidden" data-testid="events-calendar-mobile">
                  <div className="space-y-3">
                    {monthGroups.map((group) => (
                      <div
                        key={group.month}
                        className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4"
                      >
                        <div className="w-14 flex-shrink-0 text-sm font-bold text-gray-400">
                          {months[group.month - 1]}
                        </div>
                        <div className="flex flex-col gap-2">
                          {group.markers.map((marker) => (
                            <div key={marker.eventId} className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 flex-shrink-0 rounded-full"
                                style={{ backgroundColor: marker.color }}
                              ></div>
                              <span className="text-sm text-white">{marker.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-white/[0.06] pt-4">
                    {legendKinds.map((kind) => (
                      <div
                        key={kind}
                        className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5"
                      >
                        <LegendSwatch kind={kind} />
                        <span className="text-xs font-medium text-gray-300">
                          {EVENT_KIND_LABELS[kind]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-[1.75rem] border border-white/[0.07] bg-white/[0.03] px-6 py-16 text-center backdrop-blur-sm"
                data-testid="events-calendar-empty"
              >
                <p className="text-lg text-gray-400">
                  The calendar is being updated — check back soon.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Featured events */}
        <div ref={sliderRef} className="mx-auto mb-24 mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="mb-6">
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d0006f]">
                Featured
              </span>
              <h2 className="mb-3 mt-2 text-3xl font-black text-white md:text-4xl">
                DON&apos;T <span className="outline-text">MISS OUT</span>
              </h2>
            </div>

            {featuredEvents.length > 0 ? (
              <>
                <div
                  onMouseDown={handleDrag.start}
                  onMouseUp={handleDrag.end}
                  onMouseMove={handleDrag.move}
                  onMouseLeave={handleDrag.end}
                  className="scrollbar-hide flex cursor-grab select-none gap-6 overflow-x-auto px-1 py-4 active:cursor-grabbing"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  data-testid="events-featured"
                >
                  {featuredEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={{
                        id: event.id,
                        name: event.title,
                        description: event.description ?? '',
                        month: new Date(event.startAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          timeZone: 'UTC',
                        }),
                        image: event.coverImageUrl ?? FALLBACK_COVER,
                        category: EVENT_KIND_LABELS[event.kind],
                      }}
                      index={index}
                      hoveredEvent={hoveredEvent}
                      setHoveredEvent={setHoveredEvent}
                      isFlagship
                      className="h-full"
                      ctaLabel={event.registrationUrl ? 'Register' : undefined}
                      ctaHref={event.registrationUrl ?? undefined}
                    />
                  ))}
                </div>

                <ScrollIndicator sliderRef={sliderRef} />
                <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-16 rounded-r-[1.75rem] bg-gradient-to-l from-[#00002c] to-transparent"></div>
              </>
            ) : (
              <div
                className="rounded-[1.75rem] border border-white/[0.07] bg-white/[0.03] px-6 py-16 text-center backdrop-blur-sm"
                data-testid="events-featured-empty"
              >
                <p className="text-lg text-gray-400">
                  We&apos;re picking the next highlight — check back soon.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Member Exclusive Events Section */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#d0006f]/50 bg-gradient-to-br from-[#1a1a3e] via-[#00002c] to-[#0d0d1f] shadow-2xl shadow-[#d0006f]/20">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d0006f]/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#d0006f]/5 blur-3xl"></div>

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col items-center gap-8 lg:flex-row">
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a2 2 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#d0006f]">
                        Members Only
                      </span>
                    </div>

                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                      HUNGRY FOR MORE?
                    </h2>

                    <p className="mb-6 leading-relaxed text-gray-300">
                      As a START Munich member, you get access to exclusive events including private
                      dinners with successful founders, closed-door workshops with industry experts,
                      peer feedback sessions, and intimate networking gatherings. These events are
                      designed to provide maximum value and foster deep connections within our
                      community.
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-center lg:text-left">
                    <Link
                      href="/members"
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#d0006f] to-pink-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:from-[#d0006f] hover:to-[#d0006f] hover:shadow-2xl hover:shadow-[#d0006f]/50"
                    >
                      <span className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[200%]"></span>
                      <span className="relative">Our Members Journey</span>
                      <svg
                        className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
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

          {/* Past Events */}
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

            <PastEventsList events={pastEvents} />
          </div>
        </div>
      </main>
    </>
  );
}

/**
 * Legend swatch. The colour comes from the same map the markers use, so the legend cannot drift
 * from what the dots actually are.
 */
function LegendSwatch({ kind }: { kind: keyof typeof EVENT_KIND_LABELS }) {
  return (
    <div
      className="h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: EVENT_KIND_COLORS[kind] }}
      data-kind={kind}
    />
  );
}
