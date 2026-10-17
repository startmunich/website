import type { Metadata } from 'next';

import { OG_IMAGES } from '@/lib/metadata';

import RtssContent from './RtssContent';

export const metadata: Metadata = {
  title: 'Road to START Summit',
  description:
    "START Munich's DeepTech pitching competition. Join 300+ founders, investors and students at Freiheitshalle, Munich on 9 December 2026 — apply as a startup or join the waitlist.",
  alternates: { canonical: 'https://www.startmunich.de/eventpage/rtss' },
  openGraph: {
    url: 'https://www.startmunich.de/eventpage/rtss',
    title: 'Road to START Summit | START Munich',
    description:
      "START Munich's DeepTech pitching competition. 9 December 2026 at Freiheitshalle, Munich.",
    images: OG_IMAGES,
  },
};

export default function RtssPage() {
  return <RtssContent />;
}
