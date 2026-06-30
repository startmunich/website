import { NextResponse } from 'next/server';

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
  bio?: string;
  expertise?: string[];
  achievements?: string;
  gender?: string;
}

interface RawMember {
  id?: number;
  name?: string;
  fullName?: string;
  firstname?: string;
  firstName?: string;
  vorname?: string;
  lastname?: string;
  lastName?: string;
  nachname?: string;
  displayName?: string;
  username?: string;
  role?: string;
  position?: string;
  title?: string;
  study?: string;
  field?: string;
  degree?: string;
  university?: string;
  school?: string;
  company?: string;
  employer?: string;
  linkedinUrl?: string;
  linkedin?: string;
  linkedin_profile?: string;
  bio?: string;
  description?: string;
  expertise?: string[] | string;
  achievements?: string;
  gender?: string;
  imageUrl?: unknown;
  image?: unknown;
  photo?: unknown;
  avatar?: unknown;
  profileImage?: unknown;
  profilePicture?: unknown;
  picture?: unknown;
  image_path?: unknown;
  avatarUrl?: unknown;
  icon?: unknown;
}

type ImageSource = unknown;

export const revalidate = 3600;

const STARTMUNICH_API_TIMEOUT_MS = 10_000;

export async function GET(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;

  const resolveApiBatch = (batchId: string): string => {
    const normalized = batchId.trim().toLowerCase();

    // Examples: "Winter 2025", "Summer 2024", "WS25", "SS24"
    const longMatch = normalized.match(/^(winter|summer)\s+(\d{4})$/);
    if (longMatch) {
      const semester = longMatch[1] === 'winter' ? 'WS' : 'SS';
      const year = longMatch[2];
      return `${year}-${semester}`;
    }

    const shortMatch = normalized.match(/^(ws|ss)\s*(\d{2,4})$/);
    if (shortMatch) {
      const semester = shortMatch[1].toUpperCase();
      let year = shortMatch[2];
      if (year.length === 2) {
        // assume 2000+
        year = `20${year}`;
      }
      return `${year}-${semester}`;
    }

    const dateMatch = normalized.match(/^(\d{4})[-_\/](ws|ss)$/);
    if (dateMatch) {
      return `${dateMatch[1]}-${dateMatch[2].toUpperCase()}`;
    }

    return '2025-WS';
  };

  const apiBatch = resolveApiBatch(batchId);

  const API_KEY = process.env.STARTMUNICH_API_KEY;
  if (!API_KEY) {
    console.error('STARTMUNICH_API_KEY is not set');
    return NextResponse.json([]);
  }

  try {
    const response = await fetch(
      `https://my.startmunich.de/api/v1/public/members?batches=${apiBatch}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(STARTMUNICH_API_TIMEOUT_MS),
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return NextResponse.json([]);
    }

    const data = await response.json();
    const dataMembers: RawMember[] = Array.isArray(data) ? data : data.members || data.data || [];

    if (!Array.isArray(dataMembers) || dataMembers.length === 0) {
      return NextResponse.json([]);
    }

    // Helper to pick the best image field
    const getImageUrl = (member: RawMember): string => {
      const maybeUrl =
        member.imageUrl ||
        member.image ||
        member.photo ||
        member.avatar ||
        member.profileImage ||
        member.profilePicture ||
        member.picture ||
        member.image_path ||
        member.avatarUrl ||
        member.icon ||
        null;

      const normalise = (url: ImageSource): string | null => {
        if (!url) return null;
        if (typeof url === 'string') {
          const trimmed = url.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith('//')) return `https:${trimmed}`;
          if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
          if (trimmed.startsWith('/')) return trimmed;
          return trimmed;
        }
        if (typeof url === 'object' && url !== null) {
          if (Array.isArray(url) && url.length > 0) {
            return normalise(url[0]);
          }
          const obj = url as Record<string, ImageSource>;
          if (obj.url) return normalise(obj.url);
          if (obj.src) return normalise(obj.src);
          if (obj.path) return normalise(obj.path);
          if (obj.signedPath) return normalise(obj.signedPath);
        }
        return null;
      };

      const resolved = normalise(maybeUrl);
      if (resolved) return resolved;

      // Fallback for nested known field names
      const nestedValues = [
        member.avatar,
        member.picture,
        member.image,
        member.profilePicture,
        member.profileImage,
      ];
      for (const value of nestedValues) {
        const n = normalise(value);
        if (n) return n;
      }

      // Default placeholder from mock data style
      return '/example.png';
    };

    const getMemberName = (member: RawMember): string => {
      if (member.name) return member.name;
      if (member.fullName) return member.fullName;
      if (member.firstname || member.firstName || member.vorname) {
        const first = member.firstname || member.firstName || member.vorname || '';
        const last = member.lastname || member.lastName || member.nachname || '';
        const name = `${first} ${last}`.trim();
        if (name) return name;
      }
      if (member.displayName) return member.displayName;
      if (member.username) return member.username;
      return 'Unknown';
    };

    // Transform external API response to Member format
    const members: Member[] = (dataMembers || []).map((member: RawMember, index: number) => ({
      id: member.id ?? index + 1,
      name: getMemberName(member),
      batch: batchId,
      role: member.role || member.position || member.title || '',
      study: member.study || member.field || member.degree,
      university: member.university || member.school,
      company: member.company || member.employer,
      linkedinUrl: member.linkedinUrl || member.linkedin || member.linkedin_profile || undefined,
      imageUrl: getImageUrl(member),
      bio: member.bio || member.description,
      expertise: member.expertise
        ? Array.isArray(member.expertise)
          ? member.expertise
          : (member.expertise + '').split(',').map((e: string) => e.trim())
        : undefined,
      achievements: member.achievements,
      gender: member.gender,
    }));

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching batch members:', error);
    // Return empty array on error
    return NextResponse.json([]);
  }
}
