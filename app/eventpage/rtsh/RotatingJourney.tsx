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
    <div className="journey" aria-hidden="true">
      <div className="jlabel">The journey</div>
      <div className="jline" id="jline">
        <span className="from">from</span>
        <span className="jword" id="jfrom" ref={fromRef}>
          scribble
        </span>
        <span className="jgap" />
        <span className="to">to</span>
        <span className="jword tocol" id="jto" ref={toRef}>
          screen
        </span>
      </div>
    </div>
  );
}
