/**
 * Shared data contracts.
 *
 * Two fields appear on nearly every record and exist on purpose:
 *
 *  • `confidence` — how well the value is corroborated.
 *      'verified'  = taken from an official/primary source named in `sources`
 *      'reported'  = consistently reported by multiple secondary sources
 *      'estimate'  = a reasoned range, shown to users AS a range, never a fact
 *
 *  • `verifiedOn` — ISO date the value was last checked. The UI surfaces this
 *    so a visitor can see how stale a number is instead of trusting it blindly.
 *
 * Nothing in this codebase should render a number without one of these two
 * signals available to the component that displays it.
 */

export type Confidence = 'verified' | 'reported' | 'estimate';

export interface SourceRef {
  id: string;
  label: string;
  url: string;
  /** ISO date the source was consulted. */
  retrieved: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/** Categories drive the map layer toggles. Order here = order in the legend. */
export const PLACE_CATEGORIES = [
  'beach',
  'park',
  'school',
  'dining',
  'grocery',
  'health',
  'dental',
  'fitness',
  'attraction',
  'shopping',
  'essential',
  'golf',
  'airport',
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  /** Free-form sub-label shown on the card, e.g. "Public beach" / "Pediatrics". */
  kind?: string;
  address?: string;
  city: string;
  state: 'FL';
  zip?: string;
  /**
   * APPROXIMATE center point, good to roughly neighborhood scale. Never used
   * for turn-by-turn: `directionsQuery` (name + address) drives every map link
   * so the destination is right even when the pin is a little off.
   */
  coords: LatLng;
  coordPrecision: 'approximate' | 'exact';
  directionsQuery: string;
  website?: string;
  phone?: string;
  blurb?: string;
  /** Anything a family moving in would actually want to know. */
  highlights?: string[];
  confidence: Confidence;
  verifiedOn: string;
  sources?: string[];
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAYS: { key: DayOfWeek; short: string; long: string }[] = [
  { key: 'mon', short: 'Mon', long: 'Monday' },
  { key: 'tue', short: 'Tue', long: 'Tuesday' },
  { key: 'wed', short: 'Wed', long: 'Wednesday' },
  { key: 'thu', short: 'Thu', long: 'Thursday' },
  { key: 'fri', short: 'Fri', long: 'Friday' },
  { key: 'sat', short: 'Sat', long: 'Saturday' },
  { key: 'sun', short: 'Sun', long: 'Sunday' },
];

export interface HappyHour {
  id: string;
  /** Matches a Place id where one exists, so the map and the list stay in sync. */
  placeId?: string;
  venue: string;
  district: string;
  city: string;
  address?: string;
  coords: LatLng;
  days: DayOfWeek[];
  /** Human-readable window, e.g. "4–7 PM". Kept as text: venues word these oddly. */
  window: string;
  /** Short list of the actual deals, when a venue publishes them. */
  deals: string[];
  cuisine?: string;
  website?: string;
  vibe?: 'lively' | 'laid-back' | 'upscale' | 'family' | 'waterfront' | 'sports';
  confidence: Confidence;
  verifiedOn: string;
  sources?: string[];
}

export type VillageArea =
  | 'Country Club & Central'
  | 'Northeast (SR 70 corridor)'
  | 'Waterside (Sarasota County)'
  | 'Original Villages'
  | '55+ Active Adult'
  | 'Southeast Expansion';

export interface Village {
  slug: string;
  name: string;
  area: VillageArea;
  county: 'Manatee' | 'Sarasota';
  zip: string;
  coords: LatLng;
  gated: boolean;
  ageRestricted: boolean;
  /** 'selling' = builder inventory available; 'resale' = build-out complete. */
  status: 'selling' | 'resale' | 'coming-soon';
  builders: string[];
  homeTypes: string[];
  priceLow: number;
  priceHigh: number;
  /** Typical monthly HOA/CDD-equivalent, expressed as a range. Always a range. */
  hoaMonthlyLow: number;
  hoaMonthlyHigh: number;
  /** Typical annual CDD / Stewardship District assessment range. */
  cddAnnualLow: number;
  cddAnnualHigh: number;
  cddNote?: string;
  amenities: string[];
  bestFor: string[];
  summary: string;
  /** One honest trade-off per village — this is what buyers actually ask about. */
  tradeOff: string;
  confidence: Confidence;
  verifiedOn: string;
  sources?: string[];
}

export interface School {
  id: string;
  name: string;
  level: 'Elementary' | 'Middle' | 'High' | 'K-12' | 'PK-8';
  type: 'Public' | 'Charter' | 'Private';
  district: 'School District of Manatee County' | 'Sarasota County Schools' | 'Independent';
  city: string;
  address?: string;
  coords: LatLng;
  /** GreatSchools 1–10 where a rating was found; null when it was not. */
  gsRating: number | null;
  /** Niche letter grade where found. */
  nicheGrade?: string | null;
  /** Florida DOE school grade (A–F) where found. */
  flGrade?: string | null;
  website?: string;
  notes?: string;
  confidence: Confidence;
  verifiedOn: string;
  sources?: string[];
}

export interface Builder {
  id: string;
  name: string;
  villages: string[];
  productTypes: string[];
  priceFrom?: number;
  website?: string;
  /**
   * Incentives move week to week. Stored as a described PATTERN plus the date
   * checked — never as a live headline number, because a stale "$50,000 off"
   * banner is exactly the kind of claim that creates advertising liability.
   */
  incentivePattern: string;
  incentiveCheckedOn: string;
  confidence: Confidence;
  sources?: string[];
}

export interface Faq {
  id: string;
  question: string;
  /** Plain-text answer. Kept short and direct — this is what AEO/GEO surfaces quote. */
  answer: string;
  category: string;
}

export interface GuideDef {
  slug: string;
  title: string;
  subtitle: string;
  /** Lead-magnet framing shown on cards. */
  promise: string;
  readingTime: string;
  icon: string;
  /** true = full text is on-page (good for SEO); the PDF is the opt-in upgrade. */
  gated: boolean;
}
