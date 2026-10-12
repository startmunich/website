import 'server-only';

import type { Company, Founder, NewsItem, Partner, Startup } from '@/lib/types';
import { client } from '@/sanity/client';
import {
  FEATURED_PARTNERS_QUERY,
  FEATURED_STARTUPS_QUERY,
  NETWORK_COMPANIES_QUERY,
  NEWS_ITEMS_QUERY,
  PARTNERS_QUERY,
  STARTUP_BY_LEGACY_ID_QUERY,
  STARTUPS_QUERY,
} from '@/sanity/queries';

/**
 * ISR is one hour everywhere, matching the `revalidate = 3600` the routes
 * already export. Data-driven pages also set `dynamic = 'force-dynamic'`, so
 * the route render is per-request and this window only governs how long the
 * upstream fetch is reused.
 */
const REVALIDATE_SECONDS = 3600;

/**
 * Pick a usable URL out of a projected Sanity image field.
 *
 * Sanity image references carry no width, so the CDN serves the original asset.
 * Passing an explicit `?w=` asks for a width-appropriate variant, which keeps
 * the transfer small now that the site no longer routes these through Vercel's
 * image optimiser.
 */
function imageUrl(
  image: { asset?: { url?: string } } | null | undefined,
  width?: number,
): string | undefined {
  const url = image?.asset?.url;
  if (!url) return undefined;
  return width ? `${url}?w=${width}&auto=format` : url;
}

/** Deterministic identicon fallback, replacing the old `ui-avatars.com` calls. */
function fallbackAvatar(name: string, size: number, background: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=${background}&color=fff`;
}

/* --------------------------------------------------------------- startups */

interface StartupProjection {
  _id: string;
  id?: string | null;
  name?: string | null;
  website?: string | null;
  summary?: string | null;
  description?: string | null;
  logoUrl?: { asset?: { url?: string } } | null;
  foundingYear?: number | null;
  category?: string[] | null;
  isSpotlight?: boolean | null;
  isYCombinatorAlumni?: boolean | null;
  isMTZ?: boolean | null;
  isEWOR?: boolean | null;
  companyLinkedin?: string | null;
  milestones?: string | null;
  supportingPrograms?: string | null;
  founder?: {
    name?: string | null;
    role?: string | null;
    batch?: string | null;
    imageUrl?: { asset?: { url?: string } } | null;
    linkedin?: string | null;
  } | null;
}

/**
 * NocoDB stored `traderepublic.com/de-de` without a scheme, and the site
 * rendered it by stripping `https://`. Keep both ends of that behaviour so the
 * displayed host string is unchanged.
 */
function displayWebsite(website: string | null | undefined): string {
  return (website || '').replace(/^https?:\/\//, '');
}

function transformStartup(row: StartupProjection): Company {
  const name = row.name || 'Unnamed Startup';

  const founders: Founder[] = [];
  if (row.founder?.name) {
    founders.push({
      name: row.founder.name,
      role: row.founder.role || 'Founder',
      batch: (row.founder.batch || '').trim(),
      imageUrl:
        imageUrl(row.founder.imageUrl, 160) ?? fallbackAvatar(row.founder.name, 80, '4f46e5'),
      linkedinUrl: row.founder.linkedin || undefined,
    });
  }

  return {
    id: row.id || row._id,
    name,
    website: displayWebsite(row.website),
    summary: row.summary || 'No description available',
    description: row.description || row.summary || 'No description available',
    // The old code fell back to a generated identicon when a logo was missing.
    logoUrl:
      imageUrl(row.logoUrl, 600) ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=300&background=00002c&color=fff&bold=true&font-size=0.4`,
    foundingYear: row.foundingYear ?? new Date().getFullYear(),
    category: row.category?.length ? row.category : ['Other'],
    founders,
    isSpotlight: row.isSpotlight ?? false,
    isYCombinator: row.isYCombinatorAlumni ?? false,
    companyLinkedin: row.companyLinkedin || undefined,
    milestones: row.milestones || undefined,
    supportingPrograms: row.supportingPrograms || undefined,
    isMTZ: row.isMTZ ?? false,
    isEWOR: row.isEWOR ?? false,
  };
}

/**
 * All startups for the directory.
 *
 * Degrades to an empty list when Sanity is unreachable, matching the previous
 * NocoDB behaviour so a preview build still renders.
 */
export async function getAllStartups(): Promise<Company[]> {
  try {
    const rows = await client.fetch<StartupProjection[]>(
      STARTUPS_QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    return (rows || []).map(transformStartup);
  } catch (error) {
    console.error('Error fetching startups from Sanity:', error);
    return [];
  }
}

/** A single startup by its legacy NocoDB id, or null when it no longer exists. */
export async function getStartupById(id: string): Promise<Company | null> {
  try {
    const row = await client.fetch<StartupProjection | null>(
      STARTUP_BY_LEGACY_ID_QUERY,
      { id },
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    return row ? transformStartup(row) : null;
  } catch (error) {
    console.error(`Error fetching startup ${id} from Sanity:`, error);
    return null;
  }
}

/** Home page marquee: spotlight startups plus the total for the counter. */
export async function getFeaturedStartups(): Promise<{
  featuredStartups: Startup[];
  totalStartups: number;
}> {
  try {
    const data = await client.fetch<{
      total?: number;
      startups?: StartupProjection[];
    }>(FEATURED_STARTUPS_QUERY, {}, { next: { revalidate: REVALIDATE_SECONDS } });
    const rows = data?.startups || [];
    return {
      featuredStartups: rows.map((row) => {
        const name = row.name || 'Startup';
        return {
          id: (row.id || row._id) as Startup['id'],
          name,
          logoUrl:
            imageUrl(row.logoUrl, 600) ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=300&background=00002c&color=fff&bold=true&font-size=0.4`,
          isSpotlight: row.isSpotlight ?? false,
          isYCombinator: row.isYCombinatorAlumni ?? false,
          isEWOR: row.isEWOR ?? false,
        };
      }),
      totalStartups: data?.total ?? 0,
    };
  } catch (error) {
    console.error('Error fetching featured startups from Sanity:', error);
    return { featuredStartups: [], totalStartups: 0 };
  }
}

