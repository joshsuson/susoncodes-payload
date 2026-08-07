import type { Payload } from 'payload'

type PublishedProjectListOptions = {
  limit?: number
  page?: number
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
