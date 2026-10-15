'use client';

import { useState } from 'react';

import { Card } from '@/components/ui/card';
import { groupMarkersByMonth, monthLabels } from '@/lib/eventCalendar';
import { cn } from '@/lib/utils';

import type { EventsContentProps } from './EventsContent';

type Marker = EventsContentProps['markers'][number];

interface TimelineMarkerProps {
  marker: Marker;
  hovered: boolean;
  onHover: (eventId: string | null) => void;
}

function TimelineMarker({ marker, hovered, onHover }: TimelineMarkerProps) {
  // Near either edge the nowrap pill anchors to that edge instead of centring,
  // so a late-December label doesn't hang off the card.
  const percent = Number.parseFloat(marker.left);
  const pillAnchor =
    !Number.isFinite(percent) || (percent > 12 && percent < 88)
      ? 'left-1/2 -translate-x-1/2'
      : percent <= 12
        ? 'left-0'
        : 'right-0';

  return (
    <div
      className={cn(
        'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all',
        hovered ? 'z-10 scale-150' : 'hover:scale-125',
      )}
      // The dot is 16px and centred on `left`; clamping keeps 31 December on the
      // line. Runtime position, hence inline.
      style={{ left: `clamp(0.5rem, ${marker.left}, calc(100% - 0.5rem))` }}
      onMouseEnter={() => onHover(marker.eventId)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative">
        {/* Event colour comes from the CMS, so it is set at runtime. */}
        <div
          className="size-4 rounded-full transition-all"
          style={{
            backgroundColor: marker.color,
            boxShadow: hovered ? `0 0 0 4px ${marker.color}80` : undefined,
          }}
        />
        <div
          className={cn(
            'absolute whitespace-nowrap',
            marker.side === 'top' ? '-top-10' : '-bottom-10',
            pillAnchor,
          )}
        >
          <div className="rounded-full border border-border bg-popover px-3.5 py-1.5 text-xs shadow-lg shadow-black/20">
            <p className="font-bold text-foreground">{marker.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The annual calendar strip: a 12-month line on desktop, a month list on mobile. */
export function EventTimeline({ markers }: { markers: Marker[] }) {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const months = monthLabels();
  const monthGroups = groupMarkersByMonth(markers);

  return (
    <Card size="lg" className="bg-card/60 backdrop-blur-xs">
      <div className="px-(--card-spacing)">
        <div className="hidden md:block" data-testid="events-calendar">
          <div className="mb-6 grid grid-cols-12 gap-2 text-center">
            {months.map((month) => (
              <div key={month} className="text-sm text-muted-foreground">
                {month}
              </div>
            ))}
          </div>

          <div className="relative mt-16 mb-20 h-3 rounded-full bg-muted">
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/30 via-primary/20 to-primary/30" />
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 h-6 w-px -translate-y-1/2 bg-foreground/20"
                // Clamped so the final tick stays strictly inside the strip.
                style={{ left: `clamp(0, calc(${(i + 1) * 8.33}% - 0.5px), calc(100% - 1px))` }}
              />
            ))}
            {markers.map((marker) => (
              <TimelineMarker
                key={`${marker.eventId}-${marker.month}-${marker.day}`}
                marker={marker}
                hovered={hoveredEvent === marker.eventId}
                onHover={setHoveredEvent}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:hidden" data-testid="events-calendar-mobile">
          {monthGroups.map((group) => (
            <div key={group.month} className="flex items-start gap-4 rounded-2xl bg-muted p-4">
              <div className="w-14 shrink-0 text-sm font-bold text-muted-foreground">
                {months[group.month - 1]}
              </div>
              <div className="flex flex-col gap-2">
                {group.markers.map((marker) => (
                  <div key={marker.eventId} className="flex items-center gap-2">
                    <div
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: marker.color }}
                    />
                    <span className="text-sm text-foreground">{marker.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
