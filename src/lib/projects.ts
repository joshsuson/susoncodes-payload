import type { Payload } from 'payload'

import type { Project } from '@/payload-types'

export const PROJECT_LIST_PAGE_SIZE = 5

export type ProjectCardData = Pick<
  Project,
  'buildStatus' | 'externalUrl' | 'pitch' | 'slug' | 'title'
>

type PublishedProjectListOptions = {
  limit?: number
  page?: number
}

type PublishedProjectBundleOptions = {
  limit?: number
  offset?: number
}

export async function findPublishedProjectBySlug(payload: Payload, slug: string) {
  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return result.docs[0] ?? null
}

export function findPublishedProjects(
  payload: Payload,
  { limit, page }: PublishedProjectListOptions = {},
) {
  return payload.find({
    collection: 'projects',
    depth: 1,
    draft: false,
    limit,
    overrideAccess: false,
    page,
    sort: '-date',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })
}

export async function findPublishedProjectBundle(
  payload: Payload,
  { limit = PROJECT_LIST_PAGE_SIZE, offset = 0 }: PublishedProjectBundleOptions = {},
) {
  const safeLimit = Math.max(1, limit)
  const safeOffset = Math.max(0, offset)
  const page = Math.floor(safeOffset / safeLimit) + 1
  const result = await findPublishedProjects(payload, {
    limit: safeLimit,
    page,
  })
  const count = result.docs.length
  const rangeStart = count === 0 ? safeOffset : safeOffset + 1
  const rangeEnd = safeOffset + count

  return {
    docs: result.docs,
    hasMore: rangeEnd < result.totalDocs,
    nextOffset: rangeEnd,
    rangeEnd,
    rangeStart,
    total: result.totalDocs,
  }
}

export function toProjectCardData(project: Project): ProjectCardData {
  return {
    buildStatus: project.buildStatus,
    externalUrl: project.externalUrl,
    pitch: project.pitch,
    slug: project.slug,
    title: project.title,
  }
}
