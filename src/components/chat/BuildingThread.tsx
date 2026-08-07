'use client'

import { useState } from 'react'

import { AssistantBubble } from '@/components/chat/AssistantBubble'
import { ProjectCard } from '@/components/chat/ProjectCard'
import { UserBubble } from '@/components/chat/UserBubble'
import type { ProjectCardData } from '@/lib/projects'

type ProjectBundle = {
  hasMore: boolean
  nextOffset: number
  projects: ProjectCardData[]
  rangeEnd: number
  rangeStart: number
  total: number
}

type BuildingThreadProps = {
  assistantMessage: string
  displayName: string
  initialBundle: ProjectBundle
  userMessage: string
}

function ProjectCards({ projects }: { projects: ProjectCardData[] }) {
  if (projects.length === 0) return null

  return (
    <div className="space-y-3" data-project-cards>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
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

export function BuildingThread({
  assistantMessage,
  displayName,
  initialBundle,
  userMessage,
}: BuildingThreadProps) {
  const [bundles, setBundles] = useState<ProjectBundle[]>([initialBundle])
  const [nextOffset, setNextOffset] = useState(initialBundle.nextOffset)
  const [hasMore, setHasMore] = useState(initialBundle.hasMore)
  const [loading, setLoading] = useState(false)

  async function showMore() {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const response = await fetch(`/building/more?offset=${nextOffset}`, {
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Show More failed: ${response.status}`)
      }

      const bundle = (await response.json()) as ProjectBundle
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
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-8" data-building-list>
      <h1 className="sr-only">Building</h1>
      <div className="space-y-6" data-building-messages>
        <UserBubble>{userMessage}</UserBubble>
        <AssistantBubble displayName={displayName}>
          <div className="space-y-4">
            <p data-building-assistant-message>{assistantMessage}</p>
            <ProjectCards projects={firstBundle.projects} />
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
                  Fine. More of the pile — {bundle.rangeStart}–{bundle.rangeEnd} of {bundle.total}.
                </p>
                <ProjectCards projects={bundle.projects} />
                {!bundle.hasMore ? (
                  <p className="text-xs text-shell-faint" data-end-of-list>
                    That’s everything on the shelf. No secret bonus track.
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
            {loading ? 'Digging…' : 'Show more of the pile'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
