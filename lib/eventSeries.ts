import 'server-only';

import type { StartEvent } from './events';

/**
 * Turns the flat event feed into the recurring-event series the `/events` timeline and slider are
 * built from — so the annual programme is derived from the synced calendar instead of being a
 * hardcoded array that silently goes stale when the programme changes.
 *
 * Events are grouped by a normalized title so the many editions of one series ("Road to START
 * Summit 2026", "Road to START Summit 2027") collapse into a single card. Everything the UI needs —
 * which months it runs in, how often, what colour it is, what to link to — is derived from the
 * events themselves; the curated tables below only supply a fallback for values the feed cannot
 * express (a local cover when no occurrence has one, a colour for untagged events).
 */

/** One occurrence of a series, positioned on the 12-month timeline. */
export interface SeriesOccurrence {
  year: number;
  /** 1-12, as the timeline's `calculateTimelinePosition` expects. */
  month: number;
  day: number;
  /** Short label for the marker, e.g. "RTSS 🚀". */
  label: string;
}

export interface RecurringEvent {
  /** Stable slug; also the `data-event-id` the timeline markers scroll to. */
  id: string;
  name: string;
  description: string;
  /** e.g. "December" or "October & April". */
  month: string;
  /** e.g. "Once per year" or "Twice a year". */
  frequency: string;
  image: string;
  category: string;
  /** Hex used for the timeline dot and legend. */
  color: string;
  /** `main` events render as large flagship cards, `side` events as compact ones. */
  tier: 'main' | 'side';
  /** Where the card links. Absolute URLs open in a new tab, internal paths route in-app. */
  href: string | null;
  occurrences: SeriesOccurrence[];
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/** Timeline colours, keyed by the category we infer for a series. */
const CATEGORY_COLORS: Record<string, string> = {
  'Pitch Event': '#ff1744',
  Hackathon: '#9c27b0',
  Incubator: '#ff9800',
  Talk: '#4a90e2',
};

/** Local cover art per category, used when no occurrence has a cover image of its own. */
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Pitch Event': '/events/eventCards/pitch-opt.jpg',
  Hackathon: '/events/eventCards/hack-opt.jpg',
  Incubator: '/events/eventCards/labs-opt.jpg',
  Talk: '/events/eventCards/info-opt.jpg',
};

/**
 * Series that have a bespoke landing page on this site. Kept here rather than in the feed because
 * the pages are hand-built marketing surfaces, not something Luma can express.
 */
const CURATED_ROUTES: Record<string, string> = {
  'road-to-start-summit': '/eventpage/rtss',
  'road-to-start-hack': '/eventpage/rtsh',
  'munich-hacking-legal': 'https://www.hacking-legal.org/',
  'start-labs': 'https://www.startmunich.de/labs',
};

/**
 * Normalizes a title into a series key: lowercase, ASCII-folded, with years, edition numbers and
 * acronyms in parentheses removed so "RTSS 2026", "Road to START Summit (RTSS)" and
 * "road to start summit" all collapse to `road-to-start-summit`.
 */
export function seriesKeyFromTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      // Parenthesized acronyms such as "(RTSS)".
      .replace(/\s*\((?:[a-z]{2,6})\)\s*/g, ' ')
      // Bare trailing/leading year and edition markers: "2026", "'26", "edition 3".
      .replace(/\b(?:19|20)\d{2}\b/g, ' ')
      .replace(/\b\d+(?:st|nd|rd|th)?\s*(?:edition|ed|run)\b/g, ' ')
      // Volume numbering, the other way the chapter versions a series: "vol. 3", "vol 4".
      .replace(/\bvol\.?\s*\d+(?:st|nd|rd|th)?\b/g, ' ')
      // Standalone year suffixes written as "'26".
      .replace(/\b['’]\d{2}\b/g, ' ')
      // Remaining punctuation becomes a separator so "hack & go" and "hack and go" agree on spacing.
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, '-')
  );
}

