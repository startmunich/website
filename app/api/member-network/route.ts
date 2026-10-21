import { NextResponse } from 'next/server';

import { getNetworkCompanies } from '@/lib/sanityContent';

export const revalidate = 3600;

export type { MemberNetworkLogo } from '@/lib/sanityContent';

export async function GET() {
  // `getNetworkCompanies` degrades to an empty list rather than throwing, so
  // this stays a 200 with `[]` when Sanity is unreachable.
  return NextResponse.json(await getNetworkCompanies());
}
