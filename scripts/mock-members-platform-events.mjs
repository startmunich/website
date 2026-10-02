/**
 * Local stub of `GET /api/v1/public/events`, matching the response schema in
 * startmunich/members-platform `src/server/lib/public-api/schemas.ts`.
 *
 * Used to verify the website's primary (members-platform) event path end-to-end without a deployed
 * platform. Not part of the app — run manually alongside `pnpm dev`.
 *
 *   node scripts/mock-members-platform-events.mjs
 *   MEMBERS_PLATFORM_API_URL=http://127.0.0.1:4010 pnpm dev
 */
import { createServer } from 'node:http';

const PORT = 4010;
const now = Date.now();
const hour = 60 * 60 * 1000;

const auth = process.env.MOCK_BEARER ?? 'mock-key';

/** Deliberately mixes past and future, several kinds, tags, and a missing cover. */
const data = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Road to START Summit 2027',
    description: 'Our flagship pitch event.',
    startAt: new Date(now + 24 * 70 * hour).toISOString(),
    endAt: new Date(now + 24 * 70 * hour + 4 * hour).toISOString(),
    timezone: 'Europe/Berlin',
    location: 'München',
    isOnline: false,
    registrationUrl: 'https://luma.com/mock-rtss',
    coverImageUrl: 'https://images.lumacdn.com/mock/rtss.png',
    kind: 'public',
    source: 'luma',
    tags: ['hackathon'],
    isHighlighted: true,
    lastSyncedAt: new Date(now - hour).toISOString(),
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Founder Fail Tales vol. 9',
    description: null,
    startAt: new Date(now + 24 * 20 * hour).toISOString(),
    endAt: null,
    timezone: null,
    location: null,
    isOnline: true,
    registrationUrl: null,
    coverImageUrl: null,
    kind: 'internal',
    source: 'luma',
    tags: [],
    isHighlighted: false,
    lastSyncedAt: null,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    title: 'Founder Fail Tales vol. 8',
    description: null,
    startAt: new Date(now - 24 * 40 * hour).toISOString(),
    endAt: null,
    timezone: 'Europe/Berlin',
    location: null,
    isOnline: false,
    registrationUrl: 'https://luma.com/mock-fft8',
    coverImageUrl: null,
    kind: 'public',
    source: 'luma',
    tags: [],
    isHighlighted: false,
    lastSyncedAt: new Date(now - 2 * hour).toISOString(),
  },
];

createServer((req, res) => {
  // Parse before matching: `req.url` carries the query string, so a plain string compare misses it.
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (url.pathname !== '/api/v1/public/events') {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  const header = req.headers.authorization ?? '';
  if (header !== `Bearer ${auth}`) {
    res.writeHead(401, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing, invalid, or revoked API key.' }));
    return;
  }

  const scope = url.searchParams.get('scope');
  const past = scope === 'past';
  const upcoming = scope === 'upcoming';
  const filtered = data.filter((event) => {
    const future = Date.parse(event.startAt) > now;
    return past ? !future : upcoming ? future : true;
  });

  console.log(`[mock] ${req.method} ${req.url} -> ${filtered.length} event(s)`);
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ data: filtered }));
}).listen(PORT, '127.0.0.1', () => {
  console.log(`mock members-platform events API on http://127.0.0.1:${PORT}`);
});
