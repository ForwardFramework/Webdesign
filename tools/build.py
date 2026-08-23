#!/usr/bin/env python3
"""
Forward Framework — static page generator.

index.html is hand-authored and is the single source of truth for the site
shell (utility bar, header, footer, mobile CTA). This script extracts that
shell from index.html and stamps every other page with it, so the navigation
and footer can never drift between pages.

Run from the repository root:   python3 tools/build.py
"""

import json
import os
import re
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.forward-framework.com"

# Pricing is currently withheld from the public site. The figures still live in
# each service's "prices" list below — they drive tools/build_pricing_pdf.py and
# are the single source of truth if pricing is ever republished. Flip this to
# True to restore the pricing page, the per-service price cards, the homepage
# teaser and the Offer prices in the structured data.
SHOW_PRICING = False

# Scheduling link (Calendly, SavvyCal, HubSpot — whatever you use). While it is
# empty the post-submission page asks people to call, which is a real number
# rather than a dead button. Set it and booking becomes the primary action.
BOOKING_URL = ""
TODAY = date.today().isoformat()

# --------------------------------------------------------------------------
# Shell extraction
# --------------------------------------------------------------------------
index_html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

_top = re.search(r'(<a class="skip".*?<main id="main">)', index_html, re.S)
# Stop before index.html's own script tag — page() adds it back. Capturing it
# here made every generated page load main.js twice, which doubled every event
# listener (and every form submission).
_bottom = re.search(r'(</main>.*?)<script src=', index_html, re.S)
if not _top or not _bottom:
    raise SystemExit("Could not locate the shell markers in index.html")

SHELL_TOP = _top.group(1)
SHELL_BOTTOM = _bottom.group(1)


def shell_top(active_href=None):
    """Return the shared header markup with the active nav item marked."""
    html = SHELL_TOP
    if active_href:
        html = html.replace(
            f'<a class="nav-link" href="{active_href}"',
            f'<a class="nav-link is-active" aria-current="page" href="{active_href}"',
        )
    return html


def page(path, title, description, body, schema=None, active=None,
         canonical=None, og_type="website", noindex=False):
    """Write one complete HTML document."""
    canonical = canonical or f"{SITE}/{path}".replace("/index.html", "/")
    robots = ("noindex,follow" if noindex else
              "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1")
    schema_block = ""
    if schema:
        schema_block = (
            '\n<script type="application/ld+json">\n'
            + json.dumps(schema, indent=2, ensure_ascii=False)
            + "\n</script>\n"
        )

    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#0A0A0A">
<meta name="robots" content="{robots}">

<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="Forward Framework">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}/assets/img/og-image.svg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{SITE}/assets/img/og-image.svg">

<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/favicon.svg">
<link rel="manifest" href="/site.webmanifest">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap"></noscript>
<link rel="stylesheet" href="/assets/css/styles.css">
<script>document.documentElement.classList.add('js');</script>
{schema_block}</head>
<body>
{shell_top(active)}
{body}
{SHELL_BOTTOM}<script src="/assets/js/main.js" defer></script>
</body>
</html>
"""
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as fh:
        fh.write(doc)
    print(f"  wrote {path}")


# --------------------------------------------------------------------------
# Reusable fragments
# --------------------------------------------------------------------------
def crumbs(items):
    lis = "".join(
        f'<li><a href="{href}">{label}</a></li>' if href else f"<li>{label}</li>"
        for label, href in items
    )
    return f'<nav class="wrap crumbs" aria-label="Breadcrumb"><ol>{lis}</ol></nav>'


def crumb_schema(items):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": label,
             **({"item": SITE + href} if href else {})}
            for i, (label, href) in enumerate(items)
        ],
    }


def faq_block(faqs, open_first=True):
    out = ['<div class="faq">']
    for i, (q, a) in enumerate(faqs):
        attr = " open" if (open_first and i == 0) else ""
        out.append(
            f'<details{attr}><summary>{q} <span class="plus" aria-hidden="true"></span></summary>'
            f'<div class="faq-body"><p>{a}</p></div></details>'
        )
    out.append("</div>")
    return "\n".join(out)


def faq_schema(faqs, page_id):
    return {
        "@type": "FAQPage",
        "@id": f"{page_id}#faq",
        "mainEntity": [
            {"@type": "Question", "name": strip_tags(q),
             "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}}
            for q, a in faqs
        ],
    }


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s).replace("&amp;", "&").strip()


def lead_form(form_id, heading, blurb, cta, trigger, source):
    """Single-step conversion form used on interior pages."""
    return f"""
<div class="form-panel" id="{form_id}">
  <form data-ff-form id="{form_id}-form" name="{form_id}" method="POST"
        action="/thank-you.html" data-netlify="true"
        data-netlify-honeypot="company_website_hp" novalidate>
    <input type="hidden" name="form-name" value="{form_id}">
    <input type="hidden" name="routed_to" value="hello@forward-framework.com">
    <!-- Netlify only records fields present in the deployed HTML, so the
         attribution captured by main.js needs real inputs to land in. -->
    <input type="hidden" name="utm_source"><input type="hidden" name="utm_medium">
    <input type="hidden" name="utm_campaign"><input type="hidden" name="utm_term">
    <input type="hidden" name="utm_content"><input type="hidden" name="gclid">
    <input type="hidden" name="fbclid"><input type="hidden" name="landing_page">
    <input type="hidden" name="referrer"><input type="hidden" name="submitted_at">
    <div class="form-head">
      <span class="eyebrow">Free · No obligation</span>
      <h2 class="h3" style="margin-bottom:.35rem">{heading}</h2>
      <p class="small muted mb-0">{blurb}</p>
    </div>
    <div class="form-body">
      <input type="hidden" name="request_type" value="{source}">
      <div class="field-row">
        <div class="field">
          <label for="{form_id}-name">Name <span class="req">*</span></label>
          <input type="text" id="{form_id}-name" name="name" required autocomplete="name" placeholder="Jordan Reyes">
          <span class="field-error">Please add your name.</span>
        </div>
        <div class="field">
          <label for="{form_id}-company">Company</label>
          <input type="text" id="{form_id}-company" name="company" autocomplete="organization" placeholder="Company name">
        </div>
      </div>
      <div class="field">
        <label for="{form_id}-email">Work email <span class="req">*</span></label>
        <input type="email" id="{form_id}-email" name="email" required autocomplete="email" placeholder="you@company.com">
        <span class="field-error">Please add a valid email so we can send it.</span>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="{form_id}-website">Website</label>
          <input type="text" id="{form_id}-website" name="website" inputmode="url" placeholder="yourcompany.com">
        </div>
        <div class="field">
          <label for="{form_id}-phone">Phone</label>
          <input type="tel" id="{form_id}-phone" name="phone" autocomplete="tel" placeholder="(555) 555-5555">
        </div>
      </div>
      <div class="field">
        <label for="{form_id}-notes">Anything we should know?</label>
        <textarea id="{form_id}-notes" name="notes" placeholder="Where it hurts most right now…"></textarea>
      </div>
      <div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="company_website_hp" tabindex="-1" autocomplete="off"></label></div>
      <button class="btn btn--primary btn--block btn--lg" type="submit">{cta} <span class="btn-arrow" aria-hidden="true">&rarr;</span></button>
      <p class="click-trigger">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
        {trigger}
      </p>
      <p class="form-legal">We use your details only to prepare and send this. No lists, no reselling. Read our <a href="/privacy.html">privacy policy</a>.</p>
    </div>
  </form>
</div>"""


# The same marks used on the homepage service cards, keyed by slug so the
# post-submission page cannot drift from them.
SERVICE_ICONS = {
    "web-design": '<rect x="2" y="3" width="20" height="14" rx="1"/><path d="M2 7h20M8 21h8M12 17v4"/>',
    "ai-consulting": '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/><circle cx="12" cy="12" r="4.5"/>',
    "automation": '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.5 6h9M6 8.4l4.6 7.4M18 8.4l-4.6 7.4"/>',
    "marketing": '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21M11 8v6M8 11h6"/>',
    "ad-management": '<path d="M3 11l16-7v16L3 13z"/><path d="M7 12.5V19l4 1.5"/>',
    "social-media-marketing": '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-9A8.4 8.4 0 1 1 21 11.5z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/>',
    "business-systems": '<path d="M3 21h18M5 21V8l7-5 7 5v13"/><path d="M9.5 21v-5h5v5"/><path d="M9.5 11h5"/>',
}


def icon(slug, size=22):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="1.5">{SERVICE_ICONS[slug]}</svg>')


def cta_band(heading, blurb, cta_href="/contact.html", cta="Get my free Growth Plan"):
    return f"""
<section class="section cta-band">
  <div class="wrap center mx-auto" style="max-width:800px">
    <span class="eyebrow" style="justify-content:center">Next step</span>
    <h2 class="h1 balance">{heading}</h2>
    <p class="lede mx-auto">{blurb}</p>
    <div class="btn-row mt-6" style="justify-content:center">
      <a class="btn btn--primary btn--lg" href="{cta_href}">{cta} <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
      <a class="btn btn--ghost btn--lg" href="tel:+14124632126">Call (412) 463-2126</a>
    </div>
    <p class="small muted mt-5">No obligation · No contracts to start · Your data is never resold</p>
  </div>
