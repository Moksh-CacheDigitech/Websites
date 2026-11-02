import React from 'react';

const LINK_RE =
  /(https?:\/\/[^\s<]+[^.,;:!?\s)]|[\w.+-]+@[\w-]+\.[\w.-]+|\+?\d[\d\s()-]{8,}\d)/g;

const ABBREVIATIONS = [
  'Pvt.',
  'Ltd.',
  'Inc.',
  'Corp.',
  'Co.',
  'LLC.',
  'Mr.',
  'Mrs.',
  'Ms.',
  'Dr.',
  'Prof.',
  'Sr.',
  'Jr.',
  'vs.',
  'etc.',
  'e.g.',
  'i.e.',
  'U.S.',
  'U.K.',
  'U.A.E.',
  'No.',
  'Dept.',
  'Fig.',
  'Vol.',
  'St.',
  'Ave.',
  'Rd.',
  'approx.',
];

/** Protect abbreviations so sentence splitting does not break "Pvt. Ltd.". */
function protectAbbreviations(text) {
  let out = text;
  const saved = [];
  for (const abbr of ABBREVIATIONS) {
    const re = new RegExp(abbr.replace(/\./g, '\\.'), 'gi');
    out = out.replace(re, (match) => {
      const token = `§ABBR${saved.length}§`;
      saved.push(match);
      return token;
    });
  }
  // Single-letter initials: "A. Singh" style mid-name periods
  out = out.replace(/\b([A-Z])\.(?=\s+[A-Z])/g, (match) => {
    const token = `§ABBR${saved.length}§`;
    saved.push(match);
    return token;
  });
  return { text: out, saved };
}

function restoreAbbreviations(text, saved) {
  return text.replace(/§ABBR(\d+)§/g, (_, idx) => saved[Number(idx)] || '');
}

function mergeBrokenContinuations(paragraphs) {
  const out = [];
  for (const raw of paragraphs) {
    const p = raw.trim();
    if (!p) continue;
    const prev = out[out.length - 1];
    const continuesAbbr = /^(Ltd\.|Inc\.|Corp\.|Co\.|LLC|Pvt\.|Ltd)\b/i.test(p);
    const continuesLower = /^[a-z]/.test(p);
    const prevLooksCut =
      prev &&
      (/[A-Za-z]$/.test(prev.trim()) ||
        /\bPvt\.?$/i.test(prev.trim()) ||
        /\b(?:Inc|Corp|Co|Mr|Mrs|Ms|Dr)\.?$/i.test(prev.trim()));

    if (prev && (continuesAbbr || (continuesLower && prevLooksCut))) {
      out[out.length - 1] = `${prev} ${p}`;
    } else {
      out.push(p);
    }
  }
  return out;
}

/** Turn long FAQ replies into readable paragraphs without breaking abbreviations. */
function normalizeContent(content) {
  let text = String(content || '')
    .replace(/\r\n/g, '\n')
    .replace(/\u2013|\u2014|\u2212/g, '-')
    .replace(/\u00d7/g, 'x')
    .replace(/[ \t]+\n/g, '\n')
    .trim();

  // Collapse accidental single newlines inside a sentence into spaces,
  // keep intentional blank-line paragraph breaks.
  text = text.replace(/([^\n])\n(?!\n)/g, '$1 ').replace(/[ \t]{2,}/g, ' ');

  const { text: protectedText, saved } = protectAbbreviations(text);

  let working = protectedText;
  if (!/\n\n/.test(working) && working.length > 160) {
    working = working.replace(/([.!?])\s+(?=[A-Z0-9])/g, '$1\n\n');
  }

  working = restoreAbbreviations(working, saved);

  let paragraphs = working
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  paragraphs = mergeBrokenContinuations(paragraphs);

  // Prefer 2-4 short paragraphs for long answers; avoid one-sentence-per-block spam
  if (paragraphs.length > 5) {
    const compressed = [];
    let buf = '';
    for (const p of paragraphs) {
      if (!buf) {
        buf = p;
        continue;
      }
      if ((buf + ' ' + p).length < 220) {
        buf = `${buf} ${p}`;
      } else {
        compressed.push(buf);
        buf = p;
      }
    }
    if (buf) compressed.push(buf);
    paragraphs = compressed;
  }

  return paragraphs.join('\n\n');
}

