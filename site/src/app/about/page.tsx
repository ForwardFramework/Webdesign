import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Section, Breadcrumbs, JsonLd, SectionHeading } from '@/components/ui';
import { LeadForm } from '@/components/LeadForm';
import { pageMeta, breadcrumbLd, realEstateAgentLd, faqLd } from '@/lib/seo';
import { imgSrc, imgAlt } from '@/config/images';
import { agent, brokerage, show } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: `About ${agent.fullName} — REALTOR®, Lakewood Ranch & Sarasota`,
  description: `${agent.shortBio} Working with buyers, sellers and new-construction clients across Lakewood Ranch, Bradenton, Sarasota and Tampa Bay.`,
  path: '/about',
  type: 'profile',
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }];

/**
 * NOTE FOR THE SITE OWNER
 * ───────────────────────
 * This page deliberately contains NO claims that were not supplied — no years
 * of experience, no sales volume, no awards, no client counts. Those are
 * exactly the claims that create advertising liability if they drift from
 * fact, and none of them could be verified when this site was built.
 *
 * Add yours here, and keep them accurate and substantiable. Florida's
 * advertising rule (61J2-10.025(1)) prohibits advertising that is fraudulent,
 * false, deceptive or misleading — which includes a production figure you
 * cannot evidence.
 */
export default function AboutPage() {
  const firm = show(brokerage.registeredName, brokerage.tradeName);

  return (
    <>
      <Section tone="shell">
        <Container>
          <Breadcrumbs items={CRUMBS} />
          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">REALTOR® · {firm}</p>
              <h1 className="mt-4 text-display-md font-semibold text-gulf-900">{agent.fullName}</h1>
              <p className="mt-5 text-xl leading-relaxed text-ink-soft" data-speakable>{agent.shortBio}</p>
              <p className="mt-5 leading-relaxed text-ink-soft">
                {agent.title}. Serving Lakewood Ranch, Bradenton, Sarasota, Parrish, Palmetto, Venice and the
                wider Tampa Bay area.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-coral">Start a conversation</Link>
                <Link href="/homes" className="btn-ghost">Search homes</Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-4xl shadow-lift">
              <Image src={imgSrc('townCenter')} alt={imgAlt('townCenter')} width={900} height={700} className="h-full w-full object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="How this works"
            title="The research is free. The value is in what it stops you doing."
            lede="Everything on this site is published openly because the hard part of buying here was never finding listings — it was working out which of thirty-plus villages actually suits you, and what each one really costs to hold."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                t: 'Buying',
                d: 'A shortlist built from your commute, your school needs and your genuine monthly ceiling — including the CDD, which is where most budgets quietly break. Then three villages seen properly, not twelve seen badly.',
              },
              {
                t: 'Building new',
                d: 'Register before your first model-home visit; representation is paid from the builder’s marketing budget, so going alone buys you nothing. Then the parts that matter: the incentive conditions, the lot premium, the structural options you cannot add later, and the contract.',
              },
              {
                t: 'Selling',
                d: 'Priced against your village, not your ZIP code — a Country Club East comp tells you almost nothing about a Star Farms home. Plus a plan for the specific buyer your house actually attracts.',
              },
            ].map((c) => (
              <div key={c.t} className="card p-7">
                <h2 className="font-display text-xl font-semibold text-gulf-900">{c.t}</h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-gulf-gradient p-8 text-white sm:p-12 grain">
            <h2 className="font-display text-3xl font-semibold">What you can expect</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {[
                ['A straight answer, including "don’t"', 'If a village is wrong for you, you will hear that before you see it, not after you have written an offer.'],
                ['Numbers you can check', 'Every figure used in a recommendation comes with where it came from. Nothing on this site asks you to take a number on faith.'],
                ['No pressure to decide', 'Most people relocating here need two visits and a few months. That is normal, and it is fine.'],
                ['Local logistics, handled', 'License, plates, homestead, school enrollment, insurance quotes — the unglamorous list that actually makes a move work.'],
              ].map(([t, d]) => (
                <li key={t} className="rounded-2xl bg-white/10 p-5">
                  <p className="font-semibold">{t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-gulf-100">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section tone="shell">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="card p-8">
              <LeadForm
                variant="contact"
                heading="Tell me what you're weighing up"
                sub="Villages you're curious about, what you need from schools, your real monthly ceiling. You'll get a straight answer — not a drip campaign."
                cta="Send it over"
              />
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd data={[breadcrumbLd(CRUMBS), realEstateAgentLd(), faqLd(['why-agent', 'out-of-state', 'builder-agent'])]} />
    </>
  );
}
