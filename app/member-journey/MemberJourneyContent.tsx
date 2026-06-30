'use client';

import Image from 'next/image';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import CTA from '@/components/CTA';
import { ScrollIndicator } from '@/components/EventComponents';
import Hero from '@/components/Hero';
import HeroCard from '@/components/HeroCard';
import TestimonialsSection from '@/components/TestimonialsSection';
import { useAnimatedNumber } from '@/lib/hooks';

export const dynamic = 'force-dynamic';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  image: string | string[];
  details: string[];
}

interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  responsibilities: string[];
}

interface StartEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  icon: string;
  images: string[];
}

interface MemberStory {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  story: string;
  department: string;
  logos?: { src: string; url?: string }[];
}

const placeholderImage = '/internalevents-opt.png';

const timelineEvents: TimelineEvent[] = [
  {
    id: 'application',
    title: 'Application',
    description: 'Your entry into START Munich.',
    image: '',
    details: [
      'Apply in April or October',
      'Stage 1: Written Application',
      'Stage 2: Two Interviews (same day, 30 minutes each)',
    ],
  },
  {
    id: 'start-sprint',
    title: 'START Sprint',
    description:
      "Your first month at START. Get to know and bond with ambitious people you wouldn't meet in your usual circles, and build a real product together.",
    image: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    ],
    details: [
      'Develop your own idea from concept to MVP in just 4 weeks',
      'Two workshops per week to learn foundations of building a startup',
      'Get to know key players within Munich startup ecosystem',
      'Spend an unforgettable weekend with our community in Austria',
      'Final pitch in front of a jury, compete to win START Summit tickets',
    ],
  },
  {
    id: 'department-selection',
    title: 'Department Selection',
    description:
      'Develop yourself and shape the future of START. START is completely student-run. What happens here depends on what you do.',
    image: '',
    details: [
      'Choose one of five departments',
      'Work on real projects with visible impact inside and outside START',
      'Learn useful startup skills in practice',
      'Grow fast by taking ownership',
      'Initiate new formats',
    ],
  },
  {
    id: 'active-member',
    title: 'Active Member',
    description:
      'Enjoy the benefits of being a STARTie and expand your network through exclusive opportunities.',
    image: placeholderImage,
    details: [
      'Join the Bay Area trip, 2 weeks, 20+ curated visits to top startups, VCs, and labs',
      'Research Stay @ Cambridge through direct research collaboration',
      'Become part of the START Network, 20+ chapters worldwide',
      'Find co-founders or start your own venture within a community of 100+ startups, including teams backed by Y Combinator',
    ],
  },
  {
    id: 'alumni',
    title: 'START Alumni',
    description: 'Once a STARTie, always a STARTie. Stay connected as you build your own path.',
    image: placeholderImage,
    details: [
      'Become alumni after two active semesters',
      'Find co-founders, investors, and collaborators across the START Global Network',
      'Give back by mentoring, sharing, and supporting new STARTies',
      'Stay involved as much as you want, department work is optional',
    ],
  },
];

