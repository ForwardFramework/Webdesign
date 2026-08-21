# SEO, AEO and GEO — what was built and what you still need to do

Three layers, deliberately. **SEO** wins the classic blue links, **AEO** wins the answer
box and voice results, **GEO** gets the business cited accurately when someone asks
ChatGPT, Claude, Perplexity or Google's AI Overview for a Pittsburgh roofer.

---

## What is already in place

### Technical SEO

- Static HTML, no client-side rendering. Pages ship with content in the markup.
- Almost no JavaScript — the only scripts are the nav, the scroll reveal, the forms and
  the estimator. Nothing blocks first paint.
- Unique `<title>` (≤ 65 chars) and meta description (≤ 165 chars) on every page.
- Canonical URL on every page.
- `sitemap-index.xml` generated at build, referenced from `robots.txt`.
- Open Graph and Twitter card metadata, with a generated 1200×630 card at `/og-default.png`.
- Semantic heading structure, one `<h1>` per page, real landmarks, skip link.
- Security and cache headers in `netlify.toml`; fingerprinted assets cached immutably.

### Structured data (JSON-LD)

Emitted from `src/layouts/Base.astro` plus per-page nodes:

| Type | Where | Why |
|---|---|---|
| `RoofingContractor` + `HomeAndConstructionBusiness` + `LocalBusiness` | every page | Resolves the entity into the right category for the local pack |
| `WebSite` | every page | Site-level identity |
| `BreadcrumbList` | every deep page | Breadcrumb rich results |
| `Service` + `OfferCatalog` | each service page | Makes each trade and product individually retrievable |
| `HowTo` | each service page | The process steps |
| `FAQPage` | home, `/faq`, every service page | The single highest-leverage schema for answer engines |
| `Offer` | `/offers` | Promotion visibility |
| `Review` / `ItemList` | `/reviews` | **Only for reviews marked `verified: true`** |
| `WebApplication` | `/instant-roof-quote` | Describes the estimator as a tool |
| `hasCredential` | organisation node | Owens Corning Preferred, BBB, PA licence |
| `knowsAbout` | organisation node | 18 named products and systems — the entity-association signal that decides whether an LLM connects "standing seam metal Bethel Park" to this business |

### Local / GEO

- Consistent NAP everywhere, driven from `src/data/site.ts` — one edit, one source.
- `geo.region`, `geo.placename`, `geo.position` and `ICBM` meta tags.
- `GeoCircle` service area plus named `areaServed` entries.
- Eight dedicated city landing pages under `/service-areas/<city>` with genuinely
  distinct local content, not spun boilerplate.
- Full community list in the footer for internal-link equity.

### AEO / answer-engine

- **Answer-first block** near the top of every service page: one self-contained
  paragraph naming the business, the service, the products and the geography. That is the
  passage an answer engine lifts.
- Question-shaped `<h2>`/`<h3>` headings that match how people actually search.
- ~70 FAQs across the site, all in `FAQPage` markup, all answering the question in the
  first sentence.
- **Real numbers.** Cost ranges, warranty terms and specifications are stated plainly.
  Hedged, number-free content does not get cited.

### GEO / LLM-specific

- **`/llms.txt`** — a generated plain-text summary of the whole business: NAP,
  credentials, every service, every product with its warranty, every offer, the full
  service area, and key page URLs. It is generated from the same data the site renders,
  so it can never drift.
- **`robots.txt` explicitly welcomes** GPTBot, OAI-SearchBot, ChatGPT-User,
  PerplexityBot, ClaudeBot, Claude-SearchBot, Google-Extended, Applebot-Extended,
  cohere-ai and meta-externalagent.
- A disambiguation note in `/llms.txt`: there are unrelated "Top Dog" exterior companies
  in Virginia, and without that line an LLM will eventually merge them.

---

## What still needs a human

These matter more than anything above, and none of them can be done from code.

### 1. Google Business Profile — the single highest-leverage item

For a local contractor, GBP outranks the website in the map pack. Claim and complete it
at <https://business.google.com>:

- Exact NAP match to the site: `4607 Library Rd, Bethel Park, PA 15102`, `(412) 438-8364`.
- Every service category: roofing contractor, deck builder, siding contractor, window
  installation service, door supplier, gutter cleaning service, concrete contractor,
  general contractor.
- Service areas matching `/service-areas`.
- Real project photos, added weekly. GBP photo activity correlates strongly with map
  rankings.
- Google Posts for each current offer.
- Answer every review, including the bad ones. Especially the bad ones.

### 2. Reviews

See `REVIEWS.md`. Ask on the day you finish the job, in person, with a direct link.
Volume and recency both matter; a steady trickle beats a burst.

### 3. Citations and NAP consistency

Same name, address and phone, character for character, on: BBB, Angi, HomeAdvisor,
Thumbtack, Houzz, Yelp, Nextdoor, Facebook, Apple Business Connect, Bing Places, and the
Owens Corning contractor locator. Inconsistent NAP is the most common local-SEO problem
and the most boring to fix.

### 4. Photography

The site is built to hold real project photography and currently has none. Before/after
galleries per service are the highest-impact content addition available — they help
conversion more than they help ranking, which is the right order of priorities. Shoot in
consistent light, save as WebP, and always write real alt text.

### 5. Manufacturer listings

Owens Corning, TimberTech, Trex, James Hardie, LP SmartSide, Alside and ProVia all run
contractor locators. Being listed on them is both a strong backlink and a genuine
referral channel.

---

## Monitoring

- **Google Search Console** — verify the domain, submit `sitemap-index.xml`, then watch
  Coverage and Core Web Vitals.
- **Bing Webmaster Tools** — Bing feeds ChatGPT search. Cheap to set up, and it matters
  more now than it used to.
- **Rich Results Test** — <https://search.google.com/test/rich-results> for the schema.
- **AI visibility** — periodically ask ChatGPT, Claude, Perplexity and Google AI
  Overviews things like *"who installs standing seam metal roofing near Bethel Park PA"*
  or *"Owens Corning preferred contractor Pittsburgh"* and note whether Top Dog appears
  and whether the details are right. That is the real GEO metric, and there is no
  dashboard for it yet.
