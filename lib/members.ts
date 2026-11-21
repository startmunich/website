import 'server-only';

import type { Board, BoardSeat, MemberBatch, MemberProfile } from './memberTypes';
import { fetchFromPlatform } from './startApi';

/**
 * Members and boards for `/members`, read straight from the members platform (my.startmunich.de).
 *
 * The platform is the source of truth for people: names, portraits, batches, board seats and
 * which social links a member chose to make public. Nothing about a person is copied into this
 * repo or into Sanity, so there is nothing to sync and nothing to go stale:
 *
 * - A member uploads a new portrait → the platform stores it under a new content-hashed URL → the
 *   next fetch here returns that URL.
 * - Onboarding a batch (e.g. Winter 2026) → its card appears as soon as its first member exists on
 *   the platform. No list to edit.
 * - A new board is entered on the platform → it appears as its own board, seats in the platform's
 *   org-chart order. No hand-written seat list to match roles against.
 *
 * Reads are ISR-cached for an hour and tagged `MEMBERS_PLATFORM_TAG`, so the platform can push a
 * change immediately via `POST /api/revalidate/members`.
 *
 * The only things this repo owns are the marketing group photos below, which are not platform
 * data. A batch or board without one falls back to the hero image.
 */

export const MEMBERS_PLATFORM_TAG = 'members-platform-people';

/** Winter 2021 is the first batch recorded on the platform, and the first board term we show. */
const FIRST_YEAR = 2021;

const FALLBACK_IMAGE = '/ourMembers/hero-opt.png';

/** Batch group photos in `public/ourMembers/batches_group_pictures`, keyed by batch slug. */
const BATCH_PHOTOS: Record<string, string> = {
  ws21: 'WS21-opt.jpg',
  ss22: 'SS22-opt.jpg',
  ws22: 'WS22-opt.jpg',
  ss23: 'SS23-opt.jpg',
  ws23: 'WS23-opt.jpg',
  ss24: 'SS24-opt.jpg',
  ws24: 'WS24-opt.jpg',
  ss25: 'SS25-opt.jpg',
  ws25: 'WS25-opt.jpg',
  ss26: 'SS26-opt.jpg',
  ws26: 'WS26-opt.jpg',
};

/** Board group photos, keyed by the term's start year. */
const BOARD_PHOTOS: Record<string, string> = {
  '2024': '/ourMembers/boads/board25.jpg',
  '2025': '/ourMembers/boads/boad26.jpeg',
  '2026': '/ourMembers/boads/board27.jpg',
};

type Semester = 'WS' | 'SS';

interface BatchKey {
  year: number;
  semester: Semester;
}

/** `GET /api/v1/public/members` — one member. */
interface PlatformMember {
  id?: unknown;
  name?: unknown;
  profileImage?: unknown;
  batch?: unknown;
  linkedinUrl?: unknown;
}

/** `GET /api/v1/public/board` — one board membership. */
interface PlatformBoardMember extends Omit<PlatformMember, 'batch'> {
  level?: unknown;
  role?: unknown;
  termStart?: unknown;
  termEnd?: unknown;
  department?: { name?: unknown } | null;
}

const str = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

/** `2026-WS` (the platform's form; a `-X` transfer suffix is already stripped by the API). */
const platformKey = ({ year, semester }: BatchKey) => `${year}-${semester}`;
/** `ws26`, the URL segment. */
const batchSlug = ({ year, semester }: BatchKey) =>
  `${semester.toLowerCase()}${String(year).slice(-2)}`;
const batchName = ({ year, semester }: BatchKey) =>
  `${semester === 'WS' ? 'Winter' : 'Summer'} ${year}`;

function parseBatchSlug(slug: string): BatchKey | null {
  const match = /^(ws|ss)(\d{2})$/.exec(slug.toLowerCase());
  if (!match) return null;
  const key = { year: 2000 + Number(match[2]), semester: match[1].toUpperCase() as Semester };
  return key.year >= FIRST_YEAR && key.year <= new Date().getFullYear() ? key : null;
}

/**
 * Every batch that could exist, newest first (a winter batch starts after that year's summer
 * batch). Not-yet-started semesters are included on purpose: the platform refuses to assign
 * members to them, so they come back empty and drop out — no date logic to keep in step with the
 * platform's configurable semester start.
 */
function candidateBatches(): BatchKey[] {
  const keys: BatchKey[] = [];
  for (let year = new Date().getFullYear(); year >= FIRST_YEAR; year--) {
    keys.push({ year, semester: 'WS' }, { year, semester: 'SS' });
  }
  return keys;
}

