'use client';

import posthog from 'posthog-js';

interface PartnerCTAButtonProps {
  href: string;
  className: string;
  children: React.ReactNode;
}

export default function PartnerCTAButton({ href, className, children }: PartnerCTAButtonProps) {
  return (
    <a
      href={href}
      onClick={() => posthog.capture('partner_contact_clicked', { href }, { send_instantly: true })}
      className={className}
    >
      {children}
    </a>
  );
}
