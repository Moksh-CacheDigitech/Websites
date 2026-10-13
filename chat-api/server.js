import "dotenv/config";
import express from "express";
import cors from "cors";
import { createRateLimiter } from "./src/rateLimit.js";
import { answerChat, getIndexStats, loadIndex } from "./src/rag.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

const allowedOrigins = String(process.env.ALLOWED_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`Origin not allowed: ${origin}`));
    },
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  try {
    const stats = getIndexStats();
    res.json({ ok: true, service: "cachedigitech-chat-api", ...stats });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const chatLimiter = createRateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 20),
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ error: "Server is missing OPENAI_API_KEY." });
      return;
    }
    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required." });
      return;
    }
    const result = await answerChat({ messages });
    res.json({
      reply: result.reply,
      refused: result.refused,
      sources: result.scores || [],
    });
  } catch (err) {
    console.error("[chat]", err);
    res.status(500).json({
      error: "Chat failed. Please try again later.",
    });
  }
});

app.use((err, _req, res, _next) => {
  if (err?.message?.startsWith("Origin not allowed")) {
    res.status(403).json({ error: "Forbidden origin." });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal error." });
});

try {
  loadIndex();
  const stats = getIndexStats();
  console.log(
    `[chat-api] loaded ${stats.chunks} chunks (${stats.embedded} with embeddings)`
  );
} catch (err) {
  console.warn(`[chat-api] knowledge not ready: ${err.message}`);
}

app.listen(PORT, () => {
  console.log(`[chat-api] listening on :${PORT}`);
});
