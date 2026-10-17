'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { rtssImage } from './rtss-ui';

/**
 * Scroll-driven pieces of the RTSS microsite.
 *
 * `prefers-reduced-motion` is read after hydration on purpose: the first paint
 * has to match the server render, and a visitor who asks for reduced motion
 * should never see content animate in before it settles.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

/** Fades content up the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const reduce = usePrefersReducedMotion();

  return (
    <motion.div
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** A photograph that drifts against the scroll while its frame stays put. */
export function ParallaxPhoto({
  file,
  alt,
  sizes,
  frameClassName,
  imageClassName,
}: {
  file: string;
  alt: string;
  sizes: string;
  frameClassName?: string;
  imageClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.13]);

  return (
    <div
      ref={ref}
      className={cn('relative h-full overflow-hidden rounded-2xl bg-card', frameClassName)}
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: reduce ? 0 : y, scale: reduce ? 1 : scale }}
      >
        <Image
          src={rtssImage(file)}
          alt={alt}
          fill
          sizes={sizes}
          className={cn('object-cover', imageClassName)}
        />
      </motion.div>
    </div>
  );
}
