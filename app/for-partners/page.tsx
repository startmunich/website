import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';

import Hero from '@/components/Hero';
import HeroCard from '@/components/HeroCard';
import { isNocoDbImage } from '@/lib/images';
import { OG_IMAGES } from '@/lib/metadata';
import { getAllPartners } from '@/lib/partners';

import PartnerCTAButton from './PartnerCTAButton';
import PhotoGallery from './PhotoGallery';

export const metadata: Metadata = {
  title: 'Partner With Us',
  description:
    "Partner with START Munich to reach top talent from TUM, LMU, and HM. Sponsor events, host workshops, and recruit Munich's most ambitious student entrepreneurs.",
  alternates: { canonical: 'https://www.startmunich.de/for-partners' },
  openGraph: {
    url: 'https://www.startmunich.de/for-partners',
    title: 'Partner With Us | START Munich',
    description:
      "Partner with START Munich to reach top talent from TUM, LMU, and HM. Sponsor events, host workshops, and recruit Munich's most ambitious student entrepreneurs.",
    images: OG_IMAGES,
  },
};

export const revalidate = 3600;

const faqs = [
  {
    id: 'faq1',
    question: 'How long is the timeline to collaboration?',
    answer: (
      <>
        We can move fast and sometimes launch within days. Please check our event{' '}
        <a href="/domain/events" className="text-brand-pink hover:underline">
          calendar
        </a>{' '}
        first. If you want to join a specific event, contact us as early as possible so we can plan
        it with you.
      </>
    ),
  },
  {
    id: 'faq2',
    question: 'How can we recruit START members?',
    answer:
      'Partners get exclusive access to our talent pool through dedicated recruiting events, curated CV database access of consenting community members and event attendees, and priority placement on our job board. You can also host office tours and info sessions.',
  },
  {
    id: 'faq3',
    question: 'What events can partners sponsor?',
    answer:
      "Partners can sponsor flagship formats like Road to START Summit, START Sprint, workshops, networking nights, and more. Reach out and we'll find or build the right format together.",
  },
  {
    id: 'faq4',
    question: 'What is the partnership duration?',
    answer:
      'Depending on your goals, partnerships can be event-specific or long-term, for example for one semester or a full year.',
  },
  {
    id: 'faq5',
    question: 'How do we get started?',
    answer:
      "Send us a message anytime. We'll quickly set up a short intro call to understand your goals and propose the best next steps.",
  },
];

const partnershipOpportunities = [
  {
    icon: '🎤',
    title: 'Event Sponsorship',
    description:
      'Sponsor flagship events like our Annual Pitch Competition, Hackathons, and domain specific networking events to gain visibility among thousands of participants.',
  },
  {
    icon: '🎯',
    title: 'Recruit Top Talent',
    description:
      'Get direct access to our highly motivated member base through personal engagement, CV databases, and exclusive hiring opportunities.',
  },
  {
    icon: '🧑‍🏫',
    title: 'Host Workshops',
    description:
      'Share your expertise by hosting workshops, masterclasses, or talks on topics relevant to your industry and our founders.',
  },
  {
    icon: '💼',
    title: 'Company Visits',
    description:
      'Invite our members to your offices for tours, info sessions, and networking to build relationships with potential future employees and partners.',
  },
  {
    icon: '🏆',
    title: 'Pitch Competitions',
    description:
      'Judge our competitions, offer prizes, and be a thought leader to access to innovative startups seeking funding and partnerships.',
  },
  {
    icon: '🤝',
    title: 'Co-Innovation Projects',
    description:
      'Collaborate on innovation challenges, hackathons, or research projects that benefit both your organization and our members.',
  },
];

