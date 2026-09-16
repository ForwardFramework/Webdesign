import { RESEARCH_DATE } from './sources';

/** Climate, market and cost-of-living figures. All ranges, all dated, all sourced. */

export const CLIMATE = {
  verifiedOn: RESEARCH_DATE,
  sources: ['timeanddateClimate', 'climateData'],
  /** Reported annual sunshine hours for Sarasota. Sources vary, so both are shown. */
  sunshineHoursLow: 2930,
  sunshineHoursHigh: 3326,
  avgDailySunHours: 6.5,
  sunniestMonth: { month: 'May', dailyHours: 10.5 },
  darkestMonth: { month: 'December', dailyHours: 6.4 },
  months: [
    { month: 'Jan', high: 72, low: 52, note: 'Peak season. Windows open, no humidity.' },
    { month: 'Feb', high: 74, low: 54, note: 'Best month on the calendar, ask anyone.' },
    { month: 'Mar', high: 78, low: 58, note: 'Spring training and beach weather together.' },
    { month: 'Apr', high: 82, low: 62, note: 'Dry, warm, gorgeous. Gulf starts warming.' },
    { month: 'May', high: 87, low: 68, note: 'Sunniest month — 10.5 hours a day.' },
    { month: 'Jun', high: 90, low: 73, note: 'Wet season starts: afternoon storms, then clear.' },
    { month: 'Jul', high: 91, low: 75, note: 'Hot. Beach mornings, pool afternoons.' },
    { month: 'Aug', high: 91, low: 77, note: 'Warmest month. Gulf feels like bathwater.' },
    { month: 'Sep', high: 89, low: 75, note: 'Still summer. Peak of hurricane season.' },
    { month: 'Oct', high: 85, low: 69, note: 'The turn. Humidity breaks, locals exhale.' },
    { month: 'Nov', high: 79, low: 62, note: 'Perfect. Everyone is outside.' },
    { month: 'Dec', high: 74, low: 55, note: 'Shorts at Christmas. Boat parades.' },
  ],
  gulfWaterTemp: { summer: 86, winter: 64 },
} as const;

export const MARKET = {
  verifiedOn: RESEARCH_DATE,
  sources: ['zillowLwr', 'rclcoMidyear2026', 'observerRanking2026'],
  /** Community-level median. Varies a lot by village — the village pages show the spread. */
  medianPrice: 599000,
  medianPriceYoyPct: 1.7,
  /**
   * Days on market is reported inconsistently across sources right now
   * (99.5 in one dataset, 55–65 in a Q1 2026 report). Both shown rather than
   * picking the flattering one.
   */
  daysOnMarketRange: [55, 100] as const,
  monthsOfSupplyApprox: 1.0,
  manateeCountyMedian: 489634,
  manateeSalesYoyPct: 10.0,
  /** RCLCO mid-year 2026. */
  nationalRankMultigen: 1,
  consecutiveYearsNo1Multigen: 8,
  midYearSales2026: 1035,
  zones: [
    { name: 'Established core (The Lake Club, Country Club East)', median: 750000, pricePerSqft: 318 },
    { name: 'Northwest Lakewood Ranch', median: 495000, pricePerSqft: 264 },
  ],
} as const;

export const COST_OF_LIVING = {
  verifiedOn: RESEARCH_DATE,
  sources: ['manateeTax', 'sarasotaTax', 'homesteadGuide'],
  stateIncomeTax: 0,
  /** Millage, 2025–26 cycle. Total includes schools. */
  manateeMillage: 17.29,
  manateeSchoolMillage: 6.5,
  sarasotaMillage: 13.48,
  /** Worked examples from the sources, kept as examples not promises. */
  examples: [
    { county: 'Manatee', homeValue: 350000, homesteaded: true, annualTax: 5350 },
    { county: 'Sarasota', homeValue: 350000, homesteaded: true, annualTax: 4185 },
  ],
  homesteadExemptionTotal2026: 51411,
  homesteadDeadline: 'March 1',
  portabilityCapUsd: 500000,
  /** Insurance is the number that surprises people most. Shown as a wide range on purpose. */
  homeInsuranceAnnualLow: 5500,
  homeInsuranceAnnualHigh: 11000,
  homeInsuranceNote:
    'Florida had the highest average homeowners premium in the nation in 2026 (about $7,136/yr for $300,000 dwelling coverage). Coastal addresses pay two to three times what inland ones do — which is one real argument for living inland in Lakewood Ranch and driving to the beach. Policies also carry a separate hurricane deductible, typically 2–5% of dwelling coverage.',
} as const;

export const DRIVE_TIMES = {
  verifiedOn: RESEARCH_DATE,
  note:
    'Typical off-peak drive times from central Lakewood Ranch. Season (roughly January–April) adds meaningful time to anything crossing to the barrier islands — locals plan beach trips before 10am in season for a reason.',
  destinations: [
    { name: 'Main Street at Lakewood Ranch', minutes: 8, miles: 3 },
    { name: 'Waterside Place', minutes: 12, miles: 5 },
    { name: 'UTC Mall', minutes: 14, miles: 7 },
    { name: 'Nathan Benderson Park', minutes: 14, miles: 7 },
    { name: 'Sarasota Bradenton Intl. Airport (SRQ)', minutes: 12, miles: 8, confidence: 'verified' },
    { name: 'Downtown Sarasota', minutes: 25, miles: 15 },
    { name: 'Coquina Beach', minutes: 35, miles: 22 },
    { name: 'Siesta Key Beach', minutes: 40, miles: 21 },
    { name: 'Lido Beach & St. Armands Circle', minutes: 35, miles: 19 },
    { name: 'Anna Maria Island', minutes: 45, miles: 27 },
    { name: 'Myakka River State Park', minutes: 30, miles: 18 },
    { name: 'Tampa International Airport (TPA)', minutes: 70, miles: 52, confidence: 'verified' },
    { name: 'Downtown Tampa', minutes: 70, miles: 50 },
    { name: 'St. Petersburg', minutes: 60, miles: 45 },
    { name: 'Busch Gardens Tampa', minutes: 75, miles: 57 },
    { name: 'Orlando theme parks', minutes: 135, miles: 115 },
  ],
} as const;

export const LWR_FACTS = {
  verifiedOn: RESEARCH_DATE,
  acres: 33000,
  squareMiles: 55,
  counties: ['Manatee', 'Sarasota'],
  villagesApprox: '30+',
  trailMiles: 150,
  greenspaceAcres: 10000,
  parks: 8,
  golfHoles: 54,
} as const;
