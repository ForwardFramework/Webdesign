#!/usr/bin/env python3
"""Static-site generator for angelshandpainting.com.

Every HTML file in the repo root is produced from this script so that the
header, footer, schema markup and CTAs stay identical across ~30 pages.

    python3 tools/build_site.py          # writes the site
    SITE_URL=https://example.com python3 tools/build_site.py

Edit the data blocks below (BUSINESS, SERVICES, AREAS, REVIEWS, FAQS) and
re-run — do not hand-edit the generated .html files, they get overwritten.
"""
import html
import os
import re
import shutil
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --------------------------------------------------------------------------- config
SITE = os.environ.get("SITE_URL", "https://angelshandpainting.com").rstrip("/")

BUSINESS = {
    "name": "Angel's Hand Painting LLC",
    "short": "Angel's Hand Painting",
    "tagline": "Quality You Can See. Details You Can Trust.",
    "phone_display": "941-405-2750",
    "phone_link": "+19414052750",
    "city": "Sarasota",
    "region": "FL",
    "region_long": "Florida",
    "postal": "34232",
    "country": "US",
    "lat": "27.3364",
    "lon": "-82.5307",
    "hours": "Mon-Sat 7:00am - 6:00pm",
    "instagram": "https://www.instagram.com/angelshandpaintingllc/",
    "facebook": "https://www.facebook.com/angelshandpaintingllc",
    "google": "https://www.google.com/search?q=Angel%27s+Hand+Painting+LLC+Sarasota",
    "founded": "2023",
}

# Where the estimate form posts. Empty string = normal form POST to `action`
# (that is what Netlify Forms needs). Put a Formspree/Basin/Zapier URL here to
# have the form submit over fetch() instead.
FORM_ENDPOINT = ""
FORM_ACTION = "/thank-you.html"

REVIEW_COUNT = 7
RATING = "5.0"

# --------------------------------------------------------------------------- icons
def icon(name, cls=""):
    p = ICONS.get(name, ICONS["check"])
    c = ' class="%s"' % cls if cls else ""
    return ('<svg%s viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" '
            'focusable="false">%s</svg>' % (c, p))


def solid(name, cls=""):
    c = ' class="%s"' % cls if cls else ""
    return ('<svg%s viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" '
            'focusable="false">%s</svg>' % (c, SOLID[name]))


ICONS = {
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.3l2.4 2.4 4.6-4.9"/>',
    "phone": '<path d="M6.6 3.5 9 3.9a1.5 1.5 0 0 1 1.2 1.1l.6 2.4a1.5 1.5 0 0 1-.5 1.5l-1.4 1.2a12 12 0 0 0 5 5l1.2-1.4a1.5 1.5 0 0 1 1.5-.5l2.4.6A1.5 1.5 0 0 1 20.1 15l.4 2.4a1.6 1.6 0 0 1-1.6 1.9A15.9 15.9 0 0 1 3.2 5.1a1.6 1.6 0 0 1 1.9-1.6z"/>',
    "pin": '<path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 7.3 5.2a1.4 1.4 0 0 0 1.6 0L20 7"/>',
    "shield": '<path d="M12 3 5 6v5.5c0 4.3 2.9 7.7 7 9.5 4.1-1.8 7-5.2 7-9.5V6z"/><path d="m9 12 2.2 2.2L15.4 10"/>',
    "handshake": '<path d="m11 7 1.6-1.3a2 2 0 0 1 2.4 0L20 9.4"/><path d="M20 9.4v4.4l-2.6 2.5a1.5 1.5 0 0 1-2.1 0l-.7-.7"/><path d="m14.6 15.6-1.7 1.7a1.5 1.5 0 0 1-2.1 0l-.6-.6"/><path d="m10.2 16.7-1.1 1a1.5 1.5 0 0 1-2.1-2.1l1-1"/><path d="M4 9.4 8.9 5.7a2 2 0 0 1 2.3 0L13 7l-3.6 3a1.4 1.4 0 0 0 0 2 1.4 1.4 0 0 0 1.9 0"/><path d="M4 9.4v4.4l2.3 2.2"/>',
    "ribbon": '<circle cx="12" cy="9" r="5.5"/><path d="M9 13.6 7.5 21l4.5-2.4 4.5 2.4-1.5-7.4"/>',
    "roller": '<rect x="3.5" y="4" width="13" height="5.5" rx="1.5"/><path d="M16.5 6.7h3a1 1 0 0 1 1 1v3.6a1 1 0 0 1-1 1h-7a1 1 0 0 0-1 1V15"/><rect x="10" y="15" width="4" height="5.5" rx="1.4"/>',
    "brush": '<path d="M5 15.5 15.6 4.9a2.2 2.2 0 0 1 3.1 3.1L8.1 18.6"/><path d="M8.1 18.6a3 3 0 0 1-4.2 0"/><path d="M3.9 18.6c1-1 .4-3.1 0-4.1 1.6-.4 3.2.5 4.2 1.5s1 2.4.6 3.2"/>',
    "house": '<path d="M4 10.5 12 4l8 6.5"/><path d="M6 9.8V20h12V9.8"/><rect x="10" y="13" width="4" height="7"/>',
    "spray": '<rect x="7" y="8" width="8" height="12.5" rx="2"/><path d="M9.5 8V5.5A1.5 1.5 0 0 1 11 4h1.6"/><path d="M17 5h2M17 8h2.5M18 11h1.6"/><path d="M8 12h6"/>',
    "trowel": '<path d="M3.6 12.6 11 5.2a2 2 0 0 1 2.8 0l4 4a2 2 0 0 1 0 2.8L10.4 19.4a1.4 1.4 0 0 1-2 0l-4.8-4.8a1.4 1.4 0 0 1 0-2z"/><path d="m14.5 8.6 4.6-4.6"/>',
    "ceiling": '<path d="M3 5h18"/><path d="M5.5 5v3M9.5 5v5M14.5 5v4M18.5 5v3"/><path d="M4 20h16"/><path d="M8 16.5h8"/>',
    "wallpaper": '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8 8.5h.01M12 8.5h.01M16 8.5h.01M8 12h.01M12 12h.01M16 12h.01M8 15.5h.01M12 15.5h.01M16 15.5h.01"/>',
    "washer": '<path d="M5 20h6l-1-5H6z"/><path d="M9.5 15V9a3 3 0 0 1 3-3h1"/><path d="M13.5 6h2.8a1.7 1.7 0 0 1 1.7 1.7V9"/><path d="M18 12.5c.9 1.1 2 2 2 3.4a2 2 0 0 1-4 0c0-1.4 1.1-2.3 2-3.4z"/>',
    "garage": '<path d="M3 10.6 12 5l9 5.6V20H3z"/><path d="M7 20v-6h10v6"/><path d="M7 17h10"/>',
    "wood": '<rect x="3" y="6" width="18" height="5" rx="1.4"/><rect x="3" y="13" width="18" height="5" rx="1.4"/><path d="M8 6v5M15 13v5"/>',
    "trim": '<path d="M3 17h18"/><path d="M3 17v-3h4l1.5-2h7L17 14h4v3"/><path d="M3 20h18"/>',
    "tools": '<path d="M14.5 6.5a3.5 3.5 0 0 1 4.6 4.4l-8.3 8.3a2 2 0 0 1-2.8-2.8l8.3-8.3"/><path d="M6.8 4.2 4 7l2.4 2.4L9.2 6.6z"/><path d="m4 7-1 3.4 2.4 2.4L8.9 12"/>',
    "star": '<path d="m12 4 2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.8 9.6 9z"/>',
    "arrow": '<path d="M5 12h13"/><path d="m12.5 6 6 6-6 6"/>',
    "calendar": '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    "clipboard": '<rect x="5" y="4.5" width="14" height="16" rx="2"/><path d="M9 4.5V3.6A1.6 1.6 0 0 1 10.6 2h2.8A1.6 1.6 0 0 1 15 3.6v.9z"/><path d="M9 11h6M9 15h4"/>',
    "sparkle": '<path d="m12 3 1.9 4.9L19 9.8l-5.1 1.9L12 17l-1.9-5.3L5 9.8l5.1-1.9z"/><path d="M18.5 15.5 19.3 18l2.2.9-2.2.9-.8 2.2-.8-2.2-2.2-.9 2.2-.9z"/>',
    "leaf": '<path d="M20 4c0 9-5.5 13.5-11.5 13.5A4.5 4.5 0 0 1 4 13C4 7.5 10.5 4 20 4z"/><path d="M4.5 20C6 15 10 11 15 8.5"/>',
}

SOLID = {
    "star": '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8z"/>',
    "facebook": '<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A20 20 0 0 0 14.4 4C12 4 10.5 5.5 10.5 8.2v2.3H8v3h2.5V21z"/>',
    "instagram": '<path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.8A5 5 0 1 0 17 12a5 5 0 0 0-5-5zm0 8.2A3.2 3.2 0 1 1 15.2 12 3.2 3.2 0 0 1 12 15.2zm6.4-8.4a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2z"/>',
    "google": '<path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2a9.7 9.7 0 0 0 3-7.3z"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5a6.1 6.1 0 0 1-9.1-3.2H3v2.6A10 10 0 0 0 12 22z"/><path d="M6.3 13.9a6 6 0 0 1 0-3.8V7.5H3a10 10 0 0 0 0 9z"/><path d="M12 6a5.4 5.4 0 0 1 3.8 1.5l2.8-2.8A9.6 9.6 0 0 0 12 2a10 10 0 0 0-9 5.5l3.3 2.6A6 6 0 0 1 12 6z"/>',
    "quote": '<path d="M9.6 5.5 7.9 8.9A4.6 4.6 0 0 0 10 17.6a4.4 4.4 0 0 0 .3-8.7l1.8-3.4zm8.4 0-1.7 3.4a4.6 4.6 0 0 0 2.1 8.7 4.4 4.4 0 0 0 .3-8.7l1.8-3.4z"/>',
}


