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
    <nav className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active
              ? 'rounded-lg bg-sky-100 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-sky-700'
              : 'rounded-lg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600 transition hover:bg-slate-100 hover:text-slate-950'}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
