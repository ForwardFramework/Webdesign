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

## Brand

Soft, natural and feminine, built around the two colours that are actually in the
logo:

| Role | Token | Value |
| --- | --- | --- |
| Logo navy — headings, wordmark | `--navy-700` | `#16305C` |
| Logo leaf green — primary CTA | `--green-500` | `#6AB023` |
| Warm cream — page ground | `--cream-50/100/200` | `#FDFAF6` → `#F3E9DC` |
| Blush — accents, eyebrows, "most popular" | `--rose-50…700` | `#FDF3F1` → `#A15B50` |
| Sage — supporting greens, ticks, checked states | `--sage-50…700` | `#F2F7EF` → `#547A44` |
| Deep botanical — dark sections, footer | `--forest-600…900` | `#42765A` → `#1E3A2C` |

Type is **Fraunces** for display (a soft, organic serif — `SOFT 100 / WONK 1` for the
rounder, slightly hand-cut letterforms), **Nunito Sans** for body copy, and **Caveat**
as a handwritten accent used sparingly on the tagline and the guarantee seal.

Shapes and depth are softened throughout: larger radii (`18px` / `28px`), petal-cornered
icon tiles, a leaf-shaped bullet, warm brown-tinted shadows instead of blue-grey ones,
and an organic curve where the hero meets the page.

The hero is deliberately light — cream through blush into sage — rather than the dark
navy slab it started as.

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
tier cards reprice together.

Two rules the model follows, worth knowing before you change it:

- **Tier multipliers apply to recurring plans only.** A one-time job (deep, move-out,
  standard) is priced off the room base times its job-type multiplier — the Fresh
  Start / Signature / Platinum multipliers are not applied, because those are plan
  tiers, not job types. This is what keeps the calculator inside the published
  one-time ranges.
- **Published prices are derived from the same formula.** The `From $…` labels on the
  service cards and the one-time rate table on `pricing.html` were generated from the
  numbers above, so the calculator and the printed tables agree. They are written
  into the HTML as static text — if you change the pricing model, regenerate or edit
  them too, or the site will quote two different numbers for the same job.

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

Text colours are measured against WCAG AA, not eyeballed — a soft palette fails this
very easily. Specifics worth preserving if you change colours:

- `--ink-500` (`#6E655D`) is chosen because it clears 4.5:1 on *every* cream and sage
  ground in use. The lighter warm grey it replaced measured 3.4–4.1:1.
- Badges and medallions that carry white text use the deep stops (`--rose-700`,
  `#8C4C43`, `--sage-700`). The pale blush tints measured 2.6–3.4:1 against white.
- **`--green-cta` (`#478016`) exists only for buttons.** The logo green `#6AB023` is
  gorgeous but gives white text just 2.68:1, so the button uses a deeper green from
  the same family (4.8:1) while the logo, ticks and icons keep the true brand green.
  Don't "fix" the button back to `--green-500`.

Two cascade traps bit this design twice, both from a bare descendant selector
outranking a component class: `.hero p` repainting the estimate price, and
`.review__who span` repainting the white avatar initials. If a component's colour
mysteriously ignores its own rule, look for a descendant selector above it.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```
