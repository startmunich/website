import Image from 'next/image';
import type { ReactNode } from 'react';

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

/**
 * The paired event actions for attendee tickets and startup applications.
 */
export function SplitCta() {
  return (
    <div
      role="group"
      aria-label={`Join ${rtssConfig.title}`}
      className="inline-flex shrink-0 items-stretch overflow-hidden rounded-full bg-muted-foreground text-brand-navy"
    >
      <a
        href={rtssConfig.ticketUrl}
        className="flex items-center justify-center gap-2.5 py-[7px] pr-[18px] pl-1.5 text-base whitespace-nowrap transition-colors hover:bg-white max-sm:gap-2 max-sm:py-1.5 max-sm:pr-4 max-sm:pl-1.5 max-sm:text-base"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-navy text-foreground">
          <TicketIcon className="size-6 max-sm:size-5" />
        </span>
        Tickets
      </a>
      <a
        href={rtssConfig.applicationUrl}
        className="flex items-center justify-center gap-2.5 border-l border-muted px-[18px] py-[7px] text-base whitespace-nowrap transition-colors hover:bg-white max-sm:px-4 max-sm:py-1.5 max-sm:text-base"
      >
        Start-Ups
      </a>
    </div>
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
