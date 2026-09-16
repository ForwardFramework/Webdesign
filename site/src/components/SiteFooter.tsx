import Link from 'next/link';
import { Logo, EqualHousingLogo, RealtorMark } from './Brand';
import { agent, brokerage, site, legal, idx, show } from '@/config/site';

const COLUMNS = [
  {
    title: 'Lakewood Ranch',
    links: [
      { label: 'Community overview', href: '/lakewood-ranch' },
      { label: 'All villages', href: '/villages' },
      { label: 'New construction', href: '/new-construction' },
      { label: 'Schools', href: '/schools' },
      { label: 'Interactive map', href: '/explore' },
    ],
  },
  {
    title: 'Explore the area',
    links: [
      { label: 'Happy hours by day', href: '/happy-hours' },
      { label: 'Beaches & parks', href: '/beaches' },
      { label: 'Gulf Coast lifestyle', href: '/lifestyle' },
      { label: 'New in town essentials', href: '/essentials' },
      { label: 'Search homes', href: '/homes' },
    ],
  },
  {
    title: 'Moving here',
    links: [
      { label: 'Free relocation guides', href: '/guides' },
      { label: 'Florida relocation playbook', href: '/guides/florida-relocation-playbook' },
      { label: 'Enrolling your kids', href: '/guides/enrolling-kids-florida-schools' },
      { label: 'HOA & CDD decoder', href: '/guides/hoa-cdd-decoder' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Work with Caitlin',
    links: [
      { label: 'About Caitlin', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Sell your home', href: '/sell' },
      { label: 'Relocating from out of state', href: '/contact?intent=relocating' },
    ],
  },
];

export function SiteFooter() {
  const phone = show(agent.phone);
  const email = show(agent.email);
  const license = show(agent.licenseNumber);
  const firmName = show(brokerage.registeredName, brokerage.tradeName);
  const firmLicense = show(brokerage.licenseNumber);
  const street = show(brokerage.street);
  const city = show(brokerage.city);
  const zip = show(brokerage.zip);
  const firmPhone = show(brokerage.phone);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gulf-950 text-gulf-100 grain">
      <div className="container-page py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gulf-200">
              A complete, sourced guide to Lakewood Ranch, Sarasota, Bradenton and Tampa Bay — and honest
              representation for buying, selling and building on Florida&rsquo;s Gulf Coast.
            </p>
            <Link href="/contact" className="btn-coral btn-sm mt-6">Start a conversation</Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-2xs font-semibold uppercase tracking-[0.18em] text-gulf-300">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-gulf-100 transition-colors hover:text-white hover:underline underline-offset-4">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/*
          ── LICENSEE IDENTIFICATION BLOCK ──────────────────────────────────
          Fla. Admin. Code R. 61J2-10.025:
            (1) every ad must contain the licensed name of the brokerage firm;
            (2) the licensee's last name must appear as registered with FREC;
            (3) on a website, the brokerage firm name must be placed adjacent to
                or immediately above/below the point of contact information.
          The contact details and the firm name below are deliberately kept in
          one block so that placement requirement is always satisfied.
        */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="font-display text-lg font-semibold text-white">
                {agent.fullName}
                <span className="ml-2 align-middle text-xs font-sans font-normal uppercase tracking-wider text-gulf-300">
                  REALTOR®
                </span>
              </p>
              {license && <p className="mt-1 text-xs text-gulf-300">Florida Real Estate License #{license}</p>}

              <address className="mt-4 space-y-1 text-sm not-italic text-gulf-100">
                {/* Brokerage name sits immediately above the point-of-contact details. */}
                <p className="font-semibold text-white">{firmName}</p>
                {firmLicense && <p className="text-xs text-gulf-300">Brokerage License #{firmLicense}</p>}
                {(street || city) && (
                  <p>
                    {street}
                    {street && (city || zip) ? ', ' : ''}
                    {city}
                    {city ? ', ' : ''}
                    {brokerage.state} {zip}
                  </p>
                )}
                {phone && (
                  <p>
                    <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:underline underline-offset-4">{phone}</a>
                    {firmPhone && firmPhone !== phone && <span className="text-gulf-300"> · Office {firmPhone}</span>}
                  </p>
                )}
                {email && (
                  <p>
                    <a href={`mailto:${email}`} className="hover:underline underline-offset-4">{email}</a>
                  </p>
                )}
              </address>
              <p className="mt-3 text-xs text-gulf-300">Each office is independently owned and operated.</p>
            </div>

            <div className="flex flex-col items-start gap-4 md:items-end">
              <div className="flex items-center gap-4 text-gulf-200">
                <EqualHousingLogo size={38} />
                <RealtorMark size={32} />
              </div>
              <p className="max-w-xs text-[0.7rem] leading-relaxed text-gulf-300 md:text-right">
                {legal.fairHousing}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3 text-[0.7rem] leading-relaxed text-gulf-400">
          <p><strong className="text-gulf-300">IDX / MLS:</strong> {idx.disclaimer}</p>
          <p><strong className="text-gulf-300">Community data:</strong> {legal.dataDisclaimer}</p>
          <p><strong className="text-gulf-300">Schools:</strong> {legal.schoolDisclaimer}</p>
          <p><strong className="text-gulf-300">Not professional advice:</strong> {legal.notLegalAdvice}</p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-gulf-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {agent.fullName}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/accessibility" className="hover:text-white hover:underline underline-offset-4">Accessibility</Link>
            <Link href="/fair-housing" className="hover:text-white hover:underline underline-offset-4">Fair Housing</Link>
            <Link href="/privacy" className="hover:text-white hover:underline underline-offset-4">Privacy</Link>
            <Link href="/terms" className="hover:text-white hover:underline underline-offset-4">Terms & DMCA</Link>
            <Link href="/sources" className="hover:text-white hover:underline underline-offset-4">Our sources</Link>
          </nav>
        </div>
        <p className="mt-4 text-[0.65rem] text-gulf-500">{site.url.replace(/^https?:\/\//, '')}</p>
      </div>
    </footer>
  );
}
