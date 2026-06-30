import { NextResponse } from 'next/server';

export const revalidate = 3600;

const LUMA_TIMEOUT_MS = 10_000;

interface LumaEntry {
  event: {
    start_at: string;
    visibility?: string;
  };
}

export async function GET() {
  const lumaApiKey = process.env.LUMA_API_KEY;

  if (!lumaApiKey) {
    console.error('LUMA_API_KEY not configured');
    return NextResponse.json({ error: 'Luma API key not configured' }, { status: 500 });
  }

  try {
    // Get current date for 'after' parameter
    const now = new Date();

    // Get date 12 months from now for 'before' parameter
    const twelveMonthsFromNow = new Date();
    twelveMonthsFromNow.setMonth(now.getMonth() + 12);

    const afterDate = now.toISOString();
    const beforeDate = twelveMonthsFromNow.toISOString();

    const response = await fetch(
      `https://public-api.luma.com/v1/calendar/list-events?calendar_id=cal-1MxD65bgV0Hcb0r&after=${afterDate}&before=${beforeDate}&pagination_limit=50`,
      {
        headers: {
          accept: 'application/json',
          'x-luma-api-key': lumaApiKey,
        },
        signal: AbortSignal.timeout(LUMA_TIMEOUT_MS),
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Luma API error: ${response.status}`, errorText);
      throw new Error(`Luma API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter to only include future, non-private events
    const upcomingEvents = (data.entries || []).filter((entry: LumaEntry) => {
      const eventDate = new Date(entry.event.start_at);
      return eventDate >= now && entry.event.visibility !== 'private';
    });

    if (process.env.LUMA_DEBUG === '1') {
      console.log(
        `[luma:upcoming] range=${afterDate}..${beforeDate} total=${data.entries?.length || 0} filtered=${upcomingEvents.length}`,
      );
    }

    // Return filtered upcoming events
    return NextResponse.json({ ...data, entries: upcomingEvents });
  } catch (error) {
    console.error('Error fetching upcoming events from Luma:', error);
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    return NextResponse.json(
      {
        error: isTimeout ? 'Upstream request to Luma timed out' : 'Failed to fetch upcoming events',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
