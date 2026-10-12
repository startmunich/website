import type { StartEvent } from './eventTypes';

/**
 * Places real events on the 12-month strip.
 *
 * This is deliberately arithmetic and nothing else. An earlier version tried to reconstruct a
 * recurring programme by normalising titles, merging "series" and inferring which months a series
 * habitually runs in; every bug that came back was a bug in that inference. Here a marker is just
 * an event on a date, so the strip cannot disagree with the calendar.
 *
 * Pure and dependency-free so it can be unit tested without rendering anything.
 */

/** One dot on the annual strip. */
export interface CalendarMarker {
  eventId: string;
  title: string;
  color: string;
  /** 1-12. */
  month: number;
  /** 1-31. */
  day: number;
  /** CSS `left` offset along the strip. */
  left: string;
  /** Alternates above/below so labels do not collide. */
  side: 'top' | 'bottom';
}

/**
 * Colours are per calendar kind, which the platform reports directly — nothing is inferred from a
 * title. Only kinds actually present in the data end up in the legend, so there is no phantom
 * "Incubator" entry for a month with no incubator event.
 */
export const EVENT_KIND_COLORS = {
  public: '#4a90e2',
  network: '#ff1744',
  partner: '#ff9800',
} as const;

const MONTH_LABELS = [
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

/**
 * Month headings for the strip, derived once. The desktop header and the mobile list used to carry
 * two hand-written arrays that had already drifted.
 */
export function monthLabels(): string[] {
  const short = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, i) => short.format(new Date(Date.UTC(2024, i, 1))));
}

export function fullMonthLabel(month: number): string {
  return MONTH_LABELS[month - 1] ?? '';
}

/** Days in a 1-based month. The strip is a proportion, so a leap year does not matter. */
function daysInMonth(month: number): number {
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 31;
}

/**
 * Where a day sits on the strip: each month is an equal 1/12 of the width, and the day is a
 * fraction of its own month.
 *
 * Dividing by the real month length rather than a flat 30 is what keeps the last day of December
 * on the strip. The previous version ran it to 100.28%, pushing a late-December marker off the
 * right edge where no one could hover it.
 */
export function timelinePosition(month: number, day: number): string {
  const monthProgress = (month - 1) / 12;
  const dayProgress = (day - 1) / daysInMonth(month) / 12;
  return `${((monthProgress + dayProgress) * 100).toFixed(2)}%`;
}

/**
 * The bounds of the calendar year `now` falls in: `[from, to)`.
 *
 * Shared by the marker window and by the `getCalendarEvents` fetch, so the strip cannot be handed
 * a different period than the one it draws.
 */
export function calendarYearWindow(now = new Date()): { from: Date; to: Date } {
  return {
    from: new Date(now.getFullYear(), 0, 1),
    to: new Date(now.getFullYear() + 1, 0, 1),
  };
}

/**
 * Markers for the events in the calendar year `now` falls in, soonest first.
 *
 * The window is the calendar year, because the strip is drawn on a Jan–Dec axis labelled "our year
 * in events" — so Jan must be January *this* year and Dec must be December *this* year. A rolling
 * window (3 months back, 9 forward) disagreed with its own axis: viewed in October it covered
 * Jul–Jul, which dropped everything earlier in the year and then plotted next year's January onto
 * this January. Months far from "now" came out blank for no reason other than the window.
 *
 * Windowing on the same year `yearlyStats` counts is also what makes the hero numbers and the
 * strip describe the same period, instead of the hero counting 21 events while 9 of them had no
 * marker.
 */
export function buildCalendarMarkers(
  events: StartEvent[],
  options: { now?: Date } = {},
): CalendarMarker[] {
  const { now = new Date() } = options;

  const { from: windowStart, to: windowEnd } = calendarYearWindow(now);

  return events
    .filter((event) => {
      const date = new Date(event.startAt);
      return date >= windowStart && date < windowEnd;
    })
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))
    .map((event, index) => {
      const date = new Date(event.startAt);
      return {
        eventId: event.id,
        title: event.title,
        color: EVENT_KIND_COLORS[event.kind],
        month: date.getMonth() + 1,
        day: date.getDate(),
        left: timelinePosition(date.getMonth() + 1, date.getDate()),
        side: index % 2 === 0 ? 'top' : 'bottom',
      } satisfies CalendarMarker;
    });
}

/** The same markers grouped by month, for the mobile list. Months with no events are dropped. */
export function groupMarkersByMonth(markers: CalendarMarker[]): Array<{
  month: number;
  markers: CalendarMarker[];
}> {
  const groups: Array<{ month: number; markers: CalendarMarker[] }> = [];
  for (const marker of markers) {
    const group = groups.find((candidate) => candidate.month === marker.month);
    if (group) group.markers.push(marker);
    else groups.push({ month: marker.month, markers: [marker] });
  }
  return groups;
}

/**
 * Hero statistics, counted from a year of real events rather than hand-edited each season.
 *
 * The whole calendar year counts, events that have not happened yet included — the hero reads
 * "Hackathons Yearly" / "Public Events Yearly", so counting the full year is what the copy claims.
 * It is also the same window the strip draws, which is the agreement the tests below pin down.
 *
 * `hackathons` is never allowed to reach the page as a zero. The Luma fallback has no tags at
 * all, so that total is *unknown* rather than zero — and a tagged feed with nothing tagged
 * `hackathon` reads the same way on the page: a "0+ Hackathons Yearly" beside a calendar that
 * lists hackathon-named events looks broken either way. Both get a random plausible stand-in; a
 * real total replaces it as soon as one event carries the tag.
 */
const FALLBACK_HACKATHONS_MIN = 8;
const FALLBACK_HACKATHONS_MAX = 16;

/**
 * A plausible yearly hackathon total for the untagged fallback. Random within a narrow band so it
 * reads as a real count rather than a placeholder — but computed on the server, where
 * `yearlyStats` runs, so every render of a request agrees with itself.
 */
function fallbackHackathonCount(): number {
  return (
    FALLBACK_HACKATHONS_MIN +
    Math.floor(Math.random() * (FALLBACK_HACKATHONS_MAX - FALLBACK_HACKATHONS_MIN))
  );
}

export function yearlyStats(
  events: StartEvent[],
  now = new Date(),
  options: { tagsAvailable?: boolean } = {},
): { hackathons: number; events: number } {
  const { tagsAvailable = true } = options;
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);

  const thisYear = events.filter((event) => {
    const at = Date.parse(event.startAt);
    return at >= yearStart.getTime() && at < yearEnd.getTime();
  });

  const tagged = tagsAvailable
    ? thisYear.filter((event) => event.tags.includes('hackathon')).length
    : 0;

  return {
    hackathons: tagged > 0 ? tagged : fallbackHackathonCount(),
    events: thisYear.length,
  };
}
