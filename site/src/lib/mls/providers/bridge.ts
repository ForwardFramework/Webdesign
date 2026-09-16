import type { ListingQuery, ListingResult } from '../types';
import { RESO_FIELDS, buildResoFilter, resoOrderBy, mapResoRecord, applyPostFilters } from './reso';

/**
 * Bridge Interactive (Zillow Group) — the other API route Stellar MLS offers.
 * Docs: https://bridgedataoutput.com/docs/platform/
 */
const BASE = process.env.BRIDGE_BASE_URL || 'https://api.bridgedataoutput.com/api/v2/OData';

export async function fetchBridge(q: ListingQuery): Promise<ListingResult> {
  const token = process.env.BRIDGE_ACCESS_TOKEN;
  const dataset = process.env.BRIDGE_DATASET;
  if (!token || !dataset) throw new Error('BRIDGE_ACCESS_TOKEN or BRIDGE_DATASET is not set');

  const limit = Math.min(q.limit ?? 24, 200);
  const params = new URLSearchParams({
    access_token: token,
    $filter: buildResoFilter(q),
    $top: String(limit),
    $skip: String(q.offset ?? 0),
    $orderby: resoOrderBy(q.sort),
    $select: RESO_FIELDS,
    $count: 'true',
  });

  const res = await fetch(`${BASE}/${encodeURIComponent(dataset)}/Property?${params}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Bridge ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = (await res.json()) as { value?: unknown[]; '@odata.count'?: number };
  const mapped = (json.value ?? []).map((r) => mapResoRecord(r as Record<string, unknown>));
  const filtered = applyPostFilters(mapped, q);

  return {
    listings: filtered,
    total: json['@odata.count'] ?? filtered.length,
    provider: 'bridge',
    isLive: true,
    lastUpdated: filtered[0]?.modificationTimestamp ?? new Date().toISOString(),
  };
}
