/* ==========================================================================
   ROUGHNECK ROOFING — SITE CONFIGURATION
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit for business details.
   Change a value here and run `npm run build` to regenerate the whole site.
   ========================================================================== */

const business = {
  name: 'Roughneck Roofing',
  legalName: 'Roughneck Roofing',
  tagline: 'Roofs Built Tough. Service Done Right.',
  phone: '878-226-0855',
  phoneRaw: '+18782260855',
  email: 'info@roughneckroofing.com',          // <-- TODO: confirm real inbox
  facebook: 'https://www.facebook.com/profile.php?id=61556284715701',

  // --- LOCATION -----------------------------------------------------------
  // Derived from the 878 area code (Pittsburgh, PA overlay).
  // Update street/city/zip + geo coordinates with the real shop address.
  street: '',                                   // <-- TODO: street address
  city: 'Pittsburgh',
  state: 'PA',
  stateFull: 'Pennsylvania',
  zip: '15205',                                 // <-- TODO: confirm
  country: 'US',
  lat: 40.4406,
  lng: -79.9959,
  serviceRadiusMiles: 50,

  // --- CREDENTIALS --------------------------------------------------------
  // Leave blank rather than guessing. Blank fields are hidden automatically.
  licenseNumber: '',                            // <-- TODO: PA HIC # (PA######)
  foundedYear: 2024,
  insured: true,

  // --- SOCIAL PROOF -------------------------------------------------------
  ratingValue: '5.0',
  reviewCount: 9,

  hours: [
    { days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '07:00', closes: '19:00' },
    { days: ['Saturday'], opens: '08:00', closes: '16:00' },
    { days: ['Sunday'], opens: '00:00', closes: '00:00', closed: true }
  ],
  hoursLabel: 'Mon-Fri 7am-7pm · Sat 8am-4pm · 24/7 emergency tarping',

  domain: 'https://roughneckroofing.com',       // <-- TODO: real domain

  // --- LEAD FORM DESTINATION ----------------------------------------------
  // Leave blank to use Netlify Forms (works automatically on Netlify).
  // Or paste a Formspree / Web3Forms / Basin endpoint URL here instead.
  // e.g. 'https://formspree.io/f/xxxxxxxx'
  formEndpoint: '',
};

/* --------------------------------------------------------------------------
   SERVICES
   -------------------------------------------------------------------------- */
