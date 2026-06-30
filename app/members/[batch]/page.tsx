import type { Metadata } from 'next';

import BatchDetail from './BatchDetail';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    batch: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { batch } = await params;
  const batchName = decodeURIComponent(batch).replace(/_/g, ' ');

  return {
    title: `${batchName} | Members`,
    description: `Meet the ${batchName} batch members of START Munich.`,
    alternates: { canonical: `https://www.startmunich.de/members/${batch}` },
    openGraph: {
      url: `https://www.startmunich.de/members/${batch}`,
      title: `${batchName} | START Munich`,
      description: `Meet the ${batchName} batch members of START Munich.`,
    },
  };
}

export default async function BatchPage({ params }: PageProps) {
  const { batch } = await params;
  const batchName = decodeURIComponent(batch).replace(/_/g, ' ');

  return <BatchDetail batchName={batchName} />;
}
