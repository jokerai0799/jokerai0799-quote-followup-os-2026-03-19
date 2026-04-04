import Link from 'next/link'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'
import { MarketingDemo } from '@/components/marketing-demo'
import { SITE_NAME, SITE_URL } from '@/lib/site'

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
  pagePath: string
}

function withRef(path: string, ref?: string) {
  if (!ref) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}ref=${encodeURIComponent(ref)}`
}

export async function SeoLandingPage({ eyebrow, title, intro, description, benefits, fitTitle, fitBody, faqs, relatedPages, searchParams, pagePath }: SeoLandingPageProps) {
  void relatedPages
  const [session, { ref }] = await Promise.all([auth(), searchParams])
  const pageUrl = `${SITE_URL}${pagePath}`

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

  const softwareStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: eyebrow,
    operatingSystem: 'Web',
    url: pageUrl,
    description,
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Trades and service businesses',
    },
    featureList: benefits,
    offers: {
      '@type': 'Offer',
      price: '29.99',
      priceCurrency: 'GBP',
    },
  }

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: eyebrow,
        item: pageUrl,
      },
    ],
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />

      <section className="bg-[#0D1520] text-white">
        <header className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <BrandLogo />
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href={session?.user ? '/dashboard' : withRef('/login', ref)}
              className="rounded-xl border border-white/12 px-4 py-2 text-center text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
            >
              {session?.user ? 'Open workspace' : 'Log in'}
            </Link>
            <Link
              href={session?.user ? '/dashboard' : withRef('/signup', ref)}
              className="rounded-xl bg-sky-500 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-sky-400"
            >
              {session?.user ? 'Open workspace' : 'Start 7-day trial'}
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8 lg:pb-24 lg:pt-12">
          <div className="max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-sky-300 sm:text-[11px] sm:tracking-[0.35em]">{eyebrow}</p>
            <h1 className="mt-4 font-serif text-[2.25rem] leading-tight italic tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">{intro}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={session?.user ? '/dashboard' : withRef('/signup', ref)}
                className="rounded-xl bg-sky-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                {session?.user ? 'Open workspace' : 'Start 7-day trial'}
              </Link>
              <Link
                href="#demo"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View demo
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-400">
              Start with a 7-day trial, see how the workflow fits your team, and keep your quotes moving.
            </p>
          </div>
        </div>
      </section>

      <section id="demo" className="border-y border-slate-200 bg-slate-50 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sky-700">Product demo</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">See what QuoteFollowUp looks like before you start your trial.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Get a quick feel for the layout, see how quote statuses stand out, and understand how the workspace helps your team stay on top of follow-up day to day.
            </p>
          </div>

          <MarketingDemo />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={session?.user ? '/dashboard' : withRef('/signup', ref)}
              className="rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 !text-white"
            >
              {session?.user ? 'Open workspace' : 'Start 7-day trial'}
            </Link>
            <Link
              href={session?.user ? '/dashboard' : withRef('/login', ref)}
              className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:text-slate-950"
            >
              {session?.user ? 'Open workspace' : 'Log in'}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Why this page exists</p>
          <h2 className="mt-2 text-[1.75rem] font-semibold tracking-tight text-slate-950 sm:text-3xl">{fitTitle}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{fitBody}</p>
          <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
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
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Quick answers</h2>
          </div>
          <div className="mt-8 grid gap-4">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Get started</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Start the 7-day trial when you’re ready.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">You can view the demo first, then create your own workspace to track real quotes, contacts, and follow-ups.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="#demo" className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:text-slate-950">
              View demo
            </Link>
            <Link href={session?.user ? '/dashboard' : withRef('/signup', ref)} className="rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 !text-white">
              {session?.user ? 'Open workspace' : 'Start 7-day trial'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
