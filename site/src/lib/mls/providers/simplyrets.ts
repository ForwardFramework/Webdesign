import type { Listing, ListingQuery, ListingResult } from '../types';
import { resolveVillageSlug } from '../village-map';
import { applyPostFilters } from './reso';

/**
 * SimplyRETS — a common turnkey IDX vendor. Included as a third option because
 * some brokerages already have a SimplyRETS subscription and would rather not
 * run their own Stellar MLS agreement.
 */
export async function fetchSimplyRets(q: ListingQuery): Promise<ListingResult> {
  const user = process.env.SIMPLYRETS_USER;
  const pass = process.env.SIMPLYRETS_PASSWORD;
  if (!user || !pass) throw new Error('SIMPLYRETS_USER / SIMPLYRETS_PASSWORD are not set');

  const params = new URLSearchParams();
  params.set('limit', String(Math.min(q.limit ?? 24, 100)));
  params.set('offset', String(q.offset ?? 0));
  if (q.minPrice) params.set('minprice', String(q.minPrice));
  if (q.maxPrice) params.set('maxprice', String(q.maxPrice));
  if (q.minBeds) params.set('minbeds', String(q.minBeds));
  if (q.minBaths) params.set('minbaths', String(q.minBaths));
  (q.cities ?? ['Lakewood Ranch', 'Bradenton', 'Sarasota']).forEach((c) => params.append('cities', c));

  const res = await fetch(`https://api.simplyrets.com/properties?${params}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`,
      Accept: 'application/json',
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`SimplyRETS ${res.status}`);

  const rows = (await res.json()) as Record<string, unknown>[];
  const mapped: Listing[] = rows.map((r) => {
    const property = (r.property ?? {}) as Record<string, unknown>;
    const address = (r.address ?? {}) as Record<string, unknown>;
    const geo = (r.geo ?? {}) as Record<string, unknown>;
    const agent = (r.agent ?? {}) as Record<string, unknown>;
    const office = (r.office ?? {}) as Record<string, unknown>;
    const subdivision = (property.subdivision as string) ?? null;
    return {
      id: String(r.mlsId ?? ''),
      mlsNumber: String(r.listingId ?? r.mlsId ?? ''),
      status: (r.mls as Record<string, unknown> | undefined)?.status as string ?? 'Active',
      price: Number(r.listPrice ?? 0),
      beds: (property.bedrooms as number) ?? null,
      baths: (property.bathsFull as number) ?? null,
      halfBaths: (property.bathsHalf as number) ?? null,
      sqft: (property.area as number) ?? null,
      lotSizeAcres: null,
      yearBuilt: (property.yearBuilt as number) ?? null,
      propertyType: (property.type as string) ?? null,
      propertySubType: (property.subType as string) ?? null,
      isNewConstruction: false,
      address: [address.streetNumber, address.streetName].filter(Boolean).join(' '),
      city: (address.city as string) ?? '',
      state: (address.state as string) ?? 'FL',
      zip: String(address.postalCode ?? ''),
      subdivision,
      villageSlug: resolveVillageSlug(subdivision),
      lat: (geo.lat as number) ?? null,
      lng: (geo.lng as number) ?? null,
      photos: Array.isArray(r.photos) ? (r.photos as string[]).slice(0, 30) : [],
      description: (r.remarks as string) ?? null,
      daysOnMarket: null,
      hoaFee: (r.association as Record<string, unknown> | undefined)?.fee as number ?? null,
      hoaFrequency: (r.association as Record<string, unknown> | undefined)?.frequency as string ?? null,
      cddFeeAnnual: null,
      taxAnnual: (r.tax as Record<string, unknown> | undefined)?.taxAnnualAmount as number ?? null,
      waterfront: false,
      pool: false,
      garageSpaces: (property.garageSpaces as number) ?? null,
      virtualTourUrl: (r.virtualTourUrl as string) ?? null,
      listOfficeName: (office.name as string) ?? null,
      listAgentName: [agent.firstName, agent.lastName].filter(Boolean).join(' ') || null,
      modificationTimestamp: (r.modified as string) ?? null,
    };
  });

  const filtered = applyPostFilters(mapped, q);
  return {
    listings: filtered,
    total: filtered.length,
    provider: 'simplyrets',
    isLive: true,
    lastUpdated: filtered[0]?.modificationTimestamp ?? new Date().toISOString(),
  };
}
