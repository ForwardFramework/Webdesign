/**
 * Services — one entry per service page under /services/<slug>/.
 * Add, remove or reorder freely; navigation, the services grid, the sitemap,
 * the quote-form dropdown and the Service structured data all follow this list.
 */

export const services = [
  {
    slug: 'concrete-driveways',
    name: 'Concrete Driveways',
    short: 'Driveways',
    icon: 'driveway',
    featured: true,
    teaser:
      'Tear-out, grading, stone base and a properly jointed 4,000 PSI pour that handles Pennsylvania freeze-thaw and every delivery truck that turns in.',
    metaTitle: 'Concrete Driveway Contractor in Western PA',
    metaDescription:
      'New concrete driveways, replacements and extensions across Western PA. Proper stone base, reinforced 4,000 PSI mix, correct jointing. Free estimates.',
    h1: 'Concrete Driveways Built on a Base That Holds',
    lede:
      'A driveway fails from the bottom up. Booth’s Contracting excavates to solid ground, compacts a proper stone base and pours reinforced concrete at the right thickness and slope — so the surface you pay for is still flat and crack-controlled a decade from now.',
    answer:
      'Booth’s Contracting installs and replaces residential and commercial concrete driveways throughout Western Pennsylvania. A standard residential driveway is poured 4 inches thick over 4–6 inches of compacted stone; drives that carry RVs, trucks or dumpsters are stepped up to 5–6 inches with fiber or rebar reinforcement. Most single driveways are demolished, prepped and poured in two to four working days, and are ready for foot traffic in 24–48 hours and vehicles in about seven days.',
    bullets: [
      'New driveway installation, full replacement and extensions',
      'Tear-out and haul-away of old concrete or blacktop',
      'Compacted stone base with proper pitch for drainage',
      '4,000 PSI air-entrained mix rated for freeze-thaw',
      'Fiber mesh or rebar reinforcement where the load calls for it',
      'Saw-cut control joints placed so cracks land where they should',
      'Broom, brushed-edge, exposed aggregate and stamped finishes',
      'Aprons, turnarounds, parking pads and culvert work',
    ],
    sections: [
      {
        h: 'What goes under the concrete matters more than the concrete',
        p: 'Most failed driveways in this part of the state were poured over soft ground or dirt that was never compacted. We dig out the old surface and any unsuitable soil, bring in clean 2A limestone, and compact it in lifts with a plate or roller until it is dense enough to walk on without leaving a print. That base does two jobs: it spreads the load, and it lets water move out from under the slab instead of sitting there and heaving it every January.',
      },
      {
        h: 'Thickness, mix and reinforcement, chosen for the load',
        p: 'A car-only driveway does fine at 4 inches. If a work truck, a camper, a boat trailer or a concrete truck is going to park on it, we pour 5 to 6 inches and add reinforcement. Every exterior pour uses an air-entrained mix — the microscopic air bubbles give freezing water somewhere to expand, which is the single biggest reason a slab survives Western PA winters instead of scaling apart in year three.',
      },
      {
        h: 'Jointing and drainage: where cracks are decided',
        p: 'Concrete cracks. The craft is deciding where. We saw control joints in within the first day, spaced roughly two to three times the slab thickness in feet, so shrinkage relieves itself in a straight tooled line instead of a jagged one across the middle of your driveway. Slope is set at the same time — typically 1/8 to 1/4 inch of fall per foot away from the garage and foundation so meltwater leaves rather than pools.',
      },
      {
        h: 'Finishes that suit the site',
        p: 'A medium broom finish is the workhorse: grippy when wet, easy to shovel, easy to seal. Where a driveway is the first thing you see from the road, a brushed field with a smooth troweled border sharpens the whole front of the house. Exposed aggregate and stamped borders are available when the budget allows for a more finished look.',
      },
    ],
    process: [
      ['Layout & demo', 'Mark utilities, set the footprint, remove the old surface and haul it off.'],
      ['Excavate & grade', 'Dig to depth, cut out soft spots, set the pitch for drainage.'],
      ['Base & forms', 'Place and compact stone, set and level forms, position reinforcement.'],
      ['Pour & finish', 'Place the mix, screed, float and finish to the surface you chose.'],
      ['Joint & cure', 'Saw control joints, apply cure, walk the job with you before we leave.'],
    ],
    faqs: [
      {
        q: 'How much does a concrete driveway cost in Western Pennsylvania?',
        a: 'Most residential concrete driveways in our area land between $8 and $16 per square foot installed. The spread comes from thickness, whether an old driveway has to be demolished and hauled away, how much excavation and stone the site needs, and the finish. A typical two-car driveway of about 600 square feet therefore runs roughly $5,000 to $9,500. We give a fixed written price after walking the site — no square-foot guessing over the phone.',
      },
      {
        q: 'How long before I can drive on a new concrete driveway?',
        a: 'Foot traffic after 24 to 48 hours, passenger vehicles after about 7 days, and heavy trucks, campers or dumpsters after 28 days once the concrete has reached full design strength. Driving on it too early is one of the few ways a correctly built driveway can still be ruined.',
      },
      {
        q: 'Is concrete or asphalt better for a driveway here?',
        a: 'Concrete costs more up front and lasts materially longer — 30 or more years against roughly 15 to 20 for asphalt — and it does not soften in July or need resealing every few years. Asphalt is cheaper to install and more forgiving on steep or shifting ground. For most Western PA homes that plan to stay put, concrete is the better lifetime value.',
      },
      {
        q: 'Can you pour over my existing driveway?',
        a: 'Usually not, and we will tell you so. An overlay inherits every crack and soft spot underneath, and it raises the surface at the garage door and the road. Replacement costs more once and solves it; an overlay costs less once and fails twice.',
      },
      {
        q: 'What time of year can concrete be poured in Pennsylvania?',
        a: 'We pour from early spring through late fall, and into colder weather using heated mix, blankets and accelerators when the schedule calls for it. Fall is genuinely a good time to book — ground conditions are dry, the schedule is predictable, and the slab has all winter to cure before it sees real load.',
      },
    ],
    related: ['concrete-patios', 'excavation-site-prep', 'concrete-steps-porches'],
  },

  {
    slug: 'concrete-patios',
    name: 'Concrete Patios',
    short: 'Patios',
    icon: 'patio',
    featured: true,
    teaser:
      'Poured, stamped and finished patios sized around how you actually use the yard — fire pit, grill run, table clearance and a slope that sheds water away from the house.',
    metaTitle: 'Concrete Patio Installation in Western PA',
    metaDescription:
      'Custom concrete and stamped patios, fire pit and seating areas across Western Pennsylvania. Free design consultation and on-site estimate.',
    h1: 'Concrete Patios Designed Around How You Use the Yard',
    lede:
      'A patio that is two feet too small gets used once a summer. We start with furniture, foot traffic and the grill — then build the slab around that, with the drainage and jointing that keep it flat.',
    answer:
      'Booth’s Contracting designs and pours custom concrete patios across Western Pennsylvania, from simple broom-finished slabs to stamped and colored decorative work with integrated fire pit pads, seating walls and steps. Most patios are poured 4 inches thick over compacted stone, pitched away from the house, and finished in two to four working days. Expect roughly $10 to $22 per square foot depending on the finish.',
    bullets: [
      'Custom-shaped patios, curved and multi-level layouts',
      'Stamped concrete in slate, ashlar, wood-plank and stone patterns',
      'Integral color, release color and decorative borders',
      'Broom, smooth-trowel, salt and exposed aggregate finishes',
      'Fire pit pads, grill and kitchen pads, hot tub pads',
      'Steps, landings and seating-wall footers tied into the slab',
      'Patio extensions and full replacement of failed slabs',
      'Sealing and long-term maintenance guidance',
    ],
    sections: [
      {
        h: 'Size it for furniture, not for the tape measure',
        p: 'The most common regret we hear is size. A round table with four chairs needs roughly a 12-foot circle to push back from without hitting the grass. A sectional plus a fire pit wants 16 to 18 feet of depth. Before anything is formed we lay the footprint out on the ground so you can walk it, set a chair in it and see the real thing — changing a line at that stage is free.',
      },
      {
        h: 'Stamped concrete, done so it still looks right in ten years',
        p: 'Stamped work lives or dies on three details: color that is integral to the mix rather than only on top, stamps set before the slab flashes off, and joints cut into the pattern instead of across it. Done properly, stamped concrete gives the look of flagstone or pavers with none of the settling, weeding or re-leveling that comes with individual units.',
      },
      {
        h: 'Water moves away from the house. Always.',
        p: 'A patio against a foundation is a giant funnel if it is pitched wrong. We set a minimum of 1/8 inch of fall per foot away from the structure, keep the finished surface below the siding line and below any door threshold, and tie into existing downspout and drainage runs where needed. On tight lots we will add a trench drain rather than let water find its own way.',
      },
      {
        h: 'Sealing and upkeep',
        p: 'Decorative patios should be sealed on a two to three year cycle to hold the color and shed de-icers; a plain broom finish can go longer. Skip the rock salt, use calcium magnesium acetate in winter, and a concrete patio in this climate needs essentially nothing else.',
      },
    ],
    process: [
      ['Walk & design', 'Lay the footprint out on the ground, settle size, shape and finish.'],
      ['Excavate & base', 'Strip topsoil, compact stone, establish pitch away from the house.'],
      ['Form & reinforce', 'Set forms to the layout, place mesh or fiber reinforcement.'],
      ['Pour & finish', 'Place, float, then stamp, broom or trowel to the chosen finish.'],
      ['Joint, cure & seal', 'Cut joints into the pattern, cure, and seal decorative work.'],
    ],
    faqs: [
      {
        q: 'How much does a concrete patio cost?',
        a: 'A standard broom-finished patio runs about $10 to $14 per square foot installed. Stamped and colored decorative patios run roughly $16 to $22 per square foot. A 16x20 stamped patio — 320 square feet — therefore lands near $5,000 to $7,000. Steps, seating walls and fire pit pads are priced separately.',
      },
      {
        q: 'Is a stamped concrete patio better than pavers?',
        a: 'For most yards, yes. Stamped concrete is one continuous slab, so there are no joints for weeds to grow in, no individual units to settle out of level, and nothing to re-sand every season. Pavers win when you need a surface that can be lifted and reset — over a utility run, for example — or when you want the ability to swap a damaged section.',
      },
      {
        q: 'How long does a patio installation take?',
        a: 'Most residential patios take two to four working days on site: one for demo and excavation, one for base and forms, one for the pour and finish. Stamped work adds a day. You can walk on it after 24 to 48 hours and put furniture on it after about a week.',
      },
      {
        q: 'Will my patio crack?',
        a: 'Every concrete slab develops shrinkage stress; the control joints we cut give it a straight, planned place to relieve itself. A patio built on compacted stone with correct joint spacing and an air-entrained mix should never develop the random structural cracking you see on slabs poured over dirt.',
      },
    ],
    related: ['concrete-steps-porches', 'landscaping', 'concrete-pads'],
  },

  {
    slug: 'sidewalks-walkways',
    name: 'Sidewalks & Walkways',
    short: 'Sidewalks',
    icon: 'sidewalk',
    featured: true,
    teaser:
      'Level, safe, code-compliant walks from the drive to the door — replacing the trip hazards and settled slabs that make a good house look tired.',
    metaTitle: 'Concrete Sidewalks & Walkways, Western PA',
    metaDescription:
      'New sidewalks, walkway replacement and trip-hazard repair for homes and businesses in Western PA. ADA-compliant commercial walks available.',
    h1: 'Sidewalks & Walkways That Are Level, Safe and Straight',
    lede:
      'A heaved sidewalk is both a liability and the first thing every visitor notices. We remove the failed sections, fix the reason they failed, and pour a walk that sits flat.',
    answer:
      'Booth’s Contracting pours new concrete sidewalks and replaces settled or heaved walkways for homes, businesses and municipalities across Western Pennsylvania. Residential walks are typically 4 feet wide and 4 inches thick over compacted stone; commercial and public walks are built to local and ADA specifications including width, cross-slope and detectable warning surfaces. Most residential walkways are completed in one to two days at roughly $9 to $15 per square foot.',
    bullets: [
      'New front walks, side walks and garden paths',
      'Replacement of cracked, settled or heaved sections',
      'Trip-hazard removal and municipal notice compliance',
      'ADA-compliant commercial walks, ramps and landings',
      'Curved and stamped-border decorative walkways',
      'Tie-ins to steps, porches, driveways and public sidewalks',
      'Root removal and base correction so it does not heave again',
      'Handrail and lighting sleeve installation during the pour',
    ],
    sections: [
      {
        h: 'Fix the cause, not just the slab',
        p: 'Walks heave for a reason — a tree root, a downspout dumping under the slab, or a base that was never there. Replacing the concrete without dealing with the cause buys you a few years at best. We cut roots back properly, correct the drainage, and rebuild the base before anything gets poured.',
      },
      {
        h: 'Width and layout people actually use',
        p: 'Four feet is the comfortable minimum for a front walk — it lets two people walk side by side and gives a wheelchair or stroller room to turn. Three-foot walks feel cramped and get worn shortcuts in the grass beside them. Where the walk meets the driveway or the steps we match elevations exactly so there is no lip to catch a toe.',
      },
      {
        h: 'Commercial and municipal specifications',
        p: 'Public and commercial walks carry rules: maximum 2% cross-slope, 5% running slope before a ramp is required, defined landing dimensions, and detectable warning panels at curb ramps. We build to the governing municipal spec and PennDOT details where they apply, and we handle the permit and inspection sequence.',
      },
    ],
    process: [
      ['Assess', 'Identify why the existing walk failed and what has to change.'],
      ['Demo & haul', 'Remove failed sections and take the debris with us.'],
      ['Base & forms', 'Cut roots, correct drainage, compact stone, set forms to grade.'],
      ['Pour & finish', 'Place concrete, broom finish, tool the edges and joints.'],
      ['Restore', 'Backfill, rake and seed the edges so the lawn closes back in.'],
    ],
    faqs: [
      {
        q: 'How much does it cost to replace a sidewalk?',
        a: 'Residential sidewalk replacement generally runs $9 to $15 per square foot including demolition and haul-away. A typical 4-foot by 30-foot front walk — 120 square feet — lands around $1,100 to $1,800. Sections replaced individually cost more per foot than a full run because of mobilization.',
      },
      {
        q: 'My township sent a sidewalk violation notice. Can you handle it?',
        a: 'Yes. Bring us the notice and we will price the work to the municipality’s specification, pull the permit where one is required, and schedule the inspection. Most notices carry a compliance deadline, so call as soon as one arrives rather than close to the date.',
      },
      {
        q: 'Can you fix just the raised section instead of the whole walk?',
        a: 'Often, yes. Isolated heaved panels can be cut out and replaced, which is the economical fix when the rest of the run is sound. When more than about a third of the panels have failed, a full replacement usually costs less per square foot and gives a uniform result.',
      },
    ],
    related: ['concrete-steps-porches', 'concrete-driveways', 'landscaping'],
  },

  {
    slug: 'concrete-steps-porches',
    name: 'Steps & Porches',
    short: 'Steps & Porches',
    icon: 'steps',
    featured: true,
    teaser:
      'Poured steps, landings and porch slabs with even risers, proper footers below frost line and a finish that grips when it is wet.',
    metaTitle: 'Concrete Steps & Porches in Western PA',
    metaDescription:
      'New concrete steps, porches and landings plus repair of crumbling stairs across Western PA. Frost-depth footers, even risers, non-slip finishes.',
    h1: 'Concrete Steps & Porches That Sit Where You Put Them',
    lede:
      'Steps are the most-used concrete on the property and the most often built wrong. Even risers, footers below the frost line, and a surface with traction — those three things are the whole job.',
    answer:
      'Booth’s Contracting builds and replaces poured concrete steps, porches and landings across Western Pennsylvania. Steps are set on footers dug below the local 36-inch frost depth and tied to the structure so they cannot separate or settle; risers are kept uniform within the 3/8-inch code tolerance and treads are finished with a non-slip broom texture. A typical set of front steps takes two to three days and runs $1,800 to $4,500 depending on height and width.',
    bullets: [
      'New poured steps, landings and full porch slabs',
      'Replacement of settled, separated or crumbling stairs',
      'Footers dug below the 36-inch frost line and tied to the structure',
      'Uniform riser heights and code-compliant tread depths',
      'Non-slip broom and textured finishes for winter footing',
      'Railing post sleeves set during the pour, not drilled later',
      'Brick, stone and stamped-face decorative options',
      'Step and porch resurfacing where the structure is still sound',
    ],
    sections: [
      {
        h: 'Footers below frost, every time',
        p: 'The classic failure you see all over Western PA is a set of steps pulling away from the house and tipping forward. That happens when the steps sit on grade or on backfill instead of on footers carried below frost depth — roughly 36 inches here. Frost gets under them, lifts them, and they never go back. We dig to undisturbed ground below frost and tie into the foundation so the steps and the house move as one thing, which is to say not at all.',
      },
      {
        h: 'Risers that are all the same height',
        p: 'People climb stairs by muscle memory. A riser that is even half an inch off from its neighbors is what trips someone carrying groceries. Code allows 3/8 inch of variation across a flight; we lay out risers to split the total rise evenly before a single form goes up, including the step down onto the walk.',
      },
      {
        h: 'Traction, drainage and railings',
        p: 'Treads get a broom finish across the direction of travel for grip, and a slight forward pitch so water and melt run off rather than freeze in place. If a railing is going on — and above three risers, code says it is — we set the post sleeves in the wet concrete rather than core-drilling later, which keeps the tread intact and the post solid.',
      },
    ],
    process: [
      ['Measure & lay out', 'Establish total rise, divide risers evenly, confirm landing size.'],
      ['Excavate footers', 'Dig below frost depth to undisturbed ground, tie into the foundation.'],
      ['Form & reinforce', 'Build forms, place rebar, set railing sleeves and any masonry face.'],
      ['Pour & finish', 'Place concrete, strip forms on schedule, broom-finish the treads.'],
      ['Cure & detail', 'Cure, patch form marks, backfill and clean up the entry.'],
    ],
    faqs: [
      {
        q: 'How much do new concrete steps cost?',
        a: 'A standard set of three to five front steps with a landing generally runs $1,800 to $4,500 installed, including demolition of the old set, footers below frost line, forming and finishing. Wider porches, taller flights, wing walls and decorative faces move the number up from there.',
      },
      {
        q: 'Why are my steps pulling away from the house?',
        a: 'Almost always because they were poured on grade or on loose backfill instead of on footers below the frost line. Water freezes under them, lifts them, thaws, and they settle back slightly out of position — a little more every winter. Patching the gap does nothing; the fix is to rebuild on proper footers.',
      },
      {
        q: 'Can crumbling steps be resurfaced instead of replaced?',
        a: 'If the structure underneath is solid and only the surface has scaled, resurfacing with a polymer-modified overlay is a legitimate and much cheaper fix. If the steps have moved, cracked through, or lost corners, resurfacing only hides the problem — we will tell you honestly which situation you are in.',
      },
      {
        q: 'Do I need a railing on my steps?',
        a: 'Pennsylvania’s adopted residential code requires a handrail on any flight with four or more risers, and a guard where a porch or landing sits more than 30 inches above grade. We set railing sleeves during the pour so a railing can be added cleanly whenever you are ready.',
      },
    ],
    related: ['sidewalks-walkways', 'concrete-patios', 'concrete-driveways'],
  },

  {
    slug: 'concrete-pads',
    name: 'Concrete Pads',
    short: 'Pads',
    icon: 'pad',
    featured: true,
    teaser:
      'Shed, garage, pool, hot tub and equipment pads engineered for the load that is going on them — level, square and ready on delivery day.',
    metaTitle: 'Shed, Garage & Pool Concrete Pads',
    metaDescription:
      'Concrete pads for sheds, garages, pools, hot tubs and equipment across Western PA. Engineered thickness, level and square for delivery day.',
    h1: 'Concrete Pads for Sheds, Garages, Pools & Equipment',
    lede:
      'A pad has one job: be dead level, exactly square, the right thickness, and finished before the delivery truck shows up. We schedule backwards from your delivery date.',
    answer:
      'Booth’s Contracting pours concrete pads for sheds, detached garages, above-ground and in-ground pools, hot tubs, generators, dumpsters and equipment across Western Pennsylvania. Thickness is matched to the load — 4 inches for sheds and pools, 5 to 6 inches with rebar and thickened edges or footers for garages and heavy equipment — and every pad is finished level, square and with anchor placement confirmed against the manufacturer’s drawings before the pour.',
    bullets: [
      'Shed and outbuilding pads sized to the manufacturer’s footprint',
      'Detached garage slabs with thickened edges or monolithic footers',
      'Above-ground pool pads and in-ground pool decks',
      'Hot tub pads engineered for filled weight, not dry weight',
      'Generator, HVAC and mini-split equipment pads',
      'Dumpster, trash enclosure and loading pads for commercial sites',
      'Anchor bolts, sleeves and conduit set before the pour',
      'Grading and drainage so the pad is not sitting in a puddle',
    ],
    sections: [
      {
        h: 'Thickness follows the load, not a rule of thumb',
        p: 'A 10x12 shed and a 24x24 garage are different structures and should not be poured the same way. Sheds and pools do fine on 4 inches over compacted stone. A garage needs 5 to 6 inches with rebar and either a thickened perimeter edge or a full footer below frost, because the walls carry a roof load down to a line rather than spreading it over the slab. Hot tubs are the one people underestimate most — a filled six-person tub with occupants can exceed 5,000 pounds sitting on a footprint smaller than a parking space.',
      },
      {
        h: 'Square, level, and sized to the actual building',
        p: 'We build to the manufacturer’s pad specification, not the advertised shed size, because the two rarely match. Diagonals get measured before the forms are locked, anchor bolt and conduit locations are confirmed against the drawings, and the surface is finished flat so a wall plate sits tight without shimming.',
      },
      {
        h: 'Scheduled around your delivery date',
        p: 'Nothing is more frustrating than a shed on a truck and a pad that is not ready. Tell us the delivery date and we schedule backwards from it, leaving the cure time the load needs — typically seven days before a building goes on, 28 before anything heavy.',
      },
    ],
    process: [
      ['Confirm specs', 'Pull the manufacturer pad drawing, confirm size, anchors and load.'],
      ['Excavate & base', 'Strip to solid ground, place and compact stone, set drainage.'],
      ['Form & reinforce', 'Form square to the diagonals, place rebar, footers and sleeves.'],
      ['Pour & finish', 'Place, screed dead level, float and finish to the required texture.'],
      ['Cure to delivery', 'Cure and hand over ready for the delivery date on your calendar.'],
    ],
    faqs: [
      {
        q: 'How much does a shed pad cost?',
        a: 'A typical 10x12 shed pad runs roughly $900 to $1,600 installed, and a 12x20 runs about $1,800 to $3,000. Price moves with excavation depth, how much stone the site needs, access for the truck, and whether the ground has to be built up or cut down to level.',
      },
      {
        q: 'How thick should a concrete pad be for a garage?',
        a: 'Five to six inches with rebar reinforcement, plus either a thickened perimeter edge or a footer carried below the frost line, depending on whether the structure is a pole building or a stick-framed garage on a foundation. Four inches is not enough under garage walls or under a vehicle lift.',
      },
      {
        q: 'Does a hot tub need a concrete pad?',
        a: 'Yes, and it should be poured for the filled weight. A filled hot tub with people in it commonly reaches 4,000 to 6,000 pounds. Four inches of reinforced concrete over compacted stone, level within a quarter inch across the tub, is the standard we build to — pavers and gravel beds settle unevenly and can twist a shell.',
      },
      {
        q: 'How long before I can set my shed or tub on the pad?',
        a: 'Seven days for a shed or an empty above-ground pool. Twenty-eight days before anything at full design load — a filled hot tub, a vehicle, or heavy equipment — since that is when the concrete reaches its rated strength.',
      },
    ],
    related: ['excavation-site-prep', 'concrete-driveways', 'concrete-patios'],
  },

  {
    slug: 'excavation-site-prep',
    name: 'Excavation & Site Prep',
    short: 'Excavation',
    icon: 'excavation',
    featured: true,
    teaser:
      'Digging, grading, drainage correction and haul-off — the unglamorous work that decides whether everything built on top of it lasts.',
    metaTitle: 'Excavation & Site Prep in Western PA',
    metaDescription:
      'Excavation, grading, drainage correction, footers, trenching and demolition across Western PA. Licensed, insured and PA One Call compliant.',
    h1: 'Excavation, Grading & Site Preparation',
    lede:
      'Every concrete failure we get called to fix started underground. We do the dirt work properly — dig, compact, drain, grade — whether we are pouring on top of it or another trade is.',
    answer:
      'Booth’s Contracting provides excavation and site preparation across Western Pennsylvania: building pad and footer excavation, rough and finish grading, drainage correction, French drains, trenching for utilities, driveway and lot prep, pond and swale work, land clearing and demolition with haul-off. Every dig starts with a PA One Call ticket, and all work is performed by licensed, insured operators.',
    bullets: [
      'Building pad, footer and foundation excavation',
      'Rough grading, finish grading and lot leveling',
      'Drainage correction, French drains, swales and downspout runs',
      'Driveway, parking lot and access-road preparation',
      'Utility trenching for water, electric, gas and conduit',
      'Land clearing, brush removal and stump grinding',
      'Demolition of slabs, structures and outbuildings with haul-off',
      'Topsoil, stone, fill delivery, placement and compaction',
      'Erosion and sediment control to the county conservation district spec',
    ],
    sections: [
      {
        h: 'Water is the whole problem',
        p: 'Nine out of ten yards we are called to fix have a water path problem, not a soil problem — a downspout discharging next to the foundation, a grade that pitches toward the house, a low spot with nowhere to go. We read the site, establish where the water is trying to travel, and build a grade and drainage system that takes it there on purpose. Positive slope away from the structure is the cheapest foundation insurance there is.',
      },
      {
        h: 'Compaction is not optional',
        p: 'Fill that is dumped and spread will settle for years. Fill that is placed in lifts and compacted is finished settling before we leave. We place in controlled lifts and compact each one, which is the difference between a pad that stays flat and a pad that develops a low corner the second winter.',
      },
      {
        h: 'Called before we dig, every single time',
        p: 'Pennsylvania law requires a PA One Call ticket at 811 before excavation, and we file one on every job without exception — including small ones. Hitting a gas line or a fiber run is a very expensive way to save two days, and the ticket is free.',
      },
    ],
    process: [
      ['Site walk & survey', 'Read the grade, find the water, identify access and spoil options.'],
      ['One Call & permits', 'File the 811 ticket, pull permits and E&S approvals as required.'],
      ['Clear & excavate', 'Strip topsoil, clear, dig to line and grade with GPS or laser control.'],
      ['Backfill & compact', 'Place fill in lifts, compact, install drainage and stone.'],
      ['Final grade & restore', 'Finish grade, spread topsoil, seed and straw the disturbed areas.'],
    ],
    faqs: [
      {
        q: 'Do I need a permit for excavation or grading?',
        a: 'It depends on the municipality and the scale. Moving earth close to a property line, altering drainage, disturbing an acre or more, or working near a stream or wetland typically triggers a permit and an erosion and sediment control plan through the county conservation district. We identify what is needed during the estimate and handle the filings.',
      },
      {
        q: 'How much does excavation cost?',
        a: 'Most residential excavation and grading work is priced by the day or by the job rather than by the yard, and typically lands between $1,200 and $2,500 per machine day with an operator. Haul-off, imported stone and fill, and disposal fees are quoted separately because they depend entirely on distance and material.',
      },
      {
        q: 'Can you fix a yard that floods every spring?',
        a: 'Usually, yes. The fix is nearly always a combination of regrading to create positive fall away from the structure, a French drain or swale to intercept water moving toward the low point, and extending downspouts far enough out that they stop recharging the same spot. We diagnose it on site rather than selling a drain before we know whether one is the answer.',
      },
      {
        q: 'Do you call 811 before digging?',
        a: 'Always. PA One Call is required by state law before any excavation, and we file the ticket and wait out the mark-out window on every job regardless of size.',
      },
    ],
    related: ['concrete-driveways', 'concrete-pads', 'landscaping'],
  },

  {
    slug: 'landscaping',
    name: 'Landscaping & Hardscaping',
    short: 'Landscaping',
    icon: 'landscape',
    featured: true,
    teaser:
      'Retaining walls, beds, walls, stone and grading that make the concrete look like it belongs — finished properly instead of left as bare dirt.',
    metaTitle: 'Landscaping & Hardscaping in Western PA',
    metaDescription:
      'Retaining walls, paver walkways, mulch beds, boulder work, drainage and grading across Western PA. One crew for concrete, excavation and landscaping.',
    h1: 'Landscaping & Hardscaping That Finishes the Job',
    lede:
      'Concrete, dirt work and landscaping are the same job broken into three invoices by most contractors. We do all three, which means no one is waiting on anyone and nothing gets left as bare mud.',
    answer:
      'Booth’s Contracting provides landscaping and hardscaping across Western Pennsylvania including segmental and boulder retaining walls, paver walkways and patios, seating walls and steps, mulch and stone bed installation, planting, edging, grading, seeding and drainage. Because the same crew handles excavation and concrete, hardscape and softscape are sequenced together rather than coordinated across three separate contractors.',
    bullets: [
      'Segmental block and natural boulder retaining walls',
      'Paver walkways, patios and driveway aprons',
      'Seating walls, fire pits and outdoor living features',
      'Bed construction, edging, mulch and decorative stone',
      'Grading, topsoil, seeding and lawn restoration',
      'Drainage integration — French drains, dry wells, downspout runs',
      'Landscape boulders, steps and natural stone work',
      'Site cleanup and restoration after concrete or excavation work',
    ],
    sections: [
      {
        h: 'Retaining walls that are engineered, not stacked',
        p: 'A retaining wall is holding back a wet, heavy, moving mass of earth. The parts you do not see are the ones that matter: a compacted stone base below frost, a drainage stone chimney behind the block, a perforated drain tile with an outlet that actually daylights, and geogrid reinforcement tied back into the hillside on anything over about four feet. Walls that lean and belly out were built without those things. Walls over four feet also generally need an engineered design and a permit, and we will tell you when yours does.',
      },
      {
        h: 'Hardscape and concrete, sequenced by one crew',
        p: 'When the patio contractor, the excavator and the landscaper are three different companies, the homeowner becomes the project manager — and the gaps between them become delays, damaged work and finger-pointing. Running all three in-house means the grade is right before the pour, the wall goes in before the backfill, and the lawn gets restored the week the concrete is finished instead of next spring.',
      },
      {
        h: 'We leave the lawn better than the machines found it',
        p: 'Equipment leaves ruts. It is part of the work, and it is also our job to erase. Disturbed areas get raked out, topsoiled, seeded and strawed before we call a job done, and we will come back to check germination.',
      },
    ],
    process: [
      ['Design & layout', 'Walk the property, mark beds and walls, agree on materials.'],
      ['Excavate & base', 'Dig, place and compact base stone, install drainage behind walls.'],
      ['Build hardscape', 'Set block, boulders or pavers to line, level and batter.'],
      ['Softscape', 'Topsoil, plant, edge, mulch or stone the beds.'],
      ['Restore & clean', 'Seed and straw disturbed lawn, blow off surfaces, haul debris.'],
    ],
    faqs: [
      {
        q: 'How much does a retaining wall cost?',
        a: 'Segmental block retaining walls generally run $35 to $60 per face foot installed, and natural boulder walls $45 to $80, including base, drainage stone and drain tile. A 40-foot wall at 3 feet tall — 120 face feet — therefore lands roughly $4,200 to $7,200. Walls over four feet require engineering and reinforcement, which adds cost.',
      },
      {
        q: 'Do retaining walls need a permit?',
        a: 'In most Western PA municipalities, a wall over four feet in exposed height requires a permit and a sealed engineered design, and some townships set the threshold lower or measure from the footing. We confirm the local requirement before quoting and handle the filing.',
      },
      {
        q: 'Can you do the landscaping and the concrete together?',
        a: 'That is the point of doing both. The same crew that excavates for the patio grades the beds and builds the wall, so the sequencing is handled internally, the site is only torn up once, and there is one company responsible for the finished result.',
      },
    ],
    related: ['excavation-site-prep', 'concrete-patios', 'sidewalks-walkways'],
  },
];

export default services;
