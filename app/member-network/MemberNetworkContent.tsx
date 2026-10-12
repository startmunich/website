'use client';

import Image from 'next/image';
import Script from 'next/script';
import { useEffect, useState } from 'react';

import Hero from '@/components/Hero';

export const dynamic = 'force-dynamic';

interface Company {
  id: string;
  name: string;
  type: string;
  logoUrl: string;
}

async function fetchCompanies(): Promise<Company[]> {
  try {
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/member-network`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching member network:', error);
    return [];
  }
}

function LogoCard({ company }: { company: Company }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex min-h-[100px] items-center justify-center rounded-xl border border-white/10 bg-white p-5 transition-all duration-300 hover:border-[#d0006f]/50 hover:shadow-lg hover:shadow-[#d0006f]/10">
      {company.logoUrl && !imgFailed ? (
        <div className="relative h-14 w-full">
          <Image
            src={company.logoUrl}
            alt={company.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain"
            onError={() => setImgFailed(true)}
          />
        </div>
      ) : (
        <h3 className="text-center text-lg font-bold text-gray-700">{company.name}</h3>
      )}
    </div>
  );
}

export default function MemberNetworkPage() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchCompanies().then((data) => {
      setCompanies(data);
      setLoading(false);
    });
  }, []);

  // Group by Type
  const categories = Array.from(new Set(companies.map((c) => c.type))).sort(
    (a, b) =>
      companies.filter((c) => c.type === b).length - companies.filter((c) => c.type === a).length,
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#00002c] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-2xl font-bold text-white">Loading member network...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Script id="iframe-height-sender" strategy="afterInteractive">
        {`
          function sendHeight() {
            const h = Math.max(
              document.documentElement.scrollHeight,
              document.body.scrollHeight
            );
            parent.postMessage({ type: "EMBED_HEIGHT", height: h }, "*");
          }

          window.addEventListener("load", sendHeight);
          const ro = new ResizeObserver(sendHeight);
          ro.observe(document.documentElement);
          document.addEventListener("DOMContentLoaded", sendHeight);
        `}
      </Script>

      <main className="min-h-screen bg-[#00002c]">
        <Hero
          backgroundImage="/memberNetwork/hero-opt.png"
          title={
            <>
              MEMBER
              <br />
              <span className="outline-text">NETWORK</span>
            </>
          }
          description="Discover where our talented members are making their mark across the industry"
        />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-20">
          <div className="relative mb-16 w-full overflow-hidden rounded-2xl border-2 border-[#d0006f]/50 bg-gradient-to-br from-[#1a1a3e] via-[#00002c] to-[#0d0d1f] p-8 shadow-2xl shadow-[#d0006f]/20 md:p-10">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d0006f]/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#d0006f]/5 blur-3xl"></div>
            <div className="relative">
              <h2 className="mb-3 text-xl font-bold text-white md:text-2xl">
                Where Our Members Work
              </h2>
              <p className="text-gray-400">
                Our community spans some of the world&apos;s leading companies, research
                institutions, and startups. From global tech giants to early-stage ventures, START
                Munich members are building careers that make an impact.
              </p>
            </div>
          </div>

          {categories.map((category) => (
            <div key={category} className="mb-16">
              <h2 className="mb-6 text-xl font-black text-white md:text-2xl">{category}</h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {companies
                  .filter((c) => c.type === category)
                  .map((company) => (
                    <LogoCard key={company.id} company={company} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
