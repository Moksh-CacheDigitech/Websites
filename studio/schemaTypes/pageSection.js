import { defineField, defineType } from 'sanity'

/**
 * Home / About section copy used by useContent(pageId, sectionId).
 */
export const pageSection = defineType({
  name: 'pageSection',
  title: 'Page Section',
  type: 'document',
  fields: [
    defineField({
      name: 'pageId',
      title: 'Page',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'About', value: 'about' },
        ],
      },
      hidden: ({ document }) => Boolean(document?.pageId),
    }),
    defineField({
      name: 'sectionId',
      title: 'Section',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Hero', value: 'hero' },
          { title: 'CTA', value: 'cta' },
          { title: 'Chatbot', value: 'chatbot' },
          { title: 'Concept of Cache', value: 'conceptOfCache' },
          { title: 'Profile of Cache', value: 'profileOfCache' },
          { title: 'Mission & Vision', value: 'missionVision' },
        ],
      },
    }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
    defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'Button link', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { pageId: 'pageId', sectionId: 'sectionId', title: 'title' },
    prepare({ pageId, sectionId, title }) {
      return {
        title: title || sectionId || 'Section',
        subtitle: pageId,
      }
    },
  },
})
