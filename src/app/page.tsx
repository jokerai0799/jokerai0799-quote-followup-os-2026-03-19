import Link from 'next/link'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'

const features = [
  {
    title: 'Track every quote in one place',
    body: 'See value, status, contact, sent date, and next follow-up without juggling spreadsheets, WhatsApp chats, and memory.',
  },
  {
    title: 'Know who needs chasing today',
    body: 'The daily chase list surfaces exactly which quotes need action now, with suggested message copy ready to go.',
  },
  {
    title: 'Run a lightweight sales system',
    body: 'Give small service businesses a practical quote follow-up workflow without dropping them into a bloated CRM.',
  },
]

const workflow = [
  'Send quotes faster with a consistent cadence',
  'Spot overdue follow-ups before revenue goes cold',
  'Keep the pipeline visible for owners and operators',
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
              href={session?.user ? '/dashboard' : '/login'}
              className="rounded-xl border border-white/12 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href={session?.user ? '/dashboard' : '/signup'}
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
            >
              Sign up
            </Link>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-24 lg:pt-12">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-sky-300">Quote Follow-Up OS</p>
            <h1 className="mt-4 font-serif text-5xl italic tracking-tight text-slate-50 sm:text-6xl">
              Stop losing work because nobody followed up.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Quote Follow-Up OS helps small service businesses track sent quotes, chase the right prospects at the right time,
              and turn follow-up into a repeatable operating system instead of guesswork.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={session?.user ? '/dashboard' : '/signup'}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                {session?.user ? 'Open workspace' : 'Sign up'}
              </Link>
              <Link
                href={session?.user ? '/dashboard' : '/login'}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">What it gives you</p>
                <p className="mt-2 text-2xl font-semibold text-white">A real quote pipeline</p>
                <p className="mt-2 text-sm text-slate-400">Not just a sheet of names and vague reminders.</p>
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
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">What we offer</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">A focused quote follow-up system for teams that need revenue discipline.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This is built for operators who send quotes regularly but still lose deals because follow-up is inconsistent, invisible, or left too late.
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

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Get started</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">See the product, then decide if it fits how you sell.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Prospects can learn what the product does first, then either create an account or log into an existing workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={session?.user ? '/dashboard' : '/login'} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:text-slate-950">
              Log in
            </Link>
            <Link href={session?.user ? '/dashboard' : '/signup'} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 !text-white">
              Sign up
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
