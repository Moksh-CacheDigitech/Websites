import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = path.join(__dirname, "..", "knowledge");
const INDEX_PATH = path.join(KNOWLEDGE_DIR, "index.json");
const CHUNKS_PATH = path.join(KNOWLEDGE_DIR, "chunks.json");
const FAQS_PATH = path.join(KNOWLEDGE_DIR, "faqs.json");

const REFUSAL =
  "I'd love to help with Cache Digitech services, solutions, and how we can support your team. For anything outside that, reach us at info@cachedigitech.com or https://www.cachedigitech.com/contactus - happy to connect you with the right person.";

const SYSTEM_PROMPT = `You are a friendly, confident Cache Digitech sales consultant on the company website.
Speak in first person plural ("we" / "our team") as Cache Digitech - warm, clear, and commercially helpful, like a good account executive on a discovery call.
Answer ONLY using the provided CONTEXT. Do not invent services, prices, partners, SLAs, or people.
Never answer general knowledge, coding help, politics, or topics unrelated to Cache Digitech.
If the context is thin, say so briefly and invite a conversation: info@cachedigitech.com or /contactus.
Rewrite stiff or third-person draft notes into natural sales language. Never say "the website identifies", "describes itself", "confirm with the team", or "before publishing".
Keep answers short (2-5 sentences). Lead with the benefit, then the capability. Soft CTA when natural.
Use plain ASCII hyphens (-) only - no en/em dashes. Prefer short paragraphs over long lists; numbered lines or hyphen bullets are fine when listing offerings.`;

let cachedIndex = null;
let cachedFaqs = null;

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

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 2);
}

function keywordScore(query, text) {
  const q = tokenize(query);
  if (!q.length) return 0;
  const hay = String(text || "").toLowerCase();
  let hits = 0;
  for (const w of q) {
    if (hay.includes(w)) hits += 1;
  }
  return hits / q.length;
}

function jaccard(aTokens, bTokens) {
  const a = new Set(aTokens);
  const b = new Set(bTokens);
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) {
    if (b.has(t)) inter += 1;
  }
  return inter / (a.size + b.size - inter);
}

export function loadFaqs() {
  if (cachedFaqs) return cachedFaqs;
  if (!fs.existsSync(FAQS_PATH)) {
    cachedFaqs = [];
    return cachedFaqs;
  }
  const payload = JSON.parse(fs.readFileSync(FAQS_PATH, "utf8"));
  cachedFaqs = Array.isArray(payload.faqs) ? payload.faqs : [];
  return cachedFaqs;
}

function faqChunksFromJson() {
  return loadFaqs().map((faq) => ({
    id: faq.id,
    title: faq.question,
    source: `faq/${faq.id}`,
    text: [
      `FAQ Group: ${faq.group}`,
      `Topic: ${faq.topic}`,
      `Question: ${faq.question}`,
      `Answer: ${faq.answer}`,
    ].join("\n"),
    embedding: null,
  }));
}

function mergeFaqChunks(index) {
  const existing = new Set(
    (index.chunks || [])
      .filter((c) => String(c.source || "").startsWith("faq/"))
      .map((c) => c.source)
  );
  const extras = faqChunksFromJson().filter((c) => !existing.has(c.source));
  if (!extras.length) return index;
  return { ...index, chunks: [...index.chunks, ...extras] };
}

