'use client';

import { useState } from 'react';

import UpcomingEventTile from '@/components/UpcomingEventTile';
import type { StartEvent } from '@/lib/eventTypes';

/**
 * Presentational half of the past-events grid. The page fetches on the server (see `./page`), and
 * only the page-number controls need to run in the browser.
 *
 * The cards are the shared `UpcomingEventTile` — the same component the upcoming grid uses. The
 * previous version hand-rolled a near-copy here and it had already drifted: a different `sizes`, a
 * different placeholder height, and `href="#"` on cards with no registration URL, which rendered a
 * link to nowhere.
 */

const EVENTS_PER_PAGE = 12;

function formatDate(startAt: string): string {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PastEventsList({ events }: { events: StartEvent[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (events.length === 0) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 md:p-8"
        data-testid="past-events-empty"
      >
        <div className="py-8 text-center">
          <p className="text-gray-400">No past events to show yet.</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * EVENTS_PER_PAGE;
  const pageEvents = events.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  return (
    <div data-testid="past-events">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pageEvents.map((event) => (
          <UpcomingEventTile
            key={event.id}
            // No registration URL means there is nothing to link to, so render a plain card rather
            // than an anchor to "#".
            href={event.registrationUrl ?? undefined}
            title={event.title}
            date={formatDate(event.startAt)}
            imageUrl={event.coverImageUrl ?? undefined}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
              page === 1
                ? 'cursor-not-allowed bg-white/5 text-gray-600'
                : 'bg-white/10 text-white hover:bg-[#d0006f]'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
              const showPage =
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= page - 1 && pageNumber <= page + 1);

              if (!showPage) {
                if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return (
                    <span key={pageNumber} className="px-1 text-gray-600">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  aria-label={`Page ${pageNumber}`}
                  aria-current={pageNumber === page}
                  className={`h-11 w-11 rounded-full text-sm font-bold transition-all duration-300 ${
                    pageNumber === page
                      ? 'bg-[#d0006f] text-white shadow-lg shadow-[#d0006f]/30'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
            className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
              page === totalPages
                ? 'cursor-not-allowed bg-white/5 text-gray-600'
                : 'bg-white/10 text-white hover:bg-[#d0006f]'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
