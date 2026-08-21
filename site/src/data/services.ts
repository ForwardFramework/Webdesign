/**
 * Service catalog. Each entry generates:
 *   - a card on the homepage grid
 *   - a full /services/<slug> landing page
 *   - a Service JSON-LD node
 *   - an entry in the AI-facing /llms.txt manifest
 *
 * `products` is the differentiator that most contractor sites skip: naming the
 * exact system and its warranty is what wins both homeowner trust and AI
 * citations ("who installs standing seam metal near Bethel Park?").
 */

export type Product = {
  /** URL segment. Generated from `name` when omitted — see `productSlug`. */
  slug?: string;
  name: string;
  blurb: string;
  /** Full warranty statement, shown on the service page and its own page. */
  warranty: string;
  /** Short warranty headline for cards and page heroes, e.g. "50-Year Limited". */
  warrantyShort?: string;
  bestFor: string;
  badge?: string;
};

export type Service = {
  slug: string;
  name: string;
  navLabel: string;
  /** Singular, adjectival form: "Every <singular> Option", "Free <singular> Estimate". */
  singular: string;
  icon: string;
  /** One-line answer-first definition. Feeds meta description + AI answer blocks. */
  summary: string;
  /** Homepage card copy. */
  cardBlurb: string;
  heroHeadline: string;
  heroSub: string;
  metaTitle: string;
  metaDescription: string;
  /** The single strongest reason to pick Top Dog for this trade. */
  edge: string;
  workmanship?: string;
  products: Product[];
  process: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  /** Signals rendered as pill badges under the service hero. */
  highlights: string[];
  featured: boolean;
  order: number;
};

