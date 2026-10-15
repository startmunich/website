import * as React from 'react';

import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NoiseTexture } from '@/components/ui/noise-texture';
import { Reveal } from '@/components/ui/reveal';
import { Container } from '@/components/ui/section';
import { cn } from '@/lib/utils';

/**
 * START Labs building blocks. They sit on top of the shared primitives and only
 * add the sub-brand's voice: monospace `// labels`, square slide-fill buttons,
 * accent-ruled cards. Colours come from `.theme-labs`.
 */

/** The `// comment`-style label the Labs brand uses for eyebrows and metadata. */
export function LabsLabel({
  size = 'sm',
  className,
  ...props
}: React.ComponentProps<'span'> & { size?: 'xs' | 'sm' | 'lg' }) {
  return (
    <span
      className={cn(
        'font-mono tracking-[0.15em] uppercase',
        size === 'xs' && 'text-2xs text-primary',
        size === 'sm' && 'text-xs text-muted-foreground',
        size === 'lg' && 'block text-center text-base text-primary',
        className,
      )}
      {...props}
    />
  );
}

/** Display heading in the Labs voice: Avenir Heavy, uppercase, tight. */
export function LabsHeading({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'text-center text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] font-black tracking-tight text-foreground uppercase',
        className,
      )}
      {...props}
    />
  );
}

/** Outlined CTA whose fill slides up from the bottom on hover. */
export function LabsCta({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ButtonLink>) {
  return (
    <ButtonLink
      variant="outline"
      className={cn(
        'group/cta relative h-auto overflow-hidden rounded-none border-primary bg-transparent px-12 py-4 font-mono text-xs font-semibold tracking-[0.15em] text-primary uppercase hover:bg-transparent hover:text-primary-foreground',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full bg-primary transition-transform duration-300 ease-out group-hover/cta:translate-y-0"
      />
      <span className="relative">{children}</span>
    </ButtonLink>
  );
}

/** A card with the brand's accent rule down the left edge. */
export function LabsCard({
  tone = 'primary',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { tone?: 'primary' | 'success' | 'destructive' }) {
  return (
    <Card
      size="lg"
      className={cn(
        'group/card h-full cursor-default rounded-none border-l-2 border-foreground/5 bg-foreground/3 transition-all duration-300 hover:-translate-y-0.5',
        tone === 'primary' &&
          'border-l-primary hover:shadow-[0_4px_20px_color-mix(in_oklab,var(--primary)_8%,transparent)]',
        tone === 'success' &&
          'border-l-success hover:shadow-[0_4px_20px_color-mix(in_oklab,var(--success)_8%,transparent)]',
        tone === 'destructive' &&
          'border-l-destructive hover:shadow-[0_4px_20px_color-mix(in_oklab,var(--destructive)_8%,transparent)]',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 px-(--card-spacing)">{children}</div>
    </Card>
  );
}

/** A soft accent-coloured glow positioned behind section content. */
export function Glow({ className, strength = 15 }: { className?: string; strength?: number }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute hidden rounded-full blur-[120px] md:block',
        className,
      )}
      // Strength is per-instance, so it is passed as a variable.
      style={{ '--glow': `${strength}%` } as React.CSSProperties}
    >
      <div className="size-full rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_var(--glow),transparent)_0%,transparent_70%)]" />
    </div>
  );
}

/** Section shell: optional noise and glow, centred narrow container, reveal on scroll. */
export function LabsSection({
  id,
  noise = 0.25,
  className,
  containerClassName,
  decoration,
  children,
}: {
  id?: string;
  /** Opacity of the film-grain overlay, or `false` for none. */
  noise?: number | false;
  className?: string;
  containerClassName?: string;
  /** Absolutely positioned background art (glows, images). */
  decoration?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-20 overflow-hidden bg-background py-24 md:py-32',
        className,
      )}
    >
      {noise !== false && (
        <div className="hidden md:block">
          <NoiseTexture noiseOpacity={noise} />
        </div>
      )}
      {decoration}
      <Reveal className="relative z-10">
        <Container size="narrow" className={containerClassName}>
          {children}
        </Container>
      </Reveal>
    </section>
  );
}
