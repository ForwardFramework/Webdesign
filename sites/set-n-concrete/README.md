# Set 'N Concrete — landing page

A single-page site for Set 'N Concrete, a concrete, excavation, epoxy and roofing
contractor in Southwestern Pennsylvania. Static HTML, CSS and ~150 lines of vanilla
JS — no build step, no framework, no dependencies to install.

Branding follows the company flyer and logo: near-black and concrete gray with the
brand orange (`#f26a21`), Barlow Condensed for display type and Barlow for body copy.

## Preview it locally

```bash
cd sites/set-n-concrete
python3 -m http.server 8000
# then open http://localhost:8000
```

Use a server rather than opening `index.html` directly — asset paths are absolute
(`/assets/...`), which is what production wants but which `file://` cannot resolve.

## Deploy

Upload the contents of this folder to any static host (Netlify, Vercel, Cloudflare
Pages, GitHub Pages, or plain shared hosting). There is nothing to build.

---

## Before it goes live

Everything below is a placeholder or an unverified claim. **Work through this list
first** — a few of these items are actively harmful if published wrong.

### 1. Domain — required

Every canonical URL, Open Graph tag and schema `@id` currently points at
`https://setnconcrete.com/`, which was chosen as a placeholder. If the real domain
differs, replace it everywhere:

```bash
grep -rl 'setnconcrete.com' . | xargs sed -i 's|setnconcrete\.com|YOURDOMAIN.com|g'
```

Files affected: `index.html`, `robots.txt`, `sitemap.xml`, `llms.txt`.

### 2. Claims to verify — required

These sentences are written into the page. They read as reasonable for a company of
this type, but nobody has confirmed them. Correct or delete any that are wrong:

- **"We carry contractor's liability insurance… and Pennsylvania Home Improvement
  Contractor registration"** (FAQ, last item). Pennsylvania requires HIC registration
  for most home-improvement contractors. Add the actual PA HIC number where the
  `TODO` comment sits above that answer, or remove the claim.
- **"We run our own machines"** (Excavation card, Why-us, FAQ). Remove if excavation
  is subcontracted — the whole "one company" pitch rests on it.
- **The four stat tiles** — 6 trades, 8 counties, $0 estimates, 1 company. These
  describe the service list and the counties named on the page, so they are true as
  long as that list is. They deliberately avoid invented numbers like "500+ projects"
  or "15 years' experience"; if you have real figures, they are stronger.
- **The service-area town lists** — trim any town you do not actually travel to.
  Listing towns you will not serve produces bad leads and weak local relevance.

### 3. Business details — strongly recommended

Search engines and AI assistants weigh a complete, consistent business record heavily.
Search `TODO (owner)` in `index.html` for each spot:

- **Street address and ZIP** in the JSON-LD `address` block (currently region `PA`
  only). If the business runs from home and you would rather not publish the address,
  keep it out of the visible page but still claim the Google Business Profile as a
  service-area business.
- **`geo` coordinates** — currently downtown Pittsburgh (40.4406, −79.9959) as an
  approximation. Set them to your actual yard or office.
- **Business hours** — no `openingHoursSpecification` is declared, because guessing
  would be worse than omitting. Add one if hours are fixed.
- **Email address** — the page intentionally has none; add one to the footer, the
  contact list and the JSON-LD `contactPoint` if you want email enquiries.
- **Social profiles** — add a `sameAs` array to the JSON-LD business node listing your
  Google Business Profile, Facebook and Instagram URLs. This is the single most
  valuable schema addition for a local contractor.

### 4. Estimate form endpoint — required for the form to send

The form posts to a placeholder (`https://formspree.io/f/YOUR_FORM_ID`). Until you
replace that with a real endpoint, submitting the form opens a **pre-filled text
message to 412-439-8833** instead, so an enquiry is never silently dropped. Replace
the `action` on `#estimate-form` in `index.html` with your Formspree, Netlify Forms
or other handler URL and the fetch path takes over automatically.

The form validates inline, announces errors to screen readers, and carries a honeypot
field that quietly discards naive bot submissions.

### 5. Project photos — strongly recommended

The "Our work" gallery ships with a branded concrete texture in each tile so a fresh
install never 404s. See [`assets/img/gallery/README.md`](assets/img/gallery/README.md)
for filenames and how to switch them on. Real job photos are the strongest trust
signal on a contractor site and the clearest way to look like a real local business
rather than a template.

### 6. Reviews — recommended, once you have them

