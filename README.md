# Yasse's Cleaning — website

Marketing site for **Yasse's Cleaning**, a locally owned house cleaning company in
Lakewood Ranch, Florida. Static HTML, CSS and vanilla JS — no build step, no
dependencies. Open `index.html` or drop the folder on any host.

*Sparkling Spaces, Happy Places.*

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero + instant estimator, trust bar, services, plan tiers, offer, how-it-works, checklist, guarantee, reviews, service area, FAQ |
| `services.html` | The six service lines, each with its own included-work checklist, plus add-ons |
| `pricing.html` | Full offer: three packages, live recurring-discount toggle, comparison table, one-time rates, add-ons, estimator |
| `areas.html` | Service areas across Manatee and Sarasota counties, plus a seasonal-resident section |
| `about.html` | Story, standards, hiring, reviews |
| `contact.html` | Instant estimator + detailed quote form + direct contact |
| `404.html` | Not-found page |

Supporting files: `css/styles.css`, `js/main.js`, `assets/logo.svg`, `assets/mark.svg`,
`robots.txt`, `sitemap.xml`.

## Before this goes live — replace the placeholders

The business details below are **placeholders**. They are defined once each and are
safe to find-and-replace across all seven HTML files.

| Placeholder | Replace with |
| --- | --- |
| `(941) 555-0142` and `+19415550142` | The real phone number (display + `tel:` format) |
| `hello@yassescleaning.com` | The real inbox |
| `https://yassescleaning.com` | The real domain (canonical, OG tags, sitemap, robots) |
| `34202` | The business ZIP, if different |
| Geo coordinates in the `index.html` JSON-LD | Exact business coordinates |

```bash
# example
grep -rl '(941) 555-0142' *.html | xargs sed -i 's/(941) 555-0142/(941) 555-1234/g'
```

## The offer

Three recurring packages — **Fresh Start**, **Signature Sparkle** (featured),
**Platinum Shine** — plus one-time deep, move-out, turnover, post-construction and
commercial jobs. Recurring discounts are the core of the offer: **20% weekly,
15% every two weeks, 10% every four weeks**, with **$50 off the first clean** and a
free add-on for new plan starts. Prices are benchmarked to the
Sarasota–Bradenton–Lakewood Ranch market (~$120–200 per recurring visit for a 3bd/2ba).

## Repricing the whole site

Every number the estimator and the tier cards show comes from one object at the top of
`js/main.js`:

```js
var PRICING = {
  base: 79,            // trip + supplies + baseline living areas
  perBedroom: 24,
  perBathroom: 22,
  tierMultiplier:      { fresh: 1.00, signature: 1.18, platinum: 1.42 },
  typeMultiplier:      { standard: 1.15, deep: 1.65, move: 1.85 },
  frequencyDiscount:   { weekly: 0.20, biweekly: 0.15, monthly: 0.10, once: 0 },
  firstCleanCredit: 50
};
```

Change those values and the hero estimator, the pricing-page estimator and all three
tier cards reprice together. The static prices in prose (the `From $…` labels, the
one-time rate table on `pricing.html`) are written into the HTML and need editing
separately if the model changes materially.

## Forms

`js/main.js` validates the quote forms client-side (required fields, 10-digit phone,
email shape, plus a honeypot), then hands the submission off via `mailto:` to the
address in each form's `data-mailto` attribute. **This is a stopgap** — it opens the
visitor's mail client rather than delivering server-side.

To wire up a real backend, replace the `handoff()` function in `js/main.js` with a
`fetch()` POST to Formspree, Netlify Forms, Jobber, ZenMaid or whichever CRM the
business uses. Everything else (validation, success message, honeypot) already works.

## Reviews

The testimonials on `index.html` and `about.html` are **real recommendations from the
Yasse's Cleaning Facebook page**, used verbatim and defined once in the review block.
Facebook "recommends" is a yes/no endorsement rather than a star rating, so they are
presented as recommendations and no star counts or aggregate rating are claimed
anywhere on the site. If you add reviews from a source that does carry star ratings
(Google, Yelp), add an `aggregateRating` to the JSON-LD in `index.html` at that point —
not before.

## SEO

Each page carries a unique title, meta description, canonical URL and Open Graph tags.
`index.html` includes `HouseCleaningService` JSON-LD (services, hours, area served,
offer catalog) and `FAQPage` JSON-LD; `pricing.html` carries a shorter FAQ block.
`sitemap.xml` and `robots.txt` reference the domain — update both when the real
domain is set.

## Accessibility & performance

Skip link, visible focus rings, labelled form controls, `aria-current` on the active
nav item, `aria-expanded` on the mobile menu toggle, `role="status"` on form feedback,
and a `prefers-reduced-motion` block that disables all transitions and reveals.
No frameworks, no images beyond two SVGs, one Google Fonts request.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```
