'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { StartEvent } from '@/lib/events';

/**
 * Presentational half of the past-events grid. The page fetches on the server (see
 * `./PastEventsGrid`), and only the page-number controls need to run in the browser.
 */

const EVENTS_PER_PAGE = 12;

export default function PastEventsList({ events }: { events: StartEvent[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (events.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 md:p-8">
        <div className="py-8 text-center">
          <p className="text-gray-400">No past events found</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const currentEvents = events.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  return (
    <div>
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {currentEvents.map((event) => (
          <a
            key={event.id}
            href={event.registrationUrl ?? '#'}
            target={event.registrationUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 shadow-lg shadow-black/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40"
          >
            <div className="p-3 pb-0">
              <div className="relative overflow-hidden rounded-xl bg-black/20">
                {event.coverImageUrl ? (
                  <div className="relative aspect-square w-full">
                    <Image
                      src={event.coverImageUrl}
                      alt={event.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 86vw, 300px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-36 rounded-xl bg-gradient-to-br from-[#1a1a3e] to-[#0a0a2e]" />
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
              <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-snug text-white">
                {event.title}
              </h3>
            </div>
          </a>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
              currentPage === 1
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-1 text-gray-600">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page}
                  className={`h-11 w-11 rounded-full text-sm font-bold transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-[#d0006f] text-white shadow-lg shadow-[#d0006f]/30'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
              currentPage === totalPages
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
