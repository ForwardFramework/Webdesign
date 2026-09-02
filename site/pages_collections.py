"""Services hub + detail, service areas hub + detail, gallery, reviews, FAQ."""
from config import BUSINESS as B, SITE_URL
from content_reviews import REVIEWS, REVIEW_COUNT, RATING_AVG
from content_services import SERVICES, SERVICE_BY_SLUG
from content_areas import AREAS
from content_pages import GALLERY, FAQ_GROUPS, all_faqs, PROCESS
from components import (esc, url, icon, star_row, btn_call, btn_quote, trust_bar,
                        review_card, faq_list, cta_band, gallery_strip, TEL1, TEL2,
                        review_nodes, ORG_ID)
from assets import img_src

CITY_LIST = ", ".join(a["city"] for a in AREAS[:-1]) + " and " + AREAS[-1]["city"]

def _table(head, rows, caption=None, label="Comparison table"):
    """Tables scroll horizontally on narrow screens, so the wrapper needs
    tabindex="0" — otherwise keyboard users cannot reach the overflowing
    columns (WCAG 2.1.1)."""
    th = "".join(f"<th scope=\"col\">{c}</th>" for c in head)
    tr = ""
    for r in rows:
        cells = f'<th scope="row">{r[0]}</th>' + "".join(f"<td>{c}</td>" for c in r[1:])
        tr += f"<tr>{cells}</tr>"
    cap = f"<caption>{caption}</caption>" if caption else ""
    return (f'<div class="table-wrap" tabindex="0" role="region" aria-label="{esc(label)}">'
            f'<table>{cap}<thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div>')

# ------------------------------------------------------------- services hub
def services_hub():
    cards = "".join(f'''<a class="card" href="/services/{s["slug"]}/">
  <span class="card-ico">{icon(s["icon"], 26)}</span>
  <h3>{s["h1"]}</h3>
  <p>{s["summary"]}</p>
  <span class="link-arrow">Learn more{icon("arrow-right", 18)}</span>
</a>''' for s in SERVICES)

    quick = _table(
        ["Service", "Typical turnaround", "Permit usually needed?"],
        [["Pool cage rescreening", "1–2 days", "No"],
         ["Lanai / patio rescreen", "1 day", "No"],
         ["New screen enclosure", "3–5 days after permitting", "Yes"],
         ["Screen door repair", "Same visit", "No"],
         ["Screen door replacement", "1 visit after measuring", "No"],
         ["Window screens (whole house)", "1 visit", "No"],
         ["Storm damage repair", "Depends on scope", "Sometimes, if structural"],
         ["Aluminum railings", "1–2 days", "Sometimes"]],
        "Typical turnaround times. Confirmed on your written estimate.",
        label="Typical turnaround time by service")

    body = f'''<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--blue-400)">Services</p>
    <h1>Screen &amp; Aluminum Services in Southwest Florida</h1>
    <p class="lede">Everything Acosta Pro does, from a single torn window screen to a
    complete pool cage rescreen. Free written estimates on all of it.</p>
    <div class="page-head-actions">
      {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent", "svc-hub-call")}
      {btn_quote("Free Estimate", "btn btn-outline-light", "svc-hub-quote")}
    </div>
  </div>
</section>
{trust_bar()}

<section class="section">
  <div class="wrap">
    <div class="answer-capsule narrow">
      <p class="ac-t">Quick answer</p>
      <p>Acosta Pro Aluminum Screen offers six core services across Sarasota, Manatee
      and Charlotte County, Florida: pool cage rescreening and repair, lanai and patio
      screen enclosures, screen door repair and installation, window screen repair and
      replacement, hurricane and storm damage repair, and aluminum structures and
      railings. Every estimate is free, on site and written down.</p>
    </div>
    <div class="sec-head"><div>
      <p class="eyebrow">The six services</p>
      <h2>What we do</h2>
    </div></div>
    <div class="grid g-3">{cards}</div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head center"><div>
      <p class="eyebrow">At a glance</p>
      <h2>How long each job takes</h2>
    </div></div>
    {quick}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head center"><div>
      <p class="eyebrow">How it works</p>
      <h2>The same four steps on every job</h2>
    </div></div>
    <ol class="steps">{"".join(f'<li><h3>{t}</h3><p>{d}</p></li>' for t, d in PROCESS)}</ol>
  </div>
</section>

{gallery_strip(GALLERY[:4], "What the finished work looks like")}
{cta_band()}'''

    return {
        "path": "/services/", "body": body,
        "title": "Screen & Aluminum Services | Sarasota FL | Acosta Pro",
        "description": ("Pool cage rescreening, lanai enclosures, screen doors, window "
                        "screens and storm repair across Sarasota, Manatee and Charlotte "
                        "County. Free estimates: 941-565-5576."),
        "trail": [("Home", "/"), ("Services", "/services/")],
        "extra_nodes": [{
            "@type": "ItemList", "@id": url("/services/") + "#list",
            "name": "Services offered by Acosta Pro Aluminum Screen",
            "itemListElement": [{
                "@type": "ListItem", "position": i + 1,
                "url": url(f'/services/{s["slug"]}/'),
                "name": s["nav"],
            } for i, s in enumerate(SERVICES)],
        }],
    }

