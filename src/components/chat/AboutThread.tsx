import { AssistantBubble } from '@/components/chat/AssistantBubble'
import { UserBubble } from '@/components/chat/UserBubble'
import { Markdown } from '@/components/Markdown'

type AboutThreadProps = {
  assistantMessage: string
  displayName: string
  userMessage: string
}

export function AboutThread({ assistantMessage, displayName, userMessage }: AboutThreadProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-8" data-about-thread>
      <h1 className="sr-only">About</h1>
      <div className="space-y-6" data-about-messages>
        <UserBubble>{userMessage}</UserBubble>
        <AssistantBubble displayName={displayName}>
          <div className="space-y-4 text-shell-muted" data-about-assistant-message>
            <Markdown>{assistantMessage}</Markdown>
          </div>
        </AssistantBubble>
      </div>
    </div>
  )
}
