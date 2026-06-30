import type { Metadata } from 'next';

import { OG_IMAGES } from '@/lib/metadata';

import LabsContent from './LabsContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Labs',
  description:
    'START Labs: MedTech edition. Build your startup in 8 weeks with real clinical challenges from hospitals and health-tech partners.',
  alternates: { canonical: 'https://www.startmunich.de/labs' },
  openGraph: {
    url: 'https://www.startmunich.de/labs',
    title: 'Labs | START Munich',
    description:
      'START Labs: MedTech edition. Build your startup in 8 weeks with real clinical challenges from hospitals and health-tech partners.',
    images: OG_IMAGES,
  },
};

export default function LabsPage() {
  return <LabsContent />;
}
