import { defineField, defineType } from 'sanity'

export const logo = defineType({
  name: 'logo',
  title: 'Logo',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Client', value: 'client' },
          { title: 'Partner', value: 'partner' },
        ],
      },
      validation: (Rule) => Rule.required(),
      hidden: true,
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'image', title: 'Logo', type: 'image', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'level',
      title: 'Partnership level',
      type: 'string',
      hidden: ({ document }) => document?.kind === 'client',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      hidden: ({ document }) => document?.kind === 'client',
    }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'kind', media: 'image' },
  },
})
