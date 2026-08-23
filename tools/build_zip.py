#!/usr/bin/env python3
"""
Package the production site into a ZIP ready to upload to any static host.

    python3 tools/build_zip.py   ->  dist/forward-framework-site.zip

Contains only what gets served: pages, assets and the machine-readable files.
Build scripts, the README and dist/ are excluded.
"""

import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_cloudflare import source_files  # noqa: E402  (one shared file list)



# Host-specific files, excluded from the generic bundle.
HOST_ONLY = {"vercel.json", ".vercelignore", "netlify.toml"}


def main():
    # `--portable` drops host-specific config, for hosts that just unpack a zip
    # (static.app, Netlify drop, cPanel). Default keeps vercel.json.
    portable = "--portable" in sys.argv
    name = "forward-framework-site-portable.zip" if portable else "forward-framework-site.zip"
    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    out = os.path.join(ROOT, "dist", name)
    count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for full, rel in source_files():
            if portable and os.path.basename(full) in HOST_ONLY:
                continue
            z.write(full, rel.replace(os.sep, "/"))
            count += 1
    size = os.path.getsize(out) / 1024
    print(f"wrote dist/{name} — {count} files, {size:.0f} KB")
    try:
        with zipfile.ZipFile(out) as z:
            for n in sorted(z.namelist()):
                print(f"   {n}")
    except BrokenPipeError:
        pass  # output was piped into head/less


if __name__ == "__main__":
    main()
