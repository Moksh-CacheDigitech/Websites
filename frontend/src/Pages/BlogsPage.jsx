import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Calendar, User } from "lucide-react";
import { HARDCODED_BLOGS } from "../data/blogsAndHighlights";

export default function BlogsPage() {
  const posts = [...HARDCODED_BLOGS].sort((a, b) => a.id - b.id);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-24 lg:pt-32 pb-12 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              <span className="text-red-600">Blogs</span>
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-6" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest trends, insights, and best practices in system integration and digital transformation.
            </p>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">No blog posts yet.</div>
          )}
          {posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, idx) => (
                <Card
                  key={post.id}
                  className="h-full transition-all duration-300 group cursor-pointer border-0 shadow-md hover:shadow-lg"
                  onClick={() => navigate(`/blog/${post.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/blog/${post.id}`);
                    }
                  }}
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-200"
                        loading={idx < 6 ? 'eager' : 'lazy'}
                        fetchPriority={idx < 3 ? 'high' : 'low'}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      <span>{post.date}</span>
                      <span className="mx-1.5">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-base font-bold text-black mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-xs text-gray-500 min-w-0 mt-auto">
                      <User className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">{post.author}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
