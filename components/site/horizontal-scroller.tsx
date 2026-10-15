'use client';

import * as React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/**
 * A horizontally scrolling row (timelines, event strips) with a brand-coloured
 * scrollbar. Mouse users can also drag the row; touch and trackpads scroll
 * natively.
 */
export function HorizontalScroller({
  children,
  className,
  contentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ x: number; scrollLeft: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !viewportRef.current) return;
    drag.current = { x: e.clientX, scrollLeft: viewportRef.current.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !viewportRef.current) return;
    e.preventDefault();
    viewportRef.current.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.x);
  };
  const endDrag = () => {
    drag.current = null;
  };

  return (
    <ScrollArea
      orientation="horizontal"
      viewportRef={viewportRef}
      className={cn(
        '[--scroll-thumb:color-mix(in_oklab,var(--primary)_55%,transparent)]',
        className,
      )}
      viewportClassName="cursor-grab pb-6 select-none active:cursor-grabbing"
      scrollbarClassName="rounded-full bg-muted data-horizontal:h-1.5 data-horizontal:p-0"
    >
      <div
        className={cn('flex w-max gap-5', contentClassName)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {children}
      </div>
    </ScrollArea>
  );
}
