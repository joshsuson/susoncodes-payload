type ThreadMessagesProps = {
  assistantMessage: React.ReactNode
  title: string
  userMessage: string
}

export function ThreadMessages({ assistantMessage, title, userMessage }: ThreadMessagesProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-16" data-thread={title}>
      <h1 className="sr-only">{title}</h1>
      <div className="ml-auto max-w-xl rounded-3xl bg-shell-user px-5 py-3 text-sm leading-6 text-shell-text">
        {userMessage}
      </div>
      <div className="mt-8 max-w-2xl rounded-3xl bg-shell-panel px-5 py-4 text-sm leading-7 text-shell-muted">
        {assistantMessage}
      </div>
    </div>
  )
}
