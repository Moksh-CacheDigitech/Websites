import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'xcmiqpeo'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-01-01'

export const sanityConfigured = Boolean(projectId && dataset)

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Skip the CDN in local dev so Studio publishes show up immediately.
  useCdn: import.meta.env.PROD,
  perspective: 'published',
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source) {
  if (!source) return null
  return builder.image(source)
}

/** Flatten portable text blocks to plain paragraphs (simple fallback renderer). */
export function portableTextToPlain(blocks) {
  if (!blocks || !Array.isArray(blocks)) return ''
  if (typeof blocks === 'string') return blocks
  return blocks
    .filter((block) => block._type === 'block' && Array.isArray(block.children))
    .map((block) => block.children.map((child) => child.text || '').join(''))
    .join('\n\n')
}
