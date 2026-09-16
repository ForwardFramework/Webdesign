import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd, SourceList, Callout } from '@/components/ui';
import { PLACES, googleDirectionsUrl } from '@/data/places';
import { DRIVE_TIMES } from '@/data/lifestyle';
import { pageMeta, breadcrumbLd, faqLd, itemListLd, placeLd } from '@/lib/seo';
import { imgSrc, imgAlt } from '@/config/images';

export const metadata: Metadata = pageMeta({
  title: 'Beaches & Parks Near Lakewood Ranch — Drive Times to Every One',
  description:
    'Siesta Key, Coquina, Lido, Anna Maria and more — every beach near Lakewood Ranch with honest drive times, plus the parks, preserves and state parks worth the trip.',
  path: '/beaches',
  keywords: [
    'beaches near Lakewood Ranch', 'how far is Lakewood Ranch from the beach', 'Siesta Key from Lakewood Ranch',
    'Coquina Beach', 'Anna Maria Island', 'Sarasota beaches', 'parks near Lakewood Ranch',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Beaches & parks', href: '/beaches' }];

export default function BeachesPage() {
  const beaches = PLACES.filter((p) => p.category === 'beach');
  const parks = PLACES.filter((p) => p.category === 'park');
  const driveFor = (name: string) =>
    DRIVE_TIMES.destinations.find((d) => name.toLowerCase().includes(d.name.toLowerCase().split(' ')[0]));

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gulf-900">
        <Image src={imgSrc('beach')} alt={imgAlt('beach')} fill sizes="100vw" priority className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-gulf-950/85 to-gulf-950/25" />
        <Container className="relative py-20 sm:py-24">
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-3xl text-display-md font-semibold text-white">
            The beaches are the point. Here&rsquo;s exactly how far.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gulf-100" data-speakable>
            Lakewood Ranch sits inland by design — you get world-class Gulf beaches at 20 to 45 minutes without
            the barrier-island insurance premium, the storm-surge zone, or season-long gridlock outside your door.
          </p>
        </Container>
      </section>

      <Section tone="shell">
        <Container>
          <Callout tone="tip" title="The local habit worth copying">
            In season — roughly January through April — go before 10am. Barrier-island parking fills and the
            bridges back up. Off-season you can leave at two on a Saturday and still park at Siesta.
          </Callout>

          <h2 className="mt-12 font-display text-3xl font-semibold text-gulf-900">Every beach, nearest first</h2>
          <div className="mt-8 space-y-6">
            {beaches.map((b, i) => {
              const drive = driveFor(b.name);
              return (
                <article key={b.id} className="card overflow-hidden lg:flex">
                  <div className="relative h-52 shrink-0 lg:h-auto lg:w-72">
                    <Image
                      src={imgSrc(i % 3 === 0 ? 'beach' : i % 3 === 1 ? 'island' : 'kayak')}
                      alt={b.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 18rem"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-gulf-900">{b.name}</h3>
                        <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">{b.kind} · {b.city}</p>
                      </div>
                      {drive && (
                        <div className="shrink-0 rounded-2xl bg-gulf-50 px-4 py-2 text-center">
                          <p className="font-display text-xl font-semibold text-gulf-800">{drive.minutes} min</p>
                          <p className="text-xs text-ink-muted">{drive.miles} mi</p>
                        </div>
                      )}
                    </div>
                    {b.blurb && <p className="mt-3 leading-relaxed text-ink-soft">{b.blurb}</p>}
                    {b.highlights && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {b.highlights.map((h) => (
                          <li key={h} className="rounded-full bg-sand-100 px-3 py-1.5 text-xs font-medium text-sand-800">{h}</li>
                        ))}
                      </ul>
                    )}
                    <a
                      href={googleDirectionsUrl(b)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost btn-sm mt-5"
                    >
                      Directions →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <h2 className="mt-16 font-display text-3xl font-semibold text-gulf-900">Parks, trails & preserves</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
            Lakewood Ranch alone maintains 150+ miles of trail and about 10,000 acres of lakes, parks and preserve
            — before you drive anywhere.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {parks.map((p) => (
              <article key={p.id} className="card card-hover flex flex-col p-6">
                <h3 className="font-display text-lg font-semibold text-gulf-900">{p.name}</h3>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">{p.kind}</p>
                {p.blurb && <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{p.blurb}</p>}
                {p.highlights && (
                  <ul className="mt-4 space-y-1">
                    {p.highlights.slice(0, 4).map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-ink-soft">
                        <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gulf-400" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <a href={googleDirectionsUrl(p)} target="_blank" rel="noopener noreferrer" className="mt-5 text-xs font-semibold text-gulf-700 underline underline-offset-2">
                  Directions →
                </a>
              </article>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-gulf-900">Drive times, in full</h2>
            <p className="mt-2 text-sm text-ink-soft">{DRIVE_TIMES.note}</p>
            <ul className="mt-5 divide-y divide-ink/8">
              {DRIVE_TIMES.destinations.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm font-medium text-gulf-900">{d.name}</span>
                  <span className="shrink-0 text-sm text-ink-muted">
                    <strong className="font-semibold text-gulf-700">{d.minutes} min</strong> · {d.miles} mi
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink-soft">
              Want these from a specific village?{' '}
              <Link href="/explore" className="font-semibold text-gulf-700 underline underline-offset-2">Use the interactive map →</Link>
            </p>
            <SourceList ids={['visitSarasotaBeaches', 'lwrParks', 'lwrOfficial']} />
          </div>
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd(CRUMBS),
          itemListLd('Beaches near Lakewood Ranch, Florida', beaches.map((b) => ({ name: b.name, url: '/beaches' }))),
          ...beaches.map((b) => placeLd({ name: b.name, description: b.blurb, lat: b.coords.lat, lng: b.coords.lng, city: b.city, address: b.address })),
          faqLd(['closest-beach', 'things-to-do']),
        ]}
      />
    </>
  );
}
