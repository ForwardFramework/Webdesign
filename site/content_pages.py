"""Site-wide FAQ bank, gallery manifest, differentiators and process copy."""

# --------------------------------------------------------------------------
# FAQ bank. `home` entries also render on the homepage; everything renders on
# /faq/. Answers lead with a direct, self-contained first sentence — that is the
# sentence an AI answer engine extracts, and it has to stand alone without the
# question next to it.
# --------------------------------------------------------------------------
FAQ_GROUPS = [
 ("Getting started", [
   ("How much does it cost to rescreen a pool cage or lanai?",
    "Pool cage and lanai rescreening is priced per panel, so the cost depends mostly on "
    "how many panels your enclosure has, how tall it is, and which mesh you choose. "
    "Rather than quote a range that will not match your cage, Acosta Pro measures on "
    "site and gives you a written price for free. Call 941-565-5576 to book one.", True),
   ("Do you charge for estimates?",
    "No. Estimates are free and there is no obligation. We come out, measure, look at "
    "the frame, doors and hardware, and leave you with a written price you can compare "
    "against anyone else's.", True),
   ("How fast can you get out to look at a job?",
    "Most estimates are scheduled within a few days, and urgent problems — a door that "
    "will not close, a blown-out panel — get prioritized. Call 941-565-5576 or "
    "941-879-4211 and we will tell you honestly what our schedule looks like.", True),
   ("What areas do you serve?",
    "Acosta Pro serves Sarasota, Manatee and Charlotte County, Florida — including "
    "Sarasota, Bradenton, Venice, North Port, Port Charlotte, Punta Gorda, Lakewood "
    "Ranch, Englewood, Osprey, Nokomis and Palmetto. If you are near the edge of that "
    "area, call and ask.", True),
   ("Do you speak Spanish?",
    "Yes. Our crew works in both English and Spanish, so you can call, get your estimate "
    "and go through the job in whichever you prefer.", True),
 ]),
 ("Screen and materials", [
   ("How long does screen last in Southwest Florida?",
    "Standard fiberglass screen lasts about 5 to 7 years in Southwest Florida. UV, salt "
    "air and heat break the mesh down faster here than almost anywhere else in the "
    "country. Pet-resistant screen typically runs 8 to 12 years, and Florida Glass "
    "longer still.", True),
   ("What is the difference between 18/14 and 20/20 screen?",
    "The numbers are the mesh count per inch. 18/14 is standard insect screen and stops "
    "mosquitoes and flies. 20/20 is a tighter weave that also stops no-see-ums — the "
    "sand flies and midges that come off the water at dusk. 20/20 costs a little more "
    "and reduces airflow slightly.", True),
   ("Is pet-resistant screen worth it?",
    "On the panels a dog or cat can actually reach, yes — it is roughly seven times "
    "stronger than standard mesh and will outlast several standard rescreens in that "
    "spot. On upper panels it is money spent for no benefit, which is why we usually "
    "spec it only on lower panels and doors.", True),
   ("What is Florida Glass?",
    "Florida Glass is insect screen laminated to a clear or tinted vinyl sheet. It "
    "blocks wind, rain, dirt and sightlines while staying rigid, which makes it ideal "
    "for kick panels and privacy screening. It does block airflow, so it is not used "
    "for a whole enclosure.", False),
   ("Can solar screen lower my cooling bill?",
    "Solar shade screen blocks 80 to 90 percent of the sun's heat before it reaches the "
    "glass or the enclosure, which noticeably reduces afternoon heat load on west and "
    "south-facing exposures. It darkens the space, so it is a trade-off worth making on "
    "some sides of a house and not others.", False),
   ("Can you match my existing screen and frame color?",
    "In most cases yes. Frame colors are commonly white or bronze and we stock both; "
    "other powder-coat colors can usually be ordered. We check any match in daylight "
    "against your existing structure before installing.", False),
 ]),
 ("Scheduling and the job itself", [
   ("How long does a typical job take?",
    "A lanai rescreen is usually one day. A full pool cage rescreen is one to two days. "
    "Single-panel repairs, door repairs and window screens are most often finished in "
    "the same visit.", True),
   ("Do I need to be home while you work?",
    "Not for the whole job, though we do like you there at the start so we can confirm "
    "the scope and at the end for the walkthrough. If you cannot be, we will arrange "
    "access and send you photos as we go.", False),
   ("Will you clean up afterwards?",
    "Yes, and our customers mention it more than anything else. Old screen, spline, "
    "screws and offcuts all leave with us, and the deck gets swept and blown before we "
    "do.", True),
   ("Do I need to move my patio furniture?",
    "If you can move furniture, grills and potted plants a few feet clear of the screen "
    "walls before we arrive, it speeds the job up. If you cannot, tell us — we will move "
    "it and put it back.", False),
   ("Do you need a permit for screen work?",
    "Rescreening an existing enclosure does not normally require a permit. Building a "
    "new screen enclosure is a structure and generally does require a county permit and "
    "engineering. We tell you which applies to your job before you commit to anything.", True),
 ]),
 ("Paying and warranty", [
   ("What payment methods do you accept?",
    "We accept cash, check, major credit cards and Zelle. Payment terms are set out on "
    "your written estimate before any work begins.", False),
   ("Do you require a deposit?",
    "For material-heavy jobs like a new enclosure or a full rescreen we take a deposit "
    "to cover materials, with the balance due on completion. Small repairs are usually "
    "paid on completion. It is always spelled out on the estimate.", False),
   ("Are you licensed and insured?",
    "Yes. We are happy to provide current license and liability insurance documentation "
    "with your estimate — ask for it, and never hire any screen contractor in Florida "
    "who cannot produce it.", True),
   ("Do you warranty your work?",
    "Yes. Workmanship is warrantied, and screen and hardware carry their manufacturers' "
    "warranties. The specific terms for your job are written on your estimate so there "
    "is no ambiguity later.", True),
 ]),
]

