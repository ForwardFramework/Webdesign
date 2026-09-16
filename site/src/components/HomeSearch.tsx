'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Listing, ListingResult } from '@/lib/mls/types';
import { VILLAGES } from '@/data/villages';
import type { AmenityTag } from '@/data/amenities';
import { AMENITY_BY_ID, AMENITY_DISCLAIMER } from '@/data/amenities';
import { AmenityPicker, amenityCounts, villageHasAllAmenities } from './AmenityPicker';
import { moneyFull, Pill } from './ui';
import { idx } from '@/config/site';

const CITIES = ['Lakewood Ranch', 'Bradenton', 'Sarasota', 'Parrish', 'Palmetto', 'Venice', 'Ellenton'];
const TYPES = ['Single Family Residence', 'Villa', 'Townhouse', 'Condominium'];
const PRICES = [0, 300_000, 400_000, 500_000, 600_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000];

interface Filters {
  villages: string[];
  cities: string[];
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  minSqft: number;
  propertyTypes: string[];
  newConstruction: boolean;
  pool: boolean;
  waterfront: boolean;
  maxHoa: number;
  /** Community amenities. Resolved to a village set — see `effectiveVillages`. */
  amenities: AmenityTag[];
  sort: string;
}

const EMPTY: Filters = {
  villages: [], cities: [], minPrice: 0, maxPrice: 0, minBeds: 0, minBaths: 0, minSqft: 0,
  propertyTypes: [], newConstruction: false, pool: false, waterfront: false, maxHoa: 0,
  amenities: [], sort: 'newest',
};

