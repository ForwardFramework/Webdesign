# Top Gun Roofing LLC — website

A hand-built static site. No framework, no runtime dependencies, no build step required
to deploy or edit. Everything in this `site/` folder is the finished website — upload it
to any host and it works.

---

## Before you launch — 7 things to change

These are the only items that are not finished. Everything else is production-ready.

| # | What | Where |
|---|---|---|
| 1 | **Replace the placeholder images** with the real logo and job photos | `assets/img/` — see [`assets/img/README.md`](assets/img/README.md) for the exact filenames |
| 2 | **Set the real domain.** Canonicals, the sitemap, Open Graph tags and JSON-LD all use it | `../build/data.js` → `origin` |
| 3 | **Connect the estimate form.** It currently posts to `YOUR_FORM_ID` | See "Making the form work" below |
| 4 | **Add your Google Business Profile URL** so search engines link the site to your listing | `../build/data.js` → `sameAs` |
| 5 | **Verify the rating and review count** against your live Google profile | `../build/data.js` → `rating`, `reviewCount` |
| 6 | **Confirm you offer siding.** It was included based on the brief but is not mentioned in any review | `../build/data.js` → remove the `siding` entry if not |
| 7 | **Add your PA contractor registration number.** Pennsylvania requires HIC registration (`PA######`) and displaying it builds trust | `../build/templates.js` → footer |

After changing anything in `build/`, run `node build/build.js` from the repository root.

---

## Deploying

The site is plain static files. Any of these work with zero configuration:

**Netlify** (recommended — the form works out of the box)
```bash
# Drag the `site` folder onto app.netlify.com, or:
npx netlify-cli deploy --dir=site --prod
```
`_redirects` and `_headers` are already written for Netlify (pretty URLs, a real 404,
security headers, and a one-year cache on `/assets`).

**Vercel** — `npx vercel --prod site`
**Cloudflare Pages** — connect the repo, set the output directory to `site`
**GitHub Pages** — push `site/` to a `gh-pages` branch
**Traditional host** — FTP the contents of `site/` to `public_html`

