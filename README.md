# Forward Framework — Website

A static, dependency-free marketing website for **Forward Framework** (web design, AI consulting,
automation, marketing, ad management, social media marketing).

Built by reverse-engineering the highest-traffic, highest-converting US agency websites, then
rebuilding their best patterns into one site under the Forward Framework brand — and optimised for
**SEO, GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization)**.

---

## 1. Research: the five sites reverse-engineered

Chosen for a combination of organic traffic scale and documented conversion performance in the
US agency market.

| Site | Why it's here | What was taken |
|---|---|---|
| **WebFX** | Among the highest-traffic agency domains in the US; enormous organic content footprint | Hard-number proof band, service-by-service depth, transparent pricing tables, "free proposal" as the single dominant offer |
| **KlientBoost** | Proposal requests are their primary acquisition metric; publishes its own CRO methodology | **"Free Marketing Plan" instead of "free consultation"**, click-triggers directly under every CTA to handle objections, personalised hero |
| **SmartSites** | 360+ verified reviews; consistently top-ranked on Clutch | **Lead form inside the hero**, phone number in the global header, wall of partner badges below the form, results pages with real numbers |
| **Neil Patel Digital / NP Digital** | Authority-first model built on a massive content and free-tool footprint | Free interactive tool as top-of-funnel, question-shaped content architecture (the basis of the GEO/AEO layer) |
| **Hook Agency** | Radical pricing transparency in an industry that hides it | **Published prices**, layered conversion paths (read / watch / call / book), and a tagline that names exactly who the agency is for |

Supporting patterns from Thrive Internet Marketing and Ignite Visibility: phone number in the global
header, industry-specific landing pages, proof placed above the fold.

**Cross-cutting findings applied:**

- Interactive lead magnets (quizzes, calculators, instant audits) convert roughly **2.4× static PDF downloads**.
- Free audits convert only 1–3% of visitors — but those leads convert to qualified at a far higher rate.
- Burying social proof below the fold measurably weakens performance.
- A single dominant CTA outperforms competing CTAs.
- Section order that maps to how a skeptical buyer evaluates: hero → social proof → problem/outcome → solution → evidence → close.

### Highest-converting offer per service

Every service leads with a **real deliverable**, not a "book a call" button.

| Service | Offer | Rationale |
|---|---|---|
| Web Design | Free **homepage concept** — actually designed | Interactive/personalised beats a static checklist; shows the work instead of describing it |
| AI Consulting | Free **AI Opportunity Audit** → $1,999 Readiness Sprint → build | The "audit gateway": a small paid diagnostic anchors and de-risks a large build. Framing it as strategic advisory (not a technical audit) commands 20–40% higher rates |
| Automation | Free **automation blueprint** (60-min session + hours/dollars returned) | Sells an absence; the number has to be produced before the buyer believes it |
| Marketing / SEO | Free **AI Search Visibility Report** | The 2026 differentiator — shows the buyer a transcript of an AI recommending their competitors |
| Ad Management | Free **ad account audit** | Most audited accounts hide 20–40% wasted spend; a dollar figure is the entire pitch |
| Social Media | Free **30-day content plan**, 10 scripted posts | Immediately usable, which is exactly why it earns the reply |
| Scaffold (business systems) | Free **Key-Person Risk Map** | Names the processes that live only in someone's head and ranks them by revenue at risk — a problem owners feel but have never seen written down |

---

## 2. Design system

The brand mark supplied the entire system: black field, white primary, warm taupe secondary,
45-degree chamfers, and wide-letterspaced geometric caps.

```
--ink        #0A0A0A   page field            --white      #FFFFFF   primary
--ink-2/3/4  #0F0F0F / #151515 / #1C1C1C     --taupe      #A99A8C   secondary / CTA
--bone       #EFEBE6   light sections        --taupe-lt   #C9BCAF   hover / emphasis
--text       #C9C6C1   body                  --taupe-ink  #6B5E52   taupe on light
--muted      #8B8681   secondary text
```

