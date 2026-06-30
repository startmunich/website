import type { Metadata } from 'next';

import StartGoesBayAreaContent from './components/StartGoesBayAreaContent';

export const metadata: Metadata = {
  title: 'START goes Bay Area | START Munich',
  description:
    'A selective international exchange program by START Munich connecting entrepreneurial talent with the Bay Area innovation ecosystem.',
};

export default function StartGoesBayAreaPage() {
  return <StartGoesBayAreaContent />;
}
