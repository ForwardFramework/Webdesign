# Buckle &amp; Bloom — landing page

A single-page site for **Buckle &amp; Bloom Car Seat Cleaning**: mobile car seat, booster and
stroller deep cleaning with pickup and delivery included.

Static HTML, CSS and vanilla JS — no build step, no framework, no runtime dependencies.
Drop the folder on any host (GitHub Pages, Netlify, Vercel, cPanel) and it works.

```
buckle-and-bloom/
├── index.html
└── assets/
    ├── css/fonts.css     # @font-face declarations
    ├── css/styles.css    # design tokens + all page styles
    ├── fonts/*.woff2     # self-hosted brand fonts
    └── js/main.js        # nav, reveals, form (CONFIG lives at the top)
```

## Preview locally

```bash
cd buckle-and-bloom
python3 -m http.server 8000   # then open http://localhost:8000
```

## Before it goes live — the short list

Everything below is a placeholder. Nothing else needs touching.

| What | Where |
|---|---|
| Phone number | `assets/js/main.js` → `CONFIG.phoneDisplay` / `CONFIG.phoneHref` |
| Email address | `assets/js/main.js` → `CONFIG.email` |
| Service area wording | `index.html` — search for “local service area” and “Serving local families” |
| Booking form destination | `assets/js/main.js` → `CONFIG.formEndpoint` (see below) |
| Domain in `<link rel="canonical">` and structured data | `index.html` `<head>` |
| Social share image | add `assets/img/og-image.jpg` (1200×630) |

The `data-contact` attributes on the phone/email links mean you only change the number and
address in `CONFIG` — every link and label on the page updates from there.

### Booking form

With `CONFIG.formEndpoint` empty (the default) the form validates, then opens the visitor's
email app with all the details pre-filled. That works on any static host with no backend.

To collect submissions properly, paste a form endpoint from Formspree, Netlify Forms, Basin
or similar into `CONFIG.formEndpoint`; the form then POSTs JSON and shows an inline success
or failure message instead.

## Branding

Colours, type and spacing are CSS custom properties at the top of `assets/css/styles.css`,
sampled from the logo badge:

| Token | Value | Used for |
|---|---|---|
| `--cream` | `#faf3ee` | page background |
| `--blush` | `#d9a2a0` | rules, petals, decorative fills |
| `--rose-deep` | `#9e5a57` | buttons and links (4.7:1 on white) |
| `--sage` | `#9caf8d` | secondary accents, check marks |
| `--ink` | `#23262b` | headings and dark sections |

Type: **Playfair Display** (display serif, the “Buckle” look), **Parisienne** (script accent,
the “Bloom” look) and **Montserrat** (body and the letter-spaced small caps). All three are
SIL Open Font License 1.1 and are self-hosted from `assets/fonts/` — the page makes no
external requests at all.

To refresh the font files, download the latin-subset `woff2` files that
`https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Parisienne&family=Montserrat:wght@400;500;600&display=swap`
points at (request it with a desktop browser user-agent) and replace the files in
`assets/fonts/`. Playfair Display and Montserrat ship as single variable files covering
every weight.

### The logo badge

The circular badge in the hero is a CSS + SVG rendition of the printed logo — it scales
crisply and needs no image file. To use the real artwork instead, replace the contents of
`.hero__emblem` in `index.html` with:

```html
<img src="assets/img/logo.png" alt="Buckle &amp; Bloom Car Seat Cleaning"
     width="460" height="460" style="border-radius:50%">
```

## Pricing on the page

Single seat **$65** · booster **$40** · 2 seats **$120** (Bloom Bundle) · 3 seats **$170**
(Family Bloom) · 4+ seats **$55** each · strollers **$55–$65**. Heavy soil and out-of-area
travel each add **$10–$20**.

Group and event rates — the section aimed at mom groups, pilates and fitness studios,
churches, preschools and community events — are **$55/seat for 4–6**, **$50/seat for 7–11**
and **$45/seat for 12+**, with a host perk at each tier. Change any of these in the
`#pricing` and `#groups` sections of `index.html`; the `LocalBusiness` structured data in
`<head>` lists the headline prices too, so update it alongside.

## Notes on claims

The copy deliberately avoids saying seats are *sanitized* or *disinfected*, and says
cleaning follows each manufacturer's own instructions. Harness webbing can be weakened by
the chemicals and methods those words imply, and most manufacturers advise against them —
so the care-promise section and FAQ state the limit plainly rather than over-promising.
The footer also notes that this is a cleaning service, not car seat inspection, certification
or installation.

## Accessibility

Skip link, visible focus rings, labelled form fields with inline errors, keyboard-operable
mobile nav (Escape closes it), 44px+ touch targets, `prefers-reduced-motion` honoured, and
body text at 4.5:1 contrast or better throughout.
