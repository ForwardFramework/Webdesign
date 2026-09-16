'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PLACES, googleDirectionsUrl } from '@/data/places';
import { VILLAGES } from '@/data/villages';
import { HAPPY_HOURS } from '@/data/happy-hours';
import { SCHOOLS } from '@/data/schools';
import { PLACE_CATEGORIES, type PlaceCategory } from '@/data/types';
import { estimateDrive } from '@/lib/drive-times';

/** Layer definitions — label, colour and icon glyph per category. */
const LAYERS: Record<PlaceCategory | 'village' | 'happyhour', { label: string; color: string; glyph: string }> = {
  beach:      { label: 'Beaches',            color: '#F2B33C', glyph: '🏖' },
  park:       { label: 'Parks & preserves',  color: '#3E9F9B', glyph: '🌳' },
  school:     { label: 'Schools',            color: '#22827F', glyph: '🎓' },
  dining:     { label: 'Dining',             color: '#E85C34', glyph: '🍽' },
  happyhour:  { label: 'Happy hours',        color: '#F97650', glyph: '🍹' },
  grocery:    { label: 'Groceries',          color: '#166967', glyph: '🛒' },
  health:     { label: 'Doctors & hospitals',color: '#C74724', glyph: '⚕' },
  fitness:    { label: 'Fitness',            color: '#6FBDB9', glyph: '💪' },
  attraction: { label: 'Attractions',        color: '#A17C4F', glyph: '🎭' },
  shopping:   { label: 'Shopping & town centres', color: '#BE9A69', glyph: '🛍' },
  essential:  { label: 'Essentials & admin', color: '#5B7379', glyph: '📋' },
  golf:       { label: 'Golf',               color: '#115352', glyph: '⛳' },
  airport:    { label: 'Airports',           color: '#0A2F2F', glyph: '✈' },
  village:    { label: 'LWR villages',       color: '#E85C34', glyph: '🏡' },
};

type LayerKey = keyof typeof LAYERS;

