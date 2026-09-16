import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Stat, Eyebrow, JsonLd, money, Pill } from '@/components/ui';
import { WaveEdge } from '@/components/Brand';
import { LeadForm } from '@/components/LeadForm';
import { imgSrc, imgAlt } from '@/config/images';
import { VILLAGES, villageStats } from '@/data/villages';
import { CLIMATE, MARKET, LWR_FACTS, DRIVE_TIMES } from '@/data/lifestyle';
import { HAPPY_HOURS } from '@/data/happy-hours';
import { GUIDES } from '@/data/guides';
import { FAQS } from '@/data/faqs';
import { pageMeta, faqLd } from '@/lib/seo';
import { agent } from '@/config/site';

export const metadata: Metadata = pageMeta({
  title: 'Lakewood Ranch, FL Real Estate — Every Village, School, Beach & Live Home Search',
  description:
    "The complete, sourced guide to living in Lakewood Ranch, Sarasota and Bradenton: all 30+ villages with HOA and CDD costs, school ratings, happy hours by day, beaches and drive times — plus live MLS home search with REALTOR® Caitlin Hoffman.",
  path: '/',
  keywords: [
    'Lakewood Ranch real estate', 'Lakewood Ranch FL homes for sale', 'Lakewood Ranch villages',
    'moving to Lakewood Ranch', 'Sarasota real estate', 'Bradenton homes for sale',
    'Lakewood Ranch HOA fees', 'Lakewood Ranch CDD fees', 'Lakewood Ranch new construction',
    'Lakewood Ranch schools', 'relocating to Florida',
  ],
});

const FEATURED = ['country-club-east', 'wild-blue', 'star-farms', 'lorraine-lakes', 'the-lake-club', 'del-webb-lakewood-ranch'];
const HOME_FAQ_IDS = ['what-is-lwr', 'hoa-vs-cdd', 'median-price', 'closest-beach', 'lwr-schools-good', 'weather'];

