import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container, Section, Breadcrumbs, JsonLd } from '@/components/ui';
import { EqualHousingLogo } from '@/components/Brand';
import { LeadForm } from '@/components/LeadForm';
import { pageMeta, breadcrumbLd } from '@/lib/seo';
import { agent, brokerage, legal, show } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Contact Caitlin Hoffman — Lakewood Ranch REALTOR®',
  description:
    'Ask about a village, a specific address, current builder incentives, or what your Lakewood Ranch home is worth. Straight answers, no drip campaign.',
  path: '/contact',
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }];

export default function ContactPage() {
  const phone = show(agent.phone);
  const email = show(agent.email);
  const firm = show(brokerage.registeredName, brokerage.tradeName);
  const street = show(brokerage.street);
  const city = show(brokerage.city);
  const zip = show(brokerage.zip);
  const license = show(agent.licenseNumber);

  return (
    <>
      <Section tone="shell">
        <Container>
          <Breadcrumbs items={CRUMBS} />
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h1 className="text-display-md font-semibold text-gulf-900">Let&rsquo;s talk.</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                Whether you are twelve months out and just reading, or you found a house last night and need to
                move — both are fine, and they get different answers.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  ['Relocating from out of state', 'Most buyers here are. Video tours, a shortlist built around your real constraints, and a visit planned so you see three villages properly instead of twelve badly.'],
                  ['Considering new construction', 'Get the current written offers from several builders side by side — and register representation before your first sales-centre visit.'],
                  ['Selling a Lakewood Ranch home', 'Priced against your village rather than the ZIP code, which is the difference between a fast sale and a long one.'],
                  ['Just have a question', 'Ask it. Good questions get added to the FAQ, with the answer.'],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl border border-ink/10 bg-white p-5">
                    <p className="font-semibold text-gulf-900">{t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{d}</p>
                  </div>
                ))}
              </div>

              {/*
                FREC 61J2-10.025(3): brokerage name adjacent to point of contact.
              */}
              <div className="mt-10 rounded-3xl border border-gulf-200 bg-gulf-50 p-6">
                <p className="font-display text-lg font-semibold text-gulf-900">{agent.fullName}, REALTOR®</p>
                {license && <p className="mt-0.5 text-xs text-ink-muted">Florida Real Estate Licence #{license}</p>}
                <address className="mt-4 space-y-1 text-sm not-italic text-ink-soft">
                  <p className="font-semibold text-gulf-800">{firm}</p>
                  {(street || city) && <p>{street}{street && city ? ', ' : ''}{city}{city ? ', ' : ''}{brokerage.state} {zip}</p>}
                  {phone && <p><a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="text-gulf-700 underline underline-offset-2">{phone}</a></p>}
                  {email && <p><a href={`mailto:${email}`} className="text-gulf-700 underline underline-offset-2">{email}</a></p>}
                </address>
                <div className="mt-5 flex items-start gap-4 border-t border-gulf-200 pt-4">
                  <EqualHousingLogo size={32} className="shrink-0 text-gulf-600" />
                  <p className="text-[0.7rem] leading-relaxed text-ink-muted">{legal.fairHousing}</p>
                </div>
              </div>
            </div>

            <div className="card h-fit p-8 lg:sticky lg:top-24">
              <Suspense fallback={<p className="text-sm text-ink-muted">Loading form…</p>}>
                <LeadForm variant="contact" heading="Send a message" cta="Send it over" headingLevel={2} />
              </Suspense>
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd data={breadcrumbLd(CRUMBS)} />
    </>
  );
}
