import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, User, Clock, Tag, ArrowLeft } from 'lucide-react';
import { HARDCODED_BLOGS } from '../data/blogsAndHighlights';
import NotFoundPage from './NotFoundPage';

export default function BlogDetailPage() {
  const { id } = useParams();
  const post = HARDCODED_BLOGS.find((b) => String(b.id) === String(id)) ?? null;

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
          {/* Left: photo */}
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

          {/* Right: title, meta, text (full width when no image) */}
          <div className={`min-w-0 ${!post.image ? 'lg:col-span-2' : ''}`}>
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {post.date}
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
            <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
              {post.content ?? post.excerpt}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
