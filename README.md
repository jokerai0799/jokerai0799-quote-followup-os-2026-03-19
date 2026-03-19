# QuoteFollowUp

QuoteFollowUp is a lightweight Next.js app for trades and service businesses that lose revenue when sent quotes go cold.

This build focuses on one job: **track quotes, surface who needs chasing today, and keep follow-ups consistent** — with hosted Supabase persistence and the start of a multi-workspace SaaS model.

## Core features

- public marketing homepage + login/signup flow
- per-user workspace provisioning on signup
- protected dashboard, quote list, chase list, playbook, and settings pages
- starter workspace seeded from demo data so users can see what the product could look like
- quote inbox / pipeline table
- add and edit quote records
- statuses: `draft`, `sent`, `follow-up due`, `replied`, `won`, `lost`
- automatic follow-up schedule generated from the sent date
- daily chase list with ready-to-use follow-up copy
- Supabase Postgres persistence
- multi-workspace schema scaffold: users, workspaces, memberships, subscriptions, quotes

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
npm run db:seed        # seeds the bootstrap user and starter workspace
npm run dev
```

Then open <http://localhost:3000> and sign in using the credentials you set in `.env`.

## Database + migrations

- `npm run db:migrate` points you at `supabase/schema.sql`, which should be run in the Supabase SQL editor.
- `npm run db:seed` ensures a workspace user exists and provisions starter workspace data.
- Runtime data lives in Supabase.
- The app includes a backward-safe fallback for the older flat quote model, but the intended direction is workspace isolation.

## Current product shape

- today, new signups can be provisioned with their own starter workspace
- the schema now has room for workspace membership and subscription state
- billing is **not** wired yet, so `subscription.status='demo'` is currently a scaffold for the later paid-workspace flow

## Notes

- This is intentionally **not** a full CRM or field-service suite.
- The right long-term model here is centralized quote data with per-workspace tenancy, not local-only quote storage.
- Local storage is better kept for draft/autosave UX, not as the system of record.

## Next sensible steps

1. wire billing so demo workspaces can convert into paid workspaces
2. add invite teammates + per-user roles
3. add timeline/event log per quote
4. add email send + send history
5. add analytics by source, service type, and win rate
