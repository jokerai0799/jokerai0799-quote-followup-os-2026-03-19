'use server'

import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { signIn } from '@/auth'
import { createUser, findUserByEmail } from '@/lib/users'
import { ensureWorkspaceForUser } from '@/lib/workspaces'

const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name'),
    email: z.string().trim().email('Enter a valid email'),
    companyName: z.string().trim().min(2, 'Enter your company name'),
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
  const parsed = signupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    companyName: formData.get('companyName'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    referralCode: formData.get('referralCode'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Could not create account' }
  }

  const existing = await findUserByEmail(parsed.data.email)
  if (existing) {
    return { error: 'An account with this email already exists' }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)
  const user = await createUser({
    email: parsed.data.email,
    name: parsed.data.name,
    passwordHash,
  })

  await ensureWorkspaceForUser({
    userId: user.id,
    name: parsed.data.name,
    email: parsed.data.email,
    workspaceName: parsed.data.companyName,
    referralCode: parsed.data.referralCode || null,
  })

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    })
    return {}
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Account created, but auto sign-in failed. Please log in.' }
    }
    throw error
  }
}
