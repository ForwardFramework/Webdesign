/**
 * Single source of truth for business identity (NAP), credentials and service area.
 * Everything the site renders — schema.org, footer, click-to-call, local landing
 * pages — reads from here, so a change lands everywhere at once.
 */

export const site = {
  name: 'Top Dog Exteriors',
  legalName: 'Top Dog Exteriors LLC',
  tagline: 'Pittsburgh’s Top Dog for Roofing, Decks & Exteriors',
  domain: 'https://topdogexteriors.com',
  description:
    'Veteran-owned, family-operated exterior contractor serving the Greater Pittsburgh area. Roofing, decks, siding, windows, doors, gutters, concrete, additions and site work — backed by a 5-year workmanship warranty.',
  founded: '2023',
  owner: 'Tyler Hoffman',

  phone: '(412) 438-8364',
  phoneRaw: '+14124388364',
  email: 'info@topdogexteriors.com',

  address: {
    street: '4607 Library Rd',
    city: 'Bethel Park',
    state: 'PA',
    stateFull: 'Pennsylvania',
    zip: '15102',
    country: 'US',
  },

  // Bethel Park, PA centroid — used for LocalBusiness geo + service radius.
  geo: { lat: 40.3273, lng: -80.0395 },

  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], open: '07:00', close: '18:00' },
    { days: ['Saturday'], open: '08:00', close: '14:00' },
  ],
  hoursLabel: 'Mon–Fri 7am–6pm · Sat 8am–2pm · Emergency service 24/7',

  license: 'PA193451',
  licenseAuthority: 'Pennsylvania Attorney General — Registered Contractor',

  social: {
    facebook: 'https://www.facebook.com/gettopdog/',
    instagram: 'https://www.instagram.com/topdogexteriorspgh/',
    bbb: 'https://www.bbb.org/us/pa/bethel-park/profile/home-improvement/top-dog-exteriors-0141-71127170',
    google: 'https://www.google.com/search?q=Top+Dog+Exteriors+Bethel+Park+PA',
    nextdoor: 'https://nextdoor.com/pages/top-dog-exteriors-bethel-park-pa/',
  },

  /** Badges rendered in the trust bar and referenced by AI answer engines. */
  credentials: [
    {
      label: 'Owens Corning Preferred Contractor',
      detail:
        'Factory-vetted roofing credential that unlocks the Preferred Protection Roofing System Limited Warranty — the only Owens Corning warranty tier that covers contractor workmanship.',
      icon: 'shield-check',
    },
    {
      label: 'Veteran Owned & Family Operated',
      detail: 'Run with military discipline and accountability. Your project is managed by the owner, not a call center.',
      icon: 'star',
    },
    {
      label: 'A Rating with the BBB',
      detail: 'Accredited by the Better Business Bureau of Western Pennsylvania since 2025, carrying an A rating.',
      icon: 'badge',
    },
    {
      label: '5★ Google · 100% Recommended on Facebook',
      detail: 'Verified homeowner reviews across Google, Facebook and the BBB — every one published on our reviews page word for word.',
      icon: 'stars',
    },
    {
      label: 'Licensed PA193451 & Fully Insured',
      detail: 'General liability and workers’ compensation carried on every job. Certificates furnished on request.',
      icon: 'document',
    },
    {
      label: '5-Year Workmanship Warranty',
      detail: 'Written, transferable 5-year labor warranty on roofing and siding installations.',
      icon: 'wrench',
    },
  ],

  /** Headline proof points used in the hero stat strip. */
  stats: [
    { value: '5.0★', label: 'Google rating' },
    { value: '100%', label: 'Recommended on Facebook' },
    { value: 'A', label: 'Rating with the BBB' },
    { value: '5-Year', label: 'Workmanship warranty' },
  ],
} as const;

/**
 * Local landing pages. `primary: true` towns get a dedicated /service-areas/<slug>
 * page; the rest are listed for internal-link equity and NAP consistency.
 *
 * The rule of thumb is roughly an hour from Pittsburgh. Promote a town by
 * flipping `primary` and giving it a `note` — but only when there is something
 * genuinely specific to say about its housing stock. Eight thin, near-identical
 * town pages rank worse than one good directory page.
 */
