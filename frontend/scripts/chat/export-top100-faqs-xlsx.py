"""Export a curated Top 100 FAQ Excel aligned to website norms and IA."""
from __future__ import annotations

import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

FRONTEND = Path(__file__).resolve().parents[2]
SRC = FRONTEND / "src" / "data" / "faqs.json"
OUT_REPO = FRONTEND / "src" / "data" / "CacheDigitech_Chatbot_Top100_FAQs.xlsx"
OUT_DESKTOP = Path(r"C:\Users\moksh\OneDrive - CACHE DIGITECH\Desktop\CacheDigitech_Chatbot_Top100_FAQs.xlsx")

CTA = "If useful, I can connect you with our team at info@cachedigitech.com."

# Website information architecture quotas (sum = 100)
CATEGORY_QUOTAS = [
    ("About Us", 12),
    ("What We Do - Cloud", 12),
    ("What We Do - Cybersecurity", 12),
    ("What We Do - Data & AI", 12),
    ("What We Do - Infrastructure", 10),
    ("Services - Managed Services", 10),
    ("Services - Consulting & GRC", 8),
    ("AI Ops CoE", 6),
    ("Industries", 6),
    ("Contact", 5),
    ("Innovations", 4),
    ("How We Deliver", 3),
]

GROUP_TO_CATEGORY = {
    "Company": "About Us",
    "About Us": "About Us",
    "Contact": "Contact",
    "Cloud": "What We Do - Cloud",
    "Cybersecurity": "What We Do - Cybersecurity",
    "Data & AI": "What We Do - Data & AI",
    "Infrastructure & Engineering": "What We Do - Infrastructure",
    "Infrastructure": "What We Do - Infrastructure",
    "Networking": "What We Do - Infrastructure",
    "Managed Services": "Services - Managed Services",
    "Consulting & Audit / GRC": "Services - Consulting & GRC",
    "Consulting": "Services - Consulting & GRC",
    "GRC": "Services - Consulting & GRC",
    "AI Ops CoE": "AI Ops CoE",
    "Industries": "Industries",
    "Innovations": "Innovations",
    "How We Deliver": "How We Deliver",
    "Services": "About Us",
    "What We Do": "About Us",
    "Telecom": "Industries",
    "Partners": "About Us",
    "Certifications": "About Us",
    "Corporate & Lead Generation": "About Us",
    "Careers": "About Us",
}

PRIORITY_TOPICS = {
    "overview",
    "company",
    "company profile",
    "profile",
    "leadership",
    "mission",
    "differentiation",
    "service overview",
    "commercial",
    "migration",
    "finops",
    "architecture",
    "zero trust",
    "assessment",
    "strategy",
    "data strategy",
    "ai readiness",
    "ai strategy",
    "noc",
    "soc",
    "email",
    "phone",
    "locations",
    "delhi office",
    "mumbai office",
    "dubai office",
    "bfsi",
    "healthcare",
    "retail",
    "customers",
    "pillars",
    "why now",
    "mandate",
    "methodology",
}

PRIORITY_QUESTION_RE = re.compile(
    r"\b("
    r"what (is|are|do|does|services|cloud|cyber|managed|data|ai)|"
    r"who (are|leads|is)|"
    r"which (cloud|industries|customers|platforms)|"
    r"how (do|can|large|many)|"
    r"where|"
    r"tell me|"
    r"why (choose|did)|"
    r"contact|email|phone|office|"
    r"founded|mission|offer|support|serve"
    r")\b",
    re.I,
)

SKIP_QUESTION_RE = re.compile(
    r"("
    r"\bchatbot\b|"
    r"\bpricing quote only\b|"
    r"\bexcel import\b|"
    r"\bshould marketing\b|"
    r"\bdo not share credentials\b|"
    r"tell me about about us|"
    r"tell me about what we do|"
    r"tell me about your services|"
    r"tell me about industries|"
    r"tell me about ai ops|"
    r"tell me about contact|"
    r"difference between rehosting and replatforming|"
    r"application dependencies be identified"
    r")",
    re.I,
)


