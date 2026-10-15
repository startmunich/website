import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

/**
 * Page layout primitives. Pages are a stack of <Section>s; each one owns its
 * vertical rhythm and wraps a <Container> that owns the horizontal gutter and
 * max width. Nothing else on a page should set outer padding or `mx-auto`.
 */

const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      /** Long-form reading width (legal pages, articles). */
      prose: 'max-w-3xl',
      narrow: 'max-w-5xl',
      default: 'max-w-7xl',
      wide: 'max-w-[1400px]',
    },
  },
  defaultVariants: { size: 'default' },
});

type ContainerProps = React.ComponentProps<'div'> & VariantProps<typeof containerVariants>;

function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div data-slot="container" className={cn(containerVariants({ size }), className)} {...props} />
  );
}

const sectionVariants = cva('relative', {
  variants: {
    spacing: {
      none: '',
      sm: 'py-12 md:py-16',
      default: 'py-16 md:py-24',
      lg: 'py-20 md:py-28',
    },
  },
  defaultVariants: { spacing: 'default' },
});

type SectionProps = React.ComponentProps<'section'> &
  VariantProps<typeof sectionVariants> & {
    /** Container width. Pass `false` to render children full-bleed. */
    container?: VariantProps<typeof containerVariants>['size'] | false;
    containerClassName?: string;
  };

function Section({
  className,
  spacing,
  container = 'default',
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section data-slot="section" className={cn(sectionVariants({ spacing }), className)} {...props}>
      {container === false ? (
        children
      ) : (
        <Container size={container} className={containerClassName}>
          {children}
        </Container>
      )}
    </section>
  );
}

type SectionHeaderProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons or links aligned with the title. */
  actions?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  /** Heading element; the visual size is always `h2`. */
  as?: 'h1' | 'h2' | 'h3';
  size?: 'h2' | 'h3';
};

/** Eyebrow + title + optional description and actions. Used at the top of every section. */
function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  align = 'start',
  as = 'h2',
  size = 'h2',
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      className={cn(
        'mb-10 flex flex-col gap-6 md:mb-12',
        actions && align === 'start' && 'md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center',
        align === 'end' && 'items-end text-right',
        className,
      )}
      {...props}
    >
      <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center')}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading as={as} size={size}>
          {title}
        </Heading>
        {description && (
          <Text variant="body" className={cn('mt-1 max-w-3xl', align === 'end' && 'ml-auto')}>
            {description}
          </Text>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export { Container, containerVariants, Section, SectionHeader, sectionVariants };
export type { ContainerProps, SectionHeaderProps, SectionProps };
