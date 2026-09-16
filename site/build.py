#!/usr/bin/env python3
"""Static site generator for osasconstructiongroup.com.

Run from the repository root:

    python3 site/build.py

Reads the content modules in this folder and writes plain HTML into ../public/.
No dependencies, no framework, no build step on the host — Netlify just serves
the files. Assets (CSS, JS, fonts, images) are hand-maintained in public/assets
and are never touched by this script.
"""

from __future__ import annotations

import html
import json
import os
import re
import shutil
import sys
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "public")
sys.path.insert(0, HERE)

from business import BIZ, ICONS, PROCESS, PROMISE, STATS, TAGLINE, TRUST_POINTS  # noqa: E402
from services import SERVICES, SERVICE_GROUPS  # noqa: E402
from areas import AREAS, ALSO_SERVED  # noqa: E402
import pages as P  # noqa: E402

SITE = BIZ["site_url"].rstrip("/")
TODAY = date.today().isoformat()
BY_SLUG = {s["slug"]: s for s in SERVICES}

# ---------------------------------------------------------------- primitives


def e(text: str) -> str:
    """Escape text for HTML body content."""
    return html.escape(str(text), quote=True)


def icon(name: str, cls: str = "", size: int = 24, decorative: bool = True) -> str:
    body = ICONS.get(name, ICONS["check"])
    aria = ' aria-hidden="true" focusable="false"' if decorative else ""
    klass = f' class="{cls}"' if cls else ""
    return (
        f'<svg{klass} width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
        f'stroke="currentColor" stroke-width="1.9" stroke-linecap="round" '
        f'stroke-linejoin="round"{aria}>{body}</svg>'
    )


def tel_link(cls: str = "", label: str | None = None) -> str:
    return (
        f'<a class="{cls}" href="tel:{BIZ["phone_href"]}">{icon("phone", size=20)}'
        f'<span>{e(label or BIZ["phone_display"])}</span></a>'
    )


def url(path: str) -> str:
    return SITE + path


# ---------------------------------------------------------------- structured data


def organization_node() -> dict:
    node = {
        "@type": ["GeneralContractor", "HomeAndConstructionBusiness", "LocalBusiness"],
        "@id": url("/#organization"),
        "name": BIZ["name"],
        "url": url("/"),
        "telephone": BIZ["phone_display"],
        "email": BIZ["email"],
        "image": url(BIZ["logo_path"]),
        "logo": {"@type": "ImageObject", "url": url(BIZ["logo_path"]), "caption": BIZ["name"]},
        "description": (
            "Licensed and insured general contractor in Pittsburgh, Pennsylvania offering home "
            "renovation, kitchen and bathroom remodeling, drywall, painting, flooring, windows "
            "and doors, roofing, gutters, siding, concrete and masonry, decks, hardscaping, "
            "drainage, landscaping, pressure washing, junk removal, demolition, snow removal "
            "and commercial construction."
        ),
        "slogan": TAGLINE,
        "priceRange": "$$",
        "currenciesAccepted": "USD",
        "knowsLanguage": "en-US",
    }
    address = {
        "@type": "PostalAddress",
        "addressLocality": BIZ["city"],
        "addressRegion": BIZ["region"],
        "addressCountry": BIZ["country"],
    }
    if BIZ["street"]:
        address["streetAddress"] = BIZ["street"]
    if BIZ["postal"]:
        address["postalCode"] = BIZ["postal"]
    node["address"] = address
    node["geo"] = {"@type": "GeoCoordinates", "latitude": BIZ["lat"], "longitude": BIZ["lng"]}
    node["hasMap"] = "https://www.google.com/maps/place/Pittsburgh,+PA"
    node["areaServed"] = [{"@type": "City", "name": a["name"], "address": {
        "@type": "PostalAddress", "addressRegion": "PA", "addressCountry": "US"}} for a in AREAS]
    node["serviceArea"] = {
        "@type": "GeoCircle",
        "geoMidpoint": {"@type": "GeoCoordinates", "latitude": BIZ["lat"], "longitude": BIZ["lng"]},
        "geoRadius": "48000",
    }
    node["identifier"] = [
        {"@type": "PropertyValue", "name": "PA Home Improvement Contractor registration", "value": BIZ["hic"]},
        {"@type": "PropertyValue", "name": "General contractor license", "value": BIZ["gc_license"]},
    ]
    if BIZ["founded"]:
        node["foundingDate"] = BIZ["founded"]
    hours = []
    for days, opens, closes in BIZ["hours"]:
        hours.append({"@type": "OpeningHoursSpecification", "dayOfWeek": days,
                      "opens": opens, "closes": closes})
    if hours:
        node["openingHoursSpecification"] = hours
    same_as = [u for u in (BIZ["facebook"], BIZ["instagram"], BIZ["google_profile"]) if u]
    if same_as:
        node["sameAs"] = same_as
    node["hasOfferCatalog"] = {
        "@type": "OfferCatalog",
        "name": "Construction and property services",
        "itemListElement": [
            {"@type": "Offer", "itemOffered": {
                "@type": "Service",
                "name": s["nav"],
                "url": url(f"/services/{s['slug']}/"),
            }} for s in SERVICES
        ],
    }
    node["contactPoint"] = {
        "@type": "ContactPoint",
        "telephone": BIZ["phone_display"],
        "email": BIZ["email"],
        "contactType": "customer service",
        "areaServed": "US-PA",
        "availableLanguage": "English",
    }
    return node


def website_node() -> dict:
    return {
        "@type": "WebSite",
        "@id": url("/#website"),
        "url": url("/"),
        "name": BIZ["name"],
        "publisher": {"@id": url("/#organization")},
        "inLanguage": "en-US",
    }


def webpage_node(path: str, title: str, desc: str, crumbs: list[tuple[str, str]]) -> dict:
    node = {
        "@type": "WebPage",
        "@id": url(path) + "#webpage",
        "url": url(path),
        "name": title,
        "description": desc,
        "isPartOf": {"@id": url("/#website")},
        "about": {"@id": url("/#organization")},
        "inLanguage": "en-US",
        "datePublished": "2026-09-16",
        "dateModified": TODAY,
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".answer", "h1"],
        },
    }
    if crumbs:
        node["breadcrumb"] = {"@id": url(path) + "#breadcrumb"}
    return node


def breadcrumb_node(path: str, crumbs: list[tuple[str, str]]) -> dict:
    return {
        "@type": "BreadcrumbList",
        "@id": url(path) + "#breadcrumb",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name,
             **({"item": url(href)} if href else {})}
            for i, (name, href) in enumerate(crumbs)
        ],
    }


