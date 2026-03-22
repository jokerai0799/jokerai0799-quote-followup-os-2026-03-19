import { createHmac } from 'node:crypto'

const EMAIL_VERIFICATION_WINDOW_MS = 1000 * 60 * 60 * 24

function getVerificationSecret() {
  return process.env.EMAIL_VERIFICATION_SECRET || process.env.AUTH_SECRET || ''
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, 'utf8').toString('base64url')
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8')
}

function signPayload(payload: string) {
  const secret = getVerificationSecret()
  if (!secret) {
    throw new Error('Missing EMAIL_VERIFICATION_SECRET or AUTH_SECRET')
  }

  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createEmailVerificationToken(email: string) {
  const payload = base64UrlEncode(JSON.stringify({
    email,
    exp: Date.now() + EMAIL_VERIFICATION_WINDOW_MS,
  }))

  const signature = signPayload(payload)
  return `${payload}.${signature}`
}

export function readEmailVerificationToken(token: string) {
  const [payload, signature] = token.split('.')
  if (!payload || !signature) {
    throw new Error('Invalid verification token')
  }

  const expectedSignature = signPayload(payload)
  if (signature !== expectedSignature) {
    throw new Error('Invalid verification token')
  }

  let parsed: { email?: string; exp?: number }
  try {
    parsed = JSON.parse(base64UrlDecode(payload))
  } catch {
    throw new Error('Invalid verification token')
  }

  if (!parsed.email || !parsed.exp || parsed.exp < Date.now()) {
    throw new Error('Verification link has expired')
  }

  return {
    email: parsed.email,
    expiresAt: parsed.exp,
  }
}
