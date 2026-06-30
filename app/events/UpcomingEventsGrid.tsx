'use client';

import { useEffect, useState } from 'react';

import UpcomingEventTile from '@/components/UpcomingEventTile';

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

export default function UpcomingEventsGrid() {
  const [events, setEvents] = useState<LumaEventWrapper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const mobileLimit = 3;

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const response = await fetch('/api/luma/upcoming-events');

        if (!response.ok) {
          throw new Error('Failed to fetch upcoming events');
        }

        const data = await response.json();

        // Sort events by date (soonest first)
        const sortedEvents = (data.entries || []).sort(
          (a: LumaEventWrapper, b: LumaEventWrapper) => {
            return new Date(a.event.start_at).getTime() - new Date(b.event.start_at).getTime();
          },
        );

        setEvents(sortedEvents);
      } catch {
        setError('Unable to load upcoming events');
      } finally {
        setLoading(false);
      }
    }

    fetchUpcomingEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-white">Loading upcoming events...</div>
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
          <p className="text-gray-400">No upcoming events found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((eventWrapper, index) => {
          const event = eventWrapper.event;
          const hiddenOnMobile = !showAll && index >= mobileLimit;

          // Format date for subheader
          let formattedDate = '';
          try {
            const dateStr = event.start_at;
            if (dateStr) {
              const eventDate = new Date(dateStr);
              if (!isNaN(eventDate.getTime())) {
                formattedDate = eventDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              }
            }
          } catch {
            // ignore
          }

          return (
            <UpcomingEventTile
              key={eventWrapper.api_id}
              href={event.url}
              title={event.name}
              date={formattedDate}
              imageUrl={event.cover_url}
              hiddenClassName={hiddenOnMobile ? 'hidden sm:flex' : ''}
            />
          );
        })}
      </div>

      {/* See more button - mobile only */}
      {!showAll && events.length > mobileLimit && (
        <div className="mt-6 text-center md:hidden">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-[#d0006f] hover:bg-[#d0006f]"
          >
            See {events.length - mobileLimit} more events
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
