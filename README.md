# Roughneck Roofing — Website

A fast, static, high-conversion marketing site for **Roughneck Roofing** (Pittsburgh, PA),
built for current SEO, AEO (answer engines), and GEO (generative engines).

30 pages · no framework · no runtime dependencies · deploys anywhere that serves files.

```bash
npm run serve     # build + preview at http://localhost:8080
npm run build     # write dist/
npm run check     # build, then validate SEO + links + structured data
npm run og        # regenerate the social share image
```

---

## ⚠️ Two things needed before launch

Neither blocks the site from working — it is complete and deployable right now — but both
should be added before you send anyone to it.

### 1. The logo file

The logo you supplied could not be saved to the repo from the chat attachment, so the site
currently renders a text lockup in the brand colours as an automatic fallback.

**To fix:** save your logo as `assets/img/logo.png` (transparent PNG, 1200px+ wide), then
`npm run build`. It appears in the header, footer, and social image everywhere at once —
no code changes. Run `npm run og` afterwards to rebuild the share image with it.

### 2. Job photos

Drop your project photos into `assets/photos/` as `job-01.jpg` … `job-12.jpg`.
Missing files render as a branded "photo coming soon" tile rather than a broken image, so
you can add them a few at a time. Captions and alt text live in `src/data/site.js`.
See [`assets/photos/README.md`](assets/photos/README.md) for sizing guidance.

---

## Assumptions to confirm

These were inferred and are all editable in one place — `src/data/site.js`, at the top:

| Field | Current value | Why |
|---|---|---|
| `city` / `lat` / `lng` | Pittsburgh, PA | Inferred from the **878** area code (Pittsburgh overlay). If you are based elsewhere, change it — service areas and 6 city pages regenerate from it. |
| `street` / `zip` | blank / 15205 | Needed for Google Business Profile consistency. Blank fields are hidden automatically. |
| `email` | info@roughneckroofing.com | Placeholder. Change to the inbox you actually read. |
| `domain` | https://roughneckroofing.com | Used for canonical URLs, sitemap, and structured data. **Must** be the real domain before launch. |
| `licenseNumber` | blank | Add your PA HIC number and it appears in the footer automatically. |
| `formEndpoint` | blank | See *Lead form* below. |

Reviews, service descriptions, pricing ranges, and FAQ answers are also in that file.
Pricing is written as clearly-labelled planning ranges, not quotes.

---

## Lead form

The estimate form appears on the home page, the contact page, and every city page.

- **On Netlify:** works with zero configuration. Submissions appear under *Forms* in the
  Netlify dashboard. Turn on email notifications there so leads reach your phone.
- **Anywhere else:** paste a form endpoint into `formEndpoint` in `src/data/site.js` —
  [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com), and
  [Basin](https://usebasin.com) all work. Free tiers are fine for this volume.

If a submission ever fails, the form tells the visitor to call you instead of silently
losing the lead. It also carries a honeypot field, so bot spam is filtered without a CAPTCHA.

---

## Deploying

The whole site is the `dist/` folder. Any of these work:

**Netlify (recommended — the form works out of the box)**
```bash
npm run build
# then drag the dist/ folder onto https://app.netlify.com/drop
```
Or connect this repo: build command `npm run build`, publish directory `dist`.
`netlify.toml` is already generated.

**Cloudflare Pages / Vercel** — build `npm run build`, output `dist`.

**Traditional hosting (cPanel, FTP)** — upload the *contents* of `dist/` to `public_html`.

After the domain is live: set `domain` in `src/data/site.js` to the real URL, rebuild, and
submit `https://yourdomain.com/sitemap.xml` in
[Google Search Console](https://search.google.com/search-console) and
[Bing Webmaster Tools](https://www.bing.com/webmasters).

---

## What is in here

```
src/data/site.js        ← all content and business details (edit this)
src/templates/          page shell, header/footer, schema graph, components, icons
src/pages/              one module per page type
assets/                 css, js, fonts, images, job photos
scripts/                check.js, og.js, serve.js
build.js                generates dist/
dist/                   the built site (committed, so it is deployable as-is)
```

`dist/` is generated. Edit `src/` and rebuild rather than editing `dist/` by hand.

### Pages

Home · Services hub + 7 service pages · Service-areas hub + 6 city pages · Gallery ·
Reviews · About · FAQ · Contact · Resources hub + 4 guides · Privacy · Accessibility ·
Thank-you · 404.

---

## How this is optimised

**SEO**
- Clean directory URLs, one `<h1>` per page, unique titles and descriptions within length limits
- Canonical tags, `sitemap.xml`, `robots.txt`, Open Graph and Twitter cards
- Self-hosted fonts (no third-party request on the critical path), lazy-loaded images,
  system-font fallbacks, ~70 KB of CSS+JS+fonts total
- Location pages targeting real search demand, deep internal linking between services,
  areas, and guides

**AEO — answer engines** (Google AI Overviews, Bing Copilot, Siri)
- Every service, city, and guide page opens with a direct 40–60 word answer in an
  "answer box" — the format extractive engines quote
- Question-shaped `<h2>`s with the answer immediately beneath
- `FAQPage` structured data on 14 pages; comparison and pricing tables that parse cleanly

**GEO — generative engines** (ChatGPT, Perplexity, Claude)
- `llms.txt` at the site root: a plain-text summary of services, pricing, coverage,
  positions, and FAQs for models that fetch it
- `robots.txt` explicitly allows the major AI crawlers
- A single `schema.org` `@graph` per page — `RoofingContractor` with real
  `aggregateRating` and reviews, `Service`, `FAQPage`, `Article`, `BreadcrumbList`,
  `ImageGallery` — all cross-referenced by `@id` so the entity resolves consistently
- Specific, checkable claims (what a tear-off includes, why deductible waiving is fraud,
  what causes ice dams) rather than adjectives — the kind of content models cite

**Accessibility** — WCAG 2.2 AA targeted: skip link, landmarks, keyboard-operable menu and
lightbox, visible focus rings, labelled form fields, `prefers-reduced-motion` respected,
and no content hidden behind JavaScript.

`npm run check` verifies most of the above and fails loudly if something regresses.

---

## Post-launch checklist

1. Claim and complete your **Google Business Profile** — for a local roofer this drives
   more calls than the website itself. Use the exact same name, phone, and address as
   `src/data/site.js`.
2. Add the real address to `src/data/site.js` so the structured data, footer, and Google
   Business Profile all match. Inconsistent NAP data is the most common local-SEO problem.
3. Ask recent customers for **Google** reviews — you have nine on Facebook, which is a
   strong start, but Google reviews carry more weight in local search.
4. Add photos as you finish jobs. Twelve slots exist; more can be added in `site.js`.
5. Set up call tracking or at least ask every caller how they found you.

---

## Repo tooling

This repo also vendors the [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
Claude Code skills in `.claude/skills/` and registers the [21st.dev](https://21st.dev) MCP
server in `.mcp.json` (reads `API_KEY_21ST` from the environment; the key is never committed).
See [.claude/skills/VENDORED.md](.claude/skills/VENDORED.md) for the upstream version.
