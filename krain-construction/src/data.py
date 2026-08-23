# -*- coding: utf-8 -*-
"""Single source of truth for Krain Construction site content.

Everything the client may want to edit lives here. Change a value once and
rebuild (`python3 build.py`) to update every page, sitemap entry and schema block.
"""

# ---------------------------------------------------------------- CONFIGURATION
SITE_URL = "https://www.krainconstructionllc.com"

# Leave any value below as "" and the build simply omits it — no broken markup,
# no invented claims. See TODO-CLIENT.md for the short list of items to confirm.
BIZ = {
    "name": "Krain Construction LLC",
    "short_name": "Krain Construction",
    "legal_name": "Krain Construction LLC",
    "founded": "1988",
    "owner": "Brian Krainbucher",
    "owner_title": "Owner & Lead Builder",
    "phone_display": "(724) 321-0588",
    "phone_e164": "+17243210588",
    "phone_digits": "7243210588",
    "email": "info@krainconstructionllc.com",   # confirm with client
    "street": "6200 Eagles Lane",
    "city": "Murrysville",
    "region": "PA",
    "region_name": "Pennsylvania",
    "postal": "15668",
    "country": "US",
    "lat": "40.4278",
    "lng": "-79.6906",
    "service_radius_mi": "50",
    "hours": [
        ("Monday – Friday", "7:00 AM – 5:00 PM"),
        ("Saturday", "By appointment"),
        ("Sunday", "Closed"),
    ],
    "hours_schema": [
        {"days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
         "opens": "07:00", "closes": "17:00"},
        {"days": ["Saturday"], "opens": "09:00", "closes": "13:00"},
    ],
    "pa_hic": "",              # PA Home Improvement Contractor # — confirm
    "facebook": "https://www.facebook.com/p/Krainbucher-Homes-LLC-100063564699775/",
    "houzz": "https://www.houzz.com/professionals/general-contractors/krain-construction-llc-pfvwus-pf~1133326178",
    "angi": "https://www.angi.com/companylist/us/pa/murrysville/krain-construction-llc-reviews-9167462.htm",
    "homeadvisor": "https://www.homeadvisor.com/rated.KrainConstructionLLC.19371250.html",
    "bbb": "https://www.bbb.org/us/pa/murrysville/profile/roofing-contractors/krain-construction-0141-12003042",
    "real_log_homes": "https://realloghomes.com/sales-representative/krain-construction",
}
BIZ["years"] = 2026 - int(BIZ["founded"])
BIZ_YEARS = BIZ["years"]

# Ratings shown publicly on /reviews/ and mirrored in AggregateRating schema.
RATING = {"value": "4.8", "count": "25", "best": "5",
          "source": "HomeAdvisor", "recommend_pct": "96"}

# Where the quote form POSTs. Empty string = demo mode (validates, then routes to
# /thank-you/ without sending). Drop in a Formspree / Netlify / CRM endpoint to go live.
FORM_ENDPOINT = ""

# Analytics IDs — empty means the snippet is skipped entirely.
GA4_ID = ""
GOOGLE_ADS_ID = ""
GOOGLE_ADS_CONVERSION_LABEL = ""