# --------------------------------------------------------------------------- services
# Each service becomes /services/<slug>.html
SERVICES = [
    {
        "slug": "interior-painting",
        "name": "Interior Painting",
        "icon": "roller",
        "card": "Walls, ceilings, trim and doors painted with masked-off floors, cut lines you can run a finger along, and a house that is put back together every evening.",
        "title": "Interior Painting - Sarasota &amp; Bradenton",
        "desc": "Interior house painting in Sarasota, Bradenton and Lakewood Ranch. Full prep, clean cut lines, furniture protected daily. Free estimates: 941-405-2750.",
        "h1": "Interior Painting",
        "answer": "Interior painting from Angel's Hand Painting LLC covers full surface prep, patching, priming and two finish coats on walls, ceilings, trim and doors throughout Sarasota, Bradenton and Lakewood Ranch. Most single rooms are finished in one day and whole-home interiors in three to seven days, depending on square footage and how much drywall repair is needed.",
        "intro": [
            "Interior paint fails at the edges long before it fails in the field: a wavy cut line at the ceiling, a roller mark next to the switch plate, filler that flashes through the sheen. Those are prep problems, not paint problems - and prep is where our crew spends most of its time.",
            "We move and cover what stays, mask floors and fixtures, repair the drywall damage the old color was hiding, then spot-prime every patch so the finish coat reads as one even surface from wall to wall.",
        ],
        "includes_title": "What an interior job includes",
        "includes": [
            "Furniture moved to the centre of the room and covered; floors papered or dropped wall to wall",
            "Nail holes, dents, hairline cracks and old anchor holes filled and sanded flush",
            "Caulking at trim, baseboards and casing so lines stay crisp",
            "Stain-blocking primer over water marks, patches, and any drastic colour change",
            "Two finish coats of premium interior paint, brushed and rolled or sprayed and back-rolled",
            "Switch plates and outlet covers removed and reinstalled - never painted around",
            "Daily clean-up, and a walkthrough with you before we call it finished",
        ],
        "sections": [
            ("Rooms we paint most", [
                "Living rooms, family rooms and open-plan great rooms",
                "Bedrooms, nurseries and home offices",
                "Kitchens and bathrooms in scrubbable, moisture-tolerant finishes",
                "Hallways, stairwells and two-storey entryways",
                "Ceilings, crown molding, baseboards, doors and door casings",
                "Condos, rentals and turnover units on a fixed schedule",
            ]),
            ("Choosing sheen and colour", [
                "Flat and matte hide wall imperfections best - good for ceilings and low-traffic rooms",
                "Eggshell and satin clean up well and suit most living areas and bedrooms",
                "Semi-gloss holds up on trim, doors, kitchens and bathrooms",
                "Florida humidity rewards a quality acrylic with mildew resistance in wet rooms",
                "Not sure on colour? We will help you narrow it down and test samples on your own walls before a gallon is opened",
            ]),
        ],
        "faqs": [
            ("How long does it take to paint the interior of a house?",
             "A single room is usually a one-day job. A whole-home interior in Sarasota or Bradenton typically runs three to seven working days depending on square footage, ceiling height, how much trim there is, and how much patching the walls need. We give you a day count in writing with your estimate."),
            ("Do I need to move out while you paint?",
             "No. We work room by room so you keep the rest of the house, and we use low-VOC paints that are safe to be around. Everything is put back and cleaned up at the end of each day."),
            ("Do you move the furniture?",
             "Yes. We move furniture to the centre of the room and cover it. We do ask that you take down photos, mirrors and anything fragile or irreplaceable before we start."),
            ("How many coats of paint do you apply?",
             "Two finish coats over properly prepared and primed surfaces, unless we tell you otherwise before we start. One coat over a dark colour or a fresh patch will always flash - it is not a corner we cut."),
        ],
        "related": ["drywall-repair", "cabinet-painting", "trim-molding"],
    },
    {
        "slug": "exterior-painting",
        "name": "Exterior Painting",
        "icon": "house",
        "card": "Stucco, block, siding, soffits and trim washed, sealed and coated in products built for Gulf Coast sun, salt air and summer storms.",
        "title": "Exterior Painting - Sarasota &amp; Bradenton",
        "desc": "Exterior painting for stucco, block and siding homes in Sarasota and Bradenton. Pressure wash, crack repair, coastal-grade coatings. Free estimate: 941-405-2750.",
        "h1": "Exterior Painting",
        "answer": "Exterior painting on the Gulf Coast is a prep job first: pressure washing, repairing stucco cracks, sealing gaps and priming bare spots before a drop of finish paint goes on. Angel's Hand Painting LLC repaints stucco, block, hardie and wood-sided homes across Sarasota, Bradenton and Lakewood Ranch, typically in three to six days for a single-storey home.",
        "intro": [
            "Florida is hard on exterior paint. UV bleaches colour, afternoon storms drive water into hairline stucco cracks, and salt air chews at anything already failing. A repaint that skips the wash and the crack repair looks perfect for a season and then bubbles.",
            "Our exterior process is built around that: clean the substrate, fix what is open, seal it, and put down a coating rated for this climate so the finish still looks right after several summers.",
        ],
        "includes_title": "What an exterior job includes",
        "includes": [
            "Low-pressure wash of all painted surfaces to remove chalking, mildew and salt film",
            "Stucco hairline and settlement cracks cut, patched and textured to match",
            "Loose or peeling paint scraped, sanded and feathered out",
            "Gaps at windows, doors, trim and penetrations sealed with exterior-grade caulk",
            "Bare stucco, block, wood and metal spot-primed with the right primer for the surface",
            "Two coats of 100% acrylic or elastomeric coating, sprayed and back-rolled for penetration",
            "Landscaping, driveways, windows, screens and light fixtures masked and protected",
        ],
        "sections": [
            ("Surfaces we coat", [
                "Stucco and concrete block (CBS) - the two most common builds in our area",
                "Hardie board, lap siding, board and batten, and wood siding",
                "Soffits, fascia, eaves and gutters",
                "Front doors, garage doors, shutters and decorative trim",
                "Pool cages, lanais, railings and exterior stairwells",
                "Commercial storefronts, offices and multi-unit buildings",
            ]),
            ("Getting the timing right in Florida", [
                "We schedule around the afternoon storm pattern rather than fighting it",
                "Surfaces need to be dry and below the manufacturer's humidity ceiling before coating",
                "The dry season, roughly November through May, is the easiest window to book",
                "We will tell you honestly if the weather is going to cost you a day rather than rush a coat",
            ]),
        ],
        "faqs": [
            ("How often should a Florida home be repainted outside?",
             "Most stucco and block homes in Sarasota and Bradenton need a repaint every seven to ten years, and homes closer to the water or in full sun can need it sooner. Chalky colour that rubs off on your hand, hairline cracks, and paint lifting at the base are the signs it is time."),
            ("Do you pressure wash before painting?",
             "Always. We do a low-pressure wash on every exterior repaint. Painting over chalk, mildew or salt film is the single fastest way to make a good coating peel."),
            ("What is the difference between acrylic and elastomeric?",
             "A 100% acrylic coating is the standard for most homes - it breathes and holds colour well. Elastomeric is a much thicker, flexible coating that bridges hairline cracks in stucco, so we recommend it on block and stucco walls that crack repeatedly. We will tell you which one your walls actually need."),
            ("Will you paint just the trim or the front door?",
             "Yes. Trim-only, door-only and accent work are all jobs we take. It is one of the cheapest ways to make a tired elevation look cared for."),
        ],
        "related": ["pressure-washing", "drywall-repair", "epoxy-garage-floors"],
    },
    {
        "slug": "cabinet-painting",
        "name": "Cabinet Painting &amp; Refinishing",
        "icon": "brush",
        "card": "A factory-smooth finish on the kitchen you already have - degreased, sanded, bonding-primed and sprayed, for a fraction of what replacement costs.",
        "title": "Cabinet Refinishing - Sarasota, FL",
        "desc": "Kitchen cabinet painting and refinishing in Sarasota, Bradenton and Lakewood Ranch. Degreased, sanded, bonding primer, sprayed finish. Free estimate: 941-405-2750.",
        "h1": "Cabinet Painting &amp; Refinishing",
        "answer": "Cabinet refinishing keeps your existing boxes and doors and replaces only the finish. Angel's Hand Painting LLC degreases, sands, bonding-primes and sprays cabinets in a controlled setup so the result is smooth and hard-wearing. A typical Sarasota kitchen takes three to five days and costs far less than new cabinetry.",
        "intro": [
            "Cabinets are the one surface in a house that gets touched, splashed and cleaned every single day. That is why a brushed-on wall paint fails on them in months - it never bonded to the finish underneath, and it was never hard enough to start with.",
            "Refinishing done properly is a different process entirely: strip the grease, break the sheen, bond-prime, and spray a cabinet-grade coating in thin, even coats. Done that way, painted cabinets hold up to real kitchen use.",
        ],
        "includes_title": "Our cabinet refinishing process",
        "includes": [
            "Doors and drawer fronts removed, numbered and finished off-site or in a controlled setup",
            "Every surface degreased - the step that most failed cabinet jobs skipped",
            "Sanded to break the factory sheen and give the primer something to grip",
            "Dents, chips and grain filled where a smooth modern look is the goal",
            "Bonding primer over the boxes, doors, drawers and face frames",
            "Two to three sprayed finish coats in a durable cabinet enamel",
            "Kitchen sealed off with plastic and floor protection; hardware reinstalled or upgraded",
        ],
        "sections": [
            ("Refinish or replace?", [
                "Refinishing makes sense when the boxes are solid and the layout works - it is a fraction of replacement cost",
                "Solid wood, plywood and quality thermofoil doors all refinish well",
                "Water-swollen particleboard, sagging shelves or a layout you dislike are reasons to replace",
                "Changing hardware, adding soft-close hinges or swapping in new doors on old boxes are all middle-ground options",
                "We will tell you straight if your cabinets are not worth refinishing",
            ]),
            ("Beyond the kitchen", [
                "Bathroom vanities",
                "Built-ins, bookcases and entertainment centres",
                "Laundry and mudroom cabinetry",
                "Office and garage storage cabinets",
                "Wood staining or clear-coating if you would rather keep the grain",
            ]),
        ],
        "faqs": [
            ("How long does cabinet painting take?",
             "Most kitchens take three to five working days from masking to reinstalled doors. You keep use of the boxes for much of that time - only the final reassembly needs the kitchen clear."),
            ("How much cheaper is refinishing than new cabinets?",
             "Refinishing usually lands at a small fraction of the cost of replacing cabinetry, because you keep the boxes, the countertops and the layout. We will price both paths honestly if you are weighing them."),
            ("Will painted cabinets chip?",
             "Not if the prep is right. Chipping comes from paint applied over grease or a glossy factory finish with no bonding primer. We degrease, sand and bond-prime every job, and we use a cabinet-grade enamel rather than wall paint."),
            ("Can you match a specific colour or a two-tone kitchen?",
             "Yes. Two-tone kitchens - a different colour on the island or the lowers - are one of the most popular requests we get, and any colour can be matched."),
        ],
        "related": ["wood-staining", "interior-painting", "trim-molding"],
    },
    {
        "slug": "drywall-repair",
        "name": "Drywall Installation &amp; Repair",
        "icon": "trowel",
        "card": "Holes, cracks, water damage and full rooms of new board - hung, taped, floated, textured to match and painted so you cannot find the repair.",
        "title": "Drywall Repair - Sarasota &amp; Bradenton",
        "desc": "Drywall repair and installation in Sarasota and Bradenton: water damage, holes, cracks, texture matching and new board. Free estimate: 941-405-2750.",
        "h1": "Drywall Installation &amp; Repair",
        "answer": "Angel's Hand Painting LLC repairs drywall damage from water intrusion, impacts, settlement cracks and remodels, and hangs new board for additions and full rooms. Every repair is taped, floated, sanded, texture-matched and primed so the patch disappears under paint. Small repairs are usually a one to two day job.",
        "intro": [
            "A drywall repair is only finished when you cannot find it. Anyone can push mud into a hole - the work is in feathering the compound wide enough, matching the existing texture, and priming the patch so it does not flash a different sheen once the wall is painted.",
            "That is the standard our repairs are held to, whether it is a doorknob hole in a hallway or a ceiling opened up after a roof leak.",
        ],
        "includes_title": "Repairs and installations we handle",
        "includes": [
            "Water damage from roof leaks, AC condensation, plumbing and window intrusion",
            "Holes, cracks, dents and popped screws or nails",
            "Ceiling repairs, including full sections cut out and replaced",
            "Settlement and stress cracks at corners and above openings",
            "New drywall for additions, garage conversions, closets and remodels",
            "Corner bead replacement and square, straight outside corners",
            "Texture matched to knockdown, orange peel, smooth or hand-troweled finishes",
            "Moisture-resistant board in bathrooms, laundry rooms and other wet areas",
        ],
        "sections": [
            ("Water damage work", [
                "We cut back to sound, dry material rather than covering damp board",
                "Affected insulation is removed where it has been soaked",
                "Stains are sealed with a stain-blocking primer so they never bleed through",
                "New board is hung, taped and floated to match the surrounding plane",
                "Texture is matched and the area is primed and painted",
                "Small water-damage repairs are commonly finished in one to two days",
            ]),
            ("Why texture matching matters", [
                "Sarasota and Bradenton homes are mostly knockdown or orange peel - both are sprayed textures with a specific pattern size",
                "A patch with the wrong texture reads as a bright spot from across the room, even after painting",
                "We sample and match the surrounding pattern before we texture the repair",
                "On heavily patched walls, skim coating the whole plane smooth is often the better-looking fix",
            ]),
        ],
        "faqs": [
            ("Can you match my ceiling and wall texture?",
             "Yes - knockdown, orange peel, smooth and hand-troweled finishes are all matched on site. Texture matching is the difference between a repair you cannot see and a patch that stands out under the light."),
            ("Do you paint after the drywall repair?",
             "Yes, and we recommend it. We prime the repair and paint at minimum the full wall or ceiling plane so the sheen is uniform. Painting only the patch itself will always show."),
            ("Do you handle water damage from a roof leak?",
             "Yes. We remove the damaged board, seal the stains, hang and finish new drywall, match the texture and paint. Have the leak itself repaired first, or the same ceiling will fail again."),
            ("How soon can a small hole be repaired?",
             "Most small repairs are a one to two day job once compound drying time is accounted for. Call or text and we will usually be out to look within a couple of days."),
        ],
        "related": ["popcorn-ceiling-removal", "texture-finishes", "interior-painting"],
    },
    {
        "slug": "popcorn-ceiling-removal",
        "name": "Popcorn Ceiling Removal",
        "icon": "ceiling",
        "card": "The single fastest way to make a 1980s Florida house feel current - scraped, skimmed, sanded flat and finished, with the mess contained.",
        "title": "Popcorn Ceiling Removal - Sarasota, FL",
        "desc": "Popcorn ceiling removal in Sarasota, Bradenton and Lakewood Ranch. Contained scraping, skim coating, smooth finish, ceilings painted. Call 941-405-2750.",
        "h1": "Popcorn Ceiling Removal",
        "answer": "Popcorn ceiling removal takes out the sprayed acoustic texture and replaces it with a smooth or lightly textured finish. Angel's Hand Painting LLC masks the room floor-to-wall, scrapes, skim coats, sands flat, primes and paints. A typical room takes one to two days; whole-home projects run several days.",
        "intro": [
            "Popcorn ceilings collect dust, yellow with age, and instantly date a room. Taking one down is one of the highest-impact changes you can make to a Florida house that has not been updated since it was built.",
            "The reason people put it off is the mess. Handled properly, it stays contained: plastic on the walls and floors, controlled scraping, and a room that is cleaner when we leave than the day we arrived.",
        ],
        "includes_title": "How we take a popcorn ceiling down",
        "includes": [
            "Room fully masked - floors, walls, doorways and fixtures sealed in plastic",
            "Light fixtures, fans and vent covers dropped or protected",
            "Texture scraped down, then the ceiling skim coated to a flat plane",
            "Sanded, dusted and inspected under raking light for shadows and ridges",
            "Cracks, seams and old repairs corrected while the ceiling is open",
            "Primed, then finished smooth or in a light knockdown or orange peel if you prefer",
            "Two coats of ceiling paint and full clean-up of the containment",
        ],
        "sections": [
            ("A note on ceilings from before 1980", [
                "Acoustic ceiling texture applied before the early 1980s can contain asbestos",
                "If your home is from that era, have the ceiling tested before any scraping starts - it is an inexpensive test",
                "If a test comes back positive, the removal is a licensed abatement job, not a painting job, and we will tell you so",
                "We are glad to point you to testing before we quote the work",
            ]),
            ("Smooth, or a light texture?", [
                "Smooth is the current look and makes ceilings feel higher and newer",
                "Smooth is also less forgiving - it needs a proper skim coat, which is exactly why we include one",
                "A light knockdown or orange peel hides more and suits homes where the rest of the ceilings are textured",
                "We can match adjoining rooms so nothing looks half-finished",
            ]),
        ],
        "faqs": [
            ("How much mess does popcorn removal make?",
             "Less than people expect when the room is properly contained. We seal floors, walls and doorways in plastic before scraping and remove the containment with the debris inside it. Adjacent rooms stay clean."),
            ("Do I have to move out?",
             "No. We work room by room, so you keep the rest of the house. We do ask that the rooms being scraped are cleared of furniture, or we can move and cover it for you."),
            ("Is my popcorn ceiling asbestos?",
             "It can be if it was applied before the early 1980s. Have it tested first - testing is inexpensive and definitive. If it tests positive, the work belongs with a licensed asbestos abatement contractor rather than a painting company."),
            ("Can you just paint over popcorn instead?",
             "You can, and it freshens a ceiling, but the texture stays. Spraying is better than rolling on popcorn because a roller pulls the texture off. If the goal is a modern ceiling, removal is the answer."),
        ],
        "related": ["texture-finishes", "drywall-repair", "interior-painting"],
    },
    {
        "slug": "texture-finishes",
        "name": "Texture Finishes &amp; Skim Coating",
        "icon": "trowel",
        "card": "Knockdown, orange peel, smooth level-5 skim coats and hand-troweled finishes - matched to what you have, or used to change the whole feel of a room.",
        "title": "Wall Texture &amp; Skim Coating - Sarasota",
        "desc": "Knockdown, orange peel and smooth skim-coat wall texture in Sarasota and Bradenton. Texture matching and level-5 finishes. Free estimate: 941-405-2750.",
        "h1": "Texture Finishes &amp; Skim Coating",
        "answer": "Texture work covers two jobs: matching existing knockdown or orange peel so a repair disappears, and skim coating walls or ceilings flat when you want a smooth, modern surface. Angel's Hand Painting LLC does both across Sarasota, Bradenton and Lakewood Ranch, including full level-5 smooth finishes before wallpaper or high-sheen paint.",
        "intro": [
            "Texture is the finish nobody notices until it is wrong. A patch textured slightly heavier than the wall around it catches side light and shows through every coat of paint you put over it.",
            "We match existing texture on repairs, and we skim coat when the goal is the opposite - taking a heavy knockdown wall down to a flat, smooth plane that suits modern paint, murals or wallpaper.",
        ],
        "includes_title": "Texture work we do",
        "includes": [
            "Knockdown texture, matched in pattern size and flattening to the existing walls",
            "Orange peel in fine, medium and heavy patterns",
            "Smooth level-5 skim coating on walls and ceilings",
            "Hand-troweled and Santa Fe style decorative finishes",
            "Skim coating over knockdown to prepare walls for wallpaper or murals",
            "Repair-area texture matching so patches vanish under paint",
            "Ceilings retextured after popcorn removal",
        ],
        "sections": [
            ("When skim coating is worth it", [
                "Before wallpaper or a wall mural - paper over knockdown telegraphs every bump",
                "When a wall has been patched so many times it reads as a map",
                "In rooms where you want a flat modern look or a high-sheen finish",
                "After removing paneling, tile or old wall covering adhesive",
                "Feature walls where the finish itself is the design element",
            ]),
            ("Matching what is already there", [
                "We sample the existing pattern before mixing, and test on board rather than on your wall",
                "Pattern size, spray pressure and knockdown timing all change the result - matching is a feel, not a formula",
                "On large repairs we often texture the whole wall plane, corner to corner, which is the surest match of all",
                "Everything gets primed before paint so the repair and the field share the same sheen",
            ]),
        ],
        "faqs": [
            ("What is a level-5 finish?",
             "It is the smoothest drywall finish - a thin skim coat of compound over the entire surface, sanded flat, so there are no visible seams, fasteners or texture. It is what you want under high-sheen paint, wallpaper or critical lighting."),
            ("Can you make knockdown walls smooth?",
             "Yes. The knockdown is flattened and the wall is skim coated, sanded and primed. It is a labour-heavy job compared with painting, but the change to a room is dramatic."),
            ("Will a new texture patch match my old walls exactly?",
             "On a properly matched knockdown or orange peel, you will not find the repair from normal viewing distance once it is painted. Where a match would be difficult, we will recommend texturing the whole plane instead of chasing it."),
        ],
        "related": ["drywall-repair", "popcorn-ceiling-removal", "wallpaper-installation"],
    },
    {
        "slug": "wallpaper-installation",
        "name": "Wallpaper Installation",
        "icon": "wallpaper",
        "card": "Wall murals, peel-and-stick, grasscloth and traditional paper - hung on walls that were properly skim coated, primed and prepared first.",
        "title": "Wallpaper Installation - Sarasota, FL",
        "desc": "Wallpaper and wall mural installation in Sarasota, Bradenton and Lakewood Ranch. Walls skim coated smooth and primed first. Free estimate: 941-405-2750.",
        "h1": "Wallpaper Installation",
        "answer": "Angel's Hand Painting LLC installs wallpaper, murals, grasscloth and peel-and-stick coverings - and, just as importantly, prepares the wall first. Textured Florida walls are sanded and skim coated smooth, then primed with a wallcovering primer so the paper sits flat and can be removed cleanly later.",
        "intro": [
            "Almost every wallpaper problem starts before the first strip goes up. Paper hung over knockdown texture shows every bump. Paper hung straight onto bare drywall bonds to the paper facing and tears the wall when it comes off.",
            "So we treat prep as part of the installation, not an extra: skim coat the wall flat, sand it, and prime with a proper wallcovering primer. Then the pattern lines up, the seams sit tight, and the next owner can take it down without rebuilding the room.",
        ],
        "includes_title": "What installation includes",
        "includes": [
            "Sanding and skim coating textured walls to a smooth plane",
            "Wallcovering primer so the paper bonds - and releases cleanly later",
            "Accurate pattern matching, plumb first drop and tight seams",
            "Wall murals sized, sequenced and hung panel by panel",
            "Grasscloth, vinyl, non-woven, traditional paper and peel-and-stick",
            "Careful cuts at outlets, switches, corners and trim",
            "Old wallpaper stripped, adhesive residue removed and walls repaired",
        ],
        "sections": [
            ("Where wallpaper works best", [
                "Dining rooms and formal entryways",
                "Powder rooms - a small room where a bold pattern pays off",
                "Bedroom and nursery feature walls",
                "Behind a bar, a bookcase or a stairwell run",
                "Offices and commercial reception areas",
            ]),
            ("Before you order your paper", [
                "Measure the wall and add for pattern repeat - we are happy to check your take-off",
                "Order all rolls in one batch so the dye lot matches",
                "Murals are sized to your wall, so the wall needs measuring before you order",
                "Tell us the material - grasscloth, vinyl and peel-and-stick each want different prep",
            ]),
        ],
        "faqs": [
            ("Can wallpaper go over textured walls?",
             "Not well. Knockdown and orange peel texture shows through the paper and prevents the seams from sitting flat. We sand and skim coat the wall smooth first, then prime it - that prep is what makes the finished job look right."),
            ("Do you install customer-supplied wallpaper?",
             "Yes, most of our wallpaper work is with paper the homeowner or designer picked out. Just make sure every roll comes from the same dye lot."),
            ("Can you remove old wallpaper?",
             "Yes. We strip the old covering, clean off adhesive residue, repair any damaged drywall facing underneath and get the wall back to a paintable or paperable surface."),
        ],
        "related": ["texture-finishes", "interior-painting", "drywall-repair"],
    },
    {
        "slug": "pressure-washing",
        "name": "Pressure Washing",
        "icon": "washer",
        "card": "Driveways, pavers, walkways, pool decks, roofs and house exteriors cleaned at the right pressure for the surface - not blasted.",
        "title": "Pressure Washing - Sarasota &amp; Bradenton",
        "desc": "Pressure washing and soft washing for driveways, pavers, pool decks, roofs and house exteriors in Sarasota and Bradenton. Free estimate: 941-405-2750.",
        "h1": "Pressure Washing",
        "answer": "Angel's Hand Painting LLC pressure washes driveways, pavers, walkways, pool decks, lanais, fences and house exteriors across Sarasota and Bradenton, and soft washes surfaces that high pressure would damage - stucco, painted siding, screens and roofs. Most residential jobs are completed in a few hours.",
        "intro": [
            "In this climate, mildew, algae and black streaking are not a maintenance failure - they are just what happens between washes. The mistake is treating every surface with the same wand and the same pressure.",
            "Concrete and pavers take real pressure. Painted stucco, soffits, screens and shingles do not, and blasting them drives water where it should not go. We match the method to the surface.",
        ],
        "includes_title": "What we clean",
        "includes": [
            "Driveways, sidewalks and concrete walkways",
            "Paver drives, patios and pool decks, with sanding and sealing available",
            "Pool cages, lanais and screen enclosures - soft washed",
            "House exteriors: stucco, siding, soffits and fascia",
            "Roofs, soft washed rather than pressure washed",
            "Fences, decks and wood surfaces at safe pressure",
            "Commercial storefronts, walkways and dumpster pads",
        ],
        "sections": [
            ("Pressure washing before painting", [
                "Every exterior repaint we do starts with a wash - it is included, not an add-on",
                "Chalked paint, mildew and salt film all prevent a new coating from bonding",
                "Surfaces are given time to dry fully before any primer or paint goes on",
                "If you are getting the house painted soon, get the wash as part of that job rather than separately",
            ]),
            ("Soft washing, and why it matters", [
                "Soft washing uses low pressure with a cleaning solution to kill algae and mildew at the root",
                "It is the correct method for roofs, screens, painted surfaces and older stucco",
                "High pressure on those surfaces strips coatings, tears screens and forces water behind the wall",
                "Results last longer, because the organic growth is killed rather than knocked off",
            ]),
        ],
        "faqs": [
            ("How often should I pressure wash in Florida?",
             "Most homes here benefit from an annual wash, and shaded or north-facing walls, pool decks and screen cages often need it more often. If you can see green or black streaking, it is time."),
            ("Will pressure washing damage my paint or stucco?",
             "Not the way we do it. Painted surfaces, older stucco, screens and roofs get soft washed at low pressure with a cleaning solution. Hard surfaces like concrete and pavers take higher pressure safely."),
            ("Do you clean roofs?",
             "Yes, by soft wash only. Pressure washing a shingle roof strips the granules and shortens its life - it is never the right tool for that job."),
        ],
        "related": ["exterior-painting", "epoxy-garage-floors", "handyman-home-repairs"],
    },
    {
        "slug": "epoxy-garage-floors",
        "name": "Epoxy Garage Floors",
        "icon": "garage",
        "card": "A ground, patched and sealed garage floor that resists hot tyres, oil and water - and can be swept clean instead of scrubbed.",
        "title": "Epoxy Garage Floors - Sarasota, FL",
        "desc": "Epoxy garage floor coating in Sarasota, Bradenton and Lakewood Ranch. Diamond-ground prep, crack repair, flake or solid colour. Free estimate: 941-405-2750.",
        "h1": "Epoxy Garage Floors",
        "answer": "An epoxy garage floor coating seals bare concrete against oil, hot tyres, moisture and staining, and turns a dusty slab into a surface you sweep clean. Angel's Hand Painting LLC prepares the slab by grinding rather than acid-etching, repairs cracks and pitting, then applies the coating and a clear topcoat. Most single garages take two to three days including cure time.",
        "intro": [
            "Epoxy floors fail for one reason: the coating never got a mechanical grip on the concrete. Rolling epoxy onto a sealed or dusty slab looks great for a month and then peels up with the first hot tyre.",
            "The fix is preparation. We grind the slab to open the surface profile, fix the cracks and spalling, and then coat - which is why our floors stay down.",
        ],
        "includes_title": "How the floor goes down",
        "includes": [
            "Slab cleaned, degreased and oil spots treated",
            "Diamond grinding to open the concrete profile - no acid etching",
            "Cracks, pits and spalled edges filled and levelled",
            "Moisture-tolerant primer where the slab needs it",
            "Epoxy or polyaspartic base coat in your chosen colour",
            "Decorative flake broadcast, if you want the speckled finish",
            "Clear protective topcoat, with an anti-slip additive on request",
        ],
        "sections": [
            ("Finishes to choose from", [
                "Full-flake - the classic speckled garage look, hides dirt best",
                "Light-flake or solid colour for a cleaner, more modern slab",
                "Metallic finishes for showrooms and display spaces",
                "Anti-slip additive where the floor gets wet",
                "Matte or gloss clear coat",
            ]),
            ("Where else a coated floor makes sense", [
                "Workshops and hobby garages",
                "Laundry rooms and utility spaces",
                "Storage rooms and warehouse bays",
                "Commercial back-of-house areas",
                "Lanai and patio slabs, with the right product for exterior exposure",
            ]),
        ],
        "faqs": [
            ("How long before I can park on a new epoxy floor?",
             "Plan on light foot traffic after about 24 hours and vehicles after roughly three to five days, depending on the product and the weather. We give you the exact cure schedule for your floor before we start."),
            ("Do you grind the floor or acid etch it?",
             "We grind. Diamond grinding gives a consistent, open profile across the whole slab, which is what the coating needs to bond. Acid etching is faster and far less reliable."),
            ("Will epoxy stick to a floor that already has a coating?",
             "Only after the old coating is removed or ground off. We assess the existing coating first - if it is failing, it has to come up, otherwise the new floor fails with it."),
        ],
        "related": ["pressure-washing", "exterior-painting", "handyman-home-repairs"],
    },
    {
        "slug": "wood-staining",
        "name": "Wood Stain &amp; Finishing",
        "icon": "wood",
        "card": "Doors, beams, railings, built-ins and furniture stripped, sanded, stained and clear-coated so the grain shows and the finish lasts.",
        "title": "Wood Staining &amp; Finishing - Sarasota",
        "desc": "Wood staining, sealing and clear-coat finishing for doors, beams, railings and built-ins in Sarasota and Bradenton. Free estimate: 941-405-2750.",
        "h1": "Wood Stain &amp; Finishing",
        "answer": "Wood finishing is stripping, sanding and re-staining wood surfaces, then sealing them with a clear protective coat. Angel's Hand Painting LLC refinishes front doors, exposed beams, stair railings, built-ins and cabinetry across Sarasota and Bradenton, matching existing stain colours where the rest of the woodwork stays.",
        "intro": [
            "Stained wood is unforgiving. Sanding scratches, blotchy absorption and lap marks all show through a clear coat in a way they never would under paint, so the work has to be right at every stage.",
            "We sand progressively through the grits, condition wood that would otherwise blotch, apply stain evenly and wipe back on time, then build the clear coat in thin layers.",
        ],
        "includes_title": "Wood we finish",
        "includes": [
            "Front doors and entry units, including exterior-grade UV clear coats",
            "Exposed beams, tongue-and-groove ceilings and wood accent walls",
            "Stair treads, risers, handrails and balusters",
            "Built-in shelving, mantels and cabinetry",
            "Interior doors and trim being taken from paint back to stain",
            "Furniture pieces and one-off restoration work",
        ],
        "sections": [
            ("What a refinish involves", [
                "Old finish stripped or sanded back to bare, sound wood",
                "Progressive sanding so no scratch pattern shows through the stain",
                "Wood conditioner on species that blotch, such as pine and maple",
                "Stain applied and wiped back evenly, then colour checked in the room's own light",
                "Two or more clear coats, sanded lightly between",
                "Exterior wood finished with a UV-stable product - a Florida front door needs it",
            ]),
            ("Stain, or paint?", [
                "Stain keeps grain and warmth, and suits doors, beams and quality hardwood",
                "Paint hides filler, mismatched species and previously painted surfaces",
                "Going from paint back to stain is possible but is a strip-and-sand job - we will price it honestly",
                "Two-tone kitchens with stained lowers and painted uppers are a popular middle ground",
            ]),
        ],
        "faqs": [
            ("Can you match my existing stain colour?",
             "Usually, yes. We mix and test on a sample of the same species and check it in the room's own light before touching the actual piece."),
            ("How long does a stained front door last in Florida sun?",
             "A west-facing door in full Florida sun needs its clear coat refreshed every couple of years; a shaded or covered entry goes much longer. Using a UV-stable exterior product rather than an interior varnish makes the biggest difference."),
            ("Can painted trim be stripped back to stained wood?",
             "Sometimes. It depends on the species underneath, how many coats there are, and whether the wood was filled. We will look at a small test area and tell you whether it is worth the labour."),
        ],
        "related": ["cabinet-painting", "trim-molding", "interior-painting"],
    },
    {
        "slug": "trim-molding",
        "name": "Trim, Molding &amp; Baseboards",
        "icon": "trim",
        "card": "Crown molding, baseboards, casing, wainscoting and chair rail - cut tight, coped at the corners, caulked and painted.",
        "title": "Trim, Molding &amp; Baseboards - Sarasota",
        "desc": "Crown molding, baseboard and trim installation in Sarasota and Bradenton. Coped corners, caulked, filled and painted. Free estimate: 941-405-2750.",
        "h1": "Trim, Molding &amp; Baseboards",
        "answer": "Angel's Hand Painting LLC installs and replaces crown molding, baseboards, door and window casing, chair rail and wainscoting. Corners are coped rather than simply mitred, nail holes are filled, joints are caulked, and everything is primed and painted so the trim reads as one continuous line.",
        "intro": [
            "Trim is the detail people feel before they notice it. Taller baseboards and proper casing make a builder-grade room look finished, and the difference between good and bad trim work is entirely in the joints.",
            "Mitred inside corners open up as a house moves. Coped joints stay tight. That is the kind of choice that decides whether trim still looks right in five years.",
        ],
        "includes_title": "Trim work we install",
        "includes": [
            "Crown molding, single-piece or built-up profiles",
            "Baseboards, including upgrades from builder-grade to taller profiles",
            "Door and window casing",
            "Chair rail, picture-frame molding and board-and-batten wainscoting",
            "Shiplap and accent wall paneling",
            "Interior doors, jambs and hardware",
            "Stair skirt boards and trim details",
        ],
        "sections": [
            ("How we finish trim", [
                "Coped inside corners, tight mitres outside",
                "Fastened into framing, not just into drywall",
                "Nail holes filled, sanded flush and spot-primed",
                "Top and bottom edges caulked to the wall so no shadow line shows",
                "Primed and finished in a durable semi-gloss or satin enamel",
                "Existing trim in the room matched in profile and colour",
            ]),
            ("Doors, hardware and repairs", [
                "Interior door replacement, including pre-hung units",
                "Door hardware, handles, deadbolts and closers",
                "Doors planed and adjusted so they latch and swing properly",
                "Barn doors, closet doors and pocket door hardware",
                "Shelving, closet build-outs and other small carpentry",
            ]),
        ],
        "faqs": [
            ("Do you paint the trim you install?",
             "Yes. Installation, filling, caulking and finish painting are all part of the same job - you are not left finding a painter afterwards."),
            ("Can you match trim in the rest of my house?",
             "In most cases yes. We identify the profile and source a match, or build up a profile that reads the same. Where an exact match is discontinued, we will show you the closest options."),
            ("Is crown molding worth it in a room with low ceilings?",
             "Often yes, with a smaller profile. An oversized crown in an eight-foot room makes the ceiling feel lower - the profile has to be scaled to the room, which is part of what we will advise on."),
        ],
        "related": ["interior-painting", "handyman-home-repairs", "cabinet-painting"],
    },
    {
        "slug": "handyman-home-repairs",
        "name": "Doors, Hardware &amp; Home Repairs",
        "icon": "tools",
        "card": "The list of small jobs that never quite gets done - doors that stick, hardware that rattles, drywall dings, rotted trim and repairs after a leak.",
        "title": "Handyman &amp; Home Repairs - Sarasota",
        "desc": "Handyman and home repair services in Sarasota and Bradenton: doors, hardware, trim, drywall, water damage repair and punch lists. Call 941-405-2750.",
        "h1": "Doors, Hardware &amp; Home Repairs",
        "answer": "Alongside painting and drywall, Angel's Hand Painting LLC handles the repair list most homeowners keep putting off - doors that stick or will not latch, loose hardware, damaged trim, wall and ceiling repairs, and fixing what a leak left behind. Small jobs get the same attention as large ones.",
        "intro": [
            "Most of our repair work comes from customers who called about painting and mentioned three other things while we were walking the house. It is usually more efficient for one crew to handle all of it in the same visit.",
            "Small jobs get taken seriously here. A one-room water damage repair gets the same prep, the same texture match and the same clean-up as a whole-house project.",
        ],
        "includes_title": "Repairs we take on",
        "includes": [
            "Interior and exterior doors: replacement, adjustment, planing and re-hanging",
            "Door hardware, handles, deadbolts, closers and weatherstripping",
            "Damaged or rotted trim, casing and baseboards replaced",
            "Wall and ceiling repairs, including water damage",
            "Drywall patching, texture matching and touch-up painting",
            "Shelving, closet build-outs and small carpentry",
            "Punch lists before a sale, a closing or a rental turnover",
        ],
        "sections": [
            ("Popular before a sale or a closing", [
                "Whole-house touch-up and repaint in a neutral colour",
                "Nail holes, scuffs and doorknob dents repaired",
                "Doors adjusted so every one closes properly during a showing",
                "Exterior wash and front door refresh for curb appeal",
                "Inspection punch lists worked through in one visit",
            ]),
            ("Commercial and rental work", [
                "Rental turnovers on a set schedule",
                "Offices, retail units and common areas",
                "Repairs between tenants: drywall, doors, trim and paint",
                "Work scheduled outside business hours where it matters",
            ]),
        ],
        "faqs": [
            ("Is there a minimum job size?",
             "No. Small repairs are welcome - a lot of our best relationships started with one door or one patched ceiling. Call or text and we will tell you honestly whether it is worth a trip on its own or better bundled with other work."),
            ("Can you handle several small jobs in one visit?",
             "Yes, and that is usually the cheapest way to do it. Send us your list when you call and we will price the whole thing together."),
            ("Do you repair water damage?",
             "Yes - removing damaged drywall, sealing stains, replacing board, matching texture and repainting. Have the source of the leak fixed first so the repair holds."),
        ],
        "related": ["drywall-repair", "trim-molding", "interior-painting"],
    },
]

