import { ArrowRightIcon, CalendarDaysIcon, MapPinIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Faq, type FaqItem } from '@/components/site/faq';
import { MicrositeFooter } from '@/components/site/microsite-footer';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Marquee } from '@/components/ui/marquee';
import { Container, Section } from '@/components/ui/section';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import RtssHeroTitle from './RtssHeroTitle';

export const metadata: Metadata = {
  title: 'Road to START Summit',
  description:
    "Join START Munich's Road to START Summit, Munich's student-organized startup pitch competition for founders, investors, students, and operators.",
  alternates: { canonical: 'https://www.startmunich.de/eventpage/rtss' },
  openGraph: {
    url: 'https://www.startmunich.de/eventpage/rtss',
    title: 'Road to START Summit | START Munich',
    description:
      "Munich's student-organized pitch competition for early-stage Tech and DeepTech startups.",
    images: [
      {
        url: '/eventpage/rtss/mountain.png',
        width: 1920,
        height: 829,
        alt: 'Road to START Summit mountain artwork',
      },
    ],
  },
};

const startupApplyUrl = 'https://tally.so/r/mV2WvE';
const attendeeUrl = 'https://luma.com/ospxiu4z';

const navItems = [
  ['What is RtSS?', '#what'],
  ['Why pitch?', '#pitch'],
  ['Why attend?', '#attend'],
  ['Partners', '#partners'],
  ['Testimonials', '#testimonials'],
  ['FAQ', '#faq'],
];

const infoSections = [
  {
    id: 'what',
    eyebrow: 'What is the',
    title: 'Road to START Summit?',
    image: '/eventpage/rtss/what.jpg',
    alt: 'Road to START Summit audience and stage',
    body: [
      "The Road to START Summit is Munich's most exciting student-organized pitching competition, hosted by START Munich, the city's leading entrepreneurship student initiative.",
      'This year, the event brings together the most promising early-stage DeepTech startups to pitch their ideas in front of an audience of founders, investors, students, and industry experts.',
      "The winner secures a spot at START Summit in St. Gallen, Europe's largest student-organized startup conference with 6,000+ attendees, and competes for CHF 10,000 in prize money.",
      'Under this year\'s theme, "Beyond the Peak," we invite you to explore what lies beyond: new ideas, bold collaborations, and the next generation of entrepreneurship in Munich.',
    ],
  },
  {
    id: 'pitch',
    eyebrow: 'Why should I',
    title: 'pitch at Road to START Summit?',
    image: '/eventpage/rtss/why-pitch.jpg',
    alt: 'Founder pitching on stage',
    body: [
      "If you're building a Tech or DeepTech startup, then this is your stage.",
      "Pitch in front of Munich's leading investors, including top-tier VCs such as b2ventures and Alstin Capital.",
      "Win a spot at START Summit in St. Gallen, gain exposure to 6,000+ founders, investors, and corporate innovators, and compete on one of Europe's biggest startup stages.",
      'Secure tangible rewards: winners receive a guaranteed START Summit booth, a startup ticket, and a chance to compete for CHF 10,000.',
      'Connect with founders, VCs, mentors, and professors shaping the future of entrepreneurship in Munich and beyond.',
    ],
    cta: 'Apply As A Start-up',
    href: startupApplyUrl,
    reverse: true,
  },
  {
    id: 'attend',
    eyebrow: 'Why should I',
    title: 'attend Road to START Summit?',
    image: '/eventpage/rtss/why-attend.jpg',
    alt: 'Road to START Summit guests networking',
    body: [
      "No matter if you're new to startups, an experienced founder, or one of the VCs driving Europe's next wave of innovation, this is the place to be.",
      'Join 300+ attendees for a night of inspiration, innovation, and real connection.',
      "Expect live pitches from some of Europe's most exciting early-stage startups, next-level networking with founders and investors, snacks and drinks, and a glimpse into the future of technology and entrepreneurship.",
    ],
    cta: 'Take part as an attendee',
    href: attendeeUrl,
  },
];

