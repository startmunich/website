import { NextResponse } from 'next/server';

export const revalidate = 3600;

const BOARD_TIMEOUT_MS = 10_000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const termStartYears = url.searchParams.get('termStartYears') || '2024,2025';

  const API_KEY = process.env.STARTMUNICH_API_KEY;
  if (!API_KEY) {
    console.error('STARTMUNICH_API_KEY is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://my.startmunich.de/api/v1/public/board?termStartYears=${encodeURIComponent(termStartYears)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        signal: AbortSignal.timeout(BOARD_TIMEOUT_MS),
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Board API fetch error', response.status, response.statusText, errorText);
      return NextResponse.json({ error: 'Failed to fetch board data' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching board data', error);
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    return NextResponse.json(
      { error: isTimeout ? 'Upstream board API timed out' : 'Error fetching board data' },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
