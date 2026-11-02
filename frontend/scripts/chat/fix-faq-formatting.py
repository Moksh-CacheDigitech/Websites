"""Fix broken paragraph splits in faqs.json (e.g. Pvt. / Ltd.)."""
from __future__ import annotations

import json
import re
from pathlib import Path

FRONTEND = Path(__file__).resolve().parents[2]
PATHS = [
    FRONTEND / "src" / "data" / "faqs.json",
]

ABBRS = [
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


def protect(text: str) -> tuple[str, list[str]]:
    saved: list[str] = []
    out = text
    for abbr in ABBRS:
        out = re.sub(
            re.escape(abbr),
            lambda m, s=saved: (s.append(m.group(0)) or f"§ABBR{len(s)-1}§"),
            out,
            flags=re.IGNORECASE,
        )
    return out, saved


def restore(text: str, saved: list[str]) -> str:
    return re.sub(r"§ABBR(\d+)§", lambda m: saved[int(m.group(1))], text)


def fix_answer(answer: str) -> str:
    text = str(answer or "").replace("\r\n", "\n").strip()
    # Flatten soft single newlines
    text = re.sub(r"([^\n])\n(?!\n)", r"\1 ", text)
    text = re.sub(r"[ \t]{2,}", " ", text)

    protected, saved = protect(text)
    if "\n\n" not in protected and len(protected) > 160:
        protected = re.sub(r"([.!?])\s+(?=[A-Z0-9])", r"\1\n\n", protected)
    text = restore(protected, saved)

    parts = [p.strip() for p in re.split(r"\n{2,}", text) if p.strip()]
    merged: list[str] = []
    for part in parts:
        if merged and re.match(r"^(Ltd\.|Inc\.|Corp\.|Co\.|Pvt\.)\b", part, re.I):
            merged[-1] = f"{merged[-1]} {part}"
        elif merged and part[:1].islower():
            merged[-1] = f"{merged[-1]} {part}"
        else:
            merged.append(part)

    # Compress overly fragmented answers
    if len(merged) > 5:
        compressed: list[str] = []
        buf = ""
        for p in merged:
            if not buf:
                buf = p
            elif len(buf) + 1 + len(p) < 220:
                buf = f"{buf} {p}"
            else:
                compressed.append(buf)
                buf = p
        if buf:
            compressed.append(buf)
        merged = compressed

    return "\n\n".join(merged)


def main() -> None:
    fixed_n = 0
    for path in PATHS:
        if not path.exists():
            continue
        payload = json.loads(path.read_text(encoding="utf-8"))
        for faq in payload.get("faqs") or []:
            before = faq.get("answer") or ""
            after = fix_answer(before)
            if after != before:
                faq["answer"] = after
                fixed_n += 1
        path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(f"Updated {path}")
    print(f"Answers changed: {fixed_n}")


if __name__ == "__main__":
    main()
