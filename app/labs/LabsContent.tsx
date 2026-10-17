import Image from 'next/image';

import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { Faq } from '@/components/site/faq';
import { NoiseTexture } from '@/components/ui/noise-texture';
import { Container } from '@/components/ui/section';

import { Glow, LabsCard, LabsCta, LabsHeading, LabsLabel, LabsSection } from './components';
import { APPLY_URL, criteria, formatSpecs, labsFaqs } from './data';
import { JourneyTimeline } from './JourneyTimeline';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'How it works', href: '#program' },
  { label: 'FAQ', href: '#faq' },
];

function LabsNavigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/65 backdrop-blur-md">
      <Container size="narrow" className="flex h-20 items-center justify-between">
        <a href="#" className="flex flex-col gap-0.5 py-2 leading-none">
          <span className="text-lg font-black tracking-tight uppercase">START Labs</span>
          <LabsLabel size="xs">{'// MedTech Edition'}</LabsLabel>
        </a>
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden font-mono text-2xs tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-foreground md:inline"
            >
              {link.label}
            </a>
          ))}
          <LabsCta href={APPLY_URL} external={false} className="px-4 py-2 md:px-6">
            <span className="md:hidden">Apply</span>
            <span className="hidden md:inline">Apply Now</span>
          </LabsCta>
        </nav>
      </Container>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-20">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/labs/videos/START_LABS_poster.jpg"
          className="absolute inset-0 size-full object-cover opacity-40"
        >
          <source src="/labs/videos/START_LABS_trimmed_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/60 to-black/95" />
        <div className="hidden md:block">
          <NoiseTexture noiseOpacity={0.15} />
        </div>
      </div>
      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-end">
        <Container size="narrow" className="flex flex-col items-start gap-6 pb-20">
          <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] leading-[0.9] font-black tracking-tight uppercase">
            You&apos;re not a student.
            <br />
            You&apos;re a <span className="text-primary">founder.</span>
          </h1>
          <p className="max-w-2xl font-mono text-xs leading-relaxed text-muted-foreground">
            Most programs teach entrepreneurship.
            <br />
            We just make you build a company. Like actually.
          </p>
          <LabsCta href={APPLY_URL}>Apply Now</LabsCta>
          <p className="font-mono text-xs text-muted-foreground">
            {'// Deadline: 30 April 2026 · Limited spots · Munich, in-person'}
          </p>
        </Container>
      </div>
    </section>
  );
}

