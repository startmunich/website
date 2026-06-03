'use client';

import Image from 'next/image';
import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

import Hero from '@/components/Hero';
import HeroCard from '@/components/HeroCard';
import { useInView } from '@/lib/hooks';
import { useAnimatedNumber } from '@/lib/useAnimatedNumber';

export const dynamic = 'force-dynamic';

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

interface BoardMember {
  name: string;
  role: string;
  imageUrl: string;
  profileImage?: string;
  linkedinUrl?: string;
  _hasMatch?: boolean;
}

interface Board {
  id: string;
  name: string;
  year: string;
  imageUrl: string;
  imageObjectPosition?: string;
  executiveBoard: BoardMember[];
  departmentBoard: BoardMember[];
}

interface RawBoardMember {
  name?: string;
  fullName?: string;
  displayName?: string;
  role?: string;
  position?: string;
  title?: string;
  profileImage?: string;
  linkedinUrl?: string;
  members?: RawBoardMember[];
  boardMembers?: RawBoardMember[];
  memberList?: RawBoardMember[];
}

interface BoardMemberLike {
  name?: string;
  role?: string;
  profileImage?: string;
  linkedinUrl?: string;
}

async function fetchMembers(): Promise<Member[]> {
  try {
    const response = await fetch('/api/members');
    if (!response.ok) throw new Error('Failed to fetch members');
    return await response.json();
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null);
  const [batchMembers, setBatchMembers] = useState<Member[]>([]);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [, setBoardLoading] = useState(false);
  const batchContentRef = useRef<HTMLDivElement>(null);
  const [boards, setBoards] = useState<Board[]>([
    {
      id: '25-26',
      name: 'Board 25-26',
      year: '2025-2026',
      imageUrl: '/ourMembers/boads/boad26.jpeg',
      executiveBoard: [
        { name: 'BOARD MEMBER', role: 'CFO', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'President', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'Vice President', imageUrl: '/ourMembers/hero-opt.png' },
      ],
      departmentBoard: [
        { name: 'BOARD MEMBER', role: 'MD Events', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD Marketing', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD People', imageUrl: '/ourMembers/hero-opt.png' },
        {
          name: 'BOARD MEMBER',
          role: 'MD Technology & Operations',
          imageUrl: '/ourMembers/hero-opt.png',
        },
        { name: 'BOARD MEMBER', role: 'MD Partnerships', imageUrl: '/ourMembers/hero-opt.png' },
      ],
    },
    {
      id: '24-25',
      name: 'Board 24-25',
      year: '2024-2025',
      imageUrl: '/ourMembers/boads/board25.jpg',
      executiveBoard: [
        { name: 'BOARD MEMBER', role: 'President', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'Vice President', imageUrl: '/ourMembers/hero-opt.png' },
      ],
      departmentBoard: [
        { name: 'BOARD MEMBER', role: 'MD Events', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD Marketing', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD People', imageUrl: '/ourMembers/hero-opt.png' },
        {
          name: 'BOARD MEMBER',
          role: 'MD Finance & Operations',
          imageUrl: '/ourMembers/hero-opt.png',
        },
        { name: 'BOARD MEMBER', role: 'MD Partnerships', imageUrl: '/ourMembers/hero-opt.png' },
      ],
    },
  ]);

  const analyticsView = useInView(0.1);
  const boardsView = useInView(0.1);
  const batchesView = useInView(0.1);

  const animatedActiveMembers = useAnimatedNumber(70, false, 1000);
  const animatedAlumniCount = useAnimatedNumber(600, false, 1000);

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

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

  useEffect(() => {
    const loadMembers = async () => {
      const data = await fetchMembers();
      setMembers(data);
    };
    loadMembers();
  }, []);

  useEffect(() => {
    if (!expandedBatch) {
      setBatchMembers([]);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const loadBatchMembers = async () => {
      setLoadingBatch(true);
      try {
        const response = await fetch(`/api/members/batch/${encodeURIComponent(expandedBatch)}`, {
          signal: controller.signal,
        });
        if (cancelled) return;
        if (response.ok) {
          const data = await response.json();
          if (cancelled) return;
          if (Array.isArray(data) && data.length > 0) {
            const transformedData = data.map((member: Member) => ({
              ...member,
              profileImage: isPlaceholderImage(member.imageUrl) ? undefined : member.imageUrl,
            }));
            setBatchMembers(transformedData);
          } else {
            setBatchMembers(members.filter((m) => m.batch === expandedBatch));
          }
        } else {
          setBatchMembers(members.filter((m) => m.batch === expandedBatch));
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.error('Error fetching batch members:', error);
        setBatchMembers(members.filter((m) => m.batch === expandedBatch));
      }
      if (!cancelled) setLoadingBatch(false);
    };

    loadBatchMembers();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [expandedBatch, members]);

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/[\.\-&\/]/g, ' ')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const roleSynonyms: Record<string, string[]> = {
    cfo: ['chief financial officer', 'chief financial officer (cfo)'],
    'vice president': ['vice-president', 'vice president', 'vp'],
    'md finance operations': ['md finance & operations', 'md finance and operations'],
    'md technology operations': ['md technology & operations', 'md technology and operations'],
    'md partnerships': ['md partnerships', 'md partnership'],
    'md marketing': ['md marketing'],
    'md people': ['md people'],
    'md events': ['md events'],
    president: ['president'],
  };

  const roleFallbackImages: Record<string, string> = {
    cfo: '/ourMembers/hero-opt.png',
    president: '/ourMembers/hero-opt.png',
    'vice president': '/ourMembers/hero-opt.png',
    'md events': '/ourMembers/hero-opt.png',
    'md marketing': '/ourMembers/hero-opt.png',
    'md people': '/ourMembers/hero-opt.png',
    'md finance operations': '/ourMembers/hero-opt.png',
    'md finance & operations': '/ourMembers/hero-opt.png',
    'md technology operations': '/ourMembers/hero-opt.png',
    'md technology & operations': '/ourMembers/hero-opt.png',
    'md partnerships': '/ourMembers/hero-opt.png',
  };

  const getFallbackImageByRole = (role: string) =>
    roleFallbackImages[normalize(role)] ||
    Object.entries(roleFallbackImages).find(([key]) => normalize(role).includes(key))?.[1] ||
    '/ourMembers/hero-opt.png';

  const termStartYearFromBoard = (board: Board) => {
    if (board.year && board.year.includes('-')) {
      const [from] = board.year.split('-').map((v) => v.trim());
      if (/^\d{4}$/.test(from)) return from;
    }
    const parts = board.id.split('-').map((p) => Number(p.trim()));
    if (parts.length === 2 && !Number.isNaN(parts[0])) {
      const from = parts[0] < 100 ? 2000 + parts[0] : parts[0];
      return `${from}`;
    }
    return '2024';
  };

  const findByRole = (normalizedBoardMembers: BoardMemberLike[]) => (role: string) => {
    if (!role) return null;
    const normalizedRole = normalize(role);
    let match = normalizedBoardMembers.find((m) => normalize(m.role || '') === normalizedRole);
    if (match) return match;
    const normalizedRoleKey = Object.keys(roleSynonyms).find(
      (key) => key === normalizedRole || roleSynonyms[key].includes(normalizedRole),
    );
    if (normalizedRoleKey) {
      const aliases = [normalizedRoleKey, ...(roleSynonyms[normalizedRoleKey] || [])].map(
        normalize,
      );
      match = normalizedBoardMembers.find((m) => {
        const candidate = normalize(m.role || '');
        return aliases.some((alias) => candidate.includes(alias) || alias.includes(candidate));
      });
      if (match) return match;
    }
    return (
      normalizedBoardMembers.find((m) => {
        const candidateRole = normalize(m.role || '');
        return candidateRole.includes(normalizedRole) || normalizedRole.includes(candidateRole);
      }) || null
    );
  };

  const loadBoardMembers = async (
    boardId: string,
    signal?: AbortSignal,
    isCancelled?: () => boolean,
  ) => {
    setBoardLoading(true);
    try {
      const board = boards.find((b) => b.id === boardId);
      if (!board) return;
      const termStartYear = termStartYearFromBoard(board);
      const response = await fetch(
        `/api/board?termStartYears=${encodeURIComponent(termStartYear)}`,
        { signal },
      );
      if (isCancelled?.()) return;
      if (!response.ok) return;
      const data = await response.json();
      if (isCancelled?.()) return;
      if (!data) return;
      const candidateData = Array.isArray(data)
        ? data
        : data?.data && Array.isArray(data.data)
          ? data.data
          : [];
      const rawMembers: RawBoardMember[] = [];
      candidateData.forEach((item: RawBoardMember) => {
        if (item && Array.isArray(item.members)) rawMembers.push(...item.members);
        else if (item && Array.isArray(item.boardMembers)) rawMembers.push(...item.boardMembers);
        else if (item && Array.isArray(item.memberList)) rawMembers.push(...item.memberList);
        else if (item && item.name && item.role) rawMembers.push(item);
      });
      if (rawMembers.length === 0) return;
      const normalizedBoardMembers = rawMembers.flatMap((member: RawBoardMember) => {
        const normalizedName =
          member.name || member.fullName || member.displayName || 'Board Member';
        const normalizedRole = member.role || member.position || member.title || '';
        const profileImage = member.profileImage || '';
        const splitRoles = normalizedRole
          .split(',')
          .map((r: string) => r.trim())
          .filter((r: string) => r.length > 0);
        if (splitRoles.length <= 1)
          return [{ ...member, name: normalizedName, role: normalizedRole, profileImage }];
        return splitRoles.map((rolePart: string) => ({
          ...member,
          name: normalizedName,
          role: rolePart,
          profileImage,
        }));
      });
      const matchByRole = findByRole(normalizedBoardMembers);
      if (isCancelled?.()) return;
      setBoards((prev) =>
        prev.map((boardItem) => {
          if (boardItem.id !== boardId) return boardItem;
          return {
            ...boardItem,
            executiveBoard: boardItem.executiveBoard.map((member) => {
              const match = matchByRole(member.role);
              const fallback = getFallbackImageByRole(member.role);
              const hasMatch = !!match;
              return {
                ...member,
                name: match?.name || (hasMatch ? member.name : 'N/A'),
                profileImage: match?.profileImage || member.profileImage || '',
                imageUrl: match?.profileImage || member.profileImage || member.imageUrl || fallback,
                linkedinUrl: match?.linkedinUrl || member.linkedinUrl,
                _hasMatch: hasMatch,
              };
            }),
            departmentBoard: boardItem.departmentBoard.map((member) => {
              const match = matchByRole(member.role);
              const fallback = getFallbackImageByRole(member.role);
              const hasMatch = !!match;
              return {
                ...member,
                name: match?.name || (hasMatch ? member.name : 'N/A'),
                profileImage: match?.profileImage || member.profileImage || '',
                imageUrl: match?.profileImage || member.profileImage || member.imageUrl || fallback,
                linkedinUrl: match?.linkedinUrl || member.linkedinUrl,
                _hasMatch: hasMatch,
              };
            }),
          };
        }),
      );
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      console.error('Error fetching board data:', error);
    } finally {
      if (!isCancelled?.()) setBoardLoading(false);
    }
  };

  useEffect(() => {
    if (!expandedBoard) return;
    const controller = new AbortController();
    let cancelled = false;
    loadBoardMembers(expandedBoard, controller.signal, () => cancelled);
    return () => {
      cancelled = true;
      controller.abort();
    };
    // loadBoardMembers reads `boards` via closure; re-running on `boards` change
    // would re-fetch every time we update board members (infinite loop).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedBoard]);

  useEffect(() => {
    void (async () => {
      for (const board of boards) await loadBoardMembers(board.id);
    })();
    // Mount-only prefetch of all boards; `boards` is initialized once and only
    // mutated by loadBoardMembers itself, so deps would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (
        expandedBatch &&
        batchContentRef.current &&
        !batchContentRef.current.contains(e.target as Node)
      ) {
        setExpandedBatch(null);
      }
    },
    [expandedBatch],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [handleOutsideClick]);

  const defaultBatches = [
    'Winter 2025',
    'Summer 2025',
    'Winter 2024',
    'Summer 2024',
    'Winter 2023',
    'Summer 2023',
    'Winter 2022',
    'Summer 2022',
    'Winter 2021',
  ];
  const allBatches = Array.from(new Set([...members.map((m) => m.batch), ...defaultBatches]))
    .filter(Boolean)
    .sort()
    .reverse();

  const malePercentage = 59;
  const femalePercentage = 41;

  const topStudies = [
    { study: 'Computer Science', percentage: 40 },
    { study: 'Business Administration', percentage: 30 },
    { study: 'Engineering', percentage: 16 },
    { study: 'Others', percentage: 14 },
  ];

  const topUniversities = [
    { university: 'TUM', percentage: 65 },
    { university: 'LMU', percentage: 20 },
    { university: 'HM', percentage: 7 },
    { university: 'Others', percentage: 8 },
  ];

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

  const sortedBatches = allBatches
    .map((batchName) => {
      const batchKey = getBatchImageKey(batchName);
      const shouldShowImage = isAfterWS21(batchName);
      let groupImageUrl = '/ourMembers/hero-opt.png';
      if (shouldShowImage && batchKey && batchImageMap[batchKey]) {
        groupImageUrl = `/ourMembers/batches_group_pictures/${batchImageMap[batchKey]}`;
      }
      return {
        name: batchName,
        semester: batchName.split(' ')[0] || 'Batch',
        year: batchName.split(' ')[1] || '',
        groupImageUrl,
        memberCount: members.filter((m) => m.batch === batchName).length,
      };
    })
    .sort((a, b) => {
      const yearDiff = parseInt(b.year) - parseInt(a.year);
      if (yearDiff !== 0) return yearDiff;
      if (a.semester.toLowerCase().includes('winter') || a.semester.toLowerCase().startsWith('w'))
        return -1;
      if (b.semester.toLowerCase().includes('winter') || b.semester.toLowerCase().startsWith('w'))
        return 1;
      return 0;
    });

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
        {/* ═══ HERO ═══ */}
        <Hero
          backgroundImage="/ourMembers/hero-opt.png"
          title={
            <>
              START MUNICH
              <br />
              <span className="outline-text">MEMBERS</span>
            </>
          }
          description="Meet the ambitious student entrepreneurs building the future of technology and innovation."
        >
          <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-6">
            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent lg:text-6xl">
                  {Math.floor(animatedActiveMembers)}
                </span>
                <span className="text-xl font-bold text-brand-pink lg:text-3xl">+</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Active Members
              </p>
            </HeroCard>
            <HeroCard>
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-4xl font-black text-transparent lg:text-6xl">
                  {Math.floor(animatedAlumniCount)}
                </span>
                <span className="text-xl font-bold text-brand-pink lg:text-3xl">+</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Alumni</p>
            </HeroCard>
          </div>
        </Hero>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ═══ COMMUNITY ANALYTICS ═══ */}
          <section ref={analyticsView.ref} className="py-12">
            <div
              className={`mb-8 transition-all duration-700 ${analyticsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">
                By the Numbers
              </span>
              <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
                COMMUNITY ANALYTICS
              </h2>
            </div>

            <div
              className={`grid grid-cols-1 gap-6 transition-all delay-150 duration-700 md:grid-cols-3 ${analyticsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              {/* Gender */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-pink/20 bg-brand-pink/10">
                    <svg
                      className="h-5 w-5 text-brand-pink"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-pink">
                    Gender Distribution
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Male</span>
                      <span className="text-sm font-bold text-white">{malePercentage}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
                        style={{ width: `${malePercentage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Female</span>
                      <span className="text-sm font-bold text-white">{femalePercentage}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-pink to-pink-400 transition-all duration-1000"
                        style={{ width: `${femalePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Fields */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-pink/20 bg-brand-pink/10">
                    <svg
                      className="h-5 w-5 text-brand-pink"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-pink">
                    Top Study Fields
                  </span>
                </div>
                <div className="space-y-3">
                  {topStudies.map(({ study, percentage }) => (
                    <div key={study} className="flex items-center justify-between gap-4">
                      <span className="truncate text-sm text-gray-300">{study}</span>
                      <span className="flex-shrink-0 text-sm font-bold text-brand-pink">
                        {percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Universities */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-pink/20 bg-brand-pink/10">
                    <svg
                      className="h-5 w-5 text-brand-pink"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-pink">
                    Top Universities
                  </span>
                </div>
                <div className="space-y-3">
                  {topUniversities.map(({ university, percentage }) => (
                    <div key={university} className="flex items-center justify-between gap-4">
                      <span className="truncate text-sm text-gray-300">{university}</span>
                      <span className="flex-shrink-0 text-sm font-bold text-brand-pink">
                        {percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* ═══ THE BOARDS ═══ */}
          <section ref={boardsView.ref} className="py-12">
            <div
              className={`mb-8 transition-all duration-700 ${boardsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">
                Leadership
              </span>
              <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">THE BOARDS</h2>
            </div>

            {expandedBoard ? (
              <div
                className={`transition-all duration-700 ${boardsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <button
                  onClick={() => setExpandedBoard(null)}
                  className="group mb-8 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
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
                  <span className="text-sm font-medium">Back to all boards</span>
                </button>

                {boards
                  .filter((b) => b.id === expandedBoard)
                  .map((board) => (
                    <div key={board.id} className="space-y-10">
                      {/* Executive Board */}
                      <div>
                        <div className="mb-6 flex items-center gap-3">
                          <div className="h-px w-6 bg-brand-pink" />
                          <span className="text-xs font-bold uppercase tracking-[0.35em] text-brand-pink">
                            Executive Board
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                          {board.executiveBoard.map((member, i) => (
                            <a
                              key={i}
                              href={member.linkedinUrl || '#'}
                              target={member.linkedinUrl ? '_blank' : undefined}
                              rel={member.linkedinUrl ? 'noopener noreferrer' : undefined}
                              className={`relative${member.linkedinUrl ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                {member.profileImage ? (
                                  <Image
                                    src={member.profileImage}
                                    alt={member.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                                    className="object-cover object-top"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-3xl font-black text-white/20">
                                    {member.name === 'N/A' ? 'N/A' : getInitials(member.name)}
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-brand-dark-blue/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                  <p className="text-xs font-black uppercase leading-tight tracking-wide text-white">
                                    {member.name}
                                  </p>
                                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-brand-pink">
                                    {member.role}
                                  </p>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Department Board */}
                      <div>
                        <div className="mb-6 flex items-center gap-3">
                          <div className="h-px w-6 bg-brand-pink" />
                          <span className="text-xs font-bold uppercase tracking-[0.35em] text-brand-pink">
                            Department Board
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                          {board.departmentBoard.map((member, i) => (
                            <a
                              key={i}
                              href={member.linkedinUrl || '#'}
                              target={member.linkedinUrl ? '_blank' : undefined}
                              rel={member.linkedinUrl ? 'noopener noreferrer' : undefined}
                              className={`relative${member.linkedinUrl ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                {member.profileImage ? (
                                  <Image
                                    src={member.profileImage}
                                    alt={member.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                                    className="object-cover object-top"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-3xl font-black text-white/20">
                                    {member.name === 'N/A' ? 'N/A' : getInitials(member.name)}
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-brand-dark-blue/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                  <p className="text-xs font-black uppercase leading-tight tracking-wide text-white">
                                    {member.name}
                                  </p>
                                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-brand-pink">
                                    {member.role}
                                  </p>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 gap-6 transition-all delay-150 duration-700 md:grid-cols-2 lg:grid-cols-3 ${boardsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                {boards.map((board, i) => (
                  <button
                    key={board.id}
                    onClick={() => setExpandedBoard(board.id)}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left transition-all duration-300 hover:border-brand-pink/30 hover:bg-white/[0.07]"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="relative h-52 overflow-hidden">
                      {board.imageUrl ? (
                        <Image
                          src={board.imageUrl}
                          alt={board.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ objectPosition: board.imageObjectPosition ?? 'center' }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.02]">
                          <span className="text-6xl font-black tracking-tight text-white/10">
                            {board.year}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-brand-dark-blue/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-black uppercase tracking-tight text-white">
                          {board.name}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">
                          {board.year}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {board.executiveBoard.length + board.departmentBoard.length} members
                      </span>
                      <span className="inline-block text-sm font-medium text-brand-pink transition-transform group-hover:translate-x-1">
                        View board →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* ═══ OUR BATCHES ═══ */}
          <section ref={batchesView.ref} className="py-12">
            <div
              className={`mb-8 transition-all duration-700 ${batchesView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">
                Our Community
              </span>
              <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">OUR BATCHES</h2>
            </div>

            {expandedBatch ? (
              <div ref={batchContentRef}>
                <button
                  onClick={() => setExpandedBatch(null)}
                  className="group mb-8 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
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
                  <span className="text-sm font-medium">Back to all batches</span>
                </button>

                {sortedBatches
                  .filter((b) => b.name === expandedBatch)
                  .map((batch) => (
                    <div key={batch.name} className="space-y-8">
                      <h3 className="text-3xl font-black text-white sm:text-4xl">{batch.name}</h3>

                      <div
                        onClick={() => setExpandedBatch(null)}
                        className="relative w-full cursor-pointer overflow-hidden rounded-3xl border border-white/10 transition-all duration-300 hover:border-brand-pink/30"
                      >
                        <div className="relative h-[70vh] w-full overflow-hidden bg-white/5">
                          <Image
                            src={batch.groupImageUrl}
                            alt={batch.name}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/40 via-transparent to-transparent" />
                        </div>
                      </div>

                      <div className="mt-6">
                        {loadingBatch ? (
                          <div className="flex items-center justify-center py-16">
                            <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-pink/30 border-t-brand-pink" />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                            {[...batchMembers]
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
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {sortedBatches.map((batch, i) => (
                  <div
                    key={batch.name}
                    className={`transition-all duration-700 ${batchesView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    style={{ transitionDelay: `${150 + i * 80}ms` }}
                  >
                    <button
                      onClick={() => setExpandedBatch(batch.name)}
                      className="group relative w-full overflow-hidden rounded-3xl border border-white/10 transition-all duration-300 hover:border-brand-pink/30"
                    >
                      <div className="relative h-72 overflow-hidden bg-white/5 sm:h-80">
                        <Image
                          src={batch.groupImageUrl}
                          alt={batch.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/70 via-transparent to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                          <h3 className="text-xl font-black text-white sm:text-2xl">
                            {batch.name}
                          </h3>
                          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                            Explore →
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
