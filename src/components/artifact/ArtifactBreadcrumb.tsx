import Link from 'next/link'

import './ArtifactBreadcrumb.css'

type ArtifactBreadcrumbProps = {
  href: '/building' | '/written'
  label: 'building' | 'written'
  title: string
}

export function ArtifactBreadcrumb({ href, label, title }: ArtifactBreadcrumbProps) {
  return (
    <div className="artifact-breadcrumb relative">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex h-full w-full max-w-5xl items-center gap-2 px-4 text-[13px] md:px-8"
        data-artifact-breadcrumb={label}
      >
        <Link
          className="shell-paint -ml-1 inline-flex items-center px-1 text-shell-muted hover:text-shell-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
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
