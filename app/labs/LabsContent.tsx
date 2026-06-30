'use client';

import Image from 'next/image';
import Script from 'next/script';
import { useEffect, useState } from 'react';

import { NoiseTexture } from '@/components/ui/noise-texture';

export const dynamic = 'force-dynamic';

// Label Component - Consistent "//" labels throughout the page
function Label({
  children,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`font-mono uppercase tracking-[0.15em] ${className}`}
      style={{
        fontSize: '12px',
        color: 'var(--labs-text-body)',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// Section Header Component - Large centered section titles
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 text-center">
      <span
        className="font-mono uppercase tracking-[0.15em]"
        style={{
          fontSize: '16px',
          color: 'var(--labs-accent)',
        }}
      >
        {children}
      </span>
    </div>
  );
}

// Navigation Component
function LabsNavigation() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 bg-transparent"
      style={{
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex flex-col py-2 leading-none">
              <span className="labs-heading font-medium" style={{ fontSize: '18px' }}>
                START LABS
              </span>
              <span className="labs-meta mt-[2px]" style={{ color: 'var(--labs-accent)' }}>
                {'// MEDTECH EDITION'}
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              <a
                href="#about"
                className="font-mono uppercase tracking-[0.15em] transition-all duration-200"
                style={{ color: '#888888', fontSize: '10px' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
              >
                About
              </a>
              <a
                href="#program"
                className="font-mono uppercase tracking-[0.15em] transition-all duration-200"
                style={{ color: '#888888', fontSize: '10px' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
              >
                How it works
              </a>
              <a
                href="#faq"
                className="font-mono uppercase tracking-[0.15em] transition-all duration-200"
                style={{ color: '#888888', fontSize: '10px' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
              >
                FAQ
              </a>
              <a
                href="https://tally.so/r/rjdeQM"
                className="group relative inline-block overflow-hidden border px-6 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300"
                style={{
                  borderColor: 'var(--labs-accent)',
                  color: 'var(--labs-accent)',
                }}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                  Apply Now
                </span>
                <div
                  className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                  style={{ background: 'var(--labs-accent)' }}
                ></div>
              </a>
            </nav>

            {/* Mobile CTA */}
            <a
              href="https://tally.so/r/rjdeQM"
              className="group relative inline-block overflow-hidden border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300 md:hidden"
              style={{
                borderColor: 'var(--labs-accent)',
                color: 'var(--labs-accent)',
              }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                Apply
              </span>
              <div
                className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                style={{ background: 'var(--labs-accent)' }}
              ></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden pt-20"
      style={{ background: 'var(--labs-bg)' }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/labs/videos/START_LABS_poster.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        >
          <source src="/labs/videos/START_LABS_trimmed_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/95"></div>
        <div className="hidden md:block">
          <NoiseTexture noiseOpacity={0.15} />
        </div>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col justify-end">
        {/* Main Content */}
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-20 md:px-12">
          <div className="mx-auto max-w-5xl">
            {/* Spec Label */}
            {/* <div className='mb-8'>
                     <Label>// Medtech Edition</Label>
                  </div> */}

            {/* Main Headline */}
            <h1 className="mb-6">
              <div className="labs-heading text-[clamp(36px,8vw,72px)] leading-[0.9]">
                You&apos;re not a student.
                <br />
                You&apos;re a <span style={{ color: 'var(--labs-accent)' }}>founder.</span>
              </div>
            </h1>

            {/* Subheadline */}
            <div className="mb-6 max-w-2xl">
              <p
                className="font-mono leading-relaxed"
                style={{
                  fontSize: '12px',
                  color: 'var(--labs-text-body)',
                }}
              >
                Most programs teach entrepreneurship.
                <br />
                We just make you build a company. Like actually.
              </p>
            </div>

            {/* CTA */}
            <div className="mb-6">
              <a
                href="https://tally.so/r/rjdeQM"
                target="_blank"
                rel="noopener"
                className="group relative inline-block overflow-hidden border px-12 py-4 font-mono text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300"
                style={{
                  borderColor: 'var(--labs-accent)',
                  color: 'var(--labs-accent)',
                }}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                  Apply Now
                </span>
                <div
                  className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                  style={{ background: 'var(--labs-accent)' }}
                ></div>
              </a>
            </div>

            {/* Program Specs */}
            <div
              className="font-mono"
              style={{
                fontSize: '12px',
                color: 'var(--labs-text-body)',
              }}
            >
              {'// Deadline: 30 April 2026 · Limited spots · Munich, in-person'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Organized By Section
function OrganizedBySection() {
  return (
    <section
      className="relative overflow-hidden py-8"
      style={{
        background: 'var(--labs-bg)',
      }}
    >
      {/* Gradient blobs */}
      {/* <div className='absolute inset-0 pointer-events-none z-[1]'>
            <div
               className='absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[100px]'
               style={{
                  background:
                     'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
               }}
            ></div>
         </div> */}

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex flex-col items-center gap-6">
          <Label>{'// This edition is organized by'}</Label>
          <div className="flex items-center gap-6">
            <a
              href="https://www.startmunich.de/"
              target="_blank"
              rel="noopener"
              className="opacity-60 transition-opacity hover:opacity-100"
            >
              {/* Variable-aspect partner logo from external host (not in remotePatterns). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="START Munich"
                src="https://raw.githubusercontent.com/genepearl/start-labs-2026/main/images/startmunich.png"
                className="h-11 w-auto mix-blend-screen"
              />
            </a>
            <span className="labs-meta">×</span>
            <a
              href="https://www.one-aim.org/"
              target="_blank"
              rel="noopener"
              className="opacity-60 transition-opacity hover:opacity-100"
            >
              {/* Variable-aspect partner logo from external host (not in remotePatterns). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="OneAIM"
                src="https://raw.githubusercontent.com/genepearl/start-labs-2026/main/images/oneaim.png"
                className="h-10 w-auto mix-blend-screen"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// What is START Labs Section
// Problem Section
function ProblemSection() {
  return (
    <section
      id="about"
      className="labs-reveal relative scroll-mt-20 overflow-hidden py-32"
      style={{
        background: 'var(--labs-bg)',
      }}
    >
      {/* Noise texture */}
      <div className="hidden md:block">
        <NoiseTexture noiseOpacity={0.15} className="opacity-30" />
      </div>

      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
        <div
          className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)',
          }}
        ></div>
        <div
          className="absolute bottom-1/4 right-0 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <span
              className="font-mono uppercase tracking-[0.15em]"
              style={{ fontSize: '16px', color: 'var(--labs-accent)' }}
            >
              {'// The problem'}
            </span>
          </div>

          {/* Main Statement */}
          <h2 className="labs-heading mb-12 text-center text-[clamp(32px,5vw,56px)] leading-[1.1]">
            <span className="block" style={{ color: 'var(--labs-text-primary)' }}>
              The world isn&apos;t broken.
            </span>
            <span className="block" style={{ color: 'var(--labs-text-primary)' }}>
              It&apos;s disconnected.
            </span>
          </h2>

          {/* Intro body */}
          <div className="mx-auto mb-20 max-w-2xl text-center">
            <p
              className="font-mono leading-relaxed"
              style={{
                fontSize: '13px',
                color: 'var(--labs-text-body)',
              }}
            >
              Ambitious builders are launching their fifth AI notetaker. Organizations with real
              problems are stuck fighting fires. They never meet.
            </p>
          </div>

          {/* Two-card grid */}
          <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              className="labs-reveal group relative cursor-default overflow-hidden border-l-2 bg-white/[0.03] p-10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(45,212,191,0.08)]"
              style={{
                borderLeftColor: 'var(--labs-accent)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="mb-6">
                <span
                  className="font-mono uppercase tracking-[0.15em]"
                  style={{
                    fontSize: '10px',
                    color: 'var(--labs-accent)',
                  }}
                >
                  {'// On one side'}
                </span>
              </div>
              <h3
                className="mb-3 font-bold uppercase transition-colors duration-300 group-hover:text-[var(--labs-accent)]"
                style={{
                  fontSize: '18px',
                  color: 'var(--labs-text-primary)',
                }}
              >
                Healthcare organizations
              </h3>
              <p
                className="font-mono leading-relaxed"
                style={{
                  fontSize: '12px',
                  color: 'var(--labs-text-body)',
                }}
              >
                Real problems. No bandwidth, no time, no angle to solve them.
              </p>
            </div>

            <div
              className="labs-reveal group relative cursor-default overflow-hidden border-l-2 bg-white/[0.03] p-10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(45,212,191,0.08)]"
              style={{
                borderLeftColor: 'var(--labs-accent)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transitionDelay: '100ms',
              }}
            >
              <div className="mb-6">
                <span
                  className="font-mono uppercase tracking-[0.15em]"
                  style={{
                    fontSize: '10px',
                    color: 'var(--labs-accent)',
                  }}
                >
                  {'// On the other'}
                </span>
              </div>
              <h3
                className="mb-3 font-bold uppercase transition-colors duration-300 group-hover:text-[var(--labs-accent)]"
                style={{
                  fontSize: '18px',
                  color: 'var(--labs-text-primary)',
                }}
              >
                Ambitious builders
              </h3>
              <p
                className="font-mono leading-relaxed"
                style={{
                  fontSize: '12px',
                  color: 'var(--labs-text-body)',
                }}
              >
                Real skills. No problem worth their time.
              </p>
            </div>
          </div>

          {/* Closing line */}
          {/* <div className='text-center'>
                  <div
                     className='labs-heading mb-4 leading-[1.3]'
                     style={{
                        fontSize: 'var(--labs-size-heading-md)',
                        color: 'var(--labs-text-primary)',
                     }}
                  >
                     Builders and problems are never in the same room.
                     <br />
                     <span style={{ color: 'var(--labs-accent)' }}>
                        We fix that.
                     </span>
                  </div>
               </div> */}
        </div>
      </div>
    </section>
  );
}

// Section 1: The 8-Week Journey (Timeline Hero)
function JourneyTimelineSection() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const timelineItems = [
    {
      week: 'Week 01',
      weekNum: 1,
      tag: 'Onboarding',
      emoji: '🚀',
      title: 'Onboarding day',
      desc: "Meet your partners. Understand the challenge firsthand. From day one, you're a founder, not just a participant.",
      details: [
        'Meet your team & partners',
        'Deep dive into the challenge',
        'Set your 8-week goals',
      ],
      image: '/labs/images/timeline/onboarding.JPG',
    },
    {
      week: 'Week 02',
      weekNum: 2,
      tag: 'Experts',
      emoji: '🔥',
      title: 'Roast Session #1',
      desc: "Founders, clinicians, healthcare operators who've built in this space. Ask them anything.",
      details: ['Get brutally honest feedback', 'Meet industry founders', 'Refine your approach'],
      image: '/labs/images/timeline/roast-session-1.JPG',
    },
    {
      week: 'Week 04',
      weekNum: 4,
      tag: 'Midterm',
      emoji: '🎯',
      title: 'Midterm pitch',
      desc: 'Present your progress to your partners. Pivot or persevere based on real feedback. No grades. Real consequences.',
      details: ['Present to partners', 'Get real feedback', 'Decide: pivot or persevere'],
      image: '/labs/images/timeline/midterm.JPG',
    },
    {
      week: 'Week 06',
      weekNum: 6,
      tag: 'Experts',
      emoji: '💡',
      title: 'Roast Session #2',
      desc: 'Deep dive with industry experts. Get tactical advice on your biggest challenges.',
      details: ['Deep dive with experts', 'Get tactical advice', 'Fine-tune your MVP'],
      image: '/labs/images/timeline/roast-session-2.jpeg',
    },
    {
      week: 'Week 08',
      weekNum: 8,
      tag: 'Final',
      emoji: '🏆',
      title: 'Final Pitch',
      desc: 'Present your MVP to partners, clinicians, and a live audience. Real stakes. No safety net.',
      details: ['Present your MVP', 'Live audience + partners', 'Real stakes, no safety net'],
      image: '/labs/images/timeline/final.JPG',
      isLast: true,
    },
  ];

  return (
    <section
      id="manifesto"
      className="labs-reveal relative scroll-mt-20 overflow-hidden py-32"
      style={{
        background: 'var(--labs-bg)',
      }}
    >
      {/* Anchor for navigation */}
      <div className="absolute -top-20"></div>

      {/* Noise texture */}
      <div className="hidden md:block">
        <NoiseTexture noiseOpacity={0.25} />
      </div>

      {/* Subtle gradient blob for visual interest */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
        <div
          className="absolute right-1/4 top-1/3 h-[600px] w-[600px] rounded-full opacity-40 blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <span
              className="font-mono uppercase tracking-[0.15em]"
              style={{ fontSize: '16px', color: 'var(--labs-accent)' }}
            >
              {'// The 8-Week Journey'}
            </span>
          </div>

          {/* Main Heading */}
          <h2
            className="labs-heading mb-16 text-center text-[clamp(32px,5vw,56px)] leading-[1.1]"
            style={{
              color: 'var(--labs-text-primary)',
            }}
          >
            Your Roadmap to Launch
          </h2>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="relative mb-20 h-[2px] rounded-full">
              {/* Accent line with subtle gradient */}
              <div
                className="absolute inset-0 h-full rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(45,212,191,0.3) 0%, rgba(45,212,191,0.6) 50%, rgba(45,212,191,0.3) 100%)',
                }}
              ></div>

              {/* Timeline nodes */}
              <div className="absolute inset-0 flex justify-between">
                {timelineItems.map((item, index) => {
                  const isExpanded = expandedWeek === index;

                  return (
                    <button
                      key={index}
                      onClick={() => setExpandedWeek(isExpanded ? null : index)}
                      className="group relative"
                    >
                      {/* Week number above */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                        <div
                          className={`font-mono font-medium transition-colors duration-200 ${
                            isExpanded
                              ? 'text-[var(--labs-accent)]'
                              : 'text-[var(--labs-text-body)]'
                          }`}
                          style={{
                            fontSize: 'clamp(10px, 2vw, 13px)',
                          }}
                        >
                          {item.week}
                        </div>
                      </div>

                      {/* Node dot */}
                      <div
                        className={`h-3 w-3 cursor-pointer rounded-full transition-all duration-300 ${
                          isExpanded
                            ? 'scale-[1.5] shadow-[0_0_20px_rgba(45,212,191,0.4)]'
                            : 'group-hover:scale-125'
                        }`}
                        style={{
                          background: isExpanded ? 'var(--labs-accent)' : 'rgba(255,255,255,0.4)',
                          transform: 'translateY(-50%)',
                        }}
                      ></div>

                      {/* Tag label below */}
                      <div className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-center">
                        <div
                          className="font-mono uppercase tracking-[0.1em]"
                          style={{
                            color: 'var(--labs-text-meta)',
                            fontSize: 'clamp(7px, 1.5vw, 9px)',
                          }}
                        >
                          {item.tag}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content area with fixed height */}
            <div className="relative min-h-[420px]">
              {/* Click prompt when nothing expanded */}
              {expandedWeek === null && (
                <div className="absolute left-0 right-0 top-12 text-center">
                  <p
                    className="font-mono"
                    style={{
                      fontSize: '12px',
                      color: 'var(--labs-text-meta)',
                    }}
                  >
                    Click any week to see details
                  </p>
                </div>
              )}

              {/* Expanded card details */}
              {timelineItems.map((item, index) => {
                const isExpanded = expandedWeek === index;

                return (
                  <div
                    key={index}
                    className={`transition-all duration-500 ${
                      isExpanded
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none absolute translate-y-4 opacity-0'
                    }`}
                  >
                    {isExpanded && (
                      <div
                        className="border border-l-2 bg-white/[0.02] p-10 transition-all duration-300"
                        style={{
                          borderLeftColor: 'var(--labs-accent)',
                          borderColor: 'rgba(255,255,255,0.05)',
                        }}
                      >
                        <div className="grid gap-8 md:grid-cols-2">
                          {/* Left: Image - Larger */}
                          <div>
                            <div
                              className="relative aspect-[4/3] overflow-hidden border"
                              style={{
                                borderColor: 'rgba(255,255,255,0.1)',
                              }}
                            >
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover opacity-70 transition-all duration-500 hover:scale-105 hover:opacity-90"
                              />
                            </div>
                          </div>

                          {/* Right: All text stacked vertically */}
                          <div className="flex flex-col">
                            {/* Week and tag */}
                            <div className="mb-4">
                              <span
                                className="font-mono text-[10px] uppercase tracking-[0.15em]"
                                style={{
                                  color: 'var(--labs-accent)',
                                }}
                              >
                                {item.week} · {item.tag}
                              </span>
                            </div>

                            {/* Title */}
                            <h3
                              className="mb-4 font-bold uppercase"
                              style={{
                                fontSize: 'clamp(20px, 2.5vw, 24px)',
                                color: 'var(--labs-text-primary)',
                              }}
                            >
                              {item.title}
                            </h3>

                            {/* Description */}
                            <p
                              className="mb-6 font-mono leading-relaxed"
                              style={{
                                fontSize: '13px',
                                color: 'var(--labs-text-body)',
                              }}
                            >
                              {item.desc}
                            </p>

                            {/* What happens */}
                            <div>
                              <div
                                className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em]"
                                style={{
                                  color: 'var(--labs-text-meta)',
                                }}
                              >
                                What happens
                              </div>
                              <div className="space-y-2">
                                {item.details.map((detail, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-2 font-mono"
                                    style={{
                                      fontSize: '12px',
                                      color: 'var(--labs-text-body)',
                                    }}
                                  >
                                    <span
                                      className="mt-[2px]"
                                      style={{
                                        color: 'var(--labs-accent)',
                                      }}
                                    >
                                      •
                                    </span>
                                    <span>{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 2: Why START Labs Works (Principles + Proof)
function _WhyItWorksSection() {
  const principles = [
    {
      emoji: '⚡',
      title: 'ACTUAL STAKES',
      desc: 'When clinicians depend on what you build, you stop theorizing and start shipping.',
      stat: 'Real users, real feedback',
    },
    {
      emoji: '💰',
      title: 'REAL CUSTOMERS',
      desc: "You're selling from day one. Not pitching to judges. Not theorizing in workshops.",
      stat: 'First revenue in 8 weeks',
    },
    {
      emoji: '🔄',
      title: 'FAST FEEDBACK',
      desc: 'Weekly check-ins, expert roasts, midterm pivots, demo day pressure. Compress years into weeks.',
      stat: '5 major milestones',
    },
  ];

  return (
    <section
      className="labs-reveal relative overflow-hidden py-32"
      style={{
        background: '#fafafa',
      }}
    >
      {/* Noise texture */}
      <div className="hidden md:block">
        <NoiseTexture noiseOpacity={0.15} className="opacity-30" />
      </div>

      {/* Subtle gradient blob for visual interest */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
        <div
          className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <span
              className="font-mono uppercase tracking-[0.15em]"
              style={{ fontSize: '16px', color: 'var(--labs-accent)' }}
            >
              {'// Why START Labs Works'}
            </span>
          </div>

          {/* Main Heading */}
          <h2
            className="labs-heading mb-16 text-center text-[clamp(32px,5vw,56px)] leading-[1.1]"
            style={{
              color: '#000000',
            }}
          >
            3 Things That Make This Real
          </h2>

          {/* 3 Principle Cards */}
          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="labs-reveal group cursor-default border-l-2 bg-white p-8 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  borderLeftColor: 'var(--labs-accent)',
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  borderRight: '1px solid rgba(0,0,0,0.06)',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Emoji */}
                <div className="mb-4 text-3xl opacity-60">{principle.emoji}</div>

                {/* Title */}
                <h3
                  className="mb-3 font-bold uppercase transition-colors duration-300 group-hover:text-[var(--labs-accent)]"
                  style={{
                    fontSize: '16px',
                    color: '#000000',
                  }}
                >
                  {principle.title}
                </h3>

                {/* Description */}
                <p
                  className="mb-4 font-mono leading-relaxed"
                  style={{
                    fontSize: '12px',
                    color: '#555555',
                  }}
                >
                  {principle.desc}
                </p>

                {/* Stat */}
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.1em]"
                  style={{
                    color: 'var(--labs-accent)',
                  }}
                >
                  {principle.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 3: What's Different (Core Specs Enhanced)
function WhatsDifferentSection() {
  const specs = [
    {
      number: '01',
      title: '8 WEEKS',
      desc: 'Not 6 months. Not a semester. 8 intense weeks to build, test, iterate, and sell.',
      stat: '56 days to prove yourself',
      icon: '⏱️',
    },
    {
      number: '02',
      title: 'STUDENT-RUN',
      desc: 'Built by students, for students. No corporate sponsors dictating direction. Just founders helping founders.',
      stat: 'No BS environment',
      icon: '🤝',
    },
    {
      number: '03',
      title: 'REAL PROBLEMS',
      desc: 'Sourced directly from hospitals healthcare organizations, and startups. Problems that exist right now.',
      stat: 'From actual partners',
      icon: '🏥',
    },
    {
      number: '04',
      title: 'YOUR STARTUP',
      desc: "You build it. You own it. 100% of the equity. We're not taking a cut. This is your company.",
      stat: '100% yours',
      icon: '🚀',
    },
  ];

  return (
    <section
      id="program"
      className="labs-reveal relative overflow-hidden py-32"
      style={{
        background: 'var(--labs-bg)',
      }}
    >
      {/* Noise texture */}
      <div className="hidden md:block">
        <NoiseTexture noiseOpacity={0.25} />
      </div>

      {/* Subtle gradient blob for visual interest */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
        <div
          className="absolute bottom-1/3 left-1/4 h-[600px] w-[600px] rounded-full opacity-40 blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <span
              className="font-mono uppercase tracking-[0.15em]"
              style={{ fontSize: '16px', color: 'var(--labs-accent)' }}
            >
              {'// The Format'}
            </span>
          </div>

          {/* Main Heading */}
          <h2
            className="labs-heading mb-16 text-center text-[clamp(32px,5vw,56px)] leading-[1.1]"
            style={{
              color: 'var(--labs-text-primary)',
            }}
          >
            How It Works
          </h2>

          {/* 2x2 Grid of Specs */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {specs.map((spec, index) => (
              <div
                key={index}
                className="labs-reveal group relative cursor-default overflow-hidden border-l-2 bg-white/[0.03] p-10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(45,212,191,0.08)]"
                style={{
                  borderLeftColor: 'var(--labs-accent)',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {/* Subtle background number */}
                <div
                  className="font-display pointer-events-none absolute bottom-4 right-4 select-none text-[100px] font-black leading-none opacity-[0.02]"
                  style={{ color: '#ffffff' }}
                >
                  {spec.number}
                </div>

                {/* Icon */}
                {/* <div className='text-3xl mb-4 opacity-60'>
                           {spec.icon}
                        </div> */}

                {/* Title */}
                <h3
                  className="mb-3 font-bold uppercase transition-colors duration-300 group-hover:text-[var(--labs-accent)]"
                  style={{
                    fontSize: '18px',
                    color: 'var(--labs-text-primary)',
                  }}
                >
                  {spec.title}
                </h3>

                {/* Description */}
                <p
                  className="mb-4 font-mono leading-relaxed"
                  style={{
                    fontSize: '12px',
                    color: 'var(--labs-text-body)',
                  }}
                >
                  {spec.desc}
                </p>

                {/* Stat */}
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.1em]"
                  style={{
                    color: 'var(--labs-accent)',
                  }}
                >
                  {spec.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// The Experience Section
function _TheExperienceSection() {
  return (
    <section
      className="labs-reveal relative overflow-hidden py-32"
      style={{
        background: 'var(--labs-bg)',
      }}
    >
      {/* Noise texture */}
      <div className="hidden md:block">
        <NoiseTexture noiseOpacity={0.25} />
      </div>

      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
        <div
          className="absolute left-1/3 top-1/3 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, transparent 70%)',
          }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <SectionHeader>{'// The experience'}</SectionHeader>

          {/* Headline */}
          <h2
            className="labs-heading mb-8 text-center text-[clamp(32px,5vw,56px)] leading-[1.1]"
            style={{ color: 'var(--labs-text-primary)' }}
          >
            What it actually feels like.
          </h2>

          {/* Body text */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p
              className="font-mono leading-relaxed"
              style={{
                fontSize: '13px',
                color: 'var(--labs-text-body)',
              }}
            >
              You pitch. You get roasted. You improve. You ship.
              <br />
              Last cohort had 120+ people in the room on demo day.
            </p>
          </div>

          {/* Video embed */}
          <div className="mx-auto aspect-video w-full max-w-4xl">
            <iframe
              src="https://drive.google.com/file/d/1HQK9_Kry5IDKO2OHlfFuNbhQ2kH8nNGO/preview"
              className="h-full w-full border"
              style={{ borderColor: 'var(--labs-border)' }}
              allow="autoplay"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

// Proof Callout Section - Visual break with stats
function _ProofCalloutSection() {
  return (
    <section
      id="proof"
      className="labs-reveal relative overflow-hidden py-32"
      style={{
        background: 'var(--labs-bg)',
      }}
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left: Image */}
          <div
            className="labs-reveal group relative aspect-[16/10] overflow-hidden border"
            style={{ borderColor: 'var(--labs-border)' }}
          >
            <Image
              src="/labs/images/award.png"
              alt="Bavarian Best Practice Award"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="mb-2">
                <Label style={{ color: 'var(--labs-accent)' }}>{'// GovTech Edition 2025'}</Label>
              </div>
              <h3
                className="labs-heading"
                style={{
                  fontSize: 'var(--labs-size-heading-sm)',
                  color: 'var(--labs-text-primary)',
                }}
              >
                Bavarian Best Practice Award Winner
              </h3>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="space-y-8">
            <div>
              <div className="mb-3">
                <Label style={{ color: 'var(--labs-text-meta)' }}>{'// Proof of concept'}</Label>
              </div>
              <h3
                className="labs-heading mb-4"
                style={{
                  fontSize: 'var(--labs-size-heading-md)',
                  color: 'var(--labs-text-primary)',
                }}
              >
                We&apos;ve done this before.
              </h3>
              <p
                className="font-mono leading-relaxed"
                style={{
                  fontSize: '12px',
                  color: 'var(--labs-text-body)',
                }}
              >
                GovTech Edition 2025 produced 3 working startups in 8 weeks. Real problems from
                municipalities. Real solutions that shipped. We won the Bavarian Best Practice Award
                for it.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div
                className="labs-reveal labs-card group border p-6 text-center transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  transitionDelay: '0ms',
                }}
              >
                <div
                  className="labs-heading mb-2 text-5xl transition-colors duration-300 group-hover:text-[var(--labs-accent)]"
                  style={{ color: 'var(--labs-text-primary)' }}
                >
                  3
                </div>
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: 'var(--labs-text-body)' }}
                >
                  Startups
                </div>
              </div>
              <div
                className="labs-reveal labs-card group border p-6 text-center transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  transitionDelay: '100ms',
                }}
              >
                <div
                  className="labs-heading mb-2 text-5xl transition-colors duration-300 group-hover:text-[var(--labs-accent)]"
                  style={{ color: 'var(--labs-text-primary)' }}
                >
                  8
                </div>
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: 'var(--labs-text-body)' }}
                >
                  Weeks
                </div>
              </div>
              <div
                className="labs-reveal labs-card group border p-6 text-center transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  transitionDelay: '200ms',
                }}
              >
                <div
                  className="labs-heading mb-2 text-5xl transition-colors duration-300 group-hover:text-[var(--labs-accent)]"
                  style={{ color: 'var(--labs-text-primary)' }}
                >
                  1
                </div>
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: 'var(--labs-text-body)' }}
                >
                  Award
                </div>
              </div>
            </div>

            {/* Small image gallery from past edition */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div
                className="labs-reveal relative aspect-[4/3] overflow-hidden border"
                style={{
                  borderColor: 'var(--labs-border)',
                  transitionDelay: '300ms',
                }}
              >
                <Image
                  src="/labs/images/demoday.jpg"
                  alt="Demo Day"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-70 transition-all duration-500 hover:scale-105 hover:opacity-90"
                />
              </div>
              <div
                className="labs-reveal relative aspect-[4/3] overflow-hidden border"
                style={{
                  borderColor: 'var(--labs-border)',
                  transitionDelay: '400ms',
                }}
              >
                <Image
                  src="/labs/images/winner.jpg"
                  alt="Award Winner"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-70 transition-all duration-500 hover:scale-105 hover:opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Criteria Section
function CriteriaSection() {
  return (
    <section
      className="labs-reveal relative overflow-hidden py-32"
      style={{ background: 'var(--labs-bg)' }}
    >
      {/* Noise texture */}
      <div className="hidden md:block">
        <NoiseTexture noiseOpacity={0.25} />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <SectionHeader>{'// Candidate profile'}</SectionHeader>

          <div className="mb-12 text-center">
            <h2 className="labs-heading mb-6" style={{ fontSize: 'var(--labs-size-heading-lg)' }}>
              Are you the one?
            </h2>
            <div
              className="font-mono"
              style={{
                fontSize: '12px',
                color: 'var(--labs-text-body)',
              }}
            >
              No MedTech experience needed. No connections required. Just the right mindset.
            </div>
          </div>

          {/* Role pills */}
          {/* <div className='flex flex-wrap items-center justify-center gap-3 mb-10'>
                  {['Builders', 'Engineers', 'Designers', 'Sellers', 'Clinicians'].map((role) => (
                     <div
                        key={role}
                        className='font-mono uppercase tracking-wider px-4 py-2 border'
                        style={{
                           fontSize: '11px',
                           color: 'var(--labs-text-body)',
                           borderColor: 'var(--labs-border)',
                           background: 'rgba(255,255,255,0.02)',
                        }}
                     >
                        {role}
                     </div>
                  ))}
               </div> */}

          {/* Criteria Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Apply If */}
            <div
              className="labs-reveal group relative cursor-default overflow-hidden border-l-2 bg-white/[0.03] p-10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)]"
              style={{
                borderLeftColor: '#10b981',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="mb-6">
                <span
                  className="font-mono uppercase tracking-[0.15em]"
                  style={{
                    fontSize: '10px',
                    color: '#10b981',
                  }}
                >
                  Apply if
                </span>
              </div>
              <h3
                className="mb-4 font-bold uppercase transition-colors duration-300 group-hover:text-[#10b981]"
                style={{
                  fontSize: '18px',
                  color: 'var(--labs-text-primary)',
                }}
              >
                You should apply
              </h3>
              <div>
                <div className="space-y-5">
                  <div>
                    <div
                      className="mb-1 font-mono font-medium"
                      style={{
                        color: 'var(--labs-text-primary)',
                        fontSize: '13px',
                      }}
                    >
                      Hard problems energize you.
                    </div>
                    <div
                      className="font-mono leading-relaxed"
                      style={{
                        fontSize: '12px',
                        color: 'var(--labs-text-body)',
                      }}
                    >
                      You don&apos;t quit when things get tough. You get obsessed.
                    </div>
                  </div>

                  <div>
                    <div
                      className="mb-1 font-mono font-medium"
                      style={{
                        color: 'var(--labs-text-primary)',
                        fontSize: '13px',
                      }}
                    >
                      The status quo makes you angry.
                    </div>
                    <div
                      className="font-mono leading-relaxed"
                      style={{
                        fontSize: '12px',
                        color: 'var(--labs-text-body)',
                      }}
                    >
                      You see broken systems and think &ldquo;I can fix this.&rdquo;
                    </div>
                  </div>

                  <div>
                    <div
                      className="mb-1 font-mono font-medium"
                      style={{
                        color: 'var(--labs-text-primary)',
                        fontSize: '13px',
                      }}
                    >
                      You have fire. Not just interest.
                    </div>
                    <div
                      className="font-mono leading-relaxed"
                      style={{
                        fontSize: '12px',
                        color: 'var(--labs-text-body)',
                      }}
                    >
                      Genuine, can&apos;t-sleep-at-night passion for building things that matter.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Don't Apply If */}
            <div
              className="labs-reveal group relative cursor-default overflow-hidden border-l-2 bg-white/[0.03] p-10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(239,68,68,0.08)]"
              style={{
                borderLeftColor: '#ef4444',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transitionDelay: '100ms',
              }}
            >
              <div className="mb-6">
                <span
                  className="font-mono uppercase tracking-[0.15em]"
                  style={{
                    fontSize: '10px',
                    color: '#ef4444',
                  }}
                >
                  Don&apos;t apply if
                </span>
              </div>
              <h3
                className="mb-4 font-bold uppercase transition-colors duration-300 group-hover:text-[#ef4444]"
                style={{
                  fontSize: '18px',
                  color: 'var(--labs-text-primary)',
                }}
              >
                You shouldn&apos;t apply
              </h3>
              <div>
                <div className="space-y-5">
                  <div>
                    <div
                      className="mb-1 font-mono font-medium"
                      style={{
                        color: 'var(--labs-text-primary)',
                        fontSize: '13px',
                      }}
                    >
                      Your calendar is already drowning.
                    </div>
                    <div
                      className="font-mono leading-relaxed"
                      style={{
                        fontSize: '12px',
                        color: 'var(--labs-text-body)',
                      }}
                    >
                      We need 10+ hours per week of real commitment.
                    </div>
                  </div>

                  <div>
                    <div
                      className="mb-1 font-mono font-medium"
                      style={{
                        color: 'var(--labs-text-primary)',
                        fontSize: '13px',
                      }}
                    >
                      You want a cozy lecture series.
                    </div>
                    <div
                      className="font-mono leading-relaxed"
                      style={{
                        fontSize: '12px',
                        color: 'var(--labs-text-body)',
                      }}
                    >
                      This is hands-on, messy, and real.
                    </div>
                  </div>

                  <div>
                    <div
                      className="mb-1 font-mono font-medium"
                      style={{
                        color: 'var(--labs-text-primary)',
                        fontSize: '13px',
                      }}
                    >
                      You&apos;re collecting badges for your CV.
                    </div>
                    <div
                      className="font-mono leading-relaxed"
                      style={{
                        fontSize: '12px',
                        color: 'var(--labs-text-body)',
                      }}
                    >
                      Build something you actually care about, or don&apos;t apply.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edge Cases + Visual */}
          {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-6'> */}
          {/* <div
                     className='labs-reveal group border-l-2 pl-8 labs-card p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--labs-accent)]'
                     style={{ borderColor: 'var(--labs-border)' }}
                  >
                     <div
                        className='font-mono leading-relaxed'
                        style={{
                           fontSize: '12px',
                           color: 'var(--labs-text-body)',
                        }}
                     >
                        // Don't fit these boxes? You might be exactly who we
                        need.{' '}
                        <a
                           href='https://tally.so/r/rjdeQM'
                           target='_blank'
                           rel='noopener'
                           style={{ color: 'var(--labs-accent)' }}
                           className='font-semibold underline hover:opacity-80 transition-opacity duration-300'
                        >
                           Apply anyway. →
                        </a>
                     </div>
                  </div> */}

          {/* Visual proof image */}
          {/* <div
                     className='labs-reveal group relative aspect-[16/10] overflow-hidden border'
                     style={{
                        borderColor: 'var(--labs-border)',
                        transitionDelay: '100ms',
                     }}
                  >
                     <img
                        src='/labs/images/partner.jpg'
                        alt='Past participants'
                        className='w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500'
                     />
                     <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                     <div className='absolute bottom-4 left-4'>
                        <Label style={{ color: 'var(--labs-text-primary)' }}>
                           // GovTech 2025
                        </Label>
                     </div>
                  </div> */}
          {/* </div> */}
        </div>
      </div>
    </section>
  );
}

// Proof Section
function _ProofSection() {
  return (
    <section
      id="proof"
      className="labs-reveal py-32"
      style={{
        background: 'var(--labs-bg)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <SectionHeader>{'// Section 04: Proof of Concept'}</SectionHeader>

          <div className="mb-20">
            <h2 className="labs-heading mb-4" style={{ fontSize: 'var(--labs-size-heading-md)' }}>
              We successfully ran{' '}
              <span style={{ color: 'var(--labs-text-body)' }}>GovTech Edition</span> in 2025.
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="mb-20 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="labs-card p-12 text-center">
              <div className="labs-heading mb-3 text-6xl">3</div>
              <div className="labs-meta">Challenges</div>
            </div>
            <div className="labs-card p-12 text-center">
              <div className="labs-heading mb-3 text-6xl">3</div>
              <div className="labs-meta">Startups</div>
            </div>
            <div className="labs-card p-12 text-center">
              <div className="labs-heading mb-3 text-6xl">1</div>
              <div className="labs-meta">Bavarian Best Practice Award</div>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="mb-20">
            <div className="mb-8 text-center">
              <Label>{'// Program Archive 2025'}</Label>
            </div>

            <div className="labs-meta mb-4 flex items-center gap-2 px-6 md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>Swipe</span>
            </div>

            <div className="carousel-scroll flex gap-6 overflow-x-auto pb-4">
              {['letter.JPG', 'demoday.jpg', 'award.png', 'winner.jpg', 'partner.jpg'].map(
                (img, i) => (
                  <div
                    key={i}
                    className="group relative h-[180px] w-[280px] flex-shrink-0 overflow-hidden border sm:h-[220px] sm:w-[350px] md:h-[250px] md:w-[400px]"
                    style={{ borderColor: 'var(--labs-border)' }}
                  >
                    <Image
                      src={`/labs/images/${img}`}
                      alt={`Archive ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, 400px"
                      className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div
                      className="labs-meta absolute left-3 top-3 px-2 py-1"
                      style={{ background: 'rgba(0,0,0,0.9)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Project Grid */}
          <div>
            <div className="mb-8">
              <Label>{'// Deliverables'}</Label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="labs-card group p-10 transition-all duration-300">
                <div className="labs-meta mb-4">Landratsamt Traunstein</div>
                <div
                  className="labs-heading mb-3 transition-opacity group-hover:opacity-70"
                  style={{ fontSize: 'var(--labs-size-heading-sm)' }}
                >
                  DataNexus
                </div>
                <div className="labs-body leading-relaxed">
                  GDPR-compliant platform.
                  <br />3 days saved per user yearly.
                </div>
              </div>

              <div className="labs-card group p-10 transition-all duration-300">
                <div className="labs-meta mb-4">BayKommun</div>
                <div
                  className="labs-heading mb-3 transition-opacity group-hover:opacity-70"
                  style={{ fontSize: 'var(--labs-size-heading-sm)' }}
                >
                  DiviData
                </div>
                <div className="labs-body leading-relaxed">
                  Built for a sector where
                  <br />
                  70% of digital projects fail.
                </div>
              </div>

              <div className="labs-card group p-10 transition-all duration-300">
                <div className="labs-meta mb-4">Stadt Landshut</div>
                <div
                  className="labs-heading mb-3 transition-opacity group-hover:opacity-70"
                  style={{ fontSize: 'var(--labs-size-heading-sm)' }}
                >
                  FileFlow
                </div>
                <div className="labs-body leading-relaxed">
                  Automated letter pipeline.
                  <br />
                  €160,000 annual savings.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// How to Apply Section
function _HowToApplySection() {
  return (
    <section
      className="labs-reveal relative overflow-hidden py-32"
      style={{ background: '#ffffff' }}
    >
      {/* Noise texture */}
      <div className="hidden md:block">
        <NoiseTexture noiseOpacity={0.15} className="opacity-30" />
      </div>

      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
        <div
          className="absolute left-1/3 top-1/2 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.25) 0%, transparent 70%)',
          }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(234,179,8,0.2) 0%, transparent 70%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl text-center">
          {/* Section Header */}
          <div className="mb-20">
            <span
              className="font-mono uppercase tracking-[0.15em]"
              style={{ fontSize: '16px', color: 'var(--labs-accent)' }}
            >
              {'// How to apply'}
            </span>
          </div>

          {/* Headline */}
          <h2
            className="labs-heading mb-8 text-[clamp(32px,5vw,56px)] leading-[1.1]"
            style={{ color: '#000000' }}
          >
            Super simple.
          </h2>

          {/* Body */}
          <div className="mx-auto mb-12 max-w-2xl">
            <p className="font-mono leading-relaxed" style={{ fontSize: '13px', color: '#555555' }}>
              Fill out a short written application. If we like what we read, we&apos;ll reach out
              for a quick interview.
            </p>
            <p
              className="mt-4 font-mono leading-relaxed"
              style={{ fontSize: '13px', color: '#555555' }}
            >
              We review on a rolling basis — the sooner you apply, the sooner we can meet. Deadline
              is 30 April 2026.
            </p>
          </div>

          {/* CTA */}
          <a
            href="https://tally.so/r/rjdeQM"
            target="_blank"
            rel="noopener"
            className="group relative inline-block overflow-hidden border px-12 py-4 font-mono text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300"
            style={{
              borderColor: 'var(--labs-accent)',
              color: 'var(--labs-accent)',
            }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
              Apply Now
            </span>
            <div
              className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
              style={{ background: 'var(--labs-accent)' }}
            ></div>
          </a>
        </div>
      </div>
    </section>
  );
}

// Apply Section
function ApplySection() {
  return (
    <section
      id="apply"
      className="labs-reveal relative scroll-mt-20 overflow-hidden py-32"
      style={{
        background: 'var(--labs-bg)',
      }}
    >
      {/* Animated background gradient blobs */}
      {/* <div className='absolute inset-0 pointer-events-none z-[1]'>
            <div
               className='absolute top-1/2 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-blob'
               style={{
                  background:
                     'radial-gradient(circle, rgba(45,212,191,0.3) 0%, transparent 70%)',
               }}
            ></div>
            <div
               className='absolute top-1/2 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-blob animation-delay-2000'
               style={{
                  background:
                     'radial-gradient(circle, rgba(168,85,247,0.28) 0%, transparent 70%)',
               }}
            ></div>
            <div
               className='absolute bottom-1/4 left-1/2 w-96 h-96 rounded-full blur-[120px] animate-blob animation-delay-4000'
               style={{
                  background:
                     'radial-gradient(circle, rgba(234,179,8,0.25) 0%, transparent 70%)',
               }}
            ></div>
         </div> */}

      {/* Rocket image - prominent but tasteful */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 opacity-[0.1]">
          <Image
            src="/labs/images/rocket.png"
            alt=""
            fill
            sizes="500px"
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 text-center md:px-12">
        <div className="mx-auto max-w-5xl">
          <h2
            className="labs-heading mb-16 text-[clamp(36px,6vw,64px)] leading-[0.95]"
            style={{ color: 'var(--labs-text-primary)' }}
          >
            Stop reading.
            <br />
            <span style={{ color: 'var(--labs-accent)' }}>Start building.</span>
          </h2>

          <a
            href="https://tally.so/r/rjdeQM"
            target="_blank"
            rel="noopener"
            className="group relative inline-block overflow-hidden border px-12 py-4 font-mono text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300"
            style={{
              borderColor: 'var(--labs-accent)',
              color: 'var(--labs-accent)',
            }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
              Apply Now
            </span>
            <div
              className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
              style={{ background: 'var(--labs-accent)' }}
            ></div>
          </a>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    // {
    //    q: 'Do I need an idea to apply?',
    //    a: (
    //       <>
    //          <span style={{ color: 'var(--labs-accent)' }}>No.</span> The
    //          challenges come directly from hospitals, clinicians, researchers,
    //          and health-tech partners. We've already scoped the real problems.
    //          You bring the skills.
    //       </>
    //    ),
    // },
    {
      q: 'Is this paid?',
      a: (
        <>
          Not in salary. But you&apos;ll work on{' '}
          <span style={{ color: 'var(--labs-accent)' }}>real healthcare challenges</span>, build a
          working MVP, get hands-on mentorship, and have a shot at your{' '}
          <span style={{ color: 'var(--labs-accent)' }}>first paying customer</span>. If that&apos;s
          not enough, this probably isn&apos;t for you.
        </>
      ),
    },
    {
      q: 'Do we have to give up equity?',
      a: (
        <>
          <span style={{ color: 'var(--labs-accent)' }}>No.</span> Your product, your pitch, your
          decision. <span style={{ color: 'var(--labs-accent)' }}>Whoever builds, owns.</span>
        </>
      ),
    },
    {
      q: 'Do I need MedTech experience?',
      a: (
        <>
          <span style={{ color: 'var(--labs-accent)' }}>No.</span> We provide domain access,
          clinical partners, and problem context. You just need the skills and the drive to solve
          hard problems.
        </>
      ),
    },
    {
      q: 'Do I have to speak German?',
      a: (
        <>
          It helps on the business and sales side. If you&apos;re focused on tech or design, English
          is fine.
        </>
      ),
    },
    {
      q: 'Can I participate online?',
      a: (
        <>
          <span style={{ color: 'var(--labs-accent)' }}>No.</span> We go out and touch grass.
          In-person only, Munich.
        </>
      ),
    },
    {
      q: 'Do I have to be a student?',
      a: (
        <>
          Nope. Recent graduates and young professionals are welcome. No hard cut-off. If
          you&apos;re at the start of your career and want to build something real,{' '}
          <span style={{ color: 'var(--labs-accent)' }}>we want you in</span>.
        </>
      ),
    },
    {
      q: 'Can I do it next to studying?',
      a: (
        <>
          Yes, but be realistic. If you&apos;re taking 6+ courses and a working student job, it
          might be a stretch. The{' '}
          <span style={{ color: 'var(--labs-accent)' }}>
            more time you put in, the more you get out
          </span>
          .
        </>
      ),
    },
    {
      q: 'Can I do it next to a working student job?',
      a: (
        <>
          It depends. Some manage both, especially if they can adjust hours. Just be{' '}
          <span style={{ color: 'var(--labs-accent)' }}>honest with yourself</span> about your
          capacity.
        </>
      ),
    },
  ];

  return (
    <section
      id="faq"
      className="labs-reveal relative scroll-mt-20 overflow-hidden py-32"
      style={{
        background: 'var(--labs-bg)',
      }}
    >
      {/* Noise texture */}
      <div className="hidden md:block">
        <NoiseTexture noiseOpacity={0.25} />
      </div>

      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
        <div
          className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)',
          }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/4 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)',
          }}
        ></div>
        <div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.05) 0%, transparent 70%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <SectionHeader>{'// Frequently asked'}</SectionHeader>

          {/* <h2
                  className='labs-heading mb-8'
                  style={{ fontSize: 'var(--labs-size-heading-md)' }}
               >
                  Got questions?
               </h2> */}

          {/* Featured image */}
          <div
            className="labs-reveal group relative mb-16 aspect-[21/9] overflow-hidden border"
            style={{ borderColor: 'var(--labs-border)' }}
          >
            <Image
              src="/labs/images/letter.JPG"
              alt="Program details"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute left-8 top-1/2 -translate-y-1/2">
              <Label className="mb-2 block" style={{ color: 'var(--labs-accent)' }}>
                {'// Everything you need to know'}
              </Label>
              <div
                className="labs-heading"
                style={{
                  fontSize: 'var(--labs-size-heading-sm)',
                  color: 'var(--labs-text-primary)',
                }}
              >
                Common questions answered
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="labs-reveal border border-l-2 bg-white/[0.02] transition-all duration-200"
                style={{
                  borderLeftColor: openIndex === i ? 'var(--labs-accent)' : 'transparent',
                  borderColor: 'rgba(255,255,255,0.05)',
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 p-6 text-left"
                >
                  <div className="flex flex-1 items-start gap-4">
                    <span
                      className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-200"
                      style={{
                        color: openIndex === i ? 'var(--labs-accent)' : 'var(--labs-text-meta)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="font-mono font-medium transition-colors duration-200"
                      style={{
                        fontSize: '13px',
                        color:
                          openIndex === i ? 'var(--labs-text-primary)' : 'var(--labs-text-body)',
                      }}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <div
                    className="font-mono text-xl transition-all duration-200"
                    style={{
                      color: openIndex === i ? 'var(--labs-accent)' : 'var(--labs-text-meta)',
                      transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    +
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${openIndex === i ? 'max-h-96 pb-6' : 'max-h-0'}`}
                >
                  <div className="px-6 pl-[52px]">
                    <p
                      className="font-mono leading-relaxed"
                      style={{
                        fontSize: '12px',
                        color: 'var(--labs-text-body)',
                      }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function LabsFooter() {
  return (
    <footer className="relative overflow-hidden bg-transparent py-4 text-xs">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 text-center md:px-12">
        <p
          className="font-mono leading-relaxed"
          style={{
            fontSize: '12px',
            color: 'var(--labs-text-body)',
          }}
        >
          {'// START Labs © 2026 · MedTech Edition'}
        </p>
      </div>
    </footer>
  );
}

// Main Component
export default function LabsContent() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll('.labs-reveal').forEach((el) => {
      observer.observe(el);
    });

    document.querySelectorAll('.carousel-scroll').forEach((el) => {
      (el as HTMLElement).scrollLeft = 0;
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Script id="iframe-height-sender" strategy="afterInteractive">
        {`
          function sendHeight() {
            if (window.parent !== window) {
              const height = document.documentElement.scrollHeight;
              window.parent.postMessage({ type: 'iframe-height', height: height }, '*');
            }
          }
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', sendHeight);
          } else {
            sendHeight();
          }
          window.addEventListener('resize', sendHeight);
        `}
      </Script>

      <main
        className="labs-page min-h-screen overflow-x-hidden"
        style={{ background: 'var(--labs-bg)' }}
      >
        <LabsNavigation />
        <HeroSection />
        <OrganizedBySection />
        <ProblemSection />
        <WhatsDifferentSection />
        <JourneyTimelineSection />
        {/* <WhyItWorksSection /> */}
        {/* <TheExperienceSection /> */}
        {/* <ProofCalloutSection /> */}
        <CriteriaSection />
        {/* <ProofSection /> */}
        {/* <HowToApplySection /> */}
        <FAQSection />
        <ApplySection />
        <LabsFooter />
      </main>
    </>
  );
}
