# AGENTS.md

Working notes for coding agents on the START Munich website.

Next.js 15 (App Router) + React 18 + TypeScript 5.9 (strict) + Tailwind 3.4, deployed to Vercel.
Content is **not** in the repo — it is fetched at request time from Sanity, the members platform,
and Luma. NocoDB survives only for the waitlist write (see "The waitlist exception" below).

- `README.md` is the human-facing reference (setup, env vars, routes, deployment). Read it before
  touching anything non-trivial.
- `.github/copilot-instructions.md` is **stale** (it still describes a Next.js 14 "company list"
  app). Do not trust it; this file and `README.md` win.

## Commands

Use `pnpm` only. A `preinstall` hook (`scripts/enforce-pnpm.cjs`) fails the install under `npm` or
`yarn`. Node 24 is required (`.nvmrc` pins the exact patch version).

```bash
pnpm install                # deps (add with `pnpm add <pkg>`)
pnpm dev                    # dev server on :3000
pnpm build                  # production build
pnpm start                  # serve the production build
```

| Command                       | Purpose                                       |
| ----------------------------- | --------------------------------------------- |
| `pnpm typecheck`              | `tsc --noEmit`                                |
| `pnpm lint` / `pnpm lint:fix` | ESLint 9 flat config                          |
| `pnpm format:check`           | Prettier check                                |
| `pnpm format:write`           | Prettier write                                |
| `pnpm test:e2e`               | Playwright — needs a server on `:3000` first  |
| `pnpm test:e2e:ui`            | Playwright UI mode                            |
| `pnpm package-manager:check`  | Asserts pnpm hygiene (e.g. no `package-lock`) |

### Before you open a PR

These four are exactly what CI runs (`.github/workflows/quality.yml`), in fail-fast order. They must
all pass locally:

```bash
pnpm format:check && pnpm typecheck && pnpm lint
```

CI additionally runs `commitlint` on every commit message and `pnpm package-manager:check`, so
commit messages must be Conventional Commits (`feat(startups): ...`, `fix: ...`).

## Project layout

```
app/            Routes (App Router), layouts, API route handlers
components/     Shared components; components/ui/ = shadcn + registry components
lib/            Data fetching, types, shared metadata, hooks
sanity/         Sanity client (client.ts) and GROQ queries (queries.ts)
scripts/        Repo scripts (.cjs, use require — not linted for that)
tests/e2e/      Playwright specs
docs/           Setup guides
```

Import the root as `@/...` (`tsconfig` maps `@/*` → `./*`).

## Conventions

### Server vs. client components

Default to Server Components. Add `'use client'` only for interactivity (state, effects, event
handlers) — roughly a third of the codebase is client, and it is fine for that to stay a minority.
Pages that render live data split into `page.tsx` (server: `metadata`, route config) and a
`*Content.tsx` client sibling. Follow that split rather than marking the whole page client.

### Data fetching and caching

CMS content comes from Sanity via `next-sanity`. Other upstream calls go through the members
platform or Luma. Conventions to copy from `lib/sanityContent.ts` and `app/api/*/route.ts`:

- GROQ lives in `sanity/queries.ts`, one `defineQuery` per surface. Use **unique query variable
  names** across files — duplicates silently overwrite each other's generated types.
- Always project fields; never `*[_type == "x"]` unprojected. Wrap computed attributes in quotes:
  `"logoUrl": logo{…}`.
- Filter on indexed attributes (`_type`, `isVisible == true`, `slug.current == $slug`). Avoid
  `->field` in filters — that resolves references per candidate document. Use `_ref` instead.
- ISR is one hour everywhere: `export const revalidate = 3600` on the route/segment, and
  `next: { revalidate: 3600 }` on the `fetch` itself.
- Data-driven pages (`/startups`, `/members`, `/partners`, `/events`, `/labs`, `/member-network`,
  `/member-journey`) opt out of static rendering with `export const dynamic = 'force-dynamic'`.
- **Degrade to empty rather than throwing** so a misconfigured preview build still renders. This is
  deliberate — do not "fix" it by crashing.
- API handlers wrap upstream calls in `try/catch` and map failures to JSON with a sensible status
  (504 on timeout, 500 otherwise).
- Mark server-only data modules with `import 'server-only'` so a token can't leak into the client
  bundle. `sanity/client.ts` and `lib/sanityContent.ts` both do.
- **Schema changes are cross-repo.** Field definitions live in `website-cms`
  (`schemaTypes/documents/`). Adding or renaming a field means changing the schema there, running
  `npm run typegen` in that repo, _and_ updating the projection in `sanity/queries.ts` here.
- `lib/startNetwork.ts` is the single source of truth for the chapter list and the
  chapter/country/member counts rendered on the home and member-journey pages. Edit it there; don't
  duplicate the numbers.

### The waitlist exception

`app/api/waitlist/route.ts` still writes to NocoDB and still needs `NOCODB_API_TOKEN` +
`NOCODB_WAITLIST_TABLE_ID`. Do not "finish the migration" by moving it to Sanity: that table holds
real applicant email addresses and the Sanity `production` dataset is readable without
authentication. `docs/nocodb-migration.md` has the options for retiring it.

