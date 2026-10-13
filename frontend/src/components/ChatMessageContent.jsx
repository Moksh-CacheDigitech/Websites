import React from 'react';

/** Render light markdown (bold + lists) without showing raw * markers. */
function renderInline(text, keyPrefix) {
  const nodes = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match;
  let i = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    nodes.push(
      <strong key={`${keyPrefix}-b-${i}`} className="font-semibold">
        {match[1]}
      </strong>
    );
    last = match.index + match[0].length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function ChatMessageContent({ content }) {
  const lines = String(content || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let listItems = [];
  let listType = null;

  const flushList = () => {
    if (!listItems.length) return;
    const Tag = listType === 'ol' ? 'ol' : 'ul';
    const listClass =
      listType === 'ol'
        ? 'list-decimal pl-5 my-1.5 space-y-1.5'
        : 'list-disc pl-5 my-1.5 space-y-1.5';
    blocks.push(
      <Tag key={`list-${blocks.length}`} className={listClass}>
        {listItems.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {renderInline(item, `li-${blocks.length}-${idx}`)}
          </li>
        ))}
      </Tag>
    );
    listItems = [];
    listType = null;
  };

  lines.forEach((rawLine, lineIdx) => {
    const line = rawLine.trimEnd();
    const numbered = line.match(/^\d+\.\s+(.*)$/);
    const bulleted = line.match(/^[-*•]\s+(.*)$/);

    if (numbered) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(numbered[1]);
      return;
    }
    if (bulleted) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(bulleted[1]);
      return;
    }

    flushList();

    if (!line.trim()) {
      if (blocks.length) {
        blocks.push(<div key={`sp-${lineIdx}`} className="h-2" aria-hidden />);
      }
      return;
    }

    blocks.push(
      <p key={`p-${lineIdx}`} className="leading-relaxed m-0">
        {renderInline(line, `p-${lineIdx}`)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-0">{blocks}</div>;
}

export default ChatMessageContent;
