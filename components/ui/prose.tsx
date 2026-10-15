import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Long-form copy (legal pages). Styles plain h2/h3/p/ul/a descendants with the
 * design tokens, so the markup inside stays free of presentational classes.
 */
function Prose({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="prose"
      className={cn(
        'flex flex-col gap-10 text-lg leading-relaxed text-muted-foreground',
        '[&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-foreground [&_h2]:uppercase',
        '[&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-foreground [&_h3]:uppercase',
        '[&_section>div]:flex [&_section>div]:flex-col [&_section>div]:gap-2',
        '[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6',
        '[&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline',
        className,
      )}
      {...props}
    />
  );
}

export { Prose };
