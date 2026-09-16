import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';
import { EqualHousingLogo, RealtorMark } from '@/components/Brand';
import { pageMeta } from '@/lib/seo';
import { legal, agent, brokerage, show } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Fair Housing Commitment',
  description:
    'Our commitment to the Fair Housing Act and Florida Fair Housing Act, how it shapes what this website will and will not tell you, and how to file a complaint.',
  path: '/fair-housing',
});

export default function FairHousingPage() {
  const email = show(agent.email);
  return (
    <LegalPage
      title="Fair Housing Commitment"
      updated="16 September 2026"
      lede="We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the nation."
    >
      <div className="not-prose flex items-center gap-5 rounded-2xl border border-gulf-200 bg-gulf-50 p-5 text-gulf-700">
        <EqualHousingLogo size={46} />
        <RealtorMark size={40} />
        <p className="text-sm leading-relaxed text-ink-soft">{legal.fairHousing}</p>
      </div>

      <h2>The protected classes</h2>
      <p>
        The federal Fair Housing Act prohibits discrimination in the sale, rental and financing of housing based on
        <strong> race, colour, religion, sex (including sexual orientation and gender identity), national origin,
        familial status and disability</strong>. Florida&rsquo;s Fair Housing Act mirrors these protections. Many
        Florida counties and municipalities add further protected characteristics.
      </p>

      <h2>How this shapes the website itself</h2>
      <p>
        This site publishes a lot of neighbourhood information, and that creates a real obligation. Steering — even
        gently, even well-meant — is a fair housing violation. So:
      </p>
      <ul>
        <li>
          <strong>We describe places, never the people in them.</strong> You will not find characterisations of who
          lives in a village, its &ldquo;feel&rdquo; in demographic terms, or coded language about neighbourhood
          composition anywhere on this site.
        </li>
        <li>
          <strong>School information is factual and links to the district.</strong> We publish published ratings
          with their source and repeatedly direct you to confirm assignment with the district. School quality is a
          legitimate buyer concern; using schools as a demographic proxy is not, and we do not.
        </li>
        <li>
          <strong>&ldquo;Best for&rdquo; means lifestyle fit, not people.</strong> When a village page says who
          tends to love it, that refers to things like golf, walkability, lot size or maintenance preference.
        </li>
        <li>
          <strong>55+ communities are identified as a legal exemption, not a preference.</strong> Age-restricted
          housing operates under the Housing for Older Persons Act exemption. We label those villages so you know
          the restriction exists — it is a fact about the property, not a recommendation about you.
        </li>
        <li>
          <strong>We will answer &ldquo;which area is right for me?&rdquo; with facts.</strong> If you ask for a
          neighbourhood recommendation based on a protected characteristic, we will decline and instead give you
          the objective data — assessments, commute times, school assignments, amenities — so you can decide.
        </li>
      </ul>

      <h2>Accessibility is part of this</h2>
      <p>
        An inaccessible housing website can be a barrier to obtaining housing, which engages the Fair Housing Act
        as well as the ADA. Our{' '}
        <Link href="/accessibility">accessibility statement</Link> sets out the standard we build to, what we have
        done, and the limitations we know about.
      </p>

      <h2>If you believe you have experienced discrimination</h2>
      <ul>
        <li>
          <strong>U.S. Department of Housing and Urban Development (HUD)</strong> — file a complaint at{' '}
          <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer">hud.gov/fairhousing</a>{' '}
          or call 1-800-669-9777 (TTY 1-800-927-9275).
        </li>
        <li>
          <strong>Florida Commission on Human Relations</strong> — the state agency handling Florida Fair Housing
          Act complaints.
        </li>
        <li>
          <strong>Florida Department of Business and Professional Regulation (DBPR)</strong> — for complaints about
          the conduct of a Florida real estate licensee.
        </li>
        {email && (
          <li>
            You can also raise it with us directly at <a href={`mailto:${email}`}>{email}</a>. We would rather hear
            it than not.
          </li>
        )}
      </ul>

      <h2>Licensee information</h2>
      <p>
        {agent.fullName}, REALTOR® — {show(brokerage.registeredName, brokerage.tradeName)}. Each office is
        independently owned and operated. Full licensee and brokerage details appear in the footer of every page on
        this site, as required by Fla. Admin. Code R. 61J2-10.025.
      </p>
    </LegalPage>
  );
}