const services = [
  {
    slug: 'roof-replacement',
    nav: 'Roof Replacement',
    title: 'Roof Replacement',
    h1: 'Roof Replacement in ' + business.city + ', ' + business.state,
    icon: 'shingle',
    blurb: 'Full tear-off and rebuild with architectural shingles, new underlayment, ice-and-water shield, and a properly balanced ventilation system.',
    price: 'Most homes: $9,000 - $22,000',
    metaTitle: 'Roof Replacement in ' + business.city + ', PA | Roughneck Roofing',
    metaDesc: 'Full asphalt shingle roof replacement in ' + business.city + ' - complete tear-off, ice-and-water shield, balanced ventilation, and manufacturer-backed warranties. Free estimate.',
    answer: 'A roof replacement is a complete tear-off of the old roofing down to the deck, followed by a rebuild: rotted sheathing replaced, ice-and-water shield at eaves and valleys, synthetic underlayment, new flashing, architectural shingles, and balanced intake and exhaust ventilation. On a typical ' + business.city + '-area home it takes one to two days and costs roughly $9,000 to $22,000 depending on size, pitch, and material.',
    intro: 'When a roof is past the point of patching, half-measures cost more than they save. Roughneck Roofing replaces roofs the way they should be built - down to the deck, with every layer of the system installed to manufacturer specification so the warranty actually holds.',
    sections: [
      {
        h: 'What a full roof replacement includes',
        p: 'Every replacement we quote is a complete system, not a shingle-over. Layering new shingles on old is faster and cheaper up front, traps heat, hides rotted decking, and voids most manufacturer warranties. We tear off instead.',
        list: [
          'Complete tear-off of all existing roofing layers down to the wood deck',
          'Deck inspection - soft, rotted, or delaminated sheathing replaced before anything goes back on',
          'Ice-and-water shield at eaves, valleys, and every penetration (required by code in our climate zone)',
          'Synthetic underlayment across the full deck - stronger and more water-resistant than felt',
          'New drip edge, step flashing, counter flashing, and pipe boots (we never reuse old flashing)',
          'Architectural laminate shingles from GAF, Owens Corning, or CertainTeed',
          'Ridge vent and balanced intake ventilation sized to your attic square footage',
          'Magnetic sweep of the entire property, twice, before we leave'
        ]
      },
      {
        h: 'How much does a new roof cost in ' + business.city + '?',
        p: 'Most ' + business.city + '-area homes land between $9,000 and $22,000 for a complete architectural shingle replacement. The spread is wide because roofs are not priced by house size - they are priced by roof size, pitch, layers, and complexity. The table below is a planning range, not a quote.',
        table: {
          head: ['Roof size', 'Typical home', 'Architectural shingle range'],
          rows: [
            ['Up to 16 squares', 'Small ranch / cape', '$7,500 - $11,500'],
            ['17 - 24 squares', 'Average 3-bed two-story', '$10,500 - $16,500'],
            ['25 - 35 squares', 'Larger colonial', '$15,000 - $24,000'],
            ['36+ squares', 'Large or multi-facet home', '$22,000 +']
          ],
          note: 'One "square" = 100 square feet of roof surface. Steep pitch, multiple layers to remove, extensive decking replacement, skylights, and premium or designer shingles push a project toward the top of its range.'
        }
      },
      {
        h: 'Signs it is time to replace rather than repair',
        list: [
          'The roof is 20+ years old and shingles are cupping, curling, or losing granules',
          'Granules collecting in gutters or at downspout splash blocks',
          'Multiple leaks, or a leak that keeps coming back in a different spot',
          'Daylight visible through the roof deck from inside the attic',
          'Sagging rooflines or spongy decking underfoot',
          'A prior repair used caulk or roof cement instead of proper flashing',
          'You are selling, and an inspector has already flagged the roof'
        ]
      },
      {
        h: 'What the process looks like',
        steps: [
          ['Free inspection', 'We get on the roof and in the attic, photograph what we find, and show you the pictures - not a sales brochure.'],
          ['Written estimate', 'Line-item pricing, material and color selections, and a clear scope. No pressure, no same-day-only discounts.'],
          ['Schedule and materials', 'Materials are delivered ahead of the crew. We confirm your date and a weather backup date.'],
          ['Tear-off and rebuild', 'Most homes are torn off and dried in the same day. Property is tarped and protected throughout.'],
          ['Cleanup and walkthrough', 'Magnetic sweep, debris hauled, and a final walkthrough with you before we call it done.']
        ]
      }
    ],
    faqs: [
      ['How long does a roof replacement take?', 'Most single-family homes are torn off and completely re-roofed in one to two working days. Larger or steeper roofs, or roofs needing significant deck replacement, can run three days. We never leave a roof open overnight - it is dried in before the crew goes home.'],
      ['Do I need to leave the house during the work?', 'No. You can stay home. Expect noise and vibration, so plan around naps and video calls. We ask that you move vehicles out of the driveway and take down fragile wall hangings in attic-adjacent rooms.'],
      ['What warranty comes with a new roof?', 'You get two: the manufacturer warranty on the shingles themselves (typically limited lifetime on architectural laminates) and our workmanship warranty on the installation. We put both in writing on your estimate before you sign anything.'],
      ['Can you replace a roof in winter?', 'Yes, with care. Asphalt shingles need to be handled and sealed differently below about 40F, and we hand-seal in cold weather so tabs bond properly. What we will not do is install on ice or during active snow.']
    ]
  },

  {
    slug: 'roof-repair',
    nav: 'Roof Repair',
    title: 'Roof Repair',
    h1: 'Roof Repair & Leak Detection',
    icon: 'wrench',
    blurb: 'Fast, honest leak diagnosis and lasting repairs - flashing, valleys, boots, and storm damage. If a repair will hold, we repair it.',
    price: 'Most repairs: $350 - $1,800',
    metaTitle: 'Roof Repair & Leak Repair ' + business.city + ' PA | Roughneck Roofing',
    metaDesc: 'Roof leak repair in ' + business.city + ' and surrounding areas. Same-week appointments, emergency tarping, honest diagnosis. Call ' + business.phone + '.',
    answer: 'Most roof leaks are not shingle failures - they are flashing failures. Roughneck Roofing traces the leak to its actual entry point (usually a chimney, valley, pipe boot, skylight, or sidewall), repairs the failed component properly rather than smearing sealant over it, and tells you honestly whether the roof has repair life left. Typical repairs run $350 to $1,800.',
    intro: 'A leak in the ceiling almost never means the whole roof is finished. It usually means one component failed. The trick is finding which one - and the honest answer about whether repairing it is money well spent.',
    sections: [
      {
        h: 'Where roof leaks actually come from',
        p: 'Water rarely enters where the stain appears. It travels along rafters and decking before it drops. These are the failure points we check first, in order of how often they turn out to be the culprit:',
        table: {
          head: ['Source', 'What goes wrong', 'Typical fix'],
          rows: [
            ['Pipe boots', 'Rubber collar dries, cracks, and splits - usually at 10-15 years', 'Replace boot with a lead or thermoplastic collar'],
            ['Step & counter flashing', 'Sidewalls and chimneys sealed with caulk instead of metal', 'Cut in proper step and counter flashing'],
            ['Valleys', 'Debris dams, or nails driven through the valley metal', 'Rebuild the valley with new metal and shingle weave'],
            ['Chimney', 'Failed crown, missing cricket, deteriorated mortar', 'New flashing, cricket, and crown repair'],
            ['Skylights', 'Original seals and flashing kits past service life', 'Reflash, or replace the unit'],
            ['Ice dams', 'Meltwater backing up under shingles at the eaves', 'Ice-and-water shield plus ventilation correction'],
            ['Wind damage', 'Creased or missing shingles after a storm', 'Replace field shingles and hand-seal']
          ]
        }
      },
      {
        h: 'When we tell you not to repair',
        p: 'Not every roof is worth repairing, and we will say so. If your roof is at the end of its service life, a $900 repair buys you a season and you spend it again next year. We will show you the photos, explain what we are seeing, and let you decide - no scare tactics, and no repair we know will not hold.'
      },
      {
        h: 'Emergency and storm response',
        p: 'Active leak, wind-torn shingles, or a tree limb through the deck? Call us. We tarp to stop water entry first and diagnose after the weather clears. Emergency tarping protects your interior and documents the damage for an insurance claim.',
        list: [
          '24/7 emergency tarping across our service area',
          'Photo documentation timestamped for your insurer',
          'Interior damage assessment so nothing gets missed on the claim',
          'Permanent repair scheduled as soon as conditions allow'
        ]
      }
    ],
    faqs: [
      ['How fast can you get out to a leak?', 'Emergency tarping is 24/7. Standard leak diagnosis is usually same-week, and often next-day outside of storm season when the whole region calls at once.'],
      ['Is it worth repairing a 20-year-old roof?', 'Sometimes. A single failed pipe boot on an otherwise sound 20-year roof is absolutely worth fixing. Widespread granule loss, curling, and multiple leaks on a roof that age usually is not. We show you what we find and give you a straight recommendation.'],
      ['Do you charge for a repair estimate?', 'No. Inspection and written estimate are free. If you need us to perform destructive investigation to trace a hidden leak, we tell you the cost before we start.'],
      ['Will a repair match my existing shingles?', 'We match as closely as the manufacturer current color line allows. Weathered shingles never match new ones exactly. On highly visible slopes we discuss options with you before we start.']
    ]
  },

  {
    slug: 'storm-damage-insurance-claims',
    nav: 'Storm Damage & Claims',
    title: 'Storm Damage & Insurance Claims',
    h1: 'Storm Damage Repair & Insurance Claim Help',
    icon: 'storm',
    blurb: 'Wind and hail damage inspection, documentation your adjuster can actually use, and a contractor who meets them on the roof.',
    price: 'Inspection: free · You pay your deductible',
    metaTitle: 'Storm Damage Roof Repair & Insurance Claims | ' + business.city + ' PA',
    metaDesc: 'Free storm damage roof inspection in ' + business.city + '. We document wind and hail damage, meet your adjuster on site, and handle the repair. Call ' + business.phone + '.',
    answer: 'If wind or hail damaged your roof, most homeowners insurance policies cover the repair or replacement minus your deductible. Roughneck Roofing inspects free, documents the damage with dated photographs your adjuster can use, meets the adjuster on the roof, and completes the approved scope. Claims are typically filed within one year of the storm date.',
    intro: 'Storm claims go badly for one reason more than any other: the damage was never documented properly. We inspect free, photograph everything, and stand on the roof with your adjuster so nothing legitimate gets written off.',
    sections: [
      {
        h: 'What storm damage actually looks like',
        p: 'Hail and wind damage is frequently invisible from the ground - that is exactly why it gets missed until the leak shows up two years later. Here is what we look for:',
        list: [
          'Hail bruising - soft, granule-stripped impact marks that fracture the shingle mat',
          'Creased shingles where wind lifted and folded them back',
          'Missing shingles, exposed nail heads, and lifted ridge caps',
          'Dented soft metals - gutters, downspouts, vents, and flashing (these confirm hail size)',
          'Granule accumulation at downspouts after a storm',
          'Collateral damage on siding, window wraps, AC fins, and decks'
        ]
      },
      {
        h: 'How the claim process works',
        steps: [
          ['Free inspection', 'We photograph and measure the damage and tell you honestly whether you have a claim worth filing. Not every storm produces one.'],
          ['You file the claim', 'You contact your insurer - we never file on your behalf. We give you the documentation, the storm date, and the scope.'],
          ['Adjuster meeting', 'We meet your adjuster on site and walk the roof with them so the damage is seen, not estimated from a driveway.'],
          ['Scope agreement', 'The insurer issues a scope and payment schedule. We review it with you line by line so you understand what is covered.'],
          ['We build it', 'We complete the approved work to code and to manufacturer spec, and supply final invoicing for your depreciation release.']
        ]
      },
      {
        h: 'What we will not do',
        p: 'Pennsylvania law is clear, and so are we. We do not offer to "eat," waive, rebate, or absorb your deductible - that is insurance fraud, and any contractor offering it is telling you exactly how they will treat you later. We also do not act as a public adjuster or negotiate your claim for you. What we do is document the damage accurately and build the roof correctly.'
      }
    ],
    faqs: [
      ['How long do I have to file a storm claim?', 'Most policies require the claim within one year of the date of loss, and some are shorter. Check your policy language. If a storm hit months ago and you have not looked, get an inspection now rather than after the window closes.'],
      ['Will filing a claim raise my rates?', 'A weather-related claim is a non-fault loss and is treated differently than an at-fault claim. Rate impacts vary by carrier and by how many claims are filed in your area. Your agent can answer this for your specific policy.'],
      ['What if my claim is denied?', 'Denials are often the result of thin documentation or an adjuster who never got on the roof. You can request a re-inspection. We will supply our photographs and measurements to support it. If the damage genuinely is not there, we will tell you that too.'],
      ['Do I have to use the contractor my insurance recommends?', 'No. You choose your contractor. Your insurer pays the covered scope regardless of who performs the work.']
    ]
  },

  {
    slug: 'roof-inspections',
    nav: 'Roof Inspections',
    title: 'Roof Inspections',
    h1: 'Free Roof Inspections & Certifications',
    icon: 'search',
    blurb: 'A real inspection - on the roof and in the attic - with photos of everything we find and a straight answer about remaining service life.',
    price: 'Free · Certification reports available',
    metaTitle: 'Free Roof Inspection ' + business.city + ' PA | Roughneck Roofing',
    metaDesc: 'Free, no-pressure roof inspection in ' + business.city + '. On-roof and in-attic evaluation with photo documentation and honest remaining-life assessment. Call ' + business.phone + '.',
    answer: 'A proper roof inspection covers both the roof surface and the attic. Roughneck Roofing checks shingle condition, flashing, penetrations, valleys, ventilation, and decking from above, then looks for daylight, moisture staining, and inadequate airflow from below. You receive dated photographs and an honest estimate of remaining service life. Inspections are free.',
    intro: 'Most "free inspections" are a walk around the yard with binoculars and a pre-written replacement quote. Ours is not that. We get on the roof, we get in the attic, and you get the photos whether or not you ever hire us.',
    sections: [
      {
        h: 'What we check, top to bottom',
        list: [
          'Shingle condition - granule loss, curling, cupping, cracking, blistering',
          'Flashing at every wall, chimney, skylight, and penetration',
          'Valleys, ridges, hips, and rake and eave edges',
          'Pipe boots, vents, and any prior repair work',
          'Gutters and downspouts, including fastening and pitch',
          'Attic: daylight, moisture staining, mold, compressed or wet insulation',
          'Ventilation math - is intake and exhaust actually balanced for your square footage?',
          'Decking condition, sagging, and nail-pop evidence'
        ]
      },
      {
        h: 'When you should get one',
        table: {
          head: ['Situation', 'Why now'],
          rows: [
            ['After any severe storm', 'Wind and hail damage is often invisible from the ground and claim windows expire'],
            ['Buying or selling a home', 'Roof condition is one of the top three negotiated items in a sale'],
            ['Roof is 15+ years old', 'You want a replacement on your schedule and budget, not on a leak schedule'],
            ['Twice a year, generally', 'Spring and fall - before and after our worst weather'],
            ['Any interior water stain', 'Small stains are cheap to fix; the same leak in 18 months is not']
          ]
        }
      },
      {
        h: 'What you get',
        p: 'A photo set of everything we found, an explanation of what each item means in plain English, remaining service life in years, and - only if you need it - a written estimate. No obligation attached to any of it.'
      }
    ],
    faqs: [
      ['Is the inspection really free?', 'Yes. There is no charge, no obligation, and no fee if you decide not to hire us. Real-estate certification letters for a sale carry a fee, which we quote up front.'],
      ['How long does an inspection take?', 'Usually 45 to 90 minutes depending on roof size and complexity, including attic access and photo documentation.'],
      ['Do you inspect if I only think there might be damage?', 'Especially then. Catching a failed pipe boot before it soaks a ceiling is the cheapest roofing work you will ever pay for.'],
      ['Will you pressure me into a replacement?', 'No. If your roof has ten years left, we will tell you it has ten years left. That is how we would want to be treated.']
    ]
  },

  {
    slug: 'gutters',
    nav: 'Gutters',
    title: 'Gutters & Downspouts',
    h1: 'Seamless Gutters, Downspouts & Guards',
    icon: 'gutter',
    blurb: 'Seamless aluminum gutters sized and pitched correctly, plus guards that actually keep debris out without starving the system.',
    price: 'Typical home: $1,400 - $4,500',
    metaTitle: 'Seamless Gutter Installation ' + business.city + ' PA | Roughneck Roofing',
    metaDesc: 'Seamless aluminum gutters, downspouts, and gutter guards in ' + business.city + '. Correct sizing, pitch, and drainage away from the foundation. Call ' + business.phone + '.',
    answer: 'Seamless aluminum gutters are formed on site in one continuous run, so the only joints are at corners and outlets - far fewer failure points than sectional gutters. Roughneck Roofing sizes the system to your roof drainage area (5-inch for most homes, 6-inch for large or steep roofs), pitches it correctly, and routes water away from the foundation. Typical installs run $1,400 to $4,500.',
    intro: 'Gutters are the least glamorous part of a roof system and the one most likely to cost you a foundation. Undersized, badly pitched, or clogged gutters put water exactly where you least want it.',
    sections: [
      {
        h: 'What we install',
        list: [
          'Seamless 5-inch and 6-inch K-style aluminum, formed on site to exact run lengths',
          'Heavier .032 gauge aluminum available where snow load or ice is a factor',
          'Hidden hangers screwed into the fascia - not spike-and-ferrule',
          'Downspouts sized and placed to actually carry the volume, not just to look symmetrical',
          'Underground drainage tie-ins and extensions away from the foundation',
          'Gutter guards - micro-mesh and reverse-curve options',
          'Fascia and soffit repair where rot has already started'
        ]
      },
      {
        h: 'Why gutter size matters more than people think',
        p: 'A 5-inch gutter handles most homes. Steep roofs shed water faster, and large roof areas simply produce more of it - both can overwhelm a 5-inch system during heavy rain, which is when overflow does its damage. We calculate drainage area, roof pitch, and local rainfall intensity rather than defaulting to whatever was there before.',
        table: {
          head: ['Roof drainage area', 'Recommended gutter', 'Downspout'],
          rows: [
            ['Under 1,000 sq ft', '5-inch K-style', '2 x 3'],
            ['1,000 - 1,800 sq ft', '5-inch K-style', '3 x 4'],
            ['Over 1,800 sq ft or steep pitch', '6-inch K-style', '3 x 4']
          ]
        }
      },
      {
        h: 'Ice dams and gutters',
        p: 'Gutters do not cause ice dams - inadequate attic insulation and ventilation do. But full gutters make dams worse by giving meltwater somewhere to freeze and back up. If you fight ice every winter, the fix is usually upstairs, and we will tell you that instead of selling you gutters that will not solve it.'
      }
    ],
    faqs: [
      ['Are gutter guards worth it?', 'Under heavy tree cover, yes - a good micro-mesh guard turns an annual cleanout into an occasional rinse. Under an open sky with no overhanging trees, the return is much smaller. We will tell you which situation you are in.'],
      ['How often should gutters be cleaned?', 'Twice a year without guards - late spring and after leaf drop. Under heavy tree cover, three times.'],
      ['Can you match my existing gutter color?', 'We stock a wide range of standard aluminum colors and can usually match closely. Exact matches to a decades-old finish are not always possible.'],
      ['Do you replace fascia and soffit too?', 'Yes. We often find rotted fascia once old gutters come down, and it has to be sound before new hangers go in.']
    ]
  },

  {
    slug: 'siding',
    nav: 'Siding',
    title: 'Siding & Exteriors',
    h1: 'Siding, Soffit & Fascia',
    icon: 'siding',
    blurb: 'Vinyl and fiber cement siding, plus the soffit, fascia, and trim work that keeps the whole envelope tight.',
    price: 'Typical home: $9,000 - $28,000',
    metaTitle: 'Siding Installation & Repair ' + business.city + ' PA | Roughneck Roofing',
    metaDesc: 'Vinyl and fiber cement siding, soffit, fascia, and trim in ' + business.city + '. Proper house wrap and flashing details. Free estimate: ' + business.phone + '.',
    answer: 'Siding is a water-management system, not a skin. Roughneck Roofing installs vinyl and fiber cement siding over properly detailed house wrap with flashed window and door openings, so water that gets behind the cladding drains out instead of into the wall. Typical whole-home projects run $9,000 to $28,000 depending on material and square footage.',
    intro: 'Storm damage rarely stops at the roofline. When wind or hail hits, siding, soffit, fascia, and window wraps usually take some of it - and it belongs on the same claim and the same job.',
    sections: [
      {
        h: 'What we install',
        list: [
          'Insulated and standard vinyl siding in full manufacturer color lines',
          'Fiber cement lap siding and panel',
          'Vented and solid aluminum and vinyl soffit - critical for attic intake air',
          'Aluminum-wrapped fascia and trim',
          'House wrap, seam taping, and flashed window and door openings',
          'Board and batten, shake, and scallop accents'
        ]
      },
      {
        h: 'Soffit is part of your roof system',
        p: 'This is the detail most siding crews get wrong. Your attic needs intake air at the eaves to make ridge ventilation work. Solid soffit on a house with ridge vent creates a dead attic - hotter in summer, more prone to ice dams and condensation in winter. Because we are roofers first, we size vented soffit to the exhaust it has to feed.'
      },
      {
        h: 'Vinyl vs. fiber cement',
        table: {
          head: ['', 'Vinyl', 'Fiber cement'],
          rows: [
            ['Installed cost', 'Lower', '1.5x - 2x vinyl'],
            ['Service life', '25 - 40 years', '40 - 50 years'],
            ['Impact resistance', 'Moderate - can crack in deep cold', 'High'],
            ['Maintenance', 'Wash occasionally', 'Repaint every 12 - 15 years'],
            ['Best for', 'Budget-conscious full replacements', 'Long-term ownership, exposed elevations']
          ]
        }
      }
    ],
    faqs: [
      ['Can you do siding and roofing at the same time?', 'Yes, and it is usually the right call - one mobilization, one cleanup, and the roof-to-wall flashing details get done correctly because the same crew owns both sides of the joint.'],
      ['Will new siding damage my landscaping?', 'We protect beds and shrubs with tarps and board, and we hand-clear the working area first. Some temporary trimming is occasionally needed and we discuss it with you beforehand.'],
      ['Do you repair siding, or only replace it?', 'Both. If a storm took out one elevation and we can match the profile and color, a partial replacement is often the right answer.']
    ]
  },

  {
    slug: 'commercial-roofing',
    nav: 'Commercial',
    title: 'Commercial Roofing',
    h1: 'Commercial & Flat Roofing',
    icon: 'building',
    blurb: 'TPO, EPDM, and modified bitumen for flat and low-slope buildings - plus maintenance programs that catch problems before tenants do.',
    price: 'Quoted per square foot',
    metaTitle: 'Commercial Flat Roofing in ' + business.city + ', PA | TPO & EPDM',
    metaDesc: 'Commercial flat roof installation, repair, and maintenance in ' + business.city + '. TPO, EPDM, and modified bitumen systems. Call ' + business.phone + '.',
    answer: 'Commercial low-slope roofs use membrane systems rather than shingles. TPO is a heat-welded white membrane with strong energy performance, EPDM is a durable black rubber membrane, and modified bitumen is a torch- or self-adhered asphalt system. Roughneck Roofing installs, repairs, and maintains all three for ' + business.city + '-area buildings.',
    intro: 'Flat roofs fail differently than steep-slope roofs - at seams, terminations, and drains - and they fail quietly until a tenant calls. We install membrane correctly and we inspect it on a schedule so you are not finding out from a ceiling tile.',
    sections: [
      {
        h: 'Systems we install',
        table: {
          head: ['System', 'Best for', 'Service life'],
          rows: [
            ['TPO', 'Energy savings, reflective white surface, heat-welded seams', '20 - 30 years'],
            ['EPDM', 'Durability and cold-weather flexibility, simple detailing', '20 - 30 years'],
            ['Modified bitumen', 'High-traffic roofs and complex penetrations', '15 - 25 years'],
            ['Metal / standing seam', 'Long-term low maintenance on sloped commercial', '40 - 60 years'],
            ['Roof coatings', 'Extending life on a sound but weathered membrane', '10 - 15 years']
          ]
        }
      },
      {
        h: 'Maintenance programs',
        p: 'A membrane roof that gets inspected twice a year outlasts an identical roof that gets ignored, usually by years. Our program covers seam and termination inspection, drain and scupper clearing, penetration and curb checks, and a written condition report with photos for your capital planning.',
        list: [
          'Scheduled semi-annual inspections with written reports',
          'Drain, scupper, and gutter clearing',
          'Seam, flashing, and termination bar inspection',
          'Minor repairs handled during the visit',
          'Budget forecasting for eventual replacement'
        ]
      },
      {
        h: 'Buildings we work on',
        p: 'Retail, restaurants, warehouses, light industrial, office, churches, apartment and multi-family, and property management portfolios. We schedule around your operating hours - including nights and weekends where tenant disruption is a concern.'
      }
    ],
    faqs: [
      ['Can you work around our business hours?', 'Yes. Night and weekend scheduling is routine for occupied retail and restaurant work.'],
      ['Do you handle roof coatings instead of replacement?', 'When the substrate is sound, a coating can add ten-plus years for a fraction of replacement cost. When the insulation is saturated, a coating just traps the water. We core-sample before recommending one.'],
      ['Are you insured for commercial work?', 'Yes - general liability and workers compensation. We provide certificates of insurance naming your entity before work begins.']
    ]
  }
];

