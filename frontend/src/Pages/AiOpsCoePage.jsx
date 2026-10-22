import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  X,
  Bot,
  ShieldCheck,
  Lightbulb,
  Cpu,
  Rocket,
  Users,
  Shield,
  Cloud,
  Brain,
  Network,
  Target,
  FlaskConical,
  Handshake,
  FileCheck,
  Award,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { usePageScroll } from "../hooks/usePageScroll";
import { LazyBackground } from "../components/LazyBackground";
import { getAiOpsFeaturedProjects } from "../data/innovationProjects";
import {
  HERO,
  WHY_COE,
  PILLARS,
  MANDATE_KPIS,
  PROOF_POINTS,
  OPERATING_TIERS,
  OPERATIONAL_FUNCTIONS,
  PIPELINE_STEPS,
  CLOSING,
} from "../data/aiOpsCoe";

const CONTAINER = "max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full min-w-0";
const SECTION = "relative py-14 sm:py-16 md:py-20 lg:py-28 scroll-mt-24";
const TECH_GRID_LIGHT =
  "bg-[linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-size-[48px_48px]";
const TECH_GRID_DARK =
  "bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[48px_48px]";

const INNOVATION_PILLARS = [
  {
    icon: Lightbulb,
    title: "Ideation & Research",
    description:
      "Continuous research into emerging technologies to identify opportunities that drive real business value.",
  },
  {
    icon: Cpu,
    title: "Technology Adoption",
    description:
      "From AI and GenAI to cloud-native and edge - adopt and integrate cutting-edge tech into operations.",
  },
  {
    icon: Rocket,
    title: "Accelerators & IP",
    description:
      "Frameworks, accelerators, and IP-led solutions that shorten time-to-value and scale across the enterprise.",
  },
  {
    icon: Users,
    title: "Ecosystem & Partnerships",
    description:
      "Collaborate with technology leaders, OEMs, and innovators for co-innovation and joint solutions.",
  },
];

const FOCUS_AREAS = [
  {
    icon: Brain,
    title: "AI & GenAI",
    description: "Intelligent automation, analytics, and AI-native solutions.",
    path: "/aianddataservice",
  },
  {
    icon: Cloud,
    title: "Cloud & Digital",
    description: "Hybrid and multi-cloud, migration at scale, and FinOps with cost control.",
    path: "/cloudservices",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Secure-by-design, zero trust, and compliance.",
    path: "/cybersecurity",
  },
  {
    icon: Network,
    title: "Engineering & R&D",
    description: "Product engineering, DevOps, and platform innovation.",
    path: "/infrastructureservice",
  },
  {
    icon: Target,
    title: "Industry Solutions",
    description: "BFSI, telecom, healthcare, and sector-specific innovation.",
    path: "/case-studies",
  },
];

const PROOF_ITEMS = [
  {
    icon: FlaskConical,
    title: "Labs & CoE",
    description: "Dedicated labs and centers of excellence for POCs, pilots, and rapid experimentation.",
  },
  {
    icon: Handshake,
    title: "Strategic Partnerships",
    description: "Deep ties with OEMs, hyperscalers, and ISVs for co-innovation and joint solutions.",
  },
  {
    icon: FileCheck,
    title: "Certifications & Standards",
    description: "ISO, CMMI, and security certifications that enable innovation with governance.",
  },
  {
    icon: Award,
    title: "Awards & Recognition",
    description: "Industry recognition for innovation, delivery excellence, and client impact.",
    path: "/about/awards",
  },
];

const TRENDS = [
  "Agentic AI & autonomous systems",
  "Edge & hybrid cloud",
  "Multi-cloud & cloud-native at scale",
  "Industry cloud & vertical solutions",
  "Responsible & ethical AI",
];

