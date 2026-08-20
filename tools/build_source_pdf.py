#!/usr/bin/env python3
"""
Render the whole website's source code into a single PDF for reference and
copy-paste, plus a plain-text bundle that is byte-for-byte lossless.

    python3 tools/build_source_pdf.py

Outputs (both gitignored, both regenerable):
    dist/forward-framework-source.html   intermediate, used for rendering
    dist/forward-framework-source.txt    lossless copy-paste bundle
"""

import html
import os
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Order matters: shell and styles first, then pages, then machine-readable files.
FILES = [
    ("Homepage", "index.html"),
    ("Stylesheet", "assets/css/styles.css"),
    ("JavaScript", "assets/js/main.js"),
    ("Services hub", "services/index.html"),
    ("Service — Web design", "services/web-design.html"),
    ("Service — AI consulting", "services/ai-consulting.html"),
    ("Service — Automation", "services/automation.html"),
    ("Service — Marketing, SEO & AI search", "services/marketing.html"),
    ("Service — Ad management", "services/ad-management.html"),
    ("Service — Social media marketing", "services/social-media-marketing.html"),
    ("Service — Scaffold, business systems", "services/business-systems.html"),
    ("Pricing", "pricing.html"),
    ("Results", "results.html"),
    ("About", "about.html"),
    ("Contact", "contact.html"),
    ("Thank you", "thank-you.html"),
    ("404", "404.html"),
    ("Privacy policy", "privacy.html"),
    ("Terms of service", "terms.html"),
    ("Logo mark (SVG)", "assets/img/logo-mark.svg"),
    ("Logo lockup (SVG)", "assets/img/logo-lockup.svg"),
    ("Favicon (SVG)", "assets/img/favicon.svg"),
    ("Social share image (SVG)", "assets/img/og-image.svg"),
    ("robots.txt", "robots.txt"),
    ("llms.txt", "llms.txt"),
    ("sitemap.xml", "sitemap.xml"),
    ("Web app manifest", "site.webmanifest"),
]


def main():
    docs = []
    total_lines = 0
    for label, path in FILES:
        src = open(os.path.join(ROOT, path), encoding="utf-8").read()
        total_lines += src.count("\n") + 1
        docs.append((label, path, src))

    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)

    # ---------- Plain-text bundle (lossless) ----------
    txt = [
        "FORWARD FRAMEWORK — WEBSITE SOURCE",
        f"{len(docs)} files · {total_lines:,} lines · generated {date.today().isoformat()}",
        "",
        "Every file is delimited by the markers below. Copy between them.",
        "",
    ]
    for label, path, src in docs:
        txt.append("=" * 78)
        txt.append(f"FILE: {path}   ({label})")
        txt.append("=" * 78)
        txt.append(src.rstrip("\n"))
        txt.append("")
    open(os.path.join(ROOT, "dist", "forward-framework-source.txt"), "w",
         encoding="utf-8").write("\n".join(txt))

    # ---------- Print document ----------
    toc = "".join(
        f'<li><span class="toc-name">{html.escape(path)}</span>'
        f'<span class="toc-dots"></span>'
        f'<span class="toc-label">{html.escape(label)}</span></li>'
        for label, path, _ in docs
    )

    sections = []
    for i, (label, path, src) in enumerate(docs):
        lines = src.count("\n") + 1
        sections.append(f"""
<section class="file">
  <header class="file-head">
    <span class="file-idx">{i + 1:02d}</span>
    <span class="file-path">{html.escape(path)}</span>
    <span class="file-meta">{label} · {lines:,} lines</span>
  </header>
  <pre>{html.escape(src)}</pre>
</section>""")

    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Forward Framework — Website Source</title>
