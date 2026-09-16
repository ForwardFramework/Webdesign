import Link from 'next/link';
import { Container, Section } from '@/components/ui';

export default function NotFound() {
  return (
    <Section tone="shell">
      <Container>
        <div className="mx-auto max-w-xl py-16 text-center">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 text-display-sm font-semibold text-gulf-900">That page has drifted out with the tide.</h1>
          <p className="mt-4 leading-relaxed text-ink-soft">
            The link may be old, or the page may have moved. Here is where most people are heading:
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/villages" className="btn-primary">All villages</Link>
            <Link href="/homes" className="btn-ghost">Search homes</Link>
            <Link href="/explore" className="btn-ghost">Interactive map</Link>
            <Link href="/guides" className="btn-ghost">Free guides</Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
