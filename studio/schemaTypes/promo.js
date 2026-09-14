import { defineField, defineType } from 'sanity'

export const campaign = defineType({
  name: 'campaign',
  title: 'Campaign',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'embedUrl',
      title: 'Page or embed URL',
      type: 'string',
      description: 'Path such as /dell-storage-landing-page.html or a full URL',
    }),
    defineField({ name: 'active', title: 'Published on site', type: 'boolean', initialValue: true }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'title', active: 'active' },
    prepare({ title, active }) {
      return { title, subtitle: active ? 'Live' : 'Unpublished' }
    },
  },
})

export const newsletterIssue = defineType({
  name: 'newsletterIssue',
  title: 'Newsletter',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3 }),
    defineField({ name: 'publishedAt', title: 'Date', type: 'datetime' }),
    defineField({ name: 'link', title: 'Link', type: 'url', validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }) }),
    defineField({ name: 'active', title: 'Published on site', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title', active: 'active' },
    prepare({ title, active }) {
      return { title, subtitle: active ? 'Live' : 'Unpublished' }
    },
  },
})

export const offer = defineType({
  name: 'offer',
  title: 'Offer',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'highlight', title: 'Highlight label', type: 'string' }),
    defineField({ name: 'cta', title: 'Button label', type: 'string', initialValue: 'Learn more' }),
    defineField({ name: 'href', title: 'Button link', type: 'string', initialValue: '/contactus' }),
    defineField({ name: 'active', title: 'Published on site', type: 'boolean', initialValue: true }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'title', highlight: 'highlight', active: 'active' },
    prepare({ title, highlight, active }) {
      return { title, subtitle: [highlight, active ? 'Live' : 'Unpublished'].filter(Boolean).join(' - ') }
    },
  },
})
