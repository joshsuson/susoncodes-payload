'use client'

import { Home, Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

import type { Shell } from '@/payload-types'
import { cn } from '@/lib/utils'

type ThreadName = 'about' | 'building' | 'home' | 'written'

type ChatShellProps = {
  children: React.ReactNode
  shell: Shell
}

function Identity({ shell }: { shell: Shell }) {
  const profilePhoto = typeof shell.profilePhoto === 'object' ? shell.profilePhoto : null

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {profilePhoto?.url ? (
        <Image
          alt={profilePhoto.alt}
          className="size-8 shrink-0 border border-shell-border object-cover"
          height={32}
          src={profilePhoto.url}
          width={32}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center border border-shell-accent/40 bg-shell-accent/10 text-[10px] font-medium tracking-wide text-shell-accent"
        >
          JB
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-shell-text">{shell.displayName}</p>
        <p className="truncate text-[11px] text-shell-faint">personal dumping ground</p>
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

  // Sidebar titles = first user question in each Thread (ChatGPT-style recents).
  const threads = useMemo(
    () => [
      {
        href: '/building',
        label: shell.buildingUserMessage,
        mobileLabel: 'Building',
        name: 'building' as const,
      },
      {
        href: '/written',
        label: shell.writtenUserMessage,
        mobileLabel: 'Written',
        name: 'written' as const,
      },
      {
        href: '/about',
        label: shell.aboutUserMessage,
        mobileLabel: 'About',
        name: 'about' as const,
      },
    ],
    [shell.aboutUserMessage, shell.buildingUserMessage, shell.writtenUserMessage],
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
          className="mt-3 grid grid-cols-4 gap-px border border-shell-border bg-shell-border"
        >
          <Link
            aria-current={current === 'home' ? 'page' : undefined}
            className={cn(
              'shell-mobile-link bg-shell-sidebar',
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
                'shell-mobile-link bg-shell-sidebar',
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
        className="hidden w-64 shrink-0 flex-col border-r border-shell-border bg-shell-sidebar md:flex"
        data-shell-nav="desktop"
        data-sidebar
      >
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-shell-border px-3">
          <p className="min-w-0 flex-1 truncate px-1 text-[13px] font-medium text-shell-text">
            {shell.displayName}
          </p>
          <button
            aria-controls="sidebar-search-panel"
            aria-expanded={searchOpen}
            aria-label={searchOpen ? 'Close recent Thread search' : 'Search recent Threads'}
            className="flex size-8 shrink-0 items-center justify-center text-shell-muted transition-colors hover:bg-shell-elevated hover:text-shell-text focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-shell-accent"
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
            <div className="flex items-center gap-2 border border-shell-border bg-shell-canvas px-2.5 text-shell-muted focus-within:border-shell-accent">
              <Search aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.8} />
              <input
                className="min-w-0 flex-1 bg-transparent py-1.5 text-[13px] text-shell-text outline-none placeholder:text-shell-faint"
                data-sidebar-search
                id="sidebar-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="search threads"
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
                current === 'home' && 'border-shell-border bg-shell-elevated text-shell-text',
              )}
              data-nav="home"
              href="/"
            >
              <Home aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.8} />
              <span className="truncate">home</span>
            </Link>
          </section>

          <section
            aria-labelledby="recent-threads-heading"
            className="mt-4 min-h-0"
            data-sidebar-recents
          >
            <h2 className="shell-label px-2.5 pb-2" id="recent-threads-heading">
              recent threads
            </h2>
            <div className="space-y-0.5">
              {visibleThreads.map((thread) => {
                const isCurrent = current === thread.name

                return (
                  <Link
                    aria-current={isCurrent ? 'page' : undefined}
                    className={cn(
                      'shell-sidebar-link',
                      isCurrent && 'border-shell-border bg-shell-elevated text-shell-text',
                    )}
                    data-nav={thread.name}
                    data-sidebar-thread={thread.name}
                    href={thread.href}
                    key={thread.href}
                    title={thread.label}
                  >
                    <span className="line-clamp-2 text-left leading-snug">{thread.label}</span>
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
        <div className="mt-auto border-t border-shell-border px-3 py-3">
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