def faq_node(path: str, faqs: list[tuple[str, str]]) -> dict:
    return {
        "@type": "FAQPage",
        "@id": url(path) + "#faq",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in faqs
        ],
    }


def jsonld(nodes: list[dict]) -> str:
    graph = {"@context": "https://schema.org", "@graph": nodes}
    return ('<script type="application/ld+json">'
            + json.dumps(graph, ensure_ascii=False, separators=(",", ":"))
            + "</script>")


# ---------------------------------------------------------------- chrome


def nav_html(active: str) -> str:
    def current(key: str) -> str:
        return ' aria-current="page"' if active == key else ""

    groups = []
    for group in SERVICE_GROUPS:
        items = [s for s in SERVICES if s["group"] == group]
        groups.append(f'<li class="sub__head" role="presentation">{e(group)}</li>')
        for s in items:
            groups.append(
                f'<li><a href="/services/{s["slug"]}/">{e(s["nav"])}</a></li>'
            )
    service_menu = "".join(groups)

    area_menu = "".join(
        f'<li><a href="/service-areas/{a["slug"]}/">{e(a["name"])}</a></li>' for a in AREAS
    )

    return f"""
<nav class="nav" id="site-nav" data-open="false" aria-label="Main">
  <ul class="nav__list">
    <li class="has-sub">
      <a class="nav__link" href="/services/"{current('services')}>Services</a>
      <ul class="sub">{service_menu}<li><a href="/services/"><strong>All services &rarr;</strong></a></li></ul>
    </li>
    <li class="has-sub">
      <a class="nav__link" href="/service-areas/"{current('areas')}>Service Areas</a>
      <ul class="sub">{area_menu}<li><a href="/service-areas/"><strong>All areas &rarr;</strong></a></li></ul>
    </li>
    <li><a class="nav__link" href="/about/"{current('about')}>About</a></li>
    <li><a class="nav__link" href="/faq/"{current('faq')}>FAQ</a></li>
    <li><a class="nav__link" href="/contact/"{current('contact')}>Contact</a></li>
  </ul>
  <div class="header__actions">
    {tel_link('header__phone')}
    <a class="btn btn--primary btn--sm" href="/contact/">Free Estimate</a>
  </div>
</nav>"""


def header_html(active: str) -> str:
    return f"""<header class="header">
  <div class="container header__bar">
    <a class="logo" href="/" aria-label="{e(BIZ['name'])} — home">
      <img class="logo__mark" src="/assets/img/brick-mark.svg" width="132" height="92" alt="" />
      <span class="logo__text">
        <span class="logo__name">Osas</span>
        <span class="logo__sub">Construction Group</span>
      </span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="sr-only">Menu</span>
      {icon('menu', 'icon-open')}{icon('close', 'icon-close')}
    </button>
    {nav_html(active)}
  </div>
</header>"""


def cta_band(heading: str = "Ready for a straight answer on your project?",
             body: str | None = None) -> str:
    body = body or ("Free on-site estimates, itemized written pricing, and a contractor who "
                    "picks up the phone. Call or text — we will tell you what it takes.")
    return f"""<section class="cta-band">
  <div class="container cta-band__inner">
    <div>
      <h2>{e(heading)}</h2>
      <p>{e(body)}</p>
    </div>
    <div class="btn-row">
      <a class="btn btn--primary" href="tel:{BIZ['phone_href']}">{icon('phone', size=20)}{e(BIZ['phone_display'])}</a>
      <a class="btn btn--ghost" href="/contact/">Request an estimate</a>
    </div>
  </div>
</section>"""


def footer_html() -> str:
    svc_links = "".join(
        f'<li><a href="/services/{s["slug"]}/">{e(s["nav"])}</a></li>' for s in SERVICES[:8]
    )
    svc_links_2 = "".join(
        f'<li><a href="/services/{s["slug"]}/">{e(s["nav"])}</a></li>' for s in SERVICES[8:]
    )
    area_links = "".join(
        f'<li><a href="/service-areas/{a["slug"]}/">{e(a["name"])}</a></li>' for a in AREAS[:8]
    )
    social = ""
    if BIZ["facebook"]:
        social += (f'<a href="{e(BIZ["facebook"])}" rel="me noopener" target="_blank">'
                   f'<span class="sr-only">Facebook</span>{icon("facebook", size=20)}</a>')
    if BIZ["instagram"]:
        social += (f'<a href="{e(BIZ["instagram"])}" rel="me noopener" target="_blank">'
                   f'<span class="sr-only">Instagram</span>{icon("instagram", size=20)}</a>')
    social_block = f'<div class="social">{social}</div>' if social else ""

    address_line = ""
    if BIZ["street"]:
        address_line = (f'<span class="footer__addr">{e(BIZ["street"])}<br>'
                        f'{e(BIZ["city"])}, {e(BIZ["region"])} {e(BIZ["postal"])}</span>')

    return f"""<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__rail">
      <div class="footer__brand">
        <div class="footer__logo">{open(os.path.join(OUT, 'assets/img/logo-arched.svg')).read().strip()}</div>
        <p>Licensed, insured general contractor serving Pittsburgh and the surrounding counties. Interior, exterior and year-round property work.</p>
        <div class="badge-row">
          <span class="badge">PA HIC #{e(BIZ['hic'])}</span>
          <span class="badge">{e(BIZ['gc_license'])}</span>
          <span class="badge">Fully insured</span>
        </div>
        {social_block}
      </div>
      <div>
        <h2>Contact</h2>
        <address class="footer__contact">
          <a href="tel:{BIZ['phone_href']}">{icon('phone', size=18)}<span>{e(BIZ['phone_display'])}</span></a>
          <a href="sms:{BIZ['sms_href']}">{icon('message', size=18)}<span>Text us</span></a>
          <a href="mailto:{BIZ['email']}">{icon('mail', size=18)}<span>{e(BIZ['email'])}</span></a>
          <span class="footer__contact-line">{icon('pin', size=18)}<span>{e(BIZ['city'])}, {e(BIZ['region'])} &middot; serving Greater Pittsburgh</span></span>
          {address_line}
        </address>
        <p style="margin-top:16px"><a class="btn btn--primary btn--sm" href="/contact/">Free estimate</a></p>
      </div>
      </div>
      <div>
        <h2>Services</h2>
        <ul>{svc_links}</ul>
      </div>
      <div>
        <h2>More services</h2>
        <ul>{svc_links_2}</ul>
      </div>
      <div>
        <h2>Service areas</h2>
        <ul>{area_links}<li><a href="/service-areas/"><strong>All areas &rarr;</strong></a></li></ul>
      </div>
    </div>
    <div class="footer__legal">
      <span>&copy; <span id="year">{date.today().year}</span> {e(BIZ['name'])}. {e(PROMISE)}</span>
      <span><a href="/privacy/">Privacy</a> &middot; <a href="/sitemap.xml">Sitemap</a> &middot; <a href="/services/">All services</a></span>
    </div>
  </div>
</footer>
<div class="action-bar">
  <a href="tel:{BIZ['phone_href']}">{icon('phone', size=20)}Call now</a>
  <a href="sms:{BIZ['sms_href']}">{icon('message', size=20)}Text us</a>
</div>"""


