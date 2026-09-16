import { VILLAGES } from '@/data/villages';

/**
 * MLS `SubdivisionName` is free text entered by listing agents, so it is messy:
 * "LORRAINE LAKES PH I", "Star Farms Ph I-IV", "COUNTRY CLUB EAST AT LWR SUBPHASE..."
 * This normalises it onto our village slugs so the village filter actually works
 * against a real feed rather than only against sample data.
 */

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\b(ph|phase|unit|subphase|sub|pb|blk|lot|at lwr|lwr|lakewood ranch)\b/g, ' ')
    .replace(/\b[ivx]+\b/g, ' ')
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Extra spellings seen in Stellar MLS that would not match on name alone. */
const ALIASES: Record<string, string> = {
  'country club east': 'country-club-east',
  'country club': 'country-club',
  'lake club': 'the-lake-club',
  'lakewood ranch country club': 'country-club',
  esplanade: 'esplanade-golf-country-club',
  'esplanade golf and country club': 'esplanade-golf-country-club',
  'esplanade azario': 'azario',
  azario: 'azario',
  'del webb': 'del-webb-lakewood-ranch',
  cresswind: 'cresswind',
  'star farms': 'star-farms',
  'lorraine lakes': 'lorraine-lakes',
  solera: 'solera',
  savanna: 'savanna',
  'sapphire point': 'sapphire-point',
  'polo run': 'polo-run',
  indigo: 'indigo',
  harmony: 'harmony',
  'arbor grande': 'arbor-grande',
  'mallory park': 'mallory-park',
  'central park': 'central-park',
  greenbrook: 'greenbrook',
  'greenbrook village': 'greenbrook',
  summerfield: 'summerfield',
  'summerfield village': 'summerfield',
  riverwalk: 'riverwalk',
  'riverwalk village': 'riverwalk',
  edgewater: 'edgewater',
  'edgewater village': 'edgewater',
  'palm grove': 'palm-grove',
  isles: 'the-isles',
  'the isles': 'the-isles',
  sweetwater: 'sweetwater',
  woodlands: 'the-woodlands',
  'lakehouse cove': 'lakehouse-cove',
  'lake house cove': 'lakehouse-cove',
  shoreview: 'shoreview',
  'wild blue': 'wild-blue',
  'emerald landing': 'emerald-landing',
  'bungalow walk': 'bungalow-walk',
  peninsula: 'the-peninsula',
};

const BY_NAME = new Map<string, string>();
for (const v of VILLAGES) BY_NAME.set(normalise(v.name), v.slug);

export function resolveVillageSlug(subdivision: string | null | undefined): string | null {
  if (!subdivision) return null;
  const n = normalise(subdivision);
  if (!n) return null;

  const exact = BY_NAME.get(n);
  if (exact) return exact;

  // Longest alias that appears in the string wins, so "esplanade azario" beats "esplanade".
  let best: { slug: string; len: number } | null = null;
  for (const [alias, slug] of Object.entries(ALIASES)) {
    if (n.includes(alias) && (!best || alias.length > best.len)) best = { slug, len: alias.length };
  }
  if (best) return best.slug;

  for (const [name, slug] of BY_NAME) {
    if (name && (n.includes(name) || name.includes(n))) return slug;
  }
  return null;
}
