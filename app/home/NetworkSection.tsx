import { StatValue } from '@/components/site/stat';
import { Section, SectionHeader } from '@/components/ui/section';
import { Text } from '@/components/ui/typography';
import {
  START_CHAPTER_COUNT,
  START_COUNTRY_COUNT,
  START_NETWORK_MEMBERS,
} from '@/lib/startNetwork';

import ChapterMarquee from './ChapterMarquee';

const stats = [
  { label: 'Cities', value: START_CHAPTER_COUNT },
  { label: 'Countries', value: START_COUNTRY_COUNT },
  { label: 'Members', value: START_NETWORK_MEMBERS, suffix: '+' },
];

function Globe() {
  return (
    <svg viewBox="0 0 200 200" className="size-full" fill="none" stroke="currentColor" aria-hidden>
      <circle cx="100" cy="100" r="80" strokeWidth="1.5" />
      <ellipse cx="100" cy="100" rx="80" ry="30" strokeWidth="1" />
      <ellipse cx="100" cy="100" rx="80" ry="55" strokeWidth="0.75" />
      <line x1="20" y1="100" x2="180" y2="100" strokeWidth="0.75" />
      <ellipse cx="100" cy="100" rx="30" ry="80" strokeWidth="1" />
      <ellipse cx="100" cy="100" rx="55" ry="80" strokeWidth="0.75" />
      <line x1="100" y1="20" x2="100" y2="180" strokeWidth="0.75" />
    </svg>
  );
}

/** "START Network" — chapter counts and the rolling list of chapter cities. */
export function NetworkSection() {
  return (
    <Section spacing="lg">
      <SectionHeader eyebrow="Global Community" title="START Network" />
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <Text className="mb-16 max-w-md">
            We&apos;re a part of the sprawling START Network. This interconnection multiplies our
            potential across the world, allowing us to draw inspiration from diverse cultures, share
            insights, and create an ecosystem that nurtures collective progress.
          </Text>
          <div className="absolute -bottom-10 -left-10 size-72 text-foreground opacity-15">
            <Globe />
          </div>
          <dl className="relative z-10 flex gap-8 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1">
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd>
                  <StatValue value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ChapterMarquee />
      </div>
    </Section>
  );
}
