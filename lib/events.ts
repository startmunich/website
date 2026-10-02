import 'server-only';

import { CURATED_PAST_EVENTS } from './curatedEventSeries';
import {
  fetchAllLumaEvents,
  fetchPastLumaEvents,
  fetchUpcomingLumaEvents,
  type LumaEvent,
} from './luma';

/**
 * The event shape the website renders, normalized from either source.
 *
 * The members platform is the preferred source (its data is synced out of Luma every few hours and
 * can be curated by admins). `./luma` is the fallback for when it is not configured. Both map into
 * this one type so no component has to know which upstream answered.
 */

const START_API_TIMEOUT_MS = 10_000;
/** Mirrors the ISR window used elsewhere in the app (AGENTS.md: ISR is one hour everywhere). */
const EVENTS_REVALIDATE_SECONDS = 3600;

/** Calendar `kind` on the members platform. `internal` is a calendar label, not a privacy level. */
export type EventKind = 'public' | 'internal' | 'network' | 'partner';
export type EventTag =
  'weekly' | 'monthly' | 'sprint' | 'workshop' | 'hackathon' | 'sports' | 'fun';

export interface StartEvent {
  /** Stable across sources: the platform's uuid, or Luma's `api_id`. */
  id: string;
  title: string;
  description: string | null;
  /** ISO-8601 UTC instant. Combine with `timezone` to render a local time. */
  startAt: string;
  endAt: string | null;
  timezone: string | null;
  location: string | null;
  isOnline: boolean;
  /** Luma page where registration happens. Null means there is nothing to link to. */
  registrationUrl: string | null;
  coverImageUrl: string | null;
  kind: EventKind;
  tags: EventTag[];
  /** Curated by an admin on the members platform; used to feature an event. */
  isHighlighted: boolean;
}

const EVENT_KINDS: readonly EventKind[] = ['public', 'internal', 'network', 'partner'];
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

/** Maps one row of `GET /api/v1/public/events` onto `StartEvent`. */
function fromPlatformEvent(raw: Record<string, unknown>): StartEvent | null {
  const id = typeof raw.id === 'string' ? raw.id : null;
  const startAt = typeof raw.startAt === 'string' ? raw.startAt : null;
  if (!id || !startAt || Number.isNaN(Date.parse(startAt))) return null;

  return {
    id,
    title: typeof raw.title === 'string' ? raw.title : 'Untitled event',
    description: typeof raw.description === 'string' ? raw.description : null,
    startAt,
    endAt: typeof raw.endAt === 'string' ? raw.endAt : null,
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
  if (!event?.api_id || !event.start_at || Number.isNaN(Date.parse(event.start_at))) return null;

  return {
    id: event.api_id,
    title: event.name || 'Untitled event',
    description: event.description ?? null,
    startAt: event.start_at,
    endAt: event.end_at ?? null,
    timezone: event.timezone ?? null,
    // Luma has no single location field; the description carries the address and the grids do not
    // show it, so leave it empty rather than scraping prose.
    location: null,
    // A meeting URL is what distinguishes an online event; without one Luma is describing a venue.
    isOnline: Boolean(event.meeting_url),
    registrationUrl: event.url ?? null,
    coverImageUrl: event.cover_url ?? null,
    kind: 'public',
    tags: [],
    isHighlighted: false,
  };
}

function platformBaseUrl(): string {
  return (process.env.MEMBERS_PLATFORM_API_URL || 'https://my.startmunich.de').replace(/\/+$/, '');
}

/**
 * Fetches events from the members platform. Returns `null` — not an empty list — when the platform
 * is unconfigured, unauthorized, or failing, so callers can tell "no events" apart from "fall back
 * to Luma" and avoid wiping a working grid during a platform outage.
 */
async function fetchFromPlatform(params: string): Promise<StartEvent[] | null> {
  const apiKey = process.env.STARTMUNICH_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`${platformBaseUrl()}/api/v1/public/events?${params}`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(START_API_TIMEOUT_MS),
      next: { revalidate: EVENTS_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(`Members platform events API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const body = (await response.json()) as { data?: unknown };
    if (!Array.isArray(body.data)) return null;

    return body.data
      .map((entry) => fromPlatformEvent(entry as Record<string, unknown>))
      .filter((event): event is StartEvent => event !== null);
  } catch (error) {
    console.error('Error fetching events from the members platform:', error);
    return null;
  }
}

/** Platform first, Luma second; sorted ascending by start in both branches. */
async function withLumaFallback(
  fromPlatform: () => Promise<StartEvent[] | null>,
  fromLuma: () => Promise<LumaEvent[]>,
): Promise<StartEvent[]> {
  const platformEvents = await fromPlatform();
  if (platformEvents) return sortAscending(platformEvents);

  const lumaEvents = await fromLuma();
  return sortAscending(
    lumaEvents.map(fromLumaEvent).filter((event): event is StartEvent => event !== null),
  );
}

function sortAscending(events: StartEvent[]): StartEvent[] {
  return [...events].sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt));
}

/** Events that have already started, most recent first. */
export async function getPastEvents(): Promise<StartEvent[]> {
  const events = await withLumaFallback(
    () => fetchFromPlatform('scope=past&limit=100'),
    fetchPastLumaEvents,
  );
  return events.reverse();
}

/**
 * Past events for the archive grid: the synced feed plus the curated seeds, deduplicated by
 * registration URL and ordered most recent first.
 */
export async function getPastEventsWithSeeds(): Promise<StartEvent[]> {
  const fetched = await getPastEvents();

  const seen = new Set(fetched.map((event) => event.registrationUrl));
  const seeds = CURATED_PAST_EVENTS.filter((event) => !seen.has(event.registrationUrl));

  return [...fetched, ...seeds].sort((a, b) => Date.parse(b.startAt) - Date.parse(a.startAt));
}

/** Events that have not started yet, soonest first. */
export async function getUpcomingEvents(): Promise<StartEvent[]> {
  return withLumaFallback(
    () => fetchFromPlatform('scope=upcoming&limit=100'),
    fetchUpcomingLumaEvents,
  );
}

/**
 * The annual timeline: every event across the last 18 months and the next 12, ascending.
 * Bounded to a few hundred rows on the platform; the Luma fallback is trimmed to the same size so
 * the timeline cannot grow without limit when it is the active source.
 */
export async function getTimelineEvents(): Promise<StartEvent[]> {
  const platformEvents = await fetchFromPlatform('limit=200');
  if (platformEvents) return platformEvents;

  const lumaEvents = await fetchAllLumaEvents();
  return sortAscending(
    lumaEvents
      .map(fromLumaEvent)
      .filter((event): event is StartEvent => event !== null)
      .slice(-200),
  );
}

/** Events explicitly curated as featured, soonest first. Empty when nothing is highlighted. */
export async function getHighlightedEvents(): Promise<StartEvent[]> {
  const platformEvents = await fetchFromPlatform('highlightedOnly=true&limit=24');
  return platformEvents ?? [];
}
