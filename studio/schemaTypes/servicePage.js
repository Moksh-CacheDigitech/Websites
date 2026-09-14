import { defineField, defineType } from 'sanity'

export const servicePage = defineType({
  name: 'servicePage',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'menu',
      title: 'Menu',
      type: 'string',
      options: { list: ['What We Do', 'Services', 'Industries'] },
      validation: (Rule) => Rule.required(),
      hidden: true,
    }),
    defineField({
      name: 'section',
      title: 'Section',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'shortTitle', title: 'Short title', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'text', rows: 2 }),
    defineField({ name: 'badgeLabel', title: 'Badge', type: 'string' }),
    defineField({ name: 'overviewLabel', title: 'Overview link label', type: 'string' }),
    defineField({ name: 'overviewRoute', title: 'Overview link', type: 'string' }),
    defineField({ name: 'ctaLabel', title: 'Primary button', type: 'string', initialValue: 'Talk to us' }),
    defineField({ name: 'ctaHref', title: 'Primary button link', type: 'string', initialValue: '/contactus' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 5 }),
    defineField({
      name: 'introParagraphs',
      title: 'More paragraphs',
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'offerings',
      title: 'Offerings',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'offering',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),
    defineField({
      name: 'listSections',
      title: 'Content sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'listSection',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
            defineField({ name: 'items', title: 'Items', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'footnote', title: 'Footnote', type: 'text', rows: 2 }),
          ],
        },
      ],
    }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bodyImage', title: 'Body image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'section', media: 'heroImage' },
  },
})
