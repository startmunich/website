import Image from 'next/image';

import Aura from '@/components/aura';
import { cn } from '@/lib/utils';

interface HeroProps {
  backgroundImage: string;
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  overlayOpacity?: string;
  hideChildrenOnMobile?: boolean;
  imagePosition?: string;
  childrenWrapperClassName?: string;
  /**
   * Renders the vgpu aura over the background image. On by default because the
   * aura layers between the scrim and the copy, which is the one slot that reads
   * as depth on every hero; switch it off for a hero whose own art direction
   * should stay untouched.
   */
  aura?: boolean;
}

export default function Hero({
  backgroundImage,
  title,
  description,
  children,
  className = 'min-h-[70vh]',
  titleClassName,
  descriptionClassName,
  overlayOpacity = 'bg-brand-dark-blue/70',
  hideChildrenOnMobile = false,
  imagePosition = 'center 45%',
  childrenWrapperClassName,
  aura = true,
}: HeroProps) {
  return (
    <>
      <div className={cn('relative flex w-full flex-col overflow-hidden', className)}>
        {/* Background Image + Overlay */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <div className={cn('absolute inset-0', overlayOpacity)}></div>
          {/*
            Fade to the page background over the bottom 40%, with a `via` stop
            that front-loads the darkening. At the previous `h-1/6` with only two
            stops the ramp was steep enough that the photograph visibly stopped
            rather than dissolved; widening it and bending the curve keeps the
            photo readable almost to the bottom edge. `from-transparent` is kept
            because every current engine interpolates gradients in premultiplied
            alpha, so there is no grey band on the way down.
          */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent via-brand-dark-blue/45 to-brand-dark-blue"></div>
        </div>

        {/*
          The aura sits above the scrim and below the copy, so it reads as light
          falling across the photograph rather than a filter on top of it. Both
          layers are absolutely positioned with an auto z-index, so paint order
          here is DOM order: the aura is after the image block and before the
          content block, which is what puts it between them.
        */}
        {aura && <Aura />}

        {/* Content Overlay */}
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col items-stretch justify-between gap-8 lg:flex-row lg:items-center lg:gap-12">
            {/* Left Side - Text */}
            <div className="max-w-full flex-1 text-left lg:max-w-3xl">
              <h1
                className={cn(
                  'mb-4 animate-[flyInFromTop_0.6s_ease-out] text-6xl font-black text-white sm:mb-6 sm:text-6xl lg:text-8xl',
                  titleClassName,
                )}
              >
                {title}
              </h1>
              <div
                className={cn(
                  'text-lg leading-relaxed text-gray-300 sm:text-xl',
                  descriptionClassName,
                )}
              >
                {description}
              </div>
            </div>

            {/* Right Side - Custom Content */}
            {children && (
              <div
                className={cn(
                  'ml-auto mt-6 hidden min-w-[280px] flex-col gap-6 lg:mt-11 lg:flex',
                  childrenWrapperClassName,
                )}
              >
                {children}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile - Cards below hero */}
      {children && !hideChildrenOnMobile && (
        <div className="-mt-1 lg:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-6 pt-2">{children}</div>
        </div>
      )}
    </>
  );
}