def crumbs_html(crumbs: list[tuple[str, str]]) -> str:
    if not crumbs:
        return ""
    items = []
    for name, href in crumbs:
        if href:
            items.append(f'<li><a href="{href}">{e(name)}</a></li>')
        else:
            items.append(f'<li><span aria-current="page">{e(name)}</span></li>')
    return (f'<nav class="crumbs" aria-label="Breadcrumb"><div class="container">'
            f'<ol>{"".join(items)}</ol></div></nav>')


def document(*, path: str, title: str, desc: str, body: str, active: str = "",
             crumbs: list[tuple[str, str]] | None = None, extra_nodes: list[dict] | None = None,
             og_type: str = "website", noindex: bool = False) -> str:
    crumbs = crumbs or []
    nodes: list[dict] = [organization_node(), website_node(),
                         webpage_node(path, title, desc, crumbs)]
    if crumbs:
        nodes.append(breadcrumb_node(path, crumbs))
    nodes.extend(extra_nodes or [])
    robots = ("noindex, nofollow" if noindex else
              "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1")
    canonical = url(path)
    return f"""<!DOCTYPE html>
<html lang="en-US" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="{robots}">
<meta name="author" content="{e(BIZ['name'])}">
<meta name="geo.region" content="US-PA">
<meta name="geo.placename" content="Pittsburgh, Pennsylvania">
<meta name="geo.position" content="{BIZ['lat']};{BIZ['lng']}">
<meta name="ICBM" content="{BIZ['lat']}, {BIZ['lng']}">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="{e(BIZ['name'])}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{url(BIZ['og_image'])}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Osas Construction Group — licensed general contractor in Pittsburgh, PA">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(title)}">
<meta name="twitter:description" content="{e(desc)}">
<meta name="twitter:image" content="{url(BIZ['og_image'])}">
<meta name="theme-color" content="#12151a">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/barlow-condensed-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/barlow-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
{jsonld(nodes)}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
{header_html(active)}
{crumbs_html(crumbs)}
<main id="main">
{body}
</main>
{footer_html()}
<script src="/assets/js/site.js" defer></script>
</body>
</html>
"""


def write(path: str, content: str) -> None:
    """path is a site path like /services/roofing/ or /robots.txt"""
    if path.endswith("/"):
        target = os.path.join(OUT, path.strip("/"), "index.html")
    else:
        target = os.path.join(OUT, path.lstrip("/"))
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, "w", encoding="utf-8") as fh:
        fh.write(content)
    return target


# ---------------------------------------------------------------- components


def answer_block(heading: str, text: str) -> str:
    return (f'<div class="answer"><h2>{e(heading)}</h2><p>{e(text)}</p></div>')


def service_cards(items, heading_level: str = "h3") -> str:
    out = []
    for s in items:
        tags = "".join(f"<li>{e(t)}</li>" for t in s["card_tags"])
        out.append(f"""<article class="card card--link reveal">
  <span class="card__icon">{icon(s['icon'], size=26)}</span>
  <{heading_level}><a href="/services/{s['slug']}/">{e(s['nav'])}</a></{heading_level}>
  <p>{e(s['card_blurb'])}</p>
  <ul class="card__tags">{tags}</ul>
  <span class="card__more">Details {icon('arrow', size=18)}</span>
</article>""")
    return f'<div class="cards">{"".join(out)}</div>'


def faq_block(faqs, heading: str = "Frequently asked questions", level: str = "h2") -> str:
    items = []
    for q, a in faqs:
        items.append(f"""<details>
  <summary>{e(q)}</summary>
  <div class="faq__body"><p>{e(a)}</p></div>
</details>""")
    head = f'<div class="section-head"><p class="eyebrow">Questions</p><{level}>{e(heading)}</{level}></div>' if heading else ""
    return f'{head}<div class="faq">{"".join(items)}</div>'


def trust_strip() -> str:
    items = "".join(
        f'<li class="pillar"><h3>{icon(ic, size=22)} {e(title)}</h3><p>{e(body)}</p></li>'
        for ic, title, body in TRUST_POINTS
    )
    return f'<ul class="pillars">{items}</ul>'


def process_block(heading: str, lead: str) -> str:
    steps = "".join(
        f'<li class="step reveal"><h3>{e(t)}</h3><p>{e(b)}</p></li>' for t, b in PROCESS
    )
    return f"""<section class="section section--alt">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Process</p>
      <h2>{e(heading)}</h2>
      <p class="lead">{e(lead)}</p>
    </div>
    <ol class="steps">{steps}</ol>
  </div>
</section>"""


def photo_slot(label: str, tall: bool = False) -> str:
    style = ' style="min-height:360px"' if tall else ""
    return (f'<div class="photo-slot"{style} data-photo-slot><span>{e(label)}<br>'
            f'Add a project photo here</span></div>')


def map_block() -> str:
    src = "https://www.google.com/maps?q=Pittsburgh,+PA&output=embed"
    return f"""<div class="map" data-map-src="{src}">
  <div class="map__prompt">
    <p>We work across Pittsburgh and the surrounding counties. Load the map to see the service area.</p>
    <button class="btn btn--dark btn--sm" type="button" data-map-load>{icon('pin', size=20)}Load map</button>
  </div>
</div>"""


