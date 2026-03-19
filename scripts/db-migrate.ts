import 'dotenv/config'
import path from 'node:path'
import { ensureDatabase } from '../src/lib/db'

async function main() {
  ensureDatabase()
  const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
  console.log('Supabase schema file ready:')
  console.log(schemaPath)
  console.log('Run it in the Supabase SQL editor for project ehqizypdsfhmqojaetyd before seeding.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
