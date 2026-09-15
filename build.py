#!/usr/bin/env python3
"""Assemble the standalone HTML pages from src/ + partials/.

Each file in src/ starts with `<!--key: value-->` lines (title, description,
slug) followed by the page body. This script wraps that body in the shared
head, header and footer so those live in exactly one place.

Usage:  python3 build.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
PARTIALS = ROOT / "partials"
SRC = ROOT / "src"

HEAD = (PARTIALS / "head.html").read_text()
ICONS = (PARTIALS / "icons.svg").read_text()
HEADER = (PARTIALS / "header.html").read_text()
FOOTER = (PARTIALS / "footer.html").read_text()

META_RE = re.compile(r"^<!--\s*(\w+)\s*:\s*(.*?)\s*-->\s*$")


def build(path: pathlib.Path) -> str:
    meta, body_lines = {}, []
    for line in path.read_text().splitlines():
        match = META_RE.match(line) if not body_lines else None
        if match:
            meta[match.group(1)] = match.group(2)
        elif line.strip() or body_lines:
            body_lines.append(line)

    head = HEAD
    for key, value in (
        ("{{TITLE}}", meta.get("title", "Coastal Custom Carts")),
        ("{{DESCRIPTION}}", meta.get("description", "")),
        ("{{SLUG}}", meta.get("slug", "")),
    ):
        head = head.replace(key, value)

    return "\n".join([head, ICONS, HEADER, "\n".join(body_lines), FOOTER,
                      '<script src="assets/js/main.js" defer></script>',
                      "</body>", "</html>", ""])


def main() -> None:
    pages = sorted(SRC.glob("*.html"))
    if not pages:
        raise SystemExit("No pages found in src/")
    for page in pages:
        (ROOT / page.name).write_text(build(page))
        print(f"  built  {page.name}")
    print(f"\n{len(pages)} page(s) built into {ROOT}")


if __name__ == "__main__":
    main()
