import 'server-only';

import { EVENT_KIND_LABELS, type EventKind, type EventTag, type StartEvent } from './eventTypes';
import {
  fetchAllLumaEvents,
  fetchPastLumaEvents,
  fetchUpcomingLumaEvents,
  type LumaEvent,
} from './luma';
import { fetchFromPlatform } from './startApi';

/**
 * Events for the `/events` page, normalized from one of two sources.
 *
 * The members platform is the source: its `events` table is kept current by the Luma sync, so an
 * event created on Luma reaches this page after the next sync, and an admin can hide or feature one
 * without a deploy. `./luma` is the fallback for when the platform is unconfigured or unreachable —
 * the page is public and must not go blank because an upstream is down.
 *
 * Both map into `StartEvent` so no component has to know which one answered.
 *
 * The type and the labels live in `./eventTypes`, which is *not* `server-only`: the grids are client
 * components, so importing even a label from this module would pull the server-only guard into the
 * client bundle and fail the build.
 *
 * Note what is *not* here: no series, no recurring-programme reconstruction, no curated fallback
 * table. An earlier version tried to regroup the flat feed into "series" by normalising titles and
 * guessing which events belonged together, which meant maintaining a second, hand-written copy of
 * the programme that went stale — and every bug report on it was a bug in that guessing. The page
 * now renders what the calendar actually says.
 */

const EVENTS_PER_FETCH = 100;

export { EVENT_KIND_LABELS, type EventKind, type EventTag, type StartEvent };

const EVENT_KINDS: readonly EventKind[] = ['public', 'network', 'partner'];
const EVENT_TAGS: readonly EventTag[] = [
  'weekly',
  'monthly',
  'sprint',
  'workshop',
  'hackathon',
  'sports',
  'fun',
];

function isEventKind(value: unknown): value is EventKind {
  return typeof value === 'string' && EVENT_KINDS.includes(value as EventKind);
}

function toEventTag(value: unknown): EventTag | null {
  return typeof value === 'string' && EVENT_TAGS.includes(value as EventTag)
    ? (value as EventTag)
    : null;
}

function parseDate(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}

/**
 * Maps one row of `GET /api/v1/public/events` onto `StartEvent`.
 *
 * The platform names the cover `coverImage` (not `coverImageUrl`) — getting that wrong is why an
 * earlier mock produced cards with no images at all.
 */
function fromPlatformEvent(raw: Record<string, unknown>): StartEvent | null {
  const id = typeof raw.id === 'string' ? raw.id : null;
  const startAt = parseDate(raw.startAt);
  if (!id || !startAt) return null;

  return {
    id,
    title: typeof raw.title === 'string' ? raw.title : 'Untitled event',
    description: typeof raw.description === 'string' ? raw.description : null,
    startAt,
    endAt: parseDate(raw.endAt),
    timezone: typeof raw.timezone === 'string' ? raw.timezone : null,
    location: typeof raw.location === 'string' ? raw.location : null,
    isOnline: raw.isOnline === true,
    registrationUrl: typeof raw.registrationUrl === 'string' ? raw.registrationUrl : null,
    coverImageUrl: typeof raw.coverImage === 'string' ? raw.coverImage : null,
    kind: isEventKind(raw.kind) ? raw.kind : 'public',
    tags: Array.isArray(raw.tags)
      ? raw.tags.map(toEventTag).filter((tag): tag is EventTag => tag !== null)
      : [],
    isHighlighted: raw.isHighlighted === true,
  };
}

/** Maps one Luma event onto `StartEvent`, dropping entries with no usable start time. */
function fromLumaEvent(event: LumaEvent): StartEvent | null {
  const startAt = parseDate(event.start_at);
  if (!event?.api_id || !startAt) return null;

  return {
    id: event.api_id,
    title: event.name || 'Untitled event',
    description: event.description ?? null,
    startAt,
    endAt: parseDate(event.end_at),
    timezone: event.timezone ?? null,
    // Luma has no single location field; the grids don't show a location, so leave it empty rather
    // than scraping prose out of the description.
    location: null,
    // A meeting URL is what distinguishes an online event; without one Luma is describing a venue.
    isOnline: Boolean(event.meeting_url),
    registrationUrl: event.url ?? null,
    coverImageUrl: event.cover_url ?? null,
    kind: 'public',
    // Luma carries no activity tags and nothing curates an event as featured, so the fallback
    // source has no way to produce tags or highlights. That is the price of the fallback, and it
    // is the honest one — better an empty badge than one invented from a title.
    tags: [],
    isHighlighted: false,
  };
}

function sortByStart(events: StartEvent[], order: 'asc' | 'desc'): StartEvent[] {
  const sign = order === 'desc' ? -1 : 1;
  return [...events].sort((a, b) => sign * (Date.parse(a.startAt) - Date.parse(b.startAt)));
}

/** Platform first, Luma second; both normalised and sorted the same way. */
async function withLumaFallback(
  fromPlatform: () => Promise<StartEvent[] | null>,
  fromLuma: () => Promise<LumaEvent[]>,
  order: 'asc' | 'desc',
): Promise<StartEvent[]> {
  const platformEvents = await fromPlatform();
  if (platformEvents) return sortByStart(platformEvents, order);

  const lumaEvents = await fromLuma();
  return sortByStart(
    lumaEvents.map(fromLumaEvent).filter((event): event is StartEvent => event !== null),
    order,
  );
}

async function platformEvents(query: string): Promise<StartEvent[] | null> {
  const rows = await fetchFromPlatform<Record<string, unknown>>(`/api/v1/public/events?${query}`);
  if (!rows) return null;
  return rows
    .map((row) => fromPlatformEvent(row))
    .filter((event): event is StartEvent => event !== null);
}

/** Events that have not finished yet, soonest first. */
export async function getUpcomingEvents(): Promise<StartEvent[]> {
  return withLumaFallback(
    () => platformEvents(`scope=upcoming&limit=${EVENTS_PER_FETCH}`),
    fetchUpcomingLumaEvents,
    'asc',
  );
}

/** Events that are over, most recent first. */
export async function getPastEvents(): Promise<StartEvent[]> {
  return withLumaFallback(
    () => platformEvents(`scope=past&limit=${EVENTS_PER_FETCH}`),
    fetchPastLumaEvents,
    'desc',
  );
}

/**
 * Events an admin marked as highlighted, soonest first — the "featured" strip. Empty until
 * something is curated, which the page renders as a short "coming soon" note rather than
 * inventing a programme to fill the space.
 */
export async function getFeaturedEvents(): Promise<StartEvent[]> {
  const highlighted = await platformEvents(
    `highlightedOnly=true&scope=all&limit=${EVENTS_PER_FETCH}`,
  );
  if (!highlighted) return [];
  return sortByStart(highlighted, 'asc');
}

/**
 * Everything on the calendar, ascending, for the annual strip: the events that already happened in
 * this year plus the ones coming. One call, bounded, rather than a per-month fan-out.
 */
export async function getCalendarEvents(): Promise<StartEvent[]> {
  const events = await withLumaFallback(
    () => platformEvents(`scope=all&limit=200`),
    fetchAllLumaEvents,
    'asc',
  );
  return events;
}
