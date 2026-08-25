/* =============================================================================
   Eclipse Aluminum & Shade — PRICING MODEL
   -----------------------------------------------------------------------------
   How the estimator works
   -----------------------
   Every input contributes ONE midpoint number — a rate per square foot, a flat
   adder, or a multiplier. We compute a single point estimate, then widen it into
   a range using a confidence band that grows when the visitor answers "not sure".

       estimate = ((area x (rate + rateAdders)) x multipliers x volume)
                  + flatAdders
       range    = estimate -/+ band

   Doing it this way keeps ranges tight and useful. Compounding a "low" rate with
   a "low" multiplier and a "high" rate with a "high" multiplier — the obvious
   approach — produces 70%-wide ranges that tell a customer nothing.

   Calibration
   -----------
   Rates are midpoints benchmarked against published 2026 installed-cost data and
   Southwest Florida market pricing. The reasoning and sources for every number
   are written up in docs/PRICING-MODEL.md. Re-read that file before changing a
   rate, then update both places so they never drift apart.

   These produce a BALLPARK, not a quote. The site says so, loudly, every time a
   number is shown.
   ========================================================================== */

window.ECLIPSE_PRICING = {

  /* Confidence band, as a fraction of the point estimate. */
  band: {
    base:            0.16,   // +/- 16% when every answer is specific
    perUnsureAnswer: 0.025,  // widen by 2.5% for each "not sure" / "help me decide"
    max:             0.28    // never quote wider than this — it stops being useful
  },

  /* Illustrative monthly payment, driven by config.offer.financing. */
  rounding: { under: 10000, toNearestSmall: 50, toNearestLarge: 100 },

  /* ===========================================================================
     SERVICE 1 — RETRACTABLE & FIXED FABRIC AWNINGS
     ======================================================================== */
  awnings: {
    id: 'awnings',
    name: 'Retractable & Fixed Fabric Awnings',
    short: 'Fabric Awnings',
    blurb: 'Beautiful shade, on demand.',
    icon: 'awning',
    image: 'assets/img/service-awnings.jpg',
    minProject: 1750,
    bullets: [
      'Stylish, durable and custom designed for your space',
      'Extend your living area and enjoy the outdoors in comfort',
      'Built with premium materials for lasting performance',
      'Available in a variety of colors and styles to complement your home'
    ],
    questions: [
      {
        id: 'type',
        short: 'Awning type',
        label: 'What kind of awning are you after?',
        help: 'Retractable rolls away when you want full sun. Fixed stays put year-round.',
        type: 'cards',
        options: [
          { value: 'retractable_motorized', label: 'Retractable — motorized', note: 'Push a button or use your phone', rate: 31, popular: true },
          { value: 'retractable_manual',    label: 'Retractable — hand crank', note: 'Simple, no wiring needed',        rate: 22 },
          { value: 'fixed',                 label: 'Fixed / stationary',       note: 'Permanent frame, always shading',  rate: 27 },
          { value: 'unsure',                label: 'Not sure yet',             note: 'We’ll help you choose',            rate: 27, unsure: true }
        ]
      },
      {
        id: 'width',
        short: 'Width',
        label: 'Roughly how wide is the area you want covered?',
        help: 'Measure the wall the awning would mount to. Close is close enough.',
        type: 'select',
        options: [
          { value: 9,  label: 'Up to 10 feet' },
          { value: 12, label: '10 – 13 feet' },
          { value: 15, label: '14 – 16 feet', popular: true },
          { value: 18, label: '17 – 20 feet' },
          { value: 22, label: '21 – 24 feet' },
          { value: 28, label: '25 feet or more' },
          { value: 15, label: 'Not sure', unsure: true }
        ]
      },
      {
        id: 'projection',
        short: 'Projection',
        label: 'How far out from the house should it reach?',
        help: 'This is the "projection". Most patios want 10 to 12 feet.',
        type: 'select',
        options: [
          { value: 8,    label: '8 feet' },
          { value: 10,   label: '10 feet', popular: true },
          { value: 11.5, label: '11 – 12 feet' },
          { value: 13,   label: '13 – 14 feet' },
          { value: 10.5, label: 'Not sure', unsure: true }
        ]
      },
      {
        id: 'housing',
        short: 'Fabric protection',
        label: 'How should the fabric be protected when it’s rolled up?',
        help: 'A cassette closes around the fabric and keeps Florida weather off it. It is the single best thing you can do for the life of an awning.',
        type: 'cards',
        dependsOn: { question: 'type', notIn: ['fixed'] },
        options: [
          { value: 'open', label: 'Open roll',     note: 'Lowest cost, fabric exposed',        rateAdd: 0 },
          { value: 'semi', label: 'Semi-cassette', note: 'Hood over the top',                  rateAdd: 4.5, popular: true },
          { value: 'full', label: 'Full cassette', note: 'Fully enclosed — longest fabric life', rateAdd: 8.5 }
        ]
      },
      {
        id: 'fabric',
        short: 'Fabric grade',
        label: 'Which fabric grade?',
        type: 'cards',
        options: [
          { value: 'standard', label: 'Standard acrylic', note: 'Solution-dyed, 5–8 yr fade warranty', mult: 1.0 },
          { value: 'premium',  label: 'Premium marine',   note: 'Sunbrella / Dickson, 10 yr warranty', mult: 1.12, popular: true },
          { value: 'blackout', label: 'Blackout-lined',   note: 'Maximum heat + UV block',             mult: 1.20 }
        ]
      },
      {
        id: 'mounting',
        short: 'Mounting',
        label: 'Where does it need to mount?',
        type: 'cards',
        options: [
          { value: 'standard',     label: 'Standard wall',        note: 'Single storey, clear wall',   mult: 1.0 },
          { value: 'masonry',      label: 'Stucco, block or tile', note: 'Extra anchoring hardware',   mult: 1.08 },
          { value: 'roof_soffit',  label: 'Roof or soffit mount',  note: 'Above a window or overhang', mult: 1.10 },
          { value: 'second_story', label: 'Second storey / high wall', note: 'Lift equipment, extra crew', mult: 1.15 },
          { value: 'unsure',       label: 'Not sure',              note: 'We’ll assess on site',       mult: 1.08, unsure: true }
        ]
      },
      {
        id: 'addons',
        short: 'Extras',
        label: 'Any extras? (optional)',
        type: 'multi',
        optional: true,
        options: [
          { value: 'wind_sensor', label: 'Automatic wind sensor', note: 'Retracts itself in a gust — protects your warranty', scope: 'unit', flat: 385, popular: true },
          { value: 'led',         label: 'Integrated LED lighting', note: 'Dimmable, built into the frame',                    scope: 'unit', flat: 675 },
          { value: 'smart',       label: 'Smart home / app control', note: 'Alexa, Google or HomeKit',                         scope: 'unit', flat: 300 },
          { value: 'valance',     label: 'Drop-down front valance',  note: 'Blocks low afternoon sun',                         scope: 'unit', flat: 950 }
        ]
      },
      {
        id: 'quantity',
        short: 'Quantity',
        label: 'How many awnings?',
        help: 'Doing several at once cuts the per-unit cost — one trip, one crew, one set-up.',
        type: 'select',
        options: [
          { value: 1, label: 'Just one', volume: 1.0 },
          { value: 2, label: 'Two',      volume: 1.97 },
          { value: 3, label: 'Three',    volume: 2.88 },
          { value: 4, label: 'Four or more', volume: 3.76 }
        ]
      }
    ]
  },

  /* ===========================================================================
     SERVICE 2 — SOLAR & HURRICANE RATED MOTORIZED ROLL SCREENS
     ======================================================================== */
  screens: {
    id: 'screens',
    name: 'Solar & Hurricane Rated Motorized Roll Screens',
    short: 'Roll Screens',
    blurb: 'Protection you can count on.',
    icon: 'screen',
    image: 'assets/img/service-screens.jpg',
    minProject: 1900,
    bullets: [
      'Solar fabric blocks heat, reduces glare and protects your interiors',
      'Hurricane rated to withstand high winds and harsh weather',
      'Privacy and insect protection without sacrificing the view',
      'Motorized with smart controls for convenience and peace of mind'
    ],
    questions: [
      {
        id: 'goal',
        short: 'Purpose',
        label: 'What do you mainly need the screens to do?',
        type: 'cards',
        options: [
          { value: 'solar',     label: 'Block sun & heat',       note: 'Solar fabric, keeps the lanai usable',      key: 'solar' },
          { value: 'hurricane', label: 'Hurricane protection',   note: 'Florida Product Approved, wind rated',      key: 'hurricane', popular: true },
          { value: 'both',      label: 'Both — sun and storms',  note: 'One screen that does everything',           key: 'both' },
          { value: 'privacy',   label: 'Privacy & insects',      note: 'Seclusion and bug control',                 key: 'privacy' }
        ]
      },
      {
        id: 'operation',
        short: 'Operation',
        label: 'How would you like to operate them?',
        type: 'cards',
        options: [
          { value: 'motorized',     label: 'Motorized',            note: 'Hard-wired, remote or wall switch', popular: true },
          { value: 'solar_powered', label: 'Motorized + solar',    note: 'Battery and solar panel — works in an outage' },
          { value: 'manual',        label: 'Manual crank',         note: 'Lowest cost, no power required' },
          { value: 'motorized',     label: 'Not sure',             note: 'We’ll walk you through it', unsure: true }
        ]
      },
      {
        id: 'openings',
        short: 'Openings',
        label: 'How many openings need covering?',
        help: 'Count each separate span — a lanai with three bays is three openings.',
        type: 'select',
        options: [
          { value: 1, label: '1 opening',    volume: 1.00 },
          { value: 2, label: '2 openings',   volume: 1.96 },
          { value: 3, label: '3 openings',   volume: 2.85, popular: true },
          { value: 4, label: '4 – 5 openings',  volume: 4.19 },
          { value: 6, label: '6 – 8 openings',  volume: 6.30 },
          { value: 9, label: '9 or more',       volume: 8.70 }
        ]
      },
      {
        id: 'width',
        short: 'Opening width',
        label: 'How wide is a typical opening?',
        type: 'select',
        options: [
          { value: 7,  label: 'Up to 8 feet' },
          { value: 10, label: '8 – 12 feet', popular: true },
          { value: 15, label: '12 – 18 feet' },
          { value: 21, label: '18 – 25 feet' },
          { value: 28, label: 'Over 25 feet' },
          { value: 12, label: 'Not sure', unsure: true }
        ]
      },
      {
        id: 'height',
        short: 'Opening height',
        label: 'And roughly how tall?',
        type: 'select',
        options: [
          { value: 8,  label: '8 feet', popular: true },
          { value: 9.5,  label: '9 – 10 feet' },
          { value: 11.5, label: '11 – 12 feet' },
          { value: 14,   label: '13 feet or more' },
          { value: 9.5,  label: 'Not sure', unsure: true }
        ]
      },
      {
        id: 'location',
        short: 'Wind zone',
        label: 'Where is the home?',
        help: 'Coastal and waterfront homes sit in a higher wind zone, so the system has to be rated — and engineered — for more load.',
        type: 'cards',
        options: [
          { value: 'inland',  label: 'Inland',              note: 'Standard wind zone',        mult: 1.0 },
          { value: 'coastal', label: 'Coastal / waterfront', note: 'High wind zone',           mult: 1.10 },
          { value: 'unsure',  label: 'Not sure',             note: 'We’ll check your address', mult: 1.05, unsure: true }
        ]
      },
      {
        id: 'addons',
        short: 'Extras',
        label: 'Any extras? (optional)',
        type: 'multi',
        optional: true,
        options: [
          { value: 'permit',   label: 'Permit & engineering handled for me', note: 'Sealed drawings, county submittal, inspection', flat: 900, popular: true },
          { value: 'track',    label: 'Zipper / side retention track',       note: 'Holds fabric in high wind, no gaps',            rateAdd: 6 },
          { value: 'smart',    label: 'Smart home integration',              note: 'One hub, all screens, from your phone',         flat: 525 },
          { value: 'sensors',  label: 'Sun & wind sensors',                  note: 'Screens react on their own',                    flat: 350 }
        ]
      }
    ],
    /* rate[goal][operation] — installed $/sq ft midpoints */
    rates: {
      solar:     { motorized: 29, solar_powered: 34, manual: 20 },
      hurricane: { motorized: 52, solar_powered: 58, manual: 40 },
      both:      { motorized: 58, solar_powered: 64, manual: 44 },
      privacy:   { motorized: 26, solar_powered: 31, manual: 18 }
    },
    /* Per-opening set-up cost — motor, brackets, tracks, trip and labor. */
    perOpening: { motorized: 450, solar_powered: 500, manual: 200 }
  },

  /* ===========================================================================
     SERVICE 3 — CUSTOM ALUMINUM SHADE SOLUTIONS
     ======================================================================== */
  aluminum: {
    id: 'aluminum',
    name: 'Custom Aluminum Shade Solutions',
    short: 'Aluminum Structures',
    blurb: 'Built to fit. Built to last.',
    icon: 'pergola',
    image: 'assets/img/service-aluminum.jpg',
    minProject: 4500,
    bullets: [
      'Aluminum shade structures designed for permanent protection and style',
      'Ideal for patios, lanais, windows, entryways and more',
      'Durable, low maintenance and built to withstand Florida’s climate',
      'Fully customized to match your home'
    ],
    questions: [
      {
        id: 'style',
        short: 'Structure',
        label: 'What style of structure are you picturing?',
        type: 'cards',
        options: [
          { value: 'lattice',  label: 'Open lattice pergola', note: 'Striped shade, open to the sky',        rate: 40, popular: true },
          { value: 'solid',    label: 'Solid roof cover',     note: 'Full shade, keeps the rain off',        rate: 44 },
          { value: 'insulated',label: 'Insulated roof panel', note: 'Solid roof with a foam core — much cooler', rate: 50 },
          { value: 'louvered', label: 'Motorized louvered roof', note: 'Open, close or angle the roof on demand', rate: 95 },
          { value: 'cage',     label: 'Screen enclosure / cage', note: 'Screened room over a patio or pool',  rate: 24 },
          { value: 'unsure',   label: 'Not sure yet',         note: 'We’ll design options for you',          rate: 45, unsure: true }
        ]
      },
      {
        id: 'width',
        short: 'Width',
        label: 'Roughly how wide is the area?',
        type: 'select',
        options: [
          { value: 10, label: 'Up to 12 feet' },
          { value: 14, label: '12 – 16 feet', popular: true },
          { value: 18, label: '16 – 20 feet' },
          { value: 24, label: '20 – 28 feet' },
          { value: 32, label: 'Over 28 feet' },
          { value: 16, label: 'Not sure', unsure: true }
        ]
      },
      {
        id: 'depth',
        short: 'Depth',
        label: 'And how deep, out from the house?',
        type: 'select',
        options: [
          { value: 10, label: 'Up to 12 feet' },
          { value: 14, label: '12 – 16 feet', popular: true },
          { value: 18, label: '16 – 20 feet' },
          { value: 24, label: 'Over 20 feet' },
          { value: 14, label: 'Not sure', unsure: true }
        ]
      },
      {
        id: 'attachment',
        short: 'Attachment',
        label: 'Attached to the house, or free-standing?',
        type: 'cards',
        options: [
          { value: 'attached',     label: 'Attached to the house', note: 'Ledger-mounted along a wall',  mult: 1.0, popular: true },
          { value: 'freestanding', label: 'Free-standing',         note: 'Its own posts and footings',   mult: 1.12 },
          { value: 'unsure',       label: 'Not sure',              note: 'Depends on the design',        mult: 1.06, unsure: true }
        ]
      },
      {
        id: 'surface',
        short: 'Foundation',
        label: 'What’s underneath it right now?',
        help: 'Florida code needs the posts anchored into engineered footings. Existing slabs sometimes qualify, sometimes need cutting in.',
        type: 'cards',
        options: [
          { value: 'slab',     label: 'Existing concrete or pavers', note: 'Ready to build on',            flat: 0, popular: true },
          { value: 'footings', label: 'Needs new footings cut in',   note: 'Core-drilled and poured',      flat: 1800 },
          { value: 'nothing',  label: 'Bare ground / grass',         note: 'New slab required',            perSqFt: 11 },
          { value: 'unsure',   label: 'Not sure',                    note: 'We’ll check on site',          flat: 900, unsure: true }
        ]
      },
      {
        id: 'height',
        short: 'Height',
        label: 'How high does it need to sit?',
        type: 'select',
        options: [
          { value: 'standard', label: 'Standard — up to 10 feet', mult: 1.0, popular: true },
          { value: 'tall',     label: 'Tall — 10 to 14 feet',     mult: 1.10 },
          { value: 'elevated', label: 'Second storey / elevated deck', mult: 1.22 }
        ]
      },
      {
        id: 'location',
        short: 'Wind zone',
        label: 'Where is the home?',
        type: 'cards',
        options: [
          { value: 'inland',  label: 'Inland',               note: 'Standard wind zone', mult: 1.0 },
          { value: 'coastal', label: 'Coastal / waterfront', note: 'High wind zone — heavier gauge, more anchors', mult: 1.12 },
          { value: 'unsure',  label: 'Not sure',             note: 'We’ll check your address', mult: 1.06, unsure: true }
        ]
      },
      {
        id: 'addons',
        short: 'Extras',
        label: 'Any extras? (optional)',
        type: 'multi',
        optional: true,
        options: [
          { value: 'lighting', label: 'Integrated LED lighting',   note: 'Recessed into the beams',        flat: 1200, popular: true },
          { value: 'fans',     label: 'Ceiling fan rough-in',      note: 'Braced, wired and ready',        flat: 850 },
          { value: 'outlets',  label: 'Outdoor outlets',           note: 'GFCI, weather-rated',            flat: 550 },
          { value: 'gutter',   label: 'Integrated gutter & downspout', note: 'Keeps runoff off the patio', flat: 700 },
          { value: 'privacy',  label: 'Privacy wall or louvered screen', note: 'Block a neighbor or west sun', flat: 1600 }
        ]
      }
    ],
    /* Permanent structures always need sealed drawings and a county permit. */
    permitAndEngineering: 1450
  }
};

/* Ordered list used to render the service tabs. */
window.ECLIPSE_SERVICE_ORDER = ['awnings', 'screens', 'aluminum'];