SERVICE_BY_SLUG = {s["slug"]: s for s in SERVICES}


# --------------------------------------------------------------------------- service areas
AREAS = [
    {
        "slug": "sarasota",
        "name": "Sarasota",
        "title": "Painters in Sarasota, FL",
        "desc": "Interior and exterior painting, cabinet refinishing and drywall repair in Sarasota, FL. 5-star reviewed and fully insured. Call 941-405-2750.",
        "intro": [
            "Sarasota housing stock runs from 1950s bungalows off Osprey Avenue to new construction out toward Palmer Ranch, and each of those needs a different approach. An older block home with layers of paint and settlement cracks is not the same job as a five-year-old stucco house whose builder-grade finish is fading on the south wall.",
            "We work across all of it - interior repaints, exterior stucco and block, cabinet refinishing, drywall and ceiling repair - and we quote every job after actually looking at the surfaces.",
        ],
        "neighborhoods": ["Downtown Sarasota", "Southside Village", "Arlington Park", "Gulf Gate",
                          "Palmer Ranch", "The Meadows", "Bird Key", "Lido Key", "Sarasota Springs",
                          "Bee Ridge", "Fruitville", "Laurel Park"],
        "zips": "34231, 34232, 34233, 34234, 34235, 34236, 34237, 34238, 34239, 34240, 34241, 34243",
        "local": [
            ("What Sarasota homes need most", [
                "Exterior repaints on stucco and block, with hairline crack repair before coating",
                "Popcorn ceiling removal in homes built through the 1970s and 80s",
                "Interior repaints and cabinet refinishing in condos and seasonal residences",
                "Water damage and ceiling repair after storm season",
                "Turnover painting for rentals and properties going on the market",
            ]),
        ],
        "faqs": [
            ("Do you paint condos in Sarasota?",
             "Yes - condos, seasonal residences and rentals are a large share of our interior work here. We can coordinate with building management on elevator use, work hours and COI requirements."),
            ("How soon can you give me an estimate in Sarasota?",
             "Usually within a couple of days. Call or text 941-405-2750 with your address and what you are looking at, and we will schedule a walkthrough."),
        ],
    },
    {
        "slug": "bradenton",
        "name": "Bradenton",
        "title": "Painters in Bradenton, FL",
        "desc": "Interior and exterior painting, drywall repair and cabinet refinishing in Bradenton, FL. Fully insured and 5-star reviewed. Call or text 941-405-2750.",
        "intro": [
            "Bradenton spans a lot of ground - older neighborhoods off Manatee Avenue, waterfront homes along the Braden River, and newer subdivisions pushing east toward Lakewood Ranch. Sun exposure and proximity to the water change how long an exterior finish lasts, and we account for that when we recommend a coating.",
            "Interior work, drywall repair, cabinet refinishing and full exterior repaints are all regular jobs for us here.",
        ],
        "neighborhoods": ["West Bradenton", "Palma Sola", "Bayshore Gardens", "Braden River",
                          "Riverview Boulevard", "Village of the Arts", "Cortez", "Samoset",
                          "Manatee Avenue corridor", "Anna Maria Island", "Holmes Beach", "Ellenton"],
        "zips": "34201, 34202, 34203, 34205, 34207, 34208, 34209, 34210, 34211, 34212",
        "local": [
            ("Coastal exposure and coatings", [
                "Homes near the water take salt film that has to be washed off before any repaint",
                "Full-sun elevations fade first - we can adjust the product and the colour to slow that",
                "Elastomeric coatings make sense on block walls that keep opening hairline cracks",
                "Soffits and fascia are the first place mildew shows and the easiest to keep on top of",
            ]),
        ],
        "faqs": [
            ("Do you serve Anna Maria Island and Holmes Beach?",
             "Yes. Island properties are within our service area, and coastal exposure is exactly the situation where prep and the right coating matter most."),
            ("Can you work on rental turnovers?",
             "Yes. We regularly do turnover painting, patching and repairs on rentals and seasonal properties, and we can work to a fixed date."),
        ],
    },
    {
        "slug": "lakewood-ranch",
        "name": "Lakewood Ranch",
        "title": "Painters in Lakewood Ranch, FL",
        "desc": "Painting, cabinet refinishing and drywall services in Lakewood Ranch, FL. Fully insured, HOA-friendly, 5-star reviewed. Free estimates - call 941-405-2750.",
        "intro": [
            "Lakewood Ranch is mostly newer construction, which changes what a painting job looks like. The drywall is sound and the stucco is in good shape - so the work is about upgrading builder-grade finishes: accent walls, refinished cabinets, painted trim, and repaints in colours that were not chosen from a builder's short list.",
            "Exterior repaints here are also often HOA-driven, and we are used to working within an approved colour palette and submitting what the association needs.",
        ],
        "neighborhoods": ["Lakewood Ranch Main Street", "Country Club", "Greenbrook", "Summerfield",
                          "Lakewood National", "Del Webb", "Waterside", "Central Park",
                          "Esplanade", "Mallory Park", "Polo Run", "Bradenton Ranch corridor"],
        "zips": "34202, 34211, 34212, 34240",
        "local": [
            ("Common projects in the Ranch", [
                "Repainting builder-grade interiors in warmer, more current colours",
                "Cabinet refinishing to update kitchens without a full remodel",
                "Accent walls, board-and-batten and shiplap feature walls",
                "Epoxy garage floors - popular in newer homes with clean slabs",
                "Exterior repaints within HOA-approved colour schemes",
            ]),
        ],
        "faqs": [
            ("Do you work within HOA colour requirements?",
             "Yes. Bring us your community's approved palette and we will price and paint to it, and provide the product and colour details your association asks for."),
            ("Can you paint a new-build interior before we move in?",
             "That is the easiest possible time to do it - empty rooms, no furniture to move, and no living around the work. We are glad to schedule against a closing date."),
        ],
    },
    {
        "slug": "venice",
        "name": "Venice",
        "title": "Painters in Venice, FL",
        "desc": "Interior and exterior painting, drywall repair and pressure washing in Venice, FL and Wellen Park. Fully insured, free estimates. Call or text 941-405-2750.",
        "intro": [
            "Venice mixes older island homes with a wave of newer construction out toward Wellen Park. On the island, the work tends to be exterior repaints, stucco crack repair and updating interiors in homes that have not been touched in decades. Out east, it is finishing what the builder left plain.",
            "Both are jobs we do regularly, and both start with the same walkthrough and written estimate.",
        ],
        "neighborhoods": ["Venice Island", "South Venice", "Venice Gardens", "Jacaranda",
                          "Wellen Park", "Nokomis", "Osprey", "Laurel", "Englewood corridor"],
        "zips": "34275, 34285, 34292, 34293",
        "local": [
            ("What we see most in Venice", [
                "Exterior repaints on block homes with recurring hairline stucco cracks",
                "Popcorn ceiling removal in mid-century and 1980s houses",
                "Interior repaints for seasonal residents between seasons",
                "Pressure washing driveways, lanais and pool cages",
                "Water damage repair after storm season",
            ]),
        ],
        "faqs": [
            ("Do you travel to Venice and Wellen Park?",
             "Yes - Venice, Nokomis, Osprey and Wellen Park are all inside our regular service area. Call 941-405-2750 and we will schedule a walkthrough."),
            ("Can you do work while we are up north for the season?",
             "Yes. We do a lot of work for seasonal residents, with photo updates as we go and a final walkthrough by video or in person when you are back."),
        ],
    },
    {
        "slug": "palmetto",
        "name": "Palmetto",
        "title": "Painters in Palmetto, FL",
        "desc": "Painting, drywall repair and pressure washing in Palmetto, Ellenton and Terra Ceia, FL. Fully insured, 5-star reviewed. Free estimates: 941-405-2750.",
        "intro": [
            "Palmetto and Ellenton have a good stock of older homes where the paint is doing more work than it should - covering old repairs, hairline cracks and water stains. Those are jobs where the prep matters more than the paint, and where a cheap repaint fails inside two years.",
            "We take the extra day on prep, and the finish holds because of it.",
        ],
        "neighborhoods": ["Palmetto Point", "Terra Ceia", "Ellenton", "Snead Island",
                          "Rubonia", "Memphis", "US-41 corridor", "Riverside Drive"],
        "zips": "34221, 34222",
        "local": [
            ("Typical Palmetto projects", [
                "Full exterior repaints with stucco and block crack repair",
                "Interior repaints and ceiling repair in older homes",
                "Drywall and water damage repair",
                "Pressure washing driveways, walkways and house exteriors",
                "Small repair lists ahead of a sale",
            ]),
        ],
        "faqs": [
            ("Is Palmetto inside your service area?",
             "Yes - Palmetto, Ellenton and Terra Ceia are all within the area we cover from Sarasota and Bradenton."),
            ("Do you offer free estimates in Palmetto?",
             "Yes. Estimates are free anywhere in our service area, and there is no obligation attached to them."),
        ],
    },
    {
        "slug": "siesta-key",
        "name": "Siesta Key",
        "title": "Painters on Siesta Key, FL",
        "desc": "Interior and exterior painting, drywall repair and pressure washing on Siesta Key, FL. Coastal-grade prep and coatings, fully insured. Call 941-405-2750.",
        "intro": [
            "Siesta Key is the toughest environment we paint in. Salt air, constant sun and humidity attack exterior coatings from every direction, and a repaint that skips the wash or uses a builder-grade product will not last a season out here.",
            "Coastal work is a prep problem before it is a paint problem: wash off the salt film, seal every opening, and use a coating rated for this exposure.",
        ],
        "neighborhoods": ["Siesta Village", "Crescent Beach", "Turtle Beach", "Sanderling Club",
                          "Siesta Beach", "Point of Rocks", "Midnight Pass Road", "Higel Avenue"],
        "zips": "34242",
        "local": [
            ("Coastal painting done right", [
                "Low-pressure wash to strip salt film and mildew before any coating",
                "Every gap at windows, doors and penetrations sealed",
                "Rust-inhibitive primer on any exposed metal - railings, brackets, fasteners",
                "High-grade acrylic or elastomeric coatings rated for coastal exposure",
                "Screen enclosures and pool cages soft washed, never blasted",
            ]),
        ],
        "faqs": [
            ("How often do beach-area homes need repainting?",
             "More often than inland homes. Full-exposure coastal properties commonly need attention every five to seven years, and sooner on the sun and salt-facing elevations. Regular washing extends it considerably."),
            ("Can you work around a rental calendar?",
             "Yes. We schedule around bookings and turnovers regularly for owners of vacation rentals on the key."),
        ],
    },
]

