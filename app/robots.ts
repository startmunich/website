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
    ],
    sitemap: 'https://www.startmunich.de/sitemap.xml',
  };
}
