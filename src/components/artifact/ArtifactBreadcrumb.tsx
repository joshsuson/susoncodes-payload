import Link from 'next/link'

type ArtifactBreadcrumbProps = {
  archive: 'projects' | 'thoughts'
  href: '/projects' | '/thoughts'
  label: 'Projects' | 'Thoughts'
  title: string
}

export function ArtifactBreadcrumb({ archive, href, label, title }: ArtifactBreadcrumbProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-shell-border bg-shell-canvas/90 backdrop-blur-md">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex min-h-14 w-full max-w-5xl items-center gap-2 px-4 text-sm md:px-8"
        data-artifact-breadcrumb={archive}
      >
        <Link
          className="-ml-2 inline-flex min-h-11 items-center rounded-lg px-2 text-shell-muted transition-colors hover:text-shell-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
          href={href}
        >
          {label}
        </Link>
        <span aria-hidden="true" className="text-shell-faint">
          /
        </span>
        <span aria-current="page" className="min-w-0 truncate text-shell-text">
          {title}
        </span>
      </nav>
    </div>
  )
}
