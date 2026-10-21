import { beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * Pins the cache tags that CMS reads emit.
 *
 * `sanityFetch` types `type` as a union, so a typo like `startups` is a
 * compile error rather than a runtime bug. What the compiler cannot catch is a
 * *consistent* mistake: tagging every query `startup` while the webhook receives
 * `_type: "partner"` publishes cleanly, the site stays stale for an hour, and
 * nothing anywhere reports a failure. This asserts the actual emitted tags.
 */

// Typed as taking one argument so `mock.calls[0][0]` is the options object.
const sanityFetch = vi.fn(async (_options: { query?: string; type?: string }) => [] as unknown);

vi.mock('server-only', () => ({}));
vi.mock('@/sanity/client', () => ({
  sanityFetch: (options: { query?: string; type?: string }) => sanityFetch(options),
}));
// `sanity/queries.ts` imports `defineQuery` from `next-sanity`, whose root entry
// pulls in React components. Stub just that, so the real query strings still
// load and the assertions reflect what actually ships.
vi.mock('next-sanity', () => ({ defineQuery: (query: string) => query }));

const content = await import('@/lib/sanityContent');

beforeEach(() => sanityFetch.mockClear());

/** Runs every CMS read and returns the tag each one used. */
async function tagsFromAllReads(): Promise<string[]> {
  await content.getAllStartups();
  await content.getStartupById('1');
  await content.getFeaturedStartups();
  await content.getAllPartners();
  await content.getFeaturedPartners();
  await content.getNetworkCompanies();
  await content.getNewsItems();
  return sanityFetch.mock.calls.map(([options]) => options.type ?? '');
}

describe('CMS cache tags', () => {
  test('every read tags with the document type the webhook will be told about', async () => {
    const tags = await tagsFromAllReads();

    expect(tags.length).toBeGreaterThan(0);
    // Exact strings matter: Sanity sends `_type` verbatim, and `revalidateTag`
    // matches on equality. Anything not in this set is an unreachable tag.
    expect([...new Set(tags)].sort()).toEqual(['networkCompany', 'newsItem', 'partner', 'startup']);
  });

  test('startup detail reads are tagged like the startup list, not by id', async () => {
    // A per-id tag would mean the list query is never invalidated.
    await content.getStartupById('42');

    expect(sanityFetch).toHaveBeenCalledTimes(1);
    expect(sanityFetch.mock.calls[0][0]).toMatchObject({
      type: 'startup',
      params: { id: '42' },
    } as never);
  });

  test('every read passes a query through, so nothing bypasses the tag helper', async () => {
    await tagsFromAllReads();

    for (const [options] of sanityFetch.mock.calls) {
      expect(options.query).toBeTruthy();
    }
  });
});
