import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts/config'
import { HomePage } from './collections/HomePage'
import { Projects } from './collections/Projects'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseUrl = process.env.DATABASE_URI || ''
const pushDatabaseSchema =
  process.env.PAYLOAD_DB_PUSH === 'true' || databaseUrl.startsWith('file:')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [HomePage],
  collections: [Users, Media, Posts, Projects],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN || '',
    },
    // Drizzle push mode races during Next development against remote libSQL databases.
    // Keep local/test databases automatic; update remote schemas through `pnpm db:push`.
    push: pushDatabaseSchema,
  }),
  sharp,
  plugins: [],
})
