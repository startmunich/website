import { Metadata } from 'next';

import BatchDetailClient from './BatchDetailClient';

interface PageProps {
  params: Promise<{ batch: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { batch } = await params;
  const batchName = batch.toUpperCase().replace('-', ' ');

  return {
    title: `${batchName} - START Munich Members`,
    description: `Meet the members of ${batchName} batch at START Munich.`,
  };
}

export default async function BatchDetailPage({ params }: PageProps) {
  const { batch } = await params;

  return <BatchDetailClient batchSlug={batch} />;
}
