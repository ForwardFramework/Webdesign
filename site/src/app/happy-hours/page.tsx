import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Section, Breadcrumbs, JsonLd, SourceList } from '@/components/ui';
import { HappyHourBoard } from '@/components/HappyHourBoard';
import { HAPPY_HOURS, HAPPY_HOUR_DISCLAIMER } from '@/data/happy-hours';
import { pageMeta, breadcrumbLd, faqLd } from '@/lib/seo';
import { imgSrc, imgAlt } from '@/config/images';

export const metadata: Metadata = pageMeta({
  title: 'Lakewood Ranch Happy Hours by Day — Main Street & Waterside',
  description:
    'Every confirmed happy hour in Lakewood Ranch and Waterside Place, sorted by day of the week. Ed’s Tavern, GROVE, Libby’s, Allswell, Agave Bandido and more — with the date each was last checked.',
  path: '/happy-hours',
  keywords: [
    'Lakewood Ranch happy hour', 'happy hour Lakewood Ranch FL', 'Main Street Lakewood Ranch happy hour',
    'Waterside Place happy hour', 'Lakewood Ranch restaurants', 'Sarasota happy hour',
  ],
});

const CRUMBS = [{ name: 'Home', href: '/' }, { name: 'Happy hours', href: '/happy-hours' }];

export default function HappyHoursPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-gulf-900">
        <Image src={imgSrc('happyHour')} alt={imgAlt('happyHour')} fill sizes="100vw" priority className="object-cover opacity-40" />
        <Container className="relative py-16 sm:py-20">
          <Breadcrumbs items={CRUMBS} />
          <h1 className="mt-5 max-w-3xl text-display-md font-semibold text-white">
            Happy hour, sorted by the day you need one.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gulf-100" data-speakable>
            {HAPPY_HOURS.length} confirmed happy hours across Main Street, Waterside Place and the wider
            Lakewood Ranch area — with what is actually on the deal list, and the date each one was last checked.
          </p>
        </Container>
      </section>

      <Section tone="shell">
        <Container>
          <div className="mb-8 rounded-2xl border border-sunset-200 bg-sunset-100 p-5">
            <p className="text-sm leading-relaxed text-ink-soft">
              <strong className="text-sunset-600">Before you drive:</strong> {HAPPY_HOUR_DISCLAIMER}
            </p>
          </div>

          <HappyHourBoard />

          <div className="mt-12 rounded-3xl border border-ink/10 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-gulf-900">Know one we&rsquo;ve missed?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
              This list is maintained by hand, on purpose — scraped happy-hour data is wrong more often than it is
              right. If a window has changed or a venue is missing, say so and it gets fixed.
            </p>
            <SourceList ids={['edsTavern', 'allswell', 'watersideHappyHour', 'lwrWaterside']} />
          </div>
        </Container>
      </Section>

      <JsonLd data={[breadcrumbLd(CRUMBS), faqLd(['happy-hour', 'things-to-do'])]} />
    </>
  );
}
