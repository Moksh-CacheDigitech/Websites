import { defineField, defineType } from 'sanity'

export const highlight = defineType({
  name: 'highlight',
  title: 'Highlight',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      description: 'Shown above the title, e.g. Award, Event',
      options: {
        list: [
          { title: 'Award', value: 'Award' },
          { title: 'Award & Recognition', value: 'Award & Recognition' },
          { title: 'Event', value: 'Event' },
          { title: 'Article', value: 'Article' },
          { title: 'News', value: 'News' },
          { title: 'Other', value: 'Other' },
        ],
      },
    }),
    defineField({
      name: 'type',
      title: 'Type label',
      type: 'string',
      description: 'Small label under the description, e.g. Article',
      initialValue: 'Article',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'Optional. External URL opened when the card is clicked.',
      validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: 'Sort order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      tag: 'tag',
      media: 'image',
    },
    prepare({ title, tag, media }) {
      return { title, subtitle: tag, media }
    },
  },
})
