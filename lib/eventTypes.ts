/**
 * The event shape the website renders, plus the labels derived from it.
 *
 * Deliberately separate from `lib/events.ts`, which is `server-only` because it talks to the
 * members platform and to Luma. The grids and the page content are client components, so importing
 * anything from there — even a plain constant — would drag `server-only` into the client bundle and
 * break the build. Types and presentational labels belong here; fetching belongs there.
 */

export type EventKind = 'public' | 'network' | 'partner';

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

/** Badge text for an event's category, straight from the kind the platform reports. */
export const EVENT_KIND_LABELS: Record<EventKind, string> = {
  public: 'Public',
  network: 'START Network',
  partner: 'Partner',
};
