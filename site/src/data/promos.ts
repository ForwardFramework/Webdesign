/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROMOTIONS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Offer structures modelled on the highest-converting promotions running in the
 *  exterior-remodeling category (Able Roof, Mr. Roof, Ridge Top Exteriors,
 *  Improveit, Leafguard, Coastal Windows). The consistent pattern across all of
 *  them:
 *
 *    1. A monthly payment or 0% term — removes the price objection up front.
 *    2. A free tangible upgrade — converts better than an equivalent % discount
 *       because the homeowner can picture the thing.
 *    3. A named, dated deadline — flat "limited time" language underperforms.
 *    4. Visible qualifying terms — builds trust instead of eroding it.
 *
 *  ⚠  BEFORE PUBLISHING: every offer here must be confirmed against what Top Dog
 *  can actually honor. Financing terms in particular (`financing: true`) must
 *  match a signed lender agreement — advertising an APR you cannot deliver is a
 *  Truth in Lending Act / Regulation Z violation. Set `active: false` on any
 *  offer that is not yet backed by a real program; inactive offers render
 *  nowhere on the site.
 */

export type Promo = {
  id: string;
  /** Service slugs this offer appears on. 'all' pins it site-wide. */
  services: string[];
  eyebrow: string;
  headline: string;
  detail: string;
  terms: string;
  cta: string;
  ctaHref: string;
  /** Requires a signed lender agreement before going live. */
  financing?: boolean;
  active: boolean;
  /** Rank within a service — lowest renders first. */
  order: number;
};

export const expiresLabel = 'Offer ends the last day of the current month.';

