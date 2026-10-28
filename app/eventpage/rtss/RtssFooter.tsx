import Image from 'next/image';
import Link from 'next/link';

import { rtssConfig } from './rtss-data';
import { rtssImage } from './rtss-ui';

const sectionLinks = [
  ['For startups', '#for-startups'],
  ['For attendees', '#for-attendees'],
  ['FAQ', '#questions'],
] as const;

const legalLinks = [
  ['Legal Notice', 'https://www.startmunich.de/legal-notice'],
  ['Privacy Policy', 'https://www.startmunich.de/privacy-policy'],
] as const;

export default function RtssFooter() {
  return (
    <footer className="bg-brand-navy px-5 pt-[72px] pb-[110px] sm:px-8 lg:px-10">
      <div className="flex items-center justify-between gap-10 border-b border-border pb-[80px] max-sm:flex-col max-sm:items-start max-sm:gap-8">
        <Link href="/" aria-label="START Munich home" className="leading-none">
          <Image
            src={rtssImage('start-munich-white.png')}
            alt="START Munich"
            width={120}
            height={55}
            className="h-auto w-[120px]"
          />
        </Link>
        <nav
          aria-label="Event navigation"
          className="flex flex-wrap gap-[50px] text-[20px] tracking-[-0.04em] max-sm:gap-6 max-sm:text-[17px]"
        >
          {sectionLinks.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-brand-pink">
              {label}
            </a>
          ))}
          {legalLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-pink"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-wrap gap-[26px] pt-[78px] text-[14px] text-muted-foreground">
        <span>&copy; START Munich 2026</span>
        <span>{rtssConfig.title}</span>
        <a
          href={rtssConfig.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-brand-pink"
        >
          {rtssConfig.venue} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
