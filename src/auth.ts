import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { findUserByEmail, getComparablePasswordHash, isUserEmailVerified } from '@/lib/users'

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await findUserByEmail(parsed.data.email)
        if (!user) return null

        const passwordMatches = await bcrypt.compare(parsed.data.password, getComparablePasswordHash(user))
        if (!passwordMatches) return null
        if (!isUserEmailVerified(user)) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
