import { NextResponse } from 'next/server';

import { fetchFromPlatform } from '@/lib/startApi';

export const revalidate = 3600;

/**
 * Proxies the members platform's board endpoint. The base URL, bearer key, timeout and ISR window
 * live in `lib/startApi`, shared with members and events — so `MEMBERS_PLATFORM_API_URL` applies to
 * the whole platform rather than only to whichever route happened to read it.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const termStartYears = url.searchParams.get('termStartYears') || '2024,2025';

  if (!process.env.STARTMUNICH_API_KEY) {
    console.error('STARTMUNICH_API_KEY is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const board = await fetchFromPlatform(
    `/api/v1/public/board?termStartYears=${encodeURIComponent(termStartYears)}`,
  );

  if (board === null) {
    return NextResponse.json({ error: 'Failed to fetch board data' }, { status: 502 });
  }

  return NextResponse.json(board);
}
