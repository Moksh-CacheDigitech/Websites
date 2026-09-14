import { defineField, defineType } from 'sanity'

export const contactInfo = defineType({
  name: 'contactInfo',
  title: 'Contact Info',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Contact Us',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Have a question or want to work together? We are here to help.',
    }),
    defineField({
      name: 'reachHeading',
      title: 'Reach-out heading',
      type: 'string',
      initialValue: 'Reach out',
    }),
    defineField({
      name: 'reachIntro',
      title: 'Reach-out intro',
      type: 'string',
      initialValue: 'Choose your preferred way to connect.',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'emailNote',
      title: 'Email note',
      type: 'string',
      initialValue: 'We reply within 24 hours',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'phoneNote',
      title: 'Phone note',
      type: 'string',
      initialValue: 'Mon-Fri, 9am-6pm IST',
    }),
    defineField({
      name: 'offices',
      title: 'Offices',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'office',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'line1', title: 'Address line 1', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'line2', title: 'Address line 2', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'line1' },
          },
        },
      ],
    }),
    defineField({
      name: 'formUrl',
      title: 'Contact form URL',
      type: 'url',
      description: 'Zoho Forms or other embedded form URL',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Contact Info' }
    },
  },
})
