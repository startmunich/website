import { ChevronLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { EmptyState } from '@/components/site/empty-state';
import { ProfileCard } from '@/components/site/profile-card';
import { ButtonLink } from '@/components/ui/button';
import { Section, SectionHeader } from '@/components/ui/section';
import { Heading } from '@/components/ui/typography';
import { getMemberBatch } from '@/lib/members';
import { OG_IMAGES } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ batch: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { batch: slug } = await params;
  // Same request as the page below, so Next's fetch memoisation serves it once.
  const batch = await getMemberBatch(slug);
  if (!batch) return {};

  const url = `https://www.startmunich.de/members/${batch.slug}`;
  const title = `${batch.name} Batch`;
  const description = `Meet the ${batch.name} batch of START Munich.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { url, title: `${title} | START Munich`, description, images: OG_IMAGES },
  };
}

export default async function BatchDetailPage({ params }: PageProps) {
  const { batch: slug } = await params;
  const batch = await getMemberBatch(slug);
  if (!batch) notFound();

  return (
    <>
      <EmbedHeightReporter />
      <Section spacing="sm">
        <ButtonLink
          href="/members"
          variant="ghost"
          size="sm"
          className="mb-8 -ml-3 text-muted-foreground"
        >
          <ChevronLeftIcon />
          Back to all members
        </ButtonLink>

        <SectionHeader as="h1" eyebrow="Batch" title={batch.name} className="md:mb-8" />

        <div className="relative mb-12 h-[60vh] w-full overflow-hidden rounded-3xl border border-border bg-card">
          <Image
            src={batch.groupImageUrl}
            alt={batch.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent" />
        </div>

        <Heading as="h2" size="h4" className="mb-6 text-2xl font-black uppercase">
          Members <span className="text-primary">({batch.members.length})</span>
        </Heading>

        {batch.members.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {batch.members.map((member) => (
              <ProfileCard
                key={member.id}
                variant="overlay"
                size="square"
                name={member.name}
                imageUrl={member.imageUrl}
                imagePosition="center"
                linkedinUrl={member.linkedinUrl}
                sizes="(max-width: 640px) 50vw, 20vw"
              />
            ))}
          </div>
        ) : (
          <EmptyState description="No members found for this batch." />
        )}
      </Section>
    </>
  );
}
