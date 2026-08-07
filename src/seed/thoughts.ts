import type { Payload } from 'payload'

import type { Thought } from '@/payload-types'

type ThoughtSeed = Pick<Thought, 'body' | 'date' | 'slug' | 'summary' | 'title'>

const thoughtSeeds: ThoughtSeed[] = [
  {
    title: '[FAKE] Notes From a Very Small Moon',
    summary: 'Disposable field notes from an obviously imaginary satellite.',
    body: '## Field note\n\nThe moon was the size of a desk lamp and twice as opinionated.',
    slug: 'definitely-fake-seed-thought-1',
    date: '2026-08-02T00:00:00.000Z',
  },
  {
    title: '[FAKE] The Case for Square Pancakes',
    summary: 'A fake argument about breakfast geometry.',
    body: '## The thesis\n\nCorners make syrup navigation unnecessarily exciting.',
    slug: 'definitely-fake-seed-thought-2',
    date: '2026-07-02T00:00:00.000Z',
  },
  {
    title: '[FAKE] A Brief History of Invisible Buttons',
    summary: 'An invented design history with no canonical value.',
    body: '## Chapter one\n\nNobody saw the first button, which made attribution difficult.',
    slug: 'definitely-fake-seed-thought-3',
    date: '2026-06-02T00:00:00.000Z',
  },
  {
    title: '[FAKE] Why My Toaster Needs a Roadmap',
    summary: 'A disposable meditation on appliance planning.',
    body: '## Next quarter\n\nThe toaster will focus on reliability before expanding into bagels.',
    slug: 'definitely-fake-seed-thought-4',
    date: '2026-05-02T00:00:00.000Z',
  },
  {
    title: '[FAKE] Meeting Minutes From the Cloud Committee',
    summary: 'Fictional notes from a committee made entirely of weather.',
    body: '## Minutes\n\nRain moved to table the sunshine proposal until Tuesday.',
    slug: 'definitely-fake-seed-thought-5',
    date: '2026-04-02T00:00:00.000Z',
  },
  {
    title: '[FAKE] On Naming Every Houseplant Kevin',
    summary: 'An obviously fake naming-system retrospective.',
    body: '## Findings\n\nThe taxonomy was simple. The standups were confusing.',
    slug: 'definitely-fake-seed-thought-6',
    date: '2026-03-02T00:00:00.000Z',
  },
  {
    title: '[FAKE] The Last Sticky Note in the Universe',
    summary: 'A short fictional dispatch about dwindling stationery.',
    body: '## Dispatch\n\nIt said “buy more sticky notes,” which felt a little on the nose.',
    slug: 'definitely-fake-seed-thought-7',
    date: '2026-02-02T00:00:00.000Z',
  },
  {
    title: '[FAKE] Dispatches From Tuesday Number Two',
    summary: 'A fake report from an extra weekday that does not exist.',
    body: '## Dispatch\n\nTuesday Number Two is quieter, but the coffee is exactly the same.',
    slug: 'definitely-fake-seed-thought-8',
    date: '2026-01-02T00:00:00.000Z',
  },
]

export async function seedThoughts(payload: Payload) {
  let created = 0

  for (const thought of thoughtSeeds) {
    const existing = await payload.find({
      collection: 'thoughts',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: thought.slug,
        },
      },
    })

    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'thoughts',
      data: {
        ...thought,
        _status: 'published',
      },
      draft: false,
      overrideAccess: true,
    })
    created += 1
  }

  return {
    created,
    total: thoughtSeeds.length,
  }
}
