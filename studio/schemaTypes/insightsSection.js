import { defineField, defineType } from 'sanity'

export const insightsSection = defineType({
  name: 'insightsSection',
  title: 'Insights Section',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small red label above the heading',
      initialValue: 'Insights',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main section title',
      initialValue: 'Latest Highlights',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Insights Section' }
    },
  },
})
