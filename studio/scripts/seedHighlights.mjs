/**
 * Publish homepage Insights / Latest Highlights into Sanity.
 * Run from studio/: npx sanity exec scripts/seedHighlights.mjs --with-user-token
 */
import { createReadStream } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { getCliClient } = require('sanity/cli')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../../frontend/public')

async function uploadImage(client, imagePath) {
  if (!imagePath) return null
  const filePath = path.join(publicDir, imagePath.replace(/^\//, ''))
  const filename = path.basename(filePath)
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

const client = getCliClient({ apiVersion: '2025-01-01' })
const { HARDCODED_HIGHLIGHTS } = await import('../../frontend/src/data/blogsAndHighlights.js')

await client.createOrReplace({
  _id: 'insightsSection',
  _type: 'insightsSection',
  eyebrow: 'Insights',
  heading: 'Latest Highlights',
})
console.log('Published Insights section headings')

for (const [index, item] of HARDCODED_HIGHLIGHTS.entries()) {
  const n = String(index + 1).padStart(2, '0')
  let image = null
  try {
    image = await uploadImage(client, item.image)
  } catch (err) {
    console.warn(`Image skipped for "${item.title}":`, err.message)
  }

  const doc = {
    _id: `highlight-${n}`,
    _type: 'highlight',
    title: item.title,
    tag: item.tag,
    type: item.type || 'Article',
    description: item.description,
    link: item.link,
    sortOrder: (index + 1) * 10,
    ...(image ? { image } : {}),
  }

  await client.createOrReplace(doc)
  console.log(`Published highlight: ${item.title}`)
}