/* --------------------------------------------------------------------------
   REVIEWS - verbatim from the Roughneck Roofing Facebook recommendations.
   Owner replies removed as requested. Do not edit the text.
   -------------------------------------------------------------------------- */
const reviews = [
  { name: 'Harry Hughes', source: 'Facebook', rating: 5,
    text: 'Roughneck Roofing exceeded all my expectations! From the initial consultation to the final inspection, their team was professional, punctual, and incredibly knowledgeable. They explained everything clearly, provided a fair quote, and completed the job on time with outstanding craftsmanship. The quality of the work is top-notch, and my roof looks fantastic. I highly recommend them to anyone looking for reliable and honest roofing services!' },
  { name: 'Samuel Williamson', source: 'Facebook', rating: 5,
    text: 'Roughneck Roofing exceeded all my expectations! From the first consultation to the final cleanup, their team was professional, punctual, and highly skilled. They explained everything clearly, kept me updated throughout the project, and delivered top-quality workmanship. My roof looks amazing, and I feel confident it will last for years. Highly recommend them to anyone looking for reliable roofing services!' },
  { name: 'Roland Dedja', source: 'Facebook', rating: 5,
    text: 'Roughneck Roofing did an outstanding job from start to finish. The team was professional, punctual, and extremely skilled. They explained everything clearly and made sure the entire process was smooth and stress-free. The quality of their work exceeded my expectations, and my roof looks fantastic. Highly recommend them to anyone needing reliable roofing services!' },
  { name: 'Paul Jones', source: 'Facebook', rating: 5,
    text: 'I couldn’t be happier with the service from Roughneck Roofing. They were responsive, honest, and delivered exactly what they promised. The crew worked efficiently and left everything clean when they were done. It’s rare to find a company that combines great workmanship with excellent customer service—these guys nailed it!' },
  { name: 'Russell Hansen', source: 'Facebook', rating: 5,
    text: 'Roughneck Roofing exceeded expectations! Friendly, reliable, and detail-oriented team. They completed the job efficiently with excellent craftsmanship. Pricing was fair, and communication was clear throughout. I’d gladly hire them again!' },
  { name: 'Dylan Green', source: 'Facebook', rating: 5,
    text: 'Roughneck Roofing did an amazing job! Professional, on time, and very skilled. They explained everything clearly and delivered top-quality work. The roof looks great, and the cleanup was perfect. Highly recommend them!' },
  { name: 'Paul Lynch', source: 'Facebook', rating: 5,
    text: 'Roughneck Roofing exceeded my expectations! Friendly, reliable crew, excellent workmanship, and great communication throughout. They finished on time, cleaned up well, and the results look fantastic. Highly recommend!' },
  { name: 'Alan Bakar', source: 'Facebook', rating: 5,
    text: 'Roughneck Roofing did an amazing job! The team was professional, efficient, and delivered high-quality work. They finished on time, kept everything clean, and the roof looks fantastic. Highly recommend!' },
  { name: 'Karan Spencer', source: 'Facebook', rating: 5,
    text: 'Absolutely amazing service! Roughneck Roofing did a fantastic job on my roof. The team was efficient, friendly, and paid great attention to detail. Couldn’t be happier—highly recommended!' }
];