# ---------------------------------------------------------------------- SERVICES
SERVICES = [
    {
        "slug": "custom-home-building", "short": "Custom Home Builder", "meta": "Family-owned custom home builder in Murrysville, PA since 1988. We build on your lot across Westmoreland & Allegheny counties. Free estimates.",
        "nav": "Custom Homes",
        "name": "Custom Home Building",
        "h1": "Custom Home Builders in Murrysville & Southwestern PA",
        "tagline": "Your plan, your lot, your budget — built by the same family since 1988.",
        "icon": "home",
        "blurb": "Full-service custom home building on your lot or ours — from first sketch and site work through final walkthrough, managed start to finish by the owner.",
        "answer": "Krain Construction builds custom homes throughout southwestern Pennsylvania on the homeowner's lot or a lot we help you find. We handle design coordination, permits, excavation, framing, mechanicals, finishes and the final walkthrough as a single point of contact, and we have done it as a family-owned builder since 1988.",
        "hero_stats": [(f"{2026 - 1988}+", "Years building"), ("1", "Point of contact"), ("Free", "Consultation")],
        "includes": [
            ("Design & plan coordination", "Bring your architect's plans or work with ours. We value-engineer before a shovel hits dirt so the budget is real."),
            ("Site work & foundation", "Excavation, footers, foundation, waterproofing, drainage and backfill on hillside and flat lots alike."),
            ("Framing & shell", "Conventional stick framing, engineered floor systems, roof trusses, sheathing and a weather-tight dry-in."),
            ("Mechanicals", "Licensed electrical, plumbing and HVAC subcontractors we have worked with for decades — not whoever is cheapest that week."),
            ("Interior finishes", "Drywall, trim, cabinetry, flooring, tile and paint, coordinated so trades are not tripping over each other."),
            ("Exterior & sitework", "Siding, roofing, gutters, decks, garage, driveway and grading, so you close out with a finished property."),
        ],
        "faqs": [
            ("How long does it take to build a custom home in southwestern PA?",
             "Most custom homes we build take 8 to 14 months from permit to move-in. Design and permitting typically add 2 to 4 months before that. Hillside lots, well and septic work, and long-lead specialty materials are the three things that most often extend the schedule in Westmoreland and Allegheny counties."),
            ("Do I need to own the lot before I call you?",
             "No. Many of our clients call before they buy. We will walk a lot with you and give you a candid read on access, slope, utilities, soil, setbacks and what the site work will realistically cost — which is exactly the information that keeps people from overpaying for a difficult lot."),
            ("Can you build from plans I already have?",
             "Yes. Bring plans from an architect, a stock plan you bought, or sketches on graph paper. We will price them honestly and tell you where the plan will fight your budget before you commit."),
            ("Who is on site day to day?",
             "Krain Construction is family owned and run, so the owner is personally involved in every job. You get a direct line — most of our clients text us — rather than a call center and a rotating project manager."),
        ],
        "related": ["log-homes", "home-additions", "garages-outbuildings"],
    },
    {
        "slug": "log-homes", "short": "Log Home Builder", "meta": "Authorized Real Log Homes representative for southwestern PA. Log and timber frame homes designed, packaged and built by one company since 1988.",
        "nav": "Log & Timber Homes",
        "name": "Log & Timber Frame Homes",
        "h1": "Log Home Builders in Southwestern Pennsylvania",
        "tagline": "Authorized Real Log Homes® independent representative for southwestern PA.",
        "icon": "logs",
        "blurb": "Design, package and build a Real Log Homes® log or timber frame home with a builder who has been doing it here for decades — not a builder learning on your project.",
        "answer": "Krain Construction is the authorized Real Log Homes independent representative for southwestern Pennsylvania. That means one company helps you select and configure the log or timber frame package, prepares the site, sets the shell and finishes the home — instead of you coordinating a kit supplier and a builder who have never worked together.",
        "hero_stats": [("Real Log Homes®", "Authorized rep"), ("SW PA", "Territory"), ("Free", "Design consult")],
        "includes": [
            ("Package selection & design", "Choose a Real Log Homes® plan or customize one. We translate the catalog into what actually works on your lot and in your budget."),
            ("Log & timber shell erection", "Crews who know how log walls settle, how timber joinery goes together, and how to keep a package dry and organized on site."),
            ("Weather sealing & finishing", "Proper chinking, sealants, stain systems and flashing details — the difference between a log home that ages beautifully and one that leaks."),
            ("Conventional trades integration", "Running mechanicals through log walls takes planning. We plan it before the shell goes up, not after."),
            ("Settlement detailing", "Slip joints, screw jacks and framing details engineered for log settlement so doors, windows and drywall stay true."),
            ("Site & delivery logistics", "Access roads, crane placement, staging and delivery scheduling for a package that arrives on tractor-trailers."),
        ],
        "faqs": [
            ("What does it cost to build a log home in Pennsylvania?",
             "Log and timber frame homes in southwestern PA generally run 10% to 25% above a comparable conventional home of the same size and finish level, because of the package cost and the extra labor in the shell. The honest answer for your project depends on the package, the lot and the finishes — we will price it specifically rather than quoting a per-square-foot number that means nothing."),
            ("What is a Real Log Homes® independent representative?",
             "Real Log Homes® sells its log and timber packages through independent representatives who are also builders. As the authorized representative for southwestern Pennsylvania, Krain Construction can quote the package, adapt the plan and build the home — a single contract and a single company standing behind it."),
            ("Do log homes need more maintenance?",
             "They need different maintenance, not necessarily more. Expect to inspect and refresh the exterior stain and sealant system roughly every 3 to 7 years depending on exposure. Get the flashing, overhangs and grading right during construction and the maintenance load drops substantially."),
            ("Can you build a timber frame instead of a full log wall?",
             "Yes. Timber frame with conventional or SIP enclosure gives you exposed heavy-timber interiors with conventional insulation performance. It is a common choice when someone loves the look of timbers but wants a standard exterior."),
        ],
        "related": ["custom-home-building", "garages-outbuildings", "decks-outdoor-living"],
    },
    {
        "slug": "home-additions", "short": "Home Additions", "meta": "In-law suites, second stories, kitchens, baths and finished basements across Westmoreland & Allegheny counties, PA. Free on-site estimates.",
        "nav": "Additions & Remodeling",
        "name": "Home Additions & Remodeling",
        "h1": "Home Additions & Remodeling in Murrysville, PA",
        "tagline": "More room, without leaving the neighborhood you already love.",
        "icon": "addition",
        "blurb": "In-law suites, second stories, kitchen and bath remodels, sunrooms, dormers and finished basements — tied into your existing house so the addition does not look added on.",
        "answer": "Krain Construction builds home additions and whole-room remodels across Westmoreland and Allegheny counties: in-law suites, second-story additions, dormers, sunrooms, kitchens, baths and finished basements. Because we are also a custom home builder, we handle structural work, mechanicals and matching the existing roofline and siding as one job.",
        "hero_stats": [("Structural", "In-house expertise"), ("Matched", "Roof & siding"), ("Free", "On-site estimate")],
        "includes": [
            ("Room & wing additions", "Family rooms, primary suites, in-law suites and garages-with-living-space, engineered and tied into the existing structure."),
            ("Second stories & dormers", "Adding up when the lot will not let you add out — including the temporary weather protection that keeps your house dry mid-project."),
            ("Kitchen & bath remodeling", "Layout changes, structural openings, cabinetry, tile, plumbing and electrical, sequenced to keep the disruption short."),
            ("Basement finishing", "Egress, moisture control, framing, mechanicals and finishes for a basement that stays dry and comfortable."),
            ("Sunrooms & three-season rooms", "Insulated, permitted, properly foundationed rooms — not a bolted-on kit."),
            ("Roofline & exterior matching", "Siding, roofing and trim sourced and detailed so the addition reads as original to the house."),
        ],
        "faqs": [
            ("Is an addition cheaper than moving?",
             "Often, yes — especially in established Murrysville, Export and Monroeville neighborhoods where comparable move-up homes carry a large price jump plus 6% to 9% in transaction costs. An addition also lets you keep your lot, your school district and your interest rate. We will give you a real number so you can compare honestly."),
            ("Do I need permits for a home addition in Westmoreland County?",
             "Yes. Additions require a building permit and typically a zoning review for setbacks, and most municipalities in Westmoreland and Allegheny counties require inspections at footer, framing, mechanical and final stages. We pull the permits and manage the inspections as part of the job."),
            ("Can we live in the house during construction?",
             "In most additions, yes. We isolate the work area with dust containment, keep utilities live and stage the demolition so the kitchen or bathroom you need stays usable as long as possible. For whole-house remodels we will tell you straight if moving out will save you money and stress."),
            ("How long does a typical addition take?",
             "A single-room addition usually runs 8 to 14 weeks on site. Second-story additions and in-law suites more often run 4 to 7 months. Design, engineering and permitting add roughly 4 to 10 weeks before the site work starts."),
        ],
        "related": ["custom-home-building", "roofing-exteriors", "decks-outdoor-living"],
    },
    {
        "slug": "garages-outbuildings", "short": "Garages & Pole Barns", "meta": "Detached garages, workshops, pole barns and engineered steel buildings in southwestern PA. Site prep, concrete and finishes included.",
        "nav": "Garages & Steel Buildings",
        "name": "Garages, Pole Barns & Steel Buildings",
        "h1": "Garage, Pole Barn & Steel Building Construction in SW PA",
        "tagline": "Detached garages, shops, barns and steel buildings that outlast the loan.",
        "icon": "garage",
        "blurb": "Attached and detached garages, workshops, pole barns and engineered steel buildings — permitted, foundationed and finished to the same standard as our houses.",
        "answer": "Krain Construction builds attached and detached garages, workshops, pole barns and engineered steel buildings throughout southwestern Pennsylvania. We handle site prep, concrete, the structure, doors, electrical rough-in and exterior finishes, so the building is permitted and complete rather than a shell you still have to finish.",
        "hero_stats": [("Steel", "& stick built"), ("Permitted", "Start to finish"), ("Free", "Site walk")],
        "includes": [
            ("Detached & attached garages", "One, two and three-bay garages with the foundation, framing, roofing and siding detailed to match your house."),
            ("Workshops & hobby buildings", "Insulated, wired and heated shop space with the ceiling height and door sizes your equipment actually needs."),
            ("Pole barns & agricultural buildings", "Post-frame construction for equipment storage, livestock and general-purpose barns."),
            ("Engineered steel buildings", "Pre-engineered steel structures for commercial, storage and large-clear-span uses, set on a slab we pour."),
            ("Concrete & site prep", "Excavation, stone base, footers, slabs and aprons, graded so water moves away from the building."),
            ("Doors, power & finishes", "Overhead and service doors, electrical rough-in, lighting, windows, gutters and paint or siding."),
        ],
        "faqs": [
            ("How much does a detached garage cost in Pennsylvania?",
             "A basic two-car detached garage on a slab typically starts in the mid five figures once site work, concrete, permits and finished siding and roofing are included. Cost drivers are the slab and site prep, the door count, ceiling height, and whether you want it insulated, heated and wired as a shop."),
            ("Pole barn or steel building — which should I choose?",
             "Post-frame (pole barn) is usually the lower-cost route for agricultural and storage buildings and is easy to insulate and finish. Pre-engineered steel wins on very large clear spans, fire resistance and low maintenance. We will price both when the choice is genuinely close."),
            ("Do I need a permit for a garage or pole barn?",
             "Almost always. Most Westmoreland and Allegheny county municipalities require a building permit and a zoning review for setbacks and lot coverage, even for detached structures. We handle the permit application and inspections."),
            ("Can you add a garage to an existing house?",
             "Yes. Attached garages require footing and structural work tied into the existing house, plus roofline and siding matching so it does not read as an afterthought. That structural tie-in is exactly the kind of work our custom-home side does every week."),
        ],
        "related": ["custom-home-building", "home-additions", "roofing-exteriors"],
    },
    {
        "slug": "decks-outdoor-living", "short": "Deck Builder", "meta": "Composite and wood decks, covered porches and screened rooms built to frost depth and permitted across Westmoreland County, PA.",
        "nav": "Decks & Outdoor Living",
        "name": "Decks & Outdoor Living",
        "h1": "Deck Builders in Murrysville & Westmoreland County",
        "tagline": "Built to code, built for the hillside, built to still be solid in twenty years.",
        "icon": "deck",
        "blurb": "Composite and wood decks, covered porches, screened rooms and multi-level structures engineered for Pennsylvania hillsides, snow load and frost depth.",
        "answer": "Krain Construction builds decks, covered porches and screened outdoor rooms throughout Westmoreland and Allegheny counties. We set footings below the local frost line, use properly sized ledger and lateral-load connections, and permit the structure — the three things that separate a deck that lasts from a deck that a home inspector flags.",
        "hero_stats": [("Frost-depth", "Footings"), ("Composite", "& wood"), ("Free", "Design & quote")],
        "includes": [
            ("Composite & PVC decking", "Low-maintenance decking with hidden fasteners, picture framing and matching rail systems."),
            ("Pressure-treated & hardwood decks", "Traditional wood decking when you want the look and the lower up-front cost."),
            ("Covered porches & roof structures", "Roofed porches tied into the existing roofline, with proper flashing and headers."),
            ("Screened & three-season rooms", "Screen systems, knee walls and ceiling fans for a room you can use from April to October."),
            ("Multi-level & hillside decks", "Engineered post and beam layouts for the steep lots that are everywhere in this part of the state."),
            ("Railings, lighting & stairs", "Cable, aluminum and composite rail, integrated lighting, and code-compliant stair geometry."),
        ],
        "faqs": [
            ("How deep do deck footings need to be in Pennsylvania?",
             "In southwestern Pennsylvania, deck footings generally must bear below the local frost depth — commonly 36 inches, though your municipality sets the requirement. Shallow footings are the single most common cause of decks that heave, pull away from the house and fail inspection."),
            ("Composite or wood decking — which is worth it?",
             "Composite costs more up front and dramatically less over time: no sanding, no staining, and a typical 25 to 50 year surface warranty. Pressure-treated wood is cheaper to build but needs cleaning and sealing every 2 to 3 years. If you plan to stay more than about seven years, composite usually wins on total cost."),
            ("Do I need a permit to build a deck?",
             "In most local municipalities, yes — decks over a certain height or square footage require a building permit and inspection, and attached decks trigger ledger and lateral-connection requirements. We pull the permit and schedule the inspections."),
            ("How long does a deck take to build?",
             "Most decks take 1 to 3 weeks on site once permits are issued. Covered porches, screened rooms and multi-level hillside decks run longer because of the roof structure and additional footings."),
        ],
        "related": ["home-additions", "custom-home-building", "roofing-exteriors"],
    },
    {
        "slug": "roofing-exteriors", "short": "Roofing & Siding", "meta": "Roof replacement with extended manufacturer warranties, plus siding, windows and gutters across southwestern PA. Free roof inspection.",
        "nav": "Roofing & Exteriors",
        "name": "Roofing, Siding & Exteriors",
        "h1": "Roofing & Exterior Contractors in Murrysville, PA",
        "tagline": "Roofing with extended manufacturer warranties — plus the siding, windows and gutters around it.",
        "icon": "roof",
        "blurb": "Roof replacement with extended warranty coverage, siding, windows, doors and gutters — installed by a builder who understands what is behind the surface.",
        "answer": "Krain Construction installs roofing, siding, windows, doors and gutters across southwestern Pennsylvania, including roof replacements that qualify for extended manufacturer warranties. Because we are a full custom home builder, we can also repair the sheathing, framing or water damage we find underneath instead of covering it up.",
        "hero_stats": [("Extended", "Roof warranties"), ("Full", "Exterior scope"), ("Free", "Roof inspection")],
        "includes": [
            ("Roof replacement", "Architectural asphalt, metal and specialty roofing installed to manufacturer spec so extended warranty coverage actually applies."),
            ("Roof repair & storm damage", "Leak diagnosis, flashing repair, decking replacement and documentation for insurance claims."),
            ("Siding", "Vinyl, fiber cement, engineered wood and specialty siding, with proper house wrap and flashing behind it."),
            ("Windows & doors", "Replacement and new-construction windows, entry doors and patio doors, flashed and insulated correctly."),
            ("Gutters & drainage", "Seamless gutters, oversized downspouts, guards and underground discharge that moves water away from the foundation."),
            ("Soffit, fascia & trim", "Ventilated soffit and wrapped fascia that protect the roof assembly and stop ice dams at the source."),
        ],
        "faqs": [
            ("How long does a roof last in western Pennsylvania?",
             "A quality architectural asphalt roof typically lasts 20 to 30 years here. Our freeze-thaw cycles, ice damming and heavy wet snow are hard on roofs, so ventilation and ice-and-water shield at the eaves matter as much as the shingle you choose."),
            ("What is an extended roofing warranty and do I qualify?",
             "Shingle manufacturers offer extended system warranties — often 30 to 50 years, covering both material and workmanship — when a qualified contractor installs a complete system: underlayment, ice-and-water shield, starter, shingle, ventilation and ridge from the same manufacturer. Krain Construction installs roofs to that standard so the coverage applies."),
            ("Do I need a full roof replacement or just a repair?",
             "If the leak is isolated and the shingles still have granule coverage and flexibility, repair. If you have widespread granule loss, curling, multiple leaks, or you are on a second layer already, replacement is usually the better spend. We will tell you which one you actually need — a free inspection is not a sales pitch."),
            ("Can you handle insurance storm damage claims?",
             "Yes. We inspect, document the damage with photographs and measurements, and work directly with your adjuster on scope. We do not advise homeowners to file claims for damage we cannot substantiate."),
        ],
        "related": ["home-additions", "custom-home-building", "garages-outbuildings"],
    },
]
SERVICE_BY_SLUG = {s["slug"]: s for s in SERVICES}

