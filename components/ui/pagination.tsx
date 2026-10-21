import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationButtonProps = React.ComponentProps<typeof Button> & { isActive?: boolean };

/** A page control. Client-side pagers use buttons; pass `render={<a href />}` for URL-driven paging. */
function PaginationButton({ className, isActive, ...props }: PaginationButtonProps) {
  return (
    <Button
      data-slot="pagination-button"
      aria-current={isActive ? 'page' : undefined}
      variant={isActive ? 'default' : 'outline'}
      size="icon"
      shape="pill"
      className={cn(isActive && 'shadow-lg shadow-primary/30', className)}
      {...props}
    />
  );
}

function PaginationPrevious(props: Omit<PaginationButtonProps, 'children'>) {
  return (
    <PaginationButton aria-label="Previous page" {...props}>
      <ChevronLeftIcon className="size-5" />
    </PaginationButton>
  );
}

function PaginationNext(props: Omit<PaginationButtonProps, 'children'>) {
  return (
    <PaginationButton aria-label="Next page" {...props}>
      <ChevronRightIcon className="size-5" />
    </PaginationButton>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center text-muted-foreground', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
};
