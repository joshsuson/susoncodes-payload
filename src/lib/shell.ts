import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'

export const getShell = cache(async () => {
  const payload = await getPayload({ config })

  return payload.findGlobal({
    slug: 'shell',
    depth: 1,
    overrideAccess: false,
  })
})
