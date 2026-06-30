const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN;
const NOCODB_BASE_URL = process.env.NOCODB_BASE_URL || 'https://ndb.startmunich.de';
const NOCODB_PARTNERS_TABLE_ID = process.env.NOCODB_PARTNERS_TABLE_ID;
const NOCODB_TIMEOUT_MS = 10_000;

export interface Partner {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  featured?: boolean;
}

interface NocoDBPartnerRecord {
  Id?: number | string;
  Name?: string;
  Categrory?: string;
  Featured?: boolean | number | string;
  Show?: boolean | number | string;
  Logo?: Array<{ signedPath?: string }>;
}

function transformNocoDBRecord(record: NocoDBPartnerRecord): Partner {
  let logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(record.Name || 'Partner')}&size=300&background=4f46e5&color=fff&bold=true&font-size=0.4`;

  if (record.Logo && Array.isArray(record.Logo) && record.Logo[0]) {
    const logo = record.Logo[0];
    if (logo.signedPath) {
      logoUrl = `https://ndb.startmunich.de/${logo.signedPath}`;
    }
  }

  return {
    // Deterministic fallback so React keys stay stable across refetches;
    // Name is required-ish (defaulted to 'Unnamed Partner' below).
    id: String(record.Id ?? record.Name ?? 'unnamed-partner'),
    name: record.Name || 'Unnamed Partner',
    category: record.Categrory || 'Other',
    logoUrl,
    featured:
      record.Featured === true ||
      record.Featured === 1 ||
      String(record.Featured).toLowerCase() === 'true',
  };
}

export async function getAllPartners(): Promise<Partner[]> {
  if (!NOCODB_API_TOKEN || !NOCODB_PARTNERS_TABLE_ID) {
    console.error('NocoDB not configured - missing API token or partners table ID');
    return [];
  }

  try {
    const response = await fetch(
      `${NOCODB_BASE_URL}/api/v2/tables/${NOCODB_PARTNERS_TABLE_ID}/records?limit=1000&offset=0`,
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
      console.error(`NocoDB API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    return (data.list || [])
      .filter((record: NocoDBPartnerRecord) => {
        const show = record.Show;
        return show === true || show === 1 || String(show).toLowerCase() === 'true';
      })
      .map(transformNocoDBRecord);
  } catch (error) {
    console.error('Error fetching partners from NocoDB:', error);
    return [];
  }
}
