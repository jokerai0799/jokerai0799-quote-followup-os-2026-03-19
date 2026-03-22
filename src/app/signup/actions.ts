'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { WORKSPACE_CURRENCIES, type WorkspaceCurrency } from '@/lib/currency'
import { sendSignupVerificationEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/rate-limit'
import { buildPendingVerificationPasswordHash, createUser, findUserByEmail, isUserEmailVerified } from '@/lib/users'
import { ensureWorkspaceForUser } from '@/lib/workspaces'

const currencyEnum = z.enum([...WORKSPACE_CURRENCIES] as [WorkspaceCurrency, ...WorkspaceCurrency[]])

const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name'),
    email: z.string().trim().email('Enter a valid email'),
    companyName: z.string().trim().min(2, 'Enter your company name'),
    currencyCode: currencyEnum.default('GBP'),
    password: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    referralCode: z.string().trim().max(64).optional().transform((value) => value?.trim() || ''),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupState = {
  error?: string
}

export async function signupAction(_prevState: SignupState, formData: FormData): Promise<SignupState> {
  const rawEmail = String(formData.get('email') ?? '').trim().toLowerCase()
  const rateLimit = checkRateLimit({
    key: `signup:${rawEmail || 'unknown'}`,
    limit: 4,
    windowMs: 10 * 60 * 1000,
  })

  if (!rateLimit.ok) {
    return { error: 'Too many signup attempts. Please wait a few minutes and try again.' }
  }

  const parsed = signupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    companyName: formData.get('companyName'),
    currencyCode: formData.get('currencyCode'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    referralCode: formData.get('referralCode'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Could not create account' }
  }

  const existing = await findUserByEmail(parsed.data.email)
  if (existing && isUserEmailVerified(existing)) {
    return { error: 'An account with this email already exists' }
  }

  if (!existing) {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    const user = await createUser({
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash: buildPendingVerificationPasswordHash(passwordHash),
    })

    await ensureWorkspaceForUser({
      userId: user.id,
      name: parsed.data.name,
      email: parsed.data.email,
      workspaceName: parsed.data.companyName,
      referralCode: parsed.data.referralCode || null,
      currencyCode: parsed.data.currencyCode,
    })
  }

  await sendSignupVerificationEmail({
    email: parsed.data.email,
    name: parsed.data.name,
  })

  redirect(`/signup/check-email?email=${encodeURIComponent(parsed.data.email)}`)
}
