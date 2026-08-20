#!/usr/bin/env python3
"""
Point the whole site at a different domain, then rebuild everything.

    python3 tools/set_domain.py https://forward-framework.vercel.app
    python3 tools/set_domain.py https://forwardframework.com

Canonical URLs, Open Graph tags, the JSON-LD entity graph, sitemap.xml,
robots.txt and llms.txt all carry an absolute domain. Serving the site on one
domain while those point at another is an SEO problem, so change it here rather
than by hand.

Only the scheme-qualified form is rewritten, so the hello@… email addresses and
the social profile URLs are never touched.
"""

import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = ["index.html", "tools/build.py"]


def current_domain():
    build = open(os.path.join(ROOT, "tools/build.py"), encoding="utf-8").read()
    return re.search(r'^SITE = "([^"]+)"', build, re.M).group(1)


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    new = sys.argv[1].rstrip("/")
    if not new.startswith("https://"):
        sys.exit("Domain must start with https:// — got: " + new)

    old = current_domain()
    if old == new:
        print(f"Already set to {new}; nothing to change.")
    else:
        total = 0
        for rel in SOURCES:
            path = os.path.join(ROOT, rel)
            src = open(path, encoding="utf-8").read()
            hits = src.count(old)
            if hits:
                open(path, "w", encoding="utf-8").write(src.replace(old, new))
                total += hits
            print(f"  {rel}: {hits} replaced")
        print(f"{old} -> {new}  ({total} occurrences in source)")

    for script in ["tools/build.py", "tools/build_preview.py", "tools/build_zip.py"]:
        subprocess.run([sys.executable, os.path.join(ROOT, script)], cwd=ROOT, check=True)

    remaining = subprocess.run(
        ["grep", "-rl", old, "--include=*.html", "--include=*.xml",
         "--include=*.txt", "--include=*.py", "."],
        cwd=ROOT, capture_output=True, text=True).stdout.strip()
    # Exclude dist/ (regenerated) and this script (its docstring shows an example).
    remaining = [f for f in remaining.split("\n")
                 if f and not f.startswith("./dist/") and "set_domain.py" not in f]
    if remaining and old != new:
        print("\nWARNING — old domain still present in:")
        for f in remaining:
            print("   ", f)
    else:
        print(f"\nEvery generated file now points at {new}.")


if __name__ == "__main__":
    main()
