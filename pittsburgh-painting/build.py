#!/usr/bin/env python3
"""
Static site builder for Pittsburgh Painting & Property Solutions.

Assembles the shared chrome (head, header, footer, mobile bar) around the page
bodies in `_src/` and writes plain HTML to the site root. No dependencies —
`python3 build.py` and the output is deployable as-is.

Edit `_src/<page>.html` for content, this file for chrome, then re-run.
"""
import os, re, html, datetime

ROOT   = os.path.dirname(os.path.abspath(__file__))
SRC    = os.path.join(ROOT, "_src")
SITE   = "https://pittsburghpaintingpps.com"          # VERIFY: final domain
PHONE  = "(412) 537-4866"
TEL    = "+14125374866"
BRAND  = "Pittsburgh Painting &amp; Property Solutions"

# ---------------------------------------------------------------- icons ----
I = {
"phone":'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
"check":'<path d="m20 6-11 11-5-5"/>',
"star":'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2l-5-4.9 6.9-1z"/>',
"shield":'<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1 1 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
"arrow":'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
"chev":'<path d="m6 9 6 6 6-6"/>',
"lr":'<path d="m8 7-5 5 5 5"/><path d="m16 7 5 5-5 5"/>',
"fb":'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
"ig":'<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4"/><path d="M17.5 6.5h.01"/>',
"lock":'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
"clock":'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
"pin":'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
"brush":'<path d="m14.6 11.3 4-4a2.8 2.8 0 0 0-4-4l-4 4"/><path d="M18.4 7.3 20 5.7"/><path d="M9 22c3 0 5-2 5-5v-3H8v3c0 1.7-1.3 3-3 3z"/><path d="M14 14 8.5 8.5"/>',
"home":'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
"spark":'<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7.8 7.8M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2"/><circle cx="12" cy="12" r="3"/>',
"hammer":'<path d="m15 12-8.4 8.4a2.1 2.1 0 0 1-3-3L12 9"/><path d="M17.6 6.4 22 10.8"/><path d="m18 15 4-4-7-7-4 4z"/>',
"drop":'<path d="M12 22a7 7 0 0 0 7-7c0-4-7-13-7-13S5 11 5 15a7 7 0 0 0 7 7"/>',
"layers":'<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
"cal":'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
"award":'<circle cx="12" cy="8" r="6"/><path d="m8.2 13.4-1.4 8L12 19l5.2 2.4-1.4-8"/>',
"users":'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
"mail":'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m2 7 10 6 10-6"/>',
"msg":'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
"ruler":'<path d="M3 9h18M3 15h18M7 4v16M17 4v16"/>',
"truck":'<path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-4l-3-4h-4v8h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
"file":'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
"leaf":'<path d="M11 20A7 7 0 0 1 4 13c0-6 8-11 16-11 0 8-5 16-11 16z"/><path d="M4 21c3-7 6-10 10-12"/>',
}
def ico(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    return (f'<svg{c} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{I[name]}</svg>')

def star_row(n=5):
    s = ('<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">'
         + I["star"].replace('<path d','<path d') + '</svg>')
    return f'<div class="stars" role="img" aria-label="{n} out of 5 stars">' + s*n + '</div>'

# ---------------------------------------------------------------- nav ------
SERVICES = [
    ("services/exterior-painting.html", "Exterior Painting",  "Siding, trim, brick, stucco, decks"),
    ("services/interior-painting.html", "Interior Painting",  "Walls, ceilings, trim, doors"),
    ("services/cabinet-refinishing.html","Cabinet Refinishing","Sprayed factory-grade finish"),
    ("services/renovations.html",       "Renovations &amp; Flips","Kitchens, baths, flooring, basements"),
]
NAV = [("gallery.html","Before &amp; After"),("reviews.html","Reviews"),
       ("service-areas.html","Service Areas"),("about.html","About")]

def head(p, base):
    canonical = SITE + "/" + ("" if p["file"] == "index.html" else p["file"])
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<script>document.documentElement.className+=" js"</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{p["title"]}</title>
<meta name="description" content="{p["desc"]}">
<link rel="canonical" href="{canonical}">
{'<meta name="robots" content="noindex, nofollow">' if p.get("noindex") else ''}
<meta property="og:type" content="website">
<meta property="og:title" content="{p["title"]}">
<meta property="og:description" content="{p["desc"]}">
<meta property="og:image" content="{SITE}/assets/img/og-image.jpg">
<meta property="og:url" content="{canonical}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0E1116">
<link rel="icon" href="{base}assets/logo-mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{base}assets/logo-mark.svg">
<link rel="preload" as="font" type="font/woff2" href="{base}assets/fonts/inter-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="{base}assets/fonts/barlow-condensed-800.woff2" crossorigin>
<link rel="stylesheet" href="{base}assets/css/fonts.css">
<link rel="stylesheet" href="{base}assets/css/site.css">
{p.get("headextra","")}
<script defer src="{base}assets/js/site.js"></script>
</head>
<body>
<a href="#main" class="btn skip">Skip to content</a>
'''

def header(p, base):
    if p.get("bare"):
        return f'''<header class="site-header"><div class="wrap hdr">
  <a class="brand" href="{base}index.html">
    <img src="{base}assets/logo-mark.svg" alt="" width="46" height="46">
    <span class="brand-txt"><b>Pittsburgh</b><span>Painting &amp; Property Solutions</span></span>
  </a>
  <div class="hdr-cta" style="margin-left:auto">
    <a class="hdr-phone" href="tel:{TEL}" data-loc="header">{ico("phone")}
      <span>{PHONE}<small>Call or text Brian</small></span></a>
  </div>
</div></header>
'''
    cur = p["file"]
    def a(href, label, extra=""):
        mark = ' aria-current="page"' if href == cur else ""
        return f'<a href="{base}{href}"{mark}{extra}>{label}</a>'
    svc = "".join(f'<a href="{base}{h}">{n}<small>{d}</small></a>' for h, n, d in SERVICES)
    nav = "".join(a(h, n) for h, n in NAV)
    msvc = "".join(f'<a class="sub" href="{base}{h}">{n}</a>' for h, n, _ in SERVICES)
    mnav = "".join(f'<a href="{base}{h}">{n}</a>' for h, n in NAV)
    svc_open = ' aria-current="page"' if cur.startswith("services/") else ""
    return f'''<div class="promo">
  <b>$1,000 OFF</b> full exterior repaints booked for Aug &middot; Sept &middot; Oct &nbsp;
  <a href="{base}offer.html">See the offer &rarr;</a>
</div>
<header class="site-header">
 <div class="wrap hdr">
  <a class="brand" href="{base}index.html">
    <img src="{base}assets/logo-mark.svg" alt="{BRAND}" width="46" height="46">
    <span class="brand-txt"><b>Pittsburgh</b><span>Painting &amp; Property Solutions</span></span>
  </a>
  <nav class="nav" aria-label="Main">
    <div class="has-menu" data-open="false">
      <button type="button" aria-expanded="false"{svc_open}>Services {ico("chev")}</button>
      <div class="menu">{svc}</div>
    </div>
    {nav}
  </nav>
  <div class="hdr-cta">
    <a class="hdr-phone" href="tel:{TEL}" data-loc="header">{ico("phone")}
      <span>{PHONE}<small>Call or text Brian</small></span></a>
    <a class="btn" href="{base}estimate.html">Free Estimate</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu"><span></span></button>
  </div>
 </div>
</header>
<div class="scrim" data-open="false"></div>
<nav class="mnav" id="mnav" data-open="false" aria-label="Mobile">
  <div class="mnav-head">
    <img src="{base}assets/logo-mark.svg" alt="" width="44" height="44">
    <button class="burger" type="button" aria-expanded="true" aria-label="Close menu"><span></span></button>
  </div>
  <a href="{base}index.html">Home</a>
  <a href="{base}estimate.html">Get a Free Estimate</a>
  {msvc}
  {mnav}
  <a href="{base}offer.html">$1,000 Off Offer</a>
  <a class="btn btn-lg" href="tel:{TEL}" data-loc="mobile-nav">{ico("phone")} {PHONE}</a>
</nav>
'''

def footer(p, base):
    if p.get("bare"):
        return f'''<footer class="site-footer"><div class="wrap center">
  <p style="font-size:.85rem">&copy; <span data-year></span> {BRAND}. Fully insured. Serving Greater Pittsburgh.
  &nbsp;&middot;&nbsp; <a href="{base}privacy.html">Privacy</a></p>
</div></footer>
<div class="mobile-bar">
  <a class="btn" href="tel:{TEL}" data-loc="mobile-bar-offer">{ico("phone")} Call Brian &mdash; {PHONE}</a>
</div>
</body></html>'''
    svc = "".join(f'<li><a href="{base}{h}">{n}</a></li>' for h, n, _ in SERVICES)
    nav = "".join(f'<li><a href="{base}{h}">{n}</a></li>' for h, n in NAV)
    return f'''<footer class="site-footer">
 <div class="wrap">
  <div class="foot-grid">
   <div>
    <a class="foot-brand" href="{base}index.html">
      <img src="{base}assets/logo-mark.svg" alt="" width="52" height="52">
      <span><b>Pittsburgh</b><span>Painting &amp; Property Solutions</span></span>
    </a>
    <p style="max-width:34ch">Family owned and operated. Interior and exterior painting, cabinet
       refinishing and full property renovations across Greater Pittsburgh.</p>
    <div class="socials">
      <a href="https://www.facebook.com/" aria-label="Facebook" rel="noopener">{ico("fb")}</a>
      <a href="https://www.instagram.com/pittsburgh_paint_goat" aria-label="Instagram" rel="noopener">{ico("ig")}</a>
      <a href="sms:{TEL}" aria-label="Text us">{ico("msg")}</a>
    </div>
   </div>
   <div><h4>Services</h4><ul>{svc}</ul></div>
   <div><h4>Company</h4><ul>{nav}<li><a href="{base}estimate.html">Free Estimate</a></li>
        <li><a href="{base}offer.html">Current Offer</a></li></ul></div>
   <div>
    <h4>Get in touch</h4>
    <ul>
      <li><a href="tel:{TEL}" data-loc="footer"><strong style="color:#fff;font-size:1.15rem">{PHONE}</strong></a></li>
      <li>Brian G &middot; Owner</li>
      <li>Mon&ndash;Sat, 7am&ndash;7pm</li>
      <li style="margin-top:1rem">Serving Greater Pittsburgh<br>and the surrounding suburbs</li>
    </ul>
    <a class="btn mt-5" href="{base}estimate.html">Get My Free Estimate</a>
   </div>
  </div>
  <div class="foot-bot">
   <p>&copy; <span data-year></span> {BRAND}. All rights reserved.
      <!-- VERIFY: add PA HIC registration number + insurance carrier here --></p>
   <ul>
     <li><a href="{base}privacy.html">Privacy Policy</a></li>
     <li><a href="{base}service-areas.html">Service Areas</a></li>
     <li><a href="{base}gallery.html">Our Work</a></li>
   </ul>
  </div>
 </div>
</footer>
<div class="mobile-bar">
  <a class="btn" href="tel:{TEL}" data-loc="mobile-bar">{ico("phone")} Call Brian</a>
  <a class="btn btn-dark" href="{base}estimate.html">Free Estimate</a>
</div>
</body>
</html>'''

# ---------------------------------------------------------------- pages ----
PAGES = [
 dict(file="index.html", src="home.html",
      title="Pittsburgh Painting & Property Solutions | House Painters",
      desc="Family-owned Pittsburgh painting contractor: exterior and interior painting, cabinet refinishing and renovations. Free written estimate in 24 hours."),
 dict(file="services/exterior-painting.html", src="exterior.html", base="../",
      title="Exterior Painting Pittsburgh | Siding, Brick, Trim & Stucco",
      desc="Exterior house painting across Greater Pittsburgh. Published prep spec, Sherwin-Williams coatings, two full coats standard, written warranty."),
 dict(file="services/interior-painting.html", src="interior.html", base="../",
      title="Interior Painting Pittsburgh | Walls, Ceilings, Trim & Doors",
      desc="Interior painters serving Pittsburgh. Dust-controlled prep, furniture protection, crisp lines and a same-crew promise. Free written estimate in 24 hours."),
 dict(file="services/cabinet-refinishing.html", src="cabinets.html", base="../",
      title="Cabinet Refinishing & Painting Pittsburgh | Sprayed Finish",
      desc="Kitchen cabinet refinishing in Pittsburgh. Degrease, sand, bond-prime and spray a durable factory-grade finish for a fraction of replacement cost."),
 dict(file="services/renovations.html", src="renovations.html", base="../",
      title="Home Renovations & Cosmetic Flips | Pittsburgh",
      desc="Full renovations, cosmetic flips, kitchen and bath remodels, flooring and basement finishing across Greater Pittsburgh. One crew, one point of contact."),
 dict(file="gallery.html", src="gallery.html",
      title="Before & After Gallery | Pittsburgh Painting & Property Solutions",
      desc="Real Pittsburgh before-and-after painting and renovation projects: exteriors, interiors, cabinets, basements and full flips."),
 dict(file="reviews.html", src="reviews.html",
      title="Reviews | Pittsburgh Painting & Property Solutions",
      desc="What Pittsburgh homeowners say about working with Brian and the crew at Pittsburgh Painting & Property Solutions."),
 dict(file="service-areas.html", src="areas.html",
      title="Service Areas | Painters in Pittsburgh & Surrounding Suburbs",
      desc="Painting and renovation services across Pittsburgh's city neighborhoods, South Hills, North Hills and the surrounding suburbs."),
 dict(file="about.html", src="about.html",
      title="About Brian & The Crew | Pittsburgh Painting & Property Solutions",
      desc="Family owned, fully insured, Pittsburgh based. Meet Brian G and the crew behind Pittsburgh Painting & Property Solutions."),
 dict(file="estimate.html", src="estimate.html",
      title="Get a Free Estimate | Pittsburgh Painting & Property Solutions",
      desc="Tell us about your painting or renovation project and get a written, itemized estimate within 24 hours. Free, no pressure, no obligation."),
 dict(file="offer.html", src="offer.html", bare=True,
      title="$1,000 Off Full Exterior Repaints | Pittsburgh Painting",
      desc="Book your full exterior repaint for August, September or October and take $1,000 off, plus a free color rendering of your home."),
 dict(file="thank-you.html", src="thankyou.html", noindex=True,
      title="Thanks — request received | Pittsburgh Painting",
      desc="Your estimate request is in. Here is what happens next and when to expect a call back from Brian."),
 dict(file="privacy.html", src="privacy.html",
      title="Privacy Policy | Pittsburgh Painting & Property Solutions",
      desc="How Pittsburgh Painting & Property Solutions collects, uses and protects the information you submit through this website."),
 dict(file="404.html", src="404.html", noindex=True,
      title="Page not found | Pittsburgh Painting & Property Solutions",
      desc="That page has moved or no longer exists. Find painting services, the gallery, or request a free estimate from Pittsburgh Painting & Property Solutions."),
]

TOKEN = re.compile(r"\{\{(\w+)(?::([^}]*))?\}\}")

def expand(text, base):
    """Replace {{icon:name}}, {{stars}}, {{phone}}, {{tel}}, {{base}} tokens."""
    def sub(m):
        k, arg = m.group(1), m.group(2)
        if k == "icon":  return ico(arg)
        if k == "stars": return star_row(int(arg or 5))
        if k == "phone": return PHONE
        if k == "tel":   return TEL
        if k == "base":  return base
        return m.group(0)
    return TOKEN.sub(sub, text)

def build():
    written = []
    for p in PAGES:
        base = p.get("base", "")
        body = open(os.path.join(SRC, p["src"]), encoding="utf-8").read()
        out  = head(p, base) + header(p, base) + '<main id="main">\n' + expand(body, base) \
             + '\n</main>\n' + footer(p, base)
        dest = os.path.join(ROOT, p["file"])
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, "w", encoding="utf-8").write(out)
        written.append((p["file"], len(out)))

    # sitemap
    today = datetime.date.today().isoformat()
    urls = "".join(
        f'  <url><loc>{SITE}/{"" if p["file"]=="index.html" else p["file"]}</loc>'
        f'<lastmod>{today}</lastmod>'
        f'<priority>{"1.0" if p["file"]=="index.html" else "0.8"}</priority></url>\n'
        for p in PAGES if not p.get("noindex"))
    open(os.path.join(ROOT, "sitemap.xml"), "w").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '</urlset>\n')
    open(os.path.join(ROOT, "robots.txt"), "w").write(
        f"User-agent: *\nAllow: /\nDisallow: /thank-you.html\n\nSitemap: {SITE}/sitemap.xml\n")

    for f, n in written:
        print(f"  {f:<38} {n/1024:6.1f} KB")
    print(f"\n{len(written)} pages + sitemap.xml + robots.txt")

if __name__ == "__main__":
    build()
