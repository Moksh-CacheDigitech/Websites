import faqPayload from '../data/faqs.json';

const FAQS = Array.isArray(faqPayload?.faqs) ? faqPayload.faqs : [];
const MATCH_THRESHOLD = 0.48;

const REFUSAL =
  "I'd love to help with Cache Digitech services, solutions, and how we can support your team. For anything outside that, reach us at info@cachedigitech.com or https://www.cachedigitech.com/contactus - happy to connect you with the right person.";

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 2);
}

function keywordScore(query, text) {
  const q = tokenize(query);
  if (!q.length) return 0;
  const hay = String(text || '').toLowerCase();
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

export function toSalesVoice(raw, { question = '', group = '' } = {}) {
  let text = String(raw || '')
    .replace(/\u2013|\u2014|\u2212/g, '-')
    .replace(/\u00d7/g, 'x')
    .trim();
  if (!text) return REFUSAL;

  text = text
    .replace(/\s*(?:Please\s+)?[Cc]onfirm[^.?!]*(?:[.?!]|$)/g, ' ')
    .replace(/\s*[Mm]arketing should approve[^.?!]*(?:[.?!]|$)/g, ' ')
    .replace(/\s*[Bb]efore publishing[^.?!]*(?:[.?!]|$)/g, ' ')
    .replace(/\s*[Aa]ny numerical or guaranteed claim[^.?!]*(?:[.?!]|$)/g, ' ')
    .replace(/\s*[Dd]o not share credentials[^.?!]*(?:[.?!]|$)/g, ' ')
    .replace(/\s*[Tt]he solution team must confirm[^.?!]*(?:[.?!]|$)/g, ' ')
    .replace(/\s*[Ee]xact capabilities depend on tools[^.?!]*(?:[.?!]|$)/g, ' ');

  text = text
    .replace(/\bCache Digitech describes itself as\b/gi, "We're")
    .replace(/\bIts website presents\b/gi, 'We help enterprises with')
    .replace(/\bThe Cache Digitech website identifies\b/gi, 'We work with')
    .replace(/\bThe website advertises\b/gi, 'We offer')
    .replace(/\bThe website describes\b/gi, 'We offer')
    .replace(/\bThe website emphasizes\b/gi, 'We focus on')
    .replace(/\bThe website presents\b/gi, 'We bring')
    .replace(/\bThe website references\b/gi, "You'll find us in")
    .replace(/\bThe company profile references\b/gi, 'We operate from')
    .replace(/\bwithin its cloud offering\b/gi, 'as part of our cloud practice')
    .replace(
      /\bCache Digitech(?=\s+(?:is|are|was|were|has|have|provides?|offers?|helps?|works?|supports?|operates?|delivers?|serves?)\b)/gi,
      'we'
    );

  text = text
    .replace(/\bwe describes\b/gi, 'we describe')
    .replace(/\bwe offers\b/gi, 'we offer')
    .replace(/\bwe helps\b/gi, 'we help')
    .replace(/\bwe provides\b/gi, 'we provide')
    .replace(/\bwe works\b/gi, 'we work')
    .replace(/\bwe supports\b/gi, 'we support')
    .replace(/\bwe operates\b/gi, 'we operate')
    .replace(/\bwe identifies\b/gi, 'we identify')
    .replace(/\bA we\b/g, 'We')
    .replace(/\b\. we\b/g, '. We')
    .replace(/^we\b/i, 'We')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\S\n]+([,.;:!?])/g, '$1')
    .replace(/\.\s*\./g, '.')
    .trim();

  if (!text) return REFUSAL;

  const hasCta = /contact|reach|email|call|connect|happy to|glad to|let'?s talk|info@/i.test(
    text
  );
  const q = String(question || '').toLowerCase();
  const isDefinition = /^(what is|what are|define)\b/i.test(q.trim());
  const wantsCta =
    !isDefinition &&
    (/offer|service|partner|price|cost|support|help|work with|do you|can you|which cloud|where does|what does/i.test(
      q
    ) ||
      /Cloud|Corporate|Commercial|Managed/i.test(String(group || '')));
  if (!hasCta && wantsCta && text.length < 420) {
    text = `${text} If useful, I can connect you with our team at info@cachedigitech.com.`;
  }

  return text;
}

export function matchFaq(question, threshold = MATCH_THRESHOLD) {
  if (!FAQS.length) return null;

  const qTokens = tokenize(question);
  const qLower = String(question || '')
    .toLowerCase()
    .trim();
  let best = null;

  for (const faq of FAQS) {
    const faqQ = String(faq.question || '');
    if (!faqQ) continue;
    const faqQLower = faqQ.toLowerCase();

    if (faqQLower === qLower) {
      return { faq, score: 1, reason: 'exact' };
    }

    const kw = keywordScore(question, faqQ);
    const jac = jaccard(qTokens, tokenize(faqQ));
    const answerBoost = keywordScore(question, faq.answer) * 0.15;
    const groupBoost =
      faq.group && qLower.includes(String(faq.group).toLowerCase().split('&')[0].trim())
        ? 0.05
        : 0;
    const score = Math.min(1, kw * 0.55 + jac * 0.4 + answerBoost + groupBoost);

    if (!best || score > best.score) {
      best = { faq, score, reason: 'fuzzy' };
    }
  }

  if (!best || best.score < threshold) return null;
  return best;
}

/** Answer a user question from curated FAQs (frontend-only). */
export function answerFromFaqs(question) {
  const q = String(question || '').trim();
  if (!q) return { reply: REFUSAL, refused: true };

  const hit = matchFaq(q);
  if (!hit) return { reply: REFUSAL, refused: true };

  return {
    reply: toSalesVoice(hit.faq.answer, {
      question: q,
      group: hit.faq.group,
    }),
    refused: false,
    faqId: hit.faq.id,
    score: hit.score,
  };
}

export function getFaqStats() {
  return { faqs: FAQS.length };
}
