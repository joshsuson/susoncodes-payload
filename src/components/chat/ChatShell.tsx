import { FileText, Hammer, Home, UserRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { Shell } from '@/payload-types'

const threadIcons = {
  about: UserRound,
  building: Hammer,
  written: FileText,
}

type ChatShellProps = {
  children: React.ReactNode
  shell: Shell
}

function Identity({ shell }: { shell: Shell }) {
  const profilePhoto = typeof shell.profilePhoto === 'object' ? shell.profilePhoto : null

  return (
    <div className="flex min-w-0 items-center gap-3">
      {profilePhoto?.url ? (
        <Image
          alt={profilePhoto.alt}
          className="size-9 shrink-0 rounded-full object-cover"
          height={36}
          src={profilePhoto.url}
          width={36}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-shell-accent/15 text-xs font-semibold text-shell-accent"
        >
          JB
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-shell-text">{shell.displayName}</p>
        <p className="truncate text-xs text-shell-faint">Personal dumping ground</p>
      </div>
    </div>
  )
}

export function ChatShell({ children, shell }: ChatShellProps) {
  const threads = [
    { href: '/building', label: shell.buildingSidebarLabel, name: 'building' as const },
    { href: '/written', label: shell.writtenSidebarLabel, name: 'written' as const },
    { href: '/about', label: shell.aboutSidebarLabel, name: 'about' as const },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-shell-canvas md:flex-row" data-chat-shell>
      <header
        className="shrink-0 border-b border-shell-border bg-shell-sidebar px-3 pb-2 pt-3 md:hidden"
        data-mobile-nav
      >
        <Identity shell={shell} />
        <nav
          aria-label="Primary Threads"
          className="mt-3 grid grid-cols-4 gap-1 rounded-xl border border-shell-border bg-shell-canvas/60 p-1"
        >
          <Link className="shell-mobile-link" href="/">
            Home
          </Link>
          <Link className="shell-mobile-link" href="/building">
            Building
          </Link>
          <Link className="shell-mobile-link" href="/written">
            Written
          </Link>
          <Link className="shell-mobile-link" href="/about">
            About
          </Link>
        </nav>
      </header>

      <aside
        aria-label="Sidebar"
        className="hidden w-64 shrink-0 flex-col bg-shell-sidebar md:flex"
        data-sidebar
      >
        <div className="flex h-16 shrink-0 items-center px-4">
          <p className="truncate text-base font-semibold text-shell-text">{shell.displayName}</p>
        </div>
        <nav aria-label="Primary" className="flex min-h-0 flex-1 flex-col px-2 pb-2">
          <Link className="shell-sidebar-link" href="/">
            <Home aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
            <span className="truncate">Home</span>
          </Link>

          <section aria-labelledby="recent-threads-heading" className="mt-5 min-h-0">
            <h2
              className="px-3 pb-2 text-xs font-semibold text-shell-text"
              id="recent-threads-heading"
            >
              Recent Threads
            </h2>
            <div className="space-y-0.5">
              {threads.map((thread) => {
                const Icon = threadIcons[thread.name]

                return (
                  <Link
                    className="shell-sidebar-link"
                    data-sidebar-thread={thread.name}
                    href={thread.href}
                    key={thread.href}
                  >
                    <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
                    <span className="truncate">{thread.label}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        </nav>
        <div className="m-2 mt-auto rounded-xl px-2 py-2">
          <Identity shell={shell} />
        </div>
      </aside>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto outline-none" data-message-column tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
