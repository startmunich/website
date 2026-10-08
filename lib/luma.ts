import 'server-only';

/**
 * Luma client — the fallback event source.
 *
 * The preferred source is the members platform's `GET /api/v1/public/events` (see `./events`),
 * which serves data already synced out of Luma and lets admins curate it. This module only runs
 * when that API is not configured or unreachable, so the `/events` page keeps working without it.
 *
 * The platform's own sync (`members-platform/server/lib/luma/client.ts`) fetches a single page
 * without following `pagination_cursor`, so this one does paginate: a sync window wider than 100
 * events would otherwise silently truncate the feed.
 */

const LUMA_BASE_URL = 'https://public-api.luma.com/v1';
const LUMA_TIMEOUT_MS = 10_000;
/** Mirrors the ISR window used elsewhere in the app (AGENTS.md: ISR is one hour everywhere). */
const LUMA_REVALIDATE_SECONDS = 3600;
/** Luma caps `pagination_limit` at 100. */
const LUMA_PAGE_LIMIT = 100;
/** Hard stop so a misbehaving `has_more` can never spin here forever. */
const LUMA_MAX_PAGES = 20;

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

interface LumaListEventsResponse {
  entries?: Array<{ api_id: string; event: LumaEvent }>;
  has_more?: boolean;
  next_cursor?: string | null;
}

/** Luma events are private unless explicitly published; never surface an unlisted event. */
function isPublicLumaEvent(event: LumaEvent): boolean {
  return event.visibility !== 'private';
}

/**
 * Fetches Luma events whose start falls inside `[after, before]`, walking the cursor until Luma
 * stops handing out more pages. Returns an empty list rather than throwing on any failure — a
 * public page should degrade to its empty state, not 500.
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
      pagination_limit: String(LUMA_PAGE_LIMIT),
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
    page += 1;
  } while (cursor && page < LUMA_MAX_PAGES);

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

/** Events from 18 months ago until now, soonest first. */
export function fetchPastLumaEvents(): Promise<LumaEvent[]> {
  return fetchLumaWindow(monthsFromNow(-18), new Date());
}

/**
 * Every event across the annual strip's window, ascending: the last 18 months plus the next 12.
 * Two windowed calls rather than one unbounded one, so a cancelled or far-future event cannot drag
 * the whole feed out of range.
 */
export async function fetchAllLumaEvents(): Promise<LumaEvent[]> {
  const [past, upcoming] = await Promise.all([
    fetchLumaWindow(monthsFromNow(-18), new Date()),
    fetchLumaWindow(new Date(), monthsFromNow(12)),
  ]);
  return [...past, ...upcoming].sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
  );
}
