'use client';

import { useEffect, useState } from 'react';

import { BrandPanel } from '@/components/site/cta-banner';
import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { EmptyState } from '@/components/site/empty-state';
import { LogoImage, LogoTile } from '@/components/site/logo-image';
import { PageHero } from '@/components/site/page-hero';
import { Section } from '@/components/ui/section';
import { Skeleton } from '@/components/ui/skeleton';
import { Heading, Text } from '@/components/ui/typography';

interface Company {
  id: string;
  name: string;
  type: string;
  logoUrl: string;
}

async function fetchCompanies(): Promise<Company[]> {
  try {
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/member-network`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching member network:', error);
    return [];
  }
}

export default function MemberNetworkContent() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchCompanies().then((data) => {
      setCompanies(data);
      setLoading(false);
    });
  }, []);

  // Largest categories first
  const categories = Array.from(new Set(companies.map((c) => c.type))).sort(
    (a, b) =>
      companies.filter((c) => c.type === b).length - companies.filter((c) => c.type === a).length,
  );

  return (
    <>
      <EmbedHeightReporter />

      <PageHero
        image="/memberNetwork/hero-opt.png"
        title="Member"
        outlineTitle="Network"
        description="Discover where our talented members are making their mark across the industry"
      />

      <Section spacing="sm" className="pt-8 lg:pt-20">
        <BrandPanel className="mb-16 md:p-10">
          <Heading as="h2" size="h4" className="mb-3 text-xl md:text-2xl">
            Where Our Members Work
          </Heading>
          <Text>
            Our community spans some of the world&apos;s leading companies, research institutions,
            and startups. From global tech giants to early-stage ventures, START Munich members are
            building careers that make an impact.
          </Text>
        </BrandPanel>

        {loading ? (
          <div
            className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4"
            aria-busy
            aria-label="Loading member network"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState description="The member network is being updated — check back soon." />
        ) : (
          categories.map((category) => (
            <div key={category} className="mb-16">
              <Heading as="h2" size="h4" className="mb-6 text-xl font-black uppercase md:text-2xl">
                {category}
              </Heading>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {companies
                  .filter((c) => c.type === category)
                  .map((company) => (
                    <LogoTile
                      key={company.id}
                      className="h-auto min-h-[100px] w-full border border-border p-5 hover:scale-100 hover:shadow-lg hover:shadow-primary/10"
                    >
                      <LogoImage
                        src={company.logoUrl}
                        name={company.name}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="h-14 w-full"
                        fallbackClassName="text-lg text-brand-navy/70"
                      />
                    </LogoTile>
                  ))}
              </div>
            </div>
          ))
        )}
      </Section>
    </>
  );
}
