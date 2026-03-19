import Link from 'next/link'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'

const features = [
  {
    title: 'Track every quote in one place',
    body: 'See quote value, status, contact details, sent date, and next follow-up without juggling spreadsheets, inboxes, and memory.',
  },
  {
    title: 'Know exactly who to chase today',
    body: 'The daily chase list shows which quotes need attention now, with message prompts ready so your team can act quickly.',
  },
  {
    title: 'Turn more estimates into booked work',
    body: 'Build a repeatable follow-up process for your trade or service business without paying for a bloated CRM you do not need.',
  },
]

const workflow = [
  'Track sent quotes and their next follow-up date',
  'See overdue and due-today quotes instantly',
  'Keep your pipeline moving without guesswork',
]

const demoRows = [
  ['Jones Property Lets', 'Boiler replacement quote', '£2,400', 'Sent', '20 Mar'],
  ['Reed Electrical', 'Consumer unit upgrade', '£980', 'Follow-up due', 'Today'],
  ['Walker Homes', 'Kitchen repaint and touch-ups', '£1,450', 'Won', '—'],
]

export default async function MarketingHomePage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="bg-[#0D1520] text-white">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <Link
              href="#demo"
              className="rounded-xl border border-white/12 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
            >
              View demo
            </Link>
            <Link
              href={session?.user ? '/dashboard' : '/signup'}
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
            >
              Create workspace
            </Link>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-24 lg:pt-12">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-sky-300">QuoteFollowUp</p>
            <h1 className="mt-4 font-serif text-5xl italic tracking-tight text-slate-50 sm:text-6xl">
              Quote follow-up software for trades and service businesses
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Track every quote, follow up on time, and turn more estimates into booked work with a simple system built for small service teams.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={session?.user ? '/dashboard' : '/signup'}
                className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                {session?.user ? 'Open workspace' : 'Create workspace'}
              </Link>
              <Link
                href="#demo"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View demo
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">What it gives you</p>
                <p className="mt-2 text-2xl font-semibold text-white">A real quote pipeline</p>
                <p className="mt-2 text-sm text-slate-400">Not just a list of names and reminders buried in messages.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Best for</p>
                <p className="mt-2 text-2xl font-semibold text-white">Trades & service firms</p>
                <p className="mt-2 text-sm text-slate-400">Plumbing, electrical, cleaning, property, fit-out, and similar teams.</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">Core workflow</p>
              <ul className="mt-3 space-y-3 text-sm text-slate-200">
                {workflow.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">What we offer</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">A focused quote follow-up system for businesses that want better follow-through and more booked work.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            QuoteFollowUp is built for operators who send estimates regularly but still lose jobs because follow-up is inconsistent, invisible, or left too late.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="demo" className="border-y border-slate-200 bg-[#0F172A] text-white scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sky-300">Product demo</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white">See what the workspace can look like before you create yours.</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This demo preview shows the kind of quote dashboard, chase list, and pipeline visibility a live workspace can give you. After signup, your own workspace starts clean.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#162033] shadow-[0_20px_80px_rgba(2,6,23,0.4)]">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-sky-300">Demo workspace</p>
                  <h3 className="mt-2 text-3xl font-semibold text-white">Sample quote pipeline</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Open pipeline</p>
                    <p className="mt-1 text-xl font-semibold text-white">£3,380</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Due today</p>
                    <p className="mt-1 text-xl font-semibold text-white">2</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Won revenue</p>
                    <p className="mt-1 text-xl font-semibold text-white">£1,450</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto px-6 py-6">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="text-left text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Quote</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Next follow-up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {demoRows.map(([client, title, value, status, next]) => (
                    <tr key={client}>
                      <td className="px-4 py-4 text-white">{client}</td>
                      <td className="px-4 py-4 text-slate-200">{title}</td>
                      <td className="px-4 py-4 text-slate-200">{value}</td>
                      <td className="px-4 py-4 text-slate-200">{status}</td>
                      <td className="px-4 py-4 text-slate-200">{next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Get started</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Explore the demo first, then create a clean workspace for your own business.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Public visitors can review the demo preview before creating an account. After signup, your workspace starts empty so your real data stays separate.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="#demo" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:text-slate-950">
              View demo
            </Link>
            <Link href={session?.user ? '/dashboard' : '/signup'} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 !text-white">
              {session?.user ? 'Open workspace' : 'Create workspace'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
