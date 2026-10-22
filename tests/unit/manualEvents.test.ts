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
