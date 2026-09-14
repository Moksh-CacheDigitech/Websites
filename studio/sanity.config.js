import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

const WHAT_WE_DO = [
  { title: 'Cloud', section: 'cloud' },
  { title: 'Cybersecurity', section: 'cybersecurity' },
  { title: 'Data Analytics & AI', section: 'data-analytics' },
  { title: 'Infra & Networking', section: 'infrastructure' },
]

const SERVICES = [
  { title: 'Cloud', section: 'cloud' },
  { title: 'Consulting & Auditing', section: 'consulting' },
  { title: 'Managed Services', section: 'managed-services' },
  { title: 'Infrastructure & Networking', section: 'infrastructure' },
]

const INDUSTRIES = [
  'Telecom',
  'BFSI',
  'Automobile & Manufacturing',
  'Retail',
  'Healthcare & Hospitality',
  'Governance',
  'IT & ITES',
]

function idify(...parts) {
  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default defineConfig({
  name: 'cachedigitech-website',
  title: 'Cache Digitech Website',
  projectId: 'xcmiqpeo',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'pageSection-home',
        title: 'Home section',
        schemaType: 'pageSection',
        value: { pageId: 'home' },
      },
      {
        id: 'pageSection-about',
        title: 'About section',
        schemaType: 'pageSection',
        value: { pageId: 'about' },
      },
      {
        id: 'logo-partner',
        title: 'Partner logo',
        schemaType: 'logo',
        value: { kind: 'partner' },
      },
      {
        id: 'logo-client',
        title: 'Client logo',
        schemaType: 'logo',
        value: { kind: 'client' },
      },
      {
        id: idify('navItem', 'Industries', 'root'),
        title: 'Industries menu link',
        schemaType: 'navItem',
        value: { menu: 'Industries', parent: '' },
      },
      ...WHAT_WE_DO.flatMap((group) => [
        {
          id: idify('navItem', 'What We Do', group.title),
          title: `What We Do / ${group.title} link`,
          schemaType: 'navItem',
          value: { menu: 'What We Do', parent: group.title },
        },
        {
          id: idify('servicePage', 'What We Do', group.section),
          title: `What We Do / ${group.title} page`,
          schemaType: 'servicePage',
          value: { menu: 'What We Do', section: group.section },
        },
      ]),
      {
        id: idify('navItem', 'What We Do', 'root'),
        title: 'What We Do group',
        schemaType: 'navItem',
        value: { menu: 'What We Do', parent: '' },
      },
      ...SERVICES.flatMap((group) => [
        {
          id: idify('navItem', 'Services', group.title),
          title: `Services / ${group.title} link`,
          schemaType: 'navItem',
          value: { menu: 'Services', parent: group.title },
        },
        {
          id: idify('servicePage', 'Services', group.section),
          title: `Services / ${group.title} page`,
          schemaType: 'servicePage',
          value: { menu: 'Services', section: group.section },
        },
      ]),
      {
        id: idify('navItem', 'Services', 'root'),
        title: 'Services group',
        schemaType: 'navItem',
        value: { menu: 'Services', parent: '' },
      },
      ...INDUSTRIES.map((industry) => ({
        id: idify('caseStudy', industry),
        title: `${industry} case study`,
        schemaType: 'caseStudy',
        value: { industry },
      })),
    ],
  },
})
