# Waitlist Table Setup (NocoDB)

The `/join-start/2026` page collects emails into a NocoDB table once applications close. This
document describes the manual steps needed to set up the table.

## 1. Create the table

In NocoDB (`https://ndb.startmunich.de`), open the same base used by the other tables (startups,
members, partners) and create a new table called **`Waitlist`**.

## 2. Add the columns

| Column name  | Type            | Notes                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `Email`      | Email (or Text) | The email submitted by the visitor. Required.        |
| `SignedUpAt` | DateTime        | ISO timestamp written by the API at submission time. |

The default `Id` / `CreatedAt` / `UpdatedAt` system fields can stay as-is. The API writes `Email`
and `SignedUpAt`; column names are case-sensitive and must match exactly.

Optional: mark `Email` as unique in NocoDB if you want to prevent duplicates at the DB level. (The
API does not currently dedupe.)

## 3. Copy the table ID

Open the new table in NocoDB and look at the URL:

```
https://ndb.startmunich.de/nc/{workspace}/{project}/table/{TABLE_ID}
```

Copy `{TABLE_ID}`.

## 4. Set up Cloudflare Turnstile

The endpoint requires a Cloudflare Turnstile token to mitigate bot abuse.

1. Go to https://dash.cloudflare.com → **Turnstile** and create a new site.
2. Add the hostnames you need: `startmunich.de`, `www.startmunich.de`, your Vercel preview domain
   (`*.vercel.app` is allowed), and `localhost` for local dev.
3. Choose the **Managed** widget type.
4. Copy the **Site Key** (public) and **Secret Key** (server-only).

## 5. Set the env vars

Add the following to `.env.local` (and to Vercel → Settings → Environment Variables for production /
preview):

```env
NOCODB_WAITLIST_TABLE_ID=your_waitlist_table_id_here
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

`NOCODB_API_TOKEN` and `NOCODB_BASE_URL` are reused from the existing setup, so no extra DB
credentials are needed.

After adding the variables on Vercel, redeploy. Note: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is baked into
the client bundle at build time, so a redeploy is required for changes to take effect.

## 6. Verify

- The form on `/join-start/2026` (after the close date) renders the Turnstile widget and only
  submits after the challenge is solved.
- POST `/api/waitlist` with `{ "email": "test@example.com", "turnstileToken": "..." }` returns
  `{ "ok": true }` for a new email and `{ "ok": true, "alreadyOnList": true }` for a duplicate.
- A POST without a valid `turnstileToken` returns `403`.
- A new row appears in the `Waitlist` table with the email and an ISO timestamp in `SignedUpAt` only
  on the first submission for a given email.
