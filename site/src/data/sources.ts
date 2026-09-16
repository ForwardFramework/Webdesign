import type { SourceRef } from './types';

/**
 * Citation registry. Every dataset references these by id, and the UI renders
 * them, so a visitor (or an AI answer engine) can trace any claim on the site
 * back to where it came from and when it was checked.
 *
 * This is also the GEO play: generative engines weight content that shows its
 * working far more heavily than content that just asserts.
 */
export const RESEARCH_DATE = '2026-09-16';

export const SOURCES: Record<string, SourceRef> = {
  rclcoMidyear2026: {
    id: 'rclcoMidyear2026',
    label: 'RCLCO — Top-Selling Master-Planned Communities, Mid-Year 2026',
    url: 'https://www.rclco.com/publication/the-top-selling-master-planned-communities-of-2025/',
    retrieved: RESEARCH_DATE,
  },
  observerRanking2026: {
    id: 'observerRanking2026',
    label: 'Your Observer — "Lakewood Ranch remains No. 1 in sales in mid-year survey" (Jul 2026)',
    url: 'https://www.yourobserver.com/news/2026/jul/30/lakewood-ranch-tops-sales/',
    retrieved: RESEARCH_DATE,
  },
  lwrOfficial: {
    id: 'lwrOfficial',
    label: 'Lakewood Ranch — official community site',
    url: 'https://lakewoodranch.com/',
    retrieved: RESEARCH_DATE,
  },
  lwrVillages: {
    id: 'lwrVillages',
    label: 'Lakewood Ranch — Villages',
    url: 'https://lakewoodranch.com/our-homes/villages/',
    retrieved: RESEARCH_DATE,
  },
  lwrParks: {
    id: 'lwrParks',
    label: 'Lakewood Ranch — Parks & Trails',
    url: 'https://lakewoodranch.com/life-on-the-ranch/parks-trails/',
    retrieved: RESEARCH_DATE,
  },
  lwrWaterside: {
    id: 'lwrWaterside',
    label: 'Lakewood Ranch — Waterside Place',
    url: 'https://lakewoodranch.com/waterside-place/',
    retrieved: RESEARCH_DATE,
  },
  watersideHappyHour: {
    id: 'watersideHappyHour',
    label: 'Waterside Place — Happy Hour promotions',
    url: 'https://watersideplace.com/promos/happy-hour/',
    retrieved: RESEARCH_DATE,
  },
  zillowLwr: {
    id: 'zillowLwr',
    label: 'Zillow — Lakewood Ranch, FL home values',
    url: 'https://www.zillow.com/home-values/782240/lakewood-ranch-fl/',
    retrieved: RESEARCH_DATE,
  },
  hoaCddRenick: {
    id: 'hoaCddRenick',
    label: 'Team Renick — Typical HOA fees / CDD fees in Lakewood Ranch (2026)',
    url: 'https://blog.teamrenick.com/what-are-typical-hoa-fees-in-lakewood-ranch/',
    retrieved: RESEARCH_DATE,
  },
  cddRenick: {
    id: 'cddRenick',
    label: 'Team Renick — What CDD fees should I expect in Lakewood Ranch (2026)',
    url: 'https://blog.teamrenick.com/what-cdd-fees-should-i-expect-in-lakewood-ranch/',
    retrieved: RESEARCH_DATE,
  },
  newConstructionGuide: {
    id: 'newConstructionGuide',
    label: 'Local Life Homes — New Construction Homes in Lakewood Ranch, 2026 Buyer’s Guide',
    url: 'https://www.locallifehomes.com/new-construction/new-construction-homes-lakewood-ranch-fl/',
    retrieved: RESEARCH_DATE,
  },
  builderIncentives: {
    id: 'builderIncentives',
    label: 'Beyond Realty FL — Builder incentives in Sarasota & Lakewood Ranch',
    url: 'https://beyondrealtyfl.com/blog/builder-incentives-in-sarasota-and-lakewood-ranch-reach-5-year-high',
    retrieved: RESEARCH_DATE,
  },
  greatSchools: {
    id: 'greatSchools',
    label: 'GreatSchools — Lakewood Ranch, FL school ratings',
    url: 'https://www.greatschools.org/florida/lakewood-ranch/',
    retrieved: RESEARCH_DATE,
  },
  nicheLwrHigh: {
    id: 'nicheLwrHigh',
    label: 'Niche — Lakewood Ranch High School rankings (2026)',
    url: 'https://www.niche.com/k12/lakewood-ranch-high-school-bradenton-fl/rankings/',
    retrieved: RESEARCH_DATE,
  },
  manateeSchools: {
    id: 'manateeSchools',
    label: 'School District of Manatee County — immunizations & enrolment',
    url: 'https://www.manateeschools.net/o/sdmc/page/school-immunizations',
    retrieved: RESEARCH_DATE,
  },
  sarasotaSchools: {
    id: 'sarasotaSchools',
    label: 'Sarasota County Schools — New student registration',
    url: 'https://www.sarasotacountyschools.net/page/new-registration',
    retrieved: RESEARCH_DATE,
  },
  flhsmvNewResident: {
    id: 'flhsmvNewResident',
    label: 'Florida Highway Safety and Motor Vehicles — New Resident guide',
    url: 'https://www.flhsmv.gov/new-resident/',
    retrieved: RESEARCH_DATE,
  },
  flDohSchool: {
    id: 'flDohSchool',
    label: 'Florida Department of Health — School entry health requirements',
    url: 'https://www.floridahealth.gov/individual-family-health/child-infant-youth/school-health/school-enrollment/',
    retrieved: RESEARCH_DATE,
  },
  frec61J2: {
    id: 'frec61J2',
    label: 'Fla. Admin. Code R. 61J2-10.025 — Advertising',
    url: 'https://www.flrules.org/gateway/ruleno.asp?id=61J2-10.025',
    retrieved: RESEARCH_DATE,
  },
  narFairHousing: {
    id: 'narFairHousing',
    label: 'National Association of REALTORS® — Fair Housing',
    url: 'https://www.nar.realtor/fair-housing',
    retrieved: RESEARCH_DATE,
  },
  stellarApi: {
    id: 'stellarApi',
    label: 'Stellar MLS — API options (MLS Grid / Bridge)',
    url: 'https://www.stellarmls.com/api-options',
    retrieved: RESEARCH_DATE,
  },
  stellarDataDelivery: {
    id: 'stellarDataDelivery',
    label: 'Stellar MLS — Data Delivery Solutions',
    url: 'https://www.stellarmls.com/data-delivery',
    retrieved: RESEARCH_DATE,
  },
  lwrMedical: {
    id: 'lwrMedical',
    label: 'Lakewood Ranch Medical Center',
    url: 'https://lakewoodranchmedicalcenter.com/',
    retrieved: RESEARCH_DATE,
  },
  visitSarasotaBeaches: {
    id: 'visitSarasotaBeaches',
    label: 'Visit Sarasota County — Area beaches',
    url: 'https://www.visitsarasota.com/sarasota-area-beaches',
    retrieved: RESEARCH_DATE,
  },
  timeanddateClimate: {
    id: 'timeanddateClimate',
    label: 'timeanddate.com — Sarasota climate averages',
    url: 'https://www.timeanddate.com/weather/usa/sarasota/climate',
    retrieved: RESEARCH_DATE,
  },
  climateData: {
    id: 'climateData',
    label: 'climate-data.org — Sarasota / Bradenton monthly averages',
    url: 'https://en.climate-data.org/north-america/united-states-of-america/florida/sarasota-1610/',
    retrieved: RESEARCH_DATE,
  },
  manateeTax: {
    id: 'manateeTax',
    label: 'Manatee County property tax rate & calculator (2026)',
    url: 'https://movewithmomentum.com/florida-property-tax/manatee',
    retrieved: RESEARCH_DATE,
  },
  sarasotaTax: {
    id: 'sarasotaTax',
    label: 'Sarasota County property tax rate & calculator (2026)',
    url: 'https://movewithmomentum.com/florida-property-tax/sarasota',
    retrieved: RESEARCH_DATE,
  },
  lwrPrep: {
    id: 'lwrPrep',
    label: 'Lakewood Ranch Preparatory Academy',
    url: 'https://lakewoodranchprep.charterschoolsusa.com/learn-more',
    retrieved: RESEARCH_DATE,
  },
  oda: {
    id: 'oda',
    label: 'The Out-of-Door Academy',
    url: 'https://www.oda.edu/',
    retrieved: RESEARCH_DATE,
  },
  edsTavern: {
    id: 'edsTavern',
    label: 'Ed’s Tavern — Main Street at Lakewood Ranch',
    url: 'https://edstavernfl.com/about-us/',
    retrieved: RESEARCH_DATE,
  },
  allswell: {
    id: 'allswell',
    label: 'Allswell Waterside — Happy hour menu',
    url: 'https://allswellsarasota.com/menus/happy-hour',
    retrieved: RESEARCH_DATE,
  },
  publixTownCenter: {
    id: 'publixTownCenter',
    label: 'Publix — Lakewood Ranch Town Center store page',
    url: 'https://www.publix.com/locations/709-lakewood-ranch-town-center',
    retrieved: RESEARCH_DATE,
  },
  homesteadGuide: {
    id: 'homesteadGuide',
    label: 'Florida homestead exemption 2026 guide (Save Our Homes & portability)',
    url: 'https://propertycalchub.com/guides/homestead-exemption/florida/',
    retrieved: RESEARCH_DATE,
  },
};

export const source = (id: string): SourceRef | undefined => SOURCES[id];
export const sourcesFor = (ids?: string[]): SourceRef[] =>
  (ids ?? []).map((id) => SOURCES[id]).filter(Boolean) as SourceRef[];
