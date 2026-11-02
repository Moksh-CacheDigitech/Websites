"""
Rebuild Excel FAQs with cleaned, more detailed sales answers, then keep
non-Excel website/nav FAQs that were added later.
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

import openpyxl

FRONTEND = Path(__file__).resolve().parents[2]
XLSX = Path(r"c:\Users\moksh\Downloads\Cache Digitech - FAQ.xlsx")
OUT = FRONTEND / "src" / "data" / "faqs.json"
CTA = "If useful, I can connect you with our team at info@cachedigitech.com."

GROUP_CONTEXT = {
    "Cloud": (
        "Through our cloud practice we help with migration and modernization, FinOps, landing zones, "
        "hybrid and multi-cloud operations, and 24x7 managed cloud with NOC/SOC coverage on AWS, "
        "Microsoft Azure and Google Cloud Platform."
    ),
    "Data & AI": (
        "Our Data and AI practice covers data modernization, advanced analytics, AI and agentic "
        "automation, intelligent CRM, and governance - including RAG pipelines and production AI "
        "patterns guided by our AI Ops CoE."
    ),
    "Infrastructure & Engineering": (
        "Our infrastructure and engineering teams consult, design, build, operate and manage "
        "servers, storage, networking, virtualization, cloud integration and data center migration "
        "with ITIL-aligned delivery."
    ),
    "Cybersecurity": (
        "Our cybersecurity practice designs and operates Zero Trust and defense-in-depth programs - "
        "from posture assessments and vulnerability management to SOC/SIEM/MDR, endpoint protection, "
        "and compliance-aligned controls."
    ),
    "Consulting & Audit / GRC": (
        "Our Consulting and Audit / GRC practice supports strategy, infrastructure advisory, "
        "security consulting, IT audits, compliance management, IT risk, and privacy frameworks "
        "aligned to standards such as ISO, SOC 2, GDPR, PCI-DSS, HIPAA and RBI guidelines where applicable."
    ),
    "Managed Services": (
        "Our managed services model centers on 24x7 Global NOC and dedicated SOC coverage, remote "
        "infrastructure management, cloud operations, managed manpower, and contract or vendor management "
        "under clear scope and service levels."
    ),
    "Corporate & Lead Generation": (
        "Cache Digitech is an enterprise system integrator founded in 1991. We help organizations "
        "across telecom, BFSI, manufacturing, retail, healthcare, government and IT/ITES with cloud, "
        "cybersecurity, infrastructure, data and AI, consulting and managed services."
    ),
}

# Extra sentence for short definition-style Excel answers
DEFINITION_HOOK = {
    "Cloud": (
        "When we deliver cloud work, we place topics like this inside Assess, Design, Deploy, "
        "and Operate so architecture, cost, security and operations stay aligned."
    ),
    "Data & AI": (
        "In our Data and AI engagements we connect the concept to data quality, governance, "
        "and production readiness - including patterns from our AI Ops CoE."
    ),
    "Infrastructure & Engineering": (
        "In infrastructure programs we use this during assessment and design so capacity, "
        "resilience and operations are planned before build and cutover."
    ),
    "Cybersecurity": (
        "In security programs we apply this across identity, endpoint, network, cloud and "
        "data layers, then operate it with continuous monitoring where required."
    ),
    "Consulting & Audit / GRC": (
        "In consulting and GRC work we turn this into clear ownership, evidence, and "
        "treatment plans that leadership and auditors can follow."
    ),
    "Managed Services": (
        "In managed services we document this in scope, responsibilities and operating "
        "routines so day-2 support stays consistent."
    ),
    "Corporate & Lead Generation": (
        "This sits inside how we introduce Cache Digitech as a long-term technology partner "
        "across cloud, security, infrastructure, AI and managed operations."
    ),
}
TOPIC_HINTS = {
    "migration": "We typically sequence work as Assess, Design, Deploy, then Operate and optimize so cutover risk stays controlled.",
    "architecture": "We design for security, operability and cost from day one rather than bolting controls on after go-live.",
    "security": "Security and compliance are built into delivery, not treated as an afterthought.",
    "finops": "We pair technical rightsizing with commercial discipline so cloud spend stays visible and actionable.",
    "monitoring": "Continuous monitoring and clear escalation paths are part of how we run production estates.",
    "compliance": "We map controls to the frameworks that matter for your industry and evidence them for audits.",
    "ai": "Our AI Ops CoE helps move use cases from pilot to governed production with reusable assets.",
    "noc": "24x7 operations coverage is available through our NOC and SOC capabilities.",
    "soc": "24x7 operations coverage is available through our NOC and SOC capabilities.",
}


def clean(value: object) -> str:
    text = str(value or "").strip()
    text = (
        text.replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2212", "-")
        .replace("\u00d7", "x")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
    )
    return re.sub(r"\s+", " ", text)


def strip_internal_notes(text: str) -> str:
    text = clean(text)
    patterns = [
        r"\s*(?:Please\s+)?[Cc]onfirm[^.?!]*(?:[.?!]|$)",
        r"\s*[Mm]arketing should approve[^.?!]*(?:[.?!]|$)",
        r"\s*[Bb]efore publishing[^.?!]*(?:[.?!]|$)",
        r"\s*[Aa]ny numerical or guaranteed claim[^.?!]*(?:[.?!]|$)",
        r"\s*[Dd]o not share credentials[^.?!]*(?:[.?!]|$)",
        r"\s*[Tt]he solution team must confirm[^.?!]*(?:[.?!]|$)",
        r"\s*[Ee]xact capabilities depend on tools[^.?!]*(?:[.?!]|$)",
        r"\s*[Cc]onfirm current[^.?!]*(?:[.?!]|$)",
        r"\s*[Cc]onfirm exact[^.?!]*(?:[.?!]|$)",
        r"\s*[Cc]onfirm the formal[^.?!]*(?:[.?!]|$)",
        r"\s*[Vv]alidate with[^.?!]*(?:[.?!]|$)",
        r"\s*[Cc]heck with[^.?!]*(?:[.?!]|$)",
    ]
    for pat in patterns:
        text = re.sub(pat, " ", text)
    return re.sub(r"\s+", " ", text).strip(" ,;")


def to_sales_voice(text: str) -> str:
    text = strip_internal_notes(text)
    replacements = [
        (r"\bCache Digitech describes itself as\b", "We are"),
        (r"\bCache Digitech describes\b", "We offer"),
        (r"\bIts website presents\b", "We help enterprises with"),
        (r"\bThe Cache Digitech website identifies\b", "We work with"),
        (r"\bThe website advertises\b", "We offer"),
        (r"\bThe website describes\b", "We offer"),
        (r"\bThe website emphasizes\b", "We focus on"),
        (r"\bThe website presents\b", "We bring"),
        (r"\bThe website references\b", "You'll find"),
        (r"\bThe website lists\b", "We cover"),
        (r"\bThe company profile references\b", "We operate from"),
        (r"\bwithin its cloud offering\b", "as part of our cloud practice"),
        (r"\bCache Digitech(?=\s+(?:is|are|was|were|has|have|provides?|offers?|helps?|works?|supports?|operates?|delivers?|serves?)\b)", "we"),
    ]
    for pat, repl in replacements:
        text = re.sub(pat, repl, text, flags=re.IGNORECASE)

    grammar = [
        (r"\bwe describes\b", "we describe"),
        (r"\bwe offers\b", "we offer"),
        (r"\bwe helps\b", "we help"),
        (r"\bwe provides\b", "we provide"),
        (r"\bwe works\b", "we work"),
        (r"\bwe supports\b", "we support"),
        (r"\bwe operates\b", "we operate"),
        (r"\bwe identifies\b", "we identify"),
        (r"\bA we\b", "We"),
        (r"\. we\b", ". We"),
        (r"^we\b", "We"),
    ]
    for pat, repl in grammar:
        text = re.sub(pat, repl, text, flags=re.IGNORECASE)

    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\.\s*\.", ".", text)
    return text.strip()


def expand_short_definition(group: str, question: str, answer: str) -> str:
    """Add a useful delivery hook when the Excel draft answer is short."""
    if len(answer) >= 280:
        return answer
    q = question.lower().strip()
    hook = DEFINITION_HOOK.get(group, "")
    if q.startswith(("what is ", "what are ", "what does ", "define ")):
        if hook and hook.lower() not in answer.lower():
            return f"{answer} {hook}"
        return answer
    if q.startswith("how ") and len(answer) < 200:
        extra = (
            "A clear plan, named owners, rehearsal where needed, and validation checkpoints "
            "keep the work predictable."
        )
        if extra.lower() not in answer.lower():
            return f"{answer} {extra}"
    if q.startswith("why ") and len(answer) < 200:
        extra = (
            "Done well, this improves resilience, operator clarity, and business outcomes "
            "without adding unnecessary complexity."
        )
        if extra.lower() not in answer.lower():
            return f"{answer} {extra}"
    if len(answer) < 160 and hook and hook.lower() not in answer.lower():
        return f"{answer} {hook}"
    return answer


def topic_context(topic: str, question: str) -> str:
    blob = f"{topic} {question}".lower()
    for key, sentence in TOPIC_HINTS.items():
        if key in blob:
            return sentence
    return ""


def wants_cta(question: str, group: str, answer: str) -> bool:
    if re.search(r"contact|reach|email|call|connect|info@", answer, re.I):
        return False
    if re.match(r"^(what is|what are|define)\b", question.strip(), re.I):
        return False
    if re.search(
        r"cache digitech|do you|can you|offer|service|partner|support|help|work with|which|where|how can",
        question,
        re.I,
    ):
        return True
    return group in {"Corporate & Lead Generation", "Cloud", "Cybersecurity", "Managed Services"}


def enrich_answer(group: str, topic: str, question: str, draft: str) -> str:
    core = to_sales_voice(draft)
    if not core:
        core = "We can walk you through this in more detail based on your environment."
    core = expand_short_definition(group, question, core)

    parts = [core]
    joined_lower = core.lower()

    def overlap_ratio(a: str, b: str) -> float:
        ta = {w for w in re.findall(r"[a-z0-9]+", a.lower()) if len(w) > 3}
        tb = {w for w in re.findall(r"[a-z0-9]+", b.lower()) if len(w) > 3}
        if not ta or not tb:
            return 0.0
        return len(ta & tb) / len(ta)

    gctx = GROUP_CONTEXT.get(group, "")
    companyish = bool(
        re.search(
            r"cache digitech|do you|offer|service|partner|support|help|work with|which cloud|what managed|what cyber|what data|what consulting|what infrastructure|what does cache",
            question,
            re.I,
        )
    )
    # Append group context only when it adds new substance
    if gctx and overlap_ratio(gctx, core) < 0.45 and (companyish or len(core) < 240):
        parts.append(gctx)
        joined_lower = " ".join(parts).lower()

    tctx = topic_context(topic, question)
    if tctx and tctx.lower() not in joined_lower and overlap_ratio(tctx, " ".join(parts)) < 0.5:
        parts.append(tctx)

    answer = " ".join(parts)
    answer = re.sub(r"\s+", " ", answer).strip()

    if wants_cta(question, group, answer) and len(answer) < 700:
        answer = f"{answer} {CTA}"

    # Soft paragraph breaks - protect common abbreviations like Pvt. Ltd.
    if "\n" not in answer and len(answer) > 220:
        abbrs = [
            "Pvt.",
            "Ltd.",
            "Inc.",
            "Corp.",
            "Co.",
            "Mr.",
            "Mrs.",
            "Ms.",
            "Dr.",
            "vs.",
            "etc.",
            "e.g.",
            "i.e.",
            "U.S.",
            "U.K.",
            "U.A.E.",
            "No.",
        ]
        saved: list[str] = []
        protected = answer
        for abbr in abbrs:
            protected = re.sub(
                re.escape(abbr),
                lambda m, s=saved: (s.append(m.group(0)) or f"§ABBR{len(s)-1}§"),
                protected,
                flags=re.IGNORECASE,
            )
        protected = re.sub(r"([.!?])\s+(?=[A-Z0-9])", r"\1\n\n", protected)
        answer = re.sub(
            r"§ABBR(\d+)§",
            lambda m: saved[int(m.group(1))],
            protected,
        )
        # Merge accidental abbreviation orphans ("Pvt." / "Ltd. is...")
        parts = [p.strip() for p in re.split(r"\n{2,}", answer) if p.strip()]
        merged: list[str] = []
        for part in parts:
            if merged and re.match(r"^(Ltd\.|Inc\.|Corp\.|Co\.|Pvt\.)\b", part, re.I):
                merged[-1] = f"{merged[-1]} {part}"
            elif merged and part[:1].islower():
                merged[-1] = f"{merged[-1]} {part}"
            else:
                merged.append(part)
        answer = "\n\n".join(merged)

    return answer.strip()


def norm_q(q: str) -> str:
    q = clean(q).lower()
    q = re.sub(r"[^a-z0-9\s+]", " ", q)
    return re.sub(r"\s+", " ", q).strip()


def load_excel_faqs() -> list[dict]:
    wb = openpyxl.load_workbook(XLSX)
    ws = wb["FAQ Master"]
    faqs: list[dict] = []
    for i, row in enumerate(ws.iter_rows(values_only=True), start=1):
        if i == 1:
            continue
        group, topic, question, answer = (list(row) + [None, None, None, None])[:4]
        if not question or not answer:
            continue
        g = clean(group)
        t = clean(topic)
        q = clean(question)
        faqs.append(
            {
                "id": f"faq-{len(faqs) + 1}",
                "group": g,
                "topic": t,
                "question": q,
                "answer": enrich_answer(g, t, q, str(answer)),
                "source": "excel",
            }
        )
    return faqs


def keep_non_excel(existing: list[dict], excel_questions: set[str]) -> list[dict]:
    kept = []
    for faq in existing:
        qn = norm_q(faq.get("question", ""))
        if qn in excel_questions:
            continue
        answer = str(faq.get("answer") or "")
        answer = (
            answer.replace("\u2013", "-")
            .replace("\u2014", "-")
            .replace("\u2212", "-")
            .replace("\u00d7", "x")
        )
        kept.append(
            {
                "id": faq.get("id"),
                "group": clean(faq.get("group")),
                "topic": clean(faq.get("topic")),
                "question": clean(faq.get("question")),
                "answer": answer.strip(),
                "source": "site",
            }
        )
    return kept


def main() -> None:
    excel = load_excel_faqs()
    excel_q = {norm_q(f["question"]) for f in excel}

    existing_payload = {"faqs": []}
    if OUT.exists():
        existing_payload = json.loads(OUT.read_text(encoding="utf-8"))
    site = keep_non_excel(list(existing_payload.get("faqs") or []), excel_q)

    merged = excel + site
    for i, faq in enumerate(merged, start=1):
        faq["id"] = f"faq-{i}"
        # Drop helper field from published JSON
        faq.pop("source", None)

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "count": len(merged),
        "faqs": merged,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    avg = sum(len(f["answer"]) for f in excel) // max(len(excel), 1)
    print(f"Excel enriched: {len(excel)} (avg answer length {avg})")
    print(f"Site FAQs kept: {len(site)}")
    print(f"Total written: {len(merged)} -> {OUT}")
    # Show one sample
    sample = excel[0]
    print("--- sample ---")
    print(sample["question"])
    print(sample["answer"][:360])


if __name__ == "__main__":
    main()
