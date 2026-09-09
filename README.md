# Angel's Hand Painting LLC — website

Static marketing site for **Angel's Hand Painting LLC** (Sarasota / Bradenton / Lakewood Ranch, FL):
25 indexable pages, no build dependencies, no framework, no JavaScript required to read any page.

> **Quality You Can See. Details You Can Trust.**
> 941-405-2750 · Residential & Commercial · Fully insured

---

## Quick start

```bash
# preview locally
python3 -m http.server 8000
# → http://localhost:8000

# regenerate every HTML file after editing content
python3 tools/build_site.py

# regenerate the logo/favicon SVGs
python3 tools/make_logo.py

# regenerate the social share card + apple touch icon (needs Chrome/Chromium)
python3 tools/make_og.py
```

Deploy by uploading the repository root to any static host — Netlify, Vercel, Cloudflare Pages,
GitHub Pages, or plain shared hosting. There is nothing to compile at deploy time.

---

## ⚠️ Read this before editing

**The `.html` files are generated. Do not hand-edit them** — the next
`python3 tools/build_site.py` overwrites everything.

All copy, services, service areas, reviews and FAQs live in data blocks near the top of
`tools/build_site.py`. Edit there, re-run the script, commit the result.

| To change… | Edit this |
| --- | --- |
| Phone, hours, social links, city, tagline | `BUSINESS` dict in `tools/build_site.py` |
| A service page (copy, bullets, FAQs) | `SERVICES` list |
| A city page | `AREAS` list |
| Google reviews shown on the site | `REVIEWS` list (+ `REVIEW_COUNT`, `RATING`) |
| Site-wide FAQ | `GENERAL_FAQS` |
| Navigation | `NAV` |
| Colours, spacing, components | `assets/css/style.css` |
| Interactions (menu, form, reveals) | `assets/js/main.js` |
| Logo artwork | `tools/make_logo.py` |

---

## Before this goes live — a short checklist

1. **Set the real domain.** Every canonical URL, `og:url`, sitemap entry and JSON-LD `@id` is built
   from `SITE` in `tools/build_site.py` (currently `https://angelshandpainting.com`). Change it and
   rebuild, or build with an override:
   ```bash
   SITE_URL=https://your-real-domain.com python3 tools/build_site.py
   ```
