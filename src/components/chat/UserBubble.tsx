type UserBubbleProps = {
  children: React.ReactNode
}

export function UserBubble({ children }: UserBubbleProps) {
  return (
    <div className="flex justify-end" data-user-bubble>
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-shell-user px-4 py-2.5 text-sm leading-6 text-shell-text">
        {children}
      </div>
    </div>
  )
}
