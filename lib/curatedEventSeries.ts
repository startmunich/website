import type { StartEvent } from './events';
import type { RecurringEvent } from './eventSeries';

/**
 * Past event kept for the archive because it sits at the edge of (or before) the synced Luma window.
 * Merged in by `getPastEventsWithSeeds` and deduplicated by registration URL, so it disappears on
 * its own once the calendar actually carries the event.
 */
export const CURATED_PAST_EVENTS: StartEvent[] = [
  {
    id: 'curated-start-goes-stockholm',
    title: 'START goes Stockholm',
    description: null,
    startAt: '2026-06-17T18:00:00Z',
    endAt: '2026-06-18T22:00:00Z',
    timezone: 'Europe/Stockholm',
    location: null,
    isOnline: false,
    registrationUrl: 'https://luma.com/bdpjmq9n',
    coverImageUrl:
      'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=300,height=300/event-covers/a9/bce41002-705f-452e-9e5a-5442fea4e67b.png',
    kind: 'public',
    tags: [],
    isHighlighted: false,
  },
];

/**
 * The programme as it stood when the timeline was hand-maintained.
 *
 * This is the **fallback only** — it is used when no event source is configured (no members-platform
 * API key and no Luma key), so `/events` still renders the programme instead of an empty timeline.
 * As soon as the calendar sync returns data, `deriveEventSeries` takes over and this is ignored.
 *
 * Month/colour/description are editorial and stay here on purpose: they describe the programme
 * itself, not one calendar entry, so they cannot be derived from a feed.
 */
export const CURATED_SERIES: RecurringEvent[] = [
  {
    id: 'road-to-start-summit',
    name: 'Road to START Summit (RTSS)',
    description:
      'Our flagship pitch event where aspiring founders present their startup ideas to a panel of investors, entrepreneurs, and industry experts.',
    month: 'December',
    frequency: 'Once per year',
    image: '/events/eventCards/summit-opt.jpg',
    category: 'Pitch Event',
    color: '#ff1744',
    tier: 'main',
    href: '/eventpage/rtss',
    occurrences: [],
  },
  {
    id: 'road-to-start-hack',
    name: 'Road to START Hack (RTSH)',
    description:
      'An intensive hackathon bringing together developers, designers, and entrepreneurs to build innovative solutions in 24-48 hours.',
    month: 'November',
    frequency: 'Once per year',
    image: '/events/eventCards/hack-opt.jpg',
    category: 'Hackathon',
    color: '#9c27b0',
    tier: 'main',
    href: '/eventpage/rtsh',
    occurrences: [],
  },
  {
    id: 'munich-hacking-legal',
    name: 'Munich Hacking Legal',
    description:
      'A unique hackathon focused on building legal tech solutions that address real challenges in the legal industry, combining technology with regulatory expertise.',
    month: 'April',
    frequency: 'Once per year',
    image: '/events/eventCards/legal-opt.jpg',
    category: 'Hackathon',
    color: '#9c27b0',
    tier: 'main',
    href: 'https://www.hacking-legal.org/',
    occurrences: [],
  },
  {
    id: 'start-labs',
    name: 'START Labs',
    description:
      'A hands-on program where students work on real-world challenges from industry partners, developing prototypes and solutions across various tech verticals like GovTech, MedTech, and more.',
    month: 'May',
    frequency: 'Once per year',
    image: '/events/eventCards/labs-opt.jpg',
    category: 'Incubator',
    color: '#ff9800',
    tier: 'main',
    href: 'https://www.startmunich.de/labs',
    occurrences: [],
  },
  {
    id: 'info-event',
    name: 'Info Event',
    description:
      'Join us at the start of each semester to learn about START Munich, meet our community, and discover how you can get involved.',
    month: 'April & October',
    frequency: 'Twice a year',
    image: '/events/eventCards/info-opt.jpg',
    category: 'Talk',
    color: '#4a90e2',
    tier: 'side',
    href: null,
    occurrences: [],
  },
  {
    id: 'founder-fail-tales',
    name: 'Founder Fail Tales',
    description:
      'Real stories from real founders about their biggest failures and lessons learned.',
    month: 'April & October',
    frequency: 'Twice a year',
    image: '/events/eventCards/fail-opt.jpg',
    category: 'Talk',
    color: '#4a90e2',
    tier: 'side',
    href: null,
    occurrences: [],
  },
  {
    id: 'pitch-and-network',
    name: 'PITCH & NETWORK',
    description:
      'Practice your pitch, get feedback from experienced entrepreneurs, and network with fellow founders in an intimate setting.',
    month: 'January & June',
    frequency: 'Twice a year',
    image: '/events/eventCards/pitch-opt.jpg',
    category: 'Pitch Event',
    color: '#ff1744',
    tier: 'side',
    href: null,
    occurrences: [],
  },
];
