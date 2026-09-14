/**
 * Publish What We Do, Services, and Industries navigation.
 * Run from studio/: npx sanity exec scripts/seedNav.mjs --with-user-token
 */
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { getCliClient } = require('sanity/cli')

function slug(value) {
  return String(value).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80)
}

const GROUPS = [
  ['What We Do', 'Cloud', '/cloudservices'],
  ['What We Do', 'Cybersecurity', '/cybersecurity'],
  ['What We Do', 'Data Analytics & AI', '/aianddataservice'],
  ['What We Do', 'Infra & Networking', '/infrastructureservice'],
  ['Services', 'Cloud', '/cloudservices'],
  ['Services', 'Consulting & Auditing', '/consultingservice'],
  ['Services', 'Managed Services', '/manageservices'],
  ['Services', 'Infrastructure & Networking', '/infrastructureservice'],
  ['Industries', 'Telecom', '/case-studies?industry=Telecom'],
  ['Industries', 'BFSI', '/case-studies?industry=BFSI'],
  ['Industries', 'Automobile & Manufacturing', '/case-studies?industry=Automobile%20%26%20Manufacturing'],
  ['Industries', 'Retail', '/case-studies?industry=Retail'],
  ['Industries', 'Healthcare & Hospitality', '/case-studies?industry=Healthcare%20%26%20Hospitality'],
  ['Industries', 'Governance', '/case-studies?industry=Governance'],
  ['Industries', 'IT & ITES', '/case-studies?industry=IT%20%26%20ITES'],
]