</section>"""


def ticks(items):
    return '<ul class="tick-list">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


# --------------------------------------------------------------------------
# Service content
# --------------------------------------------------------------------------
SERVICES = [
{
 "slug": "web-design",
 "nav": "Web Design & Development",
 "h1": "Websites that behave like your best salesperson.",
 "title": "Web Design &amp; Development Company | Forward Framework",
 "desc": "Conversion-first web design and development. Launch in 30–45 days with green Core Web Vitals, full schema and AI-search readiness. Starts with a free homepage concept.",
 "eyebrow": "Web design & development",
 "answer": "Conversion-focused web design is the practice of building a website around a single measurable business outcome instead of around aesthetics. It combines clear positioning, one dominant call to action, proof placed above the fold, sub-2.5-second load times and forms engineered to be finished rather than abandoned.",
 "intro": [
   "A beautiful site that does not convert is an expensive brochure. The average website converts under 3% of its visitors, and most of the gap is not design taste — it is a missing offer, a hidden call to action, four seconds of load time and a form that asks for eleven fields before it has earned two.",
   "We start from the money. What is a customer worth, what does a visitor need to believe before they act, and what is the single next step we want them to take? Everything on the page then earns its place against that, or it comes off the page."
 ],
 "offer": {
   "tag": "Highest-converting offer",
   "name": "A free homepage concept — designed, not described",
   "blurb": "Not a PDF checklist. We design a real above-the-fold concept for your homepage using your brand, your offer and your proof, then walk you through the conversion reasoning behind every decision.",
   "bullets": [
     "A designed hero, not a template mockup",
     "Written conversion rationale for each element",
     "A page-speed and Core Web Vitals reading of your current site",
     "Yours to keep and build elsewhere if you'd rather"
   ],
   "form_id": "concept",
   "form_heading": "Get my free homepage concept",
   "form_blurb": "Send us your site. We'll design a conversion-first hero for it and explain exactly why each change would move your numbers.",
   "cta": "Design my homepage concept",
   "trigger": "Delivered in 3–5 business days as a shareable design file plus a short walkthrough video. No call required."
 },
 "includes": [
   ("Positioning and message architecture", "Before layout, we settle what you sell, to whom, and why you instead of the other three quotes they're collecting. Most conversion problems are message problems wearing a design costume."),
   ("Conversion-first design", "One dominant call to action per page, proof above the fold, objection handling adjacent to every ask, and forms engineered for completion — progressive fields, honest labels, visible value."),
   ("Fast, accessible build", "Hand-built front end or a hardened WordPress, Shopify or headless stack. Green Core Web Vitals at handover: LCP under 2.5s, INP under 200ms, CLS under 0.1. WCAG 2.2 AA contrast, focus and keyboard behaviour."),
   ("SEO and AI-search foundation", "Semantic structure, question-shaped headings, JSON-LD entity graph, XML sitemap, llms.txt, and explicit crawler access for GPTBot, ClaudeBot, PerplexityBot and Google-Extended — built in, not bolted on."),
   ("Tracking that survives contact with reality", "GA4, server-side events where they matter, call tracking, form attribution and CRM handoff, so the site reports leads and revenue instead of sessions."),
   ("Handover and ownership", "You get the repository, the accounts, the documentation and a recorded walkthrough. Edit it yourself, hand it to anyone, or keep us on retainer — your call, not a lock-in.")
 ],
 "prices": [
   ("Landing Page", "$749", "one-time, from", "Single high-intent page for one campaign or offer.",
    ["Message and offer workshop", "Design + build + QA", "Analytics and form tracking", "Live in 10–14 days"], False),
   ("Conversion Site", "$1,499", "one-time, from", "The core build for most companies. 5–12 pages.",
    ["Full positioning and design system", "Core Web Vitals green at launch", "Complete SEO + AI-search layer", "Live in 30–45 days"], True),
   ("Platform Build", "$1,999", "project, from", "Ecommerce, multi-location or integration-heavy builds.",
    ["Shopify, headless or custom app", "CRM, ERP and payment integration", "Programmatic location or service pages", "Phased launch with staging"], False)
 ],
 "metrics": [("30–45", "Days to launch"), ("&lt;2.5s", "LCP at handover"), ("100%", "Ownership, day one")],
 "faqs": [
   ("How is a website project priced?",
    "As a fixed price for a fixed scope, quoted in writing after your free homepage concept — never an hourly rate and never a moving target. What moves the number is page count, how many systems need integrating, and how much content has to be created rather than migrated. If we underestimate, that is our problem rather than a change order."),
   ("How long does a website take to build?",
    "A landing page ships in 10–14 days. A full conversion site launches in 30–45 days from kickoff. Platform builds run 8–14 weeks. The pace depends far more on how quickly we get content, approvals and access than on production time."),
   ("Do you build on WordPress, Shopify or custom code?",
    "Whichever loses you the least money over five years. Content-led sites usually run on a hardened WordPress or a static build; stores run on Shopify; complex products get a custom front end. We tell you the trade-off in writing before we start, and you own the result either way."),
   ("Will the new site keep my existing SEO rankings?",
    "Yes, when the migration is done properly. Every launch includes a crawl of the old site, a mapped 301 redirect table, preserved URL structures where they earn traffic, and post-launch monitoring for 30 days. Rankings usually recover within two to four weeks and typically improve, because speed and structure improve."),
   ("What makes a website convert better?",
    "In order of impact: a clear specific offer, one dominant call to action, proof placed before the ask, fast load time, objection handling next to the form, and a form short enough to finish on a phone. Design taste matters, but it is downstream of all six.")
 ]
},
{
 "slug": "ai-consulting",
 "nav": "AI Consulting",
 "h1": "Find the profit in AI before you spend a dollar building it.",
 "title": "AI Consulting for Growing Companies | Forward Framework",
 "desc": "AI consulting that starts with a free AI Opportunity Audit: ranked use cases with dollar estimates, buy-vs-build calls and a build order, at no cost.",
 "eyebrow": "AI consulting",
 "answer": "AI consulting is the work of identifying where artificial intelligence will actually make or save money in a specific business, then sequencing those opportunities by value, effort and risk. A good engagement produces a ranked use-case roadmap with dollar estimates and clear buy-versus-build decisions — not a technology demonstration.",
 "intro": [
   "Almost every company we meet has already bought AI. A licence here, a pilot there, a chatbot somebody's nephew set up. Very few can point at a line on the P&amp;L and say that spend produced it.",
   "The failure is rarely the model. It is the absence of an operating decision: which processes are worth automating, what data they need, who owns the output when it is wrong, and what the thing is worth if it works. We answer those four questions before anyone writes a prompt."
 ],
 "offer": {
   "tag": "Highest-converting offer",
   "name": "A free AI Opportunity Audit",
   "blurb": "We interview your operators, map where judgement and data actually move through your business, and hand back a ranked list of AI use cases with a dollar estimate and a risk note attached to each one.",
   "bullets": [
     "Ranked use cases with value, effort and risk scored",
     "Buy-vs-build called explicitly on each one",
     "Data readiness, privacy and vendor-lock review",
     "A 90-day build order you can hand to anyone"
   ],
   "form_id": "ai-audit",
   "form_heading": "Request my AI Opportunity Audit",
   "form_blurb": "Tell us what your team spends its week on. We'll show you where AI pays and — just as usefully — where it doesn't.",
   "cta": "Request my AI audit",
   "trigger": "Two 45-minute operator interviews, then a written roadmap in 7–10 days. Free, and yours whether or not we build any of it."
 },
 "includes": [
   ("Opportunity mapping", "We shadow the real workflow, not the org chart. Quoting, intake, scheduling, support, reporting, content — wherever a human is transforming information rather than exercising judgement, there is a candidate."),
   ("Value and risk scoring", "Each use case gets an annual value estimate, a build cost range, a confidence rating and a failure-mode note. You approve a roadmap in dollars, not adjectives."),
   ("Buy, build or leave alone", "Half of what companies want to build already exists in a tool they own. We say so. The remaining half is where custom work earns its price."),
   ("Data and governance readiness", "What data exists, where it's trapped, what is safe to send to a third-party model, and what policy your team needs before anyone pastes a customer record into a chat window."),
   ("Implementation, when you want it", "We build what we recommend — retrieval systems, agents, internal copilots, document processing, AI-assisted sales and support — or we brief your team and step back."),
   ("Enablement, so it survives us", "Prompt libraries, standard operating procedures, evaluation checks and a named internal owner. AI that only one person can run is a liability with a subscription.")
 ],
 "prices": [
   ("Opportunity Audit", "$0", "free, no obligation", "The gateway. Ranked opportunities with dollars attached.",
    ["Two operator interviews", "Ranked use-case roadmap", "Buy-vs-build recommendations", "90-day build order"], False),
   ("AI Readiness Sprint", "$1,999", "two weeks, fixed", "Go deep on the top opportunities and prove one works.",
    ["Full data and governance review", "One working proof of concept", "Cost model and ROI forecast", "Board-ready written findings"], True),
   ("Build & Embed", "$3,499", "project, from", "We build the systems and hand them over documented.",
    ["Custom agents, RAG or copilots", "Integrated into your real stack", "Evaluation and monitoring built in", "Team training and SOPs"], False)
 ],
 "metrics": [("7–10", "Days to roadmap"), ("$0", "To find out if it's worth it"), ("100%", "Vendor-neutral advice")],
 "faqs": [
   ("How is AI consulting priced?",
    "The AI Opportunity Audit is free. The Readiness Sprint that follows is a fixed fee for a fixed two weeks, and any implementation is quoted as a fixed price once the audit has established what is actually worth building. You approve a number before work starts, and the audit itself costs nothing whether or not you go further."),
   ("How do you decide which AI use cases are worth building?",
    "Each candidate is scored on three axes: annual value if it works, build and maintenance cost, and risk when it fails. High-value, low-risk, repetitive information work wins nearly every time — quoting, intake, document processing, support deflection and reporting. Anything requiring flawless judgement on rare edge cases usually loses."),
   ("Is our data safe if we use AI tools?",
    "It depends entirely on which tools and which settings, which is why governance is part of every audit. We map what data exists, classify what may leave your perimeter, recommend deployment patterns that keep sensitive records inside it, and write the internal policy your team needs before anyone pastes a customer record into a chat window."),
   ("Do we need AI at all, or is this hype?",
    "Some businesses genuinely do not need it yet, and we will tell you that for free. The honest test is whether people in your company spend significant hours transforming information rather than exercising judgement. If they do, there is money on the table. If they don't, buy nothing and spend the budget on demand instead."),
   ("Can you build it, or do you only advise?",
    "Both. Roughly half our AI clients take the roadmap and build internally — we'd rather you own it. The other half hire us to build, integrate, evaluate and train. The audit is deliberately identical either way, because advice you can only act on by hiring us is not advice.")
 ]
},
{
 "slug": "automation",
 "nav": "Automation",
 "h1": "Delete the manual work between your tools.",
 "title": "Business Process Automation Agency | Forward Framework",
 "desc": "Automation that removes the manual work between your tools, leads and staff. Free automation blueprint, first workflow live in under two weeks.",
 "eyebrow": "Automation",
 "answer": "Business process automation replaces the manual steps people take to move information between systems — copying leads into a CRM, chasing quotes, assembling reports, onboarding a customer. Done properly it removes roughly 65% of the identified manual hours and cuts response times from hours to seconds.",
 "intro": [
   "Automation is the least glamorous service we sell and the one that pays for everything else. It rarely shows up in a pitch deck because its output is an absence: the report nobody had to build, the lead nobody had to re-type, the follow-up that happened at 9pm on a Saturday without anyone noticing.",
   "The money is hiding in the seams between tools. A lead lands in one system, gets copied into a second, triggers an email from a third, and someone updates a spreadsheet so a fourth can produce a number that is wrong by Friday. We map those seams and close them."
 ],
 "offer": {
   "tag": "Highest-converting offer",
   "name": "A free automation blueprint",
   "blurb": "A 60-minute working session on your real processes, followed by a written blueprint: what to automate first, the hours and dollars it returns, what it costs to build, and what we'd honestly leave alone.",
   "bullets": [
     "Process map of where hours actually leak",
     "Hours-returned and dollar estimate per workflow",
     "Fixed build price on the top three",
     "An honest list of what is not worth automating"
   ],
   "form_id": "blueprint",
   "form_heading": "Book my free automation audit",
   "form_blurb": "One hour on your actual processes. You leave with a blueprint and a number, whether or not you hire us to build it.",
   "cta": "Get my automation blueprint",
   "trigger": "60-minute session, written blueprint within 5 business days, fixed prices attached. No obligation."
 },
 "includes": [
   ("Speed-to-lead automation", "Every inbound lead routed, enriched, assigned and answered in under 60 seconds — SMS, email and a live phone alert to whoever is actually available, not whoever is on a rota."),
   ("Sales and quoting workflows", "Quote assembly, proposal generation, e-signature, deposit collection and CRM stage updates that happen because the work happened, not because someone remembered."),
   ("Client onboarding", "Contract to kickoff without a single copy-paste: folders, accounts, tasks, welcome sequences, internal notifications and the first invoice, all fired by one trigger."),
   ("Reporting and reconciliation", "The weekly report that assembles itself. Data pulled from ad platforms, CRM, phones and accounting into one dashboard, reconciled and delivered before your Monday meeting."),
   ("AI agents where they earn it", "Inbox triage, document extraction, call summarisation, first-line support and content drafting — reviewed by a human where accuracy is worth more than speed."),
   ("Built to be owned", "n8n, Make or Zapier chosen on merit, documented in plain language, tested, monitored with failure alerts, and handed over. No black boxes, no hostage workflows.")
 ],
 "prices": [
   ("Single Workflow", "$749", "one-time, from", "One painful process, removed. A good first proof.",
    ["Scoped, built and tested in 7–10 days", "Documentation and handover", "30 days of monitoring", "Fixed price, no surprises"], False),
   ("Automation Mission", "$2,499", "project, from", "3–5 workflows audited, designed, built, deployed.",
    ["Full process audit and blueprint", "3–5 production workflows", "AI agents where they pay off", "Team training and runbooks"], True),
   ("Ops Retainer", "$499", "/month, from", "We run, monitor and keep extending the system.",
    ["Ongoing build and optimisation", "Monitoring and failure response", "Monthly hours-saved reporting", "Month to month after 90 days"], False)
 ],
 "metrics": [("&lt;60s", "Speed to lead"), ("~65%", "Of manual hours removed"), ("14", "Days to first workflow live")],
 "faqs": [
   ("How is automation work priced?",
    "Single workflows are a fixed one-time fee. A full Automation Mission covering three to five workflows is quoted as a fixed project price that depends mainly on how many systems must be connected and how clean the data is. Ongoing operations run as a monthly retainer. Your free blueprint puts a number against each workflow before you commit to any of them."),
   ("Which automation platform do you use — Zapier, Make or n8n?",
    "Whichever fits the job and your budget. Zapier is fastest to stand up and most expensive at volume. Make is cheaper for high-volume branching logic. n8n is the most flexible and can be self-hosted for data-sensitive work. We recommend on merit and you own the account regardless."),
   ("Will automation replace my staff?",
    "In our experience it moves them. The hours we return are almost always spent on work that was being neglected — following up leads, quoting faster, actually serving customers. Companies that automate to cut headcount usually find the savings are smaller and the damage larger than they expected."),
   ("How long before an automation is live?",
    "A single well-scoped workflow is in production within seven to ten days. A full mission of three to five workflows takes four to eight weeks depending on how many systems must be connected and how clean the data is when we arrive."),
   ("What happens if an automation breaks?",
    "Every workflow ships with error handling, retry logic and failure alerts to a channel a human watches. On a retainer we respond and repair. Off retainer, everything is documented in plain language so your team or any other developer can fix it without reverse-engineering our thinking.")
 ]
},
{
 "slug": "marketing",
 "nav": "Marketing, SEO & AI Search",
 "h1": "Rank in Google. Get cited by the AI.",
 "title": "SEO, GEO &amp; AI Search Marketing Agency | Forward Framework",
 "desc": "SEO plus Generative Engine Optimization: get found in Google and cited by ChatGPT, Perplexity, Gemini and AI Overviews. Free AI Search Visibility Report.",
 "eyebrow": "Marketing, SEO & AI search",
 "answer": "Modern search marketing has two jobs: earn the classic organic ranking, and earn the citation inside AI-generated answers. The second — Generative Engine Optimization — rewards direct answers in the first 40 to 60 words, structured data, entity clarity, crawler access and freshness rather than keyword density.",
 "intro": [
   "A first-place ranking is worth less every quarter if the AI answer above it recommends three competitors and never mentions you. That is the shift, and it is not coming — it has happened. Buyers now open an assistant, describe their problem in a sentence, and treat the answer as a shortlist.",
   "We optimise for both surfaces at once, because the underlying work overlaps more than the acronyms suggest. Clear entities, genuinely useful answers, fast crawlable pages and credible third-party mentions win in Google and in the models that were trained on it."
 ],
 "offer": {
   "tag": "Highest-converting offer",
   "name": "A free AI Search Visibility Report",
   "blurb": "We run twelve real buying prompts from your category through four AI assistants and send you the transcripts: who gets named, what they get named for, and the structural reasons you are missing from the answer.",
   "bullets": [
     "12 category prompts across four AI assistants",
     "Competitor citation share, side by side",
     "The technical and content gaps causing it",
     "A fix list ranked by effort against impact"
   ],
   "form_id": "visibility",
   "form_heading": "Get my AI Search Visibility Report",
   "form_blurb": "Find out what ChatGPT, Perplexity, Gemini and Google AI Overviews say when your buyers describe their problem.",
   "cta": "Send my visibility report",
   "trigger": "Delivered as a PDF with full transcripts within 5 business days. Free, and genuinely useful even if you never reply."
 },
 "includes": [
   ("Technical SEO and Core Web Vitals", "Crawl, index and render health; LCP under 2.5s, INP under 200ms, CLS under 0.1. AI crawlers time out in one to five seconds — a slow site is invisible to them regardless of how good the content is."),
   ("Generative Engine Optimization", "Question-shaped headings, a direct 40–60 word answer opening every key section, listicle and comparison formats models prefer to quote, plus an llms.txt index and explicit access for GPTBot, ClaudeBot, PerplexityBot and Google-Extended."),
   ("Structured data and entity building", "A full JSON-LD graph — Organization, Service, FAQPage, Article, Breadcrumb — with sameAs links that connect your brand to the entities models already trust. Sites with schema are cited materially more often than sites without."),
   ("Content built as answers", "We publish what your buyers actually ask, in the shape an answer engine can lift: the conclusion first, the evidence under it, the nuance below that. Then we keep it fresh, because stale pages fall out of AI indexes fast."),
   ("Digital PR and citation building", "Models cite what other credible sources cite. We earn mentions in the publications, directories and comparison pages that feed the training and retrieval layers."),
   ("Measurement that includes AI", "Monthly tracking of which prompts cite you, which cite competitors, and how that maps to non-brand organic traffic and pipeline — alongside conventional rankings and conversions.")
 ],
 "prices": [
   ("Foundation", "$499", "/month, from", "Technical, structural and AI-search fundamentals.",
    ["Technical SEO and Core Web Vitals", "Full schema and llms.txt build", "2 answer-shaped pages per month", "Monthly AI citation tracking"], False),
   ("Growth", "$2,499", "/month, from", "Foundation plus a real content and authority engine.",
    ["Everything in Foundation", "6 content assets per month", "Digital PR and citation building", "CRO testing on money pages"], True),
   ("Market Leader", "$4,999", "/month, from", "Multi-location, multi-service or national ambition.",
    ["Everything in Growth", "Programmatic location/service pages", "Competitive displacement campaigns", "Executive reporting and forecasting"], False)
 ],
 "metrics": [("4", "AI assistants tracked monthly"), ("12", "Buying prompts in your free report"), ("90", "Days to first citation movement")],
 "faqs": [
   ("What is GEO and how is it different from SEO?",
    "SEO earns a position in a list of links. GEO — Generative Engine Optimization — earns a citation inside an AI-generated answer. GEO rewards direct answers, structured data, entity clarity and crawler access, while SEO also rewards links and traditional relevance signals. They overlap heavily, which is why we run them as one programme."),
   ("How do I get my business cited by ChatGPT and AI Overviews?",
    "Open every key section with a direct 40 to 60 word answer, shape headings as the questions people actually ask, publish comparison and listicle formats models like to quote, implement a full JSON-LD entity graph, allow the AI crawlers explicitly, keep pages fresh on a one to two week cadence, and earn mentions on sources those models already trust."),
   ("How long does SEO and AI search work take?",
    "Technical and structural fixes can move AI citations within four to eight weeks because models re-crawl frequently. Traditional organic ranking gains typically appear at three months and compound through six to twelve. Anyone promising page-one results in thirty days is selling you branded search you already owned."),
   ("Does llms.txt actually do anything?",
    "It is not a ranking factor and nobody should claim otherwise. It is a cheap, standards-based index that points AI crawlers at clean summaries of your important pages, and it costs an hour to implement. We ship it as part of the technical layer alongside the things that carry real weight: schema, speed, structure and citations."),
   ("Can you work alongside our in-house marketing team?",
    "Frequently. Many clients keep content and brand in-house and hire us for the technical layer, the entity work and the AI-search programme their team has no time to learn. We work in your tools, document everything, and train rather than gatekeep.")
 ]
},
{
 "slug": "ad-management",
 "nav": "Ad Management",
 "h1": "Ads managed to profit, not to impressions.",
 "title": "PPC &amp; Ad Management Agency | Google, Meta, LinkedIn | Forward Framework",
 "desc": "Google, Meta, LinkedIn and Microsoft ads managed to closed revenue. Free ad account audit — most accounts hide 20–40% wasted spend. Month to month, no long-term contract.",
 "eyebrow": "Ad management",
 "answer": "Effective ad management optimises toward closed revenue rather than clicks or form fills. That requires conversion tracking wired back to your CRM, offline conversion imports so the platforms learn which leads actually became customers, and a willingness to turn off spend that looks good in the dashboard.",
 "intro": [
   "Most accounts we open are optimising toward the wrong thing. The platform is dutifully buying the cheapest form fills it can find, the agency is reporting a falling cost per lead, and the sales team is quietly drowning in people who were never going to buy.",
   "Fix the signal and the same budget behaves differently. When Google and Meta learn which leads closed and what they were worth, their bidding gets sharply better at finding more of those — and materially worse at finding the cheap ones nobody wanted."
 ],
 "offer": {
   "tag": "Highest-converting offer",
   "name": "A free ad account audit",
   "blurb": "Read-only access, one week, and a written teardown of where your spend is going. In most accounts we open, 20–40% of budget is going somewhere it shouldn't — we show you exactly where before you hire anyone.",
   "bullets": [
     "Wasted-spend analysis with dollar figures",
     "Conversion tracking and attribution health check",
     "Competitor auction and creative review",
     "A prioritised fix list you can hand to your current agency"
   ],
   "form_id": "audit",
   "form_heading": "Request my free ad account audit",
   "form_blurb": "Grant read-only access and we'll show you where the money is leaking — in writing, in five business days.",
   "cta": "Audit my ad account",
   "trigger": "Read-only access only. Written teardown in 5 business days. Keep it and hand it to your current agency if you like."
 },
 "includes": [
   ("Google Ads and Microsoft Ads", "Search, Performance Max, Shopping, Demand Gen and YouTube — structured so you can see what each is doing rather than one blended number that explains nothing."),
   ("Meta and LinkedIn", "Prospecting and retargeting built around creative volume, because on social the creative is the targeting. LinkedIn where the deal size justifies the CPM, and not otherwise."),
   ("Conversion tracking that reflects revenue", "Server-side events, call tracking, form attribution and offline conversion imports from your CRM, so the platforms optimise toward closed deals instead of cheap enquiries."),
   ("Landing pages included", "Ads are only half the transaction. We build and test the pages the traffic lands on, because sending better traffic to a worse page is an expensive way to be right."),
   ("Creative and testing cadence", "A standing rotation of new angles, hooks and formats. Ad fatigue is the most common cause of a quietly declining account and the easiest to prevent."),
   ("Reporting you can act on", "One dashboard showing spend, leads, qualified leads, closed revenue and blended CAC. Monthly commentary in English. You keep every account, permanently.")
 ],
 "prices": [
   ("Managed Growth", "$749", "/month, from", "For accounts under $20K monthly spend.",
    ["Up to two platforms", "Tracking and attribution build", "Landing page testing", "Month to month after 90 days"], True),
   ("Multi-Channel", "12%", "of ad spend", "For accounts spending $20K–$150K per month.",
    ["All major platforms", "Offline conversion imports", "Dedicated creative cadence", "Weekly optimisation and reporting"], False),
   ("Enterprise", "Custom", "let's talk", "Multi-location, multi-brand or over $150K/month.",
    ["Account architecture and governance", "Incrementality and geo testing", "Feed and inventory management", "Executive-level forecasting"], False)
 ],
 "metrics": [("20–40%", "Typical wasted spend found"), ("0", "Long-term contracts"), ("100%", "You own the accounts")],
 "faqs": [
   ("How is ad management priced?",
    "A flat monthly management fee on smaller accounts, and a percentage of spend once an account is large enough that the flat fee stops making sense. Media budget is always paid by you directly to the platform — we never mark it up or take a rebate. There is no long-term contract after an initial 90-day runway, and you own every ad account, pixel and piece of data throughout."),
   ("What does a free ad account audit include?",
    "A written teardown covering wasted spend with dollar figures attached, conversion tracking and attribution health, account structure, keyword and audience quality, creative performance, competitor auction overlap, and a prioritised fix list. You keep the document and are welcome to hand it to your current agency."),
   ("How much ad spend do I need to make this worthwhile?",
    "Below roughly $3,000 per month in media, management fees eat too much of the budget to be sensible — we'll usually tell you to spend it on your website or your SEO first. Between $5,000 and $150,000 per month is where structured management makes the clearest difference."),
   ("Why is my cost per lead falling but revenue flat?",
    "Almost always because the platform is optimising toward the cheapest form fill it can find, and nobody has told it which leads closed. Importing offline conversions from your CRM changes the objective from volume of enquiries to value of customers, and the account's behaviour changes within a few weeks."),
   ("Do I have to sign a long-term contract?",
    "No. We ask for 90 days because that is the honest minimum for tracking to be rebuilt, learning phases to complete and results to be attributable. After that it is month to month, and everything is in your name so leaving takes an afternoon.")
 ]
},
{
 "slug": "social-media-marketing",
 "nav": "Social Media Marketing",
 "h1": "Social that builds demand instead of chasing the algorithm.",
 "title": "Social Media Marketing Agency | Forward Framework",
 "desc": "Social media marketing tied to pipeline, not likes. Free 30-day content plan with ten scripted posts. Month to month, no long-term contract.",
 "eyebrow": "Social media marketing",
 "answer": "Effective social media marketing for a business is a demand-building programme, not a posting schedule. It produces a consistent point of view, short-form video and proof content that reaches buyers before they are searching, and it is measured against pipeline influence rather than follower count.",
 "intro": [
   "Social is the line item most likely to be cut first and least likely to be measured properly. That is usually deserved — a feed of stock photos and holiday greetings is not marketing, and everyone in the building knows it.",
   "Done well it does something no other channel does: it reaches people before they know they have a problem, and it makes your company familiar by the time they do. Familiarity is what makes every other channel cheaper."
 ],
 "offer": {
   "tag": "Highest-converting offer",
   "name": "A free 30-day content plan",
   "blurb": "Ten scripted posts written for your business — hooks, copy, format and the reasoning behind each angle — plus a calendar showing what to post, where, and in what order. Written by a strategist, not a template.",
   "bullets": [
     "10 fully scripted posts, ready to publish",
     "Hooks and formats matched to each platform",
     "A 30-day calendar with posting rationale",
     "Yours to run yourself, entirely free"
   ],
   "form_id": "content-plan",
   "form_heading": "Get my free 30-day content plan",
   "form_blurb": "Tell us who you sell to. We'll write ten posts you can publish this month, whether or not you ever hire us.",
   "cta": "Send my content plan",
   "trigger": "Ten scripted posts and a calendar within 5 business days. Free, and yours to publish immediately."
 },
 "includes": [
   ("Strategy and point of view", "What you stand for, who you're speaking to, and the handful of ideas you will repeat until the market associates them with you. Without this, posting is just noise with a logo."),
   ("Short-form video production", "One filming day a month produces a month of vertical video for TikTok, Reels, Shorts and LinkedIn. Scripted, shot, edited, captioned and scheduled."),
   ("Always-on content calendar", "Planned, produced and published across the two or three platforms your buyers actually use — not all seven because a competitor is on them."),
   ("Community and response", "Comments, DMs and reviews answered in your voice within hours, because an unanswered question in public is a lost sale in public."),
   ("Paid amplification", "The organic posts that earn attention get budget behind them. Cheapest reach you will ever buy, because the creative has already proven itself."),
   ("Reporting against pipeline", "Reach and engagement are inputs. We report on profile visits, link clicks, direct enquiries and influenced pipeline, tracked through the same attribution as every other channel.")
 ],
 "prices": [
   ("Presence", "$499", "/month, from", "Consistent, credible, two platforms.",
    ["12 posts per month", "Community management", "Monthly reporting", "Month to month after 90 days"], False),
   ("Demand Engine", "$1,749", "/month, from", "Video-led, built to be seen and remembered.",
    ["Monthly filming day, 16+ assets", "20 posts across three platforms", "Paid amplification management", "Pipeline-influence reporting"], True),
   ("Full Funnel", "$2,999", "/month, from", "Organic, paid social and creator partnerships together.",
    ["Everything in Demand Engine", "Creator and partnership programme", "Dedicated creative strategist", "Quarterly brand campaign"], False)
 ],
 "metrics": [("10", "Free scripted posts"), ("1", "Filming day per month"), ("0", "Vanity metrics in reporting")],
 "faqs": [
   ("How is social media work priced?",
    "As a monthly retainer sized to how much is being produced: consistent publishing on two platforms sits at one level, a video-led programme with a monthly filming day at another, and full-funnel work combining organic, paid social and creator partnerships higher again. All are month to month after an initial 90-day runway."),
   ("Which social platforms should my business be on?",
    "Two or three, chosen by where your buyers already spend attention and what your team can sustain. For most B2B that is LinkedIn plus YouTube or Instagram. For home services and local businesses it is usually Facebook and Instagram with short-form video. Being mediocre on six platforms beats nobody."),
   ("Does organic social actually generate leads?",
    "Rarely as a last click, and that is why it gets cut. Its real job is influence: buyers who have seen you convert at higher rates from every other channel and cost less to acquire. We track profile visits, direct enquiries and influenced pipeline so the contribution is visible rather than assumed."),
   ("Do we have to appear on camera?",
    "It helps enormously, and it is not mandatory. Faces outperform logos on every short-form platform, but we produce plenty of high-performing work using customer footage, jobsite and product B-roll, screen recordings, and motion-designed text formats."),
   ("How quickly does social media marketing work?",
    "Consistency shows in engagement within four to six weeks. Meaningful influence on pipeline typically takes three to six months, because you are building familiarity rather than harvesting demand. It is a compounding channel, which is exactly why stopping and restarting it is so expensive.")
 ]
},
{
 "slug": "business-systems",
 "nav": "Scaffold — Business Systems",
 "h1": "The company should run the same whether or not you're in the room.",
 "title": "Business Systems, SOPs, Training &amp; Hiring | Scaffold | Forward Framework",
 "desc": "Scaffold builds the structure under your business: org design, SOPs, sales playbooks, training manuals and hiring systems. Starts with a free Key-Person Risk Map.",
 "eyebrow": "Scaffold — business systems",
 "answer": "Business systemisation turns how a company operates into documented, repeatable structure — org design, standard operating procedures, sales playbooks, training manuals and hiring processes. It replaces knowledge living in a few people's heads with systems any new hire can follow, which is what makes a business scalable, sellable and survivable.",
 "intro": [
   "Most owner-led companies are held together by three people who simply remember how everything works. It functions right up until one of them takes a holiday, quits or gets promoted — and then the same fire gets fought from scratch, badly, by someone guessing.",
   "It is also the reason marketing and automation stall. You cannot automate a process nobody has written down, AI cannot follow a standard that does not exist, and you cannot scale a sales team that has no playbook. Scaffold is the layer everything else stands on."
 ],
 "offer": {
   "tag": "Highest-converting offer",
   "name": "A free Key-Person Risk Map",
   "blurb": "We interview your team and map every process that currently exists only in someone's head — then rank them by what it would cost you the week that person is unavailable. Most owners have never seen this written down.",
   "bullets": [
     "Every undocumented process, named and owned",
     "Ranked by revenue at risk, not by tidiness",
     "The three to document first, and why",
     "Yours to act on with or without us"
   ],
   "form_id": "risk-map",
   "form_heading": "Get my free Key-Person Risk Map",
   "form_blurb": "Tell us how your team is structured. We'll show you exactly where the business depends on individuals instead of systems.",
   "cta": "Map my key-person risk",
   "trigger": "Two short interviews, then a written map within 7 business days. Free, and useful whether or not you hire us."
 },
 "includes": [
   ("Business structure and org design", "Who owns which outcome, not who sits where. We define roles by the results they are accountable for, then show you which seats are empty, doubled up, or being quietly carried by one exhausted person."),
   ("SOP build-out", "Your real processes documented the way people actually work — short, visual, and written for the person doing the job at 7am, not for a binder nobody opens."),
   ("Sales guides and playbooks", "Discovery questions, objection handling, pricing conversations, follow-up cadence and proposal templates, built from what your best closer already does instinctively but has never written down."),
   ("Training manuals and onboarding", "A new hire productive in weeks instead of quarters. Role-based onboarding paths, checkpoints and competency checks, so \"they\'ll pick it up\" stops being the plan."),
   ("Hiring systems", "Scorecards, structured interview guides, work-sample tests and a repeatable process — so hiring stops being a gut call made under pressure at the worst possible moment."),
   ("Operating cadence", "The meeting rhythm, scorecard and handful of numbers that keep it running: a weekly that ends in decisions, and a quarterly that resets priorities before they drift.")
 ],
 "prices": [
   ("Scaffold Sprint", "$999", "project, from", "Document the five processes that break most often.",
    ["Key-person risk map included", "5 core SOPs written and shipped", "Delivered in your tools, not ours", "Live in 3–4 weeks"], False),
   ("Operating System", "$2,999", "project, from", "The full build: structure, SOPs, sales and hiring.",
    ["Org and accountability design", "Full SOP library and training paths", "Sales playbook and hiring scorecards", "Team rollout and adoption support"], True),
   ("Embedded Ops", "$999", "/month, from", "We keep the system current as the company grows.",
    ["Ongoing documentation and revisions", "New-role onboarding builds", "Quarterly operating reviews", "Month to month after 90 days"], False)
 ],
 "metrics": [("7", "Days to your risk map"), ("$0", "To find where you're exposed"), ("100%", "Documented and owned by you")],
 "faqs": [
   ("How is this work priced?",
    "As a fixed project fee, sized by how many processes and roles need documenting. A short sprint covering your most fragile processes is one level; a full Operating System build — structure, SOP library, sales playbook, training paths and hiring scorecards — is another. Ongoing support to keep it current runs monthly. Every number is fixed in writing after your free risk map."),
   ("What is an SOP and why does my business need one?",
    "A standard operating procedure is a short, specific document describing how one task gets done correctly every time. Businesses need them because undocumented process is a single point of failure: when the person who knows how it works is unavailable, quality drops, training takes months, and nothing can be safely automated or delegated."),
   ("How long does it take to build a company operating system?",
    "A Scaffold Sprint ships in three to four weeks. A full Operating System build runs six to ten weeks depending on headcount and how many roles need documenting. The pace depends far more on your team's availability for interviews than on our writing speed."),
   ("Will my team actually use the documentation?",
    "Only if it is built with them rather than at them. We write from recorded interviews with the people doing the work, keep each procedure short enough to read on a phone, store it where they already work, and roll it out alongside an operating cadence that references it weekly. Documentation nobody opens is a cost, not an asset."),
   ("How does this connect to your other services?",
    "It is the layer underneath them. You cannot automate a process nobody has written down, and AI cannot follow a standard that does not exist. Clients who systemise first get materially more out of automation, hiring and paid acquisition, because there is a defined process for the new leads and new people to land in.")
 ]
}
]


# --------------------------------------------------------------------------
# Service page renderer
# --------------------------------------------------------------------------
def price_card(name, amount, unit, note, features, featured):
    flag = '<span class="price-flag">Most requested</span>' if featured else ""
    cls = "price-card is-featured" if featured else "price-card"
    return f"""<div class="{cls}">{flag}
      <h3 class="h3">{name}</h3>
      <div class="price-amount"><b>{amount}</b><span>{unit}</span></div>
      <p class="price-note">{note}</p>
      {ticks(features)}
      <div class="card-foot"><a class="btn btn--ghost btn--block" href="/contact.html">Discuss this</a></div>
    </div>"""


def render_service(s):
    path = f"services/{s['slug']}.html"
    url = f"{SITE}/{path}"
    trail = [("Home", "/"), ("Services", "/services/"), (s["nav"], None)]

    includes_html = "".join(
        f'<div class="card reveal"><span class="card-num">{i+1:02d}</span>'
        f'<h3 class="h4">{t}</h3><p>{b}</p></div>'
        for i, (t, b) in enumerate(s["includes"])
    )
    prices_html = "".join(price_card(*p) for p in s["prices"])
    pricing_section = f"""
