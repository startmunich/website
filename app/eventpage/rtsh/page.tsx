import { readFileSync } from 'fs';
import type { Metadata } from 'next';
import { join } from 'path';

import BrevoForm from './BrevoForm';
import RotatingJourney from './RotatingJourney';

const START_HACK_LOGO = readFileSync(
  join(process.cwd(), 'public', 'eventpage', 'rtsh', 'logo-white.svg'),
  'utf-8',
);

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
    images: [
      {
        url: '/eventpage/rtsh/og-image.jpg',
        width: 1200,
        height: 800,
        alt: 'Road to START Hack 2026 — 24 hours from idea to demo',
      },
    ],
  },
};

export default function RtshPage() {
  return (
    <>
      <style>{`
        :root {
          --maledives: #34e1b8;
          --ivy: #289e90;
          --teekay: #1b5a68;
          --binary: #144146;
          --batwing: #0c2724;
          --white: #ffffff;
          --ink: #e4f3ee;
          --muted: #8fb6ad;
          --faint: #5e8880;
        }
        html { scroll-behavior: smooth; }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 3rem;
          border-radius: 9999px;
          padding: 0.72rem 1.6rem;
          background: var(--maledives);
          color: var(--batwing);
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          box-shadow: 0 10px 30px -10px rgba(52, 225, 184, 0.5);
          transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          background: #4bf0c6;
          box-shadow: 0 16px 40px -12px rgba(52, 225, 184, 0.7);
        }

        .chip {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          border: 1px solid rgba(52, 225, 184, 0.32);
          background: rgba(52, 225, 184, 0.12);
          padding: 0.5rem 1.1rem;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--maledives);
        }

        .kicker {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--maledives);
        }

        .h2 {
          margin-top: 0.8rem;
          font-size: clamp(1.9rem, 4vw, 2.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--maledives);
        }

        .jgap {
          position: relative;
          display: inline-block;
          width: 1.7em;
          height: 0.14em;
          top: -0.16em;
          background: rgba(52, 225, 184, 0.32);
          border-radius: 3px;
          overflow: hidden;
          flex: 0 0 auto;
        }
        .jgap::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--maledives);
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
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(52, 225, 184, 0.1), transparent);
          transform: translateX(-100%);
          animation: shimmer 2.2s infinite;
        }
        .partner-skel-eco::after {
          background: linear-gradient(90deg, transparent, rgba(40, 158, 144, 0.18), transparent);
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
      <header className="border-[var(--maledives)]/10 bg-[var(--batwing)]/70 sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1100px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" aria-label="START Hack, home" className="flex items-center">
            <div
              className="h-[26px] w-auto [&_svg]:h-full [&_svg]:w-auto"
              dangerouslySetInnerHTML={{ __html: START_HACK_LOGO }}
            />
          </a>
          <a href="#waitlist" className="btn-primary">
            Join the waitlist
          </a>
        </div>
      </header>

      <main id="top" className="bg-[var(--batwing)] text-[var(--ink)]">
        {/* HERO */}
        <section className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden px-5 pb-10 pt-32 sm:px-8 lg:px-12">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/eventpage/rtsh/green-video.mp4"
            poster="/eventpage/rtsh/og-image.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="from-[var(--batwing)]/85 via-[var(--batwing)]/50 absolute inset-0 bg-gradient-to-b to-[var(--batwing)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1100px]">
            <span className="chip">Road to START Hack 2026</span>
            <h1 className="mt-5 max-w-[15ch] text-[clamp(2.7rem,7vw,5rem)] font-black leading-none tracking-tight">
              From&nbsp;<span className="text-[var(--maledives)]">hello world</span> to{' '}
              <span className="text-[var(--ink)]">hello users</span>.
            </h1>
            <p className="mt-[22px] max-w-[46ch] text-lg font-medium leading-relaxed text-[var(--muted)]">
              Munich&apos;s most entrepreneurial hackathon is back. 250 builders, one weekend, real
              challenges from real startups,{' '}
              <em className="text-[var(--ink)]">21–22 November 2026 at the TUM Audimax.</em>
            </p>

            <RotatingJourney />

            <div className="mt-[34px] flex flex-wrap items-center gap-5">
              <a href="#waitlist" className="btn-primary">
                Join the waitlist <span aria-hidden="true">&rarr;</span>
              </a>
              <p className="max-w-[34ch] text-sm font-medium text-[var(--faint)]">
                250 spots. Fill in your details below to be first in line.
              </p>
            </div>
          </div>

          {/* FACTS */}
          <div className="border-[var(--maledives)]/10 relative z-10 mx-auto mt-16 w-full max-w-[1100px] border-t">
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
                    i < 3 ? 'border-[var(--maledives)]/10 border-b sm:border-b-0 sm:border-r' : ''
                  }`}
                >
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--faint)]">
                    {f.k}
                  </p>
                  <p className="mt-2.5 text-xl font-black leading-tight text-[var(--maledives)]">
                    {f.v}
                    <small className="mt-0.5 block text-sm font-medium text-[var(--muted)]">
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
              <span className="kicker">Road to START Hack 2026</span>
              <h2 className="h2">Turn a simple idea into something people can click.</h2>
              <p className="mt-[18px] max-w-[52ch] text-lg font-medium leading-relaxed text-[var(--muted)]">
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
        <section className="px-5 pb-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1100px] gap-4 sm:grid-cols-3">
            {[
              { big: '24h', lbl: 'to build' },
              { big: '250', lbl: 'builders' },
              { big: '1', lbl: 'demo you\u2019re proud of' },
            ].map((s) => (
              <div
                key={s.lbl}
                className="border-[var(--maledives)]/15 rounded-2xl border bg-[var(--binary)] p-8 text-center shadow-2xl shadow-black/20"
              >
                <div className="text-[clamp(2.6rem,6.5vw,4rem)] font-black leading-none tracking-tight text-[var(--maledives)]">
                  {s.big}
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CHALLENGE PARTNERS */}
        <section className="px-5 pb-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="kicker">Challenge partners</span>
                <h2 className="h2">Who you&apos;ll build with</h2>
              </div>
              <p className="text-xs font-bold text-[var(--faint)]">
                signing partners
                <span
                  className="text-[var(--maledives)]"
                  style={{ animation: 'blink 1.2s steps(1) infinite' }}
                >
                  _
                </span>
              </p>
            </div>
            <div className="border-[var(--maledives)]/15 bg-[var(--maledives)]/15 mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-3 md:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="partner-skel relative flex min-h-[92px] items-center justify-center overflow-hidden bg-[var(--binary)] p-7 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--faint)]"
                >
                  coming soon
                </div>
              ))}
            </div>
            <p className="mt-7 max-w-[56ch] text-base font-medium text-[var(--muted)]">
              We&apos;re locking in our 2026 challenge partners now, real startups with real
              problems to solve.{' '}
              <span className="font-bold text-[var(--maledives)]">Join the waitlist</span> to hear
              who first.
            </p>
          </div>
        </section>

        {/* ECOSYSTEM PARTNERS */}
        <section className="px-5 pb-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-black leading-tight tracking-tight text-[var(--ivy)]">
              Ecosystem Partners
            </h2>
            <div className="border-[var(--ivy)]/40 bg-[var(--ivy)]/40 mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="partner-skel partner-skel-eco relative flex min-h-[92px] items-center justify-center overflow-hidden bg-[var(--teekay)] p-7 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--faint)]"
                >
                  coming soon
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 pb-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="kicker">Good to know</span>
              <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-black leading-tight tracking-tight text-[var(--maledives)]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="divide-[var(--maledives)]/15 border-[var(--maledives)]/15 mt-10 divide-y rounded-2xl border">
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
                  <summary className="flex cursor-pointer list-none items-start gap-5 px-7 py-6 text-left">
                    <span className="mt-1 text-xl font-bold text-[var(--maledives)] transition group-open:rotate-45">
                      +
                    </span>
                    <span className="text-lg font-black leading-tight text-[var(--ink)]">
                      {faq.q}
                    </span>
                  </summary>
                  <div className="pb-6 pl-[4.6rem] pr-7">
                    {faq.a.includes('@') ? (
                      <p className="max-w-[66ch] text-base font-medium leading-relaxed text-[var(--muted)]">
                        Talk to us any time:{' '}
                        <a
                          href="mailto:s.nalliboyana@startmunich.de"
                          className="text-[var(--maledives)]"
                        >
                          s.nalliboyana@startmunich.de
                        </a>{' '}
                        or{' '}
                        <a href="mailto:s.park@startmunich.de" className="text-[var(--maledives)]">
                          s.park@startmunich.de
                        </a>
                        .
                      </p>
                    ) : (
                      <p className="max-w-[66ch] text-base font-medium leading-relaxed text-[var(--muted)]">
                        {faq.a}
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* WAITLIST FORM */}
        <section id="waitlist" className="scroll-mt-24 px-5 pb-24 sm:px-8 lg:px-12">
          <div className="border-[var(--maledives)]/16 mx-auto max-w-[1100px] rounded-3xl border bg-gradient-to-br from-[var(--teekay)] to-[var(--binary)] px-11 py-16 text-center shadow-2xl shadow-black/20">
            <span className="kicker">Limited to 250 spots</span>
            <div
              className="mt-2 inline-flex flex-wrap items-baseline justify-center gap-[0.3em] text-lg font-bold text-[var(--muted)]"
              aria-hidden="true"
            >
              <span>from</span>
              <span className="text-[var(--ink)]">blank page</span>
              <span className="relative inline-block h-[0.14em] w-[2.4em] -translate-y-[0.2em] rounded bg-[var(--maledives)]" />
              <span>to</span>
              <span className="text-[var(--maledives)]">first users</span>
            </div>
            <h2 className="mt-1.5 text-[clamp(2rem,4.4vw,3rem)] font-black leading-tight tracking-tight text-[var(--maledives)]">
              Save your spot before it&apos;s gone
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-lg font-medium text-[var(--muted)]">
              The waitlist gets first pick. Register now, and we&apos;ll bring you in the moment
              applications open.
            </p>
            <div className="mt-10 flex justify-center">
              <BrevoForm />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-[var(--maledives)]/16 border-t bg-[var(--batwing)] px-5 py-11 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-6">
          <p className="text-sm font-bold text-[var(--faint)]">
            &copy; 2026 START Munich &middot; Road to START Hack
          </p>
          <nav className="flex flex-wrap gap-6">
            <a
              href="https://www.startmunich.de/legal-notice"
              target="_blank"
              rel="noopener"
              className="text-sm font-bold text-[var(--muted)] no-underline transition hover:text-[var(--maledives)]"
            >
              Legal Notice
            </a>
            <a
              href="https://www.startmunich.de/privacy-policy"
              target="_blank"
              rel="noopener"
              className="text-sm font-bold text-[var(--muted)] no-underline transition hover:text-[var(--maledives)]"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.startmunich.de"
              target="_blank"
              rel="noopener"
              className="text-sm font-bold text-[var(--muted)] no-underline transition hover:text-[var(--maledives)]"
            >
              START Munich
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