def estimate_form(source: str = "site") -> str:
    options = "".join(
        f'<option value="{e(s["nav"])}">{e(s["nav"])}</option>' for s in SERVICES
    )
    return f"""<form class="form" name="estimate" method="POST" data-netlify="true"
      netlify-honeypot="bot-field" action="/thank-you/">
  <input type="hidden" name="form-name" value="estimate">
  <input type="hidden" name="page-source" value="{e(source)}">
  <p class="hp"><label>Leave this field empty: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>

  <div class="field">
    <label for="name">Your name <span class="req" aria-hidden="true">*</span></label>
    <input id="name" name="name" type="text" autocomplete="name" required>
  </div>

  <div class="field">
    <label for="phone">Phone <span class="req" aria-hidden="true">*</span></label>
    <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
    <span class="hint">Texting works — say so in the message and we will text back.</span>
  </div>

  <div class="field">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email">
  </div>

  <div class="field">
    <label for="location">Property address or municipality <span class="req" aria-hidden="true">*</span></label>
    <input id="location" name="location" type="text" autocomplete="street-address" required>
    <span class="hint">Street address, neighborhood or town — it tells us the travel and the permit office.</span>
  </div>

  <div class="field">
    <label for="service">What do you need? <span class="req" aria-hidden="true">*</span></label>
    <select id="service" name="service" required>
      <option value="">Choose a service…</option>
      {options}
      <option value="Multiple services">Multiple services</option>
      <option value="Not sure yet">Not sure yet</option>
    </select>
  </div>

  <div class="field">
    <label for="timeline">Timeline</label>
    <select id="timeline" name="timeline">
      <option value="">No rush / flexible</option>
      <option value="Emergency">Emergency — active leak, storm or snow</option>
      <option value="Within 2 weeks">Within 2 weeks</option>
      <option value="1-3 months">1–3 months</option>
      <option value="Planning ahead">Planning ahead / budgeting</option>
    </select>
  </div>

  <div class="field">
    <label for="message">Tell us about the project</label>
    <textarea id="message" name="message" rows="5"
      placeholder="Rough size, what is failing, what you want it to become, anything you already know about the house."></textarea>
  </div>

  <button class="btn btn--primary btn--block" type="submit">Request my free estimate</button>
  <p class="form__note">We use your details to respond to this request only. No lists, no resale. See our <a href="/privacy/">privacy policy</a>.</p>
</form>"""


def contact_box() -> str:
    return f"""<div class="sidebar__box sidebar__box--ink">
  <h3>Talk to a person</h3>
  <p>Call or text {e(BIZ['phone_display'])}. Free estimates, on site, no charge to look.</p>
  <div class="btn-row" style="margin-top:16px">
    <a class="btn btn--primary btn--sm btn--block" href="tel:{BIZ['phone_href']}">{icon('phone', size=18)}Call now</a>
    <a class="btn btn--ghost btn--sm btn--block" href="sms:{BIZ['sms_href']}">{icon('message', size=18)}Send a text</a>
  </div>
</div>"""


def service_sidebar(active_slug: str = "") -> str:
    links = "".join(
        f'<li><a href="/services/{s["slug"]}/"'
        + (' aria-current="page"' if s["slug"] == active_slug else "")
        + f'>{e(s["nav"])}</a></li>'
        for s in SERVICES
    )
    return f"""<aside class="sidebar">
  <div class="sidebar__box">
    <h3>All services</h3>
    <ul class="sidebar__list">{links}</ul>
  </div>
  {contact_box()}
</aside>"""


# ---------------------------------------------------------------- pages


def render_home() -> None:
    d = P.HOME
    stats = "".join(
        f'<li class="stat"><span class="stat__num">{e(n)}</span>'
        f'<span class="stat__label">{e(l)}</span></li>' for n, l in STATS
    )
    why = "".join(
        f'<li class="pillar reveal"><h3>{icon(ic, size=22)} {e(t)}</h3><p>{e(b)}</p></li>'
        for ic, t, b in d["why"]
    )
    groups = []
    for group in SERVICE_GROUPS:
        items = [s for s in SERVICES if s["group"] == group]
        groups.append(
            f'<h3 class="eyebrow" style="margin-top:40px">{e(group)}</h3>'
            + service_cards(items, "h4")
        )
    seasonal = "".join(f"""<article class="card reveal">
  <span class="card__icon">{icon(c['icon'], size=26)}</span>
  <p class="eyebrow">{e(c['eyebrow'])}</p>
  <h3>{e(c['h'])}</h3>
  <p>{e(c['p'])}</p>
  <p style="margin:auto 0 0"><a class="btn btn--ghost btn--sm" href="{c['link']}">{e(c['cta'])}</a></p>
</article>""" for c in d["seasonal"])

    area_chips = "".join(
        f'<li><a href="/service-areas/{a["slug"]}/">{e(a["name"])}</a></li>' for a in AREAS
    )

    body = f"""<section class="hero">
  <div class="container hero__inner">
    <div>
      <p class="hero__eyebrow"><span>Design</span><span>Build</span><span>Renovate</span><span>Transform</span></p>
      <h1>{e(d['h1_line1'])} <em>{e(d['h1_line2'])}</em></h1>
      <p class="hero__lead">{e(d['hero_lead'])}</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="tel:{BIZ['phone_href']}">{icon('phone', size=20)}{e(BIZ['phone_display'])}</a>
        <a class="btn btn--ghost" href="/contact/">Get a free estimate</a>
      </div>
      <ul class="hero__trust">
        <li>{icon('shield', size=18)} Fully insured</li>
        <li>{icon('award', size=18)} PA HIC #{e(BIZ['hic'])}</li>
        <li>{icon('file', size=18)} {e(BIZ['gc_license'])}</li>
        <li>{icon('home', size=18)} Residential &amp; commercial</li>
      </ul>
    </div>
    <div class="hero__card">
      <h2>Free estimate, no charge to look</h2>
      <p>Tell us the address and the scope. We walk the property, then put an itemized price in writing.</p>
      <div class="btn-row" style="margin-top:20px">
        <a class="btn btn--dark btn--block" href="/contact/">Request an estimate</a>
        <a class="btn btn--ghost btn--block" href="sms:{BIZ['sms_href']}">{icon('message', size=20)}Text {e(BIZ['phone_display'])}</a>
      </div>
      <p style="margin:20px 0 0;font-size:.9rem">{e(PROMISE)}</p>
    </div>
  </div>
</section>

<section class="section section--tight section--white">
  <div class="container">
    {answer_block(d['answer_heading'], d['answer'])}
    {trust_strip()}
  </div>
</section>

<section class="section" id="services">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Services</p>
      <h2>Everything the property needs</h2>
      <p class="lead">{e(d['services_intro'])}</p>
    </div>
    {"".join(groups)}
    <p style="margin-top:32px"><a class="btn btn--dark" href="/services/">See all services {icon('arrow', size=20)}</a></p>
  </div>
</section>

<section class="section section--ink">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Why us</p>
      <h2>{e(d['why_heading'])}</h2>
      <p class="lead">{e(d['why_lead'])}</p>
    </div>
    <ul class="pillars">{why}</ul>
    <hr style="border-color:#2b313b;margin:56px 0 40px">
    <ul class="stats">{stats}</ul>
  </div>
</section>

{process_block(d['process_heading'], d['process_lead'])}

<section class="section section--white">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Seasonal</p>
      <h2>Two things people call about all year</h2>
    </div>
    <div class="cards">{seasonal}</div>
  </div>
</section>

<section class="section">
  <div class="container split split--sidebar">
    <div>
      <p class="eyebrow">Service area</p>
      <h2>Working across Greater Pittsburgh</h2>
      <p class="lead">City neighborhoods, the South Hills and North Hills, the eastern suburbs, the airport corridor, and into Washington and Butler counties.</p>
      <ul class="chips" style="margin-top:24px">{area_chips}</ul>
      <p style="margin-top:24px"><a class="btn btn--ghost btn--sm" href="/service-areas/">All service areas {icon('arrow', size=18)}</a></p>
    </div>
    {map_block()}
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    {faq_block(d['faqs'], "Questions people ask before they call")}
    <p style="margin-top:28px"><a class="btn btn--ghost btn--sm" href="/faq/">More questions answered {icon('arrow', size=18)}</a></p>
  </div>
</section>

{cta_band()}"""

    write("/", document(
        path="/", title=d["meta_title"], desc=d["meta_desc"], body=body, active="home",
        extra_nodes=[faq_node("/", d["faqs"]),
                     {"@type": "ItemList", "@id": url("/#services"),
                      "name": "Services offered by Osas Construction Group",
                      "itemListElement": [
                          {"@type": "ListItem", "position": i + 1, "name": s["nav"],
                           "url": url(f"/services/{s['slug']}/")}
                          for i, s in enumerate(SERVICES)]}],
    ))


