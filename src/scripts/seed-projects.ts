import { getPayload } from 'payload'

import config from '@/payload.config'
import { seedProjects } from '@/seed/projects'

const payload = await getPayload({ config })
const result = await seedProjects(payload)

payload.logger.info(
  `Project seed complete: ${result.created} created, ${result.total - result.created} already present.`,
)

await payload.destroy()
