"""Layout shell, shared UI blocks and JSON-LD structured data.

Structured data notes (this is the AEO/GEO engine of the site):
  * Every page emits a single @graph so the entities cross-reference by @id
    instead of repeating themselves. That is what lets an engine understand
    "this Service is offered by this LocalBusiness in these places".
  * The LocalBusiness node is identical on every page, with a stable @id, so
    the whole site resolves to one business entity.
  * FAQPage, Service, BreadcrumbList and ImageGallery are layered per page.
  * `speakable` marks the answer capsules for voice assistants.
"""
import json, html
from config import BUSINESS as B, SITE_URL, SAME_AS, BRAND, BUILD_DATE, GA4_ID, GTM_ID
from content_reviews import REVIEWS, REVIEW_COUNT, RATING_AVG
from content_areas import AREAS
from icons import icon, star_row
from assets import img_src, logo as logo_asset

TEL1 = "+1" + B["phone_primary"].replace("-", "")
TEL2 = "+1" + B["phone_secondary"].replace("-", "")
ORG_ID = SITE_URL + "/#organization"
SITE_ID = SITE_URL + "/#website"

def esc(s):
    return html.escape(str(s), quote=True)

def url(path):
    if path in ("", "/"):
        return SITE_URL + "/"
    return SITE_URL + "/" + path.strip("/") + "/"

# ---------------------------------------------------------------- navigation
NAV = [
    ("Services", "/services/", [
        ("Pool Cage Rescreening", "/services/pool-cage-rescreening/"),
        ("Lanai &amp; Patio Enclosures", "/services/lanai-patio-screen-enclosures/"),
        ("Screen Doors", "/services/screen-door-repair-installation/"),
        ("Window Screens", "/services/window-screen-repair/"),
        ("Storm Damage Repair", "/services/hurricane-storm-screen-repair/"),
        ("Aluminum Structures", "/services/aluminum-structures-railings/"),
    ]),
    ("Service Areas", "/service-areas/", [(a["city"], f"/service-areas/{a['slug']}/") for a in AREAS]),
    ("Gallery", "/gallery/", None),
    ("Reviews", "/reviews/", None),
    ("FAQ", "/faq/", None),
    ("About", "/about/", None),
]

# ------------------------------------------------------------- structured data
def _postal_address():
    a = {"@type": "PostalAddress", "addressLocality": B["city"],
         "addressRegion": B["region"], "addressCountry": B["country"]}
    if B["has_storefront"] and B["street"]:
        a["streetAddress"] = B["street"]
    if B["postal"]:
        a["postalCode"] = B["postal"]
    return a

def _opening_hours():
    return [{"@type": "OpeningHoursSpecification", "dayOfWeek": d,
             "opens": o, "closes": c} for d, o, c in B["hours"]]

def _area_served():
    out = [{"@type": "AdministrativeArea", "name": n} for n in
           ("Sarasota County, Florida", "Manatee County, Florida", "Charlotte County, Florida")]
    out += [{"@type": "City", "name": f'{a["city"]}, Florida'} for a in AREAS]
    return out

