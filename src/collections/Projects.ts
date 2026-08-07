import type { CollectionConfig } from 'payload'

const projectBuildStatuses = ['active', 'shipped', 'parked'] as const

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    defaultColumns: ['title', 'buildStatus', 'date', '_status'],
    useAsTitle: 'title',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: ({ req }) => {
      if (req.user) return true

      return {
        _status: {
          equals: 'published',
        },
      }
    },
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'pitch',
      type: 'textarea',
      required: true,
    },
    {
      name: 'buildStatus',
      type: 'select',
      options: projectBuildStatuses.map((value) => ({ label: value, value })),
      required: true,
    },
    {
      name: 'externalUrl',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'whatItIs',
      type: 'textarea',
      admin: {
        description: 'Markdown',
        rows: 12,
      },
    },
    {
      name: 'thoughtProcess',
      type: 'textarea',
      admin: {
        description: 'Markdown',
        rows: 12,
      },
    },
    {
      name: 'learnings',
      type: 'textarea',
      admin: {
        description: 'Markdown',
        rows: 12,
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'date',
      type: 'date',
      index: true,
      required: true,
    },
    {
      name: 'metaTitle',
      type: 'text',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
    },
    {
      name: 'metaImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  versions: {
    drafts: true,
  },
}
