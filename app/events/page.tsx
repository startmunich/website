import type { Metadata } from 'next';

import { buildCalendarMarkers, yearlyStats } from '@/lib/eventCalendar';
import {
  getCalendarEvents,
  getFeaturedEvents,
  getPastEvents,
  getUpcomingEvents,
} from '@/lib/events';
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
 * Everything the page needs is fetched here, on the server, and passed down as props.
 *
 * Each source degrades to empty rather than throwing: a missing API key or an unreachable upstream
 * must not take the page down (AGENTS.md: degrade to empty, don't crash a preview build). An empty
 * section renders its own "coming soon" state rather than a blank box.
 */
async function loadEventData() {
  const [calendar, upcoming, past, featured] = await Promise.allSettled([
    getCalendarEvents(),
    getUpcomingEvents(),
    getPastEvents(),
    getFeaturedEvents(),
  ]);

  for (const [label, result] of [
    ['calendar', calendar],
    ['upcoming', upcoming],
    ['past', past],
    ['featured', featured],
  ] as const) {
    if (result.status === 'rejected') {
      console.error(`Error loading ${label} events:`, result.reason);
    }
  }

  const calendarEvents = calendar.status === 'fulfilled' ? calendar.value : [];
  const upcomingEvents = upcoming.status === 'fulfilled' ? upcoming.value : [];
  const pastEvents = past.status === 'fulfilled' ? past.value : [];
  const featuredEvents = featured.status === 'fulfilled' ? featured.value : [];

  return {
    markers: buildCalendarMarkers(calendarEvents),
    upcomingEvents,
    pastEvents,
    featuredEvents,
    stats: yearlyStats(calendarEvents),
  };
}

export default async function EventsPage() {
  const { markers, upcomingEvents, pastEvents, featuredEvents, stats } = await loadEventData();

  return (
    <EventsContent
      markers={markers}
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
      featuredEvents={featuredEvents}
      stats={stats}
    />
  );
}
