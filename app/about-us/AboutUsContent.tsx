'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import CTA from '@/components/CTA';
import Hero from '@/components/Hero';
import HeroCard from '@/components/HeroCard';
import { useAnimatedNumber, useInView } from '@/lib/hooks';

const executiveBoard = [
  {
    name: 'Ali Serag El Din',
    role: 'President',
    photo: '/aboutUs/Board/Ali-opt.png',
    linkedinUrl: 'https://www.linkedin.com/in/ali-serag-el-din/',
  },
  {
    name: 'Defne Aytuna',
    role: 'Vice President',
    photo: '/aboutUs/Board/Defne-opt.png',
    linkedinUrl: 'https://www.linkedin.com/in/defne-aytuna/',
  },
  {
    name: 'Simon Burmer',
    role: 'CFO',
    photo: '/aboutUs/Board/Simon-opt.png',
    linkedinUrl: 'https://www.linkedin.com/in/simon-burmer/',
  },
];

const departmentBoard = [
  {
    name: 'Mohammed Thabit',
    role: 'MD Events',
    photo: '/aboutUs/Board/Mohammed-opt.png',
    linkedinUrl: 'https://www.linkedin.com/in/mohammed-thabit/',
  },
  {
    name: 'Piotr Nobis',
    role: 'MD Marketing',
    photo: '/aboutUs/Board/Piotr-opt.png',
    linkedinUrl: 'https://www.linkedin.com/in/piotr-nobis/',
  },
  {
    name: 'Anna Heletych',
    role: 'MD People',
    photo: '/aboutUs/Board/Anna-opt.png',
    linkedinUrl: 'https://www.linkedin.com/in/anna-heletych/',
  },
  {
    name: 'Niklas Simakov',
    role: 'MD Technology & Operations',
    photo: '/aboutUs/Board/Niklas-opt.png',
    linkedinUrl: 'https://www.linkedin.com/in/niklas-simakov/',
  },
  {
    name: 'Marius Heumader',
    role: 'MD Partnerships',
    photo: '/aboutUs/Board/Marius-opt.png',
    linkedinUrl: 'https://www.linkedin.com/in/marius-heumader/',
  },
];

const advisoryBoard = [
  {
    name: 'Dr. Jennifer Kaiser-Steiner',
    role: 'Learning & Exchange Center, UnternehmerTUM',
    bio: "Dr. Jennifer Kaiser-Steiner leads the Learning & Exchange Center at UnternehmerTUM, Europe's largest entrepreneurship hub. She supports startup factories and innovation ecosystems in strengthening their professionalism by sharing best practices and establishing KPI-driven performance frameworks. Previously, she worked as a personal advisor to a member of the German Bundestag, where she contributed to legislative initiatives. Jennifer earned her doctorate in economics from the University of the Federal Armed Forces, with a research focus on corporate innovation.",
    photo: '/aboutUs/AdvBoard/Jennifer.jpg',
  },
  {
    name: 'Prof. Dr. Bettina Maisch',
    role: 'Head of Entrepreneurship Education, SCE',
    bio: 'Prof. Dr. Bettina Maisch is Head of Entrepreneurship Education and Qualification at the Strascheg Center for Entrepreneurship (SCE). Her work focuses on Entrepreneurial Life Design, Design Thinking, and Innovation Management to empower individuals and organizations to develop and implement innovative ideas. She combines academic research with hands-on, iterative approaches to (Corporate) Entrepreneurship and venture creation.',
    photo: '/aboutUs/AdvBoard/Maisch.jpg',
  },
  {
    name: 'Felix Haas',
    role: 'Co-founder, 10x Founders VC',
    bio: "Felix Haas is a German entrepreneur, investor, and serial founder, having co-founded START Munich in 2003, the ticketing platform amiando, the identity verification company IDnow, and the startup venture firm 10x Founders VC. He has invested in over 50 tech startups, co-hosts Germany's leading founders' conference Bits & Pretzels, and is a founding partner of FLEX Capital, recognized for mentoring founders and driving innovation in the startup ecosystem.",
    photo: '/aboutUs/AdvBoard/Felix.png',
    objectPosition: 'center',
  },
  {
    name: 'Jean Paul Buján',
    role: 'Former Vice President',
    bio: null,
    photo: '/aboutUs/AdvBoard/JP-opt.png',
  },
  {
    name: 'Fabian Rieht',
    role: 'Former President',
    bio: null,
    photo: '/aboutUs/AdvBoard/Fabian-opt.png',
  },
];

