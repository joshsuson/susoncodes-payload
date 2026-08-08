import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

import config from '@/payload.config'
import {
  findPublishedThoughtBundle,
  THOUGHT_LIST_PAGE_SIZE,
  toThoughtCardData,
} from '@/lib/thoughts'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = Number(searchParams.get('offset') ?? '0')
    const payload = await getPayload({ config })
    const bundle = await findPublishedThoughtBundle(payload, {
      limit: THOUGHT_LIST_PAGE_SIZE,
      offset: Number.isFinite(offset) ? offset : 0,
    })

    return NextResponse.json({
      hasMore: bundle.hasMore,
      nextOffset: bundle.nextOffset,
      rangeEnd: bundle.rangeEnd,
      rangeStart: bundle.rangeStart,
      thoughts: bundle.docs.map(toThoughtCardData),
      total: bundle.total,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to load more Thoughts.' }, { status: 500 })
  }
}
