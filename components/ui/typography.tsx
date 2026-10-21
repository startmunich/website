import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * The type scale. Every heading on the site is one of these five sizes; pick by
 * visual role, then set the semantic level with `as` (or `render`).
 *
 *   display  page hero title             "WHO WE ARE"
 *   h1       standalone page title       legal pages, 404
 *   h2       section title               "THE FACTS", "LATEST NEWS"
 *   h3       sub-section / feature card  "Empowering founders of tomorrow."
 *   h4       card title                  a person's name, an event title
 */
const headingVariants = cva('text-balance text-foreground', {
  variants: {
    size: {
      display:
        'text-5xl leading-[0.95] font-black tracking-tight uppercase sm:text-6xl lg:text-8xl',
      h1: 'text-4xl leading-none font-black tracking-tight uppercase sm:text-5xl lg:text-6xl',
      h2: 'text-4xl leading-none font-black tracking-tight uppercase sm:text-5xl lg:text-6xl',
      h3: 'text-2xl leading-tight font-black uppercase lg:text-4xl',
      h4: 'text-lg leading-snug font-bold',
    },
  },
  defaultVariants: { size: 'h2' },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';

type HeadingProps = useRender.ComponentProps<'h2'> &
  VariantProps<typeof headingVariants> & {
    /** Semantic element. Defaults to the size when that is a heading level. */
    as?: HeadingLevel;
  };

function Heading({ className, size = 'h2', as, render, ...props }: HeadingProps) {
  const tag: HeadingLevel = as ?? (size === 'display' ? 'h1' : (size ?? 'h2'));
  return useRender({
    defaultTagName: tag as 'h2',
    render,
    props: mergeProps<'h2'>({ className: cn(headingVariants({ size }), className) }, props),
    state: { slot: 'heading' },
  });
}

/** The small, tracked, brand-coloured label that sits above a section title. */
function Eyebrow({ className, render, ...props }: useRender.ComponentProps<'p'>) {
  return useRender({
    defaultTagName: 'p',
    render,
    props: mergeProps<'p'>(
      {
        className: cn(
          'text-xs font-bold tracking-eyebrow text-primary uppercase sm:text-sm',
          className,
        ),
      },
      props,
    ),
    state: { slot: 'eyebrow' },
  });
}

const textVariants = cva('text-pretty', {
  variants: {
    variant: {
      /** Intro paragraph under a hero or section title. */
      lead: 'text-lg leading-relaxed text-muted-foreground sm:text-xl',
      /** Running copy. */
      body: 'text-base leading-relaxed text-muted-foreground lg:text-lg',
      /** Supporting copy inside cards. */
      small: 'text-sm leading-relaxed text-muted-foreground',
      /** Tracked uppercase metadata: stat labels, roles, dates. */
      label: 'text-xs font-semibold tracking-widest text-muted-foreground uppercase',
    },
  },
  defaultVariants: { variant: 'body' },
});

type TextProps = useRender.ComponentProps<'p'> & VariantProps<typeof textVariants>;

function Text({ className, variant, render, ...props }: TextProps) {
  return useRender({
    defaultTagName: 'p',
    render,
    props: mergeProps<'p'>({ className: cn(textVariants({ variant }), className) }, props),
    state: { slot: 'text' },
  });
}

export { Eyebrow, Heading, headingVariants, Text, textVariants };
export type { HeadingProps, TextProps };
