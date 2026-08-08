import Link from 'next/link'

import type { ThoughtCardData } from '@/lib/thoughts'

type ThoughtCardProps = {
  thought: ThoughtCardData
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  return (
    <article
      className="rounded-2xl border border-shell-border bg-shell-elevated/50 p-4 transition hover:border-shell-accent/30"
      data-thought-card={thought.slug}
    >
      <div className="min-w-0 space-y-1">
        <h3 className="text-sm font-semibold text-shell-text">
          <Link
            className="hover:text-shell-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
            href={`/written/${thought.slug}`}
          >
            {thought.title}
          </Link>
        </h3>
        {thought.summary ? <p className="text-sm text-shell-muted">{thought.summary}</p> : null}
      </div>
    </article>
  )
}