# ---------------------------------------------------------- service detail
def service_page(s):
    path = f'/services/{s["slug"]}/'
    shots = [g for g in GALLERY if g[3] == s["slug"]] or GALLERY[:3]

    signals = "".join(f'<li>{icon("check", 20)}<span>{t}</span></li>' for t in s["signals"])
    includes = "".join(f'<li>{icon("check-circle", 20)}<span>{t}</span></li>' for t in s["includes"])
    steps = "".join(f'<li><h3>{t}</h3><p>{d}</p></li>' for t, d in s["process"])
    steps_cls = "steps steps-5" if len(s["process"]) == 5 else "steps"

    rel = "".join(f'''<a class="card" href="/services/{r}/">
  <span class="card-ico">{icon(SERVICE_BY_SLUG[r]["icon"], 24)}</span>
  <h3>{SERVICE_BY_SLUG[r]["h1"]}</h3>
  <p>{SERVICE_BY_SLUG[r]["summary"]}</p>
  <span class="link-arrow">Learn more{icon("arrow-right", 18)}</span>
</a>''' for r in s["related"])

    areas = "".join(f'<li><a href="/service-areas/{a["slug"]}/">{a["city"]}</a></li>'
                    for a in AREAS)
    intro = "".join(f"<p>{p}</p>" for p in s["intro"])
    tagged = [r for r in REVIEWS if any(t in r["tags"] for t in
              (s["slug"].split("-")[0], "general"))][:2] or REVIEWS[:2]
    revs = "".join(review_card(r) for r in tagged)

    body = f'''<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--blue-400)">{s["nav"]}</p>
    <h1>{s["h1"]}</h1>
    <p class="lede">{s["summary"]}</p>
    <div class="page-head-actions">
      {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent", "svc-call")}
      {btn_quote("Get a Free Estimate", "btn btn-outline-light", "svc-quote")}
    </div>
  </div>
</section>
{trust_bar()}

<section class="section">
  <div class="wrap split split-top">
    <div>
      <div class="answer-capsule">
        <p class="ac-t">Quick answer</p>
        <p>{s["quick_answer"]}</p>
      </div>
      {intro}
      <h2>{s["signals_title"]}</h2>
      <ul class="checks">{signals}</ul>
    </div>
    <div class="split-media">
      <img src="{img_src(shots[0][0])}" alt="{esc(shots[0][1])}" width="800" height="600"
           loading="lazy" decoding="async">
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Scope of work</p>
      <h2>{s["includes_title"]}</h2>
    </div></div>
    <ul class="checks checks-2">{includes}</ul>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Materials &amp; options</p>
      <h2>{s["table_title"]}</h2>
    </div></div>
    <p class="lede" style="margin-bottom:1.5rem;max-width:60rem">{s["table_intro"]}</p>
    {_table(s["table_head"], s["table_rows"], label=s["table_title"])}
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head center"><div>
      <p class="eyebrow">Process</p>
      <h2>{s["process_title"]}</h2>
    </div></div>
    <ol class="{steps_cls}">{steps}</ol>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Pricing</p>
      <h2>{s["cost_title"]}</h2>
    </div></div>
    <p class="lede" style="margin-bottom:1.5rem;max-width:60rem">{s["cost_intro"]}</p>
    {_table(s["cost_head"], s["cost_rows"], label=s["cost_title"])}
    <div class="note" style="margin-top:1.5rem;max-width:60rem">
      <strong>We do not quote this over the phone, and you should be wary of anyone who does.</strong>
      A price given sight-unseen either gets revised upward on the day or was padded to
      begin with. We come out, measure, and write it down &mdash; free.
    </div>
  </div>
</section>

{gallery_strip(shots, "Recent " + s["nav"].lower() + " jobs")}

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Customer reviews</p>
      <h2>What people say about this work</h2>
    </div>
    <a class="link-arrow" href="/reviews/">All {REVIEW_COUNT} reviews{icon("arrow-right", 18)}</a></div>
    <div class="grid g-2">{revs}</div>
  </div>
</section>

<section class="section">
  <div class="wrap narrow">
    <div class="sec-head center"><div>
      <p class="eyebrow">Questions</p>
      <h2>{s["nav"]} FAQs</h2>
    </div></div>
    {faq_list(s["faqs"], open_first=True)}
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Related</p>
      <h2>Other work we do</h2>
    </div></div>
    <div class="grid g-3">{rel}</div>
    <h3 style="margin-top:2.5rem">Where we do this work</h3>
    <ul class="pill-list">{areas}</ul>
  </div>
</section>

{cta_band(f'Free estimate for {s["nav"].lower()}',
          "We come out, measure, and hand you a written price. No charge for the visit.")}'''

    svc_node = {
        "@type": "Service",
        "@id": url(path) + "#service",
        "name": s["nav"],
        "serviceType": s["nav"],
        "description": s["quick_answer"],
        "provider": {"@id": ORG_ID},
        "areaServed": [{"@type": "City", "name": f'{a["city"]}, Florida'} for a in AREAS],
        "audience": {"@type": "Audience", "audienceType": "Homeowners and property managers"},
        "offers": {"@type": "Offer", "availability": "https://schema.org/InStock",
                   "priceSpecification": {"@type": "PriceSpecification",
                                          "priceCurrency": "USD",
                                          "description": "Free written on-site estimate"}},
        "hasOfferCatalog": {
            "@type": "OfferCatalog", "name": s["includes_title"],
            "itemListElement": [{"@type": "Offer",
                                 "itemOffered": {"@type": "Service", "name": i}}
                                for i in s["includes"]],
        },
    }
    return {
        "path": path, "body": body,
        "title": s["meta_title"], "description": s["meta_desc"],
        "faqs": s["faqs"],
        "og_image": img_src(shots[0][0]),
        "trail": [("Home", "/"), ("Services", "/services/"), (s["nav"], path)],
        "extra_nodes": [svc_node],
    }

