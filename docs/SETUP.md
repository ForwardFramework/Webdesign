# Setup

The site is plain HTML, CSS and JavaScript — no build step, no framework, no
dependencies. Open `index.html` in a browser and it runs.

Almost everything you'll want to change lives in **`assets/js/config.js`**.

Four things turn this from a demo into a working lead machine. Do them in this order.

---

## 1. Connect the live calendar ⭐ (5 minutes)

Right now every "Book" button routes to the contact form and your phone number. Once
you paste a scheduling link, they open your real calendar in a modal instead.

**Get a scheduling link.** [Calendly](https://calendly.com) has a free tier and is the
easiest; [Acuity](https://acuityscheduling.com), [HubSpot Meetings](https://www.hubspot.com/products/sales/schedule-meeting)
and Google Appointment Schedules all work too. Create an event type called something
like *Free Design Consultation*, 45–60 minutes, and set your availability.

**Then edit `assets/js/config.js`:**

```js
booking: {
  provider: 'calendly',
  url:      'https://calendly.com/eclipse-shade/design-consultation',
  prefill:  true,
  ...
}
```

Valid `provider` values: `calendly`, `acuity`, `hubspot`, `google`, `iframe`, `none`.

Calendly gets its official inline widget. Everything else is embedded in an iframe.
If your scheduler refuses to be framed, the modal automatically offers an
**"Open the calendar in a new tab"** link instead — a visitor never hits a dead end.

With `prefill: true`, anything already typed into the contact form (name, email, phone)
plus whatever they priced in the estimator is passed into the booking, so the
appointment arrives with context.

> **Tip:** turn on SMS reminders in your scheduler. No-shows are the main cost of
> online booking, and a reminder text is the cheapest fix there is.

---

## 2. Connect the contact form (5 minutes)

The form currently runs in **demo mode**: it validates properly and shows the success
screen, but nothing is delivered — the payload is logged to the browser console
instead (open DevTools → Console to see exactly what will be sent). Nothing is silently
lost, and your phone number is always shown as a backup.

Pick whichever is easiest:

### Formspree — works on any host

1. Sign up at [formspree.io](https://formspree.io), create a form, copy the endpoint.
2. ```js
   form: { provider: 'formspree', endpoint: 'https://formspree.io/f/xxxxxxxx', ... }
   ```

### Netlify — zero config if you host there

```js
form: { provider: 'netlify', endpoint: '', ... }
```

The form already carries the `data-netlify` and `form-name` attributes Netlify needs.
Submissions appear under **Forms** in your Netlify dashboard.

### Web3Forms — free, no account needed for the basic tier

```js
form: { provider: 'web3forms', endpoint: 'your-access-key-here', ... }
```

### Your own endpoint

```js
form: { provider: 'custom', endpoint: 'https://your-crm.example.com/leads', ... }
```

Receives a JSON `POST` with every field, plus the visitor's saved estimates, the page
URL, the referrer, and any `utm_*` / `gclid` / `fbclid` parameters for ad attribution.

**Whichever you choose, set up an email or SMS notification on new submissions.**
Responding within the first minute can lift conversion by nearly 4×; waiting five
minutes cuts your odds of connecting by 80%. The form is only as good as the callback.

### On the SMS consent checkbox

`form.requireSmsConsent` is **on**, and the box is unticked by default. If you intend
to text your leads, US TCPA rules expect express written consent, and the wording on
the form is written for that. Set it to `false` only if you will never text them.

---

## 3. Add real photos (15 minutes) — biggest visual win

The page ships with designed CSS artwork in place of photography, so nothing looks
broken. **Drop real files in and they take over automatically** — no code change:

| File | Where it appears | Suggested size |
|---|---|---|
| `assets/img/hero-lanai.jpg` | Hero | 1600×1200 |
| `assets/img/service-awnings.jpg` | Awnings card | 1000×625 |
| `assets/img/service-screens.jpg` | Roll screens card | 1000×625 |
| `assets/img/service-aluminum.jpg` | Aluminum card | 1000×625 |
| `assets/img/offer-rendering.jpg` | Offer card | 900×600 |
| `assets/img/og-image.jpg` | Facebook / SMS link previews | 1200×630 |

If a file isn't there, the `<img>` removes itself and the CSS artwork shows through.
No broken-image icons, no alt text stranded on the page.

**Use your own completed jobs.** Real Florida homes you actually installed will
outperform any stock or AI-generated image, and they can't be mistaken for work you
didn't do. Save as JPEG at ~80% quality, and keep each file under about 300KB.

---

## 4. Add real reviews (5 minutes)

The reviews section is **hidden** until you add some — it will not publish invented
testimonials. Paste real ones from Google, Facebook or Angi into `config.reviews.items`:

```js
reviews: {
  headline: 'Trusted across Sarasota & Manatee',
  items: [
    { name: 'Karen M.', where: 'Lakewood Ranch', stars: 5,
      text: 'They measured on Tuesday and I had the rendering by Friday…' }
  ]
}
```

Use first name and last initial, quote them verbatim, and only use reviews the person
actually left somewhere public.

---

## Optional: analytics

Add the IDs and the tags load themselves. Leave them blank and **no third-party script
runs at all**:

```js
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
  googleAdsId:       'AW-XXXXXXXXX',
  metaPixelId:       '123456789012345',
  trackEvents: true
}
```

Events fired: `estimate_started`, `estimate_completed` (with the dollar midpoint),
`booking_opened`, `form_submitted`. In Google Ads, mark `form_submitted` and
`booking_opened` as conversions.

---

## Deploying

No build step, so any static host works.

**Netlify or Vercel** — connect the repo, leave the build command empty, publish
directory `/`. Netlify also gives you the form backend for free.

**Cloudflare Pages** — same, build command empty, output directory `/`.

**GitHub Pages** — Settings → Pages → deploy from branch, root.

**Traditional hosting** — upload `index.html` and the `assets/` folder by FTP.

### Pointing the domain at it

Once deployed, point `eclipsealuminumandshade.com` at your host (each provider has a
one-page guide). Then update the four absolute URLs in `index.html` — the `canonical`
link, the two `og:` URLs and the `og:image` — if your live domain differs from
`https://www.eclipsealuminumandshade.com/`.

---

## Running the tests

```bash
node tests/pricing.test.js    # 19 checks on the pricing model
node tests/e2e.js             # 41 browser checks, writes screenshots to tests/shots/
```

The end-to-end run needs Chromium and `playwright-core`:

```bash
npm install --no-save playwright-core
```

Run the pricing tests after **any** change to `assets/js/pricing-data.js`.
See [PRICING-MODEL.md](PRICING-MODEL.md) for what the numbers mean.

---

## Where things live

```
index.html                  the whole page
assets/css/styles.css       all styling, design tokens at the top
assets/js/config.js         ← everything you'll normally edit
assets/js/pricing-data.js   the pricing model (see docs/PRICING-MODEL.md)
assets/js/site.js           icons, analytics, nav, config binding
assets/js/calculator.js     the estimator engine and wizard
assets/js/booking.js        live calendar integration
assets/js/forms.js          contact form validation and delivery
docs/OFFER-RESEARCH.md      why the offer is what it is
docs/PRICING-MODEL.md       where every rate came from
tests/                      pricing and browser tests
```
