import type { Metadata } from 'next';

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

export default function EventsPage() {
  return <EventsContent />;
}
