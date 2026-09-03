'use client';

import { useEffect, useRef } from 'react';

const PAIRS: [string, string][] = [
  ['hello world', 'hello users'],
  ['scribble', 'screen'],
  ['whiteboard', 'working demo'],
  ['Figma frame', 'clickable thing'],
  ['TODO', 'DONE'],
  ['\u201Cwhat if?\u201D', '\u201Clook!\u201D'],
  ['user pain', 'simple flow'],
  ['spreadsheet', 'dashboard'],
  ['blank page', 'first users'],
];

export default function RotatingJourney() {
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fromRef.current || !toRef.current) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      fromRef.current.textContent = PAIRS[0][0];
      toRef.current.textContent = PAIRS[0][1];
      return;
    }

    fromRef.current.textContent = PAIRS[0][0];
    toRef.current.textContent = PAIRS[0][1];

    let i = 0;
    const id = setInterval(() => {
      if (!fromRef.current || !toRef.current) return;
      fromRef.current.classList.add('swap-out');
      toRef.current.classList.add('swap-out');
      setTimeout(() => {
        i = (i + 1) % PAIRS.length;
        if (fromRef.current) fromRef.current.textContent = PAIRS[i][0];
        if (toRef.current) toRef.current.textContent = PAIRS[i][1];
        fromRef.current?.classList.remove('swap-out');
        toRef.current?.classList.remove('swap-out');
      }, 400);
    }, 2800);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="mt-[34px] max-w-[620px] rounded border border-[rgba(52,225,184,.16)] bg-gradient-to-b from-[rgba(20,65,70,.5)] to-[rgba(20,65,70,.18)] p-[22px_24px]"
      aria-hidden="true"
    >
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#5E8880]">
        The journey
      </p>
      <div className="mt-3.5 flex min-h-[1.3em] flex-wrap items-baseline gap-[0.34em] text-[clamp(1.05rem,2.6vw,1.45rem)] font-bold leading-snug">
        <span className="font-medium text-[#8FB6AD]">from</span>
        <span className="duration-400 text-[#E4F3EE] transition-all" ref={fromRef}>
          scribble
        </span>
        <span className="jgap" />
        <span className="font-medium text-[#8FB6AD]">to</span>
        <span className="duration-400 text-[#34e1b8] transition-all" ref={toRef}>
          screen
        </span>
      </div>
    </div>
  );
}
