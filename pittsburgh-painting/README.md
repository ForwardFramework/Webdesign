# Pittsburgh Painting & Property Solutions — website

A conversion-focused static site for a Pittsburgh painting and property-renovation contractor.
No framework, no build dependencies, no runtime JavaScript library. 15 pages, ~154 KB on first
load, zero cumulative layout shift.

**Read [`PLAN.md`](PLAN.md) first** — it's the strategy behind every page: who's landing here,
the offer, the sitemap, the CRO reasoning and the motion spec.
**Read [`CONTENT-CHECKLIST.md`](CONTENT-CHECKLIST.md) before launch** — several things on the
site are placeholders that must be replaced, including all testimonials and all stats.

---

## Run it locally

```bash
cd pittsburgh-painting/dist
python3 -m http.server 8000
# → http://localhost:8000
```

Serve `dist/`, not the repo folder — and use a server rather than `file://`, since font
preloading needs `crossorigin`, which file URLs reject.

## Structure

Everything public lives in `dist/`. Everything else never reaches a CDN — which matters,
because `build.py` is where `LEAD_EMAIL` goes.

```
pittsburgh-painting/
├─ dist/                    ← THE DEPLOY TARGET. Committed, so there is nothing to build in CI.
│   ├─ index.html               /
│   ├─ about/index.html         /about/
│   ├─ services/…/index.html    /services/exterior-painting/  etc.
│   ├─ 404.html  robots.txt  llms.txt  sitemap.xml
│   ├─ _headers  _redirects     ← read by Cloudflare Pages and Netlify alike
│   └─ assets/  css js fonts img + the guide PDF
├─ _src/                    ← page bodies you edit
├─ build.py                 ← wraps them in the shared chrome; also the config block
├─ tools/                   ← font fetcher, guide renderer, preview bundler
├─ preview.html             ← shareable single-file bundle (not deployed)
└─ PLAN.md  CONTENT-CHECKLIST.md  README.md  wrangler.toml
```

### URLs are directory-style on purpose