function toProfile(raw: PlatformMember): MemberProfile | null {
  const id = str(raw.id);
  const name = str(raw.name);
  if (!id || !name) return null;
  return { id, name, imageUrl: str(raw.profileImage), linkedinUrl: str(raw.linkedinUrl) };
}

/** Portraits first, so a batch page doesn't open on a wall of initials; then by name. */
function byPortraitThenName(a: MemberProfile, b: MemberProfile) {
  return Number(!a.imageUrl) - Number(!b.imageUrl) || a.name.localeCompare(b.name, 'de');
}

function toBatch(key: BatchKey, members: MemberProfile[]): MemberBatch {
  const slug = batchSlug(key);
  const photo = BATCH_PHOTOS[slug];
  return {
    slug,
    name: batchName(key),
    groupImageUrl: photo ? `/ourMembers/batches_group_pictures/${photo}` : FALLBACK_IMAGE,
    members: [...members].sort(byPortraitThenName),
  };
}

async function fetchMembers(keys: BatchKey[]) {
  return fetchFromPlatform<PlatformMember>(
    `/api/v1/public/members?batches=${encodeURIComponent(keys.map(platformKey).join(','))}`,
    { tags: [MEMBERS_PLATFORM_TAG] },
  );
}

/**
 * All batches with at least one member, newest first — one platform request for the lot.
 *
 * If the platform is unreachable, the batches that have a group photo are still listed (without
 * members), so the page degrades to what it showed before rather than going blank.
 */
export async function getMemberBatches(): Promise<MemberBatch[]> {
  const keys = candidateBatches();
  const rows = await fetchMembers(keys);

  const byBatch = new Map<string, MemberProfile[]>();
  for (const row of rows ?? []) {
    const batch = str(row.batch);
    const profile = toProfile(row);
    if (!batch || !profile) continue;
    const list = byBatch.get(batch);
    if (list) list.push(profile);
    else byBatch.set(batch, [profile]);
  }

  return keys
    .filter((key) => (rows ? byBatch.has(platformKey(key)) : Boolean(BATCH_PHOTOS[batchSlug(key)])))
    .map((key) => toBatch(key, byBatch.get(platformKey(key)) ?? []));
}

/**
 * One batch by its URL slug (`ws26`). `null` means there is no such batch — the slug is malformed,
 * or the platform answered and nobody is in that semester (yet) — which the page turns into a 404.
 * A batch whose members could not be fetched (platform down) comes back with none instead.
 */
export async function getMemberBatch(slug: string): Promise<MemberBatch | null> {
  const key = parseBatchSlug(slug);
  if (!key) return null;

  const rows = await fetchMembers([key]);
  if (rows && rows.length === 0) return null;

  const members = (rows ?? [])
    .map(toProfile)
    .filter((profile): profile is MemberProfile => profile !== null);

  return toBatch(key, members);
}

function toSeat(raw: PlatformBoardMember): BoardSeat | null {
  const profile = toProfile(raw);
  if (!profile) return null;
  return { ...profile, role: str(raw.role) ?? str(raw.department?.name) ?? '' };
}

/**
 * Every board term on the platform, newest first, with its seats split by level.
 *
 * The platform already returns seats in org-chart order (executive first, then
 * President → VP → CFO → the rest, departments by their configured order), and each `filter`
 * below preserves it. Boards from before the two-tier structure are entirely `executive`, so their
 * department board is simply empty.
 */
export async function getBoards(): Promise<Board[]> {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);

  const rows = await fetchFromPlatform<PlatformBoardMember>(
    `/api/v1/public/board?termStartYears=${years.join(',')}`,
    { tags: [MEMBERS_PLATFORM_TAG] },
  );

  const terms = new Map<string, PlatformBoardMember[]>();
  for (const row of rows ?? []) {
    const start = str(row.termStart);
    if (!start || !/^\d{4}$/.test(start)) continue;
    const list = terms.get(start);
    if (list) list.push(row);
    else terms.set(start, [row]);
  }

  return [...terms.entries()]
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([start, seats]) => {
      const from = Number(start);
      const short = `${String(from).slice(-2)}-${String(from + 1).slice(-2)}`;
      const seatsAt = (level: string) =>
        seats
          .filter((seat) => seat.level === level)
          .map(toSeat)
          .filter((seat): seat is BoardSeat => seat !== null);

      return {
        id: short,
        name: `Board ${short}`,
        years: `${from}-${from + 1}`,
        current: seats.some((seat) => seat.termEnd === null),
        imageUrl: BOARD_PHOTOS[start] ?? FALLBACK_IMAGE,
        executiveBoard: seatsAt('executive'),
        departmentBoard: seatsAt('department'),
      };
    });
}
