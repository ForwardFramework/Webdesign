# osasconstructiongroup.com

Marketing website for **Osas Construction Group** — a licensed, insured general contractor in
Pittsburgh, PA. Static HTML, no framework, no runtime dependencies, deployed on Netlify.

- **36 pages** — home, 16 service pages, 11 service-area pages, about, FAQ, contact, legal, 404
- **Zero third-party requests on load** — fonts self-hosted, the map only loads if a visitor clicks
- **Built for SEO, AEO and local/GEO search** — see [Search](#search) below

---

## Quick start

```bash
python3 site/build.py        # regenerate every page into public/
npx serve public             # preview at http://localhost:3000
```

That is the whole toolchain. Python 3.7+ standard library, nothing to install.

## Layout

```
site/                 content + generator (edit here)
  business.py         name, phone, email, licenses, hours, social links, icons
  services.py         the 16 service pages
  areas.py            the 11 service-area pages
  pages.py            home, about, contact, FAQ, privacy, 404 copy
  build.py            templates, schema markup, page renderers
public/               generated site — this is what Netlify publishes
  assets/css/site.css   design system (hand-maintained, never generated)
  assets/js/site.js     ~100 lines: mobile nav, scroll reveal, map loader
  assets/fonts/         Barlow + Barlow Condensed, latin subset, self-hosted
  assets/img/           brick mark, arched logo, social share image
netlify.toml          build command, headers, caching, short-URL redirects
```

**Content lives in `site/*.py`, presentation lives in `public/assets/`.** The generated HTML in
`public/` is committed so the site can be deployed with no build step at all, but Netlify also
runs `python3 site/build.py` on every push so the two can never drift.

### Changing content

| To change | Edit | Then |
|---|---|---|
| Phone, email, licenses, hours, social links | `site/business.py` | `python3 site/build.py` |
| A service page's copy, scope list or FAQs | `site/services.py` | `python3 site/build.py` |
| A town page | `site/areas.py` | `python3 site/build.py` |
| Homepage or About copy | `site/pages.py` | `python3 site/build.py` |
| Colors, spacing, type | `public/assets/css/site.css` | nothing — it is served directly |

Adding a service is one dict in `SERVICES`; the page, the nav entry, the footer link, the sitemap
entry, the schema markup and the estimate-form dropdown all follow automatically.

---

## Deploying to Netlify

1. **New site → Import an existing project → GitHub →** this repository.
2. Netlify reads `netlify.toml`, so the build command (`python3 site/build.py`) and publish
   directory (`public`) are already set. Leave them as they are.
3. Deploy. First build takes well under a minute.
4. **Add the custom domain** (Domain management → Add a domain) and let Netlify provision the
   TLS certificate. Point the apex `A`/`ALIAS` record and the `www` CNAME at Netlify.
5. **Set the primary domain** to whichever of `osasconstructiongroup.com` or
   `www.osasconstructiongroup.com` you want; Netlify 301-redirects the other automatically.

> If the domain ends up different from `https://osasconstructiongroup.com`, change `site_url`
> in `site/business.py` and rebuild — it feeds every canonical URL, the sitemap and the schema.

### The estimate form

The contact form is a **Netlify Form** (`name="estimate"`), so submissions need no backend and no
API key. After the first deploy:

- **Site configuration → Forms → Form notifications → Add notification → Email notification**
  and enter the address that should receive leads. *Do this before handing the site over — until
  it is set, submissions are captured in the Netlify dashboard but nobody is emailed.*
- Spam is filtered by a honeypot field (`bot-field`); no CAPTCHA, no friction for real customers.
- Submissions land at Netlify → Forms, and the visitor is sent to `/thank-you/`.

### Analytics

None is installed — no Google Analytics, no pixel, no cookie banner needed. If you want traffic
data, Netlify Analytics is server-side (nothing to add to the page). If you prefer GA4, add the
tag to the `document()` head in `site/build.py` and update `Content-Security-Policy` in
`netlify.toml` and the privacy policy in `site/pages.py`.

---

## Search

### SEO

- One `<h1>`, a clean heading hierarchy and semantic landmarks on every page
- Unique `<title>` (≤ 62 characters) and meta description (≤ 160) per page
- Canonical URLs, Open Graph and Twitter card metadata, a 1200×630 share image
- `sitemap.xml` and `robots.txt` generated from the page list, so they cannot go stale
- Breadcrumbs, dense internal linking (service ↔ service, service ↔ area)
- Self-hosted fonts, one 30 KB stylesheet, one 4 KB script, no render-blocking third parties
- Long-lived immutable caching for fonts and images; HTML always revalidates

### AEO — answer engines

- Every page opens with a **direct-answer block**: a 40–70 word self-contained answer to the
  question that page exists to answer. That is what gets quoted by AI assistants.
- `FAQPage` schema on the home page, all 16 service pages, all 11 area pages and the FAQ page
- `speakable` markup pointing at the answer block and `h1`
- `/llms.txt` — a plain-text summary of the business, its licenses, published rates, services and
  service areas for LLM crawlers
- `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot and friends

### GEO — local search

- `GeneralContractor` / `LocalBusiness` schema with geo coordinates, a 48 km service radius,
  license numbers as `identifier` entries, opening hours and a full `OfferCatalog`
- `Service` schema on every service page and every area page, scoped to `areaServed`
- 11 town pages with genuine local substance — housing stock, terrain, permitting authority —
  rather than one template with the town name swapped
- NAP (name, address, phone) identical everywhere it appears
- `geo.region`, `geo.position` and `ICBM` meta tags

---

## Before launch

A short list of things only the owner can supply or confirm. Each is one edit in
`site/business.py` unless noted.

| Item | Where | Note |
|---|---|---|
| **Set up form notifications** | Netlify dashboard | Otherwise leads sit unread |
| Facebook and Instagram URLs | `business.py` → `facebook`, `instagram` | Empty = link hidden, not broken |
| Google Business Profile URL | `business.py` → `google_profile` | Feeds `sameAs` in the schema |
| Real business hours | `business.py` → `hours` | Placeholder is Mon–Fri 7–6, Sat 8–4 |
| Street address and ZIP | `business.py` → `street`, `postal` | Only if you want a verified address indexed rather than a service-area profile |
| Year founded | `business.py` → `founded` | Adds `foundingDate` to the schema |
| **Confirm "free estimates"** | site-wide claim | Used in CTAs throughout; change the wording if estimates are not free |
| Confirm dumpster pricing | `services.py` → `junk-removal` | $225 weekend / $100 per ton, taken from the current flyer |
| Founder story | `pages.py` → `ABOUT` | The About page deliberately claims nothing unverifiable — add the real history |
| Project photos | see below | The single biggest visual upgrade available |

### Adding project photos

Placeholder panels are marked `data-photo-slot` in the markup. To use a real photo, drop the file
in `public/assets/img/` and replace the placeholder `<div>` with:

```html
<img src="/assets/img/your-photo.webp" alt="Describe the work shown" width="800" height="600" loading="lazy">
```

Export at roughly 1600 px wide, save as WebP, keep each file under ~200 KB, and always write real
alt text describing the work — it is both an accessibility requirement and an image-search asset.

### Reviews

There is deliberately **no testimonial section and no `AggregateRating` schema**. Invented reviews
are a Google penalty risk and a consumer-protection problem. Once there are real reviews, link the
Google Business Profile and quote them with the customer's permission.

---

## Accessibility

Verified across all 35 indexed pages at 390 px and 1440 px:

- Every text/background pair meets WCAG AA contrast (4.5:1 body, 3:1 large text)
- Full keyboard operation with a visible focus ring; skip link; escape closes the mobile menu
- Tap targets ≥ 44 px for buttons, ≥ 24 px for standalone links
- No horizontal scrolling at any width; `prefers-reduced-motion` honored
- Content is never hidden behind JavaScript — the reveal animation only engages once the script
  has confirmed the observer will run

## Browser support

Any browser from the last several years. The layout uses CSS Grid and custom properties; the
script uses `IntersectionObserver` with a graceful fallback. With JavaScript disabled the whole
site still reads, navigates and submits the form.
