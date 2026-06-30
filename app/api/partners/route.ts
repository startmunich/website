import { NextResponse } from 'next/server';

import { getAllPartners } from '@/lib/partners';

export const revalidate = 3600;

export async function GET() {
  console.log('NOCODB_API_TOKEN:', process.env.NOCODB_API_TOKEN ? 'SET' : 'NOT SET');

  const partners = await getAllPartners();

  if (
    partners.length === 0 &&
    (!process.env.NOCODB_API_TOKEN || !process.env.NOCODB_PARTNERS_TABLE_ID)
  ) {
    return NextResponse.json({ error: 'NocoDB not configured for partners' }, { status: 500 });
  }

  return NextResponse.json(partners);
}
