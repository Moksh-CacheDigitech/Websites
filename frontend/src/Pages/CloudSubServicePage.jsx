import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle, Cloud, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  cloudSubPageBySlug,
  isCloudSubPageSlug,
  resolveCloudSubPageSlug,
} from "../data/cloudSubPages";
import NotFoundPage from "./NotFoundPage";

export default function CloudSubServicePage() {
  const { slug } = useParams();

  if (!slug || !isCloudSubPageSlug(slug)) {
    return <NotFoundPage />;
  }

  const resolved = resolveCloudSubPageSlug(slug);
  if (!resolved) {
    return <NotFoundPage />;
  }
  const page = cloudSubPageBySlug[resolved];
  const introParagraphs = page.introParagraphs ?? [];
  const hasHighlights = page.highlights?.length > 0;
  const hasOfferings = page.offerings?.length > 0;
  const listSections = page.listSections ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] md:min-h-[70vh] scroll-mt-0 flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${page.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-10 sm:pb-14">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/15 border border-white/25 rounded-full text-white text-[10px] sm:text-xs font-medium w-fit mb-3">
            <Cloud className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            Cloud services
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-4xl">
            {page.title}
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
            {page.tagline}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/contactus"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              Talk to us
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              to="/cloudservices"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg border border-white/30 transition-colors"
            >
              All cloud services
            </Link>
          </div>
        </div>
      </section>

      {/* Intro + image */}
      <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.06),transparent)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-600 text-[11px] sm:text-xs font-medium">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Overview
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                <span className="text-red-600">{page.shortTitle}</span>
                <span className="text-gray-900"> with Cache Digitech</span>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                {page.intro}
              </p>
              {introParagraphs.map((para) => (
                <p
                  key={para.slice(0, 48)}
                  className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed"
                >
                  {para}
                </p>
              ))}
              {hasHighlights && (
                <ul className="space-y-2.5 sm:space-y-3">
                  {page.highlights.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-gray-600"
                    >
                      <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
                <div className="absolute inset-0 bg-linear-to-tr from-red-600/15 to-transparent pointer-events-none z-10" />
                <ImageWithFallback
                  src={page.bodyImage}
                  alt={`${page.title} - Cache Digitech`}
                  className="w-full aspect-4/3 sm:aspect-16/10 object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pointer list sections */}
      {listSections.map((sectionDef, index) => (
        <section
          key={sectionDef.title}
          className={`py-10 sm:py-14 lg:py-16 px-4 sm:px-6 ${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-600 text-[11px] sm:text-xs font-medium mb-3">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Key Offerings
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {sectionDef.title}
              </h2>
              {sectionDef.intro && (
                <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {sectionDef.intro}
                </p>
              )}
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-5xl mx-auto">
              {sectionDef.items.map((item) => (
                <li
                  key={item}
                  className={`flex items-start gap-2.5 text-sm sm:text-base text-gray-700 rounded-xl px-4 py-3 border border-gray-100 shadow-sm ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {sectionDef.footnote && (
              <p className="mt-6 text-center text-xs sm:text-sm text-gray-500 max-w-3xl mx-auto">
                {sectionDef.footnote}
              </p>
            )}
          </div>
        </section>
      ))}

      {/* Offerings cards */}
      {hasOfferings && (
        <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-600 text-[11px] sm:text-xs font-medium mb-3">
                <Cloud className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                What we deliver
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Core offerings
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {page.offerings.map((o) => {
                const Icon = o.icon;
                return (
                  <div
                    key={o.title}
                    className="group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-red-100 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-linear-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-white" aria-hidden />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                      {o.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {o.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.12),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Ready to move forward with{" "}
            <span className="text-red-400">{page.title}</span>?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
            Book a 15-minute strategy session with our Multi-Cloud Solutions
            Architects and claim your Complimentary 14-Day Cloud Cost Assessment.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Link
              to="/contactus"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Claim Your Free Cloud Audit
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              to="/contactus"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white/90 text-sm font-semibold rounded-lg border border-white/25 hover:bg-white/10 transition-colors"
            >
              Schedule Architecture Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
