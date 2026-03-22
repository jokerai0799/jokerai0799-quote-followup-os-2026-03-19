type Bucket = {
  count: number
  resetAt: number
}

const store = globalThis as typeof globalThis & {
  __quoteFollowUpRateLimitStore?: Map<string, Bucket>
}

function getStore() {
  if (!store.__quoteFollowUpRateLimitStore) {
    store.__quoteFollowUpRateLimitStore = new Map<string, Bucket>()
  }

  return store.__quoteFollowUpRateLimitStore
}

export function checkRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}) {
  const now = Date.now()
  const buckets = getStore()

  for (const [bucketKey, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(bucketKey)
    }
  }

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true as const, remaining: limit - 1, retryAfterMs: windowMs }
  }

  if (existing.count >= limit) {
    return { ok: false as const, remaining: 0, retryAfterMs: Math.max(0, existing.resetAt - now) }
  }

  existing.count += 1
  buckets.set(key, existing)
  return { ok: true as const, remaining: limit - existing.count, retryAfterMs: Math.max(0, existing.resetAt - now) }
}
