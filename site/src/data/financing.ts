/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FINANCING — Acorn Finance
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Top Dog's customer-facing pre-qualification link. Acorn is a **marketplace**,
 *  not a lender: a homeowner submits one form and Acorn returns offers from its
 *  network of lending partners.
 *
 *  ⚠ EVERY NUMBER BELOW IS A DISCLOSURE, NOT MARKETING COPY.
 *  Advertising a rate, term or amount that the lender network does not actually
 *  offer is a Truth in Lending Act / Regulation Z problem. If Acorn updates its
 *  published ranges, update them here — the calculator, the copy and the legal
 *  block all read from this one object.
 *
 *  Source: Acorn Finance published contractor and consumer disclosures.
 */

export const financing = {
  partner: 'Acorn Finance',
  partnerUrl: 'https://www.acornfinance.com',

  /** Top Dog's own pre-qualification link. */
  prequalifyUrl:
    'https://www.acornfinance.com/pre-qualify/?d=U6H70&utm_medium=web_pre_qual_link',

  /** Published loan amount range across the lender network. */
  minAmount: 1_000,
  maxAmount: 100_000,

  /** Published APR range across the lender network. */
  minApr: 4.99,
  maxApr: 35.99,

  /** Published term range, in months. */
  minMonths: 24,
  maxMonths: 144,

  /**
   * Indicative APRs by self-reported credit band, used only to seed the
   * calculator's slider. These are illustrative mid-points inside the published
   * range — they are NOT offers, and the UI says so plainly.
   */
  creditBands: [
    { id: 'excellent', label: 'Excellent', range: '720+', apr: 7.99 },
    { id: 'good', label: 'Good', range: '660–719', apr: 12.99 },
    { id: 'fair', label: 'Fair', range: '600–659', apr: 19.99 },
    { id: 'building', label: 'Building', range: 'Under 600', apr: 27.99 },
  ],

  /** Terms offered in the calculator, in months. */
  termOptions: [24, 36, 48, 60, 84, 120, 144],

  defaults: {
    amount: 18_000,
    months: 84,
    band: 'good',
  },
} as const;

export type CreditBand = (typeof financing.creditBands)[number];
