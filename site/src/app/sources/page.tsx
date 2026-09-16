import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd } from '@/components/ui';
import { SOURCES, RESEARCH_DATE } from '@/data/sources';
import { pageMeta, breadcrumbLd } from '@/lib/seo';
import { legal } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Sources & Methodology',
  description:
    'Every source behind the village, school, tax, climate, builder and business data on this site, with the date each was checked — and an honest account of what is verified, reported or estimated.',
  path: '/sources',
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Sources', href: '/sources' }];

export default function SourcesPage() {
  const refs = Object.values(SOURCES);
  return (
    <>
      <Section tone="shell">
        <Container>
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-3xl text-display-md font-semibold text-gulf-900">Sources &amp; methodology</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft">
            Research for this site was compiled on <strong>{RESEARCH_DATE}</strong>. Every figure carries a
            confidence level and the date it was checked, because a real estate site full of undated numbers is
            just a set of assertions.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              ['Verified', 'Taken from an official or primary source listed on this page.', 'border-gulf-300 bg-gulf-50'],
              ['Reported', 'Consistently reported by multiple secondary sources. Worth confirming before you rely on it.', 'border-sand-300 bg-sand-50'],
              ['Estimate', 'A reasoned range, shown as a range, never presented as a confirmed fact.', 'border-coral-200 bg-coral-50'],
            ].map(([label, desc, cls]) => (
              <div key={label} className={`rounded-2xl border p-5 ${cls}`}>
                <p className="font-display text-lg font-semibold text-gulf-900">{label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-gulf-900">What this site does not claim</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink-soft">
              <li>
                <strong className="text-gulf-800">Map pins are approximate.</strong> They are hand-placed at
                neighborhood scale, not geocoded. Every &ldquo;Directions&rdquo; link resolves by name and
                address so you always arrive at the right place.
              </li>
              <li>
                <strong className="text-gulf-800">Drive times are estimated</strong> unless a live routing key is
                configured, in which case they are labeled as live. Estimates are marked with an asterisk
                everywhere they appear.
              </li>
              <li>
                <strong className="text-gulf-800">HOA and CDD figures are ranges.</strong> Assessments differ
                street to street inside a single village. Budget from the county property appraiser&rsquo;s figure
                for the specific parcel, never from a range on this site.
              </li>
              <li>
                <strong className="text-gulf-800">Happy hour windows are only published when found published.</strong>{' '}
                Venues we know run one but could not confirm a current window for are listed separately, unguessed.
              </li>
              <li>
                <strong className="text-gulf-800">School ratings with no published figure show &ldquo;check current
                rating&rdquo;</strong> rather than a blank that reads like a low score.
              </li>
              <li>
                <strong className="text-gulf-800">Builder incentives are described as patterns, not headline
                numbers</strong>, with the date checked — because a stale &ldquo;$50,000 off&rdquo; banner is both
                wrong within days and a misleading advertising claim.
              </li>
            </ul>
          </div>

          <h2 className="mt-12 font-display text-2xl font-semibold text-gulf-900">Every source used ({refs.length})</h2>
          <ul className="mt-6 divide-y divide-ink/8 rounded-3xl border border-ink/8 bg-white">
            {refs.map((r) => (
              <li key={r.id} className="px-6 py-4">
                <a href={r.url} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-gulf-700 underline underline-offset-2 hover:text-gulf-900">
                  {r.label}
                </a>
                <p className="mt-0.5 break-all text-xs text-ink-muted">{r.url} · checked {r.retrieved}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 rounded-2xl border border-ink/10 bg-white p-5 text-xs leading-relaxed text-ink-muted">
            {legal.dataDisclaimer}{' '}
            <Link href="/contact" className="text-gulf-700 underline underline-offset-2">Spotted something wrong? Tell us and it gets fixed.</Link>
          </p>
        </Container>
      </Section>

      <JsonLd data={breadcrumbLd(CRUMBS)} />
    </>
  );
}
