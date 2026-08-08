import type { Metadata } from 'next'

import type { Media, Shell } from '@/payload-types'

const SITE_NAME = 'Josh Bot'

type SeoMedia = number | Media | null | undefined

type BuildMetadataInput = {
  descriptionFallback?: string | null
  imageFallback?: SeoMedia
  metaDescription?: string | null
  metaImage?: SeoMedia
  metaTitle?: string | null
  shell: Shell
  title?: string | null
}

function mediaUrl(value: SeoMedia): string | undefined {
  if (!value || typeof value === 'number') return undefined
  return value.url ?? undefined
}

function absoluteUrl(pathOrUrl: string | undefined): string | undefined {
  if (!pathOrUrl) return undefined
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl

  const base = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL
  if (!base) return pathOrUrl

  return new URL(pathOrUrl, base).toString()
}

export function buildPageMetadata({
  descriptionFallback,
  imageFallback,
  metaDescription,
  metaImage,
  metaTitle,
  shell,
  title,
}: BuildMetadataInput): Metadata {
  const resolvedTitle = metaTitle?.trim() || title?.trim() || SITE_NAME
  const resolvedDescription =
    metaDescription?.trim() ||
    descriptionFallback?.trim() ||
    shell.greetingSubtitle?.trim() ||
    undefined

  const profilePhoto = typeof shell.profilePhoto === 'object' ? shell.profilePhoto : null
  const resolvedImage =
    mediaUrl(metaImage) || mediaUrl(imageFallback) || profilePhoto?.url || undefined
  const openGraphImage = absoluteUrl(resolvedImage)

  return {
    alternates: undefined,
    description: resolvedDescription,
    openGraph: {
      description: resolvedDescription,
      images: openGraphImage ? [{ url: openGraphImage }] : undefined,
      title: resolvedTitle,
      type: 'website',
    },
    title: resolvedTitle,
    twitter: {
      card: openGraphImage ? 'summary_large_image' : 'summary',
      description: resolvedDescription,
      images: openGraphImage ? [openGraphImage] : undefined,
      title: resolvedTitle,
    },
  }
}
