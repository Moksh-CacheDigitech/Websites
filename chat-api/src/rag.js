import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = path.join(__dirname, "..", "knowledge");
const INDEX_PATH = path.join(KNOWLEDGE_DIR, "index.json");
const CHUNKS_PATH = path.join(KNOWLEDGE_DIR, "chunks.json");

const REFUSAL =
  "I can only answer questions about Cache Digitech - our services, solutions, leadership, offices, and company information. For anything else, please visit https://www.cachedigitech.com/contactus or email info@cachedigitech.com.";

const SYSTEM_PROMPT = `You are the Cache Digitech website assistant.
Answer ONLY using the provided CONTEXT about Cache Digitech.
If the context does not contain the answer, say you do not have that information and suggest contacting info@cachedigitech.com or visiting /contactus.
Never invent services, prices, partners, or people not present in the context.
Never answer general knowledge, coding help, politics, or topics unrelated to Cache Digitech.
Keep answers concise and professional. Use plain ASCII hyphens (-) only - no en/em dashes.
For lists, use numbered lines (1. 2. 3.) or hyphen bullets (- item). You may wrap short titles in **double asterisks** for bold; do not use other markdown.
When relevant, mention Contact: info@cachedigitech.com or +91 180030 94333.`;

let cachedIndex = null;

function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function keywordScore(query, text) {
  const q = query
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 2);
  if (!q.length) return 0;
  const hay = text.toLowerCase();
  let hits = 0;
  for (const w of q) {
    if (hay.includes(w)) hits += 1;
  }
  return hits / q.length;
}

export function loadIndex() {
  if (cachedIndex) return cachedIndex;
  if (fs.existsSync(INDEX_PATH)) {
    cachedIndex = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
    return cachedIndex;
  }
  if (fs.existsSync(CHUNKS_PATH)) {
    const chunks = JSON.parse(fs.readFileSync(CHUNKS_PATH, "utf8"));
    cachedIndex = {
      model: null,
      createdAt: null,
      chunks: (chunks.chunks || chunks).map((c) => ({
        id: c.id,
        title: c.title,
        source: c.source,
        text: c.text,
        embedding: null,
      })),
    };
    return cachedIndex;
  }
  throw new Error("No knowledge/index.json or knowledge/chunks.json found. Run npm run index.");
}

export function getIndexStats() {
  const index = loadIndex();
  const withEmb = index.chunks.filter((c) => Array.isArray(c.embedding)).length;
  return {
    chunks: index.chunks.length,
    embedded: withEmb,
    model: index.model || null,
    createdAt: index.createdAt || null,
  };
}

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

async function embedQuery(client, text, model) {
  const res = await client.embeddings.create({
    model: model || process.env.EMBEDDING_MODEL || "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

function retrieve(index, queryEmbedding, queryText, topK, threshold) {
  const scored = index.chunks.map((chunk) => {
    let score = 0;
    if (queryEmbedding && Array.isArray(chunk.embedding)) {
      score = cosineSimilarity(queryEmbedding, chunk.embedding);
    } else {
      score = keywordScore(queryText, `${chunk.title}\n${chunk.text}`);
    }
    return { chunk, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, topK);
  const best = top[0]?.score ?? 0;
  const effectiveThreshold = queryEmbedding ? threshold : Math.max(threshold, 0.15);
  if (best < effectiveThreshold) {
    return { matches: [], best };
  }
  return {
    matches: top.filter((t) => t.score >= effectiveThreshold * 0.85),
    best,
  };
}

export async function answerChat({ messages }) {
  const index = loadIndex();
  const client = getClient();
  const model = process.env.CHAT_MODEL || "gpt-4o-mini";
  const embeddingModel = index.model || process.env.EMBEDDING_MODEL || "text-embedding-3-small";
  const threshold = Number(process.env.SIMILARITY_THRESHOLD || 0.22);
  const topK = Number(process.env.TOP_K || 6);

  const history = Array.isArray(messages) ? messages.slice(-12) : [];
  const lastUser = [...history].reverse().find((m) => m?.role === "user");
  const question = String(lastUser?.content || "").trim();
  if (!question) {
    return { reply: REFUSAL, refused: true, scores: [] };
  }

  const hasEmbeddings = index.chunks.some((c) => Array.isArray(c.embedding));
  let queryEmbedding = null;
  if (hasEmbeddings) {
    queryEmbedding = await embedQuery(client, question, embeddingModel);
  }

  const { matches, best } = retrieve(index, queryEmbedding, question, topK, threshold);
  if (!matches.length) {
    return {
      reply: REFUSAL,
      refused: true,
      bestScore: best,
      scores: [],
    };
  }

  const context = matches
    .map(
      (m, i) =>
        `[${i + 1}] ${m.chunk.title} (${m.chunk.source})\n${m.chunk.text}`
    )
    .join("\n\n");

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "system",
        content: `CONTEXT:\n${context}`,
      },
      ...history
        .filter((m) => m?.role === "user" || m?.role === "assistant")
        .map((m) => ({ role: m.role, content: String(m.content || "").slice(0, 4000) })),
    ],
  });

  const reply =
    completion.choices?.[0]?.message?.content?.trim() || REFUSAL;

  return {
    reply,
    refused: false,
    bestScore: best,
    scores: matches.map((m) => ({
      id: m.chunk.id,
      title: m.chunk.title,
      score: Number(m.score.toFixed(4)),
    })),
  };
}
