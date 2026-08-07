'use client'

import { ChevronDown, FileText, Hammer, MessageCircleMore, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type FauxPromptProps = {
  aboutQuestion: string
  buildingQuestion: string
  displayName: string
  writtenQuestion: string
}

export function FauxPrompt({
  aboutQuestion,
  buildingQuestion,
  displayName,
  writtenQuestion,
}: FauxPromptProps) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const suggestions = [
    { href: '/building', icon: Hammer, label: buildingQuestion, name: 'building' },
    { href: '/written', icon: FileText, label: writtenQuestion, name: 'written' },
    { href: '/about', icon: UserRound, label: aboutQuestion, name: 'about' },
  ]

  return (
    <div className="relative mx-auto mt-10 w-full max-w-2xl text-left" data-home-prompt>
      <button
        aria-controls="home-prompt-suggestions"
        aria-expanded={suggestionsOpen}
        className="flex min-h-16 w-full items-center gap-4 rounded-full border border-shell-border bg-shell-elevated px-5 text-left text-shell-muted shadow-sm transition-colors hover:border-shell-muted/60 hover:bg-shell-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
        data-faux-input
        onClick={() => setSuggestionsOpen((isOpen) => !isOpen)}
        type="button"
      >
        <MessageCircleMore aria-hidden="true" className="size-6 shrink-0" strokeWidth={1.8} />
        <span className="min-w-0 flex-1 truncate text-base md:text-lg">
          Choose a question for {displayName}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`size-5 shrink-0 transition-transform motion-reduce:transition-none ${suggestionsOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {suggestionsOpen ? (
        <div
          className="absolute z-10 mt-2 w-full rounded-2xl border border-shell-border bg-shell-panel p-2 shadow-2xl"
          data-prompt-menu
          id="home-prompt-suggestions"
        >
          <p className="px-3 pb-2 pt-1 text-xs font-medium text-shell-faint">Suggested questions</p>
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon

            return (
              <Link
                className="group flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-sm text-shell-muted transition-colors hover:bg-shell-elevated hover:text-shell-text focus-visible:bg-shell-elevated focus-visible:text-shell-text focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-shell-accent"
                data-suggestion={suggestion.name}
                href={suggestion.href}
                key={suggestion.href}
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-shell-elevated text-shell-accent"
                >
                  <Icon className="size-4" strokeWidth={1.8} />
                </span>
                <span className="truncate">{suggestion.label}</span>
              </Link>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
