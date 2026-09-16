import type { ListingQuery, ListingResult } from './types';
import { fetchMlsGrid } from './providers/mlsgrid';
import { fetchBridge } from './providers/bridge';
import { fetchSimplyRets } from './providers/simplyrets';
import { fetchSample } from './providers/sample';

export type { Listing, ListingQuery, ListingResult } from './types';
export { monthlyHoa } from './providers/reso';

/**
 * Provider selection. Explicit env wins; otherwise the first configured
 * provider is used; otherwise sample data (clearly labelled as such).
 *
 * Set MLS_PROVIDER to one of: mlsgrid | bridge | simplyrets | sample
 */
function pickProvider(): 'mlsgrid' | 'bridge' | 'simplyrets' | 'sample' {
  const explicit = process.env.MLS_PROVIDER as ReturnType<typeof pickProvider> | undefined;
  if (explicit) return explicit;
  if (process.env.MLSGRID_TOKEN) return 'mlsgrid';
  if (process.env.BRIDGE_ACCESS_TOKEN && process.env.BRIDGE_DATASET) return 'bridge';
  if (process.env.SIMPLYRETS_USER && process.env.SIMPLYRETS_PASSWORD) return 'simplyrets';
  return 'sample';
}

export async function getListings(q: ListingQuery): Promise<ListingResult> {
  const provider = pickProvider();
  try {
    switch (provider) {
      case 'mlsgrid': return await fetchMlsGrid(q);
      case 'bridge': return await fetchBridge(q);
      case 'simplyrets': return await fetchSimplyRets(q);
      default: return fetchSample(q);
    }
  } catch (err) {
    // A feed outage must never take the site down, and must never silently
    // masquerade as "no homes match your search".
    console.error('[mls] provider failed, falling back to sample data:', err);
    const fallback = fetchSample(q);
    return {
      ...fallback,
      notice:
        'The live MLS feed could not be reached just now, so illustrative sample records are shown instead. These are not real listings. Please try again shortly.',
    };
  }
}

export async function getListingById(id: string): Promise<import('./types').Listing | null> {
  const res = await getListings({ limit: 200 });
  return res.listings.find((l) => l.id === id) ?? null;
}

export const isMlsConfigured = () => pickProvider() !== 'sample';
