# HB Hauling & Contracting — website

Static marketing site for HB Hauling & Contracting (owner **Isaiah Jones**, 412-992-8796).
No build step, no dependencies: plain HTML, one CSS file, one JS file.

```
sites/hb-hauling/
├── index.html                    # the whole site (single page, anchored sections)
├── 404.html
├── robots.txt / sitemap.xml
└── assets/
    ├── css/styles.css            # design tokens + all components
    ├── js/main.js                # nav, scroll reveals, quote form
    └── img/
        ├── hb-hauling-logo.jpeg  # the supplied logo
        └── favicon.svg           # HB monogram, drawn to match the logo
```

## Brand

Colors were sampled straight out of `HB Hauling.jpeg`, which is monochrome — so the site is too.

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#050505` | page background (the logo's black) |
| `--steel-100` | `#DCDCDC` | primary silver, headings, buttons |
| `--steel-400` | `#A0A0A0` | mid tone, icons, eyebrows |
| `--steel-600` | `#606060` | deep steel, shadow edge of the metal |
| `--chrome` | gradient | brushed-metal fill for buttons and display type |

Type: **Archivo Black** for headings (closest web font to the logo's heavy industrial block
lettering) and **Inter** for body copy.

## Local preview

```bash
python3 -m http.server 8000 --directory sites/hb-hauling
# → http://localhost:8000
```

## Deploying

Publish directory is `sites/hb-hauling` — there is nothing to build.

- **Netlify** — publish directory `sites/hb-hauling`, leave the build command empty.
- **GitHub Pages** — serve the branch from `/sites/hb-hauling`, or copy the folder to the repo root.
- **Cloudflare Pages / Vercel** — root directory `sites/hb-hauling`, framework preset "None".

## The quote form

There is no backend. On submit, `main.js` validates the entries, composes the job details into a
text message and hands the visitor a **Send the text** button pointed at `sms:+14129928796` (with a
Call button beside it). That works on any host with zero setup, and it puts the lead directly on
Isaiah's phone.

To collect submissions by email instead, either:

- **Netlify Forms** — add `name="quote" data-netlify="true"` to the `<form>` tag and delete the
  `e.preventDefault()` branch in `main.js`, or
- **Formspree/Basin** — set `action="https://formspree.io/f/XXXX" method="POST"` on the form and
  remove the same JS handler.

## Content to confirm before going live

These were inferred and should be checked with Isaiah:

1. **Service area** — the 412 area code points to Pittsburgh, PA. The towns listed in the
   "Service area" section (`#areas` in `index.html`) are placeholders; swap in the ones he
   actually covers.
2. **Domain** — `hbhaulingcontracting.com` is used in the canonical URL, `robots.txt`,
   `sitemap.xml` and the Open Graph tags. Replace it with the real domain once registered.
3. **Hours / response time** — the copy says "call or text for a free estimate" rather than
   promising a window. Add real hours if he wants them stated.
4. **Reviews and photos** — no testimonials or job photos were invented. Once there are real
   before/after shots and Google reviews, they are the highest-value additions to this page
   (drop photos into `assets/img/` and add a gallery section above the FAQ).
5. **Licensing / insurance** — if the business carries insurance or a PA contractor (HICPA)
   registration number, add it to the trust bar; it converts.
