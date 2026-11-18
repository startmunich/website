import { timingSafeEqual } from 'node:crypto';

import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { MEMBERS_PLATFORM_TAG } from '@/lib/members';

/**
 * Members-platform webhook target — makes a new portrait, name, batch or board seat appear on
 * `/members` immediately instead of after the one-hour ISR window.
 *
 * The platform is meant to call it after a member or board change (not wired up on the platform
 * side yet):
 *   POST https://www.startmunich.de/api/revalidate/members
 *   Authorization: Bearer <MEMBERS_PLATFORM_REVALIDATE_SECRET>
 *
 * There is no payload: every member and board read is tagged `MEMBERS_PLATFORM_TAG`, and refetching
 * one batch list and one board list is cheaper than working out which ones a change touched.
 * Without this call the site still catches up on its own within the hour.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.MEMBERS_PLATFORM_REVALIDATE_SECRET;

  // Fail closed, like the Sanity webhook: with no secret configured anyone could flush the cache.
  if (!secret) {
    console.error('MEMBERS_PLATFORM_REVALIDATE_SECRET is not set — refusing to revalidate');
    return NextResponse.json({ message: 'Revalidation is not configured' }, { status: 500 });
  }

  const header = req.headers.get('authorization') ?? '';
  const given = Buffer.from(header.replace(/^Bearer\s+/i, ''));
  const expected = Buffer.from(secret);

  // `timingSafeEqual` throws on a length mismatch, so check that first.
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  revalidateTag(MEMBERS_PLATFORM_TAG);

  return NextResponse.json({ revalidated: true, tag: MEMBERS_PLATFORM_TAG, now: Date.now() });
}
