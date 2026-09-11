import Link from 'next/link'

type ArtifactBreadcrumbProps = {
  archive: 'projects' | 'thoughts'
  href: '/projects' | '/thoughts'
  label: 'Projects' | 'Thoughts'
  title: string
}

export function ArtifactBreadcrumb({ archive, href, label, title }: ArtifactBreadcrumbProps) {
  return (
    // h-12 matches ChatShell sidebar topbar so the shared border line meets cleanly.
    <div className="sticky top-0 z-10 h-12 border-b border-shell-border bg-shell-canvas/95 backdrop-blur-sm">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex h-full w-full max-w-5xl items-center gap-2 px-4 text-[13px] md:px-8"
        data-artifact-breadcrumb={archive}
      >
        <Link
          className="-ml-1 inline-flex items-center px-1 text-shell-muted transition-colors hover:text-shell-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
          href={href}
        >
          {label.toLowerCase()}
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
