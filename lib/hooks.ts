'use client';

import { useEffect, useRef, useState } from 'react';

// Re-export useAnimatedNumber from its dedicated file
export { useAnimatedNumber } from './useAnimatedNumber';

/**
 * Hook to detect when an element enters the viewport
 * @param threshold - Intersection threshold (default: 0.2)
 * @returns Object with ref to attach to element and visible boolean
 */
export function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/**
 * Tracks the user's `prefers-reduced-motion` setting and keeps it in sync.
 *
 * Used to switch decorative animation off entirely rather than merely slowing
 * it down. Returns `false` during SSR so the server and first client render
 * agree, then corrects itself in the effect.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
