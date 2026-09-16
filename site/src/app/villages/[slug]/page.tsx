import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container, Section, Breadcrumbs, JsonLd, SourceList, ConfidenceBadge, Pill, money, moneyFull } from '@/components/ui';
import { DriveTimes } from '@/components/DriveTimes';
import { LeadForm } from '@/components/LeadForm';
import { VILLAGES, villageBySlug } from '@/data/villages';
import { AMENITY_BY_ID, AMENITY_DISCLAIMER } from '@/data/amenities';
import { SCHOOL_BOUNDARY_WARNING } from '@/data/schools';
import { pageMeta, breadcrumbLd, placeLd, faqLd } from '@/lib/seo';
import { imgSrc, imgAlt } from '@/config/images';
import { legal } from '@/config/site';

export function generateStaticParams() {
  return VILLAGES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v = villageBySlug(slug);
  if (!v) return pageMeta({ title: 'Village not found', description: 'This village page could not be found.', path: `/villages/${slug}`, noIndex: true });

  return pageMeta({
    title: `${v.name} — Homes, HOA & CDD Fees, Amenities`,
    description: `${v.name} in Lakewood Ranch, FL: homes ${money(v.priceLow)}–${money(v.priceHigh)}, HOA about $${v.hoaMonthlyLow}–$${v.hoaMonthlyHigh}/month, CDD roughly $${v.cddAnnualLow.toLocaleString()}–$${v.cddAnnualHigh.toLocaleString()}/year. Amenities, builders, the honest trade-off and homes for sale.`,
    path: `/villages/${v.slug}`,
    keywords: [`${v.name}`, `${v.name} homes for sale`, `${v.name} HOA fees`, `${v.name} Lakewood Ranch`, 'Lakewood Ranch villages'],
  });
}

const HERO_IMAGE = (slug: string) => {
  if (/waterside|wild-blue|lakehouse|shoreview|emerald|bungalow|peninsula/.test(slug)) return 'townCenter' as const;
  if (/country-club|lake-club|esplanade|azario/.test(slug)) return 'golf' as const;
  if (/star-farms|lorraine|solera|sweetwater|woodlands|southeast|sapphire/.test(slug)) return 'construction' as const;
  if (/greenbrook|summerfield|riverwalk|central-park|arbor/.test(slug)) return 'trail' as const;
  return 'home' as const;
};

