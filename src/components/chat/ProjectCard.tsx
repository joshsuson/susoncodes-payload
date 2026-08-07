import Link from 'next/link'

import type { ProjectCardData } from '@/lib/projects'

type ProjectCardProps = {
  project: ProjectCardData
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className="rounded-2xl border border-shell-border bg-shell-elevated/50 p-4 transition hover:border-shell-accent/30"
      data-project-card={project.slug}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-shell-text">
            <Link
              className="hover:text-shell-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
              href={`/building/${project.slug}`}
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-sm text-shell-muted">{project.pitch}</p>
        </div>
        <span
          className="shrink-0 rounded-full border border-shell-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-shell-faint"
          data-build-status={project.buildStatus}
        >
          {project.buildStatus}
        </span>
      </div>
      {project.externalUrl ? (
        <p className="mt-3">
          <a
            className="text-xs font-medium text-shell-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
            data-external-link
            href={project.externalUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open live artifact
          </a>
        </p>
      ) : null}
    </article>
  )
}