def render_services_hub() -> None:
    title = "Construction & Property Services in Pittsburgh, PA"
    meta_title = "Services | Pittsburgh Contractor | Osas Construction Group"
    desc = ("All services from Osas Construction Group in Pittsburgh, PA: remodeling, roofing, "
            "siding, concrete, decks, landscaping, junk removal, snow removal and commercial work.")
    answer = ("Osas Construction Group offers 16 service lines in Pittsburgh, PA: full home "
              "renovation, kitchen remodeling, bathroom remodeling, drywall and painting, flooring, "
              "windows and doors, roofing and gutters, siding, concrete and masonry, decks and "
              "railings, hardscaping and drainage, landscaping and lawn care, pressure washing, "
              "junk removal and demolition, snow removal, and commercial construction.")
    groups = []
    for group in SERVICE_GROUPS:
        items = [s for s in SERVICES if s["group"] == group]
        groups.append(f"""<section class="section section--tight">
  <div class="container">
    <div class="section-head"><p class="eyebrow">{e(group)}</p></div>
    {service_cards(items)}
  </div>
</section>""")
    crumbs = [("Home", "/"), ("Services", "")]
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <p class="eyebrow">What we do</p>
    <h1>{e(title)}</h1>
    <p>One licensed, insured contractor for the inside, the outside and the ground around it.</p>
  </div>
</section>
<section class="section section--white section--tight">
  <div class="container">{answer_block("What services does Osas Construction Group offer?", answer)}</div>
</section>
{"".join(groups)}
{cta_band("Not sure which service you need?",
          "Describe the problem and we will tell you which trade it belongs to — and whether it is one job or three.")}"""
    write("/services/", document(path="/services/", title=meta_title, desc=desc, body=body,
                                active="services", crumbs=crumbs))


def render_service(s: dict) -> None:
    path = f"/services/{s['slug']}/"
    scope_html = []
    for sub, items in s["scope"]:
        lis = "".join(f'<li>{icon("check", size=20)}<span>{e(i)}</span></li>' for i in items)
        scope_html.append(
            f'<div><h3>{e(sub)}</h3><ul class="checklist">{lis}</ul></div>'
        )
    scope_block = f'<div class="split">{"".join(scope_html)}</div>' if len(scope_html) > 1 \
        else "".join(scope_html)

    sections = []
    for sec in s["sections"]:
        paras = "".join(f"<p>{e(p)}</p>" for p in sec.get("p", []))
        lst = ""
        if sec.get("list"):
            lis = "".join(f'<li>{icon("check", size=20)}<span>{e(i)}</span></li>' for i in sec["list"])
            lst = f'<ul class="checklist">{lis}</ul>'
        tbl = ""
        if sec.get("table"):
            t = sec["table"]
            head = "".join(f"<th scope=\"col\">{e(h)}</th>" for h in t["head"])
            rows = "".join(
                "<tr>" + "".join(f"<td>{e(c)}</td>" for c in row) + "</tr>" for row in t["rows"]
            )
            tbl = (f'<div class="table-wrap"><table><caption>{e(t["caption"])}</caption>'
                   f'<thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>')
        sections.append(f'<h2>{e(sec["h"])}</h2>{paras}{lst}{tbl}')

    related = [BY_SLUG[r] for r in s["related"] if r in BY_SLUG]
    intro = "".join(f"<p>{e(p)}</p>" for p in s["intro"])

    crumbs = [("Home", "/"), ("Services", "/services/"), (s["nav"], "")]
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <p class="eyebrow">{e(s['group'])}</p>
    <h1>{e(s['h1'])}</h1>
    <p>{e(s['tagline'])}</p>
  </div>
</section>

<section class="section section--white">
  <div class="container split split--sidebar">
    <div class="prose">
      {answer_block("The short answer", s['answer'])}
      {intro}
      <h2>What the work covers</h2>
      {scope_block}
      {"".join(sections)}
      <div class="callout" style="margin-top:48px">
        <h3>Get a price for your property</h3>
        <p>Free on-site estimate, itemized in writing. Call or text {e(BIZ['phone_display'])}, or send the form and we will get back to you.</p>
        <div class="btn-row" style="margin-top:8px">
          <a class="btn btn--primary" href="tel:{BIZ['phone_href']}">{icon('phone', size=20)}Call {e(BIZ['phone_display'])}</a>
          <a class="btn btn--ghost" href="/contact/?service={e(s['nav']).replace(' ', '+').replace('&amp;','%26')}">Request an estimate</a>
        </div>
      </div>
    </div>
    {service_sidebar(s['slug'])}
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    {faq_block(s['faqs'], f"{s['nav']} — questions we get")}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Related</p><h2>Often part of the same job</h2></div>
    {service_cards(related)}
  </div>
</section>

{cta_band()}"""

    service_node = {
        "@type": "Service",
        "@id": url(path) + "#service",
        "name": s["nav"],
        "serviceType": s["nav"],
        "description": s["answer"],
        "url": url(path),
        "provider": {"@id": url("/#organization")},
        "areaServed": [{"@type": "City", "name": a["name"]} for a in AREAS],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": f"{s['nav']} — scope of work",
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": item}}
                for _, items in s["scope"] for item in items
            ],
        },
    }
    write(path, document(path=path, title=s["meta_title"], desc=s["meta_desc"], body=body,
                         active="services", crumbs=crumbs,
                         extra_nodes=[service_node, faq_node(path, s["faqs"])]))