export const promos: Promo[] = [
  /* ── Site-wide anchor offers ─────────────────────────────────────────── */
  {
    id: 'financing',
    services: ['all'],
    eyebrow: 'Financing',
    headline: 'Check Your Rate in 2 Minutes — Without Touching Your Credit Score',
    detail:
      'Financing on any project through Acorn Finance, with no money down. One short form returns real offers from multiple lenders so you can compare rate, term and monthly payment side by side. Pre-qualifying uses a soft credit check, so your score is not affected.',
    terms:
      'Financing provided by third-party lenders through Acorn Finance, a lending marketplace. Top Dog Exteriors is not a lender and makes no credit decisions. Subject to credit approval. APRs range from 4.99% to 35.99%, amounts from $1,000 to $100,000, and terms from 2 to 12 years across the lender network; your rate depends on your credit profile and is disclosed in your loan documents. Not all applicants qualify.',
    cta: 'Check my rate',
    ctaHref: '/financing',
    financing: true,
    active: true,
    order: 1,
  },
  {
    id: 'military',
    services: ['all'],
    eyebrow: 'Always on',
    headline: '5% Off for Military, Veterans, Police, Fire & EMS',
    detail:
      'We are veteran owned, and this one never expires. Five percent off your full project for active duty, veterans, law enforcement, firefighters, EMS and teachers — plus seniors 65 and over.',
    terms:
      'Valid ID required at time of contract signing. Applies to full replacement projects over $5,000. Combinable with our current seasonal offer; not combinable with other percentage discounts.',
    cta: 'Claim your discount',
    ctaHref: '/contact?topic=military-discount',
    active: true,
    order: 2,
  },
  {
    id: 'bundle',
    services: ['all'],
    eyebrow: 'Bundle & save',
    headline: 'Save 10% When You Bundle Two or More Services',
    detail:
      'Roof and gutters. Siding and windows. Deck and concrete. Doing two trades on one mobilization saves us setup, staging and dumpster cost — and we pass 10% of it straight back to you.',
    terms:
      'Both services must be contracted together and scheduled within the same project window. Applies to the combined contract value on projects over $10,000.',
    cta: 'Price a bundle',
    ctaHref: '/contact?topic=bundle',
    active: true,
    order: 3,
  },

  /* ── Roofing ─────────────────────────────────────────────────────────── */
  {
    id: 'roof-upgrade',
    services: ['roofing'],
    eyebrow: 'Roofing offer',
    headline: 'Free Ridge Vent & Ice-and-Water Upgrade on Full Roof Replacements',
    detail:
      'Book a complete roof replacement and we include a full continuous ridge vent system plus upgraded ice-and-water shield in every valley and along every eave — the two upgrades that most affect how long a Pittsburgh roof actually lasts. A $900–$1,600 value, included.',
    terms:
      'Valid on complete roof replacements over $10,000. Not valid on repairs or partial roof sections. Ridge vent subject to roof geometry allowing adequate exhaust ventilation.',
    cta: 'Get my instant roof price',
    ctaHref: '/instant-roof-quote',
    active: true,
    order: 1,
  },
  {
    id: 'roof-inspection',
    services: ['roofing'],
    eyebrow: 'No cost, no pressure',
    headline: 'Free 21-Point Roof Inspection with Photo Report',
    detail:
      'We get on your roof, check decking, ventilation, flashing, valleys, penetrations and the attic side, and send you every photograph we take — whether you hire us or not. No obligation and no sales pitch on the ladder.',
    terms: 'Owner-occupied residential properties within our service area. Roofs must be safely accessible.',
    cta: 'Book my free inspection',
    ctaHref: '/contact?topic=roof-inspection',
    active: true,
    order: 2,
  },

  /* ── Decks ───────────────────────────────────────────────────────────── */
  {
    id: 'deck-lighting',
    services: ['decks'],
    eyebrow: 'Deck offer',
    headline: 'Free Deck Lighting Package with Any TimberTech or Trex Build',
    detail:
      'Sign a composite deck build and we include a low-voltage lighting package — recessed riser lights and post-cap lights, wired and transformer-set. It is the upgrade every homeowner adds after the fact and wishes they had done during the build.',
    terms:
      'Valid on new composite deck builds over $15,000. Package covers up to 8 riser lights and 4 post caps; larger layouts priced at cost. Not valid on re-decking or repairs.',
    cta: 'Design my deck',
    ctaHref: '/contact?topic=deck',
    active: true,
    order: 1,
  },
  {
    id: 'deck-design',
    services: ['decks'],
    eyebrow: 'Before you commit',
    headline: 'Free 3D Deck Design & In-Home Sample Consultation',
    detail:
      'See your actual deck rendered in 3D on your actual house before you spend a dollar — and hold full-size TimberTech and Trex boards against your siding in your own daylight. Composite color reads nothing like it does on a screen.',
    terms: 'One design per household. Homeowner must be present. Within our standard service area.',
    cta: 'Book my design consult',
    ctaHref: '/contact?topic=deck-design',
    active: true,
    order: 2,
  },

  /* ── Siding ──────────────────────────────────────────────────────────── */
  {
    id: 'siding-wrap',
    services: ['siding'],
    eyebrow: 'Siding offer',
    headline: 'Free House Wrap & Trim Upgrade on Full Siding Replacements',
    detail:
      'Premium weather-resistive barrier and upgraded PVC corner and window trim included free on complete siding replacements. The barrier behind your siding is what actually keeps water out of the wall — it should never be the line item that gets value-engineered.',
    terms:
      'Valid on complete siding replacements over $12,000. Sheathing repair, if required, is quoted separately. Not valid on partial elevations or repairs.',
    cta: 'Get my siding quote',
    ctaHref: '/contact?topic=siding',
    active: true,
    order: 1,
  },

  /* ── Windows ─────────────────────────────────────────────────────────── */
  {
    id: 'window-buy-more',
    services: ['windows'],
    eyebrow: 'Window offer',
    headline: 'Buy 5 Windows, Get the 6th Installed Free',
    detail:
      'On Alside Mezzo and Vero replacement windows: every sixth window is on us, installed. The more openings you do at once, the lower your cost per window — and the fewer times you take a day off work for an installer.',
    terms:
      'Free window is of equal or lesser value than the lowest-priced unit in the order. Minimum order of 5 paid windows. Not valid on bays, bows or custom geometrics.',
    cta: 'Price my windows',
    ctaHref: '/contact?topic=windows',
    active: true,
    order: 1,
  },
  {
    id: 'window-glass',
    services: ['windows'],
    eyebrow: 'Free upgrade',
    headline: 'Free Low-E Glass Package Upgrade on Whole-Home Orders',
    detail:
      'Replace every window in the house and we upgrade the entire order to the premium Low-E and argon glass package at no charge — better winter comfort, less summer heat gain, and a real difference in how the rooms on the sunny side feel.',
    terms: 'Whole-home orders of 8 or more openings. Not combinable with the buy-5-get-1 offer.',
    cta: 'Get my window quote',
    ctaHref: '/contact?topic=windows',
    active: true,
    order: 2,
  },

  /* ── Doors ───────────────────────────────────────────────────────────── */
  {
    id: 'door-glass',
    services: ['doors'],
    eyebrow: 'Door offer',
    headline: 'Free Decorative Glass Upgrade on Any ProVia Entry System',
    detail:
      'Order a ProVia Embarq, Signet, Heritage or Legacy entry door and we upgrade you to a decorative glass insert at no charge. It is the single most visible thing about your front door and normally the first upgrade to get cut from the budget.',
    terms:
      'Applies to standard decorative glass collections; premium and privacy art glass upgraded at the difference in cost. One door per household.',
    cta: 'Design my door',
    ctaHref: '/contact?topic=doors',
    active: true,
    order: 1,
  },

  /* ── Gutters ─────────────────────────────────────────────────────────── */
  {
    id: 'gutter-guards',
    services: ['gutters'],
    eyebrow: 'Gutter offer',
    headline: '50% Off Gutter Guards with a Full Seamless Gutter Installation',
    detail:
      'Install a complete seamless 5" or 6" system and take half off micro-mesh gutter guard protection on the same job. Under the oak and maple canopy across the South Hills, the guards pay for themselves in ladder trips you never make.',
    terms: 'Requires a complete gutter system installation of 100 linear feet or more. Guard discount applies to guard material and labor only.',
    cta: 'Get my gutter quote',
    ctaHref: '/contact?topic=gutters',
    active: true,
    order: 1,
  },
  {
    id: 'gutter-roof-bundle',
    services: ['gutters', 'roofing'],
    eyebrow: 'Best value',
    headline: 'Free Seamless Gutters with a Full Roof Replacement',
    detail:
      'Replace your roof with us and your new seamless 5" gutters and downspouts are included — up to 120 linear feet. The gutters have to come off for the roof anyway; this is the only time you can get them replaced for free.',
    terms:
      'Valid on complete roof replacements over $15,000. Covers up to 120 linear feet of 5" seamless gutter and standard downspouts; additional footage, 6" upsizing, guards and fascia repair quoted separately.',
    cta: 'Get my instant roof price',
    ctaHref: '/instant-roof-quote',
    active: true,
    order: 2,
  },

  /* ── Concrete ────────────────────────────────────────────────────────── */
  {
    id: 'concrete-seal',
    services: ['concrete'],
    eyebrow: 'Concrete offer',
    headline: 'Free Penetrating Sealer on Every New Driveway & Patio',
    detail:
      'Freeze-thaw cycling and road salt are what kill concrete in Western Pennsylvania. We include a professional-grade penetrating sealer on every new driveway and patio pour — applied at the right cure window, not sold to you a year later.',
    terms: 'Included on new pours over 400 square feet. Sealer applied once concrete has reached appropriate cure. Resealing every 2–3 years recommended and quoted separately.',
    cta: 'Get my concrete quote',
    ctaHref: '/contact?topic=concrete',
    active: true,
    order: 1,
  },

  /* ── Excavation ──────────────────────────────────────────────────────── */
  {
    id: 'excavation-delivery',
    services: ['excavation'],
    eyebrow: 'Equipment offer',
    headline: 'Free Delivery & Pickup on Weekly Bobcat Rentals',
    detail:
      'Rent the T595 track loader or the E35 mini excavator for a full week and we deliver and pick up on our own trailer at no charge — a $150–$300 saving versus hauling it yourself or paying a yard for transport.',
    terms:
      'Weekly rentals within 25 miles of Bethel Park, PA. Operator qualification and proof of insurance required for machine-only rentals. Fuel returned at delivered level.',
    cta: 'Check machine availability',
    ctaHref: '/contact?topic=equipment-rental',
    active: true,
    order: 1,
  },
  {
    id: 'excavation-drainage',
    services: ['excavation', 'gutters'],
    eyebrow: 'Wet basement?',
    headline: 'Free Drainage Assessment & Water-Path Walkthrough',
    detail:
      'We walk your property, trace where roof and surface water actually goes, and tell you what is really causing the wet basement — before anyone sells you an interior system. Most of the time the fix is above ground and costs a fraction of what you were quoted.',
    terms: 'Owner-occupied residential properties within our service area. No obligation.',
    cta: 'Book my assessment',
    ctaHref: '/contact?topic=drainage',
    active: true,
    order: 2,
  },

  /* ── Additions ───────────────────────────────────────────────────────── */
  {
    id: 'addition-design',
    services: ['additions'],
    eyebrow: 'Additions offer',
    headline: 'Design Fee Credited Back at Contract Signing',
    detail:
      'Pay for drawings, and if you build with us the full design fee comes straight off your contract price. You get real plans to price against, and you are not paying twice for the same set.',
    terms: 'Design fee credited in full against contracts signed within 180 days of plan delivery. Plans remain the property of Top Dog Exteriors until credited.',
    cta: 'Start my addition',
    ctaHref: '/contact?topic=additions',
    active: true,
    order: 1,
  },

  /* ── Painting ────────────────────────────────────────────────────────── */
  {
    id: 'paint-door',
    services: ['painting'],
    eyebrow: 'Painting offer',
    headline: 'Free Front Door & Shutter Refinish with Any Full Exterior Paint',
    detail:
      'Book a full exterior repaint and we refinish your front door and shutters in an accent color at no charge. It is the highest-impact fifty square feet on the whole house.',
    terms: 'Valid on full exterior painting contracts over $4,000. Covers one entry door and up to 8 shutters.',
    cta: 'Get my painting quote',
    ctaHref: '/contact?topic=painting',
    active: true,
    order: 1,
  },
];

export const activePromos = promos.filter((p) => p.active);

export const sitewidePromos = activePromos
  .filter((p) => p.services.includes('all'))
  .sort((a, b) => a.order - b.order);

export const promosForService = (slug: string) =>
  activePromos
    .filter((p) => p.services.includes(slug))
    .sort((a, b) => a.order - b.order);

/** The single offer pinned to the top announcement bar. */
export const headlinePromo = activePromos.find((p) => p.id === 'financing')!;
