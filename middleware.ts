import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { BLOCKED_BOTS } from '@/lib/bots';

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  const lower = ua.toLowerCase();
  if (BLOCKED_BOTS.some((bot) => lower.includes(bot.toLowerCase()))) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