/* --------------------------------------------------------------------------
   SERVICE AREAS
   `page: true` generates a dedicated, indexable location page.
   -------------------------------------------------------------------------- */
const areas = [
  { name: 'Pittsburgh', slug: 'pittsburgh', county: 'Allegheny County', page: true,
    note: 'From the South Hills to the North Side, Pittsburgh housing stock skews old - a lot of 1920s-1950s homes with steep slate-era pitches, tight alleys, and chimneys that were flashed with mortar and hope. We work on them every week.' },
  { name: 'Cranberry Township', slug: 'cranberry-township', county: 'Butler County', page: true,
    note: 'Cranberry is largely newer construction on wide-open lots, which means wind exposure and a lot of builder-grade 3-tab roofs now hitting the end of their service life at the same time.' },
  { name: 'Wexford', slug: 'wexford', county: 'Allegheny County', page: true,
    note: 'Larger homes, complex multi-facet roof lines, and heavy tree cover. Valleys and gutters are the two things we end up correcting most often out here.' },
  { name: 'Mt. Lebanon', slug: 'mt-lebanon', county: 'Allegheny County', page: true,
    note: 'Mature South Hills neighborhoods with steep pitches, slate and tile originals, and strict expectations about how a finished roof looks from the street.' },
  { name: 'Monroeville', slug: 'monroeville', county: 'Allegheny County', page: true,
    note: 'A mix of mid-century residential and commercial low-slope. We handle both - and a lot of storm claims after the systems that track up the Turnpike corridor.' },
  { name: 'Moon Township', slug: 'moon-township', county: 'Allegheny County', page: true,
    note: 'Exposed ridge-top developments near the airport catch wind that other neighborhoods do not. Ridge caps and rake edges take the brunt of it.' },
  { name: 'Bethel Park', county: 'Allegheny County' },
  { name: 'Upper St. Clair', county: 'Allegheny County' },
  { name: 'Peters Township', county: 'Washington County' },
  { name: 'McMurray', county: 'Washington County' },
  { name: 'Canonsburg', county: 'Washington County' },
  { name: 'Washington', county: 'Washington County' },
  { name: 'Bridgeville', county: 'Allegheny County' },
  { name: 'Carnegie', county: 'Allegheny County' },
  { name: 'Robinson Township', county: 'Allegheny County' },
  { name: 'Coraopolis', county: 'Allegheny County' },
  { name: 'Sewickley', county: 'Allegheny County' },
  { name: 'Ambridge', county: 'Beaver County' },
  { name: 'Beaver', county: 'Beaver County' },
  { name: 'Aliquippa', county: 'Beaver County' },
  { name: 'McCandless', county: 'Allegheny County' },
  { name: 'Ross Township', county: 'Allegheny County' },
  { name: 'Shaler', county: 'Allegheny County' },
  { name: 'Fox Chapel', county: 'Allegheny County' },
  { name: 'Allison Park', county: 'Allegheny County' },
  { name: 'Gibsonia', county: 'Allegheny County' },
  { name: 'Mars', county: 'Butler County' },
  { name: 'Zelienople', county: 'Butler County' },
  { name: 'Butler', county: 'Butler County' },
  { name: 'Tarentum', county: 'Allegheny County' },
  { name: 'Natrona Heights', county: 'Allegheny County' },
  { name: 'New Kensington', county: 'Westmoreland County' },
  { name: 'Plum', county: 'Allegheny County' },
  { name: 'Penn Hills', county: 'Allegheny County' },
  { name: 'Murrysville', county: 'Westmoreland County' },
  { name: 'Irwin', county: 'Westmoreland County' },
  { name: 'North Huntingdon', county: 'Westmoreland County' },
  { name: 'Greensburg', county: 'Westmoreland County' },
  { name: 'Baldwin', county: 'Allegheny County' },
  { name: 'Whitehall', county: 'Allegheny County' },
  { name: 'Brentwood', county: 'Allegheny County' },
  { name: 'Jefferson Hills', county: 'Allegheny County' }
];

