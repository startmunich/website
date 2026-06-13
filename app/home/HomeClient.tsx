"use client"

/**
 * HomeClient — Client Component
 *
 * Renders the full home page UI. Partner and startup data are received as
 * `initialPartners` / `initialStartups` props that are pre-fetched and cached
 * server-side by the parent `page.tsx` (ISR, 1-hour revalidation). This means
 * no client-side data fetching is needed and logos appear instantly on load.
 */
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { useAnimatedNumber, useInView } from '@/lib/hooks'
import type { Partner, Startup, NewsItem } from '@/lib/types'

// ── Images ──────────────────────────────────────────────────────────────────────

const heroImages = [
  "/home/heroBackground/sprint-opt.jpg",
  "/home/heroBackground/isar-opt.jpg",
  "/home/heroBackground/legal-opt.jpg",
  "/home/heroBackground/background2-opt.jpg",
  "/home/heroBackground/background-opt.jpg",
  "/home/heroBackground/background1-opt.jpeg",
  "/home/heroBackground/rtsh-opt.jpeg",
  "/home/heroBackground/background4-opt.png",
]

// ── Data ────────────────────────────────────────────────────────────────────────

const facts = [
  { label: "Members", value: 300, suffix: "+" },
  { label: "Diversity (MINT)", value: 65, suffix: "%" },
  { label: "Capital Raised", value: 500, suffix: "M+", prefix: "€" },
  { label: "Members in YC & other top programs", value: 8, suffix: "+" },
]

// Munich-time cutoffs for the 2026 summer application window
const APPLICATIONS_OPENED_AT = new Date('2026-04-10T00:00:00+02:00').getTime()
const APPLICATIONS_CLOSED_AT = new Date('2026-04-27T00:00:00+02:00').getTime()

// ── Component ───────────────────────────────────────────────────────────────────

interface HomeClientProps {
  initialPartners: Partner[]
  initialStartups: Startup[]
  initialNews: NewsItem[]
}