def clean_text(value: object) -> str:
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
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def to_website_voice(raw: str, question: str = "", group: str = "") -> str:
    text = clean_text(raw)
    if not text:
        return text

    text = re.sub(r"\s*(?:Please\s+)?[Cc]onfirm[^.?!]*(?:[.?!]|$)", " ", text)
    text = re.sub(r"\s*[Mm]arketing should approve[^.?!]*(?:[.?!]|$)", " ", text)
    text = re.sub(r"\s*[Bb]efore publishing[^.?!]*(?:[.?!]|$)", " ", text)
    text = re.sub(r"\s*[Aa]ny numerical or guaranteed claim[^.?!]*(?:[.?!]|$)", " ", text)
    text = re.sub(r"\s*[Dd]o not share credentials[^.?!]*(?:[.?!]|$)", " ", text)
    text = re.sub(r"\s*[Tt]he solution team must confirm[^.?!]*(?:[.?!]|$)", " ", text)
    text = re.sub(r"\s*[Ee]xact capabilities depend on tools[^.?!]*(?:[.?!]|$)", " ", text)

    replacements = [
        (r"\bCache Digitech describes itself as\b", "We're"),
        (r"\bIts website presents\b", "We help enterprises with"),
        (r"\bThe Cache Digitech website identifies\b", "We work with"),
        (r"\bThe website advertises\b", "We offer"),
        (r"\bThe website describes\b", "We offer"),
        (r"\bThe website emphasizes\b", "We focus on"),
        (r"\bThe website presents\b", "We bring"),
        (r"\bThe website references\b", "You'll find us in"),
        (r"\bThe company profile references\b", "We operate from"),
        (r"\bwithin its cloud offering\b", "as part of our cloud practice"),
        (r"\bCache Digitech\s+is\b", "We are"),
        (r"\bCache Digitech\s+are\b", "We are"),
        (r"\bCache Digitech\s+was\b", "We were"),
        (r"\bCache Digitech\s+were\b", "We were"),
        (r"\bCache Digitech\s+has\b", "We have"),
        (r"\bCache Digitech\s+have\b", "We have"),
        (r"\bCache Digitech\s+provides\b", "We provide"),
        (r"\bCache Digitech\s+provide\b", "We provide"),
        (r"\bCache Digitech\s+offers\b", "We offer"),
        (r"\bCache Digitech\s+offer\b", "We offer"),
        (r"\bCache Digitech\s+helps\b", "We help"),
        (r"\bCache Digitech\s+help\b", "We help"),
        (r"\bCache Digitech\s+works\b", "We work"),
        (r"\bCache Digitech\s+work\b", "We work"),
        (r"\bCache Digitech\s+supports\b", "We support"),
        (r"\bCache Digitech\s+support\b", "We support"),
        (r"\bCache Digitech\s+operates\b", "We operate"),
        (r"\bCache Digitech\s+operate\b", "We operate"),
        (r"\bCache Digitech\s+delivers\b", "We deliver"),
        (r"\bCache Digitech\s+deliver\b", "We deliver"),
        (r"\bCache Digitech\s+serves\b", "We serve"),
        (r"\bCache Digitech\s+serve\b", "We serve"),
    ]
    for pattern, repl in replacements:
        text = re.sub(pattern, repl, text, flags=re.I)

    text = re.sub(r"\bwe is\b", "We are", text, flags=re.I)
    text = re.sub(r"\bwe describes\b", "we describe", text, flags=re.I)
    text = re.sub(r"\bwe offers\b", "we offer", text, flags=re.I)
    text = re.sub(r"\bwe helps\b", "we help", text, flags=re.I)
    text = re.sub(r"\bwe provides\b", "we provide", text, flags=re.I)
    text = re.sub(r"\bwe works\b", "we work", text, flags=re.I)
    text = re.sub(r"\bwe supports\b", "we support", text, flags=re.I)
    text = re.sub(r"\bwe operates\b", "we operate", text, flags=re.I)
    text = re.sub(r"\bA we\b", "We", text)
    text = re.sub(r"\. we\b", ". We", text)
    text = re.sub(r"(^|\n)we\b", lambda m: f"{m.group(1)}We", text)
    text = re.sub(r"[^\S\n]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[^\S\n]+([,.;:!?])", r"\1", text)
    text = re.sub(r"\.\s*\.", ".", text).strip()

    has_cta = bool(re.search(r"contact|reach|email|call|connect|happy to|glad to|let'?s talk|info@", text, re.I))
    q = question.lower()
    is_definition = bool(re.match(r"^(what is|what are|define)\b", q.strip()))
    wants_cta = (not is_definition) and bool(
        re.search(
            r"offer|service|partner|price|cost|support|help|work with|do you|can you|which cloud|where does|what does|contact|how do i",
            q,
            re.I,
        )
        or re.search(r"Cloud|Corporate|Commercial|Managed|Contact", group or "", re.I)
    )
    if text and not has_cta and wants_cta and len(text) < 420:
        text = f"{text} {CTA}"

    return text.strip()