function OrganizedBySection() {
  return (
    <section className="bg-background py-8">
      <Container className="flex flex-col items-center gap-6">
        <LabsLabel>{'// This edition is organized by'}</LabsLabel>
        <div className="flex items-center gap-6">
          {[
            {
              href: 'https://www.startmunich.de/',
              alt: 'START Munich',
              src: 'startmunich.png',
              h: 'h-11',
            },
            { href: 'https://www.one-aim.org/', alt: 'OneAIM', src: 'oneaim.png', h: 'h-10' },
          ].map((org, i) => (
            <div key={org.alt} className="flex items-center gap-6">
              {i > 0 && (
                <LabsLabel size="xs" className="text-muted-foreground/60">
                  ×
                </LabsLabel>
              )}
              <a
                href={org.href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 transition-opacity hover:opacity-100"
              >
                {/* Variable-aspect partner logo from an external host (not in remotePatterns). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={org.alt}
                  src={`https://raw.githubusercontent.com/genepearl/start-labs-2026/main/images/${org.src}`}
                  className={`${org.h} w-auto mix-blend-screen`}
                />
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProblemSection() {
  return (
    <LabsSection
      id="about"
      noise={0.15}
      decoration={
        <>
          <Glow className="top-1/4 left-0 size-[500px]" strength={15} />
          <Glow className="right-0 bottom-1/4 size-[500px]" strength={12} />
        </>
      }
    >
      <LabsLabel size="lg" className="mb-10">
        {'// The problem'}
      </LabsLabel>
      <LabsHeading className="mb-12">
        <span className="block">The world isn&apos;t broken.</span>
        <span className="block">It&apos;s disconnected.</span>
      </LabsHeading>
      <p className="mx-auto mb-20 max-w-2xl text-center font-mono text-sm leading-relaxed text-muted-foreground">
        Ambitious builders are launching their fifth AI notetaker. Organizations with real problems
        are stuck fighting fires. They never meet.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          {
            label: '// On one side',
            title: 'Healthcare organizations',
            text: 'Real problems. No bandwidth, no time, no angle to solve them.',
          },
          {
            label: '// On the other',
            title: 'Ambitious builders',
            text: 'Real skills. No problem worth their time.',
          },
        ].map((side) => (
          <LabsCard key={side.title}>
            <LabsLabel size="xs" className="mb-3">
              {side.label}
            </LabsLabel>
            <h3 className="text-lg font-bold uppercase transition-colors group-hover/card:text-primary">
              {side.title}
            </h3>
            <p className="font-mono text-xs leading-relaxed text-muted-foreground">{side.text}</p>
          </LabsCard>
        ))}
      </div>
    </LabsSection>
  );
}

function FormatSection() {
  return (
    <LabsSection
      id="program"
      decoration={<Glow className="bottom-1/3 left-1/4 size-[600px] opacity-40" />}
    >
      <LabsLabel size="lg" className="mb-10">
        {'// The Format'}
      </LabsLabel>
      <LabsHeading className="mb-16">How It Works</LabsHeading>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {formatSpecs.map((spec) => (
          <LabsCard key={spec.number} className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 bottom-4 text-[100px] leading-none font-black text-foreground opacity-[0.02] select-none"
            >
              {spec.number}
            </span>
            <h3 className="text-lg font-bold uppercase transition-colors group-hover/card:text-primary">
              {spec.title}
            </h3>
            <p className="font-mono text-xs leading-relaxed text-muted-foreground">{spec.desc}</p>
            <LabsLabel size="xs" className="mt-1 tracking-widest">
              {spec.stat}
            </LabsLabel>
          </LabsCard>
        ))}
      </div>
    </LabsSection>
  );
}

function JourneySection() {
  return (
    <LabsSection
      id="manifesto"
      decoration={<Glow className="top-1/3 right-1/4 size-[600px] opacity-40" />}
    >
      <LabsLabel size="lg" className="mb-10">
        {'// The 8-Week Journey'}
      </LabsLabel>
      <LabsHeading className="mb-16">Your Roadmap to Launch</LabsHeading>
      <JourneyTimeline />
    </LabsSection>
  );
}

function CriteriaSection() {
  const columns = [
    {
      tone: 'success' as const,
      label: 'Apply if',
      title: 'You should apply',
      items: criteria.apply,
    },
    {
      tone: 'destructive' as const,
      label: "Don't apply if",
      title: "You shouldn't apply",
      items: criteria.skip,
    },
  ];
  return (
    <LabsSection>
      <LabsLabel size="lg" className="mb-10">
        {'// Candidate profile'}
      </LabsLabel>
      <div className="mb-12 flex flex-col items-center gap-6 text-center">
        <LabsHeading className="text-5xl">Are you the one?</LabsHeading>
        <p className="font-mono text-xs text-muted-foreground">
          No MedTech experience needed. No connections required. Just the right mindset.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {columns.map((col) => (
          <LabsCard key={col.label} tone={col.tone}>
            <LabsLabel
              size="xs"
              className={col.tone === 'success' ? 'mb-3 text-success' : 'mb-3 text-destructive'}
            >
              {col.label}
            </LabsLabel>
            <h3
              className={
                col.tone === 'success'
                  ? 'mb-2 text-lg font-bold uppercase transition-colors group-hover/card:text-success'
                  : 'mb-2 text-lg font-bold uppercase transition-colors group-hover/card:text-destructive'
              }
            >
              {col.title}
            </h3>
            <ul className="flex flex-col gap-5">
              {col.items.map((item) => (
                <li key={item.title} className="flex flex-col gap-1">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  <span className="font-mono text-xs leading-relaxed text-muted-foreground">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </LabsCard>
        ))}
      </div>
    </LabsSection>
  );
}

function FaqSection() {
  return (
    <LabsSection
      id="faq"
      decoration={
        <>
          <Glow className="top-1/3 left-1/4 size-[500px]" strength={6} />
          <Glow className="right-1/4 bottom-1/3 size-[500px]" strength={8} />
        </>
      }
    >
      <LabsLabel size="lg" className="mb-10">
        {'// Frequently asked'}
      </LabsLabel>
      <div className="group relative mb-16 aspect-21/9 overflow-hidden border border-border">
        <Image
          src="/labs/images/letter.JPG"
          alt="Program details"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-1/2 left-8 flex -translate-y-1/2 flex-col gap-2">
          <LabsLabel className="text-primary">{'// Everything you need to know'}</LabsLabel>
          <p className="text-2xl font-black tracking-tight uppercase">Common questions answered</p>
        </div>
      </div>
      <Faq
        items={labsFaqs}
        className="gap-2 font-mono [&_[data-slot=accordion-content]]:text-xs [&_[data-slot=accordion-item]]:rounded-none [&_[data-slot=accordion-item]]:border-l-2 [&_[data-slot=accordion-item]]:border-foreground/5 [&_[data-slot=accordion-item]]:bg-foreground/2 [&_[data-slot=accordion-item]:has([aria-expanded=true])]:border-l-primary [&_[data-slot=accordion-trigger]]:rounded-none [&_[data-slot=accordion-trigger]]:text-sm [&_[data-slot=accordion-trigger]]:font-medium"
      />
    </LabsSection>
  );
}

function ApplySection() {
  return (
    <LabsSection
      id="apply"
      noise={false}
      containerClassName="flex flex-col items-center text-center"
      decoration={
        <div className="pointer-events-none absolute top-1/2 right-0 size-[500px] -translate-y-1/2 opacity-10">
          <Image
            src="/labs/images/rocket.png"
            alt=""
            fill
            sizes="500px"
            className="object-contain"
          />
        </div>
      }
    >
      <LabsHeading className="mb-16 text-[clamp(2.25rem,6vw,4rem)] leading-[0.95]">
        Stop reading.
        <br />
        <span className="text-primary">Start building.</span>
      </LabsHeading>
      <LabsCta href={APPLY_URL}>Apply Now</LabsCta>
    </LabsSection>
  );
}

/**
 * START Labs (MedTech Edition) microsite. Renders without the site chrome (see
 * `standaloneRoutes`); everything inside `.theme-labs` picks up the monochrome,
 * teal-accented sub-brand.
 */
export default function LabsContent() {
  return (
    <>
      <EmbedHeightReporter messageType="iframe-height" />

      <div className="theme-labs min-h-screen overflow-x-hidden">
        <LabsNavigation />
        <HeroSection />
        <OrganizedBySection />
        <ProblemSection />
        <FormatSection />
        <JourneySection />
        <CriteriaSection />
        <FaqSection />
        <ApplySection />
        <footer className="py-4 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            {'// START Labs © 2026 · MedTech Edition'}
          </p>
        </footer>
      </div>
    </>
  );
}
