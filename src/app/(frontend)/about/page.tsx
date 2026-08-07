import { ThreadMessages } from '@/components/chat/ThreadMessages'
import { Markdown } from '@/components/Markdown'
import { getShell } from '@/lib/shell'

export default async function AboutThreadPage() {
  const shell = await getShell()

  return (
    <ThreadMessages
      assistantMessage={<Markdown>{shell.aboutAssistantMessage}</Markdown>}
      title="About"
      userMessage={shell.aboutUserMessage}
    />
  )
}
