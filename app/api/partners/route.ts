import { NextResponse } from 'next/server';

import { getAllPartners } from '@/lib/sanityContent';

export const revalidate = 3600;

export async function GET() {
  const partners = await getAllPartners();

  // `getAllPartners` already degrades to an empty list when Sanity is
  // unreachable, so an empty array here means "configured but no partners".
  // The old route signalled a missing NocoDB config with a 500; keep the shape
  // so existing consumers still see a JSON array on success.
  return NextResponse.json(partners);
}
