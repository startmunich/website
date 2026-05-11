import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BatchDetail from './BatchDetail'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    batch: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const batchName = decodeURIComponent(params.batch).replace(/_/g, ' ')

  return {
    title: `${batchName} | Members`,
    description: `Meet the ${batchName} batch members of START Munich.`,
    alternates: { canonical: `https://www.startmunich.de/members/${params.batch}` },
    openGraph: {
      url: `https://www.startmunich.de/members/${params.batch}`,
      title: `${batchName} | START Munich`,
      description: `Meet the ${batchName} batch members of START Munich.`,
    },
  }
}

export default function BatchPage({ params }: PageProps) {
  const batchName = decodeURIComponent(params.batch).replace(/_/g, ' ')

  return <BatchDetail batchName={batchName} />
}
