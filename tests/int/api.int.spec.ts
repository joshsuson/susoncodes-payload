import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { findPublishedProjectBySlug, findPublishedProjects } from '@/lib/projects'
import { seedProjects } from '@/seed/projects'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Payload Local API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('creates Projects with each supported Build Status', async () => {
    const statuses = ['active', 'shipped', 'parked'] as const
    const createdStatuses = []

    for (const buildStatus of statuses) {
      const project = await payload.create({
        collection: 'projects',
        data: {
          title: `Definitely Fake ${buildStatus} Project`,
          pitch: 'A disposable Project used to verify the public CMS contract.',
          buildStatus,
          externalUrl: 'https://example.com/fake-project',
          whatItIs: '## What it is\n\nA deliberately fake build.',
          thoughtProcess: '## Thought process\n\nUse a visible tracer bullet.',
          learnings: '## Learnings\n\nThe public contract comes first.',
          slug: `definitely-fake-${buildStatus}-project`,
          date: '2026-01-01T00:00:00.000Z',
          metaTitle: `Fake ${buildStatus} Project`,
          metaDescription: 'Not a real Project.',
          _status: 'published',
        },
      })

      createdStatuses.push(project.buildStatus)
    }

    expect(createdStatuses).toEqual(statuses)
  })

  it('rejects Projects with a missing required field or unsupported Build Status', async () => {
    await expect(
      payload.create({
        collection: 'projects',
        data: {
          title: 'Definitely Fake Missing Pitch Project',
          buildStatus: 'active',
          slug: 'definitely-fake-missing-pitch-project',
          date: '2026-01-01T00:00:00.000Z',
        } as never,
      }),
    ).rejects.toThrow()

    await expect(
      payload.create({
        collection: 'projects',
        data: {
          title: 'Definitely Fake Unsupported Status Project',
          pitch: 'This Project should fail validation.',
          buildStatus: 'complete',
          slug: 'definitely-fake-unsupported-status-project',
          date: '2026-01-01T00:00:00.000Z',
        } as never,
      }),
    ).rejects.toThrow()
  })

  it('lists only published Projects in newest-first order', async () => {
    const projects = [
      {
        title: 'Definitely Fake Older Public Project',
        slug: 'definitely-fake-older-public-project',
        date: '2025-01-01T00:00:00.000Z',
        _status: 'published' as const,
      },
      {
        title: 'Definitely Fake Draft Project',
        slug: 'definitely-fake-draft-project',
        date: '2027-01-01T00:00:00.000Z',
        _status: 'draft' as const,
      },
      {
        title: 'Definitely Fake Newer Public Project',
        slug: 'definitely-fake-newer-public-project',
        date: '2026-01-01T00:00:00.000Z',
        _status: 'published' as const,
      },
    ]

    for (const project of projects) {
      await payload.create({
        collection: 'projects',
        data: {
          ...project,
          pitch: 'Disposable listing fixture.',
          buildStatus: 'active',
        },
        draft: project._status === 'draft',
      })
    }

    const result = await findPublishedProjects(payload)
    const fixtureTitles = result.docs
      .filter((project) => project.slug.includes('-public-project'))
      .map((project) => project.title)

    expect(fixtureTitles).toEqual([
      'Definitely Fake Newer Public Project',
      'Definitely Fake Older Public Project',
    ])
    expect(result.docs.map((project) => project.title)).not.toContain(
      'Definitely Fake Draft Project',
    )
  })

  it('seeds eight disposable Projects without creating duplicates', async () => {
    await seedProjects(payload)
    await seedProjects(payload)

    const seededProjects = await payload.find({
      collection: 'projects',
      limit: 20,
      overrideAccess: true,
      where: {
        slug: {
          contains: 'definitely-fake-seed-project-',
        },
      },
    })

    expect(seededProjects.totalDocs).toBe(8)
    expect(new Set(seededProjects.docs.map((project) => project.slug)).size).toBe(8)
  })

  it('finds a published Project Artifact by slug without exposing a draft', async () => {
    await payload.create({
      collection: 'projects',
      data: {
        title: 'Definitely Fake Public Artifact',
        pitch: 'A disposable public Artifact fixture.',
        buildStatus: 'shipped',
        slug: 'definitely-fake-public-artifact',
        date: '2026-01-01T00:00:00.000Z',
        _status: 'published',
      },
    })
    await payload.create({
      collection: 'projects',
      data: {
        title: 'Definitely Fake Draft Artifact',
        pitch: 'A disposable draft Artifact fixture.',
        buildStatus: 'parked',
        slug: 'definitely-fake-draft-artifact',
        date: '2026-01-02T00:00:00.000Z',
        _status: 'draft',
      },
      draft: true,
    })

    const published = await findPublishedProjectBySlug(payload, 'definitely-fake-public-artifact')
    const draft = await findPublishedProjectBySlug(payload, 'definitely-fake-draft-artifact')

    expect(published?.title).toBe('Definitely Fake Public Artifact')
    expect(draft).toBeNull()
  })
})
