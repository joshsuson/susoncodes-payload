'use client'

import { useState } from 'react'

import { AssistantBubble } from '@/components/chat/AssistantBubble'
import { ThoughtCard } from '@/components/chat/ThoughtCard'
import { UserBubble } from '@/components/chat/UserBubble'
import type { ThoughtCardData } from '@/lib/thoughts'

type ThoughtBundle = {
  hasMore: boolean
  nextOffset: number
  rangeEnd: number
  rangeStart: number
  thoughts: ThoughtCardData[]
  total: number
}

type WrittenThreadProps = {
  assistantMessage: string
  displayName: string
  initialBundle: ThoughtBundle
  userMessage: string
}

function ThoughtCards({ thoughts }: { thoughts: ThoughtCardData[] }) {
  if (thoughts.length === 0) return null

  return (
    <div className="space-y-3" data-thought-cards>
      {thoughts.map((thought) => (
        <ThoughtCard key={thought.slug} thought={thought} />
      ))}
    </div>
  )
}

function RangeLine({
  rangeEnd,
  rangeStart,
  total,
}: {
  rangeEnd: number
  rangeStart: number
  total: number
}) {
  if (total <= 0) return null

  return (
    <p className="text-xs text-shell-faint" data-range-line>
      Showing {rangeStart}–{rangeEnd} of {total}
    </p>
  )
}

export function WrittenThread({
  assistantMessage,
  displayName,
  initialBundle,
  userMessage,
}: WrittenThreadProps) {
  const [bundles, setBundles] = useState<ThoughtBundle[]>([initialBundle])
  const [nextOffset, setNextOffset] = useState(initialBundle.nextOffset)
  const [hasMore, setHasMore] = useState(initialBundle.hasMore)
  const [loading, setLoading] = useState(false)

  async function showMore() {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const response = await fetch(`/written/more?offset=${nextOffset}`, {
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Show More failed: ${response.status}`)
      }

      const bundle = (await response.json()) as ThoughtBundle
      setBundles((current) => [...current, bundle])
      setNextOffset(bundle.nextOffset)
      setHasMore(bundle.hasMore)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const [firstBundle, ...moreBundles] = bundles

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-8" data-written-list>
      <h1 className="sr-only">Written</h1>
      <div className="space-y-6" data-written-messages>
        <UserBubble>{userMessage}</UserBubble>
        <AssistantBubble displayName={displayName}>
          <div className="space-y-4">
            <p data-written-assistant-message>{assistantMessage}</p>
            <ThoughtCards thoughts={firstBundle.thoughts} />
            <RangeLine
              rangeEnd={firstBundle.rangeEnd}
              rangeStart={firstBundle.rangeStart}
              total={firstBundle.total}
            />
          </div>
        </AssistantBubble>

        {moreBundles.map((bundle) => (
          <div
            className="space-y-6"
            data-assistant-only-bundle
            data-has-more={bundle.hasMore ? 'true' : 'false'}
            data-next-offset={bundle.nextOffset}
            data-range-end={bundle.rangeEnd}
            data-range-start={bundle.rangeStart}
            data-total={bundle.total}
            key={`${bundle.rangeStart}-${bundle.rangeEnd}`}
          >
            <AssistantBubble displayName={displayName}>
              <div className="space-y-4">
                <p>
                  Fine. More from the archive — {bundle.rangeStart}–{bundle.rangeEnd} of{' '}
                  {bundle.total}.
                </p>
                <ThoughtCards thoughts={bundle.thoughts} />
                {!bundle.hasMore ? (
                  <p className="text-xs text-shell-faint" data-end-of-list>
                    That’s everything he’s bothered to publish. No secret draft pile for you.
                  </p>
                ) : null}
              </div>
            </AssistantBubble>
          </div>
        ))}
      </div>

      {hasMore ? (
        <div className="pl-11" data-show-more-slot>
          <button
            className="rounded-full border border-shell-border bg-shell-panel px-3 py-1.5 text-xs text-shell-muted transition hover:border-shell-accent/40 hover:text-shell-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent disabled:cursor-wait disabled:opacity-60"
            data-show-more="true"
            disabled={loading}
            onClick={showMore}
            type="button"
          >
            {loading ? 'Digging…' : 'Show more of the archive'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
