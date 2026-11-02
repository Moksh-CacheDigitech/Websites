# Frontend FAQ chatbot tooling

The site chatbot is fully client-side (`src/lib/faqChat.js` + `src/data/faqs.json`). No separate chat API or OpenAI key is required.

## Paths

| Role | Path |
|------|------|
| Published FAQ knowledge | `frontend/src/data/faqs.json` |
| Source fragments | `frontend/src/data/chat-sources/` |
| Runtime matcher | `frontend/src/lib/faqChat.js` |

## Scripts

Run from repo root (Python + `openpyxl` for Excel imports):

```bash
python frontend/scripts/chat/import-faqs.py
python frontend/scripts/chat/enrich-excel-faqs.py
python frontend/scripts/chat/merge-nav-faqs.py
python frontend/scripts/chat/merge-website-faqs.py
python frontend/scripts/chat/fix-faq-formatting.py
```
