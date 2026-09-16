import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { pageMeta } from '@/lib/seo';
import { agent, brokerage, site, show } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy',
  description: 'What this site collects, why, who it is shared with, how long it is kept, and how to have it deleted.',
  path: '/privacy',
});

export default function PrivacyPage() {
  const email = show(agent.email);
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 16, 2026"
      lede="Short version: the only personal information this site collects is what you type into a form, it goes to Caitlin so she can reply to you, and it is never sold."
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Information you give us.</strong> When you submit a contact, guide or valuation form: your name
          and email, and optionally your phone number, timeframe, property address and message.
        </li>
        <li>
          <strong>Technical information sent with the form.</strong> The page you submitted from, the time, and
          your browser user-agent string. This is used to route the enquiry and to detect automated spam.
        </li>
        <li>
          <strong>Server logs.</strong> Standard web request logs, including IP address, retained briefly for
          security and abuse prevention (for example, rate-limiting form submissions).
        </li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell your information, and we do not share it with third-party advertisers or lead brokers.</li>
        <li>We do not run behavioral advertising trackers on this site.</li>
        <li>We do not require an account or a login to read anything here. Every guide is published in full.</li>
      </ul>

      <h2>Cookies and storage</h2>
      <p>
        This site sets no advertising or cross-site tracking cookies. If analytics are enabled by the site owner,
        they will be listed here before being switched on, and configured to respect your browser&rsquo;s privacy
        settings. The map loads tiles from OpenStreetMap, which receives the standard request information any web
        request carries.
      </p>

      <h2>Communications and consent</h2>
      <p>
        The consent checkbox on our forms is unticked by default and must be actively selected. It is not a
        condition of any purchase, and you can withdraw it at any time by replying &ldquo;stop&rdquo; to a text,
        clicking unsubscribe in an email, or asking us directly. We keep a record of your consent so we can evidence
        it.
      </p>

      <h2>Who your information reaches</h2>
      <p>
        Your enquiry goes to {agent.fullName} at {show(brokerage.registeredName, brokerage.tradeName)}. It may pass
        through service providers acting on our behalf — an email delivery service and a customer relationship
        management system — which process it only to deliver it to us. Real estate brokerages also have record-keeping
        obligations under Florida law that may require retaining transaction-related records.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Enquiries are retained while there is an active conversation and for a reasonable period afterwards. If you
        ask us to delete your information, we will, except where a record must be retained to meet a legal or
        regulatory obligation.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us what we hold about you, ask for it to be corrected, ask for it to be deleted, or ask us to
        stop contacting you. Email {email ? <a href={`mailto:${email}`}>{email}</a> : 'the address in the site footer'} and
        we will action it. Depending on where you live, you may have additional statutory rights, and we will honour
        those.
      </p>

      <h2>Children</h2>
      <p>This site is not directed at children under 13 and we do not knowingly collect their information.</p>

      <h2>Changes</h2>
      <p>
        If this policy changes materially, the &ldquo;last updated&rdquo; date above changes with it. Contact
        details for privacy questions are in the footer of every page at {site.url.replace(/^https?:\/\//, '')}.
      </p>
    </LegalPage>
  );
}
