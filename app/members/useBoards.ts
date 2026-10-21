'use client';

import { useEffect, useState } from 'react';

export interface BoardMember {
  name: string;
  role: string;
  imageUrl: string;
  profileImage?: string;
  linkedinUrl?: string;
  _hasMatch?: boolean;
}

export interface Board {
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

/**
 * The curated board line-ups, with names, portraits and LinkedIn links filled
 * in from `/api/board` by matching on role. Unmatched seats render as "N/A".
 * All boards are prefetched on mount; the expanded one is refreshed on open.
 */
export function useBoards(expandedBoard: string | null) {
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
    'md technology operations': '/ourMembers/hero-opt.png',
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

  return boards;
}
