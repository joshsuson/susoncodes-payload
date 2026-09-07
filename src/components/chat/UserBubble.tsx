type UserBubbleProps = {
  children: React.ReactNode
}

export function UserBubble({ children }: UserBubbleProps) {
  return (
    <div className="flex justify-end" data-user-bubble>
      <div className="max-w-[92%] border border-shell-border bg-shell-user px-3 py-2 text-[13px] leading-6 text-shell-text">
        <span className="mr-2 text-shell-accent" aria-hidden="true">
          ❯
        </span>
        {children}
      </div>
    </div>
  )
}
