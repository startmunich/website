# START Munich Website

The public website for [START Munich](https://www.startmunich.de) — the largest student-run
entrepreneurship community in Munich. A Next.js App Router application serving startup and member
directories, company detail pages, member batch pages, events, partners, application and waitlist
flows, plus a small set of public JSON API routes.

Content is not authored in the repo. It is read at request time from **NocoDB** (startups, members,
partners, news, waitlist), **Luma** (events), and the internal START Munich API (board + member
batch details), with results cached via ISR.

## Tech Stack

- **Next.js 15** (App Router, React 18, Server Components, ISR, route handlers)
- **TypeScript 5.9** (strict)
- **Tailwind CSS 3.4** + **shadcn/ui** (plus Aceternity and Magic UI registry components)
- **PostHog** for analytics (EU-hosted, proxied through Next.js rewrites)
- **Playwright** for end-to-end smoke tests
- **NocoDB** as the backend/content source
- **Cloudflare Turnstile** for waitlist captcha
- **pnpm 11** (enforced), **Node 24** (enforced via `engines` + `.nvmrc`)

## Requirements

- **Node 24** — `.nvmrc` pins `24.21.0`; `package.json` declares `engines.node: "24"`. Vercel only
  honors the major version, so `engines` is deliberately major-only.
- **pnpm 11** — pinned via the `packageManager` field. A `preinstall` hook
  (`scripts/enforce-pnpm.cjs`) fails the install if `npm` or `yarn` is used. Run `corepack enable`
  once, then always use `pnpm`.

## Getting Started

```bash
git clone git@github.com:startmunich/website.git
cd website

corepack enable          # once, if corepack isn't already active
pnpm install

cp .env.example .env.local   # then fill in real values
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

[`.env.example`](.env.example) is the source of truth and is annotated with which values are
required (uncommented) versus optional (commented). Summary:

### NocoDB (backend data source)

| Variable                   | Required | Notes                                    |
| -------------------------- | -------- | ---------------------------------------- |
| `NOCODB_API_TOKEN`         | yes      | NocoDB account token (`xc-token` header) |
| `NOCODB_BASE_URL`          | no       | Defaults to `https://ndb.startmunich.de` |
| `NOCODB_STARTUPS_TABLE_ID` | yes¹     | Startup / company directory              |
| `NOCODB_MEMBERS_TABLE_ID`  | yes¹     | Member overview page                     |
| `NOCODB_PARTNERS_TABLE_ID` | yes¹     | Partner logos and categories             |
| `NOCODB_NEWS_TABLE_ID`     | yes¹     | Home page news carousel                  |
| `NOCODB_WAITLIST_TABLE_ID` | yes²     | `/join-start/2026` waitlist submissions  |

¹ Without a token or table ID the affected section degrades to empty rather than crashing. ²
Required for `/api/waitlist` to accept anything.

### Other services

| Variable                            | Required | Notes                                                    |
| ----------------------------------- | -------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`    | yes²     | Baked into the client bundle at build time               |
| `TURNSTILE_SECRET_KEY`              | yes²     | Server-side Siteverify                                   |
| `LUMA_API_KEY`                      | no       | Without it `/events` shows an error state for both grids |
| `LUMA_DEBUG`                        | no       | Set to `1` to log per-request Luma summaries             |
| `STARTMUNICH_API_KEY`               | no       | Board data + member batch details from my.startmunich.de |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | no       | Omit to disable analytics entirely                       |
| `NEXT_PUBLIC_BASE_URL`              | no       | Absolute URLs for share links; Vercel sets this for prod |

### Where to set them

**Local** — `.env.local` (git-ignored), created from `.env.example`.

**Vercel** — Project → Settings → Environment Variables. Add a value for each key, scoped to
Production and/or Preview. Afterwards, redeploy — `NEXT_PUBLIC_*` variables are inlined at build
time, so a redeploy is required for changes to take effect.

### Finding NocoDB credentials

- **API token:** NocoDB → Account Settings → Tokens → create or copy one.
- **Table ID:** open the table; it is the last path segment of
  `https://ndb.startmunich.de/nc/{workspace}/{project}/table/{TABLE_ID}`.

## Routes

Pages (App Router, `app/`):

| Path                                 | Purpose                                              |
| ------------------------------------ | ---------------------------------------------------- |
| `/`                                  | Home — featured partners, startups, news, network    |
| `/about-us`                          | About the community                                  |
| `/member-journey`                    | The member journey / START network                   |
| `/members`                           | Member overview; `/members/[batch]` for batch detail |
| `/member-network`                    | Global START chapter network                         |
| `/startups`                          | Filterable startup directory                         |
| `/startup-details/[id]`              | Company detail page                                  |
| `/events`                            | Upcoming and past events (Luma)                      |
| `/partners`, `/for-partners`         | Partner showcase and partner CTA                     |
| `/apply`, `/join-start/2026`         | Application + waitlist flows                         |
| `/labs`                              | Labs programme                                       |
| `/start-goes-bay-area`               | START goes to the Bay Area landing page              |
| `/eventpage/rtss`, `/eventpage/rtsh` | Event sub-pages (RTSS, RTSH)                         |
| `/privacy-policy`, `/legal-notice`   | Legal pages                                          |
| `sitemap.xml`, `robots.txt`          | Generated by `app/sitemap.ts` / `app/robots.ts`      |

`/home` permanently redirects to `/` (see `next.config.js`).

API routes (`app/api/`), all read-only and ISR-cached for an hour:

| Route                           | Source                                     |
| ------------------------------- | ------------------------------------------ |
| `GET /api/startups`             | NocoDB — all companies                     |
| `GET /api/members`              | NocoDB — members                           |
| `GET /api/members/batch/[id]`   | START Munich internal API                  |
| `GET /api/member-network`       | NocoDB — global network member companies   |
| `GET /api/partners`             | NocoDB — partners                          |
| `GET /api/board`                | START Munich internal API                  |
| `GET /api/luma/upcoming-events` | Luma                                       |
| `GET /api/luma/past-events`     | Luma                                       |
| `POST /api/waitlist`            | NocoDB waitlist table (Turnstile-verified) |

## Project Structure

```
app/           Routes, layouts, API route handlers
components/    Shared components; components/ui holds shadcn + registry components,
               components/flare the WebGPU logo flare (see below)
lib/           Data fetching (startups, partners, startNetwork), types, metadata, hooks
scripts/       Repo scripts: pnpm enforcement/hygiene, image compression
tests/e2e/     Playwright specs
docs/          Setup guides
.github/       CI workflows, Renovate config, copilot-instructions.md
```

## Development Workflow

| Command                        | Purpose                                      |
| ------------------------------ | -------------------------------------------- |
| `pnpm dev`                     | Dev server                                   |
| `pnpm build` / `pnpm start`    | Production build / serve                     |
| `pnpm lint` / `pnpm lint:fix`  | ESLint 9 (flat config)                       |
| `pnpm typecheck`               | `tsc --noEmit`                               |
| `pnpm format:check` / `:write` | Prettier (cached)                            |
| `pnpm test:e2e`                | Playwright against `localhost:3000`          |
| `pnpm test:e2e:ui`             | Playwright UI mode                           |
| `pnpm package-manager:check`   | Assert pnpm hygiene (no `package-lock.json`) |

A **Husky** `pre-commit` hook runs **lint-staged** (ESLint `--fix` + Prettier on staged files) and
`commit-msg` runs **commitlint** against Conventional Commits. Dependency-bump commits
(`chore(deps)`, `fix(deps)`, …) are exempt from the message check.

### Testing strategy

`tests/e2e/smoke.spec.ts` is intentionally narrow: it asserts a 2xx and a visible main landmark for
each key route. It catches broken SSR, failed builds, and top-level routing breakage — it will not
fail on content changes. More specific assertions belong in per-page specs.

Locally, Playwright expects a server you started yourself (`pnpm dev`). In CI it targets a Vercel
preview URL via `PLAYWRIGHT_TEST_BASE_URL`.

## WebGPU logo flare

`components/flare` is the [vgpu](https://vgpu.dev) `nextjs-flare` example applied to the START
Munich wordmark. It renders the logo through a five-pass WebGPU pipeline (logo → rim → separable
blur → composite) with an animated light source that follows the pointer, and sits in the "About
START" panel above the footer. Colours come from the brand tokens: the flare is `brand-pink` and the
vignette fades to `brand-dark-blue` so the panel has no visible edge against the page.

Three things to know before changing it:

- **`.wgsl` needs a build-time loader.** `next.config.js` registers `@vgpu/wgsl/loader-webpack`
  twice — once under `turbopack.rules`, once in the `webpack()` hook — because `pnpm dev` and
  `pnpm build` use webpack today but Turbopack is the default going forward. If you add a shader and
  it fails to resolve, that config is the first thing to check.
- **Next never validates WGSL.** A malformed shader builds fine and fails in the browser. Gate
  shader edits with `npx vgpu check components/flare/<file>.wgsl --require-validation`.
- **It always degrades.** `navigator.gpu` missing, `requestAdapter()` returning null, or a device
  loss all fall back to the server-rendered wordmark in `components/flare/index.tsx`. `renderer.ts`
  also pauses the frame loop off screen and redraws a static frame only when the scene changes for
  `prefers-reduced-motion`. `tests/e2e/flare.spec.ts` pins the fallback contract; it cannot assert
  that the flare paints, because most CI runners have no GPU adapter.
- **`index.tsx` must not import from `pipeline.ts`.** That module pulls in `vgpu` and all four
  `.wgsl` chunks; the mark constants the component actually needs live in `logo-variants.ts` so the
  lazy `import('./renderer')` keeps the GPU bundle (~50 kB gzipped) out of the homepage's initial
  chunks. Re-exporting them from `pipeline.ts` would silently undo the split.
- **Don't put `touch-action: none` on the canvas.** It covers the whole panel, which is a full-width
  square on phones, so it would make a finger drag over that area stop scrolling the page. The
  renderer ignores touch pointers anyway.

`@vgpu/wgsl` and `@webgpu/types` are **dev**Dependencies — the loader is a build-time concern, and
pnpm's isolated `node_modules` would not otherwise expose the loader to `next.config.js`.
`@vgpu/adapter-node` and `webgpu` are in `allowBuilds: false` in `pnpm-workspace.yaml` because the
site only ever runs the browser adapter; the native Dawn prebuilids are not needed.

## WebGPU hero aura

`components/aura` is the second vgpu surface. Where the flare is a logo _spotlight_, the aura is a
slow ambient light field over every page's hero, rendered from a single fullscreen fragment pass. It
is mounted by `components/Hero.tsx`, so one insertion point lights up all ten pages that use the
shared hero (`/about-us`, `/events`, `/startups`, `/members`, `/partners`, `/member-journey`,
`/member-network`, `/for-partners`, `/start-goes-bay-area`, `/join-start/2026`). Pass `aura={false}`
to `Hero` to opt a specific hero out.

It is intentionally the opposite of the flare in its performance posture, because it runs on far
more pages and carries no detail worth resolving:

- **It rasterizes at a fraction of the canvas size.** `fieldDimensions()` caps the field's long edge
  at 380 px regardless of device pixel ratio, and the compositor interpolates it up to fill the hero
  — a full-viewport hero is typically ~4x more pixels than that. This is the single biggest reason
  it is affordable to run everywhere, and `tests/e2e/aura.spec.ts` asserts the ratio so a future
  "just use the DPR" change cannot slip in unnoticed.
- **The pass is pre-scaled for a premultiplied surface**, so the compositor's blend needs no divide,
  and there are no intermediate render targets.
- **The field is authored at low frequency on purpose.** Upscaled ~4x, anything finer than the broad
  shapes would be paid for and then thrown away by the interpolator.
- **It is invisible in the critical path.** `index.tsx` imports nothing but React and `cn`; the
  renderer, the pipeline, `vgpu` and the `.wgsl` chunk all arrive from a dynamic
  `import('./renderer')` in an effect. Same rule as the flare: **`index.tsx` must not import from
  `pipeline.ts`.**

Behaviour worth preserving:

- **The fallback is server-rendered DOM, not a canvas snapshot.** `FALLBACK_CLASSES` is a Tailwind
  `radial-gradient` built from the same brand tokens and the same arrangement as the shader, so a
  browser without WebGPU gets the same design intent in the initial HTML, with no layout shift. The
  canvas stays `opacity-0` until the renderer reports `ready`, then the two crossfade.
- **It is `pointer-events-none` unconditionally.** The hero's `children` render _inside_ the same
  box on desktop, so a decorative layer that swallowed clicks would break the stat cards and any
  links passed to `Hero` — with nothing visibly wrong.
- **It never reacts to the pointer**, unlike the flare. That is the point: this layer is on nearly
  every page, and a cursor-following light is a distraction device at that frequency.
- **`prefers-reduced-motion` draws exactly one frame.** The uniforms are then constant, so
  re-running the pass every tick would burn GPU forever to produce an identical image. Elapsed time
  accumulates by clamped per-frame delta rather than from the wall clock, so the drift stays
  continuous across a backgrounded tab instead of jumping.
- **It is suppressed over the headline.** The shader derives a "calm" ellipse from the canvas aspect
  — offset left when the copy sits beside the stat cards, centred and wider when the hero stacks —
  and fades the field to nothing inside it. Several heroes render the `<h1>` with `outline-text`,
  whose fill is transparent, so a uniform glow behind it would wreck legibility.

### Shared GPU code

`lib/gpu/runtime.ts` holds what the two features genuinely share: the fullscreen vertex stage, the
blue-noise texture upload (128x128 R8, row-repacked to the 256-byte `writeTexture` stride), and the
`runCleanups` / `bestEffort` teardown discipline. The 128x128 blue-noise asset moved there from
`components/flare/`.

Keep that module free of _value_ imports from `vgpu` — it has one type-only import, which TypeScript
erases. A runtime import there would defeat the lazy-chunk split for both features. It also must not
import from `components/flare` or `components/aura`; the dependency runs one way.

`next.config.js` registers the `.wgsl` loader for both bundlers, which covers `components/aura`
automatically — no change is needed there for a new shader. **Next still never validates WGSL**, so
gate shader edits with:

```bash
npx vgpu check components/aura/field.wgsl --require-validation
```

## CI/CD

- **`.github/workflows/quality.yml`** — runs on every PR to `main` and on pushes to `main`:
  commitlint → package-manager hygiene → Prettier → TypeScript → ESLint.
- **`.github/workflows/e2e.yml`** — triggered by Vercel's `deployment_status` event, runs the
  Playwright smoke suite against the real preview build. Requires `VERCEL_AUTOMATION_BYPASS_SECRET`
  because Vercel preview deployments are protected by default. Production deployments are skipped
  deliberately.
- **Renovate** (`renovate.json5`, Mend-hosted app) — checks daily before 06:00 Europe/Berlin. npm
  minor/patch and GitHub Actions updates are grouped and auto-merged once CI is green; npm majors
  require Dependency Dashboard approval. Vulnerability alerts (GHSA + OSV) ship immediately
  regardless of the schedule or release-age window. A separate workflow
  (`renovate-auto-approve.yml`) auto-approves Renovate PRs to satisfy the one-review branch
  protection rule.

### Dependency overrides

`pnpm-workspace.yaml` (not `package.json`) holds `allowBuilds` for native deps (`sharp`,
`protobufjs`, `unrs-resolver`, `core-js`) and `overrides` that pin transitive dependencies to
patched versions. Add CVE pins there.

## Deployment

Vercel, connected to the GitHub repo. There is no `vercel.json` — routing, the permanent `/home`
redirect, the PostHog `/ingest/*` proxy, and the image configuration all live in `next.config.js`.

Next.js image optimization is restricted to an explicit `remotePatterns` allowlist
(`ndb.startmunich.de`, `ui-avatars.com`, Unsplash, the object storage host, LinkedIn media). New
image hosts must be added there. Output is WebP-only with a one-year `minimumCacheTTL` — a
deliberate cost trade-off (each additional format is billed as a separate transformation).

Analytics requests are rewritten to the EU PostHog endpoints from the browser, so no
`api.east-*.posthog.com` calls leave the EU.

## Brand Colors

The brand palette lives in the `colors.brand` section of `tailwind.config.ts`. The UI font is
`Avenirnextltpro` (`fontFamily.sans`).

| Color              | Hex Code  | Tailwind Class         | Usage                                     |
| ------------------ | --------- | ---------------------- | ----------------------------------------- |
| **Pink**           | `#d0006f` | `brand-pink`           | Primary accent color, buttons, highlights |
| **Dark Blue**      | `#00002c` | `brand-dark-blue`      | Main background color                     |
| **Secondary Blue** | `#011152` | `brand-secondary-blue` | Department cards, secondary backgrounds   |

```tsx
className = 'bg-brand-pink';
className = 'text-brand-pink';
className = 'border-brand-pink';
className = 'bg-brand-pink/20';
className = 'hover:bg-brand-pink/90';
```

To change them, edit `colors.brand` in `tailwind.config.ts`:

```typescript
brand: {
  pink: "#d0006f",
  "dark-blue": "#00002c",
  "secondary-blue": "#011152",
}
```

## Data Sources

- **NocoDB** — startups, members, partners, news, waitlist, member network. The member-network table
  ID is currently hardcoded in `app/api/member-network/route.ts` rather than read from the
  environment; prefer adding it to `.env` if you touch that route.
- **Luma** — event calendar, proxied through `/api/luma/*` so the API key stays server-side.
- **my.startmunich.de** — board data and member batch details, authenticated with
  `STARTMUNICH_API_KEY`.
- **`lib/startNetwork.ts`** — the START chapter list, and the single source of truth for the
  chapter/country/member counts shown on the home page and member journey page. Add or remove a
  chapter there and both pages stay in sync.

## Further Documentation

- [`docs/waitlist-nocodb-setup.md`](docs/waitlist-nocodb-setup.md) — NocoDB waitlist table and
  Cloudflare Turnstile setup, including verification steps.
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — agent-facing project notes.
- `posthog-setup-report.md` — PostHog integration notes.