export default async function VillagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = villageBySlug(slug);
  if (!v) notFound();

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Villages', href: '/villages' },
    { name: v.name, href: `/villages/${v.slug}` },
  ];

  const similar = VILLAGES.filter(
    (o) => o.slug !== v.slug && (o.area === v.area || Math.abs(o.priceLow - v.priceLow) < 150_000)
  ).slice(0, 3);

  const monthlyLow = v.hoaMonthlyLow + Math.round(v.cddAnnualLow / 12);
  const monthlyHigh = v.hoaMonthlyHigh + Math.round(v.cddAnnualHigh / 12);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gulf-900">
        <Image src={imgSrc(HERO_IMAGE(v.slug))} alt={imgAlt(HERO_IMAGE(v.slug))} fill sizes="100vw" priority className="object-cover opacity-35" />
        <Container className="relative py-16 sm:py-20">
          <Breadcrumbs items={crumbs} />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {v.gated && <Pill className="!bg-white/15 !text-white">Gated</Pill>}
            {v.ageRestricted && <Pill className="!bg-sunset-400/25 !text-sunset-100">55+ Active Adult</Pill>}
            {v.status === 'selling' && <Pill className="!bg-coral-400/25 !text-coral-100">Builder inventory available</Pill>}
            {v.status === 'resale' && <Pill className="!bg-white/15 !text-white">Resale only</Pill>}
            {v.status === 'coming-soon' && <Pill className="!bg-white/15 !text-white">Coming soon</Pill>}
            <Pill className="!bg-white/15 !text-white">{v.county} County</Pill>
          </div>
          <h1 className="mt-4 max-w-4xl text-display-md font-semibold text-white">{v.name}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gulf-100" data-speakable>{v.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/homes?villages=${v.slug}`} className="btn-coral">See homes in {v.name.split(' at ')[0]}</Link>
            <Link href="/contact" className="btn-ghost !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">Ask about this village</Link>
          </div>
        </Container>
      </section>

      <Section tone="shell">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-10">
              {/* Numbers */}
              <div className="card p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-2xl font-semibold text-gulf-900">The numbers</h2>
                  <ConfidenceBadge level={v.confidence} date={v.verifiedOn} />
                </div>

                <dl className="mt-6 grid gap-5 sm:grid-cols-3">
                  <div className="rounded-2xl bg-gulf-50 p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gulf-600">Home prices</dt>
                    <dd className="mt-1.5 font-display text-2xl font-semibold text-gulf-900">{money(v.priceLow)}–{money(v.priceHigh)}</dd>
                    <dd className="mt-1 text-xs text-ink-muted">{v.homeTypes.join(' · ')}</dd>
                  </div>
                  <div className="rounded-2xl bg-gulf-50 p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gulf-600">HOA</dt>
                    <dd className="mt-1.5 font-display text-2xl font-semibold text-gulf-900">${v.hoaMonthlyLow}–${v.hoaMonthlyHigh}</dd>
                    <dd className="mt-1 text-xs text-ink-muted">per month, typical</dd>
                  </div>
                  <div className="rounded-2xl bg-gulf-50 p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gulf-600">CDD</dt>
                    <dd className="mt-1.5 font-display text-2xl font-semibold text-gulf-900">${(v.cddAnnualLow / 1000).toFixed(1)}–{(v.cddAnnualHigh / 1000).toFixed(1)}K</dd>
                    <dd className="mt-1 text-xs text-ink-muted">per year, on the tax bill</dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-2xl border border-sunset-200 bg-sunset-100 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sunset-600">What you actually carry</p>
                  <p className="mt-1.5 font-display text-xl font-semibold text-gulf-900">
                    roughly ${monthlyLow.toLocaleString()}–${monthlyHigh.toLocaleString()} / month
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    HOA plus CDD combined, before mortgage, property tax and insurance. This is the number to
                    compare between villages — not the list price.
                  </p>
                </div>

                {v.cddNote && (
                  <p className="mt-4 rounded-2xl bg-sand-50 p-4 text-sm leading-relaxed text-ink-soft">
                    <strong className="text-sand-800">On the CDD:</strong> {v.cddNote}
                  </p>
                )}

                <div className="mt-6 rounded-2xl bg-coral-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-coral-700">The honest trade-off</p>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">{v.tradeOff}</p>
                </div>

                <SourceList ids={v.sources} />
              </div>

              {/* Amenities */}
              <div className="card p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-gulf-900">Amenities</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {v.amenities.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-sm text-ink-soft">
                      <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gulf-100 text-[0.6rem] text-gulf-700">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
                {v.amenityTags.length > 0 && (
                  <div className="mt-6 border-t border-ink/8 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Search by these</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {v.amenityTags.map((t) => (
                        <li key={t}>
                          <Link
                            href={`/villages?amenities=${t}`}
                            title={AMENITY_BY_ID[t].hint}
                            className="inline-flex items-center gap-1.5 rounded-full border border-gulf-200 bg-gulf-50 px-3 py-1.5 text-xs font-medium text-gulf-700 transition-colors hover:border-gulf-400 hover:bg-gulf-100"
                          >
                            <span aria-hidden="true">{AMENITY_BY_ID[t].icon}</span>
                            {AMENITY_BY_ID[t].label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs leading-relaxed text-ink-muted">{AMENITY_DISCLAIMER}</p>
                  </div>
                )}

                {v.status === 'selling' && (
                  <p className="mt-6 rounded-2xl bg-sand-50 p-4 text-sm leading-relaxed text-ink-soft">
                    This village is still building. Ask which amenities are <em>finished and open today</em> rather
                    than which appear in the renderings — phased amenity openings slip, and it is a fair question.
                  </p>
                )}
              </div>

              {/* Builders */}
              <div className="card p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-gulf-900">Builders</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {v.builders.map((b) => <Pill key={b} className="!px-3.5 !py-2 !text-sm">{b}</Pill>)}
                </div>
                {v.status === 'selling' && (
                  <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                    Register your agent on your <strong>first</strong> visit to any sales center here. Builders
                    typically pay buyer-agent compensation from their own marketing budget, so walking in alone
                    does not earn you a discount — it just removes your advocate.{' '}
                    <Link href="/guides/new-construction-playbook" className="text-gulf-700 underline underline-offset-2">
                      Read the new construction playbook →
                    </Link>
                  </p>
                )}
              </div>

              {/* Best for */}
              <div className="card p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-gulf-900">Who tends to love it here</h2>
                <ul className="mt-4 space-y-2.5">
                  {v.bestFor.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-ink-soft">
                      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-400" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-2xl bg-gulf-50 p-4 text-sm leading-relaxed text-ink-soft">
                  <strong className="text-gulf-800">Schools:</strong> {SCHOOL_BOUNDARY_WARNING}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
              <DriveTimes originSlug={v.slug} originLabel={v.name.split(' at ')[0]} />

              <div className="card p-6">
                <h3 className="font-display text-lg font-semibold text-gulf-900">Thinking about {v.name.split(' at ')[0]}?</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Get the current inventory, the real assessment for a specific address, and an honest read on
                  whether this village fits what you actually want.
                </p>
                <div className="mt-5">
                  <LeadForm variant="contact" cta="Ask about this village" compact />
                </div>
              </div>
            </aside>
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-semibold text-gulf-900">Also worth comparing</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {similar.map((s) => (
                  <Link key={s.slug} href={`/villages/${s.slug}`} className="card card-hover p-5">
                    <h3 className="font-display text-lg font-semibold text-gulf-900">{s.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">{s.area}</p>
                    <p className="mt-3 text-sm text-ink-soft line-clamp-2">{s.summary}</p>
                    <p className="mt-4 text-sm font-semibold text-gulf-700">{money(s.priceLow)}–{money(s.priceHigh)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <p className="mt-12 rounded-2xl border border-ink/10 bg-white p-5 text-xs leading-relaxed text-ink-muted">
            {legal.dataDisclaimer} Figures shown for {v.name} were last checked on {v.verifiedOn}. Median and range
            data is community-level; the assessment on a specific parcel is published by the county property
            appraiser and is the only number you should budget from. Prices shown as {moneyFull(v.priceLow)}–{moneyFull(v.priceHigh)}.
          </p>
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          placeLd({
            name: `${v.name}, Lakewood Ranch`,
            description: v.summary,
            lat: v.coords.lat,
            lng: v.coords.lng,
            city: v.county === 'Sarasota' ? 'Sarasota' : 'Lakewood Ranch',
          }),
          faqLd(['hoa-vs-cdd', 'typical-hoa', 'typical-cdd', 'which-school']),
        ]}
      />
    </>
  );
}
