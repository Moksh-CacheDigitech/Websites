/**
 * Publish service page copy into Sanity.
 * Run from studio/: npx sanity exec scripts/seedServicePages.mjs --with-user-token
 */
import { createReadStream, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { getCliClient } = require('sanity/cli')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../../frontend/public')
const dataDir = path.resolve(__dirname, '../../frontend/src/data')

function quoted(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*(?:\\r?\\n\\s*)?"((?:\\\\.|[^"\\\\])*)"`))
  return match ? match[1].replace(/\\"/g, '"') : ''
}

function stringList(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*\\[([\\s\\S]*?)\\n\\s*\\]`))
  if (!match) return []
  return [...match[1].matchAll(/"((?:\\.|[^"\\])*)"/g)].map((item) => item[1].replace(/\\"/g, '"'))
}

function imagePath(block, name, imgPrefix, imgSuffix) {
  const img = block.match(new RegExp(`${name}:\\s*IMG\\("([^"]+)"\\)`))
  if (img) return `${imgPrefix}${img[1]}${imgSuffix}`
  const direct = block.match(new RegExp(`${name}:\\s*"([^"]+)"`))
  return direct ? direct[1] : ''
}

function offerings(block) {
  const match = block.match(/offerings:\s*\[([\s\S]*?)\n\s*\],/)
  if (!match) return []
  const items = []
  const re = /title:\s*"([^"]+)"[\s\S]*?description:\s*"([^"]+)"/g
  let found
  while ((found = re.exec(match[1]))) {
    items.push({ _key: `o${items.length}`, title: found[1], description: found[2] })
  }
  return items
}

function listSections(block) {
  const match = block.match(/listSections:\s*\[([\s\S]*?)\n\s*\],?\s*$/)
  if (!match) return []
  const chunks = match[1].split(/\n\s*\{\s*\n/).slice(1)
  return chunks.map((chunk, index) => ({
    _key: `s${index}`,
    title: quoted(chunk, 'title'),
    intro: quoted(chunk, 'intro'),
    items: stringList(chunk, 'items'),
    footnote: quoted(chunk, 'footnote'),
  })).filter((section) => section.title)
}

function extractPages(file, options) {
  const source = readFileSync(path.join(dataDir, file), 'utf8')
  const overviewRoute = source.match(/overviewRoute:\s*"([^"]+)"/)?.[1] || options.overviewRoute || ''
  const badgeLabel = source.match(/badgeLabel:\s*"([^"]+)"/)?.[1] || options.section
  const overviewLabel = source.match(/overviewLabel:\s*"([^"]+)"/)?.[1] || ''
  const parts = source.split(/\n\s*slug:\s*/)
  return parts.slice(1).map((part) => {
    const slug = part.match(/^"([^"]+)"/)?.[1]
    const block = part
    return {
      slug,
      title: quoted(block, 'title'),
      shortTitle: quoted(block, 'shortTitle'),
      tagline: quoted(block, 'tagline'),
      intro: quoted(block, 'intro'),
      introParagraphs: stringList(block, 'introParagraphs'),
      highlights: stringList(block, 'highlights'),
      offerings: offerings(block),
      listSections: listSections(block),
      heroImage: imagePath(block, 'heroImage', options.imgPrefix, options.imgSuffix),
      bodyImage: imagePath(block, 'bodyImage', options.imgPrefix, options.imgSuffix),
      overviewRoute,
      badgeLabel,
      overviewLabel,
      menu: options.menuFor?.(slug) || options.menu,
      section: options.section,
    }
  }).filter((page) => page.slug && page.title)
}

const SOURCES = [
  {
    file: 'cybersecuritySubPages.ts',
    section: 'cybersecurity',
    menu: 'What We Do',
    imgPrefix: '/images/',
    imgSuffix: '',
  },
  {
    file: 'dataAnalyticsSubPages.ts',
    section: 'data-analytics',
    menu: 'What We Do',
    imgPrefix: '/images/',
    imgSuffix: '',
  },
  {
    file: 'cloudSubPages.ts',
    section: 'cloud',
    menu: 'What We Do',
    overviewRoute: '/cloudservices',
    imgPrefix: '/cloud/subpages/',
    imgSuffix: '.webp',
  },
  {
    file: 'consultingSubPages.ts',
    section: 'consulting',
    menu: 'Services',
    imgPrefix: '/images/',
    imgSuffix: '',
  },
  {
    file: 'managedServicesSubPages.ts',
    section: 'managed-services',
    menu: 'Services',
    imgPrefix: '/images/',
    imgSuffix: '',
  },
  {
    file: 'infrastructureSubPages.ts',
    section: 'infrastructure',
    imgPrefix: '/images/',
    imgSuffix: '',
    menuFor: (slug) => (
      [
        'it-infrastructure-solutions',
        'data-center-management',
        'network-infrastructure',
        'server-storage-management',
        'virtualization-hypervisor-management',
        'backup-disaster-recovery',
      ].includes(slug)
        ? 'Services'
        : 'What We Do'
    ),
  },
]

async function uploadImage(client, imagePathValue) {
  if (!imagePathValue || /^https?:\/\//i.test(imagePathValue)) return null
  const filePath = path.join(publicDir, imagePathValue.replace(/^\//, ''))
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

const client = getCliClient({ apiVersion: '2025-01-01' })
let count = 0

for (const source of SOURCES) {
  const pages = extractPages(source.file, source)
  for (const [index, page] of pages.entries()) {
    let heroImage = null
    let bodyImage = null
    try {
      heroImage = await uploadImage(client, page.heroImage)
    } catch (err) {
      console.warn(`Hero skipped for ${page.slug}:`, err.message)
    }
    try {
      bodyImage = await uploadImage(client, page.bodyImage)
    } catch (err) {
      console.warn(`Body skipped for ${page.slug}:`, err.message)
    }
    await client.createOrReplace({
      _id: `page-${page.section}-${page.slug}`,
      _type: 'servicePage',
      menu: page.menu,
      section: page.section,
      slug: { _type: 'slug', current: page.slug },
      title: page.title,
      shortTitle: page.shortTitle,
      tagline: page.tagline,
      badgeLabel: page.badgeLabel,
      overviewLabel: page.overviewLabel,
      overviewRoute: page.overviewRoute,
      ctaLabel: 'Talk to us',
      ctaHref: '/contactus',
      intro: page.intro,
      introParagraphs: page.introParagraphs,
      highlights: page.highlights,
      offerings: page.offerings,
      listSections: page.listSections,
      sortOrder: (index + 1) * 10,
      ...(heroImage ? { heroImage } : {}),
      ...(bodyImage ? { bodyImage } : {}),
    })
    count += 1
    console.log(`Published page: ${page.menu} / ${page.title}`)
  }
}

console.log(`Published ${count} service pages`)