2. **Point the estimate form somewhere real.** See [Forms](#forms) below. Out of the box it is wired
   for Netlify Forms; on any other host it needs an endpoint or it will not deliver leads.
3. **Verify the two social URLs.** `BUSINESS["facebook"]` and `BUSINESS["instagram"]` were built from
   the `@angelshandpaintingllc` handle on the service flyer. The Instagram handle is confirmed; please
   confirm the Facebook page URL resolves.
4. **Swap in the direct Google review link.** `BUSINESS["google"]` currently points at a Google search
   for the business, which always works. Replace it with the Google Business Profile "write a review"
   short link (`https://g.page/r/…`) for a better experience.
5. **Add a street address if the business has a public one.** The JSON-LD currently publishes city,
   region and postal code only (Sarasota, FL 34232 — a service-area placeholder). Google Business
   Profile is the authority for NAP; make the site match it exactly, including the ZIP.
6. **Add real photos.** See [Photography](#photography).
7. **Add analytics** if wanted (GA4 / Search Console / call tracking) — see
   [Analytics hooks](#analytics-hooks).

---

## What's in the site

```
index.html                    Home
about.html                    About the crew
services/index.html           Services hub (grouped: painting / drywall / home improvement)
services/*.html               12 service pages
service-areas/index.html      Service-area hub
service-areas/*.html          6 city pages
reviews.html                  All 7 Google reviews
faq.html                      22 questions, FAQPage schema
contact.html                  Estimate form + NAP + key facts table
thank-you.html                Form success page (noindex)
privacy.html                  Privacy policy (noindex)
404.html                      Not found (noindex)
sitemap.xml robots.txt llms.txt site.webmanifest _headers
assets/css/style.css          Design system
assets/js/main.js             ~150 lines, no dependencies
assets/img/                   Logo set, favicon, social card
tools/build_site.py           Page generator (all site copy lives here)
tools/make_logo.py            Logo/favicon SVG generator
tools/make_og.py              Social card + apple-touch-icon renderer
```

**Services:** interior painting · exterior painting · cabinet painting & refinishing · drywall
installation & repair · popcorn ceiling removal · texture finishes & skim coating · wallpaper
installation · pressure washing · epoxy garage floors · wood stain & finishing · trim, molding &
baseboards · doors, hardware & home repairs.

**Service areas:** Sarasota · Bradenton · Lakewood Ranch · Venice · Palmetto · Siesta Key, plus 12
surrounding communities listed and linked from the hub.

---

## Brand

Colours are taken directly from the logo artwork and defined once as CSS custom properties in
`assets/css/style.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--navy` | `#14315F` | Headings, dark sections, primary buttons |
| `--navy-900` | `#0B1E3D` | Footer, top bar, deepest gradient stop |
| `--blue` | `#3D5FA6` | Logo roof blue, links, accents |
| `--gold` | `#F3B229` | Primary CTA, eyebrows, dividers |
| `--gold-100` | `#FDF1D8` | Answer boxes, service icon tiles |
| `--ink` / `--body` | `#141C29` / `#41506A` | Body copy |

Type: **Barlow Condensed** (600/700) for display headings — the condensed style used on the service
flyer — with **Inter** for body text. Both load from Google Fonts non-render-blocking, with system
fallbacks that keep the layout intact if the fonts never arrive.

### The logo

`assets/img/logo.svg` is a **vector rebuild** of the supplied logo, drawn from the artwork you
provided: the layered gold angel wing, the blue gable roof with chimney and four-pane window, the
serif *ANGEL'S HAND / PAINTING / LLC* lockup with gold rules, and the *Residential & Commercial*
line. Four files are generated by `tools/make_logo.py`:

| File | Use |
| --- | --- |
| `logo.svg` | Full lockup, dark type — header, light backgrounds |
| `logo-white.svg` | Full lockup, reversed — footer, navy backgrounds |
| `logo-mark.svg` | Wing + roof only — square/social contexts |
| `favicon.svg` | Mark on a navy rounded square — browser tab |

**If you have the original vector file** (`.ai`, `.eps` or a clean `.svg` from your designer), use it
instead — it will carry the exact licensed typeface. Export it as `assets/img/logo.svg` and
`assets/img/logo-white.svg` at the same proportions and everything else works unchanged. A PNG works
too; if you swap the extension, update the two `<img src>` references in the `header()` and `footer()`
functions of `tools/build_site.py` and rebuild.

The wordmark in the SVG uses a common serif stack (`Georgia, 'Times New Roman', serif`) with
`textLength` locking each line's width, so the lockup keeps its proportions on any machine.

---

## Forms

Every estimate form is the same component: name, phone, email, service, area, message, plus a hidden
honeypot field and client-side validation with inline errors and phone auto-formatting.

**As shipped it is wired for Netlify Forms** — `data-netlify="true"`, a hidden `form-name` input, and
`action="/thank-you.html"` as the success redirect. Deploy to Netlify and leads appear under
Forms → `estimate-request` with no further work.

**On any other host**, set an endpoint in `tools/build_site.py`:

```python
FORM_ENDPOINT = "https://formspree.io/f/xxxxxxx"   # or Basin, Zapier, your own handler
```

With that set, `assets/js/main.js` posts the form as JSON over `fetch()` and redirects to
`/thank-you.html` on success; failures show an inline message with the phone number. Rebuild after
changing it.

> If you deploy to a host that is neither Netlify nor has `FORM_ENDPOINT` set, the form will submit
> but nothing will receive it. Do not skip this step.

---

## SEO, AEO and GEO

**Technical SEO**
- Unique `<title>` (≈45–64 chars) and meta description (≈110–165 chars) on every page
- Self-referencing canonicals, `robots` directives with `max-image-preview:large`
- Open Graph + Twitter card metadata, with a rendered 1200×630 share image
- `sitemap.xml` with per-page priority, `robots.txt`, `site.webmanifest`
- Semantic HTML, exactly one `<h1>` per page, descriptive alt text, breadcrumb nav on every
  inner page
- No render-blocking JavaScript; fonts load async; `_headers` sets long-lived caching for
  `/assets/*` plus basic security headers
- Deep internal linking: services ↔ related services ↔ service areas ↔ hubs

**Structured data** (JSON-LD `@graph`, one block per page)
- `HomeAndConstructionBusiness` + `PaintingContractor` + `LocalBusiness` with NAP, geo coordinates,
  `areaServed` (18 cities), `serviceArea` radius, opening hours, `sameAs`, `hasOfferCatalog`
  (all 12 services) and `makesOffer` (free estimate)
- `Service` on every service and city page, `FAQPage` on every page with a visible FAQ,
  `BreadcrumbList`, `WebSite`, `WebPage`, `AboutPage`, `ContactPage`, `ItemList` on hubs
- `speakable` markers on the answer boxes and H1s

**AEO (answer engines)**
- Every service and city page opens with a *Short answer* / *In short* box: a direct, ~55-word
  answer to the page's core question, matched by the `speakable` selector and quotable as-is
- Questions are phrased the way people actually ask them, answered in the first sentence
- A key-facts table on every city page and on the about/contact pages (business, phone, hours,
  rating, insurance, languages) — the kind of block answer engines lift from

**GEO (AI search)**
- `/llms.txt` gives crawlers a structured plain-text summary: key facts, all services with URLs,
  all service areas, the full FAQ, and the verbatim reviews
- `robots.txt` explicitly welcomes GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User,
  PerplexityBot, Google-Extended, Applebot-Extended and Bingbot
- Consistent entity naming: the full legal name plus city appears in the first 100 words of every
  page, and NAP is byte-identical everywhere it appears

### One caveat on review markup

The `aggregateRating` and `review` nodes describe the real Google reviews, but they are *self-serving*
markup (a business publishing its own ratings). **Google does not show rich-result stars for
self-serving reviews** — it may simply ignore those nodes. They are included because Bing and AI
answer engines do read them, and because the data is accurate. The authoritative source for the star
rating remains the Google Business Profile, which every review block on the site links to.

Keep `REVIEW_COUNT` and `RATING` in `tools/build_site.py` in sync with the actual Google profile.
Review dates are month-precision (`2026-08`) because Google displays them relatively ("a month ago").

---

## Conversion features

- Click-to-call phone number in the top bar, header, hero, every section CTA and the footer
- Sticky call/estimate bar fixed to the bottom of the screen on phones
- Estimate form above the fold on the home page, and sticky alongside the copy on every service and
  city page
- Social proof placed early: star rating in the hero, trust bar under it, review cards on every page
- Objection handling: fully insured, free written estimates, itemised pricing, daily clean-up,
  bilingual crew, "we'll tell you if it isn't worth doing"
- `data-cta="…"` attributes on every call and estimate link so click sources can be tracked without
  touching markup later

---

## Photography

The site ships **without stock photography on purpose** — invented before/after images would
misrepresent the work. The layout is built to absorb real photos wherever you have them:

- Hero: a photo can sit behind the navy gradient (add a `background-image` to `.hero::before`)
- Service pages: drop a figure directly above each `<h2>` in the service page template
- A gallery or before/after page is a natural addition once photos are collected

Best first shots to collect: two or three genuine before/after pairs per service (cabinets, exterior,
interior, drywall, wallpaper), plus one photo of the crew and one of a marked truck.

---

## Analytics hooks

No tracking is installed. To add GA4, insert the tag in the `head()` function of
`tools/build_site.py` and rebuild once. Every call and estimate link already carries a stable
`data-cta` attribute (`hero-call`, `sticky-call`, `header-quote`, `quote-submit`, …), so conversions
can be wired up without editing 25 pages.

---

## Accessibility

Skip link, visible `:focus-visible` rings, labelled form fields with `aria-invalid` and live error
regions, an `aria-expanded` mobile menu that closes on Escape, native `<details>` accordions that work
without JavaScript, `role="img"` + `aria-label` on star ratings, `prefers-reduced-motion` respected
throughout, and AA-or-better contrast on body text and buttons.

---

## Design tooling in this repo

The `.claude/skills/` directory and `.mcp.json` are the vendored UI/UX design skills and the 21st.dev
MCP server that this repository started as; they are unrelated to the website itself and can be
removed if you only want the site. See `.claude/skills/VENDORED.md`.
