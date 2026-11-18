import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * `/api/revalidate/members` lets the members platform push a portrait or board change to the site
 * immediately. Like the Sanity webhook, the failure that matters is accepting a caller it should
 * not, so the auth paths are pinned here; the tag itself is pinned against the reads in
 * `members.test.ts`.
 */

const revalidateTag = vi.fn();

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ revalidateTag: (...args: unknown[]) => revalidateTag(...args) }));

const { POST } = await import('@/app/api/revalidate/members/route');
const { MEMBERS_PLATFORM_TAG } = await import('@/lib/members');

const request = (authorization?: string) =>
  ({ headers: new Headers(authorization ? { authorization } : {}) }) as never;

const ORIGINAL_SECRET = process.env.MEMBERS_PLATFORM_REVALIDATE_SECRET;

beforeEach(() => {
  revalidateTag.mockReset();
  process.env.MEMBERS_PLATFORM_REVALIDATE_SECRET = 'test-secret';
});

afterEach(() => {
  process.env.MEMBERS_PLATFORM_REVALIDATE_SECRET = ORIGINAL_SECRET;
});

describe('POST /api/revalidate/members', () => {
  test('the right bearer secret revalidates the members tag', async () => {
    const res = await POST(request('Bearer test-secret'));

    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith(MEMBERS_PLATFORM_TAG);
  });

  test.each([undefined, 'Bearer wrong-secret', 'Bearer test-secret-but-longer', 'test'])(
    'rejects authorization %s',
    async (authorization) => {
      const res = await POST(request(authorization));

      expect(res.status).toBe(401);
      expect(revalidateTag).not.toHaveBeenCalled();
    },
  );

  test('fails closed when no secret is configured', async () => {
    delete process.env.MEMBERS_PLATFORM_REVALIDATE_SECRET;
    const res = await POST(request('Bearer '));

    expect(res.status).toBe(500);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
