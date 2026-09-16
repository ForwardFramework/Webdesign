import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd, SectionHeading, Stat, SourceList } from '@/components/ui';
import { VILLAGES, villageStats } from '@/data/villages';
import { LWR_FACTS, MARKET, CLIMATE, DRIVE_TIMES } from '@/data/lifestyle';
import { PLACES } from '@/data/places';
import { pageMeta, breadcrumbLd, faqLd, placeLd } from '@/lib/seo';
import { imgSrc, imgAlt } from '@/config/images';

export const metadata: Metadata = pageMeta({
  title: 'Lakewood Ranch, FL — The Complete Community Guide',
  description:
    'What Lakewood Ranch actually is: a 33,000-acre master-planned community across Manatee and Sarasota counties with 30+ villages, two town centers, 150+ miles of trail — and the No. 1 multigenerational community in the U.S. for eight years running.',
  path: '/lakewood-ranch',
  keywords: [
    'Lakewood Ranch Florida', 'what is Lakewood Ranch', 'living in Lakewood Ranch',
    'Lakewood Ranch community guide', 'is Lakewood Ranch a city', 'Lakewood Ranch amenities',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Lakewood Ranch', href: '/lakewood-ranch' }];

export default function LakewoodRanchPage() {
  const townCenters = PLACES.filter((p) => ['main-street-lwr', 'waterside-place', 'utc-mall'].includes(p.id));

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gulf-900">
        <Image src={imgSrc('hero')} alt={imgAlt('hero')} fill sizes="100vw" priority className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-gulf-950/90 to-transparent" />
        <Container className="relative py-20 sm:py-24">
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-4xl text-display-md font-semibold text-white">
            Lakewood Ranch, explained properly.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gulf-100" data-speakable>
            A {LWR_FACTS.acres.toLocaleString()}-acre master-planned community — about {LWR_FACTS.squareMiles} square
            miles — spanning Manatee and Sarasota counties east of I-75 between Bradenton and Sarasota. Not a city:
            an unincorporated community of {villageStats.count}+ separate villages, two town centers, and roughly
            {' '}{LWR_FACTS.greenspaceAcres.toLocaleString()} acres of lakes, parks and preserve.
          </p>
        </Container>
      </section>

      <Section tone="shell">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [`#${MARKET.nationalRankMultigen}`, 'in the U.S.', `${MARKET.consecutiveYearsNo1Multigen} years running, multi-gen (RCLCO)`],
              [`${villageStats.count}+`, 'villages', 'Manatee & Sarasota counties'],
              [`${LWR_FACTS.trailMiles}`, 'miles of trail', `${LWR_FACTS.parks} community parks`],
              [`${LWR_FACTS.golfHoles}`, 'holes of golf', 'at the private club alone'],
            ].map(([v, l, s]) => (
              <div key={String(l)} className="card p-6"><Stat value={String(v)} label={String(l)} sub={String(s)} /></div>
            ))}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="The structure"
                title="Villages, CDDs and why that matters to you"
                lede="Lakewood Ranch is not governed like a town. Understanding the layers is the difference between an informed purchase and a surprise on your first tax bill."
              />
              <div className="mt-8 space-y-5">
                {[
                  ['The developer', 'Schroeder-Manatee Ranch has master-planned the community since the 1990s, which is why the whole thing feels coherent rather than like thirty unrelated subdivisions bolted together.'],
                  ['The villages', `${villageStats.count}+ distinct neighborhoods, each with its own HOA, amenity package, builder lineup and price band. ${villageStats.gated} are gated; ${villageStats.ageRestricted} are 55+.`],
                  ['The CDDs', 'Community Development Districts issued the bonds that funded roads, drainage and amenities, and collect assessments on your property tax bill. Older villages have retired much of that debt; newer ones have not.'],
                  ['The counties', 'Most of Lakewood Ranch is in Manatee County. Waterside sits in Sarasota County — a different school district, a different millage rate and a Sarasota mailing address.'],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl border border-ink/10 bg-white p-5">
                    <p className="font-semibold text-gulf-900">{t}</p>
                    <p className="mt-1.5 leading-relaxed text-ink-soft">{d}</p>
                  </div>
                ))}
              </div>
              <Link href="/villages" className="btn-primary mt-8">Compare all {villageStats.count} villages →</Link>
            </div>

            <div className="grid gap-4">
              <Image src={imgSrc('golf')} alt={imgAlt('golf')} width={800} height={520} className="h-56 w-full rounded-3xl object-cover shadow-card sm:h-64" sizes="(max-width:1024px) 100vw, 45vw" />
              <div className="grid grid-cols-2 gap-4">
                <Image src={imgSrc('preserve')} alt={imgAlt('preserve')} width={420} height={320} className="h-40 w-full rounded-3xl object-cover shadow-card" sizes="22vw" />
                <Image src={imgSrc('trail')} alt={imgAlt('trail')} width={420} height={320} className="h-40 w-full rounded-3xl object-cover shadow-card" sizes="22vw" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Two town centers"
            title="Where the community actually gathers"
            lede="Most master-planned communities have a clubhouse. Lakewood Ranch has two genuine town centers with independent restaurants, events and a farmers market — plus the region's main mall minutes away."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {townCenters.map((t) => (
              <article key={t.id} className="card flex flex-col p-7">
                <h3 className="font-display text-xl font-semibold text-gulf-900">{t.name}</h3>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">{t.kind}</p>
                {t.blurb && <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{t.blurb}</p>}
                {t.highlights && (
                  <ul className="mt-4 space-y-1.5">
                    {t.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-ink-soft">
                        <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral-400" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
          <p className="mt-8">
            <Link href="/happy-hours" className="btn-ghost">Happy hours on Main Street &amp; Waterside →</Link>
          </p>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Location" title="Inland by design" />
              <p className="mt-5 leading-relaxed text-ink-soft">
                Sitting east of I-75 is the single most underrated thing about Lakewood Ranch. You are 20–45
                minutes from world-class Gulf beaches, about {DRIVE_TIMES.destinations.find((d) => d.name.includes('SRQ'))?.minutes} minutes
                from Sarasota Bradenton International, and roughly {DRIVE_TIMES.destinations.find((d) => d.name.includes('TPA'))?.minutes} minutes
                from Tampa International — while avoiding the barrier-island insurance premiums, the storm-surge
                zones and the season-long gridlock.
              </p>
              <ul className="mt-6 divide-y divide-ink/10">
                {DRIVE_TIMES.destinations.slice(0, 9).map((d) => (
                  <li key={d.name} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                    <span className="text-ink-soft">{d.name}</span>
                    <span className="shrink-0 font-semibold text-gulf-700">{d.minutes} min</span>
                  </li>
                ))}
              </ul>
              <Link href="/explore" className="btn-ghost mt-6">Open the interactive map →</Link>
            </div>

            <div>
              <SectionHeading eyebrow="Climate" title="Why people stay outside" />
              <p className="mt-5 leading-relaxed text-ink-soft">
                Highs from about {CLIMATE.months[0].high}°F in January to {CLIMATE.months[7].high}°F in August, and
                roughly {CLIMATE.sunshineHoursLow.toLocaleString()}–{CLIMATE.sunshineHoursHigh.toLocaleString()} hours
                of sunshine a year. {CLIMATE.sunniestMonth.month} averages {CLIMATE.sunniestMonth.dailyHours} hours
                of sun a day.
              </p>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {CLIMATE.months.map((m) => (
                  <div key={m.month} className="rounded-xl bg-white p-3 text-center">
                    <p className="text-[0.65rem] font-semibold uppercase text-ink-muted">{m.month}</p>
                    <p className="mt-1 font-display text-lg font-semibold text-gulf-800">{m.high}°</p>
                  </div>
                ))}
              </div>
              <Link href="/lifestyle" className="btn-ghost mt-6">Full climate &amp; cost of living →</Link>
            </div>
          </div>

          <SourceList ids={['lwrOfficial', 'rclcoMidyear2026', 'observerRanking2026', 'lwrParks', 'timeanddateClimate']} />
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd(CRUMBS),
          placeLd({
            name: 'Lakewood Ranch, Florida',
            description: 'A 33,000-acre master-planned community spanning Manatee and Sarasota counties, Florida, with more than 30 villages.',
            lat: 27.4103,
            lng: -82.4293,
            city: 'Lakewood Ranch',
          }),
          faqLd(['what-is-lwr', 'is-lwr-a-city', 'lwr-ranking', 'how-many-villages', 'things-to-do']),
        ]}
      />
    </>
  );
}
