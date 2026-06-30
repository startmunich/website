'use client';

import { useEffect, useState } from 'react';

import CTA from '@/components/CTA';
import Hero from '@/components/Hero';
import HeroCard from '@/components/HeroCard';
import type { Company } from '@/lib/types';
import { useAnimatedNumber } from '@/lib/useAnimatedNumber';

import StartupCard from './StartupCard';

export const dynamic = 'force-dynamic';
import Script from 'next/script';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Fetch companies from API
async function fetchCompanies(): Promise<Company[]> {
  try {
    // Use absolute URL in production, relative in development
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/startups`, {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch startups');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching startups:', error);
    return [];
  }
}

export default function StartupsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Reduced to approximate 3000px height (about 5-6 cards)

  // Tooltip states for section explanations
  const [showFeaturedInfo, setShowFeaturedInfo] = useState(false);
  const [showYCInfo, setShowYCInfo] = useState(false);
  const [showEWORInfo, setShowEWORInfo] = useState(false);

  // Load companies on mount
  useEffect(() => {
    // sessionStorage can throw in private mode, sandboxed iframes, or when
    // disabled — guard every access so a hostile context never aborts the
    // mount effect.
    const safeGet = (key: string): string | null => {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    };
    const safeRemove = (key: string) => {
      try {
        sessionStorage.removeItem(key);
      } catch {
        // non-fatal
      }
    };

    const restoreScroll = () => {
      // Double rAF waits for React's commit AND the next paint, so the page
      // has its full height before we try to scroll into it. A single rAF
      // can fire before paint and silently clip the scroll on tall lists.
      const savedScroll = safeGet('startups-scroll');
      if (savedScroll) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, parseInt(savedScroll));
            safeRemove('startups-scroll');
          });
        });
      }
    };

    const loadCompanies = async () => {
      // Returning from a detail page: hydrate synchronously from the
      // sessionStorage cache so we skip the loading flash and the scroll
      // restoration lands on the same paint as the rendered list.
      const savedScroll = safeGet('startups-scroll');
      const cached = savedScroll ? safeGet('startups-data') : null;
      if (cached) {
        try {
          const parsed: unknown = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setCompanies(parsed as Company[]);
            setLoading(false);
            restoreScroll();
            return;
          }
          // Wrong shape — fall through to a fresh fetch.
        } catch {
          // Cache is corrupt — fall through to a fresh fetch.
        }
      }

      setLoading(true);
      const data = await fetchCompanies();
      setCompanies(data);
      setLoading(false);
      try {
        sessionStorage.setItem('startups-data', JSON.stringify(data));
      } catch {
        // Storage full or unavailable — non-fatal.
      }
      restoreScroll();
    };
    loadCompanies();
  }, []);

  // Extract unique categories
  const allCategories = Array.from(
    new Set(companies.flatMap((company) => company.category)),
  ).sort();

  // Extract unique founding years
  const allYears = Array.from(
    new Set(companies.map((company) => company.foundingYear.toString())),
  ).sort();

  // Filter companies based on all selected filters
  const filteredCompanies = companies.filter((company) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      company.category.some((cat) => cat.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesYear = selectedYear === 'all' || company.foundingYear.toString() === selectedYear;

    const matchesSearch =
      searchQuery === '' ||
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.founders.some((founder) =>
        founder.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesCategory && matchesYear && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedYear, searchQuery]);

  // Calculate total statistics
  const totalStartups = companies.length + 30;

  // Get spotlight startups (show all featured startups)
  const spotlightStartups = companies.filter((company) => company.isSpotlight);

  // Get Y Combinator startups (show all YC alumni)
  const yCombinatorStartups = companies.filter((company) => company.isYCombinator);

  // Get EWOR startups
  const eworStartups = companies.filter((company) => company.isEWOR);

  // Use animated number hook for statistics - hardcoded 3B+ funding
  const animatedStartups = useAnimatedNumber(totalStartups, loading);
  const animatedFunding = useAnimatedNumber(3, loading);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-2xl font-bold text-[#00002c]">Loading startups...</p>
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

          // initial + on changes
          window.addEventListener("load", sendHeight);
          const ro = new ResizeObserver(sendHeight);
          ro.observe(document.documentElement);
          document.addEventListener("DOMContentLoaded", sendHeight);
        `}
      </Script>

      <main className="min-h-screen overflow-x-hidden bg-[#00002c]">
        {/* Hero Section with Full-Width Image */}
        <Hero
          backgroundImage="/ourStartups/hero-opt.jpg"
          title={
            <>
              START MUNICH
              <br />
              <span className="outline-text">STARTUPS</span>
            </>
          }
          description="Discover the innovative companies built by our community of ambitious student entrepreneurs"
        >
          <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-6">
            {/** Stat 1 **/}
            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent transition lg:text-6xl">
                  {Math.floor(animatedStartups)}
                </span>
                <span className="text-xl font-bold text-[#d0006f] lg:text-3xl">+</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Companies</p>
            </HeroCard>

            {/** Stat 2 **/}
            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-1">
                <span className="text-lg font-bold text-[#d0006f] lg:text-2xl">€</span>
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent transition lg:text-6xl">
                  {Math.floor(animatedFunding)}
                </span>
                <span className="text-xl font-bold text-[#d0006f] lg:text-3xl">B+</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Funding</p>
            </HeroCard>
          </div>
        </Hero>

        {/* Content Below Hero */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-20">
          {/* Growth Champions Section */}
          {spotlightStartups.length > 0 && (
            <div className="mb-16">
              <div className="mb-10">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-white md:text-4xl">Featured Startups</h2>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowFeaturedInfo(true)}
                    onMouseLeave={() => setShowFeaturedInfo(false)}
                  >
                    <button
                      className="cursor-pointer text-[#d0006f] transition-all duration-300 hover:scale-110 hover:text-[#ff0080]"
                      aria-label="Info about Featured Startups"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    {showFeaturedInfo && (
                      <div className="absolute right-0 top-full z-50 mt-3 w-72 animate-[fadeIn_0.2s_ease-out] rounded-xl border-2 border-[#d0006f]/60 bg-gradient-to-br from-[#1a1a3e] to-[#0d0d1f] p-5 shadow-2xl shadow-[#d0006f]/20 backdrop-blur-xl sm:left-0 sm:right-auto sm:w-96">
                        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 transform border-l-2 border-t-2 border-[#d0006f]/60 bg-[#1a1a3e] sm:left-6 sm:right-auto"></div>
                        <div className="absolute right-1 top-1 h-16 w-16 rounded-full bg-[#d0006f]/10 blur-2xl"></div>
                        <div className="relative">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d0006f]"></div>
                            <h4 className="text-sm font-bold uppercase tracking-wide text-[#d0006f]">
                              Featured Startups
                            </h4>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-300">
                            These startups are super successful and have achieved a valuation of
                            over €10 million, showcasing exceptional growth and market impact.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {spotlightStartups.map((company) => (
                  <StartupCard
                    key={company.id}
                    id={company.id}
                    name={company.name}
                    logoUrl={company.logoUrl}
                    summary={company.summary}
                    isMTZ={company.isMTZ}
                    accentColor="bg-blue-300/20"
                    badge={{
                      text: '★',
                      color: 'text-yellow-400',
                      bgColor: 'bg-yellow-500/20',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* MTZ Location Partner Info Card */}
          <div className="relative mb-16 overflow-hidden rounded-2xl border-2 border-[#d0006f]/50 bg-gradient-to-br from-[#1a1a3e] via-[#00002c] to-[#0d0d1f] shadow-2xl shadow-[#d0006f]/20">
            {/* Decorative Elements */}
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d0006f]/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#d0006f]/5 blur-3xl"></div>

            <div className="relative p-8 md:p-10">
              <div className="flex flex-col items-start gap-8 lg:flex-row">
                {/* Left Side - Content */}
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-[#d0006f]/20 p-2">
                      <svg
                        className="h-6 w-6 text-[#d0006f]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white md:text-3xl">
                      Our Location Partner: MTZ
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="leading-relaxed text-gray-300">
                      Startups with the{' '}
                      <span className="mx-1 inline-flex items-center rounded bg-[#d0006f] px-2 py-0.5 text-xs font-semibold text-white">
                        MTZ
                      </span>{' '}
                      label are located at our location partner, the{' '}
                      <strong className="text-white">MTZ (Münchner Technologiezentrum)</strong>, one
                      of Munich&apos;s leading innovation hubs. START Munich is also located at the
                      MTZ, fostering a vibrant community of entrepreneurs and innovators.
                    </p>

                    <div className="flex flex-col gap-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-[#d0006f]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <span>Agnes-Pockels-Bogen 1, 80992 München</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-[#d0006f]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Home to START Munich and innovative startups</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Map */}
                <div className="h-52 w-full overflow-hidden rounded-xl border-2 border-[#d0006f]/40 shadow-lg lg:h-64 lg:w-80">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=11.530690491199495%2C48.17274171704395%2C11.53356581926346%2C48.17436585858368&amp;layer=mapnik&amp;marker=48.173553794244306%2C11.532128155231476"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Y Combinator Section */}
          {yCombinatorStartups.length > 0 && (
            <div className="mb-16">
              <div className="mb-10">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-white md:text-4xl">
                    Y Combinator Alumni
                  </h2>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowYCInfo(true)}
                    onMouseLeave={() => setShowYCInfo(false)}
                  >
                    <button
                      className="cursor-pointer text-[#d0006f] transition-all duration-300 hover:scale-110 hover:text-[#ff0080]"
                      aria-label="Info about Y Combinator"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    {showYCInfo && (
                      <div className="absolute right-0 top-full z-50 mt-3 w-72 animate-[fadeIn_0.2s_ease-out] rounded-xl border-2 border-[#d0006f]/60 bg-gradient-to-br from-[#1a1a3e] to-[#0d0d1f] p-5 shadow-2xl shadow-[#d0006f]/20 backdrop-blur-xl sm:left-0 sm:right-auto sm:w-96">
                        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 transform border-l-2 border-t-2 border-[#d0006f]/60 bg-[#1a1a3e] sm:left-6 sm:right-auto"></div>
                        <div className="absolute right-1 top-1 h-16 w-16 rounded-full bg-[#d0006f]/10 blur-2xl"></div>
                        <div className="relative">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d0006f]"></div>
                            <h4 className="text-sm font-bold uppercase tracking-wide text-[#d0006f]">
                              Y Combinator
                            </h4>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-300">
                            Y Combinator is the world&apos;s most prestigious startup accelerator,
                            having funded over 4,000 companies including Airbnb, Dropbox, Stripe,
                            and Reddit. These alumni have gone through YC&apos;s intensive 3-month
                            program.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {yCombinatorStartups.map((company) => (
                  <StartupCard
                    key={company.id}
                    id={company.id}
                    name={company.name}
                    logoUrl={company.logoUrl}
                    summary={company.summary}
                    isMTZ={company.isMTZ}
                    accentColor="bg-blue-300/20"
                    badge={{
                      text: 'YC',
                      color: 'text-orange-400',
                      bgColor: 'bg-orange-500/20',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* EWOR Section */}
          {eworStartups.length > 0 && (
            <div className="mb-16">
              <div className="mb-10">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-white md:text-4xl">EWOR Alumni</h2>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowEWORInfo(true)}
                    onMouseLeave={() => setShowEWORInfo(false)}
                  >
                    <button
                      className="cursor-pointer text-[#d0006f] transition-all duration-300 hover:scale-110 hover:text-[#ff0080]"
                      aria-label="Info about EWOR"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    {showEWORInfo && (
                      <div className="absolute right-0 top-full z-50 mt-3 w-72 animate-[fadeIn_0.2s_ease-out] rounded-xl border-2 border-[#d0006f]/60 bg-gradient-to-br from-[#1a1a3e] to-[#0d0d1f] p-5 shadow-2xl shadow-[#d0006f]/20 backdrop-blur-xl sm:left-0 sm:right-auto sm:w-96">
                        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 transform border-l-2 border-t-2 border-[#d0006f]/60 bg-[#1a1a3e] sm:left-6 sm:right-auto"></div>
                        <div className="absolute right-1 top-1 h-16 w-16 rounded-full bg-[#d0006f]/10 blur-2xl"></div>
                        <div className="relative">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d0006f]"></div>
                            <h4 className="text-sm font-bold uppercase tracking-wide text-[#d0006f]">
                              EWOR
                            </h4>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-300">
                            EWOR is a global fellowship program that supports ambitious founders by
                            providing funding, mentorship, and a community of exceptional
                            entrepreneurs building the next generation of impactful companies.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {eworStartups.map((company) => (
                  <StartupCard
                    key={company.id}
                    id={company.id}
                    name={company.name}
                    logoUrl={company.logoUrl}
                    summary={company.summary}
                    isMTZ={company.isMTZ}
                    accentColor="bg-blue-300/20"
                    badge={{
                      text: 'EWOR',
                      color: 'text-blue-400',
                      bgColor: 'bg-blue-500/20',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Join Our Startups - Innovative CTA Section */}
          <div className="relative mb-16">
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#d0006f]">
              <div className="relative rounded-xl bg-[#00002c] p-8 md:p-12">
                {/* Floating animated orbs */}
                <div className="animate-blob absolute right-10 top-10 h-32 w-32 rounded-full bg-[#d0006f]/30 blur-3xl"></div>
                <div className="animate-blob animation-delay-2000 absolute bottom-10 left-10 h-40 w-40 rounded-full bg-[#d0006f]/20 blur-3xl"></div>

                <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
                  {/* Left Side - Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d0006f]/40 bg-[#d0006f]/20 px-3 py-1.5">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#d0006f]">
                        We&apos;re Hiring
                      </span>
                    </div>

                    <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                      Join the <span className="text-[#d0006f]">Next Big Thing</span>
                    </h2>

                    <p className="mb-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                      Our startups are looking for talented individuals to join their teams. Explore
                      open positions and be part of building innovative products that matter.
                    </p>
                  </div>

                  {/* Right Side - CTA Button */}
                  <div className="flex-shrink-0">
                    <a
                      href="https://jobs.startmunich.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#d0006f] to-pink-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:from-[#d0006f] hover:to-[#d0006f] hover:shadow-2xl hover:shadow-[#d0006f]/50"
                    >
                      <span className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[200%]"></span>
                      <span className="relative">Explore Jobs</span>
                      <svg
                        className="relative h-5 w-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-12 rounded-lg border border-white/10 bg-white/5 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Category Filter */}
              <div>
                <label
                  htmlFor="category-filter"
                  className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full border-white/20 bg-white/5 text-white transition-all hover:bg-white/10 focus:ring-1 focus:ring-white/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Founding Year Filter */}
              <div>
                <label
                  htmlFor="year-filter"
                  className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  Founded
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full border-white/20 bg-white/5 text-white transition-all hover:bg-white/10 focus:ring-1 focus:ring-white/30">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {allYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Bar and Clear Filters */}
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <label
                  htmlFor="search-input"
                  className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  Search by Name or Founder
                </label>
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type startup or founder name..."
                  className="w-full rounded border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 transition-all hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedYear('all');
                    setSearchQuery('');
                  }}
                  className="w-full whitespace-nowrap rounded border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition-all hover:border-white/30 hover:bg-white/20 lg:w-auto"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Company List - Grid Layout */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedCompanies.map((company) => (
              <StartupCard
                key={company.id}
                id={company.id}
                name={company.name}
                logoUrl={company.logoUrl}
                summary={company.summary}
                category={company.category}
                foundingYear={company.foundingYear}
                founders={company.founders}
                isMTZ={company.isMTZ}
                showDetails={true}
              />
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-block rounded-lg border border-white/20 bg-white/5 p-12">
                <p className="mb-2 text-xl font-semibold text-white">No Results Found</p>
                <p className="text-sm text-gray-400">
                  Try adjusting your filters to see more startups
                </p>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredCompanies.length > 0 && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded border border-white/20 bg-white/10 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-white text-[#00002c]'
                        : 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded border border-white/20 bg-white/10 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA Section */}
        <div className="mx-auto mt-12 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <CTA
            title="Want to Start Your Own Journey?"
            description={
              <>
                Join START Munich and get the support, network, and resources you need to turn your
                idea into reality. Our community has helped launch 100+ startups — yours could be
                next.
              </>
            }
            buttons={[
              { label: 'Discover the Member Journey', href: '/member-journey' },
              { label: 'Apply Now', href: '/join-start/2026', variant: 'secondary' },
            ]}
          />
        </div>
      </main>
    </>
  );
}
