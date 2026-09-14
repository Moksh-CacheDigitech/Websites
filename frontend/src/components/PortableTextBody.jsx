import { urlFor } from '../lib/sanity'

function renderChildren(children = [], markDefs = []) {
  return children.map((child) => {
    const marks = child.marks || []
    let node = child.text || ''
    for (const mark of marks) {
      if (mark === 'strong') node = <strong key={`${child._key}-strong`}>{node}</strong>
      else if (mark === 'em') node = <em key={`${child._key}-em`}>{node}</em>
      else {
        const def = markDefs.find((item) => item._key === mark)
        if (def?._type === 'link' && def.href) {
          node = (
            <a
              key={`${child._key}-link`}
              href={def.href}
              className="text-red-600 underline underline-offset-2 hover:text-red-700"
            >
              {node}
            </a>
          )
        }
      }
    }
    return <span key={child._key}>{node}</span>
  })
}

function Block({ block }) {
  const content = renderChildren(block.children, block.markDefs)
  if (block.style === 'h2') {
    return <h2 className="text-2xl font-bold text-black mt-8 mb-3">{content}</h2>
  }
  if (block.style === 'h3') {
    return <h3 className="text-xl font-bold text-black mt-6 mb-2">{content}</h3>
  }
  if (block.style === 'blockquote') {
    return (
      <blockquote className="border-l-4 border-red-500 pl-4 italic text-gray-600 my-4">
        {content}
      </blockquote>
    )
  }
  return <p className="mb-4 last:mb-0">{content}</p>
}

export default function PortableTextBody({ value }) {
  if (!value || !Array.isArray(value) || value.length === 0) return null

  const nodes = []
  let listItems = []
  let listType = null

  const flushList = () => {
    if (!listItems.length) return
    const Tag = listType === 'number' ? 'ol' : 'ul'
    nodes.push(
      <Tag
        key={`list-${nodes.length}`}
        className={`mb-4 pl-5 ${listType === 'number' ? 'list-decimal' : 'list-disc'} space-y-1`}
      >
        {listItems.map((item) => (
          <li key={item._key}>{renderChildren(item.children, item.markDefs)}</li>
        ))}
      </Tag>,
    )
    listItems = []
    listType = null
  }

  for (const block of value) {
    if (block._type === 'block' && block.listItem) {
      if (listType && listType !== block.listItem) flushList()
      listType = block.listItem
      listItems.push(block)
      continue
    }
    flushList()
    if (block._type === 'block') {
      nodes.push(<Block key={block._key} block={block} />)
    } else if (block._type === 'image' && block.asset) {
      const src = urlFor(block).width(1400).url()
      nodes.push(
        <img
          key={block._key}
          src={src}
          alt={block.alt || ''}
          className="w-full rounded-xl my-6 object-cover"
        />,
      )
    }
  }
  flushList()

  return <div className="text-gray-700 text-base sm:text-lg leading-relaxed">{nodes}</div>
}
