'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Village } from '@/data/types';
import { money, Pill, ConfidenceBadge } from './ui';

type SortKey = 'price-asc' | 'price-desc' | 'hoa-asc' | 'cdd-asc' | 'name';

const AREAS = [
  'Original Villages',
  'Country Club & Central',
  'Northeast (SR 70 corridor)',
  'Waterside (Sarasota County)',
  '55+ Active Adult',
  'Southeast Expansion',
] as const;

const PRICE_BANDS = [
  { label: 'Under $500K', min: 0, max: 500_000 },
  { label: '$500K–$750K', min: 500_000, max: 750_000 },
  { label: '$750K–$1M', min: 750_000, max: 1_000_000 },
  { label: '$1M+', min: 1_000_000, max: Infinity },
];

export function VillageExplorer({ villages }: { villages: Village[] }) {
  const [areas, setAreas] = useState<string[]>([]);
  const [bands, setBands] = useState<number[]>([]);
  const [gated, setGated] = useState(false);
  const [selling, setSelling] = useState(false);
  const [age55, setAge55] = useState(false);
  const [maxHoa, setMaxHoa] = useState<number>(1500);
  const [sort, setSort] = useState<SortKey>('price-asc');
  const [q, setQ] = useState('');

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    let out = villages.filter((v) => {
      if (areas.length && !areas.includes(v.area)) return false;
      if (gated && !v.gated) return false;
      if (selling && v.status !== 'selling') return false;
      if (age55 && !v.ageRestricted) return false;
      if (v.hoaMonthlyLow > maxHoa) return false;
      if (bands.length) {
        const hit = bands.some((i) => {
          const b = PRICE_BANDS[i];
          return v.priceLow <= b.max && v.priceHigh >= b.min;
        });
        if (!hit) return false;
      }
      if (q) {
        const hay = `${v.name} ${v.area} ${v.builders.join(' ')} ${v.amenities.join(' ')} ${v.bestFor.join(' ')}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });

    out = [...out].sort((a, b) => {
      switch (sort) {
        case 'price-desc': return b.priceHigh - a.priceHigh;
        case 'hoa-asc': return a.hoaMonthlyLow - b.hoaMonthlyLow;
        case 'cdd-asc': return a.cddAnnualLow - b.cddAnnualLow;
        case 'name': return a.name.localeCompare(b.name);
        default: return a.priceLow - b.priceLow;
      }
    });
    return out;
  }, [villages, areas, bands, gated, selling, age55, maxHoa, sort, q]);

  const reset = () => {
    setAreas([]); setBands([]); setGated(false); setSelling(false); setAge55(false); setMaxHoa(1500); setQ('');
  };

  const active = areas.length + bands.length + (gated ? 1 : 0) + (selling ? 1 : 0) + (age55 ? 1 : 0) + (maxHoa < 1500 ? 1 : 0) + (q ? 1 : 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      {/* ── Filters ── */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-gulf-900">Narrow it down</h2>
            {active > 0 && (
              <button type="button" onClick={reset} className="text-xs font-semibold text-coral-600 underline underline-offset-2">
                Clear ({active})
              </button>
            )}
          </div>

          <div className="mt-5">
            <label htmlFor="village-q" className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Search</label>
            <input
              id="village-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Golf, pickleball, Pulte…"
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-3 py-2 text-sm focus:border-gulf-500 focus:outline-none focus:ring-2 focus:ring-gulf-500/30"
            />
          </div>

          <fieldset className="mt-6">
            <legend className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Area of the Ranch</legend>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {AREAS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggle(areas, a, setAreas)}
                  aria-pressed={areas.includes(a)}
                  className={`chip ${areas.includes(a) ? 'chip-active' : ''}`}
                >
                  {a.replace(' (SR 70 corridor)', '').replace(' (Sarasota County)', '')}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Price range</legend>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {PRICE_BANDS.map((b, i) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => toggle(bands, i, setBands)}
                  aria-pressed={bands.includes(i)}
                  className={`chip ${bands.includes(i) ? 'chip-active' : ''}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Must have</legend>
            <div className="mt-2.5 space-y-2">
              {([
                ['Gated', gated, setGated],
                ['New construction available', selling, setSelling],
                ['55+ active adult', age55, setAge55],
              ] as const).map(([label, val, set]) => (
                <label key={label} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => set(e.target.checked)}
                    className="h-4 w-4 rounded border-ink/25 text-gulf-700 focus:ring-gulf-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6">
            <label htmlFor="hoa-max" className="flex items-baseline justify-between text-xs font-semibold uppercase tracking-wider text-ink-soft">
              <span>Max HOA</span>
              <span className="font-sans text-sm font-bold normal-case tracking-normal text-gulf-700">
                {maxHoa >= 1500 ? 'Any' : `$${maxHoa}/mo`}
              </span>
            </label>
            <input
              id="hoa-max"
              type="range"
              min={0}
              max={1500}
              step={50}
              value={maxHoa}
              onChange={(e) => setMaxHoa(Number(e.target.value))}
              className="mt-2 w-full accent-gulf-700"
            />
            <p className="mt-1 text-[0.7rem] leading-relaxed text-ink-muted">
              Matches villages whose typical range starts at or below this. HOA excludes CDD.
            </p>
          </div>
        </div>
      </aside>

      {/* ── Results ── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink-soft" role="status" aria-live="polite">
            <strong className="font-semibold text-gulf-900">{filtered.length}</strong> of {villages.length} villages
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-ink-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm focus:border-gulf-500 focus:outline-none focus:ring-2 focus:ring-gulf-500/30"
            >
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="hoa-asc">Lowest HOA</option>
              <option value="cdd-asc">Lowest CDD</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-ink/20 p-12 text-center">
            <p className="font-display text-xl font-semibold text-gulf-900">No villages match all of that.</p>
            <p className="mt-2 text-sm text-ink-soft">Try loosening the HOA ceiling or clearing an area filter.</p>
            <button type="button" onClick={reset} className="btn-ghost mt-5">Clear filters</button>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {filtered.map((v) => (
              <article key={v.slug} className="card card-hover p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-gulf-900">
                      <Link href={`/villages/${v.slug}`} className="hover:text-gulf-600">{v.name}</Link>
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">
                      {v.area} · {v.county} County · {v.zip}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {v.gated && <Pill>Gated</Pill>}
                    {v.ageRestricted && <Pill className="bg-sunset-100 text-sunset-600">55+</Pill>}
                    {v.status === 'selling' && <Pill className="bg-coral-50 text-coral-700">Selling now</Pill>}
                    {v.status === 'coming-soon' && <Pill className="bg-sand-100 text-sand-800">Coming soon</Pill>}
                  </div>
                </div>

                <p className="mt-3 leading-relaxed text-ink-soft">{v.summary}</p>

                <div className="mt-4 rounded-2xl bg-sand-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sand-700">The trade-off</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{v.tradeOff}</p>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-ink/8 pt-4 sm:grid-cols-4">
                  <div>
                    <dt className="text-xs text-ink-muted">Home prices</dt>
                    <dd className="mt-0.5 font-semibold text-gulf-800">{money(v.priceLow)}–{money(v.priceHigh)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">HOA / month</dt>
                    <dd className="mt-0.5 font-semibold text-gulf-800">${v.hoaMonthlyLow}–${v.hoaMonthlyHigh}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">CDD / year</dt>
                    <dd className="mt-0.5 font-semibold text-gulf-800">${v.cddAnnualLow.toLocaleString()}–${v.cddAnnualHigh.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Builders</dt>
                    <dd className="mt-0.5 truncate text-sm font-medium text-gulf-800" title={v.builders.join(', ')}>
                      {v.builders[0]}{v.builders.length > 1 ? ` +${v.builders.length - 1}` : ''}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <ConfidenceBadge level={v.confidence} date={v.verifiedOn} />
                  <div className="flex gap-2">
                    <Link href={`/homes?villages=${v.slug}`} className="btn-ghost btn-sm">Homes here</Link>
                    <Link href={`/villages/${v.slug}`} className="btn-primary btn-sm">Village guide</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
