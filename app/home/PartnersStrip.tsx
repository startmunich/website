import Link from 'next/link';

import { LogoImage } from '@/components/site/logo-image';
import { Marquee } from '@/components/ui/marquee';
import { Text } from '@/components/ui/typography';
import type { Partner } from '@/lib/types';

/** "Backed by brands like" — greyscale partner logos on a ticker. */
export function PartnersStrip({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
  return (
    <Link href="/partners" className="group block py-4">
      <Text
        variant="label"
        className="mb-10 text-center tracking-[0.2em] transition-colors group-hover:text-primary"
      >
        Backed by brands like:
      </Text>
      <Marquee pauseOnHover>
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="mx-9 inline-flex h-14 items-center justify-center opacity-80 transition hover:-translate-y-px hover:opacity-100"
          >
            <LogoImage
              src={partner.logoUrl}
              name={partner.name}
              className="h-12 w-auto max-w-[200px] grayscale"
              fallbackClassName="text-base text-foreground/70 sm:text-lg"
            />
          </div>
        ))}
      </Marquee>
    </Link>
  );
}
