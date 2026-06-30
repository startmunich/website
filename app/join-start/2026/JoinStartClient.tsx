'use client';

import Image from 'next/image';
import Script from 'next/script';
import posthog from 'posthog-js';
import { useEffect, useRef, useState } from 'react';

import { ScrollIndicator } from '@/components/EventComponents';
import Hero from '@/components/Hero';
import HeroCard from '@/components/HeroCard';
import UpcomingEventTile from '@/components/UpcomingEventTile';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      reset: (widgetIdOrContainer?: string | HTMLElement) => void;
    };
  }
}

const TARGET_DATE = new Date('2026-04-26T23:59:59+02:00').getTime();
const CLOSE_DATE = new Date('2026-04-27T00:00:00+02:00').getTime();

function pad(n: number) {
  return String(n).padStart(2, '0');
}

const applyEvents = [
  {
    id: 'yc-stories',
    name: 'YC Stories',
    description:
      'Bringing the San Francisco and Y Combinator mindset to Munich through real stories from people who have built inside it.',
    month: 'Wednesday, 15th April 2026\n18:30',
    image: '/join-start/yc-stories.jpeg',
    category: 'Vorhölzer Rooftop',
    ctaHref: 'https://luma.com/zk3rcyn1',
    ctaLabel: 'Register now',
  },
  {
    id: 'sunset-run',
    name: 'START & Friends Run Club – Sunset Run',
    description:
      'Join us for an easy sunset run, meet the team, and chat about what START Munich is like beyond the application.',
    month: 'Thursday, 16th April 2026\n18:30',
    image: '/join-start/sunset-run.jpeg',
    category: 'START & Friends',
    ctaHref: 'https://luma.com/omtnj23y',
    ctaLabel: 'Register now',
  },
  {
    id: 'fes',
    name: 'Female Entrepreneurship Summit',
    description:
      'Meet ambitious builders, hear from inspiring voices, and connect with the wider entrepreneurial community around START.',
    month: 'Saturday, 18th April 2026',
    image: '/join-start/fes.png',
    category: 'YFN x START Munich',
    ctaHref: 'https://www.youngfounders.network/fes',
    ctaLabel: 'More information',
  },
  {
    id: 'fail-tales',
    name: 'Founder Fail Tales',
    description:
      'Hear honest stories from founders, meet the START community, and get a feel for the culture we build around learning fast.',
    month: 'Tuesday, 21st April 2026',
    image: '/join-start/founder-fail-tales.jpeg',
    category: 'Vol. 5',
    ctaHref: 'https://luma.com/fp1fd6qv',
    ctaLabel: 'Register now',
  },
  {
    id: 'info-session',
    name: 'Why Start? Info Session',
    description:
      'Meet the team, ask application questions, and learn how START members build projects, friendships, and careers together.',
    month: 'Thursday, 23rd April 2026',
    image: '/join-start/info-session-2026.png',
    category: 'Info Session',
    ctaHref: 'https://luma.com/t5r7vw10',
    ctaLabel: 'Register now',
  },
  {
    id: 'showcase',
    name: 'Student Initiative Showcase',
    description:
      'Stop by our booth, meet the people behind START Munich, and get quick answers about the application and community.',
    month: 'Friday, 24th April 2026',
    image: '/join-start/student-club-fair.jpg',
    category: 'START Munich',
    ctaHref: undefined,
    ctaLabel: 'Registration opens soon',
  },
  {
    id: 'online-info',
    name: 'Online Info Event',
    description:
      'Can’t make it to Munich? Join online, meet the team remotely, and ask everything you want to know about applying.',
    month: 'Friday, 24th April 2026',
    image: '/join-start/online-info-2026.jpeg',
    category: 'Online Event',
    ctaHref: 'https://luma.com/4q4m43v3',
    ctaLabel: 'Register now',
  },
  {
    id: 'coffee-run',
    name: 'START & Friends Run Club – Coffee Run with LAP',
    description:
      'Start your Saturday with a relaxed run, coffee, and casual conversations with START members and friends of the community.',
    month: 'Saturday, 25th April 2026\n11:00',
    image: '/join-start/coffee-run-lap.png',
    category: 'START & Friends',
    ctaHref: 'https://luma.com/qb2g0cph',
    ctaLabel: 'Register now',
  },
];

