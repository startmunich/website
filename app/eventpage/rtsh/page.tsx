import { readFileSync } from 'fs';
import type { Metadata } from 'next';
import { join } from 'path';

import RotatingJourney from './RotatingJourney';

export const metadata: Metadata = {
  title: 'Join the Waitlist for Road to START Hack 2026',
  description:
    "Munich's most entrepreneurial hackathon. From hello world to hello users in 24 hours, built small and shown proud. 250 builders, one weekend. Join the 2026 waitlist.",
  alternates: { canonical: 'https://www.startmunich.de/eventpage/rtsh' },
  openGraph: {
    url: 'https://www.startmunich.de/eventpage/rtsh',
    title: 'Road to START Hack 2026 | START Munich',
    description:
      'From hello world to hello users in 24 hours. 250 builders, one weekend at TU München. Join the 2026 waitlist.',
    type: 'website',
  },
};

const LUMA_URL = 'https://lu.ma/';

const POLYGON_SVG = readFileSync(
  join(process.cwd(), 'public', 'eventpage', 'rtsh', 'polygon.svg'),
  'utf-8',
);

const START_LOGO_SVG = readFileSync(join(process.cwd(), 'public', 'startlogo.svg'), 'utf-8');

export default function RtshPage() {
  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        .hero-polygon {
          position: absolute; top: -160px; right: -200px;
          width: min(58vw, 660px); height: auto;
          opacity: .5; z-index: 0; pointer-events: none;
        }
        @media (max-width: 820px) {
          .hero-polygon { width: 80vw; top: -100px; right: -220px; opacity: .35; }
        }
        .jgap {
          position: relative; display: inline-block;
          width: 1.7em; height: .14em; top: -.16em;
          background: rgba(52,225,184,.32); border-radius: 3px;
          overflow: hidden; flex: 0 0 auto;
        }
        .jgap::after {
          content: ""; position: absolute; inset: 0;
          background: #34e1b8;
          transform: translateX(-101%);
          animation: trace 3s ease-in-out infinite;
        }
        @keyframes trace {
          0% { transform: translateX(-101%); }
          45% { transform: translateX(0); }
          75% { transform: translateX(0); }
          100% { transform: translateX(101%); }
        }
        .swap-out { opacity: 0; transform: translateY(6px); }
        .partner-skel::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(52,225,184,.10), transparent);
          transform: translateX(-100%); animation: shimmer 2.2s infinite;
        }
        .partner-skel-eco::after {
          background: linear-gradient(90deg, transparent, rgba(40,158,144,.18), transparent);
        }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-[#34e1b8]/10 bg-[#0c2724]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1100px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" aria-label="START Munich, home" className="flex items-center">
            <div
              className="h-[30px] w-auto [&_svg]:h-full [&_svg]:w-auto"
              dangerouslySetInnerHTML={{ __html: START_LOGO_SVG }}
            />
          </a>
          <a
            href={LUMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#34e1b8] px-6 py-3 text-sm font-black tracking-wide text-[#0c2724] shadow-[0_10px_30px_-10px_rgba(52,225,184,.55)] transition hover:-translate-y-0.5 hover:bg-[#4bf0c6] hover:shadow-[0_16px_40px_-12px_rgba(52,225,184,.7)]"
          >
            Join the waitlist!
          </a>
        </div>
      </header>

      <main id="top" className="bg-[#0c2724] text-[#E4F3EE]">
        {/* HERO */}
        <section className="relative overflow-hidden px-5 pb-11 pt-[82px] sm:px-8 lg:px-12">
          <div
            className="hero-polygon"
            dangerouslySetInnerHTML={{ __html: POLYGON_SVG }}
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-[1100px]">
            <span className="inline-flex items-center rounded-full border border-[rgba(52,225,184,.32)] bg-[rgba(52,225,184,.12)] px-[18px] py-[9px] text-[0.86rem] font-black tracking-[0.1em] text-[#34e1b8]">
              Road to START Hack 2026
            </span>
            <h1 className="mt-4 max-w-[15ch] text-[clamp(2.7rem,7vw,5rem)] font-black leading-none tracking-tight">
              From <span className="text-[#34e1b8]">hello world</span> to{' '}
              <span className="text-[#E4F3EE]">hello users</span>.
            </h1>
            <p className="mt-[22px] max-w-[46ch] text-lg font-medium leading-relaxed text-[#8FB6AD]">
              Munich&apos;s most entrepreneurial hackathon is back. 250 builders, one weekend, real
              challenges from real startups,{' '}
              <em className="text-[#E4F3EE]">21–22 November 2026 at the TUM Audimax.</em>
            </p>

            <RotatingJourney />

            <div className="mt-[34px] flex flex-wrap items-center gap-5">
              <a
                href={LUMA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#34e1b8] px-6 py-3 text-sm font-black tracking-wide text-[#0c2724] shadow-[0_10px_30px_-10px_rgba(52,225,184,.55)] transition hover:-translate-y-0.5 hover:bg-[#4bf0c6] hover:shadow-[0_16px_40px_-12px_rgba(52,225,184,.7)]"
              >
                Join the waitlist <span aria-hidden="true">&rarr;</span>
              </a>
              <p className="max-w-[34ch] text-sm font-medium text-[#5E8880]">
                250 spots. The waitlist opens on Luma. Join now to be first in line.
              </p>
            </div>
          </div>

          {/* FACTS */}
          <div className="mx-auto mt-14 max-w-[1100px] border-y border-[#34e1b8]/10">
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { k: 'When', v: '21–22 Nov', sub: '2026 · Sat–Sun' },
                { k: 'Where', v: 'Audimax', sub: 'TU München' },
                { k: 'Who', v: '250 builders', sub: 'all fields welcome' },
                { k: 'Format', v: '24h build', sub: 'demo on stage' },
              ].map((f, i) => (
                <div
                  key={f.k}
                  className={`py-7 pl-5 pr-4 sm:px-6 sm:py-7 ${
                    i < 3 ? 'border-b border-[#34e1b8]/10 sm:border-b-0 sm:border-r' : ''
                  }`}
                >
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#5E8880]">
                    {f.k}
                  </p>
                  <p className="mt-2.5 text-xl font-black leading-tight text-[#34e1b8]">
                    {f.v}
                    <small className="mt-0.5 block text-sm font-medium text-[#8FB6AD]">
                      {f.sub}
                    </small>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-[62ch]">
              <span className="text-[0.74rem] font-bold uppercase tracking-[0.24em] text-[#34e1b8]">
                Road to START Hack 2026
              </span>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-black leading-tight tracking-tight text-[#34e1b8]">
                Turn a simple idea into something people can click.
              </h2>
              <p className="mt-[18px] max-w-[52ch] text-lg font-medium leading-relaxed text-[#8FB6AD]">
                Road to START Hack brings 250 innovators from all fields and backgrounds together to
                solve real-world challenges in just 24 hours. We help you keep the scope tight,
                mentors jump in when you are stuck, and the room stays friendly and focused. You
                prototype, test with people nearby, and polish just enough to show it. No experience
                required. Bring your laptop and curiosity. By the end you can say hello users for
                real, with a demo you are proud to share and a path to keep going.
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1100px] gap-4 sm:grid-cols-3">
            {[
              { big: '24h', lbl: 'to build' },
              { big: '250', lbl: 'builders' },
              { big: '1', lbl: 'demo you&apos;re proud of' },
            ].map((s) => (
              <div
                key={s.lbl}
                className="rounded border border-[rgba(52,225,184,.16)] bg-[#144146] p-8 text-center shadow-2xl shadow-black/20"
              >
                <div className="text-[clamp(2.6rem,6.5vw,4rem)] font-black leading-none tracking-tight text-[#34e1b8]">
                  {s.big}
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#8FB6AD]">
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PARTNERS */}
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="text-[0.74rem] font-bold uppercase tracking-[0.24em] text-[#34e1b8]">
                  Challenge partners
                </span>
                <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-black leading-tight tracking-tight text-[#34e1b8]">
                  Who you&apos;ll build with
                </h2>
              </div>
              <p className="text-xs font-bold text-[#5E8880]">
                signing partners
                <span
                  className="text-[#34e1b8]"
                  style={{ animation: 'blink 1.2s steps(1) infinite' }}
                >
                  _
                </span>
              </p>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded border border-[#34e1b8]/15 bg-[#34e1b8]/15 sm:grid-cols-3 md:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="partner-skel relative flex min-h-[92px] items-center justify-center overflow-hidden bg-[#144146] p-7 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#5E8880]"
                >
                  coming soon
                </div>
              ))}
            </div>
            <p className="mt-7 max-w-[56ch] text-base font-medium text-[#8FB6AD]">
              We&apos;re locking in our 2026 challenge partners now, real startups with real
              problems to solve. <span className="font-bold text-[#34e1b8]">Join the waitlist</span>{' '}
              to hear who first.
            </p>
          </div>
        </section>

        {/* ECOSYSTEM PARTNERS */}
        <section className="px-5 pb-20 pt-3 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-black leading-tight tracking-tight text-[#289e90]">
              Ecosystem Partners
            </h2>
            <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded border border-[rgba(40,158,144,.4)] bg-[rgba(40,158,144,.4)] md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="partner-skel partner-skel-eco relative flex min-h-[92px] items-center justify-center overflow-hidden bg-[#1b5a68] p-7 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#5E8880]"
                >
                  coming soon
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="text-[0.74rem] font-bold uppercase tracking-[0.24em] text-[#34e1b8]">
                Good to know
              </span>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-black leading-tight tracking-tight text-[#34e1b8]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mt-10 divide-y divide-[#34e1b8]/15 rounded border border-[#34e1b8]/15">
              {[
                {
                  q: "What's the waitlist?",
                  a: 'Applications for the hackathon open on Luma in October 2026, with limited spots. Join the waitlist now and we\u2019ll get you in first when it goes live, before the wider announcement.',
                },
                {
                  q: 'When and where will the hackathon take place?',
                  a: '21\u201322 November 2026 (Saturday\u2013Sunday), in the Audimax at TU M\u00fcnchen, Arcisstra\u00dfe 21, 80333 Munich. The full schedule and the challenges drop closer to the day.',
                },
                {
                  q: 'Who can join?',
                  a: 'Any student with curiosity and a spark of creativity! Whether you\u2019re studying engineering, computer science, physics, math, business, or management, if you love solving real-world problems, this hackathon is for you.',
                },
                {
                  q: 'What does it cost, and what do I bring?',
                  a: 'Taking part is free. Bring a laptop, a charger and a good mood. We\u2019ve got the food, drinks and the space. A blanket helps if you plan to build through the night.',
                },
                {
                  q: 'Do I need to have a team in advance?',
                  a: 'Nope! You can apply solo. We\u2019ll have a matchmaking session at the start of the event, so there\u2019s plenty of time to find your dream team.',
                },
                {
                  q: 'Can I participate alone?',
                  a: 'You can apply alone, but you\u2019ll need a team to compete. Don\u2019t worry, we\u2019ll help you find one!',
                },
                {
                  q: 'Still have questions?',
                  a: 'Talk to us any time: s.nalliboyana@startmunich.de or s.park@startmunich.de.',
                },
              ].map((faq, i) => (
                <details key={i} className="group" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start gap-5 py-6 text-left">
                    <span className="mt-1 text-xl font-bold text-[#34e1b8] transition group-open:rotate-45">
                      +
                    </span>
                    <span className="text-lg font-black leading-tight text-[#E4F3EE]">{faq.q}</span>
                  </summary>
                  <div className="pb-6 pl-10">
                    {faq.a.includes('@') ? (
                      <p className="max-w-[66ch] text-base font-medium leading-relaxed text-[#8FB6AD]">
                        Talk to us any time:{' '}
                        <a href="mailto:s.nalliboyana@startmunich.de" className="text-[#34e1b8]">
                          s.nalliboyana@startmunich.de
                        </a>{' '}
                        or{' '}
                        <a href="mailto:s.park@startmunich.de" className="text-[#34e1b8]">
                          s.park@startmunich.de
                        </a>
                        .
                      </p>
                    ) : (
                      <p className="max-w-[66ch] text-base font-medium leading-relaxed text-[#8FB6AD]">
                        {faq.a}
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 pb-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px] rounded-3xl border border-[rgba(52,225,184,.16)] bg-gradient-to-br from-[#1b5a68] to-[#144146] px-11 py-16 text-center shadow-2xl shadow-black/20">
            <span className="text-[0.74rem] font-bold uppercase tracking-[0.24em] text-[#34e1b8]">
              Limited to 250 spots
            </span>
            <div
              className="mt-2 inline-flex flex-wrap items-baseline justify-center gap-[0.3em] text-lg font-bold text-[#8FB6AD]"
              aria-hidden="true"
            >
              <span>from</span>
              <span className="text-[#E4F3EE]">blank page</span>
              <span className="relative inline-block h-[0.14em] w-[2.4em] -translate-y-[0.2em] rounded bg-[#34e1b8]" />
              <span>to</span>
              <span className="text-[#34e1b8]">first users</span>
            </div>
            <h2 className="mt-1.5 text-[clamp(2rem,4.4vw,3rem)] font-black leading-tight tracking-tight text-[#34e1b8]">
              Save your spot before it&apos;s gone
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-lg font-medium text-[#8FB6AD]">
              The waitlist gets first pick. Join now, and we&apos;ll bring you in the moment
              applications open.
            </p>
            <a
              href={LUMA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#34e1b8] px-6 py-3 text-sm font-black tracking-wide text-[#0c2724] shadow-[0_10px_30px_-10px_rgba(52,225,184,.55)] transition hover:-translate-y-0.5 hover:bg-[#4bf0c6] hover:shadow-[0_16px_40px_-12px_rgba(52,225,184,.7)]"
            >
              Join the waitlist <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(52,225,184,.16)] bg-[#0c2724] px-5 py-11 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-6">
          <p className="text-sm font-bold text-[#5E8880]">
            &copy; 2026 START Munich &middot; Road to START Hack
          </p>
          <nav className="flex flex-wrap gap-6">
            <a
              href="https://www.startmunich.de/legal-notice"
              target="_blank"
              rel="noopener"
              className="text-sm font-bold text-[#8FB6AD] no-underline transition hover:text-[#34e1b8]"
            >
              Legal Notice
            </a>
            <a
              href="https://www.startmunich.de/privacy-policy"
              target="_blank"
              rel="noopener"
              className="text-sm font-bold text-[#8FB6AD] no-underline transition hover:text-[#34e1b8]"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.startmunich.de"
              target="_blank"
              rel="noopener"
              className="text-sm font-bold text-[#8FB6AD] no-underline transition hover:text-[#34e1b8]"
            >
              START Munich
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
