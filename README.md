# Coastal Custom Carts — Website

A redesigned marketing site for **Coastal Custom Carts, LLC** — family-owned,
street-legal luxury golf cart rentals and custom builds serving Anna Maria
Island, Holmes Beach, Bradenton Beach, Lido Key, Siesta Key and Lakewood Ranch.

Static HTML, CSS and vanilla JavaScript. **No build tools, no dependencies, no
framework.** Open `index.html` in a browser and it works.

---

## ⚠️ Before you go live — read this

Two things need your input, plus one question to confirm.

### 1. Confirm the fleet — is there an 8-seater?

The rate sheet you supplied lists **only 4 seater and 6 seater carts**, so the
site now offers exactly those two. An 8-passenger option that was on the earlier
draft has been removed. If you do rent a larger cart, send the rate and it goes
back in.

### 2. Connect the booking forms

Both forms (hero quick-quote and the full form on `contact.html`) currently have
`action="REPLACE_WITH_YOUR_FORM_ENDPOINT"`. Until that's replaced, the form
validates and then shows a message telling the visitor to call or text — so no
enquiry is silently lost, but none reaches your inbox either.

To connect it, pick one and paste the endpoint into both forms' `action`:

- **Netlify Forms** — host on Netlify and add `netlify` and
  `name="booking"` attributes to the `<form>` tag. Zero config.
- **Formspree** — sign up, create a form, paste the `https://formspree.io/f/xxxx`
  URL.
- **Your own handler** — any URL that accepts a POST.

The JS detects a real endpoint automatically and stops intercepting the submit.

### 3. Add photos

Every image slot is currently a line-art cart illustration on a navy gradient.
They look intentional, but **real photos of your carts will convert far better**.
Full instructions and file names: [`assets/img/README.md`](assets/img/README.md).

---

## Content that was verified

Pulled from public sources and your own review screenshots:

- Phone **941-312-1494**, email **sales@coastalcustomcarts.com**
- **Lakewood Ranch, FL 34211**; free delivery & pickup across Manatee &
  Sarasota County
- Service area: Anna Maria Island, City of Anna Maria, Holmes Beach, Bradenton
  Beach, Lido Key, Siesta Key, Lakewood Ranch
- Fleet: American-made E-Z-GO and Club Car, gas or electric, lithium batteries,
  SoundExtreme Bluetooth soundbars, upgraded wheels/tires, premium seating
- "No processing fees, no hidden fees, no sales gimmicks"
- Rental rates (flat-rate packages, live on the site):

  | Cart | 3-Day | 5-Day | 7-Day |
  |---|---|---|---|
  | 4 Seater | $350 | $400 | $450 |
  | 6 Seater | $450 | $500 | $550 |

  Per-day equivalents ($117/$80/$64 and $150/$100/$79) are shown alongside each
  price to make the longer packages sell themselves.
- Rental agreement (Adobe Sign) linked from the footer, the rentals page, the
  booking form and the FAQ
- Owners **Kelly and Zack**; booster seats and car seats available
- **95 five-star reviews**; 19 real reviews are quoted on the site

Prices live in three places, all marked with a `RATES:` comment: the fleet cards
in `src/index.html` and `src/rentals.html`, the rate-card block in each, and the
`hasOfferCatalog` schema in `partials/head.html`. Update all three together, then
run `python3 build.py`.

Your Adobe Sign rental agreement is **linked, not transcribed** — the document is
behind a signing widget this environment could not read, and linking it means
customers always get the current version and can sign it online.

Anything not verified — hours of operation, deposit amounts, cancellation policy,
insurance terms — was deliberately **left off** rather than invented. Those
details are presumably in your rental agreement; if you want them summarised on
the site as well, send the text.

---

## Structure

```
index.html  rentals.html  for-sale.html        ← generated — don't edit these
reviews.html  about.html  contact.html  404.html
robots.txt   sitemap.xml
build.py                                        ← assembles pages from the parts below
src/           page bodies (edit these)
partials/      head, header, footer, icon sprite (edit these)
assets/css/styles.css    design tokens + all styling
assets/js/main.js        nav, scroll reveal, form handling
assets/img/              logo SVGs, favicon, photo drop-zone
```

### Editing

Header, footer and `<head>` live in `partials/` so a change lands on every page
at once. Page content lives in `src/`. After any edit to `src/` or `partials/`:

```bash
python3 build.py
```

That regenerates the seven standalone HTML files at the root. Those files are
the deployable site — they need no server-side anything.

### Deploying

Upload the root HTML files plus `assets/`, `robots.txt` and `sitemap.xml` to any
static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or plain shared
hosting). There is no build step to configure.

---

## Design system

Colors are taken from the logo:

| Token | Hex | Use |
|---|---|---|
| `--navy-700` | `#12283C` | Primary brand ink, dark sections |
| `--gold-500` | `#C79760` | Accent, primary buttons |
| `--sand-100` | `#FBF8F4` | Page background |
| `--sand-200` | `#F5EFE6` | Alternating sections |

Type: **Fraunces** (headings), **Karla** (body), **Kaushan Script** (accents,
echoing the logo's brush script). All from Google Fonts.

Every color pair used for text meets WCAG AA (4.5:1). Gold is used as a
*background* for dark text rather than as light-background text, because
`#C79760` on white is only 2.9:1.

### Built-in behaviour

- Sticky header, full-screen mobile menu, sticky call/book bar on phones
- Scroll-reveal animations that respect `prefers-reduced-motion`
- Keyboard accessible with visible focus rings and a skip link
- `AutoRental` + `FAQPage` structured data for Google rich results
- Verified at 390px, 768px and 1440px with zero horizontal overflow

---

## Skills and tooling

This repo also vendors the [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
skills in `.claude/skills/` and registers the [21st.dev](https://21st.dev) MCP
server in `.mcp.json`. Neither is required to build or deploy the site.

<details>
<summary>21st.dev MCP setup</summary>

The API key is not stored in the repo; `.mcp.json` reads `${API_KEY_21ST}`.

```bash
export API_KEY_21ST="21st_sk_..."   # get one at https://21st.dev/settings/api-keys
claude                              # approve the project MCP server when prompted
```

Requires `21st.dev:443` to be reachable. In a sandbox with an egress allowlist,
add it — otherwise the server registers but reports `Needs authentication`,
which is the proxy's 403 surfacing as an auth failure rather than a bad key.
</details>
