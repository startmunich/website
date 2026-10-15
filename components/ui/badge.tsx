import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent font-semibold whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3.5',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/85',
        secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        soft: 'border-primary/30 bg-primary/10 text-primary [a]:hover:bg-primary/20',
        outline: 'border-primary/30 text-foreground [a]:hover:bg-primary/10',
        glass: 'border-border bg-card text-foreground backdrop-blur-sm [a]:hover:border-primary/50',
        success: 'border-success/30 bg-success/15 text-success',
        destructive: 'bg-destructive/15 text-destructive',
      },
      size: {
        sm: 'h-6 px-2.5 text-xs',
        default: 'h-8 px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  size = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      { className: cn(badgeVariants({ variant, size }), className) },
      props,
    ),
    render,
    state: { slot: 'badge', variant },
  });
}

export { Badge, badgeVariants };
