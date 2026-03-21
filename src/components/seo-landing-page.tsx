import Link from 'next/link'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'

type RelatedPage = {
  href: string
  label: string
}

type SeoLandingPageProps = {
  eyebrow: string
  title: string
  intro: string
  description: string
  benefits: string[]
  fitTitle: string
  fitBody: string
  faqs: { question: string; answer: string }[]
  relatedPages: RelatedPage[]
  searchParams: Promise<{ ref?: string }>
}

function withRef(path: string, ref?: string) {
  if (!ref) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}ref=${encodeURIComponent(ref)}`
}

export async function SeoLandingPage({ eyebrow, title, intro, description, benefits, fitTitle, fitBody, faqs, relatedPages, searchParams }: SeoLandingPageProps) {
  const [session, { ref }] = await Promise.all([auth(), searchParams])

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
              href={session?.user ? '/dashboard' : withRef('/login', ref)}
              className="rounded-xl border border-white/12 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
            >
              {session?.user ? 'Open workspace' : 'Log in'}
            </Link>
            <Link
              href={session?.user ? '/dashboard' : withRef('/signup', ref)}
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
            >
              {session?.user ? 'Open workspace' : 'Create workspace'}
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
          <div className="max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-sky-300">{eyebrow}</p>
            <h1 className="mt-4 font-serif text-5xl italic tracking-tight text-slate-50 sm:text-6xl">{title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{intro}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={session?.user ? '/dashboard' : withRef('/signup', ref)}
                className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                {session?.user ? 'Open workspace' : 'Create workspace'}
              </Link>
              <Link
                href="/"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View homepage
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Why this page exists</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{fitTitle}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{fitBody}</p>
          <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">What you get</p>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
            {benefits.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-sky-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Quick answers</h2>
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

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Explore more</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Related pages on QuoteFollowUp</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {relatedPages.map((page) => (
              <Link key={page.href} href={page.href} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-sm font-medium text-slate-800 shadow-sm transition hover:border-sky-300 hover:text-slate-950">
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Get started</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">See how QuoteFollowUp fits your workflow.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">You can create your own workspace and start tracking quotes without changing the core way your team already follows up.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:text-slate-950">
              Back to homepage
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
