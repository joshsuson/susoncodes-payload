import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'

import { ChatShell } from '@/components/chat/ChatShell'
import { getShell } from '@/lib/shell'
import { buildPageMetadata } from '@/lib/seo'

import './globals.css'

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '600', '700'],
})

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
    <html className={mono.variable} lang="en">
      <body className={mono.className}>
        <ChatShell shell={shell}>{children}</ChatShell>
      </body>
    </html>
  )
}
