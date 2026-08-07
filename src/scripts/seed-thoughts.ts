import { getPayload } from 'payload'

import config from '@/payload.config'
import { seedThoughts } from '@/seed/thoughts'

const payload = await getPayload({ config })
const result = await seedThoughts(payload)

payload.logger.info(
  `Thought seed complete: ${result.created} created, ${result.total - result.created} already present.`,
)

await payload.destroy()