<section class="section section--bone" id="pricing">
  <div class="wrap">
    <div class="center mx-auto mb-7" style="max-width:720px">
      <span class="eyebrow">Transparent pricing</span>
      <h2 class="h2 balance">What it costs, before you call.</h2>
      <p class="lede mx-auto">Published starting prices. Final scope is fixed in writing after your free deliverable — never a moving target.</p>
    </div>
    <div class="price-grid">{prices_html}</div>
  </div>
</section>""" if SHOW_PRICING else """
<section class="section section--bone" id="scope">
  <div class="wrap">
    <div class="center mx-auto" style="max-width:720px">
      <span class="eyebrow">How it is scoped</span>
      <h2 class="h2 balance">A fixed number, before any work begins.</h2>
      <p class="lede mx-auto">Every engagement is quoted as a fixed price after your free deliverable, so you approve a number rather than an hourly rate. Retainers run a 90-day runway, then month to month. You own the accounts, the code and the documentation throughout.</p>
    </div>
  </div>
</section>"""
    metrics_html = "".join(
        f'<div class="stat"><b>{v}</b><span>{l}</span></div>' for v, l in s["metrics"]
    )
    offer = s["offer"]

    body = f"""
{crumbs(trail)}

<section class="hero" style="padding-block:clamp(2.5rem,5vw,4.5rem) clamp(3rem,6vw,5rem)">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">{s['eyebrow']}</span>
      <h1 class="balance">{s['h1']}</h1>
      <div class="answer">
        <span class="eyebrow">Quick answer</span>
        <p>{s['answer']}</p>
      </div>
      {''.join(f'<p>{p}</p>' for p in s['intro'])}
      <div class="btn-row mt-6">
        <a class="btn btn--primary btn--lg" href="#{offer['form_id']}">{offer['cta']} <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
        <a class="btn btn--ghost btn--lg" href="#included">What's included</a>
      </div>
      <div class="hero-proof">
        {''.join(f'<div class="proof-item"><b>{v}</b><span>{l}</span></div>' for v, l in s['metrics'])}
      </div>
    </div>
    <div>{lead_form(offer['form_id'], offer['form_heading'], offer['form_blurb'], offer['cta'], offer['trigger'], s['slug'])}</div>
  </div>
