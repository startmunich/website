import Image from 'next/image';

import { trackClick } from '@/lib/analytics';

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

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        <a
          href="https://www.hbs.edu/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Harvard Business School (opens in a new tab)"
          {...trackClick('partner_link_clicked', {
            page: 'rtss',
            partner: 'Harvard Business School',
          })}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:pb-8"
        >
          <Image
            src="/eventpage/rtss/harvard-business-school.svg"
            alt="Harvard Business School"
            width={185}
            height={80}
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-2/3 grayscale invert"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em] max-sm:inset-x-1 max-sm:bottom-1 max-sm:px-1 max-sm:py-1 max-sm:text-center max-sm:text-xs">
            Harvard Business School
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
          >
            ↗
          </span>
        </a>
        <a
          href="https://www.tytan-technologies.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit TYTAN Technologies (opens in a new tab)"
          {...trackClick('partner_link_clicked', { page: 'rtss', partner: 'TYTAN Technologies' })}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:pb-8"
        >
          <Image
            src="/eventpage/rtss/tytan-supplied.png"
            alt="TYTAN Technologies"
            width={500}
            height={500}
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-4/5 mix-blend-screen invert"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em] max-sm:inset-x-1 max-sm:bottom-1 max-sm:px-1 max-sm:py-1 max-sm:text-center max-sm:text-xs">
            TYTAN Technologies
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
          >
            ↗
          </span>
        </a>
        <a
          href="https://se3.ai"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit SE3 Labs (opens in a new tab)"
          {...trackClick('partner_link_clicked', {
            page: 'rtss',
            partner: 'SE3 Labs',
          })}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:pb-8"
        >
          <Image
            src="/eventpage/rtss/se3-labs.svg"
            alt="SE3 Labs"
            width={90}
            height={33}
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-2/3 brightness-0 invert"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em] max-sm:inset-x-1 max-sm:bottom-1 max-sm:px-1 max-sm:py-1 max-sm:text-center max-sm:text-xs">
            SE3 Labs
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
          >
            ↗
          </span>
        </a>
        <a
          href="https://www.uvcpartners.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit UVC Partners (opens in a new tab)"
          {...trackClick('partner_link_clicked', { page: 'rtss', partner: 'UVC Partners' })}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:w-full max-sm:pb-8"
        >
          <Image
            src="/eventpage/rtss/uvc-partners.png"
            alt="UVC Partners"
            width={485}
            height={412}
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-1/2 mix-blend-screen grayscale invert"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em] max-sm:inset-x-1 max-sm:bottom-1 max-sm:px-1 max-sm:py-1 max-sm:text-center max-sm:text-xs">
            UVC Partners
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
          >
            ↗
          </span>
        </a>
        <a
          href="https://www.climatefounders.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Climate Founders (opens in a new tab)"
          {...trackClick('partner_link_clicked', { page: 'rtss', partner: 'Climate Founders' })}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:pb-8"
        >
          <Image
            src="/eventpage/rtss/climate-founders.png"
            alt="Climate Founders"
            width={518}
            height={82}
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-4/5 mix-blend-screen invert"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em] max-sm:inset-x-1 max-sm:bottom-1 max-sm:px-1 max-sm:py-1 max-sm:text-center max-sm:text-xs">
            Climate Founders
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
          >
            ↗
          </span>
        </a>
        <a
          href="https://remberg.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit remberg (opens in a new tab)"
          {...trackClick('partner_link_clicked', { page: 'rtss', partner: 'remberg' })}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:w-full max-sm:pb-8"
        >
          <Image
            src="/eventpage/rtss/remberg-logo-dark.svg"
            alt="remberg"
            width={1240}
            height={263}
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-2/3 brightness-0 invert"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em] max-sm:inset-x-1 max-sm:bottom-1 max-sm:px-1 max-sm:py-1 max-sm:text-center max-sm:text-xs">
            remberg
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
          >
            ↗
          </span>
        </a>
        <a
          href="https://www.media-lab.de/de/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Media Lab Bayern (opens in a new tab)"
          {...trackClick('partner_link_clicked', { page: 'rtss', partner: 'Media Lab Bayern' })}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:pb-8"
        >
          <Image
            src="/eventpage/rtss/media-lab-bayern.svg"
            alt="Media Lab Bayern"
            width={600}
            height={210}
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-2/3"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em] max-sm:inset-x-1 max-sm:bottom-1 max-sm:px-1 max-sm:py-1 max-sm:text-center max-sm:text-xs">
            Media Lab Bayern
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
          >
            ↗
          </span>
        </a>
        <a
          href="https://www.miomio.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Mio Mio (opens in a new tab)"
          {...trackClick('partner_link_clicked', { page: 'rtss', partner: 'Mio Mio' })}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:pb-8"
        >
          <Image
            src="/eventpage/rtss/mio-mio.svg"
            alt="Mio Mio"
            width={1536}
            height={2049}
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 20vw"
            className="h-1/2 w-auto"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em] max-sm:inset-x-1 max-sm:bottom-1 max-sm:px-1 max-sm:py-1 max-sm:text-center max-sm:text-xs">
            Mio Mio
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
          >
            ↗
          </span>
        </a>
        <a
          href="https://www.gwf-frankenwein.de"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Winzergemeinschaft Franken (opens in a new tab)"
          {...trackClick('partner_link_clicked', {
            page: 'rtss',
            partner: 'Winzergemeinschaft Franken',
          })}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent bg-foreground/10 transition-colors hover:border-primary hover:bg-background focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:pb-8"
        >
          <Image
            src="/eventpage/rtss/winzergemeinschaft-franken.png"
            alt="Winzergemeinschaft Franken"
            width={600}
            height={600}
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 20vw"
            className="h-auto w-1/2 grayscale"
          />
          <span className="absolute bottom-4 left-4 rounded-lg bg-background px-3 py-1.5 text-sm tracking-[-0.04em] max-sm:inset-x-1 max-sm:bottom-1 max-sm:px-1 max-sm:py-1 max-sm:text-center max-sm:text-xs">
            Winzergemeinschaft Franken
          </span>
          <span
            aria-hidden="true"
            className="absolute right-5 bottom-4 text-3xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden"
          >
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}
