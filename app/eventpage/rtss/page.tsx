import type { Metadata } from 'next';

import RtssContent from './RtssContent';

const OG_IMAGE = {
  url: '/eventpage/rtss/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Road to START Summit — 9 December 2026 at Freiheitshalle, Munich',
};

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
    images: [OG_IMAGE],
  },
  // The root layout points Twitter at the site logo; this page needs its own card
  // or the share preview falls back to the logo instead of the event artwork.
  twitter: {
    card: 'summary_large_image',
    title: 'Road to START Summit | START Munich',
    description:
      "START Munich's DeepTech pitching competition. 9 December 2026 at Freiheitshalle, Munich.",
    images: [OG_IMAGE.url],
  },
};

export default function RtssPage() {
  return <RtssContent />;
}
