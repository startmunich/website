'use client';

import { SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { CtaBanner } from '@/components/site/cta-banner';
import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { EmptyState } from '@/components/site/empty-state';
import { LogoImage, LogoTile } from '@/components/site/logo-image';
import { PageHero } from '@/components/site/page-hero';
import { HeroStat, HeroStats } from '@/components/site/stat';
import { Input } from '@/components/ui/input';
import { Container, Section } from '@/components/ui/section';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Heading } from '@/components/ui/typography';

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

const titleCase = (category: string) => category.charAt(0) + category.slice(1).toLowerCase();

export default function PartnersContent() {
  const [loading, setLoading] = useState(true);
  const [partnersByCategory, setPartnersByCategory] = useState<Record<string, Partner[]>>({});
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetchPartners().then((data) => {
      const grouped: Record<string, Partner[]> = {};
      for (const partner of data) {
        const category = partner.category ? partner.category.toUpperCase() : 'OTHER';
        (grouped[category] ??= []).push(partner);
      }
      setPartnersByCategory(grouped);
      setLoading(false);
    });
  }, []);

  const totalPartners = Object.values(partnersByCategory).flat().length;
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
      // Offset for the sticky header (80px) + filter bar (~100px)
      const y = element.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filteredPartners = (category: string) => {
    const partners = partnersByCategory[category] ?? [];
    if (!searchQuery) return partners;
    return partners.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  return (
    <>
      <EmbedHeightReporter />

      <PageHero
        image="/ourPartners/hero1-opt.png"
        title="Our"
        outlineTitle="Partners"
        description="Powering the next generation of entrepreneurs through world-class collaboration."
        aside={
          !loading &&
          totalPartners > 0 && (
            <HeroStats>
              <HeroStat label="Partners" value={totalPartners} animate suffix="+" />
              <HeroStat label="Industries" value={sortedCategories.length} animate />
            </HeroStats>
          )
        }
      />

      <div className="sticky top-20 z-40 border-b border-border bg-background/95 shadow-2xl backdrop-blur-md">
        <Container className="flex flex-col items-center justify-between gap-4 py-4 md:flex-row">
          <ToggleGroup
            variant="pill"
            size="lg"
            value={[activeCategory]}
            onValueChange={(value) => value[0] && scrollToCategory(value[0])}
            className="no-scrollbar w-full overflow-x-auto pb-1 md:w-auto md:pb-0"
          >
            <ToggleGroupItem value="ALL">All</ToggleGroupItem>
            {sortedCategories.map((category) => (
              <ToggleGroupItem key={category} value={category}>
                {titleCase(category)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="relative w-full md:w-56">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search partners"
              placeholder="Search partner..."
              className="h-10 rounded-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Container>
      </div>

      <Section spacing="sm" className="lg:py-20" containerClassName="flex flex-col gap-24">
        {loading ? (
          <div
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            aria-busy
            aria-label="Loading partners"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : sortedCategories.length === 0 ? (
          <EmptyState description="Our partner list is being updated — check back soon." />
        ) : (
          sortedCategories.map((category) => {
            const partners = filteredPartners(category);
            if (partners.length === 0) return null;
            const [first, ...rest] = category.split(' ');
            return (
              <div
                key={category}
                ref={(el) => {
                  categoryRefs.current[category] = el;
                }}
                className="scroll-mt-44"
              >
                <div className="mb-8 flex items-end gap-4 border-b border-border pb-4">
                  <Heading size="h3">
                    {first}{' '}
                    {rest.length > 0 && <span className="text-outline">{rest.join(' ')}</span>}
                  </Heading>
                  <span className="mb-1 font-mono text-lg text-muted-foreground">
                    ({partners.length})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {partners.map((partner) => (
                    <div key={partner.id} className="group flex flex-col gap-3">
                      <LogoTile className="h-32 w-full rounded-2xl border-2 border-transparent p-6 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/20">
                        <LogoImage
                          src={partner.logoUrl}
                          name={partner.name}
                          sizes="(max-width: 640px) 50vw, 20vw"
                          className="size-full"
                          fallbackClassName="text-2xl text-brand-navy/60"
                        />
                      </LogoTile>
                      <p className="text-center text-sm font-bold transition-colors group-hover:text-primary">
                        {partner.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        <CtaBanner
          layout="split"
          title="Join the Ecosystem"
          description="Become a partner and connect with the most ambitious talents from Munich's leading universities. Collaborate on sponsor events, host workshops, and gain access to a vibrant community of future innovators."
          actions={[
            { label: 'View Partnership Benefits', href: '/for-partners' },
            { label: 'Contact Us', href: 'https://tally.so/r/3xpGQG' },
          ]}
        />
      </Section>
    </>
  );
}