const LINKS = [
  ['What We Do', 'Cloud', 'Cloud Overview', '/cloudservices'],
  ['What We Do', 'Cloud', 'Cloud & Application Transformation', '/cloud/cloud-application-transformation'],
  ['What We Do', 'Cloud', 'Cloud Managed Services', '/cloud/managed-cloud-services'],
  ['What We Do', 'Cloud', 'Multi-Cloud Billing', '/cloud/multi-cloud-billing'],
  ['What We Do', 'Cloud', 'AI Center of Excellence', '/cloud/ai-coe'],
  ['What We Do', 'Cybersecurity', 'Cybersecurity Overview', '/cybersecurity'],
  ['What We Do', 'Cybersecurity', 'Security Consulting', '/cybersecurity/security-consulting'],
  ['What We Do', 'Cybersecurity', 'Infrastructure & Endpoint Security', '/cybersecurity/infrastructure-endpoint-security'],
  ['What We Do', 'Cybersecurity', 'Threat Monitoring & Response', '/cybersecurity/threat-monitoring-response'],
  ['What We Do', 'Cybersecurity', 'Vulnerability Management', '/cybersecurity/vulnerability-management'],
  ['What We Do', 'Cybersecurity', 'Data & Cloud Security', '/cybersecurity/data-cloud-security'],
  ['What We Do', 'Cybersecurity', 'Security Audits & Compliance', '/cybersecurity/security-audits-compliance'],
  ['What We Do', 'Data Analytics & AI', 'Data & AI Overview', '/aianddataservice'],
  ['What We Do', 'Data Analytics & AI', 'Data Platforms', '/data-analytics/data-platforms'],
  ['What We Do', 'Data Analytics & AI', 'Advanced Analytics', '/data-analytics/advanced-analytics'],
  ['What We Do', 'Data Analytics & AI', 'AI Automation', '/data-analytics/ai-automation'],
  ['What We Do', 'Data Analytics & AI', 'Intelligent CRM', '/data-analytics/intelligent-crm'],
  ['What We Do', 'Data Analytics & AI', 'Data Security & Governance', '/data-analytics/data-security-governance'],
  ['What We Do', 'Infra & Networking', 'Infrastructure Overview', '/infrastructureservice'],
  ['What We Do', 'Infra & Networking', 'Infrastructure Consulting', '/infrastructure/infrastructure-consulting'],
  ['What We Do', 'Infra & Networking', 'Infrastructure Design', '/infrastructure/infrastructure-design'],
  ['What We Do', 'Infra & Networking', 'Infrastructure Deployment', '/infrastructure/infrastructure-deployment'],
  ['What We Do', 'Infra & Networking', 'Infrastructure Management', '/infrastructure/infrastructure-management'],
  ['What We Do', 'Infra & Networking', 'Data Center Migration', '/infrastructure/data-center-migration'],
  ['Services', 'Cloud', 'Cloud Overview', '/cloudservices'],
  ['Services', 'Cloud', 'Cloud & Application Transformation', '/cloud/cloud-application-transformation'],
  ['Services', 'Cloud', 'Cloud Managed Services', '/cloud/managed-cloud-services'],
  ['Services', 'Cloud', 'Multi-Cloud Billing', '/cloud/multi-cloud-billing'],
  ['Services', 'Cloud', 'AI Center of Excellence', '/cloud/ai-coe'],
  ['Services', 'Consulting & Auditing', 'Consulting Overview', '/consultingservice'],
  ['Services', 'Consulting & Auditing', 'Strategy Consulting', '/consulting/strategy-consulting'],
  ['Services', 'Consulting & Auditing', 'Infrastructure Advisory', '/consulting/infrastructure-advisory'],
  ['Services', 'Consulting & Auditing', 'Security Consulting', '/cybersecurity/security-consulting'],
  ['Services', 'Consulting & Auditing', 'GRC', '/grc-dashboard'],
  ['Services', 'Consulting & Auditing', 'IT Audits', '/consulting/it-audits'],
  ['Services', 'Consulting & Auditing', 'Process Optimization', '/consulting/process-optimization'],
  ['Services', 'Managed Services', 'Managed Services Overview', '/manageservices'],
  ['Services', 'Managed Services', 'Network Managed Services', '/managed-services/network-managed-services'],
  ['Services', 'Managed Services', 'IT Infrastructure Managed Services', '/managed-services/it-infrastructure-management'],
  ['Services', 'Managed Services', 'Cloud Managed Services', '/managed-services/cloud-managed-services'],
  ['Services', 'Managed Services', 'Security Operations (SOC / SIEM / MDR)', '/managed-services/security-operations-soc-siem-mdr'],
  ['Services', 'Managed Services', 'DevOps & Automation Services', '/managed-services/devops-automation-services'],
  ['Services', 'Managed Services', 'End-User & Workplace Services', '/managed-services/end-user-workplace-support'],
  ['Services', 'Infrastructure & Networking', 'Infrastructure Overview', '/infrastructureservice'],
  ['Services', 'Infrastructure & Networking', 'IT Infrastructure Solutions', '/infrastructure/it-infrastructure-solutions'],
  ['Services', 'Infrastructure & Networking', 'Data Center Management', '/infrastructure/data-center-management'],
  ['Services', 'Infrastructure & Networking', 'Network Infrastructure (LAN/WAN/Wireless)', '/infrastructure/network-infrastructure'],
  ['Services', 'Infrastructure & Networking', 'Server & Storage Management', '/infrastructure/server-storage-management'],
  ['Services', 'Infrastructure & Networking', 'Virtualization & Hypervisor Management', '/infrastructure/virtualization-hypervisor-management'],
  ['Services', 'Infrastructure & Networking', 'Backup & Disaster Recovery', '/infrastructure/backup-disaster-recovery'],
]

const client = getCliClient({ apiVersion: '2025-01-01' })

for (const [index, [menu, label, href]] of GROUPS.entries()) {
  await client.createOrReplace({
    _id: `nav-${slug(menu)}-${slug(label)}`,
    _type: 'navItem',
    menu,
    label,
    href,
    parent: '',
    sortOrder: (index + 1) * 10,
  })
}

let order = 100
for (const [menu, parent, label, href] of LINKS) {
  order += 10
  await client.createOrReplace({
    _id: `nav-${slug(menu)}-${slug(parent)}-${slug(label)}`,
    _type: 'navItem',
    menu,
    label,
    href,
    parent,
    sortOrder: order,
  })
}

console.log(`Published ${GROUPS.length + LINKS.length} navigation items`)
