import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd, SourceList, Stat, Callout, SectionHeading } from '@/components/ui';
import { CLIMATE, COST_OF_LIVING, MARKET, LWR_FACTS, DRIVE_TIMES } from '@/data/lifestyle';
import { PLACES } from '@/data/places';
import { pageMeta, breadcrumbLd, faqLd } from '@/lib/seo';
import { imgSrc, imgAlt } from '@/config/images';
import { legal } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Life on the Gulf Coast — Weather, Costs, Taxes & What It’s Actually Like',
  description:
    'Sunshine hours, month-by-month temperatures, property tax millage, Florida insurance reality, no state income tax, and the attractions that make Sarasota–Bradenton–Tampa Bay worth the move.',
  path: '/lifestyle',
  keywords: [
    'Lakewood Ranch weather', 'Sarasota climate', 'cost of living Lakewood Ranch',
    'Florida property taxes Manatee Sarasota', 'Florida homeowners insurance cost', 'moving to Sarasota',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Gulf Coast lifestyle', href: '/lifestyle' }];

export default function LifestylePage() {
  const attractions = PLACES.filter((p) => ['attraction', 'shopping', 'golf'].includes(p.category));
  const maxHigh = Math.max(...CLIMATE.months.map((m) => m.high));

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gulf-900">
        <Image src={imgSrc('preserve')} alt={imgAlt('preserve')} fill sizes="100vw" priority className="object-cover opacity-40" />
        <Container className="relative py-16 sm:py-20">
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-3xl text-display-md font-semibold text-white">
            Twelve months of outside — and the honest bill for it.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gulf-100" data-speakable>
            The sunshine, the beaches and the no-income-tax maths are all real. So are Florida insurance premiums
            and hurricane season. Both halves are on this page, because you are going to find out either way.
          </p>
        </Container>
      </section>

      {/* Climate */}
      <Section tone="shell">
        <Container>
          <SectionHeading
            eyebrow="The weather"
            title="Roughly 3,000 to 3,300 hours of sunshine a year."
            lede={`Averaging about ${CLIMATE.avgDailySunHours} hours of sun a day, peaking in ${CLIMATE.sunniestMonth.month} at ${CLIMATE.sunniestMonth.dailyHours} hours daily.`}
          />

          <div className="mt-10 card overflow-hidden p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-gulf-900">Average high &amp; low, °F</h3>
            <div className="mt-8 flex items-end gap-1.5 sm:gap-3" role="img" aria-label="Monthly average high and low temperatures for the Sarasota area, in Fahrenheit">
              {CLIMATE.months.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center">
                  <span className="text-[0.65rem] font-semibold text-coral-600 sm:text-xs">{m.high}</span>
                  <div
                    className="mt-1 w-full rounded-t-lg bg-gradient-to-t from-gulf-300 to-coral-300"
                    style={{ height: `${(m.high / maxHigh) * 150}px` }}
                  />
                  <div
                    className="w-full rounded-b-lg bg-gulf-500"
                    style={{ height: `${(m.low / maxHigh) * 60}px` }}
                  />
                  <span className="mt-1 text-[0.6rem] text-gulf-600 sm:text-xs">{m.low}</span>
                  <span className="mt-1.5 text-[0.6rem] font-semibold uppercase text-ink-muted sm:text-[0.7rem]">{m.month}</span>
                </div>
              ))}
            </div>
            <ul className="mt-8 grid gap-3 border-t border-ink/8 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              {CLIMATE.months.map((m) => (
                <li key={m.month} className="text-sm text-ink-soft">
                  <strong className="font-semibold text-gulf-800">{m.month}:</strong> {m.note}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-ink-muted">
              Gulf water: about {CLIMATE.gulfWaterTemp.summer}°F in summer, {CLIMATE.gulfWaterTemp.winter}°F in winter.
              Checked {CLIMATE.verifiedOn}.
            </p>
            <SourceList ids={CLIMATE.sources as unknown as string[]} />
          </div>
        </Container>
      </Section>

      {/* Money */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="The money"
            title="No state income tax. And the highest insurance premiums in the country."
            lede="Both of those are true at the same time, and which one dominates depends entirely on your income and your house."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-gulf-900">Income tax</h3>
              <p className="mt-3 font-display text-4xl font-semibold text-gulf-700">$0</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Florida is one of nine states with no state income tax — on wages, retirement income, Social
                Security or investment gains. A household earning $150,000 saves roughly $7,000–$10,000 a year
                versus a high-tax state.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-gulf-900">Property tax</h3>
              <div className="mt-3 flex gap-6">
                <Stat value={`${COST_OF_LIVING.manateeMillage}`} label="Manatee" sub="total mills, 2025 cycle" />
                <Stat value={`${COST_OF_LIVING.sarasotaMillage}`} label="Sarasota" sub="total mills, 2025–26" />
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                {COST_OF_LIVING.examples.map((e) => (
                  <li key={e.county}>
                    ${e.homeValue.toLocaleString()} homesteaded in {e.county}: <strong className="text-gulf-800">~${e.annualTax.toLocaleString()}/yr</strong>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                CDD assessments are billed on top of this in most Lakewood Ranch villages.
              </p>
            </div>

            <div className="card border-2 border-coral-200 p-6">
              <h3 className="font-display text-lg font-semibold text-gulf-900">Homeowners insurance</h3>
              <p className="mt-3 font-display text-3xl font-semibold text-coral-600">
                ${(COST_OF_LIVING.homeInsuranceAnnualLow / 1000).toFixed(1)}K–${(COST_OF_LIVING.homeInsuranceAnnualHigh / 1000).toFixed(0)}K
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">per year, typical range</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{COST_OF_LIVING.homeInsuranceNote}</p>
            </div>
          </div>

          <Callout tone="money" title="The homestead exemption is the one to diarise">
            If the home is your permanent residence on January 1, file with your county property appraiser by{' '}
            <strong>{COST_OF_LIVING.homesteadDeadline}</strong>. For 2026 the exemption totals{' '}
            ${COST_OF_LIVING.homesteadExemptionTotal2026.toLocaleString()}, and it triggers the Save Our Homes
            assessment cap — with up to ${COST_OF_LIVING.portabilityCapUsd.toLocaleString()} of that benefit portable
            to your next Florida home. Missing the deadline costs you a full year.{' '}
            <Link href="/guides/florida-relocation-playbook" className="font-semibold underline underline-offset-2">Full relocation playbook →</Link>
          </Callout>

          <SourceList ids={[...COST_OF_LIVING.sources] as string[]} />
        </Container>
      </Section>

      {/* Market */}
      <Section tone="sand">
        <Container>
          <SectionHeading
            eyebrow="The market"
            title={`#${MARKET.nationalRankMultigen} in the country, ${MARKET.consecutiveYearsNo1Multigen} years running.`}
            lede={`Lakewood Ranch held the No. 1 spot among multigenerational master-planned communities in RCLCO's mid-year 2026 survey with ${MARKET.midYearSales2026.toLocaleString()} sales. In overall national sales it sits just behind The Villages.`}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-6"><Stat value={`$${(MARKET.medianPrice / 1000).toFixed(0)}K`} label="Median price" sub={`+${MARKET.medianPriceYoyPct}% year over year`} /></div>
            <div className="card p-6"><Stat value={`${MARKET.daysOnMarketRange[0]}–${MARKET.daysOnMarketRange[1]}`} label="Days on market" sub="sources vary — both shown" /></div>
            <div className="card p-6"><Stat value={`${LWR_FACTS.acres.toLocaleString()}`} label="Acres" sub={`${LWR_FACTS.squareMiles} square miles`} /></div>
            <div className="card p-6"><Stat value={`${LWR_FACTS.trailMiles}`} label="Miles of trail" sub={`${LWR_FACTS.parks} community parks`} /></div>
          </div>
          <p className="mt-6 text-sm text-ink-soft">
            Median price varies enormously by area: the established core around The Lake Club and Country Club East
            runs near a ${MARKET.zones[0].median.toLocaleString()} median at ${MARKET.zones[0].pricePerSqft}/sqft, while
            northwest Lakewood Ranch sits closer to ${MARKET.zones[1].median.toLocaleString()} at ${MARKET.zones[1].pricePerSqft}/sqft.
          </p>
          <SourceList ids={[...MARKET.sources] as string[]} />
        </Container>
      </Section>

      {/* Culture */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="What you'll actually do"
            title="An arts scene the size of a much bigger city."
            lede="Sarasota punches wildly above its weight culturally — a legacy of the Ringling circus money — and it is all 20 to 30 minutes from Lakewood Ranch."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {attractions.map((a) => (
              <article key={a.id} className="card card-hover flex flex-col p-6">
                <h3 className="font-display text-lg font-semibold text-gulf-900">{a.name}</h3>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">{a.kind} · {a.city}</p>
                {a.blurb && <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{a.blurb}</p>}
              </article>
            ))}
          </div>

          <div className="mt-12 card p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-gulf-900">And everything is close</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {DRIVE_TIMES.destinations.map((d) => (
                <li key={d.name} className="flex items-baseline justify-between gap-3 border-b border-ink/5 pb-2 text-sm">
                  <span className="text-ink-soft">{d.name}</span>
                  <span className="shrink-0 font-semibold text-gulf-700">{d.minutes} min</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-ink-muted">{DRIVE_TIMES.note}</p>
          </div>

          <p className="mt-10 rounded-2xl border border-ink/10 bg-shell p-5 text-xs leading-relaxed text-ink-muted">
            {legal.dataDisclaimer} {legal.notLegalAdvice}
          </p>
        </Container>
      </Section>

      <JsonLd data={[breadcrumbLd(CRUMBS), faqLd(['weather', 'no-income-tax', 'property-taxes', 'insurance-cost', 'things-to-do', 'hurricanes'])]} />
    </>
  );
}
