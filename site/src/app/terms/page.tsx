import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';
import { pageMeta } from '@/lib/seo';
import { agent, brokerage, idx, legal, show } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Terms of Use & DMCA',
  description: 'Terms governing use of this website, MLS/IDX data conditions, accuracy disclaimers and the DMCA copyright notice procedure.',
  path: '/terms',
});

export default function TermsPage() {
  const email = show(agent.email);
  return (
    <LegalPage
      title="Terms of Use & DMCA"
      updated="16 September 2026"
      lede="Plain terms for using this site, the conditions attached to MLS listing data, and how to send a copyright notice."
    >
      <h2>Who operates this site</h2>
      <p>
        This website is operated by {agent.fullName}, a licensed Florida real estate sales associate, in association
        with {show(brokerage.registeredName, brokerage.tradeName)}. Each office is independently owned and operated.
        Licensee and brokerage details appear in the footer of every page.
      </p>

      <h2>Information, not advice</h2>
      <p>
        Everything on this site is general information. It is not legal, tax, financial, insurance or investment
        advice, and it does not create a brokerage relationship. {legal.notLegalAdvice}
      </p>

      <h2>Accuracy and the limits of this site</h2>
      <p>
        We work hard to be accurate and we show our sources and the dates we checked them. Even so: {legal.dataDisclaimer}
      </p>
      <p>Specifically, and stated plainly on the relevant pages:</p>
      <ul>
        <li>Map pins are approximate; drive times are estimated unless labelled live.</li>
        <li>HOA, CDD and price figures are ranges, not quotes for a specific property.</li>
        <li>School ratings and attendance boundaries change and are controlled entirely by the districts.</li>
        <li>Builder incentives change weekly and are quote-specific; we publish patterns and dates, not offers.</li>
        <li>Restaurant hours and specials change without notice.</li>
      </ul>
      <p>
        Our full methodology, including what we treat as verified, reported or estimated, is published at{' '}
        <Link href="/sources">Sources &amp; methodology</Link>.
      </p>

      <h2>MLS / IDX listing data</h2>
      <p>{idx.disclaimer}</p>
      <p>
        Listing content displayed through the Internet Data Exchange programme is provided for consumers&rsquo;
        personal, non-commercial use and may not be used for any purpose other than to identify prospective
        properties consumers may be interested in purchasing. Automated collection of listing data from this site —
        scraping, crawling for republication, or bulk extraction — is prohibited by the MLS participation rules and
        by these terms.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not scrape, mirror or republish listing content or this site&rsquo;s data compilations.</li>
        <li>Do not use any contact form to send unsolicited commercial messages.</li>
        <li>Do not attempt to interfere with, probe or overload the site or its APIs.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        Original text, research compilations, photography and design on this site are protected by copyright.
        Listing content belongs to the listing brokerages and the MLS. REALTOR® is a registered collective
        membership mark of the National Association of REALTORS®. Third-party names and marks referenced here —
        builders, schools, businesses, community names such as Lakewood Ranch® — belong to their respective owners
        and are used descriptively; their use does not imply affiliation or endorsement.
      </p>

      <h2>DMCA copyright notices</h2>
      <p>
        If you believe material on this site infringes your copyright, send a written notice containing: (1) your
        physical or electronic signature; (2) identification of the copyrighted work; (3) identification of the
        material claimed to be infringing and its URL on this site; (4) your contact details; (5) a statement that
        you have a good-faith belief the use is not authorised; and (6) a statement, under penalty of perjury, that
        the notice is accurate and you are authorised to act for the copyright owner.
      </p>
      <p>
        Send notices to {email ? <a href={`mailto:${email}`}>{email}</a> : 'the contact address in the site footer'},
        marked &ldquo;DMCA Notice&rdquo;. We will respond as required by 17 U.S.C. § 512, including removing or
        disabling access to material where appropriate, and will forward counter-notices as provided by the statute.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        This site is provided on an &ldquo;as is&rdquo; basis. To the fullest extent permitted by law, we are not
        liable for indirect or consequential losses arising from your use of it. Nothing here limits liability that
        cannot lawfully be limited.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of Florida.</p>
    </LegalPage>
  );
}
