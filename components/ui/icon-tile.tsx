import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const iconTileVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-xl border [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'border-primary/30 bg-primary/15 text-primary',
        neutral: 'border-border bg-accent text-foreground',
        solid: 'border-transparent bg-primary text-primary-foreground',
      },
      size: {
        sm: 'size-8 rounded-lg [&_svg:not([class*=size-])]:size-4',
        default: 'size-10 [&_svg:not([class*=size-])]:size-5',
        lg: 'size-14 [&_svg:not([class*=size-])]:size-7',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);

/** An icon in a tinted square: feature lists, card headers, contact rows. */
function IconTile({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof iconTileVariants>) {
  return (
    <div
      data-slot="icon-tile"
      className={cn(iconTileVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { IconTile, iconTileVariants };
