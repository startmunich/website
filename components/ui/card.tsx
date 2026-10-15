import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const cardVariants = cva(
  'group/card relative flex flex-col gap-(--card-spacing) overflow-hidden rounded-2xl border py-(--card-spacing) text-card-foreground has-data-[slot=card-footer]:pb-0 has-data-[slot=card-media]:pt-0 has-[>img:first-child]:pt-0',
  {
    variants: {
      variant: {
        /** Translucent surface: the default for content on the page background. */
        default: 'border-border bg-card',
        /** Brand-tinted surface for the one featured item in a group. */
        highlight: 'border-primary/20 bg-linear-to-br from-primary/20 via-primary/5 to-transparent',
        /** Frosted surface for cards that sit on photography (hero stats). */
        glass: 'border-foreground/15 bg-foreground/8 shadow-card backdrop-blur-md',
        /** Opaque, slightly lifted surface for panels that need separation. */
        solid: 'border-border bg-surface',
      },
      size: {
        sm: '[--card-spacing:--spacing(4)]',
        default: '[--card-spacing:--spacing(6)]',
        lg: '[--card-spacing:--spacing(8)] lg:[--card-spacing:--spacing(10)]',
      },
      interactive: {
        true: 'transition-all duration-300 hover:border-primary/40 hover:bg-accent',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  },
);

type CardProps = useRender.ComponentProps<'div'> & VariantProps<typeof cardVariants>;

/** Pass `render={<a href="…" />}` to make the whole card a link. */
function Card({ className, variant, size, interactive, render, ...props }: CardProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: cn(cardVariants({ variant, size, interactive }), className),
        'data-size': size ?? 'default',
      } as React.ComponentProps<'div'>,
      props,
    ),
    state: { slot: 'card' },
  });
}

/** Full-bleed media (image, video) at the top of a card. */
function CardMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-media"
      className={cn('relative w-full overflow-hidden', className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('text-lg leading-snug font-bold text-foreground', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-sm leading-relaxed text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-content" className={cn('px-(--card-spacing)', className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('mt-auto flex items-center gap-3 p-(--card-spacing) pt-0', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  cardVariants,
};
