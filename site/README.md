# Rough Diamond Pressure Washing — website

A five-page marketing site for Rough Diamond Pressure Washing (Pittsburgh, PA).
Static HTML, CSS and vanilla JS — no build step, no dependencies, no framework.
Drop it on any host that serves files.

- **Phone:** 412-500-1363
- **Email:** roughdiamondpw@gmail.com

## Quick start

```bash
cd site
./fetch-assets.sh            # downloads the photography (one time)
python3 -m http.server 8000  # then open http://localhost:8000
```

The photos live outside the repo to keep it light; `fetch-assets.sh` pulls them
and writes the optimized `.webp` files the pages reference. Until you run it the
photo slots render as branded gradient panels, so the layout still reads
correctly — it just has no photography in it.

## Layout

```
site/
├── index.html services.html gallery.html about.html contact.html 404.html
├── build.py            # regenerates the pages from _partials/
├── fetch-assets.sh     # downloads + optimizes the photography
├── favicon.svg
├── _partials/          # shared chrome + per-page bodies (edit these)
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/            # diamond-mark.svg + fetched photos
```

## Editing

The header, footer, `<head>` and schema markup are shared, so **edit
`_partials/` and re-run the build** rather than editing the generated HTML:

```bash
python3 build.py
```

`build.py` also owns each page's `<title>`, meta description and canonical URL.

## Branding

Pulled straight from the company logo:

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#08090B` | page background |
| `--red` | `#E11414` | primary brand red |
| `--orange` | `#FF6A13` | mid gradient stop |
| `--amber` / `--gold` | `#FFC01E` / `#FFD34D` | highlights, eyebrows |
| `--cream` | `#F7F2E7` | display type |

The fire gradient (`--grad-fire`) and the angled speed-stripe motif (`.stripes`)
both come from the logo. `assets/img/diamond-mark.svg` is a hand-built vector of
the logo's diamond, used as the favicon and in the header lockup — the wordmark
next to it is live text (Anton via Google Fonts) rather than an image, so it
stays crisp at any size and scales down cleanly on phones.

**If you have the original logo file**, drop it in as
`assets/img/logo.svg` (or `.png`) and swap the `.logo` markup in
`_partials/header.html` and `_partials/footer.html` for a single `<img>`.

## Before you launch

A few things are deliberately placeholder and need your real content:

1. **Reviews** — the testimonials on `index.html` are clearly-marked sample
   copy. Replace them with real Google/Facebook reviews (see the comment above
   that section in `_partials/body-index.html`).
2. **Pricing** — the package tiers on `services.html#pricing` are sample
   structure, not real prices. Set your own or delete the section.
3. **Quote form** — `contact.html` has no backend. Submitting opens the
   visitor's mail client pre-addressed to roughdiamondpw@gmail.com. To collect
   submissions properly, point the `<form>` at a form service (Formspree,
   Netlify Forms, etc.) — the validation and field names are already in place.
4. **Domain** — canonical URLs and Open Graph tags in `build.py` assume
   `https://roughdiamondpw.com/`. Update `PAGES` and the `schema.html` partial
   if the domain differs.
5. **Business details** — the hours (Mon–Sat 7am–7pm) and service-area list are
   reasonable defaults; correct them in `_partials/` if they're wrong.

## What's built in

- Responsive down to 320px, with a mobile drawer and a sticky call/quote bar
- Draggable before/after comparison sliders (pointer + keyboard)
- Gallery lightbox with `Esc` and focus return
- Scroll-reveal animations, scroll progress bar, sticky header
- Client-side form validation with inline errors
- `LocalBusiness` JSON-LD, Open Graph and Twitter cards, per-page meta
- Honors `prefers-reduced-motion`; visible focus rings; skip link; print styles
