# Urban Brother's Heating &amp; Air — website

A single-page, dependency-free marketing site for the Green Tree, PA HVAC company.
Plain HTML/CSS/JS: no build step, no framework, no npm install. Open `index.html`
in a browser and it runs.

```
index.html          the site
thank-you.html      post-submit confirmation page
404.html            not-found page
netlify.toml        Netlify deploy config (no build step)
robots.txt          crawl rules
sitemap.xml         one-URL sitemap
assets/css/styles.css
assets/js/main.js   all behavior + the CONFIG block you edit
assets/img/logo.svg      vector stand-in for the banner logo
assets/img/logo-mark.svg favicon
```

**These files belong at the root of the deployment repo**, not in a subfolder —
`netlify.toml` sets `publish = "."`, so Netlify serves whatever directory the
config sits in. If the site must live in a subfolder instead, set **Base
directory** to that subfolder in Netlify's build settings and the same config
applies.

---

## Go-live checklist

Four things need real values before launch. Three of them live in one place:
the `CONFIG` object at the top of **`assets/js/main.js`**.

### 1. Drop in the real logo

Save the banner logo as **`assets/img/logo.png`** (transparent or white background,
about 1200px wide). Every `<img>` on the site already points at that filename and
falls back to the bundled `logo.svg` until the PNG exists — so nothing breaks in
the meantime, and no code changes when you add it.

The bundled SVG is a close typographic rebuild of the banner (same red `#D91F26`,
black, stars, swoosh) but it does **not** include the technician illustration.
Use the real artwork.

### 2. Connect the online calendar

In `CONFIG.scheduler`, set `provider` and paste the public booking URL:

```js
scheduler: {
  provider: 'calendly',
  url: 'https://calendly.com/urbanbrothershvac/service-call',
  height: 700
}
```

Supported out of the box (all are plain iframe embeds — no vendor scripts):

| Provider | Where to get the URL |
|---|---|
| `calendly` | Calendly → Event type → **Share** → Copy link. Brand colors are appended automatically. |
| `google` | Google Calendar → Appointment schedule → **Open booking page** |
| `housecallpro` | Housecall Pro → Online Booking → copy the booking page link |
| `acuity` | Acuity → Client Scheduling Page link |
| `iframe` | Any other scheduler that allows embedding |

Leave `url` empty and the site falls back to a built-in "pick an arrival window +
send a request" panel that still captures the lead. Nothing is ever a dead end.

> One caveat: a few schedulers send `X-Frame-Options: DENY`, which blocks embedding.
> If the panel loads blank, use that vendor's own embed snippet in place of the
> `<div id="sched">` block, or link out to the booking page instead.

### 3. Point the contact form somewhere

**On Netlify this is already done.** The form is wired for Netlify Forms out of
the box (`CONFIG.form.provider = 'netlify'`). Deploy, and submissions show up
under **Site configuration → Forms → `service-request`**. Add an email
notification there so leads reach an inbox instead of sitting in the dashboard —
that's the one step worth doing on day one.

Netlify's spam filtering is already wired up too: the form declares a honeypot
field that bots fill in and humans never see.

> Netlify Forms only works on a deployed Netlify site. Opening `index.html`
> locally and submitting will fail and show the "please call us" message —
> that's expected, not a bug.

Hosting somewhere other than Netlify? Switch the provider:

```js
// any endpoint that accepts a JSON POST
form: { provider: 'endpoint', endpoint: 'https://formspree.io/f/xxxxxxxx', ... }

// Web3Forms also needs the access key
form: { provider: 'endpoint', endpoint: 'https://api.web3forms.com/submit',
        accessKey: 'your-key', ... }

// or skip the service entirely and open the visitor's email client
form: { provider: 'mailto', fallbackEmail: 'service@urbanbrothershvac.com' }
```

`'endpoint'` with no URL set falls back to `mailto` automatically, and any
failed send tells the visitor to call. **Set `fallbackEmail` to a real inbox
regardless of provider.**

### 4. Confirm the placeholder business details

These were written from the logo, the reviews, and public info about the area.
Search `index.html` and correct anything that's wrong:

- **Hours** — currently `Mon–Fri 8am–6pm · Sat 9am–2pm · 24/7 emergency`
  (footer and the `openingHoursSpecification` in the JSON-LD block).
- **Email** — `service@urbanbrothershvac.com` in `CONFIG.form.fallbackEmail`.
- **Domain** — `urbanbrothershvac.com` appears in the canonical tag, JSON-LD,
  `robots.txt`, and `sitemap.xml`. Find-and-replace once the real domain is set.
- **Street address** — deliberately omitted; only "Green Tree, PA 15220" is shown.
  Add it to the footer and the `PostalAddress` schema if the business wants a
  service address listed publicly.
