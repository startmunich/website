import 'server-only';

import type { Company, Founder } from '@/lib/types';

const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN;
const NOCODB_BASE_URL = process.env.NOCODB_BASE_URL || 'https://ndb.startmunich.de';
const NOCODB_TABLE_ID = process.env.NOCODB_STARTUPS_TABLE_ID;
const NOCODB_TIMEOUT_MS = 10_000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformNocoDBRecord(record: any): Company {
  const founders: Founder[] = [];
  const memberName = record['STARTMunich Member'];
  if (memberName) {
    let profilePicUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&size=80&background=4f46e5&color=fff`;
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

    const memberBatch = record.Batch || record['Member Batch'] || '';

    founders.push({
      name: memberName,
      role: record['Company Role'] || 'Founder',
      batch: memberBatch.trim(),
      imageUrl: profilePicUrl,
      linkedinUrl: record['Member Linkedin'] || undefined,
    });
  }

  const categories = record.Chategory
    ? record.Chategory.split(',')
        .map((c: string) => c.trim())
        .filter(Boolean)
    : ['Other'];

  let logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(record['Startup Name'] || 'Company')}&size=300&background=00002c&color=fff&bold=true&font-size=0.4`;
  if (
    record['Company Logo'] &&
    Array.isArray(record['Company Logo']) &&
    record['Company Logo'][0]
  ) {
    const logo = record['Company Logo'][0];
    if (logo.signedPath) {
      logoUrl = `https://ndb.startmunich.de/${logo.signedPath}`;
    }
  }

  return {
    id: record.Id || record.id,
    name: record['Startup Name'] || 'Unnamed Startup',
    website: (record['Company Website'] || '').replace(/^https?:\/\//, ''),
    summary: record['Short Description'] || 'No description available',
    description:
      record['Description Long'] || record['Short Description'] || 'No description available',
    logoUrl: logoUrl,
    foundingYear: record['Founding Year'] || new Date().getFullYear(),
    category: categories,
    founders: founders,
    isSpotlight: record['Featured Startup']?.toLowerCase() === 'yes' || false,
    isYCombinator: record['Y Combinator Alumni']?.toLowerCase() === 'yes' || false,
    companyLinkedin: record['Company Linkedin'] || undefined,
    milestones: record['First milestones'] || undefined,
    supportingPrograms: record['Supporting Programs'] || undefined,
    lastUpdated: record['Last Updated'] || undefined,
    isMTZ: record['MTZ']?.toLowerCase() === 'yes' || false,
    isEWOR: record['EWOR']?.toLowerCase() === 'yes' || false,
  };
}

async function queryNocoDB(query: string): Promise<unknown[]> {
  if (!NOCODB_API_TOKEN || !NOCODB_TABLE_ID) {
    throw new Error('NocoDB not configured');
  }

  const response = await fetch(
    `${NOCODB_BASE_URL}/api/v2/tables/${NOCODB_TABLE_ID}/records?${query}`,
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
    throw new Error(`NocoDB API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.list || [];
}

export async function getAllStartups(): Promise<Company[]> {
  const list = await queryNocoDB('limit=1000&offset=0');
  return list.map(transformNocoDBRecord);
}

export async function getStartupById(id: string): Promise<Company | null> {
  const list = await queryNocoDB(`where=(Id,eq,${encodeURIComponent(id)})&limit=1`);
  const record = list[0];
  return record ? transformNocoDBRecord(record) : null;
}
