# Quote Follow-Up OS

Quote Follow-Up OS is a lightweight Next.js workspace for small service businesses that lose revenue when sent quotes go cold.

This build focuses on one job: **track quotes, surface who needs chasing today, and keep follow-ups consistent** — now with basic workspace auth and hosted Supabase persistence.

## Core features

- password-gated workspace (NextAuth credentials flow with server-side protected layout)
- branded operator shell with custom logo, nav header, and due-today status strip
- dashboard with open quote value, won revenue, due follow-ups, and pipeline visibility
- quote inbox / pipeline table
- add and edit quote records
- statuses: `draft`, `sent`, `follow-up due`, `replied`, `won`, `lost`
- automatic follow-up schedule generated from the sent date
- daily chase list with ready-to-use follow-up copy
- default follow-up playbook
- settings page for workspace operating notes
- Supabase Postgres persistence (seeded from `data/quotes.json`)

## Stack

- Next.js 16 App Router
- NextAuth.js 5 (Credentials provider)
- Supabase Postgres
- Server Components + Server Actions
- TypeScript + Zod validation
- Tailwind CSS 4

## Setup

```bash
cd /root/.openclaw/workspace/projects/quote-followup-os
cp .env.example .env   # set AUTH_SECRET + Supabase credentials + workspace bootstrap login
npm install
npm run db:migrate     # prints the Supabase SQL schema path
# run supabase/schema.sql once in the Supabase SQL editor
npm run db:seed        # seeds the workspace user + demo quotes (if table empty)
npm run dev
```

Then open <http://localhost:3000> and sign in using the credentials you set in `.env` (defaults: `founder@example.com` / `change-me`).

## Database + migrations

- `npm run db:migrate` points you at `supabase/schema.sql`, which should be run once in the Supabase SQL editor.
- `npm run db:seed` ensures a workspace user exists (values pulled from `.env`) and, if the `quotes` table is empty, imports demo records from `data/quotes.json`.
- Runtime data lives in Supabase. The JSON file is now only a seed source and can be replaced with fresh demo data as needed.

## Authentication

- Credentials are stored in Supabase with bcrypt hashes. Update `.env` with `AUTH_EMAIL`, `AUTH_PASSWORD`, and `AUTH_NAME`, then rerun `npm run db:seed` to rotate the login.
- Routes are protected through server-side auth checks in the authenticated app layout; unauthenticated users are redirected to `/login`.

## Notes

- This is intentionally **not** a full CRM or field-service suite.
- No Vercel deployment is included.
- No external messaging delivery is wired in yet; follow-up copy is generated and displayed in-app.

## Next sensible steps

1. extend auth into multi-user workspaces and per-user quote ownership
2. add timeline/event log per quote
3. add email send + send history
4. add CSV import / QuickBooks / Jobber ingestion
5. add analytics by source, service type, and win rate
