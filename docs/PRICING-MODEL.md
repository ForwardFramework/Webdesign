# The pricing model

How the instant estimator arrives at a number, where the rates came from, and how to
retune them when your costs move.

Everything lives in **`assets/js/pricing-data.js`**. Changing a number there changes
the site. Then run `node tests/pricing.test.js` — the tests are calibrated against the
benchmarks below and will tell you if you've drifted out of the market.

---

## 1. How the math works

Each answer contributes **one midpoint number** — a rate per square foot, a flat
adder, or a multiplier:

```
perUnit  = area × (rate + rateAdders) × multipliers + unitFlatAdders
estimate = perUnit × volumeFactor + projectFlatAdders + (areaRate × area)
range    = estimate ∓ confidenceBand
```

**Why a midpoint plus a band, instead of a low rate and a high rate?**

The obvious approach — give every input a low and a high, then add up the lows and the
highs — compounds. A low rate times a low multiplier times a low quantity, against the
same chain of highs, produces ranges 70%+ wide. "Your awning will cost between $4,000
and $12,000" tells a customer nothing and makes you look like you're guessing.

One midpoint, one band at the end, stays tight and honest.

### The confidence band

```js
band: { base: 0.16, perUnsureAnswer: 0.025, max: 0.28 }
```

- **±16%** when every answer is specific.
- **+2.5%** for each "Not sure" the visitor picks — the estimate genuinely *is* less
  certain, and the result panel says so out loud.
- **Capped at ±28%.** Past that a range stops being useful, so we stop widening it and
  lean on "we'll tighten this when we measure" instead.

### Other guards

- **`minProject`** floors tiny jobs. A 6-foot awning doesn't cost 6/16ths of a 16-foot
  awning — there's a truck, a crew and a minimum either way.
- **Volume factors** are pre-discounted, not linear: three awnings bill at 2.88× one,
  not 3×. One trip, one setup, one permit run.
- **Rounding** to the nearest $50 under $10k, $100 above. A range reading
  "$5,347–$7,318" implies a precision that doesn't exist.

---

## 2. Where the rates came from

Benchmarked against published 2026 installed-cost data and Southwest Florida market
pricing. **Every rate below is a midpoint, installed.**

### Retractable & fixed fabric awnings

| Input | Rate |
|---|---|
| Retractable, hand crank | $22 / sq ft |
| Retractable, motorized | $31 / sq ft |
| Fixed / stationary | $27 / sq ft |
| Semi-cassette | +$4.50 / sq ft |
| Full cassette | +$8.50 / sq ft |
| Premium marine fabric | ×1.12 |
| Blackout-lined | ×1.20 |
| Second-storey mount | ×1.15 |
| Wind sensor / LED / smart control / valance | +$385 / $675 / $300 / $950 per awning |
| Project minimum | $1,750 |

