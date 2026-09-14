import { defineField, defineType } from 'sanity'

export const innovationProject = defineType({
  name: 'innovationProject',
  title: 'Innovation Project',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 6 }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'tagline', media: 'image' },
  },
})
