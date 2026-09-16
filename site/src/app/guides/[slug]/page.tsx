import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, Breadcrumbs, JsonLd, Callout } from '@/components/ui';
import { LeadForm } from '@/components/LeadForm';
import { GUIDES, guideBySlug } from '@/data/guides';
import { pageMeta, breadcrumbLd, articleLd, faqLd } from '@/lib/seo';
import { legal } from '@/config/site';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return pageMeta({ title: 'Guide not found', description: 'This guide could not be found.', path: `/guides/${slug}`, noIndex: true });
  return pageMeta({
    title: g.title,
    description: `${g.subtitle}. ${g.promise}`,
    path: `/guides/${g.slug}`,
    type: 'article',
    publishedTime: g.updated,
    modifiedTime: g.updated,
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Guides', href: '/guides' },
    { name: g.title, href: `/guides/${g.slug}` },
  ];
  const others = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <>
      <Section tone="shell" className="!pb-8">
        <Container>
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 max-w-3xl">
            <span aria-hidden="true" className="text-5xl">{g.emoji}</span>
            <h1 className="mt-4 text-display-md font-semibold text-gulf-900">{g.title}</h1>
            <p className="mt-3 text-xl text-ink-soft">{g.subtitle}</p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-wider text-ink-muted">
              <span>{g.readingTime} read</span>
              <span>·</span>
              <span>Updated {g.updated}</span>
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="shell" className="!pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
            <article className="max-w-prose">
              <p className="text-lg leading-relaxed text-ink" data-speakable>{g.intro}</p>

              {g.sections.map((s, i) => (
                <section key={s.heading} className="mt-12" id={`s${i + 1}`}>
                  <h2 className="font-display text-2xl font-semibold text-gulf-900">{s.heading}</h2>
                  {s.body && <p className="mt-4 prose-coastal">{s.body}</p>}

                  {s.steps && (
                    <ol className="mt-6 space-y-5">
                      {s.steps.map((st, j) => (
                        <li key={st.title} className="flex gap-4">
                          <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gulf-700 text-sm font-bold text-white">
                            {j + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-gulf-900">
                              {st.title}
                              {st.deadline && (
                                <span className="ml-2 rounded-full bg-coral-100 px-2.5 py-0.5 align-middle text-xs font-semibold text-coral-700">
                                  {st.deadline}
                                </span>
                              )}
                            </p>
                            <p className="mt-1 leading-relaxed text-ink-soft">{st.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}

                  {s.bullets && (
                    <ul className="mt-5 space-y-2.5">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-3 leading-relaxed text-ink-soft">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gulf-400" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.callout && (
                    <Callout tone={s.callout.tone} title={s.callout.title}>{s.callout.body}</Callout>
                  )}
                </section>
              ))}

              <p className="mt-14 rounded-2xl border border-ink/10 bg-white p-5 text-xs leading-relaxed text-ink-muted">
                {legal.notLegalAdvice} Rules, fees and deadlines change — this guide was last checked on {g.updated}.
                Verify anything you will rely on with the issuing agency.
              </p>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
              <nav className="card p-5" aria-label="On this page">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">On this page</h2>
                <ol className="mt-3 space-y-2">
                  {g.sections.map((s, i) => (
                    <li key={s.heading}>
                      <a href={`#s${i + 1}`} className="text-sm leading-snug text-ink-soft hover:text-gulf-700 hover:underline underline-offset-2">
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="card p-6">
                <LeadForm
                  variant="guide"
                  guideSlug={g.slug}
                  guideTitle={g.title}
                  heading="Want the printable version?"
                  sub="The full text is right here — this just sends you the checklist as a PDF you can take with you."
                  cta="Email me the checklist"
                  compact
                />
              </div>
            </aside>
          </div>

          {others.length > 0 && (
            <div className="mt-16 border-t border-ink/10 pt-10">
              <h2 className="font-display text-2xl font-semibold text-gulf-900">Read next</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {others.map((o) => (
                  <Link key={o.slug} href={`/guides/${o.slug}`} className="card card-hover p-6">
                    <span aria-hidden="true" className="text-3xl">{o.emoji}</span>
                    <h3 className="mt-3 font-display text-lg font-semibold text-gulf-900">{o.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{o.promise}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          articleLd({
            title: g.title,
            description: `${g.subtitle}. ${g.promise}`,
            path: `/guides/${g.slug}`,
            published: g.updated,
            modified: g.updated,
          }),
          faqLd(
            g.slug === 'florida-relocation-playbook' ? ['driver-license', 'car-registration', 'homestead', 'no-income-tax']
            : g.slug === 'enrolling-kids-florida-schools' ? ['enroll-school', 'which-school', 'school-choice']
            : g.slug === 'hoa-cdd-decoder' ? ['hoa-vs-cdd', 'typical-hoa', 'typical-cdd', 'total-monthly']
            : g.slug === 'new-construction-playbook' ? ['new-vs-resale', 'builder-agent', 'how-long-build']
            : g.slug === 'hurricane-and-insurance' ? ['hurricanes', 'insurance-cost']
            : ['cheapest-village', 'how-many-villages']
          ),
        ]}
      />
    </>
  );
}
