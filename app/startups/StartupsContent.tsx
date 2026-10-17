'use client';

import { BriefcaseIcon, MapPinIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { BrandPanel, CtaBanner } from '@/components/site/cta-banner';
import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { EmptyState } from '@/components/site/empty-state';
import { InfoPopover } from '@/components/site/info-popover';
import { PageHero } from '@/components/site/page-hero';
import { Pager } from '@/components/site/pager';
import { HeroStat, HeroStats } from '@/components/site/stat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { IconTile } from '@/components/ui/icon-tile';
import { Input } from '@/components/ui/input';
import { Section } from '@/components/ui/section';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Heading, Text } from '@/components/ui/typography';
import { siteLinks } from '@/lib/site';
import type { Company } from '@/lib/types';

import StartupCard from './StartupCard';

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

const programmes = [
  {
    title: 'Featured Startups',
    badge: '★ Featured',
    info: 'These startups are super successful and have achieved a valuation of over €10 million, showcasing exceptional growth and market impact.',
  },
  {
    title: 'Y Combinator Alumni',
    badge: 'YC',
    info: "Y Combinator is the world's most prestigious startup accelerator, having funded over 4,000 companies including Airbnb, Dropbox, Stripe, and Reddit. These alumni have gone through YC's intensive 3-month program.",
  },
  {
    title: 'EWOR Alumni',
    badge: 'EWOR',
    info: 'EWOR is a global fellowship program that supports ambitious founders by providing funding, mentorship, and a community of exceptional entrepreneurs building the next generation of impactful companies.',
  },
] as const;

function ProgrammeSection({
  title,
  badge,
  info,
  companies,
}: (typeof programmes)[number] & { companies: Company[] }) {
  if (companies.length === 0) return null;
  return (
    <div className="mb-16">
      <div className="mb-8 flex items-center gap-2">
        <Heading size="h3">{title}</Heading>
        <InfoPopover title={title}>{info}</InfoPopover>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {companies.map((company) => (
          <StartupCard
            key={company.id}
            id={company.id}
            name={company.name}
            logoUrl={company.logoUrl}
            summary={company.summary}
            isMTZ={company.isMTZ}
            badge={badge}
          />
        ))}
      </div>
    </div>
  );
}

function MtzPanel() {
  return (
    <BrandPanel className="mb-16 md:p-10">
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-3">
            <IconTile>
              <MapPinIcon />
            </IconTile>
            <Heading as="h3" size="h4" className="text-2xl md:text-3xl">
              Our Location Partner: MTZ
            </Heading>
          </div>
          <Text>
            Startups with the{' '}
            <Badge size="sm" className="mx-1 rounded-md">
              MTZ
            </Badge>{' '}
            label are located at our location partner, the{' '}
            <strong className="text-foreground">MTZ (Münchner Technologiezentrum)</strong>, one of
            Munich&apos;s leading innovation hubs. START Munich is also located at the MTZ,
            fostering a vibrant community of entrepreneurs and innovators.
          </Text>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPinIcon className="size-4 text-primary" />
              Agnes-Pockels-Bogen 1, 80992 München
            </li>
            <li className="flex items-center gap-2">
              <BriefcaseIcon className="size-4 text-primary" />
              Home to START Munich and innovative startups
            </li>
          </ul>
        </div>
        <div className="h-52 w-full overflow-hidden rounded-xl border-2 border-primary/40 shadow-lg lg:h-64 lg:w-80">
          <iframe
            title="MTZ on OpenStreetMap"
            width="100%"
            height="100%"
            src="https://www.openstreetmap.org/export/embed.html?bbox=11.530690491199495%2C48.17274171704395%2C11.53356581926346%2C48.17436585858368&amp;layer=mapnik&amp;marker=48.173553794244306%2C11.532128155231476"
          />
        </div>
      </div>
    </BrandPanel>
  );
}

function StartupGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      aria-busy
      aria-label="Loading startups"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="gap-4 pt-0">
          <Skeleton className="h-48 rounded-none" />
          <div className="flex flex-col gap-3 px-6">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function StartupsContent() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  return (
    <>
      <EmbedHeightReporter />

      <PageHero
        image="/ourStartups/hero-opt.jpg"
        title="START Munich"
        outlineTitle="Startups"
        description="Discover the innovative companies built by our community of ambitious student entrepreneurs"
        aside={
          !loading && (
            <HeroStats>
              <HeroStat label="Companies" value={totalStartups} animate suffix="+" />
              <HeroStat label="Funding" prefix="€" value={3} animate suffix="B+" />
            </HeroStats>
          )
        }
      />

      <Section spacing="sm" className="pt-8 lg:pt-20">
        {loading ? (
          <StartupGridSkeleton />
        ) : (
          <>
            <ProgrammeSection {...programmes[0]} companies={spotlightStartups} />

            <MtzPanel />

            <ProgrammeSection {...programmes[1]} companies={yCombinatorStartups} />
            <ProgrammeSection {...programmes[2]} companies={eworStartups} />

            <CtaBanner
              className="mb-16"
              layout="split"
              badge={
                <Badge variant="soft" size="sm" className="tracking-widest uppercase">
                  We&apos;re Hiring
                </Badge>
              }
              title={
                <>
                  Join the <span className="text-primary">Next Big Thing</span>
                </>
              }
              description="Our startups are looking for talented individuals to join their teams. Explore open positions and be part of building innovative products that matter."
              actions={[{ label: 'Explore Jobs', href: siteLinks.jobs }]}
            />

            <Card className="mb-12">
              <div className="flex flex-col gap-4 px-(--card-spacing)">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Category</FieldLabel>
                    <Select
                      items={[
                        { value: 'all', label: 'All Categories' },
                        ...allCategories.map((c) => ({ value: c, label: c })),
                      ]}
                      value={selectedCategory}
                      onValueChange={(v) => setSelectedCategory(v ?? 'all')}
                    >
                      <SelectTrigger className="w-full">
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
                  </Field>
                  <Field>
                    <FieldLabel>Founded</FieldLabel>
                    <Select
                      items={[
                        { value: 'all', label: 'All Years' },
                        ...allYears.map((y) => ({ value: y, label: y })),
                      ]}
                      value={selectedYear}
                      onValueChange={(v) => setSelectedYear(v ?? 'all')}
                    >
                      <SelectTrigger className="w-full">
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
                  </Field>
                </div>
                <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[1fr_auto]">
                  <Field>
                    <FieldLabel htmlFor="search-input">Search by Name or Founder</FieldLabel>
                    <Input
                      id="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type startup or founder name..."
                    />
                  </Field>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedYear('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>

            {filteredCompanies.length === 0 ? (
              <EmptyState
                title="No Results Found"
                description="Try adjusting your filters to see more startups"
              />
            ) : (
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
                    showDetails
                  />
                ))}
              </div>
            )}

            <Pager page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </Section>

      <Section spacing="none" className="pt-8 pb-16 md:pb-24">
        <CtaBanner
          title="Want to Start Your Own Journey?"
          description="Join START Munich and get the support, network, and resources you need to turn your idea into reality. Our community has helped launch 100+ startups — yours could be next."
          actions={[
            { label: 'Discover the Member Journey', href: '/member-journey' },
            { label: 'Apply Now', href: '/join-start/2026' },
          ]}
        />
      </Section>
    </>
  );
}
