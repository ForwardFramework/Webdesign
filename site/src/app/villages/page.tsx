import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Section, Breadcrumbs, JsonLd, SourceList } from '@/components/ui';
import { VillageExplorer } from '@/components/VillageExplorer';
import { VILLAGES, villageStats } from '@/data/villages';
import { AMENITIES, type AmenityTag } from '@/data/amenities';
import { pageMeta, breadcrumbLd, itemListLd, faqLd } from '@/lib/seo';
import { imgSrc, imgAlt } from '@/config/images';
import { legal } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: `All ${villageStats.count} Lakewood Ranch Villages Compared — HOA, CDD & Prices`,
  description: `Every village in Lakewood Ranch, FL side by side: typical HOA fees, CDD assessments, price ranges, builders, amenities and an honest trade-off for each. ${villageStats.gated} gated, ${villageStats.selling} still selling new construction.`,
  path: '/villages',
  keywords: [
    'Lakewood Ranch villages', 'Lakewood Ranch neighborhoods', 'Lakewood Ranch HOA fees by village',
    'Lakewood Ranch CDD fees', 'best neighborhoods in Lakewood Ranch', 'Waterside Lakewood Ranch',
  ],
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Lakewood Ranch', href: '/lakewood-ranch' },
  { name: 'Villages', href: '/villages' },
];

export default async function VillagesPage({
  searchParams,
}: {
  searchParams: Promise<{ amenities?: string }>;
}) {
  const sp = await searchParams;
  const valid = new Set(AMENITIES.map((a) => a.id as string));
  const initialAmenities = (sp.amenities ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter((x) => valid.has(x)) as AmenityTag[];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gulf-900">
        <Image src={imgSrc('trail')} alt={imgAlt('trail')} fill sizes="100vw" className="object-cover opacity-30" />
        <Container className="relative py-16 sm:py-20">
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-4xl text-display-md font-semibold text-white">
            All {villageStats.count} Lakewood Ranch villages, compared honestly.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gulf-100" data-speakable>
            Prices from {villageStats.minPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} to
            over $6M, HOA fees from under $20 a month to over $1,300, and CDD assessments that differ by thousands a
            year for the same-priced house. Filter by what you actually need — then read the trade-off before you fall
            for the photos.
          </p>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-white">
            {[
              [villageStats.count, 'villages'],
              [villageStats.gated, 'gated'],
              [villageStats.selling, 'selling new construction'],
              [villageStats.ageRestricted, '55+ communities'],
            ].map(([n, l]) => (
              <div key={String(l)}>
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="font-display text-3xl font-semibold">{n}</span>{' '}
                  <span className="text-sm text-gulf-200">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Section tone="shell">
        <Container>
          <VillageExplorer villages={VILLAGES} initialAmenities={initialAmenities} />

          <div className="mt-14 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-gulf-900">How to read these numbers</h2>
            <div className="mt-4 grid gap-6 text-sm leading-relaxed text-ink-soft sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gulf-800">HOA and CDD are separate, and both are real.</p>
                <p className="mt-1">
                  HOA is your village association. CDD is the infrastructure bond, collected on your property tax
                  bill — not optional, and not included in the HOA figure above. Older villages with retired bonds
                  pay far less.{' '}
                  <Link href="/guides/hoa-cdd-decoder" className="text-gulf-700 underline underline-offset-2">Full explainer →</Link>
                </p>
              </div>
              <div>
                <p className="font-semibold text-gulf-800">These are ranges, deliberately.</p>
                <p className="mt-1">
                  Assessments differ street to street inside a single village. Use these to shortlist, then pull the
                  actual tax bill and HOA budget for the specific address before you rely on a number.
                </p>
              </div>
            </div>
            <p className="mt-6 border-t border-ink/8 pt-4 text-xs leading-relaxed text-ink-muted">{legal.dataDisclaimer}</p>
            <SourceList ids={['lwrVillages', 'hoaCddRenick', 'cddRenick', 'newConstructionGuide', 'zillowLwr']} />
          </div>
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd(CRUMBS),
          itemListLd(
            'Villages of Lakewood Ranch',
            VILLAGES.map((v) => ({ name: v.name, url: `/villages/${v.slug}` }))
          ),
          faqLd(['hoa-vs-cdd', 'typical-hoa', 'typical-cdd', 'cheapest-village', 'how-many-villages']),
        ]}
      />
    </>
  );
}
