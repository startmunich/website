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
 * Markers for the events in a window around `now`, soonest first.
 *
 * `pastMonths` / `futureMonths` bound the strip: a calendar that only syncs ~6 months ahead would
 * otherwise pile every future event onto the far right of the year.
 */
export function buildCalendarMarkers(
  events: StartEvent[],
  options: { now?: Date; pastMonths?: number; futureMonths?: number } = {},
): CalendarMarker[] {
  const { now = new Date(), pastMonths = 3, futureMonths = 9 } = options;

  const windowStart = new Date(now.getFullYear(), now.getMonth() - pastMonths, 1);
  const windowEnd = new Date(now.getFullYear(), now.getMonth() + futureMonths + 1, 1);

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
 * Only events that already started count towards "this year".
 */
export function yearlyStats(
  events: StartEvent[],
  now = new Date(),
): { hackathons: number; events: number } {
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);

  const thisYear = events.filter((event) => {
    const at = Date.parse(event.startAt);
    return at >= yearStart.getTime() && at < yearEnd.getTime();
  });

  return {
    hackathons: thisYear.filter((event) => event.tags.includes('hackathon')).length,
    events: thisYear.length,
  };
}
