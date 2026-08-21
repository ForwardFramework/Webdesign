#!/usr/bin/env python3
"""
Build a single self-contained HTML file containing every page of the site.

Used for sharing a clickable preview where the multi-file site can't be hosted.
Each page's <main> content is stored in an inert script block and swapped in by
a small client-side router, so no two pages' element IDs are ever in the DOM at
once. The production site in the repo root is unaffected.

    python3 tools/build_preview.py     ->  dist/preview.html
"""

import base64
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PAGES = [
    ("/", "index.html"),
    ("/services/index.html", "services/index.html"),
    ("/services/web-design.html", "services/web-design.html"),
    ("/services/ai-consulting.html", "services/ai-consulting.html"),
    ("/services/automation.html", "services/automation.html"),
    ("/services/marketing.html", "services/marketing.html"),
    ("/services/ad-management.html", "services/ad-management.html"),
    ("/services/social-media-marketing.html", "services/social-media-marketing.html"),
    ("/services/business-systems.html", "services/business-systems.html"),
    ("/results.html", "results.html"),
    ("/about.html", "about.html"),
    ("/contact.html", "contact.html"),
    ("/thank-you.html", "thank-you.html"),
    ("/privacy.html", "privacy.html"),
    ("/terms.html", "terms.html"),
    ("/404.html", "404.html"),
]


def read(p):
    return open(os.path.join(ROOT, p), encoding="utf-8").read()


index = read("index.html")

shell_top = re.search(r'(<a class="skip".*?)<main id="main">', index, re.S).group(1)
shell_bottom = re.search(r"</main>(.*?)<script src=", index, re.S).group(1)

css = read("assets/css/styles.css")
js = read("assets/js/main.js")

favicon = base64.b64encode(read("assets/img/favicon.svg").encode()).decode()

blocks = []
for path, filename in PAGES:
    doc = read(filename)
    # Unescape first: the source title already contains entities, and
    # escaping them again would render "&amp;amp;" in the tab.
    title = html.unescape(re.search(r"<title>(.*?)</title>", doc, re.S).group(1).strip())
    main = re.search(r'<main id="main">(.*?)</main>', doc, re.S)
    if not main:
        # thank-you / 404 have their content directly in the body shell
        main = re.search(r"<main id=\"main\">(.*)</main>", doc, re.S)
    body = main.group(1)
    # The content is parked inside a <script> block, so it must not close one.
    assert "</script" not in body.lower(), f"{filename} contains a script close tag"
    blocks.append(
        f'<script type="text/ff-page" data-path="{path}" data-title="{html.escape(title, quote=True)}">'
        f"{body}</script>"
    )

router = """
(function () {
  'use strict';
  var host = document.getElementById('main');
  var pages = {};
  Array.prototype.forEach.call(document.querySelectorAll('script[type="text/ff-page"]'), function (s) {
    pages[s.getAttribute('data-path')] = { html: s.textContent, title: s.getAttribute('data-title') };
  });

  function normalize(p) {
    if (!p || p === '/') return '/';
    if (p.charAt(p.length - 1) === '/') return p + 'index.html';
    return p;
  }

  function navigate(path, hash) {
    path = normalize(path);
    var page = pages[path] || pages['/404.html'];
    host.innerHTML = page.html;
    document.title = page.title;

    Array.prototype.forEach.call(document.querySelectorAll('.nav-list .nav-link'), function (a) {
      a.classList.remove('is-active');
      a.removeAttribute('aria-current');
    });
    var active = document.querySelector('.nav-list a[href="' + path + '"]');
    if (active) { active.classList.add('is-active'); active.setAttribute('aria-current', 'page'); }

    if (window.FF && window.FF.initPage) window.FF.initPage(host);

    if (hash) {
      var target = document.getElementById(hash.slice(1));
      if (target) { target.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }

  window.FF = window.FF || {};
  window.FF.navigate = navigate;

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;          // in-page anchor
    if (href.charAt(0) !== '/') return;                    // external, tel:, mailto:
    e.preventDefault();
    if (/\\.(xml|txt|webmanifest)$/.test(href)) return;     // no equivalent in a single file
    var hash = '', i = href.indexOf('#');
    if (i > -1) { hash = href.slice(i); href = href.slice(0, i); }
    navigate(href, hash);
  });

  navigate('/');
})();
"""

out = f"""<title>Forward Framework</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0A0A0A">
<link rel="icon" href="data:image/svg+xml;base64,{favicon}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap">
<script>document.documentElement.classList.add('js');</script>
<style>
{css}
</style>

{shell_top}
<main id="main"></main>
{shell_bottom}

{chr(10).join(blocks)}

<script>
{js}
</script>
<script>
{router}
</script>
"""

os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
dest = os.path.join(ROOT, "dist", "preview.html")
open(dest, "w", encoding="utf-8").write(out)
print(f"wrote dist/preview.html — {len(PAGES)} pages, {len(out) / 1024:.0f} KB")

# ---------------------------------------------------------------------------
# Standalone build: the same single file, but a complete HTML document that can
# be pasted into a host's single-file editor and served as-is.
# ---------------------------------------------------------------------------
home = read("index.html")
head_meta = re.search(r"<title>.*?</title>", home, re.S).group(0)
desc = re.search(r'<meta name="description"[^>]*>', home).group(0)
og = "\n".join(re.findall(r'<meta property="og:[^>]*>', home))
tw = "\n".join(re.findall(r'<meta name="twitter:[^>]*>', home))
schema = re.search(r'<script type="application/ld\+json">.*?</script>', home, re.S).group(0)

standalone = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{head_meta}
{desc}
<meta name="theme-color" content="#0A0A0A">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
{og}
{tw}
<link rel="icon" href="data:image/svg+xml;base64,{favicon}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap">
<script>document.documentElement.classList.add('js');</script>
<style>
{css}
</style>
{schema}
</head>
<body>

{shell_top}
<main id="main"></main>
{shell_bottom}

{chr(10).join(blocks)}

<script>
{js}
</script>
<script>
{router}
</script>
</body>
</html>
"""
os.makedirs(os.path.join(ROOT, "dist", "single-file"), exist_ok=True)
sdest = os.path.join(ROOT, "dist", "single-file", "index.html")
open(sdest, "w", encoding="utf-8").write(standalone)
print(f"wrote dist/single-file/index.html — {len(standalone) / 1024:.0f} KB (complete document)")