# ------------------------------------------------------------------ SERVICE AREA
CITIES = [
    {"slug": "murrysville-pa", "short": "Murrysville", "city": "Murrysville", "county": "Westmoreland County",
     "lat": "40.4281", "lng": "-79.6903", "zips": "15668, 15632",
     "note": "Our home municipality. We have built, added onto and re-roofed houses in Murrysville since 1988 — and we know the hillside lots, the Franklin Regional school district draw and the township's permit process because we live here.",
     "neighborhoods": "Export, Sardis, Newlonsburg, Meadowbrook, Turtle Creek Valley"},
    {"slug": "monroeville-pa", "short": "Monroeville", "city": "Monroeville", "county": "Allegheny County",
     "lat": "40.4212", "lng": "-79.7881", "zips": "15146",
     "note": "Fifteen minutes west of our shop. Monroeville's mid-century housing stock is prime territory for additions, second stories, kitchen remodels and full exterior replacement.",
     "neighborhoods": "Garden City, Pitcairn, Wilmerding, Forest Hills, Pleasant Hills"},
    {"slug": "greensburg-pa", "short": "Greensburg", "city": "Greensburg", "county": "Westmoreland County",
     "lat": "40.3015", "lng": "-79.5389", "zips": "15601",
     "note": "The Westmoreland County seat and a market where custom homes on acreage, log homes and large detached garages all make sense. We build across the Greensburg and Hempfield area regularly.",
     "neighborhoods": "Hempfield, Southwest Greensburg, Jeannette, Youngwood, Unity"},
    {"slug": "export-pa", "short": "Export", "city": "Export", "county": "Westmoreland County",
     "lat": "40.4198", "lng": "-79.6259", "zips": "15632",
     "note": "Minutes from our Eagles Lane office. Export and the surrounding Franklin Regional area is one of the areas we work in most — additions, decks, garages and full custom builds.",
     "neighborhoods": "Delmont, Slickville, Salem Township, Murrysville"},
    {"slug": "delmont-pa", "short": "Delmont", "city": "Delmont", "county": "Westmoreland County",
     "lat": "40.4106", "lng": "-79.5714", "zips": "15626",
     "note": "Delmont and Salem Township have the acreage that makes log homes, pole barns and steel buildings practical. We have built all three out here.",
     "neighborhoods": "Salem Township, New Salem, Export, Slickville"},
    {"slug": "plum-pa", "short": "Plum", "city": "Plum", "county": "Allegheny County",
     "lat": "40.5017", "lng": "-79.7517", "zips": "15239",
     "note": "Plum Borough sits directly between our office and the city. Steep lots here demand real engineering on decks, garages and additions — which is exactly what we do.",
     "neighborhoods": "Renton, Holiday Park, New Texas, Unity Township"},
    {"slug": "irwin-north-huntingdon-pa", "short": "Irwin", "city": "Irwin & North Huntingdon", "county": "Westmoreland County",
     "lat": "40.3212", "lng": "-79.7003", "zips": "15642",
     "note": "Irwin and North Huntingdon's growing neighborhoods keep us busy with additions, decks, roofing and detached garages along the Route 30 corridor.",
     "neighborhoods": "North Huntingdon, Norwin, Manor, Larimer, Circleville"},
    {"slug": "new-kensington-lower-burrell-pa", "short": "New Kensington", "city": "New Kensington & Lower Burrell", "county": "Westmoreland County",
     "lat": "40.5695", "lng": "-79.7648", "zips": "15068",
     "note": "Along the Allegheny River, we handle roofing, siding, additions and garages — plus custom builds on the open ground north of the city.",
     "neighborhoods": "Lower Burrell, Arnold, Upper Burrell, Vandergrift, Allegheny Township"},
]
CITY_BY_SLUG = {c["slug"]: c for c in CITIES}

