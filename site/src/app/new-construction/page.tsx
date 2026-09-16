import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd, SourceList, Callout, Pill, money } from '@/components/ui';
import { LeadForm } from '@/components/LeadForm';
import { BUILDERS, INCENTIVE_CONTEXT } from '@/data/builders';
import { VILLAGES } from '@/data/villages';
import { pageMeta, breadcrumbLd, faqLd, itemListLd } from '@/lib/seo';
import { imgSrc, imgAlt } from '@/config/images';
import { legal } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'New Construction in Lakewood Ranch — Builders & How Incentives Really Work',
  description:
    'Every active Lakewood Ranch builder, the villages they build in, and an honest breakdown of current incentive patterns — rate buydowns, closing credits and design allowances — plus the four mistakes that cost buyers the most.',
  path: '/new-construction',
  keywords: [
    'Lakewood Ranch new construction', 'Lakewood Ranch builders', 'Lakewood Ranch builder incentives',
    'new homes Lakewood Ranch FL', 'Pulte Lakewood Ranch', 'Taylor Morrison Lakewood Ranch', 'Lennar Lakewood Ranch',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'New construction', href: '/new-construction' }];

export default function NewConstructionPage() {
  const selling = VILLAGES.filter((v) => v.status === 'selling' || v.status === 'coming-soon');

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gulf-900">
        <Image src={imgSrc('construction')} alt={imgAlt('construction')} fill sizes="100vw" priority className="object-cover opacity-40" />
        <Container className="relative py-16 sm:py-20">
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-3xl text-display-md font-semibold text-white">
            Builder incentives are at multi-year highs. Here&rsquo;s how to read one.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gulf-100" data-speakable>
            {selling.length} Lakewood Ranch villages are actively selling new homes. The offers are genuinely
            strong — and every one of them is conditional. This page publishes the incentive patterns and the date
            they were checked, not a stale headline number.
          </p>
        </Container>
      </section>

      <Section tone="shell">
        <Container>
          {/* Incentive reality */}
          <div className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-gulf-900">What&rsquo;s actually on the table</h2>
              <p className="text-xs uppercase tracking-wider text-ink-muted">Checked {INCENTIVE_CONTEXT.checkedOn}</p>
            </div>
            <p className="mt-2 text-ink-soft">{INCENTIVE_CONTEXT.headline}</p>

            <dl className="mt-6 grid gap-5 md:grid-cols-2">
              {INCENTIVE_CONTEXT.patterns.map((p) => (
                <div key={p.label} className="rounded-2xl bg-gulf-50 p-5">
                  <dt className="font-semibold text-gulf-900">{p.label}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.detail}</dd>
                </div>
              ))}
            </dl>

            <Callout tone="warning" title="The catch, stated plainly">
              {INCENTIVE_CONTEXT.theCatch}
            </Callout>

            <div className="rounded-2xl border-l-4 border-coral-400 bg-coral-50 p-5">
              <p className="font-display text-lg font-semibold text-coral-700">Register your agent on visit one</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{INCENTIVE_CONTEXT.whyAgent}</p>
            </div>

            <p className="mt-6 rounded-2xl bg-sand-50 p-4 text-xs leading-relaxed text-ink-muted">
              <strong className="text-sand-800">Why there are no headline numbers on this page:</strong> builder
              incentives change weekly and are quote-specific — they depend on the homesite, the standing
              inventory, the lender you use and when you close. A static &ldquo;$50,000 off&rdquo; banner would be
              stale within days and is precisely the kind of claim Florida&rsquo;s advertising rule treats as
              misleading. Ask for today&rsquo;s written offer on a specific address instead.
            </p>
            <SourceList ids={['builderIncentives', 'newConstructionGuide']} />
          </div>

          {/* Builders */}
          <h2 className="mt-14 font-display text-3xl font-semibold text-gulf-900">Builders working in Lakewood Ranch</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {BUILDERS.map((b) => (
              <article key={b.id} className="card flex flex-col p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-gulf-900">{b.name}</h3>
                  {b.priceFrom && <Pill className="shrink-0">From {money(b.priceFrom)}</Pill>}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{b.incentivePattern}</p>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Builds in</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {b.villages.map((v) => {
                      const match = VILLAGES.find((x) => x.name === v || x.name.includes(v));
                      return match ? (
                        <Link key={v} href={`/villages/${match.slug}`} className="chip hover:border-gulf-400">{v}</Link>
                      ) : (
                        <span key={v} className="chip">{v}</span>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-4 border-t border-ink/8 pt-3 text-xs text-ink-muted">
                  {b.productTypes.join(' · ')} · incentives checked {b.incentiveCheckedOn}
                </p>
              </article>
            ))}
          </div>

          {/* Villages selling */}
          <h2 className="mt-14 font-display text-3xl font-semibold text-gulf-900">Villages selling new homes now</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {selling.map((v) => (
              <Link key={v.slug} href={`/villages/${v.slug}`} className="card card-hover flex flex-col p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-gulf-900">{v.name}</h3>
                  {v.status === 'coming-soon' && <Pill className="shrink-0 bg-sand-100 text-sand-800">Soon</Pill>}
                </div>
                <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">{v.builders[0]}{v.builders.length > 1 ? ` +${v.builders.length - 1}` : ''}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">{v.summary}</p>
                <p className="mt-4 font-semibold text-gulf-700">{money(v.priceLow)}–{money(v.priceHigh)}</p>
              </Link>
            ))}
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-gulf-900">Before you tour a model home</h2>
              <ol className="mt-5 space-y-4">
                {[
                  ['Register your agent first', 'Most builders require it at your FIRST visit. Walk in alone "just to look" and you can permanently forfeit representation in that community.'],
                  ['Get one independent loan quote', 'Compare Loan Estimates from the preferred lender and an outside lender on the same day. Sometimes the builder wins by a mile; sometimes the buydown is paid for in fees.'],
                  ['Ask which amenities are finished today', 'Not which are rendered. Phased amenity openings slip, and it is a fair question a good builder answers straight.'],
                  ['Run the real monthly', 'Mortgage + taxes + CDD ÷ 12 + HOA + insurance. Newer villages carry full bond debt service, so a new build can cost more per month than a resale at the same price.'],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gulf-700 text-xs font-bold text-white">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-gulf-900">{t}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/guides/new-construction-playbook" className="btn-ghost mt-7">Read the full playbook →</Link>
              <p className="mt-6 border-t border-ink/8 pt-4 text-xs leading-relaxed text-ink-muted">{legal.dataDisclaimer}</p>
            </div>

            <div className="card h-fit p-6 sm:p-8">
              <LeadForm
                variant="contact"
                heading="Get this week's actual offers"
                sub="Incentives move weekly and are quote-specific. Tell Caitlin which villages you're weighing and get the current written offers side by side — before you walk into a sales centre."
                cta="Send me current incentives"
                compact
              />
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd(CRUMBS),
          itemListLd('Home builders in Lakewood Ranch, Florida', BUILDERS.map((b) => ({ name: b.name, url: '/new-construction' }))),
          faqLd(['new-vs-resale', 'builder-agent', 'how-long-build', 'typical-cdd']),
        ]}
      />
    </>
  );
}
