import { useEffect, useState } from 'react';

/**
 * Custom hook for animating numbers from 0 to target value
 * @param target - The target number to animate to
 * @param loading - Whether the component is still loading
 * @param duration - Animation duration in milliseconds (default: 1500)
 * @param steps - Number of animation steps (default: 60)
 * @returns The current animated value (floored to integer)
 */
export function useAnimatedNumber(
  target: number,
  loading: boolean = false,
  duration: number = 1500,
  steps: number = 60,
): number {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (loading || target <= 0) return;

    let currentValue = 0;
    const interval = duration / steps;
    const increment = target / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      currentValue += increment;

      if (step >= steps) {
        setAnimatedValue(target);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(currentValue));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [loading, target, duration, steps]);

  return animatedValue;
}
