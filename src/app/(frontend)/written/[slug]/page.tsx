import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import { ArtifactBreadcrumb } from '@/components/artifact/ArtifactBreadcrumb'
import { Markdown } from '@/components/Markdown'
import { findPublishedThoughtBySlug } from '@/lib/thoughts'
import config from '@/payload.config'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

type ThoughtArtifactPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ThoughtArtifactPage({ params }: ThoughtArtifactPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const thought = await findPublishedThoughtBySlug(payload, slug)

  if (!thought) notFound()

  return (
    <div className="min-h-full" data-thought-artifact data-thought-detail data-thought-slug={slug}>
      <ArtifactBreadcrumb
        archive="thoughts"
        href="/thoughts"
        label="Thoughts"
        title={thought.title}
      />

      <article className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-16">
        <header>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-wide text-shell-faint">
            <span className="uppercase">Thought</span>
            <span aria-hidden="true">·</span>
            <time dateTime={thought.date.slice(0, 10)}>
              {dateFormatter.format(new Date(thought.date))}
            </time>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-shell-text md:text-6xl">
            {thought.title}
          </h1>

          {thought.summary ? (
            <p className="mt-5 text-lg leading-relaxed text-shell-muted md:text-xl">
              {thought.summary}
            </p>
          ) : null}
        </header>

        <div
          className="mt-10 space-y-4 text-base leading-relaxed text-shell-muted md:mt-14 md:text-lg [&_a]:text-shell-accent [&_h1]:text-shell-text [&_h2]:text-shell-text [&_h3]:text-shell-text [&_strong]:text-shell-text"
          data-thought-body
        >
          <Markdown>{thought.body}</Markdown>
        </div>
      </article>
    </div>
  )
}
