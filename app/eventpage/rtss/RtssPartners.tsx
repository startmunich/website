import Image from 'next/image';

import { Pill } from './rtss-ui';

export default function RtssPartners() {
  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="px-5 pt-32 pb-36 max-sm:pt-20 max-sm:pb-24 sm:px-8 lg:px-10"
    >
      <div className="mb-16 max-sm:mb-10">
        <Pill>Partners</Pill>
        <h2
          id="partners-heading"
          className="my-6 text-[80px] leading-[1.08] font-medium tracking-[-0.055em] max-sm:text-[56px]"
        >
          Partners
        </h2>
        <p className="max-w-xl text-xl leading-[1.4] tracking-[-0.035em] text-muted-foreground max-sm:text-lg">
          Bringing founders, investors, and the next generation of DeepTech together.
        </p>
      </div>

      <a
        href="https://www.uvcpartners.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit UVC Partners (opens in a new tab)"
        className="group relative flex aspect-[1.5] w-2/3 items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:aspect-square max-sm:w-full"
      >
        <Image
          src="/eventpage/rtss/uvc-partners.png"
          alt="UVC Partners"
          width={485}
          height={412}
          sizes="(max-width: 640px) 60vw, 35vw"
          className="h-auto w-1/2 mix-blend-screen grayscale invert"
        />
        <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em]">
          UVC Partners
        </span>
        <span
          aria-hidden="true"
          className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          ↗
        </span>
      </a>
    </section>
  );
}