def local_business_node():
    n = {
        "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
        "@id": ORG_ID,
        "name": B["legal_name"],
        "alternateName": [B["name"], B["short_name"]],
        "description": ("Aluminum and screen contractor serving Sarasota, Manatee and "
                        "Charlotte County, Florida. Pool cage rescreening, lanai and patio "
                        "screen enclosures, screen doors, window screens, storm damage "
                        "repair and aluminum structures."),
        "url": SITE_URL + "/",
        "telephone": TEL1,
        "logo": {"@type": "ImageObject", "@id": SITE_URL + "/#logo",
                 "url": SITE_URL + logo_asset("dark")[0],
                 "width": str(logo_asset("dark")[1]),
                 "height": str(logo_asset("dark")[2]),
                 "caption": B["legal_name"]},
        "image": SITE_URL + img_src("pool-cage-rescreen-01"),
        "address": _postal_address(),
        "geo": {"@type": "GeoCoordinates", "latitude": B["latitude"], "longitude": B["longitude"]},
        "areaServed": _area_served(),
        "serviceArea": {"@type": "GeoCircle",
                        "geoMidpoint": {"@type": "GeoCoordinates",
                                        "latitude": B["latitude"], "longitude": B["longitude"]},
                        "geoRadius": str(B["service_radius_mi"] * 1609)},
        "openingHoursSpecification": _opening_hours(),
        "priceRange": B["price_range"],
        "currenciesAccepted": "USD",
        "paymentAccepted": ", ".join(B["payment"]),
        "knowsLanguage": B["languages"],
        "foundingDate": B["founded"],
        "aggregateRating": {"@type": "AggregateRating", "ratingValue": str(RATING_AVG),
                            "reviewCount": str(REVIEW_COUNT), "bestRating": "5",
                            "worstRating": "1"},
        "contactPoint": [
            {"@type": "ContactPoint", "telephone": TEL1, "contactType": "customer service",
             "areaServed": "US", "availableLanguage": B["languages"]},
            {"@type": "ContactPoint", "telephone": TEL2, "contactType": "sales",
             "areaServed": "US", "availableLanguage": B["languages"]},
        ],
    }
    if B["email"]:
        n["email"] = B["email"]
    if SAME_AS:
        n["sameAs"] = SAME_AS
    if B["license"]:
        n["hasCredential"] = {"@type": "EducationalOccupationalCredential",
                              "credentialCategory": "license", "identifier": B["license"]}
    return n

def review_nodes(limit=None):
    rs = REVIEWS if limit is None else REVIEWS[:limit]
    return [{
        "@type": "Review",
        "author": {"@type": "Person", "name": r["author"]},
        "datePublished": r["date"],
        "reviewBody": r["text"],
        "reviewRating": {"@type": "Rating", "ratingValue": str(r["rating"]),
                         "bestRating": "5", "worstRating": "1"},
        "itemReviewed": {"@id": ORG_ID},
    } for r in rs]

def faq_node(faqs, page_url):
    return {
        "@type": "FAQPage",
        "@id": page_url + "#faq",
        "mainEntity": [{
            "@type": "Question", "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a},
        } for q, a in faqs],
    }

def breadcrumb_node(trail, page_url):
    return {
        "@type": "BreadcrumbList",
        "@id": page_url + "#breadcrumb",
        "itemListElement": [{
            "@type": "ListItem", "position": i + 1, "name": name,
            "item": url(href) if href else page_url,
        } for i, (name, href) in enumerate(trail)],
    }

def build_graph(page):
    """page: dict with keys path, title, description, extra_nodes, faqs, trail."""
    page_url = url(page["path"])
    graph = [
        {"@type": "WebSite", "@id": SITE_ID, "url": SITE_URL + "/",
         "name": B["legal_name"], "publisher": {"@id": ORG_ID},
         "inLanguage": "en-US"},
        local_business_node(),
        {"@type": "WebPage", "@id": page_url + "#webpage", "url": page_url,
         "name": page["title"], "description": page["description"],
         "isPartOf": {"@id": SITE_ID}, "about": {"@id": ORG_ID},
         "inLanguage": "en-US", "dateModified": BUILD_DATE,
         "primaryImageOfPage": SITE_URL + page.get("og_image", "/assets/img/brand/og-default.png"),
         "speakable": {"@type": "SpeakableSpecification",
                       "cssSelector": [".answer-capsule", "h1"]}},
    ]
    if page.get("trail"):
        graph.append(breadcrumb_node(page["trail"], page_url))
    if page.get("faqs"):
        graph.append(faq_node(page["faqs"], page_url))
    graph += page.get("extra_nodes", [])
    return json.dumps({"@context": "https://schema.org", "@graph": graph},
                      indent=None, separators=(",", ":"), ensure_ascii=False)

# ------------------------------------------------------------------ UI blocks
def btn_call(number=None, label=None, cls="btn btn-accent", track="call"):
    number = number or B["phone_primary"]
    tel = "+1" + number.replace("-", "")
    label = label or f"Call {number}"
    return (f'<a class="{cls}" href="tel:{tel}" data-track="{track}">'
            f'{icon("phone", 20)}<span>{label}</span></a>')

