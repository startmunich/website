import * as React from 'react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

/** What a data-driven section shows when its source returned nothing. */
export function EmptyState({
  title,
  description,
  icon,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'title'> & {
  title?: React.ReactNode;
  description: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Empty className={cn('rounded-2xl border border-border bg-card py-14', className)} {...props}>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        {title && <EmptyTitle>{title}</EmptyTitle>}
        <EmptyDescription className="text-base">{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
