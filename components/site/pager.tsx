'use client';

import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

/**
 * Client-side page controls: first, last, and one page either side of the
 * current one, with ellipses between. Renders nothing for a single page.
 */
export function Pager({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className={cn('mt-10', className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => onPageChange(page - 1)} disabled={page === 1} />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
          const visible = n === 1 || n === totalPages || Math.abs(n - page) <= 1;
          if (!visible) {
            return Math.abs(n - page) === 2 ? (
              <PaginationItem key={n}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : null;
          }
          return (
            <PaginationItem key={n}>
              <PaginationButton
                isActive={n === page}
                aria-label={`Page ${n}`}
                onClick={() => onPageChange(n)}
              >
                {n}
              </PaginationButton>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext onClick={() => onPageChange(page + 1)} disabled={page === totalPages} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
