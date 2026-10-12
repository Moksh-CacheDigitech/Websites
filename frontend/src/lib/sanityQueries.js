import { sanityClient, urlFor, portableTextToPlain, sanityConfigured } from './sanity'

const postsQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  legacyId,
  excerpt,
  author,
  publishedAt,
  category,
  readTime,
  mainImage
}`

const postBySlugOrIdQuery = `*[_type == "post" && (slug.current == $id || string(legacyId) == $id || _id == $id)][0] {
  _id,
  title,
  "slug": slug.current,
  legacyId,
  excerpt,
  author,
  publishedAt,
  category,
  readTime,
  mainImage,
  body
}`

const contactInfoQuery = `coalesce(
  *[_type == "contactInfo" && _id == "contactInfo"][0],
  *[_type == "contactInfo" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
) {
  title,
  eyebrow,
  subtitle,
  reachHeading,
  reachIntro,
  email,
  emailNote,
  phone,
  phoneNote,
  offices,
  formUrl
}`

const pageSectionsQuery = `*[_type == "pageSection"] {
  pageId,
  sectionId,
  title,
  subtitle,
  body,
  ctaLabel,
  ctaHref,
  image,
  fields
}`

const highlightsQuery = `*[_type == "highlight" && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  title,
  tag,
  type,
  description,
  link,
  image,
  sortOrder
}`

const insightsSectionQuery = `coalesce(
  *[_type == "insightsSection" && _id == "insightsSection"][0],
  *[_type == "insightsSection" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
) {
  eyebrow,
  heading
}`

const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0] {
  siteTitle,
  tagline,
  email,
  phone,
  defaultSeoDescription,
  copyrightName,
  socialLinks
}`

const innovationProjectsQuery = `*[_type == "innovationProject" && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  name,
  "slug": slug.current,
  tagline,
  description,
  features,
  image,
  sortOrder
}`

const teamMembersQuery = `*[_type == "teamMember" && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  name,
  designation,
  image,
  link,
  imageScale,
  imageOffsetY,
  sortOrder
}`

const awardsQuery = `*[_type == "award" && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  name,
  image,
  sortOrder
}`

const certificationsQuery = `*[_type == "certification" && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  name,
  description,
  logo,
  sortOrder
}`

const caseStudiesQuery = `*[_type == "caseStudy" && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  title,
  industry,
  challenge,
  solution,
  duration,
  resultEfficiency,
  resultCost,
  resultUptime,
  image,
  sortOrder
}`

const campaignsQuery = `*[_type == "campaign" && active == true && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  title,
  embedUrl
}`

const newsletterQuery = `*[_type == "newsletterIssue" && active == true && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  summary,
  publishedAt,
  link
}`

const offersQuery = `*[_type == "offer" && active == true && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  title,
  description,
  highlight,
  cta,
  href
}`

const logosQuery = `*[_type == "logo" && kind == $kind && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  name,
  kind,
  image,
  level,
  category,
  sortOrder
}`

function mapPost(doc) {
  if (!doc) return null
  const date = doc.publishedAt
    ? new Date(doc.publishedAt).toISOString().slice(0, 10)
    : ''
  const imageUrl = doc.mainImage ? urlFor(doc.mainImage).width(1200).url() : null
  return {
    id: doc.slug || doc.legacyId || doc._id,
    legacyId: doc.legacyId,
    _id: doc._id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt || '',
    author: doc.author || 'Cache Digitech',
    date,
    category: doc.category || 'Other',
    readTime: doc.readTime || '5 min',
    image: imageUrl || '',
    content: portableTextToPlain(doc.body),
    body: doc.body || null,
  }
}

function mapPageSections(docs) {
  const content = {}
  for (const doc of docs || []) {
    if (!doc?.pageId || !doc?.sectionId) continue
    if (!content[doc.pageId]) content[doc.pageId] = {}
    const extras = {}
    for (const kv of doc.fields || []) {
      if (kv?.key) extras[kv.key] = kv.value
    }
    content[doc.pageId][doc.sectionId] = {
      title: doc.title,
      subtitle: doc.subtitle,
      body: doc.body,
      ctaLabel: doc.ctaLabel,
      ctaHref: doc.ctaHref,
      image: doc.image ? urlFor(doc.image).width(1600).url() : undefined,
      ...extras,
    }
  }
  return content
}

export async function fetchPosts() {
  if (!sanityConfigured) return { posts: null, error: new Error('Sanity is not configured') }
  try {
    const docs = await sanityClient.fetch(postsQuery)
    return { posts: (docs || []).map(mapPost).filter(Boolean), error: null }
  } catch (err) {
    console.warn('[sanity] fetchPosts failed:', err)
    return { posts: null, error: err }
  }
}

export async function fetchPostById(id) {
  if (!sanityConfigured || !id) return null
  try {
    const doc = await sanityClient.fetch(postBySlugOrIdQuery, { id: String(id) })
    return mapPost(doc)
  } catch (err) {
    console.warn('[sanity] fetchPostById failed:', err)
    return null
  }
}

function mapHighlight(doc) {
  if (!doc) return null
  return {
    id: doc._id,
    title: doc.title || '',
    tag: doc.tag || '',
    type: doc.type || 'Article',
    description: doc.description || '',
    link: doc.link || '',
    image: doc.image ? urlFor(doc.image).width(1200).url() : '',
  }
}

export async function fetchHighlights() {
  if (!sanityConfigured) return { highlights: null, section: null, error: new Error('Sanity is not configured') }
  try {
    const [docs, section] = await Promise.all([
      sanityClient.fetch(highlightsQuery),
      sanityClient.fetch(insightsSectionQuery),
    ])
    return {
      highlights: (docs || []).map(mapHighlight).filter(Boolean),
      section: section || null,
      error: null,
    }
  } catch (err) {
    console.warn('[sanity] fetchHighlights failed:', err)
    return { highlights: null, section: null, error: err }
  }
}

function imageUrl(image, width = 1200) {
  return image ? urlFor(image).width(width).url() : ''
}

async function fetchList(query, params, mapDoc, label) {
  if (!sanityConfigured) return { items: null, error: new Error('Sanity is not configured') }
  try {
    const docs = await sanityClient.fetch(query, params || {})
    return { items: (docs || []).map(mapDoc).filter(Boolean), error: null }
  } catch (err) {
    console.warn(`[sanity] ${label} failed:`, err)
    return { items: null, error: err }
  }
}

export function fetchInnovationProjects() {
  return fetchList(innovationProjectsQuery, {}, (doc) => ({
    _id: doc._id,
    name: doc.name,
    slug: doc.slug,
    tagline: doc.tagline || '',
    description: doc.description || '',
    features: doc.features || [],
    image: imageUrl(doc.image, 1400),
  }), 'fetchInnovationProjects')
}

export function fetchTeamMembers() {
  return fetchList(teamMembersQuery, {}, (doc, index) => ({
    id: doc._id || `team-${index + 1}`,
    _id: doc._id,
    name: doc.name,
    designation: doc.designation,
    image: imageUrl(doc.image, 800),
    link: doc.link || '',
    imageScale: doc.imageScale || 1,
    imageOffsetY: doc.imageOffsetY,
  }), 'fetchTeamMembers')
}

export function fetchAwards() {
  return fetchList(awardsQuery, {}, (doc, index) => ({
    id: index + 1,
    name: doc.name,
    image: imageUrl(doc.image, 900),
  }), 'fetchAwards')
}

export function fetchCertifications() {
  return fetchList(certificationsQuery, {}, (doc) => ({
    name: doc.name,
    description: doc.description || '',
    logo: imageUrl(doc.logo, 400),
  }), 'fetchCertifications')
}

export function fetchCaseStudies() {
  return fetchList(caseStudiesQuery, {}, (doc, index) => ({
    id: index + 1,
    title: doc.title,
    industry: doc.industry || '',
    challenge: doc.challenge || '',
    solution: doc.solution || '',
    results: {
      efficiency: doc.resultEfficiency || '',
      cost: doc.resultCost || '',
      uptime: doc.resultUptime || '',
    },
    image: imageUrl(doc.image, 1200),
    duration: doc.duration || '',
  }), 'fetchCaseStudies')
}

export function fetchCampaigns() {
  return fetchList(campaignsQuery, {}, (doc) => ({
    id: doc._id,
    title: doc.title,
    embedUrl: doc.embedUrl || '',
  }), 'fetchCampaigns')
}

export function fetchNewsletterIssues() {
  return fetchList(newsletterQuery, {}, (doc) => ({
    id: doc._id,
    title: doc.title,
    summary: doc.summary || '',
    date: doc.publishedAt ? new Date(doc.publishedAt).toISOString().slice(0, 10) : '',
    link: doc.link || '',
  }), 'fetchNewsletterIssues')
}

export function fetchOffers() {
  return fetchList(offersQuery, {}, (doc) => ({
    id: doc._id,
    title: doc.title,
    description: doc.description || '',
    highlight: doc.highlight || '',
    cta: doc.cta || 'Learn more',
    href: doc.href || '/contactus',
  }), 'fetchOffers')
}

export function fetchLogos(kind) {
  return fetchList(logosQuery, { kind }, (doc) => ({
    id: doc._id,
    name: doc.name,
    kind: doc.kind,
    img: imageUrl(doc.image, 400),
    logo: imageUrl(doc.image, 400),
    level: doc.level || '',
    category: doc.category || doc.level || '',
  }), 'fetchLogos')
}

export async function fetchContactInfo() {
  if (!sanityConfigured) return { contact: null, error: new Error('Sanity is not configured') }
  try {
    const contact = await sanityClient.fetch(contactInfoQuery)
    return { contact: contact || null, error: null }
  } catch (err) {
    console.warn('[sanity] fetchContactInfo failed:', err)
    return { contact: null, error: err }
  }
}

export async function fetchPageContent() {
  if (!sanityConfigured) return null
  try {
    const docs = await sanityClient.fetch(pageSectionsQuery)
    return mapPageSections(docs)
  } catch (err) {
    console.warn('[sanity] fetchPageContent failed:', err)
    return null
  }
}

const navItemsQuery = `*[_type == "navItem" && !(_id in path("drafts.**"))] | order(sortOrder asc) {
  _id,
  menu,
  label,
  href,
  parent,
  sortOrder
}`

const servicePageQuery = `*[_type == "servicePage" && slug.current == $slug && ($section == "" || section == $section)][0] {
  title,
  shortTitle,
  tagline,
  badgeLabel,
  overviewLabel,
  overviewRoute,
  ctaLabel,
  ctaHref,
  intro,
  introParagraphs,
  highlights,
  offerings,
  listSections,
  heroImage,
  bodyImage
}`

export function fetchServicePage(slug, section = '') {
  if (!sanityConfigured || !slug) return Promise.resolve({ page: null, error: null })
  return sanityClient
    .fetch(servicePageQuery, { slug: String(slug), section: section || '' })
    .then((doc) => ({
      page: doc
        ? {
          title: doc.title,
          shortTitle: doc.shortTitle || doc.title,
          tagline: doc.tagline || '',
          badgeLabel: doc.badgeLabel,
          overviewLabel: doc.overviewLabel,
          overviewRoute: doc.overviewRoute,
          ctaLabel: doc.ctaLabel || 'Talk to us',
          ctaHref: doc.ctaHref || '/contactus',
          intro: doc.intro || '',
          introParagraphs: doc.introParagraphs || [],
          highlights: doc.highlights || [],
          offerings: (doc.offerings || []).map((item) => ({
            title: item.title,
            description: item.description || '',
          })),
          listSections: (doc.listSections || []).map((section) => ({
            title: section.title,
            intro: section.intro,
            items: section.items || [],
            footnote: section.footnote,
          })),
          heroImage: doc.heroImage ? urlFor(doc.heroImage).width(1800).url() : '',
          bodyImage: doc.bodyImage ? urlFor(doc.bodyImage).width(1400).url() : '',
        }
        : null,
      error: null,
    }))
    .catch((err) => {
      console.warn('[sanity] fetchServicePage failed:', err)
      return { page: null, error: err }
    })
}

export function fetchNavItems() {
  return fetchList(navItemsQuery, {}, (doc) => ({
    id: doc._id,
    menu: doc.menu,
    label: doc.label,
    href: doc.href || '',
    parent: doc.parent || '',
    sortOrder: doc.sortOrder || 0,
  }), 'fetchNavItems')
}

export async function fetchSiteSettings() {
  if (!sanityConfigured) return { settings: null, error: new Error('Sanity is not configured') }
  try {
    const settings = await sanityClient.fetch(siteSettingsQuery)
    return { settings: settings || null, error: null }
  } catch (err) {
    console.warn('[sanity] fetchSiteSettings failed:', err)
    return { settings: null, error: err }
  }
}
