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
      className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12"
      data-content-library={type}
    >
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="shell-label">secondary view</p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-shell-text md:text-3xl">
            {title.toLowerCase()}
          </h1>
        </div>

        <div
          aria-hidden="true"
          className="flex w-full flex-col gap-2 select-none sm:flex-row lg:w-auto"
          data-archive-controls="visual-only"
        >
          <div className="flex min-h-10 min-w-0 flex-1 items-center gap-2 border border-shell-border bg-shell-elevated px-3 text-shell-faint sm:w-72">
            <span className="text-shell-accent" aria-hidden="true">
              /
            </span>
            <span className="truncate text-[13px]">search</span>
          </div>

          <span className="flex min-h-10 items-center justify-center border border-shell-text bg-shell-text px-4 text-[12px] font-medium tracking-wide text-shell-canvas uppercase opacity-90">
            new ▾
          </span>
        </div>
      </header>

      <div
        aria-hidden="true"
        className="mt-10 flex flex-col gap-3 border-b border-shell-border pb-3 select-none sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-wrap gap-1">
          <span className="border border-shell-border bg-shell-elevated px-2.5 py-1 text-[11px] tracking-wide text-shell-text uppercase">
            all
          </span>
          {type === 'projects' ? (
            <>
              <span className="px-2.5 py-1 text-[11px] tracking-wide text-shell-muted uppercase">
                active
              </span>
              <span className="px-2.5 py-1 text-[11px] tracking-wide text-shell-muted uppercase">
                shipped
              </span>
              <span className="px-2.5 py-1 text-[11px] tracking-wide text-shell-muted uppercase">
                parked
              </span>
            </>
          ) : (
            <>
              <span className="px-2.5 py-1 text-[11px] tracking-wide text-shell-muted uppercase">
                recent
              </span>
              <span className="px-2.5 py-1 text-[11px] tracking-wide text-shell-muted uppercase">
                archive
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mt-2">
        <div className="hidden grid-cols-[minmax(0,1fr)_10rem_8rem_2rem] gap-4 border-b border-shell-border px-3 py-2 text-[11px] tracking-wide text-shell-faint uppercase md:grid">
          <span>name</span>
          <span>modified</span>
          <span>status</span>
          <span className="sr-only">Actions</span>
        </div>

        {items.length > 0 ? (
          <div className="divide-y divide-shell-border" data-archive-rows>
            {items.map((item) => {
              const formattedDate = dateFormatter.format(new Date(item.date))
              const statusLabel = titleCase(item.status)

              return (
                <article
                  className="relative grid min-h-14 grid-cols-[minmax(0,1fr)_2rem] items-center gap-4 px-2 py-2 transition-colors hover:bg-shell-elevated/50 md:grid-cols-[minmax(0,1fr)_10rem_8rem_2rem] md:px-3"
                  data-archive-row={item.slug}
                  key={item.slug}
                >
                  <Link
                    className="group flex min-w-0 items-center gap-3 after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-shell-accent"
                    href={item.href}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-shell-border bg-shell-elevated text-[11px] font-medium text-shell-accent"
                    >
                      {item.imageUrl ? (
                        <Image
                          alt={item.imageAlt || ''}
                          className="h-full w-full object-cover"
                          height={36}
                          src={item.imageUrl}
                          width={36}
                        />
                      ) : type === 'projects' ? (
                        'P'
                      ) : (
                        'T'
                      )}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-[13px] font-medium text-shell-text transition-colors group-hover:text-shell-accent">
                        {item.title}
                      </h2>
                      <p className="mt-0.5 truncate text-[11px] text-shell-faint md:hidden">
                        {formattedDate} · {statusLabel}
                      </p>
                    </div>
                  </Link>

                  <time
                    className="hidden text-[12px] text-shell-muted md:block"
                    dateTime={item.date.slice(0, 10)}
                  >
                    {formattedDate}
                  </time>
                  <span className="hidden text-[12px] text-shell-muted md:block">
                    {statusLabel}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center text-shell-faint"
                  >
                    →
                  </span>
                </article>
              )
            })}
          </div>
        ) : (
          <div
            className="border border-dashed border-shell-border px-6 py-14 text-center"
            data-archive-empty
          >
            <p className="text-[13px] text-shell-muted">{emptyLabel}</p>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-[11px] text-shell-faint">
        {items.length} {title.toLowerCase()} in this secondary view
      </p>
    </div>
  )
}