export function loadIndex() {
  if (cachedIndex) return cachedIndex;
  if (fs.existsSync(INDEX_PATH)) {
    cachedIndex = mergeFaqChunks(JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")));
    return cachedIndex;
  }
  if (fs.existsSync(CHUNKS_PATH)) {
    const chunks = JSON.parse(fs.readFileSync(CHUNKS_PATH, "utf8"));
    cachedIndex = mergeFaqChunks({
      model: null,
      createdAt: null,
      chunks: (chunks.chunks || chunks).map((c) => ({
        id: c.id,
        title: c.title,
        source: c.source,
        text: c.text,
        embedding: null,
      })),
    });
    return cachedIndex;
  }
  throw new Error("No knowledge/index.json or knowledge/chunks.json found. Run npm run index.");
}

export function getIndexStats() {
  const index = loadIndex();
  const withEmb = index.chunks.filter((c) => Array.isArray(c.embedding)).length;
  const faqs = loadFaqs();
  return {
    chunks: index.chunks.length,
    embedded: withEmb,
    faqs: faqs.length,
    model: index.model || null,
    createdAt: index.createdAt || null,
  };
}

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

function hasOpenAiKey() {
  const key = process.env.OPENAI_API_KEY;
  return Boolean(key && !key.includes("your-key"));
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

/**
 * Match user question against curated FAQ questions.
 * Returns the best FAQ when confidence is high enough.
 */
export function matchFaq(question, threshold = Number(process.env.FAQ_MATCH_THRESHOLD || 0.55)) {
  const faqs = loadFaqs();
  if (!faqs.length) return null;

  const qTokens = tokenize(question);
  const qLower = question.toLowerCase().trim();
  let best = null;

  for (const faq of faqs) {
    const faqQ = String(faq.question || "");
    const faqQLower = faqQ.toLowerCase();
    if (!faqQ) continue;

    if (faqQLower === qLower) {
      return { faq, score: 1, reason: "exact" };
    }

    const kw = keywordScore(question, faqQ);
    const jac = jaccard(qTokens, tokenize(faqQ));
    const answerBoost = keywordScore(question, faq.answer) * 0.15;
    const groupBoost =
      faq.group && qLower.includes(String(faq.group).toLowerCase().split("&")[0].trim())
        ? 0.05
        : 0;
    const score = Math.min(1, kw * 0.55 + jac * 0.4 + answerBoost + groupBoost);

    if (!best || score > best.score) {
      best = { faq, score, reason: "fuzzy" };
    }
  }

  if (!best || best.score < threshold) return null;
  return best;
}

/**
 * Turn stiff FAQ / draft copy into a consultative sales reply.
 */
export function toSalesVoice(raw, { question = "", group = "" } = {}) {
  let text = String(raw || "")
    .replace(/\u2013|\u2014|\u2212/g, "-")
    .replace(/\u00d7/g, "x")
    .trim();
  if (!text) return REFUSAL;

  // Drop internal review / disclaimer sentences
  text = text
    .replace(/\s*(?:Please\s+)?[Cc]onfirm[^.?!]*(?:[.?!]|$)/g, " ")
    .replace(/\s*[Mm]arketing should approve[^.?!]*(?:[.?!]|$)/g, " ")
    .replace(/\s*[Bb]efore publishing[^.?!]*(?:[.?!]|$)/g, " ")
    .replace(/\s*[Aa]ny numerical or guaranteed claim[^.?!]*(?:[.?!]|$)/g, " ")
    .replace(/\s*[Dd]o not share credentials[^.?!]*(?:[.?!]|$)/g, " ")
    .replace(/\s*[Tt]he solution team must confirm[^.?!]*(?:[.?!]|$)/g, " ")
    .replace(/\s*[Ee]xact capabilities depend on tools[^.?!]*(?:[.?!]|$)/g, " ");

  // Third-person / meta website wording -> sales "we"
  text = text
    .replace(/\bCache Digitech describes itself as\b/gi, "We're")
    .replace(/\bIts website presents\b/gi, "We help enterprises with")
    .replace(/\bThe Cache Digitech website identifies\b/gi, "We work with")
    .replace(/\bThe website advertises\b/gi, "We offer")
    .replace(/\bThe website describes\b/gi, "We offer")
    .replace(/\bThe website emphasizes\b/gi, "We focus on")
    .replace(/\bThe website presents\b/gi, "We bring")
    .replace(/\bThe website references\b/gi, "You'll find us in")
    .replace(/\bThe company profile references\b/gi, "We operate from")
    .replace(/\bwithin its cloud offering\b/gi, "as part of our cloud practice")
    .replace(/\bCache Digitech\b/g, "we");

  // Grammar cleanup after "we" substitutions
  text = text
    .replace(/\bwe describes\b/gi, "we describe")
    .replace(/\bwe offers\b/gi, "we offer")
    .replace(/\bwe helps\b/gi, "we help")
    .replace(/\bwe provides\b/gi, "we provide")
    .replace(/\bwe works\b/gi, "we work")
    .replace(/\bwe supports\b/gi, "we support")
    .replace(/\bwe operates\b/gi, "we operate")
    .replace(/\bwe identifies\b/gi, "we identify")
    .replace(/\bA we\b/g, "We")
    .replace(/\b\. we\b/g, ". We")
    .replace(/^we\b/i, "We")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\.\s*\./g, ".")
    .trim();

  if (!text) return REFUSAL;

  // Soft consultative close when the reply is purely factual
  const hasCta = /contact|reach|email|call|connect|happy to|glad to|let'?s talk|info@/i.test(
    text
  );
  const q = String(question || "").toLowerCase();
  const isDefinition = /^(what is|what are|define)\b/i.test(q.trim());
  const wantsCta =
    !isDefinition &&
    (/offer|service|partner|price|cost|support|help|work with|do you|can you|which cloud|where does|what does/i.test(
      q
    ) ||
      /Cloud|Corporate|Commercial|Managed/i.test(String(group || "")));
  if (!hasCta && wantsCta && text.length < 420) {
    text = `${text} If useful, I can connect you with our team at info@cachedigitech.com.`;
  }

  return text;
}