AREA_NAMES = [a["name"] for a in AREAS]
NEARBY = ["Osprey", "Nokomis", "Ellenton", "Parrish", "University Park", "Longboat Key",
          "Anna Maria Island", "Holmes Beach", "Myakka City", "North Port", "Englewood", "Terra Ceia"]

# --------------------------------------------------------------------------- reviews
# Verbatim 5-star Google reviews. Owner replies removed, as requested.
# `truncated` marks reviews Google itself cut off with "... More".
# Dates are month-precision: Google shows these as relative ("a month ago").
REVIEWS = [
    {"author": "Brendan Kiefer", "date": "2026-08", "tag": "",
     "text": "Angel and his crew were prompt, courteous, and above all, did great work. I needed a section "
             "of drywall repaired and the whole room painted. Would definitely recommend!",
     "truncated": False},
    {"author": "Greg Ostberg", "date": "2026-08", "tag": "Reasonable price",
     "text": "Angels Hand Painting company is very thorough. Very professional !! Very competitive pricing. "
             "Finished the job on time. Quality work !!! I recommend Angel's painting services to anyone "
             "looking to update the exterior of their home.",
     "truncated": False},
    {"author": "Melissa Whitmore", "date": "2026-08", "tag": "",
     "text": "Very professional and hard working company who are meticulous about their work quality! "
             "They are also very fair about pricing. I highly recommend Angel's Hand Painting and "
             "Handyman company.",
     "truncated": False},
    {"author": "Juliana Gonzalez", "date": "2026-08", "tag": "",
     "text": "Miguel and his brother did an excellent job repairing the interior damage caused by water "
             "intrusion from our roof. Although it was a small project, they took it seriously and gave it "
             "the same attention you would expect on a much larger job.",
     "truncated": True},
    {"author": "D S", "date": "2026-08", "tag": "",
     "text": "Now I know why this company is called Angel's Hands Painting. That's how I can best describe "
             "the work they delivered for us with our house interior paint. They were highly meticulous, "
             "skilled, detailed and took pride in doing work of",
     "truncated": True},
    {"author": "Keri Creed", "date": "2026-08", "tag": "Reasonable price",
     "text": "I hired Miguel's team to do a wallpaper installation for me. The scope included sanding and "
             "skim coating my walls to achieve a smooth finish due to knock down finish. Once that was "
             "finished, they added a coat of primer to prep for my mural",
     "truncated": True},
    {"author": "Tom James", "date": "2026-08", "tag": "Reasonable price",
     "text": "Miguel repaired my bedroom ceiling, did an excellent job. We were very happy with his work "
             "ethic and his work.",
     "truncated": False},
]

# --------------------------------------------------------------------------- general FAQs
GENERAL_FAQS = [
    ("Do you give free estimates?",
     "Yes. Estimates are free and there is no obligation. Call or text 941-405-2750, or send the form on "
     "this site, and we will arrange a time to walk the property, measure, and give you a written price."),
    ("Are you insured?",
     "Yes - Angel's Hand Painting LLC is fully insured for both residential and commercial work. We are "
     "happy to provide a certificate of insurance for your records, your HOA or your building management."),
    ("What areas do you serve?",
     "Sarasota, Bradenton, Lakewood Ranch, Venice, Palmetto, Siesta Key and the surrounding communities "
     "across Sarasota and Manatee counties, including Osprey, Nokomis, Ellenton, Parrish, Longboat Key "
     "and Anna Maria Island."),
    ("How much does it cost to paint a house?",
     "It depends on square footage, ceiling height, how much prep and repair is needed, and the product "
     "used - which is why we price from a walkthrough rather than over the phone. Every estimate is "
     "itemised so you can see what the prep, the materials and the labour each cost."),
    ("Do you do both residential and commercial work?",
     "Yes. Alongside houses and condos we work on offices, storefronts, rentals and multi-unit "
     "properties, and can schedule outside business hours where that matters."),
    ("What kind of paint do you use?",
     "Professional-grade products chosen for the surface and the exposure - a 100% acrylic exterior "
     "coating for stucco and block, a scrubbable interior finish for living areas, cabinet-grade enamel "
     "for cabinetry. We tell you the exact product and colour before we start, and you are welcome to "
     "specify your own preference."),
    ("How soon can you start?",
     "Small repairs can often be scheduled within a few days. Larger interior and exterior projects "
     "depend on the current schedule and, for exteriors, on the weather. We give you a realistic start "
     "date rather than an optimistic one."),
    ("Do I need to be home while you work?",
     "Not necessarily. Many customers - especially seasonal residents - arrange access and we send photo "
     "updates as we go. We do ask for a walkthrough with you at the start and at the end."),
    ("Do you clean up afterwards?",
     "Every day, not just at the end. Floors are protected, masking is removed, and the space is put back "
     "before we leave. The final walkthrough does not happen until the site is clean."),
    ("Do you offer a warranty on your work?",
     "Yes - we stand behind our workmanship. If something is not right, we come back and put it right. "
     "The specific terms are set out on your written estimate."),
]

# --------------------------------------------------------------------------- nav
NAV = [
    ("/", "Home"),
    ("/services/", "Services"),
    ("/service-areas/", "Service Areas"),
    ("/reviews.html", "Reviews"),
    ("/about.html", "About"),
    ("/faq.html", "FAQ"),
    ("/contact.html", "Contact"),
]


# --------------------------------------------------------------------------- small helpers
def esc(text):
    return html.escape(text, quote=True)


def plain(text):
    """Strip entities/markup so a string is safe inside JSON-LD or a meta tag."""
    return html.unescape(re.sub(r"<[^>]+>", "", text)).replace('"', "'")


