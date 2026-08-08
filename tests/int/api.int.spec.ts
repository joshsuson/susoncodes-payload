import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import {
  findPublishedProjectBundle,
  findPublishedProjectBySlug,
  findPublishedProjects,
  PROJECT_LIST_PAGE_SIZE,
} from '@/lib/projects'
import {
  findPublishedThoughtBundle,
  findPublishedThoughtBySlug,
  findPublishedThoughts,
  THOUGHT_LIST_PAGE_SIZE,
} from '@/lib/thoughts'
import { seedGlobals } from '@/seed/globals'
import { seedProjects } from '@/seed/projects'
import { seedThoughts } from '@/seed/thoughts'

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

  it('seeds public Shell and Site globals idempotently', async () => {
    await seedGlobals(payload)
    await seedGlobals(payload)

    const shell = await payload.findGlobal({
      slug: 'shell',
      overrideAccess: false,
    })
    const site = await payload.findGlobal({
      slug: 'site',
      overrideAccess: false,
    })

    expect(shell).toMatchObject({
      displayName: 'Josh Bot',
      homeHeading: 'Where should we begin?',
      homeBuildingQuestion: 'What are you building these days?',
      homeWrittenQuestion: 'What have you written?',
      homeAboutQuestion: 'Who is Josh?',
      buildingSidebarLabel: 'What I’m building',
      writtenSidebarLabel: 'What I’ve written',
      aboutSidebarLabel: 'Who is Josh?',
    })
    expect(shell.aboutAssistantMessage).toContain('The fourth wall was load-bearing')
    expect(typeof shell.profilePhoto === 'object' ? shell.profilePhoto.alt : null).toBe(
      'Josh Suson',
    )
    expect(
      site.socialLinks?.map(({ serviceName, text, url }) => ({ serviceName, text, url })),
    ).toEqual([
      {
        serviceName: 'X',
        url: 'https://x.com/joshsuson',
        text: 'Follow on X',
      },
      {
        serviceName: 'Github',
        url: 'https://github.com/joshsuson',
        text: 'Follow on Github',
      },
      {
        serviceName: 'Linkedin',
        url: 'https://www.linkedin.com/in/joshsuson',
        text: 'Follow on Linkedin',
      },
    ])

    const seededProfilePhotos = await payload.find({
      collection: 'media',
      overrideAccess: true,
      where: {
        alt: {
          equals: 'Josh Suson',
        },
      },
    })

    expect(seededProfilePhotos.totalDocs).toBe(1)
  })

  it('rejects unauthenticated writes to Shell and Site globals', async () => {
    await seedGlobals(payload)

    await expect(
      payload.updateGlobal({
        slug: 'shell',
        data: {
          displayName: 'Definitely Fake Imposter Bot',
        },
        overrideAccess: false,
      }),
    ).rejects.toThrow()

    await expect(
      payload.updateGlobal({
        slug: 'site',
        data: {
          socialLinks: [],
        },
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('creates a Thought with the required public shape', async () => {
    const thought = await payload.create({
      collection: 'thoughts',
      data: {
        title: 'Definitely Fake Integration Thought',
        summary: 'A disposable Thought used to verify the public CMS contract.',
        body: '## Definitely fake\n\nThis markdown body exists only for an integration test.',
        slug: 'definitely-fake-integration-thought',
        date: '2026-01-01T00:00:00.000Z',
        metaTitle: 'Fake Integration Thought',
        metaDescription: 'Not a real Thought.',
        _status: 'published',
      },
    })

    expect(thought).toMatchObject({
      title: 'Definitely Fake Integration Thought',
      summary: 'A disposable Thought used to verify the public CMS contract.',
      body: '## Definitely fake\n\nThis markdown body exists only for an integration test.',
    })

    await expect(
      payload.create({
        collection: 'thoughts',
        data: {
          title: 'Definitely Fake Missing Body Thought',
          slug: 'definitely-fake-missing-body-thought',
          date: '2026-01-01T00:00:00.000Z',
        } as never,
      }),
    ).rejects.toThrow()
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

  it('pages published Projects into Building Thread bundles', async () => {
    const fixtures = Array.from({ length: PROJECT_LIST_PAGE_SIZE + 2 }, (_, index) => ({
      title: `Definitely Fake Bundle Project ${index + 1}`,
      slug: `definitely-fake-bundle-project-${index + 1}`,
      date: `2026-05-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
    }))

    for (const project of fixtures) {
      await payload.create({
        collection: 'projects',
        data: {
          ...project,
          pitch: 'Disposable Building Thread fixture.',
          buildStatus: 'active',
          _status: 'published',
        },
      })
    }

    await payload.create({
      collection: 'projects',
      data: {
        title: 'Definitely Fake Bundle Draft Project',
        pitch: 'Drafts stay out of Building Thread bundles.',
        buildStatus: 'parked',
        slug: 'definitely-fake-bundle-draft-project',
        date: '2026-12-01T00:00:00.000Z',
        _status: 'draft',
      },
      draft: true,
    })

    const firstPage = await findPublishedProjectBundle(payload, { offset: 0 })
    const bundleTitles = firstPage.docs
      .filter((project) => project.slug.startsWith('definitely-fake-bundle-project-'))
      .map((project) => project.title)

    expect(firstPage.docs).toHaveLength(PROJECT_LIST_PAGE_SIZE)
    expect(bundleTitles).toEqual(
      fixtures
        .slice()
        .reverse()
        .slice(0, PROJECT_LIST_PAGE_SIZE)
        .map((project) => project.title),
    )
    expect(firstPage.rangeStart).toBe(1)
    expect(firstPage.rangeEnd).toBe(PROJECT_LIST_PAGE_SIZE)
    expect(firstPage.hasMore).toBe(true)
    expect(firstPage.nextOffset).toBe(PROJECT_LIST_PAGE_SIZE)
    expect(firstPage.docs.map((project) => project.title)).not.toContain(
      'Definitely Fake Bundle Draft Project',
    )

    const secondPage = await findPublishedProjectBundle(payload, {
      offset: firstPage.nextOffset,
    })
    const secondBundleTitles = secondPage.docs
      .filter((project) => project.slug.startsWith('definitely-fake-bundle-project-'))
      .map((project) => project.title)

    expect(secondBundleTitles.length).toBeGreaterThan(0)
    expect(secondBundleTitles).toEqual(
      fixtures
        .slice()
        .reverse()
        .slice(PROJECT_LIST_PAGE_SIZE)
        .map((project) => project.title),
    )
    expect(secondPage.rangeStart).toBe(PROJECT_LIST_PAGE_SIZE + 1)
    expect(secondPage.docs.map((project) => project.title)).not.toContain(
      'Definitely Fake Bundle Draft Project',
    )
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

    const result = await findPublishedProjects(payload, { limit: 100 })
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

  it('pages published Thoughts into Written Thread bundles', async () => {
    const fixtures = Array.from({ length: THOUGHT_LIST_PAGE_SIZE + 2 }, (_, index) => ({
      title: `Definitely Fake Bundle Thought ${index + 1}`,
      slug: `definitely-fake-bundle-thought-${index + 1}`,
      date: `2026-04-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
    }))

    for (const thought of fixtures) {
      await payload.create({
        collection: 'thoughts',
        data: {
          ...thought,
          body: 'Disposable Written Thread fixture.',
          summary: 'A disposable Thought summary.',
          _status: 'published',
        },
      })
    }

    await payload.create({
      collection: 'thoughts',
      data: {
        title: 'Definitely Fake Bundle Draft Thought',
        body: 'Drafts stay out of Written Thread bundles.',
        slug: 'definitely-fake-bundle-draft-thought',
        date: '2026-12-01T00:00:00.000Z',
        _status: 'draft',
      },
      draft: true,
    })

    const firstPage = await findPublishedThoughtBundle(payload, { offset: 0 })
    const bundleTitles = firstPage.docs
      .filter((thought) => thought.slug.startsWith('definitely-fake-bundle-thought-'))
      .map((thought) => thought.title)

    expect(firstPage.docs).toHaveLength(THOUGHT_LIST_PAGE_SIZE)
    expect(bundleTitles).toEqual(
      fixtures
        .slice()
        .reverse()
        .slice(0, THOUGHT_LIST_PAGE_SIZE)
        .map((thought) => thought.title),
    )
    expect(firstPage.rangeStart).toBe(1)
    expect(firstPage.rangeEnd).toBe(THOUGHT_LIST_PAGE_SIZE)
    expect(firstPage.hasMore).toBe(true)
    expect(firstPage.nextOffset).toBe(THOUGHT_LIST_PAGE_SIZE)
    expect(firstPage.docs.map((thought) => thought.title)).not.toContain(
      'Definitely Fake Bundle Draft Thought',
    )

    const secondPage = await findPublishedThoughtBundle(payload, {
      offset: firstPage.nextOffset,
    })
    const secondBundleTitles = secondPage.docs
      .filter((thought) => thought.slug.startsWith('definitely-fake-bundle-thought-'))
      .map((thought) => thought.title)

    expect(secondBundleTitles.length).toBeGreaterThan(0)
    expect(secondBundleTitles).toEqual(
      fixtures
        .slice()
        .reverse()
        .slice(THOUGHT_LIST_PAGE_SIZE)
        .map((thought) => thought.title),
    )
    expect(secondPage.rangeStart).toBe(THOUGHT_LIST_PAGE_SIZE + 1)
    expect(secondPage.docs.map((thought) => thought.title)).not.toContain(
      'Definitely Fake Bundle Draft Thought',
    )
  })

  it('lists only published Thoughts in newest-first order', async () => {
    const thoughts = [
      {
        title: 'Definitely Fake Older Public Thought',
        slug: 'definitely-fake-older-public-thought',
        date: '2025-01-01T00:00:00.000Z',
        _status: 'published' as const,
      },
      {
        title: 'Definitely Fake Draft Thought',
        slug: 'definitely-fake-draft-thought',
        date: '2027-01-01T00:00:00.000Z',
        _status: 'draft' as const,
      },
      {
        title: 'Definitely Fake Newer Public Thought',
        slug: 'definitely-fake-newer-public-thought',
        date: '2026-01-01T00:00:00.000Z',
        _status: 'published' as const,
      },
    ]

    for (const thought of thoughts) {
      await payload.create({
        collection: 'thoughts',
        data: {
          ...thought,
          body: 'A disposable markdown body.',
        },
        draft: thought._status === 'draft',
      })
    }

    const result = await findPublishedThoughts(payload, { limit: 100 })
    const fixtureTitles = result.docs
      .filter((thought) => thought.slug.includes('-public-thought'))
      .map((thought) => thought.title)

    expect(fixtureTitles).toEqual([
      'Definitely Fake Newer Public Thought',
      'Definitely Fake Older Public Thought',
    ])
    expect(result.docs.map((thought) => thought.title)).not.toContain(
      'Definitely Fake Draft Thought',
    )
  })

  it('finds a published Thought Artifact by slug without exposing a draft', async () => {
    await payload.create({
      collection: 'thoughts',
      data: {
        title: 'Definitely Fake Public Thought Artifact',
        body: 'A disposable public Thought Artifact fixture.',
        slug: 'definitely-fake-public-thought-artifact',
        date: '2026-01-01T00:00:00.000Z',
        _status: 'published',
      },
    })
    await payload.create({
      collection: 'thoughts',
      data: {
        title: 'Definitely Fake Draft Thought Artifact',
        body: 'A disposable draft Thought Artifact fixture.',
        slug: 'definitely-fake-draft-thought-artifact',
        date: '2026-01-02T00:00:00.000Z',
        _status: 'draft',
      },
      draft: true,
    })

    const published = await findPublishedThoughtBySlug(
      payload,
      'definitely-fake-public-thought-artifact',
    )
    const draft = await findPublishedThoughtBySlug(
      payload,
      'definitely-fake-draft-thought-artifact',
    )

    expect(published?.title).toBe('Definitely Fake Public Thought Artifact')
    expect(draft).toBeNull()
  })

  it('seeds eight disposable Thoughts without creating duplicates', async () => {
    await seedThoughts(payload)
    await seedThoughts(payload)

    const seededThoughts = await payload.find({
      collection: 'thoughts',
      limit: 20,
      overrideAccess: true,
      where: {
        slug: {
          contains: 'definitely-fake-seed-thought-',
        },
      },
    })

    expect(seededThoughts.totalDocs).toBe(8)
    expect(new Set(seededThoughts.docs.map((thought) => thought.slug)).size).toBe(8)
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
