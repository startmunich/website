'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

import { isNocoDbImage } from '@/lib/images';

interface Member {
  id: number;
  name: string;
  batch: string;
  role: string;
  study?: string;
  university?: string;
  company?: string;
  linkedinUrl?: string;
  imageUrl: string;
  profileImage?: string;
  bio?: string;
  expertise?: string[];
  achievements?: string;
  gender?: string;
}

interface BatchDetailClientProps {
  batchSlug: string;
}

const batchImageMap: Record<string, string> = {
  ws21: 'WS21-opt.jpg',
  ws22: 'WS22-opt.jpg',
  ws23: 'WS23-opt.jpg',
  ws24: 'WS24-opt.jpg',
  ws25: 'WS25-opt.jpg',
  ss22: 'SS22-opt.jpg',
  ss23: 'SS23-opt.jpg',
  ss24: 'SS24-opt.jpg',
  ss25: 'SS25-opt.jpg',
  ss26: 'SS26-opt.jpg',
};

function getBatchDisplayName(slug: string): string {
  const upper = slug.toUpperCase();
  if (upper.match(/^(WS|SS)\d{2}$/)) {
    const semester = upper.startsWith('WS') ? 'Winter' : 'Summer';
    const year = '20' + upper.slice(2);
    return `${semester} ${year}`;
  }
  return slug;
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function isPlaceholderImage(url?: string) {
  if (!url) return true;
  const normalized = url.toLowerCase().trim();
  return (
    normalized === '/batch-opt.jpeg' ||
    normalized.endsWith('/batch-opt.jpeg') ||
    normalized === '/batch-opt.jpg' ||
    normalized.endsWith('/batch-opt.jpg') ||
    normalized === '/batch-opt.png' ||
    normalized.endsWith('/batch-opt.png') ||
    normalized === '/example-opt.png' ||
    normalized.endsWith('/example-opt.png') ||
    normalized === '/example.png' ||
    normalized.endsWith('/example.png') ||
    normalized === '/ourmembers/hero-opt.png' ||
    normalized.endsWith('/ourmembers/hero-opt.png')
  );
}

export default function BatchDetailClient({ batchSlug }: BatchDetailClientProps) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const batchDisplayName = getBatchDisplayName(batchSlug);
  const batchImageKey = batchSlug.toLowerCase();
  const groupImageUrl = batchImageMap[batchImageKey]
    ? `/ourMembers/batches_group_pictures/${batchImageMap[batchImageKey]}`
    : '/ourMembers/hero-opt.png';

  useEffect(() => {
    const loadBatchMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/members/batch/${encodeURIComponent(batchDisplayName)}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const transformedData = data.map((member: Member) => ({
              ...member,
              profileImage: isPlaceholderImage(member.imageUrl) ? undefined : member.imageUrl,
            }));
            setMembers(transformedData);
          }
        }
      } catch (error) {
        console.error('Error fetching batch members:', error);
      }
      setLoading(false);
    };

    loadBatchMembers();
  }, [batchDisplayName]);

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

      <main className="min-h-screen overflow-x-hidden bg-brand-dark-blue text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/members"
            className="group mb-8 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to all members</span>
          </Link>

          {/* Batch Title */}
          <div className="mb-8">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">
              Batch
            </span>
            <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">{batchDisplayName}</h1>
          </div>

          {/* Group Image */}
          <div className="mb-12 overflow-hidden rounded-3xl border border-white/10">
            <div className="relative h-[60vh] w-full overflow-hidden bg-white/5">
              <Image
                src={groupImageUrl}
                alt={batchDisplayName}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Members Grid */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-black text-white">
              Members{' '}
              <span className="text-brand-pink">{loading ? '...' : `(${members.length})`}</span>
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-pink/30 border-t-brand-pink" />
              </div>
            ) : members.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {[...members]
                  .sort((a, b) => {
                    const aHasImage = a.profileImage ? 0 : 1;
                    const bHasImage = b.profileImage ? 0 : 1;
                    return aHasImage - bHasImage;
                  })
                  .map((member) => (
                    <a
                      key={member.id}
                      href={member.linkedinUrl || '#'}
                      target={member.linkedinUrl ? '_blank' : undefined}
                      rel={member.linkedinUrl ? 'noopener noreferrer' : undefined}
                      className={`group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-brand-pink/30 hover:bg-white/[0.07] ${member.linkedinUrl ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="relative h-full w-full">
                        {member.profileImage ? (
                          <Image
                            src={member.profileImage}
                            alt={member.name}
                            fill
                            sizes="(max-width: 640px) 33vw, 10vw"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                            unoptimized={isNocoDbImage(member.profileImage)}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-white/5">
                            <span className="text-2xl font-black tracking-wider text-white/50">
                              {getInitials(member.name)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                          <p className="text-sm font-black leading-tight text-white">
                            {member.name}
                          </p>
                          <p className="mt-0.5 text-xs text-brand-pink">
                            {member.study || member.role}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
                <p className="text-gray-400">No members found for this batch.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
