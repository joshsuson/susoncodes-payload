type AssistantBubbleProps = {
  children: React.ReactNode
  displayName: string
}

export function AssistantBubble({ children, displayName }: AssistantBubbleProps) {
  return (
    <div className="flex gap-3" data-assistant-bubble>
      <div className="min-w-0 max-w-[92%] space-y-1.5">
        <p className="shell-label">
          <span className="text-shell-accent">●</span> {displayName}
        </p>
        <div className="border border-shell-border border-l-2 border-l-shell-accent bg-shell-panel/80 px-3 py-2.5 text-[13px] leading-6 text-shell-muted">
          {children}
        </div>
      </div>
    </div>
  )
}
