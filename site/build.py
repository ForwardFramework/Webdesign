#!/usr/bin/env python3
"""Assemble the Rough Diamond Pressure Washing site from _partials/.

Outputs plain, dependency-free HTML at the site root. Run: python3 build.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
P = ROOT / "_partials"

NAV_KEYS = ["HOME", "SERVICES", "GALLERY", "ABOUT", "CONTACT"]

PAGES = [
    dict(
        out="index.html", body="body-index.html", nav="HOME",
        title="Rough Diamond Pressure Washing | Pittsburgh, PA",
        desc="Professional pressure washing and soft washing in Pittsburgh, PA. "
             "Driveways, sidewalks, decks, siding, roofs and storefronts. "
             "Free quotes — call 412-500-1363.",
    ),
    dict(
        out="services.html", body="body-services.html", nav="SERVICES",
        title="Services | Rough Diamond Pressure Washing | Pittsburgh, PA",
        desc="Driveway and concrete cleaning, house soft washing, deck and fence "
             "restoration, roof soft washing, patios and commercial pressure washing "
             "across Pittsburgh, PA.",
    ),
    dict(
        out="gallery.html", body="body-gallery.html", nav="GALLERY",
        title="Before &amp; After Results | Rough Diamond Pressure Washing",
        desc="See before and after pressure washing results from Pittsburgh driveways, "
             "decks, siding, roofs and storefronts. Drag the sliders to compare.",
    ),
    dict(
        out="about.html", body="body-about.html", nav="ABOUT",
        title="About Us | Rough Diamond Pressure Washing | Pittsburgh, PA",
        desc="Locally owned pressure washing in Pittsburgh, PA. Surface-matched methods, "
             "straight pricing and a crew that finishes the job properly.",
    ),
    dict(
        out="contact.html", body="body-contact.html", nav="CONTACT",
        title="Contact &amp; Free Quote | Rough Diamond Pressure Washing",
        desc="Request a free pressure washing quote in Pittsburgh, PA. Call or text "
             "412-500-1363 or email roughdiamondpw@gmail.com.",
    ),
    dict(
        out="404.html", body="body-404.html", nav="NONE",
        title="Page Not Found | Rough Diamond Pressure Washing",
        desc="That page could not be found. Head back to the Rough Diamond "
             "Pressure Washing home page.",
    ),
]


def read(name: str) -> str:
    return (P / name).read_text(encoding="utf-8")


def build() -> None:
    head, schema = read("head.html"), read("schema.html")
    header, footer = read("header.html"), read("footer.html")

    print("Building Rough Diamond Pressure Washing…")
    for page in PAGES:
        html = (
            "<!doctype html>\n<html lang=\"en\">\n<head>\n"
            f"{head}{schema}</head>\n<body>\n"
            f"{header}\n<main id=\"main\">\n{read(page['body'])}\n</main>\n\n"
            f"{footer}\n</body>\n</html>\n"
        )

        html = html.replace("{{TITLE}}", page["title"])
        html = html.replace("{{DESC}}", page["desc"])
        html = html.replace("{{PATH}}", "" if page["out"] == "index.html" else page["out"])

        for key in NAV_KEYS:
            marker = ' aria-current="page"' if key == page["nav"] else ""
            html = html.replace("{{NAV_%s}}" % key, marker)

        target = ROOT / page["out"]
        target.write_text(html, encoding="utf-8")
        print(f"  {page['out']:<16} {len(html.encode()):>7,} bytes")

    print("Done.")


if __name__ == "__main__":
    build()
