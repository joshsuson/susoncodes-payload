import type { Metadata } from 'next'

import { ChatShell } from '@/components/chat/ChatShell'
import { getShell } from '@/lib/shell'
import { buildPageMetadata } from '@/lib/seo'

import './globals.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const shell = await getShell()

  return buildPageMetadata({
    descriptionFallback: shell.greetingSubtitle,
    imageFallback: shell.profilePhoto,
    shell,
    title: shell.displayName || 'Josh Bot',
  })
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const shell = await getShell()

  return (
    <html lang="en">
      <body>
        <ChatShell shell={shell}>{children}</ChatShell>
      </body>
    </html>
  )
}
