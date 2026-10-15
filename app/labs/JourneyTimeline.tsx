'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { LabsLabel } from './components';
import { timelineItems } from './data';

/** The eight-week roadmap: pick a milestone on the line to see what happens that week. */
export function JourneyTimeline() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const item = expanded !== null ? timelineItems[expanded] : null;

  return (
    <div className="relative">
      <div className="relative mb-20 h-0.5 rounded-full">
        <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/30 via-primary/60 to-primary/30" />
        <div className="absolute inset-0 flex justify-between">
          {timelineItems.map((milestone, index) => {
            const active = expanded === index;
            return (
              <button
                key={milestone.week}
                type="button"
                aria-pressed={active}
                aria-label={`${milestone.week}: ${milestone.title}`}
                onClick={() => setExpanded(active ? null : index)}
                className="group relative outline-none"
              >
                <span
                  className={cn(
                    'absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[clamp(10px,2vw,13px)] font-medium whitespace-nowrap transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {milestone.week}
                </span>
                <span
                  className={cn(
                    'block size-3 -translate-y-1/2 rounded-full transition-all duration-300 group-focus-visible:ring-3 group-focus-visible:ring-ring/50',
                    active
                      ? 'scale-150 bg-primary shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_40%,transparent)]'
                      : 'bg-foreground/40 group-hover:scale-125',
                  )}
                />
                <span className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[clamp(7px,1.5vw,9px)] tracking-widest whitespace-nowrap text-muted-foreground/60 uppercase">
                  {milestone.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[420px]">
        {item ? (
          <div
            key={item.week}
            className="border border-l-2 border-foreground/5 border-l-primary bg-foreground/2 p-6 motion-safe:animate-fade-in-up sm:p-10"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative aspect-4/3 overflow-hidden border border-foreground/10">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-70 transition-all duration-500 hover:scale-105 hover:opacity-90"
                />
              </div>
              <div className="flex flex-col gap-4">
                <LabsLabel size="xs">
                  {item.week} · {item.tag}
                </LabsLabel>
                <h3 className="text-[clamp(20px,2.5vw,24px)] font-bold text-foreground uppercase">
                  {item.title}
                </h3>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
                <div className="mt-2 flex flex-col gap-3">
                  <LabsLabel size="xs" className="text-muted-foreground/60">
                    What happens
                  </LabsLabel>
                  <ul className="flex flex-col gap-2">
                    {item.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2 font-mono text-xs text-muted-foreground"
                      >
                        <span className="text-primary">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="pt-12 text-center font-mono text-xs text-muted-foreground/60">
            Click any week to see details
          </p>
        )}
      </div>
    </div>
  );
}
