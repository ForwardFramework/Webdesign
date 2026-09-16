import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd, SourceList, Callout, ConfidenceBadge } from '@/components/ui';
import { LeadForm } from '@/components/LeadForm';
import { PLACES, googleDirectionsUrl } from '@/data/places';
import type { PlaceCategory } from '@/data/types';
import { pageMeta, breadcrumbLd, itemListLd, faqLd } from '@/lib/seo';
import { legal } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'New in Town — Doctors, Dentists, Groceries & Everything Else',
  description:
    'The practical list for your first month in Lakewood Ranch: hospitals and urgent care, pediatricians, dentists, grocery stores, the tax collector office for your license and plates, the library and gyms.',
  path: '/essentials',
  keywords: [
    'Lakewood Ranch doctors', 'Lakewood Ranch dentists', 'pediatricians Lakewood Ranch',
    'grocery stores Lakewood Ranch', 'Lakewood Ranch urgent care', 'moving to Lakewood Ranch checklist',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'New in town', href: '/essentials' }];

const GROUPS: { key: PlaceCategory; title: string; lede: string }[] = [
  {
    key: 'health',
    title: 'Hospitals, urgent care & doctors',
    lede: 'Lakewood Ranch has its own acute-care hospital with a 24/7 emergency department, plus pediatric urgent care for the evenings that are not quite an emergency.',
  },
  {
    key: 'dental',
    title: 'Dentists & orthodontists',
    lede: 'Book the first cleaning before you need one — good practices here fill up, and a new-patient slot is far easier to get than an emergency appointment.',
  },
  {
    key: 'grocery',
    title: 'Groceries',
    lede: 'Publix is the default and there is one in nearly every plaza. Detwiler’s is the one locals plan their week around.',
  },
  {
    key: 'essential',
    title: 'Admin: licenses, plates, homestead & the library',
    lede: 'Florida handles driver licenses and vehicle registration through the county tax collector, not a DMV. Homestead is filed with the county property appraiser, free, by March 1.',
  },
  {
    key: 'fitness',
    title: 'Fitness',
    lede: 'Beyond whatever your village includes.',
  },
];

export default function EssentialsPage() {
  const grouped = GROUPS.map((g) => ({ ...g, items: PLACES.filter((p) => p.category === g.key) })).filter((g) => g.items.length);

  return (
    <>
      <Section tone="shell" className="!pb-8">
        <Container>
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-3xl text-display-md font-semibold text-gulf-900">
            The unglamorous list that actually makes a move work.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft" data-speakable>
            Nobody writes brochures about finding a dentist or renewing your plates, and those are the two things
            that eat your first month. Here is where everything is — with the caveat that we list practices, we do
            not endorse them, and you should check current reviews and insurance acceptance yourself.
          </p>
        </Container>
      </Section>

      <Section tone="shell" className="!pt-0">
        <Container>
          <Callout tone="warning" title="Two clocks start the day you become a resident">
            Vehicles must be titled and registered within <strong>10 days</strong>, and you need a Florida driver
            license within <strong>30 days</strong>. You cannot register a car without Florida insurance from a
            Florida-licensed agent first — start that call before the moving truck arrives.{' '}
            <Link href="/guides/florida-relocation-playbook" className="font-semibold underline underline-offset-2">
              Full step-by-step playbook →
            </Link>
          </Callout>

          <div className="mt-12 space-y-14">
            {grouped.map((g) => (
              <section key={g.key}>
                <h2 className="font-display text-3xl font-semibold text-gulf-900">{g.title}</h2>
                <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">{g.lede}</p>
                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((p) => (
                    <article key={p.id} className="card flex flex-col p-6">
                      <h3 className="font-display text-lg font-semibold leading-snug text-gulf-900">
                        {p.website ? (
                          <a href={p.website} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2 decoration-gulf-200 hover:decoration-gulf-600">
                            {p.name}
                          </a>
                        ) : p.name}
                      </h3>
                      {p.kind && <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">{p.kind}</p>}
                      {p.blurb && <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{p.blurb}</p>}

                      {p.highlights && (
                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {p.highlights.slice(0, 4).map((h) => (
                            <li key={h} className="rounded-full bg-gulf-50 px-2.5 py-1 text-[0.7rem] font-medium text-gulf-700">{h}</li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-5 space-y-1 border-t border-ink/8 pt-3 text-xs text-ink-muted">
                        {p.address && <p>{p.address}</p>}
                        <p>{p.city}, {p.state} {p.zip ?? ''}</p>
                        {p.phone && (
                          <p>
                            <a href={`tel:${p.phone.replace(/[^\d+]/g, '')}`} className="text-gulf-700 underline underline-offset-2">{p.phone}</a>
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <ConfidenceBadge level={p.confidence} date={p.verifiedOn} />
                        <a href={googleDirectionsUrl(p)} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gulf-700 underline underline-offset-2">
                          Directions →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-gulf-900">A word on these listings</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                These are compiled from public sources so you have a starting point, not a recommendation. We have
                no financial relationship with any practice or business on this page, and inclusion is not an
                endorsement. Check current reviews, confirm they take your insurance, and confirm hours before you
                drive over.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                Want more of the map? Every one of these appears on the{' '}
                <Link href="/explore" className="font-semibold text-gulf-700 underline underline-offset-2">interactive map</Link>{' '}
                with drive times from whichever village you are considering.
              </p>
              <p className="mt-6 border-t border-ink/8 pt-4 text-xs leading-relaxed text-ink-muted">{legal.dataDisclaimer}</p>
              <SourceList ids={['lwrMedical', 'publixTownCenter', 'flhsmvNewResident', 'homesteadGuide']} />
            </div>

            <div className="card h-fit p-6 sm:p-8">
              <LeadForm
                variant="contact"
                heading="Moving here soon?"
                sub="Ask for the current new-resident checklist — which offices take appointments, which practices are accepting patients, and the order to do it all in."
                cta="Send me the checklist"
                compact
              />
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd(CRUMBS),
          itemListLd('Essential services in Lakewood Ranch, Florida', grouped.flatMap((g) => g.items).map((p) => ({ name: p.name, url: '/essentials' }))),
          faqLd(['driver-license', 'car-registration', 'homestead']),
        ]}
      />
    </>
  );
}
