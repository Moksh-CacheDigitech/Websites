import { defineField, defineType } from 'sanity'

export const award = defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
})