Pages are written as `about/index.html` and served at `/about/`. Cloudflare Pages
[308-redirects `/about.html` to `/about`](https://developers.cloudflare.com/pages/configuration/serving-pages/)
and that cannot be turned off — so if the site used `.html` URLs, every internal link would
take a redirect hop and every canonical, sitemap entry and JSON-LD `@id` would point at a URL
that redirects. Directory URLs serve natively on Cloudflare, Netlify, Vercel, GitHub Pages and
a plain `python3 -m http.server`, with no redirect anywhere.

All links and asset paths are root-absolute (`/assets/css/site.css`, `/services/renovations/`),
so depth never matters.

## Editing

The 15 pages are generated so the header, footer, nav, meta tags and mobile bar stay identical
across all of them. **Never edit anything in `dist/` directly — it gets overwritten.**

| To change… | Edit | Then |
|---|---|---|
| Page copy or sections | `_src/<page>.html` | `python3 build.py` |
| Header, footer, nav, meta, JSON-LD chrome | `build.py` | `python3 build.py` |
| Colors, spacing, type, any component | `assets/css/site.css` | nothing — it's linked directly |
| Behaviour | `assets/js/site.js` | nothing |
| Photos | drop files into `assets/img/` | nothing |
| Add a page | new `_src/foo.html` + an entry in `PAGES` in `build.py` | `python3 build.py` |
| The preview bundle | — | `python3 tools/build-preview.py` |

`build.py` also regenerates `sitemap.xml`, `robots.txt`, `llms.txt`, `_headers` and
`_redirects` on every run. **Never edit anything inside `dist/` by hand — it is overwritten.**

Inside `_src/*.html` these tokens expand at build time:

| Token | Becomes |
|---|---|
| `{{base}}` | `/` — links and assets are root-absolute at any depth |
| `{{phone}}` / `{{tel}}` | `(412) 537-4866` / `+14125374866` |
| `{{icon:check}}` | inline SVG (names are the keys of `I` in `build.py`) |
| `{{stars:5}}` | a 5-star rating row |

## Where the leads go

Everything routes through one config block at the top of `build.py`:

```python
FORM_ACTION = ""    # the endpoint every form posts to
LEAD_EMAIL  = ""    # the inbox shown to visitors / used for mailto: links
```

**Submissions currently go nowhere.** With `FORM_ACTION` blank, no form gets an `action`
attribute, and `site.js` intercepts the submit and confirms inline — deliberately, so a live
form never posts at a dead URL. Set `FORM_ACTION`, run `python3 build.py`, and all five forms
(estimate, homepage quick form, offer page, and both guide capture points) pick it up at once.

Pick a provider:

**Netlify** — add `netlify` and a honeypot to the `<form>` tags in `_src/estimate.html`,
`_src/offer.html` and `_src/home.html`:

```html
<form data-multistep netlify netlify-honeypot="bot-field" action="/thank-you.html" novalidate>
  <input type="hidden" name="form-name" value="estimate">
  <p hidden><label>Leave blank: <input name="bot-field"></label></p>
```

**Formspree / Basin / Getform** — set the action and let it redirect to `/thank-you.html`:

```html
<form data-multistep action="https://formspree.io/f/XXXXXXX" method="POST" novalidate>
  <input type="hidden" name="_next" value="https://yourdomain.com/thank-you.html">
```

**Your CRM (Jobber, ServiceTitan, Housecall Pro)** — point `action` at their inbound-lead
endpoint. Field names are already sensible: `name`, `phone`, `email`, `address`, `project`,
`property_type`, `size`, `stories`, `timeline`, `heard`, `notes`, `consent`.

Once `FORM_ACTION` is set, the JS stops intercepting and the browser posts normally. The two
guide-capture forms already carry a `company` honeypot that is dropped silently when filled;
add the same to the estimate forms if your provider doesn't supply its own spam handling.

Every submission carries a `lead_type` field (`guide_download`, `guide_download_nudge`,
`guide_download_page`) or, for quote requests, the full project detail — so one inbox can be
filtered into "wants a quote" and "downloaded the guide" without a second endpoint.

## The lead magnet

`assets/pittsburgh-exterior-paint-checklist.pdf` is a real 6-page guide — the 12 questions a
homeowner should ask any painter, Pittsburgh price ranges, a season table, five red flags, and
our full prep spec. Source is `tools/guide.html`; regenerate the PDF with:

```bash
python3 tools/render-guide.py       # HTML → PDF + refreshes the cover thumbnail
```

It's offered in three places, deliberately spaced:

| Placement | Where | Behaviour |
|---|---|---|
| **Inline band** | Homepage, exterior page, gallery | Always visible, one field |
| **Dedicated page** | `/guide.html` | Ranks on its own; also the ad destination for top-of-funnel traffic |
| **Slide-in** | Any content page, desktop only | Appears once past 50% scroll depth, dismissible, remembered for the session |

The slide-in never fires on mobile (the sticky call bar owns that space), never returns in the
same session after dismissal, and retires permanently once anyone claims the guide from any
placement (`localStorage`). On submit the visitor gets the download immediately *and* the
email is captured — waiting for an email to arrive is where these funnels leak.

## SEO, GEO and AEO

**Classic SEO.** One page per service, unique title and meta description on every page (all
within length limits), canonical URLs, `lang="en-US"`, semantic headings with exactly one `h1`
per page, breadcrumbs, descriptive alt text, internal cross-linking between services, generated
`sitemap.xml` and `robots.txt`, Open Graph and Twitter cards, and Core Web Vitals that are
already where they need to be (CLS 0, sub-second FCP).

**Structured data.** One JSON-LD `@graph` per page, generated in `build.py`, containing
`HomeAndConstructionBusiness`/`PaintingContractor` (with `areaServed`, `knowsAbout`,
`hasOfferCatalog`, hours and the current promo), `WebSite`, `WebPage`, `BreadcrumbList`,
per-service `Service` nodes with real price ranges, and `FAQPage`.

The FAQ schema is **extracted from the page's own accordion markup at build time**, so the
structured data can never drift from what a visitor actually reads. Add an FAQ to a page and
its schema appears automatically.

`aggregateRating` is deliberately absent — see `CONTENT-CHECKLIST.md`.

**AEO (answer engines / featured snippets).** Every money page opens with a self-contained
40–60 word direct answer in a `.answer` block, positioned above the fold, phrased so it can be
lifted verbatim. Service pages carry a "at a glance" facts table (cost, duration, season,
lifespan) — the format snippets and AI answers both prefer. Headings are question-shaped where
natural, and `speakable` markup points voice assistants at the `h1` and lead paragraph.

**GEO (being cited by ChatGPT, Perplexity, Claude, AI Overviews).** `llms.txt` states the
business facts, price ranges, service list and the Western-PA climate explanation in plain
prose an agent can quote. `robots.txt` explicitly welcomes the answer-engine crawlers
(`OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`,
`Applebot`, `DuckAssistBot` and others) — for a local contractor these are a growth channel,
not a threat. Model-training crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`) are
also allowed; flip `ALLOW_AI_CRAWLERS = False` in `build.py` to block just those while keeping
the answer engines.

The other half of GEO isn't code: consistent name, address and phone everywhere online, a
maintained Google Business Profile, and real reviews. The site states the business facts
identically in the footer, the JSON-LD and `llms.txt` so there's nothing for a crawler to
disagree with.

## Preview bundle

`python3 tools/build-preview.py` bundles all 15 pages plus the generated files into a single
self-contained `preview.html` (~3.8 MB) for sharing. Each page runs inside an iframe with its
real CSS and JavaScript, so it's the actual site rather than a mock-up; images are base64'd
once and substituted at inject time.

## Tracking

`site.js` exposes `window.ppsTrack(name, params)`, which pushes to both `gtag` and `dataLayer`
and no-ops safely when neither exists. Already wired:

`call_click` · `text_click` · `estimate_start` · `estimate_step_2/3/4` · `estimate_submit` ·
`gallery_filter` · `quick_lead` · `offer_lead` · `lead_confirmed` · `guide_download` ·
`guide_nudge_shown` · `guide_nudge_dismiss`

To turn these on, add your GA4 / Ads / Meta snippet to `head()` in `build.py` and rebuild.
Mark `estimate_submit` and `lead_confirmed` as conversions in GA4, and put the Ads and Meta
conversion pixels on `/thank-you.html`.

**One warning:** if you use a call-tracking number, put it on `offer.html` and paid landing
pages only. Swapping the number on pages Google indexes breaks NAP consistency with your
Google Business Profile and costs you local rankings.

## Deploying to Cloudflare Pages

The publish directory is **`pittsburgh-painting/dist`** and there is **no build step** — `dist/`
is committed, so CI has nothing to run.

### Option A — deploy on push, via GitHub Actions (recommended)

`.github/workflows/deploy-cloudflare.yml` is already in the repo. It needs two secrets once,
then every push deploys.

1. **Cloudflare → My Profile → API Tokens → Create Token.** Use the *Edit Cloudflare Workers*
   template, or a custom token with **Account ▸ Cloudflare Pages ▸ Edit**.
2. **Copy your Account ID** — Cloudflare dashboard → *Workers & Pages*, right-hand sidebar.
3. **GitHub → this repo → Settings → Secrets and variables → Actions → New repository secret.**
   Add both:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Push anything under `pittsburgh-painting/`, or hit **Run workflow** on the Actions tab.

The workflow creates the Pages project on first run, so there's nothing to set up in the
Cloudflare dashboard. Pushing `main` publishes production; any other branch gets its own
preview URL. To publish the current branch as production without merging, use **Run workflow**
and tick *Publish as production*.

Before deploying it also checks two things worth keeping:

- **`dist/` is current** — catches an edit to `_src/` that was never rebuilt, which would
  otherwise silently ship the old pages.
- **nothing private leaked into `dist/`** — `build.py` holds `LEAD_EMAIL`, so it must never
  reach the CDN.

### Option B — connect the repo in the Cloudflare dashboard

No secrets, no Actions. Cloudflare → **Workers & Pages** → **Create** → **Pages** →
**Connect to Git** → pick `ForwardFramework/Webdesign` and a branch, then:

- **Framework preset:** `None`
- **Build command:** *(leave empty)*
- **Build output directory:** `pittsburgh-painting/dist`

`dist/` is committed, so there is nothing to build. You lose the two safety checks above.

### Option C — direct upload from your machine

```bash
cd pittsburgh-painting
npx wrangler login
npx wrangler pages deploy          # wrangler.toml already points at dist/
```

### After the first deploy

1. **Custom domain** — Pages project → *Custom domains* → add the real domain. If the domain is
   already on Cloudflare, DNS is automatic.
2. **Set the real domain in `build.py`** (`SITE = "https://..."`), then `python3 build.py` and
   commit. Canonical tags, `sitemap.xml`, `llms.txt` and the JSON-LD all read from that one
   constant — until it's right, they all point at the placeholder domain.
3. Submit `https://yourdomain.com/sitemap.xml` in Google Search Console.

`_headers` (security + cache-control) and `_redirects` (short URLs for yard signs, plus
`.html` → directory fallbacks) ship inside `dist/` and are generated by `build.py`, so they
can't drift from the page list. The same two files work unchanged on Netlify.

## Fonts

Self-hosted rather than loaded from Google, which removes two cross-origin connections from the
critical rendering path. Inter ships as one variable file covering 400–700; Barlow Condensed has
no variable release so 700 and 800 ship separately. 91 KB for all three, latin subset only.

To change families, edit `tools/fetch-fonts.py` and run it from the site root — it rewrites
`assets/css/fonts.css` and downloads the woff2 files. Then update `--font-display` /
`--font-body` in `site.css` and the two `<link rel="preload">` tags in `build.py`.

## Performance

Measured locally on the homepage, cold cache: **13 requests, 154 KB, CLS 0, FCP ~200 ms.**
What's keeping it there — worth not undoing:

- No framework, no jQuery, no icon font, no carousel or slider library. Icons are inline SVG.
- One CSS file and one 15 KB deferred JS file.
- Fonts self-hosted, preloaded, `font-display: swap`.
- Every `<img>` has explicit `width`/`height`, so nothing reflows as images arrive. Below-fold
  images are `loading="lazy"`; the hero is `fetchpriority="high"`.
- Animations only ever touch `transform` and `opacity`, so they stay on the compositor.

If you add anything, keep images ≤1800 px on the long edge and JPEG quality ~80.

## Accessibility

Verified against the built pages, not just intended:

- **0 contrast failures** across all 15 pages at WCAG AA (automated scan of every rendered text
  node against its composited background).
- Every image has `alt`; every form control has a real `<label>`; one `<h1>` per page.
- Full keyboard support, including the before/after sliders (`role="slider"`, arrow keys,
  Home/End) and a focus-trapped mobile nav that closes on `Esc`.
- All tap targets ≥44 px, visible focus rings everywhere.
- **`prefers-reduced-motion: reduce` disables every animation** and shows final states.
- Reveal animations are scoped to `.js`, so if the script fails to load the whole page still
  renders — and a second safety net reveals everything if `IntersectionObserver` never reports
  (it doesn't, in some embedded webviews). A lead-gen site must never be blank because of one
  failed request.

One rule to keep if you touch the palette: **`#F7B32B` on white is ~1.9:1 and must never carry
text.** Bright gold is for fills and rules only. Gold-toned text on light backgrounds uses
`--gold-ink` (`#8A5A00`, 4.6:1).
