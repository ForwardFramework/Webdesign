/**
 * ============================================================================
 *  BOOTH'S CONTRACTING — SINGLE SOURCE OF TRUTH
 * ============================================================================
 *  Everything on the website is generated from this file. Change a phone
 *  number, a town, a service blurb or a headline here and it updates across
 *  every page, sitemap entry and block of structured data.
 *
 *  Items marked  // VERIFY  are best guesses taken from the flyer/logo and
 *  should be confirmed with the owner before the site goes live.
 * ============================================================================
 */

export const site = {
  // ── Core identity ────────────────────────────────────────────────────────
  name: "Booth\u2019s Contracting",
  legalName: "Booth\u2019s Contracting LLC", // VERIFY exact registered entity name
  tagline: 'Concrete · Excavation · Landscaping',
  slogan: 'Built to Last',
  shortDescription:
    'Concrete, excavation and landscaping contractor serving Western Pennsylvania. Driveways, patios, sidewalks, steps, pads and site prep — built to last.',

  // ── Where the site will live ─────────────────────────────────────────────
  // Update this the moment the real domain is attached in Netlify. Canonical
  // tags, sitemap URLs, Open Graph images and JSON-LD all read from it.
  url: 'https://boothscontracting.com', // VERIFY final domain

  // Drop a real logo file in public/assets/img/ and put its path here (e.g.
  // '/assets/img/logo.png') to swap the CSS wordmark for the artwork.
  logoImage: '',

  // ── Contact ──────────────────────────────────────────────────────────────
  phone: '724-554-9032',
  phoneHref: '+17245549032',
  phoneDisplay: '(724) 554-9032',
  email: 'info@boothscontracting.com', // VERIFY real inbox
  // Where Netlify form notifications should be sent (set in Netlify UI too).
  leadEmail: 'info@boothscontracting.com', // VERIFY

  // ── Location ─────────────────────────────────────────────────────────────
  // Booth's works out of a service radius rather than a storefront, so the
  // site publishes a service area instead of a street address. If there IS a
  // public shop address, add `streetAddress` and set `hideAddress: false` —
  // a verified address strengthens local ranking considerably.
  hideAddress: true,
  streetAddress: '', // VERIFY — add if there is a public business address
  city: 'Butler', // VERIFY home base city
  state: 'PA',
  stateFull: 'Pennsylvania',
  postalCode: '16001', // VERIFY
  country: 'US',
  region: 'Western Pennsylvania',
  // Approximate center of the service radius (Butler, PA). Adjust if the home
  // base changes — this drives the geo coordinates in LocalBusiness schema.
  geo: { lat: 40.8612, lng: -79.8953 }, // VERIFY
  serviceRadiusMiles: 45,

  // ── Hours ────────────────────────────────────────────────────────────────
  hours: [
    { days: 'Monday – Friday', time: '7:00 AM – 6:00 PM', schema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' },
    { days: 'Saturday', time: '8:00 AM – 2:00 PM', schema: ['Saturday'], opens: '08:00', closes: '14:00' },
    { days: 'Sunday', time: 'Closed', schema: ['Sunday'], opens: null, closes: null },
  ],
  emergencyNote: 'Calls and messages answered after hours — we return every message within one business day.',

  // ── Social ───────────────────────────────────────────────────────────────
  social: {
    facebook: 'https://www.facebook.com/boothscontracting', // VERIFY exact URL
    instagram: 'https://www.instagram.com/boothscontracting', // VERIFY exact URL
    handle: '@boothscontracting',
  },

  // ── Trust signals ────────────────────────────────────────────────────────
  // These appear in the trust bar, footer and structured data. Every one of
  // them is a promise to the customer — confirm each before launch.
  trust: {
    licensed: true,
    licenseNumber: 'PA######', // VERIFY — PA Home Improvement Contractor (HIC) number
    insured: true,
    freeEstimates: true,
    yearsExperience: '', // VERIFY — leave blank to hide the "X years" claims
    warranty: '', // VERIFY — e.g. "2-year workmanship warranty"; blank hides it
  },

  // ── Conversion settings ──────────────────────────────────────────────────
  primaryCta: 'Get My Free Estimate',
  secondaryCta: 'Call ' + '(724) 554-9032',
  // Seasonal banner across the top of every page. Set `show: false` to hide.
  promo: {
    show: true,
    label: 'Now Booking',
    text: 'A few openings left on the fall schedule',
    // Shorter variant for the hero badge, so it does not echo the bar above it.
    short: 'Fall schedule \u2014 now booking',
    cta: 'Claim a spot',
    href: '/contact/',
  },

  // ── Analytics (optional) ─────────────────────────────────────────────────
  // Paste a GA4 measurement ID (G-XXXXXXX) to switch analytics on. Left blank,
  // no tracking script is emitted at all.
  ga4Id: '',
  gtmId: '',
};

export default site;
