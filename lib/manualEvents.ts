import type { StartEvent } from './eventTypes';

/**
 * Events that are not on a Luma calendar, maintained by hand.
 *
 * `/events` normally renders what the members platform reports, and an admin adds a one-off event
 * there as a `manual` event. This list is for the gap before that happens (or for an event with no
 * Luma page at all): the entries are merged into every list the page renders, so they survive the
 * platform being unreachable and never depend on a sync.
 *
 * Keep it short. An entry here is invisible to the platform's admin overview, the Luma sync and the
 * attendance tooling, so it is the exception, not the way to publish an event. Once the same event
 * exists in the platform it is de-duplicated below — by registration URL, then by normalised title —
 * but deleting the entry here is still the right follow-up.
 *
 * `StartEvent` is the shape the platform maps into (see `./eventTypes`), so nothing downstream
 * needs to know which source an event came from.
 */
export const MANUAL_EVENTS: readonly StartEvent[] = [
  {
    id: 'manual-start-hack-league-munich-2026',
    title: 'START Hack League Munich 2026',
    description:
      'The START Hack League stops in Munich for two days of building at the TUM Audimax, 21–22 November 2026.',
    // The artwork confirms the dates but not the clock times; `/events` renders the start date only.
    startAt: '2026-11-21T09:00:00+01:00',
    endAt: '2026-11-22T18:00:00+01:00',
    timezone: 'Europe/Berlin',
    location: 'Audimax, TUM Stammgelände, Theresienstraße, 80333 München',
    isOnline: false,
    registrationUrl: 'https://app.hackleague.org/events/start?chapter=munich',
    coverImageUrl: '/events/eventCards/start-hack-league-munich-2026.png',
    kind: 'public',
    tags: ['hackathon'],
    isHighlighted: true,
  },
];

/** Comparison key for titles: case, punctuation and whitespace must not defeat the de-dupe. */
function titleKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/**
 * Which slice of the calendar a list renders. Mirrors the platform's `scope` query parameter, so an
 * event added here lands in the same place an equivalent platform event would.
 */
export type ManualEventScope = 'upcoming' | 'past' | 'all';

export interface MergeManualEventsOptions {
  scope?: ManualEventScope;
  now?: Date;
}

/** An event is over once its end — or its start, when it has none — is in the past. */
function hasFinished(event: StartEvent, now: Date): boolean {
  return Date.parse(event.endAt ?? event.startAt) < now.getTime();
}

function matchesScope(event: StartEvent, scope: ManualEventScope, now: Date): boolean {
  if (scope === 'upcoming') return !hasFinished(event, now);
  if (scope === 'past') return hasFinished(event, now);
  return true;
}

/**
 * Appends the manual events that belong in `scope` and that the upstream feed does not already
 * contain.
 *
 * The list is not merged blindly: `/events` asks for upcoming and past events separately, and an
 * entry from `MANUAL_EVENTS` must respect that split or a future event appears under "Past Events"
 * the moment it is added.
 *
 * The platform eventually gets the same event (an admin adds it by hand), and at that point the
 * page would show it twice. Matching first on `registrationUrl` and then on the normalised title
 * keeps exactly one card, without requiring the entry here to be deleted on the same day the
 * platform is updated.
 */
export function mergeManualEvents(
  upstream: readonly StartEvent[],
  { scope = 'all', now = new Date() }: MergeManualEventsOptions = {},
): StartEvent[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  for (const event of upstream) {
    if (event.registrationUrl) seenUrls.add(event.registrationUrl);
    seenTitles.add(titleKey(event.title));
  }

  const missing = MANUAL_EVENTS.filter(
    (event) =>
      matchesScope(event, scope, now) &&
      !(event.registrationUrl && seenUrls.has(event.registrationUrl)) &&
      !seenTitles.has(titleKey(event.title)),
  );

  return [...upstream, ...missing];
}
