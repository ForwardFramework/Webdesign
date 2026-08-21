# Instant roof estimate — how it works and how to tune it

Lives at **`/instant-roof-quote`**. Four steps, and the price appears **before** the
contact form, not behind it. That ordering is the whole reason these tools convert:
the homeowner gets something before being asked for anything.

- **UI**: `src/components/RoofEstimator.astro`
- **Pricing engine**: `src/scripts/roof-estimate.ts`

Every number is a named, editable constant. There is no black box.

---

## Tuning the pricing

Open `src/scripts/roof-estimate.ts`. Four tables drive everything:

### 1. `MATERIALS` — installed cost per square foot of **roof surface**

```ts
architectural: { low: 5.5,  high: 8.5,  … }   // $/sq ft installed
'standing-seam': { low: 14, high: 22,   … }
```

These are Greater Pittsburgh installed rates including tear-off labor but **excluding**
disposal (which lives in `TEAROFF`). Re-check them against your last ten jobs a couple of
times a year and adjust. `lifespan`, `blurb` and `warranty` on each entry are what the
homeowner reads on the selection cards.

### 2. `PITCH` — roof surface ÷ building footprint

Standard slope multipliers. You should not need to change these; they are geometry.

### 3. `COMPLEXITY` — waste and cut-up factor

Covers valleys, dormers, skylights and the extra labor they carry. Raise the `complex`
multiplier if cut-up roofs are consistently coming in over the estimate.

### 4. `TEAROFF` — disposal added per square foot, by existing layer count

Dumpster pricing moves. This is the constant most worth revisiting.

### Financing framing

`FINANCE_MONTHS` (default `120`) drives the "or approximately $X/month" line. Set it to
match whatever term your lender actually advertises.

---

## Plugging in real satellite measurement

There is exactly one seam to replace:

```ts
export function measureRoof(input): number
```

Today it derives roof area from the homeowner's stated living area, story count and
pitch. Everything downstream consumes only its `roofSqFt` return value, so swapping the
body for a real measurement call changes nothing else.

Providers worth looking at:

| Provider | Notes |
|---|---|
| **Roofle RoofQuote PRO** | Purpose-built for roofing contractors; reports 8–15% form-completion conversion. Sold as a hosted widget, so you would embed theirs rather than call an API. |
| **EagleView** | The measurement standard in the trade. Per-report pricing, high accuracy, not instant. |
| **Google Solar API** (`buildingInsights`) | Returns real roof-segment areas, pitches and azimuths from imagery. Genuinely instant, generous free tier, and the best fit for this architecture. |
| **Nearmap / Vexcel** | High-resolution imagery with measurement APIs; enterprise pricing. |

A Google Solar API version looks roughly like:

```ts
export async function measureRoof(input) {
  const { lat, lng } = await geocode(input.address);          // Geocoding API
  const r = await fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest` +
    `?location.latitude=${lat}&location.longitude=${lng}&key=${KEY}`
  );
  const data = await r.json();
  return data.solarPotential.wholeRoofStats.areaMeters2 * 10.7639;   // → sq ft
}
```

Two things to handle when you do this:

1. **It becomes async.** `calculateEstimate` and its callers in `RoofEstimator.astro`
   need `await`. The "scanning" animation already covers roughly two seconds, so there is
   a natural place to hide the latency.
2. **The API key must not ship to the browser.** Put the call behind a serverless
   function (alongside `lead.mts`) and have the component fetch that.

Keep the pitch and complexity questions even with real measurement — imagery gives you
area reliably, but layer count and decking condition still come from the homeowner.

---

## What the lead email contains

When someone books the inspection from the results screen, the hidden
`estimate_summary` field travels with the lead:

```
Address: 1200 Library Rd, Bethel Park, PA
Home: 2,400 sq ft, 2 stories
Roof: medium pitch, moderate complexity, 1 existing layer(s)
System: Standing Seam Metal
Measured roof area: ~1,559 sq ft (15.6 squares)
Instant estimate: $26,700 – $41,000
```

So whoever calls them back already knows what they were quoted and what they picked.

---

## Accuracy, honestly

The tool returns a **budget range, not a quote**, and the page says so in three places.
Pitch, complexity and layer count all come from a homeowner's best guess, and decking
condition is invisible from any imagery. The range is wide on purpose. Narrowing it to
look precise would just mean being confidently wrong more often.
