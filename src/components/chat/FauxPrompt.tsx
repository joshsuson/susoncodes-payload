'use client'

import { ChevronDown } from 'lucide-react'
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
    { href: '/building', label: buildingQuestion, name: 'building' },
    { href: '/written', label: writtenQuestion, name: 'written' },
    { href: '/about', label: aboutQuestion, name: 'about' },
  ]

  return (
    <div className="relative mx-auto mt-10 w-full max-w-2xl text-left" data-home-prompt>
      <button
        aria-controls="home-prompt-suggestions"
        aria-expanded={suggestionsOpen}
        className="shell-pressable shell-faux-prompt flex min-h-12 w-full items-center gap-3 border border-shell-border bg-shell-panel px-3 text-left text-shell-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-shell-accent"
        data-faux-input
        onClick={() => setSuggestionsOpen((isOpen) => !isOpen)}
        type="button"
      >
        <span className="text-shell-accent" aria-hidden="true">
          ❯
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] md:text-sm">
          ask {displayName.toLowerCase()}…
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 transition-transform motion-reduce:transition-none ${suggestionsOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {suggestionsOpen ? (
        <div
          className="absolute z-10 mt-1 w-full border border-shell-border bg-shell-panel p-1"
          data-prompt-menu
          id="home-prompt-suggestions"
        >
          <p className="shell-label px-2.5 py-2">suggested</p>
          {suggestions.map((suggestion) => (
            <Link
              className="shell-pressable shell-prompt-suggestion flex min-h-10 items-center gap-2 px-2.5 py-2 text-[13px] text-shell-muted focus-visible:bg-shell-elevated focus-visible:text-shell-text focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-shell-accent"
              data-suggestion={suggestion.name}
              href={suggestion.href}
              key={suggestion.href}
            >
              <span className="text-shell-accent" aria-hidden="true">
                ›
              </span>
              <span className="truncate">{suggestion.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
