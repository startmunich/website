import type { Metadata } from 'next';

import { OG_IMAGES } from '@/lib/metadata';

import AboutUsContent from './AboutUsContent';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "Meet the team behind START Munich. Learn about our mission, vision, and the passionate students driving Munich's leading entrepreneurship community since 2003.",
  alternates: { canonical: 'https://www.startmunich.de/about-us' },
  openGraph: {
    url: 'https://www.startmunich.de/about-us',
    title: 'About Us | START Munich',
    description:
      "Meet the team behind START Munich. Learn about our mission, vision, and the passionate students driving Munich's leading entrepreneurship community since 2003.",
    images: OG_IMAGES,
  },
};

export default function AboutUsPage() {
  return <AboutUsContent />;
}
