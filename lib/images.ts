/**
 * NocoDB serves attachments via signed, time-limited download URLs, e.g.
 *   https://ndb.startmunich.de/dltemp/<token>/<timestamp>/noco/.../logo.webp
 * or from object storage:
 *   https://nbg1.your-objectstorage.com/members-platform-public-assets/...
 * The <token> and <timestamp> change on every fetch, so the URL is never
 * stable. Vercel's Image Optimization keys its cache on the source URL, which
 * means these images get a fresh (paid) transformation on every render and a
 * 0% cache hit rate. NocoDB already serves WebP, so there is nothing to gain
 * from re-optimizing them — render them with `unoptimized` to bypass Vercel
 * entirely.
 *
 * See: https://vercel.com/docs/image-optimization/managing-image-optimization-costs
 */
export function isNocoDbImage(url: string): boolean {
  return (
    url.startsWith('https://ndb.startmunich.de/') ||
    url.startsWith('https://nbg1.your-objectstorage.com/')
  );
}
