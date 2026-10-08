import 'server-only';

/**
 * The one place this website talks to the members platform (`my.startmunich.de`).
 *
 * Board, members and events all read the same external API with the same API key, so the base
 * URL, the bearer header, the timeout and the ISR window live here rather than being re-spelled in
 * each caller. That is what makes `MEMBERS_PLATFORM_API_URL` mean what the README says it means:
 * point it at a local instance and *everything* follows, not just events.
 */

const PLATFORM_TIMEOUT_MS = 10_000;
/** Mirrors the ISR window used elsewhere in the app (AGENTS.md: ISR is one hour everywhere). */
const PLATFORM_REVALIDATE_SECONDS = 3600;

export const DEFAULT_PLATFORM_URL = 'https://my.startmunich.de';

/**
 * Base URL without a trailing slash. Vercel and a local dev server both end up canonical here.
 */
export function platformBaseUrl(): string {
  return (process.env.MEMBERS_PLATFORM_API_URL || DEFAULT_PLATFORM_URL).replace(/\/+$/, '');
}

export class PlatformError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PlatformError';
    this.status = status;
  }
}

/**
 * GET a member-platform endpoint, returning the parsed `{ data: [...] }` envelope.
 *
 * Returns `null` — never throws — when the key is missing or the call fails, so a caller can
 * degrade to empty rather than take the page down. AGENTS.md asks for exactly this: a missing
 * token or an unreachable upstream must still render.
 */
export async function fetchFromPlatform<T>(path: string): Promise<T[] | null> {
  const apiKey = process.env.STARTMUNICH_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`${platformBaseUrl()}${path}`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(PLATFORM_TIMEOUT_MS),
      next: { revalidate: PLATFORM_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error('Members platform %s failed: %d %s', path, response.status, response.statusText);
      return null;
    }

    const body = (await response.json()) as { data?: unknown };
    return Array.isArray(body.data) ? (body.data as T[]) : null;
  } catch (error) {
    console.error('Error fetching %s from the members platform:', path, error);
    return null;
  }
}