def score_faq(faq: dict) -> float:
    question = clean_text(faq.get("question") or "")
    topic = clean_text(faq.get("topic") or "").lower()
    answer = clean_text(faq.get("answer") or "")
    score = 0.0

    if SKIP_QUESTION_RE.search(question):
        return -100.0

    if PRIORITY_QUESTION_RE.search(question):
        score += 4.0
    if topic in PRIORITY_TOPICS:
        score += 3.5
    if topic in {"overview", "service overview", "company profile", "company"}:
        score += 2.0

    # Prefer visitor-facing length
    q_len = len(question)
    if 20 <= q_len <= 90:
        score += 2.0
    elif q_len < 120:
        score += 1.0

    a_len = len(answer)
    if 120 <= a_len <= 700:
        score += 2.0
    elif 80 <= a_len <= 900:
        score += 1.0
    elif a_len < 60:
        score -= 1.5

    # Prefer clear website-style voice already present
    if re.search(r"\b(we|our|us)\b", answer, re.I):
        score += 1.0
    if "info@cachedigitech.com" in answer.lower():
        score += 0.5

    # Mild penalty for highly technical niche wording in question
    if re.search(r"\b(SIEM|SOAR|CSPM|CWPP|FinOps unit economics|lakehouse)\b", question):
        score -= 0.4

    return score


def norm_q(question: str) -> str:
    q = clean_text(question).lower()
    q = re.sub(r"[^a-z0-9\s+]", " ", q)
    return re.sub(r"\s+", " ", q).strip()


def select_top_100(faqs: list[dict]) -> list[dict]:
    buckets: dict[str, list[dict]] = defaultdict(list)
    for faq in faqs:
        category = GROUP_TO_CATEGORY.get(faq.get("group") or "", "")
        if not category:
            continue
        item = dict(faq)
        item["_category"] = category
        item["_score"] = score_faq(faq)
        if item["_score"] > -50:
            buckets[category].append(item)

    for category, items in buckets.items():
        items.sort(key=lambda f: (-f["_score"], len(f.get("question") or "")))

    selected: list[dict] = []
    seen: set[str] = set()

    def take(category: str, n: int) -> None:
        if n <= 0:
            return
        for faq in buckets.get(category, []):
            key = norm_q(faq.get("question") or "")
            if not key or key in seen:
                continue
            # Near-duplicate guard
            if any(
                key in existing or existing in key
                for existing in seen
                if abs(len(existing) - len(key)) < 18
            ):
                continue
            seen.add(key)
            selected.append(faq)
            if sum(1 for s in selected if s["_category"] == category) >= n:
                return

    for category, quota in CATEGORY_QUOTAS:
        take(category, quota)

    # Fill shortfalls from remaining high-score items
    if len(selected) < 100:
        leftovers = []
        for items in buckets.values():
            leftovers.extend(items)
        leftovers.sort(key=lambda f: (-f["_score"], len(f.get("question") or "")))
        for faq in leftovers:
            if len(selected) >= 100:
                break
            key = norm_q(faq.get("question") or "")
            if not key or key in seen:
                continue
            seen.add(key)
            selected.append(faq)

    # Stable website order by category quota sequence, then score
    order = {name: idx for idx, (name, _) in enumerate(CATEGORY_QUOTAS)}
    selected.sort(key=lambda f: (order.get(f["_category"], 99), -f["_score"]))
    return selected[:100]