# Additional municipalities named for coverage without dedicated pages.
ALSO_SERVING = [
    "Level Green", "Trafford", "Penn Township", "Harrison City", "Manor", "Jeannette",
    "Latrobe", "Ligonier", "Apollo", "Vandergrift", "Verona", "Oakmont", "Penn Hills",
    "Pitcairn", "Wilkins Township", "Turtle Creek", "Sardis", "Slickville", "Saltsburg",
    "Blairsville", "Avonmore", "Hempfield", "Unity Township", "Salem Township",
]
COUNTIES = ["Westmoreland County", "Allegheny County", "Armstrong County", "Indiana County"]

# ------------------------------------------------------------------- TESTIMONIALS
# Sourced from the company's public Angi and HomeAdvisor review profiles.
# Confirm wording and add full names/photos before launch — see TODO-CLIENT.md.
TESTIMONIALS = [
    {"quote": "Brian helped us make decisions with his knowledge and expertise, and the crew did a great job building and finishing the rooms. We would recommend Krain to anyone.",
     "author": "Verified homeowner review", "meta": "Addition & finished rooms", "source": "Angi", "stars": 5},
    {"quote": "Absolutely the best contractor. The bid was reasonable, the quality of work was top notch, and they actually completed the project within the scheduled timeframe.",
     "author": "Verified homeowner review", "meta": "Whole-home project", "source": "HomeAdvisor", "stars": 5},
    {"quote": "Extremely professional, courteous, punctual and exceptionally clean. There was not a speck of dust left behind.",
     "author": "Verified homeowner review", "meta": "Interior remodel", "source": "Angi", "stars": 5},
    {"quote": "If we had any issues we could just text Brian and he'd resolve them quickly. He worked with us on last-minute changes and was very personable and professional throughout.",
     "author": "Verified homeowner review", "meta": "Custom home", "source": "HomeAdvisor", "stars": 5},
    {"quote": "The log home provider shorted our package and never sent the stairs. Brian got on the phone, found a local lumber company and had stairs made and delivered here. He solved a problem that wasn't his to solve.",
     "author": "Verified homeowner review", "meta": "Log home build", "source": "Angi", "stars": 5},
    {"quote": "Krain did a great job coordinating all of the work we needed — framing, siding, doors, windows, decks, gutters and HVAC. Brian was knowledgeable and helpful from start to finish.",
     "author": "Verified homeowner review", "meta": "Full exterior & mechanicals", "source": "HomeAdvisor", "stars": 5},
]