const departments: Department[] = [
  {
    id: 'people',
    name: 'People',
    description:
      'Learn how to spot the right talent, keep them motivated, and build a community that accelerates your startup journey.',
    icon: '👥',
    responsibilities: [
      'Run recruiting, interviews, and onboarding.',
      'Organize START Sprint and shape new batches.',
      'Keep members engaged and connected through formats like Hut Weekend, START Goes Eating, and more.',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description:
      'Learn how to highlight our people, events, and achievements to reach millions and build a trusted brand.',
    icon: '📢',
    responsibilities: [
      'Create content, posts, and campaigns for LinkedIn and Instagram.',
      'Shoot and edit photos and videos from events.',
      "Build and maintain START's brand and image.",
    ],
  },
  {
    id: 'techops',
    name: 'TechOps',
    description:
      "Learn how to design and build custom tools and automate workflows to increase START's output and influence.",
    icon: '🛠️',
    responsibilities: [
      'Build internal tools like Members Platform or Financial Dashboard.',
      'Improve our core systems like Slack, n8n and Notion.',
      'Handle contract management, ensuring compliance.',
    ],
  },
  {
    id: 'partnerships',
    name: 'Partnerships',
    description:
      "Learn how to secure partners, close deals, and bring in the resources that multiply START's impact across the ecosystem.",
    icon: '🤝',
    responsibilities: [
      'Run outreach campaigns and handle rejection.',
      'Build and manage relationships that create long-term value.',
      "Close deals that fund START's projects.",
    ],
  },
  {
    id: 'events',
    name: 'Events',
    description:
      'Learn how to run flagship events where people meet, learn, and build across START, the Munich ecosystem, and beyond.',
    icon: '🎉',
    responsibilities: [
      'Organize and run large-scale events with 300+ attendees, like hackathons and summits.',
      'Organize workshops, startup visits, and other learning opportunities.',
      'Create experiences people remember and come back for.',
    ],
  },
];

const startEvents: StartEvent[] = [
  {
    id: 'monthly',
    title: 'The Monthly',
    description:
      'Each month all active members meet at MTZ to share updates, pitch their startups, and connect across the community.',
    category: 'Meeting',
    frequency: 'Monthly',
    icon: '📅',
    images: [
      '/memberJourney/monthly/2-opt.jpg',
      '/memberJourney/monthly/3-opt.png',
      '/memberJourney/monthly/4-opt.png',
    ],
  },
  {
    id: 'department-work',
    title: 'Department Work',
    description: 'Meet with your department at our MTZ office to align on projects and progress.',
    category: 'Department',
    frequency: 'Weekly',
    icon: '💼',
    images: ['/memberJourney/departmentwork/2-opt.jpg', '/memberJourney/departmentwork/1-opt.jpg'],
  },
  {
    id: 'builders-weekend',
    title: 'Builders Weekend',
    description: 'Meet on the weekend to build your own startup.',
    category: 'Building',
    frequency: 'Monthly',
    icon: '🔨',
    images: ['/memberJourney/builderWeekend/1-opt.jpg'],
  },
  {
    id: 'workshops',
    title: 'Member Workshops',
    description: 'Workshops with VCs and other professionals.',
    category: 'Learning',
    frequency: '',
    icon: '🎓',
    images: ['/memberJourney/memberworkshop/1-opt.jpg', '/memberJourney/memberworkshop/3-opt.jpeg'],
  },
  {
    id: 'startup-visits',
    title: 'Startup Visits',
    description: 'Visit startups and learn from the experienced.',
    category: 'Networking',
    frequency: '',
    icon: '🏢',
    images: ['/memberJourney/startupVisit/1-opt.png', '/memberJourney/startupVisit/2-opt.png'],
  },
];

const memberStories: MemberStory[] = [
  {
    id: 'story-1',
    name: 'Felix Haas',
    role: 'Founder & Investor',
    company: 'IDNow | Bits & Pretzels',
    image: '/memberJourney/alumni/FelixHaas-opt.png',
    story:
      'At START Munich, I laid the foundation for my current network. From this starting point, I built several companies, invested in more than 80 start-ups and helped set up Bits & Pretzels.',
    department: 'Alumni',
    logos: [
      {
        src: 'https://cdn.prod.website-files.com/65f98ea7c70b10b668ccbeb3/65f98ea7c70b10b668ccbeea_Vectors-Wrapper.svg',
        url: 'https://www.idnow.io/',
      },
      {
        src: 'https://cdn.prod.website-files.com/65f98ea7c70b10b668ccbeb3/65f98ea7c70b10b668ccbece_logo.svg',
        url: 'https://www.bitsandpretzels.com/',
      },
    ],
  },
  {
    id: 'story-3',
    name: 'Elisabeth Goebel',
    role: 'Early Operator',
    company: 'ZeitAI | CDTM',
    image: '/memberJourney/alumni/Elisa-opt.png',
    story:
      'START is where things actually happen. I co-founded ISAR Unfiltered, met people who think and move the way I do, and built a network that directly led me to where I am today: Early Operator at a YC-backed AI startup.',
    department: 'People',
    logos: [
      {
        src: 'https://cdn.prod.website-files.com/6902359088cc8683c4db0171/69249d98617b1b96682cca65_44a5d2ba9e6004a1281eed9068c62a95_zeitai-logo-opt.png',
        url: 'https://www.zeit.ai/',
      },
    ],
  },
  {
    id: 'story-2',
    name: 'Joshua Cornelius',
    role: 'Co-Founder',
    company: 'Freeletics | CDTM',
    image: '/memberJourney/alumni/JoshuaCornelius-opt.png',
    story:
      'Before we founded Freeletics, START Munich - in addition to CDTM - gave my co-founder and me the ideal opportunity to make first contacts in the Munich startup scene.',
    department: 'Alumni',
    logos: [
      {
        src: 'https://cdn.prod.website-files.com/65f98ea7c70b10b668ccbeb3/65f98ea7c70b10b668ccbeef_5eb3c929c8c4590004435152-opt.png',
        url: 'https://www.freeletics.com/',
      },
    ],
  },
];

export default function MemberJourneyPage() {
  const [loading, setLoading] = useState(true);
  const [activeDeptId, setActiveDeptId] = useState<string | null>(departments[0].id);
  const [eventImageIndex, setEventImageIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const timelineSliderRef = useRef<HTMLDivElement>(null);
  const isDraggingTimeline = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [lockedEventId, setLockedEventId] = useState<string | null>(null);
  const [isMoreHovered, setIsMoreHovered] = useState(false);
  const [isMoreLocked, setIsMoreLocked] = useState(false);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eventImageRef = useRef<HTMLDivElement>(null);
  const eventsSectionRef = useRef<HTMLDivElement>(null);

  // Unlock selection when clicking outside the events section
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (eventsSectionRef.current && !eventsSectionRef.current.contains(e.target as Node)) {
        setLockedEventId(null);
        setIsMoreLocked(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Animated counter for hero stats
  const semesterCount = useAnimatedNumber(2, loading, 500);

  // Images for "And a lot more..." section
  const moreImages = [
    'https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
  ];

  const activeEventId = lockedEventId || hoveredEventId;
  const activeMore = isMoreLocked || isMoreHovered;

  const eventImages = activeEventId
    ? startEvents
        .find((event) => event.id === activeEventId)
        ?.images.map((img) => ({
          src: img,
          title: startEvents.find((e) => e.id === activeEventId)!.title,
        })) || []
    : [];

  // Get current event for auto-rotation (only if nothing is active)
  const currentEvent =
    !activeEventId && !activeMore && currentEventIndex < startEvents.length
      ? startEvents[currentEventIndex]
      : null;
  const currentEventImages = currentEvent
    ? currentEvent.images.map((img) => ({ src: img, title: currentEvent.title }))
    : [];

  const scrollToEventImage = () => {
    if (window.innerWidth < 1024 && eventImageRef.current) {
      const yOffset = -80;
      const y = eventImageRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  // Auto-rotate events every 5 seconds
  useEffect(() => {
    if (loading || activeEventId || activeMore) {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
        autoRotateTimerRef.current = null;
      }
      return;
    }

    autoRotateTimerRef.current = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % (startEvents.length + 1));
    }, 3000);

    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
      }
    };
  }, [loading, activeEventId, activeMore]);

  // Reset image index when event changes
  useEffect(() => {
    setEventImageIndex(0);
  }, [activeEventId, activeMore, currentEventIndex]);

  // When hovering ends, continue auto-rotation from the active item
  useEffect(() => {
    if (!activeEventId && !activeMore) {
      return;
    }
    if (activeEventId) {
      const index = startEvents.findIndex((e) => e.id === activeEventId);
      if (index !== -1) {
        setCurrentEventIndex(index);
      }
    } else if (activeMore) {
      setCurrentEventIndex(startEvents.length);
    }
  }, [activeEventId, activeMore]);

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-dark-blue px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-2xl font-bold text-white">Loading journey...</p>
        </div>
      </main>
    );
  }

  return (
    <>
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
          backgroundImage="/memberJourney/hero-opt.png"
          title={
            <>
              YOUR START MUNICH
              <br />
              <span className="outline-text">JOURNEY</span>
            </>
          }
          description="Become a member and spend at least two active semesters contributing to the community"
        >
          <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-6">
            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent transition lg:text-6xl">
                  {semesterCount}
                </span>
                <span className="text-xl font-bold text-brand-pink lg:text-3xl">+</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Semesters</p>
            </HeroCard>

            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent transition lg:text-6xl">
                  ∞
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Possibilities
              </p>
            </HeroCard>
          </div>
        </Hero>

        {/* ═══ MEMBER JOURNEY TIMELINE ═══ */}
        <div className="mb-0 w-full pt-12 lg:pt-28">
          <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="mb-1 block text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
              Your Path
            </span>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              MEMBER <span className="outline-text">JOURNEY</span>
            </h2>
            <p className="mt-2 max-w-xl text-lg text-gray-400">
              The 5 milestones of your first two semesters at START Munich
            </p>
          </div>

          <div className="group/timeline relative">
            <div
              ref={timelineSliderRef}
              className="scrollbar-hide mx-auto max-w-7xl cursor-grab select-none overflow-x-auto pb-1 active:cursor-grabbing"
              onMouseDown={(e) => {
                isDraggingTimeline.current = true;
                dragStartX.current = e.pageX - (timelineSliderRef.current?.offsetLeft ?? 0);
                dragStartScrollLeft.current = timelineSliderRef.current?.scrollLeft ?? 0;
              }}
              onMouseMove={(e) => {
                if (!isDraggingTimeline.current || !timelineSliderRef.current) return;
                e.preventDefault();
                const x = e.pageX - (timelineSliderRef.current.offsetLeft ?? 0);
                timelineSliderRef.current.scrollLeft =
                  dragStartScrollLeft.current - (x - dragStartX.current);
              }}
              onMouseUp={() => {
                isDraggingTimeline.current = false;
              }}
              onMouseLeave={() => {
                isDraggingTimeline.current = false;
              }}
            >
              <div className="flex min-w-max gap-5 px-8 lg:px-20">
                {timelineEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="timeline-card-animate group relative w-[320px] flex-shrink-0"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-sm transition-all duration-500 hover:border-brand-pink/40 hover:bg-white/[0.09]">
                      {/* Pink accent top bar */}
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-pink/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="p-8">
                        {/* Step number + divider */}
                        <div className="mb-6 flex items-center gap-4">
                          <span className="text-5xl font-black tabular-nums leading-none tracking-tight text-white/20">
                            0{index + 1}
                          </span>
                          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                        </div>

                        <h3 className="mb-3 text-xl font-black text-white transition-colors duration-300 group-hover:text-brand-pink">
                          {event.title}
                        </h3>

                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                          {event.description}
                        </p>

                        <div className="space-y-3">
                          {(event.details as string[]).map((detail, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="mt-[0.45rem] h-1 w-1 flex-shrink-0 rounded-full bg-brand-pink" />
                              <span className="text-sm leading-relaxed text-gray-400">
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ScrollIndicator sliderRef={timelineSliderRef} />
            </div>
          </div>
        </div>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="mx-auto max-w-7xl space-y-32 px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
          {/* ═══ DEPARTMENTS ═══ */}
          <section>
            <div className="mb-1">
              <span className="mb-1 block text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
                Where You Fit
              </span>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                OUR <span className="outline-text">DEPARTMENTS</span>
              </h2>
              <p className="mt-2 max-w-xl text-lg text-gray-400">
                Choose your department and contribute to our community
              </p>
            </div>

            {/* Desktop: arc layout */}
            {(() => {
              // Left-side half-circle "(" : center=(300,300), r=300
              // Arc from (300,0) at top, curving LEFT through (0,300), to (300,600) at bottom
              const cx = 300,
                cy = 300,
                r = 300;
              const toRad = (deg: number) => (deg * Math.PI) / 180;
              // Standard-math angles (CCW from +x): 108°→top-left … 252°→bottom-left
              const angles = [108, 144, 180, 216, 252];
              // Per-dot label vertical nudge (positive = lower, negative = higher)
              const labelYOffsets = [18, 6, 6, 6, -8];
              const dots = departments.map((dept, i) => {
                const a = toRad(angles[i]);
                return {
                  dept,
                  x: cx + r * Math.cos(a),
                  y: cy - r * Math.sin(a),
                  labelYOffset: labelYOffsets[i],
                };
              });
              const activeDept = departments.find((d) => d.id === activeDeptId);

              return (
                <>
                  {/* Desktop */}
                  <div className="hidden items-center gap-10 lg:grid lg:grid-cols-[1fr_380px]">
                    {/* Detail panel — left */}
                    <div className="min-h-[320px]">
                      {activeDept && (
                        <div
                          key={activeDept.id}
                          className="h-full rounded-3xl border border-brand-pink/20 bg-white/[0.06] p-8 backdrop-blur-sm"
                          style={{ animation: 'fadeInPanel 0.3s ease-out' }}
                        >
                          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-pink/15">
                            <span className="text-3xl">{activeDept.icon}</span>
                          </div>
                          <h3 className="mb-3 text-2xl font-black text-white">
                            {activeDept.name.toUpperCase()}
                          </h3>
                          <p className="mb-6 text-sm leading-relaxed text-gray-300">
                            {activeDept.description}
                          </p>
                          <div className="border-t border-white/10 pt-5">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-brand-pink">
                              Responsibilities
                            </p>
                            <div className="space-y-3">
                              {activeDept.responsibilities.map((resp, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-pink" />
                                  <span className="text-sm leading-relaxed text-gray-400">
                                    {resp}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Arc — right */}
                    <div className="relative w-full">
                      <svg
                        viewBox="-20 -20 400 640"
                        className="w-full"
                        style={{ overflow: 'visible' }}
                      >
                        {/* Always-pink arc: (300,0) CCW through (0,300) to (300,600) */}
                        <path
                          d={`M ${cx},${cy - r} A ${r},${r} 0 0 0 ${cx},${cy + r}`}
                          fill="none"
                          stroke="rgb(236,72,153)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        {/* Dots + labels */}
                        {dots.map(({ dept, x, y, labelYOffset }) => {
                          const isActive = activeDeptId === dept.id;
                          return (
                            <g
                              key={dept.id}
                              onClick={() => setActiveDeptId(dept.id)}
                              className="cursor-pointer"
                              style={{ transition: 'all 0.3s' }}
                            >
                              {isActive && (
                                <circle cx={x} cy={y} r="22" fill="rgba(236,72,153,0.15)" />
                              )}
                              <circle
                                cx={x}
                                cy={y}
                                r={isActive ? 11 : 7}
                                fill={isActive ? 'rgb(236,72,153)' : 'rgba(255,255,255,0.22)'}
                                stroke={
                                  isActive ? 'rgba(236,72,153,0.6)' : 'rgba(255,255,255,0.25)'
                                }
                                strokeWidth="2"
                              />
                              {isActive && <circle cx={x} cy={y} r="4" fill="white" />}
                              {/* Label — to the right of dot, toward the opening */}
                              <text
                                x={x + 24}
                                y={y + labelYOffset}
                                textAnchor="start"
                                fontSize="20"
                                fontWeight="800"
                                letterSpacing="0.08em"
                                fill={isActive ? 'rgb(236,72,153)' : 'rgba(255,255,255,0.5)'}
                                fontFamily="inherit"
                                style={{ transition: 'fill 0.3s' }}
                              >
                                {dept.name.toUpperCase()}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Mobile: icon strip + card */}
                  <div className="lg:hidden">
                    <div className="mb-6 flex flex-wrap justify-center gap-3">
                      {departments.map((dept) => (
                        <button
                          key={dept.id}
                          onClick={() => setActiveDeptId(dept.id)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all duration-200 ${activeDeptId === dept.id ? 'opacity-100' : 'opacity-45 hover:opacity-70'}`}
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${activeDeptId === dept.id ? 'border-brand-pink/40 bg-brand-pink/20' : 'border-white/10 bg-white/5'}`}
                          >
                            <span className="text-2xl">{dept.icon}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${activeDeptId === dept.id ? 'text-brand-pink' : 'text-gray-500'}`}
                          >
                            {dept.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    {activeDept && (
                      <div
                        key={activeDept.id}
                        className="rounded-3xl border border-brand-pink/20 bg-white/[0.06] p-6"
                        style={{ animation: 'fadeInPanel 0.3s ease-out' }}
                      >
                        <h3 className="mb-2 text-xl font-black text-white">
                          {activeDept.name.toUpperCase()}
                        </h3>
                        <p className="mb-4 text-sm leading-relaxed text-gray-400">
                          {activeDept.description}
                        </p>
                        <div className="border-t border-white/10 pt-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-brand-pink">
                            Responsibilities
                          </p>
                          {activeDept.responsibilities.map((resp, i) => (
                            <div key={i} className="mt-2 flex items-start gap-2">
                              <div className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brand-pink" />
                              <span className="text-xs leading-relaxed text-gray-400">{resp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </section>

          {/* ═══ INTERNAL EVENTS ═══ */}
          <section>
            <div className="mb-12">
              <span className="mb-1 block text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
                Community Life
              </span>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                INTERNAL <span className="outline-text">EVENTS</span>
              </h2>
              <p className="mt-2 max-w-xl text-lg text-gray-400">
                Regular events and activities of our community
              </p>
            </div>

            <div
              ref={eventsSectionRef}
              className="grid grid-cols-1 items-stretch gap-6 lg:h-[620px] lg:grid-cols-2"
            >
              {/* Event list card */}
              <div
                className="order-2 rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm lg:order-1"
                onMouseLeave={() => {
                  if (!lockedEventId && !isMoreLocked) {
                    setHoveredEventId(null);
                    setIsMoreHovered(false);
                  }
                }}
              >
                <div className="space-y-1">
                  {startEvents.map((event, index) => {
                    const isActive =
                      activeEventId === event.id ||
                      (!activeEventId && !activeMore && currentEventIndex === index);
                    return (
                      <div
                        key={event.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl p-4 transition-all duration-200 ${isActive ? 'border border-brand-pink/30 bg-brand-pink/10' : 'border border-transparent hover:bg-white/5'}`}
                        onMouseEnter={() => {
                          if (!lockedEventId && !isMoreLocked) setHoveredEventId(event.id);
                        }}
                        onMouseLeave={() => {
                          if (!lockedEventId && !isMoreLocked) setHoveredEventId(null);
                        }}
                        onClick={() => {
                          setLockedEventId(event.id);
                          setIsMoreLocked(false);
                          setIsMoreHovered(false);
                          setHoveredEventId(null);
                          scrollToEventImage();
                        }}
                      >
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${isActive ? 'bg-brand-pink/20' : 'bg-white/5'}`}
                        >
                          <span className="text-xl">{event.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3
                              className={`text-base font-bold transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-200'}`}
                            >
                              {event.title}
                            </h3>
                            {event.frequency && (
                              <span className="flex-shrink-0 rounded-full bg-brand-pink/10 px-2 py-0.5 text-xs font-semibold text-brand-pink/70">
                                {event.frequency}
                              </span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed text-gray-400">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* And a lot more */}
                  {(() => {
                    const isMoreActive =
                      activeMore ||
                      (!activeEventId && !activeMore && currentEventIndex === startEvents.length);
                    return (
                      <div
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl p-4 transition-all duration-200 ${isMoreActive ? 'border border-brand-pink/30 bg-brand-pink/10' : 'border border-transparent hover:bg-white/5'}`}
                        onMouseEnter={() => {
                          if (!lockedEventId && !isMoreLocked) setIsMoreHovered(true);
                        }}
                        onMouseLeave={() => {
                          if (!lockedEventId && !isMoreLocked) setIsMoreHovered(false);
                        }}
                        onClick={() => {
                          setIsMoreLocked(true);
                          setLockedEventId(null);
                          setHoveredEventId(null);
                          setIsMoreHovered(false);
                          scrollToEventImage();
                        }}
                      >
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${isMoreActive ? 'bg-brand-pink/20' : 'bg-white/5'}`}
                        >
                          <span className="text-xl">✨</span>
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`mb-1 text-base font-bold transition-colors duration-200 ${isMoreActive ? 'text-white' : 'text-gray-200'}`}
                          >
                            And a lot more...
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-400">
                            Discover many more exciting events and opportunities.
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Image panel */}
              <div
                ref={eventImageRef}
                className="relative order-1 h-72 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] lg:order-2 lg:h-auto"
              >
                {activeMore ||
                (!activeEventId && !activeMore && currentEventIndex === startEvents.length) ? (
                  <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0">
                    {moreImages.map((img, i) => (
                      <div key={i} className="relative h-full w-full overflow-hidden">
                        <Image
                          src={img}
                          alt={`More activities ${i + 1}`}
                          fill
                          sizes="50vw"
                          className="fade-swap object-cover"
                        />
                        <div className="absolute inset-0 bg-brand-dark-blue/20" />
                      </div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-2xl border border-brand-pink/40 bg-black/70 px-8 py-4 backdrop-blur-md">
                        <p className="text-2xl font-black text-white">AND MORE...</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const images =
                      activeEventId && eventImages.length > 0
                        ? eventImages
                        : currentEventImages.length > 0
                          ? currentEventImages
                          : null;
                    if (!images) return null;
                    const idx = eventImageIndex % images.length;
                    return (
                      <div className="relative h-full w-full">
                        <Image
                          key={images[idx]?.src}
                          src={images[idx]?.src}
                          alt={images[idx]?.title ?? ''}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="fade-swap object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                          <p className="text-base font-bold text-white">{images[idx]?.title}</p>
                        </div>
                        <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4">
                          <button
                            onClick={() =>
                              setEventImageIndex(
                                (prev) => (prev - 1 + images.length) % images.length,
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-brand-pink hover:bg-brand-pink/80"
                            aria-label="Previous image"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEventImageIndex((prev) => (prev + 1) % images.length)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-brand-pink hover:bg-brand-pink/80"
                            aria-label="Next image"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold tabular-nums text-white backdrop-blur-md">
                          {idx + 1} / {images.length}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          </section>

          {/* ═══ COMMUNITY SPECIALS ═══ */}
          <section>
            <div className="mb-12">
              <span className="mb-1 block text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
                Exclusive Access
              </span>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                COMMUNITY <span className="outline-text">SPECIALS</span>
              </h2>
              <p className="mt-2 max-w-xl text-lg text-gray-400">
                Unique opportunities exclusively for START Munich members
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Bay Area */}
              <a
                href="/start-goes-bay-area"
                className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-sm transition-all duration-500 hover:border-brand-pink/40"
              >
                <div className="relative aspect-video overflow-hidden rounded-t-3xl">
                  <Image
                    src="/memberJourney/SF-opt.png"
                    alt="San Francisco Bay Area"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-2xl font-black text-white transition-colors group-hover:text-brand-pink">
                    START goes Bay Area
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-gray-300">
                    Once a year, 20 selected STARTies go on a two-week trip to the San Francisco Bay
                    Area to experience one of the world&apos;s most vibrant startup ecosystems
                    firsthand. Through curated visits with partner companies, research labs, and VC
                    firms, participants strengthen our ties with international founders,
                    researchers, and investors.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-pink transition-all group-hover:gap-3">
                    Learn more
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </a>

              {/* Cambridge */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-sm transition-all duration-500 hover:border-brand-pink/30">
                <div className="relative aspect-video overflow-hidden rounded-t-3xl">
                  <Image
                    src="/memberJourney/cambridge-aerial-opt.png"
                    alt="University Research"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-2xl font-black text-white">Research Stay @ Cambridge</h3>
                  <p className="mb-5 text-sm leading-relaxed text-gray-300">
                    Spend a research stay with our partners at the University of Cambridge and
                    Technical University of Munich. Gain access to world-class academic resources,
                    mentorship from leading researchers, and the opportunity to contribute to
                    cutting-edge research.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-400">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Cambridge
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-400">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      TUM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Member Stories */}
          <TestimonialsSection
            title={
              <>
                <span className="outline-text">MEMBER </span> STORIES
              </>
            }
            description="Real stories from our members who built successful startups with START Munich"
            items={memberStories.map((story) => ({
              id: story.id,
              name: story.name,
              role: story.role,
              company: story.company,
              image: story.image,
              story: story.story,
              logos: story.logos,
            }))}
          />

          {/* CTA */}
          <CTA
            title="Ready to Join?"
            description="Start your entrepreneurial journey with START Munich today. Apply to become a member and experience our vibrant community."
            buttons={[
              { label: 'Apply Now', href: '/apply', variant: 'secondary' },
              {
                label: 'Contact People Department',
                href: 'https://tally.so/r/mZNxV0',
                variant: 'secondary',
              },
              { label: 'Learn More', href: '/about-us', variant: 'secondary' },
            ]}
          />
        </div>
      </main>

      <style jsx global>{`
        .fade-swap {
          animation: fadeSwap 0.8s ease-in-out;
        }
        @keyframes fadeSwap {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .timeline-card-animate {
          animation: slideInFromLeft 0.6s ease-out forwards;
          opacity: 0;
          transform: translateX(-30px);
        }
        @keyframes slideInFromLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .overflow-x-auto {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }

        @keyframes fadeInPanel {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
