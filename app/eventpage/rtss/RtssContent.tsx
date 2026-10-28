import { RtssMotionProvider } from './rtss-motion-provider';
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
 * A Server Component: the scroll-driven sections are client islands
 * (`RtssHero`, `RtssFan`, `RtssAbout`, `RtssAudiences`, `RtssFaq`), while the
 * schedule, the footer and the gallery markup stay on the server. The only
 * thing that needed to be a client boundary was the shared `MotionConfig`,
 * which now lives on its own in `rtss-motion-provider.tsx`.
 *
 * Static content lives in `rtss-data.ts`.
 */
export default function RtssContent() {
  return (
    // `.theme-rtss` re-maps the semantic tokens and sets the Figtree display
    // face; `overflow-x-clip` contains the full-bleed photo strip.
    <div className="theme-rtss overflow-x-clip bg-background">
      <RtssMotionProvider>
        <a
          href="#about"
          className="fixed top-[-80px] left-5 z-100 bg-white px-4 py-4 text-brand-navy focus:top-2.5"
        >
          Skip to content
        </a>

        <RtssHero />

        <div className="bg-[linear-gradient(to_bottom,var(--brand-navy),var(--background)),linear-gradient(to_bottom,var(--background),var(--brand-navy))] bg-[length:100%_180px] bg-[position:center_top,center_bottom] bg-no-repeat max-sm:bg-[length:100%_100px]">
          <RtssFan />
          <RtssAbout />
          <RtssAudiences />
          <RtssSchedule />
          <RtssGallery />
          <RtssFaq />
        </div>
        <RtssFooter />
      </RtssMotionProvider>
    </div>
  );
}
