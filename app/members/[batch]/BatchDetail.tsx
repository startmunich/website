'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';

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

const isPlaceholderImage = (url?: string) => {
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
};

const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

interface BatchDetailProps {
  batchName: string;
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

function getBatchImageKey(batchName: string): string | null {
  const normalized = batchName.toLowerCase().trim();
  const fullMatch = normalized.match(/^(winter|summer)\s+(\d{4})$/);
  if (fullMatch) return `${fullMatch[1] === 'winter' ? 'ws' : 'ss'}${fullMatch[2].slice(-2)}`;
  const fourDigitMatch = normalized.match(/^(ws|ss)\s*(\d{4})$/);
  if (fourDigitMatch) return `${fourDigitMatch[1]}${fourDigitMatch[2].slice(-2)}`;
  const shortMatch = normalized.match(/^(ws|ss)\s*(\d{2})$/);
  if (shortMatch) return `${shortMatch[1]}${shortMatch[2]}`;
  return null;
}

function isAfterWS21(batchName: string): boolean {
  const normalized = batchName.toLowerCase().trim();
  let year: number | null = null;
  let isWinter = false;
  const fullMatch = normalized.match(/^(winter|summer)\s+(\d{4})$/);
  if (fullMatch) {
    year = parseInt(fullMatch[2].slice(-2));
    isWinter = fullMatch[1] === 'winter';
  }
  const shortMatch = normalized.match(/^(ws|ss)\s*(\d{2})$/);
  if (shortMatch) {
    year = parseInt(shortMatch[2]);
    isWinter = shortMatch[1] === 'ws';
  }
  if (year === null) return false;
  if (year > 21) return true;
  if (year === 21 && isWinter) return true;
  return false;
}

export default function BatchDetail({ batchName }: BatchDetailProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const batchKey = getBatchImageKey(batchName);
  const shouldShowImage = isAfterWS21(batchName);
  let groupImageUrl = '/ourMembers/hero-opt.png';
  if (shouldShowImage && batchKey && batchImageMap[batchKey]) {
    groupImageUrl = `/ourMembers/batches_group_pictures/${batchImageMap[batchKey]}`;
  }

  useEffect(() => {
    const loadBatchMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/members/batch/${encodeURIComponent(batchName)}`);
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
  }, [batchName]);

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

      <main className="min-h-screen bg-brand-dark-blue text-white">
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

          {/* Batch Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">{batchName}</h1>
            <p className="text-lg text-gray-400">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </p>
          </div>

          {/* Group Image */}
          <div className="relative mb-12 w-full overflow-hidden rounded-3xl border border-white/10">
            <div className="relative h-[60vh] w-full overflow-hidden bg-white/5">
              <Image
                src={groupImageUrl}
                alt={batchName}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Members Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-pink/30 border-t-brand-pink" />
            </div>
          ) : members.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-400">No members found for this batch.</p>
            </div>
          ) : (
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
                        <img
                          src={member.profileImage}
                          alt={member.name}
                          className="absolute inset-0 h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
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
                        <p className="text-sm font-black leading-tight text-white">{member.name}</p>
                        <p className="mt-0.5 text-xs text-brand-pink">
                          {member.study || member.role}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