def write_excel(rows: list[dict], source_generated_at: str) -> None:
    wb = Workbook()
    ws = wb.active
    ws.title = "Top 100 FAQs"

    headers = [
        "Rank",
        "Website Category",
        "Group",
        "Topic",
        "Question",
        "Answer",
        "Source FAQ ID",
    ]
    header_fill = PatternFill("solid", fgColor="B91C1C")
    header_font = Font(bold=True, color="FFFFFF")
    thin = Border(
        left=Side(style="thin", color="DDDDDD"),
        right=Side(style="thin", color="DDDDDD"),
        top=Side(style="thin", color="DDDDDD"),
        bottom=Side(style="thin", color="DDDDDD"),
    )

    for col, header in enumerate(headers, 1):
        cell = ws.cell(1, col, header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(vertical="center")

    for rank, faq in enumerate(rows, start=1):
        question = clean_text(faq.get("question") or "")
        answer = to_website_voice(
            faq.get("answer") or "",
            question=question,
            group=str(faq.get("group") or ""),
        )
        values = [
            rank,
            faq.get("_category") or "",
            faq.get("group") or "",
            faq.get("topic") or "",
            question,
            answer,
            faq.get("id") or "",
        ]
        for col, value in enumerate(values, 1):
            cell = ws.cell(rank + 1, col, value)
            cell.alignment = Alignment(wrap_text=True, vertical="top")
            cell.border = thin

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:G{len(rows) + 1}"
    for idx, width in enumerate([8, 28, 26, 22, 55, 80, 14], start=1):
        ws.column_dimensions[get_column_letter(idx)].width = width

    summary = wb.create_sheet("Summary")
    summary["A1"] = "Cache Digitech Chatbot - Top 100 FAQs"
    summary["A1"].font = Font(bold=True, size=14)
    summary["A2"] = "Curated for website information architecture and site copy norms"
    summary["A3"] = f"Total rows: {len(rows)}"
    summary["A4"] = "Source: frontend/src/data/faqs.json"
    summary["A5"] = f"Source generatedAt: {source_generated_at}"
    summary["A6"] = f"ExportedAt: {datetime.now(timezone.utc).isoformat()}"
    summary["A8"] = "Website norms applied"
    summary["A8"].font = Font(bold=True)
    summary["A9"] = "- First-person sales voice (we / our)"
    summary["A10"] = "- ASCII hyphen only (no en/em dashes); multiplication as x"
    summary["A11"] = "- Remove internal review / marketing-approval boilerplate"
    summary["A12"] = "- Soft CTA to info@cachedigitech.com where useful"
    summary["A13"] = "- Balanced across About, What We Do, Services, AI Ops CoE, Industries, Contact"

    summary["A15"] = "Website Category"
    summary["B15"] = "Count"
    summary["A15"].font = Font(bold=True)
    summary["B15"].font = Font(bold=True)

    counts: dict[str, int] = defaultdict(int)
    for faq in rows:
        counts[faq.get("_category") or "Ungrouped"] += 1
    row_idx = 16
    for category, _quota in CATEGORY_QUOTAS:
        summary.cell(row_idx, 1, category)
        summary.cell(row_idx, 2, counts.get(category, 0))
        row_idx += 1

    summary.column_dimensions["A"].width = 40
    summary.column_dimensions["B"].width = 12

    OUT_REPO.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT_REPO)
    OUT_DESKTOP.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT_DESKTOP)
    print(f"Wrote {len(rows)} FAQs -> {OUT_REPO}")
    print(f"Copied to Desktop -> {OUT_DESKTOP}")


def main() -> None:
    payload = json.loads(SRC.read_text(encoding="utf-8"))
    faqs = payload.get("faqs") or []
    selected = select_top_100(faqs)
    if len(selected) != 100:
        raise SystemExit(f"Expected 100 FAQs, got {len(selected)}")
    write_excel(selected, str(payload.get("generatedAt") or ""))


if __name__ == "__main__":
    main()