# ---------------------------------------------------------------- areas hub
def areas_hub():
    cards = "".join(f'''<a class="card" href="/service-areas/{a["slug"]}/">
  <span class="card-ico">{icon("pin", 26)}</span>
  <h3>{a["city"]}</h3>
  <p>{a["county"]} &middot; {len(a["zips"])} ZIP codes covered</p>
  <span class="link-arrow">Screen services in {a["city"]}{icon("arrow-right", 18)}</span>
</a>''' for a in AREAS)

    rows = [[a["city"], a["county"], ", ".join(a["zips"][:6]) +
             ("…" if len(a["zips"]) > 6 else "")] for a in AREAS]

    body = f'''<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--blue-400)">Service areas</p>
    <h1>Where Acosta Pro Works</h1>
    <p class="lede">Sarasota, Manatee and Charlotte County &mdash; roughly a
    {B["service_radius_mi"]}-mile radius. We are a local crew, not a franchise driving
    down from Tampa.</p>
    <div class="page-head-actions">
      {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent", "areas-call")}
      {btn_quote("Free Estimate", "btn btn-outline-light", "areas-quote")}
    </div>
  </div>
</section>
{trust_bar()}

<section class="section">
  <div class="wrap">
    <div class="answer-capsule narrow">
      <p class="ac-t">Quick answer</p>
      <p>Acosta Pro Aluminum Screen serves Sarasota County, Manatee County and Charlotte
      County in Southwest Florida, including {CITY_LIST}. If your property is within
      about {B["service_radius_mi"]} miles of Sarasota, call
      <a href="tel:{TEL1}">{B["phone_primary"]}</a> &mdash; we almost certainly cover it.</p>
    </div>
    <div class="sec-head"><div>
      <p class="eyebrow">Cities we cover</p>
      <h2>Pick your city</h2>
    </div></div>
    <div class="grid g-4">{cards}</div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head center"><div>
      <p class="eyebrow">Coverage</p>
      <h2>Cities, counties and ZIP codes</h2>
    </div></div>
    {_table(["City", "County", "ZIP codes"], rows, label="Cities, counties and ZIP codes served")}
    <p class="muted center" style="margin-top:1.25rem">
      Also serving Osprey, Nokomis, Palmetto, Parrish, Ellenton, Siesta Key,
      Longboat Key, Rotonda West and Manasota Key.</p>
  </div>
</section>

{cta_band("Not sure if we cover your street?",
          "Call and ask. If we do not cover it, we will tell you who does.")}'''

    return {
        "path": "/service-areas/", "body": body,
        "title": "Service Areas | Sarasota, Manatee & Charlotte | Acosta Pro",
        "description": ("Screen and aluminum services across Sarasota, Bradenton, Venice, "
                        "North Port, Port Charlotte, Punta Gorda, Lakewood Ranch and "
                        "Englewood, Florida. Call 941-565-5576."),
        "trail": [("Home", "/"), ("Service Areas", "/service-areas/")],
    }