export function HomeSearch({ initialVillages = [] }: { initialVillages?: string[] }) {
  const [f, setF] = useState<Filters>({ ...EMPTY, villages: initialVillages });
  const [data, setData] = useState<ListingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const PER = 24;

  /**
   * Community amenities belong to the VILLAGE, not to the listing — an MLS feed
   * has no field for "this neighborhood has pickleball". So an amenity
   * selection is resolved to the set of villages that qualify, and the search
   * is scoped to those. If the buyer has also picked villages by name, the two
   * are intersected: picking Wild Blue and "dog park" should not silently add
   * back villages they did not ask for.
   */
  const amenityVillages = useMemo(
    () => (f.amenities.length ? VILLAGES.filter((v) => villageHasAllAmenities(v, f.amenities)).map((v) => v.slug) : null),
    [f.amenities]
  );

  const effectiveVillages = useMemo(() => {
    if (!amenityVillages) return f.villages;
    if (!f.villages.length) return amenityVillages;
    return f.villages.filter((s) => amenityVillages.includes(s));
  }, [amenityVillages, f.villages]);

  /** No village can satisfy the combination — say so rather than querying for it. */
  const impossible = f.amenities.length > 0 && effectiveVillages.length === 0;

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (effectiveVillages.length) p.set('villages', effectiveVillages.join(','));
    if (f.cities.length) p.set('cities', f.cities.join(','));
    if (f.minPrice) p.set('minPrice', String(f.minPrice));
    if (f.maxPrice) p.set('maxPrice', String(f.maxPrice));
    if (f.minBeds) p.set('minBeds', String(f.minBeds));
    if (f.minBaths) p.set('minBaths', String(f.minBaths));
    if (f.minSqft) p.set('minSqft', String(f.minSqft));
    if (f.propertyTypes.length) p.set('propertyTypes', f.propertyTypes.join(','));
    if (f.newConstruction) p.set('newConstruction', 'true');
    if (f.pool) p.set('pool', 'true');
    if (f.waterfront) p.set('waterfront', 'true');
    if (f.maxHoa) p.set('maxHoa', String(f.maxHoa));
    p.set('sort', f.sort);
    p.set('limit', String(PER));
    p.set('offset', String(page * PER));
    return p.toString();
  }, [f, page, effectiveVillages]);

  useEffect(() => {
    let canceled = false;

    // No village satisfies the amenity + village combination, so there is
    // nothing to ask the MLS for. Querying anyway would drop the village
    // filter from the request and return the ENTIRE result set — which reads
    // to the visitor as "your filters found 99 homes" when the honest answer
    // is "nothing matches".
    if (impossible) {
      setData((d) => ({
        listings: [],
        total: 0,
        provider: d?.provider ?? 'sample',
        isLive: d?.isLive ?? false,
        lastUpdated: d?.lastUpdated ?? null,
        notice: d?.notice,
      }));
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/listings?${qs}`)
      .then((r) => r.json())
      .then((json: ListingResult) => !canceled && setData(json))
      .catch(() => !canceled && setData(null))
      .finally(() => !canceled && setLoading(false));
    return () => { canceled = true; };
  }, [qs, impossible]);

  const update = useCallback(<K extends keyof Filters>(k: K, v: Filters[K]) => {
    setPage(0);
    setF((prev) => ({ ...prev, [k]: v }));
  }, []);

  const toggleIn = (k: 'villages' | 'cities' | 'propertyTypes', v: string) =>
    update(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);

  const activeCount =
    f.villages.length + f.cities.length + f.propertyTypes.length + f.amenities.length +
    (f.minPrice ? 1 : 0) + (f.maxPrice ? 1 : 0) + (f.minBeds ? 1 : 0) + (f.minBaths ? 1 : 0) +
    (f.minSqft ? 1 : 0) + (f.newConstruction ? 1 : 0) + (f.pool ? 1 : 0) + (f.waterfront ? 1 : 0) + (f.maxHoa ? 1 : 0);

  const amenityPickerCounts = useMemo(() => {
    const pool = f.villages.length ? VILLAGES.filter((v) => f.villages.includes(v.slug)) : VILLAGES;
    return amenityCounts(pool.filter((v) => villageHasAllAmenities(v, f.amenities)));
  }, [f.villages, f.amenities]);

  const totalPages = data ? Math.ceil(data.total / PER) : 0;
  const selectCls = 'w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm focus:border-gulf-500 focus:outline-none focus:ring-2 focus:ring-gulf-500/30';
  const legendCls = 'text-xs font-semibold uppercase tracking-wider text-ink-soft';

  return (
    <div>
      {/* ── Non-live data banner. Must never be suppressed. ── */}
      {data && !data.isLive && (
        <div role="status" className="mb-8 rounded-3xl border-2 border-sunset-400 bg-sunset-100 p-5 sm:p-6">
          <p className="flex items-center gap-2 font-display text-lg font-semibold text-sunset-600">
            <span aria-hidden="true">⚠️</span> These are sample records, not real listings
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{data.notice}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Nothing shown below is for sale. The search, filters, sorting and village matching are fully built —
            they switch to live {idx.mlsName} inventory the moment an IDX feed is connected.
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
        {/* ── Filters ── */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1`}>
          <div className="card space-y-6 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-gulf-900">Filters</h2>
              {activeCount > 0 && (
                <button type="button" onClick={() => { setF({ ...EMPTY }); setPage(0); }} className="text-xs font-semibold text-coral-600 underline underline-offset-2">
                  Clear ({activeCount})
                </button>
              )}
            </div>

            <fieldset>
              <legend className={legendCls}>Price</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <select aria-label="Minimum price" value={f.minPrice} onChange={(e) => update('minPrice', Number(e.target.value))} className={selectCls}>
                  <option value={0}>No min</option>
                  {PRICES.slice(1).map((p) => <option key={p} value={p}>{moneyFull(p)}</option>)}
                </select>
                <select aria-label="Maximum price" value={f.maxPrice} onChange={(e) => update('maxPrice', Number(e.target.value))} className={selectCls}>
                  <option value={0}>No max</option>
                  {PRICES.slice(1).map((p) => <option key={p} value={p}>{moneyFull(p)}</option>)}
                </select>
              </div>
            </fieldset>

            <fieldset>
              <legend className={legendCls}>Beds & baths</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <select aria-label="Minimum bedrooms" value={f.minBeds} onChange={(e) => update('minBeds', Number(e.target.value))} className={selectCls}>
                  <option value={0}>Any beds</option>
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}+ beds</option>)}
                </select>
                <select aria-label="Minimum bathrooms" value={f.minBaths} onChange={(e) => update('minBaths', Number(e.target.value))} className={selectCls}>
                  <option value={0}>Any baths</option>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ baths</option>)}
                </select>
              </div>
            </fieldset>

            <fieldset>
              <legend className={legendCls}>Lakewood Ranch villages</legend>
              <p className="mt-1 text-[0.7rem] text-ink-muted">The filter no portal gives you.</p>
              <div className="mt-2 max-h-56 space-y-1 overflow-y-auto pr-1">
                {VILLAGES.map((v) => (
                  <label key={v.slug} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1 text-sm text-ink-soft hover:bg-gulf-50">
                    <input
                      type="checkbox"
                      checked={f.villages.includes(v.slug)}
                      onChange={() => toggleIn('villages', v.slug)}
                      className="h-4 w-4 shrink-0 rounded border-ink/25 text-gulf-700 focus:ring-gulf-500"
                    />
                    <span className="truncate">{v.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={legendCls}>Nearby cities</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CITIES.map((c) => (
                  <button key={c} type="button" onClick={() => toggleIn('cities', c)} aria-pressed={f.cities.includes(c)} className={`chip ${f.cities.includes(c) ? 'chip-active' : ''}`}>
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={legendCls}>Property type</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => toggleIn('propertyTypes', t)} aria-pressed={f.propertyTypes.includes(t)} className={`chip ${f.propertyTypes.includes(t) ? 'chip-active' : ''}`}>
                    {t.replace(' Residence', '')}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={legendCls}>Features</legend>
              <div className="mt-2 space-y-2">
                {([
                  ['New construction', 'newConstruction'],
                  ['Private pool', 'pool'],
                  ['Waterfront', 'waterfront'],
                ] as const).map(([label, key]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
                    <input type="checkbox" checked={f[key]} onChange={(e) => update(key, e.target.checked)} className="h-4 w-4 rounded border-ink/25 text-gulf-700 focus:ring-gulf-500" />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="border-t border-ink/8 pt-5">
              <AmenityPicker
                selected={f.amenities}
                counts={amenityPickerCounts}
                onToggle={(t) =>
                  update('amenities', f.amenities.includes(t) ? f.amenities.filter((x) => x !== t) : [...f.amenities, t])
                }
                onClear={() => update('amenities', [])}
                idPrefix="home-amenity"
                defaultOpen
              />
              <p className="mt-3 text-[0.7rem] leading-relaxed text-ink-muted">
                These describe the <strong>neighborhood</strong>, not the individual house — MLS listings carry no
                field for them. Ticking one narrows the search to villages that have it.
                {f.amenities.length > 0 && ` ${AMENITY_DISCLAIMER}`}
              </p>
            </div>

            <fieldset>
              <legend className={legendCls}>Max HOA / month</legend>
              <select aria-label="Maximum HOA" value={f.maxHoa} onChange={(e) => update('maxHoa', Number(e.target.value))} className={`mt-2 ${selectCls}`}>
                <option value={0}>Any</option>
                {[200, 300, 400, 500, 750, 1000].map((n) => <option key={n} value={n}>Under ${n}</option>)}
              </select>
              <p className="mt-1.5 text-[0.7rem] leading-relaxed text-ink-muted">
                HOA only. CDD is billed separately on the tax bill —{' '}
                <Link href="/guides/hoa-cdd-decoder" className="text-gulf-700 underline underline-offset-2">here&rsquo;s why that matters</Link>.
              </p>
            </fieldset>
          </div>
        </aside>

        {/* ── Results ── */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-soft" role="status" aria-live="polite">
                {loading ? 'Searching…' : (
                  <>
                    <strong className="font-semibold text-gulf-900">{data?.total.toLocaleString() ?? 0}</strong>{' '}
                    {data?.total === 1 ? 'home' : 'homes'}
                    {effectiveVillages.length === 1 && ` in ${VILLAGES.find((v) => v.slug === effectiveVillages[0])?.name}`}
                  </>
                )}
              </p>
              {f.amenities.length > 0 && !impossible && (
                <p className="mt-1 text-xs text-ink-muted">
                  {effectiveVillages.length} village{effectiveVillages.length === 1 ? '' : 's'} match{effectiveVillages.length === 1 ? 'es' : ''}{' '}
                  {f.amenities.map((t) => AMENITY_BY_ID[t].label.toLowerCase()).join(' + ')}
                </p>
              )}
              {data?.isLive && data.lastUpdated && (
                <p className="mt-0.5 text-xs text-ink-muted">
                  {idx.mlsName} data last updated {new Date(data.lastUpdated).toLocaleString('en-US')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowFilters((s) => !s)} className="btn-ghost btn-sm lg:hidden">
                {showFilters ? 'Hide' : 'Filters'}{activeCount ? ` (${activeCount})` : ''}
              </button>
              <select aria-label="Sort results" value={f.sort} onChange={(e) => update('sort', e.target.value)} className={`${selectCls} !w-auto`}>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="sqft-desc">Largest</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse overflow-hidden">
                  <div className="h-44 bg-ink/10" />
                  <div className="space-y-2 p-5">
                    <div className="h-5 w-28 rounded bg-ink/10" />
                    <div className="h-3 w-full rounded bg-ink/10" />
                    <div className="h-3 w-2/3 rounded bg-ink/10" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && data && data.listings.length === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-ink/20 p-12 text-center">
              <p className="font-display text-xl font-semibold text-gulf-900">
                {impossible ? 'No village has all of those amenities.' : 'Nothing matches all of that right now.'}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                {impossible ? (
                  <>
                    You ticked {f.amenities.map((t) => AMENITY_BY_ID[t].label.toLowerCase()).join(' + ')}, and no
                    Lakewood Ranch village currently offers that combination. Drop one and the list comes back —
                    or ask Caitlin which village comes closest to what you actually want.
                  </>
                ) : (
                  <>
                    Loosen a filter — or tell Caitlin what you are after and she will watch for it, including
                    the off-market and coming-soon inventory that never reaches a portal.
                  </>
                )}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => { setF({ ...EMPTY }); setPage(0); }} className="btn-ghost">Clear filters</button>
                <Link href="/contact" className="btn-coral">Set up a search</Link>
              </div>
            </div>
          )}

          {!loading && data && data.listings.length > 0 && (
            <>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.listings.map((l) => <ListingCard key={l.id} listing={l} isLive={data.isLive} />)}
              </div>

              {totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
                  <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="btn-ghost btn-sm">
                    ← Previous
                  </button>
                  <span className="text-sm text-ink-soft">Page {page + 1} of {totalPages}</span>
                  <button type="button" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="btn-ghost btn-sm">
                    Next →
                  </button>
                </nav>
              )}
            </>
          )}

          {/* IDX attribution must accompany displayed listing data. */}
          <p className="mt-10 rounded-2xl border border-ink/10 bg-white p-5 text-xs leading-relaxed text-ink-muted">
            {idx.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

function ListingCard({ listing: l, isLive }: { listing: Listing; isLive: boolean }) {
  const village = VILLAGES.find((v) => v.slug === l.villageSlug);
  return (
    <article className="card card-hover overflow-hidden">
      <div className="relative h-44 bg-gulf-100">
        {l.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={l.photos[0]} alt={`${l.address}, ${l.city}`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gulf-gradient text-center text-xs text-gulf-100">
            {isLive ? 'Photo not available' : 'Sample record — no photo'}
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {!isLive && <Pill className="!bg-sunset-400 !text-gulf-950">SAMPLE</Pill>}
          {l.isNewConstruction && <Pill className="!bg-coral-500 !text-white">New build</Pill>}
          {l.status !== 'Active' && <Pill className="!bg-ink/80 !text-white">{l.status}</Pill>}
        </div>
      </div>

      <div className="p-5">
        <p className="font-display text-xl font-semibold text-gulf-900">{moneyFull(l.price)}</p>
        <p className="mt-1 text-sm text-ink-soft">
          {[l.beds && `${l.beds} bd`, l.baths && `${l.baths} ba`, l.sqft && `${l.sqft.toLocaleString()} sqft`].filter(Boolean).join(' · ')}
        </p>
        <p className="mt-2 truncate text-sm font-medium text-ink" title={`${l.address}, ${l.city}`}>{l.address}</p>
        <p className="truncate text-xs text-ink-muted">
          {village ? (
            <Link href={`/villages/${village.slug}`} className="text-gulf-600 underline underline-offset-2">{village.name}</Link>
          ) : (
            l.subdivision
          )}
          {village ? ` · ${l.city}` : `${l.subdivision ? ' · ' : ''}${l.city}`}, {l.state} {l.zip}
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-ink/8 pt-3 text-xs text-ink-muted">
          {l.hoaFee != null && (
            <div className="flex gap-1"><dt>HOA</dt><dd className="font-medium text-ink-soft">${Math.round(l.hoaFee)}{l.hoaFrequency ? `/${l.hoaFrequency.toLowerCase().slice(0, 2)}` : ''}</dd></div>
          )}
          {l.cddFeeAnnual != null && (
            <div className="flex gap-1"><dt>CDD</dt><dd className="font-medium text-ink-soft">${l.cddFeeAnnual.toLocaleString()}/yr</dd></div>
          )}
          {l.yearBuilt && <div className="flex gap-1"><dt>Built</dt><dd className="font-medium text-ink-soft">{l.yearBuilt}</dd></div>}
          {l.daysOnMarket != null && <div className="flex gap-1"><dt>DOM</dt><dd className="font-medium text-ink-soft">{l.daysOnMarket}</dd></div>}
        </dl>

        {/* Required IDX attribution to the listing brokerage. */}
        {l.listOfficeName && (
          <p className="mt-3 truncate text-[0.65rem] text-ink-muted" title={l.listOfficeName}>
            Listed by {l.listOfficeName}
          </p>
        )}
        <p className="mt-1 text-[0.65rem] text-ink-muted">MLS# {l.mlsNumber}</p>

        <Link href={`/contact?listing=${encodeURIComponent(l.mlsNumber)}`} className="btn-ghost btn-sm mt-4 w-full">
          Ask about this home
        </Link>
      </div>
    </article>
  );
}
