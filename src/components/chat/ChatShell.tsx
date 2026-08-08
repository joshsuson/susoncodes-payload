'use client'

import { FileText, Hammer, Home, Search, UserRound, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

import type { Shell } from '@/payload-types'
import { cn } from '@/lib/utils'

const threadIcons = {
  about: UserRound,
  building: Hammer,
  written: FileText,
}

type ThreadName = 'about' | 'building' | 'home' | 'written'

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

function activeThread(pathname: string): ThreadName | null {
  if (pathname === '/') return 'home'
  if (pathname === '/building' || pathname.startsWith('/building/')) return 'building'
  if (pathname === '/written' || pathname.startsWith('/written/')) return 'written'
  if (pathname === '/about' || pathname.startsWith('/about/')) return 'about'
  return null
}

function matchesQuery(label: string, query: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/[‘’]/g, "'").trim()
  return normalize(label).includes(normalize(query))
}

export function ChatShell({ children, shell }: ChatShellProps) {
  const pathname = usePathname()
  const current = activeThread(pathname)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const threads = useMemo(
    () => [
      {
        href: '/building',
        label: shell.buildingSidebarLabel,
        mobileLabel: 'Building',
        name: 'building' as const,
      },
      {
        href: '/written',
        label: shell.writtenSidebarLabel,
        mobileLabel: 'Written',
        name: 'written' as const,
      },
      {
        href: '/about',
        label: shell.aboutSidebarLabel,
        mobileLabel: 'About',
        name: 'about' as const,
      },
    ],
    [shell.aboutSidebarLabel, shell.buildingSidebarLabel, shell.writtenSidebarLabel],
  )

  const visibleThreads = threads.filter((thread) => matchesQuery(thread.label, query))
  const hasMatches = visibleThreads.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-shell-canvas md:flex-row" data-chat-shell>
      <header
        className="shrink-0 border-b border-shell-border bg-shell-sidebar px-3 pb-2 pt-3 md:hidden"
        data-mobile-nav
        data-shell-nav="mobile"
      >
        <Identity shell={shell} />
        <nav
          aria-label="Primary Threads"
          className="mt-3 grid grid-cols-4 gap-1 rounded-xl border border-shell-border bg-shell-canvas/60 p-1"
        >
          <Link
            aria-current={current === 'home' ? 'page' : undefined}
            className={cn(
              'shell-mobile-link',
              current === 'home' && 'bg-shell-elevated text-shell-text',
            )}
            data-mobile-destination="home"
            data-nav="home"
            href="/"
          >
            Home
          </Link>
          {threads.map((thread) => (
            <Link
              aria-current={current === thread.name ? 'page' : undefined}
              className={cn(
                'shell-mobile-link',
                current === thread.name && 'bg-shell-elevated text-shell-text',
              )}
              data-mobile-destination={thread.name}
              data-nav={thread.name}
              href={thread.href}
              key={thread.href}
            >
              {thread.mobileLabel}
            </Link>
          ))}
        </nav>
      </header>

      <aside
        aria-label="Sidebar"
        className="hidden w-64 shrink-0 flex-col bg-shell-sidebar md:flex"
        data-shell-nav="desktop"
        data-sidebar
      >
        <div className="flex h-16 shrink-0 items-center gap-2 px-3">
          <p className="min-w-0 flex-1 truncate px-1 text-base font-semibold text-shell-text">
            {shell.displayName}
          </p>
          <button
            aria-controls="sidebar-search-panel"
            aria-expanded={searchOpen}
            aria-label={searchOpen ? 'Close recent Thread search' : 'Search recent Threads'}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-shell-muted transition-colors hover:bg-shell-elevated hover:text-shell-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
            data-sidebar-search-toggle
            onClick={() => {
              setSearchOpen((open) => {
                if (open) setQuery('')
                return !open
              })
            }}
            type="button"
          >
            {searchOpen ? (
              <X aria-hidden="true" className="size-5" strokeWidth={1.8} />
            ) : (
              <Search aria-hidden="true" className="size-5" strokeWidth={1.8} />
            )}
          </button>
        </div>

        {searchOpen ? (
          <div className="px-3 pb-2" id="sidebar-search-panel">
            <label className="sr-only" htmlFor="sidebar-search">
              Search recent Threads
            </label>
            <div className="flex items-center gap-2 rounded-lg bg-shell-elevated px-3 text-shell-muted focus-within:ring-1 focus-within:ring-shell-accent">
              <Search aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.8} />
              <input
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-shell-text outline-none placeholder:text-shell-faint"
                data-sidebar-search
                id="sidebar-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Threads"
                type="search"
                value={query}
              />
            </div>
          </div>
        ) : null}

        <nav aria-label="Primary" className="flex min-h-0 flex-1 flex-col px-2 pb-2">
          <section aria-labelledby="fixed-navigation-heading" data-sidebar-fixed-nav>
            <h2 className="sr-only" id="fixed-navigation-heading">
              Navigation
            </h2>
            <Link
              aria-current={current === 'home' ? 'page' : undefined}
              className={cn(
                'shell-sidebar-link',
                current === 'home' && 'bg-shell-elevated text-shell-text',
              )}
              data-nav="home"
              href="/"
            >
              <Home aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
              <span className="truncate">Home</span>
            </Link>
          </section>

          <section
            aria-labelledby="recent-threads-heading"
            className="mt-5 min-h-0"
            data-sidebar-recents
          >
            <h2
              className="px-3 pb-2 text-xs font-semibold text-shell-text"
              id="recent-threads-heading"
            >
              Recent Threads
            </h2>
            <div className="space-y-0.5">
              {visibleThreads.map((thread) => {
                const Icon = threadIcons[thread.name]
                const isCurrent = current === thread.name

                return (
                  <Link
                    aria-current={isCurrent ? 'page' : undefined}
                    className={cn(
                      'shell-sidebar-link',
                      isCurrent && 'bg-shell-elevated text-shell-text',
                    )}
                    data-nav={thread.name}
                    data-sidebar-thread={thread.name}
                    href={thread.href}
                    key={thread.href}
                  >
                    <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
                    <span className="truncate">{thread.label}</span>
                  </Link>
                )
              })}
              {query && !hasMatches ? (
                <p className="px-3 py-2 text-sm text-shell-faint" data-sidebar-search-empty>
                  No matching Threads
                </p>
              ) : null}
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
