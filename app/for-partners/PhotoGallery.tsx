'use client';

import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 6;

const eventPhotos = [
  {
    id: 'ep1',
    url: '/forPartners/partnerEvents/RTSH-opt.jpg',
    caption: 'START Hack League Munich 26',
    href: 'https://app.hackleague.org/events/start?chapter=munich',
  },
  {
    id: 'ep2',
    url: '/forPartners/partnerEvents/RTSH2-opt.jpg',
    caption: 'START Hack League Munich 26',
    href: 'https://app.hackleague.org/events/start?chapter=munich',
  },
  {
    id: 'ep3',
    url: '/forPartners/partnerEvents/RTSS1-opt.jpg',
    caption: 'Road to START Summit 26',
    href: '/eventpage/rtss',
  },
  {
    id: 'ep4',
    url: '/forPartners/partnerEvents/RTSS2-opt.jpg',
    caption: 'Road to START Summit 26',
    href: '/eventpage/rtss',
  },
  {
    id: 'ep5',
    url: '/forPartners/partnerEvents/PitchUNetwork-opt.jpg',
    caption: 'Pitch & Network',
  },
  {
    id: 'ep6',
    url: '/forPartners/partnerEvents/MHL1-opt.jpg',
    caption: 'Munich Hacking Legal 25',
  },
  {
    id: 'ep7',
    url: '/forPartners/partnerEvents/MHL2-opt.jpg',
    caption: 'Munich Hacking Legal 25',
  },
  {
    id: 'ep8',
    url: '/forPartners/partnerEvents/IsarUnfiltered-opt.jpg',
    caption: 'Isar Unfiltered',
  },
  {
    id: 'ep9',
    url: '/forPartners/partnerEvents/IsarUnfiltered2-opt.jpg',
    caption: 'Isar Unfiltered',
  },
  {
    id: 'ep10',
    url: '/forPartners/partnerEvents/FounderFailTails-opt.jpg',
    caption: 'Founder Fail Tales',
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

/** Partner photos from recent events, six at a time. */
export default function PhotoGallery() {
  // A page index, not a scroll offset: the last page starts at
  // (photos.length - 1) * PAGE_SIZE, which isn't a multiple of PAGE_SIZE, so
  // deriving the page number from an offset reported the last page as page 1.
  const pageCount = Math.ceil(eventPhotos.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const start = page * PAGE_SIZE;

  return (
    <section>
      <SectionHeader
        eyebrow="Gallery"
        title={
          <>
            Partners at <span className="text-outline">our events</span>
          </>
        }
        description="Highlights from recent partner collaborations and events"
        actions={
          <>
            <span className="text-sm text-muted-foreground tabular-nums">
              {pad(page + 1)} / {pad(pageCount)}
            </span>
            <Button
              variant="outline"
              size="icon-lg"
              shape="pill"
              aria-label="Previous photos"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeftIcon className="size-5" />
            </Button>
            <Button
              size="icon-lg"
              shape="pill"
              aria-label="Next photos"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
            >
              <ChevronRightIcon className="size-5" />
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {eventPhotos.map((photo, index) => {
          const visible = index >= start && index < start + PAGE_SIZE;
          const content = (
            <>
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="absolute inset-x-0 bottom-0 p-6 text-lg font-bold">{photo.caption}</p>
              </div>
              {photo.href && (
                <span className="absolute top-4 right-4 flex size-10 scale-50 items-center justify-center rounded-full bg-foreground/10 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <ArrowUpRightIcon className="size-4" />
                </span>
              )}
            </>
          );
          const classes = cn(
            'group relative block aspect-video overflow-hidden rounded-3xl border border-border shadow-lg transition-all duration-300 hover:border-primary/40 hover:shadow-primary/10',
            !visible && 'hidden',
          );
          return photo.href ? (
            <Link key={photo.id} href={photo.href} className={classes}>
              {content}
            </Link>
          ) : (
            <div key={photo.id} className={classes}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