# -------------------------------------------------------------- area detail
def area_page(a):
    path = f'/service-areas/{a["slug"]}/'
    svc = "".join(f'''<a class="card" href="/services/{s["slug"]}/">
  <span class="card-ico">{icon(s["icon"], 24)}</span>
  <h3>{s["nav"]} in {a["city"]}</h3>
  <p>{s["summary"]}</p>
  <span class="link-arrow">Learn more{icon("arrow-right", 18)}</span>
</a>''' for s in SERVICES)

    hoods = "".join(f"<li><span>{h}</span></li>" for h in a["neighborhoods"])
    zips = ", ".join(a["zips"])
    others = [x for x in AREAS if x["slug"] != a["slug"]]
    other_links = "".join(f'<li><a href="/service-areas/{o["slug"]}/">{o["city"]}</a></li>'
                          for o in others)
    revs = "".join(review_card(r) for r in REVIEWS[:3])

    faqs = [
        (f'Do you service {a["city"]}, Florida?',
         f'Yes. Acosta Pro Aluminum Screen serves {a["city"]} and the surrounding '
         f'{a["county"]} area, covering ZIP codes {zips}. Call '
         f'{B["phone_primary"]} or {B["phone_secondary"]} for a free on-site estimate.'),
        (f'How much does pool cage rescreening cost in {a["city"]}?',
         'Rescreening is priced per panel, so cost depends on panel count, cage height '
         'and the mesh you choose. We do not quote it over the phone because a '
         'sight-unseen number is either revised on the day or padded up front. The '
         'on-site estimate is free and written.'),
        (f'How quickly can you get to {a["city"]}?',
         f'{a["city"]} is inside our normal service area, so estimates are usually '
         'scheduled within a few days and work within the following week. Storm damage '
         'and doors that will not close get prioritized.'),
        (f'What screen do you recommend for {a["city"]} homes?',
         a["local_note"]),
    ]

    body = f'''<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--blue-400)">{a["county"]}</p>
    <h1>Screen &amp; Pool Cage Services in {a["city"]}, FL</h1>
    <p class="lede">Pool cage rescreening, lanai enclosures, screen doors and window
    screens throughout {a["city"]} and the surrounding {a["county"]} area.</p>
    <div class="page-head-actions">
      {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent", "area-call")}
      {btn_quote("Free Estimate", "btn btn-outline-light", "area-quote")}
    </div>
  </div>
</section>
{trust_bar()}

<section class="section">
  <div class="wrap split split-top">
    <div>
      <div class="answer-capsule">
        <p class="ac-t">Quick answer</p>
        <p>Acosta Pro Aluminum Screen provides pool cage rescreening, lanai and patio
        screen enclosures, screen door repair, window screens, storm damage repair and
        aluminum work in {a["city"]}, Florida ({a["county"]}), covering ZIP codes {zips}.
        Estimates are free and written. Call
        <a href="tel:{TEL1}">{B["phone_primary"]}</a>.</p>
      </div>
      <p>{a["blurb"]}</p>
      <div class="note"><strong>Local note</strong>{a["local_note"]}</div>
      <h2 style="margin-top:2rem">Neighborhoods we cover in {a["city"]}</h2>
      <ul class="pill-list">{hoods}</ul>
      <p class="muted" style="margin-top:1rem;font-size:.875rem">
        ZIP codes: {zips}</p>
    </div>
    <div class="split-media">
      <img src="{img_src(GALLERY[1][0])}" alt="{esc(GALLERY[1][1])}" width="800" height="600"
           loading="lazy" decoding="async">
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Services</p>
      <h2>What we do in {a["city"]}</h2>
    </div></div>
    <div class="grid g-3">{svc}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head"><div>
      <p class="eyebrow">Reviews</p>
      <h2>{RATING_AVG} stars from {REVIEW_COUNT} local customers</h2>
    </div>
    <a class="link-arrow" href="/reviews/">Read them all{icon("arrow-right", 18)}</a></div>
    <div class="grid g-3">{revs}</div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap narrow">
    <div class="sec-head center"><div>
      <p class="eyebrow">{a["city"]} FAQs</p>
      <h2>Questions from {a["city"]} homeowners</h2>
    </div></div>
    {faq_list(faqs, open_first=True)}
  </div>
</section>

<section class="section">
  <div class="wrap center">
    <h2>Other areas we serve</h2>
    <ul class="pill-list" style="justify-content:center">{other_links}</ul>
  </div>
</section>

{cta_band(f'Free screen estimate in {a["city"]}',
          f'We are local to {a["county"]}. Call and we will come measure it.')}'''

    return {
        "path": path, "body": body,
        "title": f'Pool Cage & Screen Repair {a["city"]} FL | Acosta Pro',
        "description": (f'Pool cage rescreening, lanai enclosures, screen doors and '
                        f'window screens in {a["city"]}, Florida. Free written estimates, '
                        f'5.0-star rated. Call 941-565-5576.'),
        "faqs": faqs,
        "trail": [("Home", "/"), ("Service Areas", "/service-areas/"), (a["city"], path)],
        "extra_nodes": [{
            "@type": "Service",
            "@id": url(path) + "#service",
            "name": f'Screen and aluminum services in {a["city"]}, Florida',
            "provider": {"@id": ORG_ID},
            "areaServed": {"@type": "City", "name": f'{a["city"]}, Florida',
                           "containedInPlace": {"@type": "AdministrativeArea",
                                                "name": a["county"].replace("&amp;", "and")},
                           "geo": {"@type": "GeoCoordinates",
                                   "latitude": a["lat"], "longitude": a["lon"]}},
        }],
    }