Point the domain at the host, then submit `https://yourdomain.com/sitemap.xml` in
[Google Search Console](https://search.google.com/search-console) and
[Bing Webmaster Tools](https://www.bing.com/webmasters).

---

## Making the form work

The estimate form appears on the home page, every service page, every city page and the
contact page. Pick one option:

**Formspree** (works on any host)
1. Create a free form at [formspree.io](https://formspree.io).
2. In `build/templates.js`, replace `YOUR_FORM_ID` with your form ID.
3. Run `node build/build.js`.

**Netlify Forms** (if hosting on Netlify)
In `build/templates.js`, change the opening form tag to:
```html
<form data-validate netlify netlify-honeypot="company" novalidate>
```
Submissions then appear in the Netlify dashboard. A honeypot field named `company` is
already in the markup for spam filtering.

Until one of these is done the form validates correctly but submissions go nowhere.
**The phone links work regardless** — and for a roofing business most leads call.

---

## Editing content

Two ways, both valid:

**Edit the HTML directly.** The files in `site/` are readable static HTML. Change a
sentence, save, upload. Nothing to install.

**Edit the source data and regenerate** — better when a change affects many pages
(a new service, a new town, a phone number change), since all 32 pages share one header,
footer and schema block.

```bash
node build/build.js     # regenerates every page in ~1 second
```

| File | Contains |
|---|---|
| `build/data.js` | Phone, email, hours, rating, service area, and all 7 services with their copy, fact tables and FAQs |
| `build/cities.js` | The 16 service-area towns and their unique local copy |
| `build/reviews.js` | All 23 Google reviews (owner replies already removed) |
| `build/templates.js` | Header, footer, forms, FAQ blocks and all structured data |
| `build/icons.js` | The inline SVG icon set |
| `build/pages-*.js` | Individual page layouts |

### Adding a new town
Add an entry to `build/cities.js` and run the build. The page, its schema, its sitemap
entry, and every internal link to it are generated automatically.

---

## What's in the site

**32 pages** — home, services index + 7 service pages, service-areas index + 16 city
pages, reviews, gallery, about, contact, privacy, 404.

### Search (SEO)
- Unique title and meta description on every page, all within Google's truncation limits
- Canonical URLs, Open Graph and Twitter Card tags
- `sitemap.xml` (31 URLs, with image entries) and a `robots.txt`
- Semantic HTML with exactly one `<h1>` per page and a clean heading hierarchy
- Breadcrumb navigation, marked up with `BreadcrumbList`
- Descriptive, location-aware image alt text
- Internal linking between services, cities and the conversion pages
- Fast by construction: one 34 KB stylesheet, 5 KB of deferred JS, no framework,
  lazy-loaded images with explicit dimensions so nothing shifts as the page loads

### Answer engines (AEO)
- `FAQPage` structured data on the home page and every service and city page
- An **answer box** at the top of each service and city page: a direct, self-contained
  40–60 word answer to the page's core question, which is the shape featured snippets
  and AI summaries extract
- Key-facts tables on every service and city page — easy for machines to parse
- Questions phrased the way people actually search ("how much does a new roof cost in
  Pittsburgh?") rather than as marketing headings

### Generative engines (GEO)
- `llms.txt` — a factual, structured summary of the business for LLM crawlers
- `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
  Applebot, Amazonbot, meta-externalagent and others. Blocking them removes the business
  from AI-generated answers, which a growing share of homeowners now use
- A `RoofingContractor` schema graph on every page with `areaServed`, `knowsAbout`,
  `hasOfferCatalog`, opening hours, geo-coordinates and real reviews
- Concrete, quotable factual statements throughout (specific materials, real timelines,
  actual Pittsburgh rainfall and snowfall figures) rather than vague marketing claims —
  AI systems cite specifics and skip fluff
- A disambiguation note in `llms.txt`: several unrelated businesses trade as "Top Gun
  Roofing" in other states, and this tells AI systems not to merge their details

### Conversion
- Click-to-call in the header, footer, every CTA band and a sticky mobile bar
- The estimate form appears on all 25 landing pages, sticky on desktop so it stays visible
- Trust signals repeated at every scroll depth: 5.0 rating, licensed and insured,
  veteran-owned, free estimates
- Real reviews with names throughout, plus a dedicated reviews page
- A 5-step process section that removes uncertainty before the ask
- Inline form validation with real error messages, and a spam honeypot

### Accessibility
- Skip-to-content link, visible focus rings, full keyboard navigation
- All text meets WCAG AA contrast (4.5:1); the palette was picked against the logo colours
  and checked, not guessed
- 44×44px minimum touch targets
- Labelled form fields with `aria-invalid` and `role="alert"` error messaging
- SVG icons with `aria-hidden`, never emoji
- `prefers-reduced-motion` respected throughout

---

## Brand

Colours sampled from the logo. Defined once as CSS custom properties in
`assets/css/styles.css`:

| Token | Value | Use |
|---|---|---|
| `--tg-gold` | `#F0B323` | Primary CTA, accents, headings on dark |
| `--tg-gold-deep` | `#C6871A` | Gold text on light backgrounds (contrast-safe) |
| `--tg-black` | `#0E0E10` | Header, footer, hero, dark sections |
| `--tg-charcoal` | `#17171A` | Raised surfaces on dark |
| `--tg-cream` | `#F2EAD8` | From the logo's outline |

Type: **Anton** for display headings (closest free match to the logo's heavy block
lettering) and **Inter** for body text.

---

## Known limitations

- **Star ratings won't show in Google results.** Google does not display rich-result stars
  for reviews a business publishes about itself. The `aggregateRating` markup is still
  worth keeping — AI answer engines do read it — but the stars in Google come from your
  Google Business Profile, not from this site.
- **Review dates are relative** ("3 months ago"), exactly as Google displayed them. No
  `datePublished` was invented for the schema.
- **Truncated reviews.** Ten reviews were cut off by Google's own "… More" link. Only the
  text actually shown is reproduced, ending in "…". Nothing was written to fill the gaps.
  To restore them in full, copy the complete text from your Google profile into
  `build/reviews.js` and set `truncated: false`.
