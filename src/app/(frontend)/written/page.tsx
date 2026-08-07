import { ThreadMessages } from '@/components/chat/ThreadMessages'
import { getShell } from '@/lib/shell'

export default async function WrittenThreadPage() {
  const shell = await getShell()

  return (
    <ThreadMessages
      assistantMessage={shell.writtenAssistantMessage}
      title="Written"
      userMessage={shell.writtenUserMessage}
    />
  )
}
