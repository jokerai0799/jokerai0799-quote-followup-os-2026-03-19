'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { seoPageLinks } from '@/lib/seo-pages'
import { BrandLogo } from '@/components/brand-logo'

const APP_SHELL_PREFIXES = ['/dashboard', '/quotes', '/chase-list', '/playbook', '/settings']

function isAppShellPath(pathname: string) {
  return APP_SHELL_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function AppFooter() {
  const pathname = usePathname()

  if (isAppShellPath(pathname)) {
    return (
      <footer className="border-t border-slate-200 bg-slate-100/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-medium text-slate-600">QuoteFollowUp</p>
          <a
            href="mailto:quotefollowup@outlook.com"
            className="transition hover:text-slate-900"
          >
            Support, quotefollowup@outlook.com
          </a>
        </div>
      </footer>
    )
  }

  const catalystLink = {
    href: 'https://quotechaser.online',
    label: 'Catalyst',
    description: 'Explore the broader Quote Chaser workflow project.',
  }

  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <div className="space-y-5">
            <div className="space-y-3 text-sm text-slate-500">
              <BrandLogo variant="dark" className="!text-inherit" />
              <p className="max-w-xl leading-6 text-slate-600">
                Simple quote follow-up software for trades and service businesses that want a clearer pipeline and more consistent follow-through.
              </p>
              <p className="leading-6 text-slate-600">
                Support:{' '}
                <a
                  href="mailto:quotefollowup@outlook.com"
                  className="break-all font-medium text-slate-700 underline-offset-4 transition hover:text-slate-950 hover:underline sm:break-normal"
                >
                  quotefollowup@outlook.com
                </a>
              </p>
            </div>

            <div className="max-w-xl border-t border-slate-200 pt-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">Also from us</p>
              <div className="mt-2 flex flex-wrap items-start gap-x-3 gap-y-1 text-sm">
                <a
                  href={catalystLink.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-slate-900 transition hover:text-sky-700"
                >
                  {catalystLink.label}
                  <span aria-hidden="true" className="text-slate-400">↗</span>
                </a>
                <span className="hidden text-slate-300 sm:inline">•</span>
                <p className="text-slate-600">{catalystLink.description}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">Related pages</p>
            <div className="mt-3 grid gap-x-6 gap-y-2 text-sm text-slate-500 sm:grid-cols-2">
              {seoPageLinks.map((page) => (
                <Link key={page.href} href={page.href} className="leading-6 transition hover:text-slate-900">
                  {page.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
