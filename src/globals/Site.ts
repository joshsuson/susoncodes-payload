import type { GlobalConfig } from 'payload'

export const Site: GlobalConfig = {
  slug: 'site',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'serviceName',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
      required: true,
    },
  ],
}
