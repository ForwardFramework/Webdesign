/* ==========================================================================
   Pittsburgh-metro service-area pages.
   Each entry produces one landing page at /service-areas/<slug>.html with
   genuinely unique copy — duplicated city pages are treated as thin content
   by search engines and are ignored by AI answer engines.
   ========================================================================== */

const cities = [
  {
    slug: 'pittsburgh', name: 'Pittsburgh', county: 'Allegheny County',
    zips: ['15201', '15203', '15206', '15211', '15213', '15217', '15224', '15232'],
    neighborhoods: ['Squirrel Hill', 'Shadyside', 'Lawrenceville', 'Bloomfield', 'Brookline', 'Mt. Washington', 'Point Breeze', 'Highland Park'],
    housing: 'Pittsburgh’s housing stock is among the oldest in the country, with large concentrations of pre-1940 frame and brick homes. Steep-pitched roofs, slate originals long since converted to asphalt, multiple additions joined at awkward angles, and shared party walls in the row-house neighbourhoods all make flashing detail more important here than almost anywhere else.',
    challenge: 'Older city homes frequently have two or even three layers of shingles hiding decking that has never been inspected. We tear off to the deck on every replacement, so what is underneath gets seen rather than buried.',
  },
  {
    slug: 'mount-lebanon', name: 'Mt. Lebanon', county: 'Allegheny County',
    zips: ['15228', '15216', '15234'],
    neighborhoods: ['Virginia Manor', 'Mission Hills', 'Beverly Heights', 'Sunset Hills'],
    housing: 'Mt. Lebanon is defined by well-kept 1920s–1950s Tudors, colonials and brick foursquares on mature tree-lined streets. Many carry complex roof geometry — dormers, cross-gables, turrets and slate-era steep pitches converted to asphalt.',
    challenge: 'Heavy tree canopy means constant debris in gutters and valleys, which drives both ice dams and premature granule loss on the shaded north slopes. Gutter guards and correct valley detailing pay for themselves here.',
  },
  {
    slug: 'bethel-park', name: 'Bethel Park', county: 'Allegheny County',
    zips: ['15102'],
    neighborhoods: ['Village Green', 'Broughton', 'Sunset Hills area'],
    housing: 'Bethel Park is largely post-war and 1960s–1980s suburban construction — ranches, split-levels and two-storey colonials on generous lots, with simpler roof planes than the older city neighbourhoods.',
    challenge: 'A great many Bethel Park roofs were installed within the same handful of years and are now hitting the end of their service life at once. Split-levels in particular have low-slope tie-ins that need careful ice-and-water treatment.',
  },
  {
    slug: 'upper-st-clair', name: 'Upper St. Clair', county: 'Allegheny County',
    zips: ['15241'],
    neighborhoods: ['Boyce', 'Trotwood Hills', 'Hastings'],
    housing: 'Upper St. Clair has a high proportion of larger, architecturally detailed homes — multi-gable colonials, contemporaries and custom builds with substantial roof areas and steep pitches.',
    challenge: 'Bigger, more complex roofs mean more valleys, more penetrations and more places to get flashing wrong. These are the roofs where an itemised, measured estimate matters most, and where cheap bids usually mean skipped details.',
  },
  {
    slug: 'peters-township', name: 'Peters Township', county: 'Washington County',
    zips: ['15317'],
    neighborhoods: ['McMurray', 'Venetia', 'Thompsonville'],
    housing: 'Peters Township is dominated by newer suburban development — 1990s-onward colonials and larger builds in planned neighbourhoods, many now reaching the age where an original builder-grade three-tab roof needs replacing.',
    challenge: 'Original builder-grade shingles and minimal attic ventilation are the pattern here. Upgrading to architectural shingles with balanced ridge-and-soffit ventilation typically adds years to the next roof’s life.',
  },
  {
    slug: 'monroeville', name: 'Monroeville', county: 'Allegheny County',
    zips: ['15146'],
    neighborhoods: ['Garden City', 'Monroeville Mall area', 'Pitcairn border'],
    housing: 'Monroeville is a mix of 1950s–1970s ranches and split-levels alongside newer developments, generally on open lots with straightforward roof geometry.',
    challenge: 'Monroeville’s more exposed, less-sheltered lots take wind directly. Wind-lifted and creased shingles along ridges and rakes are the most common storm damage we document here.',
  },
  {
    slug: 'penn-hills', name: 'Penn Hills', county: 'Allegheny County',
    zips: ['15235', '15147'],
    neighborhoods: ['Lincoln Park', 'Rosedale', 'Verona border'],
    housing: 'Penn Hills has one of the largest concentrations of mid-century housing in the eastern suburbs — brick ranches, capes and split-entries, most under significant tree cover.',
    challenge: 'Mature trees plus older gutter systems make clogged runs and ice damming a recurring winter problem. Correcting drainage and ventilation alongside the roof is usually the difference between a ten-year fix and a permanent one.',
  },
  {
    slug: 'plum', name: 'Plum', county: 'Allegheny County',
    zips: ['15239'],
    neighborhoods: ['Holiday Park', 'Renton', 'Unity'],
    housing: 'Plum is a spread-out borough of 1960s–1990s single-family homes on larger, often sloped lots, with a good deal of newer construction toward Holiday Park.',
    challenge: 'Hillside lots and long driveways mean access and staging matter. We plan dumpster placement and material drop with the homeowner in advance so a steep drive does not become a problem on install day.',
  },
  {
    slug: 'wexford', name: 'Wexford', county: 'Allegheny County',
    zips: ['15090'],
    neighborhoods: ['Pine Township', 'Marshall Township', 'Franklin Park border'],
    housing: 'Wexford and the surrounding Pine–Richland corridor are largely 1990s and newer, with larger homes, high roof pitches and substantial roof areas.',
    challenge: 'Steep, tall roofs need proper staging and fall protection, and they are unforgiving of poor workmanship because every plane is visible from the street. These are jobs where a documented, inspected finish is worth insisting on.',
  },
  {
    slug: 'cranberry-township', name: 'Cranberry Township', county: 'Butler County',
    zips: ['16066'],
    neighborhoods: ['Park Place', 'Freedom Road corridor', 'Graham Park area'],
    housing: 'Cranberry is one of the fastest-growing communities north of Pittsburgh, with a housing stock skewed heavily toward 1990s-and-newer developments and planned neighbourhoods.',
    challenge: 'Whole streets were built in the same season with the same materials, so roofs age out together. Many carry HOA requirements on colour and profile — we handle the specification so the replacement is approved without a second round.',
  },
  {
    slug: 'ross-township', name: 'Ross Township', county: 'Allegheny County',
    zips: ['15237', '15229', '15202'],
    neighborhoods: ['West View', 'McKnight Road corridor', 'Perrysville'],
    housing: 'Ross Township is a dense North Hills community of post-war capes, ranches and brick colonials on modest lots, with plenty of 1950s and 1960s construction.',
    challenge: 'Compact lots and close-set homes limit staging room, and older capes often have low-slope rear additions tied into steeper main roofs — a junction that leaks if the transition is not detailed correctly.',
  },
  {
    slug: 'moon-township', name: 'Moon Township', county: 'Allegheny County',
    zips: ['15108'],
    neighborhoods: ['Coraopolis border', 'Thorn Run', 'Crescent'],
    housing: 'Moon Township mixes 1970s–1990s suburban housing with newer development near the airport corridor, generally on open, exposed lots.',
    challenge: 'The open terrain west of the city catches wind hard. We see more lifted ridge caps and rake-edge damage out here than in the sheltered eastern suburbs, which makes proper starter-course and ridge fastening critical.',
  },
  {
    slug: 'sewickley', name: 'Sewickley', county: 'Allegheny County',
    zips: ['15143'],
    neighborhoods: ['Sewickley Heights', 'Edgeworth', 'Osborne', 'Glen Osborne'],
    housing: 'Sewickley has an exceptional stock of historic homes — Victorians, large Colonial Revivals and estate properties, many with slate, tile or complex multi-plane asphalt roofs and heavy ornamental trim.',
    challenge: 'Historic homes demand a contractor who will match profiles and respect detail rather than defaulting to the fastest system. Mature canopy also makes valley debris and gutter capacity an ongoing concern.',
  },
  {
    slug: 'robinson-township', name: 'Robinson Township', county: 'Allegheny County',
    zips: ['15205', '15136'],
    neighborhoods: ['Settlers Ridge area', 'Montour', 'Kirwan Heights border'],
    housing: 'Robinson Township combines older established neighbourhoods with newer development around the retail corridor, giving a broad mix of ranches, split-levels and modern two-storey homes.',
    challenge: 'The mix of housing ages means no two Robinson estimates look alike. Older sections often hide multiple shingle layers, while newer builds usually need ventilation corrections more than structural work.',
  },
  {
    slug: 'shaler-township', name: 'Shaler Township', county: 'Allegheny County',
    zips: ['15116', '15209'],
    neighborhoods: ['Glenshaw', 'Millvale border', 'Etna border'],
    housing: 'Shaler is a hillside North Hills township of mid-century capes, ranches and older frame homes, many built into slopes with walk-out lower levels.',
    challenge: 'Hillside grading pushes water toward foundations, so downspout discharge and gutter capacity matter more here than the flat-lot average. We size and route drainage as part of the roof, not as an afterthought.',
  },
  {
    slug: 'murrysville', name: 'Murrysville', county: 'Westmoreland County',
    zips: ['15668'],
    neighborhoods: ['Export', 'Delmont border', 'Sardis'],
    housing: 'Murrysville is a large, low-density municipality of 1970s-onward single-family homes on wooded acreage, with generous lot sizes and significant tree cover.',
    challenge: 'Wooded acreage means constant organic debris, moss on shaded slopes, and falling-limb damage during storms. Regular inspection catches limb strikes before they become interior leaks.',
  },
];

module.exports = { cities };
