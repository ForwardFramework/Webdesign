import type { Listing, ListingQuery } from '../types';
import { resolveVillageSlug } from '../village-map';
import { VILLAGES } from '@/data/villages';

/**
 * Shared RESO Web API layer.
 *
 * MLS Grid and Bridge Interactive are the two API routes Stellar MLS offers,
 * and both speak the RESO Data Dictionary over OData — so the filter builder
 * and the field mapper are shared and only auth/base URL differ.
 */

export const RESO_FIELDS = [
  'ListingKey', 'ListingId', 'StandardStatus', 'ListPrice',
  'BedroomsTotal', 'BathroomsFull', 'BathroomsHalf', 'LivingArea',
  'LotSizeAcres', 'YearBuilt', 'PropertyType', 'PropertySubType', 'NewConstructionYN',
  'UnparsedAddress', 'StreetNumberNumeric', 'StreetNumber', 'StreetDirPrefix', 'StreetName', 'StreetSuffix', 'UnitNumber',
  'City', 'StateOrProvince', 'PostalCode', 'SubdivisionName',
  'Latitude', 'Longitude', 'PublicRemarks', 'DaysOnMarket',
  'AssociationFee', 'AssociationFeeFrequency', 'TaxAnnualAmount',
  'WaterfrontYN', 'PoolPrivateYN', 'GarageSpaces', 'VirtualTourURLUnbranded',
  'ListOfficeName', 'ListAgentFullName', 'ModificationTimestamp',
].join(',');

const esc = (s: string) => s.replace(/'/g, "''");

/** Cities we will ever ask for. Guards against a caller widening the feed query. */
const ALLOWED_CITIES = [
  'Lakewood Ranch', 'Bradenton', 'Sarasota', 'Parrish', 'Palmetto',
  'Ellenton', 'Venice', 'Osprey', 'Nokomis', 'Myakka City', 'University Park',
];

export function buildResoFilter(q: ListingQuery, originatingSystem?: string): string {
  const parts: string[] = [];

  if (originatingSystem) parts.push(`OriginatingSystemName eq '${esc(originatingSystem)}'`);

  const statuses = q.status?.length ? q.status : ['Active', 'Active Under Contract'];
  parts.push(`(${statuses.map((s) => `StandardStatus eq '${esc(s)}'`).join(' or ')})`);

  const cities = (q.cities?.length ? q.cities : ALLOWED_CITIES).filter((c) => ALLOWED_CITIES.includes(c));
  if (cities.length) parts.push(`(${cities.map((c) => `City eq '${esc(c)}'`).join(' or ')})`);

  if (q.minPrice) parts.push(`ListPrice ge ${Math.floor(q.minPrice)}`);
  if (q.maxPrice) parts.push(`ListPrice le ${Math.floor(q.maxPrice)}`);
  if (q.minBeds) parts.push(`BedroomsTotal ge ${Math.floor(q.minBeds)}`);
  if (q.minBaths) parts.push(`BathroomsFull ge ${Math.floor(q.minBaths)}`);
  if (q.minSqft) parts.push(`LivingArea ge ${Math.floor(q.minSqft)}`);
  if (q.newConstruction) parts.push('NewConstructionYN eq true');
  if (q.pool) parts.push('PoolPrivateYN eq true');
  if (q.waterfront) parts.push('WaterfrontYN eq true');
  if (q.propertyTypes?.length) {
    parts.push(`(${q.propertyTypes.map((t) => `PropertySubType eq '${esc(t)}'`).join(' or ')})`);
  }

  // Village filtering is done in-process after mapping: SubdivisionName is free
  // text, so an OData equality filter on it would silently drop most matches.
  return parts.join(' and ');
}

export function resoOrderBy(sort: ListingQuery['sort']): string {
  switch (sort) {
    case 'price-asc': return 'ListPrice asc';
    case 'price-desc': return 'ListPrice desc';
    case 'sqft-desc': return 'LivingArea desc';
    case 'newest':
    default: return 'ModificationTimestamp desc';
  }
}

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null);