const partners = [
  { name: 'b2venture', logo: '/eventpage/rtss/logo-b2venture.png' },
  { name: 'Ahead', logo: '/eventpage/rtss/logo-ahead.png' },
  { name: 'Siemens', logo: '/eventpage/rtss/logo-siemens.png' },
  { name: 'Zoho', logo: '/eventpage/rtss/logo-zoho.png' },
  { name: 'Reply', logo: '/eventpage/rtss/logo-reply.png' },
  { name: 'DTCF', logo: '/eventpage/rtss/logo-dtcf.svg' },
  { name: 'anybill', logo: '/eventpage/rtss/logo-anybill.png' },
  { name: 'Fly', logo: '/eventpage/rtss/logo-fly.png' },
];

const testimonials = [
  {
    name: 'Niclas Lehnert',
    role: 'COO at Pulsetrain & winner of RtSS 2024',
    image: '/eventpage/rtss/niclas.jpg',
    href: 'https://pulsetrain.com/',
    quote:
      'RtSS is a great sneak peek at what you can expect if you make it to the final at the START Summit in St. Gallen. Standing on stage in front of over 5,000 entrepreneurs, VCs and corporates and pitching your venture - if I recommend applying? Definitely!',
  },
  {
    name: 'Seddik Houimli',
    role: 'Founder and CEO at Supplyzpro',
    image: '/eventpage/rtss/seddik.jpg',
    href: 'https://www.supplyzpro.com/fr',
    quote:
      'I had a fantastic experience at the Road to START Summit last year. The energy was incredible, and the inspiring people were very accessible for chats. It was a great opportunity to connect and learn.',
  },
  {
    name: 'Chiara Dietzel',
    role: 'Student at TUM',
    image: '/eventpage/rtss/chiara.jpg',
    quote:
      "The RtSS is a great opportunity to get to know a variety of local startups and gives you the chance to connect with students, startups and other people from the entrepreneurial ecosystem. Already looking forward to this year's edition!",
  },
  {
    name: 'Yagmur Ay',
    role: "Founder's Associate at ZenML",
    image: '/eventpage/rtss/yagmur.jpg',
    href: 'https://zenml.io/',
    quote:
      'If you are looking for inspiration and meeting with like-minded people, you can collectively find them at RtSS. If you are a startup, this competition could be a great chance to get strong feedback. If you want to be inspired, book your ticket and see you there!',
  },
];

const faqs: FaqItem[] = [
  {
    id: 'what',
    question: 'What is the Road to START Summit?',
    answer:
      'The Road to START Summit is a series of events organized by START chapters throughout Europe. These events serve as warm-up gatherings leading up to START Summit in St. Gallen. The goal is to identify promising startups that will represent START Munich and pitch in St. Gallen.',
  },
  {
    id: 'where',
    question: 'Where and when does it take place?',
    answer:
      'It will take place on 9 December 2025 at Freiheitshalle, Munich. The following START Summit in St. Gallen, Switzerland, will run from 19 to 20 March 2026.',
  },
  {
    id: 'requirements',
    question: 'What are the requirements for startups?',
    answer:
      'Your startup was founded in 2023 or later, is in Seed or Pre-Seed stage, and is an independent legal entity. There are no limitations regarding the amount of funding you have already received. Extra points if your startup has a deep tech focus.',
  },
  {
    id: 'difference',
    question: 'How is it different from Road to START Hack?',
    answer:
      'Road to START Hack is a weekend-long hackathon where students build software and hardware projects. Road to START Summit is a pitching competition for startups.',
  },
];

const beyond = ['Network', 'Pitch', 'Connect', 'Grow', 'Invest', 'Scale'];

function RtssButton({
  href,
  children,
  variant = 'default',
}: {
  href: string;
  children: ReactNode;
  variant?: 'default' | 'outline';
}) {
  return (
    <ButtonLink
      href={href}
      variant={variant}
      size="lg"
      className={cn(
        'group uppercase hover:-translate-y-0.5 hover:border-brand-pink hover:bg-brand-pink hover:text-white',
        variant === 'outline' && 'border-input bg-transparent',
      )}
    >
      {children}
      <ArrowRightIcon className="transition group-hover:translate-x-1" />
    </ButtonLink>
  );
}

function RtssNavbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-100 bg-secondary">
      <Container size="wide" className="relative flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center transition hover:opacity-80">
          <Image
            src="/startlogo.svg"
            alt="START Munich"
            width={120}
            height={54}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 xl:flex">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-black tracking-wide uppercase transition-colors hover:text-background"
            >
              {label}
            </a>
          ))}
        </div>
        <div className="flex gap-0.5 overflow-hidden rounded-lg">
          <ButtonLink
            href={startupApplyUrl}
            size="sm"
            className="hidden rounded-none uppercase hover:bg-background hover:text-foreground sm:inline-flex"
          >
            Apply startup
          </ButtonLink>
          <ButtonLink
            href={attendeeUrl}
            size="sm"
            className="rounded-none uppercase hover:bg-background hover:text-foreground"
          >
            Attend
          </ButtonLink>
        </div>
      </Container>
    </nav>
  );
}

/** Road to START Summit microsite. Everything inside `.theme-rtss` picks up the inverted sub-brand. */
export default function RtssPage() {
  return (
    <div className="theme-rtss overflow-x-hidden pt-20">
      <RtssNavbar />
      <RtssHeroTitle />

      <section className="relative z-60 min-h-[820px] overflow-hidden sm:min-h-[calc(100svh-5rem)] lg:min-h-[900px]">
        <div className="pointer-events-none absolute inset-0 z-50 bg-linear-to-b from-transparent from-42% to-background to-58%" />
        <Container
          size="wide"
          className="relative z-70 min-h-[820px] sm:min-h-[calc(100svh-5rem)] lg:min-h-[900px]"
        >
          <div className="absolute inset-x-5 top-[53%] flex -translate-y-1/2 flex-col items-center gap-6 text-center sm:inset-x-8 sm:top-[52%] lg:inset-x-12 lg:top-[54%]">
            <p className="mx-auto max-w-80 px-4 font-bold text-foreground/85 drop-shadow-lg sm:max-w-xl sm:text-xl">
              Join us for START Munich&apos;s biggest event yet.
            </p>
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row">
              {[
                { Icon: CalendarDaysIcon, label: '9th December 2025' },
                { Icon: MapPinIcon, label: 'Munich' },
              ].map(({ Icon, label }) => (
                <Badge
                  key={label}
                  className="h-10 w-full rounded-lg bg-secondary/35 px-4 text-sm font-black tracking-wide text-foreground uppercase shadow-lg shadow-secondary/20 backdrop-blur-sm sm:w-auto sm:text-base [&>svg]:size-4! [&>svg]:text-accent-foreground"
                >
                  <Icon />
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
        <div className="pointer-events-none absolute inset-x-0 bottom-44 z-60 sm:bottom-48 lg:bottom-0">
          <Image
            src="/eventpage/rtss/mountain.png"
            alt=""
            width={1920}
            height={829}
            priority
            className="h-auto w-full max-w-none min-w-[900px] -translate-x-[18%] sm:translate-x-0"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent from-58% to-background" />
        </div>
      </section>

      <Section
        id="cta"
        spacing="none"
        className="z-60 scroll-mt-20 py-16"
        containerClassName="max-w-6xl text-center"
      >
        <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-border" />
        <Text className="mx-auto max-w-sm font-bold text-foreground/70 sm:max-w-none">
          Join us for START Munich&apos;s biggest event yet.
        </Text>
        <Heading
          as="h2"
          size="display"
          className="mt-3 text-[2rem] min-[480px]:text-4xl sm:text-7xl lg:text-8xl"
        >
          <span className="block">Road to</span>
          <span className="block">START Summit</span>
        </Heading>
        <p className="mx-auto mt-5 max-w-xs text-xl font-black text-foreground/75 uppercase min-[480px]:text-2xl sm:max-w-none sm:text-accent-foreground">
          9th December 2025, Munich
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <RtssButton href={startupApplyUrl}>Apply As A Start-up</RtssButton>
          <RtssButton href={attendeeUrl} variant="outline">
            Take part as an attendee
          </RtssButton>
        </div>
      </Section>

      <Section
        spacing="none"
        className="z-60 pb-16"
        containerClassName="flex max-w-6xl flex-col gap-10"
      >
        {infoSections.map((section) => (
          <Card
            key={section.id}
            id={section.id}
            className="scroll-mt-24 gap-0 py-0 shadow-2xl shadow-black/20 lg:grid lg:grid-cols-2"
          >
            <div
              className={cn(
                'relative min-h-[360px] overflow-hidden sm:min-h-[520px] lg:min-h-full',
                section.reverse && 'lg:order-2',
              )}
            >
              <Image
                src={section.image}
                alt={section.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-secondary/55 to-transparent lg:hidden" />
            </div>
            <div className="flex flex-col justify-center gap-7 p-6 sm:p-10 lg:p-12">
              <div className="flex flex-col gap-3">
                <Eyebrow className="tracking-[0.24em] text-accent-foreground">
                  {section.eyebrow}
                </Eyebrow>
                <Heading as="h2" size="h2" className="leading-[0.95]">
                  {section.title}
                </Heading>
              </div>
              <div className="flex flex-col gap-4">
                {section.body.map((paragraph) => (
                  <Text key={paragraph}>{paragraph}</Text>
                ))}
              </div>
              {section.cta && section.href && (
                <div>
                  <RtssButton href={section.href}>{section.cta}</RtssButton>
                </div>
              )}
            </div>
          </Card>
        ))}
      </Section>

      <a href="#cta" className="relative z-60 block border-y border-border bg-brand-pink py-5">
        <Marquee fade={false}>
          {beyond.map((word) => (
            <span
              key={word}
              className="pr-8 text-2xl font-black tracking-wide whitespace-nowrap uppercase"
            >
              {word} Beyond.
            </span>
          ))}
        </Marquee>
      </a>

      <Section
        id="partners"
        spacing="default"
        className="z-60 scroll-mt-20 bg-secondary"
        containerClassName="max-w-6xl text-center"
      >
        <Heading as="h2" size="display" className="text-5xl sm:text-7xl lg:text-7xl">
          Our Partners
        </Heading>
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex min-h-32 items-center justify-center bg-surface p-7"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={240}
                height={90}
                className="max-h-16 w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <RtssButton href={startupApplyUrl}>Apply As A Start-up</RtssButton>
          <RtssButton href={attendeeUrl} variant="outline">
            Take part as an attendee
          </RtssButton>
        </div>
      </Section>

      <Section
        id="testimonials"
        spacing="default"
        className="z-60 scroll-mt-20 bg-white text-brand-navy"
        containerClassName="max-w-6xl"
      >
        <Heading
          as="h2"
          size="display"
          className="text-center text-5xl text-brand-navy sm:text-7xl lg:text-7xl"
        >
          What participants say
        </Heading>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="flex flex-col gap-5 rounded-lg border border-brand-navy/10 bg-brand-navy/3 p-6"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={72}
                  height={72}
                  className="size-18 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-black uppercase">{testimonial.name}</h3>
                  {testimonial.href ? (
                    <a
                      href={testimonial.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-black tracking-wide text-brand-pink uppercase hover:underline"
                    >
                      {testimonial.role}
                    </a>
                  ) : (
                    <p className="text-xs font-black tracking-wide text-brand-pink uppercase">
                      {testimonial.role}
                    </p>
                  )}
                </div>
              </div>
              <p className="leading-relaxed text-brand-navy/75">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="faq"
        spacing="default"
        className="z-60 scroll-mt-20"
        containerClassName="max-w-4xl"
      >
        <Eyebrow className="text-center tracking-[0.24em] text-accent-foreground">
          Wanna learn more?
        </Eyebrow>
        <Heading
          as="h2"
          size="display"
          className="mt-3 mb-10 text-center text-5xl sm:text-7xl lg:text-7xl"
        >
          Frequently asked questions
        </Heading>
        <Faq
          items={faqs}
          defaultValue={['what']}
          className="[&_[data-slot=accordion-item]]:bg-foreground/5 [&_[data-slot=accordion-trigger-icon]]:text-foreground [&_[data-slot=accordion-trigger]]:uppercase"
        />
      </Section>

      <MicrositeFooter label="Road to START Summit" className="relative z-60 bg-secondary" />
    </div>
  );
}
