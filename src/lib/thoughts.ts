import type { Payload } from 'payload'

type PublishedThoughtListOptions = {
  limit?: number
  page?: number
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
