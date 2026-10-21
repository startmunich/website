import * as React from 'react';

import { cn } from '@/lib/utils';

/** A list with small brand-coloured dots as markers. */
function BulletList({
  className,
  items,
  ...props
}: React.ComponentProps<'ul'> & { items: React.ReactNode[] }) {
  return (
    <ul data-slot="bullet-list" className={cn('flex flex-col gap-3', className)} {...props}>
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
        >
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export { BulletList };