function formatFaqReply(faq, question = "") {
  return toSalesVoice(faq.answer, {
    question: question || faq.question,
    group: faq.group,
  });
}

function formatChunkReply(matches, question = "") {
  const top = matches[0]?.chunk;
  if (!top) return REFUSAL;
  const text = String(top.text || "");
  const answerMatch = text.match(/Answer:\s*([\s\S]+)/i);
  const raw = answerMatch
    ? answerMatch[1].trim()
    : text.replace(/^FAQ Group:.*\nTopic:.*\nQuestion:.*\n/i, "").trim();
  return toSalesVoice(raw || REFUSAL, { question });
}

export async function answerChat({ messages }) {
  const index = loadIndex();
  const threshold = Number(process.env.SIMILARITY_THRESHOLD || 0.22);
  const topK = Number(process.env.TOP_K || 6);

  const history = Array.isArray(messages) ? messages.slice(-12) : [];
  const lastUser = [...history].reverse().find((m) => m?.role === "user");
  const question = String(lastUser?.content || "").trim();
  if (!question) {
    return { reply: REFUSAL, refused: true, scores: [] };
  }

  // 1) Curated FAQ match - works without OpenAI
  const faqHit = matchFaq(question);
  if (faqHit) {
    return {
      reply: formatFaqReply(faqHit.faq, question),
      refused: false,
      mode: "faq",
      bestScore: faqHit.score,
      scores: [
        {
          id: faqHit.faq.id,
          title: faqHit.faq.question,
          score: Number(faqHit.score.toFixed(4)),
        },
      ],
    };
  }

  const hasEmbeddings = index.chunks.some((c) => Array.isArray(c.embedding));
  const canUseOpenAi = hasOpenAiKey();

  let queryEmbedding = null;
  let client = null;
  if (canUseOpenAi && hasEmbeddings) {
    client = getClient();
    const embeddingModel =
      index.model || process.env.EMBEDDING_MODEL || "text-embedding-3-small";
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

  // 2) Without OpenAI: sales-voiced chunk / FAQ answer
  if (!canUseOpenAi) {
    return {
      reply: formatChunkReply(matches, question),
      refused: false,
      mode: "keyword",
      bestScore: best,
      scores: matches.map((m) => ({
        id: m.chunk.id,
        title: m.chunk.title,
        score: Number(m.score.toFixed(4)),
      })),
    };
  }

  // 3) OpenAI grounded sales reply
  if (!client) client = getClient();
  const model = process.env.CHAT_MODEL || "gpt-4o-mini";
  const context = matches
    .map(
      (m, i) =>
        `[${i + 1}] ${m.chunk.title} (${m.chunk.source})\n${m.chunk.text}`
    )
    .join("\n\n");

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.45,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "system",
        content: `CONTEXT:\n${context}`,
      },
      ...history
        .filter((m) => m?.role === "user" || m?.role === "assistant")
        .map((m) => ({
          role: m.role,
          content: String(m.content || "").slice(0, 4000),
        })),
    ],
  });

  const reply = completion.choices?.[0]?.message?.content?.trim() || REFUSAL;

  return {
    reply,
    refused: false,
    mode: "rag",
    bestScore: best,
    scores: matches.map((m) => ({
      id: m.chunk.id,
      title: m.chunk.title,
      score: Number(m.score.toFixed(4)),
    })),
  };
}
