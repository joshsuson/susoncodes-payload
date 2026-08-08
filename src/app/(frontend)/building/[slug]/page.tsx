import type { Metadata } from 'next'
import { getPayload } from 'payload'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArtifactBreadcrumb } from '@/components/artifact/ArtifactBreadcrumb'
import { Markdown } from '@/components/Markdown'
import { findPublishedProjectBySlug } from '@/lib/projects'
import { getShell } from '@/lib/shell'
import { buildPageMetadata } from '@/lib/seo'
import type { Media } from '@/payload-types'
import config from '@/payload.config'

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

export async function generateMetadata({ params }: ProjectArtifactPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const [shell, project] = await Promise.all([
    getShell(),
    findPublishedProjectBySlug(payload, slug),
  ])

  if (!project) {
    return buildPageMetadata({
      shell,
      title: 'Project not found',
    })
  }

  return buildPageMetadata({
    descriptionFallback: project.pitch,
    imageFallback: project.image,
    metaDescription: project.metaDescription,
    metaImage: project.metaImage,
    metaTitle: project.metaTitle,
    shell,
    title: project.title,
  })
}

export default async function ProjectArtifactPage({ params }: ProjectArtifactPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const project = await findPublishedProjectBySlug(payload, slug)

  if (!project) notFound()

  const image =
    typeof project.image === 'object' && project.image !== null ? (project.image as Media) : null

  const sections = [
    { heading: 'What it is', key: 'what', markdown: project.whatItIs },
    { heading: 'Thought process', key: 'thought-process', markdown: project.thoughtProcess },
    { heading: 'Learnings', key: 'learnings', markdown: project.learnings },
  ].filter((section): section is { heading: string; key: string; markdown: string } =>
    Boolean(section.markdown),
  )

  return (
    <div className="min-h-full" data-project-artifact data-project-detail data-project-slug={slug}>
      <ArtifactBreadcrumb
        archive="projects"
        href="/projects"
        label="Projects"
        title={project.title}
      />

      <article className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8 md:py-16">
        <header className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-wide text-shell-faint">
            <span className="uppercase">Project</span>
            <span aria-hidden="true">·</span>
            <time dateTime={project.date.slice(0, 10)}>
              {dateFormatter.format(new Date(project.date))}
            </time>
            <span
              className="rounded-full border border-shell-border px-2.5 py-1 uppercase"
              data-build-status={project.buildStatus}
            >
              {project.buildStatus}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-shell-text md:text-6xl">
            {project.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-shell-muted md:text-xl">
            {project.pitch}
          </p>

          {project.externalUrl ? (
            <p className="mt-7">
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-shell-text px-4 py-2 text-sm font-medium text-shell-canvas transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
                data-external-link
                href={project.externalUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit Project
                <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </Link>
            </p>
          ) : null}
        </header>

        {image?.url ? (
          <figure className="mt-10 overflow-hidden rounded-2xl border border-shell-border bg-shell-panel md:mt-14">
            <Image
              alt={image.alt || project.title}
              className="h-auto w-full object-cover"
              data-project-image
              height={image.height ?? 720}
              src={image.url}
              width={image.width ?? 1280}
            />
          </figure>
        ) : null}

        {sections.length > 0 ? (
          <div className="mx-auto mt-12 max-w-3xl space-y-12 md:mt-16">
            {sections.map((section) => (
              <section
                className="border-t border-shell-border pt-8"
                data-project-section={section.key}
                key={section.key}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-shell-text">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-shell-muted [&_a]:text-shell-accent [&_h1]:text-shell-text [&_h2]:text-shell-text [&_h3]:text-shell-text [&_strong]:text-shell-text">
                  <Markdown>{section.markdown}</Markdown>
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </article>
    </div>
  )
}
