'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

const eventPhotos = [
  {
    id: 'ep1',
    url: '/forPartners/partnerEvents/RTSH-opt.jpg',
    caption: 'Road to START Hack 26',
    href: '/eventpage/rtsh',
  },
  {
    id: 'ep2',
    url: '/forPartners/partnerEvents/RTSH2-opt.jpg',
    caption: 'Road to START Hack 26',
    href: '/eventpage/rtsh',
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
    href: '/events/leagel-hack',
  },
  {
    id: 'ep7',
    url: '/forPartners/partnerEvents/MHL2-opt.jpg',
    caption: 'Munich Hacking Legal 25',
    href: '/events/leagel-hack',
  },
  {
    id: 'ep8',
    url: '/forPartners/partnerEvents/IsarUnfiltered-opt.jpg',
    caption: 'Isar Unfiltered',
    href: '/events/iu/home',
  },
  {
    id: 'ep9',
    url: '/forPartners/partnerEvents/IsarUnfiltered2-opt.jpg',
    caption: 'Isar Unfiltered',
    href: '/events/iu/home',
  },
  {
    id: 'ep10',
    url: '/forPartners/partnerEvents/FounderFailTails-opt.jpg',
    caption: 'Founder Fail Tales',
    href: '/events/founder-fail-tales-4',
  },
];

export default function PhotoGallery() {
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <section>
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
            Gallery
          </p>
          <h2 className="mb-3 text-3xl font-black text-white md:text-4xl">
            PARTNERS AT <span className="outline-text">OUR EVENTS</span>
          </h2>
          <p className="max-w-3xl text-lg text-gray-400">
            Highlights from recent partner collaborations and events
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-3">
          <span className="text-sm tabular-nums text-gray-500">
            {String(Math.floor(photoIndex / 6) + 1).padStart(2, '0')} /{' '}
            {String(Math.ceil(eventPhotos.length / 6)).padStart(2, '0')}
          </span>
          <button
            onClick={() => setPhotoIndex(Math.max(0, photoIndex - 6))}
            disabled={photoIndex === 0}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 text-white transition-all duration-300 hover:border-brand-pink hover:bg-brand-pink disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => setPhotoIndex(Math.min(eventPhotos.length - 6, photoIndex + 6))}
            disabled={photoIndex + 6 >= eventPhotos.length}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink text-white transition-all duration-300 hover:bg-brand-pink/80 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {eventPhotos.map((photo, index) => {
          const isVisible = index >= photoIndex && index < photoIndex + 6;
          const Wrapper = photo.href ? 'a' : 'div';
          const wrapperProps = photo.href ? { href: photo.href } : {};
          return (
            <Wrapper
              key={photo.id}
              {...wrapperProps}
              className={cn(
                'group relative block aspect-video overflow-hidden rounded-3xl border border-white/10 shadow-lg transition-all duration-300 hover:border-brand-pink/40 hover:shadow-brand-pink/10',
                !isVisible && 'hidden',
              )}
            >
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-brand-dark-blue via-brand-dark-blue/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-lg font-bold text-white">{photo.caption}</p>
                </div>
              </div>
              {photo.href && (
                <div className="absolute right-4 top-4 flex h-10 w-10 scale-50 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </div>
              )}
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}
