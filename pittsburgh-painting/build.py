#!/usr/bin/env python3
"""
Static site builder for Pittsburgh Painting & Property Solutions.

Assembles the shared chrome (head, header, footer, mobile bar) around the page
bodies in `_src/` and writes plain HTML to the site root. No dependencies —
`python3 build.py` and the output is deployable as-is.

Edit `_src/<page>.html` for content, this file for chrome, then re-run.
"""
import os, re, html, json, datetime, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(ROOT, "_src")

# Everything public lands in dist/ and nothing else does. That directory is the
# deploy target, so build.py (which holds LEAD_EMAIL) and the _src fragments
# never reach a CDN. assets/ already lives inside dist/ — it isn't copied.
OUT  = os.path.join(ROOT, "dist")

# ==========================================================================
#  CONFIG — the only block you need to touch to point leads somewhere real
# ==========================================================================
SITE  = "https://pittsburghpaintingpps.com"   # VERIFY: final domain
PHONE = "(412) 537-4866"
TEL   = "+14125374866"
BRAND = "Pittsburgh Painting &amp; Property Solutions"

# Where form submissions go. Leave blank and site.js confirms inline without
# posting anywhere (so a live form never hits a dead URL). See README
# § "Wiring up the form" for the Netlify / Formspree / CRM recipes.
FORM_ACTION = ""            # e.g. "https://formspree.io/f/xxxxxxx"

# Inbox shown to visitors and used for mailto: links. Blank hides the email
# and the site leans on the phone number instead.
LEAD_EMAIL  = ""            # e.g. "brian@pittsburghpaintingpps.com"

# The gated PDF the lead magnet delivers.
GUIDE_PDF   = "assets/pittsburgh-exterior-paint-checklist.pdf"

# Logo assets, extracted from the supplied artwork by tools/extract-logo.py.
#   LOGO        badge + paint roller, natural ~1.75:1 — header, mobile nav, footer
#   LOGO_ICON   badge alone, square    — Apple touch icon and PWA
#   FAVICON     the same at 64px       — browser tab, fetched on every view
#   LOGO_LOCKUP full logo with wordmark — share card and the guide PDF cover
LOGO        = "assets/logo-mark.png"
LOGO_W, LOGO_H = 760, 433
LOGO_ICON   = "assets/logo-icon.png"     # 512px, Apple touch icon / PWA
FAVICON     = "assets/favicon.png"       # 64px, fetched on every page view
LOGO_LOCKUP = "assets/logo-lockup.png"