/* --------------------------------------------------------------------------
   PROJECT GALLERY
   Drop your job photos into /assets/photos/ using these exact filenames and
   they appear automatically. Any file that is missing renders as a branded
   placeholder instead of a broken image, so the site never looks unfinished.
   Add or remove entries freely.
   -------------------------------------------------------------------------- */
const gallery = [
  { file: 'job-01.jpg', cat: 'Roof Replacement', alt: 'Completed architectural shingle roof replacement on a two-story home' },
  { file: 'job-02.jpg', cat: 'Roof Replacement', alt: 'New charcoal architectural shingles with ridge vent installed' },
  { file: 'job-03.jpg', cat: 'Tear-Off', alt: 'Roughneck Roofing crew during a full tear-off down to the deck' },
  { file: 'job-04.jpg', cat: 'Roof Repair', alt: 'Rebuilt roof valley with new valley metal and woven shingle courses' },
  { file: 'job-05.jpg', cat: 'Flashing', alt: 'New step and counter flashing installed at a brick chimney' },
  { file: 'job-06.jpg', cat: 'Storm Damage', alt: 'Wind-damaged shingles documented for a homeowner insurance claim' },
  { file: 'job-07.jpg', cat: 'Gutters', alt: 'Newly installed seamless aluminum gutters and downspout' },
  { file: 'job-08.jpg', cat: 'Roof Replacement', alt: 'Finished roof replacement with new drip edge and rake detail' },
  { file: 'job-09.jpg', cat: 'Decking', alt: 'Replaced roof decking before underlayment installation' },
  { file: 'job-10.jpg', cat: 'Siding', alt: 'Completed vinyl siding, soffit, and wrapped fascia' },
  { file: 'job-11.jpg', cat: 'Commercial', alt: 'Low-slope commercial membrane roof after installation' },
  { file: 'job-12.jpg', cat: 'Roof Replacement', alt: 'Aerial view of a completed Roughneck Roofing shingle roof' }
];

