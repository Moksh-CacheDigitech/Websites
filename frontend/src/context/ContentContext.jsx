import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchPageContent } from '../lib/sanityQueries';

const ContentContext = createContext({ content: null, loading: false, error: null });

/** Loads page sections from Sanity CMS for useContent(pageId, sectionId). */
export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPageContent()
      .then((data) => {
        if (!cancelled) {
          setContent(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setContent(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error }}>
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