def tel():
    return ('<a class="header-phone" href="tel:%s" data-cta="header-phone">%s'
            '<span><small>Call or text</small>%s</span></a>'
            % (BUSINESS["phone_link"], icon("phone"), BUSINESS["phone_display"]))


def stars(count=5, cls=""):
    body = "".join(solid("star") for _ in range(count))
    return ('<span class="stars %s" role="img" aria-label="%d out of 5 stars">%s</span>'
            % (cls, count, body))


def review_card(r):
    initials = "".join(part[0] for part in r["author"].split()[:2]).upper()
    body = r["text"].rstrip()
    if r["truncated"]:
        body = body.rstrip(".") + "\u2026"
    text = esc(body)
    tag = ('<span class="tag">%s</span>' % esc(r["tag"])) if r["tag"] else ""
    return (
        '<figure class="review reveal">%s%s<blockquote>%s</blockquote>'
        '<figcaption><span class="avatar" aria-hidden="true">%s</span><span>'
        '<cite>%s</cite><span class="src">%s Google review</span></span></figcaption></figure>'
        % (stars(), tag, text, initials, esc(r["author"]),
           solid("google", "gicon").replace("<svg", '<svg width="14" height="14"'))
    )


def quote_form(form_id="quote", heading="Get Your Free Estimate",
               sub="No obligation. Most estimates within 48 hours.", compact=False):
    services = "".join('<option value="%s">%s</option>' % (plain(s["name"]), s["name"])
                       for s in SERVICES)
    areas = "".join('<option value="%s">%s</option>' % (a["name"], a["name"]) for a in AREAS)
    endpoint = ' data-endpoint="%s"' % FORM_ENDPOINT if FORM_ENDPOINT else ' data-endpoint=""'
    return """
<div class="quote-card">
  <div class="quote-card__top">
    <p class="h">%(heading)s</p>
    <p>%(sub)s</p>
  </div>
  <form data-quote-form name="estimate-request" method="POST" action="%(action)s"%(endpoint)s
        data-netlify="true" netlify-honeypot="website" id="%(id)s-form">
    <input type="hidden" name="form-name" value="estimate-request">
    <p class="form-status" role="status" aria-live="polite"></p>
    <p class="hp"><label>Do not fill this in <input name="website" tabindex="-1" autocomplete="off"></label></p>
    <div class="field-row">
      <div class="field">
        <label for="%(id)s-name">Name <span class="req" aria-hidden="true">*</span></label>
        <input id="%(id)s-name" name="name" type="text" autocomplete="name" required>
        <span class="err" aria-live="polite"></span>
      </div>
      <div class="field">
        <label for="%(id)s-phone">Phone <span class="req" aria-hidden="true">*</span></label>
        <input id="%(id)s-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"
               placeholder="(941) 555-0123" required>
        <span class="err" aria-live="polite"></span>
      </div>
    </div>
    <div class="field">
      <label for="%(id)s-email">Email <span class="req" aria-hidden="true">*</span></label>
      <input id="%(id)s-email" name="email" type="email" autocomplete="email" required>
      <span class="err" aria-live="polite"></span>
    </div>
    <div class="field-row">
      <div class="field">
        <label for="%(id)s-service">Service needed</label>
        <select id="%(id)s-service" name="service">
          <option value="">Select a service</option>
          %(services)s
          <option value="Multiple services">Multiple services</option>
        </select>
      </div>
      <div class="field">
        <label for="%(id)s-area">Your area</label>
        <select id="%(id)s-area" name="area">
          <option value="">Select your area</option>
          %(areas)s
          <option value="Other nearby area">Other nearby area</option>
        </select>
      </div>
    </div>
    <div class="field">
      <label for="%(id)s-message">Tell us about the project</label>
      <textarea id="%(id)s-message" name="message" rows="%(rows)s"
                placeholder="Rooms, square footage, timing, anything you have already noticed&hellip;"></textarea>
    </div>
    <button class="btn btn--block btn--lg" type="submit" data-cta="quote-submit">Get My Free Estimate</button>
    <p class="form-legal">Prefer to talk? Call or text
      <a href="tel:%(link)s"><strong>%(phone)s</strong></a>. We never share your details.</p>
  </form>
</div>""" % {
        "heading": heading, "sub": sub, "id": form_id, "services": services, "areas": areas,
        "action": FORM_ACTION, "endpoint": endpoint, "rows": "3" if compact else "4",
        "link": BUSINESS["phone_link"], "phone": BUSINESS["phone_display"],
    }


def cta_band(title="Ready for a finish you can be proud of?",
             text="Free, no-obligation estimates across Sarasota, Bradenton, Lakewood Ranch and the surrounding area. Call or text and we will come take a look."):
    return """
<section class="cta-band">
  <div class="wrap">
    <div>
      <h2>%s</h2>
      <p>%s</p>
    </div>
    <div class="btn-row">
      <a class="btn btn--lg" href="tel:%s" data-cta="band-call">%s %s</a>
      <a class="btn btn--ghost-light btn--lg" href="/contact.html" data-cta="band-quote">Request an estimate</a>
    </div>
  </div>
</section>""" % (title, text, BUSINESS["phone_link"], icon("phone"), BUSINESS["phone_display"])


def faq_block(faqs, title="Frequently asked questions", intro=None, soft=True):
    items = "".join(
        '<details%s><summary>%s</summary><div class="answer"><p>%s</p></div></details>'
        % (" open" if i == 0 else "", esc(q), esc(a)) for i, (q, a) in enumerate(faqs))
    lede = '<p class="lede">%s</p>' % intro if intro else ""
    return """
<section class="section%s" id="faq">
  <div class="wrap">
    <div class="head center">
      <p class="eyebrow">Answers</p>
      <h2>%s</h2>
      %s
    </div>
    <div class="faq" style="margin-top:2.4rem">%s</div>
  </div>
</section>""" % (" section--soft" if soft else "", title, lede, items)


def breadcrumb_bar(trail):
    """trail = [(url, label), ...] ending with the current page (url may be None)."""
    lis = []
    for url, label in trail:
        if url:
            lis.append('<li><a href="%s">%s</a></li>' % (url, label))
        else:
            lis.append('<li><span aria-current="page">%s</span></li>' % label)
    return ('<nav class="breadcrumb" aria-label="Breadcrumb"><div class="wrap"><ol>%s</ol></div></nav>'
            % "".join(lis))


# --------------------------------------------------------------------------- structured data
import json


def business_node():
    return {
        "@type": ["HomeAndConstructionBusiness", "PaintingContractor", "LocalBusiness"],
        "@id": SITE + "/#business",
        "name": plain(BUSINESS["name"]),
        "alternateName": plain(BUSINESS["short"]),
        "slogan": BUSINESS["tagline"],
        "url": SITE + "/",
        "telephone": BUSINESS["phone_link"],
        "image": SITE + "/assets/img/og-cover.png",
        "logo": {"@type": "ImageObject", "url": SITE + "/assets/img/logo.svg"},
        "priceRange": "$$",
        "currenciesAccepted": "USD",
        "paymentAccepted": "Cash, Check, Credit Card",
        "description": ("Residential and commercial painting, drywall and home improvement contractor "
                        "serving Sarasota, Bradenton, Lakewood Ranch and surrounding communities in "
                        "Southwest Florida. Interior and exterior painting, cabinet refinishing, drywall "
                        "repair, texture, wallpaper, pressure washing and epoxy garage floors."),
        "address": {
            "@type": "PostalAddress",
            "addressLocality": BUSINESS["city"],
            "addressRegion": BUSINESS["region"],
            "postalCode": BUSINESS["postal"],
            "addressCountry": BUSINESS["country"],
        },
        "geo": {"@type": "GeoCoordinates", "latitude": BUSINESS["lat"], "longitude": BUSINESS["lon"]},
        "areaServed": [{"@type": "City", "name": n, "addressRegion": "FL"}
                       for n in AREA_NAMES + NEARBY],
        "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {"@type": "GeoCoordinates", "latitude": BUSINESS["lat"],
                            "longitude": BUSINESS["lon"]},
            "geoRadius": "48000",
        },
        "openingHoursSpecification": [{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "07:00", "closes": "18:00",
        }],
        "sameAs": [BUSINESS["instagram"], BUSINESS["facebook"]],
        "knowsLanguage": ["en", "es"],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": RATING,
            "bestRating": "5",
            "worstRating": "1",
            "reviewCount": str(REVIEW_COUNT),
        },
        "review": [{
            "@type": "Review",
            "author": {"@type": "Person", "name": r["author"]},
            "datePublished": r["date"],
            "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"},
            "reviewBody": r["text"],
            "publisher": {"@type": "Organization", "name": "Google"},
        } for r in REVIEWS],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Painting, drywall and home improvement services",
            "itemListElement": [{
                "@type": "Offer",
                "itemOffered": {"@type": "Service", "name": plain(s["name"]),
                                "url": "%s/services/%s.html" % (SITE, s["slug"])},
            } for s in SERVICES],
        },
        "makesOffer": {"@type": "Offer", "name": "Free written estimate", "price": "0",
                       "priceCurrency": "USD"},
    }


def website_node():
    return {
        "@type": "WebSite",
        "@id": SITE + "/#website",
        "url": SITE + "/",
        "name": plain(BUSINESS["name"]),
        "publisher": {"@id": SITE + "/#business"},
        "inLanguage": "en-US",
    }


def webpage_node(path, title, desc, trail, speakable=False):
    url = SITE + path
    node = {
        "@type": "WebPage",
        "@id": url + "#webpage",
        "url": url,
        "name": plain(title),
        "description": plain(desc),
        "isPartOf": {"@id": SITE + "/#website"},
        "about": {"@id": SITE + "/#business"},
        "inLanguage": "en-US",
        "dateModified": date.today().isoformat(),
    }
    if trail:
        node["breadcrumb"] = {"@id": url + "#breadcrumb"}
    if speakable:
        node["speakable"] = {"@type": "SpeakableSpecification",
                             "cssSelector": [".answer-box", "h1"]}
    return node


def breadcrumb_node(path, trail):
    return {
        "@type": "BreadcrumbList",
        "@id": SITE + path + "#breadcrumb",
        "itemListElement": [{
            "@type": "ListItem", "position": i + 1, "name": plain(label),
            "item": (SITE + url) if url else (SITE + path),
        } for i, (url, label) in enumerate(trail)],
    }


def faq_node(path, faqs):
    return {
        "@type": "FAQPage",
        "@id": SITE + path + "#faq",
        "mainEntity": [{
            "@type": "Question", "name": plain(q),
            "acceptedAnswer": {"@type": "Answer", "text": plain(a)},
        } for q, a in faqs],
    }


def service_node(path, svc):
    return {
        "@type": "Service",
        "@id": SITE + path + "#service",
        "name": plain(svc["name"]),
        "serviceType": plain(svc["name"]),
        "description": plain(svc["answer"]),
        "url": SITE + path,
        "provider": {"@id": SITE + "/#business"},
        "areaServed": [{"@type": "City", "name": n, "addressRegion": "FL"} for n in AREA_NAMES],
        "audience": {"@type": "Audience", "audienceType": "Homeowners and commercial property owners"},
        "offers": {"@type": "Offer", "availability": "https://schema.org/InStock",
                   "priceSpecification": {"@type": "PriceSpecification",
                                          "priceCurrency": "USD",
                                          "description": "Free written estimate; price set after an on-site walkthrough."}},
    }


def jsonld(nodes):
    graph = {"@context": "https://schema.org", "@graph": nodes}
    return ('<script type="application/ld+json">%s</script>'
            % json.dumps(graph, ensure_ascii=False, separators=(",", ":")))


# --------------------------------------------------------------------------- shell
def head(title, desc, path, nodes, robots="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"):
    canonical = SITE + path
    return """<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>%(title)s | %(brandshort)s</title>
<meta name="description" content="%(desc)s">
<link rel="canonical" href="%(canonical)s">
<meta name="robots" content="%(robots)s">
<meta name="theme-color" content="#14315F">
<meta name="format-detection" content="telephone=yes">
<meta name="geo.region" content="US-FL">
<meta name="geo.placename" content="Sarasota, Florida">
<meta name="geo.position" content="%(lat)s;%(lon)s">
<meta name="ICBM" content="%(lat)s, %(lon)s">
<meta property="og:type" content="website">
<meta property="og:site_name" content="%(brand)s">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="%(title)s | %(brandshort)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:url" content="%(canonical)s">
<meta property="og:image" content="%(site)s/assets/img/og-cover.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Angel's Hand Painting LLC - residential and commercial painting in Sarasota, Florida">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="%(title)s | %(brandshort)s">
<meta name="twitter:description" content="%(desc)s">
<meta name="twitter:image" content="%(site)s/assets/img/og-cover.png">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"></noscript>
<link rel="stylesheet" href="/assets/css/style.css">
%(schema)s
</head>
<body>
<a class="skip" href="#main">Skip to main content</a>
""" % {
        "title": title, "brand": plain(BUSINESS["name"]),
        "brandshort": plain(BUSINESS["short"]), "desc": plain(desc),
        "canonical": canonical, "robots": robots, "site": SITE,
        "lat": BUSINESS["lat"], "lon": BUSINESS["lon"], "schema": jsonld(nodes),
    }


def header(path):
    links = []
    for url, label in NAV:
        current = ""
        if url == path or (url.endswith("/") and url != "/" and path.startswith(url)):
            current = ' aria-current="page"'
        # the logo already links home, so that item is only shown in the mobile drawer
        cls = ' class="nav-home"' if url == "/" else ""
        links.append('<a href="%s"%s%s>%s</a>' % (url, cls, current, label))
    return """
<div class="topbar">
  <div class="wrap">
    <p class="tagline">%(tagline)s</p>
    <ul>
      <li class="is-area">%(pin)s <span>Sarasota &middot; Bradenton &middot; Lakewood Ranch</span></li>
      <li>%(clock)s <span>%(hours)s</span></li>
      <li>%(shield)s <span>Fully insured</span></li>
    </ul>
  </div>
</div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="%(brand)s - home">
      <img src="/assets/img/logo.svg" width="224" height="146"
           alt="%(brand)s logo - gold angel wing and blue roof" fetchpriority="high">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"
            aria-label="Open menu">
      <svg class="bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      <svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <nav class="nav" id="primary-nav" aria-label="Primary">
      %(links)s
      <a class="btn" href="/contact.html" data-cta="nav-quote">Free Estimate</a>
    </nav>
    <div class="header-cta">
      %(tel)s
      <a class="btn" href="/contact.html" data-cta="header-quote">Free Estimate</a>
    </div>
  </div>
</header>
<main id="main">
""" % {
        "tagline": BUSINESS["tagline"], "hours": BUSINESS["hours"], "brand": plain(BUSINESS["name"]),
        "links": "\n      ".join(links), "tel": tel(),
        "pin": icon("pin"), "clock": icon("clock"), "shield": icon("shield"),
    }


