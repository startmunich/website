'use client';

import { useState } from 'react';

import { BulletList } from '@/components/ui/bullet-list';
import { Card } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { type Department, departments } from './data';

// Left-facing half circle "(": centre (300,300), r=300, from (300,0) through
// (0,300) to (300,600). Dots sit at these standard-math angles (CCW from +x).
const CX = 300;
const CY = 300;
const R = 300;
const ANGLES = [108, 144, 180, 216, 252];
// Per-dot label vertical nudge (positive = lower)
const LABEL_Y_OFFSETS = [18, 6, 6, 6, -8];

// Rounded so server and client agree: Math.cos can differ in the last digit
// between engines, which React reports as a hydration mismatch.
const round = (n: number) => Math.round(n * 100) / 100;

const dots = departments.map((dept, i) => {
  const a = (ANGLES[i] * Math.PI) / 180;
  return {
    dept,
    x: round(CX + R * Math.cos(a)),
    y: round(CY - R * Math.sin(a)),
    labelYOffset: LABEL_Y_OFFSETS[i],
  };
});

function DepartmentDetail({ dept, compact = false }: { dept: Department; compact?: boolean }) {
  return (
    <Card
      key={dept.id}
      size={compact ? 'default' : 'lg'}
      className="h-full border-primary/20 motion-safe:animate-fade-in-up"
    >
      <div className="flex flex-col gap-4 px-(--card-spacing)">
        {!compact && (
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-3xl">
            {dept.icon}
          </div>
        )}
        <Heading as="h3" size="h4" className="text-2xl font-black uppercase">
          {dept.name}
        </Heading>
        <Text variant="small">{dept.description}</Text>
        <div className="flex flex-col gap-3 border-t border-border pt-5">
          <p className="text-xs font-bold tracking-[0.15em] text-primary uppercase">
            Responsibilities
          </p>
          <BulletList items={dept.responsibilities} />
        </div>
      </div>
    </Card>
  );
}

/** Pick a department on the arc (desktop) or icon strip (mobile) to see what it does. */
export function DepartmentPicker() {
  const [activeId, setActiveId] = useState(departments[0].id);
  const active = departments.find((d) => d.id === activeId) ?? departments[0];

  return (
    <>
      <div className="hidden items-center gap-10 lg:grid lg:grid-cols-[1fr_380px]">
        <div className="min-h-80">
          <DepartmentDetail dept={active} />
        </div>
        <svg
          viewBox="-20 -20 400 640"
          className="w-full overflow-visible"
          role="group"
          aria-label="Departments"
        >
          <path
            d={`M ${CX},${CY - R} A ${R},${R} 0 0 0 ${CX},${CY + R}`}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-primary"
          />
          {dots.map(({ dept, x, y, labelYOffset }) => {
            const isActive = dept.id === activeId;
            return (
              <g
                key={dept.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={dept.name}
                onClick={() => setActiveId(dept.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveId(dept.id)}
                className="group cursor-pointer outline-none"
              >
                {isActive && <circle cx={x} cy={y} r="22" className="fill-primary/15" />}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 11 : 7}
                  strokeWidth="2"
                  className={cn(
                    'transition-all group-focus-visible:stroke-ring',
                    isActive
                      ? 'fill-primary stroke-primary/60'
                      : 'fill-foreground/20 stroke-foreground/25',
                  )}
                />
                {isActive && <circle cx={x} cy={y} r="4" className="fill-foreground" />}
                <text
                  x={x + 24}
                  y={y + labelYOffset}
                  fontSize="20"
                  className={cn(
                    'font-black tracking-[0.08em] uppercase transition-colors',
                    isActive ? 'fill-primary' : 'fill-foreground/50 group-hover:fill-foreground/80',
                  )}
                >
                  {dept.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-col gap-6 lg:hidden">
        <div className="flex flex-wrap justify-center gap-3">
          {departments.map((dept) => {
            const isActive = dept.id === activeId;
            return (
              <button
                key={dept.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveId(dept.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl p-2 transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-45 hover:opacity-70',
                )}
              >
                <span
                  className={cn(
                    'flex size-12 items-center justify-center rounded-2xl border text-2xl transition-colors',
                    isActive ? 'border-primary/40 bg-primary/20' : 'border-border bg-card',
                  )}
                >
                  {dept.icon}
                </span>
                <span
                  className={cn(
                    'text-2xs font-bold tracking-wider uppercase',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {dept.name}
                </span>
              </button>
            );
          })}
        </div>
        <DepartmentDetail dept={active} compact />
      </div>
    </>
  );
}
