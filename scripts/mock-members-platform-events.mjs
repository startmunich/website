/**
 * Stub of the members platform's `GET /api/v1/public/events`, for local development and the
 * Playwright suite.
 *
 * The payload matches the documented response schema exactly — note the cover field is
 * `coverImage`, not `coverImageUrl`. Getting that name wrong is what made an earlier version of
 * this stub produce cards with no images.
 *
 *   node scripts/mock-members-platform-events.mjs                       # :4010
 *   STARTMUNICH_API_KEY=mock-key MEMBERS_PLATFORM_API_URL=http://127.0.0.1:4010 pnpm dev
 */
import { createServer } from 'node:http';

const PORT = Number(process.env.MOCK_PLATFORM_PORT ?? 4010);

const HOUR = 3600 * 1000;
const NOW = Date.now();

/** Deterministic ids so repeated runs and the e2e suite agree on what exists. */
const ids = ['summit', 'hack', 'labs', 'fail-tales', 'info', 'legal', 'pitch', 'bbq'];

const COVERS = [
  'https://images.lumacdn.com/1/summit-9f3a2b.jpg',
  'https://images.lumacdn.com/2/hack-4c1d8e.jpg',
  'https://images.lumacdn.com/3/labs-77aa10.jpg',
  'https://images.lumacdn.com/4/fail-tales-2be5c9.jpg',
  'https://images.lumacdn.com/5/info-c31d07.jpg',
  'https://images.lumacdn.com/6/legal-9a04ff.jpg',
  'https://images.lumacdn.com/7/pitch-5f2b18.jpg',
  'https://images.lumacdn.com/8/bbq-8d0e64.jpg',
];

const seeds = [
  {
    title: 'Road to START Summit',
    inDays: 62,
    kind: 'public',
    tags: ['workshop'],
    highlighted: true,
  },
  { title: 'Road to START Hack', inDays: 43, kind: 'public', tags: ['hackathon'] },
  { title: 'START Labs', inDays: 200, kind: 'partner', tags: ['workshop'] },
  { title: 'Founder Fail Tales vol. 9', inDays: 25, kind: 'public', tags: ['monthly'] },
  { title: 'Info Event', inDays: 11, kind: 'public', tags: ['monthly'] },
  { title: 'Munich Hacking Legal', inDays: 80, kind: 'network', tags: ['hackathon'] },
  { title: 'PITCH & NETWORK', inDays: -18, kind: 'network', tags: ['fun'] },
  { title: 'Summer BBQ', inDays: -95, kind: 'public', tags: ['fun'] },
];

const events = seeds.map((seed, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  title: seed.title,
  description: `${seed.title} — part of the START Munich programme.`,
  startAt: new Date(NOW + seed.inDays * 24 * HOUR).toISOString(),
  endAt: new Date(NOW + (seed.inDays * 24 + 3) * HOUR).toISOString(),
  timezone: 'Europe/Berlin',
  location: 'WERK1, Munich',
  isOnline: false,
  registrationUrl: `https://lu.ma/${ids[index]}`,
  coverImage: COVERS[index],
  kind: seed.kind,
  source: 'luma',
  tags: seed.tags,
  isHighlighted: seed.highlighted ?? false,
  lastSyncedAt: new Date(NOW - 2 * HOUR).toISOString(),
}));

const server = createServer((req, res) => {
  if (!req.url?.startsWith('/api/v1/public/events')) {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  if (!req.headers.authorization?.startsWith('Bearer ')) {
    res.writeHead(401, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing or invalid Authorization header' }));
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  const scope = url.searchParams.get('scope') ?? 'all';
  const limit = Number(url.searchParams.get('limit') ?? 100);

  let data = [...events];
  if (scope === 'upcoming') data = data.filter((e) => Date.parse(e.startAt) > Date.now());
  if (scope === 'past') data = data.filter((e) => Date.parse(e.startAt) <= Date.now());
  if (url.searchParams.get('highlightedOnly') === 'true') {
    data = data.filter((e) => e.isHighlighted);
  }
  if (scope === 'past') data.sort((a, b) => Date.parse(b.startAt) - Date.parse(a.startAt));
  else data.sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt));

  res.writeHead(200, {
    'content-type': 'application/json',
    'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  });
  res.end(JSON.stringify({ data: data.slice(0, limit) }));
});

server.listen(PORT, () => {
  console.log(`mock members-platform events API on :${PORT} (${events.length} events)`);
});
