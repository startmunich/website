import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Section
      spacing="lg"
      containerClassName="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center"
    >
      <Eyebrow>404</Eyebrow>
      <Heading size="h1">
        Page <span className="text-outline">not found</span>
      </Heading>
      <Text variant="lead" className="max-w-xl">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </Text>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg">
          Back to home
        </ButtonLink>
        <ButtonLink href="/events" size="lg" variant="outline">
          See our events
        </ButtonLink>
      </div>
    </Section>
  );
}
