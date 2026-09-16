import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd } from '@/components/ui';
import { LeadForm } from '@/components/LeadForm';
import { FAQS, faqCategories } from '@/data/faqs';
import { pageMeta, breadcrumbLd, faqLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: `Lakewood Ranch FAQ — ${FAQS.length} Straight Answers`,
  description:
    'Direct answers about Lakewood Ranch: HOA and CDD fees, median prices, schools and boundaries, beaches and drive times, Florida licences and registration, insurance costs and hurricanes.',
  path: '/faq',
  keywords: [
    'Lakewood Ranch FAQ', 'Lakewood Ranch HOA fees', 'is Lakewood Ranch a city',
    'how far is Lakewood Ranch from the beach', 'Lakewood Ranch CDD', 'moving to Lakewood Ranch',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'FAQ', href: '/faq' }];

export default function FaqPage() {
  return (
    <>
      <Section tone="shell" className="!pb-8">
        <Container>
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-3xl text-display-md font-semibold text-gulf-900">
            {FAQS.length} questions, answered straight.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft" data-speakable>
            No hedging, no &ldquo;it depends, call me&rdquo;. Where the honest answer is a range, it is a range.
            Where it genuinely depends on your address, that is said too.
          </p>
        </Container>
      </Section>

      <Section tone="shell" className="!pt-0">
        <Container>
          <nav aria-label="FAQ categories" className="flex flex-wrap gap-2">
            {faqCategories.map((c) => (
              <a key={c} href={`#${c.replace(/\s+/g, '-').toLowerCase()}`} className="chip hover:border-gulf-400">{c}</a>
            ))}
          </nav>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_20rem]">
            <div className="space-y-12">
              {faqCategories.map((cat) => (
                <section key={cat} id={cat.replace(/\s+/g, '-').toLowerCase()} className="scroll-mt-28">
                  <h2 className="font-display text-2xl font-semibold text-gulf-900">{cat}</h2>
                  <div className="mt-5 divide-y divide-ink/8 rounded-3xl border border-ink/8 bg-white">
                    {FAQS.filter((f) => f.category === cat).map((f) => (
                      <details key={f.id} id={f.id} className="group scroll-mt-28 px-6 py-5">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-lg font-semibold text-gulf-900">
                          <h3 className="text-lg">{f.question}</h3>
                          <span aria-hidden="true" className="mt-1 shrink-0 text-gulf-500 transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <p className="mt-3 leading-relaxed text-ink-soft">{f.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
              <div className="card p-6">
                <LeadForm
                  variant="contact"
                  heading="Question not here?"
                  sub="Ask it. If it's a good one it gets added to this page — with the answer, not a sales call."
                  cta="Ask Caitlin"
                  compact
                />
              </div>
              <div className="card p-6">
                <h2 className="font-display text-lg font-semibold text-gulf-900">Go deeper</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {[
                    ['All villages compared', '/villages'],
                    ['HOA & CDD decoder', '/guides/hoa-cdd-decoder'],
                    ['Florida relocation playbook', '/guides/florida-relocation-playbook'],
                    ['Schools & boundaries', '/schools'],
                    ['Every source we used', '/sources'],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-gulf-700 underline underline-offset-2 hover:text-gulf-900">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <JsonLd data={[breadcrumbLd(CRUMBS), faqLd()]} />
    </>
  );
}
