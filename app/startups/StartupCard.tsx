'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

interface Founder {
  name: string;
  imageUrl: string;
  linkedinUrl?: string;
}

function FounderAvatar({ name, imageUrl }: { name: string; imageUrl: string }) {
  const [src, setSrc] = useState(imageUrl);
  // Reset the displayed src when the prop changes so a parent re-render with a
  // new founder image isn't stuck on the previous one (or its fallback).
  useEffect(() => {
    setSrc(imageUrl);
  }, [imageUrl]);
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20">
      <Image
        src={src}
        alt={name}
        fill
        sizes="40px"
        className="object-cover"
        unoptimized
        onError={() => {
          setSrc(
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d0006f&color=fff`,
          );
        }}
      />
    </div>
  );
}

interface StartupCardProps {
  id: string | number;
  name: string;
  logoUrl: string;
  summary: string;
  category?: string[];
  foundingYear?: string | number;
  founders?: Founder[];
  isMTZ?: boolean;
  badge?: {
    text: string;
    color: string;
    bgColor: string;
  };
  accentColor?: string;
  showDetails?: boolean;
}

export default function StartupCard({
  id,
  name,
  logoUrl,
  summary,
  category,
  foundingYear,
  founders = [],
  isMTZ,
  badge,
  accentColor,
  showDetails = false,
}: StartupCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    posthog.capture('startup_card_clicked', {
      startup_id: id,
      startup_name: name,
      category: category,
    });
    sessionStorage.setItem('startups-scroll', String(window.scrollY));
    router.push(`/startup-details/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
    >
      {/* Logo Section */}
      <div className="flex h-48 items-center justify-center bg-white p-8">
        {/* Startup logos have varying intrinsic aspect ratios; using next/image with
            fixed dimensions would distort them, and fill needs a known box. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="h-auto max-h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className={`${showDetails ? 'p-6' : 'px-5 py-4'} flex flex-grow flex-col`}>
        <div className={`${showDetails ? 'mb-4' : 'mb-2'}`}>
          <div className="mb-1 flex items-center gap-2">
            <h3 className={`${showDetails ? 'text-2xl' : 'text-lg'} leading-tight text-white`}>
              {name}
            </h3>
            {isMTZ === true && (
              <span className="inline-flex items-center rounded bg-[#d0006f] px-2 py-0.5 text-xs font-semibold text-white">
                MTZ
              </span>
            )}
            {badge && (
              <span
                className={`rounded px-2 py-1 text-xs font-bold ${badge.color} ${badge.bgColor} ml-auto`}
              >
                {badge.text}
              </span>
            )}
          </div>

          {/* Category Tags + Founded */}
          {showDetails && ((category && category.length > 0) || foundingYear) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {category &&
                category.slice(0, 2).map((cat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded bg-white/10 px-2 py-1 text-xs font-medium text-gray-300"
                  >
                    {cat}
                  </span>
                ))}
              {foundingYear && (
                <span className="inline-flex items-center rounded bg-white/10 px-2 py-1 text-xs font-medium text-gray-300">
                  Founded {foundingYear}
                </span>
              )}
            </div>
          )}
        </div>

        <div className={`${showDetails ? 'mb-4' : 'mb-2'}`}>
          <p
            className={`text-sm leading-relaxed text-gray-400 ${showDetails ? 'line-clamp-3' : ''}`}
          >
            {summary}
          </p>
        </div>

        {/* Founders Section */}
        {founders.length > 0 && showDetails && (
          <div className="mt-auto border-t border-white/10 pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              {founders.length > 1 ? 'Founders' : 'Founder'}
            </p>
            <div className="flex flex-wrap gap-3">
              {founders.map((founder, founderIdx) => (
                <div key={founderIdx} className="flex items-center gap-2">
                  {founder.linkedinUrl ? (
                    <a
                      href={founder.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                      <FounderAvatar name={founder.name} imageUrl={founder.imageUrl} />
                      <span className="text-sm text-gray-300 transition-colors hover:text-white">
                        {founder.name}
                      </span>
                    </a>
                  ) : (
                    <>
                      <FounderAvatar name={founder.name} imageUrl={founder.imageUrl} />
                      <span className="text-sm text-gray-300">{founder.name}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent bar */}
      {accentColor && <div className={`absolute bottom-0 left-0 h-1 w-full ${accentColor}`}></div>}
    </div>
  );
}
