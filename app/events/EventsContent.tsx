import { LockIcon } from 'lucide-react';

import { CtaBanner } from '@/components/site/cta-banner';
import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { EmptyState } from '@/components/site/empty-state';
import { PageHero } from '@/components/site/page-hero';
import { SocialLinks } from '@/components/site/social-links';
import { HeroStat, HeroStats } from '@/components/site/stat';
import { Badge } from '@/components/ui/badge';
import { Section, SectionHeader } from '@/components/ui/section';
import type { YearlyStats } from '@/lib/eventCalendar';
import type { StartEvent } from '@/lib/eventTypes';

import { EventTimeline } from './EventTimeline';
import PastEventsList from './PastEventsList';
import UpcomingEventsList from './UpcomingEventsList';

export interface EventsContentProps {
  /** One marker per dated event, positioned by its real start date. */
  markers: Array<{
    eventId: string;
    title: string;
    color: string;
    month: number;
    day: number;
    left: string;
    side: 'top' | 'bottom';
  }>;
  upcomingEvents: StartEvent[];
  pastEvents: StartEvent[];
  stats: YearlyStats;
}

export default function EventsContent({
  markers,
  upcomingEvents,
  pastEvents,
  stats,
}: EventsContentProps) {
  return (
    <>
      <EmbedHeightReporter />

      <PageHero
        image="/events/hero-opt.jpg"
        title="START Munich"
        outlineTitle="Events"
        description="Connect, learn, and grow with Munich's most vibrant student entrepreneur community through our curated events"
        aside={
          <HeroStats>
            <HeroStat
              label="Hackathons Yearly"
              value={stats.hackathons}
              animate
              suffix="+"
              data-testid="hackathon-count"
            />
            <HeroStat
              label="Public Events Yearly"
              value={stats.events}
              animate
              suffix="+"
              data-testid="event-count"
            />
          </HeroStats>
        }
      />

      <Section spacing="sm" className="pt-8 lg:pt-20">
        <SectionHeader
          eyebrow="What's Next"
          title="Upcoming Events"
          description="Stay updated with all our latest events and register to join us."
          actions={<SocialLinks />}
        />
        <UpcomingEventsList events={upcomingEvents} />
      </Section>

      <Section spacing="sm">
        <SectionHeader
          eyebrow="Annual Calendar"
          title={
            <>
              Our <span className="text-outline">year</span> in events
            </>
          }
          description="Every event on our calendar, exactly when it happens."
        />
        {markers.length > 0 ? (
          <EventTimeline markers={markers} />
        ) : (
          <EmptyState
            data-testid="events-calendar-empty"
            description="The calendar is being updated — check back soon."
          />
        )}
      </Section>

      <Section spacing="sm">
        <CtaBanner
          layout="split"
          badge={
            <Badge variant="soft" size="sm" className="tracking-widest uppercase">
              <LockIcon />
              Members Only
            </Badge>
          }
          title="Hungry for more?"
          description="As a START Munich member, you get access to exclusive events including private dinners with successful founders, closed-door workshops with industry experts, peer feedback sessions, and intimate networking gatherings. These events are designed to provide maximum value and foster deep connections within our community."
          actions={[{ label: 'Our Members Journey', href: '/members' }]}
        />
      </Section>

      <Section spacing="sm" className="pb-16 md:pb-24">
        <SectionHeader
          eyebrow="Looking Back"
          title="Past Events"
          description="Check out the amazing events we've hosted in the past."
        />
        <PastEventsList events={pastEvents} />
      </Section>
    </>
  );
}
