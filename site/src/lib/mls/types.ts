/** Normalised listing shape. Every provider maps into this so the UI never sees RESO field names. */
export interface Listing {
  id: string;
  mlsNumber: string;
  status: 'Active' | 'Pending' | 'Active Under Contract' | 'Closed' | 'Coming Soon' | string;
  price: number;
  beds: number | null;
  baths: number | null;
  halfBaths: number | null;
  sqft: number | null;
  lotSizeAcres: number | null;
  yearBuilt: number | null;
  propertyType: string | null;
  propertySubType: string | null;
  isNewConstruction: boolean;
  address: string;
  city: string;
  state: string;
  zip: string;
  subdivision: string | null;
  /** Our village slug, resolved from `subdivision`. null when it maps to nothing. */
  villageSlug: string | null;
  lat: number | null;
  lng: number | null;
  photos: string[];
  description: string | null;
  daysOnMarket: number | null;
  hoaFee: number | null;
  hoaFrequency: string | null;
  cddFeeAnnual: number | null;
  taxAnnual: number | null;
  waterfront: boolean;
  pool: boolean;
  garageSpaces: number | null;
  virtualTourUrl: string | null;
  /** IDX attribution — REQUIRED to display. Never strip these. */
  listOfficeName: string | null;
  listAgentName: string | null;
  modificationTimestamp: string | null;
}

export interface ListingQuery {
  villages?: string[];
  cities?: string[];
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  propertyTypes?: string[];
  newConstruction?: boolean;
  pool?: boolean;
  waterfront?: boolean;
  maxHoa?: number;
  status?: string[];
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'sqft-desc';
  limit?: number;
  offset?: number;
}

export interface ListingResult {
  listings: Listing[];
  total: number;
  /** Which provider answered. 'sample' MUST be surfaced in the UI as non-live data. */
  provider: 'mlsgrid' | 'bridge' | 'simplyrets' | 'sample';
  /** True only when the data came from a live MLS feed. */
  isLive: boolean;
  /** Feed freshness, for the IDX "last updated" requirement. */
  lastUpdated: string | null;
  notice?: string;
}
