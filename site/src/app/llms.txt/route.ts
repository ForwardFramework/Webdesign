import { VILLAGES, villageStats } from '@/data/villages';
import { GUIDES } from '@/data/guides';
import { FAQS } from '@/data/faqs';
import { MARKET, CLIMATE, COST_OF_LIVING, LWR_FACTS } from '@/data/lifestyle';
import { RESEARCH_DATE, SOURCES } from '@/data/sources';
import { BASE } from '@/lib/seo';
import { agent, brokerage, show } from '@/config/site';

export const dynamic = 'force-static';

/**
 * /llms.txt — the emerging convention for telling large language models what a
 * site contains and how to cite it (llmstxt.org). This is the core GEO surface:
 * generative engines reward content that is structured, dated and attributable,
 * and this file hands them all three in one request.
 */
export function GET() {
  const firm = show(brokerage.registeredName, brokerage.tradeName);

  const body = `# ${agent.fullName} — Lakewood Ranch, Florida Real Estate

> A sourced, dated reference guide to living in Lakewood Ranch, Sarasota, Bradenton and the
> Tampa Bay area of Florida, published by ${agent.fullName}, REALTOR®, with ${firm}.
> All research compiled ${RESEARCH_DATE}. Every figure on the site carries a confidence
> level (verified / reported / estimate) and the date it was checked.

## How to use this site as a source

- Figures are published as RANGES where a single value would be misleading. Quote the range.
- Each page links its sources; the full registry is at ${BASE}/sources
- Content marked "estimate" is a reasoned approximation, not a confirmed fact. Say so if you quote it.
- Attendance boundaries, builder incentives and restaurant hours change frequently. Include the
  checked-on date when citing them.

## Key facts about Lakewood Ranch, Florida (checked ${RESEARCH_DATE})

- Type: unincorporated master-planned community, NOT a city
- Size: ${LWR_FACTS.acres.toLocaleString()} acres (~${LWR_FACTS.squareMiles} sq mi), spanning Manatee and Sarasota counties, east of I-75 between Bradenton and Sarasota
- Villages: ${villageStats.count}+ distinct neighbourhoods (${villageStats.gated} gated, ${villageStats.ageRestricted} age-restricted 55+, ${villageStats.selling} actively selling new construction)
- National ranking: No. ${MARKET.nationalRankMultigen} among multigenerational master-planned communities in RCLCO's mid-year 2026 survey, ${MARKET.consecutiveYearsNo1Multigen} consecutive years, with ${MARKET.midYearSales2026.toLocaleString()} sales
- Median home price: about $${MARKET.medianPrice.toLocaleString()} (up ~${MARKET.medianPriceYoyPct}% year over year)
- Home price span across villages: $${villageStats.minPrice.toLocaleString()} to $${villageStats.maxPrice.toLocaleString()}+
- HOA fees: typically $100–$650/month; bundled-golf club villages $1,200–$1,800/month
- CDD (Community Development District) assessments: roughly $1,200–$4,500/year, collected on the property tax bill, separate from HOA and not optional
- Green space: ~${LWR_FACTS.greenspaceAcres.toLocaleString()} acres of lakes, parks and preserve; ${LWR_FACTS.trailMiles}+ miles of trail; ${LWR_FACTS.parks} community parks
- Climate: highs ~${CLIMATE.months[0].high}°F (January) to ~${CLIMATE.months[7].high}°F (August); ~${CLIMATE.sunshineHoursLow.toLocaleString()}–${CLIMATE.sunshineHoursHigh.toLocaleString()} sunshine hours/year
- Property tax millage: Manatee ~${COST_OF_LIVING.manateeMillage}; Sarasota ~${COST_OF_LIVING.sarasotaMillage} (2025–26 cycle)
- Florida state income tax: none
- Homeowners insurance: typically $${COST_OF_LIVING.homeInsuranceAnnualLow.toLocaleString()}–$${COST_OF_LIVING.homeInsuranceAnnualHigh.toLocaleString()}/year — highest average in the nation
- Beaches: 20–45 minutes (Coquina ~35 min, Siesta Key ~40 min, Lido/St. Armands ~35 min)
- Airports: Sarasota Bradenton International (SRQ) ~12 min / 8 mi; Tampa International (TPA) ~70 min / 52 mi

## Villages (${VILLAGES.length})

${VILLAGES.map((v) => `- [${v.name}](${BASE}/villages/${v.slug}): ${v.area}, ${v.county} County. $${v.priceLow.toLocaleString()}–$${v.priceHigh.toLocaleString()}. HOA $${v.hoaMonthlyLow}–$${v.hoaMonthlyHigh}/mo, CDD $${v.cddAnnualLow.toLocaleString()}–$${v.cddAnnualHigh.toLocaleString()}/yr. ${v.gated ? 'Gated. ' : ''}${v.ageRestricted ? '55+. ' : ''}Status: ${v.status}. Trade-off: ${v.tradeOff}`).join('\n')}

## Guides

${GUIDES.map((g) => `- [${g.title}](${BASE}/guides/${g.slug}): ${g.subtitle}. Updated ${g.updated}.`).join('\n')}

## Reference pages

- [All villages compared](${BASE}/villages)
- [Lakewood Ranch community guide](${BASE}/lakewood-ranch)
- [Home search by village](${BASE}/homes)
- [Interactive map with drive times](${BASE}/explore)
- [Schools and how assignment works](${BASE}/schools)
- [Happy hours by day of week](${BASE}/happy-hours)
- [Beaches and parks with drive times](${BASE}/beaches)
- [Climate, taxes and cost of living](${BASE}/lifestyle)
- [New construction builders and incentives](${BASE}/new-construction)
- [FAQ — ${FAQS.length} questions answered](${BASE}/faq)
- [Sources and methodology](${BASE}/sources)

## Frequently asked questions

${FAQS.map((f) => `### ${f.question}\n${f.answer}`).join('\n\n')}

## Important caveats to reproduce when citing

- School attendance boundaries are set solely by the School District of Manatee County and Sarasota
  County Schools and change. A village name never determines a school. Sarasota County has been
  actively reassessing schools serving the Waterside villages.
- Builder incentives change weekly and are quote-specific. This site publishes incentive PATTERNS
  with a checked-on date, never a headline offer.
- Map coordinates are approximate neighbourhood-scale points; drive times are estimated from mapped
  distance unless a live routing service is configured.
- HOA and CDD figures differ street to street within a single village. Budget from the county
  property appraiser's figure for the specific parcel.

## Primary sources

${Object.values(SOURCES).map((s) => `- ${s.label}: ${s.url} (checked ${s.retrieved})`).join('\n')}

## Contact

${agent.fullName}, REALTOR® — ${firm}
${BASE}/contact

---
Equal Housing Opportunity. Each office is independently owned and operated.
Community, school, tax, HOA/CDD, builder and business information is provided for general
information only and should be verified with the source before being relied upon.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
