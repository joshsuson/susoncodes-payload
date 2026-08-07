import { getPayload } from 'payload'

import { BuildingThread } from '@/components/chat/BuildingThread'
import config from '@/payload.config'
import {
  findPublishedProjectBundle,
  PROJECT_LIST_PAGE_SIZE,
  toProjectCardData,
} from '@/lib/projects'
import { getShell } from '@/lib/shell'

export default async function BuildingThreadPage() {
  const payload = await getPayload({ config })
  const [shell, bundle] = await Promise.all([
    getShell(),
    findPublishedProjectBundle(payload, {
      limit: PROJECT_LIST_PAGE_SIZE,
      offset: 0,
    }),
  ])

  return (
    <BuildingThread
      assistantMessage={shell.buildingAssistantMessage}
      displayName={shell.displayName}
      initialBundle={{
        hasMore: bundle.hasMore,
        nextOffset: bundle.nextOffset,
        projects: bundle.docs.map(toProjectCardData),
        rangeEnd: bundle.rangeEnd,
        rangeStart: bundle.rangeStart,
        total: bundle.total,
      }}
      userMessage={shell.buildingUserMessage}
    />
  )
}
