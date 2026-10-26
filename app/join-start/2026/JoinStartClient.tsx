'use client';

import Image from 'next/image';
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

import { EventCard } from '@/components/site/event-card';
import { HorizontalScroller } from '@/components/site/horizontal-scroller';
import { PageHero } from '@/components/site/page-hero';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section, SectionHeader } from '@/components/ui/section';
import { Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { WaitlistForm } from './WaitlistForm';

const TARGET_DATE = new Date('2026-10-25T23:59:59+01:00').getTime();
const CLOSE_DATE = new Date('2026-10-26T00:00:00+01:00').getTime();
const APPLICATION_URL = 'https://tally.so/r/Y5ND8N';

const pad = (n: number) => String(n).padStart(2, '0');

interface ApplyEvent {
  id: string;
  name: string;
  description: string;
  month: string;
  image: string;
  category: string;
  ctaHref?: string;
  ctaLabel: string;
}

// Info events for the current application round. The events section is hidden while this is empty.
const applyEvents: ApplyEvent[] = [];

const reasons = [
  {
    title: 'Values Over Grades',
    image: '/join-start/volleyball.png',
    text: "No one here cares about your GPA. What matters is the courage to share an idea and the drive to make it real. That's how programmers end up brainstorming with psychologists, and musicians sketch out business models. Different worlds, same fire.",
  },
  {
    title: 'No Playbook',
    image: '/memberJourney/SF-opt.png',
    text: 'The Bay Area trip, START Labs, the Hacking Legal hackathon were never assigned. They started as ideas someone cared enough to make real. No hierarchy. No bureaucracy. Just people taking the leap of faith and building things that matter.',
  },
  {
    title: 'Failure Celebrated',
    image: '/events/eventCards/fail-opt.jpg',
    text: "At events like Founder Fail Tales, screw-ups don't get buried. We hand failures the mic, laugh at them together, and learn out loud. Because if you never fail, you never dared to build.",
  },
  {
    title: 'A Living Global Network',
    image: '/join-start/start-summit.jpeg',
    text: "START doesn't end when you leave Munich. It stays with you through new ventures, new cities, new chapters. You'll find co-founders, investors, and friends across the world. It's more than a network. It's a family you keep building with.",
  },
];

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const diff = Math.max(0, TARGET_DATE - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
      if (Date.now() >= CLOSE_DATE) setClosed(true);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return { timeLeft, mounted, closed };
}

function CountdownCard({
  timeLeft,
  mounted,
}: Pick<ReturnType<typeof useCountdown>, 'timeLeft' | 'mounted'>) {
  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];
  return (
    <Card
      variant="glass"
      size="lg"
      className="w-full items-center text-center lg:max-w-[380px] xl:max-w-[440px]"
    >
      <div className="flex w-full flex-col gap-6 px-(--card-spacing)">
        <Text variant="label" className="tracking-[0.35em] text-foreground/75 sm:text-sm">
          Applications close in
        </Text>
        <div
          className={cn(
            'grid grid-cols-4 gap-2 transition-opacity duration-400 sm:gap-4 lg:gap-2 xl:gap-3',
            mounted ? 'opacity-100' : 'opacity-0',
          )}
        >
          {units.map((unit) => (
            <div
              key={unit.label}
              className="rounded-xl border border-border bg-background/40 px-2 py-3 sm:py-5 lg:py-3"
            >
              <span className="block text-3xl font-black text-foreground tabular-nums sm:text-5xl lg:text-4xl">
                {pad(unit.value)}
              </span>
              <span className="mt-1 block text-2xs tracking-wide text-muted-foreground uppercase">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
        <Text variant="small" className="hidden sm:block">
          Don&apos;t miss your chance to join START Munich. Applications only open once per
          semester.
        </Text>
        <ButtonLink
          href={APPLICATION_URL}
          size="lg"
          className="w-full"
          onClick={() => posthog.capture('application_started', { location: 'hero_card' })}
        >
          Start Application
        </ButtonLink>
      </div>
    </Card>
  );
}

interface JoinStartClientProps {
  isLive: boolean;
  isClosed: boolean;
}

export default function JoinStartClient({ isLive, isClosed }: JoinStartClientProps) {
  const { timeLeft, mounted, closed } = useCountdown();

  if (isClosed || closed) {
    return (
      <PageHero
        image="/join-start-2026-bg.png"
        imagePosition="center center"
        size="full"
        scrim="strong"
        aura={false}
        title="Join bold,"
        outlineTitle="stay ahead"
      >
        <WaitlistForm />
        <p className="mt-4 max-w-2xl text-sm font-bold tracking-wide text-foreground/90 uppercase">
          Our application for the winter semester 2026 phase ended on Sunday, October 25th. Stay tuned
          for the next phase that will open in April 2027.
        </p>
      </PageHero>
    );
  }

  if (!isLive) {
    return (
      <PageHero
        image="/memberJourney/hero-opt.png"
        aura={false}
        title={
          <>
            Join <span className="text-outline">START Munich</span>
          </>
        }
        description="Applications for the Summer Semester 2027 open in April 2027. Stay tuned."
      />
    );
  }

  return (
    <>
      <PageHero
        image="/join-start-2026-bg.png"
        imagePosition="center center"
        scrim="strong"
        aura={false}
        className="min-h-[calc(100vh-30rem)] lg:min-h-[calc(100vh-5rem)]"
        title={
          <>
            Join
            <br />
            <span className="text-primary">START</span>
          </>
        }
        outlineTitle="Munich"
        description="Become part of Germany's leading student-run entrepreneurship initiative. At START Munich, you'll gain hands-on experience, connect with top-tier founders and investors, and build with one of Munich's most ambitious student communities."
        aside={<CountdownCard timeLeft={timeLeft} mounted={mounted} />}
      />

      <Section id="video" spacing="sm" className="scroll-mt-8">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          <iframe
            src="https://www.youtube.com/embed/T63USk9W_IY"
            title="START Munich Application Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        </div>
      </Section>

      {applyEvents.length > 0 && (
        <Section spacing="sm">
          <SectionHeader
            title="Got Questions? Let's Talk."
            description="Curious about START Munich or unsure about the application process? Join one of our upcoming events and get all your questions answered. Meet the team, learn what we're all about, and find out how you can become part of our entrepreneurial community."
          />
          <HorizontalScroller contentClassName="gap-6">
            {applyEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.name}
                date={event.month}
                imageUrl={event.image}
                description={event.description}
                className="w-[86vw] max-w-[320px] flex-none sm:w-[300px] lg:w-[320px]"
                ctaHref={event.ctaHref}
                ctaLabel={event.ctaLabel}
                onCtaClick={() =>
                  posthog.capture('application_event_registration_clicked', {
                    event_id: event.id,
                    event_name: event.name,
                  })
                }
              />
            ))}
          </HorizontalScroller>
        </Section>
      )}

      <Section spacing="sm">
        <SectionHeader
          title={<span className="text-primary">What Makes START Unique</span>}
          description="START Munich is more than a student initiative, it's a launchpad for future entrepreneurs. Here's why you should be part of it:"
        />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {reasons.map((reason) => (
            <article key={reason.title} className="flex flex-col items-center gap-3 text-center">
              <div className="relative mb-3 aspect-2/1 w-full overflow-hidden rounded-2xl">
                <Image
                  src={reason.image}
                  alt={reason.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <Heading as="h3" size="h4" className="text-xl font-black uppercase md:text-2xl">
                {reason.title}
              </Heading>
              <Text variant="small" className="md:text-base">
                {reason.text}
              </Text>
            </article>
          ))}
        </div>
      </Section>

      <Section spacing="sm" className="pb-16 md:pb-24">
        <div className="relative aspect-4/1 w-full overflow-hidden rounded-2xl">
          <Image
            src="/join-start/jumpstart.png"
            alt="Jumpstart Into Entrepreneurship"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <Heading
            as="h3"
            size="h4"
            className="text-xl font-black uppercase md:text-2xl lg:text-3xl"
          >
            Jumpstart Into Entrepreneurship
          </Heading>
          <Text variant="small" className="max-w-4xl md:text-base">
            At START, your first step is the Sprint. In just 30 days, you turn a raw idea into an
            MVP and pitch it to a jury. After that, you dive into the departments, the heart of
            START, where you keep building, drive projects, and shape the community. Some go on to
            launch startups, everyone learns by doing.
          </Text>
          <ButtonLink
            href={APPLICATION_URL}
            size="lg"
            className="mt-4"
            onClick={() => posthog.capture('application_started', { location: 'bottom_cta' })}
          >
            Start Application Now
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
