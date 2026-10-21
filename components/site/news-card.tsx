import { ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';

import type { NewsItem } from '@/lib/types';
import { cn } from '@/lib/utils';

/** A portrait news tile linking out to the post (LinkedIn, Instagram, press). */
export function NewsCard({
  item,
  sizes = '380px',
  className,
}: {
  item: NewsItem;
  sizes?: string;
  className?: string;
}) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('group/news relative block aspect-4/5 overflow-hidden rounded-2xl', className)}
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          unoptimized
          referrerPolicy="no-referrer"
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover/news:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-secondary" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
      <div className="absolute inset-x-6 bottom-6 flex flex-col gap-1">
        <h3 className="text-xl leading-snug font-bold text-white">{item.title}</h3>
        <p className="text-sm text-white/70">{item.description}</p>
      </div>
      <span className="absolute top-6 right-6 flex size-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-xs transition-opacity group-hover/news:opacity-100">
        <ArrowUpRightIcon className="size-4" />
      </span>
    </a>
  );
}
