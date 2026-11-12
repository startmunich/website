import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { BLOCKED_BOTS } from '@/lib/bots';
import { middleware } from '@/middleware';

function request(path: string, userAgent: string) {
  return new NextRequest(new URL(`https://www.startmunich.de${path}`), {
    headers: { 'user-agent': userAgent },
  });
}

describe('BLOCKED_BOTS', () => {
  it('blocks the aggressive/SEO crawlers', () => {
    expect(BLOCKED_BOTS).toContain('Bytespider');
    expect(BLOCKED_BOTS).toContain('AhrefsBot');
  });

  it('does not block AI search or training bots', () => {
    expect(BLOCKED_BOTS).not.toContain('GPTBot');
    expect(BLOCKED_BOTS).not.toContain('OAI-SearchBot');
    expect(BLOCKED_BOTS).not.toContain('PerplexityBot');
    expect(BLOCKED_BOTS).not.toContain('ClaudeBot');
  });
});

describe('middleware', () => {
  it('returns 403 for a blocked bot', () => {
    const res = middleware(request('/', 'Bytespider'));
    expect(res.status).toBe(403);
  });

  it('lets Chrome through', () => {
    const res = middleware(request('/', 'Mozilla/5.0 Chrome/120.0'));
    expect(res.status).toBe(200);
  });

  it('lets Googlebot through', () => {
    const res = middleware(request('/', 'Mozilla/5.0 (compatible; Googlebot/2.1)'));
    expect(res.status).toBe(200);
  });

  it('lets facebookexternalhit through', () => {
    const res = middleware(request('/', 'facebookexternalhit/1.1'));
    expect(res.status).toBe(200);
  });

  it('lets a blocked bot read robots.txt', () => {
    const res = middleware(request('/robots.txt', 'Bytespider'));
    expect(res.status).toBe(200);
  });
});
