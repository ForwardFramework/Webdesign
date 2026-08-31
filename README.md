# Acosta Pro Aluminum Screen — website

Static marketing site for **Acosta Pro Aluminum Screen LLC**, a screen and aluminum
contractor serving Sarasota, Manatee and Charlotte County, Florida.

**Read [CONTENT-TO-VERIFY.md](CONTENT-TO-VERIFY.md) before launching.** It lists the
handful of facts I couldn't verify and the two files where you drop in your logo and
job photos.

---

## Quick start

```bash
python3 site/build.py            # build to dist/
python3 site/build.py --serve    # build, then preview at http://localhost:8000
```

No dependencies. Python 3.8+ and nothing else — no npm, no build toolchain.

`dist/` is committed, so you can deploy it as-is without running anything.

---

## What's here

25 pages, all statically generated:

| | |
|---|---|
| Homepage | Hero, trust bar, services, proof, process, gallery, reviews, FAQ |
| 6 service pages | Pool cages · lanais · screen doors · window screens · storm damage · aluminum |
| 8 city pages | Sarasota · Bradenton · Venice · North Port · Port Charlotte · Punta Gorda · Lakewood Ranch · Englewood |
| Hubs | `/services/` and `/service-areas/` |
| Proof | `/reviews/` (all 14) and `/gallery/` |
| Support | `/faq/` (20 Q&As) · `/about/` · `/contact/` · `/thank-you/` · `/privacy/` · `404` |

Plus `sitemap.xml`, `robots.txt`, `llms.txt`, `site.webmanifest`, `_headers`, `_redirects`.

---

## Editing content

Everything lives in five plain Python files. You don't need to touch HTML.

| File | Holds |
|---|---|
| `site/config.py` | **Phone numbers, hours, address, brand colors, domain, form endpoint, analytics IDs** |
| `site/content_services.py` | The 6 service pages — copy, tables, FAQs |
| `site/content_areas.py` | The 8 city pages — ZIP codes, neighborhoods |
| `site/content_reviews.py` | Customer reviews |
| `site/content_pages.py` | Site-wide FAQs, gallery manifest, homepage sections |

Change one, run `python3 site/build.py`, and every page that uses it updates —
including the structured data, the sitemap and `llms.txt`.

### Common edits

**Change a phone number** — `site/config.py`, `phone_primary` / `phone_secondary`.
It updates in the header, footer, sticky mobile bar, every CTA, all `tel:` links
and the structured data in one shot.

**Change the brand colors** — `BRAND` in `site/config.py` documents the palette,
and `:root` at the top of `site/static/css/styles.css` is what actually drives it.
Sample the colors from your logo, replace the `--navy-*` and `--orange-*` values,
and the entire site follows. Contrast ratios are noted in comments — keep white
text on backgrounds at 4.5:1 or better.

**Add a review** — append to `REVIEWS` in `site/content_reviews.py`. The star
average, the review count and the `aggregateRating` in the structured data all
recompute themselves.

**Add a service or a city** — copy an existing entry in `content_services.py` or
`content_areas.py` and edit it. The page, its nav entry, its sitemap row, its
internal links and its schema are all generated.

**Add photos** — drop files in `site/static/img/gallery/`. See CONTENT-TO-VERIFY.md
for the filenames.

---

## Deploying

`dist/` is a plain folder of static files. Anything can host it.

**Netlify** (recommended — the contact form works with zero setup)
```
Build command:      python3 site/build.py
Publish directory:  dist
```

**Cloudflare Pages / Vercel** — same two settings. `_headers` and `_redirects` are
already written for Netlify and Cloudflare.

**Any other host** — run `python3 site/build.py` and upload `dist/`.

Set `SITE_URL` in `site/config.py` to your real domain first. Canonical tags, the
sitemap and all structured data are built from it.

---

## How this site is built to rank

Three overlapping jobs: classic SEO (rank in Google's blue links), AEO (get
quoted in AI Overviews and voice answers), and GEO (be the source ChatGPT,
Perplexity and Claude cite when someone asks about screen work in Sarasota).

**Structured data.** Every page emits one JSON-LD `@graph` where entities
cross-reference by `@id`, rather than repeating disconnected blobs. A crawler
reads it as *this Service is offered by this LocalBusiness in these Cities* — one
business entity, one graph, sitewide. Layered per page: `Service` on service
pages, `FAQPage` wherever there are FAQs, `BreadcrumbList`, `ImageGallery` on the
gallery, and all 14 `Review` nodes plus `AggregateRating` on the reviews page.

**Answer capsules.** Every significant page opens with a `.answer-capsule` — a
40–60 word paragraph that answers the page's core question and makes sense lifted
out of context, because that's exactly what an AI answer engine does with it. They
carry `speakable` markup for voice assistants.

**Tables.** The materials, cost-factor and comparison tables are there on purpose.
Structured facts get extracted and quoted far more reliably than the same
information buried in prose.

**`llms.txt`.** A plain-language brief at the site root: who the business is, what
it does, where it works, and a "facts an answer should get right" section covering
screen lifespan, mesh types and permit rules. This is the emerging convention for
telling language models about a business directly.

**`robots.txt` allows AI crawlers deliberately.** GPTBot, ClaudeBot,
PerplexityBot, OAI-SearchBot, Google-Extended and the rest are explicitly allowed.
For a local service business, being quotable in an AI answer is a lead source you
can't buy. SEO scrapers with no upside (Semrush, Ahrefs, MJ12) are blocked.

**Local signals.** Identical NAP data in every footer and every schema block. One
page per city with real ZIP codes and neighborhoods. `areaServed` listing both
counties and cities. Geo meta tags.

**Conversion.** Both phone numbers are one tap away from anywhere: sticky header,
sticky mobile bottom bar, every CTA band, the footer. Trust signals (5.0 rating,
free estimates, licensed, bilingual) sit above the fold and repeat under every
page header. The form asks for six fields and only two are required.

**Core Web Vitals.** No framework, no jQuery, ~14KB of CSS, ~3KB of JS. Fonts load
async with `display=swap`. Every image has explicit `width`/`height` so nothing
shifts as it loads. Icons are inline SVG — no icon font, no extra request.

**Accessibility.** WCAG AA contrast throughout (ratios are documented in the CSS),
visible focus rings, 44px+ touch targets, a skip link, semantic landmarks, and
`prefers-reduced-motion` respected. Accessibility and SEO are the same discipline
from two directions.

---

## Build checks

`build.py` fails loudly on the things that quietly cost money:

- title tags over 65 characters (truncated in search results)
- meta descriptions outside 70–165 characters
- internal links pointing at pages that don't exist

Run `python3 site/build.py` and it reports. Clean output means all three passed.

---

## Design tooling in this repo

This repo also carries the vendored [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
skills in `.claude/skills/` and the [21st.dev](https://21st.dev) MCP server in
`.mcp.json`. Neither is needed to build or deploy this site — they are design
tooling for Claude Code sessions in this workspace.

Setup and troubleshooting: **[docs/design-tooling.md](docs/design-tooling.md)**.
