import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { ArchiveLibrary } from '@/components/archive/ArchiveLibrary'
import { getShell } from '@/lib/shell'
import { buildPageMetadata } from '@/lib/seo'
import { findPublishedThoughts } from '@/lib/thoughts'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const shell = await getShell()

  return buildPageMetadata({
    descriptionFallback: shell.writtenAssistantMessage,
    imageFallback: shell.profilePhoto,
    shell,
    title: 'Thoughts',
  })
}

const ARCHIVE_LIMIT = 100

export default async function ThoughtsArchivePage() {
  const payload = await getPayload({ config })
  const result = await findPublishedThoughts(payload, { limit: ARCHIVE_LIMIT })

  const items = result.docs.map((thought) => ({
    date: thought.date,
    href: `/written/${thought.slug}`,
    slug: thought.slug,
    status: 'Published',
    title: thought.title,
  }))

  return (
    <ArchiveLibrary
      emptyLabel="No thoughts to show yet."
      items={items}
      title="Thoughts"
      type="thoughts"
    />
  )
}
