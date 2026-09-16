'use client';

import { AMENITIES, AMENITY_GROUPS, amenitiesInGroup, type AmenityTag } from '@/data/amenities';

/**
 * Grouped amenity chip picker, shared by the village search and the home
 * search so both offer exactly the same vocabulary.
 *
 * Semantics are AND, not OR: selecting "pickleball" and "dog park" means
 * "must have both". That is what people mean when they list requirements, and
 * OR would quietly return villages missing the thing they care about most.
 * The label states it, because a filter whose logic you have to guess is worse
 * than no filter.
 */
export function AmenityPicker({
  selected,
  onToggle,
  onClear,
  counts,
  idPrefix = 'amenity',
  defaultOpen = false,
}: {
  selected: AmenityTag[];
  onToggle: (tag: AmenityTag) => void;
  onClear: () => void;
  /** How many villages offer each tag, for the count badge. */
  counts?: Record<string, number>;
  idPrefix?: string;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen || selected.length > 0} className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
          Community amenities
          {selected.length > 0 && (
            <span className="ml-1.5 rounded-full bg-gulf-700 px-1.5 py-0.5 text-[0.6rem] text-white">{selected.length}</span>
          )}
        </span>
        <span aria-hidden="true" className="text-ink-muted transition-transform group-open:rotate-180">
          <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </span>
      </summary>

      <p className="mt-2 text-[0.7rem] leading-relaxed text-ink-muted">
        Matches villages that have <strong>all</strong> of what you tick.
        {selected.length > 0 && (
          <>
            {' '}
            <button type="button" onClick={onClear} className="font-semibold text-coral-600 underline underline-offset-2">
              Clear amenities
            </button>
          </>
        )}
      </p>

      <div className="mt-3 space-y-4">
        {AMENITY_GROUPS.map((group) => (
          <fieldset key={group}>
            <legend className="text-[0.65rem] font-semibold uppercase tracking-wider text-gulf-600">{group}</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {amenitiesInGroup(group).map((a) => {
                const on = selected.includes(a.id as AmenityTag);
                const n = counts?.[a.id];
                const disabled = n === 0 && !on;
                return (
                  <button
                    key={a.id}
                    type="button"
                    id={`${idPrefix}-${a.id}`}
                    onClick={() => onToggle(a.id as AmenityTag)}
                    aria-pressed={on}
                    disabled={disabled}
                    title={n === 0 ? `${a.hint} (no villages match your other filters)` : a.hint}
                    className={`chip !gap-1 ${on ? 'chip-active' : ''} ${disabled ? 'opacity-40' : ''}`}
                  >
                    <span aria-hidden="true">{a.icon}</span>
                    <span>{a.label}</span>
                    {n !== undefined && (
                      <span className={`ml-0.5 tabular-nums ${on ? 'text-white/70' : 'text-ink-muted'}`}>{n}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </details>
  );
}

/** Count how many of `villages` offer each amenity tag. */
export function amenityCounts(villages: { amenityTags: AmenityTag[] }[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const a of AMENITIES) out[a.id] = 0;
  for (const v of villages) for (const t of v.amenityTags) out[t] = (out[t] ?? 0) + 1;
  return out;
}

/** A village matches when it has every selected tag. */
export const villageHasAllAmenities = (v: { amenityTags: AmenityTag[] }, selected: AmenityTag[]) =>
  selected.every((t) => v.amenityTags.includes(t));
