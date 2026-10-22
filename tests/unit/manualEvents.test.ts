import { describe, expect, test } from 'vitest';

import type { StartEvent } from '@/lib/eventTypes';
import { MANUAL_EVENTS, mergeManualEvents } from '@/lib/manualEvents';

/**
 * The hand-kept list is merged into every events list the page renders, so the two things that can
 * go wrong silently are a broken entry (renders a card with no date or cover) and a duplicate once
 * the same event also arrives from the platform.
 */

const HACK_LEAGUE = MANUAL_EVENTS.find((event) => event.title === 'START Hack League Munich 2026');

function platformEvent(overrides: Partial<StartEvent> & { id: string }): StartEvent {
  return {
    title: 'Some event',
    description: null,
    startAt: '2026-10-01T18:00:00+02:00',
    endAt: null,
    timezone: 'Europe/Berlin',
    location: null,
    isOnline: false,
    registrationUrl: 'https://lu.ma/some-event',
    coverImageUrl: null,
    kind: 'public',
    tags: [],
    isHighlighted: false,
    ...overrides,
  };
}

describe('MANUAL_EVENTS', () => {
  test('every entry is renderable: parseable start date and a local cover image', () => {
    for (const event of MANUAL_EVENTS) {
      expect(Number.isNaN(Date.parse(event.startAt))).toBe(false);
      if (event.endAt) expect(Date.parse(event.endAt)).toBeGreaterThan(Date.parse(event.startAt));
      expect(event.coverImageUrl?.startsWith('/events/')).toBe(true);
    }
  });

  test('the Hack League event points at the Hack League page', () => {
    expect(HACK_LEAGUE?.registrationUrl).toBe(
      'https://app.hackleague.org/events/start?chapter=munich',
    );
  });
});

describe('mergeManualEvents', () => {
  test('appends a manual event the upstream feed does not have', () => {
    const merged = mergeManualEvents([platformEvent({ id: 'upstream' })]);
    expect(merged).toHaveLength(1 + MANUAL_EVENTS.length);
    expect(merged.at(-1)?.id).toBe(HACK_LEAGUE?.id);
  });

  test('drops the manual copy once the platform reports the same registration URL', () => {
    const merged = mergeManualEvents([
      platformEvent({
        id: 'platform-copy',
        title: 'START Hack League Munich 2026',
        registrationUrl: HACK_LEAGUE?.registrationUrl ?? null,
      }),
    ]);
    expect(merged.map((event) => event.id)).not.toContain(HACK_LEAGUE?.id);
  });

  test('falls back to the normalised title when the URLs differ', () => {
    const merged = mergeManualEvents([
      platformEvent({
        id: 'platform-copy',
        title: 'START Hack League Munich  2026!',
        registrationUrl: 'https://example.com/other-page',
      }),
    ]);
    expect(merged.map((event) => event.id)).not.toContain(HACK_LEAGUE?.id);
  });

  test('leaves the upstream list alone', () => {
    const upstream = [platformEvent({ id: 'upstream' })];
    mergeManualEvents(upstream);
    expect(upstream).toHaveLength(1);
  });
});

describe('mergeManualEvents scope', () => {
  // Fixed instants, so these assertions do not rot: before, during and after the Hack League.
  const beforeEvent = new Date('2026-10-22T00:00:00Z');
  const duringEvent = new Date('2026-11-22T10:00:00Z');
  const afterEvent = new Date('2027-01-01T00:00:00Z');

  const ids = (events: StartEvent[]) => events.map((event) => event.id);

  test('a future event is only in upcoming, never in past', () => {
    expect(ids(mergeManualEvents([], { scope: 'upcoming', now: beforeEvent }))).toContain(
      HACK_LEAGUE?.id,
    );
    expect(ids(mergeManualEvents([], { scope: 'past', now: beforeEvent }))).not.toContain(
      HACK_LEAGUE?.id,
    );
  });

  test('an event still running counts as upcoming', () => {
    expect(ids(mergeManualEvents([], { scope: 'upcoming', now: duringEvent }))).toContain(
      HACK_LEAGUE?.id,
    );
    expect(ids(mergeManualEvents([], { scope: 'past', now: duringEvent }))).not.toContain(
      HACK_LEAGUE?.id,
    );
  });

  test('once it has ended it moves to past', () => {
    expect(ids(mergeManualEvents([], { scope: 'past', now: afterEvent }))).toContain(
      HACK_LEAGUE?.id,
    );
    expect(ids(mergeManualEvents([], { scope: 'upcoming', now: afterEvent }))).not.toContain(
      HACK_LEAGUE?.id,
    );
  });

  test('scope "all" keeps the entry regardless of date', () => {
    for (const now of [beforeEvent, duringEvent, afterEvent]) {
      expect(ids(mergeManualEvents([], { scope: 'all', now }))).toContain(HACK_LEAGUE?.id);
    }
  });
});