export default function HomePage() {
  const featured = FEATURED.map((s) => VILLAGES.find((v) => v.slug === s)!).filter(Boolean);
  const beachDrives = DRIVE_TIMES.destinations.filter((d) => /Beach|Island|Armands|Key/.test(d.name));

  return (
    <>
      {/* ───────────────────────────── HERO ───────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-gulf-950">
        <Image
          src={imgSrc('hero')}
          alt={imgAlt('hero')}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gulf-950/75 via-gulf-950/45 to-gulf-950/90" />
        <div className="absolute inset-0 grain opacity-60" />

        <Container className="relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl animate-fade-up">
            <Eyebrow className="text-sunset-300">
              Lakewood Ranch · Sarasota · Bradenton · Tampa Bay
            </Eyebrow>
            <h1 className="mt-4 text-display-lg font-semibold text-white">
              The Gulf Coast,{' '}
              <span className="bg-sunset-gradient bg-clip-text text-transparent">completely explained.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gulf-50 sm:text-xl" data-speakable>
              Every one of Lakewood Ranch&rsquo;s {villageStats.count}+ villages, with real HOA and CDD numbers.
              School ratings. Happy hours by day of the week. Drive times to every beach. Live MLS search.
              All of it sourced, dated, and free — because you should be able to decide before anyone calls you.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/homes" className="btn-coral">Search live listings</Link>
              <Link href="/villages" className="btn-ghost">Compare all {villageStats.count} villages</Link>
              <Link href="/explore" className="btn-ghost">Open the map</Link>
            </div>

            <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              <div>
                <dt className="sr-only">National ranking</dt>
                <dd><Stat inverted value={`#${MARKET.nationalRankMultigen}`} label="in the U.S." sub={`${MARKET.consecutiveYearsNo1Multigen} years running, multi-gen`} /></dd>
              </div>
              <div>
                <dt className="sr-only">Villages</dt>
                <dd><Stat inverted value={`${villageStats.count}+`} label="villages" sub={`${money(villageStats.minPrice)}–${money(villageStats.maxPrice)}`} /></dd>
              </div>
              <div>
                <dt className="sr-only">Trails</dt>
                <dd><Stat inverted value={`${LWR_FACTS.trailMiles}`} label="miles of trail" sub={`${LWR_FACTS.greenspaceAcres.toLocaleString()} acres of green`} /></dd>
              </div>
              <div>
                <dt className="sr-only">Sunshine</dt>
                <dd><Stat inverted value="~3,300" label="hours of sun" sub="per year, Sarasota" /></dd>
              </div>
            </dl>
          </div>
        </Container>
        <WaveEdge className="absolute bottom-0 left-0 text-shell" fill="#FBF8F3" />
      </section>

      {/* ─────────────────────── WHAT THIS SITE IS ─────────────────────── */}
      <Section tone="shell">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Start here"
                title="Most agent sites ask for your number first. This one answers your questions first."
                lede={
                  <>
                    Choosing between {villageStats.count}+ villages is genuinely hard — they differ by hundreds of
                    dollars a month in carrying cost, by school assignment, by build-out timeline, and by whether
                    the amenity you are paying for is one you will ever use. So everything is on the page: the
                    numbers, the trade-offs, and where each figure came from.
                  </>
                }
              />
              <ul className="mt-8 space-y-4">
                {[
                  ['Real cost, not list price', 'Every village shows its typical HOA range, its CDD range, and why they differ — because two $650K homes can be $900/month apart.'],
                  ['An honest trade-off on every village', 'Each one names a genuine drawback. A page with only upside is an advert, and you can already tell the difference.'],
                  ['Dated and sourced', 'Numbers carry a "checked on" date and a link. Anything we could not confirm is labelled an estimate rather than dressed up as fact.'],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-4">
                    <span aria-hidden="true" className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gulf-700 text-xs text-white">✓</span>
                    <div>
                      <p className="font-semibold text-gulf-900">{t}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-4xl shadow-lift">
              <Image src={imgSrc('townCenter')} alt={imgAlt('townCenter')} width={900} height={600} className="h-full w-full object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gulf-950/85 to-transparent p-6 pt-16">
                <p className="text-sm font-semibold text-white">Waterside Place</p>
                <p className="mt-0.5 text-xs text-gulf-100">Lakefront dining, Sunday farmers market, and a dock so neighbours arrive by kayak.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ───────────────────────────── VILLAGES ───────────────────────────── */}
      <Section tone="white">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="The villages"
              title="Thirty-plus neighbourhoods. Wildly different lives."
              lede="From 1990s resale under $400K to custom estates past $6M — and the monthly cost of holding them varies even more than the price."
            />
            <Link href="/villages" className="btn-ghost shrink-0">See all {villageStats.count} →</Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <Link key={v.slug} href={`/villages/${v.slug}`} className="card card-hover group flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-gulf-900 group-hover:text-gulf-700">{v.name}</h3>
                  {v.status === 'selling' && <Pill className="shrink-0 bg-coral-50 text-coral-700">Selling</Pill>}
                </div>
                <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">{v.area} · {v.county} County</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">{v.summary}</p>
                <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-ink/8 pt-4 text-xs">
                  <div><dt className="text-ink-muted">Homes</dt><dd className="mt-0.5 font-semibold text-gulf-800">{money(v.priceLow)}–{money(v.priceHigh)}</dd></div>
                  <div><dt className="text-ink-muted">HOA/mo</dt><dd className="mt-0.5 font-semibold text-gulf-800">${v.hoaMonthlyLow}–${v.hoaMonthlyHigh}</dd></div>
                  <div><dt className="text-ink-muted">CDD/yr</dt><dd className="mt-0.5 font-semibold text-gulf-800">${(v.cddAnnualLow / 1000).toFixed(1)}–{(v.cddAnnualHigh / 1000).toFixed(1)}K</dd></div>
                </dl>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─────────────────────── SEARCH + MAP SPLIT ─────────────────────── */}
      <Section tone="gulf">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-4xl bg-white/10 p-8 backdrop-blur-sm ring-1 ring-white/15">
              <Eyebrow className="text-gulf-200">Live MLS search</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white">Filter by village, not by ZIP code.</h2>
              <p className="mt-4 leading-relaxed text-gulf-100">
                Every other portal makes you draw a shape on a map and hope. Here you tick the villages you
                actually care about — Wild Blue, Star Farms, Country Club East — and filter on the things that
                matter locally: HOA ceiling, new construction, pool, waterfront.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/homes" className="btn-coral">Search homes</Link>
                <Link href="/new-construction" className="btn-ghost !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">New construction</Link>
              </div>
            </div>

            <div className="rounded-4xl bg-white/10 p-8 backdrop-blur-sm ring-1 ring-white/15">
              <Eyebrow className="text-gulf-200">Interactive map</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white">Toggle a layer. See your actual life.</h2>
              <p className="mt-4 leading-relaxed text-gulf-100">
                Beaches, schools, parks, groceries, doctors, happy hours, golf, airports — switch each layer on
                and off, pick a village as your starting point, and get the drive time to everything that matters.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {['Beaches', 'Schools', 'Parks', 'Groceries', 'Doctors', 'Happy hours'].map((l) => (
                  <span key={l} className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white">{l}</span>
                ))}
              </div>
              <Link href="/explore" className="btn-ghost !border-white/30 !bg-white/10 !text-white hover:!bg-white/20 mt-7">Open the map</Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* ───────────────────────────── BEACHES ───────────────────────────── */}
      <Section tone="shell">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <SectionHeading
                eyebrow="The reason you're looking"
                title="World-class sand, 35 minutes east of the traffic."
                lede="Lakewood Ranch sits inland by design. You get the beaches without the barrier-island insurance premium, the surge zone, or the season-long gridlock outside your door."
              />
              <ul className="mt-8 divide-y divide-ink/8 rounded-3xl border border-ink/8 bg-white">
                {beachDrives.map((d) => (
                  <li key={d.name} className="flex items-center justify-between gap-4 px-5 py-4">
                    <span className="text-sm font-medium text-gulf-900">{d.name}</span>
                    <span className="shrink-0 text-sm text-ink-muted">
                      <strong className="font-semibold text-gulf-700">{d.minutes} min</strong> · {d.miles} mi
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-muted">
                Typical off-peak drives from central Lakewood Ranch. Add time in season (roughly January–April).
              </p>
              <Link href="/beaches" className="btn-ghost mt-6">Every beach, ranked by drive →</Link>
            </div>

            <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
              <Image src={imgSrc('beach')} alt={imgAlt('beach')} width={800} height={600} className="col-span-2 h-64 w-full rounded-3xl object-cover shadow-card sm:h-80" sizes="(max-width: 1024px) 100vw, 50vw" />
              <Image src={imgSrc('island')} alt={imgAlt('island')} width={500} height={400} className="h-44 w-full rounded-3xl object-cover shadow-card" sizes="25vw" />
              <Image src={imgSrc('kayak')} alt={imgAlt('kayak')} width={500} height={400} className="h-44 w-full rounded-3xl object-cover shadow-card" sizes="25vw" />
            </div>
          </div>
        </Container>
      </Section>

      {/* ───────────────────────── HAPPY HOUR TEASER ───────────────────────── */}
      <Section tone="white">
        <Container>
          <div className="overflow-hidden rounded-4xl bg-gulf-900 shadow-lift">
            <div className="grid lg:grid-cols-[1.1fr_1fr]">
              <div className="p-8 sm:p-12">
                <Eyebrow className="text-sunset-300">Happy hour, by day</Eyebrow>
                <h2 className="mt-3 font-display text-display-sm font-semibold text-white">
                  It&rsquo;s Tuesday. Where are you going?
                </h2>
                <p className="mt-4 max-w-lg leading-relaxed text-gulf-100">
                  A running list of Lakewood Ranch and Waterside happy hours, sorted by the day you actually want
                  one. Each entry shows when it was last checked — and we only publish a window we found
                  published, because sending you out for a deal that does not exist is worse than saying we
                  are not sure.
                </p>
                <div className="mt-8 space-y-3">
                  {HAPPY_HOURS.slice(0, 3).map((h) => (
                    <div key={h.id} className="rounded-2xl bg-white/10 px-5 py-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-white">{h.venue}</p>
                        <p className="text-sm font-medium text-sunset-300">{h.window}</p>
                      </div>
                      <p className="mt-1 text-xs text-gulf-200">{h.district} · {h.deals[0]}</p>
                    </div>
                  ))}
                </div>
                <Link href="/happy-hours" className="btn-coral mt-8">See the full list</Link>
              </div>
              <div className="relative min-h-[18rem]">
                <Image src={imgSrc('happyHour')} alt={imgAlt('happyHour')} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ──────────────────── SCHOOLS + NEW CONSTRUCTION ──────────────────── */}
      <Section tone="sand">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card flex flex-col p-8">
              <Eyebrow>Schools</Eyebrow>
              <h2 className="mt-3 font-display text-2xl font-semibold text-gulf-900">A-rated public, charter and private — and the boundary warning nobody gives you.</h2>
              <p className="mt-4 flex-1 leading-relaxed text-ink-soft">
                Lakewood Ranch High holds an A&minus; Niche grade with a reported 97% graduation rate. B.D. Gullett
                Elementary rates 8/10 on GreatSchools. But your assigned school comes from your exact street
                address, set by the district — not by the village name, and not by what a listing says. We say so
                on every page.
              </p>
              <Link href="/schools" className="btn-ghost mt-6 self-start">Schools & ratings →</Link>
            </div>

            <div className="card relative flex flex-col overflow-hidden p-8">
              <Eyebrow>New construction</Eyebrow>
              <h2 className="mt-3 font-display text-2xl font-semibold text-gulf-900">Builder incentives are at multi-year highs. Here&rsquo;s how to read one.</h2>
              <p className="mt-4 flex-1 leading-relaxed text-ink-soft">
                Rate buydowns into the 5s, five-figure closing credits, design allowances. All real — and all
                conditional. We publish the incentive <em>patterns</em> and the date checked rather than a stale
                headline number, then show you which conditions actually cost money.
              </p>
              <Link href="/new-construction" className="btn-ghost mt-6 self-start">Builders & incentives →</Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* ───────────────────────────── WEATHER ───────────────────────────── */}
      <Section tone="white">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="The climate argument"
            title="Twelve months of outside."
            lede={`Highs from ${CLIMATE.months[0].high}°F in January to ${CLIMATE.months[7].high}°F in August, and roughly ${CLIMATE.sunshineHoursLow.toLocaleString()}–${CLIMATE.sunshineHoursHigh.toLocaleString()} hours of sunshine a year.`}
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CLIMATE.months.map((m) => (
              <div key={m.month} className="rounded-2xl border border-ink/8 bg-shell p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{m.month}</p>
                <p className="mt-2 font-display text-2xl font-semibold text-gulf-800">{m.high}°</p>
                <p className="text-xs text-ink-muted">low {m.low}°</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-ink-muted">
            Monthly averages, °F. Checked {CLIMATE.verifiedOn}.{' '}
            <Link href="/lifestyle" className="text-gulf-700 underline underline-offset-2">Full climate & cost of living →</Link>
          </p>
        </Container>
      </Section>

      {/* ───────────────────────── GUIDES / LEAD CAPTURE ───────────────────────── */}
      <Section tone="shell" id="guides">
        <Container>
          <SectionHeading
            eyebrow="Free guides"
            title="Everything you need to actually make the move."
            lede="Published in full on the site — the form gets you the printable checklist version, not the information. Gating facts people need in order to move house would be a strange way to earn trust."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {GUIDES.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-hover flex flex-col p-6">
                  <span aria-hidden="true" className="text-3xl">{g.emoji}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-gulf-900">{g.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{g.promise}</p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gulf-600">{g.readingTime} read →</p>
                </Link>
              ))}
            </div>
            <div className="card h-fit p-8">
              <LeadForm
                variant="guide"
                guideTitle="Lakewood Ranch Relocation Bundle"
                guideSlug="bundle"
                heading="Get the whole bundle"
                sub="All six guides as one printable PDF, plus the village comparison sheet with every HOA and CDD range in a single table."
                cta="Send me the bundle"
                compact
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ───────────────────────────── WHY CAITLIN ───────────────────────────── */}
      <Section tone="gulf">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <Eyebrow className="text-gulf-200">Working together</Eyebrow>
              <h2 className="mt-3 text-display-sm font-semibold text-white">
                The research is free. The part that saves you money is knowing which village is wrong for you.
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-gulf-100">
                <p>
                  A builder&rsquo;s sales agent can only sell you their village, and they work for the builder.
                  A portal will show you every house and none of the context. Neither will tell you that the
                  village you loved carries full CDD debt service, or that the school you moved for is under
                  boundary review.
                </p>
                <p>
                  That is the job. Whether you are buying a resale, negotiating a builder contract, or selling
                  into this market, {agent.firstName} works the details that do not show up in a listing.
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['Buying', 'Village shortlists built around your commute, schools and monthly ceiling.'],
                  ['Building new', 'Register before your first model visit — representation is paid by the builder.'],
                  ['Selling', 'Priced against the village, not the ZIP. Those are very different comps.'],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl bg-white/10 p-4">
                    <p className="font-semibold text-white">{t}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gulf-200">{d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-coral">Start a conversation</Link>
                <Link href="/about" className="btn-ghost !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">About {agent.firstName}</Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-4xl shadow-lift">
              <Image src={imgSrc('home')} alt={imgAlt('home')} width={900} height={640} className="h-full w-full object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
            </div>
          </div>
        </Container>
      </Section>

      {/* ───────────────────────────── FAQ ───────────────────────────── */}
      <Section tone="white">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Straight answers"
            title="The questions everyone asks first"
          />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-ink/8 rounded-3xl border border-ink/8">
            {FAQS.filter((f) => HOME_FAQ_IDS.includes(f.id)).map((f) => (
              <details key={f.id} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-gulf-900">
                  {f.question}
                  <span aria-hidden="true" className="shrink-0 text-gulf-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink-soft">{f.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/faq" className="btn-ghost">All {FAQS.length} questions →</Link>
          </p>
        </Container>
      </Section>

      <JsonLd data={faqLd(HOME_FAQ_IDS)} />
    </>
  );
}
