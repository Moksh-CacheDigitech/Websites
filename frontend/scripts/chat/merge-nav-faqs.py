"""Merge src/data/chat-sources/nav-basic-faqs.json into src/data/faqs.json."""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

FRONTEND = Path(__file__).resolve().parents[2]
EXISTING = FRONTEND / "src" / "data" / "faqs.json"
EXTRA = FRONTEND / "src" / "data" / "chat-sources" / "nav-basic-faqs.json"


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


def norm_q(q: str) -> str:
    q = clean(q).lower()
    q = re.sub(r"[^a-z0-9\s+]", " ", q)
    return re.sub(r"\s+", " ", q).strip()


def tokenize(q: str) -> set[str]:
    return {t for t in norm_q(q).split() if len(t) > 2}


def similar(a: str, b: str) -> bool:
    na, nb = norm_q(a), norm_q(b)
    if na == nb or na in nb or nb in na:
        return True
    ta, tb = tokenize(a), tokenize(b)
    if not ta or not tb:
        return False
    inter = len(ta & tb)
    union = len(ta | tb)
    return (inter / union) >= 0.78 and inter >= 4


def main() -> None:
    payload = json.loads(EXISTING.read_text(encoding="utf-8"))
    faqs = list(payload.get("faqs") or [])
    extras = json.loads(EXTRA.read_text(encoding="utf-8"))
    added = 0
    skipped = 0
    for item in extras:
        question = clean(item.get("question"))
        answer = clean(item.get("answer"))
        if not question or not answer:
            skipped += 1
            continue
        if any(similar(question, f.get("question", "")) for f in faqs):
            skipped += 1
            continue
        faqs.append(
            {
                "id": f"faq-{len(faqs) + 1}",
                "group": clean(item.get("group")),
                "topic": clean(item.get("topic")),
                "question": question,
                "answer": answer,
            }
        )
        added += 1

    for i, faq in enumerate(faqs, start=1):
        faq["id"] = f"faq-{i}"

    out = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "count": len(faqs),
        "faqs": faqs,
    }
    EXISTING.parent.mkdir(parents=True, exist_ok=True)
    EXISTING.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"FAQs now {len(faqs)} (added {added}, skipped {skipped})")


if __name__ == "__main__":
    main()
