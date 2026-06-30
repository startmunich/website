import { bayAreaVisitCompanyLogos } from '@/lib/startGoesBayAreaData';

import { getLogoChipClassName } from '../types';

export default function BayAreaCompanyLogoCarousel() {
  if (bayAreaVisitCompanyLogos.length === 0) {
    return null;
  }

  const loopedLogos = [...bayAreaVisitCompanyLogos, ...bayAreaVisitCompanyLogos];

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-hidden py-8">
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-brand-dark-blue via-brand-dark-blue/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-brand-dark-blue via-brand-dark-blue/80 to-transparent" />

        <div className="overflow-hidden">
          <div
            className="animate-scroll-nonstop gap-5 px-6 sm:px-10"
            style={{ animationDuration: '95s' }}
          >
            {loopedLogos.map((logo, index) => {
              const content = (
                <>
                  <div
                    className={`flex h-14 w-full items-center justify-center rounded-xl border px-3 sm:px-4 ${getLogoChipClassName(logo.logoTheme)}`}
                  >
                    {/* Infinite-scroll marquee with variable-aspect logos; next/image fill/responsive
                        sizing interacts poorly with animated horizontal scroll. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.logoPath}
                      alt={`${logo.name} logo`}
                      className="h-9 w-auto max-w-[130px] object-contain sm:h-10 sm:max-w-[160px]"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-center text-xs font-bold uppercase tracking-wide text-gray-100 sm:text-sm">
                    {logo.name}
                  </p>
                </>
              );

              return (
                <div
                  key={`${logo.name}-${index}`}
                  aria-hidden={index >= bayAreaVisitCompanyLogos.length}
                  className="flex h-32 min-w-[190px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 transition-colors hover:border-brand-pink/35 hover:bg-white/[0.1]"
                >
                  {logo.websiteUrl ? (
                    <a
                      href={logo.websiteUrl}
                      target="_blank"
                      rel="noopener"
                      className="flex h-full w-full flex-col items-center justify-center"
                      aria-label={`${logo.name} website`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                      {content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
