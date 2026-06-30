import type { Metadata } from 'next';

import { OG_IMAGES } from '@/lib/metadata';

import MembersContent from './MembersContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Members',
  description:
    'Meet START Munich members — 70+ active members and 600+ alumni from TUM, LMU, and HM building the companies of tomorrow.',
  alternates: { canonical: 'https://www.startmunich.de/members' },
  openGraph: {
    url: 'https://www.startmunich.de/members',
    title: 'Members | START Munich',
    description:
      'Meet START Munich members — 70+ active members and 600+ alumni from TUM, LMU, and HM building the companies of tomorrow.',
    images: OG_IMAGES,
  },
};

export default function MembersPage() {
  return <MembersContent />;
}
