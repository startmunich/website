import type { Metadata } from 'next';

import { CURATED_SERIES } from '@/lib/curatedEventSeries';
import { getPastEventsWithSeeds, getTimelineEvents, getUpcomingEvents } from '@/lib/events';
import { deriveEventSeries, seriesCategories } from '@/lib/eventSeries';
import { OG_IMAGES } from '@/lib/metadata';

import EventsContent from './EventsContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events',
  description:
    "Discover START Munich events — hackathons, pitch competitions, startup labs, info sessions, and more. Connect with Munich's student entrepreneur community.",
  alternates: { canonical: 'https://www.startmunich.de/events' },
  openGraph: {
    url: 'https://www.startmunich.de/events',
    title: 'Events | START Munich',
    description:
      "Discover START Munich events — hackathons, pitch competitions, startup labs, info sessions, and more. Connect with Munich's student entrepreneur community.",
    images: OG_IMAGES,
  },
};

/**
 * Every event section is fetched here, on the server, and handed to the client component as props.
 *
 * Each section degrades to empty rather than throwing — a missing API key or an unreachable
 * upstream must not take the page down (AGENTS.md: degrade to empty, don't crash a preview build).
 */
async function loadEventData() {
  const [timeline, upcoming, past] = await Promise.allSettled([
    getTimelineEvents(),
    getUpcomingEvents(),
    getPastEventsWithSeeds(),
  ]);

  if (timeline.status === 'rejected') {
    console.error('Error loading timeline events:', timeline.reason);
  }
  if (upcoming.status === 'rejected') {
    console.error('Error loading upcoming events:', upcoming.reason);
  }
  if (past.status === 'rejected') {
    console.error('Error loading past events:', past.reason);
  }

  const timelineEvents = timeline.status === 'fulfilled' ? timeline.value : [];
  const derived = deriveEventSeries(timelineEvents);

  const series = derived.length > 0 ? derived : CURATED_SERIES;

  return {
    // Curated fallback: with no event source configured, show the programme rather than a blank
    // timeline. As soon as the calendar sync returns data, the derived series takes over.
    series,
    upcomingEvents: upcoming.status === 'fulfilled' ? upcoming.value : [],
    pastEvents: past.status === 'fulfilled' ? past.value : [],
    stats: {
      // Counted from the programme so the hero numbers move with the calendar rather than being
      // edited by hand every season.
      hackathons: series.filter((event) => event.category === 'Hackathon').length,
      events: series.length,
    },
  };
}

export default async function EventsPage() {
  const { series, upcomingEvents, pastEvents, stats } = await loadEventData();

  return (
    <EventsContent
      series={series}
      categories={seriesCategories(series)}
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
      stats={stats}
    />
  );
}
