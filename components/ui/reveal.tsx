'use client';

import * as React from 'react';

import { useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

type RevealProps = React.ComponentProps<'div'> & {
  /** Stagger offset in milliseconds. */
  delay?: number;
  /** Fraction of the element that must be visible before it animates in. */
  threshold?: number;
};

/**
 * Fades and lifts its children in the first time they scroll into view.
 * Under `prefers-reduced-motion` the content is simply shown.
 */
function Reveal({ className, delay = 0, threshold = 0.15, style, ...props }: RevealProps) {
  const { ref, visible } = useInView(threshold);
  return (
    <div
      ref={ref}
      data-slot="reveal"
      data-visible={visible || undefined}
      className={cn('reveal', className)}
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
      {...props}
    />
  );
}

export { Reveal };
