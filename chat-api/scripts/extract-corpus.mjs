/**
 * Builds knowledge/chunks.json from frontend static content (no OpenAI call).
 * Run from chat-api/: npm run extract
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const FRONTEND_DATA = path.join(ROOT, "frontend", "src", "data");
const OUT_DIR = path.join(__dirname, "..", "knowledge");
const OUT_FILE = path.join(OUT_DIR, "chunks.json");

const chunks = [];
let seq = 0;

function addChunk(title, source, text) {
  const cleaned = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length < 40) return;
  seq += 1;
  chunks.push({
    id: `c${seq}`,
    title,
    source,
    text: cleaned.slice(0, 3500),
  });
}

function companyFacts() {
  addChunk(
    "About Cache Digitech",
    "company",
    `Cache Digitech Pvt. Ltd is a leading System Integration, Consulting and IT Infrastructure company with over three decades of experience. From New Delhi, Mumbai, and Dubai we help organizations innovate, secure, and scale. We serve enterprises across telecom, BFSI, manufacturing, and the public sector with a global partner ecosystem and a focus on digital transformation. Core offerings include IT Infrastructure, Cloud, Cybersecurity, Data & AI, Managed Services, Consulting, Networking, and Telecom solutions.`
  );
  addChunk(
    "Contact and offices",
    "company",
    `Contact Cache Digitech: Email info@cachedigitech.com (replies within 24 hours). Phone +91 180030 94333 (Mon-Fri, 9am-6pm IST). Delhi Office: CRC2 Building Cache Digitech Sultanpur, Delhi 110030. Mumbai Office: 404, C-Wing, Eastern Court Junction, Tejapal & Parleshwar Road, Vile Parle East, Mumbai 400057. Dubai Office: Compass Building, Al Hulaila, AL Hulaila Industrial Zone-FZ, Ras Al Khaimah, UAE. Website contact form: /contactus.`
  );
  addChunk(
    "Leadership team",
    "company",
    `Cache Digitech leadership team: Prarthana Gupta - Chairperson & Managing Director; Shraddha Gupta - Chief Executive Officer; Vinod Pulyani - Chief Finance Officer; Sourabh Srivastava - Chief Information Security Officer & Data Protection Officer; Naresh Kumar - Vice President - Infra; Anurag Singh - Vice President - Operation; Varun Vohra - Pre-Sales Manager; Manohar Singh - Senior Sales Manager; Geetanjali Kumar - Vice President - Legal & Compliance; Shweta Gaba - General Manager - HR; Mehak Verma - Manager - Employee Relation; Gajendra Dixit - Manager - Supply Chain; Kapil Chaudhary - Manager - Supply Chain.`
  );
  addChunk(
    "Service catalog overview",
    "company",
    `Cache Digitech service areas: Cloud Solutions (strategy, hybrid, security, consulting, architecture, managed cloud, DevOps, multi-cloud billing, AI CoE, cloud application transformation); Cybersecurity; Infrastructure; Data Analytics and AI; Managed Services (network and end-user); Consulting; Telecom; How We Deliver methodology. Visitors can explore pages under /cloudservices, /cybersecurity, /infrastructureservice, /aianddataservice, /manageservices, /consultingservice, /telecom, /how-we-deliver, /innovations, /insights, /blogs.`
  );
}

function extractQuotedBlocks(sourceText) {
  const pages = [];
  const pageStarts = [...sourceText.matchAll(/\{\s*slug:\s*"([^"]+)"/g)];
  for (let i = 0; i < pageStarts.length; i += 1) {
    const start = pageStarts[i].index;
    const end = i + 1 < pageStarts.length ? pageStarts[i + 1].index : sourceText.length;
    const block = sourceText.slice(start, end);
    const get = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
      return m ? m[1].replace(/\\n/g, " ").replace(/\\"/g, '"') : "";
    };
    const getArr = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
      if (!m) return [];
      return [...m[1].matchAll(/"((?:\\\\.|[^"\\\\])*)"/g)].map((x) =>
        x[1].replace(/\\n/g, " ").replace(/\\"/g, '"')
      );
    };
    pages.push({
      slug: pageStarts[i][1],
      title: get("title") || get("shortTitle") || pageStarts[i][1],
      tagline: get("tagline"),
      intro: get("intro"),
      introParagraphs: getArr("introParagraphs"),
      highlights: getArr("highlights"),
      items: getArr("items"),
    });
  }
  return pages;
}

function ingestServiceTs(fileName, section) {
  const filePath = path.join(FRONTEND_DATA, fileName);
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  const pages = extractQuotedBlocks(raw);
  for (const p of pages) {
    const parts = [
      p.title,
      p.tagline,
      p.intro,
      ...(p.introParagraphs || []),
      ...(p.highlights || []).map((h) => `Highlight: ${h}`),
      ...(p.items || []).slice(0, 40).map((it) => `- ${it}`),
    ].filter(Boolean);
    addChunk(p.title, `${section}/${p.slug}`, parts.join("\n"));
  }
}

async function ingestJsModules() {
  const blogsUrl = pathToFileURL(
    path.join(FRONTEND_DATA, "blogsAndHighlights.js")
  ).href;
  const innovationsUrl = pathToFileURL(
    path.join(FRONTEND_DATA, "innovationProjects.js")
  ).href;

  const blogsMod = await import(blogsUrl);
  for (const b of blogsMod.HARDCODED_BLOGS || []) {
    addChunk(
      b.title,
      `blog/${b.id}`,
      `${b.title}. Category: ${b.category}. ${b.excerpt}\n${b.content}`
    );
  }
  for (const h of blogsMod.HARDCODED_HIGHLIGHTS || []) {
    addChunk(h.title, `highlight/${h.tag}`, `${h.tag}: ${h.title}. ${h.description}`);
  }

  const innMod = await import(innovationsUrl);
  for (const p of innMod.INNOVATION_PROJECTS || []) {
    addChunk(
      p.name,
      `innovation/${p.slug}`,
      `${p.name} - ${p.tagline}. ${p.description}\nFeatures: ${(p.features || []).join("; ")}`
    );
  }
}

function ingestCaseStudiesFromTsx() {
  const filePath = path.join(
    ROOT,
    "frontend",
    "src",
    "components",
    "InsightComponent",
    "case-studies-section.tsx"
  );
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  const titles = [...raw.matchAll(/title:\s*"((?:\\\\.|[^"\\\\])*)"/g)].map((m) => m[1]);
  const descs = [...raw.matchAll(/description:\s*"((?:\\\\.|[^"\\\\])*)"/g)].map((m) =>
    m[1].replace(/\\n/g, " ")
  );
  const n = Math.min(titles.length, descs.length);
  for (let i = 0; i < n; i += 1) {
    addChunk(titles[i], `case-study/${i + 1}`, `${titles[i]}. ${descs[i]}`);
  }
}

async function main() {
  companyFacts();
  await ingestJsModules();
  ingestServiceTs("cloudSubPages.ts", "cloud");
  ingestServiceTs("cybersecuritySubPages.ts", "cybersecurity");
  ingestServiceTs("infrastructureSubPages.ts", "infrastructure");
  ingestServiceTs("dataAnalyticsSubPages.ts", "data-analytics");
  ingestServiceTs("managedServicesSubPages.ts", "managed-services");
  ingestServiceTs("consultingSubPages.ts", "consulting");
  ingestCaseStudiesFromTsx();

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    count: chunks.length,
    chunks,
  };
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${chunks.length} chunks -> ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