</section>

<section class="section section--alt section--line" id="offer">
  <div class="wrap split">
    <div>
      <span class="offer-tag">{offer['tag']}</span>
      <h2 class="h2 balance">{offer['name']}</h2>
      <p class="lede">{offer['blurb']}</p>
      {ticks(offer['bullets'])}
      <div class="btn-row mt-6">
        <a class="btn btn--primary" href="#{offer['form_id']}">{offer['cta']} <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
    <div class="panel">
      <h3 class="h4">Why we lead with a deliverable</h3>
      <p class="small">Interactive and personalised offers convert materially better than a gated PDF or a "book a call" button, and the people who request them are far more likely to become customers. So we give away the first genuinely useful piece of work, and let it argue for us.</p>
      <p class="small mb-0">If the deliverable is good, you will know inside ten minutes whether we are worth a conversation. If it isn't, you have lost nothing and gained a document you can act on yourself.</p>
      <div class="card-foot">
        <a class="link-arrow" href="/contact.html">Start with the free deliverable <span aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section" id="included">
  <div class="wrap">
    <div class="center mx-auto mb-7" style="max-width:720px">
      <span class="eyebrow">What's included</span>
      <h2 class="h2 balance">Everything in the engagement.</h2>
    </div>
    <div class="grid grid-3">{includes_html}</div>
  </div>
