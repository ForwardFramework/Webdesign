# Denis Pro Cleaning Services — website

A conversion-focused single-page marketing site for **Denis Pro Cleaning Services**,
Pittsburgh, PA. Static HTML/CSS/JS — no build step, no dependencies, no framework.

```
denis-pro-cleaning/
├── index.html                 the whole site
└── assets/
    ├── css/styles.css         brand design system + layout
    ├── js/main.js             quote calculator, packages, calendar, forms  ← CONFIG lives here
    └── img/                   logo.svg · logo-mark.svg · favicon.svg
```

Open `index.html` in a browser, or serve the folder (`npx http-server denis-pro-cleaning`).

---

## Go-live checklist

Everything you need to change lives in the `CONFIG` block at the top of
`assets/js/main.js`. Nothing else in the code needs editing.

### 1. Point the forms somewhere

```js
formEndpoint: 'https://formspree.io/f/xxxxxxxx',
```

Both the booking form and the contact form POST JSON here. Any form backend that
accepts a JSON POST works — Formspree, Netlify Forms, Getform, Basin, Zapier
Catch Hook, or your own endpoint.

**Left empty (the default), the site still works**: submissions open a pre-filled
email to `denisprocleaningservice@gmail.com` instead, so no lead is ever lost while
the endpoint is being set up.

### 2. Connect the online calendar

The booking section ships with a **built-in date + arrival-window picker** — it
works out of the box and writes the chosen slot into the booking form, no account
required. To hand scheduling over to a real calendar instead, set two values:

```js
// Calendly
provider: 'calendly',
schedulerUrl: 'https://calendly.com/denisprocleaning/cleaning',

// or anything that embeds in an iframe —
// Housecall Pro, Jobber, Square Appointments, Acuity, Cal.com,
// Setmore, Google Appointment Schedule …
provider: 'iframe',
schedulerUrl: 'https://book.housecallpro.com/book/…',
```

The third-party widget then replaces the built-in picker automatically. The rest of
the page is untouched.

Tuning the built-in picker:

| Key | Does |
| --- | --- |
| `daysAhead` | how far out clients can book (default 90 days) |
| `closedWeekdays` | days you don't work — `[0]` is Sunday |
| `slotsWeekday` / `slotsSaturday` | the arrival windows offered |

Past dates, closed days and same-day bookings are disabled automatically.

### 3. Check the pricing

Two places, both plain numbers:

- **Instant quote calculator** — `TYPE`, `FREQ` and the `base` formula in `calcQuote()`.
  Currently `base = 70 + bedrooms×20 + bathrooms×25`, then multiplied by the service
  type (deep ×1.55, move-in/out ×1.7, post-construction ×2.1) and the frequency
  discount (weekly −20%, bi-weekly −15%, monthly −10%).
- **Package cards** — `SIZE_BASE` (`apt` 135 / `home` 185 / `large` 255; commercial
  is quoted after a walkthrough). Prices round to the nearest $5.

Starting figures were set against published 2026 Pittsburgh market rates
(standard cleans roughly $135–$255, deep cleans $210–$400, recurring service
10–20% below one-time). Adjust to your actual costs before launch.

### 4. Swap in the original logo files

The site ships with a vector rebuild of the logo (`assets/img/logo.svg` and
`logo-mark.svg`) so it renders crisply at any size and has no external
dependencies. To use the original artwork instead, drop the files in
`assets/img/` and name them:

```js
logoFull: 'assets/img/logo.png',   // full lockup — footer
logoMark: 'assets/img/logo-mark.png', // emblem only — header
```

### 5. Before launch

- [ ] Replace the placeholder review text with real Google reviews (and the
      `aggregateRating` numbers in the JSON-LD block at the bottom of `index.html`).
- [ ] Point the three footer social links at the real Facebook / Instagram /
      Google Business Profile URLs.
- [ ] Set the real domain in the `<link rel="canonical">` and `og:` tags.
- [ ] Confirm the `$50 off first deep clean` offer is one you want to run — it
      appears in the hero, the One-Time Deep package and the closing CTA.
- [ ] Add a privacy policy page if you run paid ads (Google requires one).

---

## What's on the page, and why

The structure follows what converts on the best-performing cleaning-service sites:

| Section | Conversion job |
| --- | --- |
| Sticky header + top bar | Phone number and **Book Now** never leave the screen |
| Hero + **instant quote calculator** | Removes the #1 objection — "what will this cost?" — before anything else. Instant-quote widgets are the single biggest lift on cleaning sites |
| Offer badge | `$50 off your first deep clean` gives a reason to act today |
| Trust bar | Jobs completed · rating · guarantee · 24-hour re-clean |
| Services | Six revenue lines, each with its own CTA |
| **Packages** | Weekly / bi-weekly / monthly / one-time, priced per home size, with the savings spelled out on each card |
| 3-step process | "Booked in 60 seconds" kills friction anxiety |
| Room-by-room checklist | Answers "what do I actually get?" |
| Guarantee band | Risk reversal right before the booking section |
| Reviews | Social proof |
| **Booking** | Calendar + form, side by side, no account needed |
| Service area | Local SEO plus "do you come to me?" |
| FAQ | Handles price, insurance, keys, supplies, contracts, payment |
| Closing CTA + sticky mobile call/book bar | Last chance, and a thumb-reachable one on phones |

Also included: `HouseCleaningService` JSON-LD structured data (services, hours,
areas served, package offers, rating), Open Graph tags, semantic landmarks,
keyboard-accessible controls, `prefers-reduced-motion` support, and a mobile
layout verified free of horizontal overflow.

## Branding

Colors are taken directly from the logo and defined once as CSS custom properties
at the top of `styles.css`.

| Token | Value | Used for |
| --- | --- | --- |
| `--navy-900` / `--navy-800` | `#08183A` / `#0D2A5E` | Headlines, dark sections, wordmark |
| `--blue-600` | `#1554C0` | Primary buttons, links, accents |
| `--blue-500` / `--sky-300` | `#2E7DE0` / `#56A8F5` | Gradients, highlights |
| `--gold` | `#F5B41A` | Offer badges and the high-intent CTAs |
| `--silver-*` | `#8F9DAE` → `#E9EEF4` | Borders, dividers, muted text |
| `--paper` | `#F6F9FC` | Page background |

Type: **Playfair Display** for display numerals and the wordmark (echoing the
logo's serif "DENIS"), **Inter** for everything else.
