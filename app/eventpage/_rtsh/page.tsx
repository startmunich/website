import { ArrowRightIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

import { Faq, type FaqItem } from '@/components/site/faq';
import { MicrositeFooter } from '@/components/site/microsite-footer';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import BrevoForm from './BrevoForm';
import HeroVideo from './HeroVideo';

export const metadata: Metadata = {
  title: 'Join the Waitlist for START Hack Munich 2026',
  description:
    "Munich's most entrepreneurial hackathon. From hello world to hello users in 24 hours, built small and shown proud. 250 builders, one weekend. Join the 2026 waitlist.",
  alternates: { canonical: 'https://www.startmunich.de/eventpage/rtsh' },
  openGraph: {
    url: 'https://www.startmunich.de/eventpage/rtsh',
    title: 'START Hack Munich 2026 | START Munich',
    description:
      'From hello world to hello users in 24 hours. 250 builders, one weekend at TU Munich. Join the 2026 waitlist.',
    type: 'website',
    images: [
      {
        url: '/eventpage/rtsh/og-image.jpg',
        width: 1200,
        height: 800,
        alt: 'START Hack Munich 2026 — 24 hours from idea to demo',
      },
    ],
  },
};

const facts = [
  { label: 'When', value: '21–22 Nov', sub: '2026 · Sat–Sun' },
  { label: 'Where', value: 'Audimax', sub: 'TU Munich' },
  { label: 'Who', value: '250 builders', sub: 'all fields welcome' },
  { label: 'Format', value: '24h build', sub: 'demo on stage' },
];

const stats = [
  { value: '24h', label: 'to build' },
  { value: '250', label: 'builders' },
  { value: '1', label: 'demo you’re proud of' },
];

const challengePartners = [
  { name: 'QuantCo', logo: '/eventpage/rtsh/quantco_logo.svg' },
  { name: 'revel8', logo: '/eventpage/rtsh/revel8_logo.svg' },
];

const faqs: FaqItem[] = [
  {
    id: 'waitlist',
    question: "What's the waitlist?",
    answer:
      'Applications for the hackathon open on Luma in October 2026, with limited spots. Join the waitlist now and we’ll get you in first when it goes live, before the wider announcement.',
  },
  {
    id: 'when',
    question: 'When and where will the hackathon take place?',
    answer:
      '21–22 November 2026 (Saturday–Sunday), in the Audimax at TU München, Arcisstraße 21, 80333 Munich. The full schedule and the challenges drop closer to the day.',
  },
  {
    id: 'who',
    question: 'Who can join?',
    answer:
      'Any student with curiosity and a spark of creativity! Whether you’re studying engineering, computer science, physics, math, business, or management, if you love solving real-world problems, this hackathon is for you.',
  },
  {
    id: 'cost',
    question: 'What does it cost, and what do I bring?',
    answer:
      'Taking part is free. Bring a laptop, a charger and a good mood. We’ve got the food, drinks and the space. A blanket helps if you plan to build through the night.',
  },
  {
    id: 'team',
    question: 'Do I need to have a team in advance?',
    answer:
      'Nope! You can apply solo. We’ll have a matchmaking session at the start of the event, so there’s plenty of time to find your dream team.',
  },
  {
    id: 'alone',
    question: 'Can I participate alone?',
    answer:
      'You can apply alone, but you’ll need a team to compete. Don’t worry, we’ll help you find one!',
  },
  {
    id: 'contact',
    question: 'Still have questions?',
    answer: (
      <>
        Talk to us any time:{' '}
        <a href="mailto:s.nalliboyana@startmunich.de">s.nalliboyana@startmunich.de</a> or{' '}
        <a href="mailto:s.park@startmunich.de">s.park@startmunich.de</a>.
      </>
    ),
  },
];

/** START Hack Munich microsite. Everything inside `.theme-rtsh` picks up the teal sub-brand. */
export default function RtshPage() {
  return (
    <div id="top" className="theme-rtsh [--radius:1rem]">
      <section className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden pt-32 pb-10">
        <HeroVideo src="/eventpage/rtsh/green-video.mp4" poster="/eventpage/rtsh/og-image.jpg" />
        <div className="absolute inset-0 bg-linear-to-b from-background/95 via-background/80 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_45%,color-mix(in_oklab,var(--background)_88%,transparent)_0%,transparent_62%)]" />

        <Container size="narrow" className="relative z-10">
          <Heading size="display" className="mt-5 max-w-[15ch] lg:text-7xl">
            START Hack Munich 2026
          </Heading>
          <Text variant="lead" className="mt-6 max-w-[46ch]">
            Munich&apos;s most entrepreneurial hackathon is back. 250 builders, one weekend, real
            challenges from real startups,{' '}
            <span className="text-foreground">21–22 November 2026 at the TUM Audimax.</span>
          </Text>
          <ButtonLink
            href="#waitlist"
            size="lg"
            shape="pill"
            className="mt-8 hover:-translate-y-0.5"
          >
            Join the waitlist <ArrowRightIcon />
          </ButtonLink>
        </Container>

        <Container size="narrow" className="relative z-10 mt-16">
          <dl className="grid grid-cols-2 border-t border-border/60 sm:grid-cols-4">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={cn(
                  'border-border/60 py-7 pr-4 pl-5 sm:px-6',
                  i < 2 && 'border-b sm:border-b-0',
                  i < 3 && 'sm:border-r',
                )}
              >
                <dt className="text-2xs font-bold tracking-[0.2em] text-muted-foreground/80 uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-2.5 text-xl leading-tight font-black text-primary uppercase">
                  {fact.value}
                  <small className="mt-0.5 block text-sm font-medium text-muted-foreground normal-case">
                    {fact.sub}
                  </small>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Section spacing="lg" container="narrow">
        <SectionHeader
          className="max-w-[62ch]"
          title={
            <span className="text-primary normal-case">
              Turn a simple idea into something people can click.
            </span>
          }
          size="h3"
          description="START Hack Munich brings together 250 innovators from all fields and backgrounds together to solve real-world challenges in just 24 hours. We help you keep the scope tight, mentors jump in when you are stuck, and the room stays friendly and focused. You prototype, test with people nearby, and polish just enough to show it. No experience required. Bring your laptop and curiosity. By the end you can say hello users for real, with a demo you are proud to share and a path to keep going."
        />
      </Section>

      <Section spacing="none" container="narrow" className="pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              variant="solid"
              size="lg"
              className="items-center text-center shadow-2xl shadow-black/20"
            >
              <div className="px-(--card-spacing)">
                <div className="text-5xl leading-none font-black tracking-tight text-primary uppercase sm:text-6xl">
                  {stat.value}
                </div>
                <div className="mt-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section spacing="none" container="narrow" className="pb-20">
        <Heading size="h3" className="text-primary/75">
          Challenge Partners
        </Heading>
        <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-input bg-input md:grid-cols-4">
          {challengePartners.map((partner) => (
            <div
              key={partner.name}
              className="flex min-h-23 items-center justify-center bg-surface p-7"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={240}
                height={90}
                className="max-h-10 w-auto max-w-full object-contain"
              />
            </div>
          ))}
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-23 items-center justify-center bg-surface p-7 text-xs font-bold tracking-[0.08em] text-muted-foreground uppercase"
            >
              coming soon
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="none" container="narrow" className="pb-20" containerClassName="max-w-4xl">
        <SectionHeader
          align="center"
          title={<span className="text-primary">Frequently Asked Questions</span>}
          size="h3"
        />
        <Faq items={faqs} defaultValue={['waitlist']} />
      </Section>

      <Section id="waitlist" spacing="none" container="narrow" className="scroll-mt-24 pb-24">
        <Card className="items-center gap-4 border-border bg-linear-to-br from-secondary to-surface px-6 py-12 text-center shadow-2xl shadow-black/20 sm:px-12 sm:py-16">
          <Eyebrow className="tracking-[0.24em]">Limited to 250 spots</Eyebrow>
          <Heading size="h3" className="text-primary">
            Sign up for the waiting list.
          </Heading>
          <Text variant="lead" className="max-w-[44ch]">
            The waitlist gets first pick. Register now, and we&apos;ll bring you in the moment
            applications open.
          </Text>
          <div className="mt-6 flex w-full justify-center">
            <BrevoForm />
          </div>
        </Card>
      </Section>

      <MicrositeFooter label="START Hack Munich" />
    </div>
  );
}
