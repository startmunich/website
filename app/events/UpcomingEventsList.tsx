'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '@/components/site/empty-state';
import { EventCard } from '@/components/site/event-card';
import { Button } from '@/components/ui/button';
import type { StartEvent } from '@/lib/eventTypes';
import { cn } from '@/lib/utils';

import { formatEventDate } from './formatEventDate';

/**
 * Presentational half of the upcoming-events grid. The page fetches on the server (see `./page`),
 * and only the mobile "show all" toggle needs to run in the browser.
 */

const MOBILE_LIMIT = 3;

export default function UpcomingEventsList({ events }: { events: StartEvent[] }) {
  const [showAll, setShowAll] = useState(false);

  if (events.length === 0) {
    return (
      <EmptyState
        data-testid="upcoming-events-empty"
        description="Nothing on the calendar right now — check back soon."
      />
    );
  }

  return (
    <div data-testid="upcoming-events">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            data-testid="upcoming-event"
            className={cn(!showAll && index >= MOBILE_LIMIT && 'hidden sm:block')}
          >
            <EventCard
              href={event.registrationUrl ?? undefined}
              title={event.title}
              date={formatEventDate(event.startAt)}
              imageUrl={event.coverImageUrl ?? undefined}
              className="h-full"
            />
          </div>
        ))}
      </div>

      {!showAll && events.length > MOBILE_LIMIT && (
        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" size="lg" shape="pill" onClick={() => setShowAll(true)}>
            See {events.length - MOBILE_LIMIT} more events
            <ChevronDownIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
