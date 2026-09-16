import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd } from '@/components/ui';
import { LeadForm } from '@/components/LeadForm';
import { GUIDES } from '@/data/guides';
import { pageMeta, breadcrumbLd, itemListLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Free Florida Relocation Guides — Licenses, Schools, HOA & Building New',
  description:
    'Six free guides for moving to Lakewood Ranch: the Florida relocation playbook, enrolling your kids, the HOA & CDD decoder, the new construction playbook, choosing a village, and hurricanes & insurance.',
  path: '/guides',
  keywords: [
    'moving to Florida guide', 'Florida relocation checklist', 'Florida drivers license new resident',
    'enrolling kids Florida schools', 'Lakewood Ranch buyer guide', 'Florida homestead exemption',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Guides', href: '/guides' }];

export default function GuidesPage() {
  return (
    <>
      <Section tone="shell" className="!pb-8">
        <Container>
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-4xl text-display-md font-semibold text-gulf-900">
            The guides, in full. No form in the way.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft" data-speakable>
            Every one of these is published complete on this site. The email form gets you the printable
            checklist version — not the information. Gating the facts someone needs in order to move house
            would be a strange way to earn their trust.
          </p>
        </Container>
      </Section>

      <Section tone="shell" className="!pt-0">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-5 sm:grid-cols-2">
              {GUIDES.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-hover flex flex-col p-7">
                  <span aria-hidden="true" className="text-4xl">{g.emoji}</span>
                  <h2 className="mt-4 font-display text-xl font-semibold text-gulf-900">{g.title}</h2>
                  <p className="mt-1.5 text-sm text-ink-muted">{g.subtitle}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">{g.promise}</p>
                  <p className="mt-5 flex items-center justify-between border-t border-ink/8 pt-4 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-gulf-600">{g.readingTime} read</span>
                    <span className="text-ink-muted">Updated {g.updated}</span>
                  </p>
                </Link>
              ))}
            </div>

            <div className="card h-fit p-7 lg:sticky lg:top-24">
              <LeadForm
                variant="guide"
                guideTitle="Lakewood Ranch Relocation Bundle"
                guideSlug="bundle"
                heading="All six, as one PDF"
                sub="Plus the village comparison sheet — every HOA range, CDD range and price band in a single printable table you can take to showings."
                cta="Send me the bundle"
                compact
              />
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd(CRUMBS),
          itemListLd('Free Florida relocation guides', GUIDES.map((g) => ({ name: g.title, url: `/guides/${g.slug}` }))),
        ]}
      />
    </>
  );
}
