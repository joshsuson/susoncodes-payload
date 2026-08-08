import type { Payload } from 'payload'

import type { Thought } from '@/payload-types'

export const THOUGHT_LIST_PAGE_SIZE = 5

export type ThoughtCardData = Pick<Thought, 'slug' | 'summary' | 'title'>

type PublishedThoughtListOptions = {
  limit?: number
  page?: number
}

type PublishedThoughtBundleOptions = {
  limit?: number
  offset?: number
}

export async function findPublishedThoughtBySlug(payload: Payload, slug: string) {
  const result = await payload.find({
    collection: 'thoughts',
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

export function findPublishedThoughts(
  payload: Payload,
  { limit, page }: PublishedThoughtListOptions = {},
) {
  return payload.find({
    collection: 'thoughts',
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

export async function findPublishedThoughtBundle(
  payload: Payload,
  { limit = THOUGHT_LIST_PAGE_SIZE, offset = 0 }: PublishedThoughtBundleOptions = {},
) {
  const safeLimit = Math.max(1, limit)
  const safeOffset = Math.max(0, offset)
  const page = Math.floor(safeOffset / safeLimit) + 1
  const result = await findPublishedThoughts(payload, {
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

export function toThoughtCardData(thought: Thought): ThoughtCardData {
  return {
    slug: thought.slug,
    summary: thought.summary,
    title: thought.title,
  }
}
