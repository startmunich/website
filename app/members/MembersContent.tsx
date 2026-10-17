import { ArrowRightIcon, BookOpenIcon, BuildingIcon, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { PageHero } from '@/components/site/page-hero';
import { HeroStat, HeroStats } from '@/components/site/stat';
import { Card, CardMedia } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { Progress } from '@/components/ui/progress';
import { Reveal } from '@/components/ui/reveal';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Separator } from '@/components/ui/separator';
import { Eyebrow } from '@/components/ui/typography';

import { getBatchSlug, sortedBatches } from './batches';
import { BoardsSection } from './BoardsSection';

const genderSplit = [
  { label: 'Male', value: 59 },
  { label: 'Female', value: 41 },
];

const topStudies = [
  { label: 'Computer Science', value: 40 },
  { label: 'Business Administration', value: 30 },
  { label: 'Engineering', value: 16 },
  { label: 'Others', value: 14 },
];

const topUniversities = [
  { label: 'TUM', value: 65 },
  { label: 'LMU', value: 20 },
  { label: 'HM', value: 7 },
  { label: 'Others', value: 8 },
];

function MetricCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card size="lg" className="gap-6">
      <div className="flex items-center gap-3 px-(--card-spacing)">
        <IconTile>{icon}</IconTile>
        <Eyebrow render={<span />} className="text-xs tracking-[0.25em]">
          {title}
        </Eyebrow>
      </div>
      <div className="flex flex-col gap-3 px-(--card-spacing)">{children}</div>
    </Card>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="truncate text-foreground/80">{label}</span>
      <span className="shrink-0 font-bold text-primary">{value}%</span>
    </div>
  );
}

/**
 * `/api/members` was a NocoDB route backed by a table that no longer exists, so
 * the page renders from the curated board list (see `useBoards`) plus the
 * per-batch pages at `/members/[batch]`.
 */
export default function MembersContent() {
  return (
    <>
      <EmbedHeightReporter />

      <PageHero
        image="/ourMembers/hero-opt.png"
        title="START Munich"
        outlineTitle="Members"
        description="Meet the ambitious student entrepreneurs building the future of technology and innovation."
        aside={
          <HeroStats>
            <HeroStat label="Active Members" value={70} animate suffix="+" />
            <HeroStat label="Alumni" value={600} animate suffix="+" />
          </HeroStats>
        }
      />

      <Section spacing="sm">
        <Reveal>
          <SectionHeader eyebrow="By the Numbers" title="Community Analytics" />
        </Reveal>
        <Reveal delay={150} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <MetricCard icon={<UsersIcon />} title="Gender Distribution">
            {genderSplit.map((g) => (
              <Progress
                key={g.label}
                value={g.value}
                className="gap-2 [&_[data-slot=progress-track]]:h-2"
              >
                <div className="flex w-full items-center justify-between text-sm">
                  <span className="text-muted-foreground">{g.label}</span>
                  <span className="font-bold text-foreground">{g.value}%</span>
                </div>
              </Progress>
            ))}
          </MetricCard>
          <MetricCard icon={<BookOpenIcon />} title="Top Study Fields">
            {topStudies.map((s) => (
              <MetricRow key={s.label} {...s} />
            ))}
          </MetricCard>
          <MetricCard icon={<BuildingIcon />} title="Top Universities">
            {topUniversities.map((u) => (
              <MetricRow key={u.label} {...u} />
            ))}
          </MetricCard>
        </Reveal>
      </Section>

      <Container>
        <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
      </Container>

      <Section spacing="sm">
        <Reveal>
          <SectionHeader eyebrow="Leadership" title="The Boards" />
        </Reveal>
        <BoardsSection />
      </Section>

      <Container>
        <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
      </Container>

      <Section spacing="sm" className="pb-16 md:pb-24">
        <Reveal>
          <SectionHeader eyebrow="Our Community" title="Our Batches" />
        </Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {sortedBatches.map((batch, i) => (
            <Reveal key={batch.name} delay={150 + i * 80}>
              <Card
                interactive
                className="group/card py-0"
                render={<Link href={`/members/${getBatchSlug(batch.name)}`} />}
              >
                <CardMedia className="h-72 sm:h-80">
                  <Image
                    src={batch.groupImageUrl}
                    alt={batch.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                    <h3 className="text-xl font-black uppercase sm:text-2xl">{batch.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-bold tracking-widest text-foreground/60 uppercase">
                      Explore <ArrowRightIcon className="size-3.5" />
                    </span>
                  </div>
                </CardMedia>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
