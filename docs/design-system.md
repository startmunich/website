# Design system

The START Munich site is built from one set of tokens and one set of components. This page is the
reference for both. If you are about to write a hex value, a `rounded-[…]`, an inline `style`, or a
hand-styled `<button>`, there is almost certainly a token or component for it below.

Stack: **Tailwind CSS 4** (CSS-first config, no `tailwind.config.ts`) + **shadcn/ui on Base UI**
(`base-nova` style, `@base-ui/react`) + **React 19**.

## Tokens

All tokens live in [`app/globals.css`](../app/globals.css), in three layers. Each layer may only
reference the one above it.

1. **Brand palette** (`--brand-pink`, `--brand-navy`, `--brand-blue`, `--brand-indigo`): raw
   colours.
2. **Semantic tokens** (`--background`, `--primary`, …): what components use. Defined on `:root`
   because the site is dark-only.
3. **Tailwind theme** (`@theme inline`): exposes the tokens as utilities (`bg-primary`,
   `text-muted-foreground`, `rounded-2xl`, `shadow-glow`, …).

### Colour

| Utility                              | Role                                                      |
| ------------------------------------ | --------------------------------------------------------- |
| `bg-background` / `text-foreground`  | Page background (navy `#00002c`) and body text (white)    |
| `bg-primary` / `text-primary`        | Brand pink `#d0006f`: CTAs, eyebrows, affixes, highlights |
| `text-primary-foreground`            | Text on a primary fill                                    |
| `bg-secondary`                       | Brand blue `#011152`                                      |
| `bg-card`                            | Translucent raised surface (5% white)                     |
| `bg-surface`                         | Opaque raised surface (indigo), for gradients and panels  |
| `bg-popover`                         | Opaque floating surface (menus, popovers, sheets)         |
| `bg-muted` / `text-muted-foreground` | Subdued fill / secondary text (68% white)                 |
| `bg-accent`                          | Hover fill for interactive surfaces                       |
| `border-border` / `border-input`     | Hairlines / form-control borders                          |
| `ring-ring`                          | Focus ring                                                |
| `text-success` / `text-destructive`  | Status                                                    |
| `bg-brand-pink`, `text-brand-navy`   | Raw palette, only where a colour must not follow a theme  |
| `text-linkedin`, `text-instagram`    | Third-party marks                                         |

Use opacity modifiers for tiers (`text-foreground/80`, `border-primary/30`) rather than new colours.
White text over photography (`text-white`) is the one intentional exception, because it must not
follow a theme.

### Radius

One knob, `--radius` (`0.75rem`); the scale is derived from it.

| Utility        | Used for                                   |
| -------------- | ------------------------------------------ |
| `rounded-lg`   | Buttons, inputs, selects, tabs             |
| `rounded-xl`   | Portraits, logo tiles, icon tiles          |
| `rounded-2xl`  | Cards                                      |
| `rounded-3xl`  | Feature panels, CTA banners, hero media    |
| `rounded-full` | Badges, pills, avatars, `shape="pill"` CTA |

No arbitrary radii (`rounded-[1.75rem]`). A sub-brand that needs squarer or rounder corners changes
`--radius`, not the classes.

### Typography

Avenir Next (500 body, 600/700 UI emphasis, 900 display) and JetBrains Mono (Labs only), both loaded
with `next/font` in [`app/fonts.ts`](../app/fonts.ts). Use the components, not raw sizes:

| Component                  | Renders                                                |
| -------------------------- | ------------------------------------------------------ |
| `<Heading size="display">` | Page hero title. `h1` by default.                      |
| `<Heading size="h1">`      | Standalone page title (legal, 404).                    |
| `<Heading size="h2">`      | Section title. Uppercase, black weight.                |
| `<Heading size="h3">`      | Sub-section / feature title.                           |
| `<Heading size="h4">`      | Card title.                                            |
| `<Eyebrow>`                | Tracked pink label above a title (`tracking-eyebrow`). |
| `<Text variant="lead">`    | Intro paragraph.                                       |
| `<Text>` (`body`)          | Running copy.                                          |
| `<Text variant="small">`   | Card copy.                                             |
| `<Text variant="label">`   | Tracked uppercase metadata (stat labels, roles).       |
| `text-2xs`                 | The one step below `text-xs`, for dense metadata.      |
| `text-outline`             | Hollow display type for the second half of a title.    |

`Heading` picks its element from `size`; override the semantic level with `as` (`as="h3"`).

### Spacing and layout

| Component           | Owns                                                                  |
| ------------------- | --------------------------------------------------------------------- |
| `<Section spacing>` | Vertical rhythm: `sm` (48/64px), `default` (64/96px), `lg` (80/112px) |
| `<Container size>`  | Gutter (16/24/32px) and width: `prose`, `narrow`, `default`, `wide`   |
| `<SectionHeader>`   | Eyebrow + title + description + actions, with a consistent bottom gap |

Pages are a stack of `Section`s. Nothing else on a page sets outer padding or `mx-auto`. Grids use
`gap-6` for cards and `gap-4` for dense tiles.

### Motion and elevation

`shadow-glow` (primary-coloured hover glow), `shadow-card`, `animate-marquee[-reverse|-vertical]`,
`animate-blob`, `animate-fly-in`, `animate-fade-in-up`, and the `reveal` utility. Everything that
moves respects `prefers-reduced-motion`.

## Sub-brand themes

START Labs, START Hack Munich and Road to START Summit keep their own look by re-mapping the same
semantic tokens under a class, so every shared component works inside them unchanged:

