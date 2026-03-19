import { ensureDatabase, DB_PATH } from '../src/lib/db'

async function main() {
  ensureDatabase()
  console.log(`Database migrated at ${DB_PATH}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
