import Link from 'next/link'

import type { ProjectCardData } from '@/lib/projects'

type ProjectCardProps = {
  project: ProjectCardData
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className="border border-shell-border bg-shell-canvas/40 p-3 transition hover:border-shell-accent/40 hover:bg-shell-elevated/40"
      data-project-card={project.slug}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="text-[13px] font-medium text-shell-text">
            <Link
              className="hover:text-shell-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
              href={`/building/${project.slug}`}
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-[12px] leading-5 text-shell-muted">{project.pitch}</p>
        </div>
        <span className="shell-chip shrink-0" data-build-status={project.buildStatus}>
          {project.buildStatus}
        </span>
      </div>
      {project.externalUrl ? (
        <p className="mt-2.5">
          <Link
            className="text-[11px] text-shell-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
            data-external-link
            href={project.externalUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            visit project ↗
          </Link>
        </p>
      ) : null}
    </article>
  )
}
