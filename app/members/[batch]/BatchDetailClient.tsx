'use client';

import { ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { EmptyState } from '@/components/site/empty-state';
import { ProfileCard } from '@/components/site/profile-card';
import { ButtonLink } from '@/components/ui/button';
import { Section, SectionHeader } from '@/components/ui/section';
import { Skeleton } from '@/components/ui/skeleton';
import { Heading } from '@/components/ui/typography';

import { batchImageMap } from '../batches';

interface Member {
  id: number;
  name: string;
  batch: string;
  role: string;
  study?: string;
  linkedinUrl?: string;
  imageUrl: string;
  profileImage?: string;
}

function getBatchDisplayName(slug: string): string {
  const upper = slug.toUpperCase();
  if (/^(WS|SS)\d{2}$/.test(upper)) {
    return `${upper.startsWith('WS') ? 'Winter' : 'Summer'} 20${upper.slice(2)}`;
  }
  return slug;
}

const PLACEHOLDER_IMAGES = [
  '/batch-opt.jpeg',
  '/batch-opt.jpg',
  '/batch-opt.png',
  '/example-opt.png',
  '/example.png',
  '/ourmembers/hero-opt.png',
];

function isPlaceholderImage(url?: string) {
  if (!url) return true;
  const normalized = url.toLowerCase().trim();
  return PLACEHOLDER_IMAGES.some((p) => normalized.endsWith(p));
}

export default function BatchDetailClient({ batchSlug }: { batchSlug: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const batchDisplayName = getBatchDisplayName(batchSlug);
  const groupPhoto = batchImageMap[batchSlug.toLowerCase()];
  const groupImageUrl = groupPhoto
    ? `/ourMembers/batches_group_pictures/${groupPhoto}`
    : '/ourMembers/hero-opt.png';

  useEffect(() => {
    const loadBatchMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/members/batch/${encodeURIComponent(batchDisplayName)}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setMembers(
              data.map((member: Member) => ({
                ...member,
                profileImage: isPlaceholderImage(member.imageUrl) ? undefined : member.imageUrl,
              })),
            );
          }
        }
      } catch (error) {
        console.error('Error fetching batch members:', error);
      }
      setLoading(false);
    };
    loadBatchMembers();
  }, [batchDisplayName]);

  // People with a portrait first
  const sorted = [...members].sort((a, b) => Number(!a.profileImage) - Number(!b.profileImage));

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

        <SectionHeader as="h1" eyebrow="Batch" title={batchDisplayName} className="md:mb-8" />

        <div className="relative mb-12 h-[60vh] w-full overflow-hidden rounded-3xl border border-border bg-card">
          <Image
            src={groupImageUrl}
            alt={batchDisplayName}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent" />
        </div>

        <Heading as="h2" size="h4" className="mb-6 text-2xl font-black uppercase">
          Members <span className="text-primary">{loading ? '…' : `(${members.length})`}</span>
        </Heading>

        {loading ? (
          <div
            className="grid grid-cols-2 gap-4 md:grid-cols-5"
            aria-busy
            aria-label="Loading members"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {sorted.map((member) => (
              <ProfileCard
                key={member.id}
                variant="overlay"
                size="square"
                name={member.name}
                role={member.study || member.role}
                imageUrl={member.profileImage}
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
