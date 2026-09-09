/**
 * Copy Vite output from frontend/dist → dist (repo root).
 * Hostinger expects a stable root-level output folder for Web Apps.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "frontend", "dist");
const dest = path.join(root, "dist");

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(fromPath, toPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

if (!fs.existsSync(path.join(src, "index.html"))) {
  console.error(`[sync-dist] Missing ${path.join(src, "index.html")}. Vite build failed.`);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
copyDir(src, dest);
console.log(`[sync-dist] Copied ${src} → ${dest}`);