</section>

<section class="section section--tight section--alt section--line" aria-label="Key numbers">
  <div class="wrap"><div class="stat-band">{metrics_html}</div></div>
</section>

{pricing_section}

<section class="section" id="faq">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Questions</span>
      <h2 class="h2 balance">{s['nav']}, answered.</h2>
      <p class="lede">Anything missing? Email <a class="accent" href="mailto:hello@forward-framework.com">hello@forward-framework.com</a> and a strategist replies — not a chatbot.</p>
      <div class="btn-row mt-6"><a class="btn btn--primary" href="#{offer['form_id']}">{offer['cta']}</a></div>
    </div>
    {faq_block(s['faqs'])}
  </div>
</section>

{cta_band("Start with the free deliverable.",
          "No call required, no obligation, and genuinely useful whether or not we ever work together.",
          "#" + offer['form_id'], offer['cta'])}
"""

    schema = {"@context": "https://schema.org", "@graph": [
        crumb_schema(trail),
        {
            "@type": "Service",
            "@id": f"{url}#service",
            "name": strip_tags(s["nav"]),
            "serviceType": strip_tags(s["nav"]),
            "url": url,
            "description": strip_tags(s["answer"]),
            "provider": {"@id": f"{SITE}/#organization"},
            "areaServed": {"@type": "Country", "name": "United States"},
            "audience": {"@type": "BusinessAudience", "name": "Small and mid-market companies in the United States"},
            **({
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "price": re.sub(r"[^0-9]", "", s["prices"][0][1]) or "0",
                    "availability": "https://schema.org/InStock",
                    "url": url,
                },
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": f"{strip_tags(s['nav'])} packages",
                    "itemListElement": [
                        {"@type": "Offer", "name": p[0], "description": p[3],
                         "priceCurrency": "USD", "price": re.sub(r"[^0-9]", "", p[1]) or "0"}
                        for p in s["prices"]
                    ],
                },
            } if SHOW_PRICING else {}),
        },
        {
            "@type": "WebPage",
            "@id": f"{url}#webpage",
            "url": url,
            "name": strip_tags(s["title"]),
            "description": strip_tags(s["desc"]),
            "isPartOf": {"@id": f"{SITE}/#website"},
            "about": {"@id": f"{url}#service"},
            "inLanguage": "en-US",
            "datePublished": TODAY,
            "dateModified": TODAY,
            "mainEntity": {"@id": f"{url}#faq"},
            "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".answer", ".faq-body"]},
        },
        faq_schema(s["faqs"], url),
    ]}

    page(path, s["title"], s["desc"], body, schema=schema, active=None)


# --------------------------------------------------------------------------
# Services hub
# --------------------------------------------------------------------------
def render_services_index():
    path = "services/index.html"
    url = f"{SITE}/services/"
    trail = [("Home", "/"), ("Services", None)]

    cards = "".join(f"""
      <article class="card card--link reveal">
        <span class="offer-tag">{s['offer']['tag'].replace('Highest-converting offer', 'Free deliverable')}</span>
        <h3 class="h3">{s['nav']}</h3>
        <p>{s['answer']}</p>
        <div class="card-foot">
          <a class="link-arrow" href="/services/{s['slug']}.html">{s['nav']} details <span aria-hidden="true">&rarr;</span></a>
        </div>
      </article>""" for s in SERVICES)

    rows = "".join(f"""<tr>
        <td><b>{s['nav']}</b></td>
        <td>{s['offer']['name']}</td>
        <td><a class="link-arrow" href="/services/{s['slug']}.html">View</a></td>
      </tr>""" for s in SERVICES)

    body = f"""
{crumbs(trail)}
<section class="hero" style="padding-block:clamp(2.5rem,5vw,4rem) clamp(2.5rem,5vw,4rem)">
  <div class="wrap">
    <div style="max-width:840px">
      <span class="eyebrow">Services</span>
      <h1 class="balance">Seven disciplines, engineered to work as one.</h1>
      <div class="answer">
        <span class="eyebrow">Quick answer</span>
        <p>Forward Framework offers web design and development, AI consulting, business automation, SEO and AI-search marketing, paid ad management, social media marketing, and Scaffold — our business systems, SOP and hiring practice. Each service leads with a free, genuinely useful deliverable, and each is built to connect to the others rather than run in isolation.</p>
      </div>
      <div class="btn-row mt-6">
        <a class="btn btn--primary btn--lg" href="/contact.html">Get my free Growth Plan <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
        <a class="btn btn--ghost btn--lg" href="/results.html">See client results</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt section--line">
  <div class="wrap"><div class="grid grid-3">{cards}</div></div>
</section>

<section class="section">
  <div class="wrap">
    <div class="center mx-auto mb-7" style="max-width:700px">
      <span class="eyebrow">At a glance</span>
      <h2 class="h2 balance">Every service and the free deliverable it starts with.</h2>
    </div>
    <div class="table-wrap">
      <table class="compare">
        <thead><tr><th scope="col">Service</th><th scope="col">Free deliverable</th><th scope="col"></th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  </div>
</section>

{cta_band("Not sure which one you need?",
          "Take the 90-second Growth Plan. We'll tell you which of the six actually moves your number first — and which to leave for later.")}
"""
    schema = {"@context": "https://schema.org", "@graph": [
        crumb_schema(trail),
        {"@type": "CollectionPage", "@id": f"{url}#webpage", "url": url,
         "name": "Services | Forward Framework",
         "isPartOf": {"@id": f"{SITE}/#website"}, "inLanguage": "en-US",
         "dateModified": TODAY},
        {"@type": "ItemList", "@id": f"{url}#list",
         "itemListElement": [
             {"@type": "ListItem", "position": i + 1, "name": strip_tags(s["nav"]),
              "url": f"{SITE}/services/{s['slug']}.html"}
             for i, s in enumerate(SERVICES)]},
    ]}
    page(path, "Services | Web Design, AI, Automation &amp; Marketing | Forward Framework",
         "Six connected services: web design, AI consulting, automation, SEO and AI search, ad management and social media marketing. Every one starts with a free deliverable.",
         body, schema=schema)


# --------------------------------------------------------------------------
# Pricing
# --------------------------------------------------------------------------
def render_pricing():
    path = "pricing.html"
    url = f"{SITE}/pricing.html"
    trail = [("Home", "/"), ("Pricing", None)]

    # Single source of truth: the same list renders the markup and the FAQPage
    # schema, so the structured data matches the visible copy word for word.
    faqs = [
      ("Why do you publish prices when most agencies don't?",
       "Because hiding them wastes everyone's time. You should be able to tell whether we are in your range before you hand over a phone number, and we would rather spend our discovery calls on companies who already know the answer. Published pricing also forces us to keep scope honest."),
      ("Are these prices fixed or a starting point?",
       "They are genuine starting points, and the final number is fixed in writing before any work begins. Most projects land within 20% of the published figure. The variables that move it are page count, number of systems to integrate, and how much content needs creating from scratch."),
      ("Do you offer bundled pricing across services?",
       "Yes. Clients running three or more services together typically save 10–15% against the individual rates, because the work genuinely overlaps — one audit, one tracking build, one reporting layer instead of three."),
      ("What is the smallest engagement you take on?",
       "A single automation workflow at $749 or a landing page at $749. Below that we are not the right value for you, and we will usually point you to something you can do yourself."),
      ("Do you require payment upfront?",
       "Projects are billed 50% at kickoff and 50% at launch. Retainers are billed monthly in advance. Media spend always goes directly from you to the platform, never through us."),
    ]

    sections = ""
    for s in SERVICES:
        cards = "".join(price_card(*p) for p in s["prices"])
        sections += f"""
    <div class="mt-7" id="price-{s['slug']}">
      <div class="split" style="align-items:end;margin-bottom:var(--s-5)">
        <div>
          <span class="eyebrow">{s['eyebrow']}</span>
          <h2 class="h2" style="margin-bottom:0">{s['nav']}</h2>
        </div>
        <p class="small muted mb-0">Free first: {s['offer']['name'].lower()} · <a class="accent" href="/services/{s['slug']}.html">Service details</a></p>
      </div>
      <div class="price-grid">{cards}</div>
    </div>"""

    body = f"""
{crumbs(trail)}
<section class="hero" style="padding-block:clamp(2.5rem,5vw,4rem) clamp(2rem,4vw,3rem)">
  <div class="wrap">
    <div style="max-width:840px">
      <span class="eyebrow">Pricing</span>
      <h1 class="balance">Every price. On the website. Where prices belong.</h1>
      <div class="answer">
        <span class="eyebrow">Quick answer</span>
        <p>Forward Framework publishes starting prices for all seven services: websites from $749, AI readiness from $1,999, automation from $749, SEO and AI search from $499 per month, ad management from $749 per month, social media from $499 per month, and business systems from $999.</p>
      </div>
      <p class="lede">In an industry where "contact us for a quote" is the default, publishing numbers is a real differentiator — and it saves us both a discovery call that was only ever going to end in sticker shock. Final scope is fixed in writing after your free deliverable, and it does not move.</p>
      <div class="btn-row mt-6">
        <a class="btn btn--primary btn--lg" href="/contact.html">Get my free Growth Plan <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
        <a class="btn btn--ghost btn--lg" href="tel:+14124632126">Call (412) 463-2126</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt section--line">
  <div class="wrap">{sections}</div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      <span class="eyebrow">How we bill</span>
      <h2 class="h2 balance">The rules behind the numbers.</h2>
      <p class="lede">No hidden setup fees, no percentage of your revenue, no charging you to leave.</p>
    </div>
    <div class="grid grid-2">
      <div class="card"><h3 class="h4">Fixed scope, fixed price</h3><p>Project work is quoted as a fixed number after your free deliverable. If we underestimate, that is our problem, not a change order.</p></div>
      <div class="card"><h3 class="h4">90 days, then month to month</h3><p>Retainers need a 90-day runway to be measurable. After that, cancel with 30 days' notice, any month, no penalty.</p></div>
      <div class="card"><h3 class="h4">Media spend is yours</h3><p>Ad budget is paid by you, directly to the platform, on your card. We never mark up media or take a rebate.</p></div>
      <div class="card"><h3 class="h4">You own the assets</h3><p>Code, accounts, automations, documentation and data are in your name from day one and stay that way.</p></div>
    </div>
  </div>
</section>

<section class="section section--bone">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Questions</span>
      <h2 class="h2 balance">Pricing questions, answered plainly.</h2>
      <p class="lede">Everything below is what we would tell you on a call — so here it is without the call.</p>
    </div>
    {faq_block(faqs)}
  </div>
</section>

{cta_band("Know the price. Now see the plan.",
          "A written Growth Plan in 48 hours, with the specific recommendations and the specific numbers attached to each one.")}
