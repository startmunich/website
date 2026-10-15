import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding font-bold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** The one call to action per view. */
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow',
        /** High-contrast inverse, for chrome that sits on photography (nav, hero). */
        inverse: 'bg-foreground text-background hover:bg-primary hover:text-primary-foreground',
        /** Quiet secondary action on a card or section. */
        outline:
          'border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent aria-expanded:bg-accent',
        /** Secondary action that should still read as on-brand. */
        soft: 'border-primary/30 bg-primary/10 text-primary hover:border-primary/60 hover:bg-primary/20',
        ghost: 'text-foreground hover:bg-accent aria-expanded:bg-accent',
        link: 'h-auto! px-0! text-primary underline-offset-4 hover:underline',
        destructive: 'bg-destructive/15 text-destructive hover:bg-destructive/25',
      },
      size: {
        sm: 'h-9 gap-1.5 px-4 text-sm',
        default: 'h-11 gap-2 px-6 text-sm',
        lg: 'h-13 gap-2.5 px-8 text-base',
        icon: 'size-11',
        'icon-sm': 'size-9',
        'icon-lg': 'size-13',
      },
      shape: {
        default: '',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'default',
    },
  },
);

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

/**
 * Renders a `<button>` by default. For navigation, pass `render={<Link href="…" />}`
 * (or `<a>`) and `nativeButton={false}` so the element keeps link semantics.
 */
function Button({ className, variant, size, shape, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  );
}

type ButtonLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> &
  VariantProps<typeof buttonVariants> & {
    href: string;
    /** Opens in a new tab with `rel="noopener noreferrer"`. Inferred for absolute URLs. */
    external?: boolean;
  };

/** A link that looks like a button. Internal hrefs use `next/link`; absolute ones open a new tab. */
function ButtonLink({
  className,
  variant,
  size,
  shape,
  href,
  external = /^https?:\/\//.test(href),
  ...props
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size, shape, className }));
  if (external) {
    return (
      <a
        data-slot="button"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...(props as React.ComponentProps<'a'>)}
      />
    );
  }
  return <Link data-slot="button" href={href} className={classes} {...props} />;
}

export { Button, ButtonLink, buttonVariants };
export type { ButtonLinkProps, ButtonProps };
