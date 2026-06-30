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
    // Get current date for 'before' parameter
    const now = new Date();

    // Get date from 18 months ago for 'after' parameter to get recent past events
    const eighteenMonthsAgo = new Date();
    eighteenMonthsAgo.setMonth(now.getMonth() - 18);

    const beforeDate = now.toISOString();
    const afterDate = eighteenMonthsAgo.toISOString();

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

    // Filter to only include past, non-private events
    const pastEvents = (data.entries || []).filter((entry: LumaEntry) => {
      const eventDate = new Date(entry.event.start_at);
      return eventDate < now && entry.event.visibility !== 'private';
    });

    if (process.env.LUMA_DEBUG === '1') {
      console.log(
        `[luma:past] range=${afterDate}..${beforeDate} total=${data.entries?.length || 0} filtered=${pastEvents.length}`,
      );
    }

    // Return filtered past events
    return NextResponse.json({ ...data, entries: pastEvents });
  } catch (error) {
    console.error('Error fetching past events from Luma:', error);
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    return NextResponse.json(
      {
        error: isTimeout ? 'Upstream request to Luma timed out' : 'Failed to fetch past events',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