export const serviceAreas = [
  { name: 'Bethel Park', slug: 'bethel-park', county: 'Allegheny County', primary: true, zip: '15102',
    note: 'Our home base on Library Road — most Bethel Park jobs get a same-week estimate.' },
  { name: 'Mt. Lebanon', slug: 'mt-lebanon', county: 'Allegheny County', primary: true, zip: '15228',
    note: 'Historic-district homes and slate-era rooflines need a contractor who respects the architecture.' },
  { name: 'Upper St. Clair', slug: 'upper-st-clair', county: 'Allegheny County', primary: true, zip: '15241',
    note: 'Larger rooflines, steep pitches and premium composite decks are the norm here.' },
  { name: 'Peters Township', slug: 'peters-township', county: 'Washington County', primary: true, zip: '15317',
    note: 'New-build neighborhoods reaching the 20-year mark on builder-grade roofs and decks.' },
  { name: 'Canonsburg', slug: 'canonsburg', county: 'Washington County', primary: true, zip: '15317',
    note: 'A mix of century homes and new construction — we handle both.' },
  { name: 'South Park', slug: 'south-park', county: 'Allegheny County', primary: true, zip: '15129',
    note: 'Sloped lots where deck framing and site work often go hand in hand.' },
  { name: 'Washington', slug: 'washington-pa', county: 'Washington County', primary: true, zip: '15301',
    note: 'Full exterior remodels and metal roofing on rural and in-town properties.' },
  { name: 'McMurray', slug: 'mcmurray', county: 'Washington County', primary: true, zip: '15317',
    note: 'Composite deck rebuilds and James Hardie siding are our most-requested jobs here.' },
  { name: 'Whitehall', slug: 'whitehall', county: 'Allegheny County', primary: false, zip: '15236' },
  { name: 'Castle Shannon', slug: 'castle-shannon', county: 'Allegheny County', primary: false, zip: '15234' },
  { name: 'Dormont', slug: 'dormont', county: 'Allegheny County', primary: false, zip: '15216' },
  { name: 'Baldwin', slug: 'baldwin', county: 'Allegheny County', primary: false, zip: '15227' },
  { name: 'Brentwood', slug: 'brentwood', county: 'Allegheny County', primary: false, zip: '15227' },
  { name: 'Pleasant Hills', slug: 'pleasant-hills', county: 'Allegheny County', primary: false, zip: '15236' },
  { name: 'Jefferson Hills', slug: 'jefferson-hills', county: 'Allegheny County', primary: false, zip: '15025' },
  { name: 'Bridgeville', slug: 'bridgeville', county: 'Allegheny County', primary: false, zip: '15017' },
  { name: 'Scott Township', slug: 'scott-township', county: 'Allegheny County', primary: false, zip: '15106' },
  { name: 'Carnegie', slug: 'carnegie', county: 'Allegheny County', primary: false, zip: '15106' },
  { name: 'Green Tree', slug: 'green-tree', county: 'Allegheny County', primary: false, zip: '15220' },
  { name: 'Collier Township', slug: 'collier-township', county: 'Allegheny County', primary: false, zip: '15106' },
  { name: 'Finleyville', slug: 'finleyville', county: 'Washington County', primary: false, zip: '15332' },
  { name: 'Venetia', slug: 'venetia', county: 'Washington County', primary: false, zip: '15367' },
  { name: 'Eighty Four', slug: 'eighty-four', county: 'Washington County', primary: false, zip: '15330' },
  { name: 'Cecil Township', slug: 'cecil-township', county: 'Washington County', primary: false, zip: '15321' },
  { name: 'South Fayette', slug: 'south-fayette', county: 'Allegheny County', primary: false, zip: '15017' },
  { name: 'City of Pittsburgh', slug: 'pittsburgh', county: 'Allegheny County', primary: false, zip: '15203' },
  { name: 'North Hills', slug: 'north-hills', county: 'Allegheny County', primary: false, zip: '15237' },
  { name: 'Gibsonia', slug: 'gibsonia', county: 'Allegheny County', primary: false, zip: '15044' },
  { name: 'Cranberry Township', slug: 'cranberry-township', county: 'Butler County', primary: false, zip: '16066' },
  { name: 'Fox Chapel', slug: 'fox-chapel', county: 'Allegheny County', primary: false, zip: '15238' },
  { name: 'Sewickley', slug: 'sewickley', county: 'Allegheny County', primary: false, zip: '15143' },
  { name: 'Robinson Township', slug: 'robinson-township', county: 'Allegheny County', primary: false, zip: '15205' },
  { name: 'Moon Township', slug: 'moon-township', county: 'Allegheny County', primary: false, zip: '15108' },
  { name: 'Monroeville', slug: 'monroeville', county: 'Allegheny County', primary: false, zip: '15146' },
] as const;

/**
 * Roofr Instant Estimator. Leads from this tool land in the Roofr account, not
 * in the site's own /api/lead inbox. If Top Dog ever regenerates the estimator
 * link in Roofr, this is the only line that changes.
 */
export const roofr = {
  estimatorUrl:
    'https://app.roofr.com/instant-estimator/d8998d6d-4515-4cd4-8042-ce9d1d9f64f9/TopDogRoofing/welcome-question',
} as const;

export const primaryAreas = serviceAreas.filter((a) => a.primary);

export type ServiceArea = (typeof serviceAreas)[number];
