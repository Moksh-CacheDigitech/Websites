import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { usePlacement } from "../../context/PlacementsContext";
import { navLinks } from "./navLinks";
import LiquidNavigation from "./LiquidNavigation";

/* -- Footer nav: same headings as navbar -- */
const FOOTER_NAV = [
  { heading: "About Us", items: ["Profile of Cache", "Leadership Team", "Our Alliances", "Awards & Certifications", "Innovations", "Leadership Vision", "Blogs"] },
  { heading: "Products", items: ["Cloud", "Cybersecurity", "Data Analytics & AI", "Infra & Networking"] },
  { heading: "Services", items: ["Consulting & Auditing", "Managed Services", "GRC"] },
  { heading: "Industries", items: ["Telecom", "BFSI", "Automobile & Manufacturing", "Retail", "Healthcare & Hospitality", "Governance", "IT & ITES"] },
  { heading: "Contact", items: ["Contact Us"] },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

function getHref(label) {
  const link = navLinks.find((l) => l.label === label);
  if (!link) return "#";
  return link.sectionId ? `${link.route}#${link.sectionId}` : link.route;
}

/* -- Mobile accordion sections (same content as desktop) -- */
const MOBILE_SECTIONS = [
  { heading: "About Us", items: FOOTER_NAV[0].items.map((label) => ({ label, href: getHref(label) })) },
  { heading: "Products", items: FOOTER_NAV[1].items.map((label) => ({ label, href: getHref(label) })) },
  { heading: "Services", items: FOOTER_NAV[2].items.map((label) => ({ label, href: getHref(label) })) },
  { heading: "Industries", items: FOOTER_NAV[3].items.map((label) => ({ label, href: getHref(label) })) },
  {
    heading: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "EPF Notice", href: "/epf-amendment-notice" },
      ...LEGAL_LINKS.map(({ label, href }) => ({ label, href })),
    ],
  },
];

/* -- Social icons data -- */
const SOCIALS = [
  { label: "Twitter", href: "https://x.com/i/flow/login?redirect_after_login=%2Fdigitech_cache", color: "#1DA1F2", d: "M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.63 0-4.66 2.56-4.07 5.09A12.94 12.94 0 013 1.64a4.52 4.52 0 001.39 6.05 4.48 4.48 0 01-2.05-.57v.06c0 2.22 1.57 4.07 3.67 4.49a4.52 4.52 0 01-2.04.08 4.52 4.52 0 004.22 3.14A9.07 9.07 0 012 19.54 12.94 12.94 0 008.29 21c7.55 0 11.68-6.29 11.68-11.75 0-.18 0-.35-.01-.53A8.18 8.18 0 0023 3z" },
  { label: "Instagram", href: "https://www.instagram.com/cache.digitech?igsh=MWw0OXhhcXVpeGRoNw", color: "#E4405F", d: "M7.5 2h9a5.5 5.5 0 015.5 5.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.75-.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" },
  { label: "Facebook", href: "https://www.facebook.com/CacheDigitech01", color: "#1877F2", d: "M22.675 0H1.325C.593 0 0 .594 0 1.326v21.348C0 23.406.593 24 1.325 24H12.82v-9.294H9.692V11.29h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.318h3.587l-.467 3.416h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .594 23.406 0 22.675 0z" },
  { label: "Email", href: "mailto:info@cachedigitech.com", color: "#EA4335", d: "M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cache-digitech-pvt-ltd/", color: "#0A66C2", d: "M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 11.001-4.121 2.06 2.06 0 010 4.12zM6.902 20.452H3.773V9h3.129v11.452z" },
];

