'use client';

import { useMemo, useState } from 'react';
import { DAYS, type DayOfWeek } from '@/data/types';
import { HAPPY_HOURS, UNCONFIRMED_VENUES } from '@/data/happy-hours';
import { ConfidenceBadge, Pill } from './ui';

const todayKey = (): DayOfWeek => (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as DayOfWeek[])[new Date().getDay()];

export function HappyHourBoard() {
  const [day, setDay] = useState<DayOfWeek | 'all'>(todayKey());
  const [district, setDistrict] = useState<string>('all');

  const districts = useMemo(
    () => ['all', ...Array.from(new Set(HAPPY_HOURS.map((h) => h.district)))],
    []
  );

  const rows = useMemo(
    () =>
      HAPPY_HOURS.filter((h) => (day === 'all' || h.days.includes(day)) && (district === 'all' || h.district === district)),
    [day, district]
  );

  const dayLabel = day === 'all' ? 'any day' : DAYS.find((d) => d.key === day)?.long;

  return (
    <div>
      {/* Day picker */}
      <div className="card p-5">
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Which day?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setDay(d.key)}
                aria-pressed={day === d.key}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                  day === d.key ? 'bg-gulf-700 text-white shadow-card' : 'bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-gulf-50'
                }`}
              >
                {d.short}
                {d.key === todayKey() && <span className="ml-1.5 text-[0.6rem] uppercase opacity-70">today</span>}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDay('all')}
              aria-pressed={day === 'all'}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                day === 'all' ? 'bg-gulf-700 text-white shadow-card' : 'bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-gulf-50'
              }`}
            >
              Every day
            </button>
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Where?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {districts.map((d) => (
              <button key={d} type="button" onClick={() => setDistrict(d)} aria-pressed={district === d} className={`chip ${district === d ? 'chip-active' : ''}`}>
                {d === 'all' ? 'Everywhere' : d}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* A heading, not a paragraph: the venue cards below are h3s, so without
          an h2 here the document outline jumps h1 → h3. */}
      <h2 className="mt-6 font-sans text-sm font-normal text-ink-soft" role="status" aria-live="polite">
        <strong className="font-semibold text-gulf-900">{rows.length}</strong> happy hour{rows.length === 1 ? '' : 's'} on {dayLabel}
      </h2>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-ink/20 p-10 text-center">
          <p className="font-display text-lg font-semibold text-gulf-900">Nothing confirmed for {dayLabel} in that area.</p>
          <p className="mt-2 text-sm text-ink-soft">Try &ldquo;Everywhere&rdquo;, or check the venues below that we are still confirming.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {rows.map((h) => (
            <article key={h.id} className="card card-hover flex flex-col p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-gulf-900">{h.venue}</h3>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">{h.district}</p>
                </div>
                {h.vibe && <Pill className="shrink-0 capitalize">{h.vibe}</Pill>}
              </div>

              <p className="mt-4 font-display text-lg font-semibold text-coral-600">{h.window}</p>
              <p className="mt-1 text-xs text-ink-muted">
                {h.days.map((d) => DAYS.find((x) => x.key === d)?.short).join(' · ')}
              </p>

              <ul className="mt-4 flex-1 space-y-1.5">
                {h.deals.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral-400" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-4">
                <ConfidenceBadge level={h.confidence} date={h.verifiedOn} />
                <div className="flex gap-3 text-xs font-semibold">
                  {h.website && (
                    <a href={h.website} target="_blank" rel="noopener noreferrer nofollow" className="text-gulf-700 underline underline-offset-2">
                      Menu
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.venue}, ${h.city}, FL`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gulf-700 underline underline-offset-2"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Honest list of what we could not confirm */}
      <div className="mt-12 rounded-3xl border border-sand-300 bg-sand-50 p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-gulf-900">
          Runs a happy hour — window not confirmed
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          These venues advertise a happy hour, but we could not find a current published day-and-time at the point
          of checking. Rather than guess at one and send you out for a deal that might not exist, here they are
          with a link to the source of truth.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {UNCONFIRMED_VENUES.map((v) => (
            <li key={v.venue} className="rounded-2xl bg-white p-4">
              <p className="font-semibold text-gulf-900">
                {v.website ? (
                  <a href={v.website} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2">{v.venue}</a>
                ) : (
                  v.venue
                )}
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">{v.district} · {v.cuisine}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
