'use client';

import { useState } from 'react';

import UpcomingEventTile from '@/components/UpcomingEventTile';
import type { StartEvent } from '@/lib/events';

/**
 * Presentational half of the upcoming-events grid. The page fetches on the server (see
 * `./UpcomingEventsGrid`), and only the mobile "show all" toggle needs to run in the browser.
 */

const MOBILE_LIMIT = 3;

function formatDate(startAt: string): string {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function UpcomingEventsList({ events }: { events: StartEvent[] }) {
  const [showAll, setShowAll] = useState(false);

  if (events.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 md:p-8">
        <div className="py-8 text-center">
          <p className="text-gray-400">No upcoming events found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((event, index) => {
          const hiddenOnMobile = !showAll && index >= MOBILE_LIMIT;

          return (
            <UpcomingEventTile
              key={event.id}
              href={event.registrationUrl ?? undefined}
              title={event.title}
              date={formatDate(event.startAt)}
              imageUrl={event.coverImageUrl ?? undefined}
              hiddenClassName={hiddenOnMobile ? 'hidden sm:flex' : ''}
            />
          );
        })}
      </div>

      {!showAll && events.length > MOBILE_LIMIT && (
        <div className="mt-6 text-center md:hidden">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-[#d0006f] hover:bg-[#d0006f]"
          >
            See {events.length - MOBILE_LIMIT} more events
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
