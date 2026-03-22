'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useSyncExternalStore } from 'react'

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

export function ChaseNotificationStrip({ chaseCount = 0, chaseSignature = 'empty' }: { chaseCount?: number; chaseSignature?: string }) {
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
  const show = chaseCount > 0 && pathname !== '/chase-list' && effectiveLastSeenSignature !== chaseSignature
  if (!show) {
    return null
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.45)]" />
          <span>
            <span className="font-medium">{chaseCount} quote{chaseCount === 1 ? '' : 's'} due today.</span>{' '}
            Head to the chase list to work through what needs attention now.
          </span>
        </div>
        <Link href="/chase-list" className="inline-flex rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100">
          Open chase list
        </Link>
      </div>
    </div>
  )
}
