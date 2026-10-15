import { ArrowRightIcon } from 'lucide-react';

import { LogoFlare } from '@/components/flare';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';

/** "Driven by passion. Built by students." — closing pitch with the WebGPU logo flare. */
export function CommunitySection() {
  return (
    <Section spacing="lg">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <Eyebrow>About START Munich</Eyebrow>
          <Heading size="h2" className="mb-2 leading-tight">
            Driven by passion. <span className="text-outline">Built by students.</span>
          </Heading>
          <Text>
            START Munich is the largest student-run entrepreneurship initiative in Germany,
            empowering the next generation of founders through education, networking, and hands-on
            experience.
          </Text>
          <Text>
            We believe in the power of student-driven innovation and provide a platform where bold
            ideas can become reality.
          </Text>
          <div className="my-2 flex flex-wrap gap-3">
            {['Education', 'Community', 'Hands-on experience'].map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <ButtonLink href="/member-journey" size="lg" className="group whitespace-normal">
            Discover How Our Community Is Run
            <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
          </ButtonLink>
        </div>

        {/* WebGPU logo flare. Two independent breakpoints: the panel's SHAPE
            switches at `lg` (1:1 square up to it, tall 600px above), while the
            MARK switches earlier, at `sm` (round icon on phones, wordmark from
            tablet width up). Mirrored by WORDMARK_QUERY in
            components/flare/renderer.ts. */}
        <div className="relative">
          <div
            data-flare-panel
            className="relative aspect-square overflow-hidden rounded-3xl border-2 border-border lg:aspect-auto lg:h-[600px]"
          >
            <LogoFlare />
          </div>
          <div
            aria-hidden
            className="absolute -right-10 -bottom-10 size-40 rounded-full bg-primary/20 blur-[60px]"
          />
        </div>
      </div>
    </Section>
  );
}
