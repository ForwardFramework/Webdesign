# Build tooling

The published site is plain static HTML — the files in `site/` can be uploaded
as-is to any host. This directory only exists so the four pages cannot drift out
of sync with each other.

## Commands

Run from `site/`:

| Command | What it does |
|---|---|
| `npm run build` | Regenerates the `.html` files, `robots.txt` and `sitemap.xml` |
| `npm run check` | Validates the generated pages (see below) |
| `npm run serve` | Serves the folder at <http://localhost:8080> |
| `npm start` | Build, check, then serve |

No dependencies — Node 18+ and Python 3 (for `serve` only).

**Anything in `site/*.html` is generated. Edit the sources here, not the output.**

## Files

| File | Purpose |
|---|---|
| `content.mjs` | Business facts and copy — phone, email, services, counties, equipment |
| `chrome.mjs` | `<head>`, header, footer, CTA band — the chrome shared by every page |
| `icons.mjs` | Inline SVG icon set (Lucide geometry) |
| `build.mjs` | Page bodies, JSON-LD, and the write step |
| `check.mjs` | Structural validation |

## Common edits

- **Phone, email, service area, hours** — `content.mjs`, `biz` object.
- **A service's wording** — `content.mjs`, `services` array. Feeds the home page
  cards, the services page sections, the footer and the JSON-LD at once.
- **Counties or equipment** — the `counties` / `equipment` arrays.
- **A new page** — add an entry to `pages` in `build.mjs` and to `NAV` in `chrome.mjs`.

Run `npm run build && npm run check` after any edit.

## What `check.mjs` verifies

Tag balance, duplicate IDs, `aria-describedby`/`aria-controls`/`for` targets that
actually exist, every form control having a label, internal links and anchors
resolving, images carrying `alt`, one `<h1>` per page, required `<head>` tags,
CSS classes existing in the stylesheet, and the JSON-LD parsing.

It exits non-zero on any error, so it works as a pre-deploy gate.

## Regenerating the fonts

Barlow and Barlow Condensed are self-hosted in `assets/fonts/` (SIL Open Font
License 1.1) so the site makes no third-party requests. To refresh them, fetch
the Google Fonts CSS **with a browser User-Agent** (otherwise Google returns TTF
rather than WOFF2), download the `latin` and `latin-ext` sources it references
into `assets/fonts/`, and mirror the `@font-face` blocks — `unicode-range`
included — into `assets/css/fonts.css`.