# ------------------------------------------------------------------------ PROCESS
PROCESS = [
    ("Talk it through", "Call or send the form. You get a real conversation about what you want to build, what it will take and roughly what it costs — before anyone drives out.", "01"),
    ("Walk the property", "We come to you, look at the lot or the house, take measurements and photos, and flag the things that drive cost: slope, access, utilities, structure, drainage.", "02"),
    ("Get a written proposal", "A line-item scope and price you can actually read. No mystery allowances, no vague 'as needed' items designed to become change orders later.", "03"),
    ("Plans, permits & schedule", "We coordinate drawings and engineering, pull the permits with your municipality, and give you a schedule with real dates on it.", "04"),
    ("We build it", "One company, one point of contact, crews and subcontractors we have used for years. You get updates — and a phone number that gets answered.", "05"),
    ("Walkthrough & warranty", "We walk the finished job with you, close out the punch list, hand over warranty documentation and stay reachable after the check clears.", "06"),
]

# ------------------------------------------------------------------ DIFFERENTIATORS
WHY = [
    ("est", "Family owned since 1988",
     f"{BIZ_YEARS} years in the same community, under the same family. The owner who quotes your job is the owner who runs it — not a salesperson on commission."),
    ("shield", "One company, whole project",
     "Custom homes, additions, garages, decks, roofing and exteriors under one contract. No finger-pointing between trades, because they all answer to us."),
    ("logs", "Authorized Real Log Homes® rep",
     "The authorized independent representative for Real Log Homes® in southwestern PA — package, plan and construction from a single source."),
    ("star", f"{RATING['recommend_pct']}% would recommend us",
     f"A {RATING['value']}-star average across {RATING['count']} verified reviews, and {RATING['recommend_pct']}% of Angi and HomeAdvisor customers recommending us. Read them yourself."),
    ("clock", "Schedules we actually keep",
     "The compliment we hear most is that the job finished when we said it would. That is not luck — it is sequencing trades who have worked together for decades."),
    ("phone", "You can just text us",
     "Clients tell us the best part is being able to text the owner and get an answer. No ticket system, no call center, no waiting three days."),
]

