#!/usr/bin/env python3
"""
Zip dist/ for a drag-and-drop deploy (https://app.netlify.com/drop).

The site files sit at the root of the archive, which is what Netlify Drop
expects — dropping a zip whose contents are nested one level deep publishes an
empty site.

Run from the site root:  python3 tools/make-zip.py
Writes: pittsburgh-painting-site.zip
"""
import os, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "dist")
OUT  = os.path.join(ROOT, "pittsburgh-painting-site.zip")

def main():
    if not os.path.isdir(SRC):
        raise SystemExit("dist/ not found — run `python3 build.py` first.")
    n = 0
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for dirpath, _, files in os.walk(SRC):
            for f in files:
                full = os.path.join(dirpath, f)
                z.write(full, os.path.relpath(full, SRC))   # root-relative
                n += 1
    with zipfile.ZipFile(OUT) as z:
        assert "index.html" in z.namelist(), "index.html must sit at the zip root"
    print(f"{os.path.basename(OUT)}  {n} files, {os.path.getsize(OUT)/1024/1024:.2f} MB")

if __name__ == "__main__":
    main()