def render_areas_hub() -> None:
    path = "/service-areas/"
    cards = "".join(f"""<article class="card card--link reveal">
  <span class="card__icon">{icon('pin', size=26)}</span>
  <h3><a href="/service-areas/{a['slug']}/">{e(a['name'])}</a></h3>
  <p>{e(a['county'])}</p>
  <span class="card__more">Local details {icon('arrow', size=18)}</span>
</article>""" for a in AREAS)
    also = "".join(f"<li><span>{e(n)}</span></li>" for n in ALSO_SERVED)
    answer = ("Osas Construction Group serves Pittsburgh and the surrounding region — all City of "
              "Pittsburgh neighborhoods plus Mt. Lebanon, Bethel Park, Upper St. Clair, Peters "
              "Township, Robinson, Moon, Cranberry, Wexford, Shaler, Ross and Monroeville, and "
              "many other communities across Allegheny, Washington and Butler counties.")
    crumbs = [("Home", "/"), ("Service Areas", "")]
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <p class="eyebrow">Where we work</p>
    <h1>Service Areas Around Pittsburgh</h1>
    <p>Based in Pittsburgh, working across Allegheny County and into Washington and Butler counties.</p>
  </div>
</section>
<section class="section section--white section--tight">
  <div class="container">{answer_block("Where does Osas Construction Group work?", answer)}</div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Local pages</p><h2>Pick your municipality</h2></div>
    {cards}
  </div>
</section>
<section class="section section--alt">
  <div class="container split split--sidebar">
    <div>
      <p class="eyebrow">Also served</p>
      <h2>Plus these communities</h2>
      <p class="lead">No dedicated page yet, but all within the normal service radius. If your town is not listed, call and ask — the answer is usually yes.</p>
      <ul class="chips" style="margin-top:24px">{also}</ul>
    </div>
    {map_block()}
  </div>
</section>
{cta_band("Serving your street?", "Call or text with the address and we will confirm coverage and scheduling in one conversation.")}"""
    write(path, document(
        path=path, title="Service Areas | Pittsburgh Contractor | Osas Construction",
        desc=("Osas Construction Group serves Pittsburgh, Mt. Lebanon, Bethel Park, Upper St. Clair, "
              "Peters Township, Robinson, Moon, Cranberry, Wexford, Shaler, Ross and Monroeville."),
        body=body, active="areas", crumbs=crumbs))


def render_area(a: dict) -> None:
    path = f"/service-areas/{a['slug']}/"
    intro = "".join(f"<p>{e(p)}</p>" for p in a["intro"])
    local = "".join(
        f'<li class="pillar"><h3>{e(t)}</h3><p>{e(b)}</p></li>' for t, b in a["local"]
    )
    projects = "".join(
        f'<li>{icon("check", size=20)}<span>{e(p)}</span></li>' for p in a["projects"]
    )
    hoods = "".join(f"<li><span>{e(n)}</span></li>" for n in a["neighborhoods"])
    featured = [BY_SLUG[k] for k in ("home-renovation", "roofing-gutters", "concrete-masonry",
                                     "decks-patios", "landscaping", "junk-removal")]
    crumbs = [("Home", "/"), ("Service Areas", "/service-areas/"), (a["name"], "")]
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <p class="eyebrow">{e(a['county'])}</p>
    <h1>{e(a['h1'])}</h1>
    <p>Licensed, insured, and working in {e(a['name'])} year-round — interior, exterior and seasonal.</p>
  </div>
</section>

<section class="section section--white">
  <div class="container split split--sidebar">
    <div class="prose">
      {answer_block(f"Does Osas Construction Group work in {a['name']}?", a['answer'])}
      {intro}
      <h2>What we get called for in {e(a['name'])}</h2>
      <ul class="checklist checklist--2">{projects}</ul>
      <h2>Local conditions we plan around</h2>
      <ul class="pillars">{local}</ul>
      <h2>Neighborhoods and nearby</h2>
      <ul class="chips">{hoods}</ul>
    </div>
    <aside class="sidebar">
      {contact_box()}
      <div class="sidebar__box">
        <h3>Other service areas</h3>
        <ul class="sidebar__list">
          {"".join(f'<li><a href="/service-areas/{x["slug"]}/">{e(x["name"])}</a></li>' for x in AREAS if x['slug'] != a['slug'])}
        </ul>
      </div>
    </aside>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Services in {e(a['name'])}</p><h2>Most requested here</h2></div>
    {service_cards(featured)}
    <p style="margin-top:28px"><a class="btn btn--ghost btn--sm" href="/services/">All 16 services {icon('arrow', size=18)}</a></p>
  </div>
</section>

<section class="section section--white">
  <div class="container">{faq_block(a['faqs'], f"{a['name']} — local questions")}</div>
</section>

{cta_band(f"Working in {a['name']} this season", "Call or text for a free on-site estimate. Itemized pricing, in writing, before anything starts.")}"""

    area_service_node = {
        "@type": "Service",
        "@id": url(path) + "#service",
        "name": f"General contracting in {a['name']}, PA",
        "description": a["answer"],
        "url": url(path),
        "provider": {"@id": url("/#organization")},
        "areaServed": {
            "@type": "City",
            "name": a["name"],
            "address": {"@type": "PostalAddress", "addressLocality": a["name"],
                        "addressRegion": "PA", "addressCountry": "US"},
        },
    }
    write(path, document(path=path, title=a["meta_title"], desc=a["meta_desc"], body=body,
                         active="areas", crumbs=crumbs,
                         extra_nodes=[area_service_node, faq_node(path, a["faqs"])]))


