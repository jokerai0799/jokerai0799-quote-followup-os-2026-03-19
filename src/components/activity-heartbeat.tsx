'use client'

import { useEffect } from 'react'

const PING_INTERVAL_MS = 5 * 60 * 1000

function sendHeartbeat() {
  if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
    return
  }

  void fetch('/api/activity/ping', {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    keepalive: true,
  }).catch(() => {
    // Quietly ignore heartbeat failures, this is best-effort only.
  })
}

export function ActivityHeartbeat() {
  useEffect(() => {
    sendHeartbeat()

    const intervalId = window.setInterval(sendHeartbeat, PING_INTERVAL_MS)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return null
}
