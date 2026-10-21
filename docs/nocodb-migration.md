# NocoDB → Sanity migration

Status: read-side content migrated. One write path intentionally remains.

## What moved

| NocoDB table   | Table ID          | Sanity type      | Site surface                                      |
| -------------- | ----------------- | ---------------- | ------------------------------------------------- |
| `OurStartups`  | `mf0gbvfzl1wkaha` | `startup`        | `/startups`, `/startup-details/:id`, home marquee |
| `Partner`      | `msnxq3vgfyxywcm` | `partner`        | `/partners`, `/for-partners`, home strip          |
| `NetworkLogos` | `mh8taz9b8ne38yg` | `networkCompany` | `/member-network` marquee                         |
| `LatestNews`   | `mq62bo82l5r8qo4` | `newsItem`       | home news carousel                                |

Schema definitions live in the [`website-cms`](https://github.com/startmunich/website-cms) repo
(`schemaTypes/documents/`). Reads live in `sanity/queries.ts` and are normalised in
`lib/sanityContent.ts`.

All ~230 attached images were uploaded to the Sanity asset pipeline rather than hot-linked, so they
are served from `cdn.sanity.io` with stable URLs.

## What did not move, and why

### Waitlist (`m4bxgm1hwtekmyt`) — PII

This table holds **303 real applicant email addresses**. It is deliberately still on NocoDB.

The Sanity `production` dataset is **world-readable without authentication**:

```console
$ curl -s "https://j77hk8qc.api.sanity.io/v2025-02-19/data/query/production?query=*[_type==\"author\"]{name,linkedin}"
{"result":[{"name":"Valentin Ahrend","linkedin":"https://linkedin.com/in/valentin-ahrend-583983311"}]}
```

Importing the waitlist would have made every applicant's address publicly queryable. That is a GDPR
problem, not a technicality.

To finish the job, one of these has to happen first:

1. **Move the dataset to private ACL** (`https://www.sanity.io/manage/personal-access-tokens` →
   project settings), add a server-only write token, and point `app/api/waitlist/route.ts` at a
   `waitlistEntry` document type. The dataset must not be read publicly, so this also affects every
   other type in it.
2. **Use a form backend** (Formspree, Basin, Netlify Forms) that stores submissions with its own
   access control. This is the smallest change and removes NocoDB from the stack entirely.

Until one of those lands, `NOCODB_API_TOKEN` and `NOCODB_WAITLIST_TABLE_ID` stay in the environment.

### Members — the table no longer exists

`NOCODB_MEMBERS_TABLE_ID` was unset and there is no Members table in the NocoDB base, so
`GET /api/members` already returned `[]` in production before this migration. The route was deleted.

Member data on the site comes from `my.startmunich.de` (`/api/members/batch/[batchId]`), which is
not NocoDB and is unaffected.

### Untouched sources

Luma, the internal members-platform API, and the board route stay as they were — they were never
NocoDB.

## Running the migration

```bash
cd website-cms
npm install
SANITY_API_WRITE_TOKEN=... NOCODB_API_TOKEN=... \
  node scripts/migrate-from-nocodb.mjs --dry-run     # inspect first
SANITY_API_WRITE_TOKEN=... NOCODB_API_TOKEN=... \
  node scripts/migrate-from-nocodb.mjs               # then write
```

The script is idempotent: documents are matched on `legacyId` and patched, not duplicated, and
uploaded assets are matched on their NocoDB attachment id so a re-run does not re-upload ~230 files.

`--only=startup,partner` restricts it to specific types.

## ID compatibility

`/startup-details/[id]` is addressed by the original NocoDB row id, so every existing URL keeps
working. That id is carried in a `legacyId` field on each document rather than being encoded into
`_id` — per the Sanity guidance, `_id` stays Sanity-generated and the legacy value is explicit
content.

## Follow-ups

- `public/ourStartups/spherecast-logo.svg` is no longer referenced by code. The `LOGO_OVERRIDES`
  workaround it existed for (a NocoDB `.svg+xml` upload served as `application/octet-stream`) is
  obsolete; the file is a harmless leftover.
- Consider a Sanity webhook to revalidate on content change instead of the one-hour ISR window.
