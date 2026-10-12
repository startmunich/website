/**
 * The single Sanity entry point for the website.
 *
 * Reads the public `production` dataset through the CDN — the content the site
 * renders (startups, partners, network companies, news) is all public, so no
 * server token is involved and nothing sensitive lives here.
 *
 * `import 'server-only'` keeps this out of the client bundle: the GROQ queries
 * in `sanity/queries.ts` are server-side data fetching, and the client components
 * receive already-normalised props.
 */
import 'server-only';

import { createClient } from 'next-sanity';

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'j77hk8qc';
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

/**
 * Dated API version — an undated `vX` can change behaviour under you.
 * Must stay in sync with `sanity/queries.ts` and the CMS `sanity.cli.ts`.
 */
export const SANITY_API_VERSION = '2025-02-19';

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});
