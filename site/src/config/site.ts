/**
 * SINGLE SOURCE OF TRUTH for agent + brokerage identity.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  ⚠️  ACTION REQUIRED BEFORE THIS SITE GOES LIVE
 * ────────────────────────────────────────────────────────────────────────────
 *  Every value below whose string starts with `NEEDS_VERIFICATION:` is a
 *  placeholder. They were NOT invented: no public record for this agent could
 *  be verified at build time, and Florida law makes several of these fields
 *  legally operative (see notes on each). Publishing with a fabricated license
 *  number or an unregistered brokerage name is a FREC violation.
 *
 *  Fill each one from the authoritative source:
 *    • License numbers / registered names → Florida DBPR licensee search:
 *      https://www.myfloridalicense.com/wl11.asp  (Real Estate → Sales Associate)
 *    • Brokerage registered name + address → your broker / office manager.
 *
 *  `hasUnverifiedFields()` below drives a loud on-page banner while any
 *  sentinel remains, so a half-configured site cannot quietly go live.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const NEEDS = 'NEEDS_VERIFICATION:' as const;
const todo = (what: string) => `${NEEDS} ${what}` as string;

export const agent = {
  /** Last name MUST match FREC registration exactly — Fla. Admin. Code 61J2-10.025(2). */
  firstName: 'Caitlin',
  lastName: 'Hoffman',
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  title: 'REALTOR® | Lakewood Ranch, Sarasota & Bradenton Specialist',
  /** Florida sales-associate license number. Legally required context for advertising. */
  licenseNumber: todo('Florida real estate sales associate license number (DBPR SL#)'),
  licenseState: 'Florida',
  phone: todo('direct business phone number'),
  email: todo('business email address'),
  /** Optional — leave empty strings out of the footer automatically. */
  social: {
    instagram: todo('Instagram profile URL'),
    facebook: todo('Facebook business page URL'),
    linkedin: todo('LinkedIn profile URL'),
    youtube: '',
    zillow: '',
  },
  headshot: '/images/generated/agent-headshot.jpg',
  /** Shown on /about. Written to be truthful and non-superlative-by-claim. */
  shortBio:
    'Caitlin Hoffman helps buyers, sellers and new-construction clients navigate Lakewood Ranch and the wider Sarasota–Bradenton market — from picking the right village to negotiating builder incentives.',
} as const;

export const brokerage = {
  /**
   * MUST be the brokerage's name as registered with FREC. Fla. Admin. Code
   * 61J2-10.025(1) requires the registered brokerage name in every ad, and
   * (3) requires it adjacent to / immediately above or below the point of
   * contact information on a website. `<SiteFooter>` and `<SiteHeader>`
   * both satisfy that placement.
   */
  registeredName: todo('brokerage name EXACTLY as registered with FREC (e.g. "Realty ONE Group MVP" vs a d/b/a)'),
  /** What people call it day to day. Only ever used alongside `registeredName`. */
  tradeName: 'Realty ONE Group MVP',
  licenseNumber: todo('brokerage license number (DBPR CQ#)'),
  street: todo('brokerage street address'),
  city: todo('brokerage city'),
  state: 'FL',
  zip: todo('brokerage ZIP'),
  phone: todo('brokerage main phone'),
  website: 'https://www.realtyonegroupmvp.com/',
} as const;

export const site = {
  name: 'Caitlin Hoffman | Lakewood Ranch Real Estate',
  shortName: 'Caitlin Hoffman Real Estate',
  /** Set to the real production origin before launch — used by canonical URLs, sitemap, JSON-LD. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lakewoodranchlivingfl.com',
  tagline: 'Your Gulf Coast move, handled.',
  description:
    'A complete guide to living in Lakewood Ranch, Sarasota, Bradenton and Tampa Bay — every village, HOA and CDD cost, school ratings, happy hours, beaches and drive times — plus live MLS home search with REALTOR® Caitlin Hoffman.',
  locale: 'en_US',
  /** Primary service area, used for LocalBusiness / RealEstateAgent JSON-LD. */
  serviceAreas: [
    'Lakewood Ranch, FL',
    'Bradenton, FL',
    'Sarasota, FL',
    'Parrish, FL',
    'Palmetto, FL',
    'Venice, FL',
    'Ellenton, FL',
    'Tampa Bay, FL',
  ],
  geo: { lat: 27.4103, lng: -82.4293 },
} as const;

/** MLS / IDX attribution. Text is set by the MLS's IDX rules — do not edit casually. */
export const idx = {
  mlsName: 'Stellar MLS',
  /**
   * Stellar MLS IDX display requires an attribution + disclaimer with a
   * last-updated timestamp. The exact wording is supplied by Stellar MLS in
   * the IDX agreement; confirm before launch.
   */
  disclaimer:
    'Listing information is provided in part by the Internet Data Exchange (IDX) program of Stellar MLS. Information deemed reliable but not guaranteed. All listings are subject to prior sale, change or withdrawal, and should be independently verified. Properties displayed may be listed or sold by various participants in the MLS.',
  attributionNote: todo('exact IDX attribution wording from your executed Stellar MLS IDX agreement'),
} as const;

export const legal = {
  fairHousing:
    'Each office is independently owned and operated. We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the nation. We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap, familial status, or national origin.',
  /** Displayed anywhere third-party/community data appears. */
  dataDisclaimer:
    'Community, school, tax, HOA/CDD, builder-incentive and business information on this site is gathered from public and third-party sources, is provided for general information only, and changes frequently. It is not a representation or warranty. Verify anything you will rely on directly with the source before making a decision.',
  schoolDisclaimer:
    'School ratings and attendance boundaries change. Boundary assignment is determined solely by the School District of Manatee County or Sarasota County Schools — never by a listing, a village name, or this website. Confirm the assigned school for a specific address with the district before you buy.',
  notLegalAdvice:
    'Relocation, tax, insurance and immigration content is general information, not legal, tax or financial advice. Consult a licensed professional about your situation.',
} as const;

/** Any sentinel left in place trips the pre-launch banner. */
export function unverifiedFields(): string[] {
  const found: string[] = [];
  const walk = (obj: unknown, path: string) => {
    if (typeof obj === 'string') {
      if (obj.startsWith(NEEDS)) found.push(`${path} → ${obj.slice(NEEDS.length).trim()}`);
      return;
    }
    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) walk(v, path ? `${path}.${k}` : k);
    }
  };
  walk({ agent, brokerage, idx }, '');
  return found;
}

export const hasUnverifiedFields = () => unverifiedFields().length > 0;

/** Safe display helper: never render a raw sentinel to a visitor. */
export const show = (value: string, fallback = '') => (value.startsWith(NEEDS) ? fallback : value);
