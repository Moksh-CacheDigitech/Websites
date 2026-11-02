# Cache Digitech Chat API (Hostinger Node)

FAQ-first chatbot backend with optional OpenAI RAG. Curated answers live in `knowledge/faqs.json` (imported from the FAQ spreadsheet). The static React site calls this API only.

## Local setup

```bash
cd chat-api
cp .env.example .env
# OPENAI_API_KEY is optional - FAQ matching works without it
npm install
npm run extract        # rebuild chunks from FAQs + site content
# optional: npm run embed   (needs OPENAI_API_KEY)
npm start              # http://localhost:3001
```

Refresh FAQs from the Excel file (path set in `scripts/import-faqs.py`):

```bash
npm run import-faqs
npm run extract
```

Health check: `GET /health`  
Chat: `POST /api/chat` with `{ "messages": [{ "role": "user", "content": "What cloud services do you offer?" }] }`

## Frontend env

In `frontend/.env` (local) or Hostinger build env for the **static** React app:

```text
VITE_CHAT_API_URL=http://localhost:3000
```

Production example:

```text
VITE_CHAT_API_URL=https://api.cachedigitech.com
```

Never put `OPENAI_API_KEY` in `VITE_*` variables.

## Hostinger Node deploy

1. Create a **second** Node.js application (keep the existing static React app as-is).
2. Application root: `chat-api` (or deploy this folder).
3. Entry file: `server.js`
4. Node version: 20 or 22
5. Install / start: `npm install` then `npm start` (Hostinger usually runs `npm start`).
6. Attach subdomain: `api.cachedigitech.com` (or similar) and enable SSL.
7. Environment variables in hPanel:

| Variable | Example |
| --- | --- |
| `OPENAI_API_KEY` | `sk-...` |
| `ALLOWED_ORIGIN` | `https://www.cachedigitech.com,https://cachedigitech.com` |
| `PORT` | Hostinger-injected port if provided |
| `CHAT_MODEL` | `gpt-4o-mini` (optional) |
| `EMBEDDING_MODEL` | `text-embedding-3-small` (optional) |

8. Ensure `knowledge/index.json` is present (run `npm run index` before deploy, or on the server once with the key).
9. Redeploy the **static** frontend with `VITE_CHAT_API_URL=https://api.cachedigitech.com`.

## Re-index after content changes

When blogs, services, or company copy change:

```bash
cd chat-api
npm run index
```

Redeploy the Node app (or upload the new `knowledge/index.json`).

## Guardrails

- Answers only from indexed Cache Digitech chunks
- Low similarity → refusal + contact CTA
- Rate limit per IP (default 20 req / minute)
