"""Convert Cache Digitech FAQ.xlsx into knowledge/faqs.json."""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = Path(r"c:\Users\moksh\Downloads\Cache Digitech - FAQ.xlsx")
OUT = ROOT / "knowledge" / "faqs.json"


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


def main() -> None:
    wb = openpyxl.load_workbook(XLSX)
    ws = wb["FAQ Master"]
    faqs = []
    for i, row in enumerate(ws.iter_rows(values_only=True), start=1):
        if i == 1:
            continue
        group, topic, question, answer = (list(row) + [None, None, None, None])[:4]
        if not question or not answer:
            continue
        faqs.append(
            {
                "id": f"faq-{len(faqs) + 1}",
                "group": clean(group),
                "topic": clean(topic),
                "question": clean(question),
                "answer": clean(answer),
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "count": len(faqs),
        "faqs": faqs,
    }
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {len(faqs)} FAQs -> {OUT}")


if __name__ == "__main__":
    main()