# ---------------------------------------------------------------------- SITE FAQS
GENERAL_FAQS = [
    ("What areas does Krain Construction serve?",
     f"Krain Construction serves southwestern Pennsylvania from our office at {BIZ['street']}, {BIZ['city']}, {BIZ['region']} — primarily Westmoreland and Allegheny counties, plus parts of Armstrong and Indiana counties. That includes Murrysville, Export, Delmont, Monroeville, Plum, Greensburg, Irwin, North Huntingdon, New Kensington and Lower Burrell. Call {BIZ['phone_display']} if your town is not listed; we travel for the right project."),
    ("How long has Krain Construction been in business?",
     f"Since 1988 — {BIZ['years']} years as of 2026. Krain Construction LLC is family owned and family run, based in Murrysville, Pennsylvania, and led by {BIZ['owner']}."),
    ("Is the estimate really free?",
     "Yes. Consultations, site walks and written proposals cost you nothing and carry no obligation. We would rather tell you honestly that a project does not make financial sense than sell you something you regret."),
    ("Are you licensed and insured?",
     "Krain Construction LLC carries general liability and workers' compensation coverage and is registered as a Pennsylvania Home Improvement Contractor. We will provide current certificates of insurance and our registration number with any proposal, and we encourage you to verify them."),
    ("Do you offer financing?",
     "We work with clients using construction loans, home equity lines and renovation mortgages, and we will supply the documentation your lender needs — draw schedules, line-item scopes and lien waivers. Ask us early; the financing route often shapes how the project is staged."),
    ("What kind of warranty do you provide?",
     "Workmanship is warranted under your written contract, and manufacturer warranties pass through to you on materials. Our roofing work is installed to the standard that qualifies for extended manufacturer system warranties. Every warranty document is handed over at the final walkthrough — in writing."),
    ("How do I get started?",
     f"Call {BIZ['phone_display']} or send the free-estimate form on this site. Tell us the project, the town and your rough timeline. We will call you back — usually the same business day — and schedule a walkthrough at no cost."),
    ("Do you build on my lot or do you have lots available?",
     "Both. Most of our custom homes are built on land the client already owns or is under contract to buy. If you have not found a lot yet, we will walk candidate properties with you and give you a straight assessment of what each one will cost to build on."),
]

