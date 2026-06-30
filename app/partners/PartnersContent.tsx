'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import CTA from '@/components/CTA';
import Hero from '@/components/Hero';
import HeroCard from '@/components/HeroCard';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Partner {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
}

// Fetch partners from API
async function fetchPartners(): Promise<Partner[]> {
  try {
    // Use absolute URL in production, relative in development
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/partners`, {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch partners');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

interface PartnersByCategory {
  [category: string]: Partner[];
}

const CATEGORY_ORDER = [
  'TECHNOLOGY',
  'RESEARCH',
  'VENTURE CAPITAL',
  'ECOSYSTEM',
  'INITIATIVES',
  'STARTUP',
  'INDUSTRY',
  'OTHER',
];

export default function PartnersPage() {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersByCategory, setPartnersByCategory] = useState<PartnersByCategory>({});
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Animation states for numbers
  const [animatedPartners, setAnimatedPartners] = useState(0);
  const [animatedCategories, setAnimatedCategories] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      const data = await fetchPartners();
      setPartners(data);

      // Group partners by category
      const grouped = data.reduce((acc: PartnersByCategory, partner) => {
        const category = partner.category ? partner.category.toUpperCase() : 'OTHER';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(partner);
        return acc;
      }, {});

      setPartnersByCategory(grouped);
      setLoading(false);
    };

    loadPartners();
  }, []);

  // Calculate stats
  const totalPartners = partners.length;
  // Count unique categories actually present in data
  const totalCategories = Object.keys(partnersByCategory).length;

  // Animate numbers
  useEffect(() => {
    if (!loading && !hasAnimatedRef.current && totalPartners > 0) {
      hasAnimatedRef.current = true;

      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const interval = duration / steps;

      const partnersIncrement = totalPartners / steps;
      const categoriesIncrement = totalCategories / steps;

      let partnersCurrent = 0;
      let categoriesCurrent = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        partnersCurrent += partnersIncrement;
        categoriesCurrent += categoriesIncrement;

        if (step >= steps) {
          setAnimatedPartners(totalPartners);
          setAnimatedCategories(totalCategories);
          clearInterval(timer);
        } else {
          setAnimatedPartners(partnersCurrent);
          setAnimatedCategories(categoriesCurrent);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [loading, totalPartners, totalCategories]);

  // Sort categories based on predefined order
  const sortedCategories = Object.keys(partnersByCategory).sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    if (category === 'ALL') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = categoryRefs.current[category];
    if (element) {
      const yOffset = -180; // Offset for sticky navigation (80px) + filter bar (~100px)
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filteredPartners = (category: string) => {
    const categoryPartners = partnersByCategory[category] || [];
    if (!searchQuery) return categoryPartners;
    return categoryPartners.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-dark-blue px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-brand-pink border-t-transparent"></div>
          <p className="animate-pulse text-2xl font-bold tracking-widest text-white">
            LOADING PARTNERS...
          </p>
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

      <main className="min-h-screen bg-brand-dark-blue selection:bg-brand-pink selection:text-white">
        {/* Hero Section - Restored Old Style with Stats Added */}
        <Hero
          backgroundImage="/ourPartners/hero1-opt.png"
          title={
            <>
              OUR
              <br />
              <span className="outline-text">PARTNERS</span>
            </>
          }
          description="Powering the next generation of entrepreneurs through world-class collaboration."
        >
          <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-6">
            {/** Stat 1 **/}
            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent transition lg:text-6xl">
                  {Math.floor(animatedPartners)}
                </span>
                <span className="text-xl font-bold text-brand-pink lg:text-3xl">+</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Partners</p>
            </HeroCard>

            {/** Stat 2 **/}
            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent transition lg:text-6xl">
                  {Math.floor(animatedCategories)}
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Industries
              </p>
            </HeroCard>
          </div>
        </Hero>

        {/* Sticky Filter & Search Bar */}
        <div className="sticky top-20 z-40 border-b border-white/10 bg-brand-dark-blue/95 shadow-2xl backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              {/* Category Pills */}
              <div className="scrollbar-hide no-scrollbar flex w-full gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
                <button
                  onClick={() => scrollToCategory('ALL')}
                  className={cn(
                    'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300',
                    activeCategory === 'ALL'
                      ? 'border-brand-pink bg-brand-pink text-white shadow-[0_0_15px_rgba(208,0,111,0.5)]'
                      : 'border-white/20 bg-transparent text-gray-400 hover:border-white/50 hover:text-white',
                  )}
                >
                  All
                </button>
                {sortedCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    className={cn(
                      'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300',
                      activeCategory === category
                        ? 'border-brand-pink bg-brand-pink text-white shadow-[0_0_15px_rgba(208,0,111,0.5)]'
                        : 'border-white/20 bg-transparent text-gray-400 hover:border-white/50 hover:text-white',
                    )}
                  >
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-52">
                <div className="pointer-events-none absolute inset-y-1 left-0 flex items-center pl-3">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search partner..."
                  className="block w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-500 transition duration-150 ease-in-out focus:border-brand-pink focus:bg-white/10 focus:outline-none sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Below Hero */}
        <div className="mx-auto max-w-7xl space-y-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          {sortedCategories.map((categoryName) => {
            const partnersToShow = filteredPartners(categoryName);
            if (partnersToShow.length === 0) return null;

            return (
              <div
                key={categoryName}
                ref={(el) => {
                  categoryRefs.current[categoryName] = el;
                }}
                className="scroll-mt-44"
              >
                <div className="mb-8 flex items-end gap-4 border-b border-white/10 pb-4">
                  <h2 className="text-3xl font-black text-white md:text-4xl">
                    {categoryName.toUpperCase().split(' ')[0]}{' '}
                    <span className="outline-text">
                      {categoryName.toUpperCase().split(' ').slice(1).join(' ') || ''}
                    </span>
                  </h2>
                  <span className="mb-2 font-mono text-lg text-gray-500">
                    ({partnersToShow.length})
                  </span>
                </div>

                {/* Partners Grid */}
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {partnersToShow.map((partner: Partner) => (
                    <div key={partner.id} className="group relative">
                      {/* Logo Card - Reverted to Original Styling */}
                      <div className="relative flex h-32 items-center justify-center rounded-2xl border-2 border-transparent bg-white p-6 transition-all duration-300 group-hover:scale-105 group-hover:border-brand-pink group-hover:shadow-xl group-hover:shadow-brand-pink/20">
                        {/* Partner logos have variable aspect ratios and use DOM-mutation
                            fallback on error; next/image would not preserve either. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain transition-all duration-300"
                          onError={(e) => {
                            // Fallback to initials if logo fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'text-2xl font-bold text-gray-600';
                              fallback.textContent = partner.name
                                .split(' ')
                                .map((w: string) => w[0])
                                .join('')
                                .slice(0, 2);
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>

                      {/* Partner Name */}
                      <div className="mt-3 text-center">
                        <p className="text-sm font-bold text-white transition-colors duration-300 group-hover:text-brand-pink">
                          {partner.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Become a Partner CTA */}
          <CTA
            title="Join the Ecosystem"
            description="Become a partner and connect with the most ambitious talents from Munich's leading universities. Collaborate on sponsor events, host workshops, and gain access to a vibrant community of future innovators."
            layout="split"
            buttons={[
              { label: 'View Partnership Benefits', href: '/for-partners' },
              { label: 'Contact Us', href: 'https://tally.so/r/3xpGQG', variant: 'secondary' },
            ]}
          />
        </div>
      </main>
    </>
  );
}
