"""Export frontend/src/data/faqs.json to an Excel workbook."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

FRONTEND = Path(__file__).resolve().parents[2]
SRC = FRONTEND / "src" / "data" / "faqs.json"
OUT = FRONTEND / "src" / "data" / "CacheDigitech_Chatbot_FAQs.xlsx"


def main() -> None:
    payload = json.loads(SRC.read_text(encoding="utf-8"))
    faqs = payload.get("faqs") or []

    wb = Workbook()
    ws = wb.active
    ws.title = "Chatbot FAQs"

    headers = ["ID", "Group", "Topic", "Question", "Answer"]
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

    for row_idx, faq in enumerate(faqs, start=2):
        values = [
            faq.get("id") or f"faq-{row_idx - 1}",
            faq.get("group") or "",
            faq.get("topic") or "",
            faq.get("question") or "",
            faq.get("answer") or "",
        ]
        for col, value in enumerate(values, 1):
            cell = ws.cell(row_idx, col, value)
            cell.alignment = Alignment(wrap_text=True, vertical="top")
            cell.border = thin

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:E{len(faqs) + 1}"
    for idx, width in enumerate([12, 22, 28, 55, 80], start=1):
        ws.column_dimensions[get_column_letter(idx)].width = width

    summary = wb.create_sheet("Summary")
    summary["A1"] = "Cache Digitech Chatbot FAQ Export"
    summary["A1"].font = Font(bold=True, size=14)
    summary["A2"] = f"Total FAQs: {len(faqs)}"
    summary["A3"] = "Source: frontend/src/data/faqs.json"
    summary["A4"] = f"GeneratedAt: {payload.get('generatedAt', '')}"
    summary["A6"] = "Group"
    summary["B6"] = "Count"
    summary["A6"].font = Font(bold=True)
    summary["B6"].font = Font(bold=True)

    counts = Counter((faq.get("group") or "Ungrouped") for faq in faqs)
    for row_idx, (group, count) in enumerate(sorted(counts.items()), start=7):
        summary.cell(row_idx, 1, group)
        summary.cell(row_idx, 2, count)

    summary.column_dimensions["A"].width = 36
    summary.column_dimensions["B"].width = 12

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Wrote {len(faqs)} FAQs -> {OUT}")


if __name__ == "__main__":
    main()