# ---------------------------------------------------------------------- PORTFOLIO
# Illustrated placeholders until the client's photography is dropped in.
GALLERY = [
    ("Timber frame great room", "log-homes", "Log & Timber", "Salem Township, PA", "art-timber"),
    ("Hillside custom home", "custom-home-building", "Custom Homes", "Murrysville, PA", "art-custom"),
    ("Two-story rear addition", "home-additions", "Additions", "Monroeville, PA", "art-addition"),
    ("Three-bay detached garage", "garages-outbuildings", "Garages & Buildings", "Delmont, PA", "art-garage"),
    ("Multi-level composite deck", "decks-outdoor-living", "Decks & Porches", "Plum, PA", "art-deck"),
    ("Architectural roof replacement", "roofing-exteriors", "Roofing & Exteriors", "Export, PA", "art-roof"),
    ("Real Log Homes® cabin", "log-homes", "Log & Timber", "Greensburg, PA", "art-log"),
    ("In-law suite addition", "home-additions", "Additions", "Irwin, PA", "art-suite"),
    ("Post-frame equipment barn", "garages-outbuildings", "Garages & Buildings", "Salem Township, PA", "art-barn"),
    ("Covered porch & screened room", "decks-outdoor-living", "Decks & Porches", "North Huntingdon, PA", "art-porch"),
    ("Fiber cement siding & gutters", "roofing-exteriors", "Roofing & Exteriors", "Lower Burrell, PA", "art-siding"),
    ("Custom home on acreage", "custom-home-building", "Custom Homes", "Delmont, PA", "art-acreage"),
]

# -------------------------------------------------------------------- QUOTE FORM
PROJECT_TYPES = [
    ("custom-home", "Custom home", "home"),
    ("log-home", "Log or timber frame home", "logs"),
    ("addition", "Addition or remodel", "addition"),
    ("garage", "Garage, barn or steel building", "garage"),
    ("deck", "Deck or outdoor living", "deck"),
    ("roofing", "Roofing, siding or exterior", "roof"),
]
BUDGETS = ["Under $25,000", "$25,000 – $75,000", "$75,000 – $150,000",
           "$150,000 – $400,000", "$400,000+", "Not sure yet"]
TIMELINES = ["As soon as possible", "1 – 3 months", "3 – 6 months",
             "6 – 12 months", "Just planning ahead"]
