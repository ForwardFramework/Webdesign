# KUBS Handy-Man Services — landing page

A static, dependency-free landing page. Three files plus two SVGs: open `index.html`
in a browser, or drop the folder on any static host (Netlify, Cloudflare Pages,
GitHub Pages, or plain shared hosting).

```
sites/kubs-handyman/
├── index.html          markup + LocalBusiness schema
├── styles.css          all styling (brand tokens at the top)
├── script.js           nav, billing toggle, hour-bank widget, form
└── assets/
    ├── logo.svg        full badge — used for social previews
    └── favicon.svg     simplified mark for the browser tab
```

## Business details on the page

Pulled from the Facebook page and the shirt artwork:

- Phone **(941) 539-2957** · Email **kubshandy@gmail.com**
- Sarasota, FL and surrounding · Since 2025
- Services: carpentry, fencing, decking, pergolas, demo, junk removal, moving

## Things to confirm before this goes live

These were needed to make the page concrete and are **placeholders — change them**:

| What | Where | Current value |
|---|---|---|
| Care Plan monthly price | `script.js` → `CONFIG.monthly` | `$99` |
| Care Plan yearly price | `script.js` → `CONFIG.yearly` | `$990` (2 months free) |
| Hourly labor rate, used in the hour-bank figure | `script.js` → `CONFIG.hourlyValue` | `$95` |
| Cap on banked months shown in the widget | `script.js` → `CONFIG.maxBankedMonths` | `12` |
| Member discount | `index.html`, feature list + hero card | `10% off` |
| Hero price shown on the floating card | `index.html`, `.hero-plan-card` | `$99` |
| Facebook page URL | `index.html`, Messenger contact row | placeholder profile link |
| Canonical / `og:url` domain | `index.html` `<head>` | `kubshandy.com` |

The page makes no claims about licensing, insurance, or reviews — add those only
once they are accurate.

## The logo

`assets/logo.svg` and the `#kubs-badge` symbol near the top of `index.html` are a
**redraw** of the shirt badge, not the original artwork. Colors are matched
(royal blue `#1E5FD9`, white, charcoal), and the type is set in Barlow Condensed.

To use the real artwork:

1. Replace `assets/logo.svg` with the production file (SVG preferred; a
   transparent PNG works too — update the `<img>`/`og:image` extension).
2. In `index.html`, replace the contents of `<symbol id="kubs-badge">` with the
   real paths, or swap each `<svg><use href="#kubs-badge"/></svg>` for
   `<img src="assets/logo.svg" alt="KUBS Handy-Man Services">`.

Everything else — header, hero, price card, contact callout, footer — pulls from
that one symbol, so a single swap updates all five placements.

## The estimate form

There is no backend. On submit, `script.js` builds a `mailto:` to
`kubshandy@gmail.com` with the fields filled in. It works everywhere, but it
depends on the visitor having a mail client set up.

To use a real endpoint instead, POST the same fields from the submit handler in
`script.js` (marked with a comment) — Formspree, Netlify Forms, and Basin all
take a plain POST with no other changes.

## Taking Care Plan payments

Sign-up currently routes to the contact form; no card details are collected on
the page. To take payment directly, create a recurring price in Stripe (or
Square) and point the `data-plan-cta` button at the hosted checkout link. Keep
the "banked hours" tracking outside the page — a spreadsheet is enough to start.

## Brand tokens

Colors, fonts, radii and shadows are CSS custom properties at the top of
`styles.css` under `:root`. Change `--blue` to restyle every accent on the page.

## Checks run

Rendered in Chromium at 1440px, 1280px, and 390px: no horizontal overflow, no
console or page errors, one `h1`, every form control labelled, all in-page
anchors resolve. Respects `prefers-reduced-motion`, and scroll-reveal animations
have a timeout fallback so content can never be left invisible.
