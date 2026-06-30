import { NextResponse } from 'next/server';

import { getAllStartups } from '@/lib/startups';

export const revalidate = 3600;

export async function GET() {
  try {
    const companies = await getAllStartups();
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching from NocoDB:', error);
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    return NextResponse.json(
      {
        error: isTimeout
          ? 'Upstream NocoDB request timed out'
          : 'Failed to fetch startups from database',
      },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
