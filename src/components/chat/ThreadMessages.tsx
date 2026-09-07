type ThreadMessagesProps = {
  assistantMessage: React.ReactNode
  title: string
  userMessage: string
}

export function ThreadMessages({ assistantMessage, title, userMessage }: ThreadMessagesProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-16" data-thread={title}>
      <h1 className="sr-only">{title}</h1>
      <div className="ml-auto max-w-xl border border-shell-border bg-shell-user px-3 py-2 text-[13px] leading-6 text-shell-text">
        <span className="mr-2 text-shell-accent" aria-hidden="true">
          ❯
        </span>
        {userMessage}
      </div>
      <div className="mt-6 max-w-2xl border border-shell-border border-l-2 border-l-shell-accent bg-shell-panel px-3 py-2.5 text-[13px] leading-6 text-shell-muted">
        {assistantMessage}
      </div>
    </div>
  )
}
