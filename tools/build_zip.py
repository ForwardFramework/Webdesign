#!/usr/bin/env python3
"""
Package the production site into a ZIP ready to upload to any static host.

    python3 tools/build_zip.py   ->  dist/forward-framework-site.zip

Contains only what gets served: pages, assets and the machine-readable files.
Build scripts, the README and dist/ are excluded.
"""

import os
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", ".claude", "dist", "tools", "__pycache__"}
SKIP_FILES = {"README.md", ".gitignore"}


def main():
    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    out = os.path.join(ROOT, "dist", "forward-framework-site.zip")
    count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for base, dirs, files in os.walk(ROOT):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            for f in sorted(files):
                if f in SKIP_FILES:
                    continue
                full = os.path.join(base, f)
                rel = os.path.relpath(full, ROOT).replace(os.sep, "/")
                z.write(full, rel)
                count += 1
    size = os.path.getsize(out) / 1024
    print(f"wrote dist/forward-framework-site.zip — {count} files, {size:.0f} KB")
    with zipfile.ZipFile(out) as z:
        for n in sorted(z.namelist()):
            print(f"   {n}")


if __name__ == "__main__":
    main()
