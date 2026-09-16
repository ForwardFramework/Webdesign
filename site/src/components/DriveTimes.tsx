'use client';

import { useEffect, useState } from 'react';
import { PLACES, googleDirectionsUrl } from '@/data/places';

const DEFAULT_TARGETS = [
  'main-street-lwr', 'waterside-place', 'utc-mall', 'publix-lwr-town-center',
  'lakewood-ranch-medical-center', 'coquina-beach', 'siesta-key-beach',
  'lido-beach', 'srq-airport', 'tpa-airport', 'nathan-benderson-park', 'myakka-river-state-park',
];

interface Row { id: string; name: string; miles: number; minutes: number; mode: 'live' | 'estimated' }

export function DriveTimes({
  originSlug,
  originLabel,
  targets = DEFAULT_TARGETS,
}: {
  originSlug: string;
  originLabel: string;
  targets?: string[];
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let canceled = false;
    setRows(null);
    setError(false);
    fetch(`/api/drive-times?from=${encodeURIComponent(originSlug)}&to=${targets.join(',')}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('failed'))))
      .then((json: { results: Row[] }) => {
        if (!canceled) setRows(json.results.sort((a, b) => a.minutes - b.minutes));
      })
      .catch(() => !canceled && setError(true));
    return () => { canceled = true; };
  }, [originSlug, targets]);

  const anyEstimated = rows?.some((r) => r.mode === 'estimated');

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ink/8 bg-gulf-50 px-6 py-4">
        <h3 className="font-display text-lg font-semibold text-gulf-900">Drive times from {originLabel}</h3>
        <p className="mt-0.5 text-xs text-ink-muted">Sorted by how long it actually takes.</p>
      </div>

      {error && (
        <p className="px-6 py-8 text-center text-sm text-ink-muted">
          Drive times are unavailable right now. Every place below links straight to directions.
        </p>
      )}

      {!rows && !error && (
        <ul className="divide-y divide-ink/8" aria-busy="true">
          {targets.slice(0, 8).map((t) => (
            <li key={t} className="flex items-center justify-between px-6 py-3.5">
              <span className="h-3.5 w-40 animate-pulse rounded bg-ink/10" />
              <span className="h-3.5 w-16 animate-pulse rounded bg-ink/10" />
            </li>
          ))}
        </ul>
      )}

      {rows && (
        <ul className="divide-y divide-ink/8">
          {rows.map((r) => {
            const place = PLACES.find((p) => p.id === r.id);
            return (
              <li key={r.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gulf-900">{r.name}</p>
                  {place && (
                    <a
                      href={googleDirectionsUrl(place)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gulf-600 underline underline-offset-2 hover:text-gulf-800"
                    >
                      Directions
                    </a>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-gulf-800">
                    {r.minutes} min
                    {r.mode === 'estimated' && <span className="ml-1 text-ink-muted" title="Estimated, not a live route">*</span>}
                  </p>
                  <p className="text-xs text-ink-muted">{r.miles} mi</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {anyEstimated && (
        <p className="border-t border-ink/8 bg-sand-50 px-6 py-3 text-xs leading-relaxed text-ink-muted">
          <strong>*</strong> Estimated from mapped distance, not a live traffic route — treat them as
          &ldquo;about right&rdquo;, not precise. Configure a routing API key to show live, traffic-aware times.
        </p>
      )}
    </div>
  );
}
