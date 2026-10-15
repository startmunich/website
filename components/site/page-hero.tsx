import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import * as React from 'react';

import Aura from '@/components/aura';
import { Container } from '@/components/ui/section';
import { Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const pageHeroVariants = cva('relative flex w-full flex-col overflow-hidden', {
  variants: {
    size: {
      default: 'min-h-[70vh]',
      /** Fills the viewport under the 5rem header. */
      full: 'min-h-[calc(100svh-5rem)]',
    },
  },
  defaultVariants: { size: 'default' },
});

const scrimVariants = cva('absolute inset-0', {
  variants: {
    scrim: {
      default: 'bg-background/70',
      /** Left-weighted, for busy photography behind left-aligned copy. */
      strong: 'bg-linear-to-r from-background/95 via-background/80 to-background/70',
    },
  },
  defaultVariants: { scrim: 'default' },
});

type PageHeroProps = VariantProps<typeof pageHeroVariants> &
  VariantProps<typeof scrimVariants> & {
    image: string;
    /** CSS `object-position` for the background photograph. */
    imagePosition?: string;
    title: React.ReactNode;
    /** Second line of the title, set in hollow outline type. */
    outlineTitle?: React.ReactNode;
    description?: React.ReactNode;
    /** Right-hand column on desktop (usually <HeroStats>); rendered under the hero on mobile. */
    aside?: React.ReactNode;
    /** Hide `aside` below `lg` instead of moving it under the hero. */
    hideAsideOnMobile?: boolean;
    /** Extra content under the description (buttons, a form). */
    children?: React.ReactNode;
    /**
     * Renders the vgpu aura over the background image. On by default because the
     * aura layers between the scrim and the copy, which is the one slot that reads
     * as depth on every hero; switch it off for a hero whose own art direction
     * should stay untouched.
     */
    aura?: boolean;
    className?: string;
  };

/** The photographic header at the top of every content page. */
export function PageHero({
  image,
  imagePosition = 'center 45%',
  title,
  outlineTitle,
  description,
  aside,
  hideAsideOnMobile = false,
  children,
  aura = true,
  size,
  scrim,
  className,
}: PageHeroProps) {
  return (
    <>
      <div className={cn(pageHeroVariants({ size }), className)}>
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <div className={scrimVariants({ scrim })} />
          {/*
            Fade to the page background over the bottom 40%, with a `via` stop
            that front-loads the darkening so the photograph dissolves rather
            than stops. `from-transparent` is safe because every current engine
            interpolates gradients in premultiplied alpha (no grey band).
          */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-b from-transparent via-background/45 to-background" />
        </div>

        {/*
          The aura sits above the scrim and below the copy, so it reads as light
          falling across the photograph rather than a filter on top of it. Both
          layers are absolutely positioned with an auto z-index, so paint order
          is DOM order.
        */}
        {aura && <Aura />}

        <Container className="relative flex flex-1 items-center py-14">
          <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-12">
            <div className="flex max-w-3xl flex-1 flex-col gap-4 sm:gap-6">
              <Heading size="display" className="motion-safe:animate-fly-in">
                {title}
                {outlineTitle && (
                  <>
                    <br />
                    <span className="text-outline">{outlineTitle}</span>
                  </>
                )}
              </Heading>
              {description && (
                <Text variant="lead" render={<div />}>
                  {description}
                </Text>
              )}
              {children}
            </div>
            {aside && <div className="mt-6 ml-auto hidden lg:mt-11 lg:block">{aside}</div>}
          </div>
        </Container>
      </div>

      {aside && !hideAsideOnMobile && (
        <Container className="-mt-1 pt-2 pb-6 lg:hidden">{aside}</Container>
      )}
    </>
  );
}
