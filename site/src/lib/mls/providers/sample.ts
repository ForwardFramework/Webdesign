import type { Listing, ListingQuery, ListingResult } from '../types';
import { VILLAGES } from '@/data/villages';
import { applyPostFilters } from './reso';

/**
 * SAMPLE PROVIDER — used only when no MLS credentials are configured.
 *
 * These are NOT real listings and must never be presented as such. Every record
 * carries a `SAMPLE-` MLS number and the API response sets `isLive: false`, which
 * the UI turns into a persistent, unmissable banner. Showing fabricated
 * inventory as live listings would be deceptive advertising under Fla. Admin.
 * Code 61J2-10.025(1) as well as a straightforward lie to a consumer.
 *
 * Its real job is to let the search UI, filters, map and sorting be built and
 * tested end-to-end before the IDX agreement is executed.
 */

const STREETS = [
  'Sandpiper Trail', 'Heron Cove Way', 'Blue Cypress Loop', 'Marsh Lily Court',
  'Tidewater Run', 'Palmetto Ridge Drive', 'Cordgrass Lane', 'Sabal Key Circle',
  'Ibis Landing Way', 'Saltmarsh Terrace', 'Gulfstream Path', 'Osprey Reach Court',
];

const SUBTYPES = ['Single Family Residence', 'Villa', 'Townhouse', 'Condominium'];

/** Deterministic pseudo-random so the sample set is stable between renders. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildSample(): Listing[] {
  const out: Listing[] = [];
  let n = 0;
  for (const v of VILLAGES) {
    const r = rng(v.slug.split('').reduce((a, c) => a + c.charCodeAt(0), 7));
    const count = 3;
    for (let i = 0; i < count; i++) {
      n += 1;
      const span = v.priceHigh - v.priceLow;
      const price = Math.round((v.priceLow + span * r() * 0.8) / 5000) * 5000;
      const subType = v.homeTypes.some((h) => /town/i.test(h)) && i === 2 ? 'Townhouse' : SUBTYPES[Math.floor(r() * 2)];
      const beds = 2 + Math.floor(r() * 4);
      const sqft = Math.round((1400 + r() * 2600) / 10) * 10;
      out.push({
        id: `sample-${v.slug}-${i}`,
        mlsNumber: `SAMPLE-${String(100000 + n)}`,
        status: r() > 0.85 ? 'Active Under Contract' : 'Active',
        price,
        beds,
        baths: Math.max(2, Math.round(beds * 0.75)),
        halfBaths: r() > 0.7 ? 1 : 0,
        sqft,
        lotSizeAcres: Math.round(r() * 40) / 100 + 0.12,
        yearBuilt: v.status === 'resale' ? 1998 + Math.floor(r() * 22) : 2021 + Math.floor(r() * 5),
        propertyType: 'Residential',
        propertySubType: subType,
        isNewConstruction: v.status === 'selling' && r() > 0.5,
        address: `${1000 + Math.floor(r() * 8000)} ${STREETS[Math.floor(r() * STREETS.length)]}`,
        city: v.county === 'Sarasota' ? 'Sarasota' : 'Lakewood Ranch',
        state: 'FL',
        zip: v.zip,
        subdivision: v.name,
        villageSlug: v.slug,
        lat: v.coords.lat + (r() - 0.5) * 0.01,
        lng: v.coords.lng + (r() - 0.5) * 0.01,
        photos: [],
        description: `Illustrative sample record for ${v.name}. This is not a real listing — it exists so the search, filters and map can be demonstrated before the live MLS feed is connected.`,
        daysOnMarket: Math.floor(r() * 120),
        hoaFee: Math.round((v.hoaMonthlyLow + (v.hoaMonthlyHigh - v.hoaMonthlyLow) * r()) / 5) * 5,
        hoaFrequency: 'Monthly',
        cddFeeAnnual: Math.round((v.cddAnnualLow + (v.cddAnnualHigh - v.cddAnnualLow) * r()) / 50) * 50,
        taxAnnual: Math.round((price * 0.013) / 50) * 50,
        waterfront: r() > 0.75,
        pool: r() > 0.5,
        garageSpaces: 2 + (r() > 0.8 ? 1 : 0),
        virtualTourUrl: null,
        listOfficeName: 'Sample data — no listing office',
        listAgentName: null,
        modificationTimestamp: new Date().toISOString(),
      });
    }
  }
  return out;
}

const ALL = buildSample();

export function fetchSample(q: ListingQuery): ListingResult {
  let out = ALL.slice();

  if (q.minPrice) out = out.filter((l) => l.price >= q.minPrice!);
  if (q.maxPrice) out = out.filter((l) => l.price <= q.maxPrice!);
  if (q.minBeds) out = out.filter((l) => (l.beds ?? 0) >= q.minBeds!);
  if (q.minBaths) out = out.filter((l) => (l.baths ?? 0) >= q.minBaths!);
  if (q.minSqft) out = out.filter((l) => (l.sqft ?? 0) >= q.minSqft!);
  if (q.newConstruction) out = out.filter((l) => l.isNewConstruction);
  if (q.pool) out = out.filter((l) => l.pool);
  if (q.waterfront) out = out.filter((l) => l.waterfront);
  if (q.cities?.length) out = out.filter((l) => q.cities!.includes(l.city));
  if (q.propertyTypes?.length) out = out.filter((l) => l.propertySubType && q.propertyTypes!.includes(l.propertySubType));
  out = applyPostFilters(out, q);

  switch (q.sort) {
    case 'price-asc': out.sort((a, b) => a.price - b.price); break;
    case 'price-desc': out.sort((a, b) => b.price - a.price); break;
    case 'sqft-desc': out.sort((a, b) => (b.sqft ?? 0) - (a.sqft ?? 0)); break;
    default: out.sort((a, b) => (a.daysOnMarket ?? 0) - (b.daysOnMarket ?? 0));
  }

  const total = out.length;
  const offset = q.offset ?? 0;
  return {
    listings: out.slice(offset, offset + (q.limit ?? 24)),
    total,
    provider: 'sample',
    isLive: false,
    lastUpdated: null,
    notice:
      'No MLS feed is connected yet, so these are illustrative sample records — not real listings, not real prices, not available for sale. Connect a Stellar MLS IDX feed to show live inventory.',
  };
}