/* --------------------------------------------------------------------------
   SITE-WIDE FAQs (used on the FAQ page and the home page)
   -------------------------------------------------------------------------- */
const faqs = [
  { g: 'Getting started', q: 'How do I get an estimate from Roughneck Roofing?',
    a: 'Call ' + business.phone + ' or send the form on this site. We schedule an on-site inspection, get on the roof and into the attic, photograph what we find, and give you a written, line-item estimate. Inspections and estimates are free, and there is no obligation attached to either.' },
  { g: 'Getting started', q: 'How fast can you get out to my house?',
    a: 'Emergency tarping is available 24/7. Standard inspections are usually scheduled within a few days, though the week after a major storm runs longer because the whole region calls at once.' },
  { g: 'Getting started', q: 'Do you charge for estimates?',
    a: 'No. Inspection, photo documentation, and a written estimate are free. We only charge for work you approve in writing first.' },
  { g: 'Cost & payment', q: 'How much does a new roof cost?',
    a: 'Most ' + business.city + '-area homes fall between $9,000 and $22,000 for a complete architectural shingle replacement. Price is driven by roof size in squares, pitch, number of existing layers, decking condition, and complexity - not by the square footage of the house.' },
  { g: 'Cost & payment', q: 'Do you offer financing?',
    a: 'Yes. We can connect you with home improvement financing options so a replacement does not have to come out of savings all at once. Ask about it when we quote and we will walk you through the terms.' },
  { g: 'Cost & payment', q: 'When do I pay?',
    a: 'We do not ask for large money up front. A deposit secures materials and your date, with the balance due on completion after you have walked the job with us. Everything is spelled out on the written agreement before you sign.' },
  { g: 'Insurance', q: 'Do you work with insurance claims?',
    a: 'Yes. We inspect free, document wind and hail damage with dated photographs, and meet your adjuster on the roof. You file your own claim and pay your own deductible - we handle the documentation and the work.' },
  { g: 'Insurance', q: 'Will you cover my deductible?',
    a: 'No, and you should walk away from any contractor who offers to. Waiving, rebating, or absorbing an insurance deductible is fraud in Pennsylvania. We keep it straight, which is exactly why you can trust the rest of what we tell you.' },
  { g: 'The work', q: 'How long does a roof replacement take?',
    a: 'One to two working days for most single-family homes. Larger, steeper, or more complex roofs can run three. A roof is never left open overnight.' },
  { g: 'The work', q: 'Will you damage my landscaping or leave nails in the yard?',
    a: 'We tarp beds, shrubs, and hardscape before tear-off, and we run a magnetic sweep across the lawn, driveway, and street twice before we leave. If you find a nail after we go, call us and we come back out.' },
  { g: 'The work', q: 'Can you install a roof in winter?',
    a: 'Yes, with the right technique. Below roughly 40F, shingle sealant strips will not bond on their own, so we hand-seal. We do not install on ice or during active snowfall.' },
  { g: 'The work', q: 'Can you just go over my existing shingles?',
    a: 'We do not recommend it and we generally will not do it. A shingle-over hides rotted decking, traps heat that shortens the new roof life, adds dead load, and voids most manufacturer warranties. Tear-off costs a little more and is worth every dollar.' },
  { g: 'Materials & warranty', q: 'What shingles do you install?',
    a: 'Architectural laminate shingles from the major manufacturers - GAF, Owens Corning, and CertainTeed - in the full color lines. We will bring samples and show you what they look like against your siding and trim rather than guessing off a brochure.' },
  { g: 'Materials & warranty', q: 'What warranty do I get?',
    a: 'Two separate protections: the manufacturer limited warranty on the shingles, and the Roughneck Roofing workmanship warranty on the installation. Both are written into your estimate before you sign, so you know exactly what is covered.' },
  { g: 'Materials & warranty', q: 'Why does attic ventilation matter so much?',
    a: 'Because it is what determines whether your roof reaches its rated service life. Unbalanced ventilation bakes shingles from underneath in summer and drives condensation and ice dams in winter. We size intake and exhaust to your attic square footage on every replacement.' },
  { g: 'Company', q: 'Are you licensed and insured?',
    a: 'Yes. Roughneck Roofing carries general liability and workers compensation coverage, and we are registered as a home improvement contractor in Pennsylvania. We are glad to send certificates before work begins - ask, and you should ask every contractor you consider.' },
  { g: 'Company', q: 'What areas do you serve?',
    a: 'We cover ' + business.city + ' and roughly a ' + business.serviceRadiusMiles + '-mile radius, including Allegheny, Butler, Beaver, Washington, and Westmoreland counties. If you are not sure whether you are in range, call and ask.' },
  { g: 'Company', q: 'Do you use subcontractors?',
    a: 'The crews on your roof are the crews we stand behind. Whoever is on your property is covered by our insurance and held to our standard, and there is one point of contact for the whole job - us.' }
];

/* --------------------------------------------------------------------------
   RESOURCE ARTICLES
   Written question-first for answer engines (Google AI Overviews, ChatGPT,
   Perplexity, Copilot): a direct answer in the first 60 words, then depth.
   -------------------------------------------------------------------------- */