def render_about() -> None:
    d = P.ABOUT
    path = "/about/"
    secs = "".join(
        f'<h2>{e(s["h"])}</h2>' + "".join(f"<p>{e(p)}</p>" for p in s["p"])
        for s in d["sections"]
    )
    values = "".join(
        f'<li class="pillar reveal"><h3>{icon(ic, size=22)} {e(t)}</h3><p>{e(b)}</p></li>'
        for ic, t, b in d["values"]
    )
    crumbs = [("Home", "/"), ("About", "")]
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <p class="eyebrow">About</p>
    <h1>{e(d['h1'])}</h1>
    <p>{e(d['tagline'])}</p>
  </div>
</section>

<section class="section section--white">
  <div class="container split split--sidebar">
    <div class="prose">
      {answer_block("Who is Osas Construction Group?", d['answer'])}
      {secs}
    </div>
    <aside class="sidebar">
      {contact_box()}
      <div class="sidebar__box">
        <h3>Credentials</h3>
        <ul class="checklist">
          <li>{icon('award', size=20)}<span>PA HIC #{e(BIZ['hic'])}</span></li>
          <li>{icon('file', size=20)}<span>{e(BIZ['gc_license'])}</span></li>
          <li>{icon('shield', size=20)}<span>Fully insured — certificate on request</span></li>
          <li>{icon('building', size=20)}<span>Residential &amp; commercial</span></li>
        </ul>
      </div>
    </aside>
  </div>
</section>

<section class="section section--ink">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Standards</p><h2>What you can hold us to</h2></div>
    <ul class="pillars">{values}</ul>
  </div>
</section>

{process_block("How a project runs", "Four steps from the first call to the final walkthrough.")}

{cta_band()}"""
    write(path, document(path=path, title=d["meta_title"], desc=d["meta_desc"], body=body,
                         active="about", crumbs=crumbs,
                         extra_nodes=[{"@type": "AboutPage", "@id": url(path) + "#aboutpage",
                                       "mainEntity": {"@id": url("/#organization")}}]))


def pretty_time(t24: str) -> str:
    h, m = (int(x) for x in t24.split(":"))
    suffix = "AM" if h < 12 else "PM"
    h12 = h % 12 or 12
    return f"{h12}:{m:02d} {suffix}"


def render_contact() -> None:
    d = P.CONTACT
    path = "/contact/"
    hours = "".join(
        f'<tr><th scope="row">{e(days[0] if len(days) == 1 else days[0] + "–" + days[-1])}</th>'
        f"<td>{e(pretty_time(o))} – {e(pretty_time(c))}</td></tr>"
        for days, o, c in BIZ["hours"]
    )
    crumbs = [("Home", "/"), ("Contact", "")]
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <p class="eyebrow">Free estimate</p>
    <h1>{e(d['h1'])}</h1>
    <p>{e(d['tagline'])}</p>
  </div>
</section>

<section class="section section--white">
  <div class="container split">
    <div>
      <h2>Request an estimate</h2>
      <p class="muted">{e(d['form_note'])}</p>
      {estimate_form('contact')}
    </div>
    <div>
      {answer_block("How to reach us", d['answer'])}
      <div class="sidebar__box" style="margin-bottom:24px">
        <h3>Direct</h3>
        <ul class="checklist">
          <li>{icon('phone', size=20)}<span><a href="tel:{BIZ['phone_href']}"><strong>{e(BIZ['phone_display'])}</strong></a> — call</span></li>
          <li>{icon('message', size=20)}<span><a href="sms:{BIZ['sms_href']}">{e(BIZ['phone_display'])}</a> — text</span></li>
          <li>{icon('mail', size=20)}<span><a href="mailto:{BIZ['email']}">{e(BIZ['email'])}</a></span></li>
          <li>{icon('pin', size=20)}<span>{e(BIZ['city'])}, {e(BIZ['region'])} — serving Greater Pittsburgh</span></li>
        </ul>
      </div>
      <div class="sidebar__box" style="margin-bottom:24px">
        <h3>Hours</h3>
        <div class="table-wrap"><table><tbody>{hours}</tbody></table></div>
        <p class="muted" style="margin:16px 0 0;font-size:.92rem">{e(BIZ['hours_note'])}</p>
      </div>
      {map_block()}
    </div>
  </div>
</section>

{cta_band("Emergency or storm damage?", "Do not use the form. Call or text so we can get eyes on it today.")}"""
    write(path, document(
        path=path, title=d["meta_title"], desc=d["meta_desc"], body=body, active="contact",
        crumbs=crumbs,
        extra_nodes=[{"@type": "ContactPage", "@id": url(path) + "#contactpage",
                      "mainEntity": {"@id": url("/#organization")}}]))


def render_faq() -> None:
    d = P.FAQ_PAGE
    path = "/faq/"
    all_faqs: list[tuple[str, str]] = []
    blocks = []
    for group, items in d["groups"]:
        all_faqs.extend(items)
        blocks.append(f"""<section class="section section--tight">
  <div class="container">
    <div class="section-head"><p class="eyebrow">{e(group)}</p></div>
    {faq_block(items, "")}
  </div>
</section>""")
    crumbs = [("Home", "/"), ("FAQ", "")]
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <p class="eyebrow">Answers</p>
    <h1>{e(d['h1'])}</h1>
    <p>{e(d['tagline'])}</p>
  </div>
</section>
<section class="section section--white section--tight">
  <div class="container">{answer_block("Osas Construction Group, in brief", d['answer'])}</div>
</section>
{"".join(blocks)}
{cta_band("Question not answered here?", "Call or text (412) 923-2092. If we do not know, we will say so rather than guess.")}"""
    write(path, document(path=path, title=d["meta_title"], desc=d["meta_desc"], body=body,
                         active="faq", crumbs=crumbs,
                         extra_nodes=[faq_node(path, all_faqs)]))


def render_thanks() -> None:
    path = "/thank-you/"
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <p class="eyebrow">Received</p>
    <h1>Thanks — your request is in</h1>
    <p>We read every submission. Expect a reply from {e(BIZ['phone_display'])}, usually the same day.</p>
  </div>
</section>
<section class="section section--white">
  <div class="container container--narrow prose">
    <h2>What happens next</h2>
    <ol>
      <li>We read the details and check the address against our schedule.</li>
      <li>We call or text to ask anything the form did not cover and to set a walkthrough time.</li>
      <li>You get an itemized written estimate after we have seen the property.</li>
    </ol>
    <p>In a hurry, or something urgent? Call or text {e(BIZ['phone_display'])} directly.</p>
    <div class="btn-row" style="margin-top:24px">
      <a class="btn btn--primary" href="tel:{BIZ['phone_href']}">{icon('phone', size=20)}Call now</a>
      <a class="btn btn--ghost" href="/services/">Browse services</a>
    </div>
  </div>
</section>"""
    write(path, document(path=path, title="Thank You | Osas Construction Group",
                         desc="Your estimate request has been received by Osas Construction Group.",
                         body=body, noindex=True))


