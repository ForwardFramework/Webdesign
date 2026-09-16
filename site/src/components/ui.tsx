import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Confidence } from '@/data/types';
import { sourcesFor } from '@/data/sources';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`container-page ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = '',
  id,
  tone = 'shell',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: 'shell' | 'white' | 'gulf' | 'sand';
}) {
  const tones = {
    shell: 'bg-shell text-ink',
    white: 'bg-white text-ink',
    gulf: 'bg-gulf-gradient text-white grain',
    sand: 'bg-shore-gradient text-ink',
  };
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  inverted = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  inverted?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <Eyebrow className={inverted ? 'text-gulf-200' : ''}>{eyebrow}</Eyebrow>}
      <h2 className={`mt-3 text-display-sm font-semibold ${inverted ? 'text-white' : 'text-gulf-900'}`}>{title}</h2>
      {lede && (
        <div className={`mt-4 text-lg leading-relaxed ${inverted ? 'text-gulf-100' : 'text-ink-soft'}`}>{lede}</div>
      )}
    </div>
  );
}

export function Stat({ value, label, sub, inverted = false }: { value: string; label: string; sub?: string; inverted?: boolean }) {
  return (
    <div>
      <div className={`font-display text-4xl font-semibold tracking-tight ${inverted ? 'text-white' : 'text-gulf-800'}`}>
        {value}
      </div>
      <div className={`mt-1 text-sm font-semibold ${inverted ? 'text-gulf-100' : 'text-ink'}`}>{label}</div>
      {sub && <div className={`mt-0.5 text-xs ${inverted ? 'text-gulf-200' : 'text-ink-muted'}`}>{sub}</div>}
    </div>
  );
}

/**
 * Shows how well-corroborated a figure is. Used everywhere a number appears.
 * This is a trust feature, not decoration: it is what lets the site publish
 * useful ranges without implying precision it does not have.
 */
export function ConfidenceBadge({ level, date, className = '' }: { level: Confidence; date?: string; className?: string }) {
  const map: Record<Confidence, { label: string; cls: string; title: string }> = {
    verified: {
      label: 'Verified',
      cls: 'bg-gulf-50 text-gulf-800 border-gulf-200',
      title: 'Taken from an official or primary source listed below.',
    },
    reported: {
      label: 'Reported',
      cls: 'bg-sand-100 text-sand-800 border-sand-300',
      title: 'Consistently reported by multiple secondary sources — worth confirming.',
    },
    estimate: {
      label: 'Estimate',
      cls: 'bg-coral-50 text-coral-700 border-coral-200',
      title: 'A reasoned range, not a confirmed figure. Always verify before relying on it.',
    },
  };
  const m = map[level];
  return (
    <span
      title={m.title}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ${m.cls} ${className}`}
    >
      {m.label}
      {date && <span className="font-normal normal-case tracking-normal opacity-70">· {date}</span>}
    </span>
  );
}

export function SourceList({ ids, className = '' }: { ids?: string[]; className?: string }) {
  const refs = sourcesFor(ids);
  if (!refs.length) return null;
  return (
    <details className={`group mt-4 text-sm ${className}`}>
      <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wider text-gulf-600 hover:text-gulf-800">
        <span className="underline decoration-dotted underline-offset-4">Sources ({refs.length})</span>
      </summary>
      <ul className="mt-3 space-y-1.5 border-l-2 border-gulf-100 pl-4">
        {refs.map((r) => (
          <li key={r.id} className="text-xs leading-relaxed text-ink-muted">
            <a href={r.url} target="_blank" rel="noopener noreferrer nofollow" className="text-gulf-700 underline underline-offset-2">
              {r.label}
            </a>
            <span className="ml-1 opacity-70">· checked {r.retrieved}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function Callout({
  tone = 'tip',
  title,
  children,
}: {
  tone?: 'tip' | 'warning' | 'money';
  title: string;
  children: ReactNode;
}) {
  const tones = {
    tip: { wrap: 'border-gulf-200 bg-gulf-50', head: 'text-gulf-800', icon: '💡' },
    warning: { wrap: 'border-coral-200 bg-coral-50', head: 'text-coral-700', icon: '⚠️' },
    money: { wrap: 'border-sunset-200 bg-sunset-100', head: 'text-sunset-600', icon: '💰' },
  }[tone];
  return (
    <div className={`my-6 rounded-2xl border-l-4 border-y border-r ${tones.wrap} p-5`}>
      <p className={`flex items-center gap-2 font-display text-base font-semibold ${tones.head}`}>
        <span aria-hidden="true">{tones.icon}</span>
        {title}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-gulf-50 px-2.5 py-1 text-xs font-medium text-gulf-700 ${className}`}>
      {children}
    </span>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="opacity-40">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-ink-soft">{it.name}</span>
            ) : (
              <Link href={it.href} className="hover:text-gulf-700 hover:underline underline-offset-2">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Renders a JSON-LD block. Kept as its own component so every page emits it consistently. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from our own typed objects, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export const money = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M` : `$${Math.round(n / 1000)}K`;

export const moneyFull = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
