/**
 * Hostinger Node.js entry (optional local / Express mode).
 * Preferred Hostinger deploy is static React (no entry file) - see HOSTINGER_DEPLOYMENT_GUIDE.md.
 *
 * Serves Vite build from the first folder that contains index.html.
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
const cwd = process.cwd();

function resolveDistDir() {
  const candidates = [
    path.join(__dirname, "dist"),
    path.join(__dirname, "frontend", "dist"),
    path.join(cwd, "dist"),
    path.join(cwd, "frontend", "dist"),
    // Hostinger sometimes publishes Output directory into public_html
    path.join(__dirname, "..", "public_html"),
    path.join(cwd, "public_html"),
    path.join(__dirname, "..", "public_html", "dist"),
    path.join(cwd, "public_html", "dist"),
  ];
  for (const dir of candidates) {
    try {
      if (fs.existsSync(path.join(dir, "index.html"))) return dir;
    } catch {
      // ignore unreadable paths
    }
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
    "[server] Build output missing. For Hostinger use Application type React, Build: npm run build, Output: dist, Entry file: (empty)."
  );
  app.get("*", (_req, res) => {
    res
      .status(503)
      .type("html")
      .send(`<!doctype html><html><body style="font-family:sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem">
<h1>Build output missing</h1>
<p>This site should be deployed as a <strong>static React</strong> app on Hostinger (not Express).</p>
<ol>
<li>Application type: <code>React</code></li>
<li>Build command: <code>npm run build</code></li>
<li>Output directory: <code>dist</code></li>
<li>Entry file: <strong>leave empty</strong></li>
<li>Redeploy</li>
</ol>
</body></html>`);
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

app.listen(port, () => {
  console.log(`[server] Cache Digitech listening on port ${port}`);
});
