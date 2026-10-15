'use client';

import { useState } from 'react';

import { EmptyState } from '@/components/site/empty-state';
import { EventCard } from '@/components/site/event-card';
import { Pager } from '@/components/site/pager';
import type { StartEvent } from '@/lib/eventTypes';

import { formatEventDate } from './formatEventDate';

/**
 * Presentational half of the past-events grid. The page fetches on the server (see `./page`), and
 * only the page-number controls need to run in the browser. Cards are the shared `EventCard`, the
 * same component the upcoming grid uses, so the two can't drift apart.
 */

const EVENTS_PER_PAGE = 12;

export default function PastEventsList({ events }: { events: StartEvent[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (events.length === 0) {
    return <EmptyState data-testid="past-events-empty" description="No past events to show yet." />;
  }

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * EVENTS_PER_PAGE;
  const pageEvents = events.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  return (
    <div data-testid="past-events">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pageEvents.map((event) => (
          <EventCard
            key={event.id}
            // No registration URL means there is nothing to link to: a plain card, not href="#".
            href={event.registrationUrl ?? undefined}
            title={event.title}
            date={formatEventDate(event.startAt)}
            imageUrl={event.coverImageUrl ?? undefined}
          />
        ))}
      </div>

      <Pager page={page} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
