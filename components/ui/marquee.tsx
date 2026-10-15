import * as React from 'react';

import { cn } from '@/lib/utils';

type MarqueeProps = React.ComponentProps<'div'> & {
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  /** Fade the edges into the background. */
  fade?: boolean;
};

/**
 * Infinite horizontal ticker. Children are rendered twice and the track slides
 * by exactly one copy, so the loop is seamless at any width. The second copy is
 * hidden from assistive tech.
 */
function Marquee({
  className,
  duration = 30,
  reverse = false,
  pauseOnHover = false,
  fade = true,
  children,
  style,
  ...props
}: MarqueeProps) {
  return (
    <div
      data-slot="marquee"
      className={cn(
        'group/marquee relative flex overflow-hidden',
        fade && 'mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
      style={{ '--marquee-duration': `${duration}s`, ...style } as React.CSSProperties}
      {...props}
    >
      <div
        className={cn(
          'flex w-max shrink-0',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]',
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}

export { Marquee };
