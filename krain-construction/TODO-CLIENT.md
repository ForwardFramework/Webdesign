# Before launch — confirm with Krain Construction

Everything below is a real, live page today. These are the items that need the client's own
facts or assets swapped in so nothing on the site is an assumption. Each one is a single edit
in `src/data.py` followed by `python3 build.py`.

## 1. Must confirm — factual claims

These are currently sourced from the company's **public** profiles (their existing site, Angi,
HomeAdvisor, Houzz, BBB, Real Log Homes). They are almost certainly right, but they are
statements about a real business and should be confirmed by the owner before they go live.

| Item | Currently | Where |
| --- | --- | --- |
| Email address | `info@krainconstructionllc.com` | `BIZ["email"]` — **assumed**, must verify |
| Office hours | Mon–Fri 7am–5pm, Sat by appointment | `BIZ["hours"]` and `BIZ["hours_schema"]` |
| PA Home Improvement Contractor # | blank (omitted from the page) | `BIZ["pa_hic"]` — add and it appears in the footer |
| Rating & review count | 4.8 ★ / 25 reviews / 96% recommend | `RATING` — from HomeAdvisor + Angi |
| Street address | 6200 Eagles Lane, Murrysville PA 15668 | `BIZ["street"]` |

## 2. Testimonials

The six reviews on `/reviews/` are **paraphrased from the company's public Angi and HomeAdvisor
review profiles** and attributed as "Verified homeowner review" rather than to named people.

Before launch, do one of:

- **Preferred:** replace with the client's own verbatim reviews plus real first names and
  towns ("Dave M. — Export, PA"). Named reviews convert substantially better than anonymous ones.
- Or confirm the paraphrases are accurate and leave the anonymous attribution.

Edit `TESTIMONIALS` in `src/data.py`. Note that `Review` and `AggregateRating` schema is emitted
from this data — Google requires displayed ratings to be genuinely collected, so keep the numbers
matched to what the client can substantiate.

## 3. Photography

Every image on the site is **generated vector artwork**, not a stock photo. It is deliberate,
on-brand and loads instantly — but real project photos will outperform it on every page.

Priority order:

1. **6 hero shots**, one per service page — the best finished example of each.
2. **12 gallery images** — replace the entries in `GALLERY` in `src/data.py`.
3. **1 photo of Brian / the crew** for `/about/` — owner photos measurably lift trust on
   contractor sites.
4. **8 local shots**, one per city page, ideally recognisable from the town.

To swap in a photo, replace the `A.scene(...)` call with an `<img>` in the relevant template,
or hand the images over and we will wire them in.

## 4. Logo artwork

The header and footer lockups are redrawn as SVG from the supplied logo. To use the original
file instead, drop it in as `src/assets/img/logo.png` (or `.svg`/`.webp`) and rebuild — the
build detects it and swaps it in automatically. A transparent-background version is ideal.

## 5. Wire up the form

Set `FORM_ENDPOINT` in `src/data.py` to one of:

- **Netlify Forms** — deploy on Netlify and point it at `/`
- **Formspree** — `https://formspree.io/f/XXXXXXX`
- The client's CRM webhook (JobNimbus, Buildertrend, HubSpot, etc.)

Until it is set, the form validates and routes to `/thank-you/` without sending. **Test one
real submission end-to-end before launch**, and confirm the notification lands somewhere the
client checks hourly — a same-day callback is promised on four separate pages.

## 6. Analytics & tracking

- `GA4_ID` — Google Analytics 4 measurement ID
- `GOOGLE_ADS_ID` + `GOOGLE_ADS_CONVERSION_LABEL` — fires a conversion on `/thank-you/`

Phone-click and form-submit events are already instrumented and fire through `window.krainTrack`
as soon as an ID is present.

## 7. Off-site work (not code — but this is where local ranking is won)

The site is built to rank. These finish the job:

- **Google Business Profile** — claim/verify, confirm the NAP matches the site *byte for byte*,
  add the services and service areas listed here, post photos, request reviews. This is the
  single highest-leverage local ranking factor.
- **Citation consistency** — the same NAP on Angi, HomeAdvisor, Houzz, BBB, Yelp, Facebook.
- **Review velocity** — a steady trickle of new reviews outranks a large old pile.
- **Submit `sitemap.xml`** in Google Search Console and Bing Webmaster Tools.
- **Bing matters more than people think** for AEO — Copilot and parts of ChatGPT search lean on
  the Bing index.

## 8. Nice to have — next phase

- Financing page, if the client has a lender partner
- Real Log Homes® floor-plan browser, tied to the log home page
- Before/after slider component for the gallery
- Blog / project write-ups (the strongest long-term AEO play — each post answers one question)
- Additional city pages: Latrobe, Ligonier, Apollo, Vandergrift, Penn Hills, Oakmont
