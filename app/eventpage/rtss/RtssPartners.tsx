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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="https://www.uvcpartners.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit UVC Partners (opens in a new tab)"
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:aspect-square max-sm:w-full"
        >
          <Image
            src="/eventpage/rtss/uvc-partners.png"
            alt="UVC Partners"
            width={485}
            height={412}
            sizes="(max-width: 639px) 60vw, (max-width: 1023px) 30vw, 20vw"
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
        <a
          href="https://remberg.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit remberg (opens in a new tab)"
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:aspect-square max-sm:w-full"
        >
          <Image
            src="/eventpage/rtss/remberg-logo-dark.svg"
            alt="remberg"
            width={1240}
            height={263}
            sizes="(max-width: 639px) 60vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-2/3 brightness-0 invert"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em]">
            remberg
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            ↗
          </span>
        </a>
        <a
          href="https://www.media-lab.de/de/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Media Lab Bayern (opens in a new tab)"
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:aspect-square"
        >
          <Image
            src="/eventpage/rtss/media-lab-bayern.svg"
            alt="Media Lab Bayern"
            width={600}
            height={210}
            sizes="(max-width: 639px) 60vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-2/3"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em]">
            Media Lab Bayern
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            ↗
          </span>
        </a>
        <a
          href="https://www.tytan-technologies.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit TYTAN Technologies (opens in a new tab)"
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:aspect-square"
        >
          <Image
            src="/eventpage/rtss/tytan-supplied.png"
            alt="TYTAN Technologies"
            width={500}
            height={500}
            sizes="(max-width: 639px) 60vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-4/5 mix-blend-screen invert"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em]">
            TYTAN Technologies
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            ↗
          </span>
        </a>
        <a
          href="https://www.climatefounders.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Climate Founders (opens in a new tab)"
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:aspect-square"
        >
          <Image
            src="/eventpage/rtss/climate-founders.png"
            alt="Climate Founders"
            width={518}
            height={82}
            sizes="(max-width: 639px) 60vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-4/5 mix-blend-screen invert"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em]">
            Climate Founders
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}
