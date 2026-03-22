import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'
import { MarketingDemo } from '@/components/marketing-demo'

export const metadata: Metadata = {
  title: 'Quote Follow-Up Software for Trades & Service Businesses',
  description:
    'Track quotes, see who needs chasing today, and win more work with quote follow-up software built for trades and service businesses.',
}

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

const useCases = [
  'Plumbing quote follow-up',
  'Electrical estimate tracking',
  'Cleaning quote management',
  'Property maintenance follow-up',
  'Small team service-business pipeline visibility',
]

const faqs = [
  {
    question: 'Who is QuoteFollowUp for?',
    answer:
      'QuoteFollowUp is for trades and service businesses that send quotes or estimates regularly and need a simple way to track what was sent, what is due for follow-up, and which jobs have been won or lost.',
  },
  {
    question: 'Is this a full CRM?',
    answer:
      'No. It is intentionally focused on quote tracking, quote management, and follow-up workflow so small service teams can stay consistent without paying for a bloated CRM.',
  },
  {
    question: 'What problem does it solve?',
    answer:
      'It helps stop sent quotes from going cold by giving you one place to track each estimate, see who needs chasing today, and keep a repeatable follow-up process.',
  },
]

function withRef(path: string, ref?: string) {
  if (!ref) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}ref=${encodeURIComponent(ref)}`
}

export default async function MarketingHomePage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const session = await auth()
  const { ref } = await searchParams

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <section className="bg-[#0D1520] text-white">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <Link
              href={session?.user ? '#demo' : withRef('/login', ref)}
              className="rounded-xl border border-white/12 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
            >
              {session?.user ? 'View demo' : 'Log in'}
            </Link>
            <Link
              href={session?.user ? '/dashboard' : withRef('/signup', ref)}
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
            >
              {session?.user ? 'Open workspace' : 'Sign up'}
            </Link>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-24 lg:pt-12">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl italic tracking-tight text-slate-50 sm:text-6xl">
              Quote follow-up software for trades and service businesses
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Track every quote, follow up on time, and turn more estimates into booked work with a simple system built for small service teams.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={session?.user ? '/dashboard' : withRef('/signup', ref)}
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

      <section id="demo" className="border-y border-slate-200 bg-slate-50 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sky-700">Product demo</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">See what the workspace can look like before you create yours.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Explore the product layout, see how quote statuses stand out, and get a clear feel for how the workspace is designed to work day to day.
            </p>
          </div>

          <MarketingDemo />
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Who it fits</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Built for quote-heavy trades and service businesses.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              If your team sends estimates every week and too many go quiet after the first send, QuoteFollowUp gives you a lightweight quote management system focused on follow-through rather than a full CRM rollout.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">Common use cases</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {useCases.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Straight answers before you sign up.</h2>
          </div>
          <div className="mt-8 grid gap-4">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Get started</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">View the demo, then create your own workspace when you’re ready.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              You can look through the demo first. When you sign up, you get your own separate workspace to add real quotes, contacts, and follow-ups.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="#demo" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:text-slate-950">
              View demo
            </Link>
            <Link href={session?.user ? '/dashboard' : withRef('/signup', ref)} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 !text-white">
              {session?.user ? 'Open workspace' : 'Create workspace'}
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
