/**
 * Home page — Server Component
 *
 * Fetches featured partners, spotlight startups and the news carousel from
 * Sanity at request time. Next.js ISR caches the result for 1 hour
 * (`revalidate = 3600`), so the CMS is only hit once per hour across all
 * visitors. The pre-fetched data is passed as props to the sections, which means
 * logos are available on the initial HTML render — no client-side fetch or
 * flash of missing content. Each section is its own component; only the hero
 * crossfade and the scroll-linked news strip are client components.
 */
import type { Metadata } from 'next';

import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { OG_IMAGES } from '@/lib/metadata';
import { getFeaturedPartners, getFeaturedStartups, getNewsItems } from '@/lib/sanityContent';
import { siteLinks } from '@/lib/site';
import type { NewsItem } from '@/lib/types';

import { AboutStartSection } from './home/AboutStartSection';
import { CommunitySection } from './home/CommunitySection';
import { FactsSection } from './home/FactsSection';
import { ApplicationBanner, HomeHero } from './home/HomeHero';
import { NetworkSection } from './home/NetworkSection';
import { NewsSection } from './home/NewsSection';
import { PartnersStrip } from './home/PartnersStrip';

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
    sameAs: [siteLinks.linkedin, siteLinks.instagram],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <EmbedHeightReporter />
      <ApplicationBanner />
      <HomeHero />
      <PartnersStrip partners={partners} />
      <AboutStartSection />
      <FactsSection
        startups={startupResult.featuredStartups}
        startupCount={startupResult.totalStartups}
      />
      <NewsSection news={news satisfies NewsItem[]} />
      <NetworkSection />
      <CommunitySection />
    </>
  );
}
