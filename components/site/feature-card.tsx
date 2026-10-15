import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const iconVariants = cva('flex shrink-0 items-center justify-center rounded-2xl bg-primary/15', {
  variants: {
    size: {
      default: 'size-14 text-3xl',
      lg: 'size-20 rounded-3xl text-5xl',
    },
  },
  defaultVariants: { size: 'default' },
});

type FeatureCardProps = VariantProps<typeof iconVariants> & {
  /** An emoji or an SVG icon. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  /** `highlight` for the lead tile in a bento grid. */
  variant?: 'default' | 'highlight';
  /** `row` puts the icon beside the copy, for wide tiles. */
  layout?: 'column' | 'row';
  /** Extra content above the title (logos, media). */
  children?: React.ReactNode;
  className?: string;
};

/** An icon, a title and a sentence or two: the tile used in "why us" and "what you get" grids. */
export function FeatureCard({
  icon,
  title,
  description,
  variant = 'default',
  layout = 'column',
  size,
  children,
  className,
}: FeatureCardProps) {
  const highlight = variant === 'highlight';
  return (
    <Card
      variant={highlight ? 'highlight' : 'default'}
      size="lg"
      interactive
      className={cn('group/card h-full justify-center backdrop-blur-xs', className)}
    >
      <div
        className={cn(
          'flex gap-4 px-(--card-spacing)',
          layout === 'row' ? 'flex-row items-center gap-6' : 'flex-col',
        )}
      >
        {children}
        {icon && <div className={iconVariants({ size })}>{icon}</div>}
        <div className="flex flex-col gap-2">
          <h3
            className={cn(
              'leading-snug text-foreground transition-colors group-hover/card:text-primary',
              highlight ? 'text-2xl font-black uppercase' : 'text-lg font-bold lg:text-xl',
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              'leading-relaxed',
              highlight ? 'text-foreground/75' : 'text-sm text-muted-foreground',
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
