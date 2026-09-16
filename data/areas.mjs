/**
 * Service areas.
 *
 * `cities` generate their own landing page at /service-areas/<slug>/ and are
 * the pages that rank for "concrete contractor near me" searches in each town.
 * Give every one of them genuinely different copy — near-identical town pages
 * are treated as doorway pages and get filtered out of local results.
 *
 * `additional` towns are listed on the hub page and in LocalBusiness
 * `areaServed` but do not get their own page.
 */

export const cities = [
  {
    slug: 'butler-pa',
    name: 'Butler',
    full: 'Butler, PA',
    county: 'Butler County',
    zips: ['16001', '16002', '16003'],
    metaTitle: 'Concrete Contractor in Butler, PA',
    metaDescription:
      'Concrete driveways, patios, sidewalks, steps and excavation in Butler, PA and Butler County. Free on-site estimates from a local crew.',
    intro:
      'Butler is home base. A lot of the housing stock in and around the city dates to the mid-century or earlier, which means original driveways and front steps that were poured on dirt with no base and no air entrainment — and have the scaling, settling and separated steps to show for it. Those are the jobs we do most often here.',
    local:
      'The hillside lots off Hansen Avenue and around the North Main corridor bring their own drainage problems: water coming downhill has to be intercepted and routed before any slab goes in, or the new concrete fails the same way the old concrete did. On tight city lots we work out truck access and pump options during the estimate so nobody is surprised on pour day.',
    landmarks: ['Butler City', 'Meridian', 'Lyndora', 'Center Township', 'Summit Township', 'Connoquenessing'],
  },
  {
    slug: 'cranberry-township-pa',
    name: 'Cranberry Township',
    full: 'Cranberry Township, PA',
    county: 'Butler County',
    zips: ['16066'],
    metaTitle: 'Concrete Contractor in Cranberry Township, PA',
    metaDescription:
      'Concrete driveways, stamped patios, walkways and site prep in Cranberry Township, PA. Licensed, insured and HOA-friendly scheduling.',
    intro:
      'Cranberry is mostly newer construction, and the work here skews toward adding rather than replacing: extending a driveway for a third vehicle, putting in the stamped patio the builder never included, pouring a pad for a shed or a hot tub behind a house that came with a bare back yard.',
    local:
      'Plan development rules matter here more than anywhere else we work. Many Cranberry neighborhoods require architectural review before an impervious surface is added, and the township has its own stormwater management thresholds. We build the approval timeline into the schedule and provide the drawings and square footages an HOA committee will ask for, rather than leaving that paperwork with you.',
    landmarks: ['Cranberry Woods', 'Freedom Road corridor', 'Graham Park', 'Marshall Township line', 'Seven Fields'],
  },
  {
    slug: 'mars-pa',
    name: 'Mars',
    full: 'Mars, PA',
    county: 'Butler County',
    zips: ['16046'],
    metaTitle: 'Concrete Contractor in Mars, PA',
    metaDescription:
      'Concrete driveways, patios, steps and excavation in Mars and Adams Township, PA. Local crew, free on-site estimates, fixed written pricing.',
    intro:
      'Mars and the surrounding Adams Township developments sit on rolling ground, and a fair share of the homes here were built on cut-and-fill lots. That makes base preparation the deciding factor — fill that was never compacted will take a new slab down with it.',
    local:
      'On fill lots we probe before quoting, dig out anything soft and rebuild the base in compacted lifts rather than pouring thicker concrete and hoping. It costs more in the excavation line and less over the life of the driveway. Long shared and rural drives out toward Valencia and Middlesex also get culvert and drainage attention as part of the same visit.',
    landmarks: ['Adams Township', 'Valencia', 'Middlesex Township', 'Callery', 'Warrendale line'],
  },
  {
    slug: 'zelienople-pa',
    name: 'Zelienople',
    full: 'Zelienople, PA',
    county: 'Butler County',
    zips: ['16063'],
    metaTitle: 'Concrete Contractor in Zelienople, PA',
    metaDescription:
      'Concrete driveways, sidewalks, steps and patios in Zelienople and Harmony, PA. Borough-spec sidewalk work and historic-district care.',
    intro:
      'Zelienople and neighboring Harmony have the borough sidewalk network that goes with an old walkable town — and with it, the township notices that arrive when a panel heaves. Sidewalk replacement to borough specification is steady work for us here.',
    local:
      'Much of the older housing near Main Street sits in or beside the historic district, where the look of the work matters as much as the engineering. We match existing scoring patterns and panel sizes on sidewalk replacements so a new section does not read as a patch, and we handle the borough permit and inspection sequence directly.',
    landmarks: ['Harmony', 'Jackson Township', 'Lancaster Township', 'Evans City line', 'Route 68 corridor'],
  },
  {
    slug: 'evans-city-pa',
    name: 'Evans City',
    full: 'Evans City, PA',
    county: 'Butler County',
    zips: ['16033'],
    metaTitle: 'Concrete Contractor in Evans City, PA',
    metaDescription:
      'Concrete driveways, patios, steps, pads and excavation in Evans City, PA and Forward Township. Free estimates from a local Butler County crew.',
    intro:
      'Evans City mixes tight borough lots with larger parcels out toward Forward and Jackson Township, and we handle both — a city driveway with no room for a truck to turn around one week, a barn pad and access lane the next.',
    local:
      'On the rural properties around here, access road and culvert work usually needs doing before anything else is worth pouring. We would rather fix the approach and the drainage first and pour the following season than put good concrete on a road that washes out every spring.',
    landmarks: ['Forward Township', 'Jackson Township', 'Callery', 'Connoquenessing Creek', 'Route 68'],
  },
  {
    slug: 'saxonburg-pa',
    name: 'Saxonburg',
    full: 'Saxonburg, PA',
    county: 'Butler County',
    zips: ['16056'],
    metaTitle: 'Concrete Contractor in Saxonburg, PA',
    metaDescription:
      'Driveways, patios, steps, shed pads and excavation in Saxonburg, PA and Jefferson Township. Licensed and insured local contractor.',
    intro:
      'Saxonburg’s properties run larger, which means longer driveways, detached garages and outbuildings — and pads and access drives that have to carry real equipment rather than just a family car.',
    local:
      'Long rural driveways are their own discipline: crown, ditch line, culvert sizing and turnaround geometry decide whether the surface survives, far more than the material on top does. We price those as a drainage job with a driveway on it, because that is what they are.',
    landmarks: ['Jefferson Township', 'Clinton Township', 'Winfield Township', 'Sarver', 'Cabot'],
  },
  {
    slug: 'slippery-rock-pa',
    name: 'Slippery Rock',
    full: 'Slippery Rock, PA',
    county: 'Butler County',
    zips: ['16057'],
    metaTitle: 'Concrete Contractor in Slippery Rock, PA',
    metaDescription:
      'Concrete, excavation and landscaping in Slippery Rock, PA — residential, commercial and rental property work welcome.',
    intro:
      'Slippery Rock carries a mix we do not see everywhere else: family homes, farm properties, and a large stock of student rentals and small multi-unit buildings where walkways, steps and parking areas take heavy foot traffic and need to stay safe and liability-clean.',
    local:
      'For rental and commercial owners here we work off-season and between leases wherever possible, and we are comfortable quoting a multi-property package — several buildings’ walks and steps priced and scheduled as one job rather than seven separate visits.',
    landmarks: ['Slippery Rock University', 'Slippery Rock Township', 'Worth Township', 'Prospect', 'Portersville'],
  },
  {
    slug: 'gibsonia-pa',
    name: 'Gibsonia',
    full: 'Gibsonia, PA',
    county: 'Allegheny County',
    zips: ['15044'],
    metaTitle: 'Concrete Contractor in Gibsonia, PA',
    metaDescription:
      'Concrete driveways, stamped patios, steps and excavation in Gibsonia, Richland and Pine Township, PA. Free on-site estimate.',
    intro:
      'Gibsonia, Richland and Pine Township sit in the band of northern Allegheny County where 1990s and 2000s housing is now hitting the age at which original builder-grade driveways and porches start to go.',
    local:
      'Builder driveways from that era were commonly poured thin and under-jointed to hit a price. When they fail they tend to fail all at once across the whole slab, which is why a full replacement almost always prices out better here than chasing individual panels. We will show you the joint spacing and the edge thickness on your own driveway so you can see which situation you are in.',
    landmarks: ['Richland Township', 'Pine Township', 'Hampton Township', 'Wexford', 'Allison Park'],
  },
  {
    slug: 'wexford-pa',
    name: 'Wexford',
    full: 'Wexford, PA',
    county: 'Allegheny County',
    zips: ['15090'],
    metaTitle: 'Concrete Contractor in Wexford, PA',
    metaDescription:
      'Stamped patios, concrete driveways, walkways and hardscaping in Wexford and Pine-Marshall, PA. Decorative finishes, HOA-ready documentation.',
    intro:
      'Wexford and the Pine-Marshall corridor lean toward decorative work — stamped and colored patios, walkway upgrades, outdoor living spaces and driveway borders where the finish is doing as much work as the slab.',
    local:
      'Decorative concrete is unforgiving of a rushed pour, so we schedule stamped work with the weather rather than around it, and we will move a date rather than stamp a slab that is flashing off too fast. We also supply the plan drawings and impervious-surface calculations that architectural review committees in this area typically request.',
    landmarks: ['Pine Township', 'Marshall Township', 'Franklin Park', 'Bradford Woods', 'McCandless'],
  },
  {
    slug: 'new-castle-pa',
    name: 'New Castle',
    full: 'New Castle, PA',
    county: 'Lawrence County',
    zips: ['16101', '16102', '16105'],
    metaTitle: 'Concrete Contractor in New Castle, PA',
    metaDescription:
      'Concrete sidewalks, steps, driveways and demolition in New Castle, PA and Lawrence County. Trip-hazard and city-notice work handled.',
    intro:
      'New Castle has an older, denser housing stock than most of our service area, and the work reflects it: front steps rebuilt on proper footers, sidewalk panels replaced to city specification, and slab demolition and haul-off where something has simply reached the end.',
    local:
      'City sidewalk notices carry deadlines. Bring us the notice and we will price it to the city’s specification, pull the permit, and get it inspected inside the compliance window. On the narrow lots here, access and debris handling are planned before the quote so the neighbors and the street are not part of the job.',
    landmarks: ['Neshannock Township', 'Union Township', 'Shenango Township', 'Ellwood City', 'Lawrence County'],
  },
];

/** Towns served that are listed but do not get their own landing page. */
export const additional = [
  'Seven Fields', 'Harmony', 'Prospect', 'Portersville', 'Chicora', 'Renfrew',
  'Lyndora', 'Connoquenessing', 'Callery', 'Valencia', 'Sarver', 'Cabot',
  'Ellwood City', 'West Sunbury', 'Karns City', 'Petrolia', 'Allison Park',
  'Bradford Woods', 'Franklin Park', 'Warrendale', 'Cheswick', 'Freeport',
  'Tarentum', 'Natrona Heights', 'Beaver Falls', 'Chippewa', 'Monaca',
  'Rochester', 'Baden', 'Economy', 'Grove City', 'Harrisville', 'Boyers',
  'Eau Claire', 'Fenelton', 'Herman',
];

export const counties = ['Butler County', 'Allegheny County', 'Lawrence County', 'Beaver County', 'Armstrong County'];

export default { cities, additional, counties };