/* -- Footer -- */
function Footer() {
  const navigate = useNavigate();
  const [mobileOpenSection, setMobileOpenSection] = useState(null);
  const footerLogoUrl = usePlacement("global", "footer", "bgImage") || "/navbar-logo.svg";
  /* -- Mobile footer (accordion style, light gradient) -- */
  const mobileFooter = (
    <footer className="md:hidden flex flex-col -mt-8 pt-8 shrink-0 bg-[#0a0a0a] text-white border-t border-white/10" role="contentinfo">
      <div className="px-4 py-6 flex flex-col w-full">
        {/* Accordion navigation */}
        <nav className="flex flex-col divide-y divide-white/10" aria-label="Footer navigation">
          {MOBILE_SECTIONS.map((section) => {
            const isOpen = mobileOpenSection === section.heading;
            return (
              <div key={section.heading}>
                <button
                  type="button"
                  onClick={() => setMobileOpenSection(isOpen ? null : section.heading)}
                  className="w-full flex items-center justify-between py-4 text-left font-semibold text-white hover:text-gray-200 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{section.heading}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <ul className="pb-4 pl-0 space-y-2" role="list">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        <Link to={item.href} className="text-sm text-gray-400 hover:text-white block py-0.5" onClick={() => setMobileOpenSection(null)}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Social - liquid navigation */}
        <div className="flex flex-col items-center gap-3 py-8">
          <span className="text-sm text-gray-500">Follow us</span>
          <LiquidNavigation items={SOCIALS} />
        </div>

        {/* Contact Us button */}
        <div className="flex justify-center pb-6">
          <button
            type="button"
            onClick={() => navigate("/contactus")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            aria-label="Contact Us"
          >
            Contact Us
          </button>
        </div>

        {/* Cookie policy */}
        <p className="text-center text-sm text-gray-500 pb-4">
          We use cookies on our site. Please read more about{" "}
          <Link to="/privacy-policy" className="text-red-400 hover:text-red-300 hover:underline font-medium">
            cookies policy
          </Link>{" "}
          here.
        </p>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-500 pt-2 border-t border-white/10">
          &copy; {new Date().getFullYear()} Cache Digitech Pvt. Ltd.
        </p>
      </div>
    </footer>
  );

  return (
    <>
      {mobileFooter}

      <footer className="hidden md:flex bg-[#0a0a0a] text-white flex-col -mt-8 pt-8 shrink-0 min-h-[520px]" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-0 flex flex-col w-full">
          {/* Brand row */}
          <div className="pb-4 sm:pb-6 border-b border-white/10 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
              <img
                src={footerLogoUrl}
                alt="Cache Digitech"
                className="h-12 w-[130px] object-contain shrink-0 opacity-90 hover:opacity-100 transition-opacity duration-300"
                decoding="async"
                loading="lazy"
                fetchPriority="low"
              />
              <img
                src="/women_owned.webp"
                alt="Women Owned"
                className="h-12 w-[130px] object-contain shrink-0 self-start sm:self-end"
                decoding="async"
                loading="lazy"
                fetchPriority="low"
              />
            </div>
          </div>

          {/* Footer first region - row of link columns */}
          <section className="row region region-footer-first py-5 sm:py-6 lg:py-8 shrink-0" aria-label="Footer navigation">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-6 sm:gap-x-6 md:gap-x-8 lg:gap-x-10">
              {/* About Us */}
              <div className="col-span-1">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">About Us</h3>
                <ul className="space-y-2" role="list">
                  {FOOTER_NAV[0].items.map((label) => (
                    <li key={label}>
                      <Link to={getHref(label)} className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Products */}
              <div className="col-span-1">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Products</h3>
                <ul className="space-y-2" role="list">
                  {FOOTER_NAV[1].items.map((label) => (
                    <li key={label}>
                      <Link to={getHref(label)} className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div className="col-span-1">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Services</h3>
                <ul className="space-y-2" role="list">
                  {FOOTER_NAV[2].items.map((label) => (
                    <li key={label}>
                      <Link to={getHref(label)} className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industries */}
              <div className="col-span-1">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Industries</h3>
                <ul className="space-y-2" role="list">
                  {FOOTER_NAV[3].items.map((label) => (
                    <li key={label}>
                      <Link to={getHref(label)} className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company (includes legal links) */}
              <div className="col-span-1">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Company</h3>
                <ul className="space-y-2" role="list">
                  <li>
                    <Link to="/about" className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/epf-amendment-notice" className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200">
                      EPF Notice
                    </Link>
                  </li>
                  {LEGAL_LINKS.map(({ label, href }) => (
                    <li key={label}>
                      <Link to={href} className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Contact CTA row */}
          <div className="py-4 sm:py-5 border-b border-white/10 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-500 max-w-md">
                Have a question? Our team is ready to assist you.
              </p>
              <button
                onClick={() => navigate("/contactus")}
                className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-colors duration-200 w-fit"
              >
                Contact Us <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar - copyright & social */}
        <div className="border-t border-white/10 shrink-0">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Cache Digitech Pvt. Ltd.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 shrink-0">Follow us</span>
              <LiquidNavigation items={SOCIALS} />
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}

export default Footer;
