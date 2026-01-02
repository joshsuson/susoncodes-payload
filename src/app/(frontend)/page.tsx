import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const homePage = await payload.findGlobal({
    slug: 'homePage',
  })

  return (
    <div>
      <h1 className="text-red-500 text-5xl">{homePage.heading}</h1>
      <h2>{homePage.subheading}</h2>
      <Button>This is a button</Button>
    </div>
  )
}