"""
    schema = {"@context": "https://schema.org", "@graph": [
        crumb_schema(trail),
        {"@type": "WebPage", "@id": f"{url}#webpage", "url": url,
         "name": "Pricing | Forward Framework",
         "isPartOf": {"@id": f"{SITE}/#website"}, "inLanguage": "en-US",
         "dateModified": TODAY, "mainEntity": {"@id": f"{url}#faq"},
         "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".answer", ".faq-body"]}},
        faq_schema(faqs, url),
    ]}
    page(path, "Pricing | Web Design, AI, Automation &amp; Marketing | Forward Framework",
         "Published starting prices for all seven services: websites from $749, automation from $749, SEO and AI search from $499/mo, ads from $749/mo, social from $499/mo, business systems from $999.",
         body, schema=schema, active="/pricing.html")


# --------------------------------------------------------------------------
# Results
# --------------------------------------------------------------------------
CASES = [
    ("Home services · Multi-location", "From a brochure site to a booking machine",
     [("+212%", "Form conversions"), ("-38%", "Cost per lead"), ("4 mo", "To payback")],
     "A regional home-services group had a site that looked modern and converted at 1.1%. We rebuilt it around one dominant call to action, moved proof above the fold, cut LCP from 6.4s to 1.9s, and added instant SMS routing so the on-call technician was talking to the customer inside a minute. Then we rewired Google Ads to bid on booked jobs rather than form fills.",
     ["Conversion Site rebuild", "Speed-to-lead automation", "Google Ads restructure with offline conversions"]),
    ("B2B services · $12M revenue", "Nine hours of follow-up, down to forty seconds",
     [("41s", "Speed to lead"), ("+63%", "Contact rate"), ("1,900", "Hours/yr returned")],
     "Four manual handoffs sat between an enquiry and a human response: a form, an inbox, a spreadsheet, and a rep who checked it twice a day. We replaced all four with a routed workflow across CRM, phone and email, added AI triage on inbound documents, and gave leadership one reconciled dashboard. The same team now works roughly twice the pipeline without added headcount.",
     ["Automation Mission — 5 workflows", "AI document triage", "Reporting and reconciliation layer"]),
    ("Ecommerce · DTC", "Cited by AI, not just ranked by Google",
     [("7 of 12", "Buying prompts cited"), ("+58%", "Non-brand organic"), ("+31%", "Assisted revenue")],
     "The brand ranked well and was invisible in AI answers — twelve buying prompts named competitors and never them. We rebuilt the entity graph, restructured key pages to open with direct answers, shipped a full JSON-LD stack and llms.txt, opened crawler access, and ran a citation-building programme against the sources the models already trusted.",
     ["Technical SEO and Core Web Vitals", "GEO programme and schema build", "Digital PR and citation building"]),
    ("Professional services · Regional", "Half the ad budget, more revenue",
     [("-46%", "Wasted spend"), ("+28%", "Qualified leads"), ("2.4x", "Return on ad spend")],
     "The account was optimising toward the cheapest possible form fill and doing it very well. We imported closed-won data from the CRM so the platforms learned which enquiries became clients, rebuilt the account structure around service lines, and replaced a generic contact page with three intent-matched landing pages.",
     ["Free ad account audit", "Offline conversion imports", "Landing page build and testing"]),
    ("Healthcare · Multi-site", "One intake process, six locations",
     [("-71%", "Intake admin time"), ("+19%", "Appointments booked"), ("100%", "Audit trail")],
     "Six locations ran six versions of the same intake process, none of them written down. We documented the best of each, built one automated pathway with compliant data handling, and connected it to scheduling and reminders. Admin time per patient fell by roughly two thirds and no-shows dropped with automated confirmation.",
     ["Automation Mission", "AI Opportunity Audit first", "Scheduling and reminder workflows"]),
    ("Ecommerce · Shopify", "A store that survives its own peak season",
     [("-58%", "Page load time"), ("+34%", "Mobile conversion"), ("+22%", "AOV")],
     "Peak season was exposing a slow theme and a checkout with three unnecessary steps. We rebuilt the front end for speed, restructured collection and product templates around decision-making rather than merchandising, and added post-purchase automation that lifted average order value without another dollar of media.",
     ["Platform Build on Shopify", "CRO programme", "Post-purchase automation"]),
]


def render_results():
    path = "results.html"
    url = f"{SITE}/results.html"
    trail = [("Home", "/"), ("Results", None)]

    cards = "".join(f"""
      <article class="result-card reveal">
        <span class="result-industry">{ind}</span>
        <h3 class="h3">{title}</h3>
        <div class="result-metrics">{''.join(f'<div><b>{v}</b><span>{l}</span></div>' for v, l in mets)}</div>
        <p class="small">{story}</p>
        <div class="card-foot">{ticks(work)}</div>
      </article>""" for ind, title, mets, story, work in CASES)

    body = f"""
{crumbs(trail)}
<section class="hero" style="padding-block:clamp(2.5rem,5vw,4rem) clamp(2rem,4vw,3rem)">
  <div class="wrap">
    <div style="max-width:860px">
      <span class="eyebrow">Client results</span>
      <h1 class="balance">The only slide that matters.</h1>
      <div class="answer">
        <span class="eyebrow">How to read these</span>
        <p>Every result below states the baseline, the timeframe and the specific work that produced it. A percentage without a baseline is decoration, so we publish the method alongside the metric — and we only claim outcomes from engagements where we controlled the site, the tracking and the demand.</p>
      </div>
    </div>
  </div>
</section>

<!-- PLACEHOLDER CASE STUDIES: replace with your verified client outcomes before launch.
     Keep the structure — industry, baseline, metric, method — it is what makes proof credible. -->
<section class="section section--alt section--line">
  <div class="wrap"><div class="grid grid-3">{cards}</div></div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Our standard</span>
      <h2 class="h2 balance">What we will and won't claim.</h2>
      <p class="lede">Marketing results are easy to inflate and hard to verify, so we hold ourselves to four rules.</p>
    </div>
    <div class="grid grid-2">
      <div class="card"><h3 class="h4">Baselines, always</h3><p>Every percentage is stated against the number it started from and the window it was measured over.</p></div>
      <div class="card"><h3 class="h4">Attribution we can defend</h3><p>We only claim revenue we can trace through tracking we built and can show you inside your own accounts.</p></div>
      <div class="card"><h3 class="h4">The work, not just the win</h3><p>Each case names what we actually did, so you can judge whether it applies to your situation.</p></div>
      <div class="card"><h3 class="h4">References on request</h3><p>Ask and we will connect you with a client in your industry before you sign anything.</p></div>
    </div>
  </div>
</section>

{cta_band("Want a number like these attached to your business?",
          "The Growth Plan tells you which of these levers applies to you, in what order, and what it is worth.")}
"""
    schema = {"@context": "https://schema.org", "@graph": [
        crumb_schema(trail),
        {"@type": "CollectionPage", "@id": f"{url}#webpage", "url": url,
         "name": "Client Results | Forward Framework",
         "isPartOf": {"@id": f"{SITE}/#website"}, "inLanguage": "en-US", "dateModified": TODAY},
    ]}
    page(path, "Client Results &amp; Case Studies | Forward Framework",
         "Case studies with baselines, timeframes and the actual work behind each number — web design, automation, AI search, ads and social across US companies.",
         body, schema=schema, active="/results.html")


# --------------------------------------------------------------------------
# About
# --------------------------------------------------------------------------
def render_about():
    path = "about.html"
    url = f"{SITE}/about.html"
    trail = [("Home", "/"), ("About", None)]
    body = f"""
{crumbs(trail)}
<section class="hero" style="padding-block:clamp(2.5rem,5vw,4rem) clamp(2rem,4vw,3rem)">
  <div class="wrap">
    <div style="max-width:860px">
      <span class="eyebrow">About</span>
      <h1 class="balance">Built for the companies that were tired of coordinating vendors.</h1>
      <div class="answer">
        <span class="eyebrow">Quick answer</span>
        <p>Forward Framework is a United States digital agency combining web design, AI consulting, automation and marketing under one accountable team. It exists because most companies were buying those four things separately and discovering that nobody owned the result they were actually paying for.</p>
      </div>
      <p class="lede">We are deliberately not a specialist shop. Specialists optimise their slice; the gaps between the slices are where growth quietly dies. Our whole design is to own the seams.</p>
    </div>
  </div>
</section>

<section class="section section--alt section--line">
  <div class="wrap split">
    <div>
      <span class="eyebrow">What we believe</span>
      <h2 class="h2 balance">Five things we won't compromise on.</h2>
      <p class="lede">If any of these sound like a problem, we are probably not a fit — and that is useful information for both of us.</p>
      <div class="btn-row mt-6"><a class="btn btn--primary" href="/contact.html">Talk to a strategist <span class="btn-arrow" aria-hidden="true">&rarr;</span></a></div>
    </div>
    <div class="grid grid-2">
      <div class="card"><span class="card-num">01</span><h3 class="h4">Revenue is the only scoreboard</h3><p>Impressions, sessions and engagement are diagnostics. If a tactic cannot be connected to money, it is a hypothesis, not a strategy.</p></div>
      <div class="card"><span class="card-num">02</span><h3 class="h4">Transparency by default</h3><p>Fixed quotes before work starts, open dashboards, client-owned accounts, and an honest answer when the answer is "don't buy this from us."</p></div>
      <div class="card"><span class="card-num">03</span><h3 class="h4">Build to be handed over</h3><p>Documentation, training and plain-language runbooks on everything. Work that only we can maintain is a liability we refuse to sell.</p></div>
      <div class="card"><span class="card-num">04</span><h3 class="h4">Speed is a feature</h3><p>Of the website, of the lead response, of our own replies. Nearly every conversion problem has a latency component hiding in it.</p></div>
      <div class="card"><span class="card-num">05</span><h3 class="h4">Say the uncomfortable thing</h3><p>Sometimes the honest recommendation is a smaller engagement, a different vendor, or nothing at all. We'd rather be right than booked.</p></div>
      <div class="card"><span class="card-num">06</span><h3 class="h4">Senior people do the work</h3><p>The strategist who scopes your engagement runs it. No bait-and-switch to a junior pod after signature.</p></div>
    </div>
  </div>
</section>

<section class="section section--bone">
  <div class="wrap">
    <div class="split">
      <div>
        <span class="eyebrow">The method</span>
        <h2 class="h2 balance">Why it's called the Forward Framework.</h2>
        <p class="lede">Five phases, run in order, every engagement — Frame, Focus, Forge, Fuel, Forward. It is the reason our work compounds instead of resetting each time a company changes vendors.</p>
        <div class="btn-row mt-6"><a class="btn btn--dark" href="/#framework">See the five phases <span class="btn-arrow" aria-hidden="true">&rarr;</span></a></div>
      </div>
      <div>
        <p>Agencies usually start at phase three. Somebody sells a website, or a campaign, or an AI pilot, and production begins before anyone has established what a customer is worth or what the funnel currently does with one. The work then gets judged on whether it looks good, because nobody defined what it was supposed to do.</p>
        <p>Framing first is slower for about a week and faster for the following year. It means every later decision — this headline, this platform, this automation, this budget — is settled by arithmetic instead of opinion. It also means when something underperforms, we can tell you why rather than proposing a redesign.</p>
        <p class="mb-0"><b>Forward</b>, the fifth phase, is the one most agencies skip: the compounding loop of monthly tests, quarterly re-forecasts, and a single dashboard that answers "what made us money" without needing a translator.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      <span class="eyebrow">How we work</span>
      <h2 class="h2 balance">Practical details.</h2>
    </div>
    {faq_block([
      ("Where are you based and who do you work with?",
       "We are a remote-first United States team serving clients nationwide. Most of our clients are owner-led and mid-market companies between $1M and $50M in revenue — home and trade services, professional services, healthcare, ecommerce and B2B."),
      ("Are you an agency or a consultancy?",
       "Both, deliberately. We advise on what to do and then build it, because handing a strategy deck to a company with no capacity to execute it is how most consulting engagements quietly fail."),
      ("Can you work alongside our in-house team?",
       "Frequently. Some clients use us as their entire marketing department; others keep brand and content in-house and hire us for the technical layer, the automation and the AI-search programme. We work in your tools and train rather than gatekeep."),
      ("What size company is a good fit?",
       "Companies doing at least $1M in revenue with a real product or service and a willingness to be told the truth about their funnel. Below that, our honest advice is usually to spend the money on demand rather than on us."),
      ("How do we start?",
       "With the free Growth Plan. Ninety seconds of form, a written plan within two business days, and a conversation only if the plan makes you want one."),
    ])}
  </div>
</section>

{cta_band("Let's find out if we're a fit.",
          "The Growth Plan costs nothing and tells you more about how we think than any capabilities deck could.")}