const whyStartSpecial = [
  {
    icon: '🎓',
    title: 'Academic Excellence',
    description:
      "Direct access to Munich's top universities. Our network spans TUM, LMU, HM and many more, connecting your organization with outstanding talent across engineering, business, research, and applied sciences.",
  },
  {
    icon: '🧠',
    title: 'Thought Leadership',
    description:
      'Share your expertise through workshops, talks, panels, and hands-on formats. START gives your team a credible stage in front of ambitious students, builders, and future founders.',
  },
  {
    icon: '📣',
    title: 'Branding',
    description:
      'Build sustained visibility across our flagship events, communication channels, and partner activations. We help your brand show up in a context that feels relevant and high-signal.',
  },
  {
    icon: '🤝',
    title: 'Partner Network',
    description:
      'Become part of a strong Munich ecosystem of partners, founders, and student operators. The value goes beyond single events and creates long-term relationships across the network.',
  },
];

export default async function ForPartnersPage() {
  const partners = await getAllPartners();

  // Plain-text FAQ answers for JSON-LD (faq1 has JSX, so we provide a text fallback)
  const faqPlainText: Record<string, string> = {
    faq1: 'We can move fast and sometimes launch within days. Please check our event calendar first. If you want to join a specific event, contact us as early as possible so we can plan it with you.',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof faq.answer === 'string' ? faq.answer : (faqPlainText[faq.id] ?? ''),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script id="iframe-height-sender" strategy="afterInteractive">
        {`
          function sendHeight() {
            const h = Math.max(
              document.documentElement.scrollHeight,
              document.body.scrollHeight
            );
            parent.postMessage({ type: "EMBED_HEIGHT", height: h }, "*");
          }

          window.addEventListener("load", sendHeight);
          const ro = new ResizeObserver(sendHeight);
          ro.observe(document.documentElement);
          document.addEventListener("DOMContentLoaded", sendHeight);
        `}
      </Script>

      <main className="min-h-screen bg-brand-dark-blue">
        {/* Hero Section */}
        <Hero
          backgroundImage="/forPartners/hero-opt.jpg"
          title={
            <>
              FOR
              <br />
              <span className="outline-text">PARTNERS</span>
            </>
          }
          description="Partner with Europe's leading student entrepreneurship community and shape the future of innovation"
        >
          {/* MD Partnerships Card */}
          <HeroCard>
            <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full border-2 border-white/20 transition-all duration-300 group-hover:border-brand-pink/50">
              <Image
                src="/forPartners/md-partnerships-younus.jpg"
                alt="MD Partnerships"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mb-1 text-lg font-bold text-white">Younus M&uuml;hlenweg</h3>
            <p className="mb-4 text-sm font-semibold text-brand-pink">Head of Partnerships</p>

            {/* Contact Button */}
            <PartnerCTAButton
              href="https://tally.so/r/3xpGQG"
              className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-bold text-white transition-all duration-300 hover:bg-brand-pink/90 hover:shadow-lg hover:shadow-brand-pink/50"
            >
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover/btn:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Get in Touch</span>
            </PartnerCTAButton>
          </HeroCard>
        </Hero>

        {/* Partner Overview - Logos - Full Width */}
        <section className="overflow-hidden pb-6 pt-16 lg:py-20">
          <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
                  Partners & Collaborators
                </p>
                <h2 className="mb-3 text-3xl font-black text-white md:text-4xl">
                  WHO WE <span className="outline-text">WORK</span> WITH
                </h2>
                <p className="max-w-3xl text-lg text-gray-400">
                  Trusted by leading companies and organizations
                </p>
              </div>
              <a
                href="/partners"
                className="hidden whitespace-nowrap rounded-full border-2 border-brand-pink px-6 py-2.5 text-center font-bold text-brand-pink transition-all duration-300 hover:bg-brand-pink hover:text-white md:inline-flex"
              >
                View All Partners →
              </a>
            </div>
          </div>

          <div className="relative mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
            <div className="absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-brand-dark-blue to-transparent" />
            <div className="absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-brand-dark-blue to-transparent" />
            <div className="animate-scroll-nonstop">
              {[...partners.filter((p) => p.featured), ...partners.filter((p) => p.featured)].map(
                (partner, i) => (
                  <div
                    key={`${partner.id}-${i}`}
                    className="mx-6 inline-flex flex-shrink-0 items-center justify-center"
                  >
                    <div className="relative flex h-20 w-36 items-center justify-center rounded-xl bg-white p-4">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        className="object-contain p-4"
                        sizes="144px"
                        unoptimized={isNocoDbImage(partner.logoUrl)}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
        <div className="mb-16 text-center md:hidden">
          <a
            href="/partners"
            className="group inline-flex items-center gap-2 font-medium text-white/70 transition-colors hover:text-brand-pink"
          >
            View all our partners{' '}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Content Below Hero */}
        <div className="mx-auto max-w-7xl space-y-32 px-4 py-8 sm:px-6 lg:px-8 lg:py-20">
          {/* Why Partner with START - Modern Card Grid */}
          <section className="relative">
            <div className="mb-12">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
                Why START
              </p>
              <h2 className="mb-3 text-3xl font-black text-white md:text-4xl">
                WHY PARTNER <span className="outline-text">WITH START</span>
              </h2>
              <p className="max-w-3xl text-lg text-gray-400">
                A practical partnership model built around academic excellence, thought leadership,
                branding, and strong network effects in Munich.
              </p>
            </div>

            <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Large featured card with university logos */}
              <div
                className="group md:row-span-2"
                style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}
              >
                <div className="relative flex h-full flex-col justify-center rounded-3xl border border-white/15 bg-gradient-to-br from-brand-pink/15 via-white/10 to-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:border-brand-pink/40 lg:p-10">
                  <div className="mb-6">
                    <div className="mb-4 flex flex-wrap gap-3">
                      <div className="flex h-16 w-full max-w-[160px] items-center justify-center rounded-2xl bg-white p-3 shadow-md">
                        <Image
                          src="/forPartners/Logo_of_the_Technical_University_of_Munich.svg"
                          alt="TUM Logo"
                          width={134}
                          height={40}
                          className="max-h-full max-w-full object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex h-16 w-full max-w-[160px] items-center justify-center rounded-2xl bg-white p-3 shadow-md">
                        <Image
                          src="/forPartners/LMU_Muenchen_Logo.svg.png"
                          alt="LMU Logo"
                          width={134}
                          height={40}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex h-16 w-full max-w-[160px] items-center justify-center rounded-2xl bg-white p-3 shadow-md">
                        <Image
                          src="/forPartners/HM_Logo.png"
                          alt="HM Logo"
                          width={134}
                          height={40}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-black text-white transition-colors group-hover:text-brand-pink">
                    {whyStartSpecial[0].title}
                  </h3>
                  <p className="leading-relaxed text-gray-300">{whyStartSpecial[0].description}</p>
                </div>
              </div>

              {/* Two cards on the right */}
              {whyStartSpecial.slice(1, 3).map((reason, index) => (
                <div
                  key={index + 1}
                  className="group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${(index + 1) * 0.1}s both` }}
                >
                  <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition-all duration-500 hover:border-brand-pink/30 hover:bg-white/[0.09]">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-pink/15">
                      <span className="text-3xl">{reason.icon}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-brand-pink">
                      {reason.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400">{reason.description}</p>
                  </div>
                </div>
              ))}

              {/* Partner Network - Horizontal card spanning full width */}
              <div
                className="group md:col-span-2"
                style={{ animation: `fadeInUp 0.6s ease-out 0.3s both` }}
              >
                <div className="relative flex h-full items-center gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.03] p-7 backdrop-blur-sm transition-all duration-500 hover:border-brand-pink/30 hover:bg-white/[0.08]">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-pink/15">
                    <span className="text-4xl">{whyStartSpecial[3].icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-brand-pink">
                      {whyStartSpecial[3].title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {whyStartSpecial[3].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What Partners Can Do With Us */}
          <section className="relative">
            <div className="mb-12">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
                Collaborate
              </p>
              <h2 className="mb-3 text-3xl font-black text-white md:text-4xl">
                WHAT <span className="outline-text">PARTNERS CAN DO</span> WITH US
              </h2>
              <p className="max-w-3xl text-lg text-gray-400">
                Multiple ways to engage with our entrepreneurial community
              </p>
            </div>

            <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Featured large card */}
              <div
                className="group md:row-span-2"
                style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}
              >
                <div className="relative flex h-full min-h-[400px] flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-br from-brand-pink/15 via-white/10 to-white/5 p-10 backdrop-blur-sm transition-all duration-500 hover:border-brand-pink/40">
                  <div>
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-pink/15">
                      <span className="text-5xl">{partnershipOpportunities[0].icon}</span>
                    </div>
                    <h3 className="mb-4 text-2xl font-black text-white transition-colors group-hover:text-brand-pink">
                      {partnershipOpportunities[0].title}
                    </h3>
                    <p className="leading-relaxed text-gray-300">
                      {partnershipOpportunities[0].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top right horizontal card */}
              <div
                className="group md:col-span-2"
                style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}
              >
                <div className="relative flex h-full items-center gap-8 rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm transition-all duration-500 hover:border-brand-pink/30 hover:bg-white/[0.09]">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-pink/15">
                    <span className="text-4xl">{partnershipOpportunities[1].icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-brand-pink">
                      {partnershipOpportunities[1].title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {partnershipOpportunities[1].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Two square cards */}
              {partnershipOpportunities.slice(2, 4).map((opportunity, index) => (
                <div
                  key={index + 2}
                  className="group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${(index + 2) * 0.1}s both` }}
                >
                  <div className="relative flex h-full min-h-[200px] flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm transition-all duration-500 hover:border-brand-pink/30 hover:bg-white/[0.09]">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-pink/15">
                      <span className="text-4xl">{opportunity.icon}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-brand-pink">
                      {opportunity.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {opportunity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pictures of Partners at Events */}
          <PhotoGallery />

          {/* FAQ Section */}
          <section>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-16">
              {/* Left Column - Header */}
              <div className="lg:col-span-2">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
                  Have Questions?
                </p>
                <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
                  FREQUENTLY ASKED <span className="outline-text">QUESTIONS</span>
                </h2>
                <p className="mb-4 text-lg text-gray-400 lg:mb-8">
                  Everything you need to know about partnering with START
                </p>
              </div>

              {/* Right Column - Accordion */}
              <div className="space-y-4 lg:col-span-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition-all duration-300 hover:border-brand-pink/30"
                  >
                    <summary className="flex w-full cursor-pointer list-none items-center justify-between rounded-2xl px-7 py-5 transition-colors duration-200 hover:bg-white/[0.04]">
                      <h3 className="pr-8 text-lg font-bold text-white">{faq.question}</h3>
                      <span className="faq-icon flex-shrink-0 text-2xl text-brand-pink transition-transform duration-300">
                        +
                      </span>
                    </summary>
                    <div className="px-7 pb-5">
                      <p className="leading-relaxed text-gray-400">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section id="get-in-touch">
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-pink/30 bg-gradient-to-br from-[#1a1a3e] via-brand-dark-blue to-[#0d0d1f] shadow-2xl shadow-brand-pink/10">
              {/* Decorative Elements */}
              <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-brand-pink/10 blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-brand-pink/5 blur-[80px]"></div>

              <div className="relative p-8 md:p-10">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
                    Let&apos;s Connect
                  </p>
                  <h3 className="mb-5 text-3xl font-black text-white md:text-5xl">
                    READY TO <span className="outline-text">PARTNER?</span>
                  </h3>
                  <p className="mb-8 text-lg text-gray-300">
                    Join our network of leading companies and get in touch with ambitious students
                    from TUM, LMU, and other Munich universities.
                  </p>
                  <div className="flex justify-center">
                    <PartnerCTAButton
                      href="https://tally.so/r/3xpGQG"
                      className="rounded-full bg-brand-pink px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-brand-pink/90 hover:shadow-lg hover:shadow-brand-pink/50"
                    >
                      Get in Touch
                    </PartnerCTAButton>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
