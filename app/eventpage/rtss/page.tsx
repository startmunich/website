import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

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

const faqs = [
  {
    question: 'What is the Road to START Summit?',
    answer:
      'The Road to START Summit is a series of events organized by START chapters throughout Europe. These events serve as warm-up gatherings leading up to START Summit in St. Gallen. The goal is to identify promising startups that will represent START Munich and pitch in St. Gallen.',
  },
  {
    question: 'Where and when does it take place?',
    answer:
      'It will take place on 9 December 2025 at Freiheitshalle, Munich. The following START Summit in St. Gallen, Switzerland, will run from 19 to 20 March 2026.',
  },
  {
    question: 'What are the requirements for startups?',
    answer:
      'Your startup was founded in 2023 or later, is in Seed or Pre-Seed stage, and is an independent legal entity. There are no limitations regarding the amount of funding you have already received. Extra points if your startup has a deep tech focus.',
  },
  {
    question: 'How is it different from Road to START Hack?',
    answer:
      'Road to START Hack is a weekend-long hackathon where students build software and hardware projects. Road to START Summit is a pitching competition for startups.',
  },
];

function RtssButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-[#00002c] transition hover:-translate-y-0.5 hover:bg-[#d0006f] hover:text-white hover:shadow-xl hover:shadow-[#d0006f]/30 ${
        variant === 'secondary'
          ? '!border !border-white/25 !bg-transparent !text-white hover:!border-[#d0006f] hover:!bg-[#d0006f]'
          : ''
      }`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  );
}

function RtssNavbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-[100] bg-[#00002c]">
      <div className="relative mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
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

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 xl:flex">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-black uppercase tracking-wide text-white transition hover:text-[#fc2f72]"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded sm:flex">
          <a
            href={startupApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-[#00002c] transition hover:bg-[#fc2f72] hover:text-white"
          >
            Apply startup
          </a>
          <a
            href={attendeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-l border-[#00002c]/20 bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-[#00002c] transition hover:bg-[#fc2f72] hover:text-white"
          >
            Attend
          </a>
        </div>

        <a
          href={attendeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-[#00002c] transition hover:bg-[#fc2f72] hover:text-white sm:hidden"
        >
          Attend
        </a>
      </div>
    </nav>
  );
}

export default function RtssPage() {
  return (
    <div className="overflow-x-hidden bg-[#fc2f72] pt-20 text-white">
      <RtssNavbar />
      <RtssHeroTitle />
      <section className="relative z-[60] min-h-[820px] overflow-hidden sm:min-h-[calc(100svh-5rem)] lg:min-h-[900px]">
        <div
          className="pointer-events-none absolute inset-0 z-[50]"
          style={{ background: 'linear-gradient(#fff0 42%, #fc2f72 58%)' }}
        />

        <div className="relative z-[70] mx-auto min-h-[820px] max-w-[1500px] px-5 sm:min-h-[calc(100svh-5rem)] sm:px-8 lg:min-h-[900px] lg:px-12">
          <div className="absolute inset-x-5 top-[53%] flex -translate-y-1/2 flex-col items-center text-center sm:inset-x-8 sm:top-[52%] lg:inset-x-12 lg:top-[54%]">
            <p className="mx-auto max-w-[20rem] px-4 text-base font-bold text-white/85 drop-shadow-[0_2px_14px_rgba(0,0,44,0.5)] sm:max-w-xl sm:text-xl">
              Join us for START Munich&apos;s biggest event yet.
            </p>
            <div className="mx-auto mt-6 flex w-full max-w-md flex-col items-center justify-center gap-3 text-sm font-black uppercase tracking-wide text-white sm:max-w-none sm:flex-row sm:text-base">
              <span className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#00002c]/35 px-4 py-2 shadow-lg shadow-[#00002c]/20 backdrop-blur sm:w-auto">
                <CalendarDays className="h-4 w-4 text-[#ff7aa7]" />
                9th December 2025
              </span>
              <span className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#00002c]/35 px-4 py-2 shadow-lg shadow-[#00002c]/20 backdrop-blur sm:w-auto">
                <MapPin className="h-4 w-4 text-[#ff7aa7]" />
                Munich
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-44 z-[60] sm:bottom-48 lg:bottom-0">
          <Image
            src="/eventpage/rtss/mountain.png"
            alt=""
            width={1920}
            height={829}
            priority
            className="h-auto w-full min-w-[900px] max-w-none translate-x-[-18%] sm:translate-x-0"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(#fff0 58%, #fc2f72)' }}
          />
        </div>
      </section>

      <section
        id="cta"
        className="relative z-[60] scroll-mt-20 overflow-hidden bg-[#fc2f72] px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-white/20" />
        <div className="mx-auto max-w-6xl text-center">
          <p className="mx-auto max-w-sm text-lg font-bold text-white/70 sm:max-w-none">
            Join us for START Munich&apos;s biggest event yet.
          </p>
          <h2 className="mt-3 text-[2rem] font-black uppercase leading-none min-[480px]:text-4xl sm:text-7xl lg:text-8xl">
            <span className="block">Road to</span>
            <span className="block">START Summit</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xs text-xl font-black uppercase text-white/75 min-[480px]:text-2xl sm:max-w-none sm:text-[#ff7aa7]">
            9th December 2025, Munich
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <RtssButton href={startupApplyUrl}>Apply As A Start-up</RtssButton>
            <RtssButton href={attendeeUrl} variant="secondary">
              Take part as an attendee
            </RtssButton>
          </div>
        </div>
      </section>

      <div className="relative z-[60] space-y-10 bg-[#fc2f72] px-5 pb-16 sm:px-8 lg:px-12">
        {infoSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={`mx-auto grid max-w-6xl scroll-mt-24 overflow-hidden rounded border border-white/20 bg-[#09093d] shadow-2xl shadow-black/20 lg:grid-cols-2 ${
              section.reverse ? 'lg:[&>div:first-child]:order-2' : ''
            }`}
          >
            <div className="relative min-h-[360px] overflow-hidden sm:min-h-[520px] lg:min-h-full">
              <Image
                src={section.image}
                alt={section.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00002c]/55 to-transparent lg:hidden" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-[#ff7aa7]">
                {section.eyebrow}
              </p>
              <h2 className="text-4xl font-black uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
                {section.title}
              </h2>
              <div className="text-white/78 mt-7 space-y-4 text-base leading-relaxed sm:text-lg">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.cta && section.href ? (
                <div className="mt-8">
                  <RtssButton href={section.href}>{section.cta}</RtssButton>
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <section className="relative z-[60] overflow-hidden border-y border-white/15 bg-[#d0006f] py-5">
        <a
          href="#cta"
          className="animate-scroll-nonstop flex whitespace-nowrap text-2xl font-black uppercase tracking-wide text-white"
        >
          {[...Array(2)].map((_, index) => (
            <span key={index} className="flex gap-8 pr-8">
              <span>Network Beyond.</span>
              <span>Pitch Beyond.</span>
              <span>Connect Beyond.</span>
              <span>Grow Beyond.</span>
              <span>Invest Beyond.</span>
              <span>Scale Beyond.</span>
            </span>
          ))}
        </a>
      </section>

      <section
        id="partners"
        className="relative z-[60] scroll-mt-20 bg-[#00002c] px-5 py-20 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-5xl font-black uppercase sm:text-7xl">Our Partners</h2>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded border border-white/15 bg-white/15 md:grid-cols-4">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex min-h-32 items-center justify-center bg-[#09093d] p-7"
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
            <RtssButton href={attendeeUrl} variant="secondary">
              Take part as an attendee
            </RtssButton>
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="relative z-[60] scroll-mt-20 bg-white px-5 py-20 text-[#00002c] sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-5xl font-black uppercase sm:text-7xl">
            What participants say
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded border border-[#00002c]/10 bg-[#f7f7fb] p-6"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-black uppercase">{testimonial.name}</h3>
                    {testimonial.href ? (
                      <a
                        href={testimonial.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black uppercase tracking-wide text-[#d0006f] hover:underline"
                      >
                        {testimonial.role}
                      </a>
                    ) : (
                      <p className="text-xs font-black uppercase tracking-wide text-[#d0006f]">
                        {testimonial.role}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-5 text-base leading-relaxed text-[#00002c]/75">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative z-[60] scroll-mt-20 bg-[#fc2f72] px-5 py-20 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-black uppercase tracking-[0.24em] text-[#ff7aa7]">
            Wanna learn more?
          </p>
          <h2 className="mt-3 text-center text-5xl font-black uppercase sm:text-7xl">
            Frequently asked questions
          </h2>
          <div className="mt-10 divide-y divide-white/15 rounded border border-white/15">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group bg-white/[0.03] p-5 open:bg-white/[0.06]"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-black uppercase">
                  {faq.question}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-white text-[#00002c] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
