import { useNavigate } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { HARDCODED_BLOGS } from "../../data/blogsAndHighlights";
import StudioShowcaseStack from "./StudioShowcaseStack";

export function BlogSection() {
  const posts = [...HARDCODED_BLOGS].sort((a, b) => a.id - b.id);
  const navigate = useNavigate();

  const stackItems = posts.map((post) => ({
    id: post.id,
    image: post.image,
    title: post.title,
    date: post.date,
    readTime: post.readTime,
    author: post.author,
  }));

  const navRailClassName = "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full";

  return (
    <section className="pt-8 lg:pt-10 pb-0 bg-gray-50 scroll-mt-20" id="blog">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            <span className="text-red-600">Blogs</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends, insights, and best practices in system
            integration and digital transformation.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center py-12 text-gray-500">
          No blog posts yet.
        </div>
      ) : (
        <div className="relative w-full pb-8 md:pb-10 overflow-visible">
          <StudioShowcaseStack
            fullWidth
            navRailClassName={navRailClassName}
            items={stackItems}
            defaultPosition="center"
            borderRadius={12}
            shadowStrength={1}
            backgroundOpacity={0.55}
            onItemClick={(item) => navigate(`/blog/${item.id}`)}
              renderOverlay={(item) => (
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-linear-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
                  <div className="flex items-center text-xs text-white/80 mb-2">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    <span>{item.date}</span>
                    <span className="mx-1.5">•</span>
                    <span>{item.readTime}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-xs text-white/70">
                    <User className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    <span className="truncate">{item.author}</span>
                  </div>
                </div>
              )}
            />
        </div>
      )}
    </section>
  );
}
