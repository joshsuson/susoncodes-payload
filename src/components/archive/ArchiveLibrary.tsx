import Image from 'next/image'
import Link from 'next/link'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})

type ArchiveItem = {
  date: string
  href: string
  imageAlt?: string | null
  imageUrl?: string | null
  slug: string
  status: string
  title: string
}

type ArchiveLibraryProps = {
  emptyLabel: string
  items: ArchiveItem[]
  title: string
  type: 'projects' | 'thoughts'
}

function titleCase(value: string) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function ArchiveLibrary({ emptyLabel, items, title, type }: ArchiveLibraryProps) {
  return (
    <div
      className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-16"
      data-content-library={type}
    >
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-shell-faint uppercase">
            Secondary view
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-shell-text md:text-4xl">
            {title}
          </h1>
        </div>

        <div
          aria-hidden="true"
          className="flex w-full flex-col gap-3 select-none sm:flex-row lg:w-auto"
          data-archive-controls="visual-only"
        >
          <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-shell-border bg-shell-elevated px-4 text-shell-faint sm:w-72">
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16.25 16.25 4 4" strokeLinecap="round" />
            </svg>
            <span className="truncate text-sm">Search</span>
          </div>

          <span className="flex min-h-12 items-center justify-center rounded-full bg-shell-text px-5 text-sm font-medium text-shell-canvas opacity-90">
            New
            <span className="ml-1">⌄</span>
          </span>
        </div>
      </header>

      <div
        aria-hidden="true"
        className="mt-14 flex flex-col gap-5 border-b border-shell-border pb-5 select-none sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-shell-elevated px-4 py-2 text-sm font-medium text-shell-text">
            All
          </span>
          {type === 'projects' ? (
            <>
              <span className="rounded-full px-4 py-2 text-sm text-shell-muted">Active</span>
              <span className="rounded-full px-4 py-2 text-sm text-shell-muted">Shipped</span>
              <span className="rounded-full px-4 py-2 text-sm text-shell-muted">Parked</span>
            </>
          ) : (
            <>
              <span className="rounded-full px-4 py-2 text-sm text-shell-muted">Recent</span>
              <span className="rounded-full px-4 py-2 text-sm text-shell-muted">Archive</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg text-shell-faint">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="mx-2 h-6 w-px bg-shell-border" />
          <span className="flex h-9 w-9 items-center justify-center rounded-lg text-shell-faint">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect height="6" rx="1" width="6" x="4" y="4" />
              <rect height="6" rx="1" width="6" x="14" y="4" />
              <rect height="6" rx="1" width="6" x="4" y="14" />
              <rect height="6" rx="1" width="6" x="14" y="14" />
            </svg>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-shell-elevated text-shell-text">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 6h11M9 12h11M9 18h11" strokeLinecap="round" />
              <circle cx="5" cy="6" fill="currentColor" r="1" stroke="none" />
              <circle cx="5" cy="12" fill="currentColor" r="1" stroke="none" />
              <circle cx="5" cy="18" fill="currentColor" r="1" stroke="none" />
            </svg>
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="hidden grid-cols-[minmax(0,1fr)_10rem_8rem_2rem] gap-4 px-4 pb-3 text-sm text-shell-faint md:grid">
          <span>Name</span>
          <span>Modified</span>
          <span>Status</span>
          <span className="sr-only">Actions</span>
        </div>

        {items.length > 0 ? (
          <div className="divide-y divide-shell-border" data-archive-rows>
            {items.map((item) => {
              const formattedDate = dateFormatter.format(new Date(item.date))
              const statusLabel = titleCase(item.status)

              return (
                <article
                  className="relative grid min-h-20 grid-cols-[minmax(0,1fr)_2rem] items-center gap-4 px-3 py-3 transition-colors hover:bg-shell-elevated/40 md:grid-cols-[minmax(0,1fr)_10rem_8rem_2rem] md:px-4"
                  data-archive-row={item.slug}
                  key={item.slug}
                >
                  <Link
                    className="group flex min-w-0 items-center gap-3 rounded-lg after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
                    href={item.href}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-shell-border bg-shell-elevated text-xs font-semibold text-shell-accent"
                    >
                      {item.imageUrl ? (
                        <Image
                          alt={item.imageAlt || ''}
                          className="h-full w-full object-cover"
                          height={44}
                          src={item.imageUrl}
                          width={44}
                        />
                      ) : type === 'projects' ? (
                        'P'
                      ) : (
                        'T'
                      )}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-medium text-shell-text transition-colors group-hover:text-shell-accent md:text-base">
                        {item.title}
                      </h2>
                      <p className="mt-1 truncate text-xs text-shell-faint md:hidden">
                        {formattedDate} · {statusLabel}
                      </p>
                    </div>
                  </Link>

                  <time
                    className="hidden text-sm text-shell-muted md:block"
                    dateTime={item.date.slice(0, 10)}
                  >
                    {formattedDate}
                  </time>
                  <span className="hidden text-sm text-shell-muted md:block">{statusLabel}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-shell-faint"
                  >
                    →
                  </span>
                </article>
              )
            })}
          </div>
        ) : (
          <div
            className="rounded-2xl border border-dashed border-shell-border px-6 py-16 text-center"
            data-archive-empty
          >
            <p className="text-sm text-shell-muted">{emptyLabel}</p>
          </div>
        )}
      </div>

      <p className="mt-10 text-center text-xs text-shell-faint">
        {items.length} {title.toLowerCase()} in this secondary view.
      </p>
    </div>
  )
}
