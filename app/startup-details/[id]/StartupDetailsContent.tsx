'use client';

import { ExternalLinkIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import type { ReactNode } from 'react';

import { LinkedInIcon } from '@/components/site/brand-icons';
import { LogoImage } from '@/components/site/logo-image';
import { initials } from '@/components/site/profile-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Heading, Text } from '@/components/ui/typography';
import type { Company } from '@/lib/types';

function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <Heading as="h2" size="h4">
        {title}
      </Heading>
      {children}
    </section>
  );
}

export default function StartupDetailsContent({ company }: { company: Company }) {
  const router = useRouter();

  const handleBack = () => {
    // Prefer browser history so the previous scroll position is restored.
    // Fall back to /startups for direct entries (e.g. shared link).
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/startups');
    }
  };

  const programmes =
    company.supportingPrograms
      ?.split(',')
      .map((p) => p.trim())
      .filter(Boolean) ?? [];

  return (
    <Section spacing="sm" container="narrow" className="pt-8">
      <Card size="lg" variant="solid" className="gap-8">
        <Button
          variant="outline"
          size="icon-sm"
          shape="pill"
          onClick={handleBack}
          aria-label="Back to startups"
          className="absolute top-4 right-4 z-10"
        >
          <XIcon className="size-5" />
        </Button>

        <div className="flex flex-col gap-6 px-(--card-spacing) md:flex-row">
          <div className="flex h-48 w-full shrink-0 items-center justify-center rounded-xl border-2 border-border bg-white p-6 transition-colors hover:border-primary md:w-48">
            {/* Variable-aspect company logo; max-w/max-h with auto-sizing. */}
            <LogoImage
              src={company.logoUrl}
              name={company.name}
              alt={`${company.name} logo`}
              className="h-auto max-h-full w-auto max-w-full object-contain"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <Heading size="h1" className="normal-case">
              {company.name}
            </Heading>
            <div className="flex flex-wrap gap-2">
              {company.category.map((cat) => (
                <Badge key={cat} variant="soft" size="sm">
                  {cat}
                </Badge>
              ))}
            </div>
            {company.lastUpdated && (
              <Text variant="small">
                Information Updated{' '}
                {new Date(company.lastUpdated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            )}
            <div className="flex flex-wrap gap-2">
              {company.website && (
                <ButtonLink
                  href={`https://${company.website}`}
                  variant="soft"
                  size="sm"
                  onClick={() =>
                    posthog.capture('startup_website_clicked', {
                      startup_id: company.id,
                      startup_name: company.name,
                      website: company.website,
                    })
                  }
                >
                  <ExternalLinkIcon />
                  Visit Website
                </ButtonLink>
              )}
              {company.companyLinkedin && (
                <ButtonLink href={company.companyLinkedin} variant="soft" size="sm">
                  <LinkedInIcon className="size-4" />
                  Visit LinkedIn
                </ButtonLink>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 px-(--card-spacing)">
          <DetailBlock title="About">
            <Text>{company.description}</Text>
          </DetailBlock>

          {programmes.length > 0 && (
            <DetailBlock title="Programs">
              <div className="flex flex-wrap gap-2">
                {programmes.map((program) => (
                  <Badge key={program} variant="glass" className="rounded-lg font-medium">
                    {program}
                  </Badge>
                ))}
              </div>
            </DetailBlock>
          )}

          <DetailBlock title="Company Info">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Card size="sm" className="gap-1">
                <Text variant="label" className="px-(--card-spacing)">
                  Founded
                </Text>
                <p className="px-(--card-spacing) font-semibold text-foreground">
                  {company.foundingYear}
                </p>
              </Card>
            </div>
          </DetailBlock>

          {company.founders.length > 0 && (
            <DetailBlock title={company.founders.length > 1 ? 'Founders' : 'Founder'}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {company.founders.map((founder) => (
                  <Card key={founder.name} size="sm" className="flex-row items-center gap-4 px-4">
                    <Avatar className="size-16 border-2 border-border">
                      <AvatarImage src={founder.imageUrl} alt={founder.name} />
                      <AvatarFallback className="bg-primary font-bold text-primary-foreground">
                        {initials(founder.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">
                        {founder.name}
                        {founder.batch && (
                          <span className="ml-2 font-normal text-muted-foreground">
                            (Batch: {founder.batch})
                          </span>
                        )}
                      </p>
                      <Text variant="small">{founder.role}</Text>
                    </div>
                    {founder.linkedinUrl && (
                      <ButtonLink
                        href={founder.linkedinUrl}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`${founder.name} on LinkedIn`}
                        className="text-primary"
                      >
                        <LinkedInIcon className="size-5" />
                      </ButtonLink>
                    )}
                  </Card>
                ))}
              </div>
            </DetailBlock>
          )}
        </div>
      </Card>
    </Section>
  );
}
