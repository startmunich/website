/**
 * Stub that puts an event on 31 December, the worst case for the annual strip: `timelinePosition`
 * returns 99.73% there, so before the clamp the dot sat half outside the line and its label pill
 * hung off the card. Paired with a 1 January event, which is the same problem at the left edge.
 *
 *   node scripts/mock-december-edge-events.mjs   # :4011
 *   STARTMUNICH_API_KEY=mock-key MEMBERS_PLATFORM_API_URL=http://127.0.0.1:4011 pnpm dev
 */
import { createServer } from 'node:http';

const PORT = Number(process.env.MOCK_PLATFORM_PORT ?? 4011);
const YEAR = new Date().getFullYear();

const event = (id, title, iso) => ({
  id,
  title,
  description: null,
  startAt: iso,
  endAt: iso,
  timezone: 'Europe/Berlin',
  location: null,
  isOnline: false,
  registrationUrl: `https://lu.ma/${id}`,
  coverImage: null,
  kind: 'public',
  source: 'manual',
  tags: [],
  isHighlighted: false,
  lastSyncedAt: null,
});

const EVENTS = [
  event('edge-start', 'January 1 — first event of the year', `${YEAR}-01-01T09:00:00Z`),
  event('edge-mid', 'Something in the middle', `${YEAR}-06-15T09:00:00Z`),
  event(
    'edge-end',
    'December 31 — a deliberately very long title that has to be able to fit inside the card',
    `${YEAR}-12-31T09:00:00Z`,
  ),
  event('next-jan', 'January 1 next year — outside the window', `${YEAR + 1}-01-01T09:00:00Z`),
];

createServer((req, res) => {
  if (!req.url?.startsWith('/api/v1/public/events')) {
    res.writeHead(404).end('{}');
    return;
  }
  if (!req.headers.authorization?.startsWith('Bearer ')) {
    res.writeHead(401).end(JSON.stringify({ error: 'Missing or invalid Authorization header' }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ data: EVENTS }));
}).listen(PORT, () => console.log(`mock platform (December edges) on :${PORT}`));
