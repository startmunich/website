'use client';

import { InfoIcon } from 'lucide-react';
import * as React from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/**
 * An (i) button that explains a term. Opens on hover for pointers and on tap
 * for touch, which a tooltip can't do.
 */
export function InfoPopover({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={100}
        aria-label={`About ${title}`}
        className="inline-flex size-8 items-center justify-center rounded-full text-primary transition hover:scale-110 hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <InfoIcon className="size-5" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 gap-2 border-primary/50 bg-surface p-5 sm:w-96">
        <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-primary uppercase">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          {title}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
      </PopoverContent>
    </Popover>
  );
}
