import { getPayload } from 'payload'

import config from '@/payload.config'
import { seedGlobals } from '@/seed/globals'
import { seedProjects } from '@/seed/projects'
import { seedThoughts } from '@/seed/thoughts'

export default async function globalSetup() {
  const payload = await getPayload({ config })

  try {
    await seedGlobals(payload)
    await seedProjects(payload)
    await seedThoughts(payload)

    const existingProjectDraft = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: 'definitely-fake-e2e-draft-project',
        },
      },
    })

    if (existingProjectDraft.totalDocs === 0) {
      await payload.create({
        collection: 'projects',
        data: {
          title: 'Definitely Fake E2E Draft Project',
          pitch: 'This draft must never appear on the Building Thread.',
          buildStatus: 'parked',
          slug: 'definitely-fake-e2e-draft-project',
          date: '2030-01-01T00:00:00.000Z',
          _status: 'draft',
        },
        draft: true,
        overrideAccess: true,
      })
    }

    const existingThoughtDraft = await payload.find({
      collection: 'thoughts',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: 'definitely-fake-e2e-draft-thought',
        },
      },
    })

    if (existingThoughtDraft.totalDocs === 0) {
      await payload.create({
        collection: 'thoughts',
        data: {
          title: 'Definitely Fake E2E Draft Thought',
          summary: 'This draft must never appear on the Written Thread.',
          body: 'Draft Thoughts stay off the public Written path.',
          slug: 'definitely-fake-e2e-draft-thought',
          date: '2030-01-01T00:00:00.000Z',
          _status: 'draft',
        },
        draft: true,
        overrideAccess: true,
      })
    }
  } finally {
    await payload.destroy()
  }
}
