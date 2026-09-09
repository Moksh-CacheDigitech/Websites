/**
 * Hostinger Node.js entry - serves the Vite production build.
 * Listens on process.env.PORT (required by Hostinger).
 *
 * SPA behavior matches frontend/public/.htaccess:
 * - Known routes → index.html (200)
 * - Unknown HTML navigations → index.html with HTTP 404 (React 404 UI)
 * - Missing static assets → plain 404
 */
import compression from "compression";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isKnownSpaRoute,
  shouldSkipSpaCheck,
} from "./frontend/spaRouteAllowlist.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveDistDir() {
  const candidates = [
    path.join(__dirname, "dist"),
    path.join(__dirname, "frontend", "dist"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "index.html"))) return dir;
  }
  return null;
}

const distDir = resolveDistDir();
const port = Number(process.env.PORT) || 3000;

const app = express();
app.disable("x-powered-by");
app.use(compression());

if (!distDir) {
  console.error(
    "[server] Build output missing. Expected dist/index.html or frontend/dist/index.html. Set Build command to: npm run build"
  );
  app.get("*", (_req, res) => {
    res
      .status(503)
      .type("html")
      .send(
        "<!doctype html><html><body><h1>Build output missing</h1><p>In hPanel set Build command to <code>npm run build</code>, Entry file to <code>server.js</code>, then Redeploy.</p></body></html>"
      );
  });
} else {
  const indexHtml = path.join(distDir, "index.html");
  console.log(`[server] Serving static files from ${distDir}`);

  app.use(
    express.static(distDir, {
      index: false,
      maxAge: "1y",
      setHeaders(res, filePath) {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    })
  );

  app.get("*", (req, res) => {
    const urlPath = req.path || "/";

    if (shouldSkipSpaCheck(urlPath)) {
      res.status(404).type("text").send("Not Found");
      return;
    }

    if (isKnownSpaRoute(urlPath)) {
      res.sendFile(indexHtml);
      return;
    }

    res.status(404).sendFile(indexHtml);
  });
}

// Hostinger assigns PORT; do not hardcode. Match their Express docs (no host bind).
app.listen(port, () => {
  console.log(`[server] Cache Digitech listening on port ${port}`);
});
