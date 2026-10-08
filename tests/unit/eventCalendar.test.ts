import { describe, expect, test } from 'vitest';

import {
  buildCalendarMarkers,
  EVENT_KIND_COLORS,
  fullMonthLabel,
  groupMarkersByMonth,
  monthLabels,
  timelinePosition,
  yearlyStats,
} from '@/lib/eventCalendar';
import type { StartEvent } from '@/lib/eventTypes';

/**
 * `lib/eventCalendar.ts` is pure arithmetic deciding what the annual strip shows, which is exactly
 * the kind of code that fails silently. These are the cases the previous series-based implementation
 * got wrong: events sorted by month/day instead of by full date across a year boundary, a legend
 * listing categories that no event actually had, and a series whose month/frequency were computed
 * from a two-item slice.
 */

const NOW = new Date('2026-10-08T12:00:00Z');

/** Days in a 1-based month, matching what the implementation divides by. */
const daysIn = (month: number) => [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 31;

function event(overrides: Partial<StartEvent> & { id: string; startAt: string }): StartEvent {
  return {
    title: 'Event',
    description: null,
    endAt: null,
    timezone: null,
    location: null,
    isOnline: false,
    registrationUrl: null,
    coverImageUrl: null,
    kind: 'public',
    tags: [],
    isHighlighted: false,
    ...overrides,
  };
}

describe('monthLabels', () => {
  test('returns twelve short month names in order', () => {
    expect(monthLabels()).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]);
  });

  test('fullMonthLabel spells one out', () => {
    expect(fullMonthLabel(12)).toBe('December');
    expect(fullMonthLabel(1)).toBe('January');
  });
});

describe('timelinePosition', () => {
  test('puts January 1st at the very start of the strip', () => {
    expect(timelinePosition(1, 1)).toBe('0.00%');
  });

  test('keeps later months further right', () => {
    expect(parseFloat(timelinePosition(12, 9))).toBeGreaterThan(
      parseFloat(timelinePosition(11, 29)),
    );
  });

  test('keeps a later day in the same month further right', () => {
    expect(parseFloat(timelinePosition(6, 20))).toBeGreaterThan(parseFloat(timelinePosition(6, 5)));
  });

  test('never runs past the end of the strip, whatever the day', () => {
    // A flat 30-day divisor put 31 December at 100.28%, off the right edge and unhoverable.
    for (let month = 1; month <= 12; month += 1) {
      expect(parseFloat(timelinePosition(month, daysIn(month)))).toBeLessThan(100);
    }
    expect(parseFloat(timelinePosition(12, 31))).toBeLessThan(100);
  });
});

