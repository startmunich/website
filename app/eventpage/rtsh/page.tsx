import { ArrowLeft, ExternalLink, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Road to START Hack',
  description: "Munich's most entrepreneurial hackathon by START Munich.",
  alternates: { canonical: 'https://www.startmunich.de/eventpage/rtsh' },
  openGraph: {
    url: 'https://www.startmunich.de/eventpage/rtsh',
    title: 'Road to START Hack | START Munich',
    description:
      'A 24-hour entrepreneurial hackathon where 200+ students build real products with startup challenge partners.',
    images: [
      {
        url: '/eventpage/rtsh/hero.jpg',
        width: 1000,
        height: 1500,
        alt: 'Hackers working around a table at Road to START Hack',
      },
    ],
  },
};

const applyUrl = 'https://luma.com/event/evt-IO8XSK5XUfr9IDj';
const contactUrl =
  'https://ffd0351e.sibforms.com/serve/MUIFACn-jxeFzJuy54x_EqQKnO1eWZ5Qt-Mx6UUF5ltQuoJHVl6tN9XxVkiXXqrJDJKDz8JCns9-KomFM31L_ifaCZhEW0HUrpcxjWuR8_suYwZt6bRvweEPaR3ML2Za8pbBEJIivB6BKR9-bNz1VHdlQ3Wrz91tf0328X0lAEQX0EF7jhYlIWnVZd79YlJgz4635KQHcuV-YbH8';

const facts = [
  {
    icon: '/eventpage/rtsh/icon-calendar.png',
    text: '29-30 November 2025',
  },
  {
    icon: '/eventpage/rtsh/icon-location.png',
    text: 'Munich (TUM) Main Campus',
  },
  {
    icon: '/eventpage/rtsh/icon-participants.png',
    text: '200+ hackers',
  },
  {
    icon: '/eventpage/rtsh/icon-partners.png',
    text: 'Challenge partners from 5 top DACH startups at the AI frontier',
  },
  {
    icon: '/eventpage/rtsh/icon-format.png',
    text: '24-hour build sprint, team formation on site, mentor support throughout',
  },
  {
    icon: '/eventpage/rtsh/icon-demo.png',
    text: 'Pitch on stage to a jury of investors and experts',
  },
  {
    icon: '/eventpage/rtsh/icon-prize.png',
    text: 'Win prizes including cash, gadgets and mentorship from VCs',
  },
];

const timeline = [
  ['Arrival and Registration', '09:00 AM - 10:00 AM'],
  ['Welcome and Opening Remarks', '10:00 AM - 10:10 AM'],
  ['Rules and Timings', '10:10 AM - 10:30 AM'],
  ['Partner Introduction', '10:30 AM - 11:00 AM'],
  ['Team Formation and Coffee', '11:00 AM - 11:45 AM'],
  ['Presentation of the Challenges', '11:45 AM - 12:40 PM'],
  ['Challenge Form Opens & Matchmaking', '12:30 PM'],
  ['Hacking Starts', '1:00 PM'],
  ['Challenge Deep Dives', '1:00 PM - 1:45 PM'],
  ['Lunch', '2:00 PM - 3:00 PM'],
  ['Hacking Session 1', '1:00 PM - 6:00 PM'],
  ['Dinner', '6:00 PM - 7:30 PM'],
  ['Hacking Session 2', '7:30 PM - 12:00 AM'],
  ['Midnight Snack', '12:00 AM - 1:00 AM'],
  ['Hacking Session 3 (Overnight)', '1:00 AM - 7:30 AM'],
  ['Breakfast', '7:30 AM - 9:00 AM'],
  ['Hacking Session 4 (Final Stretch)', '9:00 AM - 1:00 PM'],
  ['Project Submission', '12:00 PM - 1:00 PM'],
  ['Break', '1:00 PM - 1:15 PM'],
  ['Project Demos and Presentations', '1:15 PM - 2:30 PM'],
  ['Lunch', '2:30 PM - 3:15 PM'],
  ['Finalist Presentations', '3:15 PM - 3:45 PM'],
  ['Keynote Speaker (Judge Deliberation)', '3:45 PM - 4:00 PM'],
  ['Awards Ceremony and Closing Remarks', '4:00 PM - 4:30 PM'],
];

const challengePartners = [
  { name: 'BFL', logo: '/eventpage/rtsh/logo-bfl.png' },
  { name: 'AskLio', logo: '/eventpage/rtsh/logo-asklio.png' },
  { name: 'QPLIX', logo: '/eventpage/rtsh/logo-qplix.png', compact: true },
  { name: 'Oneware', logo: '/eventpage/rtsh/logo-oneware.png' },
];

