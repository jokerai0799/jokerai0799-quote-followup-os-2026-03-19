'use server'

import { AuthError } from 'next-auth'
import { z } from 'zod'
import { signIn } from '@/auth'

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

  try {
    await signIn('credentials', { ...parsed.data, redirectTo: '/' })
    return {}
  } catch (error) {
    if (error instanceof AuthError && error.type === 'CredentialsSignin') {
      return { error: 'Invalid email or password' }
    }
    throw error
  }
}
