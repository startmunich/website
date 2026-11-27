import Image from 'next/image';
import type { ReactNode } from 'react';

import { trackClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

import { rtssConfig } from './rtss-data';

/**
 * Presentational pieces of the RTSS microsite that need no interactivity, so
 * they stay usable from Server Components. Anything scroll-driven lives in
 * `rtss-motion.tsx`.
 */

/** Resolves a file in `public/eventpage/rtss`. */
export const rtssImage = (name: string) => `/eventpage/rtss/${name}`;

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 7h20v5a3 3 0 0 0 0 6v3H4v-3a3 3 0 0 0 0-6V7Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M12 8v12" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** The small tracked label that opens every section. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-primary px-3 py-1.5 text-sm leading-[1.2] tracking-[-0.03em] text-primary-foreground max-sm:px-2.5 max-sm:text-xs">
      {children}
    </span>
  );
}

export function TicketCta({ location }: { location: 'header' | 'schedule' | 'finale' }) {
  return (
    <a
      href={rtssConfig.ticketUrl}
      {...trackClick('ticket_cta_clicked', { page: 'rtss', location })}
      className={cn(
        'inline-flex shrink-0 items-center gap-2.5 rounded-full bg-muted-foreground py-1.5 pr-5 pl-1.5 text-base text-brand-navy transition-colors hover:bg-white',
        location !== 'finale' && 'shadow-[0_6px_18px_-4px] shadow-brand-pink/60',
      )}
    >
      <span
        className={cn(
          'grid size-10 place-items-center rounded-full text-white',
          location === 'finale' ? 'bg-brand-navy' : 'bg-brand-pink',
        )}
      >
        <TicketIcon className="size-6 max-sm:size-5" />
      </span>
      Tickets
    </a>
  );
}

/** Photography inside the microsite. The frame owns the radius and the fill. */
export function RtssPhoto({
  file,
  alt,
  sizes,
  className,
  frameClassName,
}: {
  file: string;
  alt: string;
  sizes: string;
  className?: string;
  frameClassName?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-card', frameClassName)}>
      <Image
        src={rtssImage(file)}
        alt={alt}
        fill
        sizes={sizes}
        className={cn('object-cover', className)}
      />
    </div>
  );
}