/** Infers the programme category from the event's tags first, then from its title. */
function inferCategory(event: StartEvent, allTags: Set<string>): string {
  if (allTags.has('hackathon') || /\b(hack|codeathon|buildathon)s?\b/i.test(event.title)) {
    return 'Hackathon';
  }
  if (/\b(pitch|summit|demo\s?day)\b/i.test(event.title)) return 'Pitch Event';
  if (/\b(labs?|incubat\w*|accelerat\w*)\b/i.test(event.title)) return 'Incubator';
  if (allTags.has('workshop') || allTags.has('monthly') || allTags.has('weekly')) return 'Talk';
  return 'Talk';
}

/** Compact label for a marker: an acronym when the title has one, otherwise the first words. */
function occurrenceLabel(title: string): string {
  const acronym = title.match(/\(([A-Za-z]{2,6})\)/);
  if (acronym) return `${acronym[1].toUpperCase()} 🚀`;
  const words = title
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return 'Event';
  return words.length <= 3 ? words.join(' ') : `${words.slice(0, 3).join(' ')}…`;
}

/** "Once per year" for one month, "Twice a year" for two, "N times a year" beyond that. */
function frequencyFor(monthCount: number): string {
  if (monthCount <= 1) return 'Once per year';
  if (monthCount === 2) return 'Twice a year';
  return `${monthCount} times a year`;
}

/** "December" or "October & April", ordered by calendar month. */
function monthsFor(months: number[]): string {
  const sorted = [...new Set(months)].sort((a, b) => a - b);
  return sorted.map((month) => MONTH_NAMES[month - 1]).join(' & ');
}

interface SeriesAccumulator {
  key: string;
  events: StartEvent[];
}

/**
 * Places a series on the annual timeline.
 *
 * The strip shows the shape of a full programme year, not just what is booked next — most of a
 * season's events are created on Luma only weeks before they happen. So: prefer the real dates when
 * a series has occurrences coming up, and otherwise fall back to the months it historically runs in
 * (using the day it most often used), which is what keeps the annual view populated in the gaps.
 */
function buildOccurrences(events: StartEvent[], now: Date): SeriesOccurrence[] {
  const dated = events.map((event) => {
    const date = new Date(event.startAt);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      label: occurrenceLabel(event.title),
    };
  });

  const horizon = new Date(now.getFullYear(), now.getMonth() + 12, now.getDate());
  const upcoming = dated
    .filter((occurrence) => {
      const date = new Date(occurrence.year, occurrence.month - 1, occurrence.day);
      return date >= now && date <= horizon;
    })
    .sort((a, b) => a.month - b.month || a.day - b.day);

  if (upcoming.length > 0) return upcoming.slice(0, 2);

  // No dated occurrence in the window: reconstruct from the months this series has run in. For each
  // month pick the day used most often, so a series that habitually runs mid-month lands mid-month.
  const dayByMonth = new Map<number, Map<number, number>>();
  for (const occurrence of dated) {
    const days = dayByMonth.get(occurrence.month) ?? new Map<number, number>();
    days.set(occurrence.day, (days.get(occurrence.day) ?? 0) + 1);
    dayByMonth.set(occurrence.month, days);
  }

  return [...dayByMonth.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(0, 2)
    .map(([month, days]) => {
      const label = dated.find((occurrence) => occurrence.month === month)?.label ?? 'Event';
      return {
        year: now.getFullYear(),
        month,
        day: [...days.entries()].sort((a, b) => b[1] - a[1])[0][0],
        label,
      };
    });
}

/**
 * Merges series whose keys are prefixes of one another, so a series that is sometimes written with
 * a tagline still collapses with the plain spelling.
 *
 * "Road to START Hack 2026" and "Road to START Hack - The Most Entrepreneurial Hackathon in Munich"
 * normalize to `road-to-start-hack` and `road-to-start-hack-the-most-entrepreneurial-hackathon-in-munich`;
 * they are the same event, but exact key matching would show two cards. Prefixes only merge at a
 * word boundary, so `start-labs` does not swallow `start-labs-final-pitch`.
 */
