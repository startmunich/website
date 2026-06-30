/**
 * Home page — Server Component
 *
 * Fetches featured partners and startups directly from NocoDB at request time.
 * Next.js ISR caches the result for 1 hour (`revalidate = 3600`), so the
 * database is only hit once per hour across all visitors. The pre-fetched data
 * is passed as props to HomeClient, which means logos are available on the
 * initial HTML render — no client-side fetch or flash of missing content.
 */
import type { Metadata } from 'next';

import { OG_IMAGES } from '@/lib/metadata';
import type { NewsItem, Partner, Startup } from '@/lib/types';

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

const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN;
const NOCODB_BASE_URL = process.env.NOCODB_BASE_URL || 'https://ndb.startmunich.de';
const NOCODB_PARTNERS_TABLE_ID = process.env.NOCODB_PARTNERS_TABLE_ID;
const NOCODB_STARTUPS_TABLE_ID = process.env.NOCODB_STARTUPS_TABLE_ID;
const NOCODB_NEWS_TABLE_ID = process.env.NOCODB_NEWS_TABLE_ID;

const isYes = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase() === 'yes';

type StartupFetchResult = {
  featuredStartups: Startup[];
  totalStartups: number;
};

interface NocoDBAttachment {
  signedPath?: string;
}

interface PartnerRecord {
  Id?: number | string;
  Name?: string;
  Categrory?: string;
  Show?: boolean | number | string;
  Featured?: boolean | number | string;
  LogoNoBackground?: NocoDBAttachment[];
}

interface StartupRecord {
  Id?: number | string;
  id?: number | string;
  'Startup Name'?: string;
  'Featured Startup'?: unknown;
  'Y Combinator Alumni'?: unknown;
  EWOR?: unknown;
  'Company Logo'?: NocoDBAttachment[];
}

interface NewsRecord {
  Id?: number | string;
  id?: number | string;
  Title?: string;
  Desciption?: string;
  Description?: string;
  URL?: string;
  Url?: string;
  Order?: number;
  Image?: NocoDBAttachment[];
}

async function fetchFeaturedPartners(): Promise<Partner[]> {
  if (!NOCODB_API_TOKEN || !NOCODB_PARTNERS_TABLE_ID) return [];
  try {
    const res = await fetch(
      `${NOCODB_BASE_URL}/api/v2/tables/${NOCODB_PARTNERS_TABLE_ID}/records?limit=1000`,
      {
        headers: { 'xc-token': NOCODB_API_TOKEN, 'Content-Type': 'application/json' },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.list || [])
      .filter((r: PartnerRecord) => {
        const show = r.Show;
        const featured = r.Featured;
        return (
          (show === true || show === 1 || String(show).toLowerCase() === 'true') &&
          (featured === true || featured === 1 || String(featured).toLowerCase() === 'true')
        );
      })
      .map((r: PartnerRecord) => {
        const logos: NocoDBAttachment[] = r.LogoNoBackground || [];
        const logo = logos.length > 0 ? logos[logos.length - 1] : null;
        const logoUrl = logo?.signedPath
          ? `${NOCODB_BASE_URL}/${logo.signedPath}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.Name || 'Partner')}&size=300&background=4f46e5&color=fff&bold=true&font-size=0.4`;
        return {
          id: r.Id || String(Math.random()),
          name: r.Name || 'Partner',
          category: r.Categrory || 'Other',
          logoUrl,
          featured: true,
        };
      });
  } catch {
    return [];
  }
}

async function fetchFeaturedStartups(): Promise<StartupFetchResult> {
  if (!NOCODB_API_TOKEN || !NOCODB_STARTUPS_TABLE_ID) {
    return { featuredStartups: [], totalStartups: 0 };
  }
  try {
    const res = await fetch(
      `${NOCODB_BASE_URL}/api/v2/tables/${NOCODB_STARTUPS_TABLE_ID}/records?limit=1000`,
      {
        headers: { 'xc-token': NOCODB_API_TOKEN, 'Content-Type': 'application/json' },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return { featuredStartups: [], totalStartups: 0 };
    const data = await res.json();
    const startups = data.list || [];
    const featuredStartups = startups
      .filter(
        (r: StartupRecord) =>
          isYes(r['Featured Startup']) || isYes(r['Y Combinator Alumni']) || isYes(r['EWOR']),
      )
      .map((r: StartupRecord) => {
        let logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(r['Startup Name'] || 'Startup')}&size=300&background=00002c&color=fff&bold=true&font-size=0.4`;
        if (r['Company Logo']?.[0]?.signedPath)
          logoUrl = `${NOCODB_BASE_URL}/${r['Company Logo'][0].signedPath}`;
        return {
          id: r.Id || r.id,
          name: r['Startup Name'] || 'Startup',
          logoUrl,
          isSpotlight: isYes(r['Featured Startup']),
          isYCombinator: isYes(r['Y Combinator Alumni']),
          isEWOR: isYes(r['EWOR']),
        };
      });
    return { featuredStartups, totalStartups: startups.length };
  } catch {
    return { featuredStartups: [], totalStartups: 0 };
  }
}

async function fetchNews(): Promise<NewsItem[]> {
  if (!NOCODB_API_TOKEN || !NOCODB_NEWS_TABLE_ID) return [];
  try {
    const res = await fetch(
      `${NOCODB_BASE_URL}/api/v2/tables/${NOCODB_NEWS_TABLE_ID}/records?limit=100`,
      {
        headers: { 'xc-token': NOCODB_API_TOKEN, 'Content-Type': 'application/json' },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.list || [])
      .sort((a: NewsRecord, b: NewsRecord) => (a.Order ?? Infinity) - (b.Order ?? Infinity))
      .map((r: NewsRecord) => {
        let imageUrl = '';
        if (r.Image && Array.isArray(r.Image) && r.Image[0]?.signedPath) {
          imageUrl = `${NOCODB_BASE_URL}/${r.Image[0].signedPath}`;
        }
        return {
          id: r.Id || r.id || String(Math.random()),
          title: r.Title || '',
          description: r.Desciption || r.Description || '',
          url: r.URL || r.Url || '',
          imageUrl,
        };
      });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [partners, startupResult, news] = await Promise.all([
    fetchFeaturedPartners(),
    fetchFeaturedStartups(),
    fetchNews(),
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
        initialNews={news}
      />
    </>
  );
}
