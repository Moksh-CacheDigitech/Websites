import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { INNOVATION_PROJECTS } from "../data/innovationProjects";
import NotFoundPage from "./NotFoundPage";

const FALLBACK_HERO_IMAGE = "/hero-bg-image.webp";

export default function InnovationsProjectPage() {
  const { slug } = useParams();
  const project = INNOVATION_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return <NotFoundPage />;
  }

  const heroImage = project.image || FALLBACK_HERO_IMAGE;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero with project image - mobile responsive */}
      <section className="relative min-h-[38vh] sm:min-h-[45vh] md:min-h-[50vh] flex flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/85" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full pb-8 sm:pb-10 md:pb-14 pt-20 sm:pt-24">
          <Link
            to="/innovations"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium mb-4 sm:mb-6 py-2 -my-2 transition-colors "
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back to Innovations
          </Link>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight break-words max-w-full">
            {project.name}
          </h1>
          {project.tagline && (
            <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl break-words">
              {project.tagline}
            </p>
          )}
        </div>
      </section>

      {/* Content: on mobile image first, then description */}
      <section className="py-8 sm:py-10 md:py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Image: first on mobile, second column on desktop */}
            <div className="order-first lg:order-last lg:col-span-1 w-full min-w-0">
              <div className="rounded-lg sm:rounded-xl overflow-hidden shadow-lg border border-gray-100 aspect-video sm:aspect-video lg:aspect-square w-full max-h-56 sm:max-h-64 lg:max-h-none">
                <img
                  src={project.image || FALLBACK_HERO_IMAGE}
                  alt=""
                  className="w-full h-full object-cover max-w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="lg:col-span-2 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Overview</h2>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed break-words">
                {project.description}
              </p>
            </div>
          </div>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="mt-10 sm:mt-12 md:mt-16 pt-8 sm:pt-10 md:pt-14 border-t border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Key capabilities</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm md:text-base min-w-0">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-red-600" aria-hidden />
                    </span>
                    <span className="leading-relaxed break-words">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
            <Link
              to="/innovations"
              className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all py-2 text-sm sm:text-base "
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              View all innovation projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