| Class         | Look                                                    |
| ------------- | ------------------------------------------------------- |
| `.theme-labs` | Black, teal accent, mono body copy, near-square corners |
| `.theme-rtsh` | Deep teal, mint accent                                  |
| `.theme-rtss` | Inverted: hot-pink page, navy panels, white CTAs        |

Wrap the microsite root in the class. Do not hard-code a sub-brand's colours in markup.

**Re-declare every token a sub-brand changes.** `:root` defines `--card-foreground` and
`--popover-foreground` as `var(--foreground)`, and that `var()` is substituted _at `:root`_ — the
resulting value is then inherited down, so overriding only `--foreground` leaves cards and popovers
on the old colour. A theme that changes `--foreground` must set `--card-foreground` and
`--popover-foreground` alongside it. Same for `--ring: var(--primary)`: declare it per theme rather
than relying on the `:root` substitution.

## Components

### Primitives: `components/ui/`

shadcn/ui `base-nova` components on Base UI, adapted to the tokens. They follow the current shadcn
shape: plain function components with a `data-slot` attribute, `cva` variants, and a `cn(...)`
className that callers can extend. Polymorphism goes through Base UI's `render` prop
(`<Card render={<Link href="…" />}>`), not `asChild`.

| Component                                                                                                                                                                                                                            | Notes                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`, `ButtonLink`                                                                                                                                                                                                               | Variants `default`, `inverse`, `outline`, `soft`, `ghost`, `link`, `destructive`; sizes `sm`/`default`/`lg`/`icon*`; `shape="pill"`. `ButtonLink` handles internal vs external links. |
| `Badge`                                                                                                                                                                                                                              | `default`, `secondary`, `soft`, `outline`, `glass`, `success`, `destructive`                                                                                                          |
| `Card` (+ `CardMedia`, `CardHeader`, …)                                                                                                                                                                                              | `variant` `default`/`highlight`/`glass`/`solid`, `size`, `interactive`                                                                                                                |
| `Heading`, `Eyebrow`, `Text`                                                                                                                                                                                                         | The type scale                                                                                                                                                                        |
| `Section`, `Container`, `SectionHeader`                                                                                                                                                                                              | Layout                                                                                                                                                                                |
| `Reveal`, `Marquee`                                                                                                                                                                                                                  | Scroll-in and infinite ticker                                                                                                                                                         |
| `IconTile`, `BulletList`, `Prose`                                                                                                                                                                                                    | Small content patterns                                                                                                                                                                |
| `Accordion`, `Tabs`, `NavigationMenu`, `Sheet`, `Dialog`, `Popover`, `Tooltip`, `Select`, `ToggleGroup`, `ScrollArea`, `Pagination`, `Progress`, `Avatar`, `Input`, `Textarea`, `Field`, `Skeleton`, `Spinner`, `Empty`, `Separator` | shadcn/Base UI                                                                                                                                                                        |

Add more with `pnpm dlx shadcn@latest add <name>`, then check the generated imports: the CLI
sometimes writes `from "cn"`, which must be `from "@/lib/utils"`. It will also offer to overwrite
`button.tsx`; decline, because ours carries the brand variants.

### Site composites: `components/site/`

Built only from primitives and tokens.

| Component                                                          | Used for                                                                       |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `SiteChrome`, `SiteHeader`, `SiteFooter`                           | Header (NavigationMenu + mobile Sheet) and footer, rendered from `lib/site.ts` |
| `MicrositeFooter`                                                  | Footer for standalone event microsites                                         |
| `PageHero`                                                         | Photographic page header with an optional `aside`                              |
| `HeroStats`, `HeroStat`, `StatCard`, `StatValue`, `AnimatedNumber` | Figures with brand-coloured affixes                                            |
| `CtaBanner`, `BrandPanel`                                          | Closing call to action and the brand feature surface                           |
| `FeatureCard`                                                      | Icon + title + copy tiles in bento grids                                       |
| `ProfileCard`                                                      | People: boards, advisors, batches (`stacked` or `overlay`)                     |
| `EventCard`, `NewsCard`, `TestimonialCard`                         | Content cards                                                                  |
| `LogoImage`, `LogoTile`                                            | Logos with a name fallback, and the white logo plate                           |
| `Faq`                                                              | Accordion of question cards                                                    |
| `InfoPopover`                                                      | (i) explainer that works on hover and tap                                      |
| `Pager`                                                            | Windowed client-side pagination                                                |
| `HorizontalScroller`                                               | Horizontal row with a brand scrollbar and drag-to-scroll                       |
| `SocialLinks`, `EmptyState`                                        | Social profiles; empty data states                                             |

### Page-specific components

Colocated with their route in `app/<route>/` (PascalCase files, matching the existing convention).
Pages render Server Components by default and keep interactivity in small client islands, e.g.
`app/home/NewsSection.tsx`, `app/members/BoardsSection.tsx`, `app/labs/JourneyTimeline.tsx`.

## Rules

- **No hex values or arbitrary colours in markup.** Use a semantic token; if none fits, add one to
  `globals.css`.
- **No inline `style`** except for values computed at runtime (a CMS colour, a marker position, a
  stagger delay). Leave a comment saying why.
- **No hand-styled interactive elements.** Buttons, links-as-buttons, toggles, tabs, accordions and
  menus come from `components/ui/`.
- **One `<main>` per page**, owned by `SiteChrome`. Pages render sections, not `<main>`.
- **Navigation and site links** (`siteLinks`, `mainNav`, `standaloneRoutes`) live in
  [`lib/site.ts`](../lib/site.ts).
- Run `pnpm format:write`: Prettier sorts classes using the theme in `globals.css`
  (`tailwindStylesheet`), so custom tokens sort correctly.