def btn_quote(label="Get a Free Estimate", cls="btn btn-primary", track="quote"):
    return (f'<a class="{cls}" href="/contact/" data-track="{track}">'
            f'<span>{label}</span>{icon("arrow-right", 20)}</a>')

def rating_pill(cls="rating-pill"):
    return (f'<span class="{cls}">{star_row(5, 16)}'
            f'<strong>{RATING_AVG}</strong>'
            f'<span class="muted">from {REVIEW_COUNT} Google reviews</span></span>')

def trust_bar():
    items = [
        ("star", f"{RATING_AVG} stars", f"{REVIEW_COUNT} reviews, all 5-star"),
        ("tag", "Free estimates", "Written and itemized"),
        ("shield", "Licensed &amp; insured", "Documentation on request"),
        ("chat", "English &amp; Spanish", "Se habla español"),
        ("pin", "Local crew", "Sarasota to Punta Gorda"),
    ]
    li = "".join(
        f'<li>{icon(n, 22)}<span><strong>{t}</strong><em>{d}</em></span></li>'
        for n, t, d in items)
    return f'<div class="trust-bar"><div class="wrap"><ul>{li}</ul></div></div>'

def review_card(r, featured=False):
    initials = "".join(w[0] for w in r["author"].split()[:2]).upper()
    return f'''<figure class="review{' review-lg' if featured else ''}">
  {star_row(r["rating"], 17)}
  <blockquote><p>{r["text"]}</p></blockquote>
  <figcaption>
    <span class="avatar" aria-hidden="true">{initials}</span>
    <span class="who"><strong>{r["author"]}</strong>
    <em>Google review &middot; {r["relative"]}</em></span>
  </figcaption>
</figure>'''

def faq_list(faqs, open_first=False, heading_level="h3"):
    out = []
    for i, (q, a) in enumerate(faqs):
        op = " open" if (open_first and i == 0) else ""
        out.append(f'''<details class="faq"{op}>
  <summary><{heading_level}>{q}</{heading_level}>{icon("chevron-down", 20, "faq-chev")}</summary>
  <div class="faq-a"><p>{a}</p></div>
</details>''')
    return '<div class="faq-list">' + "".join(out) + "</div>"

def cta_band(title=None, text=None, tone="navy"):
    title = title or "Get a free, written estimate this week"
    text = text or ("Tell us what the enclosure is doing and we will come measure it. "
                    "No charge for the visit, no pressure at the end of it.")
    return f'''<section class="cta-band cta-{tone}">
  <div class="wrap cta-inner">
    <div class="cta-copy">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
    <div class="cta-actions">
      {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent btn-lg", "cta-band-call")}
      {btn_call(B["phone_secondary"], f'Or {B["phone_secondary"]}', "btn btn-ghost-light btn-lg", "cta-band-call2")}
      {btn_quote("Request an estimate online", "btn btn-outline-light btn-lg", "cta-band-quote")}
    </div>
  </div>
</section>'''

def gallery_strip(items, title="Recent work", link=True):
    cards = "".join(f'''<figure class="shot">
  <img src="{img_src(f)}" alt="{esc(alt)}" width="800" height="600" loading="lazy" decoding="async">
  <figcaption>{esc(cat)}</figcaption>
</figure>''' for f, alt, cat, _s in items)
    more = ('<a class="link-arrow" href="/gallery/">See the full gallery'
            f'{icon("arrow-right", 18)}</a>') if link else ""
    return f'''<section class="section">
  <div class="wrap">
    <div class="sec-head"><h2>{title}</h2>{more}</div>
    <div class="shots">{cards}</div>
  </div>
</section>'''

def _logo_height(w, h):
    """Pick a header height band from the logo's shape.

    A wide wordmark and a square badge cannot share one height without one of
    them looking wrong, so the build reads the real aspect ratio and sizes to
    it rather than assuming the placeholder's proportions.
    """
    ratio = (w / h) if h else 4
    if ratio >= 3.2:
        return 48   # wide wordmark
    if ratio >= 1.8:
        return 50   # icon + wordmark lockup
    if ratio >= 1.1:
        return 56   # compact lockup
    return 60       # square or stacked badge


