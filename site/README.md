# Caitlin Hoffman — Lakewood Ranch Real Estate

A complete, sourced guide to Lakewood Ranch, Sarasota, Bradenton and Tampa Bay, with live MLS
home search, an interactive amenity map, relocation guides and lead capture.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Leaflet.

```bash
npm install
npm run dev        # http://localhost:3000
```

It runs with no configuration. Home search falls back to clearly-labelled **sample records**
behind a permanent banner, and drive times fall back to labelled **estimates**, until you supply
credentials in `.env.local` (see `.env.example`).

---

## ⚠️ Before this site goes live

Open **`src/config/site.ts`**. Every value starting with `NEEDS_VERIFICATION:` is a placeholder
that was deliberately **not guessed**, because several of them are legally operative under
[Fla. Admin. Code R. 61J2-10.025](https://www.flrules.org/gateway/ruleno.asp?id=61J2-10.025)
(real estate advertising). A fabricated licence number or an unregistered brokerage name is a
FREC violation.

While any placeholder remains, a loud non-dismissible banner appears at the top of every page
listing exactly what is missing. Fill them and it disappears on its own.

You will need:

| Field | Where to get it |
|---|---|
| Sales associate licence number (SL#) | [DBPR licensee search](https://www.myfloridalicense.com/wl11.asp) |
| Brokerage name **exactly as registered with FREC** | Your broker — `Realty ONE Group MVP` may differ from the registered name or be a d/b/a |
| Brokerage licence number (CQ#) | DBPR / your broker |
| Brokerage street address, city, ZIP, phone | Your broker |
| Direct phone and business email | You |
| IDX attribution wording | Your executed Stellar MLS IDX agreement |

Then also:

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain.
2. Replace `public/images/generated/agent-headshot.jpg` with a real photograph.
   **No AI-generated headshot is included** — passing a synthetic image off as a real agent
   would be deceptive.
3. Run `npm run fetch:images`, then set `NEXT_PUBLIC_USE_LOCAL_IMAGES=true`.
4. Add your real credentials, awards and production figures to `src/app/about/page.tsx`. It
   currently contains **no** experience claims, sales volumes or awards, because none could be
   verified — and an unsubstantiable production claim is itself an advertising violation.

---

## What's in here

```
src/
  app/              routes (App Router) + API routes + sitemap/robots/llms.txt
  components/       UI, header/footer, map, search, forms
  config/
    site.ts         ← agent + brokerage identity. START HERE.
    images.ts       image manifest (remote CDN → local)
  data/             the research: villages, places, schools, happy hours,
                    builders, guides, FAQs, climate/market, source registry
  lib/
    mls/            IDX providers (MLS Grid, Bridge, SimplyRETS, sample)
    seo.ts          metadata + JSON-LD builders
    drive-times.ts  live routing with an honest estimated fallback
    leads.ts        validation, rate limiting, pluggable delivery
```

### The data contract

Every dataset record carries a `confidence` (`verified` / `reported` / `estimate`) and a
`verifiedOn` date, and the UI renders both. This is a deliberate constraint, not decoration:

- **HOA / CDD figures are ranges**, never single values — assessments differ street to street.
- **Happy hour windows are only published when found published.** Venues we know run one but
  could not confirm are listed separately, unguessed.
- **School ratings with no published figure** show "check current rating", never a blank that
  reads like a low score.
- **Builder incentives are stored as patterns with a checked-on date**, never headline numbers —
  a stale "$50,000 off" banner is both wrong within days and a misleading advertising claim.
- **Map pins are approximate**; every directions link resolves by name + address so the
  destination is always right.

Sources live in `src/data/sources.ts` and are surfaced to visitors at `/sources`.

### MLS / IDX

`src/lib/mls/` normalises MLS Grid, Bridge and SimplyRETS into one `Listing` shape. Because
Stellar MLS `SubdivisionName` is free text (`"LORRAINE LAKES PH I"`, `"COUNTRY CLUB EAST AT LWR
SUBPHASE..."`), `village-map.ts` resolves it onto village slugs — that is what makes the
village filter work against a real feed.

Credentials are read server-side only and never reach the browser. If a feed errors, the API
falls back to sample data with an explanatory notice rather than showing an empty result set.

### SEO / AEO / GEO

- **SEO** — per-page metadata and canonicals, `sitemap.xml`, `robots.txt`, OG images generated
  at build, semantic landmarks, breadcrumbs.
- **AEO** — `FAQPage` JSON-LD on every relevant page; answers written to lead with the direct
  answer in the first sentence; `speakable` markup for voice.
- **GEO** — `/llms.txt` publishes the full fact set, every village with its numbers, all FAQs,
  the caveats to reproduce, and the source registry. AI crawlers are explicitly allowed on
  editorial content and blocked from `/api/` (IDX rules prohibit bulk extraction).

### Accessibility

Built to WCAG 2.1 AA. Skip link, visible focus rings, labelled controls, `aria-pressed` /
`aria-expanded` on every toggle, live regions for results, `prefers-reduced-motion` respected,
and a keyboard-navigable list that mirrors the map exactly for anyone who cannot use it.
Known limitations are stated honestly at `/accessibility`.

---

## Deploying

Works on any Node host. Vercel is the least work:

```bash
npx vercel            # add the env vars from .env.example in the dashboard
```

`/api/listings`, `/api/leads` and `/api/drive-times` need a server runtime, so a fully static
export is not an option unless you drop live MLS search.

## Maintaining the content

The datasets are plain TypeScript, designed to be edited by hand:

- `src/data/happy-hours.ts` — add a venue; only publish a window you have confirmed.
- `src/data/villages.ts` — every village needs a real `tradeOff`. A page with only upside
  reads as an advert and converts worse than an honest one.
- `src/data/sources.ts` — add the citation, then reference its id from the record.

Bump `verifiedOn` when you re-check something. Visitors can see those dates.
