'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useSyncExternalStore } from 'react'

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/quotes', label: 'Quotes' },
  { href: '/chase-list', label: 'Chase List' },
  { href: '/playbook', label: 'Playbook' },
  { href: '/settings', label: 'Settings' },
]

const STORAGE_KEY = 'qfu:chase-list:last-seen-signature'
const STORAGE_EVENT = 'qfu:chase-list:last-seen-signature:changed'

function readLastSeenSignature() {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleChange = () => callback()
  window.addEventListener('storage', handleChange)
  window.addEventListener(STORAGE_EVENT, handleChange)

  return () => {
    window.removeEventListener('storage', handleChange)
    window.removeEventListener(STORAGE_EVENT, handleChange)
  }
}

export function Nav({ chaseCount = 0, chaseSignature = 'empty' }: { chaseCount?: number; chaseSignature?: string }) {
  const pathname = usePathname()
  const lastSeenSignature = useSyncExternalStore(subscribe, readLastSeenSignature, () => null)

  useEffect(() => {
    if (pathname !== '/chase-list') return

    try {
      window.localStorage.setItem(STORAGE_KEY, chaseSignature)
      window.dispatchEvent(new Event(STORAGE_EVENT))
    } catch {
      // Ignore localStorage failures and fall back to current-path behavior.
    }
  }, [pathname, chaseSignature])

  const effectiveLastSeenSignature = pathname === '/chase-list' ? chaseSignature : lastSeenSignature
  const showChaseAttention = chaseCount > 0 && pathname !== '/chase-list' && effectiveLastSeenSignature !== chaseSignature

  return (
    <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <nav className="flex min-w-max items-center gap-2 xl:flex-nowrap">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const isChaseList = item.href === '/chase-list'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={active
                ? 'inline-flex items-center gap-2 rounded-lg bg-sky-500/18 px-3 py-2 text-sm font-medium text-white'
                : 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/5 hover:text-white'}
            >
              <span>{item.label}</span>
              {isChaseList && showChaseAttention ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  {chaseCount}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
