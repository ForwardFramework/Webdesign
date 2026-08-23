#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bundle the built site into one self-contained, fully navigable HTML file.

Used for the shareable client preview (Claude Artifact / any single-file host).
The design system, markup and behaviour are identical to the deployed site —
only the page transport changes: a tiny client-side router swaps <main> content
instead of the browser fetching a new document.

    python3 build.py && python3 make-preview.py
"""
import html
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(ROOT, "site")
OUT = os.path.join(ROOT, "preview", "krain-preview.html")

sys.path.insert(0, os.path.join(ROOT, "src"))
import data as D  # noqa: E402


def read(*p):
    with open(os.path.join(SITE, *p), encoding="utf-8") as f:
        return f.read()


def main_of(doc):
    m = re.search(r'<main id="main">(.*?)</main>', doc, re.S)
    return m.group(1) if m else ""


def title_of(doc):
    return html.unescape(re.search(r"<title>(.*?)</title>", doc, re.S).group(1))


# ------------------------------------------------------------------ collect
pages = {}
for dirpath, _, files in os.walk(SITE):
    for f in files:
        if not f.endswith(".html"):
            continue
        full = os.path.join(dirpath, f)
        rel = "/" + os.path.relpath(full, SITE).replace(os.sep, "/")
        path = rel[:-10] if rel.endswith("/index.html") else rel
        if path == "":
            path = "/"
        doc = read(os.path.relpath(full, SITE))
        body = main_of(doc)
        if "</script" in body.lower():
            raise SystemExit("view %s contains a script close tag" % path)
        pages[path] = {"title": title_of(doc), "html": body}

home = read("index.html")
shell_head, rest = home.split('<main id="main">', 1)
shell_foot = rest.split("</main>", 1)[1].replace(
    '<script src="/assets/js/site.js" defer></script>', "").replace("</body>", "").replace("</html>", "")

# header/footer markup only — drop the document head
header = shell_head.split("</head>", 1)[1]
header = header.replace("<body>", "").strip()

css = read("assets", "css", "site.css")
js = read("assets", "js", "site.js")

views = "".join(
    f'<script type="text/html" data-view="{p}" data-title="{html.escape(v["title"], quote=True)}">'
    f'{v["html"]}</script>' for p, v in sorted(pages.items()))

ROUTER = """
(function () {
  var VIEW = document.getElementById('view');
  var STORE = {};
  Array.prototype.forEach.call(document.querySelectorAll('script[data-view]'), function (s) {
    STORE[s.dataset.view] = { html: s.textContent, title: s.dataset.title };
  });

  function render(path, query, push) {
    var page = STORE[path] || STORE['/404.html'];
    VIEW.innerHTML = page.html;
    document.title = page.title;
    if (push !== false) {
      try { history.pushState({ p: path, q: query || '' }, '', '#' + path + (query || '')); } catch (e) {}
    }
    // Query string drives the thank-you page's personalisation.
    if (query) {
      var p = new URLSearchParams(query);
      var n = p.get('n'), h = VIEW.querySelector('[data-ty-name]');
      if (n && h) h.textContent = 'Thanks, ' + n.replace(/[^\\w\\s'-]/g, '') + ' —';
      var ref = p.get('ref'), el = VIEW.querySelector('[data-ty-project]');
      if (ref && el) {
        el.textContent = ({ 'custom-home': 'Custom home', 'log-home': 'Log or timber frame home',
          'addition': 'Addition or remodel', 'garage': 'Garage, barn or steel building',
          'deck': 'Deck or outdoor living', 'roofing': 'Roofing, siding or exterior' })[ref] || 'Your project';
        var w = el.closest('[data-ty-project-wrap]'); if (w) w.hidden = false;
      }
    }
    document.querySelectorAll('.nav a, .mobile-nav a, .nav-item > button').forEach(function (a) {
      a.removeAttribute('aria-current');
      if (a.tagName === 'A' && a.getAttribute('href') === path) a.setAttribute('aria-current', 'page');
    });
    window.krainInitPage(VIEW);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  window.krainNavigate = function (url) {
    var i = url.indexOf('?');
    render(i < 0 ? url : url.slice(0, i), i < 0 ? '' : url.slice(i));
  };

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="/"]');
    if (!a || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (href.indexOf('/assets/') === 0 || /\\.(xml|txt|webmanifest)$/.test(href)) return;
    ev.preventDefault();
    window.krainNavigate(href);
    var mn = document.querySelector('.mobile-nav.is-open');
    if (mn) document.querySelector('.burger').click();
  });

  window.addEventListener('popstate', function (e) {
    var s = e.state || {};
    render(s.p || '/', s.q || '', false);
  });

  var start = location.hash.slice(1) || '/';
  var qi = start.indexOf('?');
  render(qi < 0 ? start : start.slice(0, qi), qi < 0 ? '' : start.slice(qi), false);
})();
"""

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Inter:wght@400;500;550;600;650;700&'
         'family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap">')

doc = f"""<title>Krain Construction</title>
{FONTS}
<style>
{css}
/* Preview shell: the router swaps this element's contents. */
#view{{display:block}}
</style>

<a class="skip" href="#view">Skip to content</a>
{header}
<div id="view"></div>
{shell_foot}
{views}
<script>
{js}
</script>
<script>
{ROUTER}
</script>
"""

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(doc)
print(f"  {len(pages)} views bundled -> {OUT} ({os.path.getsize(OUT)/1024:.0f} KB)")
