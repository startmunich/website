'use client';

import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Heading, Text } from '@/components/ui/typography';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section
      spacing="lg"
      containerClassName="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center"
    >
      <Heading size="h1">Something went wrong</Heading>
      <Text variant="lead">
        Please try again. If the problem persists, come back in a few minutes.
      </Text>
      <Button size="lg" onClick={reset}>
        Try again
      </Button>
    </Section>
  );
}
