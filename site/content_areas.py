"""Service-area pages. One page per city keeps local intent queries
("pool cage rescreening bradenton") landing on a page that actually names the
place, and gives answer engines an unambiguous areaServed entity to cite.

Neighborhood lists are local knowledge, not invention-by-template — but do
check them against where you actually take jobs before publishing.
"""

AREAS = [
{
  "slug": "sarasota",
  "city": "Sarasota",
  "county": "Sarasota County",
  "lat": "27.3364", "lon": "-82.5307",
  "zips": ["34231", "34232", "34233", "34234", "34235", "34236", "34237", "34238", "34239", "34240", "34241"],
  "neighborhoods": ["Downtown Sarasota", "Siesta Key", "Gulf Gate", "Palmer Ranch",
                    "The Meadows", "Bee Ridge", "Southgate", "Sarasota Springs", "Fruitville"],
  "blurb": "Sarasota is where most of our week goes. Between the barrier-island salt air "
           "and the tree canopy inland, cages here take damage from two directions at "
           "once — UV and salt on the coast, falling limbs and pollen east of the "
           "Trail.",
  "local_note": "Coastal and key properties almost always want 20/20 no-see-um mesh; "
                "screen life runs at the short end of the 5–7 year range this close to "
                "the Gulf.",
},
{
  "slug": "bradenton",
  "city": "Bradenton",
  "county": "Manatee County",
  "lat": "27.4989", "lon": "-82.5748",
  "zips": ["34201", "34202", "34203", "34205", "34207", "34208", "34209", "34210", "34211", "34212"],
  "neighborhoods": ["West Bradenton", "Bayshore Gardens", "Palma Sola", "Braden River",
                    "Cortez", "Samoset", "Bradenton Beach", "Anna Maria Island"],
  "blurb": "Manatee County's older neighborhoods are full of 1980s and 1990s cages "
           "that have been rescreened once and never had their fasteners touched. "
           "That is usually what we find first on a Bradenton estimate.",
  "local_note": "On Anna Maria and Cortez properties we specify stainless fasteners as "
                "standard — coated screws simply do not last that close to the water.",
},
{
  "slug": "venice",
  "city": "Venice",
  "county": "Sarasota County",
  "lat": "27.0998", "lon": "-82.4543",
  "zips": ["34275", "34285", "34292", "34293"],
  "neighborhoods": ["Venice Island", "South Venice", "Venice Gardens", "Nokomis",
                    "Osprey", "Laurel", "Jacaranda"],
  "blurb": "Venice and the Nokomis–Osprey corridor are heavily screened, and a lot of "
           "it is original to the house. Whole-cage rescreens are the norm here rather "
           "than the exception.",
  "local_note": "Island and south-Venice properties get a lot of afternoon sun; solar "
                "shade screen on the west panels makes those lanais usable again in "
                "August.",
},
{
  "slug": "north-port",
  "city": "North Port",
  "county": "Sarasota County",
  "lat": "27.0442", "lon": "-82.2359",
  "zips": ["34286", "34287", "34288", "34289", "34291"],
  "neighborhoods": ["North Port Estates", "Warm Mineral Springs", "Bobcat Trail",
                    "Heron Creek", "Talon Bay", "Sumter Boulevard corridor"],
  "blurb": "North Port has more new construction than anywhere else we work, which "
           "means a lot of new cages — and a lot of builder-grade screen and doors "
           "that owners want upgraded within the first few years.",
  "local_note": "Pet-resistant mesh on lower panels is the single most requested "
                "upgrade here; new-build cages come with standard fiberglass all the "
                "way down.",
},
{
  "slug": "port-charlotte",
  "city": "Port Charlotte",
  "county": "Charlotte County",
  "lat": "26.9762", "lon": "-82.0906",
  "zips": ["33948", "33952", "33953", "33954", "33980", "33981"],
  "neighborhoods": ["Port Charlotte Beach", "Deep Creek", "Gulf Cove", "El Jobean",
                    "Murdock", "Harbour Heights"],
  "blurb": "Charlotte County took the worst of recent storm seasons, and a lot of "
           "cages here have been patched more than once. We are just as often "
           "assessing frames as replacing screen.",
  "local_note": "On canal-front lots, no-see-um mesh is not optional — standard 18/14 "
                "will not keep the midges out on a still evening.",
},
{
  "slug": "punta-gorda",
  "city": "Punta Gorda",
  "county": "Charlotte County",
  "lat": "26.9298", "lon": "-82.0454",
  "zips": ["33950", "33955", "33982", "33983"],
  "neighborhoods": ["Punta Gorda Isles", "Burnt Store", "Deep Creek", "Charlotte Harbor",
                    "Historic Punta Gorda"],
  "blurb": "Punta Gorda Isles is almost entirely canal-front, which is the harshest "
           "environment we work in — salt, sun and constant humidity on the same "
           "aluminum.",
  "local_note": "We recommend stainless fasteners and a fastener inspection every "
                "three years on PGI and Burnt Store properties.",
},
{
  "slug": "lakewood-ranch",
  "city": "Lakewood Ranch",
  "county": "Manatee County",
  "lat": "27.4181", "lon": "-82.4270",
  "zips": ["34202", "34211", "34240"],
  "neighborhoods": ["Country Club", "Greenbrook", "Lakewood National", "Waterside",
                    "Del Webb", "Mallory Park", "Esplanade"],
  "blurb": "Lakewood Ranch communities are newer and most have HOA standards on "
           "enclosure appearance. We keep frame colors and mesh consistent with what "
           "is already approved in the community.",
  "local_note": "Bring us your HOA's architectural guidelines with the estimate request "
                "and we will quote to them, which saves a resubmission later.",
},
{
  "slug": "englewood",
  "city": "Englewood",
  "county": "Sarasota &amp; Charlotte Counties",
  "lat": "26.9620", "lon": "-82.3529",
  "zips": ["34223", "34224"],
  "neighborhoods": ["Englewood Beach", "Manasota Key", "Rotonda West", "Grove City",
                    "East Englewood"],
  "blurb": "Manasota Key and Englewood Beach are as coastal as it gets on this stretch "
           "of the Gulf. Screen and fasteners both age faster here than five miles "
           "inland, and we quote accordingly.",
  "local_note": "Expect the short end of every service-life estimate on the key. That "
                "is the trade for being that close to the water.",
},
]

AREA_BY_SLUG = {a["slug"]: a for a in AREAS}
