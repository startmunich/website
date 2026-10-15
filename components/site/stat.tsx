'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/typography';
import { useAnimatedNumber, useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/** Counts up from zero the first time it scrolls into view. */
function AnimatedNumber({ value, duration = 1800 }: { value: number; duration?: number }) {
  const { ref, visible } = useInView(0.25);
  const current = useAnimatedNumber(value, !visible, duration);
  return (
    <span ref={ref} className="tabular-nums">
      {current}
    </span>
  );
}

const statValueVariants = cva('leading-none font-black tracking-tight text-foreground', {
  variants: {
    size: {
      sm: 'text-4xl sm:text-5xl',
      default: 'text-5xl sm:text-6xl',
      lg: 'text-7xl sm:text-8xl lg:text-[7.5rem]',
    },
  },
  defaultVariants: { size: 'default' },
});

type StatValueProps = VariantProps<typeof statValueVariants> & {
  value: React.ReactNode;
  /** A number here counts up on first view; anything else renders as is. */
  animate?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
};

/** A big figure with brand-coloured affixes: €3B+, 600+, 65%. */
function StatValue({
  value,
  animate = false,
  prefix,
  suffix,
  size,
  className,
  ...props
}: StatValueProps) {
  return (
    <span className={cn(statValueVariants({ size }), className)}>
      {prefix}
      <span data-testid={props['data-testid']}>
        {animate && typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </span>
      {suffix && <span className="text-primary">{suffix}</span>}
    </span>
  );
}

type StatCardProps = Omit<StatValueProps, 'className'> & {
  label: React.ReactNode;
  variant?: 'default' | 'highlight' | 'glass';
  align?: 'start' | 'center';
  /** Decoration under the value (progress bar, icon row). */
  children?: React.ReactNode;
  /** Trailing icon, aligned to the value. */
  icon?: React.ReactNode;
  className?: string;
};

/**
 * A labelled figure on a card. `glass` is for hero overlays, `highlight` for
 * the one featured stat in a grid.
 */
function StatCard({
  label,
  variant = 'default',
  align = 'start',
  size = 'sm',
  icon,
  children,
  className,
  ...valueProps
}: StatCardProps) {
  const labelFirst = variant !== 'glass';
  const labelNode = <Text variant="label">{label}</Text>;
  return (
    <Card
      variant={variant}
      size={variant === 'highlight' ? 'lg' : 'default'}
      interactive={variant === 'default'}
      className={cn(
        'h-full justify-between',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-3 px-(--card-spacing)',
          align === 'center' && 'items-center',
        )}
      >
        {labelFirst && labelNode}
        <div className="flex items-end justify-between gap-4">
          <StatValue size={size} {...valueProps} />
          {icon && (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-7">
              {icon}
            </div>
          )}
        </div>
        {!labelFirst && labelNode}
        {children}
      </div>
    </Card>
  );
}

/** The stat column on the right of a <PageHero>. Two-up on mobile, stacked on desktop. */
function HeroStats({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-6', className)}
      {...props}
    />
  );
}

function HeroStat(props: Omit<StatCardProps, 'variant' | 'align' | 'size'>) {
  return <StatCard variant="glass" align="center" size="sm" className="lg:min-w-64" {...props} />;
}

export { AnimatedNumber, HeroStat, HeroStats, StatCard, StatValue, statValueVariants };