### Pages and metadata

Every route exports its own `metadata` object: `title`, `description`, `alternates.canonical`, and
an `openGraph` block that reuses `OG_IMAGES` from `@/lib/metadata`. The root layout owns the shared
defaults and the `%s | START Munich` title template — page-level `title` is the short form only.
Don't add new OG images without a reason; the shared one exists to stop crawlers picking up random
page images.

### Styling

- Tailwind utility classes only. No CSS modules, no inline style objects.
- Brand tokens live in `colors.brand` in `tailwind.config.ts`: `brand-pink` (`#d0006f`),
  `brand-dark-blue` (`#00002c`), `brand-secondary-blue` (`#011152`). Use the token, never the hex
  literal. The sans font is `Avenirnextltpro` via `fontFamily.sans`.
- Merge conditional classes with `cn()` from `@/lib/utils` (`clsx` + `tailwind-merge`) rather than
  string concatenation.
- `components/ui/` follows the shadcn/ui pattern: `React.forwardRef`, a `displayName`, and a
  `cn(...)` base class that callers can override. Copy the existing shape when adding one.

### Types

`strict` mode, no `any` (`@typescript-eslint/no-explicit-any` is a warning, but treat it as a
failure). Sanity projections are typed as explicit interfaces with optional fields (see
`StartupProjection` / `PartnerProjection` in `lib/sanityContent.ts`) and normalised in a
`transform*` function — the raw projected shape is never allowed to escape.

### Imports

`simple-import-sort/imports` and `/exports` are **errors**, and lint-staged does not reorder for you
on save. Group order is: side-effect imports, packages, `@/…`, then relative. Run `pnpm lint:fix`
before committing.

## Images

`next/image` with an explicit `sizes` attribute. `next.config.js` holds an explicit `remotePatterns`
allowlist — **a new image host will render broken until you add it there**. Output is deliberately
WebP-only with a one-year `minimumCacheTTL`; don't add formats.

CMS images come from Sanity's CDN and are optimized normally. Member portraits come from the members
platform's object storage and are passed through `isObjectStorageImage()` from `@/lib/images` to set
`unoptimized` — don't extend that to Sanity URLs.

## Environment variables

`.env.example` is the source of truth — annotate new variables there as well as in the README
tables, and mark them required or optional. Two things bite regularly:

- `NEXT_PUBLIC_*` values are inlined at build time. Changing one on Vercel requires a redeploy.
- The Sanity dataset is public, so nothing needs a token. If it is ever made private (e.g. to host
  the waitlist), add a server-only read token and keep it out of `NEXT_PUBLIC_*`.

## Testing

Playwright is the e2e suite (`tests/e2e/`), and `vitest` runs the unit tests in `tests/unit/`
(`pnpm test`) — see `vitest.config.mts`. `tests/e2e/smoke.spec.ts` is deliberately narrow (2xx +
visible main landmark per key route): it catches broken SSR, failed builds and routing breakage, but
will not fail on content changes. Add per-page specs under `tests/e2e/` when a change needs real
assertions. Locally, start `pnpm dev` yourself first; in CI the suite runs against a Vercel preview
via `PLAYWRIGHT_TEST_BASE_URL`. Data-dependent specs must accept both branches, because CI
configures no event source and takes the empty/Luma-fallback path.

## Git workflow

- Branch off `main` as `<type>/<slug>`, matching existing branches: `feat/…`, `fix/…`, `docs/…`,
  `chore/…`.
- Conventional Commits are enforced locally by the `commit-msg` hook and again in CI. Dependency
  bumps are the only exemption (`chore(deps)`, `fix(deps)`, and the `build`/`ci`/`*-dev` variants).
- Husky's `pre-commit` runs lint-staged (ESLint `--fix` + Prettier) on staged files only — unstaged
  breakage will still fail CI.
- Open PRs against `main`. The `main branch protection` ruleset gates it: the required checks are
  `quality`, `e2e`, and `Vercel`, and merge commits are disallowed — use squash or rebase. No human
  review is required (`required_approving_review_count` is 0), so don't wait on an approval.
- Native build permissions and CVE pins for transitive deps go in `pnpm-workspace.yaml`
  (`allowBuilds` / `overrides`), **not** `package.json`.

## Gotchas

- `pnpm-workspace.yaml` is not a workspace config in the usual sense — it's where the dependency
  `overrides` live. Editing `package.json` to pin a transitive dep does nothing.
- There is no `vercel.json`. Redirects, the PostHog `/ingest/*` proxy, image config, and the
  permanent `/home` → `/` redirect all live in `next.config.js`.
- `postcss.config.js` and `tailwind.config.ts` are both still needed; Tailwind 3 predates the
  PostCSS-native `@tailwindcss/postcss` setup.
- Prefer adding a new env-gated code path over branching on build environments elsewhere.
