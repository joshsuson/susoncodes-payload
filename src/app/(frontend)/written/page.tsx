import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { WrittenThread } from '@/components/chat/WrittenThread'
import config from '@/payload.config'
import { getShell } from '@/lib/shell'
import { buildPageMetadata } from '@/lib/seo'
import {
  findPublishedThoughtBundle,
  THOUGHT_LIST_PAGE_SIZE,
  toThoughtCardData,
} from '@/lib/thoughts'

export async function generateMetadata(): Promise<Metadata> {
  const shell = await getShell()

  return buildPageMetadata({
    descriptionFallback: shell.writtenAssistantMessage,
    imageFallback: shell.profilePhoto,
    shell,
    title: shell.writtenSidebarLabel || 'Written',
  })
}

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
