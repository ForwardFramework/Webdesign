#!/usr/bin/env python3
"""
Bundle the whole site into one self-contained HTML preview file.

Each page is rendered inside an iframe via srcdoc, so every page runs its own
copy of the real CSS and JS — the preview shows the actual site, not a mock-up.
Shared assets are base64'd once into a lookup table and substituted at inject
time, so the bundle carries each image exactly once.

Usage:  python3 tools/build-preview.py   →  preview.html
"""
import base64, json, mimetypes, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, "preview.html")

PAGES = [
  ("Main", [
    ("index.html",                          "Home"),
    ("about.html",                          "About"),
    ("gallery.html",                        "Before & After"),
    ("reviews.html",                        "Reviews"),
    ("service-areas.html",                  "Service Areas"),
  ]),
  ("Services", [
    ("services/exterior-painting.html",     "Exterior Painting"),
    ("services/interior-painting.html",     "Interior Painting"),
    ("services/cabinet-refinishing.html",   "Cabinet Refinishing"),
    ("services/renovations.html",           "Renovations & Flips"),
  ]),
  ("Conversion", [
    ("estimate.html",                       "Free Estimate"),
    ("offer.html",                          "$1,000 Off landing"),
    ("guide.html",                          "Lead magnet"),
    ("thank-you.html",                      "Thank You"),
  ]),
  ("Utility", [
    ("privacy.html",                        "Privacy Policy"),
    ("404.html",                            "404"),
  ]),
]
TEXT_FILES = [("robots.txt", "robots.txt"), ("llms.txt", "llms.txt"), ("sitemap.xml", "sitemap.xml")]

def read(p):    return open(os.path.join(ROOT, p), encoding="utf-8").read()
def rb(p):      return open(os.path.join(ROOT, p), "rb").read()

def data_uri(path):
    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    return f"data:{mime};base64," + base64.b64encode(rb(path)).decode()

# ---- collect every local asset any page references -------------------------
asset_paths = set()
raw = {}
for _, group in PAGES:
    for f, _ in group:
        raw[f] = read(f)
        base = os.path.dirname(f)
        for m in re.findall(r'(?:src|href)="([^"]+)"', raw[f]):
            if m.startswith(("http", "tel:", "sms:", "mailto:", "data:", "#", "//")):
                continue
            rel = os.path.normpath(os.path.join(base, m.split("#")[0]))
            if rel.endswith((".jpg", ".png", ".svg", ".webp", ".pdf")) and os.path.exists(os.path.join(ROOT, rel)):
                asset_paths.add(rel.replace(os.sep, "/"))

assets = {p: data_uri(p) for p in sorted(asset_paths)}

CSS = read("assets/css/site.css")
JS  = read("assets/js/site.js")

# Google Fonts is the one external host the artifact CSP allows, so the preview
# pulls the two families from there instead of carrying 91 KB of woff2 inline.
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap">')

BRIDGE = """<script>
(function(){
  // hand internal navigation back to the preview shell
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/^(https?:|tel:|sms:|mailto:|data:|blob:)/.test(href)) return;
    if (a.hasAttribute('download')) return;
    if (href.charAt(0) === '#' || href === '') return;
    e.preventDefault();
    parent.postMessage({ pps:'nav', href: href }, '*');
  }, true);
  // keep the shell's height readout honest
  function report(){ parent.postMessage({ pps:'h', h: document.documentElement.scrollHeight }, '*'); }
  addEventListener('load', report); setTimeout(report, 900);
})();
</script>"""

def prepare(path, html):
    """Strip the real <head> asset links, inline CSS/JS, tokenise asset URLs."""
    depth = path.count("/")
    prefix = "../" * depth

    # drop the links the bundle replaces
    html = re.sub(r'<link rel="preload" as="font"[^>]*>', "", html)
    # lambda replacements: the CSS/JS payloads contain \d, \s etc. and would
    # otherwise be parsed as regex backreference templates
    html = re.sub(r'<link rel="stylesheet" href="[^"]*fonts\.css">',
                  lambda _: FONTS, html, count=1)
    html = re.sub(r'<link rel="stylesheet" href="[^"]*site\.css">',
                  lambda _: "<style>" + CSS.replace("</style>", "<\\/style>") + "</style>",
                  html, count=1)
    # `defer` has no effect on an inline script, so the bundled JS must move to
    # the end of <body> — inlined where the original <script defer src> sat, it
    # would run before the DOM exists and bind to nothing.
    html = re.sub(r'<script defer src="[^"]*site\.js"></script>', "", html, count=1)

    # rewrite every remaining local asset reference to a lookup token
    def sub(m):
        attr, val = m.group(1), m.group(2)
        if val.startswith(("http", "tel:", "sms:", "mailto:", "data:", "#", "//")):
            return m.group(0)
        rel = os.path.normpath(os.path.join(os.path.dirname(path), val.split("#")[0])).replace(os.sep, "/")
        if rel in assets:
            return f'{attr}="@@{rel}@@"'
        return m.group(0)
    html = re.sub(r'(src|href)="([^"]+)"', sub, html)

    inline_js = "<script>" + JS.replace("</script>", "<\\/script>") + "</script>"
    html = html.replace("</body>", inline_js + BRIDGE + "</body>")
    return html

docs = {f: prepare(f, raw[f]) for _, g in PAGES for f, _ in g}
for f, _ in TEXT_FILES:
    docs[f] = read(f)

TITLES = {f: t for _, g in PAGES for f, t in g}
NAV = [[sec, [[f, t] for f, t in g]] for sec, g in PAGES]

def js(obj):
    """JSON for embedding inside a <script> block. The page payloads contain
    literal </script>, which would close the tag early — `<\/` is identical to
    the parser inside a JS string and invisible to JSON.parse."""
    return json.dumps(obj).replace("</", "<\\/").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")

shell = read("tools/preview-shell.html")
shell = (shell
  .replace("/*__NAV__*/",    js(NAV))
  .replace("/*__DOCS__*/",   js(docs))
  .replace("/*__ASSETS__*/", js(assets))
  .replace("/*__TEXTS__*/",  js([[f, t] for f, t in TEXT_FILES])))

open(OUT, "w", encoding="utf-8").write(shell)
print(f"preview.html  {os.path.getsize(OUT)/1024/1024:.2f} MB"
      f"  ({len(docs)} documents, {len(assets)} assets)")
