#!/usr/bin/env python3
"""
Stage the site for Netlify into dist/netlify/.

    python3 tools/build_netlify.py [https://your-domain.com]

Netlify serves both /pricing and /pricing.html with a 200 by default, and its
"Pretty URLs" post-processing toggle is inconsistent about redirecting one to
the other. Two live URLs for one page is duplicate content, so rather than
depend on a dashboard setting this build picks one form and enforces it:

  * links, canonicals, Open Graph URLs, the JSON-LD graph, sitemap.xml,
    llms.txt, robots.txt and the JS redirect all use the extensionless form
  * an explicit `_redirects` rule 301s each .html path to it, forced with `!`
    so it applies even though the file exists

The clean-URL rewriting is shared with the Cloudflare build so the two cannot
drift apart.
"""

import os
import shutil
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_cloudflare import clean_urls, source_domain, REWRITE_EXT, SKIP_DIRS, SKIP_FILES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "dist", "netlify")

HEADERS = """# Netlify response headers.
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

# styles.css and main.js are not fingerprinted, so keep the cache short or a
# deploy leaves visitors on stale CSS.
/assets/*
  Cache-Control: public, max-age=600, stale-while-revalidate=86400
"""


def build_redirects(pages):
    """One forced 301 per page, so only the extensionless URL is ever live."""
    lines = [
        "# Force a single canonical URL per page: /pricing.html -> /pricing.",
        "# `!` overrides Netlify's default of serving the file that exists.",
        "",
        f"{'/index.html':<44} {'/':<38} 301!",
    ]
    for rel in pages:
        # 404.html is Netlify's not-found handler; leave it unredirected.
        if rel in ("index.html", "404.html"):
            continue
        src = "/" + rel
        dest = "/" + rel[: -len(".html")]
        if dest.endswith("/index"):
            dest = dest[: -len("index")]
        lines.append(f"{src:<44} {dest:<38} 301!")
    return "\n".join(lines) + "\n"


def main():
    domain = (sys.argv[1].rstrip("/") if len(sys.argv) > 1 else source_domain())
    src_domain = source_domain()

    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)

    pages, copied, rewritten = [], 0, 0
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in sorted(files):
            if f in SKIP_FILES or f in {"netlify.toml"}:
                continue
            src = os.path.join(base, f)
            rel = os.path.relpath(src, ROOT).replace(os.sep, "/")
            dest = os.path.join(OUT, rel)
            os.makedirs(os.path.dirname(dest), exist_ok=True)

            if rel.endswith(".html"):
                pages.append(rel)

            if os.path.splitext(f)[1].lower() in REWRITE_EXT:
                text = original = open(src, encoding="utf-8").read()
                if domain != src_domain:
                    text = text.replace(src_domain, domain)
                text = clean_urls(text)
                open(dest, "w", encoding="utf-8").write(text)
                if text != original:
                    rewritten += 1
            else:
                shutil.copy2(src, dest)
            copied += 1

    open(os.path.join(OUT, "_headers"), "w", encoding="utf-8").write(HEADERS)
    open(os.path.join(OUT, "_redirects"), "w", encoding="utf-8").write(build_redirects(sorted(pages)))

    zip_path = os.path.join(ROOT, "dist", "forward-framework-netlify.zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for b, _, fs in os.walk(OUT):
            for f in sorted(fs):
                full = os.path.join(b, f)
                z.write(full, os.path.relpath(full, OUT).replace(os.sep, "/"))

    print(f"staged dist/netlify/ — {copied} files, {rewritten} rewritten")
    print(f"        _headers and _redirects ({len(pages)} forced 301s)")
    print(f"zipped  dist/forward-framework-netlify.zip — {os.path.getsize(zip_path)/1024:.0f} KB")
    print(f"  domain: {domain}")


if __name__ == "__main__":
    main()
