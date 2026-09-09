import { useEffect, useState, useRef, lazy, Suspense } from "react";

const ParticleEarth = lazy(() =>
  import("../ParticleEarth").then((m) => ({ default: m.ParticleEarth }))
);

const STATS = [
  { value: "32+", label: "Years of Legacy" },
  { value: "24x7", label: "Support Availability" },
  { value: "3", label: "Office Locations" },
  { value: "7+", label: "Core Service Domains" },
  { value: "6+", label: "Industry Verticals Served" },
  { value: "24x7", label: "Monitoring Coverage" },
  { value: "2", label: "ISO Certifications" },
  { value: "5", label: "CMMI Level" },
  { value: "Pan India", label: "Service Coverage" },
];

/** Parse "14.5", "226", "2,200" etc. into numeric value for animation. */
function parseStatValue(value: string): { prefix: string; target: number; suffix: string; decimals: number } {
  const match = value.match(/^([^0-9.,]*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: value, decimals: 0 };
  const [, prefix = "", numStr = "0", suffix = ""] = match;
  const num = parseFloat(numStr.replace(/,/g, ""));
  const decimals = numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 1) : 0;
  return { prefix, target: isNaN(num) ? 0 : num, suffix, decimals };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function GlobeGraphic() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#05080c] ring-1 ring-white/10 shadow-2xl shadow-cyan-950/20"
      style={{ aspectRatio: "1", minHeight: "280px" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(34,211,238,0.12), transparent 70%)",
        }}
        aria-hidden
      />
      <Suspense fallback={<div className="absolute inset-0 bg-[#05080c]" aria-hidden />}>
        <ParticleEarth
          particleColor="#22d3ee"
          lineColor="#67e8f9"
          particleSize={0.14}
          lineOpacity={0.18}
          autoRotationSpeed={0.85}
          assembleOnLoad
        />
      </Suspense>
    </div>
  );
}

const DURATION_MS = 1800;
const STAGGER_MS = 80;

export function ProgressInNumbers() {
  const inView = true;
  const sectionRef = useRef<HTMLElement>(null);
  const [displayNumbers, setDisplayNumbers] = useState<number[]>(() => STATS.map(() => 0));
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!inView || animatedRef.current) return;
    animatedRef.current = true;
    const parsed = STATS.map((s) => parseStatValue(s.value));
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const next = parsed.map((p, i) => {
        const delay = i * STAGGER_MS;
        if (elapsed < delay) return 0;
        const progress = Math.min(1, (elapsed - delay) / DURATION_MS);
        const eased = easeOutCubic(progress);
        return p.target * eased;
      });
      setDisplayNumbers(next);
      if (next.some((n, i) => n < parsed[i].target - 0.01)) {
        requestAnimationFrame(tick);
      } else {
        setDisplayNumbers(parsed.map((p) => p.target));
      }
    };
    requestAnimationFrame(tick);
  }, [inView]);

  const formatDisplay = (index: number) => {
    const raw = STATS[index].value;
    if (!/[\d.,]/.test(raw)) return raw;
    const parsed = parseStatValue(raw);
    const n = displayNumbers[index] ?? 0;
    const formatted =
      parsed.decimals > 0
        ? n.toFixed(parsed.decimals)
        : n >= 1000
          ? Math.round(n).toLocaleString()
          : Math.round(n).toString();
    return `${parsed.prefix}${formatted}${parsed.suffix}`;
  };

  return (
    <section
      ref={sectionRef}
      className="relative pt-6 lg:pt-8 pb-6 lg:pb-8 overflow-hidden bg-linear-to-b from-white via-gray-50/50 to-white px-6 sm:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 xl:gap-12 items-center">
          <div className="space-y-6">
            <div
              className={`transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-4xl md:text-5xl lg:text-[52px] font-light text-(--apple-black) tracking-tight leading-[1.08] max-w-2xl">
                Progress in Numbers
              </h2>
              <p className="mt-5 text-(--apple-gray) text-base sm:text-lg leading-relaxed max-w-xl">
                With over three decades of legacy and pan-India coverage, we deliver technology solutions that drive growth and resilience for our clients.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {STATS.map((stat, index) => (
                <div
                  key={index}
                  className={`group rounded-xl border border-gray-100 bg-white/80 px-4 py-3 sm:px-4 sm:py-3.5 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-red-100/80 hover:bg-white ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${180 + index * 50}ms` }}
                >
                  <div className="text-xl sm:text-2xl font-bold text-red-600 tracking-tight tabular-nums group-hover:text-red-700 transition-colors duration-300 ease-out">
                    {formatDisplay(index)}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-(--apple-gray) font-medium leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative w-full min-h-[280px] flex justify-center pt-6 sm:pt-10 lg:pt-12 transition-all duration-700 ease-out ${
              inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="w-full max-w-[480px] lg:max-w-[520px]">
              <GlobeGraphic />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
