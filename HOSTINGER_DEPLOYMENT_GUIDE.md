# Hostinger Deployment Guide - Cache Digitech

This site is set up for **Hostinger Node.js Web Apps** (Business / Cloud plans). Hostinger builds the Vite app, then runs `server.js` to serve it.

## hPanel settings (use these exactly)

| Field | Value |
| --- | --- |
| Framework / Application type | `Express` or `Other` |
| Node.js version | `22` (or `20`) |
| Build command | `npm run build` |
| Output directory | leave blank (or `frontend/dist` if the panel requires one) |
| Entry file | `server.js` |
| Package manager | `npm` |

Do **not** hand-edit `public_html/.htaccess` on Node.js hosting - Hostinger regenerates it on redeploy. Routing and real HTTP 404s for unknown paths are handled in `server.js`.

## Deploy from GitHub (recommended)

1. Push this repo to GitHub (include root `package.json` and `server.js`).
2. In hPanel: **Websites → Add Website → Node.js web app**.
3. Choose **Import Git repository** and connect the repo.
4. Confirm the settings in the table above, then **Deploy**.
5. Later pushes to the connected branch trigger rebuilds automatically.

## Deploy from a zip archive

1. From the repo root (exclude `node_modules` and `.git`):

```bash
# Linux / macOS
zip -r cachedigitech.zip . -x "node_modules/*" -x "frontend/node_modules/*" -x ".git/*" -x "*.zip"

# PowerShell (Windows)
Compress-Archive -Path * -DestinationPath cachedigitech.zip -Force
```

2. In hPanel: **Websites → Add Website → Node.js web app → Upload your files**.
3. Upload the archive, confirm the settings above, then **Deploy**.

## What the build does

1. Root `npm install` installs Express (`server.js` runtime).
2. `npm run build` installs frontend deps (including Vite) and runs `vite build` → `frontend/dist`.
3. Hostinger starts `server.js`, which listens on `process.env.PORT` and serves `frontend/dist`.

## Local verify (same as Hostinger)

```bash
npm install
npm run build
npm start
```

Open `http://localhost:3000` and check a few deep links (refresh on `/about`, `/cloudservices`, etc.). An unknown path such as `/mn` should return **HTTP 404** while still showing the site 404 UI.

## Optional: static upload only (no Node process)

If you prefer classic File Manager hosting instead of a Node.js Web App:

1. Run `npm run build` locally.
2. Upload **contents** of `frontend/dist` into `public_html`.
3. Keep the built `.htaccess` (copied from `frontend/public/.htaccess`) so SPA routes and real 404s work on Apache.

This path does not use `server.js`.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Build fails: missing `package.json` | Deploy from repo **root** (where root `package.json` lives), not from `frontend/` alone |
| Build fails on `sharp` / `ffmpeg-static` | Those are `optionalDependencies` for local image scripts only; they must not block production builds. Redeploy or clear build cache |
| App up but blank / 503 | Entry file must be `server.js`; check Runtime Logs; confirm `PORT` is not hardcoded |
| Deep links 404 after refresh | You are on Node hosting - routing is in `server.js`, not `.htaccess`. Redeploy so Hostinger regenerates its proxy `.htaccess` |
| 403 after redeploy | Redeploy again so Hostinger regenerates `public_html/.htaccess` (do not hand-edit it) |
| New React route returns 404 | Add the path to `frontend/spaRouteAllowlist.js` and mirror it in `frontend/public/.htaccess` for static deploys |

## Security notes

- No secrets belong in the frontend bundle.
- Set any future env vars in hPanel → Environment variables (not in git).
- `server.js` binds to `0.0.0.0` and `process.env.PORT` as required by Hostinger.