const missionPartners = [
  {
    name: 'MTZ',
    description:
      'The Münchner Technologiezentrum provides office space, business coaching, and networking for young tech companies near Olympic Park — helping startups grow from first idea to market.',
    logo: 'https://mtz.de/wp-content/uploads/2021/10/White-1.svg',
    image: '/aboutUs/missionPartner/mtz-opt.jpg',
  },
  {
    name: 'Munich Startup',
    description:
      "Munich's official startup portal connecting founders with resources, investors, and the local ecosystem — mapping the city's innovation landscape and amplifying its startup scene.",
    logo: 'https://www.munich-startup.de/wp-content/themes/munichstartup/dist/images/munich-startup-logo-w.svg',
    image: '/aboutUs/missionPartner/MunichStartup.png',
  },
  {
    name: 'CDTM and Manage & More',
    descriptionParts: [
      {
        text: 'CDTM and Manage & More share our mission in empowering the next generation of founders in Munich. ',
      },
      {
        text: 'However START Munich and CDTM / M&M differ. We are a community that encourages learning by doing, while they are educational programs that provide structured curriculum. ',
        pink: true,
      },
      {
        text: 'Some of our members also join CDTM or M&M, but handling the intensive time commitment for both is challenging.',
      },
    ],
    image: '/aboutUs/missionPartner/CDTM.png',
    image2: '/aboutUs/missionPartner/mandm.jpeg',
  },
];

type AdvisoryMember = (typeof advisoryBoard)[number];

function AdvisorDetail({ member, onClose }: { member: AdvisoryMember; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const t = () =>
    `transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;

  return (
    <div
      className={`flex items-start gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-700 lg:p-8 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
    >
      <div
        className={`relative hidden h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-brand-pink sm:block ${t()}`}
        style={{ transitionDelay: '0ms' }}
      >
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="80px"
          className="object-cover object-top"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3
              className={`text-xl font-black uppercase tracking-tight text-white lg:text-2xl ${t()}`}
              style={{ transitionDelay: '100ms' }}
            >
              {member.name}
            </h3>
            <p
              className={`mt-1 text-sm font-semibold text-brand-pink ${t()}`}
              style={{ transitionDelay: '200ms' }}
            >
              {member.role}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/30 transition-colors hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p
          className={`mt-4 text-sm leading-relaxed text-gray-400 lg:text-base ${t()}`}
          style={{ transitionDelay: '300ms' }}
        >
          {member.bio}
        </p>
      </div>
    </div>
  );
}

const showAdvisoryBoard = true;

