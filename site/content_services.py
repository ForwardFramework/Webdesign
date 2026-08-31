"""Service pages. Each entry renders one page under /services/<slug>/.

Content is written answer-first: `quick_answer` is a 40-60 word standalone
paragraph that fully answers the page's core question, because that is the unit
AI answer engines (Google AI Overviews, ChatGPT Search, Perplexity, Claude) lift
and cite. Tables are included deliberately — extraction-friendly structured
facts get quoted far more often than prose.
"""

SERVICES = [
{
  "slug": "pool-cage-rescreening",
  "nav": "Pool Cage Rescreening",
  "h1": "Pool Cage Rescreening &amp; Repair",
  "meta_title": "Pool Cage Rescreening & Repair | Sarasota FL | Acosta Pro",
  "meta_desc": "Full pool cage rescreening and panel repair across Sarasota, Manatee and Charlotte County. Most cages done in 1-2 days. Free estimates: 941-565-5576.",
  "icon": "cage",
  "summary": "Full-cage rescreening or single-panel repairs, plus new screws, "
             "spline and hardware so the whole structure is tight again.",
  "quick_answer":
      "Pool cage rescreening is the replacement of every screen panel in a pool "
      "enclosure, along with the spline that holds it in the frame. In Southwest "
      "Florida, screen typically lasts 5–7 years before UV and salt air make it "
      "brittle. Acosta Pro rescreens most residential cages in one to two days "
      "for a flat, per-panel or whole-cage price quoted free on site.",
  "intro": [
      "A pool cage takes more abuse than any other structure on a Florida home. "
      "Ten hours of UV a day, salt in the air, pollen, summer storms and the "
      "occasional falling branch all work on the same mesh. Screen does not fail "
      "all at once — it goes chalky, then it tears at the spline, then one panel "
      "lets in the no-see-ums and the pool stops being pleasant to sit by.",
      "Acosta Pro rescreens pool cages and screen enclosures throughout Sarasota, "
      "Manatee and Charlotte County. We can replace a single blown panel or "
      "re-mesh the entire cage top to bottom, and while we are up there we "
      "replace corroded screws, cracked spline and worn hardware so the frame "
      "itself stops loosening.",
  ],
  "signals_title": "Signs your pool cage needs rescreening",
  "signals": [
      "Screen feels brittle or chalky and tears when you press it",
      "Two or more panels are torn, sagging or blown out",
      "No-see-ums and mosquitoes are getting through intact-looking mesh",
      "Spline is popping out of the frame channel at the corners",
      "Screws are rust-streaked, backing out, or bleeding stains down the frame",
      "The cage was last rescreened more than 6–7 years ago",
  ],
  "includes_title": "What a full rescreen includes",
  "includes": [
      "Removal and disposal of all old screen and spline",
      "New screen installed panel by panel, tensioned so it does not drum in wind",
      "Fresh spline sized to the frame channel",
      "Replacement of rusted or backed-out screws with new stainless or coated fasteners",
      "Door adjustment, new door screen, and closer/latch check while we are on site",
      "Full cleanup — every screw, spline offcut and screen scrap off your deck",
  ],
  "table_title": "Screen options for pool cages",
  "table_intro": "The mesh you choose changes how the cage looks, how long it lasts "
                 "and how much airflow you get. These are the materials we install most.",
  "table_head": ["Screen type", "Best for", "Typical life in SW Florida", "Trade-off"],
  "table_rows": [
      ["18/14 standard fiberglass", "General pool cages, best value", "5–7 years",
       "Least resistant to pets and impact"],
      ["20/20 no-see-um mesh", "Waterfront and canal homes, evening use", "5–7 years",
       "Tighter weave cuts airflow and views slightly"],
      ["Pet-resistant (vinyl-coated polyester)", "Homes with dogs or cats, lower panels",
       "8–12 years", "Heavier and more visible; costs more per panel"],
      ["Florida Glass / privacy vinyl", "Lower panels, screening a neighbor or A/C unit",
       "10+ years", "Blocks airflow and light through that panel"],
      ["Solar / shade screen (80–90%)", "West-facing cages, heat and glare control",
       "7–10 years", "Darkens the enclosure noticeably"],
  ],
  "process_title": "How a rescreen job runs",
  "process": [
      ("Free on-site estimate", "We count panels, check the frame, doors and hardware, "
       "and give you a written price. No charge and no obligation."),
      ("Schedule and material", "You pick the mesh. We order it and book a start date — "
       "usually within the same week."),
      ("Strip and re-mesh", "Old screen and spline come out, new screen goes in panel by "
       "panel, tensioned as we go."),
      ("Hardware and doors", "Screws, spline, door screen, closers and latches replaced or "
       "adjusted so the cage closes properly."),
      ("Walkthrough", "We walk the cage with you before we leave. Anything you are not "
       "happy with, we fix on the spot."),
  ],
  "cost_title": "What affects the price of a pool cage rescreen",
  "cost_intro": "Every cage is different, so we quote on site rather than over the phone. "
                "These are the factors that move the number:",
  "cost_head": ["Factor", "Why it matters"],
  "cost_rows": [
      ["Number of panels", "Rescreening is priced per panel — a 40-panel cage is roughly "
       "twice the work of a 20-panel cage."],
      ["Cage height", "Two-story and high-hip cages need lifts or scaffolding and take longer."],
      ["Screen type", "Pet-resistant and privacy screen cost more per square foot than "
       "standard fiberglass."],
      ["Frame condition", "Corroded screws, bent members or rotted-out fasteners add labor."],
      ["Doors and hardware", "New door screens, closers, latches and wheels are usually "
       "quoted as line items."],
      ["Access", "Tight side yards, screened-in landscaping and pool-deck obstructions "
       "slow setup."],
  ],
  "faqs": [
      ("How long does it take to rescreen a pool cage?",
       "Most residential pool cages are rescreened in one to two working days. A small "
       "cage or a partial rescreen is often finished the same day. Very large or "
       "two-story enclosures can run three days."),
      ("How often should a pool cage be rescreened in Florida?",
       "Every 5 to 7 years for standard fiberglass screen in Southwest Florida. Coastal "
       "and west-facing cages sit at the shorter end of that range because of salt air "
       "and UV exposure; pet-resistant mesh commonly lasts 8 to 12 years."),
      ("Can you replace just one panel instead of the whole cage?",
       "Yes. Single-panel and partial repairs are a large part of what we do. Be aware "
       "that a new panel next to 6-year-old screen will look noticeably brighter until "
       "it weathers in."),
      ("Do I need to drain the pool or empty the lanai?",
       "No draining is needed. We do ask that you move patio furniture, grills and "
       "potted plants a few feet away from the cage walls — or tell us and we will move "
       "them and put them back."),
      ("Do you use pet-resistant screen on the whole cage?",
       "Usually not, and we will tell you so. Most homeowners get the best value putting "
       "pet-resistant mesh on the lower panels a dog can actually reach and standard or "
       "no-see-um mesh everywhere above it."),
      ("Is the old screen hauled away?",
       "Yes. Removal and disposal of the old screen, spline and fasteners is included in "
       "every rescreen — you are not left with a pile on the driveway."),
  ],
  "related": ["lanai-patio-screen-enclosures", "hurricane-storm-screen-repair",
              "screen-door-repair-installation"],
},
{
  "slug": "lanai-patio-screen-enclosures",
  "nav": "Lanai & Patio Enclosures",
  "h1": "Lanai &amp; Patio Screen Enclosures",
  "meta_title": "Lanai & Patio Screen Enclosures | Sarasota FL | Acosta Pro",
  "meta_desc": "New screen rooms, lanai rescreening and patio enclosure repair in Sarasota, Manatee and Charlotte County. Free estimates, clean crews: 941-565-5576.",
  "icon": "lanai",
  "summary": "New screen rooms, lanai rescreening, and enclosure repairs that turn "
             "an unusable patio back into the room you actually sit in.",
  "quick_answer":
      "A lanai screen enclosure is an aluminum-framed screened room built over a "
      "patio, porch or deck. Acosta Pro builds new enclosures and rescreens "
      "existing ones across Sarasota, Manatee and Charlotte County. Most lanai "
      "rescreens take a single day; a new enclosure typically takes three to five "
      "days once permitting is complete.",
  "intro": [
      "In Southwest Florida the lanai is not an add-on, it is the room the house is "
      "built around. When the screen goes chalky or a panel blows out, the room stops "
      "getting used — and a patio you avoid for half the year is expensive square "
      "footage to waste.",
      "We build new lanai and patio enclosures, rescreen existing ones, and repair "
      "the frames, doors and kick plates that fail before the screen does. The work "
      "is done by the same small crew every time, and we clean up as we go — that is "
      "the part our customers mention most often in their reviews.",
  ],
  "signals_title": "When to rescreen or rebuild a lanai",
  "signals": [
      "You have stopped using the lanai because of bugs",
      "Screen sags, ripples or drums loudly in the wind",
      "Panels are discolored, chalky or streaked",
      "Kick plates are dented, loose or missing at the base",
      "The frame has bowed members or corroded, weeping screws",
      "You are adding a patio and want it screened from day one",
  ],
  "includes_title": "What we do on lanai and patio work",
  "includes": [
      "New aluminum screen enclosures over slabs, patios, decks and porches",
      "Full lanai rescreening, panel by panel, in your choice of mesh",
      "Single-panel and storm-damage repairs",
      "Kick plate and lower-panel replacement (aluminum or Florida Glass)",
      "Frame repair — bent members, loose connections, corroded fasteners",
      "Screen door replacement, realignment and hardware",
  ],
  "table_title": "Lanai screening options compared",
  "table_intro": "Different sides of the same lanai often want different mesh. "
                 "We will spec it room by room rather than sell you one product for "
                 "the whole job.",
  "table_head": ["Option", "What it does", "Where it makes sense"],
  "table_rows": [
      ["18/14 fiberglass", "Standard insect screen, best airflow and clarity",
       "Upper panels, shaded sides, best value"],
      ["20/20 no-see-um", "Blocks sand flies and midges standard mesh lets through",
       "Canal, bay and coastal properties"],
      ["Pet-resistant mesh", "Seven times stronger than standard screen",
       "Lower panels and any door a dog pushes on"],
      ["Florida Glass", "Screen laminated to clear or tinted vinyl — blocks wind and view",
       "Kick panels, privacy from neighbors, splash zones"],
      ["Solar shade screen", "Cuts 80–90% of heat and glare",
       "West and south exposures that get too hot to use"],
      ["Aluminum kick plate", "Solid metal base panel, no screen to tear",
       "Lower 18–24 inches where mowers and pets do damage"],
  ],
  "process_title": "How a lanai project runs",
  "process": [
      ("Free measure and quote", "We measure the opening, look at the slab and existing "
       "frame, and hand you a written price."),
      ("Permits, if the job needs them", "New enclosures generally require a county permit. "
       "We tell you up front whether yours does and what it adds."),
      ("Build or strip", "New frames go up anchored to the slab and fascia; rescreens start "
       "with removing old screen and spline."),
      ("Screen and finish", "Panels are cut, tensioned and splined, then doors, kick plates "
       "and hardware go in."),
      ("Clean and walk", "The deck is swept and blown clean, and we walk it with you before "
       "we call the job done."),
  ],
  "cost_title": "What affects the cost of a lanai enclosure",
  "cost_intro": "New enclosures and rescreens price very differently. Either way, these "
                "drive the number:",
  "cost_head": ["Factor", "Why it matters"],
  "cost_rows": [
      ["New build vs. rescreen", "A new enclosure includes frame, footings, permitting and "
       "engineering; a rescreen is labor and mesh."],
      ["Square footage and panel count", "Priced by the panel — larger openings mean more "
       "panels and more framing."],
      ["Roof style", "A flat or mansard screen roof costs less than a gable or a "
       "pan-roof solid cover."],
      ["Mesh selection", "Pet-resistant, Florida Glass and solar screen all carry a "
       "premium over standard fiberglass."],
      ["Permit and engineering", "Required for most new structures in Sarasota, Manatee "
       "and Charlotte County; not usually required for a rescreen."],
      ["Slab condition", "A cracked, sloped or undersized slab may need work before a "
       "frame can be anchored to it."],
  ],
  "faqs": [
      ("How long does it take to rescreen a lanai?",
       "Most lanais are rescreened in a single day. Larger enclosures, or jobs that also "
       "include new kick plates and a door, can run into a second day."),
      ("Do I need a permit to screen in my patio in Sarasota County?",
       "A new screen enclosure is a structure and generally requires a county building "
       "permit and engineering. Rescreening an existing enclosure normally does not. We "
       "confirm which applies to your property before we quote it."),
      ("Can you screen in an existing covered porch?",
       "Yes — that is one of the most common jobs we do. If you already have a roof and a "
       "slab, we frame and screen the openings, which is faster and cheaper than building "
       "a new structure."),
      ("What is Florida Glass and should I use it?",
       "Florida Glass is insect screen laminated to a clear vinyl sheet. It blocks wind, "
       "rain and sightlines but also blocks airflow, so it is best used on the lower "
       "panels rather than the whole enclosure."),
      ("Will the new screen match the rest of my enclosure?",
       "We match mesh type and frame color wherever possible. On a partial job, brand-new "
       "screen next to weathered screen will look brighter for the first several months "
       "until it settles in."),
      ("Do you move my patio furniture?",
       "If you tell us in advance, yes. We move it away from the frames, work around it, "
       "and put it back where we found it."),
  ],
  "related": ["pool-cage-rescreening", "screen-door-repair-installation",
              "aluminum-structures-railings"],
},
{
  "slug": "screen-door-repair-installation",
  "nav": "Screen Doors",
  "h1": "Screen Door Repair &amp; Installation",
  "meta_title": "Screen Door Repair & Installation | Sarasota FL | Acosta Pro",
  "meta_desc": "Sliding and swing screen door repair, rollers, tracks and full replacement across Sarasota and Manatee County. Most doors fixed same day: 941-565-5576.",
  "icon": "door",
  "summary": "Sliding and swing doors that stick, sag or blow open — rehung, "
             "re-wheeled, re-screened or replaced outright.",
  "quick_answer":
      "Screen door repair covers rollers, tracks, handles, closers, latches and "
      "the screen itself; replacement means a new door hung in the existing frame. "
      "Acosta Pro repairs and replaces sliding and swing screen doors throughout "
      "Sarasota, Manatee and Charlotte County, and most single-door repairs are "
      "finished in the same visit.",
  "intro": [
      "The door is the part of an enclosure that gets used a thousand times a season, "
      "so it is almost always the first thing to fail. Rollers flat-spot, tracks fill "
      "with grit, the frame racks out of square, and eventually the door either will "
      "not close or will not stay closed — which defeats the entire enclosure.",
      "We repair and replace sliding screen doors, swing (hinged) lanai doors, pool "
      "cage doors and front-entry screen doors. In most cases a repair is the right "
      "call and we will say so. When a frame is bent past straightening, we will tell "
      "you that instead of charging you twice.",
  ],
  "signals_title": "Common screen door problems we fix",
  "signals": [
      "Door drags, sticks or takes two hands to slide",
      "Door jumps the track or falls out when opened",
      "Torn or bulging screen, or spline coming out of the channel",
      "Door will not latch, or swings back open on its own",
      "Broken closer, missing handle, or a latch that misses the keeper",
      "Bottom rail bent or kicked in at pet height",
  ],
  "includes_title": "What we repair and install",
  "includes": [
      "Sliding screen door rollers, tracks, guides and frames",
      "Swing and hinged lanai / pool cage doors",
      "Full door replacement, built to fit the existing opening",
      "Re-screening in standard, no-see-um or pet-resistant mesh",
      "Closers, latches, handles, hinges and keepers",
      "Pet doors installed into new or existing screen doors",
      "Door realignment and square-up after frame settling",
  ],
  "table_title": "Repair or replace? How we decide",
  "table_intro": "This is the judgement call we make on almost every door visit.",
  "table_head": ["Symptom", "Usual fix", "Typical turnaround"],
  "table_rows": [
      ["Door drags or sticks", "New rollers and track cleaning or track cap", "Same visit"],
      ["Torn screen, frame straight", "Re-screen in place", "Same visit"],
      ["Will not latch or stay shut", "New latch, keeper or closer adjustment", "Same visit"],
      ["Door falls out of the track", "New rollers plus top guide, or new track", "Same visit"],
      ["Frame bent or racked out of square", "Replacement door", "Order, then 1 visit"],
      ["Corroded frame corners pulling apart", "Replacement door", "Order, then 1 visit"],
  ],
  "process_title": "How a door call runs",
  "process": [
      ("Call or request an estimate", "Describe the door — sliding or swing, and what it "
       "is doing. We can usually tell you on the phone what is likely involved."),
      ("On-site diagnosis", "We check rollers, track, frame square and hardware rather "
       "than guessing from the symptom."),
      ("Repair on the spot where possible", "We carry common rollers, spline, screen and "
       "hardware, so most repairs finish that visit."),
      ("Or measure for replacement", "If the frame is done, we measure the opening and "
       "build or order a door to fit."),
      ("Test and adjust", "We open and close it a dozen times, adjust the closer, and make "
       "sure it latches every time."),
  ],
  "cost_title": "What affects screen door pricing",
  "cost_intro": "Door work is quoted per door. These are the variables:",
  "cost_head": ["Factor", "Why it matters"],
  "cost_rows": [
      ["Repair vs. replacement", "A roller-and-screen repair is a fraction of the cost "
       "of a new door."],
      ["Door type", "Sliding doors, swing lanai doors and cage doors use different "
       "hardware and framing."],
      ["Screen selection", "Pet-resistant mesh on a door costs more but is usually worth "
       "it on the one panel a dog pushes on."],
      ["Hardware", "Closers, latch sets, handles and pet doors are quoted as line items."],
      ["Number of doors", "Doing two or three doors in one visit costs less per door than "
       "separate trips."],
  ],
  "faqs": [
      ("Can you fix a sliding screen door that keeps coming off the track?",
       "Yes, and it is one of the most common calls we get. It is almost always worn "
       "rollers, a damaged top guide, or a track that has been crushed — all repairable "
       "without replacing the door."),
      ("Can a screen door be re-screened, or do I need a new one?",
       "If the frame is straight and the corners are tight, re-screening is the right "
       "call and costs far less. We only recommend replacement when the frame is bent, "
       "racked or corroding apart at the corners."),
      ("Do you install pet doors in screen doors?",
       "Yes. We install pet doors into new or existing screen doors and pair them with "
       "pet-resistant mesh on that panel, which is what stops the tearing that led to "
       "the pet door in the first place."),
      ("How fast can you get out for a door that will not close?",
       "A door that will not latch lets every insect in the yard into the enclosure, so "
       "we treat it as urgent. Call 941-565-5576 and we will get you on the schedule "
       "quickly, often within a day or two."),
      ("Do you carry parts with you?",
       "We stock common rollers, spline, screen, latches and closers on the truck, which "
       "is why most repairs are finished on the first visit rather than after a parts "
       "order."),
  ],
  "related": ["lanai-patio-screen-enclosures", "pool-cage-rescreening",
              "window-screen-repair"],
},
{
  "slug": "window-screen-repair",
  "nav": "Window Screens",
  "h1": "Window Screen Repair &amp; Replacement",
  "meta_title": "Window Screen Repair & Replacement | Sarasota FL | Acosta Pro",
  "meta_desc": "Torn window screens rebuilt or replaced, custom-fit to your openings, across Sarasota and Manatee County. Whole-house pricing: 941-565-5576.",
  "icon": "window",
  "summary": "Torn, sagging or missing window screens rebuilt to fit — one window "
             "or every window in the house.",
  "quick_answer":
      "Window screen repair means re-screening the existing frame; replacement "
      "means building a new frame cut to your window opening. Acosta Pro does both "
      "throughout Sarasota, Manatee and Charlotte County, custom-fitting every "
      "screen on site, and whole-house jobs are usually completed in a single "
      "visit.",
  "intro": [
      "Window screens are the cheapest thing on a house to fix and the easiest thing "
      "to put off. But a torn screen is an open window as far as insects are concerned, "
      "and a missing one means the window simply does not get opened — which is a real "
      "loss on the twenty-odd perfect-weather weeks Southwest Florida gets.",
      "We rebuild and replace window screens for houses, condos and rentals. Frames "
      "are cut and cornered to your exact opening, so screens fit and stay put instead "
      "of rattling loose in the track.",
  ],
  "signals_title": "When a window screen needs attention",
  "signals": [
      "Tears, holes or a screen pushed out of its frame",
      "Screen sags away from the frame or ripples in the wind",
      "Frame is bent, twisted, or missing corner keys",
      "Screen falls out of the window track",
      "Sun-rotted mesh that crumbles when touched",
      "Windows with no screens at all after a move or a storm",
  ],
  "includes_title": "What we handle",
  "includes": [
      "Re-screening existing window frames in place",
      "New custom-built frames cut to your opening",
      "Whole-house and whole-building screen replacement",
      "Solar / shade screen for hot west-facing windows",
      "Pet-resistant mesh on ground-floor windows",
      "Sliding glass door screens and screen tracks",
      "Rental turnover and pre-sale screen replacement",
  ],
  "table_title": "Window screen mesh options",
  "table_intro": "Same frame, different mesh. What you put in it depends on the window.",
  "table_head": ["Mesh", "Effect", "Best window for it"],
  "table_rows": [
      ["18/16 standard fiberglass", "Standard insect protection, clear view",
       "Most windows in the house"],
      ["20/20 no-see-um", "Stops sand flies and midges", "Waterfront and canal-side windows"],
      ["Pet-resistant polyester", "Resists claws and pushing", "Ground-floor and pet-height windows"],
      ["Solar screen (80–90%)", "Cuts heat and glare through the glass",
       "West and south-facing windows"],
      ["Aluminum mesh", "Rigid and long-lived, slight sheen", "Windows that take repeated contact"],
  ],
  "process_title": "How window screen work runs",
  "process": [
      ("Count and quote", "Tell us roughly how many windows. We confirm on site and price "
       "per screen, with better pricing on whole-house jobs."),
      ("Measure each opening", "No two windows in a Florida house are reliably the same. "
       "Every screen is measured individually."),
      ("Build or re-screen", "Frames are cut, cornered and splined on site so there is no "
       "second trip."),
      ("Fit and check", "Every screen goes back in its own opening and gets checked for "
       "fit and tension."),
  ],
  "cost_title": "What affects window screen pricing",
  "cost_intro": "Window screens are priced per screen, so the count matters most:",
  "cost_head": ["Factor", "Why it matters"],
  "cost_rows": [
      ["Number of screens", "Whole-house jobs cost less per screen than a single window."],
      ["Re-screen vs. new frame", "Reusing a straight frame is cheaper than building a new one."],
      ["Screen size", "Large picture and slider screens use more material and need heavier frames."],
      ["Mesh type", "Solar and pet-resistant mesh cost more per square foot."],
      ["Access", "Second-story windows that need a ladder set take longer."],
  ],
  "faqs": [
      ("Can you repair a window screen or do I need a whole new one?",
       "If the frame is straight and the corners are intact, we re-screen it — that is "
       "cheaper and just as durable. A bent or broken frame gets replaced with one cut "
       "to the same opening."),
      ("Do you do whole-house window screen replacement?",
       "Yes, and it is the most cost-effective way to buy screens. Doing every window in "
       "one visit brings the per-screen price down substantially versus one-off calls."),
      ("Can you make screens for windows that never had them?",
       "Yes. We measure the opening and build frames to fit. Older Florida homes and "
       "post-renovation windows often need this."),
      ("Do solar screens really lower cooling costs?",
       "Solar screens block 80–90% of the sun's heat before it reaches the glass, so on "
       "west and south-facing windows they make a noticeable difference to how hard the "
       "A/C works in the afternoon. They do darken the room."),
      ("Do you work with property managers and rentals?",
       "Yes. Rental turnovers and pre-sale screen replacement are routine for us, and we "
       "can handle multiple units in one scheduled visit."),
  ],
  "related": ["screen-door-repair-installation", "lanai-patio-screen-enclosures",
              "hurricane-storm-screen-repair"],
},
{
  "slug": "hurricane-storm-screen-repair",
  "nav": "Storm Damage Repair",
  "h1": "Hurricane &amp; Storm Screen Damage Repair",
  "meta_title": "Storm & Hurricane Screen Repair | Sarasota FL | Acosta Pro",
  "meta_desc": "Fast post-storm pool cage and lanai screen repair in Sarasota, Manatee and Charlotte County. Blown panels, bent frames, insurance photos: 941-565-5576.",
  "icon": "storm",
  "summary": "Blown panels, bent frames and torn cages after a storm — documented, "
             "quoted and put back the way it was.",
  "quick_answer":
      "Storm screen damage repair covers blown-out panels, bent or separated frame "
      "members and torn mesh after a hurricane or severe thunderstorm. Acosta Pro "
      "responds throughout Sarasota, Manatee and Charlotte County, photographs the "
      "damage for your insurance claim, and repairs panel by panel rather than "
      "replacing a cage that can be saved.",
  "intro": [
      "Screen enclosures are designed to give way before the roof does — the mesh "
      "blowing out is the structure doing its job. That is small comfort the morning "
      "after, when the cage is open to the yard and the pool is full of leaves.",
      "We handle post-storm screen repair across Southwest Florida: blown panels, "
      "torn mesh, bent members, popped spline and separated connections. We also "
      "photograph and itemize the damage in a form your insurer will accept, because "
      "a documented estimate is usually the difference between a claim being paid and "
      "a claim being argued.",
  ],
  "signals_title": "Post-storm damage we repair",
  "signals": [
      "Blown-out or missing screen panels",
      "Long tears from branches or flying debris",
      "Bent, bowed or twisted frame members",
      "Screws pulled out and connections separated at the corners",
      "Doors racked out of square or torn off their track",
      "Kick plates dented in or missing",
  ],
  "includes_title": "What storm repair includes",
  "includes": [
      "Same-week assessment and written estimate in most cases",
      "Photo documentation of every damaged panel and member for your claim",
      "Panel-by-panel screen replacement",
      "Frame member straightening or replacement",
      "Re-fastening and re-anchoring separated connections",
      "Door repair or replacement",
      "Debris removal from the enclosure and deck",
  ],
  "table_title": "Storm damage triage",
  "table_intro": "Not all storm damage is equally urgent. This is how we prioritize:",
  "table_head": ["Damage", "Urgency", "Typical repair"],
  "table_rows": [
      ["One or two blown panels", "Low — cosmetic and insect entry", "Panel replacement"],
      ["Door torn off or racked", "High — enclosure is effectively open", "Door repair or replacement"],
      ["Multiple panels gone, frame intact", "Medium", "Partial or full rescreen"],
      ["Bent or bowed frame members", "High — loads the rest of the structure",
       "Member straightening or replacement"],
      ["Connections separated at corners", "High — structural", "Re-fasten and re-anchor"],
      ["Cage collapsed or leaning", "Immediate — keep clear", "Assessment before any repair"],
  ],
  "process_title": "After the storm, in order",
  "process": [
      ("Stay clear and photograph", "Before anything else, take your own wide and close "
       "photos of the damage. Do not climb on a compromised cage."),
      ("Call us for an assessment", "We come out, walk the structure, and tell you honestly "
       "whether it is a repair or a rebuild."),
      ("Documented estimate", "You get an itemized, photographed estimate you can hand "
       "straight to your insurance adjuster."),
      ("Repair", "Panels, members, fasteners and doors, in the order that gets the "
       "enclosure closed up fastest."),
      ("Final walkthrough", "We confirm every item on the estimate was addressed before "
       "we call it complete."),
  ],
  "cost_title": "What affects storm repair pricing",
  "cost_intro": "Storm work is quoted from the damage, not from a rate sheet:",
  "cost_head": ["Factor", "Why it matters"],
  "cost_rows": [
      ["Panels affected", "A two-panel repair and a full rescreen are very different jobs."],
      ["Frame damage", "Straightening or replacing aluminum members is the largest single "
       "cost driver."],
      ["Structural assessment", "A leaning or partially collapsed cage may need engineering "
       "review before repair."],
      ["Debris and cleanup", "Branches and debris inside the enclosure add time before "
       "screening can start."],
      ["Scheduling pressure", "In the weeks after a named storm every screen company in "
       "the county is booked — earlier calls get earlier dates."],
  ],
  "faqs": [
      ("Does homeowners insurance cover pool cage screen damage?",
       "Many Florida policies cover screen enclosure damage from a named storm, often "
       "with a separate hurricane deductible, but coverage varies widely and some "
       "policies exclude screen entirely. Check your declarations page, and use our "
       "photographed itemized estimate when you file."),
      ("How soon can you come out after a storm?",
       "We aim for a same-week assessment. Demand spikes hard after a named storm, so "
       "call as early as you can — 941-565-5576 or 941-879-4211."),
      ("Should I repair the cage myself before the adjuster sees it?",
       "No. Photograph everything and leave it as it is until it has been documented. "
       "Temporary measures to prevent further damage are fine, but keep the receipts and "
       "the before photos."),
      ("Can a bent pool cage frame be repaired, or does it need replacing?",
       "It depends on how far it has gone. Minor bowing in a single member can often be "
       "straightened or that member swapped out. A cage that is leaning or has separated "
       "at multiple connections needs a structural assessment first."),
      ("Do you provide estimates for insurance claims?",
       "Yes. We provide written, itemized, photo-documented estimates specifically "
       "formatted for insurance adjusters, at no cost."),
  ],
  "related": ["pool-cage-rescreening", "lanai-patio-screen-enclosures",
              "aluminum-structures-railings"],
},
{
  "slug": "aluminum-structures-railings",
  "nav": "Aluminum Structures",
  "h1": "Aluminum Structures, Railings &amp; Frame Work",
  "meta_title": "Aluminum Railings & Frame Repair | Sarasota FL | Acosta Pro",
  "meta_desc": "Aluminum railings, screen room framing, kick plates and frame repair across Sarasota and Manatee County. Powder-coated, corrosion-resistant: 941-565-5576.",
  "icon": "frame",
  "summary": "The aluminum itself — railings, framing, kick plates and the frame "
             "repairs that keep an enclosure square.",
  "quick_answer":
      "Beyond screen, Acosta Pro fabricates and repairs the aluminum: enclosure "
      "framing, handrails and guardrails, kick plates, posts and beams. Aluminum is "
      "used throughout coastal Florida because it does not rust the way steel does "
      "and needs no repainting the way wood does. All work is quoted free on site.",
  "intro": [
      "Screen gets the attention, but the aluminum underneath it is what decides "
      "whether an enclosure lasts fifteen years or thirty. Frames rack, fasteners "
      "corrode and weep rust stains down the members, and kick plates take the "
      "beating from mowers, pets and furniture.",
      "We work the metal as well as the mesh: replacing corroded fasteners, "
      "straightening and swapping bent members, fabricating kick plates, and "
      "installing aluminum handrails and guardrails around pool decks, steps and "
      "raised patios.",
  ],
  "signals_title": "Aluminum work we take on",
  "signals": [
      "Rust-streaked, weeping or backed-out screws throughout a frame",
      "Bent, bowed or dented frame members",
      "Loose or separated connections at corners and posts",
      "Missing, dented or mismatched kick plates",
      "Handrails that wobble, or steps with no rail at all",
      "Frames that need color-matching to an existing structure",
  ],
  "includes_title": "What we fabricate and install",
  "includes": [
      "Aluminum enclosure framing — posts, beams, headers and uprights",
      "Handrails and guardrails for pool decks, steps and raised patios",
      "Kick plates and lower solid panels, cut and fitted on site",
      "Full fastener replacement in stainless or coated screws",
      "Frame straightening, member replacement and re-anchoring",
      "Color-matched aluminum in white, bronze and standard powder-coat finishes",
  ],
  "table_title": "Why aluminum in coastal Florida",
  "table_intro": "This is the comparison that decides most of these jobs:",
  "table_head": ["Material", "Corrosion in salt air", "Maintenance", "Verdict here"],
  "table_rows": [
      ["Powder-coated aluminum", "Highly resistant", "Rinse occasionally",
       "The standard for SW Florida enclosures"],
      ["Galvanized steel", "Rusts at every cut and scratch", "Repaint and treat",
       "Not worth it near the coast"],
      ["Pressure-treated wood", "Rots and attracts insects", "Seal and repaint every few years",
       "High upkeep in this climate"],
      ["Vinyl / PVC rail", "No corrosion", "Low", "Fine for rails, not for structure"],
  ],
  "process_title": "How aluminum work runs",
  "process": [
      ("Assessment", "We look at the whole structure, not just the part that failed — "
       "corroded fasteners in one corner usually mean the same in three others."),
      ("Written quote", "Itemized by member, fastener count and rail footage so you can "
       "see exactly what you are paying for."),
      ("Fabrication", "Kick plates, rails and members cut and prepped to the measurements "
       "we took."),
      ("Install", "Anchored, fastened and squared, with the surrounding screen re-splined "
       "wherever we had to disturb it."),
      ("Walkthrough", "Rails get pushed on, doors get opened, frames get checked for square."),
  ],
  "cost_title": "What affects aluminum work pricing",
  "cost_intro": "Metal work is quoted by member and by linear foot:",
  "cost_head": ["Factor", "Why it matters"],
  "cost_rows": [
      ["Linear footage of rail", "Handrails and guardrails are priced by the foot plus posts."],
      ["Number of members replaced", "Each post, beam or upright is material plus labor plus "
       "re-screening around it."],
      ["Finish and color match", "Bronze and custom powder-coat colors cost more than "
       "standard white and may need ordering."],
      ["Height and access", "Two-story and high-hip work needs lifts and takes longer."],
      ["Re-screening after", "Any panel we disturb to reach a member gets re-splined or "
       "re-screened."],
  ],
  "faqs": [
      ("Do you replace just the screws on a pool cage?",
       "Yes — a full fastener replacement is a real service and often the highest-value "
       "thing you can do for an older cage. Corroded screws are what let frames loosen "
       "and what causes those rust streaks down the members."),
      ("Can you match my existing frame color?",
       "In most cases yes. White and bronze are stocked; other powder-coat colors can "
       "usually be ordered. We check the match in daylight against your existing frame "
       "before we install."),
      ("Do you install aluminum handrails around pool decks and steps?",
       "Yes. Aluminum rail is the right material here — it does not rust like steel or rot "
       "like wood, and powder-coated finishes hold up to salt air with almost no upkeep."),
      ("Is a bent frame member dangerous?",
       "It can be. A bent member is no longer carrying its share of the load, which pushes "
       "that load onto its neighbors. It is worth having looked at rather than left, "
       "especially before storm season."),
      ("Do you do the screen work too, or just the metal?",
       "Both, and that is the advantage — you are not coordinating a metal contractor and "
       "a screen contractor. We put the panels back the same day we finish the frame."),
  ],
  "related": ["pool-cage-rescreening", "lanai-patio-screen-enclosures",
              "hurricane-storm-screen-repair"],
},
]

SERVICE_BY_SLUG = {s["slug"]: s for s in SERVICES}
