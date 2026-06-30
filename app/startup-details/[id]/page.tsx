import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { OG_IMAGES } from '@/lib/metadata';
import { getStartupById } from '@/lib/startups';

import StartupDetailsContent from './StartupDetailsContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const company = await getStartupById(id).catch(() => null);

  if (company) {
    const description =
      company.description ||
      `Learn about ${company.name}, a startup founded by START Munich alumni.`;
    return {
      title: company.name,
      description,
      alternates: { canonical: `https://www.startmunich.de/startup-details/${id}` },
      openGraph: {
        url: `https://www.startmunich.de/startup-details/${id}`,
        title: `${company.name} | START Munich`,
        description,
        images: OG_IMAGES,
      },
    };
  }

  return {
    title: 'Startup',
    description: 'A startup founded by START Munich alumni.',
    alternates: { canonical: `https://www.startmunich.de/startup-details/${id}` },
  };
}

export default async function StartupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getStartupById(id);
  if (!company) {
    notFound();
  }
  return <StartupDetailsContent company={company} />;
}
