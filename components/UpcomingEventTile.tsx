import Image from 'next/image';

import { cn } from '@/lib/utils';

interface UpcomingEventTileProps {
  href?: string;
  title: string;
  date?: string;
  imageUrl?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaDisabledLabel?: string;
  onCtaClick?: () => void;
  className?: string;
  hiddenClassName?: string;
}

export default function UpcomingEventTile({
  href,
  title,
  date,
  imageUrl,
  description,
  ctaLabel,
  ctaHref,
  ctaDisabledLabel = 'Registration opens soon',
  onCtaClick,
  className = '',
  hiddenClassName = '',
}: UpcomingEventTileProps) {
  const CardContent = (
    <>
      <div className="p-3 pb-0">
        <div className="relative overflow-hidden rounded-xl bg-black/20">
          {imageUrl ? (
            <div className="relative aspect-square w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 86vw, 320px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-[#1a1a3e] to-[#0a0a2e]" />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-white">{title}</h3>
        {date && (
          <p className="mb-2 whitespace-pre-line text-xs font-medium text-gray-400">{date}</p>
        )}
        {description && <p className="mb-1 text-sm leading-relaxed text-gray-400">{description}</p>}
        {ctaLabel && (
          <div className="mt-auto pt-4">
            {ctaHref ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  onCtaClick?.();
                }}
                className="block w-full rounded-xl bg-[#d0006f] px-5 py-3 text-center text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#d0006f]/80 hover:shadow-lg hover:shadow-[#d0006f]/30"
              >
                {ctaLabel}
              </a>
            ) : (
              <span className="block w-full cursor-not-allowed rounded-xl bg-white/10 px-5 py-3 text-center text-xs font-bold uppercase tracking-wide text-white/40">
                {ctaDisabledLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  const classes = cn(
    'group relative bg-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/40 flex flex-col',
    hiddenClassName,
    className,
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {CardContent}
      </a>
    );
  }

  return <div className={classes}>{CardContent}</div>;
}