const ecosystemPartners = [
  { name: 'OAI', logo: '/eventpage/rtsh/logo-oai.png' },
  { name: 'Langdock', logo: '/eventpage/rtsh/logo-langdoc.png' },
  { name: 'Partner', logo: '/eventpage/rtsh/logo-white.png' },
  { name: 'Lovable', logo: '/eventpage/rtsh/logo-lovable.png' },
  { name: 'EWOR', logo: '/eventpage/rtsh/logo-ewor.png' },
  { name: 'AWS', logo: '/eventpage/rtsh/logo-aws.png', compact: true },
];

const faqs = [
  {
    question: 'When will the Hackathon take place?',
    answer: 'It’s happening on November 29–30, 2025 (Saturday–Sunday) — not much sleep for you ;)',
  },
  {
    question: 'What is the topic of the hackathon?',
    answer:
      'From “Hello World” to “Hello Users”!\nThis is an entrepreneurial hackathon, meaning it’s not just about solving a random coding task. You’ll tackle real challenges from industry partners, solving actual problems that exist in the market.\nThe ultimate goal? Build something so good that you could turn it into your own startup afterwards. 💡',
  },
  {
    question: 'Who can attend?',
    answer:
      'Any student with curiosity and a spark of creativity!\nWhether you’re studying engineering, computer science, physics, math, business, or management — if you love solving real-world problems, this hackathon is for you.',
  },
  {
    question: 'How can I apply for the event?',
    answer:
      'Applications will open via Luma.\nJust fill out a short form telling us who you are, what you do, and why you want to join the hackathon. We promise it’s quick — and fun!',
  },
  {
    question: 'Do I need to have a team in advance?',
    answer:
      'Nope! You can apply solo. We’ll have a matchmaking session at the start of the event, so there’s plenty of time to find your dream team.',
  },
  {
    question: 'What should I bring to the event?',
    answer:
      'Bring your laptop, charger, creativity, and a good mood.\nSleeping bag or blanket recommended (depending on your commitment to all-nighters). We’ll take care of the rest — snacks, drinks, and vibes included.',
  },
  {
    question: 'Do you provide accommodation?',
    answer: 'Not officially — but don’t worry, you won’t have much time to sleep anyway. 😉',
  },
  {
    question: 'What size can the team be?',
    answer:
      'Teams can have 3–5 people.\nEach participant applies individually, but if you’re already a team, make sure to mention your teammates in the application form — we’ll review and accept you as a team whenever possible.',
  },
  {
    question: 'How do We register as a team?',
    answer:
      'You’ll each fill out the Luma application, and there’s a special question asking if you’re applying as a team. Once you’re accepted, we’ll make sure your group sticks together.',
  },
  {
    question: 'When will the challenges be announced?',
    answer:
      'Right at the beginning of the event — on Saturday morning!\nOur five challenge partners will present their cases in two parallel sessions, so you can choose which one to attend based on your interests.',
  },
  {
    question: 'When will I know if my application has been accepted?',
    answer:
      'You’ll be informed well before the event — enough time to pack your stuff and mentally prepare you for the grind',
  },
  {
    question: 'Will there be food?',
    answer:
      'Absolutely. You won’t code on an empty stomach. We’ll provide meals and snacks throughout the event — details are a surprise 🍕',
  },
  {
    question: 'How long does the hackathon last?',
    answer: 'Exactly 24 hours of hacking, plus demos, judging, and the award ceremony afterwards.',
  },
  {
    question: 'Where will the hackathon take place?',
    answer:
      'At the Technical University of Munich (TUM) Main Campus —\n📍 Arcisstraße 21, 80333 Munich, in the Audimax Foyer.\nYes, there’s plenty of space. And yes, there’s Wi-Fi.',
  },
  {
    question: 'Can I participate alone?',
    answer:
      'You can apply alone, but you’ll need a team to compete. Don’t worry — we’ll help you find one!',
  },
  {
    question: 'How do I find teammates if I don’t have any?',
    answer:
      'We’ve got you covered!\nWe’re planning a pre-event at MTZ the day before the hackathon, where you can meet other participants and form teams.\nAnd on Saturday morning, there’s an extra matchmaking timeslot to make sure everyone finds their crew.',
  },
  {
    question: 'Any other questions? Contact us!',
    answer: 'Reach out via E-mail: f.beier@startmunich.de or j.erhard@startmunich.de',
  },
];

