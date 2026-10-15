'use client';

import posthog from 'posthog-js';

import { ButtonLink, type ButtonLinkProps } from '@/components/ui/button';

/** A contact button that records the click in PostHog before navigating. */
export default function PartnerCTAButton({ href, ...props }: ButtonLinkProps) {
  return (
    <ButtonLink
      href={href}
      external={false}
      onClick={() => posthog.capture('partner_contact_clicked', { href }, { send_instantly: true })}
      {...props}
    />
  );
}
