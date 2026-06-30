import { NextResponse } from 'next/server';

const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN;
const NOCODB_BASE_URL = process.env.NOCODB_BASE_URL || 'https://ndb.startmunich.de';
const NOCODB_WAITLIST_TABLE_ID = process.env.NOCODB_WAITLIST_TABLE_ID;
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_TIMEOUT_MS = 5_000;
const NOCODB_TIMEOUT_MS = 8_000;

async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) return false;
  try {
    const params = new URLSearchParams();
    params.set('secret', TURNSTILE_SECRET_KEY);
    params.set('response', token);
    if (remoteIp) params.set('remoteip', remoteIp);
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: params,
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!data.success) {
      console.warn('Turnstile verification failed:', data['error-codes']);
    }
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

async function emailAlreadyOnWaitlist(email: string): Promise<boolean> {
  const where = encodeURIComponent(`(Email,eq,${email})`);
  const url = `${NOCODB_BASE_URL}/api/v2/tables/${NOCODB_WAITLIST_TABLE_ID}/records?where=${where}&limit=1`;
  const res = await fetch(url, {
    headers: { 'xc-token': NOCODB_API_TOKEN as string, 'Content-Type': 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(NOCODB_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`NocoDB lookup failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { list?: unknown[] };
  return Array.isArray(data.list) && data.list.length > 0;
}

export async function POST(request: Request) {
  if (!NOCODB_API_TOKEN || !NOCODB_WAITLIST_TABLE_ID || !TURNSTILE_SECRET_KEY) {
    console.error('Waitlist not configured - missing NocoDB or Turnstile env vars');
    return NextResponse.json({ error: 'Waitlist is not configured' }, { status: 500 });
  }

  let email: string | undefined;
  let turnstileToken: string | undefined;
  try {
    const body = await request.json();
    email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : undefined;
    turnstileToken = typeof body?.turnstileToken === 'string' ? body.turnstileToken : undefined;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  if (!turnstileToken) {
    return NextResponse.json(
      { error: 'Captcha challenge missing. Please try again.' },
      { status: 400 },
    );
  }

  const remoteIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    null;

  const captchaOk = await verifyTurnstile(turnstileToken, remoteIp);
  if (!captchaOk) {
    return NextResponse.json(
      { error: 'Captcha verification failed. Please try again.' },
      { status: 403 },
    );
  }

  try {
    if (await emailAlreadyOnWaitlist(email)) {
      return NextResponse.json({ ok: true, alreadyOnList: true });
    }

    const response = await fetch(
      `${NOCODB_BASE_URL}/api/v2/tables/${NOCODB_WAITLIST_TABLE_ID}/records`,
      {
        method: 'POST',
        headers: {
          'xc-token': NOCODB_API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          SignedUpAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(NOCODB_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NocoDB waitlist error: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { error: 'Could not save your email. Please try again later.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error writing to NocoDB waitlist:', error);
    return NextResponse.json(
      { error: 'Could not save your email. Please try again later.' },
      { status: 500 },
    );
  }
}