def render_privacy() -> None:
    d = P.LEGAL
    path = "/privacy/"
    secs = "".join(f"<h2>{e(h)}</h2><p>{e(b)}</p>" for h, b in d["body"])
    crumbs = [("Home", "/"), ("Privacy", "")]
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <h1>{e(d['h1'])}</h1>
    <p>Last updated {TODAY}.</p>
  </div>
</section>
<section class="section section--white">
  <div class="container container--narrow prose">{secs}</div>
</section>"""
    write(path, document(path=path, title=d["meta_title"], desc=d["meta_desc"], body=body,
                         crumbs=crumbs))


def render_404() -> None:
    d = P.NOT_FOUND
    links = "".join(
        f'<li><a href="/services/{s["slug"]}/">{e(s["nav"])}</a></li>' for s in SERVICES[:8]
    )
    body = f"""<section class="page-head">
  <div class="container page-head__inner">
    <p class="eyebrow">404</p>
    <h1>{e(d['h1'])}</h1>
    <p>{e(d['tagline'])}</p>
  </div>
</section>
<section class="section section--white">
  <div class="container container--narrow prose">
    <div class="btn-row" style="margin-bottom:32px">
      <a class="btn btn--primary" href="tel:{BIZ['phone_href']}">{icon('phone', size=20)}{e(BIZ['phone_display'])}</a>
      <a class="btn btn--ghost" href="/">Back to the homepage</a>
    </div>
    <h2>Popular services</h2>
    <ul>{links}</ul>
    <p><a href="/services/">See all 16 services</a> or <a href="/service-areas/">find your service area</a>.</p>
  </div>
</section>"""
    write("/404.html", document(path="/404.html", title=d["meta_title"],
                                desc="Page not found.", body=body, noindex=True))


# ---------------------------------------------------------------- site files


def all_paths() -> list[tuple[str, str]]:
    """(path, priority) for the sitemap, in crawl-priority order."""
    out = [("/", "1.0"), ("/services/", "0.9"), ("/service-areas/", "0.8"),
           ("/contact/", "0.8"), ("/about/", "0.6"), ("/faq/", "0.6")]
    out += [(f"/services/{s['slug']}/", "0.8") for s in SERVICES]
    out += [(f"/service-areas/{a['slug']}/", "0.7") for a in AREAS]
    out += [("/privacy/", "0.2")]
    return out


def render_sitemap() -> None:
    entries = "".join(
        f"<url><loc>{url(p)}</loc><lastmod>{TODAY}</lastmod><priority>{pri}</priority></url>"
        for p, pri in all_paths()
    )
    write("/sitemap.xml",
          '<?xml version="1.0" encoding="UTF-8"?>\n'
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
          f"{entries}</urlset>\n")


def render_robots() -> None:
    write("/robots.txt", f"""# robots.txt — {BIZ['name']}
User-agent: *
Allow: /
Disallow: /thank-you/

# Answer engines and AI crawlers are welcome: this site is public marketing
# information and we would rather be quoted accurately than not at all.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: {url('/sitemap.xml')}
""")


def render_llms() -> None:
    svc_lines = "\n".join(
        f"- [{s['nav']}]({url('/services/' + s['slug'] + '/')}): {s['card_blurb']}"
        for s in SERVICES
    )
    area_lines = "\n".join(
        f"- [{a['name']}, PA]({url('/service-areas/' + a['slug'] + '/')}): {a['county']}"
        for a in AREAS
    )
    write("/llms.txt", f"""# {BIZ['name']}

> Licensed and insured general contractor in Pittsburgh, Pennsylvania. Residential and
> commercial. Interior remodeling, exterior replacement, concrete and outdoor construction,
> hauling and demolition, and seasonal landscaping and snow services.

## Business facts

- Name: {BIZ['name']}
- Location: {BIZ['city']}, {BIZ['region']} (serving Greater Pittsburgh, Allegheny, Washington and Butler counties)
- Phone and text: {BIZ['phone_display']}
- Email: {BIZ['email']}
- Pennsylvania Home Improvement Contractor registration: {BIZ['hic']}
- General contractor license: {BIZ['gc_license']}
- Insurance: fully insured; certificate available on request
- Estimates: free, performed on site
- Pricing: itemized written quotes — labor, materials and disposal listed separately
- Property types: residential and commercial
- Published rate: dumpster trailer rental $225 Friday–Sunday, dumping fees $100 per ton,
  trailers 6 ft x 14 ft and 6 ft x 12 ft, up to 3 tons each

## Services

{svc_lines}

## Service areas

{area_lines}

## Key pages

- [Home]({url('/')})
- [All services]({url('/services/')})
- [Service areas]({url('/service-areas/')})
- [About]({url('/about/')})
- [FAQ]({url('/faq/')})
- [Contact and free estimate]({url('/contact/')})

Last updated: {TODAY}
""")


def render_manifest() -> None:
    write("/site.webmanifest", json.dumps({
        "name": BIZ["name"],
        "short_name": "Osas",
        "description": "Licensed general contractor in Pittsburgh, PA.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#faf7f4",
        "theme_color": "#12151a",
        "icons": [
            {"src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml"},
            {"src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
        ],
    }, indent=2) + "\n")


def main() -> None:
    # Remove previously generated HTML so deleted pages do not linger, while
    # leaving hand-maintained assets alone.
    for root, _dirs, files in os.walk(OUT):
        if os.path.join(OUT, "assets") in root:
            continue
        for f in files:
            if f.endswith(".html"):
                os.remove(os.path.join(root, f))

    render_home()
    render_services_hub()
    for s in SERVICES:
        render_service(s)
    render_areas_hub()
    for a in AREAS:
        render_area(a)
    render_about()
    render_contact()
    render_faq()
    render_thanks()
    render_privacy()
    render_404()
    render_sitemap()
    render_robots()
    render_llms()
    render_manifest()

    count = sum(len([f for f in files if f.endswith(".html")])
                for _r, _d, files in os.walk(OUT))
    print(f"Built {count} HTML pages into {OUT}")
    print(f"Sitemap entries: {len(all_paths())}")


if __name__ == "__main__":
    main()
