'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/quotes', label: 'Quotes' },
  { href: '/chase-list', label: 'Chase List' },
  { href: '/playbook', label: 'Playbook' },
  { href: '/settings', label: 'Settings' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap items-center gap-1.5 lg:gap-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active
              ? 'rounded-lg bg-sky-500/12 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sky-200 lg:text-[11px]'
              : 'rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 transition hover:bg-sky-500/5 hover:text-slate-200 lg:text-[11px]'}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