const DEFAULT_ON: LayerKey[] = ['village', 'beach', 'park', 'school', 'grocery'];

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function ExploreMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const groupsRef = useRef<Partial<Record<LayerKey, LayerGroup>>>({});
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<LayerKey[]>(DEFAULT_ON);
  const [origin, setOrigin] = useState<string>('country-club-east');
  const [search, setSearch] = useState('');

  const originVillage = useMemo(() => VILLAGES.find((v) => v.slug === origin) ?? VILLAGES[0], [origin]);

  /* ── Build the map once ── */
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapEl.current) return;

      const map = L.map(mapEl.current, {
        center: [27.40, -82.50],
        zoom: 11,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Scroll wheel only after a deliberate click — stops the map hijacking page scroll.
      map.on('click', () => map.scrollWheelZoom.enable());
      map.on('mouseout', () => map.scrollWheelZoom.disable());

      const pin = (color: string, glyph: string, big = false) =>
        L.divIcon({
          className: 'lwr-pin',
          html: `<span style="
            display:flex;align-items:center;justify-content:center;
            width:${big ? 34 : 26}px;height:${big ? 34 : 26}px;border-radius:50% 50% 50% 8px;
            transform:rotate(-45deg);background:${color};
            box-shadow:0 3px 10px rgba(12,31,34,.35);border:2px solid rgba(255,255,255,.9);
            font-size:${big ? 15 : 12}px;line-height:1;">
            <span style="transform:rotate(45deg)">${glyph}</span></span>`,
          iconSize: [big ? 34 : 26, big ? 34 : 26],
          iconAnchor: [big ? 17 : 13, big ? 32 : 24],
          popupAnchor: [0, big ? -30 : -22],
        });

      // Place layers
      for (const cat of PLACE_CATEGORIES) {
        // 'school' is built from SCHOOLS below; 'dining' is covered by the happy-hour layer.
        if (cat === 'school') continue;
        const cfg = LAYERS[cat];
        const group = L.layerGroup();
        for (const p of PLACES.filter((x) => x.category === cat)) {
          const d = estimateDrive(originVillage.coords, p.coords);
          const html = `
            <div style="max-width:16rem">
              <p style="margin:0;font-weight:600;font-size:.9rem;color:#0A2F2F">${esc(p.name)}</p>
              ${p.kind ? `<p style="margin:.15rem 0 0;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#5B7379">${esc(p.kind)}</p>` : ''}
              ${p.blurb ? `<p style="margin:.5rem 0 0;font-size:.8rem;line-height:1.5;color:#2A4247">${esc(p.blurb)}</p>` : ''}
              <p style="margin:.6rem 0 0;font-size:.75rem;color:#166967">
                <strong>~${d.minutes} min</strong> · ${d.miles} mi from ${esc(originVillage.name)} <span title="Estimated from mapped distance">*</span>
              </p>
              <p style="margin:.5rem 0 0">
                <a href="${googleDirectionsUrl(p)}" target="_blank" rel="noopener noreferrer"
                   style="font-size:.78rem;color:#115352;font-weight:600">Directions →</a>
                ${p.website ? ` &nbsp;<a href="${esc(p.website)}" target="_blank" rel="noopener noreferrer nofollow" style="font-size:.78rem;color:#115352">Website</a>` : ''}
              </p>
            </div>`;
          L.marker([p.coords.lat, p.coords.lng], { icon: pin(cfg.color, cfg.glyph), title: p.name, alt: p.name })
            .bindPopup(html)
            .addTo(group);
        }
        groupsRef.current[cat] = group;
      }

      // Schools live in their own dataset (they carry ratings and district
      // information that a generic Place record has no room for), so the layer
      // is built from SCHOOLS rather than from PLACES.
      const schoolGroup = L.layerGroup();
      for (const sc of SCHOOLS) {
        const rating = sc.gsRating != null ? `${sc.gsRating}/10 GreatSchools` : 'Rating not confirmed — check current';
        const d = estimateDrive(originVillage.coords, sc.coords);
        const html = `
          <div style="max-width:16rem">
            <p style="margin:0;font-weight:600;font-size:.9rem;color:#0A2F2F">${esc(sc.name)}</p>
            <p style="margin:.15rem 0 0;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#5B7379">${esc(sc.level)} · ${esc(sc.type)} · ${esc(sc.city)}</p>
            <p style="margin:.5rem 0 0;font-size:.82rem;font-weight:600;color:#166967">${esc(rating)}${sc.nicheGrade ? ` · Niche ${esc(sc.nicheGrade)}` : ''}</p>
            ${sc.notes ? `<p style="margin:.45rem 0 0;font-size:.78rem;line-height:1.5;color:#2A4247">${esc(sc.notes)}</p>` : ''}
            <p style="margin:.55rem 0 0;font-size:.75rem;color:#166967"><strong>~${d.minutes} min</strong> · ${d.miles} mi from ${esc(originVillage.name)} *</p>
            <p style="margin:.5rem 0 0;font-size:.68rem;line-height:1.45;color:#5B7379">Attendance boundaries are set by the district and change — confirm the assignment for a specific address.</p>
          </div>`;
        L.marker([sc.coords.lat, sc.coords.lng], { icon: pin(LAYERS.school.color, LAYERS.school.glyph), title: sc.name, alt: sc.name })
          .bindPopup(html)
          .addTo(schoolGroup);
      }
      groupsRef.current.school = schoolGroup;

      // Happy hours
      const hhGroup = L.layerGroup();
      for (const h of HAPPY_HOURS) {
        const days = h.days.map((d) => d[0].toUpperCase() + d.slice(1)).join(', ');
        const html = `
          <div style="max-width:16rem">
            <p style="margin:0;font-weight:600;font-size:.9rem;color:#0A2F2F">${esc(h.venue)}</p>
            <p style="margin:.15rem 0 0;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#5B7379">${esc(h.district)}</p>
            <p style="margin:.5rem 0 0;font-size:.85rem;font-weight:600;color:#E85C34">${esc(h.window)}</p>
            <p style="margin:.2rem 0 0;font-size:.75rem;color:#5B7379">${esc(days)}</p>
            <ul style="margin:.5rem 0 0;padding-left:1rem;font-size:.78rem;line-height:1.5;color:#2A4247">
              ${h.deals.slice(0, 4).map((d) => `<li>${esc(d)}</li>`).join('')}
            </ul>
            <p style="margin:.5rem 0 0;font-size:.68rem;color:#5B7379">Checked ${esc(h.verifiedOn)} — confirm before you go.</p>
          </div>`;
        L.marker([h.coords.lat, h.coords.lng], { icon: pin(LAYERS.happyhour.color, LAYERS.happyhour.glyph), title: h.venue, alt: h.venue })
          .bindPopup(html)
          .addTo(hhGroup);
      }
      groupsRef.current.happyhour = hhGroup;

      // Villages
      const vGroup = L.layerGroup();
      for (const v of VILLAGES) {
        const html = `
          <div style="max-width:16rem">
            <p style="margin:0;font-weight:600;font-size:.9rem;color:#0A2F2F">${esc(v.name)}</p>
            <p style="margin:.15rem 0 0;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#5B7379">${esc(v.area)} · ${esc(v.county)} County</p>
            <p style="margin:.5rem 0 0;font-size:.8rem;line-height:1.5;color:#2A4247">${esc(v.summary.slice(0, 150))}…</p>
            <p style="margin:.55rem 0 0;font-size:.78rem;color:#166967">
              HOA $${v.hoaMonthlyLow}–$${v.hoaMonthlyHigh}/mo · CDD $${v.cddAnnualLow.toLocaleString()}–$${v.cddAnnualHigh.toLocaleString()}/yr
            </p>
            <p style="margin:.5rem 0 0">
              <a href="/villages/${v.slug}" style="font-size:.78rem;color:#115352;font-weight:600">Village guide →</a>
            </p>
          </div>`;
        L.marker([v.coords.lat, v.coords.lng], { icon: pin(LAYERS.village.color, LAYERS.village.glyph, true), title: v.name, alt: v.name })
          .bindPopup(html)
          .addTo(vGroup);
      }
      groupsRef.current.village = vGroup;

      for (const key of DEFAULT_ON) groupsRef.current[key]?.addTo(map);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Rebuilt only on mount; origin changes are handled by re-binding popups below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Toggle layers ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    for (const key of Object.keys(LAYERS) as LayerKey[]) {
      const g = groupsRef.current[key];
      if (!g) continue;
      const on = active.includes(key);
      if (on && !map.hasLayer(g)) g.addTo(map);
      if (!on && map.hasLayer(g)) map.removeLayer(g);
    }
  }, [active, ready]);

  /* ── Recentre when the origin village changes ── */
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.flyTo([originVillage.coords.lat, originVillage.coords.lng], 12, { duration: 0.8 });
  }, [originVillage, ready]);

  const toggle = (k: LayerKey) =>
    setActive((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));

  /** The nearest-first list mirrors the map exactly — it is also the accessible
   *  equivalent for anyone who cannot use a map interface, so it must not omit
   *  a layer the map is showing. */
  const visiblePlaces = useMemo(() => {
    type Row = { id: string; name: string; sub: string; category: LayerKey; query: string; minutes: number; miles: number };
    const rows: Row[] = [];

    for (const p of PLACES) {
      if (p.category === 'school' || !active.includes(p.category)) continue;
      const d = estimateDrive(originVillage.coords, p.coords);
      rows.push({ id: p.id, name: p.name, sub: p.kind ?? p.city, category: p.category, query: p.directionsQuery, ...d });
    }

    if (active.includes('school')) {
      for (const sc of SCHOOLS) {
        const d = estimateDrive(originVillage.coords, sc.coords);
        rows.push({ id: sc.id, name: sc.name, sub: `${sc.level} · ${sc.type}`, category: 'school', query: `${sc.name}, ${sc.city}, FL`, ...d });
      }
    }

    if (active.includes('happyhour')) {
      for (const h of HAPPY_HOURS) {
        const d = estimateDrive(originVillage.coords, h.coords);
        rows.push({ id: h.id, name: h.venue, sub: `${h.district} · ${h.window}`, category: 'happyhour', query: `${h.venue}, ${h.city}, FL`, ...d });
      }
    }

    return rows
      .filter((r) => !search || `${r.name} ${r.sub}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.minutes - b.minutes);
  }, [active, originVillage, search]);

  const allKeys = Object.keys(LAYERS) as LayerKey[];

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      {/* ── Controls ── */}
      <div className="space-y-5">
        <div className="card p-5">
          <label htmlFor="map-origin" className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Starting from
          </label>
          <select
            id="map-origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm focus:border-gulf-500 focus:outline-none focus:ring-2 focus:ring-gulf-500/30"
          >
            {VILLAGES.map((v) => (
              <option key={v.slug} value={v.slug}>{v.name}</option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Drive times are measured from this village to everything on the map.
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-gulf-900">Layers</h2>
            <div className="flex gap-2 text-xs">
              <button type="button" onClick={() => setActive(allKeys)} className="font-semibold text-gulf-700 underline underline-offset-2">All</button>
              <button type="button" onClick={() => setActive([])} className="font-semibold text-coral-600 underline underline-offset-2">None</button>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            {allKeys.map((k) => {
              const on = active.includes(k);
              const count =
                k === 'village' ? VILLAGES.length
                : k === 'happyhour' ? HAPPY_HOURS.length
                : k === 'school' ? SCHOOLS.length
                : PLACES.filter((p) => p.category === k).length;
              if (!count) return null;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggle(k)}
                  aria-pressed={on}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    on ? 'bg-gulf-50 text-gulf-900' : 'text-ink-muted hover:bg-ink/5'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] transition-opacity"
                    style={{ background: LAYERS[k].color, opacity: on ? 1 : 0.28 }}
                  >
                    {LAYERS[k].glyph}
                  </span>
                  <span className="flex-1 font-medium">{LAYERS[k].label}</span>
                  <span className="text-xs tabular-nums opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Map + list ── */}
      <div className="space-y-5">
        <div className="card overflow-hidden">
          <div
            ref={mapEl}
            className="h-[28rem] w-full sm:h-[34rem] lg:h-[38rem]"
            role="application"
            aria-label="Interactive map of Lakewood Ranch and the surrounding Gulf Coast area"
          />
          <p className="border-t border-ink/8 bg-sand-50 px-5 py-3 text-xs leading-relaxed text-ink-muted">
            Pins are placed at approximate neighbourhood scale and drive times are estimated from mapped distance —
            use them to compare, not to navigate. Every &ldquo;Directions&rdquo; link resolves the real address.
            Click the map once to enable scroll zoom.
          </p>
        </div>

        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-gulf-900">
              {visiblePlaces.length} place{visiblePlaces.length === 1 ? '' : 's'}, nearest first
            </h2>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter list…"
              aria-label="Filter places"
              className="rounded-xl border border-ink/15 px-3 py-2 text-sm focus:border-gulf-500 focus:outline-none focus:ring-2 focus:ring-gulf-500/30"
            />
          </div>

          {visiblePlaces.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">
              Turn on a layer to see places here.
            </p>
          ) : (
            <ul className="mt-4 max-h-[26rem] divide-y divide-ink/8 overflow-y-auto">
              {visiblePlaces.map((r) => (
                <li key={`${r.category}-${r.id}`} className="flex items-center gap-4 py-3">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs"
                    style={{ background: LAYERS[r.category].color }}
                  >
                    {LAYERS[r.category].glyph}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gulf-900">{r.name}</p>
                    <p className="truncate text-xs text-ink-muted">{r.sub}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-gulf-700">~{r.minutes} min</p>
                    <a
                      href={googleDirectionsUrl({ directionsQuery: r.query })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gulf-600 underline underline-offset-2"
                    >
                      Directions
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
