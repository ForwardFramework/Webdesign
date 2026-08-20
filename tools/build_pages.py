#!/usr/bin/env python3
"""
Stage the site into _site/ for GitHub Pages.

    python3 tools/build_pages.py <base_path> <base_url>
    python3 tools/build_pages.py /Webdesign https://forwardframework.github.io/Webdesign
    python3 tools/build_pages.py "" https://forwardframework.com

GitHub Pages serves a *project* site from a subpath (/<repo>/), but every link
and asset reference in the source is root-absolute — correct for the real
domain, broken under a subpath. Rather than compromise the source, this script
rewrites paths in a throwaway copy at deploy time.

The workflow passes both values from actions/configure-pages, so a custom
domain (base_path "") and the default github.io URL both work with no edits.
"""

import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "_site")
SOURCE_DOMAIN = "https://forwardframework.com"

SKIP_DIRS = {".git", ".github", ".claude", "dist", "tools", "__pycache__", ".vercel", "_site", "node_modules"}
SKIP_FILES = {"README.md", "DEPLOY.md", ".gitignore", "vercel.json", ".vercelignore"}
REWRITE_EXT = {".html", ".xml", ".txt", ".webmanifest", ".json"}


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    base_path = sys.argv[1].rstrip("/")          # "" or "/Webdesign"
    base_url = sys.argv[2].rstrip("/")           # "https://…"

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
                text = open(src, encoding="utf-8").read()
                before = text

                # 1. Absolute URLs: canonicals, Open Graph, JSON-LD, sitemap, robots, llms.
                if base_url != SOURCE_DOMAIN:
                    text = text.replace(SOURCE_DOMAIN, base_url)

                # 2. Root-relative paths, only when serving from a subpath.
                #    The negative lookahead leaves protocol-relative //host alone.
                if base_path:
                    text = re.sub(r'(href|src)="/(?!/)', rf'\1="{base_path}/', text)
                    if f.endswith(".webmanifest"):
                        text = text.replace('"start_url": "/"', f'"start_url": "{base_path}/"')
                        text = re.sub(r'"src": "/(?!/)', f'"src": "{base_path}/', text)

                open(dest, "w", encoding="utf-8").write(text)
                if text != before:
                    rewritten += 1
            else:
                shutil.copy2(src, dest)
            copied += 1

    # Stop Pages running the files through Jekyll.
    open(os.path.join(OUT, ".nojekyll"), "w").close()

    print(f"staged _site/ — {copied} files, {rewritten} rewritten")
    print(f"  base_path: {base_path or '(root)'}")
    print(f"  base_url : {base_url}")


if __name__ == "__main__":
    main()
