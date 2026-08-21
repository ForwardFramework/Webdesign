#!/usr/bin/env python3
"""
Point the whole site at a different domain, then rebuild everything.

    python3 tools/set_domain.py https://forward-framework.vercel.app
    python3 tools/set_domain.py https://www.forward-framework.com

Canonical URLs, Open Graph tags, the JSON-LD entity graph, sitemap.xml,
robots.txt and llms.txt all carry an absolute domain. Serving the site on one
domain while those point at another is an SEO problem, so change it here rather
than by hand.

Email addresses move with the domain: the address host is derived from the site
host with any leading "www." removed, so https://www.example.com gives
hello@example.com. Pass --keep-email to leave addresses alone.

Social profile URLs are never touched — those are handles, not the domain.
"""

import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Every hand-authored file that can contain the domain or an address.
# assets/js/main.js carries the support address in its form-error alert.
SOURCES = ["index.html", "tools/build.py", "assets/js/main.js"]


def current_domain():
    build = open(os.path.join(ROOT, "tools/build.py"), encoding="utf-8").read()
    return re.search(r'^SITE = "([^"]+)"', build, re.M).group(1)


def mail_host(url):
    """Address host for a site URL: https://www.example.com -> example.com"""
    return re.sub(r"^www\.", "", url.split("://", 1)[-1].rstrip("/"))


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    new = sys.argv[1].rstrip("/")
    if not new.startswith("https://"):
        sys.exit("Domain must start with https:// — got: " + new)

    old = current_domain()
    old_mail, new_mail = mail_host(old), mail_host(new)
    do_mail = "--keep-email" not in sys.argv and old_mail != new_mail

    if old == new and not do_mail:
        print(f"Already set to {new}; nothing to change.")
    else:
        urls = mails = 0
        for rel in SOURCES:
            path = os.path.join(ROOT, rel)
            src = open(path, encoding="utf-8").read()
            u = src.count(old)
            src = src.replace(old, new)
            m = 0
            if do_mail:
                m = len(re.findall(r"@" + re.escape(old_mail) + r"\b", src))
                src = re.sub(r"@" + re.escape(old_mail) + r"\b", "@" + new_mail, src)
            open(path, "w", encoding="utf-8").write(src)
            urls += u
            mails += m
            print(f"  {rel}: {u} urls, {m} addresses")
        print(f"{old} -> {new}  ({urls} urls)")
        if do_mail:
            print(f"@{old_mail} -> @{new_mail}  ({mails} addresses)")

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
