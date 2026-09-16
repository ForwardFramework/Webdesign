import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd, SourceList } from '@/components/ui';
import { ExploreMap } from '@/components/ExploreMap';
import { PLACES } from '@/data/places';
import { VILLAGES } from '@/data/villages';
import { HAPPY_HOURS } from '@/data/happy-hours';
import { SCHOOLS } from '@/data/schools';
import { pageMeta, breadcrumbLd, faqLd } from '@/lib/seo';
import { legal } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Interactive Lakewood Ranch Map — Beaches, Schools, Drive Times',
  description:
    'Toggle layers for beaches, schools, parks, groceries, doctors, happy hours, golf and airports around Lakewood Ranch — pick any village as your starting point and see drive times to everything that matters.',
  path: '/explore',
  keywords: [
    'Lakewood Ranch map', 'Lakewood Ranch drive times', 'how far is Lakewood Ranch from the beach',
    'Lakewood Ranch amenities map', 'Sarasota area map',
  ],
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Explore the map', href: '/explore' },
];

export default function ExplorePage() {
  return (
    <>
      <Section tone="shell" className="!pb-8">
        <Container>
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-4xl text-display-md font-semibold text-gulf-900">
            Your actual life, on one map.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft" data-speakable>
            Pick the village you are considering, switch on the layers you care about, and see how far everything
            really is. {PLACES.length + SCHOOLS.length + HAPPY_HOURS.length} places across {VILLAGES.length} villages
            — beaches, {SCHOOLS.length} schools, parks, groceries, doctors, {HAPPY_HOURS.length} happy hours, golf,
            town centers and both airports.
          </p>
        </Container>
      </Section>

      <Section tone="shell" className="!pt-0">
        <Container>
          <ExploreMap />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-gulf-900">How the drive times work</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Times shown on the map are estimated from mapped distance with a road-circuity adjustment,
                calibrated against routes we verified. They are labeled as estimates everywhere. Add a routing
                API key and the site switches to live, traffic-aware times automatically.
              </p>
            </div>
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-gulf-900">Why the pins are approximate</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                There is no geocoding step in this build, so each pin is hand-placed at roughly neighborhood
                scale. That is fine for comparing — and not fine for navigating. Every &ldquo;Directions&rdquo;
                link therefore resolves by name and address, so you always arrive at the right place.
              </p>
            </div>
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-gulf-900">Season changes everything</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                From roughly January to April, anything crossing to the barrier islands takes materially longer.
                Locals go to the beach before 10am in season for a reason. Plan around it rather than being
                surprised by it.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
            <p className="text-xs leading-relaxed text-ink-muted">{legal.dataDisclaimer}</p>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              Base map © OpenStreetMap contributors.{' '}
              <Link href="/sources" className="text-gulf-700 underline underline-offset-2">See every source used on this site →</Link>
            </p>
            <SourceList ids={['lwrParks', 'lwrOfficial', 'visitSarasotaBeaches', 'lwrMedical', 'publixTownCenter']} />
          </div>
        </Container>
      </Section>

      <JsonLd data={[breadcrumbLd(CRUMBS), faqLd(['closest-beach', 'airport', 'things-to-do'])]} />
    </>
  );
}
