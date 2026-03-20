'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/quotes', label: 'Quotes' },
  { href: '/chase-list', label: 'Chase List' },
  { href: '/playbook', label: 'Playbook' },
  { href: '/settings', label: 'Settings' },
]

const STORAGE_KEY = 'qfu:chase-list:last-seen-signature'

export function Nav({ chaseCount = 0, chaseSignature = 'empty' }: { chaseCount?: number; chaseSignature?: string }) {
  const pathname = usePathname()
  const [lastSeenSignature, setLastSeenSignature] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      setLastSeenSignature(saved)
    } catch {
      setLastSeenSignature(null)
    }
  }, [])

  useEffect(() => {
    if (pathname !== '/chase-list') return

    try {
      window.localStorage.setItem(STORAGE_KEY, chaseSignature)
      setLastSeenSignature(chaseSignature)
    } catch {
      // ignore storage failures
    }
  }, [pathname, chaseSignature])

  const showChaseAttention = chaseCount > 0 && pathname !== '/chase-list' && lastSeenSignature !== chaseSignature

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const isChaseList = item.href === '/chase-list'

        return (
          <Link
            key={item.href}
            href={item.href}
            className={active
              ? 'inline-flex items-center gap-2 rounded-lg bg-sky-500/20 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white'
              : 'inline-flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white/95 transition hover:bg-white/5 hover:text-white'}
          >
            <span>{item.label}</span>
            {isChaseList && showChaseAttention ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-medium tracking-[0.12em] text-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                {chaseCount}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
