/**
 * Publish innovation projects, team, awards, certifications, case studies,
 * campaigns, newsletter, offers, logos, and site settings.
 * Run from studio/: npx sanity exec scripts/seedCms.mjs --with-user-token
 */
import { createReadStream, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { getCliClient } = require('sanity/cli')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../../frontend/public')

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

async function uploadImage(client, imagePath) {
  if (!imagePath) return null
  if (/^https?:\/\//i.test(imagePath)) return null
  const filePath = path.join(publicDir, imagePath.replace(/^\//, ''))
  const filename = path.basename(filePath)
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

function parseCaseStudies() {
  const source = readFileSync(
    path.resolve(__dirname, '../../frontend/src/components/InsightComponent/case-studies-section.tsx'),
    'utf8',
  )
  const start = source.indexOf('const caseStudies = [')
  const end = source.indexOf('];', start)
  const block = source.slice(start, end)
  const pattern = /title:\s*"([^"]+)"[\s\S]*?industry:\s*"([^"]+)"[\s\S]*?challenge:\s*"([^"]+)"[\s\S]*?efficiency:\s*"([^"]+)"[\s\S]*?cost:\s*"([^"]+)"[\s\S]*?uptime:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"[\s\S]*?duration:\s*"([^"]+)"/g
  const items = []
  let match
  while ((match = pattern.exec(block))) {
    items.push({
      title: match[1],
      industry: match[2],
      challenge: match[3],
      resultEfficiency: match[4],
      resultCost: match[5],
      resultUptime: match[6],
      image: match[7],
      duration: match[8],
    })
  }
  return items
}

const TEAM = [
  { name: 'Prarthana Gupta', designation: 'Chairperson & Managing Director', image: '/team/prarthna.webp', link: 'https://www.linkedin.com/in/prarthana-gupta-112510a5/', imageScale: 1.1 },
  { name: 'Shraddha Gupta', designation: 'Chief Executive Officer', image: '/team/shraddha.webp', link: 'https://www.linkedin.com/in/shraddha--gupta/', imageScale: 1 },
  { name: 'Vinod Pulyani', designation: 'Chief Finance Officer', image: '/team/Vinod.webp', link: 'https://www.linkedin.com/in/vinod-pulyani-6701426/', imageScale: 1.2 },
  { name: 'Sourabh Srivastava', designation: 'Chief Information Security Officer & Data Protection Officer', image: '/team/saurabh.webp', link: 'https://www.linkedin.com/in/sourabh-kumar-srivastava-6b078b148/', imageScale: 1.2, imageOffsetY: 8 },
  { name: 'Naresh Kumar', designation: 'Vice President - Infra', image: '/team/naresh.webp', link: '/', imageScale: 1 },
  { name: 'Anurag Singh', designation: 'Vice President - Operation', image: '/team/anurag.webp', link: '/', imageScale: 1 },
  { name: 'Varun Vohra', designation: 'Pre-Sales Manager', image: '/team/varun.webp', link: 'https://www.linkedin.com/in/varun-vohra-926bb4365', imageScale: 1 },
  { name: 'Manohar Singh', designation: 'Senior Sales Manager', image: '/team/manohar.webp', link: 'https://www.linkedin.com/in/manohar-singh-51b05b131', imageScale: 1 },
  { name: 'Geetanjali Kumar', designation: 'Vice President - Legal & Compliance', image: '/team/geetanjli.webp', link: 'https://www.linkedin.com/in/geetanjali-s-kumar-entity-compliance-manager-apac/', imageScale: 1 },
  { name: 'Shweta Gaba', designation: 'General Manager - HR', image: '/team/sweta.webp', link: 'https://www.linkedin.com/in/shweta-gaba-29ab80139/', imageScale: 1 },
  { name: 'Mehak Verma', designation: 'Manager - Employee Relation', image: '/team/mehak.webp', link: 'https://www.linkedin.com/in/mehak-926174190', imageScale: 1.1 },
  { name: 'Gajendra Dixit', designation: 'Manager - Supply Chain', image: '/team/gajender.webp', link: '/', imageScale: 1.2 },
  { name: 'Kapil Chaudhary', designation: 'Manager - Supply Chain', image: '/team/kapil.webp', link: '/', imageScale: 1.2 },
]

const AWARDS = [
  ['Best Women Entrepreneur Award', '/awards/Best Women Enterpreneur Award 1.avif'],
  ['Brightstar Award', '/awards/Brightstar Award 1.avif'],
  ['Business Leader Award', '/awards/Business Leader Award 1.avif'],
  ['CIOs INDIA Award 1', '/awards/CIOs INDIA Award 1.avif'],
  ['CIOs INDIA Award 2', '/awards/CIOs INDIA Award 2.avif'],
  ['Dell Technologies Award', '/awards/Dell Technologies Award 1.avif'],
  ['IBM Akshay Shonik Award', '/awards/IBM Akshay Shonik Award.avif'],
  ['Jubilant Award', '/awards/Jubliant Award 1.avif'],
  ['Savex Award', '/awards/Savex Award 1.avif'],
  ['Schneider Electric Award', '/awards/Schneider Electric Award 1.avif'],
  ['Warranty Service Provider Award', '/awards/Warranty Service Provider Award 1.avif'],
  ['Excellence 2011 CRN Award', '/awards/Xcellence 2011 CRN Award 1.avif'],
]

const CERTS = [
  ['ISO 9001:2015', 'Quality Management System', '/iso9001.webp'],
  ['ISO 27001:2022', 'Information Security Management', '/iso27001.webp'],
  ['MSME Registered', 'Micro, Small & Medium Enterprises', '/msme.webp'],
  ['NISC Registered', 'National Information Solutions Cooperative', '/nisc.webp'],
  ['WEConnect International', 'Women-Owned Business Certification', '/weconnect.webp'],
]

const OFFERS = [
  ['Free infrastructure assessment', 'Get a no-obligation review of your current IT infrastructure with recommendations to modernize and secure your environment.', 'Complimentary', 'Request assessment'],
  ['Cloud migration consultation', 'Discuss your cloud strategy with our experts. We help you plan migration, cost optimization, and security.', 'Free session', 'Book a call'],
  ['Security & compliance review', 'Understand your security posture and compliance gaps. We outline a practical roadmap aligned with your goals.', 'Expert review', 'Learn more'],
]

const CLIENTS = [
  ['Aditya Birla', '/clients/adityabirla.webp'],
  ['Agic Bricks', '/clients/agicbricks.webp'],
  ['Airtel', '/clients/airtel.webp'],
  ['Apollo', '/clients/apollo.webp'],
  ['Bharti infratel', '/clients/bhartiinfratel.webp'],
  ['CDAC', '/clients/cdac.webp'],
  ['Dabur', '/clients/dabur.webp'],
  ['Dakin', '/clients/dakin.webp'],
  ['Eicher', '/clients/eicher.webp'],
  ['Ericsson', '/clients/ericsson.webp'],
  ['Evalue Serve', '/clients/evalueserve.webp'],
  ['Gaar', '/clients/gaar.webp'],
  ['Grant Thornton', '/clients/grantthornton.webp'],
  ['Hero', '/clients/hero.webp'],
  ['Ienergizer', '/clients/ienergizer.webp'],
  ['Industower', '/clients/industower.webp'],
  ['Inter Globe', '/clients/internglobe.webp'],
  ['Irctc', '/clients/irctc.webp'],
  ['Jindal Steel', '/clients/jindal steel.webp'],
  ['Jindal Saw', '/clients/jindalsaw.webp'],
  ['Jk Cement', '/clients/jkcementltd.webp'],
  ['Jk paper', '/clients/jkpaperltd.webp'],
  ['Jubilant', '/clients/jubilant.webp'],
  ['Mahindra Comviva', '/clients/mahindracomviva.webp'],
  ['Nokia', '/clients/nokia.webp'],
  ['NSE', '/clients/nse.webp'],
  ['Nxtra', '/clients/nxtradata.webp'],
  ['PhonePe', '/clients/phonepe.webp'],
  ['Relaxo', '/clients/relaxo.webp'],
  ['Tata', '/clients/tata.webp'],
  ['Vodafone', '/clients/vodafone.webp'],
  ['yamaha', '/clients/yamaha.webp'],
  ['RJ CORP', '/clients/rjcorp.webp'],
]

const PARTNERS = [
  ['Dell', 'Titanium', 'Titanium', '/community/dell.webp'],
  ['Cisco', 'Premier', 'Premier', '/Partners/cisco.webp'],
  ['HP', 'Gold', 'Gold & Silver', '/community/hpelogo.webp'],
  ['Trellix', 'Gold', 'Gold & Silver', '/Partners/trellix.webp'],
  ['IBM', 'Silver', 'Gold & Silver', '/community/ibmlogo.webp'],
  ['Microsoft', 'CSP', 'Cloud & CSP', '/community/microsoft.webp'],
  ['GCP', 'Partner', 'Cloud & CSP', '/community/gcp2.webp'],
  ['AWS', 'Select', 'Cloud & CSP', '/community/awslogo.webp'],
  ['Oracle', 'OPN Member', 'Cloud & CSP', '/community/oracle.webp'],
  ['Fortinet', 'Advance, MSSP', 'Advance & MSSP', '/community/fortinet.webp'],
  ['Arista', 'Authorised', 'Authorised', '/Partners/arista.webp'],
  ['Extreme', 'Authorised', 'Authorised', '/Partners/extreme.webp'],
  ['Nutanix', 'Enrolled', 'Enrolled', '/Partners/nutanix.webp'],
  ['Red Hat', 'Enrolled', 'Enrolled', '/community/redhat.webp'],
  ['Beyond Trust', 'Enrolled', 'Enrolled', '/Partners/beyondtrust.webp'],
  ['Tenable', 'Enrolled', 'Enrolled', '/Partners/tenable.webp'],
  ['Zscaler', 'Enrolled', 'Enrolled', '/Partners/zscaler.webp'],
  ['Kaspersky', 'Registered', 'Registered & Preferred', '/Partners/kaspersky.webp'],
  ['Haproxy', 'Registered', 'Registered & Preferred', '/Partners/haproxy.webp'],
  ['Forescout', 'Registered', 'Registered & Preferred', '/Partners/forescout.webp'],
  ['Palo Alto', 'Registered, Innovator', 'Registered & Preferred', '/community/paloalto.webp'],
  ['Veeam', 'Registered & SP', 'Registered & Preferred', '/Partners/veeam.webp'],
  ['NetApp', 'Approved, Preferred', 'Registered & Preferred', '/Partners/netapp.webp'],
  ['VMware', 'Partner', 'Partner', '/Partners/vmvare.webp'],
  ['SentinelOne', 'Partner', 'Partner', '/Partners/sentinalone.webp'],
  ['Juniper Networks', 'Authorised', 'Authorised', '/community/junipernetwork.webp'],
  ['SAP', 'Partner', 'Partner', '/community/saplogo.webp'],
  ['Salesforce', 'Partner', 'Partner', '/community/salesforce.webp'],
  ['Trend Micro', 'Registered', 'Registered & Preferred', '/Partners/trendmicro.webp'],
]

const client = getCliClient({ apiVersion: '2025-01-01' })
const { INNOVATION_PROJECTS } = await import('../../frontend/src/data/innovationProjects.js')

for (const [index, project] of INNOVATION_PROJECTS.entries()) {
  let image = null
  try {
    image = await uploadImage(client, project.image)
  } catch (err) {
    console.warn(`Image skipped for ${project.name}:`, err.message)
  }
  await client.createOrReplace({
    _id: `innovation-${slugify(project.slug || project.name)}`,
    _type: 'innovationProject',
    name: project.name,
    slug: { _type: 'slug', current: project.slug },
    tagline: project.tagline,
    description: project.description,
    features: project.features || [],
    sortOrder: (index + 1) * 10,
    ...(image ? { image } : {}),
  })
  console.log(`Published project: ${project.name}`)
}

for (const [index, member] of TEAM.entries()) {
  let image = null
  try {
    image = await uploadImage(client, member.image)
  } catch (err) {
    console.warn(`Photo skipped for ${member.name}:`, err.message)
  }
  await client.createOrReplace({
    _id: `team-${slugify(member.name)}`,
    _type: 'teamMember',
    name: member.name,
    designation: member.designation,
    link: member.link?.startsWith('http') ? member.link : undefined,
    imageScale: member.imageScale,
    imageOffsetY: member.imageOffsetY,
    sortOrder: (index + 1) * 10,
    ...(image ? { image } : {}),
  })
  console.log(`Published team: ${member.name}`)
}

for (const [index, [name, imagePath]] of AWARDS.entries()) {
  const image = await uploadImage(client, imagePath)
  await client.createOrReplace({
    _id: `award-${index + 1}`,
    _type: 'award',
    name,
    sortOrder: (index + 1) * 10,
    ...(image ? { image } : {}),
  })
  console.log(`Published award: ${name}`)
}

for (const [index, [name, description, logoPath]] of CERTS.entries()) {
  const logo = await uploadImage(client, logoPath)
  await client.createOrReplace({
    _id: `cert-${index + 1}`,
    _type: 'certification',
    name,
    description,
    sortOrder: (index + 1) * 10,
    ...(logo ? { logo } : {}),
  })
  console.log(`Published certification: ${name}`)
}

const studies = parseCaseStudies()
for (const [index, study] of studies.entries()) {
  let image = null
  try {
    image = await uploadImage(client, study.image)
  } catch (err) {
    console.warn(`Image skipped for ${study.title}:`, err.message)
  }
  await client.createOrReplace({
    _id: `case-${index + 1}`,
    _type: 'caseStudy',
    title: study.title,
    industry: study.industry,
    challenge: study.challenge,
    duration: study.duration,
    resultEfficiency: study.resultEfficiency,
    resultCost: study.resultCost,
    resultUptime: study.resultUptime,
    sortOrder: (index + 1) * 10,
    ...(image ? { image } : {}),
  })
  console.log(`Published case study: ${study.title}`)
}

await client.createOrReplace({
  _id: 'campaign-dell-storage',
  _type: 'campaign',
  title: 'Dell Storage Campaign',
  embedUrl: '/dell-storage-landing-page.html',
  active: true,
  sortOrder: 10,
})
console.log('Published campaign')

await client.createOrReplace({
  _id: 'newsletter-welcome',
  _type: 'newsletterIssue',
  title: 'Cache Digitech technology briefing',
  summary: 'Industry insights on infrastructure, cloud, and cybersecurity from the Cache Digitech team.',
  publishedAt: new Date().toISOString(),
  link: '/newsletter',
  active: true,
})
console.log('Published newsletter issue')

for (const [index, [title, description, highlight, cta]] of OFFERS.entries()) {
  await client.createOrReplace({
    _id: `offer-${index + 1}`,
    _type: 'offer',
    title,
    description,
    highlight,
    cta,
    href: '/contactus',
    active: true,
    sortOrder: (index + 1) * 10,
  })
  console.log(`Published offer: ${title}`)
}

for (const [index, [name, imagePath]] of CLIENTS.entries()) {
  const image = await uploadImage(client, imagePath)
  await client.createOrReplace({
    _id: `client-${slugify(name)}`,
    _type: 'logo',
    kind: 'client',
    name,
    sortOrder: (index + 1) * 10,
    ...(image ? { image } : {}),
  })
  console.log(`Published client: ${name}`)
}

for (const [index, [name, level, category, imagePath]] of PARTNERS.entries()) {
  const image = await uploadImage(client, imagePath)
  await client.createOrReplace({
    _id: `partner-${slugify(name)}`,
    _type: 'logo',
    kind: 'partner',
    name,
    level,
    category,
    sortOrder: (index + 1) * 10,
    ...(image ? { image } : {}),
  })
  console.log(`Published partner: ${name}`)
}

await client.createOrReplace({
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteTitle: 'Cache Digitech',
  tagline: 'Endeavouring perfection',
  email: 'info@cachedigitech.com',
  phone: '+91 180030 94333',
  copyrightName: 'Cache Digitech Pvt. Ltd.',
  defaultSeoDescription: 'Cache Digitech is a system integrator delivering infrastructure, cloud, cybersecurity, data, and managed services for modern enterprises.',
  socialLinks: [
    { _key: 'twitter', platform: 'Twitter', url: 'https://x.com/digitech_cache' },
    { _key: 'instagram', platform: 'Instagram', url: 'https://www.instagram.com/cache.digitech' },
    { _key: 'facebook', platform: 'Facebook', url: 'https://www.facebook.com/CacheDigitech01' },
    { _key: 'email', platform: 'Email', url: 'mailto:info@cachedigitech.com' },
    { _key: 'linkedin', platform: 'LinkedIn', url: 'https://www.linkedin.com/company/cache-digitech-pvt-ltd/' },
  ],
})
console.log('Published site settings')
