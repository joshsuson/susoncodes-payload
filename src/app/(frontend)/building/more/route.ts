import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

import config from '@/payload.config'
import {
  findPublishedProjectBundle,
  PROJECT_LIST_PAGE_SIZE,
  toProjectCardData,
} from '@/lib/projects'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = Number(searchParams.get('offset') ?? '0')
    const payload = await getPayload({ config })
    const bundle = await findPublishedProjectBundle(payload, {
      limit: PROJECT_LIST_PAGE_SIZE,
      offset: Number.isFinite(offset) ? offset : 0,
    })

    return NextResponse.json({
      hasMore: bundle.hasMore,
      nextOffset: bundle.nextOffset,
      projects: bundle.docs.map(toProjectCardData),
      rangeEnd: bundle.rangeEnd,
      rangeStart: bundle.rangeStart,
      total: bundle.total,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to load more Projects.' }, { status: 500 })
  }
}
