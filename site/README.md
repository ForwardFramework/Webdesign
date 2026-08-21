# Top Dog Exteriors — topdogexteriors.com

Marketing and lead-generation site for Top Dog Exteriors, a veteran-owned exterior
contractor in Bethel Park, PA serving the Greater Pittsburgh area.

Built with [Astro](https://astro.build) as a fully static site: no client framework, no
hydration, and roughly 8 KB of JavaScript across the whole site (navigation, scroll
reveal, form validation, payment calculator). Everything ships as HTML.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve the production build
```

Node 22+.

---

## Documentation

| Document | Covers |
|---|---|
| [`docs/FORMS.md`](docs/FORMS.md) | Where leads go, how to configure email delivery, deploying to a non-Netlify host |
| [`docs/INSTANT-ESTIMATOR.md`](docs/INSTANT-ESTIMATOR.md) | The Roofr instant estimator embed, its fallback behaviour, and how to change the link |
| [`docs/FINANCING.md`](docs/FINANCING.md) | The Acorn Finance calculator, its disclosures, and what must never drift |
| [`docs/REVIEWS.md`](docs/REVIEWS.md) | Adding Google / Facebook / BBB reviews — **read before adding any** |
| [`docs/SEO.md`](docs/SEO.md) | What SEO/AEO/GEO is built in, and the off-site work that still needs a human |

---

## Editing content

Nearly everything a non-developer would want to change lives in four data files. Edit
these, not the pages.

| File | Controls |
|---|---|
| `src/data/site.ts` | Name, address, phone, email, hours, licence, credentials, social links, **service areas** |
| `src/data/services.ts` | All ten services: copy, products, warranties, process steps, FAQs |
| `src/data/promos.ts` | Every offer, its terms, and which services it appears on |
| `src/data/reviews.ts` | Customer reviews and the Google / Facebook / BBB platform ratings |
| `src/data/financing.ts` | Acorn pre-qualify link, published APR/amount/term ranges, calculator defaults |

Changing the phone number in `site.ts` updates the header, footer, every CTA, the
click-to-call links, the schema.org markup and `/llms.txt` in one edit.

### Turning an offer on or off

In `src/data/promos.ts`, set `active: false`. Inactive offers render nowhere.

> ⚠ Offers marked `financing: true` advertise specific credit terms. Do not publish them
> until they match a signed lender agreement — advertising an APR you cannot deliver is a
> Truth in Lending Act violation.

### Replacing the logo

The source of truth is **`brand/TDE_Logo.jpg`** — the official lockup, white artwork on a
solid `#38b6ff` field. Everything else is derived from it:

```bash
node gen-assets.mjs
```

That keys the blue ground out into an alpha mask, re-tints the artwork in both colourways,
splits the stacked lockup into its mark and wordmark, and writes
`public/brand/*.png` plus the favicon, app icons and the Open Graph card. `Logo.astro`
sets the mark and wordmark side by side so the type stays readable at header sizes.

To swap in new artwork: replace `brand/TDE_Logo.jpg`, re-run the script, and rebuild. No
component changes are needed as long as the new file keeps the same two-tone structure
(artwork light, ground `#38b6ff`). If the ground colour changes, update `BRAND` at the top
of `gen-assets.mjs`.

### Adding a service area

Add an entry to `serviceAreas` in `src/data/site.ts`. Setting `primary: true` generates a
dedicated `/service-areas/<slug>` landing page; add a `note` describing what is
distinctive about that town's housing stock so the page is not boilerplate.

---

## Structure

```
src/
├── data/           Content — edit these
├── components/     Reusable UI
├── layouts/
│   └── Base.astro  <head>, JSON-LD graph, header/footer shell
├── pages/          Routes (file-based)
│   ├── services/[slug].astro                one page per service
│   ├── services/[service]/[product].astro   one page per product style
│   ├── service-areas/[slug].astro  one page per primary town
│   └── llms.txt.ts                 generated AI-facing summary
├── scripts/
│   └── lead-form.ts      shared form validation + async submit
└── styles/global.css     design tokens + base styles
netlify/functions/lead.mts  → emails leads to info@topdogexteriors.com
```

85 pages build in about two seconds.

---

## Design system

Tokens live at the top of `src/styles/global.css`. Components reference semantic aliases
(`--accent`, `--text-muted`, `--border`), never raw scale values, so a rebrand is a
token edit.

- **Palette** — anchored on the brand blue `#38b6ff`, with a navy-leaning neutral ramp so
  dark sections read as part of the brand rather than as generic black. `#38b6ff` is a
  *surface* colour: white on it is only 2.24:1, so anything that has to be read uses
  `--brand-600` (`#0873b0`, 5.1:1) or darker. Primary buttons carry the exact brand hex
  with deep navy ink on top, at 6.7:1.
- **Switching the button style** — three lines in `src/styles/global.css`:
  `--cta-bg`, `--cta-fg`, `--cta-bg-hover`. The commented alternative is the more
  conventional deep-blue-with-white-text treatment.
- **Type** — Archivo (display) + Inter (body), from Google Fonts with `display=swap`.
- **Committed to light mode.** A contractor's marketing site should look identical on
  every homeowner's screen; dark sections are deliberate, not a theme.

### Accessibility

Targets WCAG 2.2 AA. Keyboard-operable navigation with a focus-trapped mobile drawer,
visible focus rings everywhere, 44×44 minimum targets, labels on every field, errors
adjacent to their field, `prefers-reduced-motion` respected (and reveal animations forced
visible when motion is suppressed, so nothing is ever hidden behind an animation that
never runs).

---

## Deployment

Configured for Netlify (`netlify.toml`). Set `RESEND_API_KEY` in the environment or forms
will return an error instead of silently dropping leads — see `docs/FORMS.md`.

Any static host works for the pages; only `/api/lead` needs a serverless runtime.

---

## Testing

Requires `npm run preview` on port 4321:

```bash
node qa.mjs      # crawls every route: SEO, headings, labels, schema, links,
                 # mobile overflow and WCAG AA text contrast
node shots.mjs <dir>   # screenshots the key pages at desktop and mobile widths
```