const posts = [
  {
    slug: 'how-long-does-a-roof-last-in-pittsburgh',
    title: 'How Long Does a Roof Last in Pittsburgh?',
    date: '2026-02-10',
    updated: '2026-02-10',
    cat: 'Roof Life',
    excerpt: 'Freeze-thaw cycling, heavy cloud cover, and 150+ precipitation days a year shorten roof life in Western Pennsylvania. Here is what each material realistically gets.',
    metaTitle: 'How Long Does a Roof Last in Pittsburgh? (2026 Guide)',
    metaDesc: 'Realistic roof lifespans for Pittsburgh and Western PA by material, the four things that shorten them, and how to tell where your roof is in its service life.',
    answer: 'In the Pittsburgh area, a 3-tab asphalt roof typically lasts 15 to 20 years, architectural laminate shingles 22 to 30 years, metal 40 to 60 years, and slate 75 years or more. Western Pennsylvania freeze-thaw cycling and high annual precipitation put roofs toward the lower end of national averages, and poor attic ventilation shortens any of them by five years or more.',
    sections: [
      { h: 'Roof lifespan by material in Western Pennsylvania',
        table: { head: ['Material', 'National range', 'Realistic Pittsburgh range'], rows: [
          ['3-tab asphalt', '20 - 25 yrs', '15 - 20 yrs'],
          ['Architectural laminate asphalt', '25 - 30 yrs', '22 - 30 yrs'],
          ['Premium / designer asphalt', '30 - 40 yrs', '28 - 35 yrs'],
          ['Standing seam metal', '40 - 70 yrs', '40 - 60 yrs'],
          ['Cedar shake', '20 - 40 yrs', '20 - 30 yrs'],
          ['Slate', '75 - 150 yrs', '75 - 125 yrs'],
          ['TPO / EPDM (low slope)', '20 - 30 yrs', '20 - 28 yrs']
        ]},
        p: 'A "limited lifetime" shingle warranty does not mean the shingle lasts a lifetime. It means the manufacturer prorates material defects over a defined period. Installation quality and ventilation decide actual service life far more than the label on the bundle.' },
      { h: 'Four things that shorten roof life here',
        list: [
          'Freeze-thaw cycling. Water works into small cracks, freezes, expands, and widens them. Western PA runs through this cycle dozens of times each winter, which is harder on a roof than a single deep freeze.',
          'Ice dams. Heat escaping into a poorly ventilated attic melts snow on the upper roof; it refreezes at the cold eave and backs water up under the shingles.',
          'Inadequate ventilation. Trapped attic heat cooks asphalt shingles from below. This alone can strip five to ten years off a roof, and it is the single most common defect we find.',
          'Tree cover and shade. Moss and algae hold moisture against the surface, and overhanging limbs abrade granules with every windstorm.'
        ] },
      { h: 'How to tell where your roof is in its life',
        p: 'You do not need to get on the roof to get a useful read. From the ground and from inside the attic:',
        list: [
          'Granules in the gutters or at the base of downspouts - the shingle is shedding its UV protection',
          'Shingles that look curled, cupped, or wavy along the edges',
          'Bald or shiny patches where the asphalt mat is visible',
          'Nail heads visible through the surface, or lifted ridge caps',
          'Daylight through the roof deck in the attic, or dark staining on the underside of the sheathing',
          'Any part of the roof that feels spongy underfoot'
        ],
        p2: 'If two or more of those are present and your roof is past 18 years, get an inspection before winter rather than after it.' },
      { h: 'Can you extend the life of a roof you already have?',
        p: 'Yes, and the returns are real. Correcting attic ventilation, keeping gutters clear so meltwater has somewhere to go, trimming back overhanging limbs, and replacing dried-out pipe boots at year 12 rather than year 18 can add several years to an asphalt roof. What does not help is coating an asphalt shingle roof - despite the marketing, it does not restore a spent shingle mat.' }
    ],
    faqs: [
      ['Does a dark roof wear out faster in Pittsburgh?', 'Marginally. Dark shingles run hotter in summer, which accelerates aging - but in a climate with our cloud cover and heating season, the difference is small compared with attic ventilation. Choose the color you want and get the ventilation right.'],
      ['How often should a roof be inspected?', 'Twice a year is ideal - spring and fall - plus after any severe wind or hail event. Ours are free.'],
      ['Is a 20-year-old roof automatically due for replacement?', 'No. A well-ventilated architectural roof at 20 years may have a decade left. A poorly ventilated 3-tab at 20 is usually finished. Age is a prompt to inspect, not a verdict.']
    ]
  },
  {
    slug: 'roof-replacement-cost-pittsburgh',
    title: 'Roof Replacement Cost in Pittsburgh: 2026 Pricing Guide',
    date: '2026-03-04',
    updated: '2026-03-04',
    cat: 'Cost',
    excerpt: 'What a new roof actually costs in Western PA, what drives the number up, and how to read three estimates that all look different.',
    metaTitle: 'Roof Replacement Cost in Pittsburgh (2026) | Roughneck Roofing',
    metaDesc: 'Real 2026 roof replacement pricing for Pittsburgh and Western PA - cost per square, what drives the price, and how to compare estimates line by line.',
    answer: 'Replacing an asphalt shingle roof in the Pittsburgh area typically costs $9,000 to $22,000 in 2026, or roughly $475 to $800 per square (100 square feet) installed. Roof size, pitch, number of layers to tear off, decking condition, and the number of valleys, chimneys, and skylights account for nearly all of the variation between quotes.',
    sections: [
      { h: 'Cost per square, installed',
        table: { head: ['Material', 'Per square installed', '20-square roof'], rows: [
          ['3-tab asphalt', '$400 - $550', '$8,000 - $11,000'],
          ['Architectural laminate', '$475 - $800', '$9,500 - $16,000'],
          ['Impact-resistant (Class 4)', '$650 - $950', '$13,000 - $19,000'],
          ['Designer / luxury asphalt', '$800 - $1,300', '$16,000 - $26,000'],
          ['Standing seam metal', '$1,100 - $1,900', '$22,000 - $38,000']
        ], note: 'Ranges include tear-off, disposal, underlayment, ice-and-water shield, flashing, ridge vent, labor, and permit. They do not include decking replacement, chimney masonry, or structural work.' } },
      { h: 'What actually drives your number up',
        list: [
          'Pitch. Anything over 8/12 requires staging and fall protection, and it slows a crew down considerably.',
          'Existing layers. Two layers to remove means roughly double the tear-off labor and disposal weight.',
          'Decking. Rotted sheathing is only visible after tear-off. Expect $70 to $120 per sheet installed, and expect an honest contractor to quote it as a unit price rather than pad the base bid.',
          'Complexity. Valleys, dormers, chimneys, skylights, and multiple roof planes all add cut time and flashing detail.',
          'Access. Tight city lots, alley-only access, and no place for a dumpster all add hours.',
          'Material tier. The jump from builder-grade to architectural is small. The jump to designer or metal is not.'
        ] },
      { h: 'How to compare three estimates that look nothing alike',
        p: 'The cheapest bid is usually cheap for a reason you can find on paper. Line these items up across every quote you receive:',
        table: { head: ['Check this line', 'What a good answer looks like'], rows: [
          ['Tear-off or overlay?', 'Full tear-off to the deck, all layers'],
          ['Underlayment', 'Synthetic across the full deck, not #15 felt'],
          ['Ice-and-water shield', 'Eaves, valleys, and all penetrations - not "as needed"'],
          ['Flashing', 'New step, counter, and drip edge. Never "reuse existing"'],
          ['Ventilation', 'Ridge vent plus stated intake - and a note on whether intake is adequate'],
          ['Decking', 'A unit price per sheet, stated up front'],
          ['Warranty', 'Manufacturer warranty AND a written workmanship term'],
          ['Insurance', 'GL and workers comp certificates offered without being asked']
        ] },
        p2: 'A $3,000 spread between two bids usually resolves into two or three of those lines. Once you normalize them, the real comparison is much narrower than it first appears.' },
      { h: 'Does insurance pay for a new roof?',
        p: 'Insurance pays for sudden accidental damage - wind, hail, a fallen limb. It does not pay for age or wear. If a storm damaged your roof, most policies cover repair or replacement of the damaged scope minus your deductible. Whether you get replacement cost or actual cash value depends on your policy, and it is worth knowing which you carry before you need it.' }
    ],
    faqs: [
      ['Is it cheaper to replace a roof in winter?', 'Sometimes modestly, because demand drops after the fall rush. The savings are usually smaller than people expect, and cold-weather installation requires hand-sealing to be done right.'],
      ['How much does it cost to replace decking?', 'Typically $70 to $120 per 4x8 sheet installed in this market. Ask every contractor for that unit price in writing before work starts - it is the most common source of surprise change orders.'],
      ['Should I get three estimates?', 'Two or three is sensible. More than that mostly produces noise. Compare the line items above rather than the bottom-line numbers.']
    ]
  },
  {
    slug: 'storm-damage-roof-inspection-guide',
    title: 'How to Tell If a Storm Damaged Your Roof',
    date: '2026-04-15',
    updated: '2026-04-15',
    cat: 'Storm Damage',
    excerpt: 'Most wind and hail damage is invisible from the driveway. Here is what to check after a storm, and the deadline that quietly runs out on you.',
    metaTitle: 'How to Tell If a Storm Damaged Your Roof | Pittsburgh PA',
    metaDesc: 'A homeowner checklist for spotting wind and hail roof damage after a storm in Western PA, plus how insurance claim timelines work.',
    answer: 'After a storm, check gutters and downspout splash blocks for shingle granules, look for dents on gutters, downspouts, and vent caps, scan the roof for creased or missing shingles and lifted ridge caps, and check the attic for new water staining. Soft metals dent before shingles show damage, so dented gutters are the earliest reliable sign of hail.',
    sections: [
      { h: 'The ground-level checklist',
        p: 'You do not need to climb anything. Walk the perimeter of the house after the weather clears and look for these, in this order:',
        list: [
          'Granule piles at the bottom of downspouts or in the gutter troughs',
          'Dents in gutters, downspouts, vent caps, or the metal on your AC condenser - soft metals record hail size',
          'Shingles on the ground, in the yard, or against the fence line',
          'Shingles that look creased, lifted, or crooked from the street',
          'Ridge caps that are missing, torn, or standing proud of the ridge',
          'Damage to siding, window wraps, screens, and deck boards on the storm-facing elevation',
          'New water staining on ceilings or in the attic within 48 hours'
        ] },
      { h: 'Wind damage vs. hail damage',
        table: { head: ['', 'Wind', 'Hail'], rows: [
          ['Typical pattern', 'Concentrated on one elevation and along edges and ridges', 'Random, scattered strikes across all slopes'],
          ['Shingle appearance', 'Creased, folded, lifted, or missing', 'Soft bruised marks with granules knocked away'],
          ['Best early clue', 'Shingles or ridge cap on the ground', 'Dents in gutters and soft metals'],
          ['Delayed symptom', 'Leak at the exposed edge within weeks', 'Leak in one to three years as the fractured mat opens up']
        ] },
        p: 'Hail is the sneaky one. A bruised shingle can look fine from ten feet away and still have a fractured mat that will not survive two more winters. That is why an inspection after a hail event matters even when nothing looks wrong.' },
      { h: 'What to do, in order',
        steps: [
          ['Stop active water', 'If water is coming in, get it tarped. We do emergency tarping 24/7. Put a bucket under the drip and move what you can.'],
          ['Document before anything is touched', 'Photograph interior damage, exterior damage, and anything that landed in the yard. Date-stamped photos matter later.'],
          ['Get a free inspection', 'A roofer on the roof will find things a homeowner on the ground cannot. We will tell you honestly if there is no claim here.'],
          ['File with your carrier', 'You file, not the contractor. Give them the storm date and your documentation.'],
          ['Meet the adjuster together', 'We walk the roof with your adjuster so legitimate damage does not get missed.']
        ] },
      { h: 'The deadline nobody mentions',
        p: 'Most homeowners policies require a claim within one year of the date of loss, and some carriers are stricter. Damage from a storm eighteen months ago is real, but it may no longer be claimable. If you have not had the roof looked at since the last significant storm, that is the reason to do it now rather than in spring.' }
    ],
    faqs: [
      ['Should I let a door-knocker on my roof after a storm?', 'Be careful. Storm-chasing crews follow weather into a region, sell aggressively, and are gone before a warranty claim ever comes due. Ask any contractor how long they have worked here, and who answers the phone in three years.'],
      ['My neighbor got a new roof from the same storm. Does that mean I will?', 'Not necessarily, but it is a strong reason to get inspected. Hail falls in narrow swaths, and elevation, tree cover, and roof age all change the outcome house to house.'],
      ['Can I claim damage from a storm last year?', 'Often yes, if you are still inside your policy claim window - usually one year. Check your policy and get documented quickly.']
    ]
  },
  {
    slug: 'ice-dams-prevention-western-pa',
    title: 'Ice Dams: Why They Form and How to Stop Them for Good',
    date: '2026-01-08',
    updated: '2026-01-08',
    cat: 'Winter',
    excerpt: 'Ice dams are not a gutter problem or a roof problem. They are an attic problem - and that is why heat cable never actually fixes them.',
    metaTitle: 'Ice Dam Prevention in Western PA | Roughneck Roofing',
    metaDesc: 'What causes ice dams on Pittsburgh-area roofs, why heat cable is a band-aid, and the insulation and ventilation fixes that actually solve them.',
    answer: 'Ice dams form when heat escaping into the attic melts snow on the upper roof, the meltwater runs down to the cold overhang, and it refreezes into a ridge of ice that backs water up under the shingles. The permanent fix is sealing attic air leaks, adding insulation, and balancing intake and exhaust ventilation - not heat cable, and not raking the roof.',
    sections: [
      { h: 'The mechanism, in one paragraph',
        p: 'Your attic should be roughly as cold as the outside air. When it is not - because warm indoor air leaks up through recessed lights, bath fans, the attic hatch, and top plates - the underside of the roof deck warms up. Snow on the heated portion melts. That water runs down the slope until it reaches the eave, which hangs past the heated envelope and stays at outdoor temperature. There it freezes. Repeat this over a few days and the ice ridge grows tall enough to pond water behind it, which then finds its way under the shingles and into the house.' },
      { h: 'Why the usual fixes disappoint',
        table: { head: ['Common fix', 'What it actually does'], rows: [
          ['Heat cable', 'Melts a channel through the dam. Manages the symptom, uses power all winter, and does nothing about the cause'],
          ['Raking the roof', 'Helps in the moment, is dangerous from a ladder, and often damages shingles'],
          ['Chipping the ice', 'Reliably damages shingles and gutters. Do not'],
          ['Bigger gutters', 'Does not address the melt cycle at all'],
          ['More exhaust vents alone', 'Without matching intake at the soffit, adds little and can even depressurize the attic']
        ] } },
      { h: 'What actually solves it',
        steps: [
          ['Air-seal the attic floor', 'Foam and caulk every penetration: top plates, wire and pipe chases, bath fan housings, recessed lights (IC-rated), and the attic hatch. This is the highest-value step and it is usually the cheapest.'],
          ['Insulate to R-49 or better', 'Western PA sits in climate zone 5. Attic insulation should hit roughly R-49 to R-60, evenly, without compressing it against the eave.'],
          ['Install baffles at the eaves', 'Rafter baffles keep insulation from blocking soffit intake so air can actually move up the roof deck.'],
          ['Balance intake and exhaust', 'Roughly 1 square foot of net free vent area per 300 square feet of attic floor, split about evenly between soffit intake and ridge exhaust.'],
          ['Add ice-and-water shield at the next roof', 'It will not stop a dam from forming, but it stops the water that backs up behind one from getting into the house. On a replacement, run it well past the interior wall line.']
        ] },
      { h: 'If you already have a dam right now',
        p: 'Do not climb up and chip it. Steam removal by a professional is the only method that clears a dam without wrecking the roof. In the short term, get the interior water controlled and clear snow from the lowest few feet of roof if you can do it safely from the ground with a roof rake. Then plan the attic work for spring, before next winter repeats it.' }
    ],
    faqs: [
      ['Do ice dams mean my roof is bad?', 'Usually not. They mean your attic is leaking heat. A brand-new roof over a poorly insulated attic will dam exactly the same way.'],
      ['Does insurance cover ice dam damage?', 'Interior water damage from an ice dam is often covered, though carriers vary and repeated claims can be treated as a maintenance issue. The attic work that prevents it is not covered.'],
      ['Will more attic insulation alone fix it?', 'Rarely on its own. Air sealing has to come first - insulation slows heat, but it does not stop air moving through it.']
    ]
  }
];

module.exports = { business, services, reviews, areas, gallery, faqs, posts };