/* --------------------------------------------------------------- partners */

interface PartnerProjection {
  _id: string;
  name?: string | null;
  category?: string | null;
  logoUrl?: { asset?: { url?: string } } | null;
  logoNoBackgroundUrl?: { asset?: { url?: string } } | null;
  isFeatured?: boolean | null;
}

function transformPartner(row: PartnerProjection): Partner {
  const name = row.name || 'Unnamed Partner';
  return {
    // The document id keeps React keys stable across refetches, which the old
    // `String(record.Id ?? record.Name ?? ...)` fallback was doing too.
    id: row._id,
    name,
    category: row.category || 'Other',
    logoUrl: imageUrl(row.logoUrl, 600) ?? fallbackAvatar(name, 300, '4f46e5'),
    featured: row.isFeatured ?? false,
  };
}

export async function getAllPartners(): Promise<Partner[]> {
  try {
    const rows = await client.fetch<PartnerProjection[]>(
      PARTNERS_QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    return (rows || []).map(transformPartner);
  } catch (error) {
    console.error('Error fetching partners from Sanity:', error);
    return [];
  }
}

/**
 * Home page partner strip — featured and visible only.
 *
 * The strip sits on the dark brand background, so it renders the transparent
 * `logoNoBackground` variant and falls back to the main logo when that was
 * never uploaded. This matches the old NocoDB home query, which read
 * `LogoNoBackground` and fell back to a generated identicon.
 */
export async function getFeaturedPartners(): Promise<Partner[]> {
  try {
    const rows = await client.fetch<PartnerProjection[]>(
      FEATURED_PARTNERS_QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    return (rows || []).map((row) => {
      const transparent = imageUrl(row.logoNoBackgroundUrl, 600);
      const base = transformPartner(row);
      return transparent ? { ...base, logoUrl: transparent } : base;
    });
  } catch (error) {
    console.error('Error fetching featured partners from Sanity:', error);
    return [];
  }
}

/* -------------------------------------------------------- network companies */

export interface MemberNetworkLogo {
  id: string;
  name: string;
  type: string;
  logoUrl: string;
}

export async function getNetworkCompanies(): Promise<MemberNetworkLogo[]> {
  try {
    const rows = await client.fetch<
      {
        _id: string;
        name?: string | null;
        type?: string | null;
        logoUrl?: { asset?: { url?: string } } | null;
      }[]
    >(NETWORK_COMPANIES_QUERY, {}, { next: { revalidate: REVALIDATE_SECONDS } });
    return (rows || []).map((row) => ({
      id: row._id,
      name: row.name || 'Company',
      type: row.type || 'Other',
      logoUrl: imageUrl(row.logoUrl, 300) || '',
    }));
  } catch (error) {
    console.error('Error fetching network companies from Sanity:', error);
    return [];
  }
}

/* -------------------------------------------------------------- news items */

export async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const rows = await client.fetch<
      {
        _id: string;
        title?: string | null;
        description?: string | null;
        url?: string | null;
        imageUrl?: { asset?: { url?: string } } | null;
      }[]
    >(NEWS_ITEMS_QUERY, {}, { next: { revalidate: REVALIDATE_SECONDS } });
    return (rows || []).map((row) => ({
      id: row._id,
      title: row.title || '',
      description: row.description || '',
      url: row.url || '',
      imageUrl: imageUrl(row.imageUrl, 800) || '',
    }));
  } catch (error) {
    console.error('Error fetching news items from Sanity:', error);
    return [];
  }
}