export const services: Service[] = [
  /* ─────────────────────────────  ROOFING  ───────────────────────────── */
  {
    slug: 'roofing',
    name: 'Roofing',
    navLabel: 'Roofing',
    singular: 'Roofing',
    icon: 'roof',
    order: 1,
    featured: true,
    summary:
      'Top Dog Exteriors installs asphalt shingle, exposed fastener metal, standing seam metal, TPO and EPDM roofing across the Greater Pittsburgh area. We are an Owens Corning Preferred Contractor and every roof carries a 5-year workmanship warranty.',
    cardBlurb:
      'Shingle, standing seam, exposed fastener metal, TPO and EPDM — installed by an Owens Corning Preferred Contractor and backed by 5 years of workmanship coverage.',
    heroHeadline: 'Pittsburgh Roof Replacement Done Once, Done Right',
    heroSub:
      'Owens Corning Preferred Contractor. Five roofing systems under one roof — shingle, standing seam metal, exposed fastener metal, TPO and EPDM — each with a written 5-year workmanship warranty on top of the manufacturer’s coverage.',
    metaTitle: 'Roofing Contractor Pittsburgh PA | Shingle, Metal, TPO & EPDM',
    metaDescription:
      'Owens Corning Preferred Contractor in Bethel Park, PA. Shingle, standing seam metal, TPO and EPDM roofing with a 5-year workmanship warranty. Free instant quote.',
    edge:
      'Most Pittsburgh roofers install one system. We install five — so the recommendation you get is driven by your roof’s pitch, deck and drainage, not by what happens to be on the truck.',
    workmanship:
      'Every Top Dog roof includes a written, transferable 5-year workmanship warranty covering our installation labor — separate from and in addition to the manufacturer’s material warranty.',
    highlights: [
      'Owens Corning Preferred Contractor',
      '5-Year Workmanship Warranty',
      'Instant Satellite Roof Quote',
      'Insurance Claim Support',
    ],
    products: [
      {
        name: 'Architectural Asphalt Shingles',
        warrantyShort: 'Lifetime shingle + workmanship coverage',
        badge: 'Most popular',
        blurb:
          'Owens Corning Duration® and TruDefinition® laminate shingles with SureNail® technology, installed as a complete system — starter, ice-and-water shield, synthetic underlayment, ventilation and hip-and-ridge cap.',
        warranty:
          'As an Owens Corning Preferred Contractor we can register the Preferred Protection Roofing System Limited Warranty — lifetime shingle coverage with a 50-year TRU PROtection® period, 10 years of non-prorated TRU PROtection, 15-year blow-off coverage, 10-year StreakGuard® algae resistance, and contractor workmanship coverage that is only available through Owens Corning Preferred and Platinum contractors. Plus our own 5-year workmanship warranty.',
        bestFor: 'The majority of pitched residential roofs in Bethel Park, Mt. Lebanon and Peters Township.',
      },
      {
        name: 'Standing Seam Metal Roofing',
        warrantyShort: '30–40 yr paint finish',
        badge: 'Longest life',
        blurb:
          'Concealed-fastener panels with mechanically seamed or snap-lock ribs. No exposed screws means no gaskets to dry out and no fastener backing-out ten years down the line. Ideal on low-slope-to-steep transitions and modern farmhouse elevations.',
        warranty:
          'Manufacturer paint-finish warranties typically run 30–40 years against chipping, cracking and fading, with substrate coverage commonly to 25+ years. Backed by our 5-year workmanship warranty.',
        bestFor: 'Homeowners who want a 50-year roof, high wind resistance and a clean architectural line.',
      },
      {
        name: 'Exposed Fastener Metal Roofing',
        warrantyShort: '25–40 yr paint finish',
        blurb:
          'Ag-panel and R-panel steel screwed through the face into purlins or solid deck. The most cost-effective metal system available — a fraction of standing seam cost with the same steel substrate and paint system.',
        warranty:
          'Typical paint-finish warranties of 25–40 years depending on the coating (SMP vs. Kynar 500®). Backed by our 5-year workmanship warranty.',
        bestFor: 'Garages, pole barns, outbuildings, porch roofs, and budget-conscious full-home metal roofs.',
      },
      {
        name: 'TPO Single-Ply Membrane',
        warrantyShort: '15–25 yr membrane',
        blurb:
          'Heat-welded thermoplastic polyolefin in a reflective white that cuts summer heat gain. Fully adhered or mechanically attached over rigid insulation. Seams are welded, not glued — which is why TPO outlasts the rolled roofing it usually replaces.',
        warranty:
          'Manufacturer membrane warranties commonly run 15–25 years depending on membrane thickness (45, 60 or 80 mil) and system specification. Backed by our 5-year workmanship warranty.',
        bestFor: 'Flat and low-slope roofs — porch roofs, additions, dormers and commercial buildings.',
      },
      {
        name: 'EPDM Rubber Roofing',
        warrantyShort: '10–30 yr membrane',
        blurb:
          'Fully adhered black or white synthetic rubber membrane. Proven for decades on Pittsburgh flat roofs, exceptionally forgiving of thermal movement and ponding, and easy to detail around the pipes and curbs older homes are full of.',
        warranty:
          'Manufacturer membrane warranties commonly run 10–30 years depending on thickness and system. Backed by our 5-year workmanship warranty.',
        bestFor: 'Low-slope roofs with lots of penetrations, and flat additions over living space.',
      },
      {
        name: 'Roof Repair & Storm Damage',
        warrantyShort: '1 yr leak-free guarantee',
        blurb:
          'Leak diagnosis, flashing rebuilds, chimney and skylight re-flashing, valley repairs, and full documentation for insurance claims. We photograph and report before anything gets torn off.',
        warranty: 'Repairs carry a 1-year leak-free guarantee; full replacements carry the 5-year workmanship warranty.',
        bestFor: 'Active leaks, missing shingles after a wind event, and roofs with life left in them.',
      },
    ],
    process: [
      { title: 'Instant online estimate', body: 'Enter your address and get a real price range from satellite measurements in about 60 seconds — before anyone knocks on your door.' },
      { title: 'On-roof inspection', body: 'We get on the roof, measure by hand, check the deck, ventilation and flashing, and photograph everything. You get the photos whether you hire us or not.' },
      { title: 'Written system proposal', body: 'Line-item pricing for the full system — not a single number on the back of a card. Options priced side by side so you can see the trade-offs.' },
      { title: 'Install', body: 'Property protection goes down first. Tear-off, deck inspection, ice-and-water, underlayment, flashing, field, ridge vent. Most homes are a one-day job.' },
      { title: 'Magnet sweep & final walk', body: 'Full-property magnet sweep, debris haul-off, and a walkthrough with the owner. Then your warranty paperwork gets registered.' },
    ],
    faqs: [
      { q: 'How much does a new roof cost in Pittsburgh?', a: 'Most full architectural shingle replacements in the Greater Pittsburgh area land between $9,000 and $22,000 depending on square footage, pitch, layers of tear-off and the condition of the decking. Standing seam metal typically runs two to three times an asphalt roof. Our instant roof quote tool gives you a real range for your specific address in about 60 seconds.' },
      { q: 'What does being an Owens Corning Preferred Contractor actually get me?', a: 'It is the credential that unlocks the Preferred Protection Roofing System Limited Warranty. That is the only Owens Corning warranty tier that includes contractor workmanship coverage — if the roof was installed wrong, Owens Corning stands behind fixing it. Non-credentialed roofers cannot register it at all.' },
      { q: 'How long does a roof replacement take?', a: 'A typical Bethel Park or Mt. Lebanon home is a single day. Larger or steeper roofs, and roofs with multiple layers to tear off, run two days. Metal and low-slope membrane systems take longer — we give you the real number in the proposal.' },
      { q: 'Do you handle insurance claims?', a: 'Yes. We document storm damage with dated photographs, meet your adjuster on site, and provide a line-item scope that speaks the same language as the insurance estimate. We do not, however, waive or absorb your deductible — that is illegal in Pennsylvania and any contractor offering it is telling you how they do business.' },
      { q: 'What is the difference between standing seam and exposed fastener metal?', a: 'Standing seam hides every fastener under a seamed rib, so there are no gaskets to fail and nothing to back out — it is the longest-lived metal roof you can buy. Exposed fastener panels screw through the face of the panel, which costs substantially less and installs faster, at the price of periodic screw and gasket maintenance. Both use the same steel and paint systems.' },
      { q: 'Can you roof a flat porch or addition?', a: 'Yes — that is exactly what TPO and EPDM are for. Shingles are not rated below a 2:12 pitch, so if someone quoted you shingles on a flat roof, get a second opinion. We weld TPO seams and fully adhere EPDM, both of which will outlast rolled asphalt several times over.' },
    ],
  },

  /* ──────────────────────────────  DECKS  ────────────────────────────── */
  {
    slug: 'decks',
    name: 'Decks & Outdoor Living',
    navLabel: 'Decks',
    singular: 'Deck',
    icon: 'deck',
    order: 2,
    featured: true,
    summary:
      'Top Dog Exteriors builds custom TimberTech and Trex composite decks in the Greater Pittsburgh area. Every deck is framed and finished by our Amish crews, with manufacturer product warranties ranging from 25 years to a lifetime limited warranty.',
    cardBlurb:
      'Custom TimberTech and Trex decks built by our Amish crews — with product warranties running from 25 years to lifetime limited.',
    heroHeadline: 'Composite Decks Built by Amish Craftsmen',
    heroSub:
      'TimberTech and Trex, framed square and fastened tight by crews who have been building with hand tools since they were kids. Product warranties range from 25 years up to a lifetime limited warranty with 50-year fade and stain protection.',
    metaTitle: 'Deck Builders Pittsburgh PA | TimberTech & Trex Composite Decks',
    metaDescription:
      'Custom TimberTech and Trex composite decks built by Amish crews in Greater Pittsburgh. 25-year to lifetime limited product warranties. Free design and estimate.',
    edge:
      'Our decks are built by Amish crews. That is not marketing — it is why our framing is square, our picture-frame borders close tight, and our fastener lines are straight enough to sight down.',
    workmanship:
      'Framing, ledger attachment and flashing are the parts of a deck nobody sees and everybody regrets. We flash every ledger, bolt to structure, and build to PA residential code so your deck passes inspection the first time.',
    highlights: [
      'Built by Amish Crews',
      'TimberTech & Trex Authorized',
      'Up to Lifetime Limited Warranty',
      '3D Design Before You Commit',
    ],
    products: [
      {
        name: 'TimberTech Advanced PVC',
        warrantyShort: 'Lifetime + 50 yr fade & stain',
        badge: 'Best warranty',
        blurb:
          'The AZEK-family Vintage, Harvest and Landmark collections. 100% PVC — no wood flour at all — so there is nothing in the board for mold to eat. Runs noticeably cooler underfoot than capped composite and is the most stain-resistant decking made.',
        warranty:
          'Lifetime Limited Product Warranty plus a 50-Year Limited Fade & Stain Warranty.',
        bestFor: 'Pool surrounds, full-sun southern exposures, and homeowners who plan to stay put.',
      },
      {
        name: 'TimberTech Composite (Terrain, Prime+, Edge)',
        warrantyShort: '25–30 yr product & fade',
        blurb:
          'Capped wood-composite boards with the deepest, most convincing woodgrain in the category and multi-tonal streaking that reads as real lumber from the yard.',
        warranty:
          '25–30-Year Limited Product Warranty with a matching 25–30-Year Limited Fade & Stain Warranty, depending on collection.',
        bestFor: 'The best balance of realism and price for a typical family deck.',
      },
      {
        name: 'Trex Transcend®',
        warrantyShort: '50 yr product & fade',
        badge: 'Flagship',
        blurb:
          'Trex’s top tier — the deepest embossing, the richest tropical hardwood tones, and the highest scratch and fade resistance in the Trex line. Pairs with Transcend railing for a fully matched system.',
        warranty: '50-Year Limited Residential Warranty and a 50-Year Limited Fade & Stain Warranty.',
        bestFor: 'Showpiece decks where the railing and the boards need to match perfectly.',
      },
      {
        name: 'Trex Select®',
        warrantyShort: '35 yr product & fade',
        blurb: 'Mid-tier Trex with a refined grain and a tighter, more uniform color palette. The value pick that still carries serious coverage.',
        warranty: '35-Year Limited Residential Warranty and a 35-Year Limited Fade & Stain Warranty.',
        bestFor: 'Mid-size decks where budget matters but you still want a 35-year board.',
      },
      {
        name: 'Trex Enhance®',
        warrantyShort: '25 yr product & fade',
        blurb: 'Trex’s entry line, available in Basics and Naturals. Scalloped underside keeps the board light and the price down without giving up the capped shell.',
        warranty: '25-Year Limited Residential Warranty and a 25-Year Limited Fade & Stain Warranty.',
        bestFor: 'Replacing a failing pressure-treated deck on a budget, or large square-footage builds.',
      },
      {
        name: 'Railing, Lighting & Screened Porches',
        warrantyShort: '10–25 yr by component',
        blurb:
          'Composite, aluminum and cable railing systems; recessed riser and post-cap lighting; pergolas, roofed porches and full three-season rooms framed to match the house.',
        warranty: 'Railing and lighting carry their own manufacturer warranties, typically 10–25 years.',
        bestFor: 'Turning a deck into a room you actually use in October.',
      },
    ],
    process: [
      { title: 'Design consult', body: 'We walk the yard, take grade and door-height measurements, and talk through how you actually use the space — grill, table, hot tub, dogs, stairs.' },
      { title: 'Board and railing selection', body: 'Full-size TimberTech and Trex samples in your hand, in your light, against your siding. Color reads completely differently on a screen.' },
      { title: 'Permit & layout', body: 'We pull the municipal permit and stake the footing layout. Bethel Park, Mt. Lebanon and Peters Township all inspect differently — we know each.' },
      { title: 'Amish crew build', body: 'Footings, framing, ledger flashing, decking, borders, railing, lighting. Hidden fasteners throughout so nothing shows on the walking surface.' },
      { title: 'Final inspection & warranty', body: 'Municipal final inspection, site cleanup, and your manufacturer warranty registered in your name.' },
    ],
    faqs: [
      { q: 'How much does a composite deck cost in Pittsburgh?', a: 'Composite decks in the Greater Pittsburgh area generally run $45–$85 per square foot installed, depending on the board line, height off grade, stair count and railing system. A typical 16×20 Trex Enhance deck lands in the low-to-mid $20,000s; the same footprint in TimberTech Advanced PVC with lighting runs meaningfully higher. We price every option side by side.' },
      { q: 'Why do you use Amish crews?', a: 'Because the framing is the deck. Amish builders come up through a trade apprenticeship measured in years, not weeks, and the standard they hold for square framing, tight miters and consistent fastener lines is simply higher than what a rotating labor pool produces. It costs us more. It shows in the finished deck.' },
      { q: 'TimberTech or Trex — which should I pick?', a: 'If maximum warranty and heat performance matter most, TimberTech Advanced PVC wins: lifetime limited product coverage and 50-year fade and stain. If you want a matched board-and-railing system with the deepest tropical grain, Trex Transcend at 50 years is hard to beat. If the budget is the driver, Trex Enhance and TimberTech Edge deliver a genuine 25-year capped board. We stock samples of all of them.' },
      { q: 'Do composite decks get hot?', a: 'All decking gets hot in full sun; lighter colors run cooler than dark ones regardless of brand. TimberTech Advanced PVC runs measurably cooler than capped wood-composite because there is no wood flour in the board to hold heat. If your deck faces south with no shade, we will steer you toward a lighter PVC board.' },
      { q: 'Do I need a permit for a deck?', a: 'In virtually every municipality we serve — yes. We pull it. Deck permits in Allegheny and Washington County typically require a site plan, footing detail and framing plan, and the inspector will want to see footings before they are covered. Building without one becomes a very expensive problem when you sell the house.' },
      { q: 'Can you rebuild just the surface of my existing deck?', a: 'Sometimes. If the framing is pressure-treated, properly flashed and structurally sound, re-decking over existing joists is a legitimate way to save money. But composite boards require tighter joist spacing than old decks were often built to, so we inspect the frame first and tell you honestly whether it will carry the new material.' },
    ],
  },

  /* ─────────────────────────────  SIDING  ────────────────────────────── */
  {
    slug: 'siding',
    name: 'Siding',
    navLabel: 'Siding',
    singular: 'Siding',
    icon: 'siding',
    order: 3,
    featured: true,
    summary:
      'Top Dog Exteriors installs vinyl, Alside ASCEND composite, Everlast composite, James Hardie fiber cement and LP SmartSide engineered wood siding across the Greater Pittsburgh area, each with its own manufacturer warranty plus our 5-year workmanship warranty.',
    cardBlurb:
      'Vinyl, ASCEND, Everlast, James Hardie and LP SmartSide — five siding systems, five warranties, one 5-year workmanship guarantee.',
    heroHeadline: 'Siding That Outlives the Mortgage',
    heroSub:
      'Vinyl, Alside ASCEND, Everlast composite, James Hardie fiber cement and LP SmartSide engineered wood. Each system carries its own manufacturer warranty — and every one of them carries our written 5-year workmanship warranty.',
    metaTitle: 'Siding Contractor Pittsburgh PA | James Hardie & LP SmartSide',
    metaDescription:
      'Vinyl, Alside ASCEND, Everlast, James Hardie and LP SmartSide siding installation in Greater Pittsburgh. 5-year workmanship warranty. Free estimate.',
    edge:
      'Siding failures are almost never the siding — they are the water management behind it. We detail the housewrap, flashing and kick-outs first, then hang the product.',
    workmanship:
      'Every siding installation includes a written, transferable 5-year workmanship warranty covering our labor — on top of the manufacturer’s product warranty.',
    highlights: [
      '5 Siding Systems',
      '5-Year Workmanship Warranty',
      'Full House Wrap & Flashing Detail',
      'Insulated Options Available',
    ],
    products: [
      {
        name: 'Vinyl Siding',
        warrantyShort: 'Lifetime limited, transferable once',
        blurb:
          'Modern vinyl in double-4, double-5, Dutch lap and board-and-batten profiles, with insulated backing available for a meaningful bump in R-value and a far flatter, more rigid wall.',
        warranty:
          'Most premium vinyl lines carry a lifetime limited warranty, transferable once. Read the fine print with us: vinyl "lifetime" coverage is typically prorated after the first 5–10 years and does not cover labor. Ours does, for 5 years.',
        bestFor: 'The best cost-per-year in siding, and the fastest path to a whole-house transformation.',
      },
      {
        name: 'Alside ASCEND® Composite Cladding',
        warrantyShort: 'Lifetime, transferable',
        badge: 'Best of both',
        blurb:
          'Glass-reinforced polymer over graphite-infused polystyrene using Alside’s (GP)² technology. It looks and cuts like fiber cement, weighs a fraction as much, and outperforms it on wind load and impact. 21 designer colors with real woodgrain texture.',
        warranty:
          'Lifetime limited warranty, transferable — converting to a 50-year prorated warranty for the next homeowner. Includes coverage against hail damage under one inch in diameter.',
        bestFor: 'Homeowners who want the fiber-cement look without the weight, dust or repainting cycle.',
      },
      {
        name: 'Everlast® Composite Siding',
        warrantyShort: 'Lifetime, transferable',
        blurb:
          'Solid-core composite of crushed stone, polymer resin and acrylic. The color goes all the way through the board rather than sitting on top of it, so scratches and cut ends do not read white. Never needs painting.',
        warranty: 'Transferable lifetime limited warranty.',
        bestFor: 'Coastal-grade durability and a completely maintenance-free wall.',
      },
      {
        name: 'James Hardie® Fiber Cement',
        warrantyShort: '30 yr non-prorated + 15 yr finish',
        badge: 'Most requested',
        blurb:
          'HardiePlank® lap, HardiePanel® vertical and HardieShingle® siding with the ColorPlus® factory finish. Engineered for the HZ5® climate zone — which is exactly what Western Pennsylvania freeze-thaw is. Non-combustible and completely immune to woodpeckers and rot.',
        warranty:
          '30-year non-prorated limited substrate warranty plus a 15-year non-prorated ColorPlus® finish warranty. "Non-prorated" is the key word — coverage does not shrink with age the way vinyl’s does.',
        bestFor: 'Resale value, fire resistance, and the crispest shadow lines available.',
      },
      {
        name: 'LP® SmartSide® Engineered Wood',
        warrantyShort: '50 yr substrate',
        blurb:
          'Treated engineered-wood strand substrate with SmartGuard® processing. Real wood texture, holds a fastener like lumber, cuts with a standard saw, and takes impact without the cracking fiber cement is prone to.',
        warranty: '50-year limited substrate warranty — the longest substrate coverage in the siding category.',
        bestFor: 'Wide 8" and 12" lap exposures, board-and-batten, and any home where impact resistance matters.',
      },
      {
        name: 'Soffit, Fascia, Trim & Wraps',
        warrantyShort: '20–40 yr finish',
        blurb:
          'Vented aluminum and vinyl soffit, aluminum-wrapped fascia, PVC and composite corner and window trim, column wraps and shutters. The details that decide whether a siding job looks finished or looks cheap.',
        warranty: 'Aluminum and PVC trim components carry manufacturer finish warranties, typically 20–40 years.',
        bestFor: 'Completing a siding project, or fixing rotted soffit and fascia on its own.',
      },
    ],
    process: [
      { title: 'Wall assessment', body: 'We check for soft sheathing, previous water intrusion, and how the existing windows and doors are flashed. What we find changes the scope — better to find it now.' },
      { title: 'Product & color selection', body: 'Large-format samples on your wall, in your light. We mock up trim and accent colors before a single piece is ordered.' },
      { title: 'Tear-off & sheathing repair', body: 'Old siding comes off, damaged sheathing gets replaced, and the wall gets a proper weather-resistive barrier — not just tarpaper stapled up.' },
      { title: 'Flashing & installation', body: 'Window and door head flashing, kick-out flashing at every roof-wall intersection, then the cladding itself installed to manufacturer spec so the warranty stays valid.' },
      { title: 'Trim out & cleanup', body: 'Soffit, fascia, corners, J-channel, caulk lines. Magnet sweep and haul-off. Warranty registered in your name.' },
    ],
    faqs: [
      { q: 'How much does siding cost in Pittsburgh?', a: 'Whole-house siding in the Greater Pittsburgh area typically runs $12,000–$45,000 depending on square footage, stories, and product. Vinyl anchors the low end; James Hardie ColorPlus, ASCEND and Everlast sit at the top. Wall repairs discovered during tear-off are the most common source of change orders, which is why we inspect before we quote.' },
      { q: 'James Hardie or LP SmartSide?', a: 'Hardie is non-combustible fiber cement with a 30-year non-prorated substrate warranty and 15-year ColorPlus finish coverage, and it holds the crispest shadow line. LP SmartSide is engineered wood with a 50-year substrate warranty, far better impact resistance, and it is lighter and faster to install. For a house that takes hail or ball impacts, we lean LP. For maximum fire resistance and resale, we lean Hardie.' },
      { q: 'Is insulated vinyl siding worth it?', a: 'For most Pittsburgh homes, yes — but not primarily for the R-value. Contoured foam backing makes the wall dramatically flatter and more rigid, kills the hollow sound, and helps the panel hold its line over uneven old sheathing. The energy savings are real but modest; the appearance and durability gain is the actual argument.' },
      { q: 'What is ASCEND and how is it different from vinyl?', a: 'ASCEND is composite cladding, not vinyl. It uses glass-reinforced polymer over graphite-infused polystyrene, so it installs with the ease of vinyl but presents the thickness, texture and shadow line of fiber cement. It carries a lifetime limited transferable warranty that converts to 50-year prorated coverage for the next owner, and it covers hail under one inch.' },
      { q: 'Do you replace rotted wood behind the siding?', a: 'Always, and we show it to you before we cover it. Rotted OSB or plank sheathing is not something to side over — it will not hold a fastener and the failure will just reappear. We price sheathing replacement per sheet so there are no surprise numbers.' },
      { q: 'What does your 5-year workmanship warranty cover on siding?', a: 'Our labor: fastening, flashing, trim, and the installation details that determine whether water gets behind the wall. It is written, transferable, and it runs on top of whatever the manufacturer covers on the product itself.' },
    ],
  },

  /* ─────────────────────────────  WINDOWS  ───────────────────────────── */
  {
    slug: 'windows',
    name: 'Windows',
    navLabel: 'Windows',
    singular: 'Window',
    icon: 'window',
    order: 4,
    featured: true,
    summary:
      'Top Dog Exteriors installs Alside Mezzo and Alside Vero energy-efficient vinyl replacement windows in the Greater Pittsburgh area. Our installers are factory trained and certified, which is what keeps the manufacturer warranty valid.',
    cardBlurb:
      'Alside Mezzo and Vero replacement windows installed by factory trained and certified installers — with a lifetime limited warranty.',
    heroHeadline: 'Replacement Windows Installed by Certified Pros',
    heroSub:
      'Alside Mezzo® and Alside Vero® energy-efficient vinyl windows, fitted by factory trained and certified installers. A window is only as good as its installation — and a bad installation voids the warranty you paid for.',
    metaTitle: 'Replacement Windows Pittsburgh PA | Alside Mezzo & Vero',
    metaDescription:
      'Alside Mezzo and Vero energy-efficient vinyl replacement windows in Greater Pittsburgh, installed by factory trained and certified installers. Free quote.',
    edge:
      'Our crews are factory trained and certified by the manufacturer. That matters more than the sticker on the glass: improper installation is the single most common reason a window warranty claim gets denied.',
    highlights: [
      'Factory Trained & Certified Installers',
      'Lifetime Limited Warranty',
      'ENERGY STAR® Qualified Packages',
      'Custom Made to Your Opening',
    ],
    products: [
      {
        name: 'Alside Mezzo®',
        warrantyShort: 'Lifetime limited',
        badge: 'Best seller',
        blurb:
          'Narrowline frames with fusion-welded corners, insulated glass with double-strength glass and structural foam spacers, low-conductive composite reinforcement in the meeting rail, a true sloped sill for drainage, and a constant-force balance system that makes a heavy sash feel light. The narrow frame is the point — you get more daylight opening than a typical replacement window.',
        warranty: 'Lifetime Limited Warranty from Alside, with optional glass breakage coverage available.',
        bestFor: 'Whole-home replacement where glass area and energy performance both matter.',
      },
      {
        name: 'Alside Vero®',
        warrantyShort: 'Lifetime limited',
        badge: 'Premium',
        blurb:
          'Alside’s premium replacement line — heavier extrusions, upgraded hardware, expanded interior and exterior color options including dark exterior finishes, and higher-performing glass packages. The one to pick when the windows are visible from the street.',
        warranty: 'Lifetime Limited Warranty from Alside, with optional glass breakage coverage available.',
        bestFor: 'Front elevations, larger openings, and homes where a black or bronze exterior frame is the design goal.',
      },
      {
        name: 'Specialty & Custom Shapes',
        warrantyShort: 'Lifetime limited',
        blurb:
          'Double hung, slider, casement, awning, picture, bay, bow, garden and geometric shapes — every unit built to the measured opening rather than shimmed into a stock size.',
        warranty: 'Covered under the same Alside Lifetime Limited Warranty as the corresponding product line.',
        bestFor: 'Older Pittsburgh homes where no two openings are the same dimension.',
      },
      {
        name: 'Patio & Sliding Glass Doors',
        warrantyShort: 'Lifetime limited',
        blurb:
          'Alside sliding patio doors with the same welded-frame construction and glass packages as the window lines, plus ProVia hinged and sliding patio systems when the opening deserves an upgrade.',
        warranty: 'Alside Lifetime Limited Warranty; ProVia patio doors carry a Lifetime Limited Transferable Warranty.',
        bestFor: 'Deck and patio access that needs to match the new windows.',
      },
    ],
    process: [
      { title: 'In-home measure', body: 'Every opening measured individually to the sixteenth. Replacement windows are manufactured to your house, not ordered off a shelf.' },
      { title: 'Glass package selection', body: 'We walk through Low-E coatings, argon fill and spacer options and show you what each one actually does for a Pittsburgh winter and a July afternoon.' },
      { title: 'Manufacturing', body: 'Units are built at the factory, typically 3–5 weeks. We give you a real date, not a season.' },
      { title: 'Certified installation', body: 'Factory trained and certified installers set, shim, insulate, flash and trim each opening. Most homes are done in a day.' },
      { title: 'Warranty registration', body: 'Units registered in your name so the Lifetime Limited Warranty is on file before we leave.' },
    ],
    faqs: [
      { q: 'How much do replacement windows cost in Pittsburgh?', a: 'Installed Alside Mezzo windows typically run $650–$1,100 per opening depending on size, style and glass package; Vero runs higher. Whole-home projects of 10–15 windows commonly land between $8,000 and $16,000. Bays, bows and custom geometrics are priced individually.' },
      { q: 'What does "factory trained and certified installer" actually mean?', a: 'It means the manufacturer has trained and tested our crews on their specific installation method and signed off on it. It matters because nearly every denied window warranty claim traces back to installation — improper shimming, missing flashing, over-driven fasteners, or foam that bows the frame. Certification is the manufacturer agreeing that we know how not to do that.' },
      { q: 'Mezzo or Vero?', a: 'Mezzo is the value-forward choice: narrowline frames, more daylight opening, excellent energy numbers, lifetime limited warranty. Vero is the premium line — heavier extrusion, upgraded hardware, and far more color options including dark exteriors. Many homeowners run Vero on the front elevation and Mezzo everywhere else, which we are happy to quote.' },
      { q: 'How long does window installation take?', a: 'Most homes are a single day for 10–15 openings. The long pole is manufacturing, typically 3–5 weeks from the day we measure, because every unit is built to your specific opening.' },
      { q: 'Will new windows actually lower my energy bill?', a: 'They help, but be skeptical of anyone promising a specific percentage. In most Pittsburgh homes, replacing single-pane or failed double-pane units produces a noticeable comfort change first — no more cold draft along the wall — and a modest utility reduction second. If someone quotes you a guaranteed 40% savings, ask them to put it in the contract.' },
    ],
  },

  /* ──────────────────────────────  DOORS  ────────────────────────────── */
  {
    slug: 'doors',
    name: 'Entry & Patio Doors',
    navLabel: 'Doors',
    singular: 'Door',
    icon: 'door',
    order: 5,
    featured: true,
    summary:
      'Top Dog Exteriors installs ProVia entry, storm and patio doors in the Greater Pittsburgh area. ProVia’s Embarq, Signet, Heritage and Legacy doors carry a Lifetime Limited Transferable Warranty.',
    cardBlurb:
      'ProVia entry, storm and patio doors — built to order, professionally installed, with a Lifetime Limited Transferable Warranty.',
    heroHeadline: 'ProVia Doors — The Best Door Made',
    heroSub:
      'Embarq®, Signet®, Heritage™ and Legacy™ entry systems, plus ProVia storm and patio doors. Every one built to order, hung by our crews, and carrying a Lifetime Limited Transferable Warranty.',
    metaTitle: 'ProVia Entry & Patio Doors Pittsburgh PA | Top Dog Exteriors',
    metaDescription:
      'ProVia Embarq, Signet, Heritage and Legacy entry, storm and patio doors installed in Greater Pittsburgh. Lifetime Limited Transferable Warranty. Free quote.',
    edge:
      'A door is the one part of your exterior every guest touches. ProVia builds each one to order — which is why the reveal is even, the weatherstrip actually seals, and the deadbolt lands where it should.',
    highlights: [
      'ProVia Authorized Installer',
      'Lifetime Limited Transferable Warranty',
      'Built to Order, Not Off the Shelf',
      'Full Decorative Glass Catalog',
    ],
    products: [
      {
        name: 'ProVia Embarq® Fiberglass',
        warrantyShort: 'Lifetime limited, transferable',
        badge: 'Most energy efficient',
        blurb:
          'ProVia’s flagship. A polyurethane-core fiberglass door with an insulated composite frame — the highest-performing entry system ProVia builds, and one of the most energy-efficient doors available anywhere.',
        warranty:
          'Lifetime Limited Transferable Warranty: warranted not to shrink, warp, split, crack or delaminate for as long as you own and live in the home. Window trim covered 15 years; the Endura® threshold system, hinges, weatherstripping, bottom sweep and steel L-frame covered 5 years.',
        bestFor: 'Exposed entries, passive-house-minded homeowners, and anyone who wants the best door made.',
      },
      {
        name: 'ProVia Signet® Fiberglass',
        warrantyShort: 'Lifetime limited, transferable',
        blurb:
          'Furniture-grade fiberglass with the most convincing woodgrain in the industry — genuine mahogany, oak, cherry and knotty alder textures with matching stain finishes applied at the factory.',
        warranty:
          'Lifetime Limited Transferable Warranty against shrinking, warping, splitting, cracking and delaminating. Window trim covered 15 years; hardware and threshold components 5 years.',
        bestFor: 'Homeowners who want the look of a stained wood door without ever refinishing one.',
      },
      {
        name: 'ProVia Heritage™ Fiberglass & Legacy™ Steel',
        warrantyShort: 'Lifetime limited, transferable',
        blurb:
          'Heritage brings smooth and woodgrain-textured fiberglass at a more accessible price. Legacy is 20-gauge steel — heavier gauge than most competitors’ entry doors — with a factory paint finish and the same Endura threshold.',
        warranty:
          'Lifetime Limited Transferable Warranty on the door slab. Window trim covered 10 years; threshold, hinges, sweep and weatherstripping 5 years.',
        bestFor: 'Side and rear entries, garage-to-house doors, and value-focused front-door replacements.',
      },
      {
        name: 'ProVia Storm Doors',
        warrantyShort: 'ProVia limited warranty',
        blurb:
          'Spectrum, Deluxe and Duraguard series with full-view, retractable-screen and ventilating configurations. Aluminum frames with real corner welds instead of plastic corner keys.',
        warranty: 'ProVia limited warranty coverage on frame, glass and hardware components.',
        bestFor: 'Protecting a new entry door and getting fresh air without the bugs.',
      },
      {
        name: 'Patio & Sliding Doors',
        warrantyShort: 'Lifetime limited, transferable',
        blurb:
          'ProVia hinged French, sliding and multi-slide patio doors with matching decorative glass and hardware — sized to a deck or patio opening and finished to match the entry door.',
        warranty: 'Lifetime Limited Transferable Warranty on ProVia patio door systems.',
        bestFor: 'Pairing with a new deck or three-season room.',
      },
    ],
    process: [
      { title: 'Opening measure & inspection', body: 'We check the rough opening, sill condition and framing for rot before anything is ordered — a new door in a rotted opening is a wasted door.' },
      { title: 'Design your door', body: 'Style, glass, finish, hardware, sidelites and transoms configured together so you see the whole entry, not a slab in isolation.' },
      { title: 'Built to order', body: 'ProVia manufactures your specific door. Typical lead time is 3–5 weeks.' },
      { title: 'Installation', body: 'Sill pan flashing, level set, insulate, trim and adjust. We do not leave until the door closes with one finger and latches without a shove.' },
      { title: 'Warranty registration', body: 'Registered in your name — and the coverage is transferable if you sell.' },
    ],
    faqs: [
      { q: 'How much does a ProVia entry door cost installed?', a: 'A Heritage or Legacy entry door typically installs for $2,200–$4,000. Signet with decorative glass and sidelites commonly runs $4,500–$8,000. Embarq, full entry systems with transoms, and multi-panel configurations go higher. Storm doors typically add $600–$1,400.' },
      { q: 'Is ProVia actually better than a big-box door?', a: 'Yes, and the difference is measurable rather than marketing. ProVia builds each door to order rather than to a stock size, uses 20-gauge steel where most competitors use 24-gauge, and uses the Endura composite threshold system rather than a wood substrate that rots. It is also the reason they can offer a Lifetime Limited Transferable Warranty on the slab.' },
      { q: 'What is transferable warranty coverage worth?', a: 'It survives the sale of your house, which is genuinely rare in the door category and a real line item on a listing sheet. Most door warranties end the day you hand over the keys.' },
      { q: 'Fiberglass or steel?', a: 'Fiberglass for exposed entries, coastal or high-sun exposures, and any door you want to look like stained wood — it will not dent and will not rust. Steel for security-focused and lower-exposure openings where the price advantage matters. ProVia’s Legacy steel is 20-gauge, which resists denting far better than the 24-gauge doors sold at most retailers.' },
    ],
  },

  /* ─────────────────────────────  GUTTERS  ───────────────────────────── */
  {
    slug: 'gutters',
    name: 'Seamless Gutters',
    navLabel: 'Gutters',
    singular: 'Gutter',
    icon: 'gutter',
    order: 6,
    featured: true,
    summary:
      'Top Dog Exteriors fabricates and installs seamless 5-inch and 6-inch K-style aluminum gutters on site, in a full range of baked-enamel colors, throughout the Greater Pittsburgh area.',
    cardBlurb:
      'Seamless 5" and 6" aluminum gutters rolled on site in a full range of colors — with 6" oversized systems for big Pittsburgh rooflines.',
    heroHeadline: 'Seamless Gutters Rolled On Your Driveway',
    heroSub:
      'Seamless 5-inch and 6-inch K-style aluminum in a full range of baked-enamel colors, formed to the exact length of your run. No seams means no seams to leak — which is where nearly every gutter failure starts.',
    metaTitle: 'Seamless Gutters Pittsburgh PA | 5" & 6" Gutter Installation',
    metaDescription:
      'Seamless 5-inch and 6-inch aluminum gutters in many colors, fabricated on site in Greater Pittsburgh. Gutter guards, downspouts, soffit and fascia.',
    edge:
      'We roll your gutter on site to the exact length of the run. A sectional gutter from a box store has a seam every ten feet, and every one of them is a future leak.',
    highlights: [
      'Formed On Site — Zero Seams',
      '5" and 6" K-Style',
      'Full Color Range',
      'Hidden Hanger System',
    ],
    products: [
      {
        name: 'Seamless 5" K-Style Aluminum',
        warrantyShort: '20+ yr baked-enamel finish',
        badge: 'Standard',
        blurb:
          'The residential standard. .027 or heavier .032 gauge aluminum rolled continuously on site, hung on hidden hangers screwed into the fascia — not spike-and-ferrule, which works loose.',
        warranty: 'Baked-enamel finish warranties commonly run 20+ years against chipping, peeling and fading.',
        bestFor: 'Most single-family homes with conventional roof areas.',
      },
      {
        name: 'Seamless 6" Oversized K-Style',
        warrantyShort: '20+ yr baked-enamel finish',
        badge: 'High capacity',
        blurb:
          'Roughly 40% more water capacity than 5-inch, paired with 3×4 downspouts instead of 2×3. If your gutters overflow in a hard summer storm, the answer is almost always capacity, not cleaning.',
        warranty: 'Baked-enamel finish warranties commonly run 20+ years against chipping, peeling and fading.',
        bestFor: 'Large or steep roof planes, long runs, metal roofs, and any home with a history of overflow.',
      },
      {
        name: 'Color Matching',
        warrantyShort: '20+ yr finish',
        blurb:
          'A full range of baked-enamel aluminum colors — white, almond, clay, musket brown, royal brown, black, bronze, wicker, ivy green, terratone, pearl grey, and more — plus copper for historic and accent applications.',
        warranty: 'Finish warranty per coil manufacturer, typically 20+ years.',
        bestFor: 'Matching new siding, trim or a new roof exactly rather than "close enough".',
      },
      {
        name: 'Gutter Guards & Leaf Protection',
        warrantyShort: 'Up to lifetime clog-free',
        blurb:
          'Micro-mesh and reverse-curve guard systems sized to the gutter profile. Under the oak and maple canopy across the South Hills, guards are the difference between an annual chore and a system you can forget about.',
        warranty: 'Guard system warranties vary by manufacturer; most premium micro-mesh carries lifetime clog-free coverage.',
        bestFor: 'Homes with mature trees, steep roofs, or three-story runs nobody wants to ladder.',
      },
      {
        name: 'Downspouts & Underground Drainage',
        warrantyShort: '1 yr workmanship',
        blurb:
          '2×3 and 3×4 downspouts, kick-outs, splash blocks, and buried solid-wall drainage carrying discharge away from the foundation — often paired with our excavation crew on the same visit.',
        warranty: 'Covered under the same finish warranties; buried drainage carries a 1-year workmanship guarantee.',
        bestFor: 'Wet basements and eroded foundation beds — the actual cause is usually roof water discharge.',
      },
    ],
    process: [
      { title: 'Roof-area calculation', body: 'We size the system to the drainage area and roof pitch rather than defaulting to 5-inch everywhere. That is how we decide whether you need 6-inch.' },
      { title: 'Color match', body: 'Coil samples held against your fascia, trim and roof so the color is right in daylight.' },
      { title: 'On-site fabrication', body: 'Gutter is rolled on the driveway to the exact run length — seamless from corner to corner.' },
      { title: 'Installation', body: 'Hidden hangers into solid fascia, proper pitch to the outlets, sealed miters, downspouts and kick-outs.' },
      { title: 'Water test', body: 'We run water through the system and watch it drain before we call it done.' },
    ],
    faqs: [
      { q: 'Do I need 5-inch or 6-inch gutters?', a: 'Six-inch gutters carry roughly 40% more water and pair with larger 3×4 downspouts. If your roof is large or steep, your runs are long, you have a metal roof, or your current gutters overflow in heavy rain, 6-inch is the fix. For a typical roof, 5-inch is properly sized and costs less. We calculate the drainage area rather than guessing.' },
      { q: 'What does seamless actually mean?', a: 'The gutter is extruded from a coil of aluminum on a roll-forming machine on your driveway, in one continuous piece the full length of the run. Sectional gutter comes in ten-foot lengths joined by sealed connectors — and every one of those joints eventually leaks. The only seams in a seamless system are at inside and outside corners.' },
      { q: 'How much do seamless gutters cost?', a: 'Seamless 5-inch aluminum generally runs $8–$14 per linear foot installed; 6-inch runs $12–$20. A typical Pittsburgh home with 150–200 feet of gutter and downspouts lands in the $1,500–$3,500 range. Guards, fascia replacement and underground drainage are priced separately.' },
      { q: 'Are gutter guards worth it?', a: 'Under a mature tree canopy — which describes most of Bethel Park, Mt. Lebanon and Upper St. Clair — yes. Quality micro-mesh keeps out everything down to shingle grit while passing water at full flow. Cheap plastic screens are worse than nothing because they trap debris on top and hide the clog.' },
      { q: 'Can you replace rotted fascia at the same time?', a: 'Yes, and this is the right time to do it. The gutter has to come off anyway, and hidden hangers need solid wood to bite into. We replace rotted fascia board and wrap it in matching aluminum so it never rots again.' },
    ],
  },

  /* ────────────────────  SITE WORK & EXCAVATION  ─────────────────────── */
  {
    slug: 'excavation',
    name: 'Site Work & Excavation',
    navLabel: 'Excavation',
    singular: 'Site Work',
    icon: 'excavator',
    order: 7,
    featured: true,
    summary:
      'Top Dog Exteriors owns a new Bobcat T595 compact track loader and a Bobcat E35 mini excavator for grading, drainage, footings and demolition throughout Greater Pittsburgh. Both machines are also available for rent — bare, or with a 40-year-experienced operator.',
    cardBlurb:
      'Grading, drainage, footings and demolition with our new Bobcat T595 and E35 — plus machine rental, bare or with a 40-year operator.',
    heroHeadline: 'Our Iron. Our Operator. Your Site.',
    heroSub:
      'A new Bobcat T595 compact track loader and Bobcat E35 mini excavator for grading, drainage, footings, trenching and demolition. Need the machine but not the crew? Rent either one bare — or with an operator who has 40 years on the controls.',
    metaTitle: 'Excavation & Site Work Pittsburgh PA | Bobcat Rental',
    metaDescription:
      'Grading, drainage, footings and demolition in Greater Pittsburgh with a Bobcat T595 and E35 excavator. Machine-only rental, or with a 40-year operator.',
    edge:
      'We own the machines outright, so scheduling does not depend on a rental yard. And you can hire the iron by itself — with or without an operator carrying four decades of seat time.',
    highlights: [
      'We Own Our Equipment',
      'Bobcat T595 & E35',
      'Rental With or Without Operator',
      'PA One Call Before Every Dig',
    ],
    products: [
      {
        name: 'Bobcat T595 Compact Track Loader',
        warrantyShort: 'Dealer-maintained & insured',
        badge: 'Owned, not rented',
        blurb:
          '74 HP, 2,200 lb rated operating capacity, 8,055 lb operating weight, and just 5.1 psi ground pressure on rubber tracks — low enough to work across a finished lawn with far less damage than a wheeled machine. Attachment-ready for bucket, pallet forks, auger, grapple and breaker.',
        warranty: 'Late-model, company-owned and dealer-maintained. Fully insured on every job and every rental.',
        bestFor: 'Grading, backfill, material handling, demolition cleanup and hauling on soft or finished ground.',
      },
      {
        name: 'Bobcat E35 Mini Excavator',
        warrantyShort: 'Dealer-maintained & insured',
        badge: 'Owned, not rented',
        blurb:
          'Compact excavator with 10.2 ft standard digging depth (11.2 ft with the long arm), roughly 8,600 lb operating weight and a 5 ft 9 in width — narrow enough to fit between houses and through most gates in the South Hills.',
        warranty: 'Late-model, company-owned and dealer-maintained. Fully insured on every job and every rental.',
        bestFor: 'Footings, drainage trenches, utility runs, stump removal and tight-access digging.',
      },
      {
        name: 'Machine-Only Rental',
        warrantyShort: 'Inspected in and out',
        blurb:
          'Rent the T595 or the E35 bare. Daily, weekly and monthly rates, delivered to your site on our trailer. Operator qualification and proof of insurance required — we will walk you through exactly what we need.',
        warranty: 'Machines delivered fueled, greased and inspected, with a documented condition report at drop-off and pickup.',
        bestFor: 'Experienced contractors and property owners who run their own iron.',
      },
      {
        name: 'Machine + Operator',
        warrantyShort: 'Fully insured',
        badge: 'Most requested',
        blurb:
          'The machine with a 40-year-experienced operator on the sticks. Hourly, half-day and full-day rates. Forty years means grade is read by eye, utilities are respected, and finished work does not need to be redone.',
        warranty: 'Fully insured. Liability and workers’ compensation certificates provided before mobilization.',
        bestFor: 'Anyone who needs the work done right without owning the skill set.',
      },
      {
        name: 'Grading, Drainage & Demolition',
        warrantyShort: '1 yr workmanship',
        blurb:
          'Lot grading and finish grading, French drains and downspout burial, foundation drainage, driveway base prep, footing excavation, pad prep for sheds and additions, stump and shrub removal, and small structure demolition with haul-off.',
        warranty: 'Site work carries a 1-year workmanship guarantee against settlement and drainage failure.',
        bestFor: 'Wet yards, wet basements, new deck and addition footings, and anything that starts with moving dirt.',
      },
    ],
    process: [
      { title: 'Site walk', body: 'We walk the property, identify grade, discharge points and access constraints, and tell you what is actually causing the water problem.' },
      { title: 'PA One Call', body: 'Every dig gets a Pennsylvania One Call ticket. No exceptions — it is the law and it is how you avoid hitting a gas line.' },
      { title: 'Scope & rate', body: 'Fixed-price scope for site work, or a clear hourly/daily rate for rentals. Delivery, fuel and trailer time stated up front.' },
      { title: 'Execute', body: 'Track machine on the lawn, minimal disturbance, spoil hauled off or spread as agreed.' },
      { title: 'Restore', body: 'Finish grade, topsoil and seed or straw as specified. We leave the yard better than the hole we made in it.' },
    ],
    faqs: [
      { q: 'Can I rent just the Bobcat without an operator?', a: 'Yes. Both the T595 track loader and the E35 mini excavator are available bare on daily, weekly and monthly terms, delivered on our trailer. We do require operator qualification and proof of insurance before release — call us and we will tell you exactly what we need.' },
      { q: 'What does machine-with-operator cost?', a: 'Machine plus our 40-year operator is quoted hourly, half-day or full-day depending on the job, with delivery and trailer time stated up front. For most residential drainage, grading and footing work a half day or full day covers it. Call for current rates.' },
      { q: 'Will the machine tear up my lawn?', a: 'Far less than you would expect. The T595 rides on rubber tracks at about 5.1 psi ground pressure — lower than a person standing on one foot — which is precisely why we bought a track machine instead of a wheeled skid steer. On soft ground we also mat the travel path.' },
      { q: 'Will the excavator fit through my gate?', a: 'Usually. The E35 is 5 ft 9 in wide, which clears most standard South Hills side yards and gates. We measure access before scheduling so nobody discovers a problem the morning of.' },
      { q: 'My basement is wet. Is that an excavation job?', a: 'Often it is a gutter and downspout discharge job first, and an excavation job second — which is why we do both. We start by looking at where roof water actually goes. If it is dumping at the foundation, burying the discharge is cheaper and more effective than most interior solutions.' },
      { q: 'Do you call before you dig?', a: 'Always. Every excavation gets a Pennsylvania One Call ticket before a bucket touches the ground. It is legally required and it is the difference between a routine trench and a very bad afternoon.' },
    ],
  },

  /* ────────────────────────────  CONCRETE  ───────────────────────────── */
  {
    slug: 'concrete',
    name: 'Concrete & Flatwork',
    navLabel: 'Concrete',
    singular: 'Concrete',
    icon: 'concrete',
    order: 8,
    featured: true,
    summary:
      'Top Dog Exteriors pours driveways, sidewalks, patios, garage floors, steps and footings across the Greater Pittsburgh area, with our own excavation equipment handling base prep on the same job.',
    cardBlurb:
      'Driveways, patios, sidewalks, steps and footings — with our own excavator doing the base prep that decides whether concrete cracks.',
    heroHeadline: 'Concrete That Doesn’t Crack in Three Winters',
    heroSub:
      'Driveways, patios, sidewalks, garage floors, steps and footings. We own the excavation equipment, so the base under your slab gets prepped properly instead of being someone else’s problem.',
    metaTitle: 'Concrete Contractor Pittsburgh PA | Driveways & Patios',
    metaDescription:
      'Concrete driveways, patios, sidewalks, garage floors, steps and footings in Greater Pittsburgh. Proper base prep with our own excavation equipment.',
    edge:
      'Concrete fails from the bottom up. Because we own the Bobcat and the excavator, the sub-base gets excavated, graded and compacted to depth — not scraped and hoped for.',
    highlights: [
      'Proper Compacted Sub-Base',
      'Fiber & Rebar Reinforced',
      'Control Joints Cut on Time',
      'Freeze-Thaw Rated Mix',
    ],
    products: [
      {
        name: 'Driveways',
        warrantyShort: '1 yr workmanship',
        blurb:
          'Full tear-out, excavation to depth, compacted stone base, 4,000 PSI air-entrained mix with fiber and rebar or mesh as the application requires, and control joints cut at the right spacing while the slab is still green.',
        warranty: '1-year workmanship guarantee against installation defects. Air-entrained mix specified for Western PA freeze-thaw.',
        bestFor: 'Replacing cracked, heaved or settled driveways.',
      },
      {
        name: 'Patios & Walkways',
        warrantyShort: '1 yr workmanship',
        blurb:
          'Broom, exposed aggregate and stamped finishes, with integral or release-color options. Poured to drain away from the house, which is where a surprising number of basement water problems begin.',
        warranty: '1-year workmanship guarantee. Sealer recommended and available at pour.',
        bestFor: 'Outdoor living space, and the transition from a new deck down to grade.',
      },
      {
        name: 'Sidewalks, Steps & Stoops',
        warrantyShort: '1 yr workmanship',
        blurb:
          'Municipal-spec sidewalk replacement, poured steps with proper riser consistency, and stoops rebuilt with the right footing depth so they stop pulling away from the house.',
        warranty: '1-year workmanship guarantee. Built to municipal specification where applicable.',
        bestFor: 'Trip hazards, borough sidewalk citations, and settling front steps.',
      },
      {
        name: 'Garage Floors & Slabs',
        warrantyShort: '1 yr workmanship',
        blurb:
          'Slab-on-grade pours for garages, sheds, additions and equipment pads, with vapor barrier, insulation and thickened edges where the structure calls for it.',
        warranty: '1-year workmanship guarantee.',
        bestFor: 'New outbuildings and failed garage floors.',
      },
      {
        name: 'Footings & Foundations',
        warrantyShort: '1 yr workmanship',
        blurb:
          'Excavated and poured footings for decks, additions, porches and retaining walls — dug below the Western Pennsylvania frost line so nothing heaves.',
        warranty: '1-year workmanship guarantee. Inspected by the municipality before pour where required.',
        bestFor: 'Anything structural we or another builder is putting on top.',
      },
    ],
    process: [
      { title: 'Layout & drainage plan', body: 'We set elevations so water runs away from the house. This one decision matters more than the finish.' },
      { title: 'Excavate & compact', body: 'Our own machines dig to depth and compact the stone base in lifts. This is the step budget contractors skip.' },
      { title: 'Form & reinforce', body: 'Forms set to grade, rebar or mesh placed on chairs — not laid on the dirt and pulled up "later".' },
      { title: 'Pour & finish', body: 'Air-entrained mix specified for freeze-thaw, screeded, floated and finished to the specified texture.' },
      { title: 'Joint, cure & seal', body: 'Control joints cut on schedule, cure managed, and sealer applied when the slab is ready for it.' },
    ],
    faqs: [
      { q: 'How much does a concrete driveway cost in Pittsburgh?', a: 'Most residential concrete driveways run $8–$16 per square foot installed, depending on tear-out of the existing surface, excavation depth, reinforcement and finish. A typical two-car driveway lands between $6,000 and $14,000. Stamped and decorative finishes carry a premium.' },
      { q: 'Why does concrete crack?', a: 'Three reasons, in order: an inadequate or uncompacted sub-base, control joints cut too late or spaced too far apart, and the wrong mix for a freeze-thaw climate. All three are installation decisions, not bad luck. We address each one deliberately — which is exactly why we own our own excavation equipment.' },
      { q: 'When can I drive on a new driveway?', a: 'Foot traffic after 24–48 hours, passenger vehicles after 7 days, and heavy vehicles or trailers after 28 days when the concrete has reached full design strength. Parking a loaded truck on a 5-day-old slab is one of the most common ways homeowners crack their own driveway.' },
      { q: 'Should I seal my concrete?', a: 'In Western Pennsylvania, yes. Freeze-thaw cycling and road salt are the two things that shorten concrete life here, and a penetrating sealer meaningfully slows both. Plan on resealing every 2–3 years.' },
      { q: 'Can you do concrete and the deck or drainage at the same time?', a: 'Yes, and it usually saves money. The excavator is already on site, the grade is already open, and sequencing footings, drainage and flatwork on one mobilization avoids paying twice for the same setup.' },
    ],
  },

  /* ───────────────────────────  ADDITIONS  ───────────────────────────── */
  {
    slug: 'additions',
    name: 'Additions & Remodeling',
    navLabel: 'Additions',
    singular: 'Addition',
    icon: 'addition',
    order: 9,
    featured: true,
    summary:
      'Top Dog Exteriors builds room additions, garages, sunrooms, three-season rooms and dormers in the Greater Pittsburgh area — from footing excavation through roofing, siding and finish.',
    cardBlurb:
      'Room additions, garages, sunrooms and dormers built end to end — footings, framing, roof, siding and finish by one company.',
    heroHeadline: 'Additions Built Start to Finish by One Company',
    heroSub:
      'Room additions, garages, sunrooms, three-season rooms and dormers. We dig the footings, frame it, roof it, side it and finish it — so the new roofline actually matches the old one and nobody is pointing fingers.',
    metaTitle: 'Home Additions Pittsburgh PA | Garages, Sunrooms & Dormers',
    metaDescription:
      'Room additions, garages, sunrooms, three-season rooms and dormers in Greater Pittsburgh. Excavation through finish by one contractor. Free consultation.',
    edge:
      'Additions go wrong at the seams — where new roof meets old, where new siding meets weathered. Because we self-perform the excavation, roofing and siding, those seams are our responsibility alone.',
    highlights: [
      'Excavation Through Finish',
      'Permits & Inspections Handled',
      'Matched Roof & Siding Lines',
      'Licensed PA193451 & Insured',
    ],
    products: [
      {
        name: 'Room Additions',
        warrantyShort: '5 yr on roofing & siding',
        blurb:
          'Bump-outs, full-width rear additions, primary suite additions and second-story additions. Footings dug below frost line, framed to code, tied into the existing structure and roof plane properly.',
        warranty: 'Structural workmanship guaranteed; roofing and siding components carry their own 5-year workmanship warranties.',
        bestFor: 'Adding square footage without moving out of a neighborhood you like.',
      },
      {
        name: 'Garages & Outbuildings',
        warrantyShort: '5 yr on roofing & siding',
        blurb:
          'Detached and attached garages, workshops and storage buildings — slab, framing, roof, siding, doors and electrical rough-in coordination, all on one contract.',
        warranty: 'Roofing and siding carry the 5-year workmanship warranty; slab carries a 1-year guarantee.',
        bestFor: 'Vehicle storage, shop space, and adding real value to a property.',
      },
      {
        name: 'Sunrooms & Three-Season Rooms',
        warrantyShort: 'By component + workmanship',
        blurb:
          'Converting a deck or patio into enclosed living space, with glass, screen and knee-wall configurations, insulated roofs and matching exterior finishes.',
        warranty: 'Component warranties by manufacturer; installation covered by our workmanship guarantee.',
        bestFor: 'Getting several more usable months out of outdoor space in a Pittsburgh climate.',
      },
      {
        name: 'Dormers & Roofline Changes',
        warrantyShort: '5 yr workmanship',
        blurb:
          'Shed and gable dormers to open up attic space and add headroom and daylight, with the new roof and siding blended into the existing planes.',
        warranty: 'Covered by our 5-year roofing and siding workmanship warranty.',
        bestFor: 'Attic conversions and second-floor spaces that feel cramped.',
      },
      {
        name: 'Covered Porches & Pavilions',
        warrantyShort: '5 yr on roofing',
        blurb:
          'Roofed porches, pavilions and pergolas built on proper footings and tied into the house structure — not lag-bolted to the rim joist and hoped for.',
        warranty: 'Roofing covered by the 5-year workmanship warranty.',
        bestFor: 'Shade, weather protection, and dramatically extending deck season.',
      },
    ],
    process: [
      { title: 'Feasibility & budget', body: 'We walk the site, discuss what you want, and give you an honest budget range before anyone pays for drawings.' },
      { title: 'Design & permit', body: 'Plans drawn, zoning and setback confirmed, permit pulled with the municipality. Bethel Park, Mt. Lebanon and Peters Township each have their own process — we know them.' },
      { title: 'Excavation & footings', body: 'Our own machines dig and pour footings below frost line. Inspected before backfill.' },
      { title: 'Frame, roof, dry-in', body: 'Framed, sheathed, roofed and weather-tight as fast as possible so the existing house is never exposed.' },
      { title: 'Exterior & finish', body: 'Siding, trim, gutters, windows and doors matched to the existing home, then interior finish coordination through final inspection.' },
    ],
    faqs: [
      { q: 'How much does a home addition cost in Pittsburgh?', a: 'Additions in the Greater Pittsburgh area commonly run $180–$400 per square foot depending on whether plumbing is involved, foundation type, roof complexity and finish level. A simple bump-out is at the low end; a primary suite with a full bath sits at the high end. We give an honest range before you spend money on drawings.' },
      { q: 'Do you handle permits and inspections?', a: 'Yes. We pull the permit, schedule the inspections and meet the inspector. Every municipality we serve handles setbacks, footing inspections and framing sign-off a little differently, and knowing that in advance is most of the job.' },
      { q: 'How long does an addition take?', a: 'Most residential additions run 8–16 weeks from footings to final inspection, with permitting adding 2–8 weeks in front of that depending on the municipality. Weather and material lead times are the two variables we cannot fully control, and we tell you where the risk is instead of promising a date we cannot hold.' },
      { q: 'Will the new roof and siding match my existing house?', a: 'This is the hardest part of any addition, and it is why we self-perform the roofing and siding. On an older home with weathered siding, an exact match is sometimes impossible — in which case we will tell you honestly and propose a design solution, like re-siding one full elevation to a natural break line, rather than delivering a patch that looks like a patch.' },
    ],
  },

  /* ────────────────────────────  PAINTING  ───────────────────────────── */
  {
    slug: 'painting',
    name: 'Exterior Painting',
    navLabel: 'Painting',
    singular: 'Painting',
    icon: 'paint',
    order: 10,
    featured: false,
    summary:
      'Top Dog Exteriors provides exterior painting and staining in the Greater Pittsburgh area — house body and trim, decks and railings, doors and shutters, with proper prep and premium coatings.',
    cardBlurb: 'Exterior body, trim, deck and door painting and staining — prepped properly so the coating actually lasts.',
    heroHeadline: 'Exterior Painting That Lasts More Than Two Seasons',
    heroSub:
      'House body and trim, decks and railings, doors and shutters. Ninety percent of a paint job’s life is decided before the first coat goes on, so that is where we spend the time.',
    metaTitle: 'Exterior Painting Pittsburgh PA | House, Trim & Deck Staining',
    metaDescription:
      'Exterior house painting, trim, deck staining and door refinishing in Bethel Park and Greater Pittsburgh. Proper prep, premium coatings, free estimate.',
    edge:
      'We prep like the coating matters: wash, scrape, sand, prime bare wood, caulk the joints, then paint. Anyone can spray a house. Making it still look right in year six is the trick.',
    highlights: ['Full Prep & Priming', 'Premium Coatings', 'Deck & Railing Staining', 'Clean, Protected Job Site'],
    products: [
      { name: 'House Body & Trim', warrantyShort: '2 yr workmanship', blurb: 'Pressure wash, scrape, sand, spot-prime bare wood, caulk joints, then two finish coats of premium exterior acrylic.', warranty: 'Workmanship guaranteed for 2 years against peeling and blistering on properly prepped substrate.', bestFor: 'Wood, fiber cement and previously painted aluminum siding.' },
      { name: 'Deck & Railing Staining', warrantyShort: '1 yr workmanship', blurb: 'Cleaning, brightening, sanding as needed, and semi-transparent or solid stain applied at the right spread rate.', warranty: 'Workmanship guaranteed for 1 year; horizontal surfaces wear faster than vertical by nature.', bestFor: 'Pressure-treated and cedar decks that are not ready for composite replacement.' },
      { name: 'Doors, Shutters & Accents', warrantyShort: '2 yr workmanship', blurb: 'Front door refinishing, shutter painting and accent color work — often the highest-impact, lowest-cost curb appeal change available.', warranty: '2-year workmanship guarantee.', bestFor: 'A fast, dramatic facelift before listing a house.' },
    ],
    process: [
      { title: 'Surface assessment', body: 'We identify failing coatings, rot and moisture sources. Painting over a water problem just hides it for a year.' },
      { title: 'Wash & prep', body: 'Pressure wash, scrape, sand, prime bare wood, replace failed caulk.' },
      { title: 'Protect', body: 'Landscaping, windows, walkways and roofs masked and covered before anything is opened.' },
      { title: 'Coat', body: 'Two finish coats of premium exterior acrylic applied at the manufacturer-specified spread rate.' },
      { title: 'Walkthrough', body: 'We walk the whole house with you and touch up anything you point at.' },
    ],
    faqs: [
      { q: 'How much does it cost to paint a house exterior in Pittsburgh?', a: 'Most homes run $4,000–$12,000 depending on square footage, number of stories, siding condition and how much prep and carpentry repair is required. Prep is the variable — a house with widespread peeling and rotted trim costs substantially more than one that is simply faded.' },
      { q: 'Should I paint or replace my siding?', a: 'Honest answer: if your wood or fiber cement siding is structurally sound, paint is far cheaper and buys 7–10 years. If it is rotting, cracking, or you are already on your third repaint, replacement usually costs less per year of service — and modern composite and factory-finished products never need painting at all. We will price both.' },
      { q: 'When is the best time to paint in Western Pennsylvania?', a: 'Late spring through early fall, when overnight temperatures stay reliably above 50°F and humidity is moderate. We do not paint into a cold snap or ahead of rain just to keep a schedule — the coating will not cure properly and you will see it within two years.' },
    ],
  },
];

/** Kebab-case slug for a product, derived from its name unless one is set. */
export const productSlug = (p: Product) =>
  p.slug ??
  p.name
    .toLowerCase()
    .replace(/[®™]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Every product across every service, paired with its parent. */
export const allProducts = services.flatMap((service) =>
  service.products.map((product) => ({ service, product, slug: productSlug(product) }))
);

export const getProduct = (serviceSlug: string, slug: string) =>
  allProducts.find((e) => e.service.slug === serviceSlug && e.slug === slug);

export const featuredServices = services.filter((s) => s.featured).sort((a, b) => a.order - b.order);
export const allServices = [...services].sort((a, b) => a.order - b.order);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
