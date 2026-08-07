import path from 'node:path'

import type { Payload } from 'payload'

const profilePhotoPath = path.resolve(process.cwd(), 'src/seed/assets/profile-photo.jpg')

export async function seedGlobals(payload: Payload) {
  const existingProfilePhotos = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      alt: {
        equals: 'Josh Suson',
      },
    },
  })

  const profilePhoto =
    existingProfilePhotos.docs[0] ??
    (await payload.create({
      collection: 'media',
      data: {
        alt: 'Josh Suson',
      },
      filePath: profilePhotoPath,
      overrideAccess: true,
    }))

  const shell = await payload.updateGlobal({
    slug: 'shell',
    data: {
      displayName: 'Josh Bot',
      greetingSubtitle:
        "I'm not Josh. I'm a bot wearing his jacket and raiding his project folders. Pick a thread — or ask who this guy even is.",
      profilePhoto: profilePhoto.id,
      homeHeading: 'Where should we begin?',
      homeBuildingQuestion: 'What are you building these days?',
      homeWrittenQuestion: 'What have you written?',
      homeAboutQuestion: 'Who is Josh?',
      buildingSidebarLabel: 'What I’m building',
      buildingUserMessage: 'What are you building these days?',
      buildingAssistantMessage:
        'Josh keeps a pile of builds in various states of glory. Here’s what’s latest.',
      writtenSidebarLabel: 'What I’ve written',
      writtenUserMessage: 'What have you written?',
      writtenAssistantMessage:
        'Josh dumps light writing here when the itch hits. Here’s what’s latest.',
      aboutSidebarLabel: 'Who is Josh?',
      aboutUserMessage: 'Who is Josh, actually?',
      aboutAssistantMessage:
        "Josh Suson is a programmer in Concord, North Carolina — husband, dad of five, Christian trying to treat code like a craft instead of a content treadmill.\n\nHe builds software meant to serve people, last a while, and maybe outlive the hype cycle. This site is his dumping ground for projects and light writing, not a hiring funnel with a fake chatbot bolted on.\n\n(Yes, I know I'm a bot. The fourth wall was load-bearing and we knocked it down on purpose.)",
    },
    overrideAccess: true,
  })

  const site = await payload.updateGlobal({
    slug: 'site',
    data: {
      socialLinks: [
        {
          serviceName: 'X',
          url: 'https://x.com/joshsuson',
          text: 'Follow on X',
        },
        {
          serviceName: 'Github',
          url: 'https://github.com/joshsuson',
          text: 'Follow on Github',
        },
        {
          serviceName: 'Linkedin',
          url: 'https://www.linkedin.com/in/joshsuson',
          text: 'Follow on Linkedin',
        },
      ],
    },
    overrideAccess: true,
  })

  return { shell, site }
}
