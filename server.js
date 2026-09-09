/**
 * Hostinger Node.js entry - serves the Vite production build from frontend/dist.
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
const distDir = path.join(__dirname, "frontend", "dist");
const indexHtml = path.join(distDir, "index.html");
const port = Number(process.env.PORT) || 3000;

if (!fs.existsSync(indexHtml)) {
  console.error(
    `[server] Missing ${indexHtml}. Run "npm run build" before start.`
  );
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");
app.use(compression());

app.use(
  express.static(distDir, {
    index: false,
    maxAge: "1y",
    setHeaders(res, filePath) {
      if (filePath.endsWith(`${path.sep}index.html`) || filePath.endsWith("index.html")) {
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

app.listen(port, "0.0.0.0", () => {
  console.log(`[server] Cache Digitech listening on 0.0.0.0:${port}`);
});
