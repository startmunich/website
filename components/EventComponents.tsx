import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Event Card Component
export interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    month: string;
    image: string;
    category: string;
  };
  index: number;
  hoveredEvent: string | null;
  setHoveredEvent: (id: string | null) => void;
  isFlagship?: boolean;
  className?: string;
  onClick?: () => void;
  ctaLabel?: string;
  ctaHref?: string;
  ctaDisabledLabel?: string;
}

export const EventCard = ({
  event,
  index,
  hoveredEvent,
  setHoveredEvent,
  isFlagship = false,
  className = '',
  onClick,
  ctaLabel,
  ctaHref,
  ctaDisabledLabel,
}: EventCardProps) => {
  const isHovered = hoveredEvent === event.id;

  const wrapperClassName = `flex flex-col flex-shrink-0 ${isFlagship ? 'w-[78vw] sm:w-[340px]' : 'w-[58vw] sm:w-[240px]'} group relative ${isFlagship ? 'bg-gradient-to-br from-[#d0006f]/10 via-white/5 to-[#d0006f]/5' : 'bg-white/5'} overflow-hidden rounded-[1.75rem] border-2 transition-all duration-500 ${isHovered ? 'border-[#d0006f]' : 'border-transparent'} ${onClick && isHovered ? 'scale-[1.02] shadow-2xl shadow-black/40' : 'shadow-xl shadow-black/20'} ${onClick ? 'cursor-pointer' : ''} ${className} `;

  const cardContent = (
    <>
      {/* Full card background image */}
      <div className={`relative ${isFlagship ? 'h-[240px]' : 'h-[200px]'} w-full overflow-hidden`}>
        <Image
          src={event.image}
          alt={event.name}
          fill
          sizes={isFlagship ? '(max-width: 640px) 78vw, 340px' : '(max-width: 640px) 58vw, 240px'}
          className={`object-cover transition-transform duration-700 ease-out ${onClick ? 'group-hover:scale-110' : ''}`}
        />

        {/* Top gradient for category badge */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

        {/* Bottom gradient for text overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Category badge - top left */}
      </div>

      {/* Text content area */}
      <div className="flex flex-1 flex-col px-6 py-4">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-[#d0006f]">
          {event.category}
        </span>
        <h3 className="mb-1 text-lg font-black leading-tight text-white">{event.name}</h3>
        <p className="mb-2 whitespace-pre-line text-xs font-medium text-white/40">{event.month}</p>
        <p className="flex-1 text-sm leading-relaxed text-gray-400">{event.description}</p>
        {ctaLabel ? (
          <div className="mt-4 border-t border-white/10 pt-4">
            {ctaHref ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block w-full rounded-full bg-[#d0006f] px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#d0006f]/80 hover:shadow-lg hover:shadow-[#d0006f]/30"
              >
                {ctaLabel}
              </a>
            ) : (
              <span className="block w-full cursor-not-allowed rounded-full bg-white/10 px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-white/40">
                {ctaDisabledLabel ?? ctaLabel}
              </span>
            )}
          </div>
        ) : (
          onClick && (
            <div className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3 text-xs font-medium text-white/50">
              <span>Learn more</span>
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          )
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        data-event-id={event.id}
        onMouseEnter={() => setHoveredEvent(event.id)}
        onMouseLeave={() => setHoveredEvent(null)}
        onClick={onClick}
        className={`${wrapperClassName} appearance-none p-0 text-left`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div
      data-event-id={event.id}
      onMouseEnter={() => setHoveredEvent(event.id)}
      onMouseLeave={() => setHoveredEvent(null)}
      className={wrapperClassName}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {cardContent}
    </div>
  );
};

// Special Event Card Component
export interface SpecialEventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    category: string;
    image: string;
  };
  index?: number;
  className?: string;
}

export const SpecialEventCard = ({ event, index = 0, className = '' }: SpecialEventCardProps) => {
  return (
    <div
      className={`group relative w-[90%] flex-shrink-0 overflow-hidden rounded-[1.75rem] shadow-xl shadow-black/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 sm:w-[400px] ${className} `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Full card image area */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.name}
          fill
          sizes="(max-width: 640px) 90vw, 400px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Category badge - top left */}
        <div className="absolute left-5 top-5">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {event.category}
          </span>
        </div>

        {/* Bottom text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="mb-1 text-xl font-black leading-tight text-white drop-shadow-lg">
            {event.name}
          </h3>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="bg-[#0a0a2e] px-6 py-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">{event.description}</p>
      </div>
    </div>
  );
};

// Timeline Marker Component
export interface TimelineMarkerProps {
  eventId: string;
  left: string;
  color: string;
  label: string;
  position: 'top' | 'bottom';
  size?: 'sm' | 'lg';
  hoveredEvent: string | null;
  onHover: (eventId: string) => void;
  onLeave: () => void;
}

export const TimelineMarker = ({
  eventId,
  left,
  color,
  label,
  position,
  size = 'sm',
  hoveredEvent,
  onHover,
  onLeave,
}: TimelineMarkerProps) => {
  const isHovered = hoveredEvent === eventId;
  const positionClass =
    position === 'top'
      ? `${size === 'lg' ? '-top-12' : '-top-10'}`
      : `${size === 'lg' ? '-bottom-12' : '-bottom-10'}`;

  return (
    <div
      className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${isHovered ? 'z-10 scale-150' : 'hover:scale-125'}`}
      style={{ left }}
      onMouseEnter={() => onHover(eventId)}
      onMouseLeave={onLeave}
    >
      <div className="relative">
        <div
          className={`h-4 w-4 rounded-full transition-all ${isHovered ? 'ring-4' : ''}`}
          style={{
            backgroundColor: color,
            ...(isHovered && { boxShadow: `0 0 0 4px ${color}80` }),
          }}
        ></div>
        <div className={`absolute ${positionClass} left-1/2 -translate-x-1/2 whitespace-nowrap`}>
          <div className="rounded-full border border-white/10 bg-[#0a0a2e] px-3.5 py-1.5 text-xs shadow-lg shadow-black/20">
            <p className="font-bold text-white">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Scroll Indicator Component
export interface ScrollIndicatorProps {
  sliderRef: React.RefObject<HTMLDivElement | null>;
  scrollProgress?: number;
}

export const ScrollIndicator = ({ sliderRef }: ScrollIndicatorProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [thumbState, setThumbState] = useState({ width: 30, left: 0 });

  const updateThumb = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const { scrollLeft, scrollWidth, clientWidth } = slider;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setThumbState({ width: 100, left: 0 });
      return;
    }
    const ratio = clientWidth / scrollWidth;
    const progress = scrollLeft / maxScroll;
    setThumbState({
      width: ratio * 100,
      left: progress * (1 - ratio) * 100,
    });
  }, [sliderRef]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener('scroll', updateThumb);
    updateThumb();

    const observer = new ResizeObserver(updateThumb);
    observer.observe(slider);

    return () => {
      slider.removeEventListener('scroll', updateThumb);
      observer.disconnect();
    };
  }, [sliderRef, updateThumb]);

  const scrollToRatio = (clientX: number) => {
    const track = trackRef.current;
    const slider = sliderRef.current;
    if (!track || !slider) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    slider.scrollLeft = ratio * (slider.scrollWidth - slider.clientWidth);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    scrollToRatio(e.clientX);
    const onMove = (ev: MouseEvent) => {
      if (isDragging.current) scrollToRatio(ev.clientX);
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      ref={trackRef}
      className="relative mt-8 h-1.5 cursor-pointer overflow-hidden rounded-full bg-white/[0.06]"
      onMouseDown={handleMouseDown}
    >
      <div
        className="pointer-events-none absolute h-full rounded-full"
        style={{
          background: 'linear-gradient(to right, #d0006f, rgb(236, 72, 153), #d0006f)',
          opacity: 0.5,
          width: `${thumbState.width}%`,
          left: `${thumbState.left}%`,
        }}
      />
    </div>
  );
};