# -------------------------------------------------------------------- gallery
def gallery():
    cards = "".join(f'''<figure class="shot">
  <img src="{img_src(f)}" alt="{esc(alt)}" width="800" height="600" loading="lazy" decoding="async">
  <figcaption>{esc(cat)}</figcaption>
</figure>''' for f, alt, cat, _s in GALLERY)

    cats = sorted({g[2] for g in GALLERY})
    pills = "".join(f'<li><span>{esc(c)}</span></li>' for c in cats)

    body = f'''<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--blue-400)">Gallery</p>
    <h1>Our Work</h1>
    <p class="lede">Pool cages, lanais, doors and aluminum work from around Sarasota,
    Manatee and Charlotte County.</p>
    <ul class="pill-list">{pills}</ul>
  </div>
</section>
{trust_bar()}

<section class="section">
  <div class="wrap">
    <div class="answer-capsule narrow">
      <p class="ac-t">About these photos</p>
      <p>Every image here is work completed by Acosta Pro Aluminum Screen for customers
      in Southwest Florida &mdash; pool cage rescreens, lanai enclosures, screen door
      replacements, window screens, storm repairs and aluminum railings. Want something
      similar? Call <a href="tel:{TEL1}">{B["phone_primary"]}</a> for a free estimate.</p>
    </div>
    <div class="shots shots-3">{cards}</div>
  </div>
</section>

{cta_band("Want your lanai to look like this?",
          "Free written estimate, and we will show you the mesh options in daylight.")}'''

    return {
        "path": "/gallery/", "body": body,
        "title": "Photo Gallery | Pool Cage & Lanai Work | Acosta Pro",
        "description": ("Photos of completed pool cage rescreening, lanai enclosures, "
                        "screen doors and aluminum work across Sarasota, Bradenton, "
                        "Venice and Port Charlotte."),
        "trail": [("Home", "/"), ("Gallery", "/gallery/")],
        "extra_nodes": [{
            "@type": "ImageGallery",
            "@id": url("/gallery/") + "#gallery",
            "name": "Acosta Pro Aluminum Screen project gallery",
            "about": {"@id": ORG_ID},
            "associatedMedia": [{
                "@type": "ImageObject",
                "contentUrl": SITE_URL + img_src(f),
                "caption": alt,
                "representativeOfPage": i == 0,
            } for i, (f, alt, _c, _s) in enumerate(GALLERY)],
        }],
    }

