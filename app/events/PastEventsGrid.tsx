'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LumaEventWrapper {
  api_id: string;
  event: {
    id: string;
    name: string;
    description?: string;
    description_md?: string;
    cover_url?: string;
    start_at: string;
    end_at: string;
    url: string;
    event_type?: string;
    timezone: string;
  };
  tags: string[];
}

const EVENTS_PER_PAGE = 12;

export default function PastEventsGrid() {
  const [events, setEvents] = useState<LumaEventWrapper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchPastEvents() {
      try {
        const response = await fetch('/api/luma/past-events');

        if (!response.ok) {
          throw new Error('Failed to fetch past events');
        }

        const data = await response.json();

        // Sort events by date (most recent first)
        const sortedEvents = (data.entries || []).sort(
          (a: LumaEventWrapper, b: LumaEventWrapper) => {
            return new Date(b.event.start_at).getTime() - new Date(a.event.start_at).getTime();
          },
        );

        setEvents(sortedEvents);
      } catch {
        setError('Unable to load past events');
      } finally {
        setLoading(false);
      }
    }

    fetchPastEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-white">Loading past events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 md:p-8">
        <div className="py-8 text-center">
          <p className="text-gray-400">{error}</p>
          <p className="mt-2 text-sm text-gray-500">
            Make sure LUMA_API_KEY is configured in your environment variables
          </p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 md:p-8">
        <div className="py-8 text-center">
          <p className="text-gray-400">No past events found</p>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const currentEvents = events.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Events Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {currentEvents.map((eventWrapper) => {
          const event = eventWrapper.event;

          return (
            <a
              key={eventWrapper.api_id}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 shadow-lg shadow-black/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40"
            >
              {/* Inset rounded image */}
              <div className="p-3 pb-0">
                <div className="relative overflow-hidden rounded-xl bg-black/20">
                  {event.cover_url ? (
                    <div className="relative aspect-square w-full">
                      <Image
                        src={event.cover_url}
                        alt={event.name}
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

              {/* Text content area */}
              <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
                <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-snug text-white">
                  {event.name}
                </h3>
                {/* {event.description && (
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">
                    {event.description}
                  </p>
                )} */}
              </div>
            </a>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
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

          {/* Page Numbers */}
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
                  onClick={() => goToPage(page)}
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

          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
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