"""
    schema = {"@context": "https://schema.org", "@graph": [
        crumb_schema(trail),
        {"@type": "AboutPage", "@id": f"{url}#webpage", "url": url,
         "name": "About | Forward Framework",
         "isPartOf": {"@id": f"{SITE}/#website"},
         "about": {"@id": f"{SITE}/#organization"},
         "inLanguage": "en-US", "dateModified": TODAY,
         "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".answer", ".faq-body"]}},
    ]}
    page(path, "About Forward Framework | One Team for Web, AI, Automation &amp; Marketing",
         "Forward Framework combines web design, AI consulting, automation and marketing under one accountable team. Our beliefs, our method and how we work.",
         body, schema=schema, active="/about.html")


# --------------------------------------------------------------------------
# Contact / thank you / legal / 404
# --------------------------------------------------------------------------
def render_contact():
    path = "contact.html"
    url = f"{SITE}/contact.html"
    trail = [("Home", "/"), ("Contact", None)]

    # Single source of truth for markup + FAQPage schema.
    faqs = [
      ("How fast will I hear back?",
       "Within one business day for any enquiry, and your written Growth Plan within two business days of submitting the form. If you call during business hours you will reach a strategist, not a queue."),
      ("Do I have to get on a sales call?",
       "No. The Growth Plan is delivered as a document whether or not you book a conversation. We would rather you read it, decide it is useful, and come back on your own timing."),
      ("What information should I include?",
       "Your website, roughly what you sell and to whom, what you are spending on marketing today, and the single thing you most want fixed. That is enough for a useful first plan."),
      ("Do you work with companies outside the United States?",
       "Occasionally, when time zones and language make it practical. Our tracking, compliance and paid-media work is built around US platforms and regulations, so US-based companies get the most from us."),
    ]
    body = f"""
{crumbs(trail)}
<section class="hero" style="padding-block:clamp(2.5rem,5vw,4rem) clamp(3rem,6vw,5rem)">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">Contact</span>
      <h1 class="balance">Start with a plan, not a pitch.</h1>
      <div class="answer">
        <span class="eyebrow">What happens next</span>
        <p>Send the form and a strategist audits your site, your AI search visibility and your funnel. Within two business days you receive a written Growth Plan with ranked priorities and the dollar impact of each. There is no obligation and no call required to receive it.</p>
      </div>
      <p class="lede">Prefer to talk first? Call <a class="accent" href="tel:+14124632126">(412) 463-2126</a> or email <a class="accent" href="mailto:hello@forward-framework.com">hello@forward-framework.com</a>. A senior strategist answers, not a scheduler.</p>

      <div class="grid grid-2 mt-7">
        <div class="card"><h3 class="h4">New business</h3><p><a href="mailto:hello@forward-framework.com">hello@forward-framework.com</a><br><a href="tel:+14124632126">(412) 463-2126</a></p></div>
        <div class="card"><h3 class="h4">Existing clients</h3><p><a href="mailto:hello@forward-framework.com">hello@forward-framework.com</a><br>Same-day response, business hours.</p></div>
        <div class="card"><h3 class="h4">Hours</h3><p>Monday–Friday, 8am–6pm across US time zones. Urgent client issues are monitored outside those hours.</p></div>
        <div class="card"><h3 class="h4">Coverage</h3><p>Remote-first, serving companies across the United States. On-site for filming days and workshops.</p></div>
      </div>
    </div>

    <div>{lead_form("contact", "Get my free Growth Plan",
      "Tell us where it hurts. We'll send a written plan with priorities and dollar impact within two business days.",
      "Send my Growth Plan",
      "No obligation, no call required, and yours to keep whether or not we work together.",
      "growth-plan")}</div>
  </div>
</section>

<section class="section section--alt section--line">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Before you write</span>
      <h2 class="h2 balance">Common questions, already answered.</h2>
      <p class="lede">If the answer is here, you can skip a step and go straight to the plan.</p>
    </div>
    {faq_block(faqs)}
  </div>
</section>
"""
    schema = {"@context": "https://schema.org", "@graph": [
        crumb_schema(trail),
        {"@type": "ContactPage", "@id": f"{url}#webpage", "url": url,
         "name": "Contact | Forward Framework",
         "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#organization"},
         "inLanguage": "en-US", "dateModified": TODAY, "mainEntity": {"@id": f"{url}#faq"}},
        faq_schema(faqs, url),
    ]}
    page(path, "Contact Forward Framework | Get a Free Growth Plan in 48 Hours",
         "Contact Forward Framework for web design, AI consulting, automation and marketing. Written Growth Plan in 48 hours — no obligation, no call required.",
         body, schema=schema, active="/contact.html")


def render_thank_you():
    """The page a prospect lands on after submitting anything.

    It has one job: turn a form fill into a booked conversation. So it confirms
    what was sent, says exactly what happens and when, asks for the meeting
    while intent is at its highest, and shows that the other six deliverables
    are free too. Everything renders without JavaScript; main.js only lifts the
    offer matching ?need= to the front of the grid.
    """

    # One line per service, written for someone who has just raised their hand.
    hooks = {
        "web-design": ("Free homepage concept",
                       "A real above-the-fold concept for your homepage — your brand, your offer, your proof — with the conversion reasoning written out beside it.",
                       "Designed, not described"),
        "ai-consulting": ("Free AI Opportunity Audit",
                          "We interview your operators, map where judgement actually moves through the business, and rank the AI use cases with a dollar figure and a risk note on each.",
                          "Roadmap in 7–10 days"),
        "automation": ("Free automation blueprint",
                       "A 60-minute working session on your real processes, then a written blueprint: what to automate first, what it returns, and what we would honestly leave alone.",
                       "Hours and dollars, per workflow"),
        "marketing": ("Free AI Search Visibility Report",
                      "Twelve real buying prompts from your category, run through four AI assistants. You get the transcripts, the competitor citation share, and why you are missing.",
                      "12 prompts, 4 assistants"),
        "ad-management": ("Free ad account audit",
                          "Read-only access for one week and a written teardown of where the spend goes. In most accounts we open, 20–40% is going somewhere it shouldn't.",
                          "Before you hire anyone"),
        "social-media-marketing": ("Free 30-day content plan",
                                   "Ten fully scripted posts written for your business — hooks, copy, format and the angle behind each — plus a calendar for what to post, where, and in what order.",
                                   "10 posts, ready to publish"),
        "business-systems": ("Free Key-Person Risk Map",
                             "Every process that currently lives only in someone's head, named and ranked by what it costs you the week that person is unavailable.",
                             "Most owners have never seen this"),
    }

    cards = ""
    for svc in SERVICES:
        tag, blurb, meta = hooks[svc["slug"]]
        cards += f'''
      <article class="card card--link reveal" data-slug="{svc['slug']}">
        <div class="card-icon" aria-hidden="true">{icon(svc['slug'])}</div>
        <span class="offer-tag">{tag}</span>
        <h3 class="h4">{svc['nav']}</h3>
        <p class="small">{blurb}</p>
        <div class="card-foot card-foot--split">
          <span class="small muted">{meta}</span>
          <a class="link-arrow" href="/services/{svc['slug']}.html">Claim it <span aria-hidden="true">&rarr;</span></a>
        </div>
      </article>'''

    # While BOOKING_URL is unset the primary action is the phone number, which
    # is real. A dead "Book a time" button would cost more than it earns.
    if BOOKING_URL:
        book_primary = (f'<a class="btn btn--primary btn--lg" href="{BOOKING_URL}" '
                        f'target="_blank" rel="noopener">Book my 20 minutes '
                        f'<span class="btn-arrow" aria-hidden="true">&rarr;</span></a>')
        book_dark = (f'<a class="btn btn--dark" href="{BOOKING_URL}" target="_blank" '
                     f'rel="noopener">Book my 20 minutes '
                     f'<span class="btn-arrow" aria-hidden="true">&rarr;</span></a>')
        book_second = '<a class="btn btn--ghost btn--lg" href="tel:+14124632126">Or call (412) 463-2126</a>'
    else:
        book_primary = ('<a class="btn btn--primary btn--lg" href="tel:+14124632126">'
                        'Call (412) 463-2126 <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>')
        book_dark = '<a class="btn btn--dark" href="tel:+14124632126">Call (412) 463-2126</a>'
        book_second = ('<a class="btn btn--ghost btn--lg" href="mailto:hello@forward-framework.com?'
                       'subject=Booking%20a%20walkthrough">Email us a time that suits</a>')

    body = f'''
<!-- ============ CONFIRMATION ============ -->
<section class="section" style="padding-block:clamp(4rem,10vw,7rem)">
  <div class="wrap center mx-auto" style="max-width:780px">
    <div class="success-mark" aria-hidden="true">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 6L9 17l-5-5"/></svg>
    </div>
    <span class="eyebrow" style="justify-content:center">Received</span>
    <h1 class="h1 balance">Got it. Now the useful part starts.</h1>
    <p class="lede mx-auto">A strategist has your answers and is already looking at your site. Your written plan lands in your inbox within two business days — worth checking spam once, just in case.</p>
    <div class="badge-row mt-6">
      <span class="badge"><span class="dot-live" aria-hidden="true"></span> In the queue now</span>
      <span class="badge">Written plan, not a sales call</span>
      <span class="badge">No obligation, no contract</span>
    </div>
    <p class="small muted mt-6">Wrong details, or something you forgot to mention? Email <a class="accent" href="mailto:hello@forward-framework.com">hello@forward-framework.com</a> and it goes straight onto your file.</p>
  </div>
</section>

<!-- ============ WHAT HAPPENS NEXT ============ -->
<section class="section section--bone">
  <div class="wrap split">
    <div>
      <span class="eyebrow">What happens next</span>
      <h2 class="h2 balance">Three steps, and you only have to show up for one.</h2>
      <p class="lede">Most of the work happens before you ever speak to us. That is deliberate — by the time we talk, you are reacting to something real instead of listening to a pitch.</p>
      <div class="btn-row mt-6">
        {book_dark}
        <a class="btn btn--ghost" href="#free-offers">See what else is free</a>
      </div>
      <p class="small muted mt-5">A senior strategist answers, not a scheduler.</p>
    </div>
    <div>
      <div class="process">
        <div class="step">
          <span class="step-num">01</span>
          <div>
            <h3 class="h4">We dig, today</h3>
            <p>Your site, your analytics where you have shared them, your category's AI answers and your competitors' funnels. A person does this, not a scanner.</p>
          </div>
          <div class="step-meta">Today — no action needed from you</div>
        </div>
        <div class="step">
          <span class="step-num">02</span>
          <div>
            <h3 class="h4">Your plan arrives in writing</h3>
            <p>What is leaking money, ranked by dollars per week of delay. What we would do first, what it costs, and what we would leave alone. Yours to keep either way.</p>
          </div>
          <div class="step-meta">Within 2 business days — check your inbox</div>
        </div>
        <div class="step">
          <span class="step-num">03</span>
          <div>
            <h3 class="h4">Twenty minutes to pull it apart</h3>
            <p>You bring the objections, we defend the reasoning. If the plan is right, we scope it. If it is not, you keep the plan and we part on good terms.</p>
          </div>
          <div class="step-meta">When it suits you — book it now if you like</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ THE MEETING ============ -->
<section class="section section--alt section--line">
  <div class="wrap">
    <div class="center mx-auto" style="max-width:720px">
      <span class="eyebrow" style="justify-content:center">The walkthrough</span>
      <h2 class="h2 balance">Twenty minutes. No deck, no discovery theatre.</h2>
      <p class="lede mx-auto">You have probably sat through the other kind. This is the opposite: your plan is already written, so we spend the time on the parts you disagree with.</p>
    </div>
    <div class="grid grid-2 mt-7">
      <article class="card">
        <span class="offer-tag">What it is</span>
        <h3 class="h4">A working session on your numbers</h3>
        <ul class="tick-list mt-5">
          <li>We walk your plan line by line, in your order</li>
          <li>Every recommendation carries a dollar figure you can challenge</li>
          <li>You get the build order and the honest timeline</li>
          <li>Straight answers on what we would <em>not</em> take on</li>
          <li>Scope and price if you want it, on the call</li>
        </ul>
      </article>
      <article class="card">
        <span class="offer-tag">What it is not</span>
        <h3 class="h4">A qualification call in disguise</h3>
        <ul class="tick-list mt-5">
          <li>No slide deck about our process</li>
          <li>No second call with "the specialist"</li>
          <li>No contract to see the numbers</li>
          <li>No retainer minimum to start</li>
          <li>No follow-up sequence if you say no</li>
        </ul>
      </article>
    </div>
    <div class="btn-row mt-7" style="justify-content:center">
      {book_primary}
      {book_second}
    </div>
  </div>
</section>

<!-- ============ THE OTHER FREE OFFERS ============ -->
<section class="section" id="free-offers">
  <div class="wrap">
    <div class="center mx-auto" style="max-width:800px">
      <span class="eyebrow" style="justify-content:center">While you wait</span>
      <h2 class="h2 balance">You claimed one. The other six are free as well.</h2>
      <p class="lede mx-auto">Every discipline here leads with a real deliverable rather than a discovery call — and they stack. Ask for a second one on your walkthrough and it costs you nothing but the time to answer a few questions.</p>
    </div>
    <div class="grid grid-3 mt-7" data-offer-grid>{cards}
    </div>
    <p class="small muted center mt-6" style="max-width:60ch;margin-inline:auto">Genuinely free, genuinely useful, and yours whether or not you hire us. We would rather be judged on the work than on a proposal.</p>
  </div>
</section>

<!-- ============ NUMBERS ============ -->
<section class="section section--tight section--alt section--line" aria-label="Key numbers">
  <div class="wrap">
    <div class="stat-band">
      <div class="stat"><b><span data-count="48" data-suffix="h">48h</span></b><span>From this form to a written plan</span></div>
      <div class="stat"><b><span data-count="20" data-suffix=" min">20 min</span></b><span>The only meeting we ask for</span></div>
      <div class="stat"><b><span data-count="7" data-suffix="">7</span></b><span>Free deliverables on the table</span></div>
      <div class="stat"><b><span data-count="0" data-suffix="">0</span></b><span>Contracts before you see the work</span></div>
    </div>
  </div>
</section>

<!-- ============ FINAL CTA ============ -->
<section class="section cta-band">
  <div class="wrap center mx-auto" style="max-width:820px">
    <span class="eyebrow" style="justify-content:center">Next step</span>
    <h2 class="h1 balance">Put the twenty minutes in the diary and skip the wait.</h2>
    <p class="lede mx-auto">Your plan is being written either way. Booking now just means you read it with us rather than on your own — and you can add any of the other six deliverables while we are talking.</p>
    <div class="btn-row mt-6" style="justify-content:center">
      {book_primary}
      {book_second}
    </div>
    <p class="small muted mt-5">No obligation · No contracts to start · Your data is never resold</p>
  </div>
</section>
'''
    page("thank-you.html", "Thank You | Forward Framework",
         "Your request has been received. A strategist will send your written plan within two business days — and the other six deliverables are free too.",
         body, noindex=True)


def render_404():
    body = """
