# Eclipse Aluminum &amp; Shade — landing page

A conversion-focused landing page for [Eclipse Aluminum &amp; Shade](https://www.eclipsealuminumandshade.com/),
a licensed shade contractor serving Sarasota, Bradenton and Southwest Florida.

Plain HTML, CSS and JavaScript. No build step, no framework, no runtime dependencies.
Open `index.html` and it runs.

**→ [docs/SETUP.md](docs/SETUP.md) — connect your calendar and form (about 15 minutes).**

---

## What's on the page

### Instant pricing estimator

A separate estimator for each of the three service lines, each asking a handful of
questions and returning a real price range in about a minute — no email required to
see the number.

- **Retractable & fixed fabric awnings** — type, size, cassette, fabric grade, mounting, extras
- **Solar & hurricane rated motorized roll screens** — purpose, operation, openings, size, wind zone, permits
- **Custom aluminum shade solutions** — structure style, footprint, attachment, foundation, height, wind zone

Rates are benchmarked against published 2026 installed-cost data and Southwest Florida
market pricing, and locked in place by a regression suite. The visitor can price
several services, keep them in a running project total, and carry the whole thing into
the contact form or the booking notes.

It gives a **planning range, not a quote**, and says so everywhere a number appears.

→ [docs/PRICING-MODEL.md](docs/PRICING-MODEL.md) — every rate, its source, and how to retune it.

### The offer

> **See it on your home before you buy it.**
> Free 3D rendering of your home ($499 value) + $500 off your project.

Built from what competitors in this market actually run — a $500 local credit,
Storm Smart's 0%-for-18-months financing, free no-obligation consultations — and led
with the one thing none of them advertises: the 3D rendering Eclipse already produces.
The $500 is applied to the visitor's *own* estimate rather than floating in a banner.

→ [docs/OFFER-RESEARCH.md](docs/OFFER-RESEARCH.md) — the competitor scan, the benchmark data, and the reasoning.

### Contact form + live booking

A validated contact form that delivers through Formspree, Netlify, Web3Forms or your
own endpoint, and a booking modal that embeds your real scheduling calendar.

Paste a Calendly, Acuity, HubSpot or Google Appointments link into `config.js` and
every "Book" button switches to the live calendar. Until then those buttons route to
the form and the phone number — **a booking button never dead-ends.**

---

## Editing it

Nearly everything you'll want to change is in **`assets/js/config.js`**:
phone and license numbers, the offer and its dollar amounts, the countdown and
scarcity lines, the booking link, the form endpoint, analytics IDs, and reviews.

The reviews section stays hidden until you paste in real ones. Photos are optional
drop-ins — the page ships with designed CSS artwork and swaps to your photography the
moment the files exist.

```
index.html                  the whole page
assets/css/styles.css       all styling, design tokens at the top
assets/js/config.js         ← everything you'll normally edit
assets/js/pricing-data.js   the pricing model
assets/js/site.js           icons, analytics, nav, config binding
assets/js/calculator.js     the estimator engine and wizard
assets/js/booking.js        live calendar integration
assets/js/forms.js          contact form validation and delivery
docs/                       setup, offer research, pricing model
tests/                      pricing and browser tests
```

## Tests

```bash
node tests/pricing.test.js    # 19 checks on the pricing model
node tests/e2e.js             # 41 browser checks + screenshots (needs playwright-core)
```

Run the pricing tests after any change to `assets/js/pricing-data.js`. They're
calibrated to the market benchmarks in `docs/PRICING-MODEL.md`, so a failure means
either a typo or that the benchmark has gone stale — both worth knowing.

---

## Design tooling in this repo

This repo also carries the vendored [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
skills and the [21st.dev](https://21st.dev) MCP server, which were used to build the page.

`.claude/skills/` holds seven vendored skills (`ui-ux-pro-max`, `ui-styling`, `design`,
`design-system`, `brand`, `banner-design`, `slides`). They auto-activate on UI/UX work
and need only Python 3.x.

`.mcp.json` registers the `21st` HTTP MCP server at project scope. The API key is not
stored in the repo — the config reads `${API_KEY_21ST}` from the environment, the same
variable the official [21st plugin](https://github.com/21st-dev/claude-code-plugin) uses.

```bash
export API_KEY_21ST="21st_sk_..."   # key from https://21st.dev/settings/api-keys
claude                              # approve the project MCP server when prompted
```

`21st.dev:443` must be reachable. In a sandboxed or proxied environment with an egress
allowlist, add `21st.dev` to it — otherwise the server registers fine but reports
`Needs authentication`, which is the proxy's `403` surfacing as an auth failure rather
than a bad key.