**Benchmarks.** National installed cost runs **$15–30/sq ft**, with most homeowners
paying **$1,000–$3,500**, motorized units landing **$1,000–$6,000**, and motors adding
**$500–$2,000** over manual ([HomeGuide](https://homeguide.com/costs/retractable-awning-cost), [Angi](https://www.angi.com/articles/how-much-do-retractable-awnings-cost.htm), [Marygrove](https://marygrove.com/retractable-awning-cost-guide/)).

**Sanity checks the tests enforce:**
- 12′×10′ manual, open roll, standard fabric → **~$2,640** (Angi's "most homeowners" band)
- 15′×11.5′ motorized, semi-cassette, premium fabric, wind sensor → **~$7,000**
  (a premium Florida cassette install, consistent with dealer pricing at that size)

### Solar & hurricane rated motorized roll screens

Rate is a **purpose × operation** matrix, per square foot:

| | Motorized | Motorized + solar | Manual |
|---|---|---|---|
| Block sun & heat | $29 | $34 | $20 |
| Hurricane protection | $52 | $58 | $40 |
| Both | $58 | $64 | $44 |
| Privacy & insects | $26 | $31 | $18 |

Plus **$450 per opening** (motorized) for motor, brackets, tracks and labor;
**×1.10** coastal high-wind zone; **+$900** permit and engineering; **+$6/sq ft** for
zipper side-retention track.

**Benchmarks.** Motorized roll-downs in Florida run **$45–65/sq ft installed**, with
the full spectrum from entry-level motors to premium marine-grade systems spanning
**$50–175/sq ft**. Coastal homes sit in higher wind zones and need higher-rated —
costlier — product. Quotes normally include engineering, county permits, hardware and
installation ([Eurex Shutters](https://eurexshutters.com/roll-down-hurricane-screens-cost/), [HomeGuide](https://homeguide.com/costs/hurricane-shutters-cost), [Total Shutter, Sarasota](https://totalshutter.com/blog/hurricane-shutter-cost-guide-sarasota-2025)).

**Sanity check:** three 12′×10′ coastal hurricane openings, motorized, permitted →
**~$21,000**, an implied ~$74/sq ft all-in. Above the plain $45–65 band, which is
correct: that band is the product, and this figure carries the coastal wind-zone
uprate plus sealed engineering and permitting.

### Custom aluminum shade solutions

| Structure | Rate |
|---|---|
| Open lattice pergola | $40 / sq ft |
| Solid roof cover | $44 / sq ft |
| Insulated roof panel | $50 / sq ft |
| Motorized louvered roof | $95 / sq ft |
| Screen enclosure / cage | $24 / sq ft |

Plus **$1,450** permit and engineering (always — these are permanent structures);
**×1.12** free-standing; **×1.12** coastal; **×1.10** tall, **×1.22** elevated;
**+$1,800** new footings or **+$11/sq ft** for a new slab; lighting, fans, outlets,
gutters and privacy walls as flat adders.

**Benchmarks.** Solid aluminum patio covers run **$20–50/sq ft installed**, insulated
**$30–60/sq ft**. A custom aluminum pergola in South Florida runs **$8,700–$11,700**,
from about $30/sq ft. Permanent pergolas require a permit and sealed engineering to
Florida wind-load code ([HomeGuide](https://homeguide.com/costs/covered-patio-cost), [813 Patio Pros](https://www.813patiopros.com/aluminum-pergola-cost/), [AB Aluminum](https://www.abaluminumandscreens.com/aluminum-pergolas)).

**Sanity check:** 14′×14′ lattice pergola, existing pavers, inland → **~$9,290**,
squarely inside the published $8,700–$11,700 Florida band.

---

## 3. Retuning it

1. Edit the rate in `assets/js/pricing-data.js`.
2. Update the corresponding benchmark in this file, with its source.
3. Run `node tests/pricing.test.js`.

A failing test means one of two things: you fat-fingered a number, or the market moved
and the benchmark in this document is stale. Both are worth knowing. **Don't just widen
the test to make it green** — that's how an estimator quietly drifts into quoting
numbers your salespeople have to walk back.

### Keeping it honest

Review the rates **twice a year**, and after any material change in aluminum or motor
pricing. Compare the estimator's output against your last 20 signed contracts:

- Estimator consistently **under** your real price → you're generating cheap leads and
  awkward first conversations. Raise the rates.
- Estimator consistently **over** → you're scaring off good leads before they call.
- **Sitting inside the range most of the time is the goal.** The band is ±16%; if
  materially fewer than four in five contracts land inside their estimate, the model is
  wrong, not the customers.

The estimator's job is to get a qualified person to book, arriving with a realistic
expectation. A number that flatters to deceive costs more in wasted design visits than
it ever wins in leads.

---

## 4. What the model deliberately doesn't do

- **Doesn't quote.** Every surface says so: the result panel, the section footer, the
  FAQ and the structured data.
- **Doesn't ask for an email to show the price.** Gating the number kills the thing
  that makes it convert.
- **Doesn't price site conditions it can't see** — rotten fascia, an unusual roof
  structure, a lanai that isn't square, an HOA with opinions. That's what the free
  on-site measurement is for, and the copy sets that expectation up front.
