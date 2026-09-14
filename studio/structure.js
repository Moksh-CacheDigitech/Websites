/**
 * Desk structure mirrors the website navigation and page groups.
 * IDs use hyphens only - Sanity rejects spaces.
 */

function idify(...parts) {
  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function navList(S, menu, parent) {
  return S.documentList()
    .title(parent ? `${parent} links` : `${menu} links`)
    .id(idify('nav-list', menu, parent || 'root'))
    .schemaType('navItem')
    .filter(
      parent
        ? '_type == "navItem" && menu == $menu && (parent == $parent || ((!defined(parent) || parent == "") && label == $parent))'
        : '_type == "navItem" && menu == $menu && (!defined(parent) || parent == "")',
    )
    .params(parent ? { menu, parent } : { menu })
    .initialValueTemplates([
      S.initialValueTemplateItem(idify('navItem', menu, parent || 'root'), {
        menu,
        ...(parent ? { parent } : { parent: '' }),
      }),
    ])
}

function pagesList(S, menu, section, title) {
  return S.documentList()
    .title(title || 'Pages')
    .id(idify('pages-list', menu, section))
    .schemaType('servicePage')
    .filter('_type == "servicePage" && menu == $menu && section == $section')
    .params({ menu, section })
    .initialValueTemplates([
      S.initialValueTemplateItem(idify('servicePage', menu, section), { menu, section }),
    ])
}

function groupBranch(S, menu, group) {
  return S.listItem()
    .title(group.title)
    .id(idify('group', menu, group.title))
    .child(
      S.list()
        .title(group.title)
        .id(idify('group-list', menu, group.title))
        .items([
          S.listItem()
            .title('Menu links')
            .id(idify('group-nav', menu, group.title))
            .child(navList(S, menu, group.parent)),
          S.listItem()
            .title('Page content')
            .id(idify('group-pages', menu, group.title))
            .child(pagesList(S, menu, group.section, `${group.title} pages`)),
        ]),
    )
}

const WHAT_WE_DO_GROUPS = [
  { title: 'Cloud', parent: 'Cloud', section: 'cloud' },
  { title: 'Cybersecurity', parent: 'Cybersecurity', section: 'cybersecurity' },
  { title: 'Data Analytics & AI', parent: 'Data Analytics & AI', section: 'data-analytics' },
  { title: 'Infra & Networking', parent: 'Infra & Networking', section: 'infrastructure' },
]

const SERVICES_GROUPS = [
  { title: 'Cloud', parent: 'Cloud', section: 'cloud' },
  { title: 'Consulting & Auditing', parent: 'Consulting & Auditing', section: 'consulting' },
  { title: 'Managed Services', parent: 'Managed Services', section: 'managed-services' },
  { title: 'Infrastructure & Networking', parent: 'Infrastructure & Networking', section: 'infrastructure' },
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

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home')
        .id('home')
        .child(
          S.list()
            .title('Home')
            .id('home-list')
            .items([
              S.listItem()
                .title('Hero, CTA & chatbot')
                .id('home-sections')
                .child(
                  S.documentList()
                    .title('Home sections')
                    .id('home-sections-list')
                    .schemaType('pageSection')
                    .filter('_type == "pageSection" && pageId == "home"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('pageSection-home', { pageId: 'home' }),
                    ]),
                ),
              S.listItem()
                .title('Insights heading')
                .id('home-insights-heading')
                .child(
                  S.document()
                    .schemaType('insightsSection')
                    .documentId('insightsSection')
                    .title('Insights heading'),
                ),
              S.listItem()
                .title('Latest Highlights')
                .id('home-highlights')
                .child(S.documentTypeList('highlight').title('Latest Highlights').id('highlights-list')),
              S.listItem()
                .title('Partner logos')
                .id('home-partners')
                .child(
                  S.documentList()
                    .title('Partner logos')
                    .id('home-partners-list')
                    .schemaType('logo')
                    .filter('_type == "logo" && kind == "partner"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('logo-partner', { kind: 'partner' }),
                    ]),
                ),
            ]),
        ),

      S.listItem()
        .title('About Us')
        .id('about-us')
        .child(
          S.list()
            .title('About Us')
            .id('about-us-list')
            .items([
              S.listItem()
                .title('About page copy')
                .id('about-sections')
                .child(
                  S.documentList()
                    .title('About page copy')
                    .id('about-sections-list')
                    .schemaType('pageSection')
                    .filter('_type == "pageSection" && pageId == "about"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('pageSection-about', { pageId: 'about' }),
                    ]),
                ),
              S.listItem()
                .title('Leadership Team')
                .id('about-leadership')
                .child(S.documentTypeList('teamMember').title('Leadership Team').id('team-list')),
              S.listItem()
                .title('Our Alliances')
                .id('about-alliances')
                .child(
                  S.documentList()
                    .title('Our Alliances')
                    .id('about-alliances-list')
                    .schemaType('logo')
                    .filter('_type == "logo" && kind == "partner"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('logo-partner', { kind: 'partner' }),
                    ]),
                ),
              S.listItem()
                .title('Awards')
                .id('about-awards')
                .child(S.documentTypeList('award').title('Awards').id('awards-list')),
              S.listItem()
                .title('Certifications')
                .id('about-certs')
                .child(S.documentTypeList('certification').title('Certifications').id('certs-list')),
              S.listItem()
                .title('Blogs')
                .id('about-blogs')
                .child(S.documentTypeList('post').title('Blogs').id('blogs-list')),
            ]),
        ),

      S.listItem()
        .title('What We Do')
        .id('what-we-do')
        .child(
          S.list()
            .title('What We Do')
            .id('what-we-do-list')
            .items(WHAT_WE_DO_GROUPS.map((group) => groupBranch(S, 'What We Do', group))),
        ),

      S.listItem()
        .title('Innovations')
        .id('innovations')
        .child(
          S.documentTypeList('innovationProject').title('Innovation projects').id('innovations-list'),
        ),

      S.listItem()
        .title('Services')
        .id('services')
        .child(
          S.list()
            .title('Services')
            .id('services-list')
            .items(SERVICES_GROUPS.map((group) => groupBranch(S, 'Services', group))),
        ),

      S.listItem()
        .title('Industries')
        .id('industries')
        .child(
          S.list()
            .title('Industries')
            .id('industries-list')
            .items([
              S.listItem()
                .title('Menu links')
                .id('industries-nav')
                .child(navList(S, 'Industries')),
              S.divider(),
              ...INDUSTRIES.map((industry) =>
                S.listItem()
                  .title(industry)
                  .id(idify('industry', industry))
                  .child(
                    S.documentList()
                      .title(`${industry} case studies`)
                      .id(idify('industry-cases', industry))
                      .schemaType('caseStudy')
                      .filter('_type == "caseStudy" && industry == $industry')
                      .params({ industry })
                      .initialValueTemplates([
                        S.initialValueTemplateItem(idify('caseStudy', industry), { industry }),
                      ]),
                  ),
              ),
            ]),
        ),

      S.listItem()
        .title('Contact')
        .id('contact')
        .child(
          S.document()
            .schemaType('contactInfo')
            .documentId('contactInfo')
            .title('Contact Us'),
        ),

      S.divider(),

      S.listItem()
        .title('Community clients')
        .id('community-clients')
        .child(
          S.documentList()
            .title('Community clients')
            .id('clients-list')
            .schemaType('logo')
            .filter('_type == "logo" && kind == "client"')
            .initialValueTemplates([
              S.initialValueTemplateItem('logo-client', { kind: 'client' }),
            ]),
        ),

      S.listItem()
        .title('Campaigns')
        .id('campaigns')
        .child(S.documentTypeList('campaign').title('Campaigns').id('campaigns-list')),
      S.listItem()
        .title('Newsletter')
        .id('newsletter')
        .child(S.documentTypeList('newsletterIssue').title('Newsletter').id('newsletter-list')),
      S.listItem()
        .title('Offers')
        .id('offers')
        .child(S.documentTypeList('offer').title('Offers').id('offers-list')),

      S.listItem()
        .title('Site settings')
        .id('site-settings')
        .schemaType('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings'),
        ),
    ])
