/**
 * Home page — Server Component
 *
 * Fetches featured partners, spotlight startups and the news carousel from
 * Sanity at request time. Next.js ISR caches the result for 1 hour
 * (`revalidate = 3600`), so the CMS is only hit once per hour across all
 * visitors. The pre-fetched data is passed as props to HomeClient, which means
 * logos are available on the initial HTML render — no client-side fetch or
 * flash of missing content.
 */
import type { Metadata } from 'next';

import { OG_IMAGES } from '@/lib/metadata';
import { getFeaturedPartners, getFeaturedStartups, getNewsItems } from '@/lib/sanityContent';
import type { NewsItem } from '@/lib/types';

import HomeClient from './home/HomeClient';

export const metadata: Metadata = {
  title: 'START Munich – Student Entrepreneurship Community',
  description:
    'START Munich is the largest student-run entrepreneurship community in Munich. We empower the next generation of founders to dare, build, and belong.',
  alternates: { canonical: 'https://www.startmunich.de/' },
  openGraph: {
    url: 'https://www.startmunich.de/',
    title: 'START Munich – Student Entrepreneurship Community',
    description:
      'START Munich is the largest student-run entrepreneurship community in Munich. We empower the next generation of founders to dare, build, and belong.',
    images: OG_IMAGES,
  },
};

// Revalidate the cached page every hour
export const revalidate = 3600;

export default async function HomePage() {
  const [partners, startupResult, news] = await Promise.all([
    getFeaturedPartners(),
    getFeaturedStartups(),
    getNewsItems(),
  ]);

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'START Munich',
    url: 'https://www.startmunich.de',
    logo: 'https://www.startmunich.de/startIcon.png',
    description: 'START Munich is the largest student-run entrepreneurship community in Munich.',
    foundingDate: '2003',
    sameAs: [
      'https://www.linkedin.com/company/start-munich',
      'https://www.instagram.com/startmunich',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomeClient
        initialPartners={partners}
        initialStartups={startupResult.featuredStartups}
        startupCount={startupResult.totalStartups}
        initialNews={news satisfies NewsItem[]}
      />
    </>
  );
}
