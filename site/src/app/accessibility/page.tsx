import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { pageMeta } from '@/lib/seo';
import { agent, brokerage, show } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Accessibility Statement',
  description: 'Our commitment to WCAG 2.1 Level AA, the specific measures taken on this site, known limitations, and how to report an accessibility barrier.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  const email = show(agent.email);
  const phone = show(agent.phone);
  return (
    <LegalPage
      title="Accessibility Statement"
      updated="16 September 2026"
      lede="Housing information should be usable by everyone. An inaccessible real estate website can violate both the Americans with Disabilities Act and the Fair Housing Act, and we treat that as a design requirement rather than a disclaimer."
    >
      <h2>Our standard</h2>
      <p>
        This site is built to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA, the
        standard the National Association of REALTORS® points members toward and the benchmark generally applied to
        public-facing housing websites.
      </p>

      <h2>What we have actually done</h2>
      <ul>
        <li>Semantic HTML landmarks, a single H1 per page, and a logical heading order throughout.</li>
        <li>A &ldquo;skip to main content&rdquo; link as the first focusable element on every page.</li>
        <li>Visible focus indicators on every interactive element, never removed.</li>
        <li>Colour pairings checked against WCAG AA contrast ratios for body and large text.</li>
        <li>All meaningful images carry descriptive alternative text; decorative graphics are hidden from assistive technology.</li>
        <li>Form fields have persistent, programmatically associated labels — not placeholder-only labelling.</li>
        <li>Status messages (search results, form errors) are announced via ARIA live regions.</li>
        <li>Filters, toggles and accordions expose their state with <code>aria-pressed</code> and <code>aria-expanded</code>.</li>
        <li>Full keyboard operability, including the map controls and every filter.</li>
        <li><code>prefers-reduced-motion</code> is respected — animation and smooth scrolling are disabled for users who ask for that.</li>
        <li>Text reflows without horizontal scrolling down to narrow viewports and supports browser zoom.</li>
      </ul>

      <h2>Known limitations</h2>
      <p>We would rather name these than imply the site is perfect:</p>
      <ul>
        <li>
          <strong>The interactive map.</strong> Map interfaces are difficult to make fully equivalent for screen
          reader users. Every place on the map is therefore also published as a keyboard-navigable list with the
          same information and links, and every page that uses the map offers the same data in text form.
        </li>
        <li>
          <strong>Third-party listing content.</strong> Photographs and descriptions delivered through the MLS IDX
          feed are authored by other brokerages. We cannot edit their alternative text, so we generate descriptive
          alt text from the property address rather than leaving it empty.
        </li>
        <li>
          <strong>External links.</strong> Sites we link to — schools, restaurants, government agencies — have their
          own accessibility standards that we do not control.
        </li>
      </ul>

      <h2>Tell us about a barrier</h2>
      <p>
        If any part of this site prevents you from getting information you need, we want to hear about it and we
        will fix it. Contact {'{'}agent.fullName{'}'} at {'{'}show(brokerage.registeredName, brokerage.tradeName){'}'}:
      </p>
      <ul>
        {email && <li>Email: <a href={`mailto:${email}`}>{email}</a></li>}
        {phone && <li>Phone: <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a></li>}
      </ul>
      <p>
        Please tell us the page, what you were trying to do, and the assistive technology you were using. We aim to
        respond within five business days, and we will provide the information you were after in an alternative
        format in the meantime.
      </p>
    </LegalPage>
  );
}
