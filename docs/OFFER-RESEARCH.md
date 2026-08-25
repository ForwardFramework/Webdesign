# The offer: what competitors run, and what we built instead

The brief asked for "a high converting offer from similar companies' websites."
This is what the research turned up, what got chosen, and why.

---

## 1. What similar companies are actually running

| Company | Market | Offer |
|---|---|---|
| [Awnings Sarasota](https://www.awningssarasota.com/) | Sarasota, FL — direct competitor | **$500 credit** to new customers, refreshed as a monthly special |
| [Storm Smart](https://www.stormsmart.com/) | SW Florida — largest regional player | **0% interest for up to 18 months** (deferred); seasonal "Hurricane Relief Savings" of **up to 15% off** roll-downs, 10% off screens and accordions, 5% off impact windows; promotes **My Safe Florida Home** matching grants up to $10,000 |
| [AAA Awning](https://www.aaaawning.com/commercial-awnings) | Philadelphia | **Free same-day estimates**; **10% senior and military discount** |
| [Ohio Awning](https://ohioawning.com/commercial/) | Ohio | **Free on-site consultation** |
| [eCanopy](https://www.ecanopy.com/commercial-awnings.html) | National e-commerce | **Price match, beaten by 10%** of the difference |
| [ALEKO](https://alekoproducts.com/sale/awnings/) | National e-commerce | **Up to 40% off** plus free shipping |

Two clear patterns:

1. **Local installers compete on a flat dollar credit** ($500 is the number in this
   market) and on removing friction (free, fast, no-obligation estimates).
2. **The big regional player competes on financing**, not discount — 0% for 18
   months lets them hold price while still lowering the barrier.

Nobody in this market leads with visualization.

---

## 2. What converts, per the benchmark data

- Home-services lead-gen pages average around **8.5% conversion**, against a
  **6.6% median** across all industries ([First Page Sage](https://firstpagesage.com/seo-blog/landing-page-conversion-rates-by-industry/), [Barham Marketing](https://barhammarketing.com/27-home-services-conversion-rate-statistics-for-2026/)).
- **Free-consultation funnels convert at 6–12%** ([SeedProd](https://www.seedprod.com/landing-page-conversion-rates/)).
- **3D rendering works as a lead magnet.** The pattern "See it before we build it"
  moves a prospect from curiosity to a booked consultation, because it answers the
  real objection — *what will this look like on my house?* ([Be Kind Local](https://bekindlocal.com/the-high-converting-checklist-for-home-service-landing-pages-in-2026/))
- **Instant quoting beats "we'll get back to you."** Sites offering an instant
  calculator with minimal upfront fields consistently outperform those demanding
  detail first; most people simply leave for a competitor who quotes faster
  ([Uprise Digital](https://uprisedigital.com.au/blog/website-conversion-rate/), [CALCONIC](https://www.calconic.com/calculator-widgets/price-quote-calculator)).
- **Speed of response is the single biggest multiplier.** Replying within the first
  minute can lift conversion by **391%**; waiting five minutes cuts your odds of
  connecting by **80%** ([Barham Marketing](https://barhammarketing.com/27-home-services-conversion-rate-statistics-for-2026/)).
- **Landing pages with a nav menu convert 10–15% worse** than the same page without
  one ([Clicks Geek](https://clicksgeek.com/landing-page-conversion-rate/)).

---

## 3. The offer we built

> ### See it on your home before you buy it.
> **Free 3D rendering of your home ($499 value) + $500 off your project.**

It is a *stack*, not a discount. Four components, each doing a different job:

| Component | Job it does | Where it came from |
|---|---|---|
| Custom 3D rendering of your home — **$499 value** | Kills the "what will it look like?" objection and anchors the offer's worth | Eclipse already does renderings — the flier lists them as a feature. No competitor leads with it. |
| **$500 off** projects of $3,500+ | Hard financial incentive, matched to the local going rate | Awnings Sarasota's $500 new-customer credit |
| On-site design & laser measurement | Removes risk and cost from saying yes | Ohio Awning, AAA Awning |
| Written, itemized quote, good 30 days | Removes time pressure — the objection to the *consultation itself* | Counter to the industry's kitchen-table close |

Wrapped in two more proven levers:

- **The No-Pressure Promise.** The real reason homeowners don't book a home
  consultation isn't cost, it's the fear of a two-hour hard sell. Naming and
  defusing it directly is the highest-leverage sentence on the page.
- **Financing, mentioned but not led with.** Storm Smart's play, positioned where it
  belongs — next to the visitor's own estimate, as a monthly figure.

### Why the rendering leads instead of the discount

Eclipse's flier already advertises 3D renderings, buried as the third bullet under
"Call today for a free design consultation." That's a **$499-value asset being given
away as a footnote.**

Leading with a discount competes on price against a company with far deeper pockets
(Storm Smart) and one already running the same $500 number (Awnings Sarasota).
Leading with *visualization* competes on something neither of them advertises, and
it's a better fit for a premium, custom, considered purchase. The $500 still does
its work — it just isn't the headline.

### The instant estimator is part of the offer

The calculator is not a separate feature. It's the top of this funnel:

1. **Instant range, no email required.** Removes the biggest friction point and beats
   every competitor's "request a quote" form on speed.
2. **The $500 is applied to the visitor's own number.** "Your project: $5,350–$7,350.
   With your $500 offer: $4,850–$6,850." A discount against a concrete personal figure
   converts far harder than one floating in a banner.
3. **The estimate travels with the lead.** Whatever they priced lands in the form and
   the booking notes, so the first call starts from a real number.

---

## 4. Levers you can pull, in `assets/js/config.js`

Every number lives in the `offer` block:

```js
dollarsOff:     500,     // raise for a seasonal push
renderingValue: 499,     // what you'd charge for the rendering
minimumProject: 3500,    // floor the discount applies at
deadline:       null,    // '2026-09-30' → live countdown appears
slotsRemaining: null,    // 6 → "6 design appointments left this week"
```

**On `deadline` and `slotsRemaining`:** both are off by default, deliberately. Urgency
converts, but only while it's true. A countdown that resets every month, or a slot
counter that always says six, gets recognized fast and costs more trust than it buys.
Turn them on for a real promotion with a real end date, and take them down when it ends.

### Seasonal angles worth testing

- **Pre-hurricane season (Feb–May).** Florida's season opens June 1. "Rated, permitted
  and installed before June 1 — permits take X weeks, so book by [date]" is *genuine*
  deadline urgency, which is the only kind worth using.
- **My Safe Florida Home.** Storm Smart promotes it heavily. If Eclipse's
  hurricane-rated products qualify for the matching grant, that is a bigger lever than
  any discount — grants have run up to $10,000. Worth confirming eligibility and, if it
  applies, giving it its own section.
- **Off-season install discount (Aug–Oct).** Fills the calendar when demand dips.

### What to measure

`site.js` fires `estimate_started`, `estimate_completed`, `booking_opened` and
`form_submitted` into Google Analytics and Meta as soon as you add the IDs to
`config.analytics`. The ratio that matters most is **estimate_completed →
booking_opened**: that's the offer doing its job, or not.

Given the 391% figure on first-minute response, the highest-return change is not on
this page at all — it's how fast someone calls the lead back.
