import { getPayload } from 'payload'

import config from '@/payload.config'

if (process.env.NODE_ENV === 'production' || process.env.PAYLOAD_DB_PUSH !== 'true') {
  throw new Error('Schema push requires PAYLOAD_DB_PUSH=true outside production.')
}

const payload = await getPayload({ config })

payload.logger.info('Database schema push complete.')
await payload.destroy()
