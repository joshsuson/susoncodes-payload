import { getPayload } from 'payload'

import config from '@/payload.config'
import { seedGlobals } from '@/seed/globals'

const payload = await getPayload({ config })
await seedGlobals(payload)

payload.logger.info('Shell and Site global seed complete.')

await payload.destroy()
