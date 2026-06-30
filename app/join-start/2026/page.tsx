import type { Metadata } from 'next';

import { OG_IMAGES } from '@/lib/metadata';

import JoinStartClient from './JoinStartClient';

const LAUNCH_DATE = new Date('2026-04-10T00:00:00+02:00').getTime();
const CLOSE_DATE = new Date('2026-04-27T00:00:00+02:00').getTime();

export const metadata: Metadata = {
  title: 'Join START Munich 2026',
  description:
    "Apply to become a START Munich member in 2026. Join Munich's leading student entrepreneurship community at TUM, LMU, and HM.",
  alternates: { canonical: 'https://www.startmunich.de/join-start/2026' },
  openGraph: {
    url: 'https://www.startmunich.de/join-start/2026',
    title: 'Join START Munich 2026',
    description:
      "Apply to become a START Munich member in 2026. Join Munich's leading student entrepreneurship community at TUM, LMU, and HM.",
    images: OG_IMAGES,
  },
};

interface JoinStart2026PageProps {
  searchParams?: Promise<{ beta?: string }>;
}

export default async function JoinStart2026Page({ searchParams }: JoinStart2026PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isBeta = resolvedSearchParams?.beta === 'true';
  const now = Date.now();
  const isClosed = !isBeta && now >= CLOSE_DATE;
  const isLive = !isClosed && (isBeta || now >= LAUNCH_DATE);

  return <JoinStartClient isLive={isLive} isClosed={isClosed} />;
}
