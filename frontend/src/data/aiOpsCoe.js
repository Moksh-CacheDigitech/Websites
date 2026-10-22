// AI Ops Center of Excellence - content sourced from the Cache Digitech AI Ops CoE deck
import {
  Boxes,
  Users,
  Database,
  GitBranch,
  Server,
  ShieldCheck,
  Radar,
  Bot,
  HardHat,
  Wrench,
  Shield,
  Rocket,
} from "lucide-react";

export const HERO = {
  name: "AI Ops Center of Excellence",
  headline: "Where we win with AI",
  subtitle: "One governed way to take AI from pilot to production - built once, used everywhere.",
  image: "/cloud/subpages/cloud-operations.webp",
};

export const WHY_COE = {
  eyebrow: "The case for a shared capability",
  title: "Why a CoE, and why now",
  intro:
    "Client demand for AI Ops is rising fast. Cache must build scalable AI Ops and delivery capability before the window narrows.",
  before: {
    title: "Scattered ops & delivery",
    points: [
      "Teams solve opportunities in isolation",
      "Talent, assets and delivery practices stay siloed within individual engagements",
      "Scale and repeatability are limited",
    ],
  },
  after: {
    title: "One CoE changes everything",
    points: [
      "Pool talent, reusable assets and governance",
      "Each client win becomes a capability the next account can use immediately",
      "Shared standards. Compounding value.",
    ],
  },
};

export const PILLARS = [
  { icon: Boxes, title: "Component-Centric Model", description: "Align business goals with technical delivery through reusable components." },
  { icon: Users, title: "Core Ops & AI Team", description: "Clear roles and accountability across operations and AI delivery." },
  { icon: Database, title: "Data Management", description: "Turn unstructured data into governed, reusable assets." },
  { icon: GitBranch, title: "Development Approach", description: "Centralised, federated or decentralised - pick the model that fits." },
  { icon: Server, title: "Common Infrastructure", description: "Shared compute, GPUs and cost management." },
  { icon: ShieldCheck, title: "Risk & Compliance", description: "Governance frameworks in place from day one." },
];

export const MANDATE_KPIS = [
  { value: "25%", label: "Cost optimisation", description: "Efficiency unlocked through strategic automation and resource consolidation." },
  { value: "25%", label: "Service-level excellence", description: "Higher service levels through consistent, governed AI delivery." },
  { value: "0-5", label: "AI adoption index", description: "Scaling AI readiness to drive enterprise-wide digital transformation." },
  { value: "0-20", label: "Closed-loop use cases", description: "Closed-loop use-case adoptions targeted to compound value creation." },
];

export const PROOF_POINTS = [
  { value: "85%", label: "of alerts resolved before analyst involvement" },
  { value: "99.7%", label: "detection accuracy after a 2-3 month behavioural learning period" },
  { value: "4-5 min", label: "triage time, versus 4-5 hours previously" },
  { value: "Leaner", label: "storage - filtering noise at source keeps only actionable signal" },
];

export const OPERATING_TIERS = [
  {
    step: "01",
    title: "Operation process",
    items: [
      "Incident management",
      "CX management",
      "AI solution development",
      "Certifications & compliance",
    ],
    agents: "Autonomous resolution & escalation",
  },
  {
    step: "02",
    title: "Service & optimisation",
    items: [
      "Size optimisation",
      "Service desk automation",
      "NOC function integration",
      "Configuration management",
    ],
    agents: "Triage, routing & self-healing",
  },
  {
    step: "03",
    title: "Stability process",
    items: ["Outage handling & recovery"],
    agents: "Predictive alerting & root-cause analysis",
  },
];

export const OPERATIONAL_FUNCTIONS = [
  { icon: Radar, title: "AI NOC / SOC" },
  { icon: Bot, title: "AI solutions development" },
  { icon: HardHat, title: "Field operations" },
  { icon: Wrench, title: "Engineering" },
  { icon: Shield, title: "Security operations" },
  { icon: Rocket, title: "Deployment & rollout" },
];

export const PIPELINE_STEPS = [
  { title: "Ingest", description: "Inventory, performance and live alarm streams across multi-vendor radio equipment." },
  { title: "Normalise", description: "Map heterogeneous vendor schemas into one canonical telemetry data model." },
  { title: "Correlate & enrich", description: "Deduplicate noisy alerts and bind physical and logical topology context." },
  { title: "Auto-open incident", description: "Threshold trigger: create a case when correlated alert clusters breach severity or cascade limits." },
  { title: "Multi-agent loop", description: "Gather evidence, rank root causes, evaluate risk, remediate and verify recovery." },
];

export const CLOSING = {
  title: "The autonomous enterprise isn't built in a day, but with the right architecture, it's built to last.",
  body:
    "The shift from AI-assisted advice to autonomous, policy-governed execution is no longer a future aspiration. It is the operational mandate of today.",
};