function linkifySegment(text, keyPrefix) {
  const nodes = [];
  let last = 0;
  let match;
  let i = 0;
  const re = new RegExp(LINK_RE.source, 'g');
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const isUrl = /^https?:\/\//i.test(token);
    const isEmail = token.includes('@') && !isUrl;
    const href = isUrl ? token : isEmail ? `mailto:${token}` : `tel:${token.replace(/[^\d+]/g, '')}`;
    nodes.push(
      <a
        key={`${keyPrefix}-a-${i}`}
        href={href}
        className="cd-chat-link"
        target={isUrl ? '_blank' : undefined}
        rel={isUrl ? 'noopener noreferrer' : undefined}
      >
        {token}
      </a>
    );
    last = match.index + token.length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Render light markdown (bold + autolinks) without showing raw * markers. */
function renderInline(text, keyPrefix) {
  const nodes = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match;
  let i = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(...linkifySegment(text.slice(last, match.index), `${keyPrefix}-t${i}`));
    }
    nodes.push(
      <strong key={`${keyPrefix}-b-${i}`} className="cd-chat-strong">
        {match[1]}
      </strong>
    );
    last = match.index + match[0].length;
    i += 1;
  }
  if (last < text.length) {
    nodes.push(...linkifySegment(text.slice(last), `${keyPrefix}-t${i}`));
  }
  return nodes;
}

/** Detect a trailing "Our work spans A, B, and C." style list and render as bullets. */
function extractTrailingList(paragraph) {
  const m = paragraph.match(
    /^(.*?\b(?:spans|include|includes|cover|covers|offer|offers)\b[:\s]+)(.+)$/i
  );
  if (!m) return null;
  const intro = m[1].trim();
  const rest = m[2].trim().replace(/\.$/, '');
  const parts = rest
    .split(/\s*,\s*|\s+and\s+/i)
    .map((p) => p.trim())
    .filter((p) => p.length > 1 && p.length < 60);
  if (parts.length < 3) return null;
  return { intro: intro.replace(/[:\s]+$/, ''), items: parts };
}

function ChatMessageContent({ content }) {
  const paragraphs = normalizeContent(content)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const blocks = [];
  let listItems = [];
  let listType = null;

  const flushList = () => {
    if (!listItems.length) return;
    const Tag = listType === 'ol' ? 'ol' : 'ul';
    const listClass =
      listType === 'ol' ? 'cd-chat-list cd-chat-list--ol' : 'cd-chat-list cd-chat-list--ul';
    blocks.push(
      <Tag key={`list-${blocks.length}`} className={listClass}>
        {listItems.map((item, idx) => (
          <li key={idx} className="cd-chat-list-item">
            {renderInline(item, `li-${blocks.length}-${idx}`)}
          </li>
        ))}
      </Tag>
    );
    listItems = [];
    listType = null;
  };

  paragraphs.forEach((paragraph, pIdx) => {
    const lines = paragraph.split('\n');
    const isPureList = lines.every((l) => /^\d+\.\s+/.test(l.trim()) || /^[-*•]\s+/.test(l.trim()));

    if (isPureList) {
      lines.forEach((rawLine) => {
        const line = rawLine.trim();
        const numbered = line.match(/^\d+\.\s+(.*)$/);
        const bulleted = line.match(/^[-*•]\s+(.*)$/);
        if (numbered) {
          if (listType && listType !== 'ol') flushList();
          listType = 'ol';
          listItems.push(numbered[1]);
        } else if (bulleted) {
          if (listType && listType !== 'ul') flushList();
          listType = 'ul';
          listItems.push(bulleted[1]);
        }
      });
      flushList();
      return;
    }

    flushList();

    const listed = extractTrailingList(paragraph);
    if (listed) {
      blocks.push(
        <p key={`p-${pIdx}`} className="cd-chat-p">
          {renderInline(`${listed.intro}:`, `p-${pIdx}`)}
        </p>
      );
      blocks.push(
        <ul key={`plist-${pIdx}`} className="cd-chat-list cd-chat-list--ul">
          {listed.items.map((item, idx) => (
            <li key={idx} className="cd-chat-list-item">
              {renderInline(item, `plist-${pIdx}-${idx}`)}
            </li>
          ))}
        </ul>
      );
      return;
    }

    blocks.push(
      <p key={`p-${pIdx}`} className="cd-chat-p">
        {renderInline(paragraph, `p-${pIdx}`)}
      </p>
    );
  });

  flushList();

  return <div className="cd-chat-rich">{blocks}</div>;
}

export default ChatMessageContent;