function mergePrefixedSeries(
  groups: Map<string, SeriesAccumulator>,
): Map<string, SeriesAccumulator> {
  const merged = new Map<string, SeriesAccumulator>();

  // Shortest key first, so the canonical (shortest) spelling is always established before any
  // longer key looks for a parent.
  for (const key of [...groups.keys()].sort((a, b) => a.length - b.length || a.localeCompare(b))) {
    const group = groups.get(key)!;
    const parent = [...merged.keys()]
      .reverse()
      .find((candidate) => key.startsWith(`${candidate}-`));

    if (parent) {
      merged.get(parent)!.events.push(...group.events);
      continue;
    }
    merged.set(key, group);
  }

  return merged;
}

/**
 * Groups the feed into series, most significant first. Returns an empty array when the feed is
 * empty so the caller can fall back to the curated list rather than rendering a blank timeline.
 */
export function deriveEventSeries(events: StartEvent[]): RecurringEvent[] {
  if (events.length === 0) return [];

  const now = new Date();
  const groups = new Map<string, SeriesAccumulator>();

  for (const event of events) {
    const key = seriesKeyFromTitle(event.title);
    // A title that normalizes to nothing usable (e.g. a stray year) is not a series.
    if (!key) continue;

    const existing = groups.get(key);
    if (existing) existing.events.push(event);
    else groups.set(key, { key, events: [event] });
  }

  const series: RecurringEvent[] = [];

  for (const { key, events: occurrences } of mergePrefixedSeries(groups).values()) {
    // Most recent occurrence wins for the descriptive fields: an event that has been renamed shows
    // its current name rather than its historical one.
    const latest = [...occurrences].sort(
      (a, b) => Date.parse(b.startAt) - Date.parse(a.startAt),
    )[0];
    const withCover = [...occurrences]
      .sort((a, b) => Date.parse(b.startAt) - Date.parse(a.startAt))
      .find((event) => event.coverImageUrl);

    const tags = new Set(occurrences.flatMap((event) => event.tags));
    const category = inferCategory(latest, tags);

    // `buildOccurrences` always returns at least one slot, falling back to the months the series
    // historically runs in, so every series is placed on the annual strip.
    const timelineOccurrences = buildOccurrences(occurrences, now);
    const months = timelineOccurrences.map((occurrence) => occurrence.month);

    const curatedHref = CURATED_ROUTES[key];
    const href =
      curatedHref ?? occurrences.find((event) => event.registrationUrl)?.registrationUrl ?? null;

    series.push({
      id: key,
      name: latest.title,
      description:
        latest.description ??
        `Part of the START Munich event programme. ${occurrences.length} edition${
          occurrences.length === 1 ? '' : 's'
        } on record.`,
      month: monthsFor(months),
      frequency: frequencyFor(new Set(months).size),
      image: withCover?.coverImageUrl ?? CATEGORY_FALLBACK_IMAGES[category] ?? '',
      category,
      color: CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Talk,
      // Highlighted on the members platform is the explicit curation signal; the keyword fallback
      // keeps the flagship cards sized correctly when Luma is the active source and nothing is set.
      tier:
        latest.isHighlighted || occurrences.some((event) => event.isHighlighted)
          ? 'main'
          : /\b(summit|hack|codeathon|labs?|incubat\w*)\b/i.test(latest.title)
            ? 'main'
            : 'side',
      href,
      occurrences: timelineOccurrences,
    });
  }

  // Main series first so the flagship row leads, then alphabetical for a stable order across builds.
  return series.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier === 'main' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/** Distinct categories present, for the timeline legend. */
export function seriesCategories(
  series: RecurringEvent[],
): Array<{ category: string; color: string }> {
  const seen = new Map<string, string>();
  for (const item of series) {
    if (!seen.has(item.category)) seen.set(item.category, item.color);
  }
  return [...seen.entries()].map(([category, color]) => ({ category, color }));
}
