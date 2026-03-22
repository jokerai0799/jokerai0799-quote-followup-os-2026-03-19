'use server'

import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { signIn } from '@/auth'
import { findUserByEmail, getComparablePasswordHash, isUserEmailVerified } from '@/lib/users'

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginState = {
  error?: string
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid credentials' }
  }

  const existing = await findUserByEmail(parsed.data.email)
  if (existing) {
    const passwordMatches = await bcrypt.compare(parsed.data.password, getComparablePasswordHash(existing))
    if (passwordMatches && !isUserEmailVerified(existing)) {
      return { error: 'Check your email and verify your account before logging in.' }
    }
  }

  try {
    await signIn('credentials', { ...parsed.data, redirectTo: '/dashboard' })
    return {}
  } catch (error) {
    if (error instanceof AuthError && error.type === 'CredentialsSignin') {
      return { error: 'Invalid email or password' }
    }
    throw error
  }
}