def footer():
    svc_links = "".join('<li><a href="/services/%s.html">%s</a></li>' % (s["slug"], s["name"])
                        for s in SERVICES[:8])
    area_links = "".join('<li><a href="/service-areas/%s.html">%s, FL</a></li>' % (a["slug"], a["name"])
                         for a in AREAS)
    return """
</main>
<div class="sticky-cta">
  <a href="tel:%(link)s" class="is-gold" data-cta="sticky-call">%(phone_ic)s Call Now</a>
  <a href="/contact.html" data-cta="sticky-quote">%(clip)s Free Estimate</a>
</div>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/assets/img/logo-white.svg" width="230" height="150"
             alt="%(brand)s" loading="lazy">
        <p>Residential and commercial painting, drywall and home improvement across Sarasota,
           Bradenton, Lakewood Ranch and the surrounding Gulf Coast. Fully insured, meticulous
           about prep, and straight with you about what your project needs.</p>
        <div class="social">
          <a href="%(fb)s" rel="noopener" target="_blank" aria-label="Angel&#8217;s Hand Painting on Facebook">%(fbi)s</a>
          <a href="%(ig)s" rel="noopener" target="_blank" aria-label="Angel&#8217;s Hand Painting on Instagram">%(igi)s</a>
          <a href="%(gg)s" rel="noopener" target="_blank" aria-label="Angel&#8217;s Hand Painting reviews on Google">%(ggi)s</a>
        </div>
      </div>
      <div>
        <h3>Services</h3>
        <ul>%(svc)s<li><a href="/services/">All services &rarr;</a></li></ul>
      </div>
      <div>
        <h3>Service Areas</h3>
        <ul>%(areas)s<li><a href="/service-areas/">All areas &rarr;</a></li></ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul class="footer-contact">
          <li>%(phone)s<a class="footer-phone" href="tel:%(link)s" data-cta="footer-phone">%(display)s</a></li>
          <li>%(pin)s<span>Serving Sarasota &amp; Manatee counties<br>Sarasota, FL %(zip)s</span></li>
          <li>%(clock)s<span>%(hours)s<br>Sunday: by appointment</span></li>
          <li>%(shield)s<span>Fully insured &middot; Free estimates</span></li>
        </ul>
        <p style="margin-top:1.2rem"><a class="btn" href="/contact.html" data-cta="footer-quote">Request an estimate</a></p>
      </div>
    </div>
  </div>
  <div class="subfooter">
    <div class="wrap">
      <p>&copy; <span data-year>2025</span> %(brand)s. All rights reserved.</p>
      <ul>
        <li><a href="/services/">Services</a></li>
        <li><a href="/service-areas/">Service Areas</a></li>
        <li><a href="/reviews.html">Reviews</a></li>
        <li><a href="/faq.html">FAQ</a></li>
        <li><a href="/privacy.html">Privacy</a></li>
        <li><a href="/sitemap.xml">Sitemap</a></li>
      </ul>
    </div>
  </div>
</footer>
<script src="/assets/js/main.js" defer></script>
</body>
</html>
""" % {
        "brand": plain(BUSINESS["name"]), "svc": svc_links, "areas": area_links,
        "link": BUSINESS["phone_link"], "display": BUSINESS["phone_display"],
        "hours": BUSINESS["hours"], "zip": BUSINESS["postal"],
        "fb": BUSINESS["facebook"], "ig": BUSINESS["instagram"], "gg": BUSINESS["google"],
        "fbi": solid("facebook"), "igi": solid("instagram"), "ggi": solid("google"),
        "phone": icon("phone"), "pin": icon("pin"), "clock": icon("clock"), "shield": icon("shield"),
        "phone_ic": icon("phone"), "clip": icon("clipboard"),
    }


def page(path, title, desc, body, nodes, robots=None):
    kw = {"robots": robots} if robots else {}
    return head(title, desc, path, nodes, **kw) + header(path) + body + footer()


def write(path, content):
    full = os.path.join(ROOT, path.lstrip("/"))
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as fh:
        fh.write(content)
    return path


# --------------------------------------------------------------------------- shared sections
def services_grid(limit=None, heading="Complete painting &amp; home improvement services",
                  eyebrow="What we do", soft=False,
                  lede="One insured crew for the painting, the drywall behind it and the trim around it - so nobody points at anybody else when something needs fixing."):
    items = SERVICES[:limit] if limit else SERVICES
    cards = "".join(
        '<a class="card card--link reveal" href="/services/%s.html">'
        '<span class="card__ic">%s</span><h3>%s</h3><p>%s</p>'
        '<span class="more">Learn more %s</span></a>'
        % (s["slug"], icon(s["icon"]), s["name"], s["card"], icon("arrow"))
        for s in items)
    return """
<section class="section%s" id="services">
  <div class="wrap">
    <div class="head center">
      <p class="eyebrow">%s</p>
      <h2>%s</h2>
      <p class="lede">%s</p>
    </div>
    <div class="grid g-3" style="margin-top:2.6rem">%s</div>
  </div>
</section>""" % (" section--soft" if soft else "", eyebrow, heading, lede, cards)


def process_section():
    steps = [
        ("You call or text", "Tell us what you need at 941-405-2750, or send the form. We ask enough questions to know what we are walking into."),
        ("We walk the property", "We look at the actual surfaces, measure, and point out anything that needs repair before paint - including things you did not ask about."),
        ("You get it in writing", "An itemised estimate showing prep, materials, labour and a realistic schedule. No pressure, and no number that changes later."),
        ("We do the work", "Protected floors, careful prep, daily clean-up, and a final walkthrough with you before we call it finished."),
    ]
    lis = "".join('<li class="reveal"><h3>%s</h3><p>%s</p></li>' % (t, d) for t, d in steps)
    return """
<section class="section section--navy">
  <div class="wrap">
    <div class="head center">
      <p class="eyebrow">How it works</p>
      <h2>From first call to final walkthrough</h2>
      <p class="lede">No surprises, no vanishing crews, and no invoice that does not match the estimate.</p>
    </div>
    <ol class="steps" style="margin-top:2.8rem">%s</ol>
  </div>
</section>""" % lis


def reviews_section(count=6, soft=True, heading="What Sarasota &amp; Bradenton homeowners say"):
    cards = "".join(review_card(r) for r in REVIEWS[:count])
    return """
<section class="section%s" id="reviews">
  <div class="wrap">
    <div class="head center">
      <p class="eyebrow">Reviews</p>
      <h2>%s</h2>
      <p class="lede">%s <strong>%s out of 5</strong> from %d Google reviews. Every word below is the
        customer's own.</p>
    </div>
    <div class="reviews" style="margin-top:2.6rem">%s</div>
    <p class="center" style="margin-top:2.2rem">
      <a class="btn btn--ghost" href="%s" rel="noopener" target="_blank">Read our Google reviews</a>
      <a class="btn btn--navy" href="/reviews.html" style="margin-left:10px">See all reviews</a>
    </p>
  </div>
</section>""" % (" section--soft" if soft else "", heading, stars(), RATING, REVIEW_COUNT,
                 cards, BUSINESS["google"])


def areas_section(soft=False):
    pills = "".join('<li><a href="/service-areas/%s.html">%s</a></li>' % (a["slug"], a["name"])
                    for a in AREAS)
    pills += "".join('<li><span>%s</span></li>' % n for n in NEARBY)
    return """
<section class="section%s" id="areas">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Service area</p>
      <h2>Serving Sarasota &amp; Manatee counties</h2>
      <p class="lede">We are local. That means we can be at your house to look at a job in a couple of
        days, not a couple of weeks - and we are still here if you need us a year from now.</p>
      <p>Angel's Hand Painting LLC works throughout Sarasota, Bradenton, Lakewood Ranch, Venice,
        Palmetto and Siesta Key, plus the surrounding Gulf Coast communities. Not sure whether you are
        in range? Call <a href="tel:%s">%s</a> and ask.</p>
      <p class="btn-row" style="margin-top:1.6rem">
        <a class="btn btn--navy" href="/service-areas/">Browse service areas</a>
      </p>
    </div>
    <div>
      <ul class="pill-list">%s</ul>
    </div>
  </div>
</section>""" % (" section--soft" if soft else "", BUSINESS["phone_link"],
                 BUSINESS["phone_display"], pills)


def trustbar():
    items = [
        ("shield", "Fully Insured", "Your home is protected from start to finish."),
        ("star", "5-Star Rated", "%s out of 5 across %d Google reviews." % (RATING, REVIEW_COUNT)),
        ("handshake", "Reliable &amp; Professional", "On time, and respectful of your space."),
        ("ribbon", "Quality Work", "We take pride in every detail, on every job."),
    ]
    lis = "".join('<li><span class="ic">%s</span><span><b>%s</b><span>%s</span></span></li>'
                  % (icon(i), t, d) for i, t, d in items)
    return '<section class="trustbar"><div class="wrap"><ul>%s</ul></div></section>' % lis


# --------------------------------------------------------------------------- home
def build_home():
    path = "/"
    title = "Painters in Sarasota &amp; Bradenton, FL"
    desc = ("Interior and exterior painting, cabinet refinishing and drywall repair in Sarasota and "
            "Bradenton, FL. Fully insured, 5-star rated. Free estimates: 941-405-2750.")
    trail = [("/", "Home")]
    nodes = [business_node(), website_node(),
             webpage_node(path, "Painting Contractor in Sarasota & Bradenton, FL", desc, trail, True),
             breadcrumb_node(path, trail), faq_node(path, GENERAL_FAQS[:6])]

    hero = """
<section class="hero">
  <div class="wrap">
    <div>
      <div class="hero-rating">%(stars)s <b>%(rating)s</b>
        <span>from %(count)d Google reviews &middot; Sarasota &amp; Bradenton</span></div>
      <h1>Painting &amp; Home Improvement<em>Done Right The First Time</em></h1>
      <p class="lede">Interior and exterior painting, cabinet refinishing, drywall and the repairs in
        between - for homes and businesses across Sarasota, Bradenton and Lakewood Ranch.
        Fully insured, meticulous about prep, and finished when <em>you</em> say it is finished.</p>
      <ul class="hero-points">
        <li>%(chk)s <span><strong>Free, itemised written estimates</strong> - you see what the prep, materials and labour each cost.</span></li>
        <li>%(chk)s <span><strong>Prep that actually happens</strong> - patched, sanded, caulked and primed before a finish coat goes on.</span></li>
        <li>%(chk)s <span><strong>Your house put back together every evening</strong> - floors covered, tools away, dust cleaned up.</span></li>
      </ul>
      <div class="btn-row">
        <a class="btn btn--lg" href="tel:%(link)s" data-cta="hero-call">%(phone)s %(display)s</a>
        <a class="btn btn--ghost-light btn--lg" href="/services/">See all services</a>
      </div>
      <p class="hero-note">Residential &amp; commercial &middot; Se habla espa&ntilde;ol &middot; %(hours)s</p>
    </div>
    <div>%(form)s</div>
  </div>
</section>""" % {
        "stars": stars(), "rating": RATING, "count": REVIEW_COUNT, "chk": icon("check-circle"),
        "link": BUSINESS["phone_link"], "phone": icon("phone"), "display": BUSINESS["phone_display"],
        "hours": BUSINESS["hours"], "form": quote_form("hero"),
    }

    why = """
<section class="section section--soft">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Why Angel&#8217;s Hand</p>
      <h2>The difference is in the part you never see</h2>
      <p class="lede">Anyone can roll paint on a wall. What separates a finish that still looks right
        in five years from one that fails in one is everything that happens before the first
        finish coat.</p>
      <p>We fill and sand the nail holes. We caulk the trim. We spot-prime the patches so they do not
        flash through the sheen. We wash the exterior before we coat it, and we match your ceiling
        texture so the repair disappears. It costs us an extra day. It is the reason customers call
        our work <em>meticulous</em>.</p>
      <p>And because we handle the drywall, the texture and the trim as well as the paint, there is one
        crew accountable for the whole result - not three trades blaming each other.</p>
      <p class="btn-row" style="margin-top:1.6rem">
        <a class="btn btn--navy" href="/about.html">More about our crew</a>
        <a class="btn btn--ghost" href="/reviews.html">Read the reviews</a>
      </p>
    </div>
    <div class="stat-grid">
      <div class="stat"><b>%(rating)s&#9733;</b><span>Average Google rating across %(count)d reviews</span></div>
      <div class="stat"><b>2</b><span>Finish coats over primed, prepared surfaces - standard</span></div>
      <div class="stat"><b>12</b><span>Painting, drywall and home improvement services under one roof</span></div>
      <div class="stat"><b>48hr</b><span>Typical turnaround on a free written estimate</span></div>
    </div>
  </div>
</section>""" % {"rating": RATING, "count": REVIEW_COUNT}

    body = (hero + trustbar() + services_grid() + why + process_section()
            + reviews_section(6, soft=False) + areas_section(soft=True)
            + faq_block(GENERAL_FAQS[:6],
                        "Questions we get asked most",
                        "Something not covered here? Call or text 941-405-2750 - we would rather answer it now than have you guess.",
                        soft=False)
            + cta_band())
    return write("index.html", page(path, title, desc, body, nodes))


# --------------------------------------------------------------------------- services
def build_services_hub():
    path = "/services/"
    title = "Painting &amp; Home Improvement Services"
    desc = ("Painting, cabinet refinishing, drywall, texture, popcorn ceiling removal, wallpaper, "
            "pressure washing, epoxy floors and trim in Sarasota and Bradenton, FL.")
    trail = [("/", "Home"), (None, "Services")]
    nodes = [business_node(), website_node(), webpage_node(path, plain(title), desc, trail, True),
             breadcrumb_node(path, trail),
             {"@type": "ItemList", "@id": SITE + path + "#list",
              "itemListElement": [{"@type": "ListItem", "position": i + 1,
                                   "name": plain(s["name"]),
                                   "url": "%s/services/%s.html" % (SITE, s["slug"])}
                                  for i, s in enumerate(SERVICES)]}]

    head_block = """
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">Services</p>
    <h1>Complete Painting &amp; Home Improvement Services</h1>
    <p>Twelve services, one insured crew, and one point of accountability. If your project needs the
      drywall repaired, the texture matched, the trim replaced <em>and</em> the whole thing painted,
      it does not need four contractors.</p>
    <div class="btn-row">
      <a class="btn" href="tel:%s" data-cta="svc-hub-call">%s Call or text %s</a>
      <a class="btn btn--ghost-light" href="/contact.html">Get a free estimate</a>
    </div>
  </div>
</section>""" % (BUSINESS["phone_link"], icon("phone"), BUSINESS["phone_display"])

    groups = [
        ("Painting services", ["interior-painting", "exterior-painting", "cabinet-painting",
                               "wood-staining", "pressure-washing", "epoxy-garage-floors"]),
        ("Drywall services", ["drywall-repair", "texture-finishes", "popcorn-ceiling-removal"]),
        ("Home improvement", ["trim-molding", "wallpaper-installation", "handyman-home-repairs"]),
    ]
    blocks = []
    for i, (label, slugs) in enumerate(groups):
        cards = "".join(
            '<a class="card card--link reveal" href="/services/%s.html">'
            '<span class="card__ic">%s</span><h3>%s</h3><p>%s</p>'
            '<span class="more">Learn more %s</span></a>'
            % (s["slug"], icon(s["icon"]), s["name"], s["card"], icon("arrow"))
            for s in (SERVICE_BY_SLUG[x] for x in slugs))
        blocks.append("""
<section class="section%s">
  <div class="wrap">
    <div class="head head--left">
      <p class="eyebrow">%s</p>
      <h2>%s</h2>
    </div>
    <div class="grid g-3" style="margin-top:2rem">%s</div>
  </div>
</section>""" % (" section--soft" if i % 2 else "", "0%d" % (i + 1), label, cards))

    body = (breadcrumb_bar(trail) + head_block + trustbar() + "".join(blocks)
            + process_section()
            + faq_block(GENERAL_FAQS[:5], "Service questions", soft=True)
            + cta_band())
    return write("services/index.html", page(path, title, desc, body, nodes))


