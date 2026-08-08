import { getPayload } from 'payload'

import { WrittenThread } from '@/components/chat/WrittenThread'
import config from '@/payload.config'
import { getShell } from '@/lib/shell'
import {
  findPublishedThoughtBundle,
  THOUGHT_LIST_PAGE_SIZE,
  toThoughtCardData,
} from '@/lib/thoughts'

export default async function WrittenThreadPage() {
  const payload = await getPayload({ config })
  const [shell, bundle] = await Promise.all([
    getShell(),
    findPublishedThoughtBundle(payload, {
      limit: THOUGHT_LIST_PAGE_SIZE,
      offset: 0,
    }),
  ])

  return (
    <WrittenThread
      assistantMessage={shell.writtenAssistantMessage}
      displayName={shell.displayName}
      initialBundle={{
        hasMore: bundle.hasMore,
        nextOffset: bundle.nextOffset,
        rangeEnd: bundle.rangeEnd,
        rangeStart: bundle.rangeStart,
        thoughts: bundle.docs.map(toThoughtCardData),
        total: bundle.total,
      }}
      userMessage={shell.writtenUserMessage}
    />
  )
}
