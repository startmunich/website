import { MetadataRoute } from 'next';

import { BLOCKED_BOTS } from '@/lib/bots';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...BLOCKED_BOTS.map((userAgent) => ({
        userAgent,
        disallow: '/',
      })),
      // robots.txt-only tokens that never appear in a User-Agent.
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'Applebot-Extended', disallow: '/' },
    ],
    sitemap: 'https://www.startmunich.de/sitemap.xml',
  };
}