def build_service(svc):
    path = "/services/%s.html" % svc["slug"]
    trail = [("/", "Home"), ("/services/", "Services"), (None, plain(svc["name"]))]
    nodes = [business_node(), website_node(),
             webpage_node(path, plain(svc["title"]), plain(svc["desc"]), trail, True),
             breadcrumb_node(path, trail), service_node(path, svc),
             faq_node(path, svc["faqs"])]

    hero = """
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">%(icon_label)s</p>
    <h1>%(h1)s</h1>
    <p>%(card)s</p>
    <div class="btn-row">
      <a class="btn" href="tel:%(link)s" data-cta="svc-call">%(phone)s Call or text %(display)s</a>
      <a class="btn btn--ghost-light" href="#estimate">Get a free estimate</a>
    </div>
  </div>
</section>""" % {"icon_label": "Sarasota &middot; Bradenton &middot; Lakewood Ranch",
                 "h1": svc["h1"], "card": svc["card"], "link": BUSINESS["phone_link"],
                 "phone": icon("phone"), "display": BUSINESS["phone_display"]}

    includes = "".join('<li>%s<span>%s</span></li>' % (icon("check-circle"), t) for t in svc["includes"])
    intro = "".join("<p>%s</p>" % p for p in svc["intro"])
    extra = ""
    for h, items in svc["sections"]:
        extra += "<h3>%s</h3><ul>%s</ul>" % (h, "".join("<li>%s</li>" % i for i in items))

    related = "".join(
        '<a class="card card--link reveal" href="/services/%s.html">'
        '<span class="card__ic">%s</span><h3>%s</h3><p>%s</p>'
        '<span class="more">Learn more %s</span></a>'
        % (r["slug"], icon(r["icon"]), r["name"], r["card"], icon("arrow"))
        for r in (SERVICE_BY_SLUG[x] for x in svc["related"]))

    main = """
<section class="section">
  <div class="wrap split split--top">
    <div class="prose">
      <div class="answer-box">
        <p><b>Short answer</b>%(answer)s</p>
      </div>
      %(intro)s
      <h2>%(inc_title)s</h2>
      <ul class="svc-list">%(includes)s</ul>
      %(extra)s
      <h3>Where we do this work</h3>
      <p>%(name)s is available throughout %(areas)s and the surrounding communities in Sarasota and
        Manatee counties. <a href="/service-areas/">See every area we serve</a>.</p>
    </div>
    <div>
      <div id="estimate" style="position:sticky;top:calc(var(--header-h) + 24px)">%(form)s</div>
    </div>
  </div>
</section>
<section class="section section--soft">
  <div class="wrap">
    <div class="head center">
      <p class="eyebrow">Often booked together</p>
      <h2>Related services</h2>
    </div>
    <div class="grid g-3" style="margin-top:2.2rem">%(related)s</div>
  </div>
</section>""" % {
        "answer": svc["answer"], "intro": intro, "inc_title": svc["includes_title"],
        "includes": includes, "extra": extra, "name": svc["name"],
        "areas": ", ".join(AREA_NAMES[:-1]) + " and " + AREA_NAMES[-1],
        "form": quote_form(svc["slug"], "Free estimate", "Tell us about your project - no obligation.", True),
        "related": related,
    }

    body = (breadcrumb_bar(trail) + hero + trustbar() + main
            + reviews_section(3, soft=False, heading="Reviews from customers like you")
            + faq_block(svc["faqs"], "%s: your questions answered" % plain(svc["h1"]), soft=True)
            + cta_band())
    return write("services/%s.html" % svc["slug"],
                 page(path, svc["title"], svc["desc"], body, nodes))


# --------------------------------------------------------------------------- service areas
def build_areas_hub():
    path = "/service-areas/"
    title = "Service Areas - Sarasota &amp; Manatee"
    desc = ("We serve Sarasota, Bradenton, Lakewood Ranch, Venice, Palmetto and Siesta Key. Fully "
            "insured painting and drywall. Free estimates: 941-405-2750.")
    trail = [("/", "Home"), (None, "Service Areas")]
    nodes = [business_node(), website_node(), webpage_node(path, plain(title), desc, trail, True),
             breadcrumb_node(path, trail),
             {"@type": "ItemList", "@id": SITE + path + "#list",
              "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": a["name"],
                                   "url": "%s/service-areas/%s.html" % (SITE, a["slug"])}
                                  for i, a in enumerate(AREAS)]}]

    cards = "".join(
        '<a class="card card--link reveal" href="/service-areas/%s.html">'
        '<span class="card__ic">%s</span><h3>%s, FL</h3><p>%s</p>'
        '<span class="more">%s painters %s</span></a>'
        % (a["slug"], icon("pin"), a["name"], plain(a["intro"][0])[:150].rsplit(" ", 1)[0] + "&hellip;",
           a["name"], icon("arrow"))
        for a in AREAS)

    head_block = """
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">Where we work</p>
    <h1>Serving Sarasota &amp; Manatee Counties</h1>
    <p>We are a local crew, not a franchise routing calls from another state. That means a walkthrough
      in days rather than weeks, and somebody who still answers the phone a year after the job is done.</p>
    <div class="btn-row">
      <a class="btn" href="tel:%s" data-cta="areas-call">%s Call or text %s</a>
    </div>
  </div>
</section>""" % (BUSINESS["phone_link"], icon("phone"), BUSINESS["phone_display"])

    nearby = "".join("<li><span>%s</span></li>" % n for n in NEARBY)
    body = (breadcrumb_bar(trail) + head_block + trustbar() + """
<section class="section">
  <div class="wrap">
    <div class="head center">
      <p class="eyebrow">Main service areas</p>
      <h2>Cities we cover</h2>
      <p class="lede">Each area page covers the work we do most there, the neighborhoods we cover and
        what local conditions mean for your paint.</p>
    </div>
    <div class="grid g-3" style="margin-top:2.4rem">%s</div>
  </div>
</section>
<section class="section section--soft">
  <div class="wrap head center">
    <p class="eyebrow">Also serving</p>
    <h2>Surrounding communities</h2>
    <p class="lede">Not listed? Call <a href="tel:%s">%s</a> and ask - if we can get there, we will
      quote it.</p>
    <ul class="pill-list" style="justify-content:center;margin-top:1.8rem">%s</ul>
  </div>
</section>""" % (cards, BUSINESS["phone_link"], BUSINESS["phone_display"], nearby)
            + reviews_section(3, soft=False) + cta_band())
    return write("service-areas/index.html", page(path, title, desc, body, nodes))


def build_area(area):
    path = "/service-areas/%s.html" % area["slug"]
    trail = [("/", "Home"), ("/service-areas/", "Service Areas"), (None, area["name"])]
    answer = ("Angel's Hand Painting LLC provides interior and exterior painting, cabinet refinishing, "
              "drywall repair, texture matching, wallpaper installation, pressure washing and home "
              "repairs throughout %s, Florida. We are fully insured, hold a 5.0 star Google rating, "
              "and estimates are free. Call or text 941-405-2750." % area["name"])
    nodes = [business_node(), website_node(),
             webpage_node(path, plain(area["title"]), plain(area["desc"]), trail, True),
             breadcrumb_node(path, trail), faq_node(path, area["faqs"]),
             {"@type": "Service", "@id": SITE + path + "#service",
              "name": "Painting and drywall services in %s, FL" % area["name"],
              "serviceType": "Painting contractor",
              "provider": {"@id": SITE + "/#business"},
              "areaServed": {"@type": "City", "name": area["name"], "addressRegion": "FL",
                             "containedInPlace": {"@type": "State", "name": "Florida"}},
              "url": SITE + path}]

    hero = """
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">%(name)s, Florida</p>
    <h1>Painters in %(name)s, FL</h1>
    <p>Interior and exterior painting, cabinet refinishing, drywall repair and home improvement -
      fully insured, 5-star rated, and local to %(name)s.</p>
    <div class="btn-row">
      <a class="btn" href="tel:%(link)s" data-cta="area-call">%(phone)s Call or text %(display)s</a>
      <a class="btn btn--ghost-light" href="#estimate">Free estimate</a>
    </div>
  </div>
</section>""" % {"name": area["name"], "link": BUSINESS["phone_link"], "phone": icon("phone"),
                 "display": BUSINESS["phone_display"]}

    intro = "".join("<p>%s</p>" % p for p in area["intro"])
    local = ""
    for h, items in area["local"]:
        local += "<h3>%s</h3><ul>%s</ul>" % (h, "".join("<li>%s</li>" % i for i in items))
    hoods = "".join("<li><span>%s</span></li>" % n for n in area["neighborhoods"])
    svc_links = "".join('<li><a href="/services/%s.html">%s</a></li>' % (s["slug"], s["name"])
                        for s in SERVICES)

    main = """
<section class="section">
  <div class="wrap split split--top">
    <div class="prose">
      <div class="answer-box"><p><b>In short</b>%(answer)s</p></div>
      %(intro)s
      %(local)s
      <h3>Neighborhoods we cover in %(name)s</h3>
      <ul class="pill-list" style="margin:1.2rem 0 1.8rem">%(hoods)s</ul>
      <p><strong>ZIP codes served:</strong> %(zips)s</p>
      <h2>Services available in %(name)s</h2>
      <ul class="pill-list">%(svc)s</ul>
    </div>
    <div><div id="estimate" style="position:sticky;top:calc(var(--header-h) + 24px)">%(form)s</div></div>
  </div>
</section>
<section class="section section--soft">
  <div class="wrap">
    <table class="facts">
      <caption class="visually-hidden">Key facts about Angel&#8217;s Hand Painting LLC in %(name)s</caption>
      <tbody>
        <tr><th scope="row">Business</th><td>%(brand)s</td></tr>
        <tr><th scope="row">Serving</th><td>%(name)s, FL and surrounding Sarasota &amp; Manatee county communities</td></tr>
        <tr><th scope="row">Phone</th><td><a href="tel:%(link)s">%(display)s</a> (call or text)</td></tr>
        <tr><th scope="row">Hours</th><td>%(hours)s; Sunday by appointment</td></tr>
        <tr><th scope="row">Rating</th><td>%(rating)s out of 5 from %(count)d Google reviews</td></tr>
        <tr><th scope="row">Insurance</th><td>Fully insured; certificate available on request</td></tr>
        <tr><th scope="row">Estimates</th><td>Free, itemised and in writing - no obligation</td></tr>
        <tr><th scope="row">Languages</th><td>English and Spanish</td></tr>
      </tbody>
    </table>
  </div>
</section>""" % {
        "answer": answer, "intro": intro, "local": local, "name": area["name"], "hoods": hoods,
        "zips": area["zips"], "svc": svc_links, "brand": BUSINESS["name"],
        "form": quote_form(area["slug"], "Free estimate in %s" % area["name"],
                           "No obligation. Most estimates within 48 hours.", True),
        "link": BUSINESS["phone_link"], "display": BUSINESS["phone_display"],
        "hours": BUSINESS["hours"], "rating": RATING, "count": REVIEW_COUNT,
    }

    body = (breadcrumb_bar(trail) + hero + trustbar() + main
            + reviews_section(3, soft=False,
                              heading="Reviews from around %s" % area["name"])
            + faq_block(area["faqs"], "Painting in %s: common questions" % area["name"], soft=True)
            + cta_band(title="Get your free %s estimate" % area["name"]))
    return write("service-areas/%s.html" % area["slug"],
                 page(path, area["title"], area["desc"], body, nodes))


# --------------------------------------------------------------------------- standalone pages
def build_reviews():
    path = "/reviews.html"
    title = "Reviews - 5-Star Rated Painters"
    desc = ("Verified 5-star Google reviews for Angel's Hand Painting LLC - interior painting, drywall "
            "repair, wallpaper and exterior work in Sarasota and Bradenton.")
    trail = [("/", "Home"), (None, "Reviews")]
    nodes = [business_node(), website_node(), webpage_node(path, plain(title), desc, trail, True),
             breadcrumb_node(path, trail)]
    cards = "".join(review_card(r) for r in REVIEWS)
    hero = """
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">Reviews</p>
    <h1>%s out of 5 on Google</h1>
    <p>Every review below is a customer's own words, copied from our Google Business Profile with
      nothing edited and nothing added. Owner replies have been left off so you are reading only
      what the customer wrote.</p>
    <div class="btn-row">
      <a class="btn" href="%s" rel="noopener" target="_blank">Verify on Google</a>
      <a class="btn btn--ghost-light" href="/contact.html">Get a free estimate</a>
    </div>
  </div>
</section>""" % (RATING, BUSINESS["google"])
    body = (breadcrumb_bar(trail) + hero + trustbar() + """
<section class="section">
  <div class="wrap">
    <div class="head center">
      <p class="eyebrow">In their words</p>
      <h2>What our customers say</h2>
      <p class="lede">%s <strong>%s</strong> from %d Google reviews. Reviews marked with
        &ldquo;&hellip;&rdquo; were shortened by Google itself - the full text is on our Google
        profile.</p>
    </div>
    <div class="reviews" style="margin-top:2.6rem">%s</div>
  </div>
</section>
<section class="section section--soft">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Worked with us?</p>
      <h2>A review helps more than you know</h2>
      <p class="lede">We are a small local crew. Reviews from real neighbours are how people in
        Sarasota and Bradenton decide who to let into their home - if we did right by you, a couple of
        sentences on Google means a great deal.</p>
      <p class="btn-row"><a class="btn" href="%s" rel="noopener" target="_blank">Leave a Google review</a></p>
    </div>
    <div>%s</div>
  </div>
</section>""" % (stars(), RATING, REVIEW_COUNT, cards, BUSINESS["google"],
                 quote_form("reviews", "Get your free estimate",
                            "Join the customers below - no obligation.", True))
            + cta_band())
    return write("reviews.html", page(path, title, desc, body, nodes))


def build_about():
    path = "/about.html"
    title = "About Our Sarasota Painting Crew"
    desc = ("A fully insured, family-run painting, drywall and home improvement crew serving Sarasota, "
            "Bradenton and Lakewood Ranch. Quality you can see, details you can trust.")
    trail = [("/", "Home"), (None, "About")]
    nodes = [business_node(), website_node(), webpage_node(path, plain(title), desc, trail, True),
             breadcrumb_node(path, trail), {"@type": "AboutPage", "@id": SITE + path + "#about",
                                            "url": SITE + path, "mainEntity": {"@id": SITE + "/#business"}}]
    hero = """
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">About us</p>
    <h1>Quality You Can See. Details You Can Trust.</h1>
    <p>That line is on our trucks because it is the only promise that matters in this trade. Anyone
      can quote a room. Very few will still be caulking the trim at 5pm on a Friday.</p>
  </div>
</section>"""
    body = (breadcrumb_bar(trail) + hero + trustbar() + """
<section class="section">
  <div class="wrap split split--top">
    <div class="prose">
      <h2>A small crew, in your neighborhood</h2>
      <p>Angel's Hand Painting LLC is a family-run painting, drywall and home improvement company
        working across Sarasota, Bradenton, Lakewood Ranch and the surrounding Gulf Coast. Angel and
        Miguel run the crews themselves - which means the person who quotes your job is the person
        standing in your living room while it is being done.</p>
      <p>We started the way most good contractors do: one careful job at a time, with customers
        passing our number to their neighbours. Read our
        <a href="/reviews.html">Google reviews</a> and you will notice the same words coming up -
        meticulous, professional, on time, fair. Those are not marketing words we chose. They are what
        customers wrote.</p>
      <h2>What we actually believe about this work</h2>
      <h3>Prep is the job</h3>
      <p>Paint is the last four hours of a five-day job. The patching, sanding, caulking, masking and
        priming are what decide whether the finish looks right and whether it lasts. We do not
        shortcut it, and our estimates show you what it costs so you can see we are not pretending
        it is free.</p>
      <h3>Small jobs deserve the same care</h3>
      <p>One of our reviews says it plainly: a small project, taken seriously, given the same
        attention you would expect on a much larger job. A single patched ceiling gets the same
        texture match and the same clean-up as a whole-house repaint.</p>
      <h3>Your home goes back together every night</h3>
      <p>We work in occupied homes constantly. Floors get covered, furniture gets protected, dust
        gets cleaned up, and the space is put back before we leave for the day. You should be able to
        live normally while we work.</p>
      <h3>Straight answers, including the ones you did not want</h3>
      <p>If your cabinets are not worth refinishing, we will say so. If your ceiling might contain
        asbestos and needs a licensed abatement contractor instead of us, we will tell you that too.
        Losing a job is cheaper than doing the wrong one.</p>
      <h2>Residential and commercial</h2>
      <p>We work on single-family homes, condos, seasonal residences and rentals, and on offices,
        storefronts, multi-unit properties and commercial interiors. Commercial work can be scheduled
        outside business hours, and we can provide a certificate of insurance for property management.</p>
      <h2>Fully insured</h2>
      <p>Angel's Hand Painting LLC carries insurance covering both our crew and your property, and we
        are glad to send a certificate to you, your HOA or your building manager before we start. It
        is a question worth asking every contractor you consider - and worth being suspicious of when
        the answer is vague.</p>
    </div>
    <div>
      <div style="position:sticky;top:calc(var(--header-h) + 24px)">
        %(form)s
        <table class="facts" style="margin-top:1.6rem">
          <tbody>
            <tr><th scope="row">Business</th><td>%(brand)s</td></tr>
            <tr><th scope="row">Based in</th><td>Sarasota, Florida</td></tr>
            <tr><th scope="row">Serving</th><td>Sarasota &amp; Manatee counties</td></tr>
            <tr><th scope="row">Type</th><td>Residential &amp; commercial</td></tr>
            <tr><th scope="row">Insurance</th><td>Fully insured</td></tr>
            <tr><th scope="row">Rating</th><td>%(rating)s / 5 &middot; %(count)d Google reviews</td></tr>
            <tr><th scope="row">Languages</th><td>English &amp; Spanish</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>""" % {"form": quote_form("about", "Free estimate", "Tell us about your project.", True),
                 "brand": BUSINESS["name"], "rating": RATING, "count": REVIEW_COUNT}
            + process_section() + reviews_section(3, soft=True) + cta_band())
    return write("about.html", page(path, title, desc, body, nodes))


