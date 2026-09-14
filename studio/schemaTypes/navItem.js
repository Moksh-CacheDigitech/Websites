import { defineField, defineType } from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  title: 'Menu link',
  type: 'document',
  fields: [
    defineField({
      name: 'menu',
      title: 'Menu',
      type: 'string',
      options: {
        list: ['What We Do', 'Services', 'Industries'],
      },
      validation: (Rule) => Rule.required(),
      hidden: true,
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Site path, for example /cybersecurity',
    }),
    defineField({
      name: 'parent',
      title: 'Parent group',
      type: 'string',
      description: 'Empty for a top-level group. Group name for a submenu link.',
      hidden: ({ document }) => document?.menu === 'Industries',
    }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'label', menu: 'menu', parent: 'parent', href: 'href' },
    prepare({ title, menu, parent, href }) {
      return { title, subtitle: parent ? `${menu} / ${parent}` : href || menu }
    },
  },
})
