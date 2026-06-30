'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStandaloneEventPage = pathname === '/eventpage/rtss' || pathname === '/eventpage/rtsh';

  if (isStandaloneEventPage) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