# -------------------------------------------------------------------- reviews
def reviews_page():
    cards = "".join(review_card(r) for r in REVIEWS)
    themes = [
        ("Professionalism", 11, "Named in most reviews — punctuality, courtesy and clear communication."),
        ("Quality of work", 9, "Several customers describe the result as exceeding expectations."),
        ("Speed", 6, "Fast scheduling and jobs finished when promised."),
        ("Fair pricing", 4, "Described as reasonable, fair, or the best price received."),
    ]
    theme_rows = [[t, str(n), d] for t, n, d in themes]

    body = f'''<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--blue-400)">Reviews</p>
    <h1>{RATING_AVG} Stars from {REVIEW_COUNT} Google Reviews</h1>
    <p class="lede">Every review we have received is a five-star review. Here they all
    are, unedited.</p>
    <div class="page-head-actions">
      {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent", "rev-call")}
      {btn_quote("Free Estimate", "btn btn-outline-light", "rev-quote")}
    </div>
  </div>
</section>
{trust_bar()}

<section class="section">
  <div class="wrap">
    <div class="rating-summary">
      <div class="rating-score">
        <b>{RATING_AVG}</b>
        {star_row(5, 20)}
        <span class="rc-count">{REVIEW_COUNT} Google reviews</span>
      </div>
      <div style="flex:1;min-width:260px">
        <h2 style="font-size:1.25rem;margin-bottom:.35rem">Perfect rating, every review</h2>
        <p style="margin:0;font-size:.9375rem">All {REVIEW_COUNT} reviews of Acosta Pro
        Aluminum Screen LLC are five stars. Customers most often mention
        professionalism, quality of work, speed and fair pricing.</p>
      </div>
    </div>

    <div class="answer-capsule">
      <p class="ac-t">Quick answer</p>
      <p>Acosta Pro Aluminum Screen LLC holds a {RATING_AVG} out of 5 rating from
      {REVIEW_COUNT} Google reviews, with no review below five stars. Reviewers
      consistently cite professionalism, punctuality, clean work sites, quality that
      exceeded expectations, and fair pricing for pool cage, lanai and screen door work
      in Southwest Florida.</p>
    </div>

    <div class="reviews-masonry">{cards}</div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head center"><div>
      <p class="eyebrow">What customers mention</p>
      <h2>The themes that come up again and again</h2>
    </div></div>
    {_table(["Theme", "Reviews mentioning it", "What they say"], theme_rows, label="Themes mentioned across customer reviews")}
    <p class="muted center" style="margin-top:1.25rem;font-size:.875rem">
      Counts are our own reading of the review text. Reviews are reproduced from our
      Google Business Profile; owner replies have been removed for readability.</p>
  </div>
</section>

{cta_band("Join them", "Free written estimate, and the same crew every one of them dealt with.")}'''

    return {
        "path": "/reviews/", "body": body,
        "title": f"Reviews | {RATING_AVG} Stars from {REVIEW_COUNT} Customers | Acosta Pro",
        "description": (f"Read all {REVIEW_COUNT} Google reviews of Acosta Pro Aluminum "
                        f"Screen LLC — every one a 5-star rating. Pool cage, lanai and "
                        f"screen door work in Sarasota, Bradenton and Venice FL."),
        "trail": [("Home", "/"), ("Reviews", "/reviews/")],
        "extra_nodes": review_nodes(),
    }

