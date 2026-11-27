import Image from 'next/image';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trackClick } from '@/lib/analytics';

import { Pill, rtssImage } from './rtss-ui';

const partners = {
  'Harvard Business School': {
    url: 'https://www.hbs.edu/',
    image: 'harvard-business-school.webp',
  },
  'TYTAN Technologies': {
    url: 'https://www.tytan-technologies.com/',
    image: 'tytan-supplied.webp',
  },
  'SE3 Labs': { url: 'https://se3.ai', image: 'se3-labs.webp' },
  'UVC Partners': {
    url: 'https://www.uvcpartners.com/',
    image: 'uvc-partners.webp',
  },
  'Climate Founders': {
    url: 'https://www.climatefounders.com/',
    image: 'climate-founders.webp',
  },
  remberg: {
    url: 'https://remberg.com/',
    image: 'remberg-logo-dark.webp',
  },
  'Media Lab Bayern': {
    url: 'https://www.media-lab.de/de/',
    image: 'media-lab-bayern.webp',
  },
  'Mio Mio': { url: 'https://www.miomio.com', image: 'mio-mio.webp' },
  'Winzergemeinschaft Franken': {
    url: 'https://www.gwf-frankenwein.de',
    image: 'winzergemeinschaft-franken.webp',
  },
  'Drink Early': { url: 'https://drinkearly.com', image: 'drink-early.webp' },
  Lytra: { url: 'https://lytra.ai/de', image: 'lytra.webp' },
  'Bits & Pretzels': {
    url: 'https://www.bitsandpretzels.com/startups',
    image: 'bits-pretzels-wordmark.webp',
  },
  HORYZN: { url: 'https://horyzn.org', image: 'horyzn.webp' },
  Robotum: { url: 'https://www.robotum.info', image: 'robotum.webp' },
};

const groups = [
  { name: 'Panel', partners: ['TYTAN Technologies', 'Bits & Pretzels'] },
  {
    name: 'Booth',
    partners: ['HORYZN', 'Harvard Business School', 'SE3 Labs', 'TYTAN Technologies', 'Robotum'],
  },
  { name: 'Ecosystem', partners: ['Media Lab Bayern', 'remberg', 'Lytra'] },
  { name: 'Jury', partners: ['UVC Partners', 'Climate Founders'] },
  { name: 'Drink', partners: ['Drink Early', 'Winzergemeinschaft Franken', 'Mio Mio'] },
] as const;

export default function RtssPartners() {
  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="scroll-mt-12 px-5 py-24 text-foreground max-sm:py-16 sm:px-8 lg:px-10 lg:py-32"
    >
      <div className="mb-6">
        <Pill>Partners</Pill>
      </div>
      <h2
        id="partners-heading"
        className="mb-8 text-[clamp(3.5rem,6vw,5rem)] leading-none font-medium tracking-[-0.055em] max-sm:text-[clamp(2.5rem,11vw,3.5rem)]"
      >
        Partners
      </h2>
      <Tabs defaultValue="Panel" className="flex-col gap-7">
        <TabsList
          aria-label="Partner groups"
          variant="line"
          className="h-auto w-full flex-wrap justify-start gap-x-5 gap-y-1 border-b border-border p-0 pb-2 group-data-horizontal/tabs:h-auto max-sm:justify-between max-sm:gap-x-1 sm:gap-x-8"
        >
          {groups.map((group) => (
            <TabsTrigger
              key={group.name}
              value={group.name}
              className="h-11 flex-none px-0 text-base after:bg-primary aria-selected:text-primary aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:bottom-0 aria-selected:after:h-0.5 aria-selected:after:opacity-100 max-sm:min-w-11 max-sm:text-sm sm:text-lg"
            >
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {groups.map((group) => (
          <TabsContent key={group.name} value={group.name}>
            <h3 className="mb-4 text-2xl font-medium tracking-tight">{group.name} Partners</h3>
            <div className="grid grid-cols-2 gap-3 motion-safe:animate-fade-in-up sm:gap-5 lg:grid-cols-3">
              {group.partners.map((name) => {
                const partner = partners[name];
                return (
                  <a
                    key={name}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${name} (opens in a new tab)`}
                    {...trackClick('partner_link_clicked', { page: 'rtss', partner: name })}
                    className="relative grid aspect-square min-w-0 place-items-center rounded-2xl border border-transparent bg-foreground/10 p-3 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-primary sm:p-5"
                  >
                    <Image
                      src={rtssImage(`partner-marks/${partner.image}`)}
                      alt=""
                      width={600}
                      height={240}
                      sizes="(max-width: 1023px) 36vw, 24vw"
                      className="absolute top-1/2 left-1/2 h-auto w-[88%] -translate-x-1/2 -translate-y-1/2"
                    />
                    <span className="absolute inset-x-3 bottom-3 text-sm leading-tight font-medium tracking-tight sm:inset-x-5 sm:bottom-5 sm:text-base">
                      {name}
                    </span>
                  </a>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
