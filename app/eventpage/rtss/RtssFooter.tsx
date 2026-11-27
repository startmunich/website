import Image from 'next/image';
import Link from 'next/link';

import { trackClick } from '@/lib/analytics';

import { navItems, rtssConfig } from './rtss-data';
import { rtssImage } from './rtss-ui';

const legalLinks = [
  ['Legal Notice', 'https://www.startmunich.de/legal-notice'],
  ['Privacy Policy', 'https://www.startmunich.de/privacy-policy'],
] as const;

export default function RtssFooter() {
  return (
    <footer className="bg-brand-navy px-5 pt-[72px] pb-[110px] max-sm:py-12 sm:px-8 lg:px-10">
      <div className="flex items-center justify-between gap-10 border-b border-border pb-[80px] max-sm:flex-col max-sm:items-start max-sm:gap-6 max-sm:pb-6">
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
          className="flex flex-wrap gap-[50px] text-[20px] tracking-[-0.04em] max-sm:grid max-sm:w-full max-sm:grid-cols-2 max-sm:gap-x-4 max-sm:gap-y-0 max-sm:text-base"
        >
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              {...trackClick('section_nav_clicked', { page: 'rtss', location: 'footer' })}
              className="transition-colors hover:text-brand-pink max-sm:inline-flex max-sm:min-h-11 max-sm:items-center"
            >
              {label}
            </a>
          ))}
          {legalLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-pink max-sm:inline-flex max-sm:min-h-11 max-sm:items-center"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-wrap gap-[26px] pt-[78px] text-[14px] text-muted-foreground max-sm:flex-col max-sm:items-start max-sm:gap-1 max-sm:pt-6">
        <span>&copy; START Munich 2026</span>
        <span>{rtssConfig.title}</span>
        <a
          href={rtssConfig.directionsUrl}
          {...trackClick('directions_clicked', { page: 'rtss' })}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-brand-pink max-sm:inline-flex max-sm:min-h-11 max-sm:items-center"
        >
          {rtssConfig.venue} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
