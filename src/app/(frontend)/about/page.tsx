import type { Metadata } from 'next'

import { AboutThread } from '@/components/chat/AboutThread'
import { getShell } from '@/lib/shell'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const shell = await getShell()

  return buildPageMetadata({
    descriptionFallback: shell.aboutUserMessage,
    imageFallback: shell.profilePhoto,
    shell,
    title: shell.aboutSidebarLabel || 'About',
  })
}

export default async function AboutThreadPage() {
  const shell = await getShell()

  return (
    <AboutThread
      assistantMessage={shell.aboutAssistantMessage}
      displayName={shell.displayName}
      userMessage={shell.aboutUserMessage}
    />
  )
}
