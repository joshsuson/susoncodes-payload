import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import config from '@/payload.config'
import { Markdown } from '@/components/Markdown'
import { findPublishedThoughtBySlug } from '@/lib/thoughts'

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
    <article className="mx-auto max-w-3xl px-6 py-16" data-thought-artifact>
      <header>
        <time className="text-sm text-muted-foreground" dateTime={thought.date}>
          {dateFormatter.format(new Date(thought.date))}
        </time>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">{thought.title}</h1>
        {thought.summary ? (
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{thought.summary}</p>
        ) : null}
      </header>

      <div className="mt-14 space-y-4 border-t pt-8 leading-7 text-muted-foreground">
        <Markdown>{thought.body}</Markdown>
      </div>
    </article>
  )
}
