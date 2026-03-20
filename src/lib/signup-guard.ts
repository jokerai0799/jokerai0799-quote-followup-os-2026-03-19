import crypto from 'node:crypto'

const SIGNUP_MIN_SUBMIT_SECONDS = 3

function getSecret() {
  return process.env.AUTH_SECRET || 'quotefollowup-signup-guard'
}

export function createSignupChallenge() {
  const code = crypto.randomInt(100000, 999999).toString()
  const issuedAt = Date.now()
  const payload = `${code}.${issuedAt}`
  const signature = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')

  return {
    code,
    token: `${payload}.${signature}`,
    issuedAt,
  }
}

export function verifySignupChallenge({ token, code, website, issuedAt }: { token?: string; code?: string; website?: string; issuedAt?: string | number | null }) {
  if (website?.trim()) {
    return { ok: false, error: 'Could not verify signup' }
  }

  const submittedAt = Number(issuedAt ?? 0)
  if (!Number.isFinite(submittedAt) || Date.now() - submittedAt < SIGNUP_MIN_SUBMIT_SECONDS * 1000) {
    return { ok: false, error: 'Please take a moment to complete signup' }
  }

  if (!token || !code) {
    return { ok: false, error: 'Enter the verification code to continue' }
  }

  const [expectedCode, rawIssuedAt, signature] = token.split('.')
  if (!expectedCode || !rawIssuedAt || !signature) {
    return { ok: false, error: 'Invalid verification code' }
  }

  const payload = `${expectedCode}.${rawIssuedAt}`
  const expectedSignature = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  if (expectedSignature !== signature) {
    return { ok: false, error: 'Invalid verification code' }
  }

  if (expectedCode !== String(code).trim()) {
    return { ok: false, error: 'Verification code did not match' }
  }

  return { ok: true }
}