- **Display:** Jost (a Futura-like geometric that matches the logo's wordmark) · **Body:** Inter
- **Chamfer motif:** `clip-path` cuts the bottom-right corner of buttons, cards and panels, echoing the 45° cuts in the FF monogram.
- **Structure:** Swiss/minimalist grid, thin 1px rules, generous whitespace, no decorative gradients beyond one soft radial in the hero.

The `ui-ux-pro-max` skill was run for this build. Its **pattern** and **style** matches were adopted
directly — *Trust & Authority + Conversion* (security badges, case studies, transparent pricing,
low-friction form) and *Minimalism & Swiss Style* (geometric, grid-based, high contrast). Its
generated **palette and font pairing were not** adopted: the query returned a navy/gold corporate
palette with EB Garamond, which conflicts with the supplied brand. Brand assets win.

Its accessibility and forms guidance **was** applied in full — see §4.

---

## 3. SEO / GEO / AEO implementation

**Traditional SEO**
- Semantic HTML5, exactly one `<h1>` per page, descriptive `<title>` and meta descriptions
- Canonical URLs, Open Graph + Twitter cards, `sitemap.xml`, breadcrumbs (markup + schema)
- No framework, no render-blocking JS (`defer`), fonts loaded async with `display=swap`
- Explicit image dimensions and CLS-safe layout; target LCP < 2.5s, INP < 200ms, CLS < 0.1

**AEO (Answer Engine Optimization)**
- A **direct 40–60 word answer** opens every key section (`.answer` blocks) and every FAQ
- H2s written as the questions buyers actually ask
- `FAQPage` schema on every major page, **word-for-word identical** to the visible on-page copy
- `speakable` specification pointing at the answer and FAQ selectors

**GEO (Generative Engine Optimization)**
- Full JSON-LD `@graph`: `Organization`, `ProfessionalService`, `WebSite`, `WebPage`, `Service`,
  `OfferCatalog`, `BreadcrumbList`, `FAQPage`, `HowTo` — with `sameAs` entity links
- **`llms.txt`** at the root: a clean markdown index of services, pricing, method and contact
- **`robots.txt` explicitly allows** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai,
  PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Amazonbot and meta-externalagent
- Speed matters here specifically: AI crawlers time out in ~1–5 seconds
- `dateModified` on every page to support a freshness cadence

> **Deliberately omitted:** `AggregateRating` and `Review` schema. Publishing invented ratings risks a
> Google manual action. Add these only once real, verifiable reviews exist.

---

## 4. Accessibility

- Contrast audited programmatically across the palette — every text pair meets **WCAG AA (4.5:1)**.
  Three failures found and fixed (partner logos 3.68:1, placeholders 3.41:1, breadcrumb separators 2.12:1).
- Skip link, visible `:focus-visible` rings, full keyboard navigation, `aria-expanded` on disclosures
- Forms: visible labels, inline errors linked by `aria-describedby`, `aria-invalid` toggling,
  **a focusable `role="alert"` error summary** that links to each invalid field, and validation on blur
- Touch targets ≥ 44px with `touch-action: manipulation`
- `prefers-reduced-motion` fully respected; scroll reveals are progressive enhancement only, so all
  content is visible without JavaScript — which also matters for AI crawlers that don't execute JS

---

## 5. Structure

```
index.html                  Homepage — the full composite build
services/                   Hub + 7 service pages (each with its own offer, pricing, FAQ, schema)
pricing.html                Every price for all seven services
results.html                Case studies
about.html                  Positioning, principles, the five-phase method
contact.html                Growth Plan form
thank-you.html / 404.html   noindex
privacy.html / terms.html   Legal templates — have counsel review
robots.txt sitemap.xml llms.txt site.webmanifest
assets/css/styles.css       Complete design system (one file, no build step)
assets/js/main.js           Nav, multi-step form, validation, calculator, reveals (no dependencies)
assets/img/                 SVG logo mark, lockup, favicon, OG image
tools/build.py              Page generator — see below
```

### The generator

`index.html` is hand-authored and is the **single source of truth for the site shell**. `tools/build.py`
extracts the header, utility bar, footer and mobile CTA from it and stamps every other page, so
navigation can never drift between pages.

```bash
python3 tools/build.py      # regenerates all pages + robots.txt, sitemap.xml, llms.txt
```

Edit `index.html` for shell changes, `tools/build.py` for service copy/pricing, then rebuild.

### Deployment bundles

```bash
python3 tools/build_zip.py       # -> dist/forward-framework-site.zip (upload to any static host)
python3 tools/build_preview.py   # -> dist/single-file/index.html (one self-contained file)
```

`forward-framework-site.zip` is the real multi-page site — 27 files, separate
URLs, per-page canonicals, sitemap. **Use this whenever the host accepts file
uploads**; it is the version the SEO/GEO/AEO work was built for.

`single-file/index.html` is the whole site in one complete HTML document for
hosts that only offer a single paste box. It carries the homepage's meta tags
and JSON-LD, and a client-side router swaps the other 16 pages into `<main>`.
Trade-off: one URL for the whole site, so per-page canonicals, the sitemap and
per-page schema stop applying, and `og:image` needs a real hosted image before
social previews work.

### Source code bundle

```bash
python3 tools/build_source_pdf.py    # -> dist/forward-framework-source.{html,txt}
```

Renders every file into one print document, plus a plain-text bundle. To produce
the PDF, print `dist/forward-framework-source.html` to PDF (Letter, landscape) or
use headless Chromium.

Note on copy-paste: PDF text layers have no concept of line continuity, so a
source line long enough to wrap visually extracts with a newline at the wrap
point. Measured round-trip is 93% of non-blank lines; every failure is a line
over ~170 characters, and none is a short line. Use the `.txt` bundle when the
code needs to be pasted back out intact — it is byte-for-byte lossless.

### Single-file preview

```bash
python3 tools/build_preview.py   # -> dist/preview.html (gitignored, regenerable)
```

Bundles all 16 pages into one self-contained HTML file with a small client-side
router, for sharing a clickable preview where the multi-file site can't be hosted.
Only one page is in the DOM at a time, so element IDs never collide. The
production site is unaffected — it needs no JavaScript to be read.

`assets/js/main.js` is split into `initShell()` (header and nav, runs once) and
`initPage(root)` (everything inside `<main>`, re-runnable), which is what lets
swapped-in content wire itself up exactly as a fresh page load would.

---

## 6. Before launch — required changes

Everything below is a placeholder and is marked in the source.

| What | Current value | Where |
|---|---|---|
| **Phone** | `(555) 012-3456` (reserved fictional range) | All pages, JSON-LD, `llms.txt` |
| **Email** | `hello@forwardframework.com` | All pages, JSON-LD, `llms.txt` |
| **Domain** | `https://forwardframework.com` | `SITE` in `tools/build.py`, canonicals, `sitemap.xml`, `robots.txt` |
| **Form endpoint** | `REPLACE_WITH_YOUR_FORM_ENDPOINT` | Every `data-endpoint` attribute. Until set, forms log the payload to the console and show the success state so the flow stays testable |
| **Social profiles** | `linkedin.com/company/forwardframework` etc. | Footer + `sameAs` in JSON-LD |
| **Case studies** | Illustrative examples, marked `PLACEHOLDER` in HTML comments | `results.html`, `index.html` |
| **Testimonials** | Illustrative, marked `PLACEHOLDER` | `index.html` |
| **Review count** | "Rated 5.0 by owners…" in the hero | `index.html` |
| **Partner badges** | Text placeholders | Trust bar in `index.html` |
| **Postal address** | Intentionally absent from schema | Add `PostalAddress` + `LocalBusiness` once HQ is confirmed — it materially helps local SEO |
| **Legal pages** | Templates | `privacy.html`, `terms.html` — have counsel review |
| **Pricing** | Set by the client. Web/AI/automation/marketing/ads/social/Scaffold starting prices are the figures supplied, not market benchmarks | Confirm against your actual cost model |

Then: verify in Google Rich Results Test and Search Console, submit the sitemap, and add analytics
(the form handler already pushes a `generate_lead` event to `dataLayer` if GTM is present).

---

## 7. Deployment

Hosted on Vercel. See **[DEPLOY.md](DEPLOY.md)** for the full walkthrough,
including the production-branch setting (this repo has no `main`) and the
domain switch that has to happen at launch.

```bash
python3 tools/set_domain.py https://your-domain.com   # rewrites + rebuilds everything
```

## 8. Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

No build step, no dependencies, no framework. Deploys as-is to any static host.
