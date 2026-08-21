# Financing (Acorn Finance)

`/financing` carries an interactive payment calculator and routes pre-qualification to
**Acorn Finance**, a lending marketplace.

## The critical distinction

Acorn is **not a lender**, and neither is Top Dog. A homeowner submits one form and Acorn
returns offers from its network of lending partners; the homeowner then completes the loan
with whichever lender they choose.

Every piece of copy on the site reflects this. Do not let it drift into "our financing" or
"we offer 0% APR" — Top Dog makes no credit decisions and offers no rates, and saying
otherwise is a Truth in Lending Act / Regulation Z problem.

## Changing the link or the published ranges

Everything lives in `src/data/financing.ts`:

```ts
prequalifyUrl: 'https://www.acornfinance.com/pre-qualify/?d=U6H70&utm_medium=web_pre_qual_link',
minAmount: 1_000,   maxAmount: 100_000,
minApr: 4.99,       maxApr: 35.99,
minMonths: 24,      maxMonths: 144,
```

The calculator, the "at a glance" card, the FAQ answers and the legal disclosure all read
from this object, so a single edit keeps them consistent.

> ⚠ **These are disclosures, not marketing copy.** If Acorn updates its published ranges,
> update them here the same day. Advertising a rate the lender network does not offer is a
> regulatory problem, not a typo.

## The calculator

`src/components/PaymentCalculator.astro`. Standard fixed-rate amortisation:

```
payment = P · r / (1 − (1 + r)^−n)      r = APR / 100 / 12
```

Zero-rate is special-cased so it does not divide by zero. Verified against the closed-form
result — $45,000 at 7.99% over 144 months returns $487, matching $486.86 to the rounding.

The credit-band buttons only pick an **illustrative** APR to make the maths concrete. They
are not offers, they are not a soft pull, and the UI says so directly under the buttons and
again in the legal block.

### Adjusting the illustrative rates

`creditBands` in `src/data/financing.ts`. Keep them inside the published `minApr`–`maxApr`
range, and keep them plausible — a homeowner who sees "7.99%" here and is offered 24% will
not thank you for the difference.

## Disclosure block

Rendered at the bottom of the calculator, deliberately not collapsed or greyed out. It
covers: estimate-not-an-offer, Acorn is a marketplace, Top Dog is not a lender, subject to
credit approval, the full APR/amount/term ranges, and soft-vs-hard credit inquiry.

If your lender relationship changes, that block and `src/data/financing.ts` are the two
places to update.
