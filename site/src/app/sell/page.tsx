import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd, SectionHeading, Callout } from '@/components/ui';
import { LeadForm } from '@/components/LeadForm';
import { MARKET } from '@/data/lifestyle';
import { pageMeta, breadcrumbLd, faqLd } from '@/lib/seo';
import { imgSrc, imgAlt } from '@/config/images';

export const metadata: Metadata = pageMeta({
  title: 'Sell Your Lakewood Ranch Home — Priced by Village, Not by ZIP',
  description:
    'A Country Club East comp tells you almost nothing about a Star Farms home. Get a valuation priced against your actual village, with current market data for Lakewood Ranch and Manatee County.',
  path: '/sell',
  keywords: ['sell my home Lakewood Ranch', 'Lakewood Ranch home values', 'what is my Lakewood Ranch home worth', 'Lakewood Ranch listing agent'],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Sell', href: '/sell' }];

export default function SellPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-gulf-900">
        <Image src={imgSrc('home')} alt={imgAlt('home')} fill sizes="100vw" priority className="object-cover opacity-35" />
        <Container className="relative py-16 sm:py-20">
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-3xl text-display-md font-semibold text-white">
            Your home isn&rsquo;t in Lakewood Ranch. It&rsquo;s in <em>your village</em>.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gulf-100" data-speakable>
            The community median is about ${MARKET.medianPrice.toLocaleString()} — and that number is close to
            useless for pricing a specific house. The established core runs near a ${MARKET.zones[0].median.toLocaleString()} median
            at ${MARKET.zones[0].pricePerSqft}/sqft; northwest Lakewood Ranch sits nearer ${MARKET.zones[1].median.toLocaleString()} at
            ${MARKET.zones[1].pricePerSqft}/sqft. Pricing against the wrong set of comps is the most expensive
            mistake a seller makes here.
          </p>
        </Container>
      </section>

      <Section tone="shell">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="What actually moves a sale here"
                title="Four things that matter more than the photos"
              />
              <div className="mt-8 space-y-6">
                {[
                  ['Village-level comps, not ZIP-level', 'Amenity package, CDD balance, build year and builder all move price. Two homes a mile apart with identical square footage can justify very different numbers — and buyers here know it.'],
                  ['Your carrying cost is part of your pitch', 'If your village has a retired CDD bond, that is a real monthly advantage over the newer villages a buyer is also touring. It belongs in the marketing, not buried in the disclosures.'],
                  ['Roof age and insurability', 'Florida buyers now ask about roof age before they ask about the kitchen, because it determines whether they can insure the house affordably. Getting ahead of this changes offers.'],
                  ['Competing with the builder next door', 'In villages still under construction you are not only competing with resale — you are competing with incentives, warranties and a rate buydown. That requires a different strategy, not a lower price.'],
                ].map(([t, d], i) => (
                  <div key={t} className="flex gap-4">
                    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gulf-700 text-sm font-bold text-white">{i + 1}</span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-gulf-900">{t}</h3>
                      <p className="mt-1 leading-relaxed text-ink-soft">{d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Callout tone="tip" title="Selling and buying at the same time?">
                If you are moving within Florida, homestead portability lets you carry up to $500,000 of accrued
                Save Our Homes benefit to the next house — but the timing rules are strict. Sort the sequencing
                before you list, not after.{' '}
                <Link href="/guides/florida-relocation-playbook" className="font-semibold underline underline-offset-2">See the playbook →</Link>
              </Callout>

              <p className="mt-8 rounded-2xl border border-ink/10 bg-white p-5 text-xs leading-relaxed text-ink-muted">
                Market figures shown were checked {MARKET.verifiedOn} and describe the community, not your home.
                A valuation for a specific property requires looking at that property.
              </p>
            </div>

            <div className="card h-fit p-8 lg:sticky lg:top-24">
              <LeadForm
                variant="valuation"
                heading="What's your home actually worth?"
                sub="Send the address and you'll get a valuation built from comparable sales inside your village — plus an honest read on what it would take to sell it well right now."
                cta="Get my village valuation"
                compact
              />
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd data={[breadcrumbLd(CRUMBS), faqLd(['median-price', 'homestead', 'why-agent'])]} />
    </>
  );
}
