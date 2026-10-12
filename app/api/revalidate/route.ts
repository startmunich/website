import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * Sanity webhook target — makes editor changes appear on the site immediately
 * instead of after the one-hour ISR window.
 *
 * Setup in sanity.io/manage (see README → "Content updates"):
 *   URL      https://www.startmunich.de/api/revalidate
 *   Filter   _type in ["startup","partner","networkCompany","newsItem","post","author","memberStory"]
 *   Secret   the same value as SANITY_REVALIDATE_SECRET on this deployment
 *
 * Every CMS read is tagged with the document type it queries
 * (`sanityFetch` in `sanity/client.ts`), so invalidating that one tag is
 * enough — a publish anywhere refreshes every surface showing that content.
 */
interface SanityWebhookBody {
  _type?: string;
  _id?: string;
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  // Fail closed. `parseBody` skips signature validation entirely when no secret
  // is passed and reports `isValidSignature: null`, which is indistinguishable
  // from success — so without this check anyone could POST here at will and
  // flush the cache on demand. A 500 is the honest answer: the route is
  // misconfigured, and it says so in the logs.
  if (!secret) {
    console.error('SANITY_REVALIDATE_SECRET is not set — refusing to revalidate');
    return NextResponse.json({ message: 'Revalidation is not configured' }, { status: 500 });
  }

  let body: SanityWebhookBody | null = null;
  let isValidSignature: boolean | null = null;

  try {
    // Third argument delays the revalidation so the change has propagated to
    // the Content Lake CDN. Without it the next request can re-fetch the old
    // revision and re-populate the cache with stale content.
    ({ body, isValidSignature } = await parseBody<SanityWebhookBody>(req, secret, true));
  } catch (error) {
    console.error('Could not parse Sanity webhook body:', error);
    return NextResponse.json({ message: 'Invalid webhook payload' }, { status: 400 });
  }

  if (!isValidSignature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  if (!body?._type) {
    return NextResponse.json({ message: 'Payload is missing _type' }, { status: 400 });
  }

  revalidateTag(body._type);

  return NextResponse.json({
    revalidated: true,
    tag: body._type,
    now: Date.now(),
  });
}
