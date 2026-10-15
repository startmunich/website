'use client';

import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { ProfileCard } from '@/components/site/profile-card';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeader } from '@/components/ui/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { bayAreaYearContent } from '@/lib/startGoesBayAreaData';
import { cn } from '@/lib/utils';

import type { BayAreaYearContent } from '../types';

const PAST_YEAR_CONTENT = bayAreaYearContent.filter((item) => !item.isPreview);

/** Logos are drawn for light or dark grounds; the chip matches. */
function LogoChip({
  src,
  alt,
  theme,
  className,
}: {
  src: string;
  alt: string;
  theme?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-lg border px-3 shadow-card',
        theme === 'dark' ? 'border-border bg-surface' : 'border-black/5 bg-white',
        className,
      )}
    >
      {/* Variable-aspect logos; fixed height with auto width. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-auto max-w-[140px] object-contain py-1.5" />
    </span>
  );
}

function YearBlock({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 flex flex-col gap-3 pt-8">
      <Eyebrow className="text-xs tracking-[0.28em]">{label}</Eyebrow>
      <Heading as="h4" size="h4" className="text-2xl font-black tracking-tight uppercase">
        {title}
      </Heading>
      {description && (
        <Text variant="small" className="max-w-3xl">
          {description}
        </Text>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ExternalOrPlain({
  href,
  label,
  className,
  children,
}: {
  href?: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} website`}
      className={className}
    >
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  );
}

function YearPanel({ year }: { year: BayAreaYearContent }) {
  return (
    <div className="relative mt-10 border-l-2 border-primary/60 pl-5 sm:pl-8">
      <span className="absolute top-0 -left-[9px] size-4 rounded-full border-2 border-primary bg-background" />

      <div className="relative min-h-88 overflow-hidden rounded-2xl border border-border">
        <Image
          src={year.groupPictureUrl}
          alt={`START Goes Bay Area ${year.label}`}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      <YearBlock
        label={year.label}
        title="Key Visits"
        description="A few of the most memorable stops from the year."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {year.highlightVisits.map((visit) => (
            <ExternalOrPlain key={visit.name} href={visit.websiteUrl} label={visit.name}>
              <Card interactive size="sm" className="h-full gap-4">
                <div className="mx-(--card-spacing) flex h-16 items-center rounded-xl bg-muted px-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={visit.logoPath ?? '/startlogo.svg'}
                    alt={`${visit.name} logo`}
                    className="h-10 w-auto max-w-[140px] object-contain"
                  />
                </div>
                <div className="px-(--card-spacing)">
                  <h5 className="text-lg font-black uppercase">{visit.name}</h5>
                  <Text variant="label" className="mt-1 tracking-[0.18em]">
                    {visit.context}
                  </Text>
                </div>
              </Card>
            </ExternalOrPlain>
          ))}
        </div>
      </YearBlock>

      <YearBlock
        label={year.label}
        title="Hosts & Ecosystem"
        description="A curated look at the startups, teams, and organizations we visited across the Bay Area."
      >
        <div className="flex flex-wrap gap-3">
          {year.hosts.map((host) => (
            <ExternalOrPlain
              key={host.name}
              href={host.websiteUrl}
              label={host.name}
              className="inline-flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 transition-colors hover:border-primary/40 hover:bg-accent"
            >
              {host.logoPath && (
                <LogoChip
                  src={host.logoPath}
                  alt={`${host.name} logo`}
                  theme={host.logoTheme}
                  className="h-10 min-w-20"
                />
              )}
              <span className="text-sm font-medium text-foreground/90">{host.name}</span>
            </ExternalOrPlain>
          ))}
        </div>
      </YearBlock>

      <YearBlock
        label={year.label}
        title="Meet the Team"
        description="The organizing team behind this Bay Area year."
      >
        {year.teamMembers.length > 0 ? (
          <>
            <p className="mb-6 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-primary uppercase">
              Scroll <ArrowRightIcon className="size-4" />
            </p>
            <div className="-mx-5 no-scrollbar overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
              <div className="flex gap-7">
                {year.teamMembers.map((member) => (
                  <ProfileCard
                    key={member.name}
                    variant="overlay"
                    size="xl"
                    name={member.name}
                    imageUrl={member.photoPath}
                    imagePosition="bottom"
                    linkedinUrl={member.linkedinUrl}
                    sizes="14rem"
                    className="shrink-0"
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <Card size="sm">
            <Text variant="small" className="px-(--card-spacing)">
              Team announcement coming soon.
            </Text>
          </Card>
        )}
      </YearBlock>
    </div>
  );
}

/**
 * Past editions of the trip, one tab per year. Team portraits come entirely from
 * `bayAreaYearContent` (the old NocoDB `/api/members` override always returned []).
 */
export default function BayAreaYearTabs() {
  const defaultYear = PAST_YEAR_CONTENT[PAST_YEAR_CONTENT.length - 1]?.id ?? '2026';

  return (
    <Reveal>
      <Tabs defaultValue={defaultYear} className="gap-0">
        <SectionHeader
          className="mb-0 md:mb-0"
          eyebrow="Past Programs"
          title="Past Timetables"
          description="Browse previous editions of START Goes Bay Area. The content below belongs to the selected year."
          actions={
            <TabsList className="h-auto w-full rounded-2xl border border-border bg-black/20 p-1 sm:w-auto">
              {PAST_YEAR_CONTENT.map((year) => (
                <TabsTrigger
                  key={year.id}
                  value={year.id}
                  className="h-10 rounded-xl px-5 font-bold tracking-[0.18em] uppercase data-active:border-transparent data-active:bg-primary data-active:text-primary-foreground"
                >
                  {year.label}
                </TabsTrigger>
              ))}
            </TabsList>
          }
        />
        {PAST_YEAR_CONTENT.map((year) => (
          <TabsContent key={year.id} value={year.id}>
            <YearPanel year={year} />
          </TabsContent>
        ))}
      </Tabs>
    </Reveal>
  );
}