def home_faqs():
    out = []
    for _group, items in FAQ_GROUPS:
        for q, a, on_home in items:
            if on_home:
                out.append((q, a))
    return out[:8]

def all_faqs():
    return [(q, a) for _g, items in FAQ_GROUPS for (q, a, _h) in items]

# --------------------------------------------------------------------------
# Gallery. Drop real photos into site/static/img/gallery/ using EXACTLY these
# filenames and the site picks them up with no code change. Alt text is written
# for humans first and search second — describe the work, name the place.
# --------------------------------------------------------------------------
GALLERY = [
 ("pool-cage-rescreen-01.jpg", "Pool cage rescreened with new 20/20 no-see-um mesh on a Sarasota home", "Pool Cage Rescreening", "pool-cage-rescreening"),
 ("pool-cage-rescreen-02.jpg", "Full pool enclosure rescreen completed in Bradenton, Florida", "Pool Cage Rescreening", "pool-cage-rescreening"),
 ("pool-cage-rescreen-03.jpg", "Two-story pool cage with new screen panels and replaced fasteners", "Pool Cage Rescreening", "pool-cage-rescreening"),
 ("lanai-enclosure-01.jpg", "Lanai screen enclosure rescreened and fitted with new aluminum kick plates", "Lanai & Patio", "lanai-patio-screen-enclosures"),
 ("lanai-enclosure-02.jpg", "New screened patio enclosure built over an existing covered porch", "Lanai & Patio", "lanai-patio-screen-enclosures"),
 ("lanai-enclosure-03.jpg", "Lanai rescreen in progress showing new spline and tensioned panels", "Lanai & Patio", "lanai-patio-screen-enclosures"),
 ("screen-door-01.jpg", "New sliding screen door installed on a Venice lanai", "Screen Doors", "screen-door-repair-installation"),
 ("screen-door-02.jpg", "Swing screen door rebuilt with pet-resistant mesh and a new closer", "Screen Doors", "screen-door-repair-installation"),
 ("window-screen-01.jpg", "Custom-built window screens fitted throughout a North Port home", "Window Screens", "window-screen-repair"),
 ("storm-repair-01.jpg", "Storm-damaged pool cage panels replaced after a Gulf Coast hurricane", "Storm Damage", "hurricane-storm-screen-repair"),
 ("storm-repair-02.jpg", "Bent aluminum frame member replaced following storm damage in Port Charlotte", "Storm Damage", "hurricane-storm-screen-repair"),
 ("aluminum-work-01.jpg", "Powder-coated aluminum handrail installed alongside a screened pool deck", "Aluminum Work", "aluminum-structures-railings"),
]

# --------------------------------------------------------------------------
# Why-choose-us. Every claim here has to be one you can defend on the phone.
# --------------------------------------------------------------------------
DIFFERENTIATORS = [
 ("star", "5.0 stars across every review",
  "Fourteen Google reviews, every one of them five stars. Not a single customer has "
  "written anything else."),
 ("broom", "We leave the deck cleaner than we found it",
  "Old screen, spline, screws and offcuts leave with us. Customers mention this more "
  "than anything else, which tells you something about the industry."),
 ("clock", "On time, and finished when we said",
  "Most lanais are done in a day and most cages in two. If something changes, you hear "
  "it from us before you notice it yourself."),
 ("badge", "Licensed, insured and local",
  "We work Sarasota, Manatee and Charlotte County only. You are not waiting on a crew "
  "driving down from Tampa."),
 ("chat", "English and Spanish",
  "Se habla español. The whole job — estimate, questions, walkthrough — in whichever "
  "language you would rather use."),
 ("tag", "Straight pricing, written down",
  "Free on-site estimate, itemized in writing, no charge for the visit and no pressure "
  "at the end of it."),
]

PROCESS = [
 ("Call or request a quote",
  "Reach us at 941-565-5576 or 941-879-4211, or send the form. Tell us what is wrong "
  "and roughly how big the enclosure is."),
 ("Free on-site estimate",
  "We come out, measure, check the frame, doors and hardware, and hand you a written, "
  "itemized price. No charge, no obligation."),
 ("Pick your screen and date",
  "We walk you through mesh options for each side of the enclosure and book a start "
  "date, usually within the week."),
 ("We do the work — and clean up",
  "Same crew, start to finish. Every scrap of old screen and every screw leaves with "
  "us, and we walk the job with you before we go."),
]
