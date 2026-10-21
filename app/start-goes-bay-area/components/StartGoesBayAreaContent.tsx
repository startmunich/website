import { CtaBanner } from '@/components/site/cta-banner';
import { Faq, type FaqItem } from '@/components/site/faq';
import { PageHero } from '@/components/site/page-hero';
import { Section, SectionHeader } from '@/components/ui/section';
import { Text } from '@/components/ui/typography';

import BayAreaYearTabs from './BayAreaYearTabs';

const HERO_BACKGROUND = '/bayarea/years/2026-opt.jpg';

const OVERVIEW_DETAILS = [
  {
    label: 'Format',
    text: 'A two-week exchange program in San Francisco and Silicon Valley, organized by START Munich for a selected group of members.',
  },
  {
    label: 'Participants',
    text: 'Students from the START community who want to understand how different startup ecosystems work in practice.',
  },
  {
    label: 'Program',
    text: 'Company visits, founder and investor conversations, ecosystem events, and time in the city to experience the Bay Area beyond meeting rooms.',
  },
  {
    label: 'Purpose',
    text: 'The program helps members compare Munich and Bay Area startup culture, build relationships, and bring concrete learnings back into START.',
  },
] as const;

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'commercial',
    question: 'Is this commercial?',
    answer:
      'Nope. START goes Bay Area is fully non-profit and organized by students, for students. We do this because we believe in building bridges between Europe and the Bay Area ecosystem. None of the organizers is paid or receives a financial benefit or compensation.',
  },
  {
    id: 'commitment',
    question: "What's the time commitment for partners?",
    answer:
      'About 60-90 minutes for a Q&A session with our group. We keep things lean, authentic, and respectful of your schedule. You share your story, we bring the energy and questions.',
  },
  {
    id: 'participants',
    question: 'Who are the participants?',
    answer:
      "20 hand-picked students from START Munich - Germany's largest entrepreneurial student initiative. Think ~60% graduate students, ~32% Business & Engineering, ~22% CS. They've made it through two highly competitive selections: first for START, then for START goes Bay Area.",
  },
  {
    id: 'sessions',
    question: 'What do we talk about in the sessions?',
    answer:
      'Your journey - the real story behind building your company or fund. The uphill battles, pivotal decisions, and what actually matters in the Bay Area ecosystem. We want authenticity over polish.',
  },
  {
    id: 'frequency',
    question: 'How often does this happen?',
    answer:
      "Once a year, always in the first half of March. We kicked off this tradition in March 2025 and are committed to making it an annual pilgrimage for Europe's top entrepreneurial talent.",
  },
] as const;

export default function StartGoesBayAreaContent() {
  return (
    <>
      <PageHero
        image={HERO_BACKGROUND}
        title="START goes"
        outlineTitle="Bay Area"
        description="Connecting entrepreneurial talent from Europe with the San Francisco ecosystem."
      />

      <Section spacing="lg">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeader
            eyebrow="Program Overview"
            title="What START Goes Bay Area Is"
            size="h3"
            className="mb-0 md:mb-0"
          />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <Text>
                START Goes Bay Area is an international exchange program that brings a small group
                of START Munich members to the San Francisco Bay Area.
              </Text>
              <Text>
                The trip is built around direct exposure to the local startup ecosystem: meeting
                people who build, fund, and support companies, visiting organizations on site, and
                reflecting on what can be transferred back to Munich.
              </Text>
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {OVERVIEW_DETAILS.map((item) => (
                <div key={item.label} className="flex flex-col gap-3 sm:pr-8">
                  <dt className="text-sm font-bold tracking-[0.22em] text-foreground/70 uppercase">
                    {item.label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section spacing="none" className="pb-20 md:pb-24">
        <BayAreaYearTabs />
      </Section>

      <Section spacing="none" className="pb-20">
        <SectionHeader
          eyebrow="Have Questions?"
          title={
            <>
              Frequently asked <span className="text-outline">questions</span>
            </>
          }
          description="Everything you need to know about START Goes Bay Area."
        />
        <Faq items={FAQ_ITEMS} />
      </Section>

      <Section spacing="none" className="pb-24">
        <CtaBanner
          title={
            <>
              Collaborate with{' '}
              <span className="underline decoration-primary decoration-4 underline-offset-8">
                START goes Bay Area
              </span>
            </>
          }
          description="Want to host a session, support future chapters, or connect with the team?"
          actions={[
            { label: 'Contact Team', href: 'mailto:bayarea@startmunich.de', external: false },
          ]}
        />
      </Section>
    </>
  );
}
