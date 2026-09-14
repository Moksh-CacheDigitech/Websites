/**
 * Publish existing website blogs and contact details into the Sanity dataset.
 * Run from studio/: npx sanity exec scripts/seedContent.mjs --with-user-token
 */
import { createReadStream } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { getCliClient } = require('sanity/cli')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../../frontend/public')

const ZOHO_CONTACT_FORM_URL =
  'https://forms.zohopublic.in/cachedigiteh1/form/CacheTest/formperma/8iVU_cZT4Drao9gm87I9to2E1ugmhqy5xSi8N9li9iM'

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

function textToBlocks(text) {
  return String(text || '')
    .split(/\n\n+/)
    .map((para) => para.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((para, index) => ({
      _type: 'block',
      _key: `p${index}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `s${index}`, text: para, marks: [] }],
    }))
}

async function uploadImage(client, imagePath) {
  if (!imagePath) return null
  const filePath = path.join(publicDir, imagePath.replace(/^\//, ''))
  const filename = path.basename(filePath)
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename })
  return {
    _type: 'image',
    alt: filename,
    asset: { _type: 'reference', _ref: asset._id },
  }
}

const client = getCliClient({ apiVersion: '2025-01-01' })

const { HARDCODED_BLOGS } = await import('../../frontend/src/data/blogsAndHighlights.js')

for (const blog of HARDCODED_BLOGS) {
  const slug = slugify(blog.title)
  let mainImage = null
  try {
    mainImage = await uploadImage(client, blog.image)
  } catch (err) {
    console.warn(`Image skipped for "${blog.title}":`, err.message)
  }

  const doc = {
    _id: `post-${blog.id}`,
    _type: 'post',
    title: blog.title,
    slug: { _type: 'slug', current: slug },
    legacyId: blog.id,
    excerpt: blog.excerpt,
    author: blog.author,
    publishedAt: new Date(`${blog.date}T09:00:00.000Z`).toISOString(),
    category: blog.category,
    readTime: blog.readTime,
    body: textToBlocks(blog.content),
    ...(mainImage ? { mainImage } : {}),
  }

  await client.createOrReplace(doc)
  console.log(`Published post: ${blog.title}`)
}

await client.createOrReplace({
  _id: 'contactInfo',
  _type: 'contactInfo',
  title: 'Contact Us',
  eyebrow: 'Get in touch',
  subtitle: "Have a question or want to work together? We're here to help.",
  reachHeading: 'Reach out',
  reachIntro: 'Choose your preferred way to connect.',
  email: 'info@cachedigitech.com',
  emailNote: 'We reply within 24 hours',
  phone: '+91 180030 94333',
  phoneNote: 'Mon-Fri, 9am-6pm IST',
  offices: [
    {
      _key: 'delhi',
      label: 'Delhi Office',
      line1: 'CRC2 Building Cache Digitech Sultanpur',
      line2: 'Delhi 110030',
    },
    {
      _key: 'mumbai',
      label: 'Mumbai Office',
      line1: '404, C-Wing, Eastern Court Junction',
      line2: 'Tejapal & Parleshwar Road, Vile Parle East, Mumbai 400057',
    },
    {
      _key: 'dubai',
      label: 'Dubai Office',
      line1: 'Compass Building, Al Hulaila',
      line2: 'AL Hulaila Industrial Zone-FZ, Ras Al Khaimah, UAE',
    },
  ],
  formUrl: ZOHO_CONTACT_FORM_URL,
})

console.log('Published contact info')
