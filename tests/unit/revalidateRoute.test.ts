import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * `/api/revalidate` is what makes editor changes appear immediately instead of
 * after the one-hour ISR window. Two things can go wrong, and neither shows up
 * in a smoke test:
 *
 *  1. The route accepts unauthenticated callers. `parseBody` returns
 *     `isValidSignature: null` — not `false` — when no secret is configured,
 *     which reads as falsy but is not a rejection. Treating that as "invalid"
 *     would be right, but treating it as "valid" would let anyone flush the
 *     cache. The route fails closed instead, and that is pinned here.
 *  2. The route revalidates a tag nothing was tagged with, so publishing looks
 *     like it worked and the site stays stale for the next hour.
 *
 * The tag is asserted against `sanityFetch` in `sanityContent.test.ts` — this
 * file owns the request handling, that one owns the tag vocabulary.
 */

const revalidateTag = vi.fn();
const parseBody = vi.fn();

vi.mock('next/cache', () => ({ revalidateTag: (...args: unknown[]) => revalidateTag(...args) }));
vi.mock('next-sanity/webhook', () => ({ parseBody: (...args: unknown[]) => parseBody(...args) }));

const { POST } = await import('@/app/api/revalidate/route');

/** Minimal NextRequest stand-in — `parseBody` is mocked, so nothing reads it. */
const request = () => ({ headers: new Headers() }) as never;

const ORIGINAL_SECRET = process.env.SANITY_REVALIDATE_SECRET;

beforeEach(() => {
  revalidateTag.mockReset();
  parseBody.mockReset();
  process.env.SANITY_REVALIDATE_SECRET = 'test-secret';
});

afterEach(() => {
  process.env.SANITY_REVALIDATE_SECRET = ORIGINAL_SECRET;
});

describe('POST /api/revalidate', () => {
  test('a valid payload revalidates the tag matching the document type', async () => {
    parseBody.mockResolvedValue({
      isValidSignature: true,
      body: { _type: 'startup', _id: 'abc' },
    });

    const res = await POST(request());

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ revalidated: true, tag: 'startup' });
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith('startup');
  });

  test.each(['partner', 'networkCompany', 'newsItem'] as const)(
    'revalidates the %s tag',
    async (type) => {
      parseBody.mockResolvedValue({ isValidSignature: true, body: { _type: type, _id: 'x' } });

      await POST(request());

      expect(revalidateTag).toHaveBeenCalledExactlyOnceWith(type);
    },
  );

  test('rejects a bad signature without touching the cache', async () => {
    parseBody.mockResolvedValue({ isValidSignature: false, body: { _type: 'startup' } });

    const res = await POST(request());

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  test('fails closed when no secret is configured', async () => {
    // `parseBody` reports `null` for "not checked", which must not be read as
    // "valid". Without this guard the route would revalidate for anyone.
    delete process.env.SANITY_REVALIDATE_SECRET;
    parseBody.mockResolvedValue({ isValidSignature: null, body: { _type: 'startup' } });

    const res = await POST(request());

    expect(res.status).toBe(500);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(parseBody).not.toHaveBeenCalled();
  });

  test('rejects a payload with no _type rather than revalidating everything', async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: { _id: 'abc' } });

    const res = await POST(request());

    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  test('returns 400 on an unparseable body', async () => {
    parseBody.mockRejectedValue(new Error('invalid json'));

    const res = await POST(request());

    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
