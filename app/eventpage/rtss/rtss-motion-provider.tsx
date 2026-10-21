'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * One `MotionConfig` for the whole microsite, kept in its own client module so
 * `RtssContent` can stay a Server Component. `MotionConfig` is the only reason
 * the page root was client: marking it client pulled the schedule, the footer
 * and all of `rtss-data.ts` into the client bundle, which contradicted the
 * "small client islands" the page was described as being.
 *
 * Server-rendered children passed through here keep their server rendering —
 * they arrive as already-rendered React nodes, and the islands inside them
 * still resolve this context at hydration because the tree position is kept.
 */
export function RtssMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
