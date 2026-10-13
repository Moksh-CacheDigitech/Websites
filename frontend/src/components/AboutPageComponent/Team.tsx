import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image: string;
  link?: string;
  imageScale?: number;
  imageOffsetY?: number;
}

const TeamSection: React.FC = () => {
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());
  const cardRefs = useRef<Map<number, HTMLElement | null>>(new Map());

  const teamMembers: TeamMember[] = [
    { id: 1, name: "Prarthana Gupta", designation: "Chairperson & Managing Director", image: "/team/prarthna.webp", link: "https://www.linkedin.com/in/prarthana-gupta-112510a5/", imageScale: 1.1 },
    { id: 2, name: "Shraddha Gupta", designation: "Chief Executive Officer", image: "/team/shraddha.webp", link: "https://www.linkedin.com/in/shraddha--gupta/", imageScale: 1 },
    { id: 4, name: "Vinod Pulyani", designation: "Chief Finance Officer", image: "/team/Vinod.webp", link: "https://www.linkedin.com/in/vinod-pulyani-6701426/", imageScale: 1.20 },
    { id: 5, name: "Sourabh Srivastava", designation: "Chief Information Security Officer & Data Protection Officer", image: "/team/saurabh.webp", link: "https://www.linkedin.com/in/sourabh-kumar-srivastava-6b078b148/", imageScale: 1.20, imageOffsetY: 8 },
    { id: 8, name: "Naresh Kumar", designation: "Vice President - Infra", image: "/team/naresh.webp", link: "/", imageScale: 1 },
    { id: 9, name: "Anurag Singh", designation: "Vice President - Operation", image: "/team/anurag.webp", link: "/", imageScale: 1 },
    { id: 14, name: "Varun Vohra", designation: "Pre-Sales Manager", image: "/team/varun.webp", link: "https://www.linkedin.com/in/varun-vohra-926bb4365?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", imageScale: 1 },
    { id: 6, name: "Manohar Singh", designation: "Senior Sales Manager", image: "/team/manohar.webp", link: "https://www.linkedin.com/in/manohar-singh-51b05b131?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", imageScale: 1 },
    { id: 7, name: "Geetanjali Kumar", designation: "Vice President - Legal & Compliance", image: "/team/geetanjli.webp", link: "https://www.linkedin.com/in/geetanjali-s-kumar-entity-compliance-manager-apac/", imageScale: 1 },
    { id: 10, name: "Shweta Gaba", designation: "General Manager - HR", image: "/team/sweta.webp", link: "https://www.linkedin.com/in/shweta-gaba-29ab80139/", imageScale: 1 },
    { id: 11, name: "Mehak Verma", designation: "Manager - Employee Relation", image: "/team/mehak.webp", link: "https://www.linkedin.com/in/mehak-926174190?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", imageScale: 1.10 },
    { id: 15, name: "Gajendra Dixit", designation: "Manager - Supply Chain ", image: "/team/gajender.webp", link: "/", imageScale: 1.20 },
    { id: 16, name: "Kapil Chaudhary", designation: "Manager -Supply Chain ", image: "/team/kapil.webp", link: "/", imageScale: 1.20 },
  ];

  const getColumns = (screen: "mobile" | "desktop") => (screen === "mobile" ? 2 : 4);

  useEffect(() => {
    const observers = new Map<number, IntersectionObserver>();
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.1,
    };

    teamMembers.forEach((member) => {
      const el = cardRefs.current.get(member.id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleIds((prev) => new Set(prev).add(member.id));
          }
        },
        observerOptions
      );
      observer.observe(el);
      observers.set(member.id, observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [teamMembers.length]);

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden min-h-screen" style={{ background: "linear-gradient(180deg, #fafbfc 0%, #f1f5f9 50%, #fafbfc 100%)" }}>
      {/* Ambient blurs - match home page sections */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-red-100/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-red-50/15 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section label + heading - aligned with home "Explore" / "Our Alliances" style */}
        <div
          className="text-center py-10 sm:py-14 mb-12 sm:mb-16"
          data-cursor-element-id="team-stage"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-light text-(--apple-black) tracking-tight leading-[1.08] max-w-2xl mx-auto">
            Leadership team
          </h2>
          <p className="mt-5 text-base sm:text-lg text-(--apple-gray) max-w-xl mx-auto leading-relaxed">
            Meet the experienced professionals driving our company's success.
          </p>
        </div>

        {/* Grid - leaders reveal one by one on scroll */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 pointer-events-auto">
          {teamMembers.map((member, idx) => {
            const desktopCols = getColumns("desktop");
            const mobileCols = getColumns("mobile");
            const desktopItemsInLastRow = teamMembers.length % desktopCols || desktopCols;
            const mobileItemsInLastRow = teamMembers.length % mobileCols || mobileCols;
            const isInDesktopLastRow = idx >= teamMembers.length - desktopItemsInLastRow;
            const isInMobileLastRow = idx >= teamMembers.length - mobileItemsInLastRow;
            const isVisible = visibleIds.has(member.id);
            const hasLinkedIn = member.link && member.link !== "/" && member.link.startsWith("http");

            return (
              <article
                key={member.id}
                ref={(el) => {
                  cardRefs.current.set(member.id, el);
                }}
                className={`
                  group flex flex-col bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100/80 shadow-sm
                  overflow-hidden w-full max-w-[280px] justify-self-center
                  transition-all duration-500 ease-out hover:shadow-xl hover:border-red-100/60 hover:-translate-y-1
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                  ${isInDesktopLastRow ? "lg:justify-self-center" : ""}
                  ${isInMobileLastRow ? "justify-self-center" : ""}
                `}
                style={{
                  transitionDelay: isVisible ? `${Math.min(idx * 80, 400)}ms` : "0ms",
                }}
              >
                {/* Image */}
                <Link
                  to={member.link || "#"}
                  target={member.link?.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="relative block aspect-square overflow-hidden bg-gray-50"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{
                      transform: `scale(${member.imageScale || 1})${member.imageOffsetY ? ` translateY(${member.imageOffsetY}%)` : ""}`,
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Link>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 text-center">
                  <h3
                    className="text-sm sm:text-base font-semibold text-(--apple-black) leading-tight"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="mt-1.5 text-xs sm:text-sm text-(--apple-gray) leading-snug"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                    }}
                  >
                    {member.designation}
                  </p>
                  {hasLinkedIn && (
                    <a
                      href={member.link!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
                      aria-label={`${member.name} on LinkedIn`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src="/linkedin.webp" alt="" className="w-4 h-4 opacity-80" aria-hidden decoding="async" loading="lazy" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;