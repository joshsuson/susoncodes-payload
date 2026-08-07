import type { GlobalConfig } from 'payload'

export const Shell: GlobalConfig = {
  slug: 'shell',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'greetingSubtitle',
      type: 'textarea',
      required: true,
    },
    {
      name: 'profilePhoto',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'homeHeading',
      type: 'text',
      required: true,
    },
    {
      name: 'homeBuildingQuestion',
      type: 'text',
      required: true,
    },
    {
      name: 'homeWrittenQuestion',
      type: 'text',
      required: true,
    },
    {
      name: 'homeAboutQuestion',
      type: 'text',
      required: true,
    },
    {
      name: 'buildingSidebarLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'buildingUserMessage',
      type: 'textarea',
      required: true,
    },
    {
      name: 'buildingAssistantMessage',
      type: 'textarea',
      required: true,
    },
    {
      name: 'writtenSidebarLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'writtenUserMessage',
      type: 'textarea',
      required: true,
    },
    {
      name: 'writtenAssistantMessage',
      type: 'textarea',
      required: true,
    },
    {
      name: 'aboutSidebarLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'aboutUserMessage',
      type: 'textarea',
      required: true,
    },
    {
      name: 'aboutAssistantMessage',
      type: 'textarea',
      admin: {
        description: 'Markdown',
        rows: 12,
      },
      required: true,
    },
  ],
}
