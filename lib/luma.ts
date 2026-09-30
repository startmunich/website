import 'server-only';

/**
 * Luma client — the fallback event source.
 *
 * The preferred source is the members platform's `GET /api/v1/public/events` (see `./startApi`),
 * which serves the same data already synced out of Luma and lets admins curate it. This module only
 * runs when that API is not configured or unreachable, so the `/events` page keeps working without it.
 *
 * Kept in one place so the two previously duplicated `/api/luma/*` routes and the event grids all
 * speak to Luma the same way: bounded timeouts, one-hour ISR, and cursor pagination.
 */

const LUMA_BASE_URL = 'https://public-api.luma.com/v1';
const LUMA_TIMEOUT_MS = 10_000;
/** Mirrors the ISR window used elsewhere in the app (AGENTS.md: ISR is one hour everywhere). */
const LUMA_REVALIDATE_SECONDS = 3600;
const LUMA_PAGE_SIZE = 100;
/** Luma caps `pagination_limit` at 100. */
const LUMA_PAGE_LIMIT = 100;

export interface LumaEvent {
  api_id: string;
  name: string;
  description?: string;
  cover_url?: string;
  start_at: string;
  end_at?: string;
  url: string;
  timezone?: string;
  visibility?: string;
  /** Present for online events; its absence is how Luma marks an in-person one. */
  meeting_url?: string | null;
}

export interface LumaListEventsResponse {
  entries?: Array<{ api_id: string; event: LumaEvent; tags?: string[] }>;
  has_more?: boolean;
  next_cursor?: string | null;
}

/** Luma events are private unless explicitly published; never surface an unlisted event. */
function isPublicLumaEvent(event: LumaEvent): boolean {
  return event.visibility !== 'private';
}

/**
 * Fetches Luma events whose start falls inside `[after, before]`, walking the cursor until Luma
 * stops handing out more pages. A page over `LUMA_PAGE_LIMIT` is dropped rather than failing the
 * whole call: the grids degrade to whatever was collected instead of showing an error state.
 */
async function fetchLumaWindow(after: Date, before: Date): Promise<LumaEvent[]> {
  const apiKey = process.env.LUMA_API_KEY;
  if (!apiKey) return [];

  const calendarId = process.env.LUMA_CALENDAR_ID;
  const collected: LumaEvent[] = [];
  let cursor: string | null = null;
  let page = 0;

  do {
    const params = new URLSearchParams({
      after: after.toISOString(),
      before: before.toISOString(),
      pagination_limit: String(LUMA_PAGE_SIZE),
      sort_column: 'start_at',
      sort_direction: 'asc',
    });
    if (calendarId) params.set('calendar_id', calendarId);
    if (cursor) params.set('pagination_cursor', cursor);

    const response = await fetch(`${LUMA_BASE_URL}/calendar/list-events?${params.toString()}`, {
      headers: { accept: 'application/json', 'x-luma-api-key': apiKey },
      signal: AbortSignal.timeout(LUMA_TIMEOUT_MS),
      next: { revalidate: LUMA_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(`[luma] list-events failed: ${response.status} ${response.statusText}`);
      break;
    }

    const data = (await response.json()) as LumaListEventsResponse;
    for (const entry of data.entries ?? []) {
      if (entry?.event) collected.push(entry.event);
    }

    cursor = data.has_more ? (data.next_cursor ?? null) : null;
    // Hard stop so a misbehaving `has_more` can never spin here forever.
    page += 1;
  } while (cursor && page < LUMA_PAGE_LIMIT);

  if (process.env.LUMA_DEBUG === '1') {
    console.log(
      `[luma] ${after.toISOString()}..${before.toISOString()} pages=${page} raw=${collected.length}`,
    );
  }

  return collected.filter(isPublicLumaEvent);
}

function monthsFromNow(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

/** Events from now until 12 months out, soonest first. */
export function fetchUpcomingLumaEvents(): Promise<LumaEvent[]> {
  return fetchLumaWindow(new Date(), monthsFromNow(12));
}

/** Events from 18 months ago until now, soonest first (callers reverse for display). */
export function fetchPastLumaEvents(): Promise<LumaEvent[]> {
  return fetchLumaWindow(monthsFromNow(-18), new Date());
}

/**
 * Every event in one window, for the annual timeline: the last 18 months plus the next 12.
 * One call pair instead of the four a per-page implementation would need.
 */
export function fetchAllLumaEvents(): Promise<LumaEvent[]> {
  const from = monthsFromNow(-18);
  const to = monthsFromNow(12);
  return Promise.all([fetchLumaWindow(from, new Date()), fetchLumaWindow(new Date(), to)]).then(
    ([past, upcoming]) => [...past, ...upcoming],
  );
}
