import { defineField, defineType } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Leadership Team',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'designation', title: 'Role', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'link', title: 'Profile link', type: 'url', validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }) }),
    defineField({ name: 'imageScale', title: 'Image scale', type: 'number', initialValue: 1 }),
    defineField({ name: 'imageOffsetY', title: 'Image offset Y', type: 'number' }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'designation', media: 'image' },
  },
})
