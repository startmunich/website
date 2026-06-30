import { NextResponse } from 'next/server';

export const revalidate = 3600;

const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN;
const NOCODB_BASE_URL = process.env.NOCODB_BASE_URL || 'https://ndb.startmunich.de';
const NOCODB_MEMBERS_TABLE_ID = process.env.NOCODB_MEMBERS_TABLE_ID;
const NOCODB_TIMEOUT_MS = 10_000;

interface Member {
  id: number;
  name: string;
  batch: string;
  role: string;
  study?: string;
  company?: string;
  linkedinUrl?: string;
  imageUrl: string;
  bio?: string;
  expertise?: string[];
  achievements?: string;
  gender?: string;
}

interface NocoDBMemberRecord {
  Id?: number;
  id?: number;
  Name?: string;
  Batch?: string;
  Role?: string;
  Company?: string;
  LinkedIn?: string;
  Bio?: string;
  Expertise?: string;
  Achievements?: string;
  Gender?: string;
  'Member Picture'?: Array<{ signedPath?: string }>;
}

// Transform NocoDB record to Member format
function transformNocoDBRecord(record: NocoDBMemberRecord): Member {
  // Handle profile pic - NocoDB stores it as an array of attachment objects
  let profilePicUrl = '/placeholder-profile.jpg';
  if (
    record['Member Picture'] &&
    Array.isArray(record['Member Picture']) &&
    record['Member Picture'][0]
  ) {
    const profilePic = record['Member Picture'][0];
    if (profilePic.signedPath) {
      profilePicUrl = `https://ndb.startmunich.de/${profilePic.signedPath}`;
    }
  }

  const expertise = record.Expertise
    ? record.Expertise.split(',')
        .map((e: string) => e.trim())
        .filter(Boolean)
    : undefined;

  return {
    id: record.Id ?? record.id ?? 0,
    name: record.Name || 'Unknown',
    batch: record.Batch || '',
    role: record.Role || '',
    company: record.Company || undefined,
    linkedinUrl: record.LinkedIn || undefined,
    imageUrl: profilePicUrl,
    bio: record.Bio || undefined,
    expertise: expertise,
    achievements: record.Achievements || undefined,
    gender: record.Gender || undefined,
  };
}

export async function GET() {
  console.log('NOCODB_API_TOKEN:', NOCODB_API_TOKEN ? 'SET' : 'NOT SET');

  // If members table is not configured, return mock data
  if (!NOCODB_API_TOKEN || !NOCODB_MEMBERS_TABLE_ID) {
    console.log('Members table not configured in NocoDB');
    return NextResponse.json([]);
  }

  try {
    const response = await fetch(
      `${NOCODB_BASE_URL}/api/v2/tables/${NOCODB_MEMBERS_TABLE_ID}/records?limit=1000&offset=0`,
      {
        headers: {
          'xc-token': NOCODB_API_TOKEN,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(NOCODB_TIMEOUT_MS),
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NocoDB API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`NocoDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const members = (data.list || []).map(transformNocoDBRecord);

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching from NocoDB:', error);
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    return NextResponse.json(
      {
        error: isTimeout
          ? 'Upstream NocoDB request timed out'
          : 'Failed to fetch members from database',
      },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
