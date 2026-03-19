# Quote Follow-Up OS

Quote Follow-Up OS is a lightweight Next.js MVP for small service businesses that lose revenue when sent quotes go cold.

This build focuses on one job: **track quotes, surface who needs chasing today, and keep follow-ups consistent**.

## MVP features

- dashboard with open quote value, won revenue, due follow-ups, and reply-rate signal
- quote inbox / pipeline table
- add and edit quote records
- statuses: `draft`, `sent`, `follow-up due`, `replied`, `won`, `lost`
- automatic follow-up schedule generated from the sent date
- daily chase list with ready-to-use follow-up copy
- default follow-up playbook
- local JSON persistence in `data/quotes.json`
- reset demo data action

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Server Actions
- local file persistence for demoability

## Run locally

```bash
cd /root/.openclaw/workspace/projects/quote-followup-os
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Notes

- This is intentionally **not** a full CRM or field-service suite.
- No Vercel deployment is included.
- No external messaging delivery is wired in yet; follow-up copy is generated and displayed in-app.
- Data is stored locally in `data/quotes.json` so the app can be demoed and iterated quickly.

## Next sensible steps

1. add auth and multi-user workspaces
2. add timeline/event log per quote
3. add email send + send history
4. add CSV import / QuickBooks / Jobber ingestion
5. add analytics by source, service type, and win rate
