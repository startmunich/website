import Image from 'next/image';

import { isNocoDbImage } from '@/lib/images';

interface MemberCardProps {
  name: string;
  imageUrl: string;
  role: string;
  linkedinUrl?: string;
  compact?: boolean;
}

export default function MemberCard({
  name,
  imageUrl,
  role,
  linkedinUrl,
  compact = false,
}: MemberCardProps) {
  const content = (
    <div className="group relative h-full cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10">
      <div className={compact ? 'relative h-40 w-full' : 'relative h-64 w-full'}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          unoptimized={isNocoDbImage(imageUrl)}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#00002c]/60 via-[#00002c]/20 to-transparent"></div>

      {linkedinUrl && (
        <div className="absolute right-2 top-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
            <svg className="h-4 w-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
        </div>
      )}

      <div
        className={
          compact
            ? 'absolute bottom-0 left-0 right-0 p-3 text-center'
            : 'absolute bottom-0 left-0 right-0 p-4 text-center'
        }
      >
        <h4
          className={
            compact ? 'mb-1 text-xs font-bold text-white' : 'mb-1 text-sm font-bold text-white'
          }
        >
          {name}
        </h4>
        <p
          className={
            compact
              ? 'text-[10px] font-semibold uppercase tracking-wide text-pink-300'
              : 'text-xs font-semibold uppercase tracking-wide text-pink-300'
          }
        >
          {role}
        </p>
      </div>
    </div>
  );

  if (linkedinUrl) {
    return (
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  return content;
}
