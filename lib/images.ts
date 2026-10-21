/**
 * Member portraits come from the internal START Munich API
 * (`my.startmunich.de`), which serves images from object storage at
 * `nbg1.your-objectstorage.com`:
 *   https://nbg1.your-objectstorage.com/members-platform-public-assets/...
 *
 * They are rendered with `unoptimized` so Vercel's Image Optimization is
 * bypassed. These URLs are stable, but the assets are already correctly sized
 * for their display slots and sit on a third-party host, so re-optimizing them
 * buys nothing and costs a paid transformation per render.
 *
 * This used to also cover NocoDB's `ndb.startmunich.de` attachments, which were
 * served from time-limited `dltemp/<token>/<expiry-ms>/…` signed URLs and 404'd
 * once cached. That path is gone: startups, partners, network logos and news
 * now come from Sanity's CDN, which is stable and can be optimized normally.
 *
 * See: https://vercel.com/docs/image-optimization/managing-image-optimization-costs
 */
export function isObjectStorageImage(url: string): boolean {
  return url.startsWith('https://nbg1.your-objectstorage.com/');
}
