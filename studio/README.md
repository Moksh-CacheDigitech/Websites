# Sanity Studio - Cache Digitech

Local CMS for blogs, contact info, site settings, and page sections.

## Setup

1. Log in to Sanity (one-time):

```bash
cd studio
npx sanity login
```

2. Install and run:

```bash
npm install
npm run dev
```

Studio opens at http://localhost:3333

## Project

- Project ID: `xcmiqpeo`
- Dataset: `production`
- Organization: `o6l0beh3j`

## Content types

| Type | Purpose |
|------|---------|
| Blog Post | Articles for `/blogs` and `/blog/:id` |
| Contact Info | Email, phone, offices, form URL (singleton) |
| Site Settings | Site title, SEO, social links (singleton) |
| Page Section | Flexible copy for `useContent(pageId, sectionId)` |

## Deploy studio (hosted)

```bash
npm run deploy
```
