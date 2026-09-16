import type { ListingQuery, ListingResult } from '../types';
import { RESO_FIELDS, buildResoFilter, resoOrderBy, mapResoRecord, applyPostFilters } from './reso';

/**
 * MLS Grid — one of the two API routes Stellar MLS offers for IDX.
 * Docs: https://www.stellarmls.com/api-options
 *
 * Requires a three-party agreement between the broker, the vendor and Stellar
 * MLS, plus a Data Consumer account at https://app.mlsgrid.com/register.
 * A "Demo" feed is available without prior approval for development.
 */
const BASE = process.env.MLSGRID_BASE_URL || 'https://api.mlsgrid.com/v2';
/** Stellar MLS's originating system id in MLS Grid. Override via env if yours differs. */
const ORIGINATING = process.env.MLSGRID_ORIGINATING_SYSTEM || 'mfrmls';

export async function fetchMlsGrid(q: ListingQuery): Promise<ListingResult> {
  const token = process.env.MLSGRID_TOKEN;
  if (!token) throw new Error('MLSGRID_TOKEN is not set');

  const limit = Math.min(q.limit ?? 24, 200);
  const params = new URLSearchParams({
    $filter: buildResoFilter(q, ORIGINATING),
    $top: String(limit),
    $skip: String(q.offset ?? 0),
    $orderby: resoOrderBy(q.sort),
    $expand: 'Media',
    $select: RESO_FIELDS,
    $count: 'true',
  });

  const res = await fetch(`${BASE}/Property?${params}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    // IDX rules require reasonably fresh data; 5 minutes is a safe default.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`MLS Grid ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = (await res.json()) as { value?: unknown[]; '@odata.count'?: number };
  const mapped = (json.value ?? []).map((r) => mapResoRecord(r as Record<string, unknown>));
  const filtered = applyPostFilters(mapped, q);

  return {
    listings: filtered,
    total: json['@odata.count'] ?? filtered.length,
    provider: 'mlsgrid',
    isLive: true,
    lastUpdated: filtered[0]?.modificationTimestamp ?? new Date().toISOString(),
  };
}