describe('buildCalendarMarkers', () => {
  test('returns nothing for an empty feed', () => {
    expect(buildCalendarMarkers([], { now: NOW })).toEqual([]);
  });

  test('places one marker per event, at its real month and day', () => {
    const markers = buildCalendarMarkers(
      [
        event({ id: 'a', startAt: '2026-11-14T18:00:00Z', title: 'Pitch Night' }),
        event({ id: 'b', startAt: '2026-12-09T09:00:00Z', title: 'Summit' }),
      ],
      { now: NOW },
    );

    expect(markers).toHaveLength(2);
    expect(markers.map((m) => [m.month, m.day])).toEqual([
      [11, 14],
      [12, 9],
    ]);
  });

  test('sorts by full date, so a December event never precedes an October one', () => {
    // The old implementation compared month/day only, which put a January event ahead of a
    // November one whenever the window crossed a year boundary.
    const markers = buildCalendarMarkers(
      [
        event({ id: 'jan', startAt: '2027-01-13T10:00:00Z' }),
        event({ id: 'nov', startAt: '2026-11-11T10:00:00Z' }),
        event({ id: 'dec', startAt: '2026-12-09T10:00:00Z' }),
        event({ id: 'oct', startAt: '2026-10-14T10:00:00Z' }),
      ],
      { now: NOW, pastMonths: 0, futureMonths: 6 },
    );

    expect(markers.map((m) => m.eventId)).toEqual(['oct', 'nov', 'dec', 'jan']);
  });

  test('excludes events outside the window', () => {
    const markers = buildCalendarMarkers(
      [
        event({ id: 'far-past', startAt: '2023-01-10T10:00:00Z' }),
        event({ id: 'inside', startAt: '2026-11-01T10:00:00Z' }),
        event({ id: 'far-future', startAt: '2029-01-10T10:00:00Z' }),
      ],
      { now: NOW },
    );

    expect(markers.map((m) => m.eventId)).toEqual(['inside']);
  });

  test('colours by calendar kind, never by guessing from the title', () => {
    const markers = buildCalendarMarkers(
      [
        event({ id: 'h', startAt: '2026-11-01T10:00:00Z', title: 'Munich Hacking Legal' }),
        event({ id: 'n', startAt: '2026-11-02T10:00:00Z', kind: 'network' }),
        event({ id: 'p', startAt: '2026-11-03T10:00:00Z', kind: 'partner' }),
      ],
      { now: NOW },
    );

    // "Munich Hacking Legal" used to be classified a Hackathon by a title regex; now the colour
    // comes from the kind the platform reports.
    expect(markers.find((m) => m.eventId === 'h')?.color).toBe(EVENT_KIND_COLORS.public);
    expect(markers.find((m) => m.eventId === 'n')?.color).toBe(EVENT_KIND_COLORS.network);
    expect(markers.find((m) => m.eventId === 'p')?.color).toBe(EVENT_KIND_COLORS.partner);
  });

  test('alternates markers above and below so labels do not stack', () => {
    const markers = buildCalendarMarkers(
      [
        event({ id: 'a', startAt: '2026-10-20T10:00:00Z' }),
        event({ id: 'b', startAt: '2026-11-20T10:00:00Z' }),
        event({ id: 'c', startAt: '2026-12-20T10:00:00Z' }),
      ],
      { now: NOW },
    );

    expect(markers.map((m) => m.side)).toEqual(['top', 'bottom', 'top']);
  });

  test('carries the real title through as the marker label', () => {
    const markers = buildCalendarMarkers(
      [event({ id: 'a', startAt: '2026-11-01T10:00:00Z', title: "Summit '26" })],
      { now: NOW },
    );
    // Previously normalised into a generic abbreviation; the calendar has one name for this event.
    expect(markers[0].title).toBe("Summit '26");
  });
});

describe('groupMarkersByMonth', () => {
  test('groups markers into their months, dropping months with none', () => {
    const markers = buildCalendarMarkers(
      [
        event({ id: 'a', startAt: '2026-10-14T10:00:00Z' }),
        event({ id: 'b', startAt: '2026-12-09T10:00:00Z' }),
        event({ id: 'c', startAt: '2026-12-11T10:00:00Z' }),
      ],
      { now: NOW },
    );

    const groups = groupMarkersByMonth(markers);
    expect(groups.map((g) => g.month)).toEqual([10, 12]);
    expect(groups[1].markers.map((m) => m.eventId)).toEqual(['b', 'c']);
  });

  test('is empty for an empty feed', () => {
    expect(groupMarkersByMonth([])).toEqual([]);
  });
});

describe('yearlyStats', () => {
  test('counts events in the current calendar year only', () => {
    const stats = yearlyStats(
      [
        event({ id: 'a', startAt: '2026-03-10T10:00:00Z' }),
        event({ id: 'b', startAt: '2026-09-10T10:00:00Z' }),
        event({ id: 'c', startAt: '2025-12-10T10:00:00Z' }),
        event({ id: 'd', startAt: '2027-01-10T10:00:00Z' }),
      ],
      NOW,
    );

    expect(stats.events).toBe(2);
  });

  test('counts hackathons from the tag, not from the title', () => {
    const stats = yearlyStats(
      [
        event({ id: 'a', startAt: '2026-03-10T10:00:00Z', tags: ['hackathon'] }),
        // Title says hackathon, no tag — not counted, which is the honest answer.
        event({ id: 'b', startAt: '2026-04-10T10:00:00Z', title: 'Road to START Hack' }),
      ],
      NOW,
    );

    expect(stats.hackathons).toBe(1);
    expect(stats.events).toBe(2);
  });

  test('is zero for an empty feed', () => {
    expect(yearlyStats([], NOW)).toEqual({ hackathons: 0, events: 0 });
  });
});
