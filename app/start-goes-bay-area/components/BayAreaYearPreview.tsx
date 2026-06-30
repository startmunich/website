import Image from 'next/image';

interface BayAreaYearPreviewProps {
  imageUrl: string;
}

export default function BayAreaYearPreview({ imageUrl }: BayAreaYearPreviewProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-pink/30 shadow-2xl shadow-brand-pink/10">
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt="START goes Bay Area preview"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="via-[#00002c]/78 absolute inset-0 bg-gradient-to-r from-[#00002c]/95 to-[#00002c]/35" />
        </div>

        <div className="relative flex flex-col items-start gap-8 p-8 md:p-14 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-pink/50 bg-brand-pink/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-pink">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-pink"></span>
                Preview
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/60">
                March 2027
              </span>
            </div>

            <h2 className="mb-4 text-3xl font-black leading-tight text-white md:text-5xl">
              START goes Bay Area
              <br />
            </h2>

            <p className="mb-6 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
              Full program details will be announced this fall.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="group inline-flex cursor-not-allowed items-center gap-2.5 rounded-xl bg-brand-pink px-7 py-3.5 font-bold text-white opacity-60"
              >
                <span>Opens in Fall</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>March 2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
