'use client';

import { MotionConfig } from 'motion/react';

import RtssAbout from './RtssAbout';
import RtssAudiences from './RtssAudiences';
import RtssFan from './RtssFan';
import RtssFaq from './RtssFaq';
import RtssFooter from './RtssFooter';
import RtssGallery from './RtssGallery';
import RtssHero from './RtssHero';
import RtssSchedule from './RtssSchedule';

/**
 * Road to START Summit microsite.
 *
 * The layout is scroll-driven throughout (parallax photography, the fanning
 * technology cards, the widening conference track), so the sections are client
 * islands assembled here under one `MotionConfig`. Static content lives in
 * `rtss-data.ts`.
 */
export default function RtssContent() {
  return (
    // `.theme-rtss` re-maps the semantic tokens and sets the Figtree display
    // face; `overflow-x-clip` contains the full-bleed photo strip.
    <div className="theme-rtss overflow-x-clip">
      <MotionConfig reducedMotion="user">
        <a
          href="#about"
          className="fixed top-[-80px] left-5 z-100 bg-white px-4 py-4 text-brand-navy focus:top-2.5"
        >
          Skip to content
        </a>

        <RtssHero />

        <RtssFan />
        <RtssAbout />
        <RtssAudiences />
        <RtssSchedule />
        <RtssGallery />
        <RtssFaq />
        <RtssFooter />
      </MotionConfig>
    </div>
  );
}
