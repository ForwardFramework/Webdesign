#!/usr/bin/env python3
"""
Change the phone number everywhere on the site, then rebuild.

    python3 tools/set_phone.py 412-463-2126
    python3 tools/set_phone.py "(412) 463-2126"

The number appears in four shapes — the tel: link (tel:+14124632126), the
visible text ((412) 463-2126), the JSON-LD "telephone" field (+1-412-463-2126)
and llms.txt — across the hand-authored shell and the page generator. Changing
one and missing another leaves a dead click-to-call on mobile, so change it
here rather than by hand.

Any ten-digit US number is accepted in any punctuation; the three shapes are
derived from the digits.

The "(555) 555-5555" text in the form fields is a placeholder, not a number to
call, and is deliberately left alone.
"""

import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# The hand-authored files. Every other page is generated from these two.
SOURCES = ["index.html", "tools/build.py"]


def digits(raw):
    """Ten digits from any US number, with or without a leading 1."""
    d = re.sub(r"\D", "", raw)
    if len(d) == 11 and d.startswith("1"):
        d = d[1:]
    if len(d) != 10:
        sys.exit(f"Need a 10-digit US number — got {len(d)} digits in: {raw}")
    return d


def shapes(d):
    """The three forms the site uses, keyed by how they appear in the markup."""
    return {
        "tel": "tel:+1" + d,
        "text": f"({d[:3]}) {d[3:6]}-{d[6:]}",
        "schema": f"+1-{d[:3]}-{d[3:6]}-{d[6:]}",
    }


def current():
    build = open(os.path.join(ROOT, "tools/build.py"), encoding="utf-8").read()
    m = re.search(r"tel:\+1(\d{10})", build)
    if not m:
        sys.exit("Could not find the current number in tools/build.py")
    return m.group(1)


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    old, new = current(), digits(sys.argv[1])
    old_s, new_s = shapes(old), shapes(new)

    if old == new:
        print(f"Already set to {new_s['text']}; rebuilding anyway.")
    else:
        total = 0
        for rel in SOURCES:
            path = os.path.join(ROOT, rel)
            src = open(path, encoding="utf-8").read()
            n = 0
            for key in ("tel", "text", "schema"):
                n += src.count(old_s[key])
                src = src.replace(old_s[key], new_s[key])
            open(path, "w", encoding="utf-8").write(src)
            total += n
            print(f"  {rel}: {n} replacements")
        print(f"{old_s['text']} -> {new_s['text']}  ({total} total)")

    # Every downstream bundle, so none is left quoting the old number.
    for script in ["tools/build.py", "tools/build_netlify.py",
                   "tools/build_cloudflare.py", "tools/build_preview.py",
                   "tools/build_zip.py", "tools/build_source_pdf.py"]:
        subprocess.run([sys.executable, os.path.join(ROOT, script)], cwd=ROOT, check=True)

    stale = subprocess.run(
        ["grep", "-rl", old_s["tel"], "--include=*.html", "--include=*.txt",
         "--include=*.py", "."],
        cwd=ROOT, capture_output=True, text=True).stdout.strip()
    stale = [f for f in stale.split("\n") if f and "set_phone.py" not in f]
    if stale and old != new:
        print("\nWARNING — old number still present in:")
        for f in stale:
            print("   ", f)
    else:
        print(f"\nEvery page now shows {new_s['text']}.")


if __name__ == "__main__":
    main()
