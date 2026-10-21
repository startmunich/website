'use client';

import Script from 'next/script';
import posthog from 'posthog-js';
import { type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      reset: (widgetIdOrContainer?: string | HTMLElement) => void;
    };
  }
}

/** Email + Turnstile captcha, posting to /api/waitlist. */
export function WaitlistForm() {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  );
  const [waitlistMessage, setWaitlistMessage] = useState<string | null>(null);

  const handleWaitlistSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (waitlistStatus === 'submitting') return;
    const formData = new FormData(e.currentTarget);
    const turnstileToken = formData.get('cf-turnstile-response');
    if (typeof turnstileToken !== 'string' || !turnstileToken) {
      setWaitlistStatus('error');
      setWaitlistMessage('Please complete the captcha challenge.');
      return;
    }
    setWaitlistStatus('submitting');
    setWaitlistMessage(null);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail, turnstileToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setWaitlistStatus('error');
        setWaitlistMessage(data?.error || 'Something went wrong. Please try again.');
        window.turnstile?.reset();
        return;
      }
      posthog.capture('waitlist_signup', { location: 'join_start_2026_closed' });
      setWaitlistStatus('success');
      setWaitlistMessage(
        data?.alreadyOnList
          ? "You're already on the list. We'll be in touch when applications reopen."
          : "You're on the list. We'll be in touch when applications reopen.",
      );
      setWaitlistEmail('');
    } catch {
      setWaitlistStatus('error');
      setWaitlistMessage('Something went wrong. Please try again.');
      window.turnstile?.reset();
    }
  };

  const disabled = waitlistStatus === 'submitting' || waitlistStatus === 'success';

  return (
    <div className="mt-6 flex w-full max-w-2xl flex-col gap-3">
      <form className="flex flex-col gap-3" onSubmit={handleWaitlistSubmit}>
        <Field className="flex-col gap-2 sm:flex-row">
          <FieldLabel htmlFor="waitlist-email" className="sr-only">
            Email address
          </FieldLabel>
          <Input
            id="waitlist-email"
            type="email"
            required
            value={waitlistEmail}
            onChange={(e) => setWaitlistEmail(e.target.value)}
            disabled={disabled}
            placeholder="Email address"
            className="h-12 flex-1 bg-foreground text-background placeholder:text-background/50"
          />
          <Button type="submit" size="lg" disabled={disabled} className="h-12 uppercase">
            {waitlistStatus === 'submitting'
              ? 'Submitting...'
              : waitlistStatus === 'success'
                ? "You're on the list"
                : '> Join the waiting list'}
          </Button>
        </Field>
        {TURNSTILE_SITE_KEY && (
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" />
        )}
      </form>
      {waitlistMessage && (
        <p
          className={cn(
            'text-sm',
            waitlistStatus === 'success' ? 'text-success' : 'text-destructive',
          )}
          role={waitlistStatus === 'error' ? 'alert' : 'status'}
        >
          {waitlistMessage}
        </p>
      )}
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          async
          defer
        />
      )}
    </div>
  );
}
