import './globals.css';

import type { Metadata, Viewport } from 'next';

import SiteChrome from '@/components/SiteChrome';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'START Munich',
    template: '%s | START Munich',
  },
  description:
    'START Munich is the largest student-run entrepreneurship community in Munich. We empower the next generation of founders to dare, build, and belong.',
  metadataBase: new URL('https://www.startmunich.de'),
  openGraph: {
    type: 'website',
    url: 'https://www.startmunich.de',
    siteName: 'START Munich',
    title: 'START Munich',
    description:
      'START Munich is the largest student-run entrepreneurship community in Munich. We empower the next generation of founders to dare, build, and belong.',
    images: [
      {
        url: '/START_munich_black-01.png',
        width: 1920,
        height: 1120,
        alt: 'START Munich Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "START Munich – Europe's Student Entrepreneurship Community",
    description: 'The largest student-run entrepreneurship community in Munich.',
    images: ['/START_munich_black-01.png'],
  },
  icons: {
    icon: [{ url: '/startIcon.png', type: 'image/png' }],
    apple: '/startIcon.png',
    shortcut: '/startIcon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords: [
    'START Munich',
    'student entrepreneurship',
    'TU Munich',
    'startup community',
    'founders',
    'Munich startups',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-brand-dark-blue">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
