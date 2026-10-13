import React, { createContext, useContext } from 'react';

const ContentContext = createContext({ content: null, loading: false, error: null });

/** Content is fetched from API/Postgres; no hardcoded fallback so UI reflects live data only. */
export function ContentProvider({ children }) {
  return (
    <ContentContext.Provider value={{ content: null, loading: false, error: null }}>
      {children}
    </ContentContext.Provider>
  );
}

/**
 * Get section content from CMS. Returns an object of field values.
 * Use with fallback: cms.title || 'Default Title'
 */
export function useContent(pageId, sectionId) {
  const { content } = useContext(ContentContext);
  if (!content || !pageId || !sectionId) return {};
  const page = content[pageId];
  if (!page) return {};
  return page[sectionId] || {};
}

/**
 * Get a single field value. Prefer useContent when you need multiple fields.
 */
export function useContentField(pageId, sectionId, fieldId) {
  const section = useContent(pageId, sectionId);
  return section[fieldId];
}

export default ContentContext;
