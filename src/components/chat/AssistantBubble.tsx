type AssistantBubbleProps = {
  children: React.ReactNode
  displayName: string
}

export function AssistantBubble({ children, displayName }: AssistantBubbleProps) {
  return (
    <div className="flex gap-3" data-assistant-bubble>
      <div
        aria-hidden="true"
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-shell-accent/15 text-xs font-semibold text-shell-accent"
      >
        JB
      </div>
      <div className="min-w-0 max-w-[85%] space-y-1">
        <p className="text-xs font-medium text-shell-faint">{displayName}</p>
        <div className="rounded-2xl rounded-tl-md border border-shell-border bg-shell-panel px-4 py-3 text-sm leading-6 text-shell-muted">
          {children}
        </div>
      </div>
    </div>
  )
}