export default function HomeClient({ initialPartners, initialStartups, initialNews }: HomeClientProps) {
  const [loaded, setLoaded] = useState(false)
  const [heroIdx, setHeroIdx] = useState(0)
  const [turningIdx, setTurningIdx] = useState(0)
  const [brandPartners] = useState<Partner[]>(initialPartners)
  const [featuredStartups] = useState<Startup[]>(initialStartups)
  const [newsIndex, setNewsIndex] = useState(0)
  const [showAllNews, setShowAllNews] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const applicationsClosed = now >= APPLICATIONS_CLOSED_AT
  const applicationsOpen = now >= APPLICATIONS_OPENED_AT && !applicationsClosed
  const factsView = useInView(0.25)
  const missionView = useInView(0.15)
  // const specialView = useInView(0.1)

  const turningPhrases = [
    { from: "latest research", to: "innovation" },
    { from: "students", to: "founders" },
    { from: "bold ideas", to: "reality" },
    { from: "ambition", to: "impact" },
    { from: "passion", to: "startups" },
  ]

  useEffect(() => { setLoaded(true) }, [])

  // Re-check the application window every 30s so the banner / CTA flip live
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [])

  // Hero image crossfade
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(p => (p + 1) % heroImages.length), 5000)
    return () => clearInterval(t)
  }, [])

  // Turning phrases rotation
  useEffect(() => {
    const t = setInterval(() => setTurningIdx(p => (p + 1) % turningPhrases.length), 2500)
    return () => clearInterval(t)
  }, [turningPhrases.length])

  const animatedValues = [
    useAnimatedNumber(facts[0].value, !factsView.visible, 1800),
    useAnimatedNumber(facts[1].value, !factsView.visible, 1800),
    useAnimatedNumber(facts[2].value, !factsView.visible, 1800),
    useAnimatedNumber(facts[3].value, !factsView.visible, 1800),
  ]
  const animatedCapital = useAnimatedNumber(3, !factsView.visible, 1800)
  const animatedStartups70 = useAnimatedNumber(100, !factsView.visible, 1800)
  const animatedUnicorn = useAnimatedNumber(1, !factsView.visible, 1200)

  return (
    <>
      <Script id="iframe-height-sender" strategy="afterInteractive">
        {`
          function sendHeight() {
            const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            parent.postMessage({ type: "EMBED_HEIGHT", height: h }, "*");
          }
          window.addEventListener("load", sendHeight);
          const ro = new ResizeObserver(sendHeight);
          ro.observe(document.documentElement);
          document.addEventListener("DOMContentLoaded", sendHeight);
        `}
      </Script>

      <main className="min-h-screen bg-brand-dark-blue text-white overflow-x-hidden">

        {/* ═══════════════════════════ APPLICATION BANNER ═══════════════════════════ */}
        <Link href="/apply" className="block bg-brand-pink overflow-hidden py-1.5 cursor-pointer hover:brightness-110 transition-all">
          <div className="animate-scroll-slow whitespace-nowrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="text-white text-xs sm:text-sm tracking-wide mx-8">
                {applicationsClosed
                  ? "Summer Applications are now closed. Winter applications will open in October"
                  : "Summer Applications are open from 10 of April to 26 of April"}
              </span>
            ))}
          </div>
        </Link>

        {/* ═══════════════════════════ HERO — FULLSCREEN CROSSFADE ═══════════════════════════ */}
        <section className="relative w-full overflow-hidden h-[calc(100vh-5rem)] flex items-center">
          {/* Crossfading backgrounds — only render prev/current/next to avoid loading all 8 at once */}
          {heroImages.map((src, i) => {
            const isCurrent = heroIdx === i
            const isNext = (heroIdx + 1) % heroImages.length === i
            const isPrev = (heroIdx - 1 + heroImages.length) % heroImages.length === i
            if (!isCurrent && !isNext && !isPrev) return null
            return (
              <div
                key={src}
                className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: isCurrent ? 1 : 0 }}
              >
                <Image src={src} alt="" fill priority={i === 0} className="object-cover scale-[1.05]" />
              </div>
            )
          })}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-blue/90 via-brand-dark-blue/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-transparent to-transparent" />

          {/* Animated decorative blobs */}
          <div className="absolute top-20 right-[15%] w-[500px] h-[500px] bg-brand-pink/15 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-brand-pink/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] animate-blob animation-delay-4000" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className={`text-7xl sm:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] mb-8 transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-white drop-shadow-lg">DARE.</span><br />
                <span className="outline-text drop-shadow-lg">BUILD.</span><br />
                <span className="text-white drop-shadow-lg">BELONG.</span>
              </h1>

              <p className={`text-lg sm:text-xl text-gray-200 max-w-lg mb-6 leading-relaxed transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                START Munich is the largest student-run entrepreneurship community in Munich.
                We empower the next generation of founders to dare, build, and belong.
              </p>
              {applicationsOpen && (
                <Link
                  href="/join-start/2026"
                  className={`inline-flex items-center justify-center px-8 py-3 bg-brand-pink text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(208,0,111,0.4)] transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  Apply Now
                </Link>
              )}

            </div>

          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </section>

        {/* ═══════════════════════════ BACKED BY BRANDS ═══════════════════════════ */}
        <Link href="/partners" className="block overflow-hidden group cursor-pointer">
          <p className="text-center text-gray-500 text-sm tracking-[0.2em] uppercase mb-10 group-hover:text-brand-pink transition-colors">Backed by brands like:</p>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-dark-blue to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-dark-blue to-transparent z-10" />
            <div className="animate-scroll">
              {[...brandPartners, ...brandPartners].map((partner, i) => (
                <div key={`${partner.id}-${i}`} className="inline-flex items-center justify-center mx-9 h-[54px] opacity-80 hover:opacity-100 hover:-translate-y-px transition-all duration-200">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="h-[48px] w-auto max-w-[200px] object-contain grayscale"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = `<span class="text-white/70 font-bold text-base sm:text-lg tracking-tight">${partner.name}</span>`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* ═══════════════════════════ WHAT IS START? ═══════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Group Photo */}
            <div className="relative rounded-3xl overflow-hidden mb-16 h-[300px] sm:h-[400px] lg:h-[500px]">
              <Image
                src="/home/Landing_Team_1-opt.jpeg"
                alt="START Munich Community"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/60 via-transparent to-transparent" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left - Text Content */}
              <div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                  What is <span className="outline-text">START Munich</span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  With over 70 active members and 600+ alumni, START Munich is one of Germany’s leading student-run entrepreneurship initiatives. Founded in 2003, our mission is to build  
                  <span className=" font-semibold"> a community of students who dare to build, innovate, and lead.</span>
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  At START Munich, <span className="font-semibold">  aspiring and active entrepreneurs come together </span> to connect, collaborate, and grow. Together with our talented members, we host events such as pitch nights and founder talks, connect with industry partners and investors, or run hands-on programs that bridge academia with entrepreneurship.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Link href="/about-us" className="px-8 py-3 bg-brand-pink text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(208,0,111,0.4)] transition-all">
                    About Us
                  </Link>
                  <Link href="/events" className="px-8 py-3 bg-brand-pink text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(208,0,111,0.4)] transition-all">
                    See our Events
                  </Link>
                </div>
              </div>

              {/* Right - Stats Grid */}
              <div className="flex flex-col gap-6">
                {/* Academic Excellence Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-pink/30 transition-all">
                  <div className="flex items-center justify-center gap-8 mb-3">
                    <Image src="/forPartners/Logo_of_the_Technical_University_of_Munich.svg" alt="TUM" width={120} height={40} className="h-10 w-auto opacity-80" unoptimized />
                    <span className="text-white/30 text-2xl font-light">×</span>
                    <Image src="/home/LMU_Muenchen_Logo.svg" alt="LMU" width={120} height={40} className="h-10 w-auto opacity-80" unoptimized />
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider text-center">Academic Excellence</div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-pink/30 transition-all">
                    <div className="text-4xl sm:text-5xl font-black text-white mb-2">70<span className="text-brand-pink">+</span></div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">Active Members</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-pink/30 transition-all">
                    <div className="text-4xl sm:text-5xl font-black text-white mb-2">2003</div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">Founding Year</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-pink/30 transition-all">
                    <div className="text-4xl sm:text-5xl font-black text-white mb-2">600<span className="text-brand-pink">+</span></div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">Alumni</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-pink/30 transition-all">
                    <div className="text-4xl sm:text-5xl font-black text-white mb-2">65<span className="text-brand-pink">%</span></div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">STEM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ FACTS & STARTUPS ═══════════════════════════ */}
        <section ref={factsView.ref} className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">

          <div className="relative max-w-7xl mx-auto">
            {/* Section header */}
            <div className={`mb-10 transition-all duration-700 ${factsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="text-brand-pink text-sm font-bold tracking-[0.3em] uppercase">Our Startups</span>
              <h2 className="text-5xl sm:text-6xl font-black text-white mt-3">THE FACTS</h2>
            </div>

            {/* Facts - Modern asymmetric grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
              {/* Big featured stat - Capital Raised */}
              <div className={`md:col-span-7 relative group transition-all duration-700 delay-100 ${factsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative bg-gradient-to-br from-brand-pink/20 via-brand-pink/10 to-transparent border border-brand-pink/20 rounded-[2rem] p-10 sm:p-14 h-full overflow-hidden">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-bl-[80px]" />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-brand-pink/20 rounded-full" />

                  <div className="relative">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-[0.2em] mb-4">Capital Raised</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-7xl sm:text-8xl lg:text-[120px] font-black text-white leading-none tabular-nums">
                        €{Math.round(animatedCapital)}<span className="text-brand-pink">B+</span>
                      </span>
                    </div>
                    <p className="text-gray-400 mt-6 max-w-sm">Raised by our alumni founders and community startups.</p>
                  </div>
                </div>
              </div>

              {/* Stacked stats */}
              <div className="md:col-span-5 flex flex-col gap-6">
                {/* Startups */}
                <div className={`relative group flex-1 transition-all duration-700 delay-200 ${factsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="relative bg-white/5 border border-white/10 rounded-[1.5rem] p-8 h-full hover:border-brand-pink/30 hover:bg-white/[0.07] transition-all duration-300">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em] mb-2">Startups</div>
                        <div className="text-5xl sm:text-6xl font-black text-white tabular-nums">
                          {Math.round(animatedStartups70)}<span className="text-brand-pink">+</span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-brand-pink/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two side-by-side stats */}
                <div className="flex gap-6">
                  {/* YC & Top Programs */}
                  <div className={`flex-1 transition-all duration-700 delay-300 ${factsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="relative bg-white/5 border border-white/10 rounded-[1.5rem] p-6 h-full hover:border-brand-pink/30 hover:bg-white/[0.07] transition-all duration-300">
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em] mb-2">YC & other programs</div>
                      <div className="text-4xl sm:text-5xl font-black text-white tabular-nums">
                        {Math.round(animatedValues[3])}<span className="text-brand-pink">+</span>
                      </div>
                      <div className="mt-3 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 4 ? 'bg-brand-pink' : 'bg-white/10'}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Unicorn */}
                  <div className={`flex-1 transition-all duration-700 delay-400 ${factsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="relative bg-white/5 border border-white/10 rounded-[1.5rem] p-6 h-full hover:border-brand-pink/30 hover:bg-white/[0.07] transition-all duration-300">
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em] mb-2">Unicorn</div>
                      <div className="text-4xl sm:text-5xl font-black text-white tabular-nums">
                        {Math.round(animatedUnicorn)}
                      </div>
                      <div className="mt-2 flex gap-1">
                        <div className="h-1.5 w-full rounded-full bg-brand-pink" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Startup logos */}
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-dark-blue to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-dark-blue to-transparent z-10" />
              <div className="animate-scroll-nonstop">
                {[...featuredStartups, ...featuredStartups].map((startup, i) => (
                  <Link key={`${startup.id}-${i}`} href="/startups" className="inline-flex items-center justify-center mx-6 flex-shrink-0">
                    <div className="bg-white rounded-xl p-4 w-36 h-20 flex items-center justify-center hover:border-brand-pink/30 hover:scale-105 transition-all duration-300">
                      <img
                        src={startup.logoUrl}
                        alt={startup.name}
                        loading="lazy"
                        className="max-h-10 max-w-[100px] object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.innerHTML = `<span class="text-sm text-white/80 font-bold text-center">${startup.name}</span>`
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <Link href="/startups" className="group inline-flex items-center gap-2 text-white/70 hover:text-brand-pink font-medium transition-colors">
                View all our startups <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ LATEST NEWS ═══════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Header with social links on left + navigation arrows on right */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-brand-pink text-sm font-bold tracking-[0.3em] uppercase">Stay Updated</span>
                  <h2 className="text-5xl sm:text-6xl font-black text-white mt-3">LATEST NEWS</h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:self-end sm:mb-1">
                  <Link href="https://www.linkedin.com/company/start-munich/" target="_blank" className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:border-brand-pink/50 hover:bg-brand-pink/10 transition-all duration-300">
                    <svg className="w-4 h-4 text-white group-hover:text-brand-pink transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    <span className="text-white text-sm font-medium group-hover:text-brand-pink transition-colors">LinkedIn</span>
                  </Link>
                  <Link href="https://www.instagram.com/startmunich/" target="_blank" className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:border-brand-pink/50 hover:bg-brand-pink/10 transition-all duration-300">
                    <svg className="w-4 h-4 text-white group-hover:text-brand-pink transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                    <span className="text-white text-sm font-medium group-hover:text-brand-pink transition-colors">Instagram</span>
                  </Link>
                </div>
              </div>

              {/* Page counter + navigation arrows — hidden on mobile */}
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-gray-500 tabular-nums">
                  {String(Math.floor(newsIndex / 3) + 1).padStart(2, '0')} / {String(Math.ceil(initialNews.length / 3)).padStart(2, '0')}
                </span>
                <button
                  onClick={() => setNewsIndex(Math.max(0, newsIndex - 3))}
                  disabled={newsIndex === 0}
                  className="w-12 h-12 rounded-full border-2 border-white/20 hover:border-brand-pink hover:bg-brand-pink text-white flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setNewsIndex(Math.min(Math.max(0, initialNews.length - 3), newsIndex + 3))}
                  disabled={newsIndex + 3 >= initialNews.length}
                  className="w-12 h-12 rounded-full bg-brand-pink hover:bg-brand-pink/80 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* News Cards */}
            {(() => {
              const renderCard = (item: NewsItem) => (
                <Link key={item.id} href={item.url} target="_blank" className="group relative">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/30 to-purple-900/50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-white font-bold text-xl mb-1">{item.title}</div>
                      <p className="text-white/70 text-sm">{item.description}</p>
                    </div>
                    <div className="absolute top-6 right-6 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
              return (
                <>
                  {/* Desktop: paginated 3-column grid */}
                  <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {initialNews.slice(newsIndex, newsIndex + 3).map(renderCard)}
                  </div>
                  {/* Mobile: stacked with show more */}
                  <div className="flex flex-col gap-6 md:hidden">
                    {(showAllNews ? initialNews : initialNews.slice(0, 3)).map(renderCard)}
                    {!showAllNews && initialNews.length > 3 && (
                      <button
                        onClick={() => setShowAllNews(true)}
                        className="w-full py-4 border border-white/20 rounded-2xl text-white/70 font-medium hover:border-brand-pink/50 hover:text-white transition-all duration-300"
                      >
                        Show more
                      </button>
                    )}
                  </div>
                </>
              )
            })()}
          </div>
        </section>

        {/* ═══════════════════════════ START NETWORK ═══════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="mb-10">
              <span className="text-brand-pink text-sm font-bold tracking-[0.3em] uppercase">Global Community</span>
              <h2 className="text-5xl sm:text-6xl font-black text-white mt-3">START NETWORK</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left side - Text & Stats */}
              <div className="relative">
                <p className="text-gray-300 text-lg leading-relaxed mb-16 max-w-md">
                  We&apos;re a part of the sprawling START Network. This interconnection multiplies our potential across the world, allowing us to draw inspiration from diverse cultures, share insights, and create an ecosystem that nurtures collective progress.
                </p>

                {/* Globe illustration */}
                <div className="absolute -bottom-10 -left-10 w-72 h-72 opacity-15">
                  <svg viewBox="0 0 200 200" className="w-full h-full text-white">
                    {/* Outer circle */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    {/* Horizontal lines */}
                    <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="currentColor" strokeWidth="1" />
                    <ellipse cx="100" cy="100" rx="80" ry="55" fill="none" stroke="currentColor" strokeWidth="0.75" />
                    <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.75" />
                    {/* Vertical lines */}
                    <ellipse cx="100" cy="100" rx="30" ry="80" fill="none" stroke="currentColor" strokeWidth="1" />
                    <ellipse cx="100" cy="100" rx="55" ry="80" fill="none" stroke="currentColor" strokeWidth="0.75" />
                    <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.75" />
                  </svg>
                </div>

                {/* Stats */}
                <div className="flex gap-8 sm:gap-16 relative z-10">
                  <div>
                    <div className="text-5xl sm:text-6xl font-black text-white">22</div>
                    <div className="text-gray-400 text-sm">Cities</div>
                  </div>
                  <div>
                    <div className="text-5xl sm:text-6xl font-black text-white">17</div>
                    <div className="text-gray-400 text-sm">Countries</div>
                  </div>
                  <div>
                    <div className="text-5xl sm:text-6xl font-black text-white">+1800</div>
                    <div className="text-gray-400 text-sm">Members</div>
                  </div>
                </div>
              </div>

              {/* Right side - City names rolling */}
              <div className="relative h-[400px] overflow-hidden">

                {/* Fade overlays */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-brand-dark-blue to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-brand-dark-blue to-transparent z-10" />

                <div className="mt-12 text-right animate-scroll-vertical">
                  {['BERLIN', 'BARCELONA', 'HAMBURG', 'HELSINKI', 'LAUSANNE', 'LONDON', 'LIMA', 'LISBON', 'MAASTRICHT', 'MEXICO CITY', 'MILANO', 'MUNICH', 'PARIS', 'NUREMBERG', 'QUITO', 'SÃO PAULO', 'STUTTGART', 'VADUZ', 'VIENNA', 'WARSAW', 'ST. GALLEN', 'BERLIN', 'BARCELONA', 'HAMBURG', 'HELSINKI', 'LAUSANNE', 'LONDON', 'LIMA', 'LISBON', 'MAASTRICHT', 'MEXICO CITY', 'MILANO', 'MUNICH', 'PARIS', 'NUREMBERG', 'QUITO', 'SÃO PAULO', 'STUTTGART', 'VADUZ', 'VIENNA', 'WARSAW', 'ST. GALLEN'].map((city, i) => (
                    <div
                      key={`${city}-${i}`}
                      className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.2] ${city === 'MUNICH' || (i % 21) % 4 === 3 ? 'text-brand-pink' :
                          (i % 21) % 4 === 0 ? 'bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent' :
                            (i % 21) % 4 === 1 ? 'text-white' :
                              'bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent'
                        }`}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ ABOUT START ═══════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left side - Content */}
              <div>
                <span className="text-brand-pink text-sm font-bold tracking-[0.3em] uppercase">About START Munich</span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-8 leading-tight">
                  Driven by passion. <span className="outline-text">Built by students.</span>
                </h2>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  START Munich is the largest student-run entrepreneurship initiative in Munich, empowering the next generation of founders through education, networking, and hands-on experience.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  We believe in the power of student-driven innovation and provide a platform where bold ideas can become reality.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {['Education', 'Community', 'Hands-on experience'].map((tag) => (
                    <span key={tag} className="px-5 py-2 border border-brand-pink/30 rounded-full text-white text-sm hover:bg-brand-pink/10 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href="/member-journey" className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-pink text-white font-bold rounded-xl text-lg hover:shadow-[0_0_40px_rgba(208,0,111,0.4)] transition-all mb-10">
                  <span>Discover How Our Community Is Run</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              {/* Right side - Image */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border-2 border-white/10 relative h-[500px] lg:h-[600px]">
                  <Image
                    src="/home/good-opt.png"
                    alt="START Munich Event"
                    fill
                    loading="lazy"
                    className="object-cover object-right"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/50 via-transparent to-transparent"></div>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-pink/20 rounded-full blur-[60px]" />
              </div>
            </div>
          </div>
        </section>

      </main>

      <style jsx global>{`
        .tabular-nums { font-variant-numeric: tabular-nums; }
      `}</style>
    </>
  )
}
