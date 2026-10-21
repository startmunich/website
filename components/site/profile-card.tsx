import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import * as React from 'react';

import { LinkedInIcon } from '@/components/site/brand-icons';
import { isObjectStorageImage } from '@/lib/images';
import { cn } from '@/lib/utils';

const portraitVariants = cva(
  'relative overflow-hidden rounded-xl border-2 border-border bg-card transition-colors duration-300 select-none group-hover/profile:border-primary/50 group-focus-visible/profile:ring-3 group-focus-visible/profile:ring-ring group-focus-visible/profile:ring-offset-2 group-focus-visible/profile:ring-offset-background',
  {
    variants: {
      size: {
        /** Fills its grid cell at 3:4. */
        sm: 'aspect-3/4 w-full',
        default: 'h-48 w-36 sm:h-56 sm:w-44',
        lg: 'h-48 w-36 sm:h-60 sm:w-48',
        /** Tall portrait for horizontally scrolling rows. */
        xl: 'h-72 w-56',
        /** Fills its grid cell at 1:1. */
        square: 'aspect-square w-full',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

type ProfileCardProps = VariantProps<typeof portraitVariants> & {
  name: string;
  role?: React.ReactNode;
  /** Missing images fall back to the person's initials. */
  imageUrl?: string;
  /** Wraps the card in a link to the person's LinkedIn profile. */
  linkedinUrl?: string;
  /** CSS object-position for the portrait. */
  imagePosition?: string;
  sizes?: string;
  /** `stacked`: name under the portrait. `overlay`: name over a gradient on the portrait. */
  variant?: 'stacked' | 'overlay';
  selected?: boolean;
  /** Makes the card a button (e.g. to reveal a bio) instead of a link. */
  onSelect?: () => void;
  className?: string;
};

/**
 * A person: portrait, name, role. Used for the boards, advisors and batch pages.
 * Member portraits come from the members platform's object storage and are
 * served unoptimised (see `isObjectStorageImage`).
 */
export function ProfileCard({
  name,
  role,
  imageUrl,
  linkedinUrl,
  imagePosition = 'top',
  size,
  sizes = '(max-width: 640px) 144px, 192px',
  variant = 'stacked',
  selected = false,
  onSelect,
  className,
}: ProfileCardProps) {
  const overlay = variant === 'overlay';

  const caption = (
    <div
      className={cn(
        'flex flex-col gap-1',
        overlay ? 'absolute inset-x-0 bottom-0 p-3 sm:p-4' : 'mt-3',
      )}
    >
      <p
        className={cn(
          'text-xs leading-tight font-black tracking-wide uppercase transition-colors group-hover/profile:text-primary lg:text-sm',
          selected ? 'text-primary' : 'text-foreground',
        )}
      >
        {name}
      </p>
      {role && (
        <p
          className={cn(
            'text-2xs font-semibold tracking-widest uppercase lg:text-xs',
            overlay ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {role}
        </p>
      )}
    </div>
  );

  const content = (
    <>
      <div className={cn(portraitVariants({ size }), selected && 'border-primary')}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes={sizes}
            className="object-cover"
            style={{ objectPosition: imagePosition }}
            referrerPolicy="no-referrer"
            unoptimized={isObjectStorageImage(imageUrl)}
            draggable={false}
          />
        ) : (
          <span className="flex size-full items-center justify-center text-3xl font-black text-foreground/25">
            {initials(name)}
          </span>
        )}
        {overlay && (
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
        )}
        {linkedinUrl && (
          <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-foreground/90 text-linkedin opacity-0 transition-opacity group-hover/profile:opacity-100 group-focus-visible/profile:opacity-100">
            <LinkedInIcon className="size-3.5" />
          </span>
        )}
        {overlay && caption}
      </div>
      {!overlay && caption}
    </>
  );

  const classes = cn(
    'group/profile flex flex-col outline-none',
    overlay ? 'text-left' : 'items-center text-center',
    className,
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} aria-pressed={selected} className={classes}>
        {content}
      </button>
    );
  }

  return linkedinUrl ? (
    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <div className={classes}>{content}</div>
  );
}
