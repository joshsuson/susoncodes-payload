import { AboutThread } from '@/components/chat/AboutThread'
import { getShell } from '@/lib/shell'

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
