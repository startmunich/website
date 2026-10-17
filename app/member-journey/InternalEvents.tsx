'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { internalEvents, moreImages } from './data';

const ROTATE_MS = 3000;
/** Index one past the events: the "And a lot more..." row. */
const MORE_INDEX = internalEvents.length;

function EventRow({
  icon,
  title,
  description,
  frequency,
  active,
  onHover,
  onSelect,
}: {
  icon: string;
  title: string;
  description: string;
  frequency?: string;
  active: boolean;
  onHover: (hovering: boolean) => void;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors duration-200',
        active ? 'border-primary/30 bg-primary/10' : 'border-transparent hover:bg-accent',
      )}
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl text-xl transition-colors',
          active ? 'bg-primary/20' : 'bg-card',
        )}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              'font-bold transition-colors',
              active ? 'text-foreground' : 'text-foreground/85',
            )}
          >
            {title}
          </span>
          {frequency && (
            <Badge variant="soft" size="sm" className="h-5 border-transparent px-2">
              {frequency}
            </Badge>
          )}
        </span>
        <span className="text-sm leading-relaxed text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}

/**
 * The internal-events list with a photo panel. The panel auto-rotates through
 * the events; hovering an event previews it, clicking locks it until the user
 * clicks outside the section.
 */
export function InternalEvents() {
  const [rotateIndex, setRotateIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);

  const activeIndex = lockedIndex ?? hoveredIndex ?? rotateIndex;
  const interacting = lockedIndex !== null || hoveredIndex !== null;

  // Unlock when clicking outside the section
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node))
        setLockedIndex(null);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Auto-rotate while nobody is interacting; resume from the last active row
  useEffect(() => {
    if (interacting) {
      setRotateIndex(activeIndex);
      return;
    }
    const t = setInterval(() => setRotateIndex((i) => (i + 1) % (MORE_INDEX + 1)), ROTATE_MS);
    return () => clearInterval(t);
  }, [interacting, activeIndex]);

  useEffect(() => setImageIndex(0), [activeIndex]);

  const select = (index: number) => {
    setLockedIndex(index);
    setHoveredIndex(null);
    // On stacked layouts, bring the photo panel into view
    if (window.innerWidth < 1024 && imagePanelRef.current) {
      const y = imagePanelRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  const hover = (index: number) => (hovering: boolean) => {
    if (lockedIndex === null) setHoveredIndex(hovering ? index : null);
  };

  const activeEvent = activeIndex < MORE_INDEX ? internalEvents[activeIndex] : null;
  const images = activeEvent?.images ?? [];
  const idx = images.length ? imageIndex % images.length : 0;

  return (
    <div
      ref={sectionRef}
      // min-h, not h: the events list is taller than 620px at narrow desktop
      // widths, and the Card clips (overflow-hidden), which cut off the last
      // row's description. Let the grid grow instead of overflowing.
      className="grid grid-cols-1 items-stretch gap-6 lg:min-h-[620px] lg:grid-cols-2"
    >
      <Card size="lg" className="order-2 backdrop-blur-xs lg:order-1">
        <div className="flex flex-col gap-1 px-(--card-spacing)">
          {internalEvents.map((event, index) => (
            <EventRow
              key={event.id}
              icon={event.icon}
              title={event.title}
              description={event.description}
              frequency={event.frequency}
              active={activeIndex === index}
              onHover={hover(index)}
              onSelect={() => select(index)}
            />
          ))}
          <EventRow
            icon="✨"
            title="And a lot more..."
            description="Discover many more exciting events and opportunities."
            active={activeIndex === MORE_INDEX}
            onHover={hover(MORE_INDEX)}
            onSelect={() => select(MORE_INDEX)}
          />
        </div>
      </Card>

      <Card ref={imagePanelRef} className="relative order-1 h-72 py-0 lg:order-2 lg:h-auto">
        {activeEvent ? (
          images.length > 0 && (
            <div className="relative size-full">
              <Image
                key={images[idx]}
                src={images[idx]}
                alt={activeEvent.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover motion-safe:animate-in motion-safe:duration-700 motion-safe:fade-in"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6">
                <p className="font-bold text-white">{activeEvent.title}</p>
              </div>
              {images.length > 1 && (
                <>
                  <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
                    {(['prev', 'next'] as const).map((dir) => (
                      <Button
                        key={dir}
                        variant="outline"
                        size="icon-sm"
                        shape="pill"
                        aria-label={dir === 'prev' ? 'Previous image' : 'Next image'}
                        className="border-white/20 bg-black/40 text-white backdrop-blur-md hover:border-primary hover:bg-primary/80"
                        onClick={() =>
                          setImageIndex(
                            (i) => (dir === 'prev' ? i - 1 + images.length : i + 1) % images.length,
                          )
                        }
                      >
                        {dir === 'prev' ? (
                          <ChevronLeftIcon className="size-5" />
                        ) : (
                          <ChevronRightIcon className="size-5" />
                        )}
                      </Button>
                    ))}
                  </div>
                  <Badge
                    variant="glass"
                    size="sm"
                    className="absolute top-4 right-4 bg-black/40 tabular-nums"
                  >
                    {idx + 1} / {images.length}
                  </Badge>
                </>
              )}
            </div>
          )
        ) : (
          <div className="relative grid size-full grid-cols-2 grid-rows-2">
            {moreImages.map((src, i) => (
              <div key={src} className="relative overflow-hidden">
                <Image
                  src={src}
                  alt={`More activities ${i + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-background/20" />
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="rounded-2xl border border-primary/40 bg-black/70 px-8 py-4 text-2xl font-black text-white uppercase backdrop-blur-md">
                And more...
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