def logo_mark(cls="logo"):
    src, w, h, _fb = logo_asset("dark")
    return f'''<a class="{cls}" href="/" aria-label="{esc(B["legal_name"])} home"
   style="--logo-h:{_logo_height(w, h)}px">
  <img src="{src}" alt="{esc(B["legal_name"])} logo"
       width="{w}" height="{h}" fetchpriority="high" decoding="async">
</a>'''

def header():
    nav_items = []
    for label, href, children in NAV:
        if children:
            sub = "".join(f'<li><a href="{h}">{l}</a></li>' for l, h in children)
            nav_items.append(f'''<li class="has-sub">
  <a href="{href}">{label}{icon("chevron-down", 16, "nav-chev")}</a>
  <ul class="sub">{sub}</ul>
</li>''')
        else:
            nav_items.append(f'<li><a href="{href}">{label}</a></li>')
    return f'''<a class="skip" href="#main">Skip to main content</a>
<div class="topbar">
  <div class="wrap topbar-in">
    <span class="tb-item">{icon("pin", 16)} Serving Sarasota, Manatee &amp; Charlotte County, FL</span>
    <span class="tb-sep" aria-hidden="true"></span>
    <span class="tb-item tb-hours">{icon("clock", 16)} {B["hours_human"]}</span>
    <span class="tb-grow"></span>
    <span class="tb-item tb-rating">{star_row(5, 14)} <strong>{RATING_AVG}</strong> &middot; {REVIEW_COUNT} reviews</span>
  </div>
</div>
<header class="site-head" id="siteHead">
  <div class="wrap head-in">
    {logo_mark()}
    <nav class="nav" id="nav" aria-label="Main">
      <ul>{''.join(nav_items)}</ul>
    </nav>
    <div class="head-cta">
      <a class="head-phone" href="tel:{TEL1}" data-track="header-call"
         aria-label="Call {B["phone_primary"]} for a free estimate">
        {icon("phone", 20)}
        <span><em>Call for a free estimate</em><strong>{B["phone_primary"]}</strong></span>
      </a>
      {btn_quote("Free Estimate", "btn btn-accent", "header-quote")}
    </div>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="nav"
            aria-label="Open menu" type="button">
      {icon("menu", 26, "b-open")}{icon("x", 26, "b-close")}
    </button>
  </div>
</header>'''

