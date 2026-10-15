'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { standaloneRoutes } from '@/lib/site';

/**
 * Wraps every route in the site header and footer, except standalone
 * microsites (see `standaloneRoutes`) which bring their own chrome.
 * This is the page's only <main>; pages render their sections directly.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const standalone = standaloneRoutes.some((route) => pathname.startsWith(route));

  if (standalone) {
    return <main className="grow">{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main className="grow overflow-x-clip">{children}</main>
      <SiteFooter />
    </>
  );
}