export default function AboutUsPage() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<number | null>(0);
  const advisorDetailRef = useRef<HTMLDivElement>(null);
  const animatedYears = useAnimatedNumber(20);
  const animatedMembers = useAnimatedNumber(600);
  const missionView = useInView(0.1);
  const partnersView = useInView(0.1);
  const execView = useInView(0.1);
  const deptView = useInView(0.1);
  const advView = useInView(0.1);

  return (
    <main className="min-h-screen overflow-x-hidden bg-brand-dark-blue text-white">
      <Hero
        backgroundImage="/aboutUs/hero-opt.jpg"
        title={
          <>
            WHO WE
            <br />
            <span className="outline-text">ARE</span>
          </>
        }
        description="A student-led community at the heart of Munich's startup scene — turning bold ideas into real ventures since 2003."
      >
        <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-6">
          <HeroCard>
            <div className="mb-3 flex items-baseline justify-center gap-2">
              <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent lg:text-6xl">
                {animatedYears}
              </span>
              <span className="text-xl font-bold text-brand-pink lg:text-3xl">+</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
              Years Active
            </p>
          </HeroCard>
          <HeroCard>
            <div className="mb-3 flex items-baseline justify-center gap-2">
              <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent lg:text-6xl">
                {animatedMembers}
              </span>
              <span className="text-xl font-bold text-brand-pink lg:text-3xl">+</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Members</p>
          </HeroCard>
        </div>
      </Hero>

      {/* ═══ 01 VISION & MISSION — bold editorial ═══ */}
      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8" ref={missionView.ref}>
        <div className="mx-auto max-w-7xl">
          <div
            className={`mb-10 transition-all duration-700 ${missionView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <div>
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.4em] text-brand-pink">
                Our Purpose
              </span>
              <h2 className="text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
                VISION
                <br />
                &amp; MISSION
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div
              className={`rounded-3xl border border-brand-pink/20 bg-gradient-to-br from-brand-pink/15 via-brand-pink/5 to-transparent p-10 transition-all delay-150 duration-700 lg:p-14 ${missionView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-pink/30 bg-brand-pink/20">
                  <svg
                    className="h-5 w-5 text-brand-pink"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.35em] text-brand-pink">
                  Mission
                </span>
              </div>
              <h3 className="mb-10 text-3xl font-black leading-[1.05] text-white lg:text-4xl xl:text-5xl">
                Empowering
                <br />
                founders of
                <br />
                <span className="text-brand-pink">tomorrow.</span>
              </h3>
              <p className="max-w-md text-base leading-relaxed text-gray-400 lg:text-lg">
                A self-driven community where learning happens by doing — and every member gets what
                is needed to build things that truly matters.
              </p>
            </div>

            <div
              className={`rounded-3xl border border-white/10 bg-white/[0.03] p-10 transition-all delay-300 duration-700 lg:p-14 ${missionView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.35em] text-white/50">
                  Vision
                </span>
              </div>
              <h3 className="mb-10 text-3xl font-black leading-[1.05] text-white lg:text-4xl xl:text-5xl">
                Being the launchpad for <span className="text-white/30">innovation</span>
              </h3>
              <p className="max-w-md text-base leading-relaxed text-gray-400 lg:text-lg">
                We envision START as <i>the</i> place for ambitious students in Munich, where ideas
                are turned into real innovations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 02 MISSION PARTNERS ═══ */}
      <section className="px-4 pb-16 pt-1 sm:px-6 lg:px-8" ref={partnersView.ref}>
        <div className="mx-auto max-w-7xl">
          <div
            className={`mb-10 transition-all duration-700 ${partnersView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <span className="text-sm font-bold uppercase tracking-[0.35em] text-brand-pink">
              Mission Partners
            </span>
            <p className="mt-2 text-base text-gray-500">
              Organisations who share our mission and support us in building Munich&apos;s next
              generation of founders.
            </p>
          </div>

          <div
            className={`flex flex-col gap-6 transition-all delay-200 duration-700 ${partnersView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            {missionPartners.map((partner, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:flex-row"
              >
                <div
                  className={`relative flex-shrink-0 overflow-hidden md:w-72 lg:w-80 ${partner.image2 ? 'h-48 md:h-auto' : 'h-48'}`}
                >
                  {partner.image2 ? (
                    <div className="flex h-full">
                      <Image
                        src={partner.image}
                        alt={partner.name}
                        width={200}
                        height={150}
                        className="h-full w-1/2 bg-white object-contain p-3"
                      />
                      <div className="w-1 flex-shrink-0 bg-brand-dark-blue" />
                      <Image
                        src={partner.image2}
                        alt={partner.name}
                        width={200}
                        height={150}
                        className="h-full w-1/2 bg-white object-contain p-3"
                      />
                    </div>
                  ) : (
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
                  <div className="flex items-center gap-4">
                    {partner.image2 ? (
                      <>
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                          <Image
                            src={partner.image}
                            alt="CDTM"
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                          <Image
                            src={partner.image2}
                            alt="Manage and More"
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                        {partner.logo ? (
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-xs font-bold uppercase text-white/30">
                            {partner.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    )}
                    <h3 className="text-lg font-black uppercase tracking-wide text-white">
                      {partner.name}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {'descriptionParts' in partner
                      ? partner.descriptionParts?.map((part, i) => (
                          <span key={i} className={part.pink ? 'text-brand-pink' : undefined}>
                            {part.text}
                          </span>
                        ))
                      : partner.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ═══ 03 EXECUTIVE BOARD — side-by-side layout ═══ */}
      <section className="relative px-4 pb-4 pt-28 sm:px-6 lg:px-8" ref={execView.ref}>
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-brand-pink/5 blur-[160px]" />

        <div className="relative mx-auto max-w-7xl">
          <div
            className={`grid grid-cols-1 items-center gap-12 transition-all duration-700 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16 ${execView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            {/* Left: heading */}
            <div>
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.4em] text-brand-pink">
                Meet the Team
              </span>
              <h2 className="text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
                THE
                <br />
                EXECUTIVE
                <br />
                BOARD
              </h2>
            </div>

            {/* Right: portrait cards */}
            <div
              className={`grid grid-cols-2 justify-items-center gap-x-8 gap-y-8 transition-all delay-200 duration-700 sm:grid-cols-3 ${execView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              {executiveBoard.map((member, i) => (
                <a
                  key={member.name}
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center text-center transition-all duration-500 ${execView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                  style={{ transitionDelay: `${200 + i * 100}ms` }}
                >
                  <div className="relative mb-3 h-48 w-36 select-none overflow-hidden rounded-xl border-2 border-white/10 transition-colors group-hover:border-brand-pink/50 sm:h-[15rem] sm:w-48">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 144px, 192px"
                      className="object-cover object-top"
                      draggable={false}
                    />
                  </div>
                  <p className="text-xs font-black uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-brand-pink lg:text-sm">
                    {member.name}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-gray-500 lg:text-xs">
                    {member.role}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 04 DEPARTMENT BOARD — compact row with circles ═══ */}
      <section className="px-4 pb-28 pt-4 sm:px-6 lg:px-8" ref={deptView.ref}>
        <div className="mx-auto max-w-7xl">
          <div
            className={`rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition-all duration-700 lg:p-10 ${deptView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-6 bg-brand-pink" />
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-brand-pink">
                The Department Board
              </span>
            </div>

            <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {departmentBoard.map((member, i) => (
                <a
                  key={member.name}
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center text-center transition-all duration-500 ${deptView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                  style={{ transitionDelay: `${200 + i * 100}ms` }}
                >
                  <div className="relative mb-3 h-48 w-36 select-none overflow-hidden rounded-xl border-2 border-white/10 transition-colors group-hover:border-brand-pink/50 sm:h-56 sm:w-44">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="object-cover object-top"
                      draggable={false}
                    />
                  </div>
                  <p className="text-xs font-black uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-brand-pink lg:text-sm">
                    {member.name}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-gray-500 lg:text-xs">
                    {member.role}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 05 ADVISORY BOARD — thumbnail grid with expandable detail ═══ */}
      {showAdvisoryBoard && (
        <section className="px-4 pb-28 pt-4 sm:px-6 lg:px-8" ref={advView.ref}>
          <div className="mx-auto max-w-7xl">
            <div
              className={`mb-10 transition-all duration-700 ${advView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              <div className="mb-4 flex items-center justify-end gap-3">
                <span className="text-sm font-bold uppercase tracking-[0.35em] text-brand-pink">
                  Meet our Experts
                </span>
                <div className="h-px w-6 bg-brand-pink" />
              </div>
              <h2 className="text-right text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
                The Advisory Board
              </h2>
              <p className="ml-auto mt-3 max-w-2xl text-right text-sm text-gray-400 sm:text-base">
                Our advisory board supports our long-term vision, connects us with key ecosystem
                players, and advises us on strategic decisions.
              </p>
            </div>

            {/* thumbnail grid */}
            <div className="grid grid-cols-2 items-start justify-items-center gap-3 sm:grid-cols-5 lg:gap-4">
              {advisoryBoard.map((member, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!member.bio) return;
                    const next = selectedAdvisor === i ? null : i;
                    setSelectedAdvisor(next);
                    if (next !== null) {
                      setTimeout(
                        () =>
                          advisorDetailRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                          }),
                        100,
                      );
                    }
                  }}
                  className={`group w-full max-w-[144px] text-left transition-all duration-700 sm:max-w-none ${advView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${!member.bio ? 'cursor-default' : ''} ${selectedAdvisor === i ? 'scale-[0.97]' : ''}`}
                  style={{}}
                >
                  <div
                    className={`relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-colors duration-300 ${selectedAdvisor === i ? 'border-brand-pink' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 33vw, 15vw"
                      className="object-cover"
                      style={{
                        objectPosition: 'objectPosition' in member ? member.objectPosition : 'top',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05112a]/80 via-transparent to-transparent" />
                  </div>
                  <p
                    className={`mt-2 line-clamp-2 text-xs font-bold uppercase leading-tight tracking-wide transition-colors ${selectedAdvisor === i ? 'text-brand-pink' : 'text-white'}`}
                  >
                    {member.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] uppercase tracking-wider text-gray-500">
                    {member.role}
                  </p>
                </button>
              ))}
            </div>

            {/* Expandable detail panel */}
            <div
              ref={advisorDetailRef}
              className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedAdvisor !== null ? 'mt-6 max-h-[800px] opacity-100' : 'mt-0 max-h-0 opacity-0'}`}
            >
              {selectedAdvisor !== null && advisoryBoard[selectedAdvisor].bio && (
                <AdvisorDetail
                  key={selectedAdvisor}
                  member={advisoryBoard[selectedAdvisor]}
                  onClose={() => setSelectedAdvisor(null)}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="px-4 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CTA
            title="Want to Learn More About Us?"
            description="Discover how you can grow with START Munich — whether as a member shaping your entrepreneurial journey or as a partner connecting with Munich's most ambitious talents."
            buttons={[
              { label: 'Our Member Journey', href: '/member-journey', variant: 'secondary' },
              { label: 'Contact Us', href: 'https://tally.so/r/w7WY0a', variant: 'secondary' },
              { label: 'Become a Partner', href: '/for-partners', variant: 'secondary' },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