# AI answer engines (ChatGPT, Perplexity, Claude, Google AI Overviews) are a
# growth channel for a local contractor, not a threat — so their crawlers are
# allowed in robots.txt. Flip to False to block the model-training ones.
ALLOW_AI_CRAWLERS = True
# ==========================================================================

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
"close":'<path d="M18 6 6 18M6 6l12 12"/>',
"leaf":'<path d="M11 20A7 7 0 0 1 4 13c0-6 8-11 16-11 0 8-5 16-11 16z"/><path d="M4 21c3-7 6-10 10-12"/>',
}
def ico(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    return (f'<svg{c} width="24" height="24" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="2" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true">{I[name]}</svg>')

def star_row(n=5):
    s = ('<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">'
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

GUIDE_TITLE = "The Pittsburgh Homeowner&rsquo;s Exterior Paint Checklist"

def magnet(base, ident="m"):
    """Inline email-capture band for the gated guide. Used on several pages, so
    every id is namespaced by `ident` to keep labels unique per page."""
    return f'''<div class="magnet" data-reveal>
  <img class="magnet-cover" src="{base}assets/img/guide-cover.jpg" width="800" height="1000"
       loading="lazy" decoding="async" alt="Cover of the free Pittsburgh exterior paint checklist">
  <div>
    <p class="eyebrow">Free download &middot; No cost, no catch</p>
    <h3 style="font-size:clamp(1.35rem,2.4vw,1.85rem);margin-top:.55rem">{GUIDE_TITLE}</h3>
    <p style="margin-top:.5rem;max-width:56ch">The 12 things Western PA weather does to a paint job
       &mdash; and the exact question to ask each bidder about every one. Take it to every
       walk&#8209;through, including ours.</p>
  </div>
  <div>
    <form class="magnet-form" data-guide="{ident}" {form_attrs()}novalidate>
      <div class="field">
        <label class="skip" for="{ident}-email">Email address</label>
        <input id="{ident}-email" name="email" type="email" autocomplete="email" required
               placeholder="you@example.com">
        <span class="err">Check that email address.</span>
      </div>
      <input type="hidden" name="lead_type" value="guide_download">
      <p hidden><label>Leave this blank <input name="company" tabindex="-1" autocomplete="off"></label></p>
      <button class="btn" type="submit">Send me the checklist {ico("arrow")}</button>
      <p class="magnet-note">{ico("lock")} One email, the PDF attached. No spam, unsubscribe anytime.</p>
    </form>
    <div class="magnet-done" data-guide-done hidden>
      <span class="tick">{ico("check")}</span>
      <div>
        <b style="color:#fff;display:block">Here it is &mdash; enjoy.</b>
        <a href="{base}{GUIDE_PDF}" download style="color:var(--gold);font-weight:700;text-decoration:underline;text-underline-offset:3px">
          Download the checklist (PDF)</a>
      </div>
    </div>
  </div>
</div>'''


def form_attrs():
    """Only emit an action once a real endpoint is configured — otherwise site.js
    confirms inline rather than posting at a dead URL."""
    return f'action="{FORM_ACTION}" method="POST" ' if FORM_ACTION else ""


def nudge(base):
    """Scroll-triggered slide-in for the guide. Desktop only, once per session."""
    return f'''<aside class="nudge" id="nudge" aria-labelledby="nudge-h" hidden>
  <button class="nudge-x" type="button" data-nudge-close aria-label="Dismiss">{ico("close")}</button>
  <div class="nudge-top">
    <img src="{base}assets/img/guide-cover.jpg" width="800" height="1000" loading="lazy"
         decoding="async" alt="">
    <div>
      <h4 id="nudge-h">Getting quotes? Take this with you.</h4>
      <p>The 12 questions that separate a paint job that lasts ten years from one that fails in three.</p>
    </div>
  </div>
  <form data-guide="n" {form_attrs()}novalidate>
    <div class="field">
      <label class="skip" for="n-email">Email address</label>
      <input id="n-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com">
      <span class="err">Check that email address.</span>
    </div>
    <input type="hidden" name="lead_type" value="guide_download_nudge">
    <p hidden><label>Leave this blank <input name="company" tabindex="-1" autocomplete="off"></label></p>
    <button class="btn btn-block" type="submit">Send me the free checklist</button>
  </form>
  <div data-guide-done hidden style="margin-top:.5rem">
    <b style="color:var(--ink);display:block">On its way &mdash; thanks.</b>
    <a href="{base}{GUIDE_PDF}" download style="color:var(--gold-ink);font-weight:700">Download it now (PDF)</a>
  </div>
</aside>'''


def related(base, current):
    """Cross-links between service pages. Real internal linking, not a link farm —
    every service is two clicks from every other one."""
    items = [(h, n, d) for h, n, d in SERVICES if not h.endswith(current)]
    cards = "".join(
        f'''<a class="card" href="{page_url(h)}" data-reveal><div class="card-b">
        <h3 style="font-size:1.15rem">{n}</h3><p style="font-size:.92rem">{d}</p>
        <span class="card-link">Learn more {ico("arrow")}</span></div></a>'''
        for h, n, d in items)
    return f'''<section class="sec-tight">
 <div class="wrap">
  <div class="sec-head" data-reveal><p class="eyebrow">Also from us</p>
   <h2 class="mt-5" style="font-size:clamp(1.6rem,3vw,2.2rem)">Other services</h2></div>
  <div class="grid g-3" data-stagger="70">{cards}</div>
 </div>
</section>'''


def crumbs_html(p, base):
    """Visible breadcrumb trail. Mirrors the BreadcrumbList JSON-LD exactly."""
    c = p.get("crumbs")
    if not c:
        return ""
    parts = []
    for i, (href, name) in enumerate(c):
        last = i == len(c) - 1
        parts.append(f'<li aria-current="page">{name}</li>' if last
                     else f'<li><a href="{page_url(href)}">{name}</a></li>'
                          f'<li aria-hidden="true" class="sep">/</li>')
    return ('<nav class="crumbs" aria-label="Breadcrumb"><div class="wrap"><ol>'
            + "".join(parts) + "</ol></div></nav>")


def head(p, base):
    canonical = SITE + page_url(p["file"])
    return f'''<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<script>document.documentElement.className+=" js"</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{p["title"]}</title>
<meta name="description" content="{p["desc"]}">
<link rel="canonical" href="{canonical}">
{'<meta name="robots" content="noindex, nofollow">' if p.get("noindex") else ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Pittsburgh Painting &amp; Property Solutions">
<meta property="og:locale" content="en_US">
<meta name="geo.region" content="US-PA">
<meta name="geo.placename" content="Pittsburgh, Pennsylvania">
<meta property="og:title" content="{p["title"]}">
<meta property="og:description" content="{p["desc"]}">
<meta property="og:image" content="{SITE}/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Pittsburgh Painting &amp; Property Solutions">
<meta property="og:url" content="{canonical}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#14161A">
<link rel="icon" href="{base}{FAVICON}" sizes="64x64" type="image/png">
<link rel="apple-touch-icon" href="{base}{LOGO_ICON}">
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
  <a class="brand" href="{page_url("index.html")}">
    <img src="{base}{LOGO}" alt="" width="{LOGO_W}" height="{LOGO_H}">
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
        return f'<a href="{page_url(href)}"{mark}{extra}>{label}</a>'
    svc = "".join(f'<a href="{page_url(h)}">{n}<small>{d}</small></a>' for h, n, d in SERVICES)
    nav = "".join(a(h, n) for h, n in NAV)
    msvc = "".join(f'<a class="sub" href="{page_url(h)}">{n}</a>' for h, n, _ in SERVICES)
    mnav = "".join(f'<a href="{page_url(h)}">{n}</a>' for h, n in NAV)
    svc_open = ' aria-current="page"' if cur.startswith("services/") else ""
    return f'''<div class="promo">
  <b>$1,000 OFF</b> full exterior repaints booked for Aug &middot; Sept &middot; Oct &nbsp;
  <a href="{page_url("offer.html")}">See the offer &rarr;</a>
</div>
<header class="site-header">
 <div class="wrap hdr">
  <a class="brand" href="{page_url("index.html")}">
    <img src="{base}{LOGO}" alt="{BRAND}" width="{LOGO_W}" height="{LOGO_H}">
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
    <a class="btn" href="{page_url("estimate.html")}">Free Estimate</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu"><span></span></button>
  </div>
 </div>
</header>
<div class="scrim" data-open="false"></div>
<nav class="mnav" id="mnav" data-open="false" aria-label="Mobile">
  <div class="mnav-head">
    <img src="{base}{LOGO}" alt="" width="{LOGO_W}" height="{LOGO_H}">
    <button class="burger" type="button" aria-expanded="true" aria-label="Close menu"><span></span></button>
  </div>
  <a href="{page_url("index.html")}">Home</a>
  <a href="{page_url("estimate.html")}">Get a Free Estimate</a>
  {msvc}
  {mnav}
  <a href="{page_url("offer.html")}">$1,000 Off Offer</a>
  <a class="btn btn-lg" href="tel:{TEL}" data-loc="mobile-nav">{ico("phone")} {PHONE}</a>
</nav>
'''

def footer(p, base):
    if p.get("bare"):
        return f'''<footer class="site-footer"><div class="wrap center">
  <p style="font-size:.85rem">&copy; <span data-year></span> {BRAND}. Fully insured. Serving Greater Pittsburgh.
  &nbsp;&middot;&nbsp; <a href="{page_url("privacy.html")}">Privacy</a></p>
</div></footer>
<div class="mobile-bar">
  <a class="btn" href="tel:{TEL}" data-loc="mobile-bar-offer">{ico("phone")} Call Brian &mdash; {PHONE}</a>
</div>
</body></html>'''
    svc = "".join(f'<li><a href="{page_url(h)}">{n}</a></li>' for h, n, _ in SERVICES)
    nav = "".join(f'<li><a href="{page_url(h)}">{n}</a></li>' for h, n in NAV)
    return f'''<footer class="site-footer">
 <div class="wrap">
  <div class="foot-grid">
   <div>
    <a class="foot-brand" href="{page_url("index.html")}">
      <img src="{base}{LOGO}" alt="" width="{LOGO_W}" height="{LOGO_H}">
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
   <div><h4>Company</h4><ul>{nav}<li><a href="{page_url("estimate.html")}">Free Estimate</a></li>
        <li><a href="{page_url("offer.html")}">Current Offer</a></li></ul></div>
   <div>
    <h4>Get in touch</h4>
    <ul>
      <li><a href="tel:{TEL}" data-loc="footer"><strong style="color:#fff;font-size:1.15rem">{PHONE}</strong></a></li>
      <li>Brian G &middot; Owner</li>
      <li>Mon&ndash;Sat, 7am&ndash;7pm</li>
      <li style="margin-top:1rem">Serving Greater Pittsburgh<br>and the surrounding suburbs</li>
      <li>Allegheny &middot; Washington &middot; Butler<br>&amp; Westmoreland counties, PA</li>
    </ul>
    <a class="btn mt-5" href="{page_url("estimate.html")}">Get My Free Estimate</a>
   </div>
  </div>
  <div class="foot-bot">
   <p>&copy; <span data-year></span> {BRAND} &middot; Family owned &amp; operated &middot;
      Fully insured &middot; Pittsburgh, PA &middot; {PHONE}
      <!-- VERIFY: add PA HIC registration number + insurance carrier here --></p>
   <ul>
     <li><a href="{page_url("privacy.html")}">Privacy Policy</a></li>
     <li><a href="{page_url('service-areas.html')}">Service Areas</a></li>
     <li><a href="{page_url("gallery.html")}">Our Work</a></li>
   </ul>
  </div>
 </div>
</footer>
<div class="mobile-bar">
  <a class="btn" href="tel:{TEL}" data-loc="mobile-bar">{ico("phone")} Call Brian</a>
  <a class="btn btn-dark" href="{page_url("estimate.html")}">Free Estimate</a>
</div>
{nudge(base) if p.get("nudge", True) else ""}
</body>
</html>'''

# ---------------------------------------------------------------- pages ----
PAGES = [
 dict(file="index.html", src="home.html",
      title="Pittsburgh Painting & Property Solutions | House Painters",
      desc="Family-owned Pittsburgh painting contractor: exterior and interior painting, cabinet refinishing and renovations. Free written estimate in 24 hours."),
 dict(file="services/exterior-painting.html", crumbs=[('index.html', 'Home'), ('services/exterior-painting.html', 'Exterior Painting')], service={'type': 'Exterior house painting', 'name': 'Exterior Painting in Pittsburgh', 'desc': 'Full exterior repainting of siding, brick, stucco, trim, soffits, shutters and decks across Greater Pittsburgh, with a published prep spec and two full coats of Sherwin-Williams.', 'low': 4500, 'high': 12000, 'priceNote': 'Typical full exterior repaint on a Pittsburgh two-story. Not a quote.'}, src="exterior.html", base="../",
      title="Exterior Painting Pittsburgh | Siding, Brick, Trim & Stucco",
      desc="Exterior house painting across Greater Pittsburgh. Published prep spec, Sherwin-Williams coatings, two full coats standard, written warranty."),
 dict(file="services/interior-painting.html", crumbs=[('index.html', 'Home'), ('services/interior-painting.html', 'Interior Painting')], service={'type': 'Interior house painting', 'name': 'Interior Painting in Pittsburgh', 'desc': 'Interior painting of walls, ceilings, trim, doors and stairwells in occupied Pittsburgh homes, including drywall and plaster repair.', 'low': 450, 'high': 900, 'priceNote': 'Typical per room including walls, ceiling and trim. Not a quote.'}, src="interior.html", base="../",
      title="Interior Painting Pittsburgh | Walls, Ceilings, Trim & Doors",
      desc="Interior painters serving Pittsburgh. Dust-controlled prep, furniture protection, crisp lines and a same-crew promise. Free written estimate in 24 hours."),
 dict(file="services/cabinet-refinishing.html", crumbs=[('index.html', 'Home'), ('services/cabinet-refinishing.html', 'Cabinet Refinishing')], service={'type': 'Kitchen cabinet refinishing', 'name': 'Cabinet Refinishing in Pittsburgh', 'desc': 'Kitchen cabinets degreased, sanded, bond-primed and sprayed to a durable factory-grade finish, typically in three to five working days.', 'low': 3000, 'high': 6500, 'priceNote': 'Typical Pittsburgh kitchen. Not a quote.'}, src="cabinets.html", base="../",
      title="Cabinet Refinishing & Painting Pittsburgh | Sprayed Finish",
      desc="Kitchen cabinet refinishing in Pittsburgh. Degrease, sand, bond-prime and spray a durable factory-grade finish for a fraction of replacement cost."),
 dict(file="services/renovations.html", crumbs=[('index.html', 'Home'), ('services/renovations.html', 'Renovations & Flips')], service={'type': 'Home renovation', 'name': 'Home Renovations and Cosmetic Flips in Pittsburgh', 'desc': 'Kitchen and bathroom remodels, flooring, basement finishing, carpentry and full cosmetic flips across Greater Pittsburgh.'}, src="renovations.html", base="../",
      title="Home Renovations & Cosmetic Flips | Pittsburgh",
      desc="Full renovations, cosmetic flips, kitchen and bath remodels, flooring and basement finishing across Greater Pittsburgh. One crew, one point of contact."),
 dict(file="guide.html", crumbs=[('index.html', 'Home'), ('guide.html', 'Free Paint Checklist')], src="guide.html", nudge=False,
      title="Free Pittsburgh Exterior Paint Checklist | 12 Questions to Ask",
      desc="Free PDF for Pittsburgh homeowners: the 12 things Western PA weather does to a paint job, and the exact question to ask every contractor bidding your house."),
 dict(file="gallery.html", crumbs=[('index.html', 'Home'), ('gallery.html', 'Before & After')], src="gallery.html",
      title="Before & After Gallery | Pittsburgh Painting & Property Solutions",
      desc="Real Pittsburgh before-and-after painting and renovation projects: exteriors, interiors, cabinets, basements and full flips."),
 dict(file="reviews.html", crumbs=[('index.html', 'Home'), ('reviews.html', 'Reviews')], src="reviews.html",
      title="Reviews | Pittsburgh Painting & Property Solutions",
      desc="What Pittsburgh homeowners say about working with Brian and the crew at Pittsburgh Painting & Property Solutions."),
 dict(file="service-areas.html", crumbs=[('index.html', 'Home'), ('service-areas.html', 'Service Areas')], src="areas.html",
      title="Service Areas | Painters in Pittsburgh & Surrounding Suburbs",
      desc="Painting and renovation services across Pittsburgh's city neighborhoods, South Hills, North Hills and the surrounding suburbs."),
 dict(file="about.html", crumbs=[('index.html', 'Home'), ('about.html', 'About')], src="about.html",
      title="About Brian & The Crew | Pittsburgh Painting & Property Solutions",
      desc="Family owned, fully insured, Pittsburgh based. Meet Brian G and the crew behind Pittsburgh Painting & Property Solutions."),
 dict(file="estimate.html", crumbs=[('index.html', 'Home'), ('estimate.html', 'Free Estimate')], src="estimate.html", nudge=False,
      title="Get a Free Estimate | Pittsburgh Painting & Property Solutions",
      desc="Tell us about your painting or renovation project and get a written, itemized estimate within 24 hours. Free, no pressure, no obligation."),
 dict(file="offer.html", src="offer.html", bare=True,
      title="$1,000 Off Full Exterior Repaints | Pittsburgh Painting",
      desc="Book your full exterior repaint for August, September or October and take $1,000 off, plus a free color rendering of your home."),
 dict(file="thank-you.html", src="thankyou.html", nudge=False, noindex=True,
      title="Thanks — request received | Pittsburgh Painting",
      desc="Your estimate request is in. Here is what happens next, when to expect a call back from Brian, and what the free written quote will include."),
 dict(file="privacy.html", crumbs=[('index.html', 'Home'), ('privacy.html', 'Privacy Policy')], src="privacy.html", nudge=False,
      title="Privacy Policy | Pittsburgh Painting & Property Solutions",
      desc="How Pittsburgh Painting & Property Solutions collects, uses and protects the information you submit through this website."),
 dict(file="404.html", src="404.html", nudge=False, noindex=True,
      title="Page not found | Pittsburgh Painting & Property Solutions",
      desc="That page has moved or no longer exists. Find painting services, the gallery, or request a free estimate from Pittsburgh Painting & Property Solutions."),
]

# ---------------------------------------------------------- structured data --
BIZ_ID  = SITE + "/#business"
SITE_ID = SITE + "/#website"

def _txt(html_str):
    """Strip tags/comments/entities down to a clean sentence for JSON-LD."""
    t = re.sub(r"<!--.*?-->", "", html_str, flags=re.S)
    t = re.sub(r"<[^>]+>", "", t)
    for a, b in (("&mdash;","—"),("&ndash;","–"),("&rsquo;","'"),("&lsquo;","'"),
                 ("&ldquo;",'"'),("&rdquo;",'"'),("&amp;","&"),("&nbsp;"," "),
                 ("&#8209;","-"),("&deg;","°"),("&middot;","·"),("&minus;","-"),
                 ("&hellip;","…"),("&star;","★"),("&#9733;","★")):
        t = t.replace(a, b)
    return re.sub(r"\s+", " ", t).strip()

FAQ_RE = re.compile(
    r'<button class="faq-q"[^>]*>(?P<q>.*?)<span class="chev">.*?</button>\s*'
    r'<div class="faq-a"><div>(?P<a>.*?)</div></div>', re.S)

def faq_schema(body):
    """Generate FAQPage JSON-LD from the page's own accordion markup, so the
    structured data can never drift from what a visitor actually reads."""
    qs = []
    for m in FAQ_RE.finditer(body):
        q, a = _txt(m.group("q")), _txt(m.group("a"))
        if q and a:
            qs.append({"@type": "Question", "name": q,
                       "acceptedAnswer": {"@type": "Answer", "text": a}})
    if not qs:
        return None
    return {"@type": "FAQPage", "@id": "#faq", "mainEntity": qs}

def business_node():
    node = {
      "@type": ["HomeAndConstructionBusiness", "PaintingContractor", "LocalBusiness"],
      "@id": BIZ_ID,
      "name": "Pittsburgh Painting & Property Solutions",
      "alternateName": ["Pittsburgh Paint Goat", "Pittsburgh Painting and Property Solutions"],
      "description": ("Family-owned painting contractor serving Greater Pittsburgh, Pennsylvania. "
                      "Exterior and interior house painting, kitchen cabinet refinishing, basement "
                      "coatings and full property renovations. Two full coats of Sherwin-Williams "
                      "and a written prep spec on every job."),
      "slogan": "Transforming homes. Elevating neighborhoods.",
      "telephone": "+1-412-537-4866",
      "url": SITE + "/",
      "image": SITE + "/assets/img/og-image.jpg",
      "logo": {"@type": "ImageObject", "url": SITE + "/" + LOGO_LOCKUP},
      "priceRange": "$$",
      "currenciesAccepted": "USD",
      "founder": {"@type": "Person", "name": "Brian G"},
      "knowsAbout": [
        "Exterior house painting", "Interior house painting", "Kitchen cabinet refinishing",
        "Painting brick", "Masonry coatings", "Basement waterproof coatings",
        "Deck staining", "Drywall and plaster repair", "Home renovation", "Cosmetic flips",
        "Freeze-thaw paint failure", "Surface preparation and priming"],
      "areaServed": [
        {"@type": "City", "name": "Pittsburgh", "addressRegion": "PA", "addressCountry": "US"},
        {"@type": "AdministrativeArea", "name": "Allegheny County, Pennsylvania"},
        {"@type": "AdministrativeArea", "name": "Washington County, Pennsylvania"},
        {"@type": "AdministrativeArea", "name": "Butler County, Pennsylvania"},
        {"@type": "AdministrativeArea", "name": "Westmoreland County, Pennsylvania"}],
      "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "07:00", "closes": "19:00"}],
      "sameAs": ["https://www.instagram.com/pittsburgh_paint_goat",
                 "https://www.facebook.com/"],
      "hasOfferCatalog": {
        "@type": "OfferCatalog", "name": "Painting and property services",
        "itemListElement": [
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": n,
           "areaServed": {"@type": "City", "name": "Pittsburgh"}}}
          for n in ("Exterior Painting", "Interior Painting", "Cabinet Refinishing",
                    "Home Renovation", "Basement Coating", "Deck Staining")]},
      "makesOffer": {
        "@type": "Offer",
        "name": "$1,000 off full exterior repaints booked for August, September or October",
        "description": ("$1,000 discount on full exterior repaints scheduled for August, "
                        "September or October, including a free digital colour rendering."),
        "priceCurrency": "USD",
        "itemOffered": {"@type": "Service", "name": "Exterior house painting"}},
      # NOTE: aggregateRating is deliberately absent. Do not add it until the
      # review count and average are real — invented ratings get sites penalised.
    }
    if LEAD_EMAIL:
        node["email"] = LEAD_EMAIL
    return node

def page_schema(p, base, body):
    canonical = SITE + page_url(p["file"])
    graph = [business_node(), {
        "@type": "WebSite", "@id": SITE_ID, "url": SITE + "/",
        "name": "Pittsburgh Painting & Property Solutions",
        "publisher": {"@id": BIZ_ID}, "inLanguage": "en-US"}]

    page = {"@type": "WebPage", "@id": canonical + "#webpage", "url": canonical,
            "name": p["title"], "description": p["desc"],
            "isPartOf": {"@id": SITE_ID}, "about": {"@id": BIZ_ID},
            "inLanguage": "en-US",
            "primaryImageOfPage": {"@type": "ImageObject",
                                   "url": SITE + "/assets/img/og-image.jpg"}}

    crumbs = p.get("crumbs")
    if crumbs:
        page["breadcrumb"] = {"@id": canonical + "#crumbs"}
        graph.append({
            "@type": "BreadcrumbList", "@id": canonical + "#crumbs",
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "name": name,
                 "item": SITE + page_url(href)}
                for i, (href, name) in enumerate(crumbs)]})

    # AEO: mark the page's lead answer as speakable for voice assistants
    if p.get("speakable", True):
        page["speakable"] = {"@type": "SpeakableSpecification",
                             "cssSelector": ["h1", ".lede"]}
    graph.append(page)

    svc = p.get("service")
    if svc:
        graph.append({
            "@type": "Service", "@id": canonical + "#service",
            "serviceType": svc["type"], "name": svc["name"],
            "description": svc.get("desc", p["desc"]),
            "provider": {"@id": BIZ_ID},
            "areaServed": [{"@type": "City", "name": "Pittsburgh", "addressRegion": "PA"},
                           {"@type": "AdministrativeArea", "name": "Greater Pittsburgh, Pennsylvania"}],
            "audience": {"@type": "Audience", "audienceType": "Homeowners in Greater Pittsburgh"},
            **({"offers": {"@type": "Offer", "priceCurrency": "USD",
                           "priceSpecification": {
                             "@type": "PriceSpecification", "priceCurrency": "USD",
                             "minPrice": svc["low"], "maxPrice": svc["high"],
                             "description": svc["priceNote"]}}} if svc.get("low") else {})})

    faq = faq_schema(body)
    if faq:
        faq["@id"] = canonical + "#faq"
        graph.append(faq)

    return ('<script type="application/ld+json">'
            + json.dumps({"@context": "https://schema.org", "@graph": graph},
                         ensure_ascii=False, separators=(",", ":"))
            + "</script>")

def last_modified(src_file):
    """When this page's content actually changed, from git. Stamping every page
    with today's date would be untrue and would make dist/ churn on every build."""
    try:
        r = subprocess.run(["git", "log", "-1", "--format=%cs", "--",
                            os.path.join("_src", src_file)],
                           cwd=ROOT, capture_output=True, text=True, timeout=5)
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip()
    except Exception:
        pass                                    # no git, shallow clone, new file
    return datetime.date.today().isoformat()


def page_url(f):
    """Public URL for a built page. Directory-style: /about/ rather than
    /about.html, because Cloudflare Pages 308-redirects .html to extensionless
    and that hop would invalidate every canonical, sitemap entry and @id."""
    if f == "index.html":
        return "/"
    if f == "404.html":
        return "/404.html"
    return "/" + f[:-len(".html")] + "/"


def out_path(f):
    """Where that page is written inside dist/. Every page becomes a directory
    except the homepage and 404.html — hosts look for 404.html at the root."""
    if f in ("index.html", "404.html"):
        return f
    return f[:-len(".html")] + "/index.html"


ALL_PAGE_FILES = None   # populated in build() once PAGES is known

def linkify(html_str):
    """Rewrite any remaining foo.html reference to its directory URL."""
    def sub(m):
        attr, path, frag = m.group(1), m.group(2), m.group(3) or ""
        f = path.lstrip("/")
        return f'{attr}="{page_url(f)}{frag}"' if f in ALL_PAGE_FILES else m.group(0)
    return re.sub(r'(href|src)="/?([\w/-]+\.html)(#[\w-]+)?"', sub, html_str)


TOKEN = re.compile(r"\{\{(\w+)(?::([^}]*))?\}\}")

def expand(text, base):
    """Replace {{icon:name}}, {{stars}}, {{phone}}, {{tel}}, {{base}} tokens."""
    def sub(m):
        k, arg = m.group(1), m.group(2)
        if k == "icon":  return ico(arg)
        if k == "stars": return star_row(int(arg or 5))
        if k == "phone": return PHONE
        if k == "tel":   return TEL
        if k == "base":       return "/"
        if k == "magnet":     return magnet(base, arg or "m")
        if k == "form_attrs": return form_attrs()
        if k == "guide_pdf":  return "/" + GUIDE_PDF
        if k == "email":      return LEAD_EMAIL
        if k == "related":    return related(base, arg or "")
        return m.group(0)
    return TOKEN.sub(sub, text)

# ---------------------------------------------------------- host config ----
HEADERS = """/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

/assets/img/*
  Cache-Control: public, max-age=2592000

/assets/css/*
  Cache-Control: public, max-age=604800

/assets/js/*
  Cache-Control: public, max-age=604800

/assets/*.pdf
  Cache-Control: public, max-age=604800

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/thank-you.html
  X-Robots-Tag: noindex
"""

REDIRECTS = """# Short URLs worth putting on business cards, yard signs and ad copy.
/quote            /estimate/    301
/free-estimate    /estimate/    301
/offer            /offer/       301
/checklist        /guide/       301
/services         /services/exterior-painting/   301
/exterior         /services/exterior-painting/   301
/interior         /services/interior-painting/   301
/cabinets         /services/cabinet-refinishing/ 301

# Anything that ever shipped with a .html extension keeps working.
/index.html       /             301
/:page.html       /:page/       301
/services/:page.html  /services/:page/  301
"""


def build():
    global ALL_PAGE_FILES
    ALL_PAGE_FILES = {p["file"] for p in PAGES}
    os.makedirs(OUT, exist_ok=True)
    written = []
    for p in PAGES:
        base = "/"   # links and assets are root-absolute at every depth
        body = open(os.path.join(SRC, p["src"]), encoding="utf-8").read()
        expanded = linkify(expand(body, base))
        out = (head(p, base) + header(p, base) + crumbs_html(p, base)
               + '<main id="main">\n' + expanded + '\n</main>\n'
               + page_schema(p, base, expanded) + "\n" + footer(p, base))
        dest = os.path.join(OUT, out_path(p["file"]))
        os.makedirs(os.path.dirname(dest) or OUT, exist_ok=True)
        open(dest, "w", encoding="utf-8").write(out)
        written.append((p["file"], len(out)))

    # sitemap
    urls = "".join(
        f'  <url><loc>{SITE}{page_url(p["file"])}</loc>'
        f'<lastmod>{last_modified(p["src"])}</lastmod>'
        f'<priority>{"1.0" if p["file"]=="index.html" else "0.8"}</priority></url>\n'
        for p in PAGES if not p.get("noindex"))
    open(os.path.join(OUT, "sitemap.xml"), "w").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '</urlset>\n')
    # robots.txt — AI answer engines are a growth channel for a local contractor,
    # so their crawlers get explicit permission. Set ALLOW_AI_CRAWLERS = False to
    # block the model-training ones while keeping the search/answer bots.
    answer_bots  = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User",
                    "PerplexityBot", "Perplexity-User", "Applebot", "Applebot-Extended",
                    "Amazonbot", "Bingbot", "DuckAssistBot", "Meta-ExternalAgent", "cohere-ai"]
    training_bots = ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot", "Bytespider"]
    lines = ["# Every crawler is welcome — this is a local business that wants to be found.",
             "User-agent: *", "Allow: /", "Disallow: /thank-you.html", ""]
    lines += ["# AI answer engines (ChatGPT, Perplexity, Claude, Copilot, AI Overviews).",
              "# These are the bots that read a page in order to cite it in an answer.", ""]
    for bot in answer_bots:
        lines += [f"User-agent: {bot}", "Allow: /", ""]
    lines += ["# Model-training crawlers." if ALLOW_AI_CRAWLERS
              else "# Model-training crawlers — blocked. Answer engines above are unaffected.", ""]
    for bot in training_bots:
        lines += [f"User-agent: {bot}", "Allow: /" if ALLOW_AI_CRAWLERS else "Disallow: /", ""]
    lines += [f"Sitemap: {SITE}/sitemap.xml", ""]
    open(os.path.join(OUT, "robots.txt"), "w").write("\n".join(lines))

    # llms.txt — an emerging convention that points AI agents at the pages worth
    # reading and states the business facts plainly. Cheap to publish, and the
    # downside if nothing consumes it is zero.
    llms = f"""# Pittsburgh Painting & Property Solutions

> Family-owned, fully insured painting contractor serving Greater Pittsburgh, Pennsylvania.
> Exterior and interior house painting, kitchen cabinet refinishing, basement coatings and
> full property renovations. Owner: Brian G. Phone: {PHONE}.

## Business facts

- **Name:** Pittsburgh Painting & Property Solutions (also known as "Pittsburgh Paint Goat")
- **Phone:** {PHONE}
- **Owner:** Brian G
- **Hours:** Monday to Saturday, 7am to 7pm
- **Service area:** City of Pittsburgh, plus the South Hills, North Hills and surrounding
  suburbs across Allegheny, Washington, Butler and Westmoreland counties, Pennsylvania
- **Status:** Family owned and operated, fully insured
- **Materials:** Sherwin-Williams, two full coats standard on every job
- **Estimates:** Free, written and itemised within 24 hours of the walk-through, including a
  free digital colour rendering of the home
- **Current offer:** $1,000 off full exterior repaints booked for August, September or October

## Typical Pittsburgh pricing

These are general ranges for the Pittsburgh market, not quotes.

- Full exterior repaint, two-story home: $4,500 to $12,000
- Interior painting, per room (walls, ceiling, trim): $450 to $900
- Kitchen cabinet refinishing: $3,000 to $6,500
- Exterior paint lifespan when properly prepped and two-coated: 8 to 12 years
- Exterior job duration: 4 to 8 working days plus weather
- Exterior painting season in Western PA: late April to late October

## Services

- [Exterior painting]({SITE}/services/exterior-painting.html): siding, brick, stucco, trim,
  fascia, soffits, shutters, doors and decks, with a published eight-step prep spec.
- [Interior painting]({SITE}/services/interior-painting.html): walls, ceilings, trim, doors and
  stairwells in occupied homes, including drywall and plaster repair.
- [Cabinet refinishing]({SITE}/services/cabinet-refinishing.html): degreased, sanded,
  bond-primed and sprayed to a factory-grade finish in three to five days.
- [Renovations and cosmetic flips]({SITE}/services/renovations.html): kitchens, bathrooms,
  flooring, basements, carpentry and rental turnovers.

## Key pages

- [Home]({SITE}/): overview, offer and process
- [Free estimate]({SITE}/estimate.html): the estimate request form
- [Before and after gallery]({SITE}/gallery.html): real Pittsburgh projects
- [Service areas]({SITE}/service-areas.html): neighbourhoods and suburbs covered
- [Free exterior paint checklist]({SITE}/guide.html): a 6-page PDF of the 12 questions a
  homeowner should ask any painting contractor bidding their house
- [About]({SITE}/about.html): the owner and the crew
- [Reviews]({SITE}/reviews.html)

## Why Pittsburgh is hard on exterior paint

Freeze-thaw cycling is the main cause of coating failure here: water enters an open joint,
freezes, expands and levers the paint off the substrate. Wet springs leave substrate that never
fully dries. Mature tree canopy keeps north elevations damp and grows mildew. Road salt attacks
the lower few feet of a house. Soft century-old brick and lime mortar must be coated with a
breathable masonry system or the brick face spalls permanently. Roughly ninety percent of
exterior paint failure is prep failure rather than product failure.

## Contact

Call or text Brian at {PHONE}, Monday to Saturday 7am to 7pm, or request a free written
estimate at {SITE}/estimate.html
"""
    open(os.path.join(OUT, "llms.txt"), "w").write(llms)

    # _headers and _redirects are the portable pair — Cloudflare Pages and
    # Netlify both read them, so there is no host-specific config to keep in sync.
    open(os.path.join(OUT, "_headers"), "w").write(HEADERS)
    open(os.path.join(OUT, "_redirects"), "w").write(REDIRECTS)

    for f, n in written:
        print(f"  {f:<38} {n/1024:6.1f} KB")
    print(f"\n{len(written)} pages + sitemap.xml + robots.txt + llms.txt"
          f" + _headers + _redirects  ->  dist/")

if __name__ == "__main__":
    build()