There is deliberately **no** `aggregateRating` in the structured data. Publishing a
star rating you cannot substantiate violates Google's review-snippet policy and can
cost you rich results entirely. Once real reviews exist, add genuine `Review` nodes
and a matching `aggregateRating`, and show the same reviews on the page.

### 7. Off-page work — the biggest local ranking factor

The page is built to rank, but for a local service business most of the weight sits
off the site: claim and fill out the **Google Business Profile** (same name, phone and
service area as this page — the numbers must match exactly), then get listed in
Bing Places, Apple Business Connect, Yelp and the Pennsylvania trade directories.

---

## How the page is optimised

### Search engines (SEO)

- One `<h1>`, a clean `h2`/`h3` outline, and semantic landmarks (`header`, `main`,
  `nav`, `section`, `footer`) with `aria-labelledby` on every section.
- Title (73 chars) and meta description (158 chars) both inside display limits and
  both carrying service plus location terms.
- Canonical URL, `robots` directives, `sitemap.xml` and `robots.txt`.
- Open Graph and Twitter Card tags with a real 1200×630 preview image.
- Self-hosted WOFF2 fonts (latin subset, ~153 KB) — no render-blocking third-party
  request. The two above-the-fold faces are preloaded.
- No layout shift: no lazy-swapped hero image, all reveal animation is transform and
  opacity only, and `prefers-reduced-motion` disables it.
- Content renders fully with JavaScript disabled — all 1,400 words are in the initial
  HTML, and reveal animations are gated behind a `.js` class so nothing is ever
  hidden from a crawler that does not run scripts.

### Local search (GEO)

- `LocalBusiness` structured data typed as both `GeneralContractor` and
  `RoofingContractor`, with `areaServed` naming all eight counties plus Pittsburgh.
- `geo.region`, `geo.placename` and `ICBM` meta tags.
- A dedicated service-area section naming ~50 towns across the eight counties — real
  text on the page, which is what actually earns "concrete contractor near me"
  relevance, rather than a hidden keyword list.
- Consistent NAP (name, address, phone) in the header, facts strip, contact block,
  footer and structured data. Keep these identical to your Google Business Profile.
- `tel:` and `sms:` links throughout, plus a sticky call/text bar on mobile.

### Answer engines (AEO / generative search)

- A "quick facts" definition list high on the page — company, services, service area
  and phone in a structure that is trivial for a model to lift and cite.
- Ten FAQs written as real questions with the direct answer in the **first sentence**,
  which is the form answer engines quote. Marked up as `FAQPage`, and the schema is
  generated from the rendered HTML so the two cannot drift apart.
- Several FAQs answer genuinely informational queries — stamped vs. decorative
  concrete, concrete cure times, cold-weather pours, epoxy in road-salt climates —
  which is the content type assistants cite rather than sales copy.
- `speakable` markup on the headline, summary and facts strip for voice results.
- `llms.txt` at the site root summarising the business, services and service area in
  plain markdown for AI crawlers.
- `robots.txt` explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot,
  Google-Extended and Applebot-Extended.

### Accessibility & UX

Verified in a headless browser at 390px, 768px and 1440px:

- Every text/background pair meets WCAG AA contrast (the light sections use a darker
  orange, `#b3420f`, because the brand orange only reaches 2.9:1 on near-white).
- All interactive targets are at least 44px tall except inline links inside prose,
  which WCAG exempts.
- Visible focus rings, a skip link, labelled form fields with errors announced via
  `role="alert"`, keyboard-operable mobile menu that closes on `Escape`.
- No horizontal scroll at any width; all icons are `aria-hidden` and paired with text.

## Files

```
index.html                     the page (markup + JSON-LD)
assets/css/styles.css          design tokens, layout, components
assets/css/fonts.css           self-hosted @font-face rules
assets/css/gallery-photos.css  opt-in project photos (commented out)
assets/js/main.js              nav, reveals, form validation + SMS fallback
assets/fonts/*.woff2           Barlow + Barlow Condensed, latin, OFL 1.1
assets/img/logo-mark.svg       trowel mark (also inlined in index.html)
assets/img/og-image.jpg        1200×630 social preview
favicon.svg  site.webmanifest  icons
robots.txt  sitemap.xml  llms.txt
```

The logo mark is an SVG recreation of the company's trowel icon drawn to stay legible
down to 24px. If you have the original logo artwork, swap it in — replace
`assets/img/logo-mark.svg` and the matching `<symbol id="brandmark">` in `index.html`.
