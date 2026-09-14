import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, User, Clock, Tag, ArrowLeft } from 'lucide-react';
import { HARDCODED_BLOGS } from '../data/blogsAndHighlights';
import { fetchPostById } from '../lib/sanityQueries';
import PortableTextBody from '../components/PortableTextBody';
import NotFoundPage from './NotFoundPage';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPostById(id).then((cmsPost) => {
      if (cancelled) return;
      if (cmsPost) {
        setPost(cmsPost);
      } else {
        const local = HARDCODED_BLOGS.find(
          (blog) => String(blog.id) === String(id) || blog.slug === id,
        );
        setPost(local || null);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium mt-16 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {post.image && (
            <div className="rounded-xl overflow-hidden bg-gray-100 shadow-md shrink-0">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-full min-h-[280px] object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          )}

          <div className={`min-w-0 ${!post.image ? 'lg:col-span-2' : ''}`}>
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {formatDate(post.date)}
                </span>
                {post.readTime && (
                  <span className="inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                    <Clock className="w-4 h-4 shrink-0" />
                    {post.readTime}
                  </span>
                )}
                {post.category && (
                  <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 rounded-lg px-3 py-1.5">
                    <Tag className="w-4 h-4 shrink-0" />
                    {post.category}
                  </span>
                )}
                {post.author && (
                  <span className="inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                    <User className="w-4 h-4 shrink-0" />
                    {post.author}
                  </span>
                )}
              </div>
            </header>
            {post.body ? (
              <PortableTextBody value={post.body} />
            ) : (
              <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                {post.content ?? post.excerpt}
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