const CLOUD_INNOVATION_POINTS = [
  "Hybrid & multi-cloud strategy across AWS, Azure, GCP, and on-prem with one operating model.",
  "Cloud migration & modernization - assessment, roadmap, lift-and-shift and refactor.",
  "Cloud-native & serverless - containers, Kubernetes, and cost-efficient scale.",
  "FinOps & cost optimization - visibility, rightsizing, and governance.",
  "Security & compliance in the cloud - identity, zero trust, built into every design.",
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        io.disconnect();
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ eyebrow, title, intro, dark = false }) {
  return (
    <Reveal className="text-center mb-10 sm:mb-14 lg:mb-16">
      <p
        className={`font-mono text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase mb-3 ${dark ? "text-red-400" : "text-red-600"}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight max-w-3xl mx-auto px-1 break-words ${dark ? "text-white" : "text-slate-900"}`}
      >
        {title}
      </h2>
      <div className="mt-4 sm:mt-5 mx-auto flex items-center justify-center gap-2" aria-hidden>
        <span className="h-px w-8 bg-red-500/50" />
        <span className="w-1.5 h-1.5 rotate-45 bg-red-500" />
        <span className="h-px w-8 bg-red-500/50" />
      </div>
      {intro && (
        <p
          className={`mt-5 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

function IncidentPipeline({ dark = false }) {
  const [ref, visible] = useInView(0.2);
  return (
    <div ref={ref} className="relative">
      <div
        className={`hidden lg:block absolute top-6 left-[10%] right-[10%] h-px ${dark ? "bg-white/15" : "bg-slate-200"}`}
        aria-hidden
      >
        <div
          className={`h-full bg-linear-to-r from-red-600 via-red-500 to-red-400 origin-left transition-transform duration-[1600ms] ease-out ${visible ? "scale-x-100" : "scale-x-0"}`}
        />
      </div>
      <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {PIPELINE_STEPS.map((step, i) => (
          <li
            key={step.title}
            className={`flex lg:flex-col gap-4 lg:items-center lg:text-center transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${200 + i * 220}ms` }}
          >
            <span
              className={`shrink-0 w-12 h-12 rounded-md font-mono font-bold flex items-center justify-center shadow-sm ${dark
                  ? "bg-slate-950 border border-red-500/70 text-red-400"
                  : "bg-white border-2 border-red-500 text-red-600"
                }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${dark ? "text-white" : "text-slate-900"}`}>
                {step.title}
              </h3>
              <p className={`text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function AiOpsCoePage() {
  usePageScroll();
  const featuredProjects = getAiOpsFeaturedProjects();

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden min-w-0 text-slate-900">
      {/* Hero - only full-bleed dark band */}
      <section className="relative min-h-[70vh] sm:min-h-[78vh] lg:min-h-[85vh] flex flex-col justify-end overflow-hidden">
        <LazyBackground
          src={HERO.image}
          eager
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_20%_80%,rgba(220,38,38,0.2),transparent)] pointer-events-none" aria-hidden />
        <div className={`relative z-10 ${CONTAINER} pt-32 pb-14 sm:pb-20 lg:pb-24`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm font-mono text-[11px] tracking-[0.2em] uppercase text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" aria-hidden />
            Cache Digitech / AI Ops
          </div>
          <h1 className="hero-text-fadein text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] max-w-4xl break-words">
            {HERO.name}
          </h1>
          <p className="hero-text-fadein-delay mt-5 sm:mt-6 text-xl sm:text-2xl md:text-3xl font-light text-white/90 max-w-3xl">
            {HERO.headline}
          </p>
          <p className="hero-text-fadein-delay mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            {HERO.subtitle}
          </p>
          <div className="hero-text-fadein-delay mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/contactus"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-300 ease-out shadow-lg sm:hover:-translate-y-0.5 min-h-[44px]"
            >
              Talk to us <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/ai-ops-coe#innovations"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-full border border-white/30 transition-all duration-300 ease-out min-h-[44px]"
            >
              Explore innovations
            </Link>
          </div>
        </div>
      </section>

      {/* Why a CoE - light */}
      <section id="why-coe" className={`${SECTION} bg-slate-50 ${TECH_GRID_LIGHT}`}>
        <div className={CONTAINER}>
          <SectionHeader eyebrow={WHY_COE.eyebrow} title={WHY_COE.title} intro={WHY_COE.intro} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <Reveal className="rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-sm">
              <h3 className="font-mono text-sm tracking-wide text-slate-500 mb-5 uppercase">{WHY_COE.before.title}</h3>
              <ul className="space-y-4">
                {WHY_COE.before.points.map((point) => (
                  <li key={point} className="flex gap-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                    <X className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="rounded-2xl p-6 sm:p-8 bg-linear-to-br from-red-600 to-red-700 text-white shadow-lg">
              <h3 className="font-mono text-sm tracking-wide text-white/80 mb-5 uppercase">{WHY_COE.after.title}</h3>
              <ul className="space-y-4">
                {WHY_COE.after.points.map((point) => (
                  <li key={point} className="flex gap-3 text-white/95 text-sm sm:text-base leading-relaxed">
                    <Check className="h-5 w-5 text-white shrink-0 mt-0.5" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Six pillars */}
      <section id="pillars" className={`${SECTION} bg-white`}>
        <div className={CONTAINER}>
          <SectionHeader
            eyebrow="Foundation"
            title="Six pillars of the AI Ops CoE"
            intro="A robust AI operation rests on six interconnected foundations - each critical to aligning business goals with technical delivery."
          />
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="group bg-white p-6 sm:p-8 hover:bg-red-50/50 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[11px] font-bold text-red-600 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <Icon className="h-5 w-5 text-red-600 transition-transform duration-300 group-hover:scale-110" aria-hidden />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Operating mandate - dark */}
      <section id="mandate" className={`${SECTION} bg-slate-950 overflow-hidden`}>
        <div className={`absolute inset-0 ${TECH_GRID_DARK}`} aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_10%,rgba(220,38,38,0.18),transparent)] pointer-events-none" aria-hidden />
        <div className={`relative ${CONTAINER}`}>
          <SectionHeader
            dark
            eyebrow="Operating mandate"
            title="What the CoE is accountable for"
            intro="Own the shared capability that turns client needs into governed, reusable AI solutions - measured on four dimensions."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {MANDATE_KPIS.map((kpi, i) => (
              <Reveal key={kpi.label} delay={i * 90} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <p className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-red-400">{kpi.value}</p>
                <p className="mt-2 text-base font-semibold text-white">{kpi.label}</p>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{kpi.description}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 sm:mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="font-mono text-red-400 text-[11px] font-semibold tracking-[0.22em] uppercase mb-6">
              Proof point // alert & log intelligence
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {PROOF_POINTS.map((point) => (
                <div key={point.value}>
                  <p className="font-mono text-3xl sm:text-4xl font-bold text-red-400">{point.value}</p>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{point.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Operating model */}
      <section id="operating-model" className={`${SECTION} bg-white`}>
        <div className={CONTAINER}>
          <SectionHeader
            eyebrow="Operating model"
            title="People, process and tools"
            intro="A unified framework connecting AI agents, field execution and engineering across critical business functions."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {OPERATING_TIERS.map((tier, i) => (
              <Reveal key={tier.title} delay={i * 100} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 flex flex-col">
                <span className="font-mono w-fit px-2.5 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 text-xs font-bold mb-4">
                  {tier.step}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">{tier.title}</h3>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm sm:text-[15px] text-slate-700">
                      <span className="w-1.5 h-1.5 rotate-45 bg-red-500 shrink-0 mt-2" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2.5 items-start pt-4 border-t border-slate-200">
                  <Bot className="h-5 w-5 text-red-600 shrink-0" aria-hidden />
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">AI agents: </span>
                    {tier.agents}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 sm:mt-16">
            <h3 className="text-center font-mono text-xs tracking-[0.22em] uppercase text-slate-500 mb-8">Six operational functions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {OPERATIONAL_FUNCTIONS.map((fn) => {
                const Icon = fn.icon;
                return (
                  <div key={fn.title} className="flex flex-col items-center text-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <Icon className="h-6 w-6 text-red-600" aria-hidden />
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">{fn.title}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Incident pipeline - dark */}
      <section id="incident-pipeline" className={`${SECTION} bg-slate-900 ${TECH_GRID_DARK} overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_10%_90%,rgba(220,38,38,0.14),transparent)] pointer-events-none" aria-hidden />
        <div className={`relative ${CONTAINER}`}>
          <SectionHeader
            dark
            eyebrow="Automated incident pipeline"
            title="From live event to closed incident"
            intro="A continuous, closed-loop pipeline that turns raw vendor telemetry into verified resolution - automatically."
          />
          <IncidentPipeline dark />
          <Reveal className="mt-14 flex gap-4 items-start max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <ShieldCheck className="h-6 w-6 text-red-400 shrink-0" aria-hidden />
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Governance & audit - </span>
              remediation respects defined autonomy tiers; every plan step, tool execution, model decision and verification check is captured in an immutable audit trail.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Innovations */}
      <section id="innovations" className={`${SECTION} bg-white`}>
        <div className={CONTAINER}>
          <SectionHeader
            eyebrow="Innovation at Cache"
            title="Where ideas meet impact"
            intro="Cache Digitech combines deep engineering heritage with a forward-looking mindset - technology adoption, solution accelerators, and strategic partnerships."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {INNOVATION_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={i * 80} className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                    <Icon className="h-5 w-5 text-red-600 group-hover:text-white transition-colors" aria-hidden />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section id="focus-areas" className={`${SECTION} bg-slate-50`}>
        <div className={CONTAINER}>
          <SectionHeader eyebrow="What we innovate" title="Innovation focus areas" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {FOCUS_AREAS.map((area, i) => {
              const Icon = area.icon;
              return (
                <Reveal key={area.title} delay={i * 60}>
                  <Link
                    to={area.path}
                    className="group h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 hover:border-red-400 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  >
                    <Icon className="h-6 w-6 text-red-600 mb-4" aria-hidden />
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">{area.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed flex-1">{area.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 group-hover:gap-2.5 transition-all">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cloud innovation - dark */}
      <section id="cloud-innovation" className={`${SECTION} bg-slate-950 ${TECH_GRID_DARK}`}>
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-red-400 mb-3">Cloud at the core</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-5">
                Innovate on cloud - with control and clarity
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                Adopt and scale on cloud with strategy, migration, and operations that balance cost, security, and agility across hyperscalers and hybrid environments.
              </p>
              <ul className="space-y-3 mb-8">
                {CLOUD_INNOVATION_POINTS.map((point) => (
                  <li key={point.slice(0, 28)} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                    <Cloud className="h-4 w-4 text-red-400 shrink-0 mt-1" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/cloudservices"
                className="inline-flex items-center gap-2 text-red-400 font-semibold hover:gap-3 transition-all text-sm sm:text-base"
              >
                Explore cloud services <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={120} className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg aspect-4/3">
              <img
                src="/images/cloud2.webp"
                alt="Cloud infrastructure and innovation"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 to-transparent pointer-events-none" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section id="proof" className={`${SECTION} bg-slate-50`}>
        <div className={CONTAINER}>
          <SectionHeader eyebrow="Why trust us" title="Proof & credibility" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PROOF_ITEMS.map((item, i) => {
              const Icon = item.icon;
              const body = (
                <>
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4 border border-slate-200 shadow-sm">
                    <Icon className="h-5 w-5 text-red-600" aria-hidden />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </>
              );
              return (
                <Reveal key={item.title} delay={i * 70}>
                  {item.path ? (
                    <Link to={item.path} className="block h-full rounded-2xl border border-slate-200 bg-white p-6 hover:border-red-300 transition-colors shadow-sm">
                      {body}
                    </Link>
                  ) : (
                    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{body}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Innovation projects - dark */}
      <section id="projects" className={`${SECTION} bg-slate-950 ${TECH_GRID_DARK}`}>
        <div className={CONTAINER}>
          <SectionHeader
            dark
            eyebrow="What we build"
            title="Our innovation projects"
            intro="IP-led platforms and accelerators spanning talent, procurement, ERP, and enterprise systems."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {featuredProjects.map((project, i) => (
              <Reveal key={project.slug} delay={(i % 4) * 50}>
                <Link
                  to={`/innovations/projects/${project.slug}`}
                  className="group block h-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900 hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="aspect-16/10 overflow-hidden bg-slate-800">
                    <img
                      src={project.image || "/images/innovations-meeting.webp"}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                      {project.name}
                    </h3>
                    {project.tagline && (
                      <p className="text-xs text-slate-400 font-medium mb-2 line-clamp-2">{project.tagline}</p>
                    )}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{project.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trends */}
      <section id="trends" className={`${SECTION} bg-slate-50`}>
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <Reveal>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-6">
                Trends we're betting on
              </h2>
              <ul className="space-y-3">
                {TRENDS.map((trend) => (
                  <li key={trend} className="flex items-center gap-3 text-slate-700 text-sm sm:text-base">
                    <span className="w-2 h-2 rotate-45 bg-red-500 shrink-0" aria-hidden />
                    <span>{trend}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <Sparkles className="h-6 w-6 text-red-600 mb-4" aria-hidden />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Responsible innovation</h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                We embed governance, fairness, explainability, and compliance into every innovation - aligning with Trust by Design and ethical technology.
              </p>
              <Link to="/blogs" className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all text-sm">
                <BookOpen className="h-4 w-4" />
                Latest insights & blogs
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative py-16 sm:py-20 lg:py-28 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(220,38,38,0.2),transparent)] pointer-events-none" aria-hidden />
        <Reveal className={`relative ${CONTAINER} text-center`}>
          <p className="font-mono text-red-400 text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">The convergence</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            {CLOSING.title}
          </h2>
          <p className="mt-6 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">{CLOSING.body}</p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/contactus"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 ease-out shadow-lg sm:hover:-translate-y-0.5 min-h-[44px]"
            >
              Start the conversation <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/aianddataservice"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full border border-white/30 transition-all duration-300 ease-out min-h-[44px]"
            >
              AI & Data Services
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
