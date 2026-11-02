/**
 * Embeds knowledge/chunks.json into knowledge/index.json using OpenAI.
 * Requires OPENAI_API_KEY in env or chat-api/.env
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const CHUNKS_PATH = path.join(__dirname, "..", "knowledge", "chunks.json");
const INDEX_PATH = path.join(__dirname, "..", "knowledge", "index.json");
const MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";
const BATCH = 64;

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is required. Set it in chat-api/.env");
    process.exit(1);
  }
  if (!fs.existsSync(CHUNKS_PATH)) {
    console.error("Run npm run extract first.");
    process.exit(1);
  }

  const { chunks } = JSON.parse(fs.readFileSync(CHUNKS_PATH, "utf8"));
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const out = [];

  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const inputs = batch.map((c) => `${c.title}\n${c.text}`.slice(0, 8000));
    const res = await client.embeddings.create({ model: MODEL, input: inputs });
    for (let j = 0; j < batch.length; j += 1) {
      out.push({
        ...batch[j],
        embedding: res.data[j].embedding,
      });
    }
    console.log(`Embedded ${Math.min(i + BATCH, chunks.length)} / ${chunks.length}`);
  }

  const index = {
    model: MODEL,
    createdAt: new Date().toISOString(),
    chunks: out,
  };
  fs.writeFileSync(INDEX_PATH, JSON.stringify(index));
  console.log(`Wrote index with ${out.length} embeddings -> ${INDEX_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
