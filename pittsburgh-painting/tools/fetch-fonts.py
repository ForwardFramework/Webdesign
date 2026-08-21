#!/usr/bin/env python3
"""
Download the site's webfonts from Google Fonts and self-host them.

Self-hosting removes two cross-origin connections (fonts.googleapis.com +
fonts.gstatic.com) from the critical rendering path. Variable fonts are used so
all weights of a family ship in a single file.

Run from the site root:  python3 tools/fetch-fonts.py
Writes: assets/fonts/*.woff2 and assets/css/fonts.css
"""
import re, os, urllib.request

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0 Safari/537.36")
# Variable axes — one file per family covers every weight we use.
URL = ("https://fonts.googleapis.com/css2"
       "?family=Barlow+Condensed:wght@700;800"   # no variable version exists
       "&family=Inter:wght@400..700"              # variable: one file, all weights
       "&display=swap")
KEEP_SUBSETS = ("latin",)          # English-only site

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30).read()

def main():
    os.makedirs("assets/fonts", exist_ok=True)
    css = get(URL).decode()
    faces, saved = [], {}
    for subset, block in re.findall(r"/\*\s*([\w\-\[\]]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S):
        if subset not in KEEP_SUBSETS:
            continue
        fam  = re.search(r"font-family:\s*'([^']+)'", block).group(1)
        wt   = re.search(r"font-weight:\s*([\d\s]+);", block).group(1).strip()
        url  = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
        slug = fam.lower().replace(" ", "-")
        # a weight *range* means a variable font (one file for every weight)
        name = f"{slug}-var.woff2" if " " in wt else f"{slug}-{wt}.woff2"
        if name not in saved:
            data = get(url)
            open(f"assets/fonts/{name}", "wb").write(data)
            saved[name] = len(data)
        ur = re.search(r"unicode-range:\s*([^;]+);", block)
        faces.append(
            f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{wt};"
            f"font-display:swap;src:url('../fonts/{name}') format('woff2');"
            + (f"unicode-range:{ur.group(1).strip()};" if ur else "") + "}")

    open("assets/css/fonts.css", "w").write(
        "/* Self-hosted webfonts. Regenerate with: python3 tools/fetch-fonts.py */\n"
        + "\n".join(faces) + "\n")
    for k, v in sorted(saved.items()):
        print(f"  {k:<30} {v/1024:6.1f} KB")
    print(f"\n{len(saved)} files, {sum(saved.values())/1024:.1f} KB total")

if __name__ == "__main__":
    main()
