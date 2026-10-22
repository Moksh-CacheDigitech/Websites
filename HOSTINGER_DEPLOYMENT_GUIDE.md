# Hostinger Deployment Guide - Cache Digitech

This site is a **Vite + React SPA**. Deploy it on Hostinger as a **static React** app.

## hPanel settings (use these exactly)

| Field | Value |
| --- | --- |
| Framework / Application type | **`React`** |
| Node.js version | `22` |
| Build command | `npm run build` |
| Output directory | **`release`** |
| Entry file | **leave empty** (clear `server.js` if it is set) |
| Package manager | `npm` |

### Why `release` (not `dist`)

Vite writes the production site to the repo-root **`release/`** folder. Hostinger failed with `No output directory found after build` when the output was the gitignored `dist/` folder. `release/` is not gitignored so Hostinger can publish it.

### "Build output missing" page still showing

That HTML is from an old **Express / `server.js`** deployment. The static React deploy must succeed first.

1. Application type → **React**
2. Entry file → **empty**
3. Output directory → **`release`**
4. Build command → `npm run build`
5. **Redeploy** and wait until the build finishes without the red output-directory error

## Deploy from GitHub

1. Use branch `CacheDigitech.com` (repo root has `package.json`).
2. hPanel → Node.js web app → import repo.
3. Apply the table above → Deploy.

## What `npm run build` does

1. Installs the Vite app under `frontend/`.
2. Runs `vite build`.
3. Writes `release/index.html`, assets, and `.htaccess`.

## Local preview

```bash
npm install
npm run build
npm start
```

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `No output directory found after build` | Output directory must be **`release`** (not `dist`) |
| "Build output missing" in browser | Clear Entry file, use React + `release`, Redeploy |
| Deep link 404 on refresh | Confirm `.htaccess` is inside `release/` (from `frontend/public/.htaccess`) |
| New route returns HTTP 404 | Update `frontend/spaRouteAllowlist.js` and `frontend/public/.htaccess` |
