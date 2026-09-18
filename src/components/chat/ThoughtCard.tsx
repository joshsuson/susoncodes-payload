import Link from 'next/link'

import type { ThoughtCardData } from '@/lib/thoughts'

type ThoughtCardProps = {
  thought: ThoughtCardData
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  return (
    <article
      className="shell-paint relative border border-shell-border bg-shell-canvas/40 p-3 hover:border-shell-accent/40 hover:bg-shell-elevated/40"
      data-thought-card={thought.slug}
    >
      <div className="min-w-0 space-y-1">
        <h3 className="text-[13px] font-medium text-shell-text">
          <Link
            className="after:absolute after:inset-0 hover:text-shell-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
            href={`/written/${thought.slug}`}
          >
            {thought.title}
          </Link>
        </h3>
        {thought.summary ? (
          <p className="text-[12px] leading-5 text-shell-muted">{thought.summary}</p>
        ) : null}
      </div>
    </article>
  )
}