interface JoinStartClientProps {
  isLive: boolean;
  isClosed: boolean;
}

export default function JoinStartClient({ isLive, isClosed }: JoinStartClientProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [closedNow, setClosedNow] = useState(isClosed);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  );
  const [waitlistMessage, setWaitlistMessage] = useState<string | null>(null);
  const eventsSliderRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (waitlistStatus === 'submitting') return;
    const formData = new FormData(e.currentTarget);
    const turnstileToken = formData.get('cf-turnstile-response');
    if (typeof turnstileToken !== 'string' || !turnstileToken) {
      setWaitlistStatus('error');
      setWaitlistMessage('Please complete the captcha challenge.');
      return;
    }
    setWaitlistStatus('submitting');
    setWaitlistMessage(null);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail, turnstileToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setWaitlistStatus('error');
        setWaitlistMessage(data?.error || 'Something went wrong. Please try again.');
        window.turnstile?.reset();
        return;
      }
      posthog.capture('waitlist_signup', { location: 'join_start_2026_closed' });
      setWaitlistStatus('success');
      setWaitlistMessage(
        data?.alreadyOnList
          ? "You're already on the list. We'll be in touch when applications reopen."
          : "You're on the list. We'll be in touch when applications reopen.",
      );
      setWaitlistEmail('');
    } catch {
      setWaitlistStatus('error');
      setWaitlistMessage('Something went wrong. Please try again.');
      window.turnstile?.reset();
    }
  };

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const diff = Math.max(0, TARGET_DATE - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
      if (Date.now() >= CLOSE_DATE) setClosedNow(true);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDrag = {
    start: (e: React.MouseEvent) => {
      const slider = eventsSliderRef.current;
      if (!slider) return;
      dragState.current = {
        isDragging: true,
        startX: e.pageX - slider.offsetLeft,
        scrollLeft: slider.scrollLeft,
      };
    },
    move: (e: React.MouseEvent) => {
      if (!dragState.current.isDragging || !eventsSliderRef.current) return;
      e.preventDefault();
      const x = e.pageX - eventsSliderRef.current.offsetLeft;
      eventsSliderRef.current.scrollLeft =
        dragState.current.scrollLeft - (x - dragState.current.startX) * 2;
    },
    end: () => {
      dragState.current.isDragging = false;
    },
  };

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  if (closedNow) {
    return (
      <div className="min-h-screen bg-brand-dark-blue text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/join-start-2026-bg.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: 'center center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-blue/95 via-brand-dark-blue/80 to-brand-dark-blue/70" />
            <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-b from-transparent to-brand-dark-blue" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              JOIN BOLD,
              <br />
              <span className="outline-text">STAY AHEAD</span>
            </h1>

            <form
              className="mt-10 flex w-full max-w-2xl flex-col gap-3"
              onSubmit={handleWaitlistSubmit}
            >
              <div className="flex w-full flex-col overflow-hidden rounded-md sm:flex-row">
                <label htmlFor="waitlist-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  disabled={waitlistStatus === 'submitting' || waitlistStatus === 'success'}
                  placeholder="Email address"
                  className="flex-1 bg-white px-5 py-3 text-sm text-brand-dark-blue placeholder:text-gray-400 focus:outline-none disabled:opacity-70 sm:text-base"
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === 'submitting' || waitlistStatus === 'success'}
                  className="bg-brand-pink px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
                >
                  {waitlistStatus === 'submitting'
                    ? 'Submitting...'
                    : waitlistStatus === 'success'
                      ? "You're on the list"
                      : '> Join the waiting list'}
                </button>
              </div>
              {TURNSTILE_SITE_KEY && (
                <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" />
              )}
            </form>
            {waitlistMessage && (
              <p
                className={`mt-3 max-w-2xl text-xs sm:text-sm ${
                  waitlistStatus === 'success' ? 'text-emerald-300' : 'text-red-300'
                }`}
                role={waitlistStatus === 'error' ? 'alert' : 'status'}
              >
                {waitlistMessage}
              </p>
            )}
            {TURNSTILE_SITE_KEY && (
              <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="afterInteractive"
                async
                defer
              />
            )}

            <p className="mt-8 max-w-2xl text-xs font-bold uppercase tracking-wide text-white/90 sm:text-sm">
              Our application for the summer semester 2026 phase ended on Sunday, April 26th. Stay
              tuned for the next phase that will open in October 2026.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (!isLive) {
    return (
      <div className="min-h-screen bg-brand-dark-blue text-white">
        <Hero
          backgroundImage="/memberJourney/hero-opt.png"
          title={
            <>
              JOIN <span className="outline-text">START MUNICH</span>
            </>
          }
          description="Applications for 2026 will open soon. Stay tuned."
        />
      </div>
    );
  }

  return (
    <div className="bg-brand-dark-blue">
      <Hero
        backgroundImage="/join-start-2026-bg.png"
        className="min-h-[calc(100vh-30rem)] lg:min-h-[calc(100vh-5rem)]"
        overlayOpacity="bg-gradient-to-r from-brand-dark-blue/95 via-brand-dark-blue/80 to-brand-dark-blue/70"
        imagePosition="center center"
        title={
          <>
            JOIN
            <br />
            <span className="outline-text">START</span>
            <br />
            MUNICH
          </>
        }
        titleClassName="mb-4 text-6xl leading-[0.94] tracking-tight sm:mb-6 sm:text-6xl lg:text-8xl"
        descriptionClassName="max-w-xl text-base text-gray-200 sm:text-lg"
        description={
          <>
            Become part of Germany&apos;s leading student-run entrepreneurship initiative. At START
            Munich, you&apos;ll gain hands-on experience, connect with top-tier founders and
            investors, and build with one of Munich&apos;s most ambitious student communities.
          </>
        }
        childrenWrapperClassName="lg:mt-0 lg:max-w-[380px] xl:max-w-[440px]"
      >
        <HeroCard className="w-full border-sky-300/20 bg-sky-500/10 shadow-[0_20px_60px_rgba(8,47,73,0.35)]">
          <p className="text-center text-xs font-bold uppercase tracking-[0.35em] text-white/75 sm:text-sm">
            Applications close in
          </p>
          <div
            className="mt-6 grid grid-cols-4 gap-2 sm:gap-4 lg:gap-2 xl:gap-3"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease' }}
          >
            {units.map((unit) => (
              <div
                key={unit.label}
                className="rounded-xl border border-white/10 bg-brand-dark-blue/40 px-2 py-3 text-center sm:rounded-2xl sm:px-4 sm:py-5 lg:px-2 lg:py-3 xl:px-3"
              >
                <span className="block text-[1.9rem] font-black tabular-nums text-white sm:text-[3rem] lg:text-[2.2rem] xl:text-[2.4rem]">
                  {pad(unit.value)}
                </span>
                <span className="mt-1 block text-[8px] uppercase tracking-[0.02em] text-white/55 sm:mt-2 sm:text-[11px] lg:mt-1 lg:text-[9px] xl:text-[10px]">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 hidden text-center text-sm leading-relaxed text-white/70 sm:block">
            Don&apos;t miss your chance to join START Munich. Applications only open once per
            semester.
          </p>
          <a
            href="https://tally.so/r/eqL4yQ"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => posthog.capture('application_started', { location: 'hero_card' })}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-pink px-8 py-3 font-bold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(208,0,111,0.4)]"
          >
            Start Application
          </a>
        </HeroCard>
      </Hero>

      {/* YouTube video section */}
      <section id="video" className="scroll-mt-8 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <iframe
              src="https://www.youtube.com/embed/T63USk9W_IY"
              title="START Munich Application Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-brand-pink md:text-4xl lg:text-5xl">
            Got Questions? Let&apos;s Talk.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
            Curious about START Munich or unsure about the application process? Join one of our
            upcoming events and get all your questions answered. Meet the team, learn what
            we&apos;re all about, and find out how you can become part of our entrepreneurial
            community.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={eventsSliderRef}
            onMouseDown={handleDrag.start}
            onMouseUp={handleDrag.end}
            onMouseMove={handleDrag.move}
            onMouseLeave={handleDrag.end}
            className="scrollbar-hide flex cursor-grab select-none gap-6 overflow-x-auto pb-4 active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {applyEvents.map((event) => (
              <UpcomingEventTile
                key={event.id}
                title={event.name}
                date={event.month}
                imageUrl={event.image}
                description={event.description}
                className="flex h-[35.5rem] w-[86vw] max-w-[320px] flex-none flex-col self-stretch sm:w-[300px] lg:w-[320px]"
                ctaHref={event.ctaHref}
                ctaLabel={event.ctaLabel}
                ctaDisabledLabel="Registration opens soon"
                onCtaClick={() =>
                  posthog.capture('application_event_registration_clicked', {
                    event_id: event.id,
                    event_name: event.name,
                  })
                }
              />
            ))}
          </div>
          <ScrollIndicator sliderRef={eventsSliderRef} />
        </div>
      </section>

      {/* What Makes START Unique */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase text-brand-pink sm:text-4xl md:text-5xl lg:text-6xl">
            What Makes Start Unique
          </h2>
          <p className="mt-4 text-base text-white md:text-lg">
            START Munich is more than a student initiative, it&apos;s a launchpad for future
            entrepreneurs. Here&apos;s why you should be part of it:
          </p>

          {/* Row 1 */}
          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Values Over Grades */}
            <div className="flex flex-col items-center text-center">
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
                <Image
                  src="/join-start/volleyball.png"
                  alt="Values Over Grades"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase text-white md:text-2xl">
                Values Over Grades
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                No one here cares about your GPA. What matters is the courage to share an idea and
                the drive to make it real. That&apos;s how programmers end up brainstorming with
                psychologists, and musicians sketch out business models. Different worlds, same
                fire.
              </p>
            </div>

            {/* No Playbook */}
            <div className="flex flex-col items-center text-center">
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
                <Image
                  src="/memberJourney/SF-opt.png"
                  alt="No Playbook"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase text-white md:text-2xl">
                No Playbook
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                The Bay Area trip, START Labs, the Hacking Legal hackathon were never assigned. They
                started as ideas someone cared enough to make real. No hierarchy. No bureaucracy.
                Just people taking the leap of faith and building things that matter.
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Failure Celebrated */}
            <div className="flex flex-col items-center text-center">
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
                <Image
                  src="/events/eventCards/fail-opt.jpg"
                  alt="Failure Celebrated"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase text-white md:text-2xl">
                Failure Celebrated
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                At events like Founder Fail Tales, screw-ups don&apos;t get buried. We hand failures
                the mic, laugh at them together, and learn out loud. Because if you never fail, you
                never dared to build.
              </p>
            </div>

            {/* A Living Global Network */}
            <div className="flex flex-col items-center text-center">
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
                <Image
                  src="/join-start/start-summit.jpeg"
                  alt="A Living Global Network"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase text-white md:text-2xl">
                A Living Global Network
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                START doesn&apos;t end when you leave Munich. It stays with you through new
                ventures, new cities, new chapters. You&apos;ll find co-founders, investors, and
                friends across the world. It&apos;s more than a network. It&apos;s a family you keep
                building with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jumpstart Into Entrepreneurship */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[4/1] w-full overflow-hidden rounded-lg">
            <Image
              src="/join-start/jumpstart.png"
              alt="Jumpstart Into Entrepreneurship"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <h3 className="mt-8 text-center text-xl font-black uppercase text-white md:text-2xl lg:text-3xl">
            Jumpstart Into Entrepreneurship
          </h3>
          <p className="mx-auto mt-4 max-w-4xl text-center text-sm leading-relaxed text-white/70 md:text-base">
            At START, your first step is the Sprint. In just 30 days, you turn a raw idea into an
            MVP and pitch it to a jury. After that, you dive into the departments, the heart of
            START, where you keep building, drive projects, and shape the community. Some go on to
            launch startups, everyone learns by doing.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://tally.so/r/eqL4yQ"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => posthog.capture('application_started', { location: 'bottom_cta' })}
              className="inline-flex items-center justify-center rounded-xl bg-brand-pink px-10 py-4 text-lg font-bold text-white transition-all duration-1000 hover:shadow-[0_0_30px_rgba(208,0,111,0.4)]"
            >
              Start Application Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
