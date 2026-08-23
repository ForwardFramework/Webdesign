# The Krainbucher Group — website redesign

A static, dependency-free redesign of [thekrainbuchergroup.com](https://www.thekrainbuchergroup.com)
built to the **Origin Financial** style reference: a near-black "midnight gallery" canvas,
whisper-weight serif display type, chromatic tiles reserved for service categories, and
monospace micro-labels for data.

## Running it

No build step, no dependencies. Open `index.html`, or serve the folder:

```bash
npx http-server krainbucher-group -p 8080   # then http://localhost:8080
```

Deploy by uploading the folder as-is to any static host (Netlify, Vercel, Cloudflare Pages, S3,
or the client's existing hosting).

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, six service tiles, the 401(k) income-gap argument, process, audiences, FAQ |
| `services.html` | Service hub, with full detail for mortgage protection, living benefits and legacy planning |
| `annuities.html` | Annuities: four contract types, benefits, and an explicit "what annuities are bad at" section |
| `life-insurance.html` | Term / whole life / IUL, living benefits, coverage sizing, underwriting timeline |
| `tax-free-retirement.html` | Three tax buckets plus an interactive tax-drag illustration |
| `about.html` | Brian Krainbucher, operating commitments, service area |
| `contact.html` | Contact form, direct details, pre-call FAQ |

`assets/css/site.css` holds the whole design system as CSS custom properties.
`assets/js/site.js` is ~150 lines of vanilla JS — no framework, no tracking.

## Design system

Tokens live in `:root` at the top of `site.css`.

- **Canvas** `#0f1011` → **Abyss** `#090a0b` → **Graphite** `#2e2e2e` → **Silver** `#cacaca`.
  Elevation is expressed as a colour step, never a drop shadow.
- **Display** — Instrument Serif at light weight, 0.9–1.0 line-height, one italic word per
  headline for editorial tension. Never bolded.
- **UI** — Inter 300/400. Body copy is Ash `#9f9fa0`, never pure white.
- **Data** — Roboto Mono uppercase at 10–12px with wide tracking, for labels and readouts.
- **Chromatic tiles** — Iris Gleam, Deep Iris, Pale Iris, Orchid Bloom and Periwinkle are used
  *only* as full-bleed category tiles. Cyan Signal `#00b3dd` is reserved for chart lines.
  Tile ink is near-black on the lighter violets so body copy clears WCAG AA.
- **Motion** — 0.2s ease on state changes, 2.5s atmospheric reveal on scroll entry. Reveals are
  gated behind a `js` class on `<html>`, so the page is fully readable with JavaScript disabled,
  and everything collapses to static under `prefers-reduced-motion`.

Fonts load from Google Fonts. To self-host (recommended for production performance), drop the
woff2 files in `assets/fonts/`, replace the `<link>` in each page head with `@font-face` rules,
and leave the `--font-*` tokens untouched.

## Content sourcing

The live site could not be crawled from the build environment (network egress policy), so copy
was reconstructed from the client's own indexed page content and expanded editorially. These
facts came from the existing site and should be re-confirmed before launch:

- Brian Krainbucher, President & CEO; affiliated with Equis Financial
- Murrysville, Pennsylvania 15668 · (724) 321-0588 · brian@thekrainbuchergroup.com
- Hours: Mon–Fri 9am–7pm ET, weekends by appointment
- Service lines: life insurance, annuities, tax-free retirement, mortgage protection,
  living benefits, legacy planning
- Product claims carried over verbatim in substance: annuities can extend retirement cash flow
  30+ years beyond a 401(k)/IRA/mutual fund; guaranteed income for life; more upside than a
  traditional fixed contract with less risk than a variable one; tax-deferred growth;
  protection from market loss; an easier legacy. Permanent life insurance stays in force for
  life as long as premiums are paid, costs more than term, and adds benefits term does not.
  Living benefits allow access to benefits without a penalty.

### Needs client input before launch

1. **Brian's biography** — years in practice, licensing detail, designations, community ties.
   The About page deliberately avoids inventing any of these.
2. **Licensed states** — `contact.html` says "Pennsylvania and additional states where
   licensing allows". Replace with the actual list.
3. **Carrier appointments** — naming carriers (subject to their marketing rules) would
   strengthen the independence claim.
4. **Testimonials / client outcomes** — none are used, because none could be verified.
5. **Office address** — only the city is shown. Add the street address if client-facing.
6. **Compliance review** — the footer disclosure is a prudent draft covering FDIC/guarantee
   language, hypothetical illustrations, indexed-product caveats and rider limitations.
   It must be reviewed and approved by the client's compliance contact before launch.

## Form handling

`contact.html` currently composes a `mailto:` to brian@thekrainbuchergroup.com — it works with
zero backend but depends on the visitor having a mail client. Before launch, point the form at a
form endpoint (Formspree, Netlify Forms, or the host's handler) by giving the `<form>` an
`action`/`method` and removing the `submit` handler in `site.js`.

## Accessibility

Semantic landmarks, a skip link, visible focus rings, labelled form controls, `aria-expanded`
disclosure buttons, `role="img"` plus descriptive labels on charts, a keyboard-operable mobile
menu, and a `prefers-reduced-motion` path. Body text and interactive elements meet WCAG AA
contrast.

## Interactive tax-drag illustration

`tax-free-retirement.html` includes a slider-driven comparison of untaxed vs annually-taxed
compounding, rendered as an inline SVG with a Cyan Signal line. It is deliberately simplified —
constant return, flat marginal rate, no fees, no contributions — and is captioned as
hypothetical and educational everywhere it appears.