- **Offer amounts** — `$89` tune-up, `$50` off repairs, `$500` off installs are
  competitive placeholders benchmarked against other Pittsburgh HVAC sites.
  Confirm the real numbers before launch; they're in the `#offers` section.
- **License number** — if the business has one to display, add it beside
  "Licensed &amp; insured" in the footer. It measurably helps conversion.

---

## Analytics

`main.js` fires conversion events into `gtag`, `dataLayer`, and `fbq` whenever any
of them are present — no configuration needed. Just paste your GA4 / Google Ads /
Meta Pixel snippet into `<head>` and these start recording:

| Event | Fires when |
|---|---|
| `call_click` | Any tap-to-call link, with a `placement` param (`hero`, `head`, `mobilebar`, `foot`, …) |
| `booking_modal_open` | The Book Now modal opens |
| `offer_click` | A coupon CTA is clicked, with the `offer` name |
| `lead_submit` | The request form submits, with `service` and `offer` |

Mark `call_click` and `lead_submit` as conversions in GA4 to see cost-per-lead by
channel.

---

## What drives conversion here

The layout follows what currently converts best for home-services sites, and each
piece is deliberate:

- **Phone number above the fold and never more than a thumb away** — in the utility
  bar, the header, the hero, and a sticky bottom bar on mobile. Tap-to-call is the
  single highest-intent action an HVAC visitor takes.
- **Dual CTA** — call for emergencies, book online for planned work. Neither
  audience has to use the other's path.
- **Trust before the pitch** — the 5.0 Google rating and a real review sit in the
  hero itself, not buried down the page.
- **The free second opinion is the hook.** It comes straight from the reviews
  ("another company told us it needed replaced without even really checking it"),
  it costs the business nothing to offer, and it converts the most valuable
  visitor there is: someone holding a competitor's replacement quote.
- **Offers are specific and claimable.** Clicking a coupon pre-selects it in the
  form, so the lead arrives tagged with what the customer wants.
- **Every dead end has an exit.** No calendar configured, no form endpoint,
  JavaScript off, a failed submit — every one of those paths ends with the phone
  number, not an error.
- **Local proof throughout** — Green Tree, the named neighborhoods, and older
  Pittsburgh housing stock, because that's what local search rewards.

`LocalBusiness`/`HVACBusiness`, `Review`, `AggregateRating`, and `FAQPage`
structured data is in `index.html` for rich results in Google.

> Note on `AggregateRating`: the 5.0 / 19 reviews figure reflects the Google
> reviews supplied for this build. Keep it in sync with the live Google Business
> Profile — a stale count can cost the rich-result eligibility.

---

## Adding photos

The site currently uses type, color, and SVG rather than stock photography, which
is the right default — generic stock imagery measurably hurts trust on contractor
sites. Real photos beat both. When they're available, the highest-value slots are:

1. The hero right column (beside the review card) — Trevor or the crew on a job.
2. Above the "Why Urban Brother's" list — the truck, or a finished install.
3. Inside the review cards — the customer photos already attached to the Google
   reviews from Brianna and Robert Petrescu.

Phone photos are fine. Real and slightly imperfect outperforms polished and generic.

---

## Deploying to Netlify

The repo is import-ready — no build step, no environment variables.

1. Netlify → **Add new site → Import an existing project → GitHub**
2. Pick the repository and authorize it if prompted
3. Leave the build settings as Netlify detects them from `netlify.toml`:
   - **Build command:** *(empty)*
   - **Publish directory:** `.`
   - **Base directory:** *(empty — or the subfolder, if the site isn't at the root)*
4. **Deploy**

First deploy takes well under a minute since there's nothing to build.

After it's live:

- **Forms** — Site configuration → Forms → add an email notification for
  `service-request`.
- **Domain** — Domain management → add the custom domain. Netlify provisions
  the HTTPS certificate automatically. Then find-and-replace
  `urbanbrothershvac.com` across `index.html`, `robots.txt`, and `sitemap.xml`
  so the canonical URL, structured data, and sitemap point at the real domain.
- **Deploys** — every push to the production branch redeploys automatically.

`netlify.toml` also sets security headers and short, revalidating cache times
(asset filenames aren't content-hashed, so a long immutable cache would strand
edits in visitors' browsers).

### Other hosts

It's a plain static site, so Vercel, Cloudflare Pages, GitHub Pages, or ordinary
shared hosting all work — upload the folder contents to the web root. Only the
form provider needs changing (see step 3).

### Local preview

```bash
cd sites/urban-brothers-hvac
python3 -m http.server 8000
# then open http://localhost:8000
```

## Browser support

Modern Chrome, Safari, Firefox, and Edge, mobile included. Tested at 390px and
1440px with no horizontal overflow. Respects `prefers-reduced-motion`, keyboard
navigable, focus-trapped modal, and screen-reader labelled throughout.
