#!/usr/bin/env python3
"""
Stage the site for Cloudflare Pages into dist/cloudflare/.

    python3 tools/build_cloudflare.py [https://your-domain.com]

Cloudflare Pages serves HTML without the extension and 308-redirects the
extension back: /pricing.html permanently redirects to /pricing. Shipping the
source as-is would mean every internal link costs a redirect hop and — worse —
every canonical tag would point at a URL that redirects, which is a documented
cause of pages not being indexed.

So this build strips `.html` from links, canonicals, Open Graph URLs, the
JSON-LD graph, sitemap.xml, llms.txt, robots.txt and the JS redirect, while the
files stay named *.html on disk for Cloudflare to map. Directory indexes keep
their trailing slash (/services/), which is what Cloudflare serves.

It also writes a `_headers` file, Cloudflare's mechanism for response headers.
"""

import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "dist", "cloudflare")


SKIP_DIRS = {".git", ".github", ".claude", "dist", "tools", "__pycache__", ".vercel", "_site", "node_modules", "docs"}
SKIP_FILES = {"README.md", "DEPLOY.md", ".gitignore", "vercel.json", ".vercelignore"}
REWRITE_EXT = {".html", ".xml", ".txt", ".webmanifest", ".json", ".js"}


def source_domain():
    """The domain the site is currently built with, read from build.py's SITE."""
    build = open(os.path.join(ROOT, "tools", "build.py"), encoding="utf-8").read()
    return re.search(r'^SITE = "([^"]+)"', build, re.M).group(1)

HEADERS = """# Cloudflare Pages response headers.
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


def clean_urls(text):
    """Strip .html from paths, matching how Cloudflare Pages serves them."""
    # Directory indexes collapse to the directory: /services/index.html -> /services/
    text = re.sub(r'(?<=["\'(\s])(/(?:[\w./-]*/)?)index\.html(?=["\'#?)\s])', r'\1', text)
    text = re.sub(r'(https?://[\w.-]+(?:/[\w./-]*)?/)index\.html\b', r'\1', text)
    # Everything else simply loses the extension: /pricing.html -> /pricing
    text = re.sub(r'(?<=["\'(\s])(/[\w./-]+)\.html(?=["\'#?)\s])', r'\1', text)
    text = re.sub(r'(https?://[\w.-]+/[\w./-]+)\.html\b', r'\1', text)
    # sitemap.xml <loc> entries sit between tags, not quotes
    text = re.sub(r'(<loc>[^<]+?)\.html(</loc>)', r'\1\2', text)
    text = re.sub(r'(<loc>[^<]+?/)index(</loc>)', r'\1\2', text)
    # robots.txt directives
    text = re.sub(r'^(Disallow: /[\w./-]+)\.html$', r'\1', text, flags=re.M)
    return text


def main():
    SRC = source_domain()
    domain = (sys.argv[1].rstrip("/") if len(sys.argv) > 1 else SRC)

    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)

    copied = rewritten = 0
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in sorted(files):
            if f in SKIP_FILES:
                continue
            src = os.path.join(base, f)
            rel = os.path.relpath(src, ROOT)
            dest = os.path.join(OUT, rel)
            os.makedirs(os.path.dirname(dest), exist_ok=True)

            if os.path.splitext(f)[1].lower() in REWRITE_EXT:
                text = original = open(src, encoding="utf-8").read()
                if domain != SRC:
                    text = text.replace(SRC, domain)
                text = clean_urls(text)
                open(dest, "w", encoding="utf-8").write(text)
                if text != original:
                    rewritten += 1
            else:
                shutil.copy2(src, dest)
            copied += 1

    open(os.path.join(OUT, "_headers"), "w", encoding="utf-8").write(HEADERS)

    # Zip it too, for the dashboard's direct-upload path.
    import zipfile
    zip_path = os.path.join(ROOT, "dist", "forward-framework-cloudflare.zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for b, _, fs in os.walk(OUT):
            for f in sorted(fs):
                full = os.path.join(b, f)
                z.write(full, os.path.relpath(full, OUT).replace(os.sep, "/"))

    print(f"staged dist/cloudflare/ — {copied} files, {rewritten} rewritten, plus _headers")
    print(f"zipped  dist/forward-framework-cloudflare.zip — {os.path.getsize(zip_path)/1024:.0f} KB")
    print(f"  domain: {domain}")


if __name__ == "__main__":
    main()
