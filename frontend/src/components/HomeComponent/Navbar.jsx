import React, { useState, useEffect, useRef } from "react";
import { Menu, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { navLinks } from "./navLinks";

/* -- Sections that are direct links (no dropdown) -- */
const DIRECT_LINK_SECTIONS = ["Contact"];

/* -- Menu structure -- */
const menuData = {
  "About Us": {
    items: ["Profile of Cache", "Leadership Team", "Our Alliances", "Awards & Certifications", "Leadership Vision", "Blogs"],
  },
  "What We Do": {
    items: ["Cloud", "Cybersecurity", "Data Analytics & AI", "Infra & Networking"],
    submenus: {
      /* Cloud nav: overview + transformation + managed + billing + AI CoE only */
      "Cloud": [
        "Cloud Overview",
        "Cloud & Application Transformation",
        "Cloud Managed Services",
        "Multi-Cloud Billing",
        "AI Center of Excellence",
      ],
      "Cybersecurity": [
        "Cybersecurity Overview",
        "Security Consulting",
        "Infrastructure & Endpoint Security",
        "Threat Monitoring & Response",
        "Vulnerability Management",
        "Data & Cloud Security",
        "Security Audits & Compliance",
      ],
      "Data Analytics & AI": [
        "Data & AI Overview",
        "Data Platforms",
        "Advanced Analytics",
        "AI Automation",
        "Intelligent CRM",
        "Data Security & Governance",
      ],
      "Infra & Networking": [
        "Infrastructure Overview",
        "Infrastructure Consulting",
        "Infrastructure Design",
        "Infrastructure Deployment",
        "Infrastructure Management",
        "Data Center Migration",
      ],
    },
  },
  "Innovations": {
    items: [
      "Finance & Enterprise Solutions",
      "Operations & Compliance",
      "Workforce & Productivity",
      "GenAI and software solutions",
    ],
    submenus: {
      "Finance & Enterprise Solutions": ["Techbank", "CRM", "Bid Intelligence"],
      "Operations & Compliance": ["EDM", "Cache DOC"],
      "Workforce & Productivity": ["HRMS", "Employee App", "Mail Integration"],
      "GenAI and software solutions": ["AskCache", "Cache GPT", "Cache BI", "Cache DB", "Web & App Development"],
    },
  },
  "Services": {
    items: ["Cloud", "Consulting & Auditing", "Managed Services", "Infrastructure & Networking"],
    submenus: {
      /* Cloud nav: overview + transformation + managed + billing + AI CoE only */
      "Cloud": [
        "Cloud Overview",
        "Cloud & Application Transformation",
        "Cloud Managed Services",
        "Multi-Cloud Billing",
        "AI Center of Excellence",
      ],
      "Consulting & Auditing": [
        "Consulting Overview",
        "Strategy Consulting",
        "Infrastructure Advisory",
        "Security Consulting",
        "GRC",
        "IT Audits",
        "Process Optimization",
      ],
      "Managed Services": [
        "Managed Services Overview",
        "Network Managed Services",
        "IT Infrastructure Managed Services",
        "Cloud Managed Services",
        "Security Operations (SOC / SIEM / MDR)",
        "DevOps & Automation Services",
        "End-User & Workplace Services",
      ],
      "Infrastructure & Networking": [
        "Infrastructure Overview",
        "IT Infrastructure Solutions",
        "Data Center Management",
        "Network Infrastructure (LAN/WAN/Wireless)",
        "Server & Storage Management",
        "Virtualization & Hypervisor Management",
        "Backup & Disaster Recovery",
      ],
    },
  },
  "Industries": {
    items: ["Telecom", "BFSI", "Automobile & Manufacturing", "Retail", "Healthcare & Hospitality", "Governance", "IT & ITES"],
  },
  // "Careers": {
  //   items: ["Careers"],
  // },
  "Contact": {
    items: ["Contact Us"],
  },
};

function Navbar() {
  const logoUrl = "/navbar-logo.svg";

  // Mobile sidebar
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeNestedSubmenu, setActiveNestedSubmenu] = useState(null);

  // Desktop mega-menu (click to open)
  const [megaOpen, setMegaOpen] = useState(null); // which top-level section
  const megaRef = useRef(null);

  // Scroll state for transparent → solid
  const [scrolled, setScrolled] = useState(false);
  // Hide navbar on scroll down, show on scroll up
  const [navbarVisible, setNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 100;

  const navigate = useNavigate();
  const location = useLocation();

  // Use light navbar text + visible bar on pages with dark hero when at top
  const darkHeroPaths = [
    "/about/profile",
    "/innovations",
    "/cybersecurity",
    "/cloud",
    "/cloudservices",
    "/data-analytics",
    "/infrastructure",
    "/consulting",
    "/managed-services",
    "/aianddataservice",
    "/consultingservice",
    "/infrastructureservice",
    "/manageservices",
    "/about",
    "/grc-dashboard",
  ];
  const isDarkHeroPage = darkHeroPaths.some((path) =>
    path === "/" ? location.pathname === "/" : path === "/about" ? location.pathname === "/about" : location.pathname.startsWith(path)
  );
  const useLightNavText = isDarkHeroPage && !scrolled;

  // Scroll listener - transparent on top, solid on scroll; hide on scroll down, show on scroll up
  // rAF-throttle + only setState when values change
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const nextScrolled = y > 60;
        let nextVisible = true;
        if (y > scrollThreshold) {
          nextVisible = y <= lastScrollY.current;
        }
        setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
        setNavbarVisible((prev) => (prev === nextVisible ? prev : nextVisible));
        lastScrollY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [menuOpen]);

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mega-menu on route change
  useEffect(() => { setMegaOpen(null); }, [location.pathname]);

  const submenuNavigation = Object.fromEntries(
    navLinks.map((l) => [l.label, { route: l.route, sectionId: l.sectionId ?? null }])
  );

  const handleItemClick = (section, item) => {
    const nestedItems = menuData[section]?.submenus?.[item];
    const hasNested = nestedItems && nestedItems.length > 0;
    // Single-item submenu that matches the group name → treat as direct link
    if (hasNested && !(nestedItems.length === 1 && nestedItems[0] === item)) {
      setActiveNestedSubmenu(item);
      return;
    }
    const navItem = submenuNavigation[item];
    if (!navItem) return;
    setMenuOpen(false);
    setActiveSubmenu(null);
    setActiveNestedSubmenu(null);
    setMegaOpen(null);
    if (navItem.sectionId) {
      navigate(`${navItem.route}#${navItem.sectionId}`);
    } else {
      navigate(navItem.route);
    }
  };

  const isMobileDevice = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  const handleMegaItemClick = (section, item) => {
    const navItem = submenuNavigation[item];
    if (!navItem) return;
    setMegaOpen(null);
    if (navItem.sectionId) {
      navigate(`${navItem.route}#${navItem.sectionId}`);
    } else {
      navigate(navItem.route);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes megaSlideDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* -- Top Navbar: floating, dark translucent, white text, red logo -- */}
      <nav
        ref={megaRef}
        className={`fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-1000 transition-all duration-600 ease-out bg-black/25 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl ${navbarVisible ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none"}`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-10 py-4 relative">
          {/* Left: Hamburger (mobile) + Logo (desktop) */}
          <div className="flex items-center gap-7 flex-1 min-w-0 justify-start">
            <button
              className="md:hidden group flex items-center justify-center rounded-xl bg-white/15 p-2.5 transition-all duration-300 hover:bg-white/25 hover:scale-105"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
            <div onClick={() => navigate("/")} className="cursor-pointer shrink-0 hidden md:block">
              <img
                src={logoUrl}
                alt="Cache Digitech logo"
                className="h-12 w-auto transition-all duration-300 filter-[brightness(0)_saturate(100%)_invert(25%)_sepia(98%)_saturate(2692%)_hue-rotate(346deg)]"
                decoding="async"
                fetchPriority="high"
                loading="eager"
              />
            </div>
          </div>

          {/* Center: Desktop nav links - dropdown sections vs direct links */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
            {Object.keys(menuData).map((section) => {
              const isDirectLink = DIRECT_LINK_SECTIONS.includes(section);
              const directRoute = isDirectLink && menuData[section]?.items?.[0]
                ? (submenuNavigation[menuData[section].items[0]]?.sectionId
                  ? `${submenuNavigation[menuData[section].items[0]].route}#${submenuNavigation[menuData[section].items[0]].sectionId}`
                  : submenuNavigation[menuData[section].items[0]]?.route)
                : null;

              if (isDirectLink && directRoute) {
                return (
                  <button
                    key={section}
                    onClick={() => { setMegaOpen(null); navigate(directRoute); }}
                    className="relative flex items-center gap-1.5 px-3 py-2 text-base font-semibold rounded-lg transition-all duration-200 whitespace-nowrap text-white/95 hover:text-white hover:bg-white/15"
                  >
                    {section}
                  </button>
                );
              }

              return (
                <div
                  key={section}
                  className="relative"
                >
                  <button
                    onClick={() => {
                      setMegaOpen(megaOpen === section ? null : section);
                    }}
                    className={`relative flex items-center gap-1.5 px-3 py-2 text-base font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${megaOpen === section ? "text-white bg-white/20" : "text-white/95 hover:text-white hover:bg-white/15"}`}
                  >
                    {section}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${megaOpen === section ? "rotate-180" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Mobile = Cache logo only; Desktop = Women Owned only */}
          <div className="flex items-center flex-1 min-w-0 justify-end overflow-hidden">
            {/* Mobile: Cache logo only */}
            <div className="flex md:hidden items-center min-w-0 max-w-full shrink-0">
              <div onClick={() => navigate("/")} className="cursor-pointer shrink-0">
                <img
                  src={logoUrl}
                  alt="Cache Digitech logo"
                  className="h-8 w-auto max-h-8 transition-all duration-300 filter-[brightness(0)_saturate(100%)_invert(25%)_sepia(98%)_saturate(2692%)_hue-rotate(346deg)]"
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                />
              </div>
            </div>
            {/* Desktop: Women Owned only */}
            <img
              src="/women_owned.webp"
              alt="Women Owned"
              className="h-12 w-[120px] object-contain shrink-0 hidden md:block"
              decoding="async"
              loading="lazy"
              fetchPriority="low"
            />
          </div>
        </div>

        {/* -- Desktop Mega Menu Dropdown (stays open while hovering panel) -- */}
        {megaOpen && !DIRECT_LINK_SECTIONS.includes(megaOpen) && (
          <div
            className="hidden md:block absolute top-full left-0 right-0 bg-white backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl z-1000 pt-px "
            style={{ animation: "megaSlideDown 0.28s ease-out" }}
          >
            <div className="max-w-[1400px] mx-auto px-8 py-6">
              <div className="flex gap-10">
                {/* Section heading */}
                <div className="w-40 shrink-0">
                  <h3 className="text-base font-bold text-(--apple-black) mb-1">{megaOpen}</h3>
                  <div className="w-6 h-0.5 bg-red-500 rounded-full" />
                  {megaOpen === "Innovations" && (
                    <button
                      onClick={() => {
                        setMegaOpen(null);
                        navigate("/innovations");
                      }}
                      className="mt-3 block w-full text-left text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                    >
                      Overview
                    </button>
                  )}
                </div>

                {/* Menu items */}
                <div className="flex-1">
                  {menuData[megaOpen]?.submenus ? (
                    /* Two-level: each main heading in its own column */
                    <div className="grid grid-cols-4 gap-6">
                      {menuData[megaOpen].items.map((group) => (
                        <div key={group} className="flex flex-col">
                          <h4 className="text-[10px] font-bold tracking-[0.12em] uppercase text-(--apple-gray) mb-3">{group}</h4>
                          <div className="space-y-0.5">
                            {(menuData[megaOpen].submenus[group] || []).map((item) => (
                              <button
                                key={item}
                                onClick={() => handleMegaItemClick(megaOpen, item)}
                                className="block w-full text-left px-2 py-1.5 text-xs font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Single-level items */
                    <div className="grid grid-cols-3 gap-2">
                      {menuData[megaOpen].items.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleMegaItemClick(megaOpen, item)}
                          className="block w-full text-left px-2 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* -- Mobile Sidebar Backdrop -- */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-1999"
          onClick={() => { setMenuOpen(false); setActiveSubmenu(null); setActiveNestedSubmenu(null); }}
        />
      )}

      {/* -- Mobile Sidebar -- */}
      <div className={`
        fixed top-0 left-0 w-screen md:w-72 h-full bg-white z-2000 flex flex-col transition-transform duration-500 ease-out shadow-2xl
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between py-5 px-6 border-b border-gray-100">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => { navigate("/"); setMenuOpen(false); setActiveSubmenu(null); }}
          >
            <img src={logoUrl} alt="Cache Digitech logo" className="h-8" decoding="async" loading="lazy" fetchPriority="low" />
          </div>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => { setMenuOpen(false); setActiveSubmenu(null); }}
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(menuData).map(([section, data], index) => {
            const isDirectLink = DIRECT_LINK_SECTIONS.includes(section);
            const directRoute = isDirectLink && data?.items?.[0]
              ? (submenuNavigation[data.items[0]]?.sectionId
                ? `${submenuNavigation[data.items[0]].route}#${submenuNavigation[data.items[0]].sectionId}`
                : submenuNavigation[data.items[0]]?.route)
              : null;

            if (isDirectLink && directRoute) {
              return (
                <div key={index} className="mb-1">
                  <button
                    onClick={() => { navigate(directRoute); setMenuOpen(false); setActiveSubmenu(null); setHoveredSection(null); }}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 text-gray-700 hover:bg-red-50 text-left"
                  >
                    <span className="font-semibold text-sm">{section}</span>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="mb-1"
                onClick={() => {
                  if (isMobileDevice()) {
                    setActiveSubmenu(section);
                    setHoveredSection(section);
                  }
                }}
              >
                <div className={`
                  flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300
                  ${hoveredSection === section
                    ? "bg-red-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-red-50"
                  }
                `}>
                  <span className="font-semibold text-sm">{section}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${hoveredSection === section ? "translate-x-1 text-white" : "text-gray-400"}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -- Mobile Submenu Panel -- */}
      {activeSubmenu && menuOpen && (
        <div
          className="submenu-panel fixed top-0 left-0 md:left-72 right-0 md:right-auto w-screen md:w-64 h-full bg-white z-2001 shadow-2xl border-l border-gray-100 overflow-y-auto overflow-x-hidden"
          style={{ animation: "slideInFromRight 0.3s ease-out" }}
          onMouseEnter={() => { if (!isMobileDevice()) setActiveSubmenu(activeSubmenu); }}
          onMouseLeave={() => {
            if (!isMobileDevice()) {
              setActiveSubmenu(null);
              setHoveredSection(null);
              setActiveNestedSubmenu(null);
            }
          }}
        >
          <div className="py-6 px-6 border-b border-gray-100 bg-red-500 flex items-center gap-3">
            {activeNestedSubmenu ? (
              <button
                className="p-2 rounded-lg bg-red-600 hover:bg-red-600/90 transition-colors"
                onClick={() => setActiveNestedSubmenu(null)}
                aria-label="Back"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
            ) : (
              <button
                className="md:hidden p-2 rounded-lg bg-red-600 hover:bg-red-600/90 transition-colors"
                onClick={() => { setActiveNestedSubmenu(null); setActiveSubmenu(null); setHoveredSection(null); }}
                aria-label="Back"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
            )}
            <h3 className="font-bold text-xl text-white">{activeNestedSubmenu || activeSubmenu}</h3>
          </div>

          <div className="p-4">
            {(activeNestedSubmenu
              ? menuData[activeSubmenu].submenus[activeNestedSubmenu]
              : activeSubmenu === "Innovations"
                ? ["Overview", ...menuData[activeSubmenu].items]
                : menuData[activeSubmenu].items
            ).map((item, index) => (
              <div
                key={index}
                className="px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 mb-1 flex items-center justify-between
                  text-gray-700 hover:bg-red-500 hover:text-white hover:shadow-md hover:translate-x-1"
                onClick={() => handleItemClick(activeSubmenu, item)}
              >
                <span className="text-[15px] font-medium">{item}</span>
                {menuData[activeSubmenu]?.submenus?.[item] && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
