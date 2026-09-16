import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Container, Section, Breadcrumbs, JsonLd } from '@/components/ui';
import { HomeSearch } from '@/components/HomeSearch';
import { pageMeta, breadcrumbLd, faqLd } from '@/lib/seo';
import { VILLAGES } from '@/data/villages';
import { isMlsConfigured } from '@/lib/mls';
import { idx } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Lakewood Ranch Homes for Sale — Search by Village',
  description:
    'Search homes for sale in Lakewood Ranch, Bradenton and Sarasota — filtered by village, HOA ceiling, new construction, pool and waterfront. The village filter no national portal gives you.',
  path: '/homes',
  keywords: [
    'Lakewood Ranch homes for sale', 'Lakewood Ranch real estate listings', 'homes for sale Lakewood Ranch FL',
    'Bradenton homes for sale', 'Sarasota homes for sale', 'new construction Lakewood Ranch',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Search homes', href: '/homes' }];

export default async function HomesPage({
  searchParams,
}: {
  searchParams: Promise<{ villages?: string }>;
}) {
  const sp = await searchParams;
  const initial = sp.villages
    ? sp.villages.split(',').map((s) => s.trim()).filter((s) => VILLAGES.some((v) => v.slug === s))
    : [];

  return (
    <>
      <Section tone="shell" className="!pb-8">
        <Container>
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-4xl text-display-md font-semibold text-gulf-900">
            Search by village. Not by drawing a shape on a map.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft" data-speakable>
            Tick the Lakewood Ranch villages you actually care about and filter on what matters locally — an HOA
            ceiling, new construction, a pool, waterfront. Powered by {idx.mlsName} via IDX.
            {!isMlsConfigured() && ' The live feed is not connected yet, so sample records are shown below and clearly marked.'}
          </p>
        </Container>
      </Section>

      <Section tone="shell" className="!pt-0">
        <Container>
          <Suspense fallback={<p className="py-20 text-center text-ink-muted">Loading search…</p>}>
            <HomeSearch initialVillages={initial} />
          </Suspense>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-gulf-900">Compare the monthly, not the price</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Two homes at the same list price can differ by $900 a month once HOA, CDD and club membership
                stack up.{' '}
                <Link href="/guides/hoa-cdd-decoder" className="text-gulf-700 underline underline-offset-2">Learn how to price it →</Link>
              </p>
            </div>
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-gulf-900">New construction is a different game</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Builder inventory often never hits the MLS the way resale does, and incentives shift weekly.{' '}
                <Link href="/new-construction" className="text-gulf-700 underline underline-offset-2">See builders & incentives →</Link>
              </p>
            </div>
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-gulf-900">Not sure which village yet?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Start from the neighborhood instead of the house. All {VILLAGES.length} compared, with the
                trade-offs.{' '}
                <Link href="/villages" className="text-gulf-700 underline underline-offset-2">Compare villages →</Link>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd data={[breadcrumbLd(CRUMBS), faqLd(['median-price', 'cheapest-village', 'new-vs-resale', 'builder-agent'])]} />
    </>
  );
}
