import 'server-only';

import type { Company, Founder } from '@/lib/types';

const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN;
const NOCODB_BASE_URL = process.env.NOCODB_BASE_URL || 'https://ndb.startmunich.de';
const NOCODB_TABLE_ID = process.env.NOCODB_STARTUPS_TABLE_ID;
const NOCODB_TIMEOUT_MS = 10_000;

/**
 * Resolve a NocoDB attachment to a URL the browser can keep.
 *
 * `signedPath` is a temporary `dltemp/<token>/<expiry-ms>/…` URL that NocoDB
 * stops serving once the embedded timestamp passes (a reconstructed URL with a
 * past expiry returns 404). Caching a response that embeds one means the cached
 * copy starts serving dead images. The unsigned `path` is served without a
 * signature and never expires, so prefer it and keep `signedPath` only as a
 * fallback for rows that do not carry one.
 */
export function attachmentUrl(attachment: unknown): string | undefined {
  if (!attachment || typeof attachment !== 'object') return undefined;
  const file = attachment as { path?: string; signedPath?: string };
  if (file.path) return `${NOCODB_BASE_URL}/${file.path}`;
  if (file.signedPath) return `${NOCODB_BASE_URL}/${file.signedPath}`;
  return undefined;
}

/**
 * Logos that NocoDB holds but cannot serve to a browser, keyed by `Startup Name`.
 *
 * Spherecast's NocoDB upload is a real, valid SVG, but the stored filename ends in
 * `.svg+xml` (a Webflow/`Save as XML SVG` export). NocoDB therefore responds with
 * `Content-Type: application/octet-stream` and `Content-Disposition: attachment`,
 * and browsers refuse to render that in an `<img>` — the logo is simply blank on
 * `/startups`, `/startup-details/:id` and the home marquee. Verified in Chromium:
 * the NocoDB URL decodes to `naturalWidth === 0`, the vendored one to 1588×262.
 *
 * The mark is vendored from the URL Valentin supplied rather than re-uploaded to
 * NocoDB, so the fix ships from the repo and does not depend on someone with CMS
 * access. Delete this entry once the NocoDB attachment is replaced with a plain
 * `.svg` upload.
 */
const LOGO_OVERRIDES: Record<string, string> = {
  Spherecast: '/ourStartups/spherecast-logo.svg',
};

/** Resolve the logo to render for a startup, honouring {@link LOGO_OVERRIDES}. */
export function resolveLogoUrl(name: string, attachment: unknown): string | undefined {
  const override = LOGO_OVERRIDES[name];
  if (override) return override;
  return attachmentUrl(attachment);
}

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
      const resolved = attachmentUrl(record['Member Picture'][0]);
      if (resolved) {
        profilePicUrl = resolved;
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
    const resolved = resolveLogoUrl(record['Startup Name'] || '', record['Company Logo'][0]);
    if (resolved) {
      logoUrl = resolved;
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
