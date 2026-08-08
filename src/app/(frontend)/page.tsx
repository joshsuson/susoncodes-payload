import type { Metadata } from 'next'

import { FauxPrompt } from '@/components/chat/FauxPrompt'
import { getShell } from '@/lib/shell'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const shell = await getShell()

  return buildPageMetadata({
    descriptionFallback: shell.greetingSubtitle,
    imageFallback: shell.profilePhoto,
    shell,
    title: shell.homeHeading || shell.displayName || 'Josh Bot',
  })
}

export default async function HomePage() {
  const shell = await getShell()

  return (
    <div
      className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 md:px-8"
      data-home-empty-state
    >
      <section
        aria-labelledby="home-greeting"
        className="flex flex-1 items-center justify-center py-14 md:py-20"
      >
        <div className="w-full text-center">
          <h1
            className="text-3xl font-medium tracking-tight text-shell-text md:text-4xl"
            data-home-greeting
            id="home-greeting"
          >
            {shell.homeHeading}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-shell-faint md:text-base">
            {shell.greetingSubtitle}
          </p>
          <FauxPrompt
            aboutQuestion={shell.homeAboutQuestion}
            buildingQuestion={shell.homeBuildingQuestion}
            displayName={shell.displayName}
            writtenQuestion={shell.homeWrittenQuestion}
          />
          <p className="mt-5 text-xs text-shell-faint">
            Choose a suggested question to explore — this is not a live chat.
          </p>
        </div>
      </section>
    </div>
  )
}
