import { defineField, defineType } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'industry',
      title: 'Sector',
      type: 'string',
      options: {
        list: [
          'Telecom',
          'BFSI',
          'Automobile & Manufacturing',
          'Retail',
          'Healthcare & Hospitality',
          'Governance',
          'IT & ITES',
        ],
      },
      hidden: true,
    }),
    defineField({ name: 'challenge', title: 'Challenge', type: 'text', rows: 4 }),
    defineField({ name: 'solution', title: 'Outcome / solution', type: 'text', rows: 4 }),
    defineField({ name: 'duration', title: 'Delivery note', type: 'string' }),
    defineField({ name: 'resultEfficiency', title: 'Result - efficiency', type: 'string' }),
    defineField({ name: 'resultCost', title: 'Result - cost', type: 'string' }),
    defineField({ name: 'resultUptime', title: 'Result - outcome', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'industry', media: 'image' },
  },
})
