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
        :root {
          --batwing: #0c2724;
          --binary: #144146;
          --teekay: #1b5a68;
          --ivy: #289e90;
          --mint: #34e1b8;
          --text: #E4F3EE;
          --muted: #8FB6AD;
          --faint: #5E8880;
          --line: rgba(52,225,184,.16);
          --line-strong: rgba(52,225,184,.32);
          --font: "Figtree", system-ui, -apple-system, sans-serif;
          --maxw: 1100px;
        }
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;background:var(--bg);color:var(--text);font-family:var(--font);line-height:1.6;font-weight:400;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        body::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(55% 40% at 82% 0%,rgba(40,158,144,.20),transparent 62%),radial-gradient(50% 42% at 6% 2%,rgba(27,90,104,.28),transparent 60%)}
        .wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px;position:relative;z-index:1}
        a{color:inherit}
        ::selection{background:var(--mint);color:var(--batwing)}
        .eyebrow{font-size:.74rem;letter-spacing:.24em;text-transform:uppercase;color:var(--mint);font-weight:700}
        .hero-eyebrow{display:inline-flex;align-items:center;font-size:.86rem;letter-spacing:.1em;padding:9px 18px;border-radius:999px;background:rgba(52,225,184,.12);border:1px solid var(--line-strong)}

        .btn{display:inline-flex;align-items:center;gap:.55em;font-family:var(--font);font-weight:700;font-size:1rem;border:none;border-radius:12px;padding:15px 26px;cursor:pointer;text-decoration:none;transition:transform .14s ease,box-shadow .22s ease,background .18s ease;white-space:nowrap}
        .btn-primary{background:var(--mint);color:var(--batwing);box-shadow:0 10px 30px -10px rgba(52,225,184,.55)}
        .btn-primary:hover{transform:translateY(-2px);background:#4bf0c6;box-shadow:0 16px 40px -12px rgba(52,225,184,.7)}
        .btn .arrow{font-weight:700}
        :focus-visible{outline:2px solid var(--mint);outline-offset:3px;border-radius:8px}

        header.nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);background:rgba(12,39,36,.72);border-bottom:1px solid var(--line)}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;height:70px}
        .logo{display:flex;align-items:center}
        .logo svg{height:30px;width:auto;display:block}
        .nav .btn{padding:11px 20px;font-size:.92rem}

        .hero{padding:82px 0 44px;position:relative;overflow:hidden}
        .hero-polygon{position:absolute;top:-160px;right:-200px;width:min(58vw,660px);height:auto;opacity:.5;z-index:0;pointer-events:none}
        @media (max-width:820px){.hero-polygon{width:80vw;top:-100px;right:-220px;opacity:.35}}
        h1{font-family:var(--font);font-weight:800;font-size:clamp(2.7rem,7vw,5rem);line-height:1.0;letter-spacing:-.025em;margin:16px 0 0;max-width:15ch}
        h1 .hw{color:var(--mint)}
        h1 .hu{color:var(--text)}
        .lede{color:var(--muted);font-size:1.12rem;max-width:46ch;margin:22px 0 0}
        .lede em{color:var(--text);font-style:italic}

        .journey{margin:34px 0 0;padding:22px 24px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,rgba(20,65,70,.5),rgba(20,65,70,.18));max-width:620px}
        .journey .jlabel{font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--faint);font-weight:700}
        .jline{margin-top:14px;font-size:clamp(1.05rem,2.6vw,1.45rem);font-weight:600;line-height:1.25;display:flex;flex-wrap:wrap;align-items:baseline;gap:.34em;min-height:1.3em}
        .jline .from{color:var(--muted);font-weight:500}
        .jline .to{color:var(--muted);font-weight:500}
        .jword{color:var(--text);font-weight:700;transition:opacity .4s ease,transform .4s ease}
        .jword.tocol{color:var(--mint)}
        .jgap{position:relative;display:inline-block;width:1.7em;height:.14em;top:-.16em;background:var(--line-strong);border-radius:3px;overflow:hidden;flex:0 0 auto}
        .jgap::after{content:"";position:absolute;inset:0;background:var(--mint);transform:translateX(-101%);animation:trace 3s ease-in-out infinite}
        @keyframes trace{0%{transform:translateX(-101%)}45%{transform:translateX(0)}75%{transform:translateX(0)}100%{transform:translateX(101%)}}
        .swap-out{opacity:0;transform:translateY(6px)}

        .cta-row{margin-top:34px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}
        .cta-note{color:var(--faint);font-size:.9rem;max-width:34ch}

        .facts{border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-top:56px}
        .facts-grid{display:grid;grid-template-columns:repeat(4,1fr)}
        .fact{padding:28px 22px;border-right:1px solid var(--line)}
        .fact:last-child{border-right:none}
        .fact .k{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--faint);font-weight:700}
        .fact .v{font-weight:700;font-size:1.32rem;margin-top:10px;line-height:1.15;color:var(--mint)}
        .fact .v small{display:block;font-size:.84rem;color:var(--muted);font-weight:500;margin-top:3px}

        section.block{padding-top:80px;padding-bottom:80px}
        .sec-head{max-width:62ch}
        h2{font-family:var(--font);font-weight:800;font-size:clamp(1.9rem,4vw,2.8rem);letter-spacing:-.02em;line-height:1.06;margin:12px 0 0;color:var(--mint)}
        .sec-lede{color:var(--muted);margin-top:18px;font-size:1.08rem;max-width:52ch}

        .why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;margin-top:46px}
        .card{background:var(--binary);border:1px solid var(--line);border-radius:16px;padding:26px}
        .card .n{color:var(--mint);font-weight:800;font-size:.82rem;letter-spacing:.1em}
        .card h3{font-weight:700;font-size:1.16rem;margin:16px 0 8px;color:var(--text)}
        .card p{color:var(--muted);font-size:.96rem;margin:0}

        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .stat{text-align:center;padding:32px 26px;background:var(--binary);border:1px solid var(--line);border-radius:16px}
        .stat .big{font-weight:800;font-size:clamp(2.6rem,6.5vw,4rem);line-height:1;letter-spacing:-.03em;color:var(--mint)}
        .stat .lbl{color:var(--muted);font-size:.82rem;letter-spacing:.1em;text-transform:uppercase;margin-top:12px;font-weight:600}

        .partners-head{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .load-tag{color:var(--faint);font-size:.82rem;font-weight:600}
        .load-tag .blink{color:var(--mint);animation:blink 1.2s steps(1) infinite}
        @keyframes blink{50%{opacity:0}}
        .plogos{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:36px}
        .skel{height:92px;border-radius:14px;border:1px dashed var(--line-strong);background:var(--binary);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:.72rem;color:var(--faint);letter-spacing:.08em;font-weight:600;text-transform:uppercase}
        .skel::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(52,225,184,.10),transparent);transform:translateX(-100%);animation:shimmer 2.2s infinite}
        @keyframes shimmer{100%{transform:translateX(100%)}}
        .partners-note{color:var(--muted);font-size:1rem;margin-top:28px;max-width:56ch}
        .partners-note b{color:var(--mint);font-weight:700}

        #about{padding-bottom:28px}
        #stats{padding-top:28px}
        #ecosystem-partners{padding-top:12px}
        #ecosystem-partners h2{color:var(--ivy)}
        .plogos-4{grid-template-columns:repeat(4,1fr)}
        .skel-eco{background:var(--teekay);border-color:rgba(40,158,144,.4)}
        .skel-eco::after{background:linear-gradient(90deg,transparent,rgba(40,158,144,.18),transparent)}

        .faq{max-width:780px;margin-top:42px}
        details{border-bottom:1px solid var(--line)}
        summary{list-style:none;cursor:pointer;padding:24px 0;font-weight:700;font-size:1.1rem;color:var(--text);display:flex;justify-content:space-between;align-items:center;gap:20px}
        summary::-webkit-details-marker{display:none}
        summary .ic{color:var(--mint);font-weight:700;font-size:1.4rem;line-height:1;transition:transform .2s ease;flex:0 0 auto}
        details[open] summary .ic{transform:rotate(45deg)}
        details p{color:var(--muted);margin:0 0 24px;font-size:1rem;max-width:66ch}
        details a{color:var(--mint)}

        .final{background:linear-gradient(155deg,var(--teekay),var(--binary));border:1px solid var(--line);border-radius:24px;padding:60px 44px;text-align:center}
        .final .fline{font-weight:700;font-size:clamp(1.2rem,3vw,1.7rem);color:var(--muted);margin:0 0 8px;display:inline-flex;flex-wrap:wrap;gap:.3em;align-items:baseline;justify-content:center}
        .final .fline .fw{color:var(--text)}
        .final .fline .fg{position:relative;display:inline-block;width:2.4em;height:.14em;top:-.2em;background:var(--mint);border-radius:3px}
        .final .fline .fu{color:var(--mint)}
        .final h2{font-size:clamp(2rem,4.4vw,3rem);margin-top:6px}
        .final .lede{color:var(--muted);max-width:44ch;margin:16px auto 32px}
        .final .btn{margin:0 auto}

        footer{border-top:1px solid var(--line);margin-top:84px;padding:44px 0}
        .foot-inner{display:flex;justify-content:space-between;flex-wrap:wrap;gap:22px;align-items:center}
        .foot-inner .cr{color:var(--faint);font-size:.86rem}
        .foot-links{display:flex;gap:24px;flex-wrap:wrap}
        .foot-links a{color:var(--muted);text-decoration:none;font-size:.88rem}
        .foot-links a:hover{color:var(--mint)}

        @media (max-width:820px){
          .facts-grid{grid-template-columns:repeat(2,1fr)}
          .fact:nth-child(2){border-right:none}
          .fact:nth-child(1),.fact:nth-child(2){border-bottom:1px solid var(--line)}
          .stats{grid-template-columns:1fr;gap:34px}
          .plogos{grid-template-columns:repeat(2,1fr)}
        }
        @media (max-width:520px){
          .wrap{padding:0 28px}
          .final{padding:44px 24px}
          .cta-row{flex-direction:column;align-items:flex-start}
        }
        @media (prefers-reduced-motion:reduce){
          *{animation:none!important;scroll-behavior:auto!important;transition:none!important}
        }
      `}</style>

      <header className="nav">
        <div className="wrap nav-inner">
          <a className="logo" href="#top" aria-label="START Munich, home">
            <div dangerouslySetInnerHTML={{ __html: START_LOGO_SVG }} />
          </a>
          <a className="btn btn-primary" href={LUMA_URL} target="_blank" rel="noopener noreferrer">
            Join the waitlist
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div
            className="hero-polygon"
            dangerouslySetInnerHTML={{ __html: POLYGON_SVG }}
            aria-hidden="true"
          />
          <div className="wrap">
            <span className="eyebrow hero-eyebrow">Road to START Hack 2026</span>
            <h1>
              From <span className="hw">hello world</span> to{' '}
              <span className="hu">hello users</span>.
            </h1>
            <p className="lede">
              Munich&apos;s most entrepreneurial hackathon is back. 250 builders, one weekend, real
              challenges from real startups, <em>21–22 November 2026 at the TUM Audimax.</em>
            </p>

            <RotatingJourney />

            <div className="cta-row">
              <a
                className="btn btn-primary"
                href={LUMA_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join the waitlist <span className="arrow">&rarr;</span>
              </a>
              <p className="cta-note">
                250 spots. The waitlist opens on Luma. Join now to be first in line.
              </p>
            </div>
          </div>

          <div className="facts">
            <div className="wrap facts-grid">
              <div className="fact">
                <div className="k">When</div>
                <div className="v">
                  21–22 Nov<small>2026 · Sat–Sun</small>
                </div>
              </div>
              <div className="fact">
                <div className="k">Where</div>
                <div className="v">
                  Audimax<small>TU München</small>
                </div>
              </div>
              <div className="fact">
                <div className="k">Who</div>
                <div className="v">
                  250 builders<small>all fields welcome</small>
                </div>
              </div>
              <div className="fact">
                <div className="k">Format</div>
                <div className="v">
                  24h build<small>demo on stage</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap block" id="about">
          <div className="sec-head">
            <span className="eyebrow">Road to START Hack 2026</span>
            <h2>Turn a simple idea into something people can click.</h2>
            <p className="sec-lede">
              Road to START Hack brings 250 innovators from all fields and backgrounds together to
              solve real-world challenges in just 24 hours. We help you keep the scope tight,
              mentors jump in when you are stuck, and the room stays friendly and focused. You
              prototype, test with people nearby, and polish just enough to show it. No experience
              required. Bring your laptop and curiosity. By the end you can say hello users for
              real, with a demo you are proud to share and a path to keep going.
            </p>
          </div>
        </section>

        <section className="wrap block" id="stats">
          <div className="stats">
            <div className="stat">
              <div className="big">24h</div>
              <div className="lbl">to build</div>
            </div>
            <div className="stat">
              <div className="big">250</div>
              <div className="lbl">builders</div>
            </div>
            <div className="stat">
              <div className="big">1</div>
              <div className="lbl">demo you&apos;re proud of</div>
            </div>
          </div>
        </section>

        <section className="wrap block" id="partners">
          <div className="partners-head">
            <div className="sec-head">
              <span className="eyebrow">Challenge partners</span>
              <h2>Who you&apos;ll build with</h2>
            </div>
            <div className="load-tag">
              signing partners<span className="blink">_</span>
            </div>
          </div>
          <div className="plogos">
            <div className="skel">coming soon</div>
            <div className="skel">coming soon</div>
            <div className="skel">coming soon</div>
            <div className="skel">coming soon</div>
            <div className="skel">coming soon</div>
          </div>
          <p className="partners-note">
            We&apos;re locking in our 2026 challenge partners now, real startups with real problems
            to solve. <b>Join the waitlist</b> to hear who first.
          </p>
        </section>

        <section className="wrap block" id="ecosystem-partners">
          <div className="sec-head">
            <h2>Ecosystem Partners</h2>
          </div>
          <div className="plogos plogos-4">
            <div className="skel skel-eco">coming soon</div>
            <div className="skel skel-eco">coming soon</div>
            <div className="skel skel-eco">coming soon</div>
            <div className="skel skel-eco">coming soon</div>
          </div>
        </section>

        <section className="wrap block" id="faq">
          <div className="sec-head">
            <span className="eyebrow">Good to know</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq">
            <details open>
              <summary>
                What&apos;s the waitlist? <span className="ic">+</span>
              </summary>
              <p>
                Applications for the hackathon open on Luma in October 2026, with limited spots.
                Join the waitlist now and we&apos;ll get you in first when it goes live, before the
                wider announcement.
              </p>
            </details>
            <details>
              <summary>
                When and where will the hackathon take place? <span className="ic">+</span>
              </summary>
              <p>
                21–22 November 2026 (Saturday–Sunday), in the Audimax at TU München, Arcisstraße 21,
                80333 Munich. The full schedule and the challenges drop closer to the day.
              </p>
            </details>
            <details>
              <summary>
                Who can join? <span className="ic">+</span>
              </summary>
              <p>
                Any student with curiosity and a spark of creativity! Whether you&apos;re studying
                engineering, computer science, physics, math, business, or management, if you love
                solving real-world problems, this hackathon is for you.
              </p>
            </details>
            <details>
              <summary>
                What does it cost, and what do I bring? <span className="ic">+</span>
              </summary>
              <p>
                Taking part is free. Bring a laptop, a charger and a good mood. We&apos;ve got the
                food, drinks and the space. A blanket helps if you plan to build through the night.
              </p>
            </details>
            <details>
              <summary>
                Do I need to have a team in advance? <span className="ic">+</span>
              </summary>
              <p>
                Nope! You can apply solo. We&apos;ll have a matchmaking session at the start of the
                event, so there&apos;s plenty of time to find your dream team.
              </p>
            </details>
            <details>
              <summary>
                Can I participate alone? <span className="ic">+</span>
              </summary>
              <p>
                You can apply alone, but you&apos;ll need a team to compete. Don&apos;t worry,
                we&apos;ll help you find one!
              </p>
            </details>
            <details>
              <summary>
                Still have questions? <span className="ic">+</span>
              </summary>
              <p>
                Talk to us any time:{' '}
                <a href="mailto:s.nalliboyana@startmunich.de">s.nalliboyana@startmunich.de</a> or{' '}
                <a href="mailto:s.park@startmunich.de">s.park@startmunich.de</a>.
              </p>
            </details>
          </div>
        </section>

        <section className="wrap">
          <div className="final">
            <span className="eyebrow">Limited to 250 spots</span>
            <div className="fline" aria-hidden="true">
              <span>from</span> <span className="fw">blank page</span> <span className="fg" />{' '}
              <span>to</span> <span className="fu">first users</span>
            </div>
            <h2>Save your spot before it&apos;s gone</h2>
            <p className="lede">
              The waitlist gets first pick. Join now, and we&apos;ll bring you in the moment
              applications open.
            </p>
            <a
              className="btn btn-primary"
              href={LUMA_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the waitlist <span className="arrow">&rarr;</span>
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot-inner">
          <div className="cr">&copy; 2026 START Munich · Road to START Hack</div>
          <nav className="foot-links">
            <a href="https://www.startmunich.de/legal-notice" target="_blank" rel="noopener">
              Legal Notice
            </a>
            <a href="https://www.startmunich.de/privacy-policy" target="_blank" rel="noopener">
              Privacy Policy
            </a>
            <a href="https://www.startmunich.de" target="_blank" rel="noopener">
              START Munich
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
