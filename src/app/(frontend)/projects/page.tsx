import { getPayload } from 'payload'

import { ArchiveLibrary } from '@/components/archive/ArchiveLibrary'
import { findPublishedProjects } from '@/lib/projects'
import type { Media } from '@/payload-types'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

const ARCHIVE_LIMIT = 100

export default async function ProjectsArchivePage() {
  const payload = await getPayload({ config })
  const result = await findPublishedProjects(payload, { limit: ARCHIVE_LIMIT })

  const items = result.docs.map((project) => {
    const image = typeof project.image === 'object' && project.image !== null ? project.image : null
    const media = image as Media | null

    return {
      date: project.date,
      href: `/building/${project.slug}`,
      imageAlt: media?.alt ?? null,
      imageUrl: media?.url ?? null,
      slug: project.slug,
      status: project.buildStatus,
      title: project.title,
    }
  })

  return (
    <ArchiveLibrary
      emptyLabel="No projects to show yet."
      items={items}
      title="Projects"
      type="projects"
    />
  )
}
