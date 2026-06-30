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