<style>
  @page {{ size: Letter landscape; margin: 13mm 12mm 14mm 12mm; }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    background: #fff;
    color: #14120F;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }}

  /* ---- Cover ---- */
  .cover {{ height: 175mm; display: flex; flex-direction: column; justify-content: center; padding-left: 6mm; }}
  .cover .mark {{ width: 26mm; margin-bottom: 9mm; }}
  .cover h1 {{ font-size: 30pt; font-weight: 300; letter-spacing: .16em; text-transform: uppercase; margin: 0 0 3mm; }}
  .cover h2 {{ font-size: 12pt; font-weight: 400; letter-spacing: .28em; text-transform: uppercase; color: #857868; margin: 0 0 12mm; }}
  .cover dl {{ display: grid; grid-template-columns: max-content 1fr; gap: 2mm 8mm; margin: 0; font-size: 9.5pt; }}
  .cover dt {{ color: #857868; letter-spacing: .12em; text-transform: uppercase; font-size: 7.5pt; align-self: center; }}
  .cover dd {{ margin: 0; }}
  .rule {{ height: 2px; background: #6f879c; width: 46mm; margin-bottom: 8mm; }}

  /* ---- Contents ---- */
  .toc {{ break-before: page; padding-top: 4mm; }}
  .toc h2 {{ font-size: 8pt; letter-spacing: .26em; text-transform: uppercase; color: #857868; margin: 0 0 5mm; font-weight: 600; }}
  .toc ol {{ list-style: none; margin: 0; padding: 0; columns: 2; column-gap: 14mm; font-size: 9pt; }}
  .toc li {{ display: flex; align-items: baseline; gap: 2mm; padding: 1.3mm 0; border-bottom: .4pt solid #E7E2DA; break-inside: avoid; }}
  .toc-name {{ font-family: "DejaVu Sans Mono", "Liberation Mono", monospace; font-size: 8pt; }}
  .toc-dots {{ flex: 1; border-bottom: .4pt dotted #C9C0B4; transform: translateY(-1px); }}
  .toc-label {{ color: #857868; font-size: 7.5pt; }}

  /* ---- Files ---- */
  .file {{ break-before: page; }}
  .file-head {{
    display: flex; align-items: baseline; gap: 4mm;
    border-bottom: 1.2pt solid #14120F; padding-bottom: 1.8mm; margin-bottom: 3.5mm;
  }}
  .file-idx {{ font-size: 8pt; color: #6f879c; letter-spacing: .1em; }}
  .file-path {{
    font-family: "DejaVu Sans Mono", "Liberation Mono", monospace;
    font-size: 11pt; font-weight: 700; flex: 1;
  }}
  .file-meta {{ font-size: 7.5pt; color: #857868; letter-spacing: .06em; text-transform: uppercase; }}

  pre {{
    font-family: "DejaVu Sans Mono", "Liberation Mono", "Courier New", monospace;
    font-size: 7.1pt;
    line-height: 1.38;
    margin: 0;
    white-space: pre-wrap;      /* wrap rather than clip long lines */
    overflow-wrap: anywhere;    /* break tokens that exceed the measure */
    tab-size: 2;
    color: #14120F;
  }}
</style>
</head>
<body>

<div class="cover">
  <svg class="mark" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path fill="#6f879c" d="M78 34 L198 34 L164 68 L112 68 L112 112 L174 112 L140 146 L112 146 L112 200 L78 166 Z"/>
    <path fill="#14120F" d="M0 0 L120 0 L86 34 L34 34 L34 78 L96 78 L62 112 L34 112 L34 200 L0 166 Z"/>
  </svg>
  <div class="rule"></div>
  <h1>Forward Framework</h1>
  <h2>Website Source Code</h2>
  <dl>
    <dt>Files</dt><dd>{len(docs)}</dd>
    <dt>Lines</dt><dd>{total_lines:,}</dd>
    <dt>Generated</dt><dd>{date.today().strftime('%d %B %Y')}</dd>
    <dt>Stack</dt><dd>Static HTML, CSS and vanilla JavaScript — no framework, no build step</dd>
    <dt>Note</dt><dd>For clean copy-paste use forward-framework-source.txt; PDF text extraction re-wraps long lines</dd>
  </dl>
</div>

<div class="toc">
  <h2>Contents</h2>
  <ol>{toc}</ol>
</div>

{''.join(sections)}

</body>
</html>"""

    out = os.path.join(ROOT, "dist", "forward-framework-source.html")
    open(out, "w", encoding="utf-8").write(doc)
    print(f"wrote dist/forward-framework-source.html and .txt — {len(docs)} files, {total_lines:,} lines")


if __name__ == "__main__":
    main()
