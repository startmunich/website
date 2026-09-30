import { NextResponse } from 'next/server';

import { getPastEvents } from '@/lib/events';

export const revalidate = 3600;

/**
 * Kept for existing consumers of the old Luma proxy. `/app/events` now renders on the server via
 * `@/lib/events`; this stays as a thin, typed passthrough so nothing that already calls this route
 * breaks. Past events come back most-recent-first.
 */
export async function GET() {
  try {
    const events = await getPastEvents();
    return NextResponse.json({ entries: events });
  } catch (error) {
    console.error('Error fetching past events:', error);
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    return NextResponse.json(
      { error: isTimeout ? 'Upstream event request timed out' : 'Failed to fetch past events' },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
