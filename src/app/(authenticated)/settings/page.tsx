import { SUPABASE_PROJECT_REF, SUPABASE_URL } from '@/lib/db'

const settings = [
  ['Auth model', 'Single workspace login via NextAuth credentials'],
  ['Persistence', 'Supabase Postgres'],
  ['Supabase project ref', SUPABASE_PROJECT_REF],
  ['Supabase URL', SUPABASE_URL],
  ['Seed source', 'data/quotes.json when the quotes table is empty'],
  ['Default cadence', '2, 5, 9 days'],
]

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Workspace configuration</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This build now targets a hosted Supabase backend so the workspace can run properly on Vercel instead of relying on local disk state.
        </p>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-200">
          {settings.map(([label, value]) => (
            <div key={label} className="grid gap-2 px-6 py-4 md:grid-cols-[220px_1fr] md:gap-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="text-sm text-slate-700 break-all">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Operational notes</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li>Run the SQL in <span className="font-mono">supabase/schema.sql</span> once in the Supabase SQL editor.</li>
            <li>Keep <span className="font-mono">SUPABASE_SECRET_KEY</span> server-side only.</li>
            <li>Run <span className="font-mono">npm run db:seed</span> after the schema is in place to create the first user and demo data.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Next sensible upgrades</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li>Multi-user workspaces and quote ownership</li>
            <li>Email send history and delivery tracking</li>
            <li>Import from CSV / accounting / field-service tools</li>
            <li>Analytics by source, service type, and close rate</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
