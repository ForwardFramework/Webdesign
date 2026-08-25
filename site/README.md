# Kotouch Equipment Services — website

Marketing site for **Kotouch Equipment Services**, a mobile heavy-equipment
mechanic serving Western Pennsylvania.

*We Keep Your Equipment Moving.*

| | |
|---|---|
| Owner | Stephen Kotouch — Owner / Lead Mechanic |
| Phone | 724-531-7457 |
| Email | stephenkotouch222@gmail.com |
| Area | Western Pennsylvania — mobile service |
| Hours | Available 24/7 |

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Hero, trust strip, five services, why-us, process, service area, equipment |
| `services.html` | Full detail on each of the five service lines |
| `about.html` | Stephen, the approach, what to expect, coverage |
| `contact.html` | Contact details and the service-request form |
| `404.html` | Not-found page that still routes to the phone |

## Deploying

Everything is static — no server, no database, no build step required at deploy
time. Upload the contents of this folder (excluding `_build/`) to any host:
Netlify, Cloudflare Pages, GitHub Pages, Vercel, or ordinary shared hosting.

Locally: `npm start` (or `python3 -m http.server 8080`), then open
<http://localhost:8080>. Open the pages through the server rather than by
double-clicking the files — `file://` blocks the fonts under CORS.

### Before going live

1. **Set the real domain.** `origin` in `_build/content.mjs` currently reads
   `https://www.kotouchequipment.com`. It drives the canonical URLs, the Open
   Graph tags and `sitemap.xml`. Change it and run `npm run build`.
2. **Decide how the form should deliver** — see below.
3. **Check the placeholder facts** listed under *Assumptions*.

## The contact form

With no server behind a static site, submitting a valid form opens the visitor's
mail client with everything filled in and addressed to Stephen. It validates
fully in-page first, and has a honeypot field for bots. Phone and email are
shown prominently everywhere, so nobody depends on the form to make contact.

To collect submissions server-side instead, set `FORM_ENDPOINT` near the top of
`assets/js/main.js` to a form-handler URL ([Formspree](https://formspree.io),
[Netlify Forms](https://docs.netlify.com/forms/setup/), Basin, etc.). The form
then POSTs there and the mailto path is skipped — no other change needed.

## Design

Taken from the business card artwork:

| Token | Value | Use |
|---|---|---|
| `--gold` | `#F2A81D` | Primary brand, CTAs, accents |
| `--gold-bright` | `#FFC94A` | Hover, gradient highlight |
| `--gold-deep` | `#C97F09` | Gradient shadow, outlines |
| `--steel` / `--steel-mid` | `#C6CCD3` / `#8A9099` | The gear, secondary text |
| `--bg` / `--surface` | `#0B0B0D` / `#131417` | Page and card backgrounds |

Type is **Barlow Condensed** for headings (the condensed industrial caps from the
card) over **Barlow** for body copy, both self-hosted. Recurring brand devices:
the hazard-stripe bar, the hex-mesh field behind the hero, and the gear-and-K
monogram, redrawn as SVG in `assets/img/`.

Icons are inline SVG (Lucide geometry) — no icon font, no emoji.

## Accessibility

- All text meets WCAG AA contrast (4.5:1 body, 3:1 large) on its actual
  background, gradient panels included.
- Every interactive target clears the WCAG 2.2 AA 24×24px minimum; primary
  actions are 44px+.
- Keyboard: skip link first, visible focus rings throughout, Escape closes the
  mobile menu.
- `prefers-reduced-motion` disables reveals, hover lifts and smooth scrolling.
- One `<h1>` per page, labelled form controls, errors tied to fields with
  `aria-describedby`, decorative SVG hidden from screen readers.

## Assumptions to confirm

These were filled in to make the site complete. Correct them in
`_build/content.mjs` and rebuild:

- **The twelve counties** in the service area — a reasonable Western PA spread,
  not a list Stephen supplied.
- **The equipment list** — typical for the trade; add or drop makes as needed.
- **The four process steps** and the "what to expect" copy.
- There are **no testimonials or reviews on the site**, because there were none
  to use. Real ones are the single highest-value addition — a `.card` grid in
  the `section--alt` style drops straight into `index.html` between the
  why-us and process sections.
- No business address is published (mobile service), and the JSON-LD reflects
  that. Add `streetAddress`/`postalCode` in `build.mjs` if a shop address exists
  and a Google Business Profile is set up.

## Structure

```
site/
├── index.html  services.html  about.html  contact.html  404.html   ← generated
├── robots.txt  sitemap.xml                                         ← generated
├── assets/
│   ├── css/styles.css        design tokens + all component styles
│   ├── css/fonts.css         self-hosted @font-face declarations
│   ├── fonts/*.woff2         Barlow + Barlow Condensed (latin)
│   ├── js/main.js            nav, scroll reveal, form validation
│   └── img/                  logo marks and favicon (SVG)
└── _build/                   page generator — see _build/README.md
```

`_build/` is source, not output; it does not need to be uploaded.
