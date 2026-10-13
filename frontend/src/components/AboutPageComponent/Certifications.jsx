import React from "react";

function Certifications({ sectionOnly = false }) {
  const certifications = [
    { name: "ISO 9001:2015", logo: "/iso9001.webp", description: "Quality Management System" },
    { name: "ISO 27001:2022", logo: "/iso27001.webp", description: "Information Security Management" },
    { name: "MSME Registered", logo: "/msme.webp", description: "Micro, Small & Medium Enterprises" },
    { name: "NISC Registered", logo: "/nisc.webp", description: "National Information Solutions Cooperative" },
    { name: "WEConnect International", logo: "/weconnect.webp", description: "Women-Owned Business Certification" },
  ];

  return (
    <div className={sectionOnly ? "w-full" : "w-full min-h-screen bg-[#fafafa]"}>
      {/* Logos / Certifications - when sectionOnly, used inside Awards & Certifications page */}
      <section
        className="relative pt-8 md:pt-12 pb-8 md:pb-12 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #fafbfc 0%, #f1f5f9 50%, #fafbfc 100%)" }}
        data-framer-name="Logos"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-100/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-red-50/20 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <header className="text-center mb-12 md:mb-14">
            {!sectionOnly && (
              <p className="text-3xl sm:text-4xl font-extrabold tracking-[0.2em] uppercase text-red-500 mb-3">
                Awards
              </p>
            )}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-light text-(--apple-black) tracking-tight leading-[1.08] max-w-2xl mx-auto">
              {sectionOnly ? "Certifications" : "Awards and Recognitions"}
            </h2>
            <div className="mt-4 w-12 h-0.5 bg-red-500/60 rounded-full mx-auto" aria-hidden />
            <p className="mt-6 text-lg md:text-xl text-(--apple-gray) max-w-xl mx-auto leading-relaxed">
              Our certifications and accreditations reflect our commitment to quality, security, and excellence.
            </p>
          </header>

          {/* Certifications / Logos - centered row(s) */}
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="group w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-1rem)] lg:w-[170px] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-lg hover:border-red-100/60 transition-all duration-300"
              >
                <div className="w-full aspect-square max-w-[140px] max-h-[140px] flex items-center justify-center mb-3">
                  <img
                    src={cert.logo}
                    alt={cert.name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-(--apple-black) text-center leading-tight group-hover:text-red-600 transition-colors">
                  {cert.name}
                </span>
                {cert.description && (
                  <span className="mt-1 text-[11px] sm:text-xs text-(--apple-gray) text-center leading-snug line-clamp-2">
                    {cert.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Certifications;
