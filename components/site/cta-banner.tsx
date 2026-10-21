import * as React from 'react';

import { ButtonLink } from '@/components/ui/button';
import { Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export interface CtaAction {
  label: string;
  href: string;
  variant?: 'default' | 'soft';
  external?: boolean;
}

type CtaBannerProps = {
  /** Small label above the title, e.g. a <Badge>. */
  badge?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  actions: CtaAction[];
  layout?: 'centered' | 'split';
  className?: string;
};

/**
 * The brand's feature surface: navy gradient, pink border and glow. Used by
 * <CtaBanner> and by one-off callouts that need the same weight.
 */
export function BrandPanel({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border-2 border-primary/50 bg-linear-to-br from-surface via-background to-background p-8 shadow-2xl shadow-primary/20 md:p-12',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="absolute top-0 right-0 size-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 size-48 rounded-full bg-primary/5 blur-3xl"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/** The closing call to action at the bottom of a page. */
export function CtaBanner({
  badge,
  title,
  description,
  actions,
  layout = 'centered',
  className,
}: CtaBannerProps) {
  const centered = layout === 'centered';
  return (
    <BrandPanel className={className}>
      <div
        className={cn(
          'flex flex-col items-center gap-8',
          centered ? 'text-center' : 'justify-between md:flex-row',
        )}
      >
        <div
          className={cn(
            'flex flex-1 flex-col gap-4',
            centered ? 'items-center' : 'items-center text-center md:items-start md:text-left',
          )}
        >
          {badge}
          <Heading as="h2" size="h3">
            {title}
          </Heading>
          <Text variant={centered ? 'lead' : 'body'} className="max-w-2xl">
            {description}
          </Text>
        </div>
        <div className={cn('flex shrink-0 flex-col gap-3 sm:flex-row', centered && 'pt-2')}>
          {actions.map((action, i) => (
            <ButtonLink
              key={action.href}
              href={action.href}
              external={action.external}
              variant={action.variant ?? (i === 0 ? 'default' : 'soft')}
              size="lg"
              shape="pill"
            >
              {action.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </BrandPanel>
  );
}
