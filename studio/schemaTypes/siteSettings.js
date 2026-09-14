import { CogIcon, EnvelopeIcon, LinkIcon, SearchIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact', icon: EnvelopeIcon },
    { name: 'seo', title: 'SEO', icon: SearchIcon },
    { name: 'social', title: 'Social', icon: LinkIcon },
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      group: 'brand',
      description: 'Shown in the browser tab and as the default brand name.',
      placeholder: 'Cache Digitech',
      validation: (Rule) => Rule.required().max(80),
      initialValue: 'Cache Digitech',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'brand',
      description: 'Short line used with the brand (footer / meta contexts).',
      placeholder: 'Endeavouring perfection',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'copyrightName',
      title: 'Copyright name',
      type: 'string',
      group: 'brand',
      description: 'Legal name in the footer copyright line.',
      placeholder: 'Cache Digitech Pvt. Ltd.',
      initialValue: 'Cache Digitech Pvt. Ltd.',
    }),

    defineField({
      name: 'email',
      title: 'Public email',
      type: 'string',
      group: 'contact',
      description: 'Main public inbox (footer mailto and contact links).',
      placeholder: 'info@cachedigitech.com',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'contact',
      description: 'Optional public phone number for the footer.',
      placeholder: '+91 …',
    }),

    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO description',
      type: 'text',
      rows: 4,
      group: 'seo',
      description: 'Fallback meta description when a page does not set its own.',
      placeholder: 'Cache Digitech delivers enterprise IT, cloud, cybersecurity, and digital solutions.',
      validation: (Rule) => Rule.max(320),
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'social',
      description: 'Footer social icons. Add one row per platform.',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          icon: LinkIcon,
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'LinkedIn', value: 'LinkedIn' },
                  { title: 'Twitter / X', value: 'Twitter' },
                  { title: 'YouTube', value: 'YouTube' },
                  { title: 'Facebook', value: 'Facebook' },
                  { title: 'Instagram', value: 'Instagram' },
                  { title: 'Email', value: 'Email' },
                  { title: 'Other', value: 'Other' },
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ['http', 'https', 'mailto'],
                }),
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'siteTitle', subtitle: 'tagline' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Global site configuration',
        media: CogIcon,
      }
    },
  },
})
