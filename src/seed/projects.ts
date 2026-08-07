import type { Payload } from 'payload'

import type { Project } from '@/payload-types'

type ProjectSeed = Pick<
  Project,
  | 'buildStatus'
  | 'date'
  | 'externalUrl'
  | 'learnings'
  | 'pitch'
  | 'slug'
  | 'thoughtProcess'
  | 'title'
  | 'whatItIs'
>

const projectSeeds: ProjectSeed[] = [
  {
    title: '[FAKE] Pocket Weather Machine',
    pitch: 'A disposable forecast gadget for testing the Project library.',
    buildStatus: 'active',
    externalUrl: 'https://example.com/pocket-weather-machine',
    whatItIs: '## What it is\n\nA tiny machine that confidently predicts yesterday’s weather.',
    thoughtProcess:
      '## Thought process\n\nStart with clouds. Add blinking lights. Avoid actual meteorology.',
    learnings: '## Learnings\n\nCardboard is not waterproof.',
    slug: 'definitely-fake-seed-project-1',
    date: '2026-08-01T00:00:00.000Z',
  },
  {
    title: '[FAKE] Infinite Sandwich Index',
    pitch: 'An obviously fictional catalog of sandwiches that do not exist.',
    buildStatus: 'shipped',
    externalUrl: 'https://example.com/infinite-sandwich-index',
    whatItIs: 'A searchable archive of imaginary lunches.',
    thoughtProcess: 'The data model began with bread and escalated quickly.',
    learnings: 'Never paginate pickles by hand.',
    slug: 'definitely-fake-seed-project-2',
    date: '2026-07-01T00:00:00.000Z',
  },
  {
    title: '[FAKE] Moonlight Invoice Printer',
    pitch: 'A dummy invoicing tool powered entirely by dramatic lighting.',
    buildStatus: 'parked',
    externalUrl: 'https://example.com/moonlight-invoice-printer',
    whatItIs: 'A fake printer with excellent ambience and no paper tray.',
    thoughtProcess: 'The spotlight shipped before the billing engine.',
    learnings: 'Atmosphere is not a payment processor.',
    slug: 'definitely-fake-seed-project-3',
    date: '2026-06-01T00:00:00.000Z',
  },
  {
    title: '[FAKE] Polite Robot Queue',
    pitch: 'A pretend waiting room where every robot insists you go first.',
    buildStatus: 'active',
    externalUrl: 'https://example.com/polite-robot-queue',
    whatItIs: 'A queue simulator with impeccable manners and zero throughput.',
    thoughtProcess: 'Optimize for courtesy, then discover the deadlock.',
    learnings: 'Someone eventually has to accept the first position.',
    slug: 'definitely-fake-seed-project-4',
    date: '2026-05-01T00:00:00.000Z',
  },
  {
    title: '[FAKE] Ambient Button Museum',
    pitch: 'A fictional gallery devoted to buttons that perform no actions.',
    buildStatus: 'shipped',
    externalUrl: 'https://example.com/ambient-button-museum',
    whatItIs: 'Eight rooms of beautifully inactive controls.',
    thoughtProcess: 'Remove every handler while preserving the hover states.',
    learnings: 'Visitors will click anything with a border radius.',
    slug: 'definitely-fake-seed-project-5',
    date: '2026-04-01T00:00:00.000Z',
  },
  {
    title: '[FAKE] Emergency Confetti Console',
    pitch: 'A dummy control panel for celebrations that never happened.',
    buildStatus: 'parked',
    externalUrl: 'https://example.com/emergency-confetti-console',
    whatItIs: 'A big red button connected to an empty paper bag.',
    thoughtProcess: 'Treat delight as critical infrastructure.',
    learnings: 'Confetti has an alarming database footprint.',
    slug: 'definitely-fake-seed-project-6',
    date: '2026-03-01T00:00:00.000Z',
  },
  {
    title: '[FAKE] Left Sock Locator',
    pitch: 'An imaginary tracking system for laundry’s hardest problem.',
    buildStatus: 'active',
    externalUrl: 'https://example.com/left-sock-locator',
    whatItIs: 'A map with one pin permanently marked “probably under the bed.”',
    thoughtProcess: 'Triangulate using lint density and static electricity.',
    learnings: 'The right sock refuses to be a reliable witness.',
    slug: 'definitely-fake-seed-project-7',
    date: '2026-02-01T00:00:00.000Z',
  },
  {
    title: '[FAKE] Weekend Time Extender',
    pitch: 'A fake utility that adds three undocumented hours to Sunday.',
    buildStatus: 'shipped',
    externalUrl: 'https://example.com/weekend-time-extender',
    whatItIs: 'A clock that pauses whenever Monday gets too close.',
    thoughtProcess: 'Ignore physics. Focus on the calendar interface.',
    learnings: 'Time zones notice everything.',
    slug: 'definitely-fake-seed-project-8',
    date: '2026-01-01T00:00:00.000Z',
  },
]

export async function seedProjects(payload: Payload) {
  let created = 0

  for (const project of projectSeeds) {
    const existing = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: project.slug,
        },
      },
    })

    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'projects',
      data: {
        ...project,
        _status: 'published',
      },
      draft: false,
      overrideAccess: true,
    })
    created += 1
  }

  return {
    created,
    total: projectSeeds.length,
  }
}
