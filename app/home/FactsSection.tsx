import { ArrowRightIcon, ZapIcon } from 'lucide-react';
import Link from 'next/link';

import { LogoImage, LogoTile } from '@/components/site/logo-image';
import { StatCard } from '@/components/site/stat';
import { Marquee } from '@/components/ui/marquee';
import { Reveal } from '@/components/ui/reveal';
import { Section, SectionHeader } from '@/components/ui/section';
import type { Startup } from '@/lib/types';
import { cn } from '@/lib/utils';

function Segments({ filled, total }: { filled: number; total: number }) {
  return (
    <div className="mt-1 flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn('h-1.5 flex-1 rounded-full', i < filled ? 'bg-primary' : 'bg-muted')}
        />
      ))}
    </div>
  );
}

/** "The facts" — portfolio numbers and a ticker of featured startup logos. */
export function FactsSection({
  startups,
  startupCount,
}: {
  startups: Startup[];
  startupCount: number;
}) {
  return (
    <Section spacing="lg">
      <Reveal>
        <SectionHeader eyebrow="Our Startups" title="The Facts" />
      </Reveal>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-12">
        <Reveal delay={100} className="md:col-span-7">
          <StatCard
            variant="highlight"
            size="lg"
            label="Capital Raised"
            prefix="€"
            value={3}
            animate
            suffix="B+"
          >
            <p className="mt-3 max-w-sm text-muted-foreground">
              Raised by our alumni founders and community startups.
            </p>
          </StatCard>
        </Reveal>

        <div className="flex flex-col gap-6 md:col-span-5">
          <Reveal delay={200} className="flex-1">
            <StatCard
              size="default"
              label="Startups"
              value={startupCount + 30}
              animate
              suffix="+"
              icon={<ZapIcon />}
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-6">
            <Reveal delay={300}>
              <StatCard label="YC & other programs" value={8} animate suffix="+">
                <Segments filled={4} total={5} />
              </StatCard>
            </Reveal>
            <Reveal delay={400}>
              <StatCard label="Unicorn" value={1} animate>
                <Segments filled={1} total={1} />
              </StatCard>
            </Reveal>
          </div>
        </div>
      </div>

      {startups.length > 0 && (
        <Marquee>
          {startups.map((startup) => (
            <Link key={startup.id} href="/startups" className="mx-6 inline-flex shrink-0">
              <LogoTile>
                <LogoImage
                  src={startup.logoUrl}
                  name={startup.name}
                  className="max-h-10 max-w-[100px]"
                  fallbackClassName="text-brand-navy"
                />
              </LogoTile>
            </Link>
          ))}
        </Marquee>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/startups"
          className="group inline-flex items-center gap-2 font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          View all our startups
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Section>
  );
}
