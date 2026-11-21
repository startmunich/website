import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * `lib/members.ts` decides what `/members` shows from nothing but the platform's flat lists, so
 * these pin the organising rules a regression would silently break: which batches and boards
 * exist, their order, the seat order, and degrading rather than blanking when the platform is down.
 */

const fetchFromPlatform = vi.fn<(path: string, opts?: { tags?: string[] }) => Promise<unknown>>();

vi.mock('server-only', () => ({}));
vi.mock('@/lib/startApi', () => ({
  fetchFromPlatform: (path: string, opts?: { tags?: string[] }) => fetchFromPlatform(path, opts),
}));

const { getBoards, getMemberBatch, getMemberBatches, MEMBERS_PLATFORM_TAG } =
  await import('@/lib/members');

const portrait = (id: string) => `https://nbg1.your-objectstorage.com/p/${id}.webp`;

beforeEach(() => {
  fetchFromPlatform.mockReset();
  vi.useFakeTimers({ now: new Date('2026-11-16T12:00:00Z'), toFake: ['Date'] });
});

afterEach(() => vi.useRealTimers());

describe('getMemberBatches', () => {
  test('groups members by batch, newest first, and lists a new batch without a group photo', async () => {
    fetchFromPlatform.mockResolvedValue([
      { id: 'a', name: 'Anna', batch: '2026-SS', profileImage: portrait('a'), linkedinUrl: null },
      { id: 'b', name: 'Ben', batch: '2026-WS', profileImage: null, linkedinUrl: null },
      { id: 'c', name: 'Cleo', batch: '2026-WS', profileImage: portrait('c'), linkedinUrl: null },
      { id: 'd', name: 'Dan', batch: '2025-WS', profileImage: portrait('d'), linkedinUrl: null },
    ]);

    const batches = await getMemberBatches();

    expect(batches.map((b) => b.slug)).toEqual(['ws26', 'ss26', 'ws25']);
    expect(batches[0]).toMatchObject({
      name: 'Winter 2026',
      groupImageUrl: '/ourMembers/batches_group_pictures/WS26-opt.jpg',
    });
    expect(batches[1].groupImageUrl).toBe('/ourMembers/batches_group_pictures/SS26-opt.jpg');
    // Portraits first, then by name.
    expect(batches[0].members.map((m) => m.name)).toEqual(['Cleo', 'Ben']);
  });

  test('asks for every batch up to this year in one tagged request', async () => {
    fetchFromPlatform.mockResolvedValue([]);
    await getMemberBatches();

    expect(fetchFromPlatform).toHaveBeenCalledOnce();
    const [path, opts] = fetchFromPlatform.mock.calls[0];
    const batches = decodeURIComponent(path.split('batches=')[1]).split(',');
    expect(batches[0]).toBe('2026-WS');
    expect(batches.at(-1)).toBe('2021-SS');
    expect(opts?.tags).toEqual([MEMBERS_PLATFORM_TAG]);
  });

  test('falls back to the batches with a group photo when the platform is down', async () => {
    fetchFromPlatform.mockResolvedValue(null);
    const batches = await getMemberBatches();

    expect(batches.length).toBeGreaterThan(0);
    expect(batches.every((b) => b.members.length === 0)).toBe(true);
    expect(batches.map((b) => b.slug)).toContain('ws26');
  });

  test('drops rows without an id or name', async () => {
    fetchFromPlatform.mockResolvedValue([
      { id: 'a', name: '', batch: '2026-WS', profileImage: null },
      { name: 'No Id', batch: '2026-WS', profileImage: null },
    ]);
    expect(await getMemberBatches()).toEqual([]);
  });
});

describe('getMemberBatch', () => {
  test.each(['ws20', 'ws27', 'winter-2026', 'x'])('treats %s as not a batch', async (slug) => {
    expect(await getMemberBatch(slug)).toBeNull();
    expect(fetchFromPlatform).not.toHaveBeenCalled();
  });

  test('treats a well-formed batch with no members as not a batch', async () => {
    fetchFromPlatform.mockResolvedValue([]);
    expect(await getMemberBatch('ws26')).toBeNull();
  });

  test('returns an empty batch rather than null when the platform is down', async () => {
    fetchFromPlatform.mockResolvedValue(null);
    expect(await getMemberBatch('WS26')).toMatchObject({ slug: 'ws26', members: [] });
  });
});

describe('getBoards', () => {
  const seat = (
    id: string,
    termStart: string,
    level: 'executive' | 'department',
    role: string | null,
    extra: Record<string, unknown> = {},
  ) => ({
    id,
    name: `Person ${id}`,
    profileImage: portrait(id),
    level,
    role,
    termStart,
    termEnd: termStart === '2026' ? null : String(Number(termStart) + 1),
    department: null,
    linkedinUrl: null,
    ...extra,
  });

  test('builds one board per term, newest first, keeping the platform seat order', async () => {
    fetchFromPlatform.mockResolvedValue([
      seat('p25', '2025', 'executive', 'President'),
      seat('p26', '2026', 'executive', 'President'),
      seat('v26', '2026', 'executive', 'Vice President'),
      seat('m26', '2026', 'department', null, { department: { name: 'Marketing' } }),
      seat('old', '2023', 'executive', 'President, MD People'),
    ]);

    const boards = await getBoards();

    expect(boards.map((b) => b.id)).toEqual(['26-27', '25-26', '23-24']);
    expect(boards[0]).toMatchObject({
      name: 'Board 26-27',
      years: '2026-2027',
      current: true,
      imageUrl: '/ourMembers/boads/board27.jpg',
    });
    expect(boards[0].executiveBoard.map((s) => s.role)).toEqual(['President', 'Vice President']);
    // A seat without a role title falls back to its department.
    expect(boards[0].departmentBoard).toEqual([
      expect.objectContaining({ name: 'Person m26', role: 'Marketing' }),
    ]);
    expect(boards[1]).toMatchObject({ current: false, imageUrl: '/ourMembers/boads/boad26.jpeg' });
    expect(boards[2].departmentBoard).toEqual([]);
  });

  test('marks a board current only while one of its seats has no term end', async () => {
    fetchFromPlatform.mockResolvedValue([
      seat('p26', '2026', 'executive', 'President', { termEnd: '2027' }),
      seat('p25', '2025', 'executive', 'President'),
    ]);

    const boards = await getBoards();

    expect(boards.map((b) => [b.id, b.current])).toEqual([
      ['26-27', false],
      ['25-26', false],
    ]);
  });

  test('is empty when the platform is down', async () => {
    fetchFromPlatform.mockResolvedValue(null);
    expect(await getBoards()).toEqual([]);
  });
});
