/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  INSTANT ROOF ESTIMATE — PRICING ENGINE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  A transparent, auditable estimator. Every number below is a published,
 *  editable assumption rather than a black box, so Top Dog can tune it from real
 *  job costs without touching the UI.
 *
 *  HOW A REAL SATELLITE MEASUREMENT DROPS IN
 *  ------------------------------------------
 *  `measureRoof()` is the single seam. Today it derives roof area from the
 *  homeowner's stated home size, footprint and pitch. Swap its body for a call to
 *  a measurement provider (Roofle RoofQuote PRO, EagleView, Nearmap, or Google's
 *  Solar API `buildingInsights` endpoint, which returns real roof-segment areas
 *  and pitches) and the rest of the flow keeps working unchanged. See
 *  docs/ROOF-ESTIMATOR.md.
 */

export type PitchKey = 'low' | 'medium' | 'steep' | 'very-steep';
export type ComplexityKey = 'simple' | 'moderate' | 'complex';
export type LayersKey = '1' | '2' | '3';
export type MaterialKey =
  | 'architectural'
  | 'designer'
  | 'exposed-fastener'
  | 'standing-seam'
  | 'tpo'
  | 'epdm';

/** Installed cost per square foot of ROOF SURFACE (not floor area), 2026 Pittsburgh. */
export const MATERIALS: Record<
  MaterialKey,
  { label: string; short: string; low: number; high: number; blurb: string; warranty: string; lifespan: string }
> = {
  architectural: {
    label: 'Architectural Asphalt Shingles',
    short: 'Architectural shingle',
    low: 5.5,
    high: 8.5,
    blurb: 'Owens Corning Duration® laminate shingles with SureNail® — the Pittsburgh standard.',
    warranty: 'Lifetime shingle warranty · Preferred Protection system warranty available',
    lifespan: '25–30 years',
  },
  designer: {
    label: 'Designer / Premium Shingles',
    short: 'Designer shingle',
    low: 7.5,
    high: 11,
    blurb: 'Heavier profile shingles that mimic slate or shake, with deeper shadow lines.',
    warranty: 'Lifetime shingle warranty · Preferred Protection system warranty available',
    lifespan: '30–40 years',
  },
  'exposed-fastener': {
    label: 'Exposed Fastener Metal',
    short: 'Exposed fastener metal',
    low: 8,
    high: 13,
    blurb: 'Ag-panel and R-panel steel — the most affordable way into a metal roof.',
    warranty: '25–40 year paint finish warranty',
    lifespan: '40+ years',
  },
  'standing-seam': {
    label: 'Standing Seam Metal',
    short: 'Standing seam metal',
    low: 14,
    high: 22,
    blurb: 'Concealed fasteners, mechanically seamed. The longest-lived roof you can buy.',
    warranty: '30–40 year paint finish warranty',
    lifespan: '50+ years',
  },
  tpo: {
    label: 'TPO Membrane (flat / low-slope)',
    short: 'TPO membrane',
    low: 9,
    high: 14,
    blurb: 'Heat-welded reflective single-ply for flat and low-slope roofs.',
    warranty: '15–25 year membrane warranty',
    lifespan: '20–30 years',
  },
  epdm: {
    label: 'EPDM Rubber (flat / low-slope)',
    short: 'EPDM rubber',
    low: 8,
    high: 13,
    blurb: 'Fully adhered rubber membrane — proven for decades on Pittsburgh flat roofs.',
    warranty: '10–30 year membrane warranty',
    lifespan: '20–30 years',
  },
};

/** Roof surface area ÷ building footprint, by roof slope. */
export const PITCH: Record<PitchKey, { label: string; hint: string; multiplier: number }> = {
  low: { label: 'Low / flat', hint: 'You could walk it comfortably. 2:12–4:12.', multiplier: 1.05 },
  medium: { label: 'Average', hint: 'Typical suburban roof. 5:12–7:12.', multiplier: 1.16 },
  steep: { label: 'Steep', hint: 'You would want a harness. 8:12–10:12.', multiplier: 1.32 },
  'very-steep': { label: 'Very steep', hint: 'Victorian, A-frame, or a tall gable. 11:12+.', multiplier: 1.48 },
};

/** Waste, cut-up factor and detail labor for hips, valleys, dormers and skylights. */
export const COMPLEXITY: Record<ComplexityKey, { label: string; hint: string; multiplier: number }> = {
  simple: { label: 'Simple', hint: 'One or two planes, few or no valleys.', multiplier: 1.07 },
  moderate: { label: 'Average', hint: 'A few valleys, a dormer or two, one chimney.', multiplier: 1.15 },
  complex: { label: 'Cut up', hint: 'Many valleys, dormers, skylights or roof levels.', multiplier: 1.26 },
};

/** Tear-off and disposal added per square foot of roof surface. */
export const TEAROFF: Record<LayersKey, { label: string; perSqFt: number }> = {
  '1': { label: 'One layer', perSqFt: 1.0 },
  '2': { label: 'Two layers', perSqFt: 1.8 },
  '3': { label: 'Three or more', perSqFt: 2.6 },
};

export type EstimateInput = {
  homeSqFt: number;
  stories: 1 | 1.5 | 2 | 3;
  pitch: PitchKey;
  complexity: ComplexityKey;
  layers: LayersKey;
  material: MaterialKey;
};

export type Estimate = {
  roofSqFt: number;
  squares: number;
  low: number;
  high: number;
  material: (typeof MATERIALS)[MaterialKey];
  /** Monthly payment at the advertised promotional term, for the finance framing. */
  monthlyLow: number;
  monthlyHigh: number;
};

/**
 * ⬅ INTEGRATION SEAM. Replace the body of this function with a call to a
 * satellite measurement provider to get true measured area instead of a
 * footprint estimate. Everything downstream consumes `roofSqFt` only.
 */
export function measureRoof(input: Pick<EstimateInput, 'homeSqFt' | 'stories' | 'pitch'>): number {
  // Living area ÷ stories approximates the building footprint. The 1.12 factor
  // accounts for eave overhangs, porches and attached garages, which carry roof
  // but no conditioned floor area.
  const footprint = (input.homeSqFt / input.stories) * 1.12;
  return footprint * PITCH[input.pitch].multiplier;
}

/** Promotional financing terms used for the "from $X/month" framing. */
const FINANCE_MONTHS = 120;

export function calculateEstimate(input: EstimateInput): Estimate {
  const roofSqFt = measureRoof(input);
  const material = MATERIALS[input.material];
  const complexityMult = COMPLEXITY[input.complexity].multiplier;
  const tearoff = TEAROFF[input.layers].perSqFt;

  const low = roofSqFt * (material.low * complexityMult + tearoff);
  const high = roofSqFt * (material.high * complexityMult + tearoff);

  const round = (n: number) => Math.round(n / 100) * 100;

  return {
    roofSqFt: Math.round(roofSqFt),
    squares: Math.round((roofSqFt / 100) * 10) / 10,
    low: round(low),
    high: round(high),
    material,
    monthlyLow: Math.round(low / FINANCE_MONTHS / 5) * 5,
    monthlyHigh: Math.round(high / FINANCE_MONTHS / 5) * 5,
  };
}

export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
