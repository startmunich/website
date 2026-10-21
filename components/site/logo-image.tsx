'use client';

import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';

type LogoImageProps = Omit<React.ComponentProps<'img'>, 'src' | 'alt'> & {
  src?: string | null;
  /** Company name: the alt text, and what renders if the image is missing or fails. */
  name: string;
  /** Overrides the alt text when it should read differently to the fallback name. */
  alt?: string;
  /**
   * Pass `sizes` to render an optimised `next/image` that fills the box given by
   * `className` (object-contain, so nothing distorts). Without it, a plain <img>
   * sized by its height, for logos whose box width should follow the logo.
   */
  sizes?: string;
  fallbackClassName?: string;
};

/**
 * A company or partner logo with a graceful fallback: if the file is missing or
 * 404s, the company name is shown instead.
 */
export function LogoImage({
  src,
  name,
  alt,
  sizes,
  className,
  fallbackClassName,
  onError,
  ...props
}: LogoImageProps) {
  const [failed, setFailed] = React.useState(false);

  if (!src || failed) {
    return (
      <span className={cn('text-center text-sm font-bold tracking-tight', fallbackClassName)}>
        {name}
      </span>
    );
  }

  if (sizes) {
    return (
      <span className={cn('relative block', className)}>
        <Image
          src={src}
          alt={alt ?? name}
          fill
          sizes={sizes}
          className="object-contain"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    // Arbitrary aspect ratios: next/image would need fixed dimensions and distort them.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? name}
      loading="lazy"
      className={cn('object-contain', className)}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}

/** A white plate for logos designed for light backgrounds. */
export function LogoTile({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex h-20 w-36 items-center justify-center rounded-xl bg-white p-4 text-brand-navy transition-transform duration-300 hover:scale-105',
        className,
      )}
      {...props}
    />
  );
}