def build_faq():
    path = "/faq.html"
    title = "Painting FAQ - Costs, Timing &amp; Process"
    desc = ("Answers to what Sarasota and Bradenton homeowners ask most about painting, drywall repair, "
            "estimates, insurance, timing and what to expect.")
    trail = [("/", "Home"), (None, "FAQ")]
    all_faqs = list(GENERAL_FAQS)
    for s in SERVICES:
        all_faqs.append(s["faqs"][0])
    nodes = [business_node(), website_node(), webpage_node(path, plain(title), desc, trail, True),
             breadcrumb_node(path, trail), faq_node(path, all_faqs)]
    hero = """
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">FAQ</p>
    <h1>Questions, Answered Straight</h1>
    <p>Estimates, insurance, timing, disruption and cost - the things people actually want to know
      before letting a contractor into their home.</p>
    <div class="btn-row">
      <a class="btn" href="tel:%s">%s Ask us directly: %s</a>
    </div>
  </div>
</section>""" % (BUSINESS["phone_link"], icon("phone"), BUSINESS["phone_display"])

    svc_faqs = [s["faqs"][0] for s in SERVICES]
    body = (breadcrumb_bar(trail) + hero
            + faq_block(GENERAL_FAQS, "Working with us", soft=False)
            + faq_block(svc_faqs, "Questions by service",
                        "Each service page carries more detail - follow the links in the answers.",
                        soft=True)
            + services_grid(6, heading="Explore our services", eyebrow="Services",
                            lede="Full detail, process and pricing factors for each service.")
            + cta_band())
    return write("faq.html", page(path, title, desc, body, nodes))


def build_contact():
    path = "/contact.html"
    title = "Contact Us - Free Painting Estimates"
    desc = ("Get a free, no-obligation painting or drywall estimate. Call or text 941-405-2750, or send "
            "the form. Serving Sarasota, Bradenton and Lakewood Ranch.")
    trail = [("/", "Home"), (None, "Contact")]
    nodes = [business_node(), website_node(), webpage_node(path, plain(title), desc, trail, True),
             breadcrumb_node(path, trail),
             {"@type": "ContactPage", "@id": SITE + path + "#contact", "url": SITE + path,
              "mainEntity": {"@id": SITE + "/#business"}}]
    hero = """
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">Contact</p>
    <h1>Get Your Free Estimate</h1>
    <p>Call, text or send the form. We will ask a few questions, arrange a time to look at the work,
      and give you an itemised written price - with no obligation and nobody chasing you afterwards.</p>
  </div>
</section>"""
    body = (breadcrumb_bar(trail) + hero + """
<section class="section">
  <div class="wrap split split--top">
    <div class="prose">
      <h2>Fastest way to reach us</h2>
      <p><a class="btn btn--lg" href="tel:%(link)s" data-cta="contact-call">%(phone)s Call or text %(display)s</a></p>
      <p>Texting is genuinely fine - send a photo of what you are looking at and we can usually tell
        you straight away whether it is a half-day repair or a bigger project.</p>
      <h2>What to have ready</h2>
      <ul>
        <li>Roughly which rooms or which elevations of the house</li>
        <li>Anything you have already noticed - cracks, stains, peeling, water damage</li>
        <li>Your timing, and whether anything is driving it (a closing, a listing, a tenant)</li>
        <li>Colours if you have chosen them; if not, we will help</li>
      </ul>
      <h2>Details</h2>
      <table class="facts">
        <tbody>
          <tr><th scope="row">Business</th><td>%(brand)s</td></tr>
          <tr><th scope="row">Phone</th><td><a href="tel:%(link)s">%(display)s</a> - call or text</td></tr>
          <tr><th scope="row">Hours</th><td>%(hours)s<br>Sunday: by appointment</td></tr>
          <tr><th scope="row">Service area</th><td>Sarasota, Bradenton, Lakewood Ranch, Venice, Palmetto,
            Siesta Key and surrounding Sarasota &amp; Manatee county communities</td></tr>
          <tr><th scope="row">Estimates</th><td>Free, itemised, in writing, no obligation</td></tr>
          <tr><th scope="row">Insurance</th><td>Fully insured - certificate on request</td></tr>
          <tr><th scope="row">Languages</th><td>English &amp; Spanish</td></tr>
          <tr><th scope="row">Social</th><td>
            <a href="%(fb)s" rel="noopener" target="_blank">Facebook</a> &middot;
            <a href="%(ig)s" rel="noopener" target="_blank">Instagram</a> &middot;
            <a href="%(gg)s" rel="noopener" target="_blank">Google</a></td></tr>
        </tbody>
      </table>
      <h2>Emergency and water damage</h2>
      <p>If a leak has damaged a ceiling or wall, get the source of the leak fixed first, then call us.
        We will remove the damaged board, seal the stains, match the texture and repaint. Small water
        damage repairs are commonly finished in one to two days.</p>
    </div>
    <div><div style="position:sticky;top:calc(var(--header-h) + 24px)">%(form)s</div></div>
  </div>
</section>""" % {"link": BUSINESS["phone_link"], "phone": icon("phone"),
                 "display": BUSINESS["phone_display"], "brand": BUSINESS["name"],
                 "hours": BUSINESS["hours"], "fb": BUSINESS["facebook"],
                 "ig": BUSINESS["instagram"], "gg": BUSINESS["google"],
                 "form": quote_form("contact", "Request your free estimate",
                                    "We reply to most requests within one business day.")}
            + trustbar() + reviews_section(3, soft=True) + cta_band())
    return write("contact.html", page(path, title, desc, body, nodes))


def build_thank_you():
    path = "/thank-you.html"
    title = "Thank You"
    desc = "Thanks for contacting Angel's Hand Painting LLC. We will get back to you within one business day."
    trail = [("/", "Home"), (None, "Thank you")]
    nodes = [business_node(), website_node(), webpage_node(path, plain(title), desc, trail)]
    body = """
<section class="page-head">
  <div class="wrap center" style="margin-inline:auto">
    <p class="eyebrow" style="justify-content:center">Request received</p>
    <h1>Thank You &mdash; We Have Your Request</h1>
    <p style="margin-inline:auto">One of us will get back to you within one business day to arrange a
      walkthrough. If it is urgent, call or text and you will reach us faster.</p>
    <div class="btn-row btn-row--center" style="justify-content:center">
      <a class="btn btn--lg" href="tel:%(link)s">%(phone)s Call or text %(display)s</a>
      <a class="btn btn--ghost-light" href="/">Back to home</a>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="head center">
      <p class="eyebrow">While you wait</p>
      <h2>Have a look at our work and our reviews</h2>
    </div>
    <div class="grid g-3" style="margin-top:2.4rem">
      <a class="card card--link" href="/reviews.html"><span class="card__ic">%(star)s</span>
        <h3>Google reviews</h3><p>%(rating)s out of 5 from %(count)d customers across Sarasota and
        Bradenton, in their own words.</p><span class="more">Read reviews %(arrow)s</span></a>
      <a class="card card--link" href="/services/"><span class="card__ic">%(roller)s</span>
        <h3>All services</h3><p>Twelve painting, drywall and home improvement services under one
        insured roof.</p><span class="more">Browse services %(arrow)s</span></a>
      <a class="card card--link" href="/faq.html"><span class="card__ic">%(clip)s</span>
        <h3>FAQ</h3><p>Costs, timing, disruption and what to expect - answered straight.</p>
        <span class="more">Read the FAQ %(arrow)s</span></a>
    </div>
  </div>
</section>""" % {"link": BUSINESS["phone_link"], "phone": icon("phone"),
                 "display": BUSINESS["phone_display"], "rating": RATING, "count": REVIEW_COUNT,
                 "star": icon("star"), "roller": icon("roller"), "clip": icon("clipboard"),
                 "arrow": icon("arrow")}
    return write("thank-you.html", page(path, title, desc, body, nodes, robots="noindex,follow"))


def build_privacy():
    path = "/privacy.html"
    title = "Privacy Policy"
    desc = "How Angel's Hand Painting LLC handles the information you send through this website."
    trail = [("/", "Home"), (None, "Privacy Policy")]
    nodes = [business_node(), website_node(), webpage_node(path, plain(title), desc, trail)]
    body = (breadcrumb_bar(trail) + """
<section class="page-head"><div class="wrap"><p class="eyebrow">Legal</p>
  <h1>Privacy Policy</h1><p>Last updated <span data-year>2025</span>.</p></div></section>
<section class="section"><div class="wrap prose">
  <h2>What we collect</h2>
  <p>If you fill in an estimate request on this site, we collect the name, phone number, email address
    and project details you choose to give us. We do not ask for and do not want payment details
    through this website.</p>
  <h2>What we do with it</h2>
  <p>We use your details for one purpose: to respond to your request, arrange a walkthrough and quote
    your project. We do not sell, rent or trade your information to anyone.</p>
  <h2>How long we keep it</h2>
  <p>We keep estimate requests and job records for as long as we need them for our business and tax
    records. Ask us and we will delete your details from our active records.</p>
  <h2>Cookies and analytics</h2>
  <p>This site does not set advertising cookies. If analytics are enabled, they are used only to
    understand which pages people find useful. Your browser settings control cookies at any time.</p>
  <h2>Third parties</h2>
  <p>Form submissions are delivered through our website host or form provider, and our fonts are
    served by Google Fonts. Those providers handle the data only in order to deliver the service.</p>
  <h2>Contact</h2>
  <p>Questions about your information? Call or text <a href="tel:%s">%s</a>.</p>
</div></section>""" % (BUSINESS["phone_link"], BUSINESS["phone_display"]))
    return write("privacy.html", page(path, title, desc, body, nodes, robots="noindex,follow"))


def build_404():
    path = "/404.html"
    title = "Page Not Found"
    desc = "That page does not exist. Browse our painting services or call 941-405-2750."
    trail = [("/", "Home"), (None, "Not found")]
    nodes = [business_node(), website_node(), webpage_node(path, plain(title), desc, trail)]
    links = "".join('<li><a href="/services/%s.html">%s</a></li>' % (s["slug"], s["name"])
                    for s in SERVICES)
    body = """
<section class="page-head"><div class="wrap center" style="margin-inline:auto">
  <p class="eyebrow" style="justify-content:center">404</p>
  <h1>That Page Has Been Painted Over</h1>
  <p style="margin-inline:auto">The page you were after is not here. Try one of the links below, or
    just call us - it is usually faster anyway.</p>
  <div class="btn-row btn-row--center" style="justify-content:center">
    <a class="btn btn--lg" href="tel:%s">%s Call or text %s</a>
    <a class="btn btn--ghost-light" href="/">Back to home</a>
  </div>
</div></section>
<section class="section"><div class="wrap head center">
  <h2>Our services</h2>
  <ul class="pill-list" style="justify-content:center;margin-top:1.6rem">%s</ul>
</div></section>""" % (BUSINESS["phone_link"], icon("phone"), BUSINESS["phone_display"], links)
    return write("404.html", page(path, title, desc, body, nodes, robots="noindex,follow"))


# --------------------------------------------------------------------------- non-HTML assets
def build_sitemap(paths):
    today = date.today().isoformat()
    priority = {"/": "1.0", "/services/": "0.9", "/service-areas/": "0.9",
                "/contact.html": "0.9", "/reviews.html": "0.8"}
    urls = []
    for p in paths:
        if p in ("/thank-you.html", "/404.html", "/privacy.html"):
            continue
        pri = priority.get(p, "0.8" if p.startswith(("/services/", "/service-areas/")) else "0.7")
        urls.append("  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>\n"
                    "    <changefreq>monthly</changefreq>\n    <priority>%s</priority>\n  </url>"
                    % (SITE, p, today, pri))
    return write("sitemap.xml",
                 '<?xml version="1.0" encoding="UTF-8"?>\n'
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                 + "\n".join(urls) + "\n</urlset>\n")


def build_robots():
    return write("robots.txt", """# robots.txt - %(brand)s
User-agent: *
Allow: /
Disallow: /thank-you.html

# AI answer engines are welcome - see /llms.txt for a structured summary.
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: %(site)s/sitemap.xml
""" % {"brand": plain(BUSINESS["name"]), "site": SITE})


def build_llms():
    svc = "\n".join("- [%s](%s/services/%s.html): %s"
                    % (plain(s["name"]), SITE, s["slug"], plain(s["card"])) for s in SERVICES)
    areas = "\n".join("- [%s, FL](%s/service-areas/%s.html): %s"
                      % (a["name"], SITE, a["slug"], plain(a["desc"])) for a in AREAS)
    faqs = "\n\n".join("**%s**\n%s" % (plain(q), plain(a)) for q, a in GENERAL_FAQS)
    revs = "\n".join('- %s (5/5, Google): "%s%s"'
                     % (r["author"], r["text"], "..." if r["truncated"] else "") for r in REVIEWS)
    return write("llms.txt", """# %(brand)s

> Residential and commercial painting, drywall and home improvement contractor serving Sarasota,
> Bradenton, Lakewood Ranch and the surrounding Gulf Coast of Southwest Florida.
> Tagline: "%(tagline)s"

## Key facts

- **Business name**: %(brand)s
- **Type**: Painting contractor / home improvement contractor (residential and commercial)
- **Phone (call or text)**: %(phone)s
- **Service area**: Sarasota and Manatee counties, Florida - Sarasota, Bradenton, Lakewood Ranch,
  Venice, Palmetto, Siesta Key, Osprey, Nokomis, Ellenton, Parrish, Longboat Key, Anna Maria Island,
  Holmes Beach, North Port, Englewood, University Park, Terra Ceia, Myakka City
- **Hours**: %(hours)s; Sunday by appointment
- **Rating**: %(rating)s out of 5 from %(count)d Google reviews
- **Insurance**: Fully insured; certificate of insurance available on request
- **Estimates**: Free, itemised, in writing, no obligation
- **Languages**: English and Spanish
- **Website**: %(site)s/

## Services

%(svc)s

## Service areas

%(areas)s

## Frequently asked questions

%(faqs)s

## Customer reviews (verbatim, from Google)

%(revs)s

## Contact

Call or text %(phone)s, or use the estimate form at %(site)s/contact.html.
""" % {"brand": plain(BUSINESS["name"]), "tagline": BUSINESS["tagline"],
       "phone": BUSINESS["phone_display"], "hours": BUSINESS["hours"], "rating": RATING,
       "count": REVIEW_COUNT, "site": SITE, "svc": svc, "areas": areas, "faqs": faqs, "revs": revs})


def build_manifest():
    return write("site.webmanifest", json.dumps({
        "name": plain(BUSINESS["name"]),
        "short_name": "Angel's Hand",
        "description": "Painting, drywall and home improvement in Sarasota, Bradenton and Lakewood Ranch, FL.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#FFFFFF",
        "theme_color": "#14315F",
        "icons": [
            {"src": "/assets/img/favicon.svg", "sizes": "any", "type": "image/svg+xml",
             "purpose": "any maskable"},
            {"src": "/assets/img/apple-touch-icon.png", "sizes": "180x180", "type": "image/png"},
        ],
    }, indent=2) + "\n")


def build_headers():
    """Cache + security headers for Netlify; harmless elsewhere."""
    return write("_headers", """/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
""")


# --------------------------------------------------------------------------- main
def main():
    paths = []
    paths.append("/")
    build_home()
    paths.append("/services/")
    build_services_hub()
    for s in SERVICES:
        build_service(s)
        paths.append("/services/%s.html" % s["slug"])
    paths.append("/service-areas/")
    build_areas_hub()
    for a in AREAS:
        build_area(a)
        paths.append("/service-areas/%s.html" % a["slug"])
    for fn, p in ((build_reviews, "/reviews.html"), (build_about, "/about.html"),
                  (build_faq, "/faq.html"), (build_contact, "/contact.html")):
        fn()
        paths.append(p)
    build_thank_you()
    build_privacy()
    build_404()
    build_sitemap(paths)
    build_robots()
    build_llms()
    build_manifest()
    build_headers()
    print("Built %d indexable pages + sitemap, robots.txt, llms.txt, manifest." % len(paths))
    print("Site URL: %s" % SITE)


if __name__ == "__main__":
    sys.exit(main())
