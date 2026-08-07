import { ThreadMessages } from '@/components/chat/ThreadMessages'
import { getShell } from '@/lib/shell'

export default async function BuildingThreadPage() {
  const shell = await getShell()

  return (
    <ThreadMessages
      assistantMessage={shell.buildingAssistantMessage}
      title="Building"
      userMessage={shell.buildingUserMessage}
    />
  )
}