# ------------------------------------------------------------------------ faq
def faq_page():
    blocks = ""
    for group, items in FAQ_GROUPS:
        pairs = [(q, a) for q, a, _h in items]
        blocks += f'''<section class="section{' section-alt' if group == "Screen and materials" or group == "Paying and warranty" else ''}">
  <div class="wrap narrow">
    <h2>{group}</h2>
    {faq_list(pairs)}
  </div>
</section>'''

    body = f'''<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--blue-400)">FAQ</p>
    <h1>Screen &amp; Pool Cage Questions, Answered</h1>
    <p class="lede">Twenty questions we get asked most often about screen work in
    Southwest Florida &mdash; costs, timing, materials, permits and warranties.</p>
    <div class="page-head-actions">
      {btn_call(B["phone_primary"], "Ask us directly", "btn btn-accent", "faq-call")}
      {btn_quote("Free Estimate", "btn btn-outline-light", "faq-quote")}
    </div>
  </div>
</section>
{trust_bar()}
<section class="section-tight">
  <div class="wrap narrow">
    <div class="answer-capsule" style="margin:0">
      <p class="ac-t">The short version</p>
      <p>Standard screen lasts 5&ndash;7 years in Southwest Florida. A lanai rescreen
      takes about a day and a pool cage one to two. Rescreening an existing enclosure
      does not need a permit; building a new one usually does. Estimates from Acosta Pro
      are free, written and itemized &mdash; call
      <a href="tel:{TEL1}">{B["phone_primary"]}</a>.</p>
    </div>
  </div>
</section>
{blocks}
{cta_band("Still have a question?", "Call either number and ask. We would rather answer it now than have you guess.")}'''

    return {
        "path": "/faq/", "body": body,
        "title": "Screen & Pool Cage FAQs | Sarasota FL | Acosta Pro",
        "description": ("How long screen lasts in Florida, what rescreening costs, "
                        "whether you need a permit, and 17 more answers from Acosta Pro "
                        "Aluminum Screen. Call 941-565-5576."),
        "faqs": all_faqs(),
        "trail": [("Home", "/"), ("FAQ", "/faq/")],
    }
