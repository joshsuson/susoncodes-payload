import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import config from '@/payload.config'
import { Markdown } from '@/components/Markdown'
import { findPublishedProjectBySlug } from '@/lib/projects'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

type ProjectArtifactPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectArtifactPage({ params }: ProjectArtifactPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const project = await findPublishedProjectBySlug(payload, slug)

  if (!project) notFound()

  const sections = [
    { heading: 'What it is', markdown: project.whatItIs },
    { heading: 'Thought process', markdown: project.thoughtProcess },
    { heading: 'Learnings', markdown: project.learnings },
  ].filter((section): section is { heading: string; markdown: string } => Boolean(section.markdown))

  return (
    <article className="mx-auto max-w-3xl px-6 py-16" data-project-artifact>
      <header>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={project.date}>{dateFormatter.format(new Date(project.date))}</time>
          <span aria-hidden="true">·</span>
          <span className="capitalize" data-build-status={project.buildStatus}>
            {project.buildStatus}
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{project.pitch}</p>
        {project.externalUrl ? (
          <Link
            className="mt-7 inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
            href={project.externalUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Visit Project <span aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </header>

      {sections.length > 0 ? (
        <div className="mt-14 space-y-12">
          {sections.map((section) => (
            <section className="border-t pt-8" key={section.heading}>
              <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
              <div className="mt-4 space-y-4 leading-7 text-muted-foreground">
                <Markdown>{section.markdown}</Markdown>
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </article>
  )
}
