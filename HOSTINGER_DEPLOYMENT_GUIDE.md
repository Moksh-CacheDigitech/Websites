# Hostinger Deployment Guide - Cache Digitech

This site is a **Vite + React SPA**. On Hostinger Node.js Web Apps, deploy it as **static React** (Hostinger builds `dist/` and serves those files). Do **not** use Express / `server.js` on Hostinger.

## hPanel settings (use these exactly)

| Field | Value |
| --- | --- |
| Framework / Application type | **`React`** (or `Vite`) |
| Node.js version | `22` (or `20`) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Entry file | **leave empty** |
| Package manager | `npm` |

### You are seeing "Build output missing"

That page means Hostinger is still running **`server.js` (Express mode)**. Express + Output `dist` often moves the build out of the Node app folder, so the server cannot find `index.html`.

**Fix in hPanel → change settings → Redeploy:**

1. Application type → **React**
2. Entry file → **clear / empty** (remove `server.js`)
3. Build command → `npm run build`
4. Output directory → `dist`
5. Save and **Redeploy**

## Deploy from GitHub (recommended)

1. Push this repo to GitHub (repo **root** has `package.json`).
2. In hPanel: **Websites → Add Website → Node.js web app**.
3. Import the Git repository / branch `CacheDigitech.com`.
4. Set the table above (React, no entry file), then **Deploy**.

## What the build does

1. Root `npm install` (light - Express is only for local preview).
2. `npm run build` installs the Vite app under `frontend/`, builds it, then copies `frontend/dist` → root `dist/`.
3. Hostinger publishes `dist/` to the site (static files + `.htaccess` for SPA routes).

## Local preview

```bash
npm install
npm run build
npm start
```

`npm start` runs `server.js` locally only. Hostinger production should not use an entry file.

## Optional: classic File Manager upload

1. `npm run build` locally.
2. Upload **contents** of `dist/` (or `frontend/dist/`) into `public_html`.
3. Keep `.htaccess` so deep links and real 404s work.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| "Build output missing" | Switch to **React**, clear Entry file, Output `dist`, Redeploy |
| 503 Service Unavailable | Same as above; check Deployments build logs for a failed `npm run build` |
| Build fails: missing `package.json` | Deploy from repo **root**, not `frontend/` alone |
| Build fails on `sharp` / `ffmpeg-static` | Optional local image tools only; should not block production. Clear cache and redeploy |
| Deep links 404 after refresh | Confirm `.htaccess` is inside published `dist` (from `frontend/public/.htaccess`) |
| 403 after redeploy | Redeploy again; do not hand-edit Hostinger-generated proxy files if any |
| New React route returns 404 | Add it to `frontend/spaRouteAllowlist.js` and `frontend/public/.htaccess` |

## Security notes

- No secrets in the frontend bundle.
- Set env vars only in hPanel if needed later.