function RtshButton({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center justify-center gap-2 border border-white bg-[#34e1b8]/20 px-6 py-3 text-xs font-[900] uppercase leading-none tracking-normal text-white transition hover:-translate-y-0.5 hover:bg-[#34e1b8]/70 focus:outline-none focus:ring-2 focus:ring-[#34e1b8] focus:ring-offset-2 focus:ring-offset-[#0c2724] ${className}`}
    >
      {children}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}

function PartnerGrid({
  title,
  partners,
}: {
  title: string;
  partners: { name: string; logo: string; compact?: boolean }[];
}) {
  return (
    <div className="space-y-8">
      <h3 className="text-center text-xl font-bold text-[#34e1b8] sm:text-2xl">{title}</h3>
      <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="flex min-h-28 items-center justify-center border border-[#144146] bg-[#0f302c] px-5 py-6"
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              width={260}
              height={120}
              loading="eager"
              className={`h-auto w-auto object-contain ${
                partner.compact ? 'max-h-16 max-w-28' : 'max-h-14 max-w-44'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RtshPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0c2724] text-[#34e1b8]">
      <section className="border-t border-dashed border-[#144146] px-6 py-6 sm:px-10 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:min-h-[920px] lg:grid-cols-[1fr_0.92fr] lg:gap-16">
          <div className="min-h-[560px] py-2 lg:sticky lg:top-0 lg:h-screen lg:min-h-[760px]">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 text-[10px] text-white/55 transition hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Back to START website
            </Link>

            <div className="mt-28 max-w-2xl sm:mt-36 lg:mt-[28vh]">
              <p className="text-base font-bold">29.____ 30th November 2025</p>
              <div className="mt-9">
                <p className="hidden items-center gap-2 text-2xl font-bold lg:flex">
                  <span>Road to</span>
                  <span className="h-px flex-1 bg-[#34e1b8]" />
                </p>
                <h1 className="mt-4 text-[clamp(3.35rem,13vw,7rem)] font-[900] leading-[0.92] tracking-normal sm:text-[clamp(5rem,10vw,8.5rem)] lg:text-[clamp(5.7rem,7vw,8rem)]">
                  <span className="block lg:hidden">Road to</span>
                  START Hack
                </h1>
              </div>
              <RtshButton href={applyUrl} className="mt-8">
                Apply here
              </RtshButton>
            </div>
          </div>

          <div className="pb-16 lg:pb-28">
            <div className="relative overflow-hidden border border-[#144146] bg-[#123530] shadow-2xl shadow-black/25">
              <Image
                src="/eventpage/rtsh/hero.jpg"
                alt="Hackers working together at Road to START Hack"
                width={1000}
                height={1500}
                priority
                className="aspect-[4/3] w-full object-cover object-[50%_34%] lg:aspect-[0.76]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[#34e1b8]/10 mix-blend-screen" />
            </div>

            <div className="mt-12 space-y-6 lg:mt-24">
              {facts.map((fact) => (
                <div key={fact.text} className="flex items-center gap-5">
                  <Image
                    src={fact.icon}
                    alt=""
                    width={44}
                    height={44}
                    className="h-10 w-10 shrink-0 object-contain"
                  />
                  <p className="max-w-xl text-base font-bold leading-tight">{fact.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-dashed border-[#144146] px-6 py-24 text-center sm:px-10 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[clamp(2.3rem,6vw,4.5rem)] font-[900] leading-[0.95] tracking-normal">
            <span className="block">From Hello World,</span>
            <span className="block">
              <span className="mr-3 inline-block h-[0.12em] w-[1.2em] bg-[#34e1b8] align-middle" />
              to Hello Users
            </span>
          </h2>
          <p className="mt-10 text-xl font-[900]">in 24 hours</p>
          <RtshButton href={applyUrl} className="mt-10">
            Apply here
          </RtshButton>
          <p className="mx-auto mt-12 max-w-4xl text-base font-bold leading-relaxed">
            Turn a simple idea into something people can click. Road to START Hack brings 200
            innovators from all fields and backgrounds together to solve real-world challenges in
            just 24 hours. We help you keep the scope tight, mentors jump in when you are stuck, and
            the room stays friendly and focused. You prototype, test with people nearby, and polish
            just enough to show it. No experience required. Bring your laptop and curiosity. By the
            end you can say hello users for real, with a demo you are proud to share and a path to
            keep going.
          </p>
        </div>
      </section>

      <section className="border-t border-dashed border-[#144146] px-6 py-24 sm:px-10 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="flex flex-col justify-between gap-12">
            <div>
              <h2 className="max-w-xl text-[clamp(3rem,7vw,5rem)] font-[900] leading-[0.9] tracking-normal">
                How the 24 hours run.
              </h2>
              <p className="mt-7 max-w-xl text-base font-bold leading-relaxed">
                From Saturday 09:00 check-in to Sunday 17:30 awards, you will form teams, meet
                partners, dive into challenges, build in four focused blocks with mentor support,
                submit at noon, demo by challenge, then see the winners on stage.
              </p>
            </div>
            <div className="grid max-w-md grid-cols-2 gap-8">
              <div>
                <p className="text-6xl font-[900] leading-none sm:text-7xl">24H</p>
                <p className="mt-3 text-xs font-bold">Of Hacking</p>
              </div>
              <div>
                <p className="text-6xl font-[900] leading-none sm:text-7xl">+200</p>
                <p className="mt-3 text-xs font-bold">Hackers</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-8 text-sm font-[900]">scroll to see the full timeline</p>
            <div className="relative max-h-[680px] overflow-y-auto border border-[#144146] bg-[#0b2824] p-6 shadow-[0_0_80px_rgba(52,225,184,0.12)] sm:p-9">
              <div className="pointer-events-none absolute bottom-0 left-9 top-0 w-px bg-gradient-to-b from-[#0c2724] via-[#34e1b8] to-[#0c2724] sm:left-auto sm:right-9" />
              <ol className="space-y-8">
                {timeline.map(([title, time]) => (
                  <li
                    key={`${title}-${time}`}
                    className="relative pl-8 text-left sm:pl-0 sm:pr-12 sm:text-right"
                  >
                    <span className="absolute left-[-1.75rem] top-1.5 h-1.5 w-7 rounded-full border border-white bg-[#34e1b8] shadow-[0_0_12px_rgba(52,225,184,0.8)] sm:left-auto sm:right-[-2.65rem]" />
                    <h3 className="text-lg font-[900] uppercase leading-tight text-white">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-white/65">{time}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-dashed border-[#144146] px-6 py-24 sm:px-10 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl space-y-20">
          <PartnerGrid title="Challenge Partners:" partners={challengePartners} />
          <PartnerGrid title="Ecosystem Partners:" partners={ecosystemPartners} />
          <div className="text-center">
            <RtshButton href={applyUrl}>Apply here</RtshButton>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="border-t border-dashed border-[#144146] px-6 py-24 sm:px-10 lg:px-12 lg:py-32"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-[clamp(2.6rem,6vw,4.5rem)] font-[900] leading-[0.95] tracking-normal">
            frequently asked questions
          </h2>
          <div className="mt-16 divide-y divide-white/70 border-y border-white/70">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-7">
                <summary className="flex cursor-pointer list-none items-start gap-5 text-left">
                  <Plus
                    className="mt-1 h-5 w-5 shrink-0 text-white transition group-open:rotate-45"
                    aria-hidden="true"
                  />
                  <span className="text-xl font-[900] leading-tight sm:text-2xl">
                    {faq.question}
                  </span>
                </summary>
                <p className="text-white/78 mt-5 max-w-3xl whitespace-pre-line pl-10 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <RtshButton href={applyUrl}>Apply here</RtshButton>
          </div>
        </div>
      </section>

      <section className="border-t border-dashed border-[#144146] px-6 py-20 text-center sm:px-10 lg:px-12">
        <h2 className="text-[clamp(3.5rem,8vw,6rem)] font-[900] leading-none tracking-normal">
          Contact us
        </h2>
        <p className="mt-10 text-base font-bold">Tell us how we can help</p>
        <div className="mx-auto mt-10 max-w-xl overflow-hidden border border-[#144146] bg-white">
          <iframe
            title="Road to START Hack contact form"
            src={contactUrl}
            width="540"
            height="450"
            className="block h-[450px] w-full"
          />
        </div>
      </section>

      <footer className="flex min-h-32 flex-col items-center justify-center gap-8 border-t border-dashed border-[#144146] px-6 py-10 text-white sm:flex-row sm:justify-between sm:px-10 lg:px-12">
        <a
          href="https://buy.stripe.com/6oE16k2dg6gz3n2145"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-[900] uppercase transition hover:text-[#34e1b8]"
        >
          Donate
        </a>
        <div className="flex gap-8">
          <Link
            href="/legal-notice"
            className="text-sm font-[900] uppercase transition hover:text-[#34e1b8]"
          >
            Legal Notice
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm font-[900] uppercase transition hover:text-[#34e1b8]"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </main>
  );
}
