import { NextResponse } from 'next/server';

import { getAllStartups } from '@/lib/sanityContent';

export const revalidate = 3600;

export async function GET() {
  try {
    const companies = await getAllStartups();
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching startups from Sanity:', error);
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    return NextResponse.json(
      {
        error: isTimeout
          ? 'Upstream Sanity request timed out'
          : 'Failed to fetch startups from the CMS',
      },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