<section class="section" style="padding-block:clamp(5rem,12vw,9rem)">
  <div class="wrap center mx-auto" style="max-width:680px">
    <span class="eyebrow" style="justify-content:center">404</span>
    <h1 class="h1 balance">That page has moved forward without us.</h1>
    <p class="lede mx-auto">The link is broken or the page has been retired. Here is everything worth finding.</p>
    <div class="btn-row mt-6" style="justify-content:center">
      <a class="btn btn--primary" href="/">Back to home</a>
      <a class="btn btn--ghost" href="/services/">All services</a>
      <a class="btn btn--ghost" href="/contact.html">Contact</a>
    </div>
  </div>
</section>"""
    page("404.html", "Page Not Found | Forward Framework",
         "The page you were looking for could not be found.", body, noindex=True)


LEGAL_INTRO = ("This page is a starting template drafted for a US-based agency. "
               "Have counsel review and adapt it before launch.")


def legal_schema(path, name, trail):
    url = f"{SITE}/{path}"
    return {"@context": "https://schema.org", "@graph": [
        crumb_schema(trail),
        {"@type": "WebPage", "@id": f"{url}#webpage", "url": url, "name": name,
         "isPartOf": {"@id": f"{SITE}/#website"},
         "publisher": {"@id": f"{SITE}/#organization"},
         "inLanguage": "en-US", "dateModified": TODAY},
    ]}


def render_privacy():
    body = f"""
{crumbs([("Home", "/"), ("Privacy", None)])}
<section class="section">
  <div class="wrap prose">
    <span class="eyebrow">Legal</span>
    <h1 class="h1">Privacy policy</h1>
    <p class="muted small">Last updated <span data-year>2026</span>. <!-- TEMPLATE: {LEGAL_INTRO} --></p>
    <h2>What we collect</h2>
    <p>When you submit a form we collect the details you provide — typically your name, company, email address, phone number and website — together with basic technical information such as the page you arrived on, your referring source and any campaign parameters in the URL. We use analytics cookies to understand how the site is used.</p>
    <h2>How we use it</h2>
    <p>We use your information solely to prepare and deliver the material you requested, to respond to your enquiry, and to provide services if you become a client. We do not sell, rent or share your personal information with third parties for their own marketing.</p>
    <h2>Who processes it</h2>
    <p>Your data may be processed by service providers acting on our behalf — website hosting, analytics, email delivery and customer relationship management. Each is bound by contract to protect your information and to process it only on our instructions.</p>
    <h2>How long we keep it</h2>
    <p>Enquiry records are retained for up to 24 months from your last interaction unless you ask us to remove them sooner. Client records are retained for as long as required for contractual and tax purposes.</p>
    <h2>Your rights</h2>
    <p>You can request access to, correction of, or deletion of the personal information we hold about you, and you can opt out of marketing communication at any time. Residents of states with applicable privacy laws, including California, have additional rights over the sale or sharing of personal information — we do not sell or share it. Email <a href="mailto:hello@forward-framework.com">hello@forward-framework.com</a> and we will respond within 30 days.</p>
    <h2>Cookies</h2>
    <p>We use essential cookies to make the site work and analytics cookies to measure performance. You can block cookies in your browser settings; essential functionality will continue to work.</p>
    <h2>Contact</h2>
    <p>Questions about this policy: <a href="mailto:hello@forward-framework.com">hello@forward-framework.com</a> or (412) 463-2126.</p>
  </div>
</section>"""
    page("privacy.html", "Privacy Policy | Forward Framework",
         "How Forward Framework collects, uses, stores and protects your personal information.", body,
         schema=legal_schema("privacy.html", "Privacy Policy | Forward Framework",
                             [("Home", "/"), ("Privacy", None)]))


def render_terms():
    body = f"""
{crumbs([("Home", "/"), ("Terms", None)])}
<section class="section">
  <div class="wrap prose">
    <span class="eyebrow">Legal</span>
    <h1 class="h1">Terms of service</h1>
    <p class="muted small">Last updated <span data-year>2026</span>. <!-- TEMPLATE: {LEGAL_INTRO} --></p>
    <h2>Using this website</h2>
    <p>This website and its contents are provided for information. Prices shown are genuine starting points and are confirmed in a written scope before any engagement begins. Nothing on this site constitutes a binding offer.</p>
    <h2>Engagements</h2>
    <p>All work is governed by a signed statement of work that sets out scope, deliverables, timeline and fees. Project work is billed 50% at kickoff and 50% at launch. Retainers run on an initial 90-day term and continue month to month thereafter, cancellable with 30 days' written notice.</p>
    <h2>Ownership</h2>
    <p>On final payment, you own the deliverables produced for you: code, designs, automations, documentation and content. Advertising accounts, analytics properties and domains are established in your name and remain yours throughout. We retain ownership of our internal methods, templates and tooling.</p>
    <h2>Performance commitments</h2>
    <p>Where an engagement includes a stated 90-day performance target, that target is defined in writing at the start. If we miss it, we continue working at no charge the following month until it is met. This does not apply where agreed access, content, budget or approvals were not provided.</p>
    <h2>Confidentiality</h2>
    <p>Each party will keep the other's non-public information confidential and use it only to perform the engagement.</p>
    <h2>Limitation of liability</h2>
    <p>To the extent permitted by law, our aggregate liability arising from an engagement is limited to the fees paid for the services giving rise to the claim in the preceding three months. Neither party is liable for indirect or consequential loss.</p>
    <h2>Contact</h2>
    <p>Questions about these terms: <a href="mailto:hello@forward-framework.com">hello@forward-framework.com</a>.</p>
  </div>
</section>"""
    page("terms.html", "Terms of Service | Forward Framework",
         "The terms governing use of the Forward Framework website and our client engagements.", body,
         schema=legal_schema("terms.html", "Terms of Service | Forward Framework",
                             [("Home", "/"), ("Terms", None)]))


# --------------------------------------------------------------------------
# robots.txt / sitemap.xml / llms.txt / manifest
# --------------------------------------------------------------------------
def all_urls():
    urls = [("/", "1.0", "weekly"), ("/services/", "0.9", "monthly")]
    urls += [(f"/services/{s['slug']}.html", "0.9", "monthly") for s in SERVICES]
    urls += [("/results.html", "0.8", "monthly"),
             ("/about.html", "0.7", "monthly"), ("/contact.html", "0.8", "monthly"),
             ("/privacy.html", "0.2", "yearly"), ("/terms.html", "0.2", "yearly")]
    return urls


def render_meta_files():
    # robots.txt — explicitly welcome AI crawlers (GEO/AEO requirement)
    robots = f"""# Forward Framework — robots.txt
# Traditional search crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

# AI / answer-engine crawlers — explicitly allowed so we can be cited
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: meta-externalagent
Allow: /

# Everyone else
User-agent: *
Allow: /
Disallow: /thank-you.html

Sitemap: {SITE}/sitemap.xml
"""
    open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8").write(robots)
    print("  wrote robots.txt")

    entries = "".join(
        f"""  <url>
    <loc>{SITE}{u}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{pri}</priority>
  </url>
""" for u, pri, freq in all_urls())
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{entries}</urlset>
"""
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(sitemap)
    print("  wrote sitemap.xml")

    svc_lines = "\n".join(
        f"- [{s['nav']}]({SITE}/services/{s['slug']}.html): {strip_tags(s['answer'])}"
        for s in SERVICES)
    llms = f"""# Forward Framework

> Forward Framework is a United States digital agency that builds websites, AI systems, automations and marketing campaigns as one connected growth engine. Companies hire one accountable team instead of seven separate vendors, and report on a single revenue number.

Forward Framework serves owner-led and mid-market companies across the United States, typically between $1M and $50M in revenue, across home and trade services, professional services, healthcare, ecommerce and B2B. Every service begins with a free, genuinely useful deliverable rather than a sales call, and every engagement is quoted as a fixed price before work starts.

## Services

{svc_lines}

## Key pages

- [Home]({SITE}/): overview, method and the free Growth Plan offer
- [Services]({SITE}/services/): all seven services with their free deliverables
- [Results]({SITE}/results.html): case studies with baselines and methods
- [About]({SITE}/about.html): operating principles and the five-phase method
- [Contact]({SITE}/contact.html): request a written Growth Plan in 48 hours

## Method — The Forward Framework

1. Frame — establish customer economics and what the funnel does today
2. Focus — rank one priority by dollars per week of delay, then scope and price it
3. Forge — build in visible weekly increments against a single plan
4. Fuel — turn on demand with offline revenue fed back into every platform
5. Forward — compound through monthly tests and quarterly re-forecasts

## Terms of engagement

- Free deliverable before any paid work, no call required to receive it
- Every engagement quoted as a fixed price after that deliverable
- 90-day initial runway on retainers, month to month thereafter
- Clients own all accounts, code, automations, data and documentation
- Media spend paid directly to platforms, never marked up
- Named senior strategist runs the work they scoped

## Contact

- Email: hello@forward-framework.com
- Phone: +1-412-463-2126
- Area served: United States (remote-first)
"""
    open(os.path.join(ROOT, "llms.txt"), "w", encoding="utf-8").write(llms)
    print("  wrote llms.txt")

    manifest = {
        "name": "Forward Framework",
        "short_name": "Forward",
        "description": "Web design, AI consulting, automation and marketing built as one growth engine.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#0A0A0A",
        "theme_color": "#0A0A0A",
        "icons": [{"src": "/assets/img/favicon.svg", "sizes": "any", "type": "image/svg+xml"}],
    }
    open(os.path.join(ROOT, "site.webmanifest"), "w", encoding="utf-8").write(
        json.dumps(manifest, indent=2))
    print("  wrote site.webmanifest")


# --------------------------------------------------------------------------
def main():
    print("Building Forward Framework…")
    for s in SERVICES:
        render_service(s)
    render_services_index()
    if SHOW_PRICING:
        render_pricing()
    render_results()
    render_about()
    render_contact()
    render_thank_you()
    render_404()
    render_privacy()
    render_terms()
    render_meta_files()
    print("Done.")


if __name__ == "__main__":
    main()
