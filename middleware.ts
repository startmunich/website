import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { BLOCKED_BOTS } from '@/lib/bots';

export function middleware(request: NextRequest) {
  // Never block robots.txt: RFC 9309 says a 4xx there means "no restrictions".
  if (request.nextUrl.pathname === '/robots.txt') {
    return NextResponse.next();
  }

  const ua = request.headers.get('user-agent') || '';
  const lower = ua.toLowerCase();
  if (BLOCKED_BOTS.some((bot) => lower.includes(bot.toLowerCase()))) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  // Skip static assets and robots.txt so the middleware only runs on document
  // requests (and not on every cached asset).
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|txt|xml)$).*)',
  ],
};