def footer():
    foot_logo_src, foot_logo_w, foot_logo_h, needs_chip = logo_asset("light")
    foot_logo_cls = "foot-logo on-chip" if needs_chip else "foot-logo"
    svc = "".join(f'<li><a href="{h}">{l}</a></li>' for l, h in NAV[0][2])
    areas = "".join(f'<li><a href="{h}">{l}</a></li>' for l, h in NAV[1][2])
    social = ""
    if SAME_AS:
        social = '<div class="social">' + "".join(
            f'<a href="{u}" rel="noopener" aria-label="Acosta Pro on social media">{icon("google",20)}</a>'
            for u in SAME_AS) + "</div>"
    email = (f'<li><a href="mailto:{B["email"]}">{icon("mail",18)}{B["email"]}</a></li>'
             if B["email"] else "")
    return f'''<footer class="site-foot">
  <div class="wrap foot-grid">
    <div class="foot-brand">
      <img class="{foot_logo_cls}" src="{foot_logo_src}" alt="{esc(B["legal_name"])}"
           width="{foot_logo_w}" height="{foot_logo_h}" loading="lazy" decoding="async">
      <p>Aluminum and screen specialists serving Sarasota, Manatee and Charlotte County.
         Pool cages, lanais, screen doors, window screens and storm damage repair.</p>
      <p class="foot-rating">{star_row(5,16)} <strong>{RATING_AVG}</strong>
         <span>from {REVIEW_COUNT} Google reviews</span></p>
      {social}
    </div>
    <div class="foot-col">
      <h2>Services</h2>
      <ul>{svc}</ul>
    </div>
    <div class="foot-col">
      <h2>Service areas</h2>
      <ul>{areas}</ul>
    </div>
    <div class="foot-col foot-contact">
      <h2>Contact</h2>
      <ul>
        <li><a href="tel:{TEL1}" data-track="footer-call">{icon("phone",18)}{B["phone_primary"]}</a></li>
        <li><a href="tel:{TEL2}" data-track="footer-call2">{icon("phone",18)}{B["phone_secondary"]}</a></li>
        {email}
        <li>{icon("pin",18)}<span>{B["city"]}, {B["region"]} &middot; service-area business</span></li>
        <li>{icon("clock",18)}<span>{B["hours_human"]}</span></li>
      </ul>
      {btn_quote("Get a Free Estimate", "btn btn-accent btn-block", "footer-quote")}
    </div>
  </div>
  <div class="wrap foot-bottom">
    <p>&copy; 2026 {esc(B["legal_name"])}. All rights reserved.</p>
    <ul>
      <li><a href="/about/">About</a></li>
      <li><a href="/contact/">Contact</a></li>
      <li><a href="/faq/">FAQ</a></li>
      <li><a href="/privacy/">Privacy</a></li>
      <li><a href="/sitemap.xml">Sitemap</a></li>
    </ul>
  </div>
</footer>
<div class="callbar" role="region" aria-label="Quick contact">
  <a class="cb cb-call" href="tel:{TEL1}" data-track="sticky-call">{icon("phone",20)}Call now</a>
  <a class="cb cb-quote" href="/contact/" data-track="sticky-quote">{icon("check-circle",20)}Free estimate</a>
</div>'''

# ---------------------------------------------------------------------- page
def render_page(page, body):
    """page keys: path, title, description, trail, faqs, extra_nodes, og_image,
    body_class, noindex."""
    canonical = url(page["path"])
    og = page.get("og_image", "/assets/img/brand/og-default.png")
    ld = build_graph(page)
    robots = "noindex,nofollow" if page.get("noindex") else \
             "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
    breadcrumb_html = ""
    if page.get("trail") and len(page["trail"]) > 1:
        crumbs = []
        for i, (name, href) in enumerate(page["trail"]):
            last = i == len(page["trail"]) - 1
            crumbs.append(f'<li><span aria-current="page">{name}</span></li>' if last
                          else f'<li><a href="{href}">{name}</a></li>')
        breadcrumb_html = ('<nav class="crumbs" aria-label="Breadcrumb"><div class="wrap">'
                           f'<ol>{"".join(crumbs)}</ol></div></nav>')
    analytics = ""
    if GA4_ID:
        analytics = f'''<script async src="https://www.googletagmanager.com/gtag/js?id={GA4_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}};gtag('js',new Date());gtag('config','{GA4_ID}');</script>'''
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{esc(page["title"])}</title>
<meta name="description" content="{esc(page["description"])}">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="{robots}">
<meta name="theme-color" content="{BRAND["navy_700"]}">
<meta name="format-detection" content="telephone=yes">
<meta name="author" content="{esc(B["legal_name"])}">
<meta name="geo.region" content="US-FL">
<meta name="geo.placename" content="{esc(B["city"])}, Florida">
<meta name="geo.position" content="{B["latitude"]};{B["longitude"]}">
<meta name="ICBM" content="{B["latitude"]}, {B["longitude"]}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{esc(B["legal_name"])}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="{esc(page["title"])}">
<meta property="og:description" content="{esc(page["description"])}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE_URL}{og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(page["title"])}">
<meta name="twitter:description" content="{esc(page["description"])}">
<meta name="twitter:image" content="{SITE_URL}{og}">
<link rel="icon" href="/assets/img/brand/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/brand/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/open-sans-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/poppins-700-latin.woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/assets/css/styles.css">
<script type="application/ld+json">{ld}</script>
{analytics}
</head>
<body class="{page.get("body_class","")}">
{header()}
{breadcrumb_html}
<main id="main">
{body}
</main>
{footer()}
<script src="/assets/js/main.js" defer></script>
</body>
</html>'''
