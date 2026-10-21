import { ArrowRightIcon, BuildingIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { CtaBanner } from '@/components/site/cta-banner';
import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { HorizontalScroller } from '@/components/site/horizontal-scroller';
import { PageHero } from '@/components/site/page-hero';
import { HeroStat, HeroStats } from '@/components/site/stat';
import { TestimonialCard } from '@/components/site/testimonial-card';
import { Badge } from '@/components/ui/badge';
import { BulletList } from '@/components/ui/bullet-list';
import { Card, CardMedia } from '@/components/ui/card';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Heading, Text } from '@/components/ui/typography';

import { memberStories, timelineEvents } from './data';
import { DepartmentPicker } from './DepartmentPicker';
import { InternalEvents } from './InternalEvents';

function SpecialCard({
  image,
  imageAlt,
  title,
  children,
  footer,
  href,
}: {
  image: string;
  imageAlt: string;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  href?: string;
}) {
  return (
    <Card
      interactive
      className="group/card gap-0 py-0"
      render={href ? <Link href={href} /> : undefined}
    >
      <CardMedia className="aspect-video">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </CardMedia>
      <div className="flex flex-col gap-4 p-8">
        <Heading
          as="h3"
          size="h4"
          className="text-2xl font-black uppercase transition-colors group-hover/card:text-primary"
        >
          {title}
        </Heading>
        <Text variant="small" className="text-foreground/75">
          {children}
        </Text>
        {footer}
      </div>
    </Card>
  );
}

export default function MemberJourneyContent() {
  return (
    <>
      <EmbedHeightReporter />

      <PageHero
        image="/memberJourney/hero-opt.png"
        title="Your START Munich"
        outlineTitle="Journey"
        description="Become a member and spend at least two active semesters contributing to the community"
        aside={
          <HeroStats>
            <HeroStat label="Semesters" value={2} animate suffix="+" />
            <HeroStat label="Possibilities" value="∞" />
          </HeroStats>
        }
      />

      <Section spacing="none" container={false} className="pt-12 lg:pt-28">
        <Container>
          <SectionHeader
            eyebrow="Your Path"
            title={
              <>
                Member <span className="text-outline">Journey</span>
              </>
            }
            description="The 5 milestones of your first two semesters at START Munich"
          />
        </Container>
        <Container className="px-0 sm:px-0 lg:px-0">
          <HorizontalScroller contentClassName="px-4 sm:px-6 lg:px-8">
            {timelineEvents.map((event, index) => (
              <Card
                key={event.id}
                interactive
                size="lg"
                className="group/card w-80 shrink-0 backdrop-blur-xs motion-safe:animate-in motion-safe:duration-700 motion-safe:fill-mode-backwards motion-safe:fade-in motion-safe:slide-in-from-left-8"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col gap-4 px-(--card-spacing)">
                  <div className="mb-2 flex items-center gap-4">
                    <span className="text-5xl leading-none font-black tracking-tight text-foreground/20 tabular-nums">
                      0{index + 1}
                    </span>
                    <span className="h-px flex-1 bg-linear-to-r from-foreground/20 to-transparent" />
                  </div>
                  <Heading
                    as="h3"
                    size="h4"
                    className="text-xl font-black uppercase transition-colors group-hover/card:text-primary"
                  >
                    {event.title}
                  </Heading>
                  <Text variant="small">{event.description}</Text>
                  <BulletList items={event.details} className="mt-2" />
                </div>
              </Card>
            ))}
          </HorizontalScroller>
        </Container>
      </Section>

      <Section spacing="lg">
        <SectionHeader
          eyebrow="Where You Fit"
          title={
            <>
              Our <span className="text-outline">Departments</span>
            </>
          }
          description="Choose your department and contribute to our community"
        />
        <DepartmentPicker />
      </Section>

      <Section spacing="none" className="pb-20 md:pb-28">
        <SectionHeader
          eyebrow="Community Life"
          title={
            <>
              Internal <span className="text-outline">Events</span>
            </>
          }
          description="Regular events and activities of our community"
        />
        <InternalEvents />
      </Section>

      <Section spacing="none" className="pb-20 md:pb-28">
        <SectionHeader
          eyebrow="Exclusive Access"
          title={
            <>
              Community <span className="text-outline">Specials</span>
            </>
          }
          description="Unique opportunities exclusively for START Munich members"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SpecialCard
            href="/start-goes-bay-area"
            image="/memberJourney/SF-opt.png"
            imageAlt="San Francisco Bay Area"
            title="START goes Bay Area"
            footer={
              <span className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all group-hover/card:gap-3">
                Learn more <ArrowRightIcon className="size-4" />
              </span>
            }
          >
            Once a year, 20 selected STARTies go on a two-week trip to the San Francisco Bay Area to
            experience one of the world&apos;s most vibrant startup ecosystems firsthand. Through
            curated visits with partner companies, research labs, and VC firms, participants
            strengthen our ties with international founders, researchers, and investors.
          </SpecialCard>
          <SpecialCard
            image="/memberJourney/cambridge-aerial-opt.png"
            imageAlt="University Research"
            title="Research Stay @ Cambridge"
            footer={
              <div className="flex items-center gap-3">
                {['Cambridge', 'TUM'].map((uni) => (
                  <Badge key={uni} variant="glass" size="sm" className="text-muted-foreground">
                    <BuildingIcon />
                    {uni}
                  </Badge>
                ))}
              </div>
            }
          >
            Spend a research stay with our partners at the University of Cambridge and Technical
            University of Munich. Gain access to world-class academic resources, mentorship from
            leading researchers, and the opportunity to contribute to cutting-edge research.
          </SpecialCard>
        </div>
      </Section>

      <Section spacing="none" className="pb-20 md:pb-28">
        <SectionHeader
          title={
            <>
              <span className="text-outline">Member</span> Stories
            </>
          }
          description="Real stories from our members who built successful startups with START Munich"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {memberStories.map((story) => (
            <TestimonialCard key={story.id} item={story} />
          ))}
        </div>
      </Section>

      <Section spacing="none" className="pb-20 md:pb-28">
        <CtaBanner
          title="Ready to Join?"
          description="Start your entrepreneurial journey with START Munich today. Apply to become a member and experience our vibrant community."
          actions={[
            { label: 'Apply Now', href: '/apply', variant: 'soft' },
            {
              label: 'Contact People Department',
              href: 'https://tally.so/r/mZNxV0',
              variant: 'soft',
            },
            { label: 'Learn More', href: '/about-us', variant: 'soft' },
          ]}
        />
      </Section>
    </>
  );
}
