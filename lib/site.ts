/**
 * Site-wide links and navigation. The header, mobile menu and footer all render
 * from this file, so a new page or a changed URL is a one-line edit here.
 */

export const siteLinks = {
  linkedin: 'https://www.linkedin.com/company/start-munich/',
  instagram: 'https://www.instagram.com/startmunich/',
  jobs: 'https://jobs.startmunich.de/jobs',
  donate: 'https://buy.stripe.com/6oE16k2dg6gz3n2145',
  contact: 'https://tally.so/r/w7WY0a',
  hetzner:
    'https://www.hetzner.com/de?mtm_campaign=START-Munich&mtm_medium=referral&mtm_content=sponsoring_link',
} as const;

export interface NavLink {
  label: string;
  href: string;
  /** Opens in a new tab. */
  external?: boolean;
  /** Rendered smaller, under a divider: satellite events and sub-brands. */
  secondary?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavLink[];
}

export type NavEntry = NavLink | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => 'items' in entry;

export const mainNav: NavEntry[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Community',
    items: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Member Journey', href: '/member-journey' },
      { label: 'Our Members', href: '/members' },
      { label: 'Our Jobs', href: siteLinks.jobs, external: true },
    ],
  },
  { label: 'Our Startups', href: '/startups' },
  {
    label: 'Events',
    items: [
      { label: 'All Events', href: '/events' },
      {
        label: 'Europe Embodied',
        href: 'https://europe-embodied.com/',
        external: true,
        secondary: true,
      },
      {
        label: 'Munich Hacking Legal',
        href: 'https://www.hacking-legal.org/',
        external: true,
        secondary: true,
      },
      {
        label: 'Isar Unfiltered',
        href: 'https://www.isarunfiltered.eu',
        external: true,
        secondary: true,
      },
      { label: 'Road to START Summit', href: '/eventpage/rtss', external: true, secondary: true },
      {
        label: 'START Hack League Munich',
        href: 'https://app.hackleague.org/events/start?chapter=munich',
        external: true,
        secondary: true,
      },
      { label: 'START Labs', href: '/labs', external: true, secondary: true },
    ],
  },
  {
    label: 'Partners',
    items: [
      { label: 'For Partners', href: '/for-partners' },
      { label: 'Our Partners', href: '/partners' },
    ],
  },
];

export const footerNav: NavLink[] = [
  { label: 'Legal Notice', href: '/legal-notice' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

/**
 * Routes that render without the site header and footer: standalone event
 * microsites with their own chrome.
 */
export const standaloneRoutes = ['/eventpage/rtss', '/labs'];
