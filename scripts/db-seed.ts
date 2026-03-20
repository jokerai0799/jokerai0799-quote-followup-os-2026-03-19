import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { ensureDatabase } from '../src/lib/db'
import { isWorkspaceModelAvailable, ensureWorkspaceForUser } from '../src/lib/workspaces'
import { supabase } from '../src/lib/supabase'
import { upsertUserByEmail } from '../src/lib/users'

async function seedUser() {
  const email = process.env.AUTH_EMAIL ?? 'founder@example.com'
  const password = process.env.AUTH_PASSWORD ?? 'change-me'
  const name = process.env.AUTH_NAME ?? 'Workspace Owner'

  if (!password) {
    throw new Error('AUTH_PASSWORD must be set before seeding users')
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await upsertUserByEmail({ email, name, passwordHash })
  console.log(`Seeded workspace user ${user.email}`)
  return user
}

async function seedLegacyQuotesIfEmpty() {
  const { count, error: countError } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    throw new Error(`Failed to inspect quotes table: ${countError.message}`)
  }

  if ((count ?? 0) > 0) {
    console.log('Quotes table already contains data — skipping legacy import.')
    return
  }

  console.log('Legacy flat quote model detected. No workspace seeding was required.')
}

async function main() {
  ensureDatabase()
  const user = await seedUser()

  if (await isWorkspaceModelAvailable()) {
    const workspace = await ensureWorkspaceForUser({
      userId: user.id,
      name: user.name,
      email: user.email,
      workspaceName: 'Workspace Owner Workspace',
    })
    console.log(`Ensured workspace ${workspace?.workspaceName ?? 'unknown'} for ${user.email}`)
    return
  }

  await seedLegacyQuotesIfEmpty()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
