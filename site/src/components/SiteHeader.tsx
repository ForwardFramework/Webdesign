'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Brand';
import { agent, brokerage, show } from '@/config/site';

const NAV = [
  {
    label: 'Lakewood Ranch',
    href: '/lakewood-ranch',
    children: [
      { label: 'Community overview', href: '/lakewood-ranch', desc: 'What the Ranch actually is' },
      { label: 'All villages', href: '/villages', desc: '30+ villages compared side by side' },
      { label: 'HOA & CDD costs', href: '/guides/hoa-cdd-decoder', desc: 'Why fees differ so much' },
      { label: 'Schools', href: '/schools', desc: 'Public, charter and private' },
    ],
  },
  {
    label: 'Search Homes',
    href: '/homes',
    children: [
      { label: 'Search all homes', href: '/homes', desc: 'Filter by village, price, features' },
      { label: 'New construction', href: '/new-construction', desc: 'Builders and current incentives' },
      { label: 'Villages A–Z', href: '/villages', desc: 'Start from the neighborhood' },
    ],
  },
  {
    label: 'Explore',
    href: '/explore',
    children: [
      { label: 'Interactive map', href: '/explore', desc: 'Toggle layers, see drive times' },
      { label: 'Happy hours by day', href: '/happy-hours', desc: 'Who pours what, and when' },
      { label: 'Beaches & parks', href: '/beaches', desc: 'Every beach ranked by drive' },
      { label: 'Life on the Gulf Coast', href: '/lifestyle', desc: 'Weather, costs, what it feels like' },
      { label: 'New in town essentials', href: '/essentials', desc: 'Doctors, dentists, groceries, admin' },
    ],
  },
  {
    label: 'Move Here',
    href: '/guides',
    children: [
      { label: 'All free guides', href: '/guides', desc: 'Relocation playbooks' },
      { label: 'Florida relocation', href: '/guides/florida-relocation-playbook', desc: 'Licenses, plates, homestead' },
      { label: 'Enrolling your kids', href: '/guides/enrolling-kids-florida-schools', desc: 'Forms and deadlines' },
      { label: 'FAQ', href: '/faq', desc: '30+ answered questions' },
    ],
  },
  { label: 'About', href: '/about' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const phone = show(agent.phone);
  const firm = show(brokerage.registeredName, brokerage.tradeName);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-ink/8 bg-shell/90 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-page">
        <div className="flex h-[var(--header-h)] items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setMenu(item.label)}
                  onMouseLeave={() => setMenu(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-white hover:text-gulf-800"
                    aria-expanded={menu === item.label}
                  >
                    {item.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true" className="opacity-50">
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </Link>
                  {menu === item.label && (
                    <div className="absolute left-0 top-full w-[19rem] pt-2">
                      <div className="card overflow-hidden p-2">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="block rounded-2xl px-4 py-3 transition-colors hover:bg-gulf-50"
                          >
                            <span className="block text-sm font-semibold text-gulf-800">{c.label}</span>
                            <span className="mt-0.5 block text-xs text-ink-muted">{c.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-white hover:text-gulf-800"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            {/*
              FREC 61J2-10.025(3): the registered brokerage name must sit adjacent
              to the point of contact information. This phone link is a point of
              contact, so the firm name rides with it.
            */}
            {phone && (
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hidden text-right xl:block">
                <span className="block text-sm font-semibold leading-tight text-gulf-800">{phone}</span>
                <span className="block text-[0.65rem] leading-tight text-ink-muted">{firm}</span>
              </a>
            )}
            <Link href="/contact" className="btn-coral btn-sm hidden sm:inline-flex">
              Talk to Caitlin
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
                {open ? (
                  <path d="M2 2l14 10M16 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto bg-shell lg:hidden">
          <nav className="container-page space-y-6 py-8" aria-label="Mobile">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link href={item.href} className="font-display text-xl font-semibold text-gulf-900">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mt-2 space-y-1 border-l-2 border-gulf-100 pl-4">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block py-1.5 text-sm text-ink-soft">{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <Link href="/contact" className="btn-coral w-full">Talk to Caitlin</Link>
            {phone && (
              <p className="pt-2 text-center text-sm text-ink-muted">
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="font-semibold text-gulf-800">{phone}</a>
                <span className="mt-0.5 block text-xs">{firm}</span>
              </p>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