function buildAddress(r: Record<string, unknown>): string {
  const unparsed = str(r.UnparsedAddress);
  if (unparsed) return unparsed;
  return [r.StreetNumber, r.StreetDirPrefix, r.StreetName, r.StreetSuffix, r.UnitNumber]
    .filter(Boolean)
    .join(' ')
    .trim();
}

function extractPhotos(r: Record<string, unknown>): string[] {
  const media = r.Media;
  if (!Array.isArray(media)) return [];
  return media
    .map((m) => (m && typeof m === 'object' ? (m as Record<string, unknown>) : null))
    .filter((m): m is Record<string, unknown> => !!m)
    .sort((a, b) => (num(a.Order) ?? 999) - (num(b.Order) ?? 999))
    .map((m) => str(m.MediaURL))
    .filter((u): u is string => !!u)
    .slice(0, 30);
}

export function mapResoRecord(r: Record<string, unknown>): Listing {
  const subdivision = str(r.SubdivisionName);
  return {
    id: str(r.ListingKey) ?? str(r.ListingId) ?? crypto.randomUUID(),
    mlsNumber: str(r.ListingId) ?? '',
    status: str(r.StandardStatus) ?? 'Active',
    price: num(r.ListPrice) ?? 0,
    beds: num(r.BedroomsTotal),
    baths: num(r.BathroomsFull),
    halfBaths: num(r.BathroomsHalf),
    sqft: num(r.LivingArea),
    lotSizeAcres: num(r.LotSizeAcres),
    yearBuilt: num(r.YearBuilt),
    propertyType: str(r.PropertyType),
    propertySubType: str(r.PropertySubType),
    isNewConstruction: r.NewConstructionYN === true,
    address: buildAddress(r),
    city: str(r.City) ?? '',
    state: str(r.StateOrProvince) ?? 'FL',
    zip: str(r.PostalCode) ?? '',
    subdivision,
    villageSlug: resolveVillageSlug(subdivision),
    lat: num(r.Latitude),
    lng: num(r.Longitude),
    photos: extractPhotos(r),
    description: str(r.PublicRemarks),
    daysOnMarket: num(r.DaysOnMarket),
    hoaFee: num(r.AssociationFee),
    hoaFrequency: str(r.AssociationFeeFrequency),
    cddFeeAnnual: null, // Stellar carries CDD in varying custom fields; surfaced from village data instead.
    taxAnnual: num(r.TaxAnnualAmount),
    waterfront: r.WaterfrontYN === true,
    pool: r.PoolPrivateYN === true,
    garageSpaces: num(r.GarageSpaces),
    virtualTourUrl: str(r.VirtualTourURLUnbranded),
    listOfficeName: str(r.ListOfficeName),
    listAgentName: str(r.ListAgentFullName),
    modificationTimestamp: str(r.ModificationTimestamp),
  };
}

/** Village + HOA filters run here because they cannot be expressed reliably in OData. */
export function applyPostFilters(listings: Listing[], q: ListingQuery): Listing[] {
  let out = listings;
  if (q.villages?.length) {
    const want = new Set(q.villages);
    out = out.filter((l) => l.villageSlug && want.has(l.villageSlug));
  }
  if (q.maxHoa != null) {
    out = out.filter((l) => {
      if (l.hoaFee == null) return true;
      const monthly = monthlyHoa(l.hoaFee, l.hoaFrequency);
      return monthly == null || monthly <= q.maxHoa!;
    });
  }
  return out;
}

export function monthlyHoa(fee: number | null, frequency: string | null): number | null {
  if (fee == null) return null;
  switch ((frequency ?? '').toLowerCase()) {
    case 'monthly': return fee;
    case 'quarterly': return fee / 3;
    case 'semi-annually': case 'semiannually': return fee / 6;
    case 'annually': case 'yearly': return fee / 12;
    default: return fee;
  }
}

export const VILLAGE_SLUGS = new Set(VILLAGES.map((v) => v.slug));
