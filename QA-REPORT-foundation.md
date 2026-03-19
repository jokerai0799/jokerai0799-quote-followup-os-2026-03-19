# QA Report — auth + SQLite foundation smoke test

## Verdict
**FAIL — not ready to push**

## What I checked
- repo state / cleanliness
- `npm run lint`
- `npm run build`
- `npm run db:migrate`
- `npm run db:seed`
- auth-critical structure (NextAuth config, login route, auth API route, middleware/layout protection, SQLite user store)

## Blockers
1. **Production build fails**
   - `npm run build` breaks because the auth stack is being pulled into **Edge runtime middleware** while the implementation depends on Node-only modules:
     - `src/lib/users.ts` imports `node:crypto`
     - `src/lib/db.ts` imports `better-sqlite3`, `node:fs`, `node:path`, and uses `process.cwd()`
   - Import trace shows these flow into `src/middleware.ts` via `src/auth.ts`.
   - Result: current middleware/auth wiring is incompatible with Next.js 16 Edge runtime.

2. **Lint fails**
   - `scripts/db-seed.ts:37` — `any` usage
   - `src/lib/users.ts:13` — `any` usage

## Non-blocking issues / cleanup notes
- Repo is **not clean**: multiple modified/deleted/untracked files are present, so this is still an in-progress branch/worktree.
- `src/middleware.ts` triggers a Next.js 16 warning: **middleware file convention is deprecated; use `proxy` instead**.
- Lint warnings:
  - `src/app/login/page.tsx` unused `Metadata` import
  - `src/types/next-auth.d.ts` unused `NextAuth` import
- Smoke scripts succeeded:
  - `npm run db:migrate` created `data/quotes.sqlite`
  - `npm run db:seed` seeded the workspace user and imported 6 demo quotes
- Generated SQLite file appears properly ignored by git (`data/quotes.sqlite` did not show up in status).

## Auth-critical structure verified
- `src/auth.ts` — NextAuth credentials provider with bcrypt password check and JWT/session callbacks
- `src/app/api/auth/[...nextauth]/route.ts` — auth handlers exported
- `src/app/login/*` — login page + server action present
- `src/app/(authenticated)/layout.tsx` — server-side redirect guard present
- `src/middleware.ts` — route matcher present, but currently the source of the Edge/runtime incompatibility
- `src/lib/db.ts` / `src/lib/users.ts` — SQLite bootstrap and user persistence present

## Recommended next fix order
1. Remove Node/SQLite auth code from Edge middleware path (or replace middleware strategy with one compatible with Node runtime).
2. Fix lint errors (`any` types) and clean unused imports.
3. Re-run `lint` + `build` before push.
