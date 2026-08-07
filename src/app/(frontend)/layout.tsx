import type { Metadata } from 'next'

import { ChatShell } from '@/components/chat/ChatShell'
import { getShell } from '@/lib/shell'

import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description: 'Projects and light writing from Josh Suson, routed by Josh Bot.',
  title: 'Josh Bot',
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
