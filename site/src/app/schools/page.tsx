import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd, SourceList, ConfidenceBadge, Pill, Callout } from '@/components/ui';
import { LeadForm } from '@/components/LeadForm';
import { SCHOOLS, SCHOOL_BOUNDARY_WARNING } from '@/data/schools';
import { pageMeta, breadcrumbLd, faqLd, itemListLd } from '@/lib/seo';
import { legal } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Lakewood Ranch Schools — Ratings, Districts & How Assignment Works',
  description:
    'Public, charter and private schools serving Lakewood Ranch: GreatSchools and Niche ratings where published, the Manatee and Sarasota district split, and the boundary warning that costs families the most.',
  path: '/schools',
  keywords: [
    'Lakewood Ranch schools', 'Lakewood Ranch school ratings', 'Lakewood Ranch High School',
    'best schools Lakewood Ranch', 'Waterside schools', 'Manatee County schools', 'Sarasota County schools',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Schools', href: '/schools' }];

const GROUPS = [
  { title: 'Public — Manatee County', filter: (s: typeof SCHOOLS[number]) => s.type === 'Public' && s.district.includes('Manatee') },
  { title: 'Public — Sarasota County (serves Waterside)', filter: (s: typeof SCHOOLS[number]) => s.type === 'Public' && s.district.includes('Sarasota') },
  { title: 'Charter', filter: (s: typeof SCHOOLS[number]) => s.type === 'Charter' },
  { title: 'Private & independent', filter: (s: typeof SCHOOLS[number]) => s.type === 'Private' },
];

function Rating({ value }: { value: number | null }) {
  if (value == null) {
    return (
      <span className="text-xs text-ink-muted" title="No current published rating found when this page was compiled">
        Check current rating
      </span>
    );
  }
  const tone = value >= 8 ? 'bg-gulf-700' : value >= 6 ? 'bg-gulf-500' : 'bg-sand-500';
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${tone}`}>{value}</span>
      <span className="text-xs text-ink-muted">/10 GreatSchools</span>
    </span>
  );
}

export default function SchoolsPage() {
  return (
    <>
      <Section tone="shell" className="!pb-8">
        <Container>
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-4xl text-display-md font-semibold text-gulf-900">
            Schools in Lakewood Ranch — and the thing agents skip.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft" data-speakable>
            Schools are why a lot of families move here, and the quality genuinely is a draw. But your assigned
            school comes from your exact street address, set by the district — not from the village name, and not
            from a listing remark. Here is what is published, what is not, and where to confirm.
          </p>
        </Container>
      </Section>

      <Section tone="shell" className="!pt-0">
        <Container>
          <Callout tone="warning" title="Read this before you write an offer">
            {SCHOOL_BOUNDARY_WARNING}
          </Callout>

          <div className="mt-10 space-y-12">
            {GROUPS.map((g) => {
              const rows = SCHOOLS.filter(g.filter);
              if (!rows.length) return null;
              return (
                <section key={g.title}>
                  <h2 className="font-display text-2xl font-semibold text-gulf-900">{g.title}</h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {rows.map((s) => (
                      <article key={s.id} className="card p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-display text-lg font-semibold text-gulf-900">
                              {s.website ? (
                                <a href={s.website} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2 decoration-gulf-200 hover:decoration-gulf-600">
                                  {s.name}
                                </a>
                              ) : s.name}
                            </h3>
                            <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">{s.level} · {s.city}</p>
                          </div>
                          <div className="flex shrink-0 gap-1.5">
                            <Pill>{s.type}</Pill>
                            {s.nicheGrade && <Pill className="bg-sunset-100 text-sunset-600">Niche {s.nicheGrade}</Pill>}
                          </div>
                        </div>

                        <div className="mt-4"><Rating value={s.gsRating} /></div>

                        {s.notes && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{s.notes}</p>}

                        <div className="mt-4 border-t border-ink/8 pt-3">
                          <ConfidenceBadge level={s.confidence} date={s.verifiedOn} />
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-gulf-900">Where to confirm an assignment</h2>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-ink-soft">
                <li>
                  <strong className="text-gulf-800">Manatee County addresses</strong> — most of Lakewood Ranch.
                  Assignment is by the School District of Manatee County; use the district&rsquo;s school locator
                  for the specific street address.
                </li>
                <li>
                  <strong className="text-gulf-800">Sarasota County addresses</strong> — every Waterside village.
                  Assignment is by Sarasota County Schools and has recently been Tatum Ridge Elementary, McIntosh
                  Middle and Booker High. The county has been actively reassessing whether to build new schools to
                  serve Waterside, so confirm rather than assume.
                </li>
                <li>
                  <strong className="text-gulf-800">Charter and private</strong> — application-based, with their
                  own windows that open well before the school year. If a specific programme matters, apply while
                  you are still house-hunting; you can always decline a seat.
                </li>
              </ul>
              <p className="mt-6 rounded-2xl bg-gulf-50 p-4 text-sm leading-relaxed text-ink-soft">
                Moving from out of state?{' '}
                <Link href="/guides/enrolling-kids-florida-schools" className="font-semibold text-gulf-700 underline underline-offset-2">
                  The enrolment guide
                </Link>{' '}
                covers every form, including the Florida DH 680 immunisation certificate that your existing records
                will not substitute for.
              </p>
              <p className="mt-5 border-t border-ink/8 pt-4 text-xs leading-relaxed text-ink-muted">{legal.schoolDisclaimer}</p>
              <SourceList ids={['greatSchools', 'nicheLwrHigh', 'sarasotaSchools', 'manateeSchools', 'lwrPrep', 'oda']} />
            </div>

            <div className="card h-fit p-6 sm:p-8">
              <LeadForm
                variant="contact"
                heading="Need the school picture for a specific address?"
                sub="Send the address or the villages you are weighing up and you'll get the current assignment plus what is actually under boundary review."
                cta="Check my address"
                compact
              />
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd(CRUMBS),
          itemListLd('Schools serving Lakewood Ranch, Florida', SCHOOLS.map((s) => ({ name: s.name, url: '/schools' }))),
          faqLd(['lwr-schools-good', 'which-school', 'enroll-school', 'school-choice']),
        ]}
      />
    </>
  );
}
