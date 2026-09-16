import type { ReactNode } from 'react';
import { Container, Section, Breadcrumbs } from './ui';

export function LegalPage({
  title,
  updated,
  lede,
  children,
}: {
  title: string;
  updated: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <Section tone="shell">
      <Container>
        <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: title, href: '#' }]} />
        <div className="mt-6 max-w-prose">
          <h1 className="text-display-sm font-semibold text-gulf-900">{title}</h1>
          <p className="mt-2 text-xs uppercase tracking-wider text-ink-muted">Last updated {updated}</p>
          {lede && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{lede}</p>}
          <div className="prose-coastal mt-8 space-y-6 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gulf-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-gulf-800 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc">
            {children}
          </div>
        </div>
      </Container>
    </Section>
  );
}
